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

function compactWorkbook(body) {
  const workbook = body.workbook || {};
  const cells = Array.isArray(workbook.cells) ? workbook.cells : [];
  return {
    fileName: String(workbook.fileName || "Imported 2YIP").slice(0, 160),
    sheetName: String(workbook.sheetName || "Sheet1").slice(0, 120),
    cells: cells.slice(0, 900).map((cell) => ({
      address: String(cell.address || ""),
      row: Number(cell.row) || 0,
      col: Number(cell.col) || 0,
      value: String(cell.value || "").slice(0, 700),
    })),
    merges: Array.isArray(workbook.merges) ? workbook.merges.slice(0, 140) : [],
  };
}

function rowSchemaValue() {
  return { type: "number", description: "1-based spreadsheet row number. Use 0 only if unknown." };
}

function rowSchemaArray() {
  return {
    type: "array",
    minItems: 0,
    maxItems: 12,
    items: rowSchemaValue(),
    description: "1-based spreadsheet row numbers. Return an empty array if unknown.",
  };
}

function templateDetectionSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["rows", "warnings"],
    properties: {
      rows: {
        type: "object",
        additionalProperties: false,
        required: [
          "sec",
          "duration",
          "title",
          "artTask",
          "bigIdeas",
          "learningOutcomes",
          "media",
          "artisticProcesses",
          "visualQualities",
          "context",
          "drawingCore",
          "portfolioCore",
          "electiveLearning",
          "pedagogy",
          "pedagogyOther",
          "assessmentType",
          "assessmentPercent",
          "assessmentCriteria",
          "lessonOutlines",
        ],
        properties: {
          sec: rowSchemaValue(),
          duration: rowSchemaValue(),
          title: rowSchemaValue(),
          artTask: rowSchemaValue(),
          bigIdeas: rowSchemaArray(),
          learningOutcomes: rowSchemaArray(),
          media: rowSchemaValue(),
          artisticProcesses: rowSchemaValue(),
          visualQualities: rowSchemaValue(),
          context: rowSchemaValue(),
          drawingCore: rowSchemaArray(),
          portfolioCore: rowSchemaArray(),
          electiveLearning: rowSchemaValue(),
          pedagogy: rowSchemaArray(),
          pedagogyOther: rowSchemaValue(),
          assessmentType: rowSchemaValue(),
          assessmentPercent: rowSchemaValue(),
          assessmentCriteria: rowSchemaValue(),
          lessonOutlines: rowSchemaArray(),
        },
      },
      warnings: {
        type: "array",
        minItems: 0,
        maxItems: 8,
        items: { type: "string", maxLength: 160 },
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
      throw Object.assign(new Error("AI template detection response was cut off. Try again, or use Standard template import."), { status: 502 });
    }
    throw Object.assign(new Error(`AI returned unreadable template detection JSON: ${error.message}`), { status: 502 });
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
      temperature: 0,
      max_completion_tokens: 2500,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "weave_2yip_template_detection",
          strict: true,
          schema: templateDetectionSchema(),
        },
      },
      messages: [
        {
          role: "system",
          content: [
            "You detect the row structure of an uploaded 2YIP spreadsheet for Weave.",
            "Return row numbers only. Do not map curriculum cards, do not infer Big Ideas, and do not create unit data.",
            "The app will run deterministic mapping after your row detection.",
            "Prefer explicit row headers and labels over content guesses.",
            "Unit slots are still arranged across columns. Detect only which rows contain each field.",
            "The title row contains unit titles. The artTask row contains performance task, art task, or evidence of learning.",
            "Big Ideas rows contain official Big Idea labels or checkbox-style Big Idea choices.",
            "Learning Outcomes rows contain LO codes, Learning Outcome numbers, or official LO wording.",
            "Drawing core experience rows are near a Core Learning Experience / drawing / making thinking visible label and contain Observe, Think, or Imagine.",
            "Portfolio core experience rows are near a Core Learning Experience / portfolio label and contain Document, Curate, Reflect, or (Re)present.",
            "Pedagogy rows contain pedagogy checkboxes such as Inquiry Based Learning, Differentiated Instruction, DI, E-Pedagogy, or similar pedagogy labels.",
            "Assessment rows contain assessment weighting, percentage, or criteria notes.",
            "Lesson outline rows contain explicit lesson-by-lesson or week-by-week lesson description text. Return these rows only when there are clear lesson cues such as Lesson 1, Lesson 2, Week 1, or separated numbered lesson entries.",
            "If a role is unclear, return 0 or an empty array and add a short warning.",
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
    throw Object.assign(new Error(data.error?.message || "AI-assisted template detection failed."), { status: response.status });
  }
  const text = extractJsonText(data);
  if (!text) throw new Error("AI returned an empty template detection.");
  return parseOpenAiJson(text);
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Use POST to detect import template rows." });
    return;
  }
  try {
    await verifyFirebaseToken(req.headers.authorization);
    const context = { workbook: compactWorkbook(requestBody(req)) };
    if (!context.workbook.cells.length) {
      json(res, 400, { error: "No readable spreadsheet text was found." });
      return;
    }
    const result = await callOpenAI(context);
    json(res, 200, {
      rows: result.rows || {},
      warnings: Array.isArray(result.warnings) ? result.warnings : [],
    });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, { error: error.message || "Could not detect import template rows." });
  }
};
