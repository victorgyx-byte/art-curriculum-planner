const crypto = require("crypto");

const TOKEN_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const DEFAULT_MODEL = process.env.OPENAI_IMPORT_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
const CORE_EXPERIENCE_TEMPLATE_ROWS = {
  drawing: [23, 24, 25, 26],
  portfolio: [28, 29, 30, 31],
};

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
            "lessonOutlines",
            "cards",
            "assessment",
            "warnings",
          ],
          properties: {
            slotIndex: { type: "number" },
            title: {
              type: "string",
              maxLength: 140,
              description: "Exact unit title copied from the spreadsheet, with whitespace cleaned only.",
            },
            artTask: { type: "string", maxLength: 700 },
            year: { type: "number" },
            startTerm: { type: "number" },
            startWeek: { type: "number" },
            endTerm: { type: "number" },
            endWeek: { type: "number" },
            lessonCount: { type: "number" },
            lessonOutlines: {
              type: "array",
              minItems: 0,
              maxItems: 40,
              description: "Optional AI-assisted lesson description seeds. Use only when the spreadsheet has explicit lesson-by-lesson outline text.",
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

function normaliseSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function templateChecked(value) {
  if (value === true) return true;
  if (value === false || value === undefined || value === null) return false;
  const text = String(value).trim().toLowerCase();
  return ["true", "yes", "y", "x", "✓", "1", "checked"].includes(text);
}

function cellText(cells, row, col) {
  const cell = cells.find((candidate) => Number(candidate.row) === row && Number(candidate.col) === col);
  return String(cell?.value || "").trim();
}

function coreExperienceLabelFromText(area, value) {
  const text = normaliseSearchText(value);
  if (area === "drawing") {
    if (/\bobserve\b/.test(text)) return "Drawing: Observe";
    if (/\bthink\b/.test(text)) return "Drawing: Think";
    if (/\bimagine\b/.test(text)) return "Drawing: Imagine";
  }
  if (area === "portfolio") {
    if (/\bdocument\b/.test(text)) return "Portfolio: Document";
    if (/\bcurate\b/.test(text)) return "Portfolio: Curate";
    if (/\breflect\b/.test(text)) return "Portfolio: Reflect";
    if (/(^|[\s:;,\-\/])(represent|re\s*-?\s*present|\(?\s*re\s*\)?\s*present|re\s*\(?\s*represent\s*\)?)(?=$|[\s:;,\-\/.])/.test(text)) {
      return "Portfolio: (Re)present";
    }
  }
  return "";
}

function coreExperienceTrigger(label) {
  const normalised = normaliseSearchText(label);
  if (normalised === "drawing: observe") return { area: "drawing", pattern: /\bobserve\b/i };
  if (normalised === "drawing: think") return { area: "drawing", pattern: /\bthink\b/i };
  if (normalised === "drawing: imagine") return { area: "drawing", pattern: /\bimagine\b/i };
  if (normalised === "portfolio: document") return { area: "portfolio", pattern: /\bdocument\b/i };
  if (normalised === "portfolio: curate") return { area: "portfolio", pattern: /\bcurate\b/i };
  if (normalised === "portfolio: reflect") return { area: "portfolio", pattern: /\breflect\b/i };
  if (normalised === "portfolio: (re)present") {
    return {
      area: "portfolio",
      pattern: /(^|[\s:;,\-\/])(represent|re\s*-?\s*present|\(?\s*re\s*\)?\s*present|re\s*\(?\s*represent\s*\)?)(?=$|[\s:;,\-\/.])/i,
    };
  }
  return null;
}

function bigIdeaTrigger(label) {
  const normalised = normaliseSearchText(label);
  if (normalised === "art helps us to see in new ways.") {
    return /\b(art helps us to see in new ways|see in new ways)\b/i;
  }
  if (normalised === "art tells stories about our world.") {
    return /\b(art tells stories about our world|tells stories about our world|stories about our world)\b/i;
  }
  if (normalised === "art influences the way we live.") {
    return /\b(art influences (the way|how) we live|influences (the way|how) we live)\b/i;
  }
  return null;
}

function nearbyCellText(cells, target) {
  return cells
    .filter((cell) => Math.abs((Number(cell.row) || 0) - target.row) <= 3 && Math.abs((Number(cell.col) || 0) - target.col) <= 4)
    .map((cell) => cell.value)
    .join(" ");
}

function unitSlotColumns(unit) {
  const slotIndex = Number(unit?.slotIndex) || 0;
  if (slotIndex < 1 || slotIndex > 10) return [];
  const firstColumn = 4 + (slotIndex - 1) * 2;
  return [firstColumn, firstColumn + 1];
}

function unitRelevantText(workbook, unit) {
  const cells = Array.isArray(workbook?.cells) ? workbook.cells : [];
  const columns = unitSlotColumns(unit);
  const slotText = columns.length
    ? cells
      .filter((cell) => columns.includes(Number(cell.col) || 0) && (Number(cell.row) || 0) <= 45)
      .map((cell) => cell.value)
      .join(" ")
    : "";
  const title = normaliseSearchText(unit?.title);
  const titleText = title
    ? cells
      .filter((cell) => normaliseSearchText(cell.value).includes(title))
      .map((cell) => nearbyCellText(cells, cell))
      .join(" ")
    : "";
  return `${slotText} ${titleText}`;
}

function coreExperienceRowText(cells, row, columns) {
  return columns
    .flatMap((col) => [cellText(cells, row, col), cellText(cells, row, col + 1)])
    .filter(Boolean)
    .join(" ");
}

function coreExperienceAnchorRows(cells, area) {
  const rows = cells
    .filter((cell) => {
      const text = normaliseSearchText(cell.value);
      if (!text.includes("core learning experience")) return false;
      if (area === "drawing") return text.includes("drawing") || text.includes("making thinking visible");
      if (area === "portfolio") return text.includes("portfolio");
      return false;
    })
    .map((cell) => Number(cell.row) || 0)
    .filter(Boolean);
  if (!rows.length) return [];
  const rowSet = new Set();
  rows.forEach((row) => {
    for (let offset = 0; offset <= 6; offset += 1) rowSet.add(row + offset);
  });
  return [...rowSet].sort((a, b) => a - b);
}

function coreExperienceRows(cells, area) {
  const anchoredRows = coreExperienceAnchorRows(cells, area);
  return anchoredRows.length ? anchoredRows : CORE_EXPERIENCE_TEMPLATE_ROWS[area] || [];
}

function templateCoreExperienceLabelsForUnit(workbook, unit) {
  const cells = Array.isArray(workbook?.cells) ? workbook.cells : [];
  const columns = unitSlotColumns(unit);
  if (!columns.length) return [];
  const labels = [];
  ["drawing", "portfolio"].forEach((area) => {
    coreExperienceRows(cells, area).forEach((row) => {
      const checked = columns.some((col) => templateChecked(cellText(cells, row, col)));
      const rowText = coreExperienceRowText(cells, row, columns);
      const label = coreExperienceLabelFromText(area, rowText);
      if (checked && label && !labels.includes(label)) labels.push(label);
    });
  });
  return labels;
}

function workbookHasBigIdeaTrigger(workbook, unit, label) {
  const trigger = bigIdeaTrigger(label);
  if (!trigger) return false;
  return trigger.test(unitRelevantText(workbook, unit));
}

function workbookHasCoreExperienceTrigger(workbook, unit, label) {
  const trigger = coreExperienceTrigger(label);
  if (!trigger) return false;
  if (templateCoreExperienceLabelsForUnit(workbook, unit).includes(label)) return true;
  const cells = Array.isArray(workbook?.cells) ? workbook.cells : [];
  const columns = unitSlotColumns(unit);
  const relevantCells = columns.length
    ? cells.filter((cell) => columns.includes(Number(cell.col) || 0) || columns.includes((Number(cell.col) || 0) - 1))
    : cells;
  return relevantCells.some((cell) => {
    const value = String(cell.value || "");
    if (!trigger.pattern.test(value)) return false;
    const context = normaliseSearchText(nearbyCellText(cells, cell));
    return trigger.area === "drawing" ? /\bdrawing\b/.test(context) : /\bportfolio\b/.test(context);
  });
}

function removeUnsupportedPlanningCards(result, workbook) {
  if (!Array.isArray(result?.units)) return result;
  result.units.forEach((unit) => {
    if (!Array.isArray(unit.cards)) return;
    unit.cards = unit.cards.filter((card) => {
      if (card?.type === "coreExperiences") {
        const keep = workbookHasCoreExperienceTrigger(workbook, unit, card.label);
        if (!keep) unit.warnings = [...(unit.warnings || []), "Core experience needs review: explicit trigger was not found."];
        return keep;
      }
      if (card?.type === "bigIdeas") {
        const keep = workbookHasBigIdeaTrigger(workbook, unit, card.label);
        if (!keep) unit.warnings = [...(unit.warnings || []), "Big Idea needs review: explicit phrase was not found."];
        return keep;
      }
      return true;
    });
    templateCoreExperienceLabelsForUnit(workbook, unit).forEach((label) => {
      const exists = unit.cards.some((card) => card?.type === "coreExperiences" && card.label === label);
      if (!exists) {
        unit.cards.push({
          type: "coreExperiences",
          label,
          value: "",
          reason: "Read from core learning experience checkbox row",
        });
      }
    });
  });
  return result;
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
            "Your priority is reliability, not completeness. A missing mapping is better than a wrong mapping.",
            "Detect real lower secondary art units, their Sec/Term/Week placement, lesson duration, performance task, and planning cards.",
            "For unit titles, copy the exact unit title from the spreadsheet. Do not paraphrase, summarise, translate, title-case, rename, or improve it. Only trim extra whitespace.",
            "Use only labels from allowedCards. Do not invent card labels.",
            "For Big Ideas: there are only three official Big Ideas.",
            "Map a Big Idea only when there is explicit evidence from the spreadsheet, such as an exact phrase, checkbox, or very close paraphrase.",
            "Do not infer a Big Idea only from a theme, unit title, or performance task.",
            "If Big Idea evidence is weak, do not add the Big Idea card. Add a warning instead.",
            "False Big Idea mappings are worse than missing Big Idea mappings.",
            "For Learning Outcomes and Artistic Processes: prefer explicit LO/AP codes or close official wording.",
            "Do not infer LOs or APs from general activity descriptions unless strongly supported.",
            "For core learning experiences, only map Drawing cards when the spreadsheet explicitly contains Observe, Think, or Imagine in a drawing/core-experience context.",
            "For core learning experiences, only map Portfolio cards when the spreadsheet explicitly contains Document, Curate, Reflect, or (Re)present/Re-present/Represent in a portfolio/core-experience context.",
            "Never infer core learning experiences from themes, activities, assessment evidence, or general lesson descriptions.",
            "For free-text areas: preserve teacher-entered text as value.",
            "Use the closest existing Weave card label only when the category is clear.",
            "If unclear, leave unmapped and add a warning.",
            "For Pedagogy, DI, D.I., and Differentiated Instruction all mean Differentiated Instruction (DI).",
            "If any field is ambiguous, leave it empty and add a concise warning.",
            "Do not add source evidence fields. Keep every string concise. Reasons and warnings must be one short phrase.",
            "Do not create detailed lesson activities.",
            "Stretch goal: if the spreadsheet contains an explicit lesson-by-lesson outline for a unit, add it to lessonOutlines as lessonNumber and description.",
            "Only use lessonOutlines for clear lesson cues such as Lesson 1/Lesson 2 headings, numbered lesson rows, or visibly separated lesson outline entries.",
            "Do not split a general unit task, theme, teaching focus, assessment note, or performance task into lessonOutlines.",
            "If lesson outline evidence is weak, return an empty lessonOutlines array and add a warning.",
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
    const result = removeUnsupportedPlanningCards(await callOpenAI(context), context.workbook);
    json(res, 200, {
      planTitle: result.planTitle || "",
      units: Array.isArray(result.units) ? result.units : [],
    });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, { error: error.message || "Could not suggest import mappings." });
  }
};
