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
  return { uid: payload.sub, email: payload.email || "", name: payload.name || "" };
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

function compactUnitFields(body) {
  return (Array.isArray(body.units) ? body.units : [])
    .slice(0, 10)
    .map((unit) => ({
      slotIndex: Number(unit.slotIndex) || 0,
      title: String(unit.title || "").slice(0, 160),
      lessonCount: Math.max(1, Math.min(40, Math.trunc(Number(unit.lessonCount)) || 1)),
      lessonOutlineText: String(unit.lessonOutlineText || "").slice(0, 3500),
      fields: (Array.isArray(unit.fields) ? unit.fields : [])
        .slice(0, 16)
        .map((field) => ({
          field: String(field.field || "").slice(0, 80),
          type: String(field.type || "").slice(0, 80),
          text: String(field.text || "").slice(0, 900),
          allowedLabels: (Array.isArray(field.allowedLabels) ? field.allowedLabels : [])
            .map((label) => String(label || "").slice(0, 180))
            .filter(Boolean)
            .slice(0, 80),
        }))
        .filter((field) => field.type && field.text && field.allowedLabels.length),
    }))
    .filter((unit) => unit.slotIndex && (unit.fields.length || unit.lessonOutlineText));
}

function gapSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["units"],
    properties: {
      units: {
        type: "array",
        minItems: 0,
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["slotIndex", "cards", "lessonOutlines", "warnings"],
          properties: {
            slotIndex: { type: "number" },
            cards: {
              type: "array",
              minItems: 0,
              maxItems: 24,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["type", "label", "value", "reason"],
                properties: {
                  type: { type: "string" },
                  label: { type: "string" },
                  value: { type: "string" },
                  reason: { type: "string" },
                },
              },
            },
            lessonOutlines: {
              type: "array",
              minItems: 0,
              maxItems: 40,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["lessonNumber", "description"],
                properties: {
                  lessonNumber: { type: "number" },
                  description: { type: "string" },
                },
              },
            },
            warnings: {
              type: "array",
              minItems: 0,
              maxItems: 8,
              items: { type: "string" },
            },
          },
        },
      },
    },
  };
}

function extractJsonText(data) {
  return data?.choices?.[0]?.message?.content || "";
}

function parseOpenAiJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (/unterminated string|unexpected end/i.test(error.message || "")) {
      throw Object.assign(new Error("AI suggestions were cut off. Try again, or continue with the deterministic preview."), { status: 502 });
    }
    throw Object.assign(new Error(`AI returned unreadable suggestion JSON: ${error.message}`), { status: 502 });
  }
}

async function suggestGaps(context) {
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
      temperature: 0,
      max_completion_tokens: 3500,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "weave_import_gap_suggestions",
          strict: true,
          schema: gapSchema(),
        },
      },
      messages: [
        {
          role: "system",
          content: [
            "You suggest Weave curriculum cards only for unresolved 2YIP import fields.",
            "The deterministic importer has already inserted confirmed cards. Do not override or contradict it.",
            "Use only labels from each field's allowedLabels. Do not invent card labels.",
            "Suggest a card only when the field text strongly supports that exact card.",
            "If evidence is weak, return no card and add a short warning.",
            "Do not suggest Big Ideas or Learning Outcomes; those must be deterministic only.",
            "For core learning experiences, use the text in that field only.",
            "For Pedagogy, DI, D.I., and Differentiated Instruction all mean Differentiated Instruction (DI).",
            "Stretch goal: if lessonOutlineText contains explicit lesson-by-lesson or week-by-week descriptions for the unit, return lessonOutlines with lessonNumber and description.",
            "Only use clear lesson cues such as Lesson 1/Lesson 2 headings, L1/L2, Week 1/Week 2, or visibly separated numbered lesson entries.",
            "Do not split a general unit task, theme, teaching focus, assessment note, or performance task into lessonOutlines.",
            "Do not use lessonOutlineText to suggest cards.",
            "Keep value empty unless the field is a free-text card.",
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
    throw Object.assign(new Error(data.error?.message || "AI gap suggestions failed."), { status: response.status });
  }
  const text = extractJsonText(data);
  if (!text) throw new Error("AI returned empty suggestions.");
  return parseOpenAiJson(text);
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Use POST to suggest import gaps." });
    return;
  }
  try {
    await verifyFirebaseToken(req.headers.authorization);
    const body = requestBody(req);
    const units = compactUnitFields(body);
    if (!units.length) {
      json(res, 200, { units: [] });
      return;
    }
    const result = await suggestGaps({ units });
    json(res, 200, { units: Array.isArray(result.units) ? result.units : [] });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, { error: error.message || "Could not suggest import gaps." });
  }
};
