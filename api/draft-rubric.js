const crypto = require("crypto");

const TOKEN_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const learningOutcomeReferences = {
  LO1: {
    label: "LO1: Gather, record and present observations and personal experiences.",
    rubricFocus: [
      "quality of observation and recording",
      "selection and presentation of personal experience",
      "specific visual evidence gathered from seeing, experiencing, or documenting",
    ],
  },
  LO2: {
    label: "LO2: Make connections to generate ideas and visuals.",
    rubricFocus: [
      "connections across experiences, sources, contexts, and visual decisions",
      "idea generation and development",
      "visual relationships that support meaning",
    ],
  },
  LO3: {
    label: "LO3: Explore and experiment with materials and techniques to communicate ideas.",
    rubricFocus: [
      "purposeful exploration of materials, techniques, tools, and processes",
      "experimentation linked to intention",
      "technical decisions that support communication of ideas",
    ],
  },
  LO4: {
    label: "LO4: Develop personally relevant works of art independently or with others, with consideration for aesthetic qualities and social and cultural awareness.",
    rubricFocus: [
      "development of personally relevant work",
      "aesthetic decision-making",
      "social and cultural awareness in art-making",
      "independent or collaborative development of artwork",
    ],
  },
  LO5: {
    label: "LO5: Reflect, connect and share views on own and others' works of art.",
    rubricFocus: [
      "reflection on process and outcome",
      "connection-making when discussing artworks",
      "quality of sharing, critique, and response to feedback",
    ],
  },
  LO6: {
    label: "LO6: Value art as an avenue for self-discovery and understanding the world.",
    rubricFocus: [
      "art as a way to understand self, community, and world",
      "openness to multiple meanings and perspectives",
      "personal insight developed through art learning",
    ],
  },
};

const assessmentGuidance = [
  "Assess the selected Learning Outcomes through visible evidence from the task, not through effort, neatness, or compliance alone.",
  "Descriptors should describe observable qualities in student evidence and should be usable by teachers and students.",
  "Keep the rubric developmental: focus on growth, feedback, and clarity of next steps.",
  "Avoid over-assessing too many unrelated qualities in one criterion.",
  "For weighted assessments, make criteria clear enough to support consistent judgement.",
];

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

function loCode(label = "") {
  return String(label).match(/\bLO\d\b/)?.[0] || "";
}

function selectedReferences(learningOutcomes = []) {
  return learningOutcomes
    .map(loCode)
    .filter(Boolean)
    .map((code) => learningOutcomeReferences[code])
    .filter(Boolean);
}

function compactContext(body = {}) {
  const task = body.assessmentTask || {};
  const unit = body.unit || {};
  const refs = selectedReferences(task.learningOutcomes || []);
  return {
    plan: body.plan || {},
    assessmentTask: task,
    unit,
    lessonEvidence: Array.isArray(body.lessonEvidence) ? body.lessonEvidence.slice(0, 12) : [],
    references: {
      learningOutcomes: refs,
      assessmentGuidance,
    },
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

function rubricLevelsForStageCount(stageCount) {
  return Number(stageCount) === 3
    ? ["Developing", "Competent", "Proficient"]
    : ["Beginning", "Developing", "Competent", "Proficient"];
}

function rubricSchema(stageCount = 4) {
  const levels = rubricLevelsForStageCount(stageCount);
  const descriptorProperties = Object.fromEntries(levels.map((level) => [level, { type: "string" }]));
  return {
    type: "object",
    additionalProperties: false,
    required: ["levels", "totalMarks", "criteria", "reviewReminder", "sourcesUsed"],
    properties: {
      levels: {
        type: "array",
        minItems: levels.length,
        maxItems: levels.length,
        items: { type: "string", enum: levels },
      },
      totalMarks: { type: "string" },
      criteria: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "linkedOutcomes", "focus", "marks", "descriptors"],
          properties: {
            title: { type: "string" },
            linkedOutcomes: {
              type: "array",
              minItems: 1,
              items: { type: "string" },
            },
            focus: { type: "string" },
            marks: { type: "string" },
            descriptors: {
              type: "object",
              additionalProperties: false,
              required: levels,
              properties: descriptorProperties,
            },
          },
        },
      },
      reviewReminder: { type: "string" },
      sourcesUsed: {
        type: "array",
        minItems: 1,
        items: { type: "string" },
      },
    },
  };
}

function requestedStageCount(context) {
  return Number(context.rubricOptions?.stageCount) === 3 ? 3 : 4;
}

function requestedTotalMarks(context) {
  return String(context.rubricOptions?.totalMarks || "").trim();
}

function numericTotalMarks(totalMarks) {
  const match = String(totalMarks || "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function splitCriterionMarks(totalMarks, count) {
  const total = numericTotalMarks(totalMarks);
  if (!total || !count) return null;
  const roundedShare = Math.floor((total / count) * 10) / 10;
  const marks = Array.from({ length: count }, () => roundedShare);
  const used = roundedShare * count;
  marks[count - 1] = Math.round((marks[count - 1] + (total - used)) * 10) / 10;
  return marks.map((mark) => `${Number.isInteger(mark) ? mark : mark.toFixed(1)} marks`);
}

function enforceRubricOptions(draft, context) {
  const stageCount = requestedStageCount(context);
  const levels = rubricLevelsForStageCount(stageCount);
  const totalMarks = requestedTotalMarks(context);
  const criteria = Array.isArray(draft.criteria) ? draft.criteria : [];
  const markSplit = requestedTotalMarks(context) ? splitCriterionMarks(totalMarks, criteria.length) : null;
  return {
    ...draft,
    stageCount,
    levels,
    totalMarks,
    criteria: criteria.map((criterion, index) => {
      const descriptors = {};
      levels.forEach((level) => {
        descriptors[level] = String(criterion?.descriptors?.[level] || "").trim();
      });
      return {
        ...criterion,
        marks: markSplit?.[index] || criterion?.marks || "",
        descriptors,
      };
    }),
  };
}

function extractJsonText(data) {
  return data?.choices?.[0]?.message?.content || "";
}

async function callOpenAI(context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw Object.assign(new Error("Server is missing OPENAI_API_KEY."), { status: 500 });
  const stageCount = requestedStageCount(context);
  const levels = rubricLevelsForStageCount(stageCount);
  const totalMarks = requestedTotalMarks(context);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.25,
      max_completion_tokens: 3200,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "weave_rubric_draft",
          strict: true,
          schema: rubricSchema(stageCount),
        },
      },
      messages: [
        {
          role: "system",
          content: [
            "You draft assessment rubrics for lower secondary curriculum planning.",
            "Use only the selected Learning Outcomes and supplied references.",
            "Do not assess student behaviour, compliance, effort, or neatness unless directly evidenced by the task.",
            "Write concise, teacher-editable descriptors that describe observable evidence.",
            `Use exactly these rubric levels: ${levels.join(", ")}.`,
            totalMarks
              ? `Use exactly this total mark value in totalMarks: ${totalMarks}. Distribute criterion marks so they align with this total. Do not invent 10 marks unless the teacher selected 10.`
              : "If total marks are not provided, leave totalMarks blank and leave marks as a short editable suggestion.",
            "Return only the required structured JSON.",
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
    throw Object.assign(new Error(data.error?.message || "OpenAI rubric draft failed."), { status: response.status });
  }
  const text = extractJsonText(data);
  if (!text) throw new Error("OpenAI returned an empty rubric draft.");
  return JSON.parse(text);
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Use POST to draft a rubric." });
    return;
  }
  try {
    await verifyFirebaseToken(req.headers.authorization);
    const context = compactContext(requestBody(req));
    const selectedLos = context.assessmentTask.learningOutcomes || [];
    if (!selectedLos.length || !context.assessmentTask.evidence) {
      json(res, 400, { error: "Rubric drafting needs selected LOs and an evidence description." });
      return;
    }
    const draft = enforceRubricOptions(await callOpenAI(context), context);
    const stageCount = requestedStageCount(context);
    const sourcesUsed = [
      ...selectedLos.map(loCode).filter(Boolean),
      context.unit?.title ? "Unit Performance Task" : "",
      "Assessment Guidance",
    ].filter(Boolean);
    json(res, 200, {
      rubric: {
        ...draft,
        stageCount,
        levels: rubricLevelsForStageCount(stageCount),
        totalMarks: requestedTotalMarks(context),
        sourcesUsed: Array.from(new Set([...(draft.sourcesUsed || []), ...sourcesUsed])),
        generatedAt: new Date().toISOString(),
        status: "draft",
      },
    });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, { error: error.message || "Could not draft rubric." });
  }
};
