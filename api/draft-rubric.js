const crypto = require("crypto");

const TOKEN_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const learningOutcomeReferences = {
  LO1: {
    label: "LO1: Gather, record and present observations and personal experiences.",
    rubricFocus: [
      "Observation: quality of observation and recording; sensitivity and attentiveness in observing the subject matter; depth and accuracy of visual observation",
      "Recording: clarity and purposefulness of recording methods; range and variety of recording strategies used; effectiveness of chosen recording method in capturing observations",
      "Presentation: clarity and organisation in presenting observations; effectiveness of presentation in communicating personal experiences; coherence and completeness of presented observations",
    ],
  },
  LO2: {
    label: "LO2: Make connections to generate ideas and visuals.",
    rubricFocus: [
      "Making Connections: depth and relevance of connections made between ideas, artworks and personal experiences; ability to draw meaningful links between research and own art making; quality of connections made between visual references and own ideas",
      "Generating Ideas: originality and inventiveness of ideas generated; range and diversity of visual ideas explored; depth and development of ideas from initial concept to visual outcome",
      "Generating Visuals: effectiveness of visuals generated in communicating ideas; quality and purposefulness of visual exploration; clarity and intentionality of visual responses to ideas",
    ],
  },
  LO3: {
    label: "LO3: Explore and experiment with a variety of materials and techniques to communicate independent or shared ideas.",
    rubricFocus: [
      "Exploration: breadth and purposefulness of exploration of materials and techniques; willingness and confidence to explore unfamiliar materials and techniques; quality of exploration in relation to intended ideas",
      "Experimentation: intentionality and effectiveness of experimentation with materials and techniques; range and variety of experimentation undertaken; depth of experimentation in developing visual outcomes",
      "Communication of Ideas: effectiveness of chosen materials and techniques in communicating ideas; clarity and purposefulness of connection between material choices and intended ideas; strength of personal or shared voice communicated through materials and techniques",
    ],
  },
  LO4: {
    label: "LO4: Develop personally relevant works of art independently or with others, with consideration for aesthetic qualities and social and cultural awareness.",
    rubricFocus: [
      "Personal Relevance: depth and sincerity of personal connection to the artwork; clarity and authenticity of personal voice in the artwork; strength of connection between personal experiences and artistic decisions made",
      "Aesthetic Qualities: sensitivity and intentionality in the use of aesthetic qualities; effectiveness of aesthetic choices in strengthening the artwork; coherence and refinement of aesthetic decisions across the artwork",
      "Social and Cultural Awareness: depth and thoughtfulness of social and cultural awareness demonstrated; relevance and sensitivity of social and cultural references used; quality of connection between social and cultural awareness and artistic decisions made",
      "Independence or Collaboration: degree of independence and initiative shown in developing the artwork; quality of collaboration and shared ownership in the art making process; effectiveness of individual contribution within a collaborative art making context",
    ],
  },
  LO5: {
    label: "LO5: Reflect, connect and share views on own and others' works of art.",
    rubricFocus: [
      "Reflection: depth and thoughtfulness of reflection on own art making process and outcomes; quality of self-assessment and identification of areas for growth; sincerity and insight of reflection on personal artistic development",
      "Making Connections: depth and relevance of connections made between own and others' works; quality of connections made between artworks and personal experiences or ideas; ability to situate own art making within a broader artistic context",
      "Sharing Views: clarity and confidence in articulating views on own and others' works; constructiveness and specificity of feedback given to peers; openness and respect shown when receiving and responding to feedback",
    ],
  },
  LO6: {
    label: "LO6: Value art as an avenue for self-discovery and understanding the world.",
    rubricFocus: [
      "Self-Discovery: depth and sincerity of self-discovery demonstrated through art making; quality of personal insights gained through the artistic process; authenticity and growth of personal voice developed through art making",
      "Understanding the World: depth and thoughtfulness of understanding of the world demonstrated through art; quality of connections made between art and social, cultural or contemporary issues; relevance and sensitivity of artistic responses to the world around them",
      "Valuing Art: sincerity and depth of appreciation for art as a meaningful form of expression; quality of engagement with art as a tool for personal and social understanding; consistency and authenticity of disposition towards art as a lifelong pursuit",
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
    rubricOptions: body.rubricOptions || {},
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
