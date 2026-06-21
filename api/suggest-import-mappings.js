const crypto = require("crypto");

const TOKEN_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const DEFAULT_MODEL = process.env.OPENAI_IMPORT_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

function json(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function base64urlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Buffer.from(padded, "base64");
}

async function firebaseCerts() {
  const now = Date.now();
  if (global.firebaseCertCache?.expiresAt > now) return global.firebaseCertCache.certs;
  const response = await fetch(TOKEN_CERTS_URL);
  if (!response.ok) throw new Error("Could not load Firebase token certificates.");
  const certs = await response.json();
  const cacheControl = response.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 60 * 60 * 1000;
  global.firebaseCertCache = { certs, expiresAt: now + maxAgeMs };
  return certs;
}

async function verifyFirebaseToken(authHeader) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw Object.assign(new Error("Server is missing FIREBASE_PROJECT_ID."), { status: 500 });
  const token = String(authHeader || "").replace(/^Bearer\s+/i, "");
  if (!token) throw Object.assign(new Error("Missing sign-in token."), { status: 401 });
  const parts = token.split(".");
  if (parts.length !== 3) throw Object.assign(new Error("Invalid sign-in token."), { status: 401 });
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = JSON.parse(base64urlDecode(encodedHeader).toString("utf8"));
  const payload = JSON.parse(base64urlDecode(encodedPayload).toString("utf8"));
  const certs = await firebaseCerts();
  const cert = certs[header.kid];
  if (!cert) throw Object.assign(new Error("Unknown sign-in certificate."), { status: 401 });
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();
  const valid = verifier.verify(cert, base64urlDecode(encodedSignature));
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (!valid || payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}` || payload.exp < nowSeconds) {
    throw Object.assign(new Error("Sign-in token could not be verified."), { status: 401 });
  }
  return {
    uid: payload.sub,
    email: payload.email || "",
    name: payload.name || "",
  };
}

function requestBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function importMappingSchema() {
  const cardTypes = [
    "bigIdeas",
    "learningOutcomes",
    "media",
    "context",
    "artisticProcesses",
    "visualQualities",
    "coreExperiences",
    "learningExperienceText",
    "pedagogy",
    "assessment",
  ];
  return {
    type: "object",
    additionalProperties: false,
    required: ["planTitle", "units"],
    properties: {
      planTitle: { type: "string" },
      units: {
        type: "array",
        minItems: 0,
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "slotIndex",
            "title",
            "artTask",
            "year",
            "startTerm",
            "startWeek",
            "endTerm",
            "endWeek",
            "lessonCount",
            "cards",
            "assessment",
            "warnings",
          ],
          properties: {
            slotIndex: { type: "number" },
            title: { type: "string", maxLength: 140 },
            artTask: { type: "string", maxLength: 700 },
            year: { type: "number" },
            startTerm: { type: "number" },
            startWeek: { type: "number" },
            endTerm: { type: "number" },
            endWeek: { type: "number" },
            lessonCount: { type: "number" },
            cards: {
              type: "array",
              minItems: 0,
              maxItems: 24,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["type", "label", "value", "reason"],
                properties: {
                  type: { type: "string", enum: cardTypes },
                  label: { type: "string", maxLength: 180 },
                  value: { type: "string", maxLength: 900 },
                  reason: { type: "string", maxLength: 120 },
                },
              },
            },
            assessment: {
              type: "object",
              additionalProperties: false,
              required: ["title", "type", "evidence", "weighted", "weightedNote"],
              properties: {
                title: { type: "string", maxLength: 140 },
                type: { type: "string", maxLength: 80 },
                evidence: { type: "string", maxLength: 800 },
                weighted: { type: "boolean" },
                weightedNote: { type: "string", maxLength: 120 },
              },
            },
            warnings: {
              type: "array",
              minItems: 0,
              maxItems: 8,
              items: { type: "string", maxLength: 180 },
            },
          },
        },
      },
    },
  };
}

function compactWorkbook(body) {
  const workbook = body.workbook || {};
  const cells = Array.isArray(workbook.cells) ? workbook.cells : [];
  return {
    fileName: String(workbook.fileName || "Imported 2YIP").slice(0, 160),
    sheetName: String(workbook.sheetName || "Sheet1").slice(0, 120),
    cells: cells.slice(0, 700).map((cell) => ({
      address: String(cell.address || ""),
      row: Number(cell.row) || 0,
      col: Number(cell.col) || 0,
      value: String(cell.value || "").slice(0, 700),
    })),
    merges: Array.isArray(workbook.merges) ? workbook.merges.slice(0, 120) : [],
  };
}

function compactAllowedCards(body) {
  const allowed = body.allowedCards || {};
  return Object.fromEntries(
    Object.entries(allowed).map(([type, labels]) => [
      type,
      Array.isArray(labels) ? labels.map((label) => String(label)).filter(Boolean) : [],
    ]),
  );
}

function extractJsonText(data) {
  return data?.choices?.[0]?.message?.content || "";
}

function parseOpenAiJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (/unterminated string|unexpected end/i.test(error.message || "")) {
      throw Object.assign(new Error("AI mapping response was cut off. Try again, or use Standard template import for this file."), { status: 502 });
    }
    throw Object.assign(new Error(`AI returned unreadable mapping JSON: ${error.message}`), { status: 502 });
  }
}

async function callOpenAI(context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw Object.assign(new Error("Server is missing OPENAI_API_KEY."), { status: 500 });
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.1,
      max_completion_tokens: 9000,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "weave_2yip_import_mapping",
          strict: true,
          schema: importMappingSchema(),
        },
      },
      messages: [
        {
          role: "system",
          content: [
            "You map uploaded 2YIP spreadsheet text into Weave curriculum planning data.",
            "Detect real lower secondary art units, their Sec/Term/Week placement, lesson duration, performance task, and planning cards.",
            "Use only labels from allowedCards. Do not invent card labels.",
            "If a field is ambiguous, leave it empty and add a concise warning.",
            "For context or elective learning experience free text, use the matching card label and put the teacher text in value.",
            "Keep every string concise. Reasons and warnings must be one short phrase.",
            "Do not create detailed lesson activities.",
            "Return structured JSON only.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify(context),
        },
      ],
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data.error?.message || "AI-assisted mapping failed."), { status: response.status });
  }
  const text = extractJsonText(data);
  if (!text) throw new Error("AI returned an empty mapping.");
  return parseOpenAiJson(text);
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Use POST to suggest import mappings." });
    return;
  }
  try {
    await verifyFirebaseToken(req.headers.authorization);
    const body = requestBody(req);
    const context = {
      workbook: compactWorkbook(body),
      allowedCards: compactAllowedCards(body),
    };
    if (!context.workbook.cells.length) {
      json(res, 400, { error: "No readable spreadsheet text was found." });
      return;
    }
    const result = await callOpenAI(context);
    json(res, 200, {
      planTitle: result.planTitle || "",
      units: Array.isArray(result.units) ? result.units : [],
    });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, { error: error.message || "Could not suggest import mappings." });
  }
};
