const crypto = require("crypto");

const TOKEN_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const DEFAULT_MODEL = process.env.OPENAI_IMPORT_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
const TERM_WEEK_COUNT = 10;

const STANDARD_ROWS = {
  sec: 1,
  duration: 2,
  title: 7,
  artTask: 8,
  bigIdeas: [9, 10, 11],
  learningOutcomes: [12, 13, 14, 15, 16, 17],
  media: 18,
  artisticProcesses: 19,
  visualQualities: 20,
  context: 21,
  drawingCore: [23, 24, 25, 26],
  portfolioCore: [28, 29, 30, 31],
  electiveLearning: 32,
  pedagogy: [33, 34, 35, 36],
  pedagogyOther: 37,
  assessmentType: 38,
  assessmentPercent: 39,
  assessmentCriteria: 40,
  lessonOutlines: [],
};

const UNIT_SLOTS = Array.from({ length: 10 }, (_, index) => ({
  index: index + 1,
  col: 4 + index * 2,
}));

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

function compactWorkbook(body) {
  const workbook = body.workbook || {};
  const cells = Array.isArray(workbook.cells) ? workbook.cells : [];
  return {
    fileName: String(workbook.fileName || "Imported 2YIP").slice(0, 160),
    sheetName: String(workbook.sheetName || "Sheet1").slice(0, 120),
    cells: cells.slice(0, 1000).map((cell) => ({
      address: String(cell.address || ""),
      row: Number(cell.row) || 0,
      col: Number(cell.col) || 0,
      value: String(cell.value || "").slice(0, 700),
    })),
    merges: Array.isArray(workbook.merges) ? workbook.merges.slice(0, 140) : [],
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

function rowSchemaValue() {
  return { type: "number", description: "1-based spreadsheet row number. Use 0 only if unknown." };
}

function rowSchemaArray(maxItems = 12) {
  return {
    type: "array",
    minItems: 0,
    maxItems,
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
          lessonOutlines: rowSchemaArray(20),
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

function boundedMappingSchema() {
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
    required: ["units"],
    properties: {
      units: {
        type: "array",
        minItems: 0,
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["slotIndex", "cards", "assessment", "lessonOutlines", "warnings"],
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
                  description: { type: "string", maxLength: 900 },
                },
              },
            },
            warnings: {
              type: "array",
              minItems: 0,
              maxItems: 8,
              items: { type: "string", maxLength: 160 },
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

function parseOpenAiJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (/unterminated string|unexpected end/i.test(error.message || "")) {
      throw Object.assign(new Error(`${label} response was cut off. Try again, or use Standard template import.`), { status: 502 });
    }
    throw Object.assign(new Error(`AI returned unreadable ${label} JSON: ${error.message}`), { status: 502 });
  }
}

async function callOpenAI({ context, schema, schemaName, systemPrompt, maxTokens }) {
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
      max_completion_tokens: maxTokens,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          strict: true,
          schema,
        },
      },
      messages: [
        { role: "system", content: systemPrompt.join(" ") },
        { role: "user", content: JSON.stringify(context) },
      ],
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data.error?.message || "AI row-bound import failed."), { status: response.status });
  }
  const text = extractJsonText(data);
  if (!text) throw new Error("AI returned an empty response.");
  return parseOpenAiJson(text, schemaName);
}

function rowNumber(value, fallback = 0) {
  const row = Math.trunc(Number(value));
  return row > 0 ? row : fallback;
}

function rowNumbers(value, fallback = []) {
  const rows = Array.isArray(value)
    ? value.map((row) => Math.trunc(Number(row))).filter((row) => row > 0)
    : [];
  return rows.length ? [...new Set(rows)].sort((a, b) => a - b) : fallback;
}

function normaliseRows(rows = {}) {
  return {
    sec: rowNumber(rows.sec, STANDARD_ROWS.sec),
    duration: rowNumber(rows.duration, STANDARD_ROWS.duration),
    title: rowNumber(rows.title, STANDARD_ROWS.title),
    artTask: rowNumber(rows.artTask, STANDARD_ROWS.artTask),
    bigIdeas: rowNumbers(rows.bigIdeas),
    learningOutcomes: rowNumbers(rows.learningOutcomes),
    media: rowNumber(rows.media),
    artisticProcesses: rowNumber(rows.artisticProcesses),
    visualQualities: rowNumber(rows.visualQualities),
    context: rowNumber(rows.context),
    drawingCore: rowNumbers(rows.drawingCore),
    portfolioCore: rowNumbers(rows.portfolioCore),
    electiveLearning: rowNumber(rows.electiveLearning),
    pedagogy: rowNumbers(rows.pedagogy),
    pedagogyOther: rowNumber(rows.pedagogyOther),
    assessmentType: rowNumber(rows.assessmentType),
    assessmentPercent: rowNumber(rows.assessmentPercent),
    assessmentCriteria: rowNumber(rows.assessmentCriteria),
    lessonOutlines: rowNumbers(rows.lessonOutlines),
  };
}

function cleanText(value) {
  const text = String(value || "").replace(/\r/g, "\n").replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n").trim();
  if (!text) return "";
  const compact = text.replace(/\s+/g, " ").trim();
  if (/^(x+|n\/a|nil|none|-+)$/i.test(compact)) return "";
  if (/^if others?:?\s*\(?please state\)?$/i.test(compact)) return "";
  if (/^t\s*x\s*w\s*x\s*-\s*t\s*x\s*w\s*x$/i.test(compact)) return "";
  return text;
}

function cellText(cells, row, col) {
  const cell = cells.find((candidate) => Number(candidate.row) === row && Number(candidate.col) === col);
  return cleanText(cell?.value);
}

function rowPairText(cells, row, col) {
  if (!row) return "";
  return [cellText(cells, row, col), cellText(cells, row, col + 1)].filter(Boolean).join("\n");
}

function rowsPairText(cells, rows, col) {
  return (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const text = rowPairText(cells, row, col);
      return text ? `Row ${row}: ${text}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function parsePlacement(secRaw, durationRaw, warnings) {
  const combined = `${secRaw || ""} ${durationRaw || ""}`;
  const secMatch = combined.match(/sec(?:ondary)?\s*([12])/i);
  const year = Number(secMatch?.[1] || 0);
  const weekMatches = [...combined.matchAll(/T\s*(\d+)\s*W\s*(\d+)/gi)]
    .map((match) => ({ term: Number(match[1]), week: Number(match[2]) }))
    .filter((match) => match.term >= 1 && match.term <= 4 && match.week >= 1 && match.week <= 10);
  const lessonCountGuess = Number((combined.match(/(\d+)\s*(?:lesson|week)s?/i) || [])[1]) || 1;
  if (!year || !weekMatches.length) {
    warnings.push("Placement needs review.");
    return { year: 0, startTerm: 0, startWeek: 0, endTerm: 0, endWeek: 0, lessonCount: Math.max(1, lessonCountGuess) };
  }
  const start = weekMatches[0];
  const end = weekMatches[1] || start;
  const startLocal = (start.term - 1) * TERM_WEEK_COUNT + start.week;
  const endLocal = (end.term - 1) * TERM_WEEK_COUNT + end.week;
  if (endLocal < startLocal) warnings.push("Placement end before start.");
  return {
    year,
    startTerm: start.term,
    startWeek: start.week,
    endTerm: end.term,
    endWeek: end.week,
    lessonCount: Math.max(1, endLocal >= startLocal ? endLocal - startLocal + 1 : lessonCountGuess),
  };
}

function buildEvidencePackets(workbook, rows) {
  const cells = Array.isArray(workbook.cells) ? workbook.cells : [];
  return UNIT_SLOTS.map((slot) => {
    const warnings = [];
    const secText = rowPairText(cells, rows.sec, slot.col);
    const durationText = rowPairText(cells, rows.duration, slot.col);
    const placement = parsePlacement(secText, durationText, warnings);
    const packet = {
      slotIndex: slot.index,
      unitColumnPair: `${slot.col}:${slot.col + 1}`,
      title: rowPairText(cells, rows.title, slot.col),
      artTask: rowPairText(cells, rows.artTask, slot.col),
      year: placement.year,
      startTerm: placement.startTerm,
      startWeek: placement.startWeek,
      endTerm: placement.endTerm,
      endWeek: placement.endWeek,
      lessonCount: placement.lessonCount,
      evidence: {
        bigIdeas: rowsPairText(cells, rows.bigIdeas, slot.col),
        learningOutcomes: rowsPairText(cells, rows.learningOutcomes, slot.col),
        media: rowPairText(cells, rows.media, slot.col),
        artisticProcesses: rowPairText(cells, rows.artisticProcesses, slot.col),
        visualQualities: rowPairText(cells, rows.visualQualities, slot.col),
        context: rowPairText(cells, rows.context, slot.col),
        drawingCore: rowsPairText(cells, rows.drawingCore, slot.col),
        portfolioCore: rowsPairText(cells, rows.portfolioCore, slot.col),
        electiveLearning: rowPairText(cells, rows.electiveLearning, slot.col),
        pedagogy: rowsPairText(cells, rows.pedagogy, slot.col),
        pedagogyOther: rowPairText(cells, rows.pedagogyOther, slot.col),
        assessmentType: rowPairText(cells, rows.assessmentType, slot.col),
        assessmentPercent: rowPairText(cells, rows.assessmentPercent, slot.col),
        assessmentCriteria: rowPairText(cells, rows.assessmentCriteria, slot.col),
        lessonOutlines: rowsPairText(cells, rows.lessonOutlines, slot.col),
      },
      warnings,
    };
    const hasRealContent = [
      packet.title,
      packet.artTask,
      ...Object.values(packet.evidence),
    ].some(Boolean);
    return hasRealContent ? packet : null;
  }).filter(Boolean);
}

function normaliseSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function allowedLabels(allowedCards, type) {
  return Array.isArray(allowedCards?.[type]) ? allowedCards[type] : [];
}

function canonicalLabel(allowedCards, type, label) {
  const labels = allowedLabels(allowedCards, type);
  const text = normaliseSearchText(label);
  if (!text) return "";
  const exact = labels.find((allowed) => normaliseSearchText(allowed) === text);
  if (exact) return exact;
  if (type === "learningOutcomes") {
    const code = text.match(/\blo\s*0?([1-6])\b/)?.[1];
    if (code) return labels.find((allowed) => normaliseSearchText(allowed).startsWith(`lo${code}:`)) || "";
  }
  if (type === "artisticProcesses") {
    const code = text.match(/\bap\s*([1-4])\b/)?.[1];
    if (code) return labels.find((allowed) => normaliseSearchText(allowed).startsWith(`ap${code}:`)) || "";
  }
  if (type === "pedagogy" && /^(di|d\.i\.|differentiated instruction)$/i.test(String(label || "").trim())) {
    return labels.find((allowed) => /differentiated instruction/i.test(allowed)) || "";
  }
  return "";
}

function bigIdeaTrigger(label) {
  const text = normaliseSearchText(label);
  if (text === "art helps us to see in new ways.") return /\b(art helps us to see in new ways|see in new ways)\b/i;
  if (text === "art tells stories about our world.") return /\b(art tells stories about our world|tells stories about our world|stories about our world)\b/i;
  if (text === "art influences the way we live.") return /\b(art influences (the way|how) we live|influences (the way|how) we live)\b/i;
  return null;
}

function learningOutcomeTrigger(label) {
  const text = normaliseSearchText(label);
  const code = Number(text.match(/\blo\s*0?([1-6])\b/)?.[1] || 0);
  const phrases = {
    1: [/gather,\s*record\s*and\s*present/i, /observations\s*and\s*personal\s*experiences/i],
    2: [/make\s*connections\s*to\s*generate/i, /generate\s*ideas\s*and\s*visuals/i],
    3: [/explore\s*and\s*experiment/i, /materials\s*and\s*techniques/i],
    4: [/develop\s*personally\s*relevant\s*works/i, /aesthetic\s*qualities\s*and\s*social\s*and\s*cultural\s*awareness/i],
    5: [/reflect,\s*connect\s*and\s*share/i, /own\s*and\s*others'? works\s*of\s*art/i],
    6: [/value\s*art\s*as\s*an\s*avenue/i, /self-discovery\s*and\s*(?:for\s*)?understanding\s*the\s*world/i],
  };
  if (!code) return null;
  return {
    codePattern: new RegExp(`\\b(?:lo|l\\.?\\s*o\\.?|learning\\s+outcomes?)\\s*0?${code}\\b`, "i"),
    phrasePatterns: phrases[code] || [],
  };
}

function coreExperienceTrigger(label) {
  const text = normaliseSearchText(label);
  if (text === "drawing: observe") return { field: "drawingCore", pattern: /\bobserve\b/i };
  if (text === "drawing: think") return { field: "drawingCore", pattern: /\bthink\b/i };
  if (text === "drawing: imagine") return { field: "drawingCore", pattern: /\bimagine\b/i };
  if (text === "portfolio: document") return { field: "portfolioCore", pattern: /\bdocument\b/i };
  if (text === "portfolio: curate") return { field: "portfolioCore", pattern: /\bcurate\b/i };
  if (text === "portfolio: reflect") return { field: "portfolioCore", pattern: /\breflect\b/i };
  if (text === "portfolio: (re)present") {
    return { field: "portfolioCore", pattern: /(^|[\s:;,\-\/])(represent|presentation|re\s*-?\s*present|\(?\s*re\s*\)?\s*present)(?=$|[\s:;,\-\/.])/i };
  }
  return null;
}

function boundedCoreExperienceLabels(packet, allowedCards) {
  const labels = [];
  const add = (label) => {
    const canonical = canonicalLabel(allowedCards, "coreExperiences", label);
    if (canonical && !labels.includes(canonical)) labels.push(canonical);
  };
  const drawing = packet.evidence?.drawingCore || "";
  const portfolio = packet.evidence?.portfolioCore || "";
  if (/\bobserve\b/i.test(drawing)) add("Drawing: Observe");
  if (/\bthink\b/i.test(drawing)) add("Drawing: Think");
  if (/\bimagine\b/i.test(drawing)) add("Drawing: Imagine");
  if (/\bdocument\b/i.test(portfolio)) add("Portfolio: Document");
  if (/\bcurate\b/i.test(portfolio)) add("Portfolio: Curate");
  if (/\breflect\b/i.test(portfolio)) add("Portfolio: Reflect");
  if (/(^|[\s:;,\-\/])(represent|presentation|re\s*-?\s*present|\(?\s*re\s*\)?\s*present)(?=$|[\s:;,\-\/.])/i.test(portfolio)) {
    add("Portfolio: (Re)present");
  }
  return labels;
}

function evidenceSupportsCard(packet, card) {
  const evidence = packet.evidence || {};
  if (card.type === "bigIdeas") {
    const trigger = bigIdeaTrigger(card.label);
    return trigger ? trigger.test(evidence.bigIdeas || "") : false;
  }
  if (card.type === "learningOutcomes") {
    const trigger = learningOutcomeTrigger(card.label);
    if (!trigger) return false;
    const text = evidence.learningOutcomes || "";
    return trigger.codePattern.test(text) || trigger.phrasePatterns.some((pattern) => pattern.test(text));
  }
  if (card.type === "artisticProcesses") {
    const text = evidence.artisticProcesses || "";
    const code = normaliseSearchText(card.label).match(/\bap\s*([1-4])\b/)?.[1];
    return Boolean(code && new RegExp(`\\b(?:ap|artistic\\s+process)\\s*${code}\\b`, "i").test(text))
      || normaliseSearchText(text).includes(normaliseSearchText(card.label).slice(0, 28));
  }
  if (card.type === "coreExperiences") {
    const trigger = coreExperienceTrigger(card.label);
    return trigger ? trigger.pattern.test(evidence[trigger.field] || "") : false;
  }
  if (card.type === "media") return Boolean(evidence.media);
  if (card.type === "context") return Boolean(evidence.context);
  if (card.type === "visualQualities") return Boolean(evidence.visualQualities);
  if (card.type === "learningExperienceText") return Boolean(evidence.electiveLearning);
  if (card.type === "pedagogy") return Boolean(`${evidence.pedagogy || ""} ${evidence.pedagogyOther || ""}`.trim());
  if (card.type === "assessment") return Boolean(`${evidence.assessmentType || ""} ${evidence.assessmentPercent || ""} ${evidence.assessmentCriteria || ""}`.trim());
  return false;
}

function validateCards(cards, packet, allowedCards) {
  const seen = new Set();
  const warnings = [];
  const validCards = [];
  (Array.isArray(cards) ? cards : []).forEach((card) => {
    const type = card?.type;
    const label = canonicalLabel(allowedCards, type, card?.label);
    if (!type || !label) return;
    const key = `${type}::${normaliseSearchText(label)}::${normaliseSearchText(card.value)}`;
    if (seen.has(key)) return;
    if (!evidenceSupportsCard(packet, { ...card, type, label })) {
      warnings.push(`${label} needs review: bounded evidence not found.`);
      return;
    }
    seen.add(key);
    validCards.push({
      type,
      label,
      value: cleanText(card.value),
      reason: cleanText(card.reason) || "Mapped from bounded row evidence",
    });
  });
  return { cards: validCards, warnings };
}

function validateAssessment(assessment, packet, allowedCards) {
  const type = canonicalLabel(allowedCards, "assessment", assessment?.type);
  if (!type) {
    return { title: "", type: "", evidence: "", weighted: false, weightedNote: "" };
  }
  const assessmentEvidence = `${packet.evidence.assessmentType || ""}\n${packet.evidence.assessmentPercent || ""}\n${packet.evidence.assessmentCriteria || ""}`;
  return {
    title: cleanText(assessment?.title) || `${packet.title} Assessment`,
    type,
    evidence: cleanText(assessment?.evidence) || cleanText(packet.evidence.assessmentCriteria) || "",
    weighted: Boolean(assessment?.weighted) || /weighted|exam|\d+\s*%/i.test(assessmentEvidence),
    weightedNote: cleanText(assessment?.weightedNote) || cleanText(packet.evidence.assessmentPercent),
  };
}

function validateLessonOutlines(outlines, packet) {
  if (!packet.evidence.lessonOutlines) return [];
  return (Array.isArray(outlines) ? outlines : [])
    .map((outline) => ({
      lessonNumber: Math.trunc(Number(outline?.lessonNumber)),
      description: cleanText(outline?.description),
    }))
    .filter((outline) => outline.lessonNumber >= 1 && outline.lessonNumber <= packet.lessonCount && outline.description);
}

function assembleUnits(packets, mappingResult, allowedCards) {
  const mappedBySlot = new Map((Array.isArray(mappingResult?.units) ? mappingResult.units : []).map((unit) => [Number(unit.slotIndex), unit]));
  return packets.map((packet) => {
    const mapped = mappedBySlot.get(packet.slotIndex) || {};
    const cardResult = validateCards(mapped.cards, packet, allowedCards);
    boundedCoreExperienceLabels(packet, allowedCards).forEach((label) => {
      const exists = cardResult.cards.some((card) => card.type === "coreExperiences" && card.label === label);
      if (!exists) {
        cardResult.cards.push({
          type: "coreExperiences",
          label,
          value: "",
          reason: "Read from bounded core learning experience evidence",
        });
      }
    });
    return {
      slotIndex: packet.slotIndex,
      title: cleanText(packet.title) || `Imported Unit ${packet.slotIndex}`,
      artTask: packet.artTask,
      year: packet.year,
      startTerm: packet.startTerm,
      startWeek: packet.startWeek,
      endTerm: packet.endTerm,
      endWeek: packet.endWeek,
      lessonCount: packet.lessonCount,
      lessonOutlines: validateLessonOutlines(mapped.lessonOutlines, packet),
      cards: cardResult.cards,
      assessment: validateAssessment(mapped.assessment, packet, allowedCards),
      warnings: [
        ...packet.warnings,
        ...cardResult.warnings,
        ...(Array.isArray(mapped.warnings) ? mapped.warnings.map(cleanText).filter(Boolean) : []),
      ],
    };
  });
}

function detectRows(context) {
  return callOpenAI({
    context: {
      workbook: context.workbook,
      standardTemplateRows: STANDARD_ROWS,
    },
    schema: templateDetectionSchema(),
    schemaName: "weave_2yip_row_detection",
    maxTokens: 3000,
    systemPrompt: [
      "You detect the row structure of an uploaded 2YIP spreadsheet for Weave.",
      "Return row numbers only. Do not map curriculum cards, do not infer Big Ideas, and do not create unit data.",
      "If the workbook follows the official template, return the standard template rows provided in the user message.",
      "Prefer explicit row headers and labels over content guesses.",
      "Unit slots are still arranged across columns. Detect only which rows contain each field.",
      "Big Idea rows contain official Big Idea labels or checkbox-style Big Idea choices.",
      "Learning Outcome rows contain LO codes, Learning Outcome numbers, or official LO wording.",
      "Drawing core experience rows are near a Core Learning Experience / drawing / making thinking visible label and contain Observe, Think, or Imagine.",
      "Portfolio core experience rows are near a Core Learning Experience / portfolio label and contain Document, Curate, Reflect, or (Re)present.",
      "Lesson outline rows are only rows with explicit lesson-by-lesson cues.",
      "If a role is unclear, return 0 or an empty array and add a short warning.",
      "Return structured JSON only.",
    ],
  });
}

function mapBoundedEvidence(context) {
  return callOpenAI({
    context,
    schema: boundedMappingSchema(),
    schemaName: "weave_2yip_row_bound_mapping",
    maxTokens: 7000,
    systemPrompt: [
      "You map bounded 2YIP evidence packets into Weave curriculum cards.",
      "Your priority is reliability, not completeness. Missing mappings are better than wrong mappings.",
      "Use only labels from allowedCards. Do not invent card labels.",
      "Each unit contains category-specific evidence. You must map each card only from its matching evidence field.",
      "Big Ideas can only use evidence.bigIdeas. Do not infer Big Ideas from title, theme, performance task, or lesson outlines.",
      "Learning Outcomes can only use evidence.learningOutcomes. Do not infer LOs from lesson outlines, themes, unit titles, activity descriptions, or performance tasks.",
      "Artistic Processes can only use evidence.artisticProcesses.",
      "Drawing core experiences can only use evidence.drawingCore and the explicit words Observe, Think, or Imagine.",
      "Portfolio core experiences can only use evidence.portfolioCore and the explicit words Document, Curate, Reflect, or (Re)present/Re-present/Represent.",
      "Lesson outlines can only become lessonOutlines; they must not influence cards.",
      "For free-text areas, preserve teacher-entered text as value when the category is clear.",
      "For Pedagogy, DI, D.I., and Differentiated Instruction all mean Differentiated Instruction (DI).",
      "If evidence is weak or ambiguous, leave it unmapped and add one short warning.",
      "Return structured JSON only.",
    ],
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Use POST to run row-bound 2YIP import." });
    return;
  }
  try {
    await verifyFirebaseToken(req.headers.authorization);
    const body = requestBody(req);
    const workbook = compactWorkbook(body);
    const allowedCards = compactAllowedCards(body);
    if (!workbook.cells.length) {
      json(res, 400, { error: "No readable spreadsheet text was found." });
      return;
    }
    const detection = await detectRows({ workbook });
    const rows = normaliseRows(detection.rows || {});
    const units = buildEvidencePackets(workbook, rows);
    if (!units.length) {
      json(res, 200, {
        planTitle: `Row-Bound 2YIP - ${workbook.fileName.replace(/\.(xlsx|xls)$/i, "").replace(/[_-]+/g, " ")}`,
        units: [],
        warnings: ["No real unit evidence was found after row detection.", ...(detection.warnings || [])],
      });
      return;
    }
    const mapping = await mapBoundedEvidence({
      workbook: {
        fileName: workbook.fileName,
        sheetName: workbook.sheetName,
      },
      detectedRows: rows,
      allowedCards,
      units,
    });
    json(res, 200, {
      planTitle: `Row-Bound 2YIP - ${workbook.fileName.replace(/\.(xlsx|xls)$/i, "").replace(/[_-]+/g, " ")}`,
      units: assembleUnits(units, mapping, allowedCards),
      warnings: Array.isArray(detection.warnings) ? detection.warnings : [],
    });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, { error: error.message || "Could not run row-bound 2YIP import." });
  }
};
