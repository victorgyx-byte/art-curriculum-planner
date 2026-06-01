const YEAR_WEEK_COUNT = 40;
const TERM_WEEK_COUNT = 10;
const YEAR_COUNT = 2;
const WEEK_COUNT = YEAR_WEEK_COUNT * YEAR_COUNT;
const BOARD_SNAP = 28;
const TIMELINE_HEADER_HEIGHT = 76;
const TIMELINE_LANE_HEIGHT = 150;
const STORAGE_KEY = "art-curriculum-editor-v1";
const ACTIVE_WORKSPACE_STORAGE_KEY = "art-curriculum-active-workspace-id";
const WORKSPACE_CATALOG_STORAGE_KEY = "art-curriculum-workspace-catalog";
const WORKSPACE_SHARED_LIBRARY_STORAGE_KEY = "art-curriculum-workspace-shared-library";
const ACTIVE_PLAN_STORAGE_KEY = "art-curriculum-active-plan-id";
const PLAN_CATALOG_STORAGE_KEY = "art-curriculum-plan-catalog";
const CLOUD_WORKSPACE_PREFIX = "teacher-workspace";
const TEAM_WORKSPACE_PREFIX = "team-workspace";
const CLOUD_PLAN_ID = "main-planner-state";
const SUGGESTION_VERSION = 2;
const SHARED_CARD_TYPES = new Set(["cc21"]);
const hiddenPlanningCards = new Set(["Communication, Collaboration and Information Skills"]);

const defaultCardLibrary = [
  {
    title: "Big Ideas",
    type: "bigIdeas",
    items: [
      "Art helps us to see in new ways.",
      "Art tells stories about our world.",
      "Art influences the way we live.",
    ],
  },
  {
    title: "Meaning Cards",
    type: "meaningText",
    items: ["Guiding Question", "Theme"],
  },
  {
    title: "Learning Outcomes",
    type: "learningOutcomes",
    items: [
      "LO1: Gather, record and present observations and personal experiences.",
      "LO2: Make connections to generate ideas and visuals.",
      "LO3: Explore and experiment with materials and techniques to communicate ideas.",
      "LO4: Develop personally relevant works of art independently or with others.",
      "LO5: Reflect, connect and share views on own and others' works of art.",
      "LO6: Value art as an avenue for self-discovery and understanding the world.",
    ],
  },
  {
    title: "Media / Art Forms",
    type: "media",
    items: [
      "Drawing",
      "Painting",
      "Printmaking",
      "Photography & Digital Imaging",
      "Mixed Media",
      "Sculpture & 3-D Art Forms",
      "Design & Applied Arts",
      "Textile",
    ],
  },
  {
    title: "Context",
    type: "context",
    items: [
      "Key Artwork / Stimulus",
      "Topic / Subject Matter",
      "Artist / Artwork Background",
      "Purpose / Intention",
      "Personal / Social / Cultural Meaning",
      "Art in Life / Design Context",
    ],
  },
  {
    title: "Artistic Processes",
    type: "artisticProcesses",
    items: [
      "Observe, record and reflect",
      "Gather and research",
      "Generate visual possibilities",
      "Experiment with materials and methods",
      "Create artworks to communicate ideas",
      "Evaluate and give feedback",
    ],
  },
  {
    title: "Visual Qualities",
    items: [
      { label: "Elements of Art", type: "visualQualities" },
      { label: "Principles of Design", type: "visualQualities" },
      { label: "Postmodern Principles", type: "visualQualities" },
      { label: "Design Concepts", type: "visualQualities" },
      { label: "Others", type: "visualQualityText" },
    ],
  },
  {
    title: "Core Learning Experiences",
    type: "coreExperiences",
    items: [
      "Drawing: Observe",
      "Drawing: Think",
      "Drawing: Imagine",
      "Portfolio: Document",
      "Portfolio: Curate",
      "Portfolio: Reflect",
      "Portfolio: (Re)present",
    ],
  },
  {
    title: "Pedagogy",
    type: "pedagogy",
    items: [
      "Inquiry Based Learning",
      "Differentiated Instruction (DI)",
      "E-Pedagogy",
      "Collaborative Art Making & Learning",
    ],
  },
  {
    title: "Teaching Moves",
    type: "teachingMoves",
    items: [
      "Gallery Walk",
      "Peer Critique",
      "See-Think-Wonder",
      "Material Exploration",
      "Teacher Demonstration",
      "Visual Journaling",
      "Artist Statement Writing",
      "Moodboard Curation",
    ],
  },
  {
    title: "Assessment Blocks",
    type: "assessment",
    items: [
      "Diagnostic drawing check",
      "Formative critique",
      "Portfolio review",
      "Weighted assessment",
      "Self-assessment checklist",
      "Reflection prompt",
      "End-of-year evidence",
    ],
  },
  {
    title: "21CC Emphases",
    type: "cc21",
    items: [
      "Critical Thinking",
      "Adaptive Thinking",
      "Inventive Thinking",
      "Communication Skills",
      "Collaboration Skills",
      "Information Skills",
      "Civic Literacy",
      "Global Literacy",
      "Cross-cultural Literacy",
    ],
  },
];

const defaultWorkspaceCardLibrary = defaultCardLibrary.filter((category) => SHARED_CARD_TYPES.has(category.type));

const lessonStructureCards = [
  "Verbal Recap",
  "Show & Tell",
  "Lesson Demonstration",
  "Lecture",
  "Studio Practice",
  "Others",
];

const inquiryActivityTypes = [
  "Connect & Wonder",
  "Investigate",
  "Make",
  "Express",
  "Reflect",
];

const loProcessSuggestions = [
  {
    lo: "LO1",
    processes: ["Observe, record and reflect", "Gather and research"],
  },
  {
    lo: "LO2",
    processes: ["Gather and research", "Generate visual possibilities"],
  },
  {
    lo: "LO3",
    processes: ["Experiment with materials and methods"],
  },
  {
    lo: "LO4",
    processes: ["Create artworks to communicate ideas"],
  },
  {
    lo: "LO5",
    processes: ["Observe, record and reflect", "Evaluate and give feedback"],
  },
  {
    lo: "LO6",
    processes: ["Gather and research"],
  },
];

const defaultState = {
  plan: {
    id: CLOUD_PLAN_ID,
    title: "Main 2YIP",
    subject: "Art",
    teamId: "",
    teamName: "",
  },
  cardLibrary: cloneDefaultCardLibrary(),
  selectedUnitId: "u1",
  selectedLessonId: "",
  currentScreen: "timeline",
  selectedBoardZone: "meaning",
  selectedLessonZone: "curricular",
  lessonOverviewOpen: false,
  unitOverviewOpen: false,
  collapsedCategories: {},
  overlays: {
    bigIdeas: true,
    learningOutcomes: true,
    cc21: false,
    media: false,
    assessment: false,
    coreExperiences: false,
  },
  units: [
    {
      id: "u1",
      title: "Seeing School Anew",
      artTask: "Students observe overlooked spaces in school and develop drawings that shift how others see familiar places.",
      start: 1,
      duration: 5,
      studentDevelopment: "Bridging: adjusting to a new environment and building confidence.",
      teachingFocus: "Establish routines, build rapport, and level differences in prior art learning.",
      guidingQuestion: "How can we help others see familiar school spaces in new ways?",
      guidingQuestions: ["How can we help others see familiar school spaces in new ways?"],
      theme: "Overlooked spaces in school",
      bigIdeas: ["Art helps us to see in new ways."],
      learningOutcomes: {
        primary: ["LO1: Gather, record and present observations and personal experiences."],
        supporting: ["LO2: Make connections to generate ideas and visuals."],
      },
      media: ["Drawing"],
      coreExperiences: ["Drawing: Observe", "Portfolio: Document"],
      cc21: ["Critical, Adaptive and Inventive Thinking"],
      assessment: ["Diagnostic drawing check", "Portfolio review"],
      learningContent: {
        context: "School environment and everyday visual culture.",
        artisticProcesses: "Observe, record, generate visual possibilities.",
        visualQualities: "Line, texture, space, contrast.",
        contextCards: ["Topic / Subject Matter"],
        artisticProcessCards: ["Observe, record and reflect", "Generate visual possibilities"],
        visualQualityCards: ["Elements of Art", "Principles of Design"],
      },
      pedagogy: ["Inquiry Based Learning"],
      notes: "Starter unit to establish looking, recording, and portfolio routines.",
      boardCards: [
        {
          id: "c1",
          type: "bigIdeas",
          label: "Art helps us to see in new ways.",
          x: 38,
          y: 48,
          purpose: "Meaning anchor for noticing and reframing familiar spaces.",
        },
        {
          id: "c4",
          type: "meaningText",
          label: "Guiding Question",
          zone: "meaning",
          order: 2,
          value: "How can we help others see familiar school spaces in new ways?",
          purpose: "Open-ended inquiry for the unit.",
        },
        {
          id: "c5",
          type: "meaningText",
          label: "Theme",
          zone: "meaning",
          order: 3,
          value: "Overlooked spaces in school",
          purpose: "Student-facing context or theme.",
        },
        {
          id: "c2",
          type: "learningOutcomes",
          label: "LO1: Gather, record and present observations and personal experiences.",
          x: 360,
          y: 48,
          purpose: "Primary evidence: observation drawings and documentation.",
        },
        {
          id: "c3",
          type: "teachingMoves",
          label: "Gallery Walk",
          x: 372,
          y: 292,
          purpose: "Students compare what peers noticed and give feedback on visual qualities.",
        },
      ],
      lessons: [],
      activities: [
        {
          id: "a1",
          title: "Slow Looking Walk",
          type: "teachingMoves",
          weekOffset: 0,
          purpose: "Students notice overlooked visual qualities in familiar school spaces.",
        },
        {
          id: "a2",
          title: "Blind Contour Drawing",
          type: "coreExperiences",
          weekOffset: 1,
          purpose: "Students use drawing to observe before judging the outcome.",
        },
      ],
    },
    {
      id: "u2",
      title: "Stories In Objects",
      artTask: "Students collect visual stories around personal or community objects and create a mixed-media response.",
      start: 14,
      duration: 6,
      studentDevelopment: "Developing competence: growing confidence and trying new media.",
      teachingFocus: "Maintain routines, deepen inquiry, and introduce broader media exposure.",
      guidingQuestion: "",
      guidingQuestions: [],
      theme: "",
      bigIdeas: ["Art tells stories about our world."],
      learningOutcomes: {
        primary: ["LO2: Make connections to generate ideas and visuals."],
        supporting: ["LO5: Reflect, connect and share views on own and others' works of art."],
      },
      media: ["Mixed Media", "Photography & Digital Imaging"],
      coreExperiences: ["Portfolio: Curate", "Portfolio: Reflect"],
      cc21: [],
      assessment: ["Formative critique"],
      learningContent: {
        context: "Objects, memory, community, and personal narratives.",
        artisticProcesses: "Gather, research, select, develop ideas.",
        visualQualities: "Colour, balance, emphasis, composition.",
        contextCards: ["Personal / Social / Cultural Meaning"],
        artisticProcessCards: ["Gather and research", "Create artworks to communicate ideas"],
        visualQualityCards: ["Elements of Art", "Principles of Design"],
      },
      pedagogy: ["Inquiry Based Learning", "Collaborative Art Making & Learning"],
      notes: "",
      boardCards: [],
      lessons: [],
      dismissedSuggestions: [],
      activities: [],
    },
  ],
};

let cloud = {
  available: false,
  auth: null,
  db: null,
  user: null,
  loaded: false,
  status: "Local save",
};
let workspaceCatalog = loadWorkspaceCatalog();
let workspaceSharedLibrary = loadWorkspaceSharedLibrary();
let planCatalog = loadPlanCatalog();
let state = loadState();
let dragPayload = null;
let timelineDrag = null;
let boardHeaderEditing = { title: false, performanceTask: false };
let unitSetupOpen = false;
let planSetupOpen = false;
let workspaceSetupOpen = false;
let cloudSaveTimer = null;
let authStateTimer = null;
let cloudSyncPaused = false;
let historySyncPaused = false;
let workspaceMembers = [];
let workspaceInvites = [];
let userAccessiblePlans = [];
let workspaceDirectoryWorkspaceId = "";
let workspaceDirectoryLoading = false;

const screenHashes = {
  workspace: "#workspace",
  timeline: "#timeline",
  board: "#unit",
  lesson: "#lesson",
};

const els = {
  library: document.querySelector("#library"),
  appShell: document.querySelector("#app-shell"),
  loginGate: document.querySelector("#login-gate"),
  loginGoogle: document.querySelector("#login-google"),
  loginReset: document.querySelector("#login-reset"),
  loginStatus: document.querySelector("#login-status"),
  workspaceScreen: document.querySelector("#workspace-screen"),
  plannerWorkspace: document.querySelector("#planner-workspace"),
  workspaceHome: document.querySelector("#workspace-home"),
  plannerKicker: document.querySelector("#planner-kicker"),
  plannerTitle: document.querySelector("#planner-title"),
  modeSwitch: document.querySelector("#mode-switch"),
  workspaceCardGrid: document.querySelector("#workspace-card-grid"),
  planCardGrid: document.querySelector("#plan-card-grid"),
  workspacePlanHeading: document.querySelector("#workspace-plan-heading"),
  teamManagementPanel: document.querySelector("#team-management-panel"),
  teamInviteForm: document.querySelector("#team-invite-form"),
  inviteEmail: document.querySelector("#invite-email"),
  sendInvite: document.querySelector("#send-invite"),
  memberList: document.querySelector("#member-list"),
  inviteList: document.querySelector("#invite-list"),
  libraryEyebrow: document.querySelector("#library-eyebrow"),
  libraryTitle: document.querySelector("#library-title"),
  workspaceSelect: document.querySelector("#workspace-select"),
  newWorkspace: document.querySelector("#new-workspace"),
  planSelect: document.querySelector("#plan-select"),
  newPlan: document.querySelector("#new-plan"),
  unitList: document.querySelector("#unit-list"),
  timelineGrid: document.querySelector("#timeline-grid"),
  unitLayer: document.querySelector("#unit-layer"),
  timeline: document.querySelector("#timeline"),
  timelineHealth: document.querySelector("#timeline-health"),
  timelineScreen: document.querySelector("#timeline-screen"),
  workspace: document.querySelector(".workspace"),
  cardLibraryPanel: document.querySelector(".card-library-panel"),
  boardScreen: document.querySelector("#board-screen"),
  unitBoardLanding: document.querySelector("#unit-board-landing"),
  lessonScreen: document.querySelector("#lesson-screen"),
  lessonLanding: document.querySelector("#lesson-landing"),
  lessonEditor: document.querySelector("#lesson-editor"),
  lessonEditorTitle: document.querySelector("#lesson-editor-title"),
  lessonConfirmedView: document.querySelector("#lesson-confirmed-view"),
  lessonEditView: document.querySelector("#lesson-edit-view"),
  confirmLessonBoard: document.querySelector("#confirm-lesson-board"),
  editLessonBoard: document.querySelector("#edit-lesson-board"),
  saveLessonBottom: document.querySelector("#save-lesson-bottom"),
  lessonSaveStatus: document.querySelector("#lesson-save-status"),
  lessonTitle: document.querySelector("#lesson-title"),
  lessonDuration: document.querySelector("#lesson-duration"),
  lessonDescription: document.querySelector("#lesson-description"),
  lessonObjectives: document.querySelector("#lesson-objectives"),
  lessonImagePreview: document.querySelector("#lesson-image-preview"),
  lessonImageUpload: document.querySelector("#lesson-image-upload"),
  chooseLessonImage: document.querySelector("#choose-lesson-image"),
  removeLessonImage: document.querySelector("#remove-lesson-image"),
  lessonInheritedChips: document.querySelector("#lesson-inherited-chips"),
  lessonPlanningBoard: document.querySelector("#lesson-planning-board"),
  mobileLessonTabs: document.querySelector("#mobile-lesson-tabs"),
  mobileLessonCardPicker: document.querySelector("#mobile-lesson-card-picker"),
  lessonBoardZones: document.querySelectorAll(".lesson-zone"),
  lessonBoardStructures: document.querySelector("#lesson-board-structures"),
  lessonSteps: document.querySelector("#lesson-steps"),
  addLessonStep: document.querySelector("#add-lesson-step"),
  lessonPickerPanel: document.querySelector(".lesson-picker-panel"),
  lessonNavPanel: document.querySelector("#lesson-nav-panel"),
  lessonNavList: document.querySelector("#lesson-nav-list"),
  lessonUnitPicker: document.querySelector("#lesson-unit-picker"),
  lessonPickerList: document.querySelector("#lesson-picker-list"),
  addLessonFromBoard: document.querySelector("#add-lesson-from-board"),
  modeButtons: document.querySelectorAll(".mode-button"),
  boardTitle: document.querySelector("#board-title"),
  boardHeading: document.querySelector(".board-heading"),
  boardTitleEditor: document.querySelector("#board-title-editor"),
  boardTitleDisplay: document.querySelector("#board-title-display"),
  editBoardTitle: document.querySelector("#edit-board-title"),
  confirmBoardTitle: document.querySelector("#confirm-board-title"),
  boardPerformanceTask: document.querySelector("#board-performance-task"),
  boardPerformanceTaskEditor: document.querySelector("#board-performance-task-editor"),
  boardPerformanceTaskDisplay: document.querySelector("#board-performance-task-display"),
  editBoardPerformanceTask: document.querySelector("#edit-board-performance-task"),
  confirmBoardPerformanceTask: document.querySelector("#confirm-board-performance-task"),
  unitBoard: document.querySelector("#unit-board"),
  mobileBoardTabs: document.querySelector("#mobile-board-tabs"),
  mobileUnitCardPicker: document.querySelector("#mobile-unit-card-picker"),
  unitOverview: document.querySelector("#unit-overview"),
  boardZones: document.querySelectorAll(".board-zone"),
  saveUnit: document.querySelector("#save-unit"),
  saveStatus: document.querySelector("#save-status"),
  arrangeBoard: document.querySelector("#arrange-board"),
  clearBoard: document.querySelector("#clear-board"),
  lessonBoard: document.querySelector(".lesson-board"),
  lessonList: document.querySelector("#lesson-list"),
  addLesson: document.querySelector("#add-lesson"),
  addUnit: document.querySelector("#add-unit"),
  unitSetupModal: document.querySelector("#unit-setup-modal"),
  newUnitTitle: document.querySelector("#new-unit-name"),
  newUnitBigIdeas: document.querySelector("#new-unit-big-ideas"),
  newUnitLessons: document.querySelector("#new-unit-lessons"),
  cancelUnitSetup: document.querySelector("#cancel-unit-setup"),
  createUnitTimeline: document.querySelector("#create-unit-timeline"),
  createUnitBoard: document.querySelector("#create-unit-board"),
  planSetupModal: document.querySelector("#plan-setup-modal"),
  newPlanTitle: document.querySelector("#new-plan-title"),
  newPlanSubject: document.querySelector("#new-plan-subject"),
  newPlanTeam: document.querySelector("#new-plan-team"),
  cancelPlanSetup: document.querySelector("#cancel-plan-setup"),
  createPlan: document.querySelector("#create-plan"),
  workspaceSetupModal: document.querySelector("#workspace-setup-modal"),
  newWorkspaceName: document.querySelector("#new-workspace-name"),
  cancelWorkspaceSetup: document.querySelector("#cancel-workspace-setup"),
  createWorkspace: document.querySelector("#create-workspace"),
  cloudPanel: document.querySelector("#cloud-panel"),
  cloudStatus: document.querySelector("#cloud-status"),
  cloudAuth: document.querySelector("#cloud-auth"),
  resetDemo: document.querySelector("#reset-demo"),
  emptyState: document.querySelector("#empty-state"),
  unitEditor: document.querySelector("#unit-editor"),
  editorTitle: document.querySelector("#editor-title"),
  unitTitle: document.querySelector("#unit-title"),
  unitArtTask: document.querySelector("#unit-art-task"),
  unitStart: document.querySelector("#unit-start"),
  unitDuration: document.querySelector("#unit-duration"),
  unitTags: document.querySelector("#unit-tags"),
  unitStudentDevelopment: document.querySelector("#unit-student-development"),
  unitTeachingFocus: document.querySelector("#unit-teaching-focus"),
  unitContext: document.querySelector("#unit-context"),
  unitProcesses: document.querySelector("#unit-processes"),
  unitVisualQualities: document.querySelector("#unit-visual-qualities"),
  activitySequence: document.querySelector("#activity-sequence"),
  addActivity: document.querySelector("#add-activity"),
  unitNotes: document.querySelector("#unit-notes"),
  exportPreview: document.querySelector("#export-preview"),
};

function loadState() {
  try {
    const activePlanId = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY);
    const saved = JSON.parse(localStorage.getItem(planStateStorageKey(activePlanId)) || localStorage.getItem(STORAGE_KEY));
    const loaded = saved && Array.isArray(saved.units) ? normalizeState(saved) : structuredClone(defaultState);
    loaded.currentScreen = screenFromLocation();
    savePlanToCatalog(loaded.plan);
    localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, loaded.plan.id);
    return loaded;
  } catch {
    const fallback = structuredClone(defaultState);
    fallback.currentScreen = screenFromLocation();
    savePlanToCatalog(fallback.plan);
    localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, fallback.plan.id);
    return fallback;
  }
}

function normalizeState(candidate) {
  const normalized = { ...structuredClone(defaultState), ...candidate };
  normalized.plan = normalizePlanMetadata(candidate.plan);
  normalized.cardLibrary = normalizeCardLibrary(candidate.cardLibrary);
  normalized.currentScreen = normalized.currentScreen || "timeline";
  normalized.selectedLessonId = normalized.selectedLessonId || "";
  normalized.lessonOverviewOpen = false;
  normalized.unitOverviewOpen = Boolean(normalized.unitOverviewOpen);
  normalized.selectedBoardZone = ["meaning", "alignment", "content", "core"].includes(normalized.selectedBoardZone)
    ? normalized.selectedBoardZone
    : "meaning";
  normalized.selectedLessonZone = lessonZoneDefinitions().some((zone) => zone.key === normalized.selectedLessonZone)
    ? normalized.selectedLessonZone
    : "curricular";
  normalized.collapsedCategories = normalized.collapsedCategories || {};
  normalized.units = normalized.units.map((unit) => ({
    ...{
      inTimeline: true,
      start: 1,
      duration: 1,
      artTask: "",
      studentDevelopment: "",
      teachingFocus: "",
      guidingQuestion: "",
      guidingQuestions: [],
      theme: "",
      bigIdeas: [],
      learningOutcomes: { primary: [], supporting: [] },
      media: [],
      coreExperiences: [],
      cc21: [],
      assessment: [],
      learningContent: { context: "", artisticProcesses: "", visualQualities: "" },
      pedagogy: [],
      notes: "",
      boardCards: [],
      lessons: [],
      activities: [],
    },
    ...unit,
    inTimeline: unit.inTimeline !== false,
    start: clamp(Number(unit.start) || 1, 1, WEEK_COUNT),
    duration: Math.max(1, Number(unit.duration) || 1),
    guidingQuestions: unit.guidingQuestions || (unit.guidingQuestion ? [unit.guidingQuestion] : []),
    cc21: visibleValues(unit.cc21 || []),
    learningOutcomes: {
      primary: sortLearningOutcomes(unit.learningOutcomes?.primary || []),
      supporting: sortLearningOutcomes(unit.learningOutcomes?.supporting || []),
    },
    learningContent: {
      context: unit.learningContent?.context || "",
      artisticProcesses: unit.learningContent?.artisticProcesses || "",
      visualQualities: unit.learningContent?.visualQualities || "",
      contextCards: unit.learningContent?.contextCards || [],
      artisticProcessCards: unit.learningContent?.artisticProcessCards || [],
      visualQualityCards: unit.learningContent?.visualQualityCards || [],
    },
    boardCards: uniqueBoardCards((unit.boardCards || []).filter(isVisiblePlanningCard)),
    lessons: normalizeLessons(unit.lessons || [], { ...unit, cc21: visibleValues(unit.cc21 || []), boardCards: uniqueBoardCards((unit.boardCards || []).filter(isVisiblePlanningCard)) }),
    dismissedSuggestions: unit.suggestionVersion === SUGGESTION_VERSION ? unit.dismissedSuggestions || [] : [],
    suggestionVersion: SUGGESTION_VERSION,
    activities: unit.activities || [],
  }));
  if (!normalized.units.some((unit) => unit.id === normalized.selectedUnitId)) {
    normalized.selectedUnitId = normalized.units[0]?.id || "";
  }
  if (!normalized.units.some((unit) => unit.lessons?.some((lesson) => lesson.id === normalized.selectedLessonId))) {
    normalized.selectedLessonId = "";
  }
  return normalized;
}

function normalizePlanMetadata(plan = {}) {
  return {
    id: plan.id || CLOUD_PLAN_ID,
    title: plan.title || "Main 2YIP",
    subject: plan.subject || "Art",
    teamId: plan.teamId || "",
    teamName: plan.teamName || "",
    workspaceId: plan.workspaceId || activeWorkspaceId(),
    role: plan.role || "owner",
  };
}

function normalizeWorkspaceMetadata(workspace = {}) {
  return {
    id: workspace.id || activeWorkspaceId(),
    name: workspace.name || "My Workspace",
    type: workspace.type || "personal",
    role: workspace.role || "owner",
    createdBy: workspace.createdBy || "",
  };
}

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function emailKey(email = "") {
  return normalizeEmail(email).replace(/[^a-z0-9_.@+-]/g, "_");
}

function planInviteDocId(workspaceId, planId, email) {
  return `${workspaceId}__${planId}__${emailKey(email)}`;
}

function currentWorkspaceMeta() {
  return workspaceCatalog.find((workspace) => workspace.id === activeWorkspaceId()) || normalizeWorkspaceMetadata();
}

function currentWorkspaceRole() {
  return currentWorkspaceMeta().role || "owner";
}

function canManageActiveWorkspace() {
  return currentWorkspaceRole() === "owner";
}

function canManagePlanSharing() {
  return canManageActiveWorkspace();
}

function normalizeCardLibrary(cardLibrary, options = {}) {
  const includeShared = Boolean(options.includeShared);
  const fallback = includeShared ? cloneDefaultWorkspaceCardLibrary() : cloneDefaultPlanCardLibrary();
  if (!Array.isArray(cardLibrary) || !cardLibrary.length) return fallback;
  return cardLibrary
    .map((category) => ({
      title: category.title || "Cards",
      type: category.type || "",
      items: Array.isArray(category.items) ? category.items : [],
    }))
    .filter((category) => includeShared ? SHARED_CARD_TYPES.has(category.type) : !SHARED_CARD_TYPES.has(category.type))
    .filter((category) => category.title && category.items.length);
}

function cloneDefaultCardLibrary() {
  return structuredClone(defaultCardLibrary);
}

function cloneDefaultPlanCardLibrary() {
  return cloneDefaultCardLibrary().filter((category) => !SHARED_CARD_TYPES.has(category.type));
}

function cloneDefaultWorkspaceCardLibrary() {
  return structuredClone(defaultWorkspaceCardLibrary);
}

function activeCardLibrary() {
  const planLibrary = Array.isArray(state.cardLibrary) && state.cardLibrary.length ? normalizeCardLibrary(state.cardLibrary) : cloneDefaultPlanCardLibrary();
  const sharedLibrary = normalizeCardLibrary(workspaceSharedLibrary, { includeShared: true });
  return [...planLibrary, ...sharedLibrary];
}

function planStateStorageKey(planId = activePlanId(), workspaceId = activeWorkspaceId()) {
  return `${STORAGE_KEY}:${workspaceId || "local-workspace"}:${planId || CLOUD_PLAN_ID}`;
}

function workspaceSharedLibraryStorageKey(workspaceId = activeWorkspaceId()) {
  return `${WORKSPACE_SHARED_LIBRARY_STORAGE_KEY}:${workspaceId || "local-workspace"}`;
}

function loadWorkspaceSharedLibrary(workspaceId = activeWorkspaceId()) {
  try {
    const saved = JSON.parse(localStorage.getItem(workspaceSharedLibraryStorageKey(workspaceId)));
    return normalizeCardLibrary(saved, { includeShared: true });
  } catch {
    return cloneDefaultWorkspaceCardLibrary();
  }
}

function saveWorkspaceSharedLibrary() {
  localStorage.setItem(workspaceSharedLibraryStorageKey(), JSON.stringify(normalizeCardLibrary(workspaceSharedLibrary, { includeShared: true })));
}

function setWorkspaceSharedLibrary(library) {
  workspaceSharedLibrary = normalizeCardLibrary(library, { includeShared: true });
  saveWorkspaceSharedLibrary();
}

function loadWorkspaceCatalog() {
  try {
    const catalog = JSON.parse(localStorage.getItem(WORKSPACE_CATALOG_STORAGE_KEY));
    return Array.isArray(catalog) ? catalog : [];
  } catch {
    return [];
  }
}

function saveWorkspaceCatalog() {
  localStorage.setItem(WORKSPACE_CATALOG_STORAGE_KEY, JSON.stringify(workspaceCatalog));
}

function saveWorkspaceToCatalog(workspace = {}) {
  const normalized = normalizeWorkspaceMetadata(workspace);
  const existing = workspaceCatalog.find((entry) => entry.id === normalized.id);
  if (existing) {
    Object.assign(existing, normalized);
  } else {
    workspaceCatalog.push(normalized);
  }
  saveWorkspaceCatalog();
}

function loadPlanCatalog() {
  try {
    const catalog = JSON.parse(localStorage.getItem(PLAN_CATALOG_STORAGE_KEY));
    return Array.isArray(catalog) ? catalog : [];
  } catch {
    return [];
  }
}

function savePlanCatalog() {
  localStorage.setItem(PLAN_CATALOG_STORAGE_KEY, JSON.stringify(planCatalog));
}

function savePlanToCatalog(plan = state.plan) {
  const normalized = normalizePlanMetadata(plan);
  const existing = planCatalog.find((entry) => entry.id === normalized.id && entry.workspaceId === normalized.workspaceId);
  if (existing) {
    Object.assign(existing, normalized);
  } else {
    planCatalog.push(normalized);
  }
  savePlanCatalog();
}

function mergeCloudPlanIntoCatalog(planId, data = {}) {
  savePlanToCatalog({
    id: planId,
    title: data.title || data.state?.plan?.title || "Untitled Plan",
    subject: data.subject || data.state?.plan?.subject || "Art",
    teamId: data.teamId || data.state?.plan?.teamId || "",
    teamName: data.teamName || data.state?.plan?.teamName || "",
    workspaceId: cloudWorkspaceId(),
    role: data.role || (canManageActiveWorkspace() ? "owner" : "editor"),
  });
}

function createPlanState({ title, subject, teamName }) {
  const next = normalizeState({
    ...structuredClone(defaultState),
    plan: {
      id: uid("plan"),
      title: title || `${subject || "Art"} 2YIP`,
      subject: subject || "Art",
      teamId: teamName ? slugify(teamName) : "",
      teamName: teamName || "",
      workspaceId: activeWorkspaceId(),
    },
    cardLibrary: cloneLibraryForSubject(subject || "Art"),
    units: [],
    selectedUnitId: "",
    selectedLessonId: "",
    currentScreen: "timeline",
  });
  return next;
}

function loadLocalPlanState(planId) {
  try {
    const saved = JSON.parse(localStorage.getItem(planStateStorageKey(planId)));
    return saved && Array.isArray(saved.units) ? normalizeState(saved) : null;
  } catch {
    return null;
  }
}

function planMetaById(planId) {
  return planCatalog.find((plan) => plan.id === planId && planBelongsToActiveWorkspace(plan)) || null;
}

async function persistCurrentPlanBeforeSwitch() {
  saveState();
  if (cloud.loaded) await saveCloudStateNow();
}

async function switchPlan(planId, options = {}) {
  if (!planId || (planId === activePlanId() && !options.force)) return;
  const currentScreen = options.targetScreen || state.currentScreen;
  if (!options.skipPersist) await persistCurrentPlanBeforeSwitch();
  localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, planId);
  const catalogPlan = planMetaById(planId);
  let nextState = loadLocalPlanState(planId);
  if (!nextState && catalogPlan) {
    nextState = createPlanState({
      title: catalogPlan.title,
      subject: catalogPlan.subject,
      teamName: catalogPlan.teamName,
    });
    nextState.plan.id = catalogPlan.id;
  }
  if (!nextState) nextState = structuredClone(defaultState);

  if (cloud.loaded) {
    try {
      const snapshot = await cloudPlanRefFor(planId).get();
      const remoteState = snapshot.exists ? snapshot.data()?.state : null;
      if (snapshot.exists) mergeCloudPlanIntoCatalog(snapshot.id, snapshot.data());
      if (remoteState && Array.isArray(remoteState.units)) {
        nextState = normalizeState(remoteState);
        nextState.plan = normalizePlanMetadata({
          ...nextState.plan,
          id: planId,
          title: snapshot.data()?.title || nextState.plan.title,
          subject: snapshot.data()?.subject || nextState.plan.subject,
          teamId: snapshot.data()?.teamId || nextState.plan.teamId,
          teamName: snapshot.data()?.teamName || nextState.plan.teamName,
          role: planMetaById(planId)?.role || nextState.plan.role,
        });
      }
    } catch (error) {
      console.warn("Plan switch cloud load failed", error);
    }
  }

  state = normalizeState(nextState);
  state.currentScreen = currentScreen || "timeline";
  saveState();
  render();
}

function plansForActiveWorkspace() {
  return planCatalog.filter(planBelongsToActiveWorkspace);
}

function planBelongsToActiveWorkspace(plan) {
  if (plan.workspaceId) return plan.workspaceId === activeWorkspaceId();
  return activeWorkspaceId() === personalWorkspaceId();
}

function firstPlanForActiveWorkspace() {
  return plansForActiveWorkspace()[0] || null;
}

async function switchWorkspace(workspaceId) {
  if (!workspaceId || workspaceId === activeWorkspaceId()) return;
  await persistCurrentPlanBeforeSwitch();
  localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, workspaceId);
  setWorkspaceSharedLibrary(loadWorkspaceSharedLibrary(workspaceId));
  workspaceDirectoryWorkspaceId = "";
  workspaceMembers = [];
  workspaceInvites = [];
  if (cloud.loaded) {
    await cloud.db.collection("users").doc(cloud.user.uid).set({
      lastWorkspaceId: workspaceId,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  if (cloud.loaded) await loadCloudWorkspaceLibrary();
  if (cloud.loaded) await loadCloudPlanCatalog();
  const nextPlan = firstPlanForActiveWorkspace();
  if (state.currentScreen === "workspace") {
    render();
    return;
  }
  if (nextPlan) {
    await switchPlan(nextPlan.id, { skipPersist: true, force: true });
    return;
  }
  state = createPlanState({
    title: `${workspaceLabel(workspaceId)} 2YIP`,
    subject: "Art",
    teamName: workspaceLabel(workspaceId),
  });
  state.currentScreen = "timeline";
  localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, activePlanId());
  saveState();
  render();
  if (cloud.loaded) await saveCloudStateNow();
}

function workspaceLabel(workspaceId = activeWorkspaceId()) {
  return workspaceCatalog.find((workspace) => workspace.id === workspaceId)?.name || "Workspace";
}

async function createTeamWorkspace(name) {
  if (!cloud.user || !cloud.db) return;
  const trimmedName = name.trim() || "New Team";
  const workspaceId = `${TEAM_WORKSPACE_PREFIX}-${cloud.user.uid}-${slugify(trimmedName)}-${Math.random().toString(36).slice(2, 6)}`;
  const workspace = {
    id: workspaceId,
    name: trimmedName,
    type: "team",
    role: "owner",
  };
  const workspaceRef = cloud.db.collection("workspaces").doc(workspaceId);
  await workspaceRef.set({
    name: trimmedName,
    schoolName: "",
    type: "team",
    createdBy: cloud.user.uid,
    sharedCardLibrary: cloneDefaultWorkspaceCardLibrary(),
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  });
  await workspaceRef.collection("members").doc(cloud.user.uid).set({
    role: "owner",
    email: cloud.user.email || "",
    displayName: cloud.user.displayName || "",
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  });
  await cloud.db.collection("users").doc(cloud.user.uid).set({
    lastWorkspaceId: workspaceId,
    workspaces: {
      [workspaceId]: workspace,
    },
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  saveWorkspaceToCatalog(workspace);
  localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, workspaceId);
  setWorkspaceSharedLibrary(cloneDefaultWorkspaceCardLibrary());
  state = createPlanState({
    title: `${trimmedName} Art 2YIP`,
    subject: "Art",
    teamName: trimmedName,
  });
  state.currentScreen = "timeline";
  saveState();
  await saveCloudStateNow();
  render();
}

async function createPlanInvite(planId, email) {
  if (!cloud.user || !cloud.db || !canManagePlanSharing()) return;
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    renderCloudStatus("Enter a valid teacher email", "Sign out");
    return;
  }
  const plan = planMetaById(planId);
  if (!plan) return;
  const workspace = currentWorkspaceMeta();
  const inviteId = planInviteDocId(workspace.id, plan.id, normalizedEmail);
  await cloud.db.collection("planInvites").doc(inviteId).set({
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    planId: plan.id,
    planTitle: plan.title,
    subject: plan.subject,
    email: normalizedEmail,
    role: "editor",
    status: "pending",
    createdBy: cloud.user.uid,
    createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    acceptedBy: "",
    acceptedAt: null,
  }, { merge: true });
  workspaceDirectoryWorkspaceId = "";
  renderCloudStatus(`Invite ready for ${normalizedEmail}`, "Sign out");
  render();
}

async function removePlanInvite(inviteId) {
  if (!cloud.user || !cloud.db || !canManagePlanSharing() || !inviteId) return;
  await cloud.db.collection("planInvites").doc(inviteId).delete();
  workspaceDirectoryWorkspaceId = "";
  renderCloudStatus("Plan invite removed", "Sign out");
  render();
}

function cloneLibraryForSubject(subject) {
  const cloned = cloneDefaultPlanCardLibrary();
  if (subject !== "Music") return cloned;
  return cloned.map((category) => {
    if (category.title === "Media / Art Forms") {
      return {
        ...category,
        items: ["Voice", "Percussion", "Keyboard", "Guitar", "Music Technology", "Ensemble", "Composition"],
      };
    }
    if (category.title === "Core Learning Experiences") {
      return {
        ...category,
        items: ["Listen and Respond", "Perform", "Create", "Document and Reflect"],
      };
    }
    return category;
  });
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeLessons(lessons, unit = {}) {
  return lessons.map((lesson, index) => {
    const removedUnitCardKeys = lesson.removedUnitCardKeys || [];
    const baseCards = lesson.lessonBoardInitialized
      ? uniqueLessonCards((lesson.boardCards || []).filter(isVisiblePlanningCard))
      : uniqueLessonCards([...(lesson.boardCards || []), ...lessonCardsFromUnit(unit, removedUnitCardKeys)]);
    return {
      id: lesson.id || uid("lesson"),
      title: lesson.title || `Lesson ${index + 1}`,
      description: lesson.description || lesson.details || "",
      objectives: lesson.objectives || "",
      duration: lesson.duration || "",
      imageDataUrl: lesson.imageDataUrl || "",
      imageName: lesson.imageName || "",
      structures: Array.isArray(lesson.structures) ? lesson.structures : [],
      otherStructure: lesson.otherStructure || "",
      otherConfirmed: Boolean(lesson.otherConfirmed || lesson.otherStructure),
      details: lesson.description || lesson.details || "",
      customisation: lesson.customisation || "",
      boardCards: baseCards,
      removedUnitCardKeys,
      lessonBoardInitialized: true,
      steps: normalizeLessonSteps(lesson.steps || []),
      confirmed: Boolean(lesson.confirmed),
    };
  });
}

function normalizeLessonSteps(steps) {
  return steps.map((step) => ({
    id: step.id || uid("step"),
    type: inquiryActivityTypes.includes(step.type) ? step.type : "Connect & Wonder",
    duration: step.duration || "",
    description: step.description || "",
    evidence: step.evidence || step.customisation || "",
    customisation: step.customisation || "",
    confirmed: Boolean(step.confirmed),
  }));
}

function visibleValues(values) {
  return values.filter((value) => !hiddenPlanningCards.has(value));
}

function isVisiblePlanningCard(card) {
  return card?.label && !hiddenPlanningCards.has(card.label);
}

function sortLearningOutcomes(values) {
  return [...values].sort((a, b) => learningOutcomeNumber(a) - learningOutcomeNumber(b));
}

function learningOutcomeNumber(value) {
  return Number(value?.match(/^LO(\d+)/)?.[1] || 99);
}

function lessonCardsFromUnit(unit, removedKeys = []) {
  const removed = new Set(removedKeys);
  return (unit.boardCards || [])
    .filter((card) => !card.lessonOrigin)
    .filter((card) => lessonZoneAllowsType(lessonZoneForType(card.type), card.type))
    .filter((card) => !removed.has(cardKey(card)))
    .map((card, index) => ({
      id: uid("lesson-card"),
      type: card.type,
      label: card.label,
      value: card.value || "",
      confirmed: Boolean(card.confirmed),
      zone: lessonZoneForType(card.type),
      order: index + 1,
      inherited: true,
      unitCardKey: cardKey(card),
    }));
}

function ensureLessonInheritsUnitCards(unit, lesson) {
  if (!unit || !lesson) return;
  lesson.boardCards = uniqueLessonCards(lesson.boardCards || []);
  lesson.removedUnitCardKeys = lesson.removedUnitCardKeys || [];
  const existingKeys = new Set(lesson.boardCards.map((card) => card.unitCardKey || cardKey(card)));
  lessonCardsFromUnit(unit, lesson.removedUnitCardKeys).forEach((card) => {
    if (existingKeys.has(card.unitCardKey)) {
      const existing = lesson.boardCards.find((candidate) => (candidate.unitCardKey || cardKey(candidate)) === card.unitCardKey);
      if (existing) copyUnitCardFieldsToLessonCard(existing, card);
      return;
    }
    card.order = nextLessonCardOrder(lesson, card.zone);
    lesson.boardCards.push(card);
    existingKeys.add(card.unitCardKey);
  });
  lesson.lessonBoardInitialized = true;
}

function cardKey(card) {
  if (allowsDuplicateBoardCard(card.type, card.label) && card.id) return `${card.id}:${card.type}:${card.label}`;
  return `${card.type}:${card.label}`;
}

function createLesson(unit) {
  const number = (unit.lessons?.length || 0) + 1;
  return {
    id: uid("lesson"),
    title: `Lesson ${number}`,
    description: "",
    objectives: "",
    duration: "",
    imageDataUrl: "",
    imageName: "",
    structures: [],
    otherStructure: "",
    otherConfirmed: false,
    details: "",
    customisation: "",
    boardCards: lessonCardsFromUnit(unit),
    removedUnitCardKeys: [],
    lessonBoardInitialized: true,
    steps: [],
    confirmed: false,
  };
}

function createLessonStep() {
  return {
    id: uid("step"),
    type: "Connect & Wonder",
    duration: "",
    description: "",
    evidence: "",
    customisation: "",
    confirmed: false,
  };
}

function lessonDurationMinutes(lesson) {
  return (lesson.steps || []).reduce((total, step) => total + (Number.parseFloat(step.duration) || 0), 0);
}

function lessonDurationLabel(lesson) {
  const total = lessonDurationMinutes(lesson);
  return total ? `${total} ${total === 1 ? "minute" : "minutes"}` : "0 minutes";
}

function syncLessonDescription(lesson, value) {
  lesson.description = value;
  lesson.details = value;
}

function saveState() {
  state.plan = normalizePlanMetadata(state.plan);
  state.cardLibrary = normalizeCardLibrary(state.cardLibrary);
  savePlanToCatalog(state.plan);
  const currentWorkspace = currentWorkspaceMeta();
  saveWorkspaceToCatalog({
    id: activeWorkspaceId(),
    name: workspaceLabel(),
    type: activeWorkspaceId().startsWith(TEAM_WORKSPACE_PREFIX) ? "team" : "personal",
    role: currentWorkspace.role,
  });
  saveWorkspaceSharedLibrary();
  localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, activeWorkspaceId());
  localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, activePlanId());
  localStorage.setItem(planStateStorageKey(), JSON.stringify(state));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleCloudSave();
}

function saveStateSafely() {
  try {
    saveState();
  } catch {
    // Local browser storage can fail in private or quota-limited contexts.
  }
}

function showSaveStatus(message) {
  els.saveStatus.textContent = message;
  window.setTimeout(() => {
    els.saveStatus.textContent = "";
  }, 1600);
}

function screenFromLocation() {
  const hash = window.location.hash.replace("#", "");
  if (hash === "workspace") return "workspace";
  if (hash === "unit" || hash === "board") return "board";
  if (hash === "lesson") return "lesson";
  return "timeline";
}

function applyLocationToState() {
  const nextScreen = screenFromLocation();
  state.currentScreen = nextScreen;
  if (nextScreen === "lesson") state.lessonOverviewOpen = false;
}

function syncHistoryToScreen(options = {}) {
  if (historySyncPaused) return;
  const hash = screenHashes[state.currentScreen] || screenHashes.timeline;
  if (window.location.hash === hash) return;
  const method = options.replace ? "replaceState" : "pushState";
  window.history[method]({ screen: state.currentScreen }, "", hash);
}

function initCloudSync() {
  const config = window.__FIREBASE_CONFIG__ || {};
  const hasConfig = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
  if (!hasConfig || !window.firebase?.initializeApp) {
    cloud.available = false;
    renderLoginGate("Online sign-in is not connected on this deployment.", false);
    renderCloudStatus("Online unavailable", "Sign in", true);
    return;
  }

  try {
    window.firebase.initializeApp(config);
    cloud.available = true;
    cloud.auth = window.firebase.auth();
    cloud.db = window.firebase.firestore();
    cloud.db.settings({ ignoreUndefinedProperties: true });
    renderLoginGate("Checking sign-in...", true);
    renderCloudStatus("Checking sign-in...", "Sign in", true);
    window.clearTimeout(authStateTimer);
    authStateTimer = window.setTimeout(() => {
      if (!cloud.user && els.loginGate && !els.loginGate.classList.contains("hidden")) {
        renderLoginGate("Taking too long. Try Reset sign-in, then Continue with Google.", false);
      }
    }, 6000);
    cloud.auth.onAuthStateChanged(handleCloudUser);
  } catch (error) {
    console.warn("Firebase setup failed", error);
    cloud.available = false;
    renderLoginGate(firebaseErrorMessage(error, "Online sign-in failed to initialise."), false);
    renderCloudStatus("Online unavailable", "Sign in", true);
  }
}

async function handleCloudUser(user) {
  window.clearTimeout(authStateTimer);
  cloud.user = user;
  cloud.loaded = false;
  if (!user) {
    els.appShell.classList.add("hidden");
    els.loginGate.classList.remove("hidden");
    renderLoginGate("Sign in to open your planner.", false);
    renderCloudStatus("Not signed in", "Sign in");
    return;
  }

  renderLoginGate("Loading your planner...", true);
  renderCloudStatus("Loading cloud save...", "Sign out", true);
  try {
    await ensureCloudWorkspace(user);
    await acceptPendingInvites(user);
    await loadCloudWorkspaceCatalog();
    await loadCloudWorkspaceLibrary();
    await loadCloudPlanCatalog();
    await loadCloudState();
    cloud.loaded = true;
    state.currentScreen = "workspace";
    workspaceDirectoryWorkspaceId = "";
    els.loginGate.classList.add("hidden");
    els.appShell.classList.remove("hidden");
    render();
    renderCloudStatus(`Cloud save: ${user.displayName || user.email || "signed in"}`, "Sign out");
  } catch (error) {
    console.warn("Cloud load failed", error);
    renderLoginGate(firebaseErrorMessage(error, "Could not load your online planner. Try Reset sign-in, then sign in again."), false);
    renderCloudStatus("Cloud unavailable", "Sign out");
  }
}

async function ensureCloudWorkspace(user) {
  const workspaceId = personalWorkspaceId(user.uid);
  const workspaceRef = cloud.db.collection("workspaces").doc(workspaceId);
  const memberRef = workspaceRef.collection("members").doc(user.uid);
  const userRef = cloud.db.collection("users").doc(user.uid);
  const userSnapshot = await userRef.get();
  const existingUserData = userSnapshot.exists ? userSnapshot.data() || {} : {};
  await workspaceRef.set({
    name: "My Planner",
    schoolName: "",
    type: "personal",
    createdBy: user.uid,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  await memberRef.set({
    role: "owner",
    email: user.email || "",
    displayName: user.displayName || "",
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  await userRef.set({
    email: user.email || "",
    displayName: user.displayName || "",
    lastWorkspaceId: existingUserData.lastWorkspaceId || workspaceId,
    workspaces: {
      [workspaceId]: {
        id: workspaceId,
        name: "My Planner",
        type: "personal",
        role: "owner",
      },
    },
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  saveWorkspaceToCatalog({ id: workspaceId, name: "My Planner", type: "personal", role: "owner" });
  if (!localStorage.getItem(ACTIVE_WORKSPACE_STORAGE_KEY)) localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, workspaceId);
}

async function acceptPendingInvites(user) {
  const email = normalizeEmail(user.email || "");
  if (!email) return;
  const snapshot = await cloud.db
    .collection("planInvites")
    .where("email", "==", email)
    .where("status", "==", "pending")
    .get();
  for (const doc of snapshot.docs) {
    const invite = doc.data() || {};
    if (!invite.workspaceId || !invite.planId) continue;
    const workspaceId = invite.workspaceId;
    const planId = invite.planId;
    const role = "editor";
    await cloud.db.collection("workspaces").doc(workspaceId).collection("plans").doc(planId).collection("members").doc(user.uid).set({
      role,
      email,
      inviteId: doc.id,
      displayName: user.displayName || "",
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    await cloud.db.collection("users").doc(user.uid).set({
      workspaces: {
        [workspaceId]: {
          id: workspaceId,
          name: invite.workspaceName || "Shared Workspace",
          type: "team",
          role: "editor",
        },
      },
      accessiblePlans: {
        [`${workspaceId}__${planId}`]: {
          workspaceId,
          workspaceName: invite.workspaceName || "Shared Workspace",
          planId,
          planTitle: invite.planTitle || "Shared 2YIP",
          subject: invite.subject || "Art",
          role,
        },
      },
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    await doc.ref.set({
      status: "accepted",
      acceptedBy: user.uid,
      acceptedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }
}

async function loadCloudWorkspaceCatalog() {
  const userSnapshot = await cloud.db.collection("users").doc(cloud.user.uid).get();
  const userData = userSnapshot.exists ? userSnapshot.data() || {} : {};
  const workspaces = userData.workspaces || {};
  userAccessiblePlans = Object.values(userData.accessiblePlans || {});
  const personalWorkspace = { id: personalWorkspaceId(cloud.user.uid), name: "My Planner", type: "personal", role: "owner" };
  const cloudWorkspaces = [personalWorkspace, ...Object.values(workspaces).filter((workspace) => workspace?.id !== personalWorkspace.id)];
  workspaceCatalog = cloudWorkspaces.map((workspace) => normalizeWorkspaceMetadata(workspace));
  saveWorkspaceCatalog();
  const allowedIds = new Set(workspaceCatalog.map((workspace) => workspace.id));
  const preferredId = allowedIds.has(userData.lastWorkspaceId) ? userData.lastWorkspaceId : personalWorkspace.id;
  const activeId = activeWorkspaceId();
  if (!allowedIds.has(activeId)) localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, preferredId);
}

async function loadCloudWorkspaceLibrary() {
  if (!canManageActiveWorkspace()) {
    setWorkspaceSharedLibrary(loadWorkspaceSharedLibrary());
    return;
  }
  const workspaceSnapshot = await cloud.db.collection("workspaces").doc(cloudWorkspaceId()).get();
  const sharedLibrary = workspaceSnapshot.exists ? workspaceSnapshot.data()?.sharedCardLibrary : null;
  setWorkspaceSharedLibrary(sharedLibrary || loadWorkspaceSharedLibrary());
  if (!sharedLibrary && canManageActiveWorkspace()) await saveCloudWorkspaceLibrary();
}

function ensureWorkspaceDirectoryLoaded() {
  if (!cloud.loaded || !cloud.db) return;
  if (!canManageActiveWorkspace()) return;
  const workspaceId = activeWorkspaceId();
  if (workspaceDirectoryWorkspaceId === workspaceId || workspaceDirectoryLoading) return;
  workspaceDirectoryLoading = true;
  loadCloudWorkspaceDirectory(workspaceId)
    .catch((error) => {
      console.warn("Workspace directory load failed", error);
      workspaceMembers = [];
      workspaceInvites = [];
    })
    .finally(() => {
      workspaceDirectoryWorkspaceId = workspaceId;
      workspaceDirectoryLoading = false;
      render();
    });
}

async function loadCloudWorkspaceDirectory(workspaceId = activeWorkspaceId()) {
  const membersSnapshot = await cloud.db.collection("workspaces").doc(workspaceId).collection("members").get();
  workspaceMembers = membersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  workspaceInvites = [];
  if (canManageActiveWorkspace()) {
    const invitesSnapshot = await cloud.db
      .collection("planInvites")
      .where("workspaceId", "==", workspaceId)
      .where("status", "==", "pending")
      .get();
    workspaceInvites = invitesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

async function saveCloudWorkspaceLibrary() {
  if (!cloud.available || !cloud.user || !cloud.db) return;
  if (!canManageActiveWorkspace()) return;
  await cloud.db.collection("workspaces").doc(cloudWorkspaceId()).set({
    sharedCardLibrary: normalizeCardLibrary(workspaceSharedLibrary, { includeShared: true }),
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

async function loadCloudPlanCatalog() {
  const workspaceId = cloudWorkspaceId();
  const loadedPlans = [];
  const plansRef = cloud.db.collection("workspaces").doc(cloudWorkspaceId()).collection("plans");
  if (canManageActiveWorkspace()) {
    const snapshot = await plansRef.get();
    snapshot.forEach((doc) => {
      loadedPlans.push(normalizePlanMetadata({
        id: doc.id,
        title: doc.data()?.title || doc.data()?.state?.plan?.title || "Untitled Plan",
        subject: doc.data()?.subject || doc.data()?.state?.plan?.subject || "Art",
        teamId: doc.data()?.teamId || doc.data()?.state?.plan?.teamId || "",
        teamName: doc.data()?.teamName || doc.data()?.state?.plan?.teamName || "",
        workspaceId,
        role: "owner",
      }));
    });
  } else {
    const sharedPlans = userAccessiblePlans.filter((plan) => plan.workspaceId === cloudWorkspaceId());
    for (const sharedPlan of sharedPlans) {
      const snapshot = await plansRef.doc(sharedPlan.planId).get();
      if (snapshot.exists) {
        loadedPlans.push(normalizePlanMetadata({
          id: snapshot.id,
          title: snapshot.data()?.title || sharedPlan.planTitle,
          subject: snapshot.data()?.subject || sharedPlan.subject,
          teamId: snapshot.data()?.teamId || snapshot.data()?.state?.plan?.teamId || "",
          teamName: snapshot.data()?.teamName || snapshot.data()?.state?.plan?.teamName || "",
          workspaceId,
          role: sharedPlan.role || "editor",
        }));
      }
    }
  }
  planCatalog = [
    ...planCatalog.filter((plan) => plan.workspaceId !== workspaceId),
    ...loadedPlans,
  ];
  savePlanCatalog();
  const nextPlan = firstPlanForActiveWorkspace();
  if (nextPlan && !plansForActiveWorkspace().some((plan) => plan.id === activePlanId())) {
    localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, nextPlan.id);
  }
}

async function loadCloudState() {
  if (!firstPlanForActiveWorkspace()) return;
  const planRef = cloudPlanRef();
  const snapshot = await planRef.get();
  const remoteState = snapshot.exists ? snapshot.data()?.state : null;
  if (remoteState && Array.isArray(remoteState.units)) {
    cloudSyncPaused = true;
    state = normalizeState(remoteState);
    state.plan = normalizePlanMetadata({
      ...state.plan,
      id: snapshot.id,
      title: snapshot.data()?.title || state.plan.title,
      subject: snapshot.data()?.subject || state.plan.subject,
      teamId: snapshot.data()?.teamId || state.plan.teamId,
      teamName: snapshot.data()?.teamName || state.plan.teamName,
      role: planMetaById(snapshot.id)?.role || state.plan.role,
    });
    savePlanToCatalog(state.plan);
    localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, activePlanId());
    localStorage.setItem(planStateStorageKey(), JSON.stringify(state));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    cloudSyncPaused = false;
    render();
    return;
  }
  await saveCloudStateNow();
}

function scheduleCloudSave() {
  if (cloudSyncPaused || !cloud.available || !cloud.user || !cloud.loaded || !cloud.db) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(saveCloudStateNow, 900);
}

async function saveCloudStateNow() {
  if (!cloud.available || !cloud.user || !cloud.db) return;
  if (!planMetaById(activePlanId())) return;
  try {
    const cleanState = cleanCloudState(state);
    await cloudPlanRef().set({
      title: activePlanTitle(),
      subject: state.plan?.subject || "Art",
      teamId: state.plan?.teamId || "",
      teamName: state.plan?.teamName || "",
      workspaceId: activeWorkspaceId(),
      state: cleanState,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    renderCloudStatus(`Cloud saved: ${cloud.user.displayName || cloud.user.email || "signed in"}`, "Sign out");
  } catch (error) {
    console.warn("Cloud save failed", error);
    renderCloudStatus(`Cloud save failed: ${error.code || error.message || "check rules"}`, "Sign out");
  }
}

function cleanCloudState(value) {
  return JSON.parse(JSON.stringify(value));
}

function cloudPlanRef() {
  return cloudPlanRefFor(activePlanId());
}

function cloudPlanRefFor(planId) {
  return cloud.db
    .collection("workspaces")
    .doc(cloudWorkspaceId())
    .collection("plans")
    .doc(planId || CLOUD_PLAN_ID);
}

function cloudWorkspaceId() {
  return activeWorkspaceId();
}

function personalWorkspaceId(uid = cloud.user?.uid || "local") {
  return `${CLOUD_WORKSPACE_PREFIX}-${uid}`;
}

function activeWorkspaceId() {
  return localStorage.getItem(ACTIVE_WORKSPACE_STORAGE_KEY) || personalWorkspaceId();
}

function activePlanId() {
  return state.plan?.id || CLOUD_PLAN_ID;
}

function activePlanTitle() {
  return state.plan?.title || "Main 2YIP";
}

function renderCloudStatus(status, buttonLabel, disabled = false) {
  if (!els.cloudPanel) return;
  cloud.status = status;
  els.cloudStatus.textContent = status;
  els.cloudAuth.textContent = buttonLabel;
  els.cloudAuth.disabled = disabled && buttonLabel !== "Sign in";
  els.cloudPanel.classList.toggle("online", Boolean(cloud.user));
}

function renderLoginGate(message, disabled = false) {
  if (!els.loginGate) return;
  els.loginStatus.textContent = message;
  els.loginGoogle.disabled = disabled;
}

async function toggleCloudAuth() {
  if (!cloud.available || !cloud.auth) {
    renderLoginGate("Online sign-in is unavailable here. Open the Vercel site and check Firebase setup.", false);
    renderCloudStatus("Firebase not connected yet", "Sign in");
    return;
  }
  if (cloud.user) {
    await cloud.auth.signOut();
    return;
  }
  const provider = new window.firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    renderLoginGate("Opening Google sign-in...", true);
    await cloud.auth.signInWithPopup(provider);
  } catch (error) {
    console.warn("Popup sign-in failed; trying redirect", error);
    if (error?.code === "auth/unauthorized-domain") {
      renderLoginGate(firebaseErrorMessage(error), false);
      return;
    }
    try {
      renderLoginGate("Redirecting to Google sign-in...", true);
      await cloud.auth.signInWithRedirect(provider);
    } catch (redirectError) {
      console.warn("Redirect sign-in failed", redirectError);
      renderLoginGate(firebaseErrorMessage(redirectError), false);
    }
  }
}

async function resetCloudSignIn() {
  renderLoginGate("Resetting sign-in...", true);
  try {
    if (cloud.auth) await cloud.auth.signOut();
  } catch (error) {
    console.warn("Sign-out reset failed", error);
  }
  try {
    window.sessionStorage.clear();
  } catch (error) {
    console.warn("Session reset failed", error);
  }
  renderLoginGate("Sign-in reset. Try Continue with Google again.", false);
}

function firebaseErrorMessage(error, fallback = "Google sign-in failed. Try again.") {
  const code = error?.code || "";
  if (code === "auth/unauthorized-domain") {
    return "This website domain is not authorised in Firebase Authentication.";
  }
  if (code === "auth/popup-blocked") {
    return "The Google pop-up was blocked. Allow pop-ups or try again.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "The Google sign-in window was closed before finishing.";
  }
  if (code === "permission-denied" || code === "firestore/permission-denied") {
    return "Online save is blocked by Firebase rules. Publish the latest Firestore rules.";
  }
  return error?.message ? `${fallback} (${code || error.message})` : fallback;
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function selectedUnit() {
  return state.units.find((unit) => unit.id === state.selectedUnitId) || state.units[0];
}

function selectedLesson(unit = selectedUnit()) {
  if (!unit) return null;
  return unit.lessons?.find((lesson) => lesson.id === state.selectedLessonId) || null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function snap(value, size = BOARD_SNAP) {
  return Math.round(value / size) * size;
}

function weekWidth() {
  const style = getComputedStyle(document.documentElement);
  return Number.parseFloat(style.getPropertyValue("--week")) || 36;
}

function timelineLaneLabelWidth() {
  const style = getComputedStyle(document.documentElement);
  return Number.parseFloat(style.getPropertyValue("--lane-label")) || 88;
}

function lessonWeekCount(unit) {
  return unit.lessons?.length || 0;
}

function unitTimelineDuration(unit) {
  return Math.max(1, lessonWeekCount(unit));
}

function unitLessonDurationLabel(unit) {
  return unitLessonCountLabel(unit);
}

function unitLessonCountLabel(unit) {
  const count = lessonWeekCount(unit);
  return `${count} ${count === 1 ? "lesson" : "lessons"}`;
}

function syncUnitDurationToLessons(unit) {
  unit.duration = Math.max(1, lessonWeekCount(unit));
}

function removeUnitFromTimeline(unitId) {
  const unit = state.units.find((candidate) => candidate.id === unitId);
  if (!unit) return;
  const year = timelineYearForStart(unit.start);
  unit.inTimeline = false;
  packTimelineYear(year);
  saveState();
  render();
}

function timelineYearForStart(start) {
  return start > YEAR_WEEK_COUNT ? 2 : 1;
}

function timelineYearStart(year) {
  return year === 2 ? YEAR_WEEK_COUNT + 1 : 1;
}

function timelineLocalWeek(start) {
  return ((start - 1) % YEAR_WEEK_COUNT) + 1;
}

function clampUnitStartInYear(unit, year, localWeek = timelineLocalWeek(unit.start)) {
  const yearStart = timelineYearStart(year);
  const maxLocalStart = Math.max(1, YEAR_WEEK_COUNT - unitTimelineDuration(unit) + 1);
  return yearStart + clamp(localWeek, 1, maxLocalStart) - 1;
}

function packTimelineYear(year) {
  const units = state.units
    .filter((unit) => unit.inTimeline !== false && timelineYearForStart(unit.start) === year)
    .sort((a, b) => timelineLocalWeek(a.start) - timelineLocalWeek(b.start));
  let cursor = 1;
  units.forEach((unit) => {
    unit.start = clampUnitStartInYear(unit, year, cursor);
    cursor += unitTimelineDuration(unit);
  });
}

function packAllTimelineYears() {
  for (let year = 1; year <= YEAR_COUNT; year += 1) packTimelineYear(year);
}

function render() {
  syncHistoryToScreen();
  renderScreens();
  renderPlanControls();
  renderWorkspaceHome();
  renderUnitList();
  renderUnitSetup();
  renderPlanSetup();
  renderWorkspaceSetup();
  renderLibrary();
  renderTimelineGrid();
  renderUnits();
  renderHealth();
  renderBoard();
  renderLessonBoard();
  renderEditor();
  renderOverlayButtons();
  if (state.currentScreen === "workspace") {
    saveWorkspaceCatalog();
    savePlanCatalog();
    saveWorkspaceSharedLibrary();
  } else {
    saveState();
  }
}

function renderScreens() {
  const showWorkspace = state.currentScreen === "workspace";
  const showTimeline = state.currentScreen === "timeline";
  const showBoard = state.currentScreen === "board";
  const showLesson = state.currentScreen === "lesson";
  els.workspaceScreen.classList.toggle("hidden", !showWorkspace);
  els.plannerWorkspace.classList.toggle("hidden", showWorkspace);
  els.timelineScreen.classList.toggle("hidden", !showTimeline);
  els.boardScreen.classList.toggle("hidden", !showBoard);
  els.lessonScreen.classList.toggle("hidden", !showLesson);
  els.workspace.classList.toggle("timeline-mode", showTimeline);
  els.cardLibraryPanel.classList.toggle("hidden", showTimeline);
  els.workspaceHome.classList.toggle("hidden", showWorkspace);
  els.modeSwitch.classList.toggle("hidden", showWorkspace);
  els.resetDemo.classList.toggle("hidden", showWorkspace);
  els.plannerKicker.textContent = showWorkspace ? "Workspace" : workspaceLabel();
  els.plannerTitle.textContent = showWorkspace ? "Art Curriculum Planner" : activePlanTitle();
  els.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === state.currentScreen);
  });
}

function renderUnitList() {
  els.unitList.innerHTML = "";
  state.units
    .slice()
    .sort((a, b) => a.start - b.start)
    .forEach((unit) => {
      const item = document.createElement("div");
      item.className = "unit-list-item";
      if (unit.id === state.selectedUnitId) item.classList.add("active");
      if (unit.inTimeline === false) item.classList.add("not-in-timeline");
      item.setAttribute("role", "button");
      item.tabIndex = 0;
      item.draggable = state.currentScreen === "timeline";
      item.dataset.unitId = unit.id;
      item.innerHTML = `
        <div class="unit-list-copy">
          <span class="unit-list-title">${escapeHtml(unit.title || "Untitled Unit")}</span>
          <span class="unit-list-meta">${unit.inTimeline === false ? "Not in 2YIP" : unitLessonDurationLabel(unit)}</span>
        </div>
      `;
      item.addEventListener("click", (event) => {
        state.selectedUnitId = unit.id;
        if (state.currentScreen === "timeline") {
          render();
          return;
        }
        if (state.currentScreen === "lesson") {
          state.selectedLessonId = unit.lessons?.[0]?.id || "";
          state.lessonOverviewOpen = false;
          render();
          return;
        }
        state.currentScreen = "board";
        boardHeaderEditing = { title: false, performanceTask: false };
        render();
      });
      item.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        item.click();
      });
      item.addEventListener("dragstart", (event) => {
        if (state.currentScreen !== "timeline") return;
        dragPayload = { kind: "timelineUnit", unitId: unit.id };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
        event.dataTransfer.effectAllowed = "move";
      });
      item.addEventListener("dragend", () => {
        dragPayload = null;
      });
      els.unitList.append(item);
    });
}

function renderUnitSetup() {
  if (!els.unitSetupModal) return;
  els.unitSetupModal.classList.toggle("hidden", !unitSetupOpen);
  if (!unitSetupOpen) return;
  els.newUnitBigIdeas.innerHTML = libraryItemsByType("bigIdeas")
    .map((idea, index) => `
      <label class="setup-checkbox">
        <input type="checkbox" name="new-unit-big-idea" value="${escapeAttr(idea)}" ${index === 0 ? "checked" : ""} />
        <span>${escapeHtml(idea)}</span>
      </label>
    `)
    .join("");
}

function renderPlanControls() {
  if (!workspaceCatalog.some((workspace) => workspace.id === activeWorkspaceId())) {
    saveWorkspaceToCatalog({ id: activeWorkspaceId(), name: workspaceLabel(), type: activeWorkspaceId().startsWith(TEAM_WORKSPACE_PREFIX) ? "team" : "personal", role: currentWorkspaceRole() });
  }
  savePlanToCatalog(state.plan);
  if (!els.planSelect || !els.workspaceSelect) return;
  els.workspaceSelect.innerHTML = workspaceCatalog
    .map((workspace) => `<option value="${escapeAttr(workspace.id)}">${escapeHtml(workspaceOptionLabel(workspace))}</option>`)
    .join("");
  els.workspaceSelect.value = activeWorkspaceId();
  els.planSelect.innerHTML = plansForActiveWorkspace()
    .map((plan) => `<option value="${escapeAttr(plan.id)}">${escapeHtml(planOptionLabel(plan))}</option>`)
    .join("");
  els.planSelect.value = activePlanId();
}

function workspaceOptionLabel(workspace) {
  const meta = normalizeWorkspaceMetadata(workspace);
  return `${meta.name || "Workspace"}${meta.type === "team" ? " · Team" : ""}`;
}

function planOptionLabel(plan) {
  const meta = normalizePlanMetadata(plan);
  return [meta.title || "Untitled Plan", meta.subject, meta.teamName].filter(Boolean).join(" · ");
}

function renderWorkspaceHome() {
  if (!els.workspaceScreen) return;
  if (state.currentScreen !== "workspace") return;
  ensureWorkspaceDirectoryLoaded();
  const activeWorkspace = currentWorkspaceMeta();
  els.workspacePlanHeading.textContent = `${activeWorkspace.name || "Workspace"} Plans`;
  els.workspaceCardGrid.innerHTML = workspaceCatalog
    .map((workspace) => {
      const meta = normalizeWorkspaceMetadata(workspace);
      const selected = meta.id === activeWorkspaceId() ? " selected" : "";
      return `
        <button class="workspace-card${selected}" type="button" data-workspace-id="${escapeAttr(meta.id)}">
          <span class="workspace-card-eyebrow">${escapeHtml(meta.type === "team" ? "Team Workspace" : "Personal Workspace")}</span>
          <strong>${escapeHtml(meta.name || "Workspace")}</strong>
          <small>${escapeHtml(meta.role === "owner" ? "Owner" : "Editor")}</small>
        </button>
      `;
    })
    .join("");
  const newWorkspaceCard = document.createElement("button");
  newWorkspaceCard.className = "workspace-card create-card";
  newWorkspaceCard.type = "button";
  newWorkspaceCard.innerHTML = `<span class="workspace-card-eyebrow">New Team</span><strong>Create Team Workspace</strong><small>Invite colleagues by email</small>`;
  newWorkspaceCard.addEventListener("click", openWorkspaceSetup);
  els.workspaceCardGrid.append(newWorkspaceCard);
  els.workspaceCardGrid.querySelectorAll("[data-workspace-id]").forEach((button) => {
    button.addEventListener("click", () => switchWorkspace(button.dataset.workspaceId));
  });

  const plans = plansForActiveWorkspace();
  els.planCardGrid.innerHTML = plans
    .map((plan) => {
      const meta = normalizePlanMetadata(plan);
      const pendingInvites = workspaceInvites.filter((invite) => invite.planId === meta.id);
      const inviteHtml = pendingInvites.length
        ? `<div class="plan-invite-list">${pendingInvites.map((invite) => `
          <span class="plan-invite-pill">
            ${escapeHtml(invite.email || "Pending")}
            <button type="button" data-invite-id="${escapeAttr(invite.id)}" class="plan-invite-remove">x</button>
          </span>
        `).join("")}</div>`
        : "";
      const shareHtml = canManagePlanSharing()
        ? `
          <div class="plan-share-row">
            <input class="text-input plan-share-email" type="email" placeholder="teacher@email.com" data-plan-id="${escapeAttr(meta.id)}" />
            <button class="ghost-button plan-share-button" type="button" data-plan-id="${escapeAttr(meta.id)}">Share</button>
          </div>
          ${inviteHtml}
        `
        : "";
      return `
        <article class="plan-card" data-plan-id="${escapeAttr(meta.id)}">
          <span class="workspace-card-eyebrow">${escapeHtml(meta.subject || "Subject")}</span>
          <strong>${escapeHtml(meta.title || "Untitled Plan")}</strong>
          <small>${escapeHtml(meta.role === "owner" ? "Owner" : "Editor")} · ${escapeHtml(activeWorkspace.name || "Workspace")}</small>
          <div class="plan-card-actions">
            <button class="primary-button open-plan-button" type="button" data-plan-id="${escapeAttr(meta.id)}">Open</button>
          </div>
          ${shareHtml}
        </article>
      `;
    })
    .join("");
  if (canManageActiveWorkspace()) {
    const newPlanCard = document.createElement("button");
    newPlanCard.className = "plan-card create-card";
    newPlanCard.type = "button";
    newPlanCard.innerHTML = `<span class="workspace-card-eyebrow">New 2YIP</span><strong>Create 2YIP Plan</strong><small>Title and subject</small>`;
    newPlanCard.addEventListener("click", openPlanSetup);
    els.planCardGrid.append(newPlanCard);
  }
  els.planCardGrid.querySelectorAll(".open-plan-button").forEach((button) => {
    button.addEventListener("click", () => openWorkspacePlan(button.dataset.planId));
  });
  els.planCardGrid.querySelectorAll(".plan-share-button").forEach((button) => {
    button.addEventListener("click", () => {
      const input = [...els.planCardGrid.querySelectorAll(".plan-share-email")].find((candidate) => candidate.dataset.planId === button.dataset.planId);
      createPlanInvite(button.dataset.planId, input?.value || "");
    });
  });
  els.planCardGrid.querySelectorAll(".plan-share-email").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      createPlanInvite(input.dataset.planId, input.value);
    });
  });
  els.planCardGrid.querySelectorAll(".plan-invite-remove").forEach((button) => {
    button.addEventListener("click", () => removePlanInvite(button.dataset.inviteId));
  });

  renderWorkspaceDirectory();
}

function renderWorkspaceDirectory() {
  els.teamManagementPanel.classList.add("hidden");
}

function openPlanSetup() {
  if (!canManageActiveWorkspace()) return;
  planSetupOpen = true;
  els.newPlanTitle.value = "";
  els.newPlanSubject.value = "Art";
  if (els.newPlanTeam) els.newPlanTeam.value = "";
  render();
  window.setTimeout(() => els.newPlanTitle.focus(), 0);
}

function openWorkspaceSetup() {
  workspaceSetupOpen = true;
  els.newWorkspaceName.value = "";
  render();
  window.setTimeout(() => els.newWorkspaceName.focus(), 0);
}

async function openWorkspacePlan(planId) {
  if (!planId) return;
  if (planId === activePlanId()) {
    state.currentScreen = "timeline";
    state.unitOverviewOpen = false;
    state.lessonOverviewOpen = false;
    render();
    return;
  }
  await switchPlan(planId, { targetScreen: "timeline" });
}

function renderPlanSetup() {
  if (!els.planSetupModal) return;
  els.planSetupModal.classList.toggle("hidden", !planSetupOpen);
}

function renderWorkspaceSetup() {
  if (!els.workspaceSetupModal) return;
  els.workspaceSetupModal.classList.toggle("hidden", !workspaceSetupOpen);
}

function renderLibrary() {
  els.library.innerHTML = "";
  els.lessonNavPanel.classList.toggle("hidden", state.currentScreen !== "lesson");
  if (state.currentScreen === "lesson") {
    const unit = selectedUnit();
    const lesson = selectedLesson(unit);
    renderLessonPicker(els.lessonNavList, unit, { includeAdd: true });
    els.libraryEyebrow.textContent = "Cards";
    els.libraryTitle.textContent = lessonZoneLabel(state.selectedLessonZone);
    renderLessonCardLibrary(unit, lesson);
    return;
  }
  els.lessonNavList.innerHTML = "";
  const activeZone = state.currentScreen === "board" ? state.selectedBoardZone : null;
  els.libraryEyebrow.textContent = activeZone ? "Cards For" : "Cards";
  els.libraryTitle.textContent = activeZone ? boardZoneLabel(activeZone) : "Drag Into Units";

  activeCardLibrary().forEach((category) => {
    const entries = category.items
      .map((entry) => normalizeLibraryEntry(category, entry))
      .filter((entry) => entry.type !== "teachingMoves")
      .filter((entry) => !activeZone || zoneAllowsType(activeZone, entry.type));

    if (!entries.length) return;

    const wrapper = createLibraryCategory(category.title, `unit:${activeZone || "all"}:${category.title}`);

    entries.forEach(({ label, type }) => {
      const item = document.createElement("button");
      item.className = "library-item";
      item.type = "button";
      item.textContent = label;
      item.draggable = true;
      item.dataset.type = type;
      item.dataset.label = label;
      item.addEventListener("dragstart", (event) => {
        dragPayload = { type, label };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
        event.dataTransfer.effectAllowed = "copy";
      });
      item.addEventListener("dragend", () => {
        dragPayload = null;
      });
      item.addEventListener("click", () => {
        const unit = selectedUnit();
        if (!unit) return;
        if (state.currentScreen === "board") {
          addBoardCard(unit, { type, label }, { zone: state.selectedBoardZone });
        } else {
          addLibraryItemToUnit(unit, { type, label });
        }
      });
      wrapper.querySelector(".library-category-content").append(item);
    });

    els.library.append(wrapper);
  });

  if (!els.library.children.length) {
    els.library.innerHTML = `<p class="library-empty">Select a planning window to see the cards that belong there.</p>`;
  }
}

function normalizeLibraryEntry(category, entry) {
  return {
    label: typeof entry === "string" ? entry : entry.label,
    type: typeof entry === "string" ? category.type : entry.type,
  };
}

function createLibraryCategory(title, key) {
  const collapsed = Boolean(state.collapsedCategories[key]);
  const wrapper = document.createElement("section");
  wrapper.className = "library-category";
  if (collapsed) wrapper.classList.add("collapsed");
  wrapper.innerHTML = `
    <button class="library-category-toggle" type="button" aria-expanded="${String(!collapsed)}">
      <span>${escapeHtml(title)}</span>
      <span class="library-category-icon" aria-hidden="true">${collapsed ? "+" : "-"}</span>
    </button>
    <div class="library-category-content"></div>
  `;
  wrapper.querySelector(".library-category-toggle").addEventListener("click", () => {
    state.collapsedCategories[key] = !state.collapsedCategories[key];
    renderLibrary();
    saveState();
  });
  return wrapper;
}

function boardZoneLabel(zone) {
  return boardZoneDefinitions().find((definition) => definition.key === zone)?.label || "Selected Window";
}

function boardZoneDefinitions() {
  return [
    { key: "meaning", label: "Meaning Core" },
    { key: "content", label: "Learning Content" },
    { key: "core", label: "Core Learning Experience" },
    { key: "alignment", label: "Curricular Goals / CPA Alignment" },
  ];
}

function renderTimelineGrid() {
  els.timelineGrid.innerHTML = "";

  const corner = document.createElement("div");
  corner.className = "timeline-corner";
  corner.textContent = "Year";
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1 / span 2";
  els.timelineGrid.append(corner);

  for (let term = 1; term <= 4; term += 1) {
    const cell = document.createElement("div");
    cell.className = "term-cell";
    cell.textContent = `Term ${term}`;
    cell.style.gridColumn = `${termWeekColumn(term)} / span ${TERM_WEEK_COUNT}`;
    cell.style.gridRow = "1";
    els.timelineGrid.append(cell);
  }

  for (let week = 1; week <= YEAR_WEEK_COUNT; week += 1) {
    const cell = document.createElement("div");
    cell.className = "week-cell";
    cell.textContent = String(((week - 1) % TERM_WEEK_COUNT) + 1);
    cell.style.gridColumn = `${week + 1} / span 1`;
    cell.style.gridRow = "2";
    els.timelineGrid.append(cell);
  }

  for (let year = 1; year <= YEAR_COUNT; year += 1) {
    const label = document.createElement("div");
    label.className = "year-cell";
    label.textContent = `Sec ${year}`;
    label.style.gridColumn = "1";
    label.style.gridRow = `${year + 2}`;
    els.timelineGrid.append(label);

    const cell = document.createElement("div");
    cell.className = "timeline-lane-row";
    cell.dataset.year = String(year);
    cell.style.gridColumn = `2 / span ${YEAR_WEEK_COUNT}`;
    cell.style.gridRow = `${year + 2}`;
    els.timelineGrid.append(cell);
  }
}

function termWeekColumn(term) {
  return (term - 1) * TERM_WEEK_COUNT + 2;
}

function renderUnits() {
  els.unitLayer.innerHTML = "";
  packAllTimelineYears();
  const overlaps = findOverlaps();
  const width = weekWidth();

  state.units
    .slice()
    .filter((unit) => unit.inTimeline !== false)
    .sort((a, b) => a.start - b.start)
    .forEach((unit) => {
      const year = timelineYearForStart(unit.start);
      unit.start = clampUnitStartInYear(unit, year);
      const block = document.createElement("article");
      block.className = "unit-block";
      if (unitTimelineDuration(unit) <= 2) block.classList.add("compact");
      if (unit.id === state.selectedUnitId) block.classList.add("selected");
      if (overlaps.has(unit.id)) block.classList.add("overlap");
      block.setAttribute("draggable", "true");
      block.dataset.unitId = unit.id;
      block.title = `${unit.title || "Untitled Unit"} · Sec ${year} · ${timelineWeekRangeLabel(unit)}`;
      block.style.left = `${timelineLaneLabelWidth() + (timelineLocalWeek(unit.start) - 1) * width + 4}px`;
      block.style.width = `${unitTimelineDuration(unit) * width - 8}px`;
      block.style.top = `${TIMELINE_HEADER_HEIGHT + (year - 1) * TIMELINE_LANE_HEIGHT + 10}px`;
      block.style.height = `${TIMELINE_LANE_HEIGHT - 20}px`;
      block.innerHTML = `
        <button class="unit-block-delete" data-unit-id="${escapeAttr(unit.id)}" type="button" title="Remove from 2YIP" aria-label="Remove ${escapeAttr(unit.title || "unit")} from 2YIP">×</button>
        <span class="unit-short-code">${escapeHtml(unitTimelineDuration(unit))}L</span>
        <div class="unit-title">
          <span>${escapeHtml(unit.title || "Untitled Unit")}</span>
          <span class="unit-meta">${unitLessonCountLabel(unit)}</span>
        </div>
        <div class="unit-meta">Sec ${year} • ${timelineWeekRangeLabel(unit)}</div>
        ${unit.artTask ? `<p class="unit-task">${escapeHtml(unit.artTask)}</p>` : ""}
      `;

      const removeButton = block.querySelector(".unit-block-delete");
      removeButton.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
      });
      removeButton.addEventListener("dragstart", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      removeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        removeUnitFromTimeline(unit.id);
      });
      block.addEventListener("click", (event) => {
        if (event.target.closest(".unit-block-delete")) return;
        state.selectedUnitId = unit.id;
        render();
      });
      block.addEventListener("dragstart", (event) => {
        if (event.target.closest(".unit-block-delete")) {
          event.preventDefault();
          return;
        }
        dragPayload = { kind: "timelineUnit", unitId: unit.id };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
        event.dataTransfer.effectAllowed = "move";
      });
      block.addEventListener("dragend", () => {
        dragPayload = null;
      });
      block.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".unit-block-delete")) return;
        startTimelinePointer(event, unit, block);
      });
      els.unitLayer.append(block);
    });
}

function timelineWeekRangeLabel(unit) {
  const start = timelineLocalWeek(unit.start);
  const end = start + unitTimelineDuration(unit) - 1;
  const startPoint = termWeekLabel(start);
  const endPoint = termWeekLabel(end);
  if (start === end) return `T${startPoint.term}W${startPoint.week}`;
  if (startPoint.term === endPoint.term) return `T${startPoint.term}W${startPoint.week}-${endPoint.week}`;
  return `T${startPoint.term}W${startPoint.week}-T${endPoint.term}W${endPoint.week}`;
}

function termWeekLabel(localWeek) {
  const clampedWeek = clamp(localWeek, 1, YEAR_WEEK_COUNT);
  return {
    term: Math.floor((clampedWeek - 1) / TERM_WEEK_COUNT) + 1,
    week: ((clampedWeek - 1) % TERM_WEEK_COUNT) + 1,
  };
}

function renderBoard() {
  const unit = selectedUnit();
  if (!unit) {
    renderEmptyUnitBoard();
    return;
  }
  els.unitBoardLanding.classList.add("hidden");
  els.boardHeading.classList.remove("hidden");
  els.unitBoard.classList.remove("hidden");
  els.mobileBoardTabs.classList.remove("hidden");
  els.mobileUnitCardPicker.classList.remove("hidden");
  els.lessonBoard.classList.remove("hidden");
  if (!document.querySelector(`.board-zone[data-zone="${state.selectedBoardZone}"]`)) {
    state.selectedBoardZone = "meaning";
  }
  renderBoardHeader(unit);
  const showOverview = Boolean(state.unitOverviewOpen);
  els.boardHeading.classList.toggle("hidden", showOverview);
  els.unitBoard.classList.toggle("hidden", showOverview);
  els.mobileBoardTabs.classList.toggle("hidden", showOverview);
  els.mobileUnitCardPicker.classList.toggle("hidden", showOverview);
  els.lessonBoard.classList.toggle("hidden", showOverview);
  els.unitOverview.classList.toggle("hidden", !showOverview);
  els.clearBoard.classList.toggle("hidden", showOverview);
  els.arrangeBoard.classList.toggle("hidden", showOverview);
  if (showOverview) {
    renderUnitOverview(unit);
    return;
  }
  updateBoardZoneSelection();
  els.boardZones.forEach((zone) => {
    zone.querySelector(".zone-cards").innerHTML = "";
  });

  unit.boardCards
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach((card) => {
    const node = document.createElement("article");
    node.className = "board-card";
    if (isTextCard(card.type) && card.confirmed && card.value?.trim()) node.classList.add("text-card-confirmed");
    if (card.expanded) node.classList.add("expanded");
    node.dataset.type = card.type;
    node.dataset.cardId = card.id;
    node.draggable = true;
    node.innerHTML = `
      <button class="board-card-remove" type="button" title="Remove card">x</button>
      <div class="board-card-type">${escapeHtml(cardTypeLabel(card.type, card))}</div>
      ${isTextCard(card.type) ? "" : `<div class="board-card-title">${escapeHtml(card.label)}</div>`}
      ${isTextCard(card.type) ? textCardContent(card) : ""}
    `;
    node.querySelector(".board-card-remove").addEventListener("click", (event) => {
      event.stopPropagation();
      removeBoardCard(unit, card);
      render();
    });
    node.addEventListener("click", (event) => {
      event.stopPropagation();
      const cardZone = card.zone || zoneForType(card.type);
      if (state.selectedBoardZone !== cardZone && !event.target.closest("textarea, button, input")) {
        state.selectedBoardZone = cardZone;
        render();
      }
    });
    node.addEventListener("dragstart", (event) => {
      if (event.target.closest("textarea, button, input")) {
        event.preventDefault();
        return;
      }
      dragPayload = { kind: "boardCard", cardId: card.id };
      event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
      event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
      event.dataTransfer.effectAllowed = "move";
      node.classList.add("dragging");
    });
    node.addEventListener("dragend", () => {
      node.classList.remove("dragging");
      dragPayload = null;
    });
    const textInput = node.querySelector(".board-card-text");
    if (textInput) {
      textInput.addEventListener("input", (event) => {
        card.value = event.target.value;
        syncMeaningTextCardsToUnit(unit);
        syncUnitCardToLessons(unit, card);
        renderExportPreview(unit);
        saveState();
      });
    }
    const confirmButton = node.querySelector(".board-card-confirm");
    if (confirmButton) {
      confirmButton.addEventListener("click", (event) => {
        event.stopPropagation();
        card.confirmed = true;
        syncMeaningTextCardsToUnit(unit);
        syncUnitCardToLessons(unit, card);
        render();
      });
    }
    const editButton = node.querySelector(".board-card-edit");
    if (editButton) {
      editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        card.confirmed = false;
        syncUnitCardToLessons(unit, card);
        render();
      });
    }
    const expandButton = node.querySelector(".board-card-expand");
    if (expandButton) {
      expandButton.addEventListener("click", (event) => {
        event.stopPropagation();
        card.expanded = !card.expanded;
        render();
      });
    }
    const zone = document.querySelector(`.board-zone[data-zone="${card.zone || zoneForType(card.type)}"] .zone-cards`);
    zone?.append(node);
  });
  renderSuggestions(unit);
  renderLessons(unit);
  renderMobileBoardTabs();
  renderMobileUnitCardPicker(unit);
}

function renderEmptyUnitBoard() {
  els.unitBoardLanding.classList.remove("hidden");
  els.boardHeading.classList.add("hidden");
  els.unitBoard.classList.add("hidden");
  els.mobileBoardTabs.classList.add("hidden");
  els.mobileUnitCardPicker.classList.add("hidden");
  els.lessonBoard.classList.add("hidden");
  els.unitOverview.classList.add("hidden");
  els.clearBoard.classList.add("hidden");
  els.arrangeBoard.classList.add("hidden");
}

function renderSuggestions(unit) {
  suggestedCards(unit).forEach((suggestion) => {
    const zone = document.querySelector(`.board-zone[data-zone="${suggestion.zone}"] .zone-cards`);
    if (!zone) return;
    const node = document.createElement("article");
    node.className = "suggestion-card";
    node.dataset.suggestionKey = suggestion.key;
    node.dataset.suggestionGroupKey = suggestion.groupKey;
    node.innerHTML = `
      <div class="suggestion-label">${escapeHtml(suggestionHeader(suggestion.type))}</div>
      <div class="suggestion-title">${escapeHtml(suggestion.label)}</div>
      <div class="suggestion-actions">
        <button class="suggestion-add" type="button">Add</button>
        <button class="suggestion-dismiss" type="button">Dismiss</button>
      </div>
    `;
    node.querySelector(".suggestion-add").addEventListener("click", (event) => {
      event.stopPropagation();
      addBoardCard(unit, { type: suggestion.type, label: suggestion.label }, { zone: suggestion.zone });
    });
    node.querySelector(".suggestion-dismiss").addEventListener("click", (event) => {
      event.stopPropagation();
      dismissSuggestion(unit, suggestion);
      render();
    });
    zone.append(node);
  });
}

function renderBoardHeader(unit) {
  els.boardTitleDisplay.textContent = unit.title || "Untitled Unit";
  els.boardPerformanceTaskDisplay.textContent = unit.artTask || "Not set";
  if (document.activeElement !== els.boardTitle) els.boardTitle.value = unit.title || "";
  if (document.activeElement !== els.boardPerformanceTask) els.boardPerformanceTask.value = unit.artTask || "";
  els.boardTitleEditor.classList.toggle("hidden", !boardHeaderEditing.title);
  els.boardTitleDisplay.closest(".board-field-row").classList.toggle("hidden", boardHeaderEditing.title);
  els.boardPerformanceTaskEditor.classList.toggle("hidden", !boardHeaderEditing.performanceTask);
  els.boardPerformanceTaskDisplay.closest(".board-field-row").classList.toggle("hidden", boardHeaderEditing.performanceTask);
}

function renderUnitOverview(unit) {
  els.unitOverview.innerHTML = `
    <div class="unit-overview-heading">
      <div>
        <p class="eyebrow">Unit Board</p>
        <h2>${escapeHtml(unit.title || "Untitled Unit")}</h2>
      </div>
      <div class="unit-overview-actions">
        <button class="ghost-button back-to-planning" type="button">Back To Unit</button>
        <button class="ghost-button copy-unit-overview" type="button">Copy for Google Docs</button>
      </div>
    </div>
    <article class="unit-document">
      <dl class="lap-summary-list unit-summary-list">
        <dt>Performance Task / Evidence of Learning</dt><dd>${escapeHtml(unit.artTask || "Not yet planned")}</dd>
        <dt>Lesson Count</dt><dd>${escapeHtml(unitLessonCountLabel(unit))}</dd>
        <dt>Meaning</dt><dd>${unitOverviewInlineGroups([
          ["Big Idea(s)", overviewValues(unit, "bigIdeas")],
          ["Guiding Question(s)", guidingQuestionValues(unit)],
          ["Theme", themeValues(unit)],
        ])}</dd>
        <dt>Learning Content</dt><dd>${unitOverviewInlineGroups([
          ["Media / Art Forms", overviewValues(unit, "media")],
          ["Context", contextOverviewValues(unit)],
          ["Artistic Processes", overviewValues(unit, "artisticProcesses")],
          ["Visual Qualities", visualQualityOverviewValues(unit)],
        ])}</dd>
        <dt>Curricular Goals</dt><dd>${unitOverviewInlineGroups([
          ["Learning Outcomes", overviewValues(unit, "learningOutcomes")],
          ["21CC Outcomes", overviewValues(unit, "cc21")],
        ])}</dd>
        <dt>Pedagogy</dt><dd>${unitOverviewInlineGroups([["Pedagogy", overviewValues(unit, "pedagogy")]])}</dd>
        <dt>Assessment</dt><dd>${unitOverviewInlineGroups([["Assessment", overviewValues(unit, "assessment")]])}</dd>
        <dt>Core Learning Experiences</dt><dd>${unitOverviewInlineGroups([["Core Learning Experiences", overviewValues(unit, "coreExperiences")]])}</dd>
        <dt>Lesson Sequence</dt><dd>${lessonSequenceOverviewList(unit)}</dd>
      </dl>
    </article>
  `;

  els.unitOverview.querySelector(".back-to-planning").addEventListener("click", () => {
    state.unitOverviewOpen = false;
    render();
  });
  els.unitOverview.querySelector(".copy-unit-overview").addEventListener("click", async () => {
    await copyUnitOverview(unit);
  });
  els.unitOverview.querySelectorAll(".overview-open-lesson").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedLessonId = button.dataset.lessonId;
      state.lessonOverviewOpen = false;
      state.currentScreen = "lesson";
      render();
    });
  });
}

function unitOverviewSection(title, groups) {
  return `
    <section class="unit-document-section">
      <h3>${escapeHtml(title)}</h3>
      <div class="unit-document-groups">
        ${groups.map(([label, values]) => unitOverviewGroup(label, values)).join("")}
      </div>
    </section>
  `;
}

function unitOverviewGroup(label, values) {
  const items = (values || []).filter(Boolean);
  return `
    <div class="unit-document-group">
      <h4>${escapeHtml(label)}</h4>
      ${items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p class="not-planned">Not yet planned</p>`}
    </div>
  `;
}

function unitOverviewInlineGroups(groups) {
  return groups
    .map(([label, values]) => {
      const items = (values || []).filter(Boolean);
      return `
        <div class="unit-summary-group">
          <strong>${escapeHtml(label)}</strong>
          ${items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<span class="not-planned">Not yet planned</span>`}
        </div>
      `;
    })
    .join("");
}

function lessonSequenceOverviewList(unit) {
  const lessons = unit.lessons || [];
  if (!lessons.length) return `<span class="not-planned">Not yet planned</span>`;
  return lessons.map((lesson, index) => {
    const description = lesson.description || lesson.details || "Not yet planned";
    const structures = lessonDisplayStructures(lesson);
    return `
      <div class="unit-summary-lesson">
        <div>
          <strong>Lesson ${index + 1}${lesson.title ? `: ${escapeHtml(lesson.title)}` : ""}</strong>
          <p>${escapeHtml(description)}</p>
          ${structures.length ? `<p><strong>Structure:</strong> ${escapeHtml(structures.join(", "))}</p>` : ""}
          ${lesson.steps?.length ? `<ul>${lesson.steps.map((step) => `<li>${escapeHtml(lessonActivitySummaryText(step))}</li>`).join("")}</ul>` : ""}
        </div>
        <button class="ghost-button overview-open-lesson" data-lesson-id="${escapeAttr(lesson.id)}" type="button">Open Lesson Board</button>
      </div>
    `;
  }).join("");
}

function lessonSequenceOverview(unit) {
  const lessons = unit.lessons || [];
  return `
    <section class="unit-document-section">
      <h3>Lesson Sequence</h3>
      ${lessons.length ? lessons.map((lesson, index) => {
        const description = lesson.description || lesson.details || "";
        const structures = lessonDisplayStructures(lesson);
        return `
          <article class="unit-document-lesson">
            <div>
              <h4>Lesson ${index + 1}${lesson.title ? `: ${escapeHtml(lesson.title)}` : ""}</h4>
              <p>${escapeHtml(description || "Not yet planned")}</p>
              ${structures.length ? `<p><strong>Structure:</strong> ${escapeHtml(structures.join(", "))}</p>` : ""}
              ${lesson.steps?.length ? `<ul class="unit-document-activities">${lesson.steps.map((step) => `<li>${escapeHtml(lessonActivitySummaryText(step))}</li>`).join("")}</ul>` : ""}
            </div>
            <button class="ghost-button overview-open-lesson" data-lesson-id="${escapeAttr(lesson.id)}" type="button">Open Lesson Board</button>
          </article>
        `;
      }).join("") : `<p class="not-planned">Not yet planned</p>`}
    </section>
  `;
}

function overviewValues(unit, type) {
  const base = {
    bigIdeas: unit.bigIdeas || [],
    media: unit.media || [],
    learningOutcomes: [...(unit.learningOutcomes?.primary || []), ...(unit.learningOutcomes?.supporting || [])],
    cc21: unit.cc21 || [],
    pedagogy: unit.pedagogy || [],
    assessment: unit.assessment || [],
    coreExperiences: unit.coreExperiences || [],
    artisticProcesses: unit.learningContent?.artisticProcessCards || [],
  }[type] || [];
  const cardValues = (unit.boardCards || [])
    .filter((card) => card.type === type)
    .map((card) => readableCardValue(card));
  return uniqueReadableValues(cardValues.length ? cardValues : base);
}

function contextOverviewValues(unit) {
  const cardValues = (unit.boardCards || []).filter((card) => card.type === "context").map((card) => readableCardValue(card));
  if (cardValues.length) return uniqueReadableValues(cardValues);
  return uniqueReadableValues([
    unit.learningContent?.context,
    ...(unit.learningContent?.contextCards || []),
  ]);
}

function visualQualityOverviewValues(unit) {
  const cardValues = (unit.boardCards || [])
    .filter((card) => card.type === "visualQualities" || card.type === "visualQualityText")
    .map((card) => readableCardValue(card));
  if (cardValues.length) return uniqueReadableValues(cardValues);
  return uniqueReadableValues([
    unit.learningContent?.visualQualities,
    ...(unit.learningContent?.visualQualityCards || []),
  ]);
}

function themeValues(unit) {
  const cardValues = (unit.boardCards || [])
    .filter((card) => card.type === "meaningText" && card.label === "Theme")
    .map((card) => readableCardValue(card));
  if (cardValues.length) return uniqueReadableValues(cardValues);
  return uniqueReadableValues([
    unit.theme,
  ]);
}

function readableCardValue(card) {
  if (isTextCard(card.type) && card.value?.trim()) {
    return card.type === "context" ? `${card.label}: ${card.value.trim()}` : card.value.trim();
  }
  return card.label;
}

function uniqueReadableValues(values) {
  const seen = new Set();
  return values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function copyUnitOverview(unit) {
  const html = unitOverviewCopyHtml(unit);
  const text = unitOverviewCopyText(unit);
  try {
    if (navigator.clipboard?.write && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
    } else {
      await navigator.clipboard.writeText(text);
    }
    showSaveStatus("Copied");
  } catch {
    try {
      await navigator.clipboard?.writeText(text);
      showSaveStatus("Copied");
    } catch {
      copyTextFallback(text);
    }
  }
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand?.("copy");
  textarea.remove();
  showSaveStatus(copied ? "Copied" : "Copy unavailable");
}

function unitOverviewCopyHtml(unit) {
  return `
    <h1>${escapeHtml(unit.title || "Untitled Unit")}</h1>
    <h2>Performance Task / Evidence of Learning</h2>
    <p>${escapeHtml(unit.artTask || "Not yet planned")}</p>
    <p><strong>Lesson Count:</strong> ${escapeHtml(unitLessonCountLabel(unit))}</p>
    ${unitOverviewCopySections(unit).map(([title, groups]) => `
      <h2>${escapeHtml(title)}</h2>
      ${groups.map(([label, values]) => `
        <h3>${escapeHtml(label)}</h3>
        ${values?.length ? `<ul>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>` : "<p>Not yet planned</p>"}
      `).join("")}
    `).join("")}
    <h2>Lesson Sequence</h2>
    ${unit.lessons?.length ? `<ol>${unit.lessons.map((lesson) => `<li><strong>${escapeHtml(lesson.title || "Untitled Lesson")}</strong><br>${escapeHtml(lesson.description || lesson.details || "Not yet planned")}${lesson.steps?.length ? `<ul>${lesson.steps.map((step) => `<li>${escapeHtml(lessonActivitySummaryText(step))}</li>`).join("")}</ul>` : ""}</li>`).join("")}</ol>` : "<p>Not yet planned</p>"}
  `;
}

function unitOverviewCopyText(unit) {
  const sections = unitOverviewCopySections(unit);
  const lines = [
    unit.title || "Untitled Unit",
    "",
    "Performance Task / Evidence of Learning",
    unit.artTask || "Not yet planned",
    "",
    `Lesson Count: ${unitLessonCountLabel(unit)}`,
  ];
  sections.forEach(([title, groups]) => {
    lines.push("", title);
    groups.forEach(([label, values]) => {
      lines.push(label);
      const items = (values || []).filter(Boolean);
      lines.push(...(items.length ? items.map((item) => `- ${item}`) : ["- Not yet planned"]));
    });
  });
  lines.push("", "Lesson Sequence");
  if (unit.lessons?.length) {
    unit.lessons.forEach((lesson, index) => {
      lines.push(`Lesson ${index + 1}${lesson.title ? `: ${lesson.title}` : ""}`);
      lines.push(`- ${lesson.description || lesson.details || "Not yet planned"}`);
      const structures = lessonDisplayStructures(lesson);
      if (structures.length) lines.push(`- Structure: ${structures.join(", ")}`);
      if (lesson.steps?.length) {
        lesson.steps.forEach((step, stepIndex) => {
          lines.push(`- Activity ${stepIndex + 1}: ${lessonActivitySummaryText(step)}`);
        });
      }
    });
  } else {
    lines.push("- Not yet planned");
  }
  return lines.join("\n");
}

function unitOverviewCopySections(unit) {
  return [
    ["Meaning", [["Big Idea(s)", overviewValues(unit, "bigIdeas")], ["Guiding Question(s)", guidingQuestionValues(unit)], ["Theme", themeValues(unit)]]],
    ["Learning Content", [["Media / Art Forms", overviewValues(unit, "media")], ["Context", contextOverviewValues(unit)], ["Artistic Processes", overviewValues(unit, "artisticProcesses")], ["Visual Qualities", visualQualityOverviewValues(unit)]]],
    ["Curricular Goals", [["Learning Outcomes", overviewValues(unit, "learningOutcomes")], ["21CC Outcomes", overviewValues(unit, "cc21")]]],
    ["Pedagogy", [["Pedagogy", overviewValues(unit, "pedagogy")]]],
    ["Assessment", [["Assessment", overviewValues(unit, "assessment")]]],
    ["Core Learning Experiences", [["Core Learning Experiences", overviewValues(unit, "coreExperiences")]]],
  ];
}

function updateBoardZoneSelection() {
  els.boardZones.forEach((zone) => {
    const isSelected = zone.dataset.zone === state.selectedBoardZone;
    zone.classList.toggle("selected-zone", isSelected);
    zone.setAttribute("aria-selected", String(isSelected));
    zone.tabIndex = 0;
  });
}

function updateLessonZoneSelection() {
  els.lessonBoardZones.forEach((zone) => {
    const isSelected = zone.dataset.lessonZone === state.selectedLessonZone;
    zone.classList.toggle("selected-zone", isSelected);
    zone.setAttribute("aria-selected", String(isSelected));
    zone.tabIndex = 0;
  });
}

function renderLessons(unit) {
  els.lessonList.innerHTML = "";
  if (!unit.lessons?.length) {
    els.lessonList.innerHTML = `<div class="lesson-empty">Add a lesson to begin shaping the lesson sequence.</div>`;
    return;
  }

  unit.lessons.forEach((lesson, index) => {
    const card = document.createElement("article");
    card.className = "lesson-card";
    if (lesson.confirmed) card.classList.add("confirmed");
    card.draggable = true;
    card.dataset.lessonId = lesson.id;
    card.innerHTML = `
      <div class="lesson-card-header">
        <div>
          <div class="lesson-number">Lesson ${index + 1}</div>
          <div class="lesson-subtitle">${lesson.confirmed ? "Confirmed" : "Lesson Structure"}</div>
        </div>
        <div class="lesson-actions">
          <button class="lesson-move" data-direction="up" type="button" ${index === 0 ? "disabled" : ""} aria-label="Move Lesson ${index + 1} up">↑</button>
          <button class="lesson-move" data-direction="down" type="button" ${index === unit.lessons.length - 1 ? "disabled" : ""} aria-label="Move Lesson ${index + 1} down">↓</button>
          <button class="lesson-open-board" type="button">Go to Lesson Board</button>
          ${lesson.confirmed ? `<button class="lesson-edit" type="button">Edit</button>` : `<button class="lesson-confirm" type="button">Confirm</button>`}
          <button class="lesson-remove" type="button">Remove</button>
        </div>
      </div>
      ${lesson.confirmed ? lessonDisplayContent(lesson) : lessonEditContent(lesson)}
    `;

    bindLessonReorderControls(card, unit, lesson);
    bindLessonDragReorder(card, unit, lesson);
    card.querySelector(".lesson-open-board").addEventListener("click", () => {
      state.selectedLessonId = lesson.id;
      state.currentScreen = "lesson";
      state.lessonOverviewOpen = false;
      render();
    });
    const confirmButton = card.querySelector(".lesson-confirm");
    if (confirmButton) {
      confirmButton.addEventListener("click", () => {
        lesson.confirmed = true;
        render();
      });
    }
    const editButton = card.querySelector(".lesson-edit");
    if (editButton) {
      editButton.addEventListener("click", () => {
        lesson.confirmed = false;
        render();
      });
    }
    card.querySelector(".lesson-remove").addEventListener("click", () => {
      unit.lessons = unit.lessons.filter((candidate) => candidate.id !== lesson.id);
      syncUnitDurationToLessons(unit);
      render();
    });
    card.querySelectorAll(".lesson-structure-card").forEach((button) => {
      button.addEventListener("click", () => {
        toggleLessonStructure(lesson, button.dataset.structure);
        render();
      });
    });
    const otherInput = card.querySelector(".lesson-other");
    if (otherInput) {
      otherInput.addEventListener("input", (event) => {
        lesson.otherStructure = event.target.value;
        lesson.otherConfirmed = false;
        saveState();
      });
    }
    const otherConfirm = card.querySelector(".lesson-other-confirm");
    if (otherConfirm) {
      otherConfirm.addEventListener("click", () => {
        lesson.otherConfirmed = true;
        render();
      });
    }
    const otherEdit = card.querySelector(".lesson-other-edit");
    if (otherEdit) {
      otherEdit.addEventListener("click", () => {
        lesson.otherConfirmed = false;
        render();
      });
    }
    card.querySelector(".lesson-details")?.addEventListener("input", (event) => {
      syncLessonDescription(lesson, event.target.value);
      saveState();
    });
    els.lessonList.append(card);
  });
}

function renderLessonBoard() {
  renderLessonUnitPicker();
  const unit = selectedUnit();
  const lesson = selectedLesson(unit);
  ensureLessonInheritsUnitCards(unit, lesson);
  updateLessonZoneSelection();
  renderLessonPicker(els.lessonPickerList, unit);

  if (state.currentScreen !== "lesson") return;
  const hasSelection = Boolean(unit && lesson);
  els.lessonLanding.classList.toggle("hidden", hasSelection);
  els.lessonEditor.classList.toggle("hidden", !hasSelection);
  if (!hasSelection) {
    renderMobileLessonTabs();
    renderMobileLessonCardPicker(unit, lesson);
    return;
  }

  els.lessonEditorTitle.textContent = `${unit.title || "Untitled Unit"} · ${lessonNumber(unit, lesson)}`;
  const showOverview = Boolean(state.lessonOverviewOpen);
  els.lessonEditView.classList.toggle("hidden", showOverview);
  els.lessonConfirmedView.classList.toggle("hidden", !showOverview);
  els.confirmLessonBoard.classList.toggle("hidden", showOverview);
  els.editLessonBoard.textContent = showOverview ? "Back To Lesson" : "Overview";

  if (showOverview) {
    els.lessonConfirmedView.innerHTML = lessonConfirmedSummary(unit, lesson);
    return;
  }

  if (document.activeElement !== els.lessonTitle) els.lessonTitle.value = lesson.title || "";
  els.lessonDuration.textContent = lessonDurationLabel(lesson);
  if (document.activeElement !== els.lessonDescription) els.lessonDescription.value = lesson.description || "";
  if (document.activeElement !== els.lessonObjectives) els.lessonObjectives.value = lesson.objectives || "";
  renderLessonImage(lesson);
  renderLessonPlanningBoard(lesson);
  renderMobileLessonTabs();
  renderMobileLessonCardPicker(unit, lesson);
  renderLessonBoardStructures(lesson);
  renderLessonSteps(lesson);
}

function renderLessonUnitPicker() {
  els.lessonUnitPicker.innerHTML = "";
  if (!state.units.length) {
    els.lessonUnitPicker.innerHTML = `<div class="lesson-empty">Create or save a unit board first.</div>`;
    return;
  }
  state.units
    .slice()
    .sort((a, b) => a.start - b.start)
    .forEach((unit) => {
      const button = document.createElement("button");
      button.className = "unit-list-item";
      if (unit.id === state.selectedUnitId) button.classList.add("active");
      button.type = "button";
      button.innerHTML = `
        <span class="unit-list-title">${escapeHtml(unit.title || "Untitled Unit")}</span>
        <span class="unit-list-meta">${unitLessonDurationLabel(unit)}</span>
      `;
      button.addEventListener("click", () => {
        state.selectedUnitId = unit.id;
        state.selectedLessonId = unit.lessons?.[0]?.id || "";
        state.lessonOverviewOpen = false;
        state.currentScreen = "lesson";
        render();
      });
      els.lessonUnitPicker.append(button);
    });
}

function renderLessonPicker(container, unit, options = {}) {
  container.innerHTML = "";
  if (!unit) {
    container.innerHTML = `<div class="lesson-empty">Choose a unit first.</div>`;
    return;
  }
  if (!unit.lessons?.length) {
    container.innerHTML = `<div class="lesson-empty">No lessons yet for this unit.</div>`;
  } else {
    unit.lessons.forEach((lesson, index) => {
      const button = document.createElement("button");
      button.className = "lesson-picker-item";
      if (lesson.id === state.selectedLessonId) button.classList.add("active");
      button.type = "button";
      button.draggable = true;
      button.dataset.lessonId = lesson.id;
      button.innerHTML = `
        <span class="lesson-picker-copy">
          <span class="unit-list-title">Lesson ${index + 1}</span>
          <span class="unit-list-meta">${escapeHtml(lesson.title || `Lesson ${index + 1}`)}</span>
        </span>
        <span class="lesson-picker-move-controls">
          <span class="lesson-picker-move" data-direction="up" role="button" tabindex="0" aria-label="Move Lesson ${index + 1} up" aria-disabled="${index === 0 ? "true" : "false"}">↑</span>
          <span class="lesson-picker-move" data-direction="down" role="button" tabindex="0" aria-label="Move Lesson ${index + 1} down" aria-disabled="${index === unit.lessons.length - 1 ? "true" : "false"}">↓</span>
        </span>
      `;
      button.addEventListener("click", () => {
        state.selectedLessonId = lesson.id;
        state.lessonOverviewOpen = false;
        state.currentScreen = "lesson";
        render();
      });
      button.querySelector(".lesson-picker-move-controls").addEventListener("click", (event) => {
        event.stopPropagation();
      });
      bindLessonPickerReorderControls(button, unit, lesson);
      bindLessonDragReorder(button, unit, lesson);
      container.append(button);
    });
  }

  if (options.includeAdd) {
    const addButton = document.createElement("button");
    addButton.className = "primary-button lesson-add-button";
    addButton.type = "button";
    addButton.textContent = "Add Lesson";
    addButton.addEventListener("click", () => {
      unit.lessons = unit.lessons || [];
      const lesson = createLesson(unit);
      unit.lessons.push(lesson);
      syncUnitDurationToLessons(unit);
      state.selectedLessonId = lesson.id;
      state.lessonOverviewOpen = false;
      state.currentScreen = "lesson";
      render();
    });
    container.append(addButton);
  }
}

function bindLessonReorderControls(scope, unit, lesson) {
  scope.querySelectorAll(".lesson-move").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (button.disabled) return;
      moveLesson(unit, lesson.id, button.dataset.direction);
    });
  });
}

function bindLessonPickerReorderControls(scope, unit, lesson) {
  scope.querySelectorAll(".lesson-picker-move").forEach((control) => {
    const handleMove = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (control.getAttribute("aria-disabled") === "true") return;
      moveLesson(unit, lesson.id, control.dataset.direction);
    };
    control.addEventListener("click", handleMove);
    control.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      handleMove(event);
    });
  });
}

function bindLessonDragReorder(node, unit, lesson) {
  node.addEventListener("dragstart", (event) => {
    const interactiveTarget = event.target.closest("button, input, textarea, select, .lesson-picker-move");
    if (interactiveTarget && interactiveTarget !== node) {
      event.preventDefault();
      return;
    }
    dragPayload = { kind: "lessonReorder", unitId: unit.id, lessonId: lesson.id };
    event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
    event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
    event.dataTransfer.effectAllowed = "move";
    node.classList.add("dragging");
  });
  node.addEventListener("dragover", (event) => {
    const payload = readDragPayload(event);
    if (payload?.kind !== "lessonReorder" || payload.unitId !== unit.id || payload.lessonId === lesson.id) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    node.classList.add("lesson-drop-target");
    const rect = node.getBoundingClientRect();
    const position = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
    node.classList.toggle("drop-after", position === "after");
    node.classList.toggle("drop-before", position === "before");
  });
  node.addEventListener("dragleave", () => {
    node.classList.remove("lesson-drop-target", "drop-before", "drop-after");
  });
  node.addEventListener("drop", (event) => {
    const payload = readDragPayload(event);
    const rect = node.getBoundingClientRect();
    const position = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
    node.classList.remove("lesson-drop-target", "drop-before", "drop-after");
    if (payload?.kind !== "lessonReorder" || payload.unitId !== unit.id || payload.lessonId === lesson.id) return;
    event.preventDefault();
    reorderLessonRelative(unit, payload.lessonId, lesson.id, position);
  });
  node.addEventListener("dragend", () => {
    node.classList.remove("dragging", "lesson-drop-target", "drop-before", "drop-after");
    dragPayload = null;
  });
}

function readDragPayload(event) {
  if (dragPayload) return dragPayload;
  try {
    return JSON.parse(event.dataTransfer.getData("application/json") || event.dataTransfer.getData("text/plain") || "null");
  } catch {
    return null;
  }
}

function moveLesson(unit, lessonId, direction) {
  if (!unit?.lessons?.length) return;
  const from = unit.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (from < 0) return;
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= unit.lessons.length) return;
  const [lesson] = unit.lessons.splice(from, 1);
  unit.lessons.splice(to, 0, lesson);
  state.selectedLessonId = lesson.id;
  render();
}

function reorderLessonBefore(unit, movingLessonId, targetLessonId) {
  reorderLessonRelative(unit, movingLessonId, targetLessonId, "before");
}

function reorderLessonRelative(unit, movingLessonId, targetLessonId, position = "before") {
  if (!unit?.lessons?.length) return;
  const from = unit.lessons.findIndex((lesson) => lesson.id === movingLessonId);
  let to = unit.lessons.findIndex((lesson) => lesson.id === targetLessonId);
  if (from < 0 || to < 0 || from === to) return;
  if (position === "after") to += 1;
  const [lesson] = unit.lessons.splice(from, 1);
  if (from < to) to -= 1;
  unit.lessons.splice(to, 0, lesson);
  state.selectedLessonId = lesson.id;
  render();
}

function renderLessonCardLibrary(unit, lesson) {
  if (!unit || !lesson) {
    els.library.innerHTML = `<p class="library-empty">Choose a lesson to see planning cards.</p>`;
    return;
  }

  lessonLibrarySections(unit, state.selectedLessonZone).forEach((section) => {
    const category = createLibraryCategory(section.title, `lesson:${state.selectedLessonZone}:${section.title}`);

    section.items.forEach((item) => {
      const button = document.createElement("button");
      button.className = "library-item";
      button.type = "button";
      button.textContent = item.label;
      button.draggable = true;
      button.dataset.type = item.type;
      button.dataset.label = item.label;
      button.addEventListener("dragstart", (event) => {
        dragPayload = { type: item.type, label: item.label };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
        event.dataTransfer.effectAllowed = "copy";
      });
      button.addEventListener("dragend", () => {
        dragPayload = null;
      });
      button.addEventListener("click", () => {
        addLessonBoardCard(unit, lesson, { type: item.type, label: item.label });
      });
      category.querySelector(".library-category-content").append(button);
    });

    els.library.append(category);
  });
}

function renderMobileBoardTabs() {
  renderMobileZoneTabs(els.mobileBoardTabs, boardZoneDefinitions(), state.selectedBoardZone, (zone) => {
    state.selectedBoardZone = zone;
    render();
  });
}

function renderMobileLessonTabs() {
  renderMobileZoneTabs(els.mobileLessonTabs, lessonZoneDefinitions(), state.selectedLessonZone, (zone) => {
    state.selectedLessonZone = zone;
    render();
  });
}

function renderMobileZoneTabs(container, definitions, selectedKey, onSelect) {
  if (!container) return;
  container.innerHTML = "";
  definitions.forEach((definition) => {
    const button = document.createElement("button");
    button.className = "mobile-zone-tab";
    if (definition.key === selectedKey) button.classList.add("active");
    button.type = "button";
    button.textContent = definition.label;
    button.setAttribute("aria-pressed", String(definition.key === selectedKey));
    button.addEventListener("click", () => onSelect(definition.key));
    container.append(button);
  });
}

function renderMobileUnitCardPicker(unit) {
  if (!els.mobileUnitCardPicker) return;
  if (!unit) {
    els.mobileUnitCardPicker.innerHTML = "";
    return;
  }
  const activeZone = state.selectedBoardZone;
  const sections = activeCardLibrary()
    .map((category) => {
      const items = category.items
        .map((entry) => normalizeLibraryEntry(category, entry))
        .filter((entry) => entry.type !== "teachingMoves")
        .filter((entry) => zoneAllowsType(activeZone, entry.type));
      return { title: category.title, key: `mobile-unit:${activeZone}:${category.title}`, items };
    })
    .filter((section) => section.items.length);
  renderMobileCardPicker(els.mobileUnitCardPicker, sections, ({ type, label }) => {
    addBoardCard(unit, { type, label }, { zone: activeZone });
  });
}

function renderMobileLessonCardPicker(unit, lesson) {
  if (!els.mobileLessonCardPicker) return;
  if (!unit || !lesson) {
    els.mobileLessonCardPicker.innerHTML = "";
    return;
  }
  const sections = lessonLibrarySections(unit, state.selectedLessonZone)
    .map((section) => ({
      ...section,
      key: `mobile-lesson:${state.selectedLessonZone}:${section.title}`,
    }));
  renderMobileCardPicker(els.mobileLessonCardPicker, sections, ({ type, label }) => {
    addLessonBoardCard(unit, lesson, { type, label }, { zone: state.selectedLessonZone });
  });
}

function renderMobileCardPicker(container, sections, onAdd) {
  container.innerHTML = "";
  if (!sections.length) {
    container.innerHTML = `<p class="library-empty">No cards available for this planning area.</p>`;
    return;
  }
  sections.forEach((section) => {
    const category = createMobileCardPickerCategory(section.title, section.key);
    section.items.forEach((item) => {
      const button = document.createElement("button");
      button.className = "mobile-card-option";
      button.type = "button";
      button.textContent = item.label;
      button.dataset.type = item.type;
      button.dataset.label = item.label;
      button.addEventListener("click", () => onAdd(item));
      category.querySelector(".mobile-card-picker-content").append(button);
    });
    container.append(category);
  });
}

function createMobileCardPickerCategory(title, key) {
  const collapsed = Boolean(state.collapsedCategories[key]);
  const wrapper = document.createElement("section");
  wrapper.className = "mobile-card-picker-category";
  if (collapsed) wrapper.classList.add("collapsed");
  wrapper.innerHTML = `
    <button class="mobile-card-picker-toggle" type="button" aria-expanded="${String(!collapsed)}">
      <span>${escapeHtml(title)}</span>
      <span class="library-category-icon" aria-hidden="true">${collapsed ? "+" : "-"}</span>
    </button>
    <div class="mobile-card-picker-content"></div>
  `;
  wrapper.querySelector(".mobile-card-picker-toggle").addEventListener("click", () => {
    state.collapsedCategories[key] = !state.collapsedCategories[key];
    render();
  });
  return wrapper;
}

function lessonLibrarySections(unit, zone = null) {
  return [
    {
      title: "Learning Outcomes",
      zone: "curricular",
      items: lessonItemsFromValues("learningOutcomes", sortLearningOutcomes([
          ...(unit.learningOutcomes?.primary || []),
          ...(unit.learningOutcomes?.supporting || []),
          ...libraryItemsByType("learningOutcomes"),
        ])),
    },
    {
      title: "21CC Outcomes",
      zone: "curricular",
      items: lessonItemsFromValues("cc21", visibleValues([
        ...(unit.cc21 || []),
        ...libraryItemsByType("cc21"),
      ])),
    },
    {
      title: "Pedagogy",
      zone: "pedagogy",
      items: lessonItemsFromValues("pedagogy", [
        ...(unit.pedagogy || []),
        ...libraryItemsByType("pedagogy"),
      ]),
    },
    {
      title: "Teaching Actions",
      zone: "pedagogy",
      items: lessonItemsFromValues("teachingMoves", libraryItemsByType("teachingMoves")),
    },
    {
      title: "Assessment",
      zone: "assessment",
      items: lessonItemsFromValues("assessment", [
        ...(unit.assessment || []),
        ...libraryItemsByType("assessment"),
      ]),
    },
    {
      title: "Media / Art Forms",
      zone: "content",
      items: lessonItemsFromValues("media", [
        ...(unit.media || []),
        ...libraryItemsByType("media"),
      ]),
    },
    {
      title: "Context",
      zone: "content",
      items: lessonItemsFromValues("context", [
        ...(unit.learningContent?.contextCards || []),
        ...libraryItemsByType("context"),
      ]),
    },
    {
      title: "Artistic Processes",
      zone: "content",
      items: lessonItemsFromValues("artisticProcesses", [
        ...(unit.learningContent?.artisticProcessCards || []),
        ...libraryItemsByType("artisticProcesses"),
      ]),
    },
    {
      title: "Visual Qualities",
      zone: "content",
      items: [
        ...lessonItemsFromValues("visualQualities", unit.learningContent?.visualQualityCards || []),
        ...libraryEntriesByTypes(["visualQualities", "visualQualityText"]),
      ],
    },
    {
      title: "Core Learning Experience",
      zone: "core",
      items: lessonItemsFromValues("coreExperiences", [
        ...(unit.coreExperiences || []),
        ...libraryItemsByType("coreExperiences"),
      ]),
    },
  ]
    .filter((section) => !zone || section.zone === zone)
    .map((section) => ({ ...section, items: uniqueLessonLibraryItems(section.items) }))
    .filter((section) => section.items.length);
}

function lessonItemsFromValues(type, values) {
  return values.filter(Boolean).map((label) => ({ type, label }));
}

function libraryItemsByType(type) {
  return activeCardLibrary()
    .find((category) => category.type === type)
    ?.items.map((entry) => normalizeLibraryEntry({ type }, entry).label) || [];
}

function libraryEntriesByTypes(types) {
  return activeCardLibrary()
    .flatMap((category) => category.items.map((entry) => normalizeLibraryEntry(category, entry)))
    .filter((entry) => types.includes(entry.type));
}

function uniqueLessonLibraryItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.type}:${item.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function lessonNumber(unit, lesson) {
  return `Lesson ${unit.lessons.findIndex((candidate) => candidate.id === lesson.id) + 1}`;
}

function lessonConfirmedSummary(unit, lesson) {
  const structures = lessonDisplayStructures(lesson);
  return `
    <section class="lap-summary">
      ${lesson.imageDataUrl ? `<img class="lap-summary-image" src="${escapeAttr(lesson.imageDataUrl)}" alt="${escapeAttr(lesson.imageName || "Lesson reference image")}" />` : ""}
      <dl class="lap-summary-list">
        <dt>Lesson Title</dt><dd>${escapeHtml(lesson.title || "Not set")}</dd>
        <dt>Lesson Description</dt><dd>${escapeHtml(lesson.description || "Not set")}</dd>
        <dt>Lesson Objectives</dt><dd>${escapeHtml(lesson.objectives || "Not set")}</dd>
        <dt>Lesson Duration</dt><dd>${escapeHtml(lessonDurationLabel(lesson))}</dd>
        <dt>Lesson Board</dt><dd>${lessonBoardSummaryHtml(lesson)}</dd>
        <dt>Lesson Structure</dt><dd>${structures.length ? structures.map((item) => `<span class="lesson-display-chip">${escapeHtml(item)}</span>`).join(" ") : "Not set"}</dd>
        <dt>Learning Activities</dt><dd>${lesson.steps?.length ? lesson.steps.map((step, index) => lessonActivitySummaryHtml(step, index)).join("") : "Not set"}</dd>
      </dl>
    </section>
  `;
}

function lessonBoardSummaryHtml(lesson) {
  if (!lesson.boardCards?.length) return "Not set";
  return lessonZoneDefinitions()
    .map(({ key, label }) => {
      const cards = lesson.boardCards.filter((card) => (card.zone || lessonZoneForType(card.type)) === key);
      if (!cards.length) return "";
      return `
        <div class="lap-step-summary">
          <strong>${escapeHtml(label)}:</strong>
          ${cards.map((card) => `<span class="lesson-display-chip">${escapeHtml(card.label)}</span>`).join(" ")}
        </div>
      `;
    })
    .filter(Boolean)
    .join("");
}

function renderLessonImage(lesson) {
  els.lessonImagePreview.innerHTML = lesson.imageDataUrl
    ? `<img src="${escapeAttr(lesson.imageDataUrl)}" alt="${escapeAttr(lesson.imageName || "Lesson reference image")}" /><span>${escapeHtml(lesson.imageName || "Uploaded image")}</span>`
    : `<span>No image uploaded</span>`;
  els.removeLessonImage.disabled = !lesson.imageDataUrl;
}

function renderLessonPlanningBoard(lesson) {
  els.lessonBoardZones.forEach((zone) => {
    zone.querySelector(".zone-cards").innerHTML = "";
  });

  lesson.boardCards
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach((card) => {
      const node = document.createElement("article");
      node.className = "board-card lesson-planning-card";
      node.dataset.type = card.type;
      node.dataset.cardId = card.id;
      node.draggable = true;
      node.innerHTML = `
        <button class="board-card-remove" type="button" title="Remove card">x</button>
        <div class="board-card-type">${escapeHtml(cardTypeLabel(card.type, card))}</div>
        <div class="board-card-title">${escapeHtml(lessonPlanningCardTitle(card))}</div>
      `;
      node.querySelector(".board-card-remove").addEventListener("click", (event) => {
        event.stopPropagation();
        if (card.inherited) {
          lesson.removedUnitCardKeys = lesson.removedUnitCardKeys || [];
          addUnique(lesson.removedUnitCardKeys, card.unitCardKey || cardKey(card));
        }
        lesson.boardCards = lesson.boardCards.filter((candidate) => candidate.id !== card.id);
        render();
      });
      node.addEventListener("dragstart", (event) => {
        if (event.target.closest("button")) {
          event.preventDefault();
          return;
        }
        dragPayload = { kind: "lessonCard", cardId: card.id };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
        event.dataTransfer.effectAllowed = "move";
        node.classList.add("dragging");
      });
      node.addEventListener("dragend", () => {
        node.classList.remove("dragging");
        dragPayload = null;
      });
      const target = document.querySelector(`.lesson-zone[data-lesson-zone="${card.zone || lessonZoneForType(card.type)}"] .zone-cards`);
      target?.append(node);
    });
}

function lessonPlanningCardTitle(card) {
  if (isTextCard(card.type) && card.value?.trim()) return card.value.trim();
  return card.label;
}

function renderLessonInheritedChips(unit) {
  if (!els.lessonInheritedChips) return;
  els.lessonInheritedChips.innerHTML = inheritedChipHtml(unit);
}

function inheritedChipHtml(unit) {
  const groups = [
    ["Big Ideas", unit.bigIdeas || []],
    ["Media / Art Forms", unit.media || []],
    ["Learning Outcomes", [...(unit.learningOutcomes?.primary || []), ...(unit.learningOutcomes?.supporting || [])]],
    ["21CC", unit.cc21 || []],
    ["Core Learning Experiences", unit.coreExperiences || []],
    ["Pedagogy", unit.pedagogy || []],
    ["Assessment", unit.assessment || []],
  ];
  return groups
    .map(([label, values]) => `
      <div class="inherited-chip-group">
        <span class="inherited-chip-label">${escapeHtml(label)}</span>
        ${(values.length ? values : ["Not set"]).map((value) => `<span class="chip">${escapeHtml(value)}</span>`).join("")}
      </div>
    `)
    .join("");
}

function renderLessonBoardStructures(lesson) {
  els.lessonBoardStructures.innerHTML = `
    ${lessonStructureCards.map((label) => lessonStructureButton(label, lesson)).join("")}
    ${lesson.structures.includes("Others") ? lessonOtherContent(lesson) : ""}
  `;
  els.lessonBoardStructures.querySelectorAll(".lesson-structure-card").forEach((button) => {
    button.addEventListener("click", () => {
      toggleLessonStructure(lesson, button.dataset.structure);
      render();
    });
  });
  bindLessonOtherControls(els.lessonBoardStructures, lesson);
}

function bindLessonOtherControls(scope, lesson) {
  const otherInput = scope.querySelector(".lesson-other");
  if (otherInput) {
    otherInput.addEventListener("input", (event) => {
      lesson.otherStructure = event.target.value;
      lesson.otherConfirmed = false;
      saveState();
    });
  }
  scope.querySelector(".lesson-other-confirm")?.addEventListener("click", () => {
    lesson.otherConfirmed = true;
    render();
  });
  scope.querySelector(".lesson-other-edit")?.addEventListener("click", () => {
    lesson.otherConfirmed = false;
    render();
  });
}

function renderLessonSteps(lesson) {
  els.lessonSteps.innerHTML = "";
  if (!lesson.steps?.length) {
    els.lessonSteps.innerHTML = `<div class="lesson-empty">Add activities to build the lesson activity sequence.</div>`;
    return;
  }
  lesson.steps.forEach((step, index) => {
    const item = document.createElement("article");
    item.className = "lesson-step-card";
    if (step.confirmed) item.classList.add("confirmed");
    item.innerHTML = `
      <div class="lesson-card-header">
        <div>
          <div class="lesson-number">Activity ${index + 1}</div>
          ${step.confirmed ? "" : `<div class="lesson-subtitle">Inquiry Activity</div>`}
        </div>
        <div class="lesson-actions">
          ${step.confirmed ? `<button class="activity-edit" type="button">Edit</button>` : `<button class="activity-confirm" type="button">Confirm</button>`}
          <button class="lesson-remove" type="button">Remove</button>
        </div>
      </div>
      ${step.confirmed ? lessonActivityDisplayContent(step) : lessonActivityEditContent(step)}
    `;
    item.querySelector(".lesson-remove").addEventListener("click", () => {
      lesson.steps = lesson.steps.filter((candidate) => candidate.id !== step.id);
      render();
    });
    item.querySelector(".activity-confirm")?.addEventListener("click", () => {
      step.confirmed = true;
      render();
    });
    item.querySelector(".activity-edit")?.addEventListener("click", () => {
      step.confirmed = false;
      render();
    });
    item.querySelector(".step-type")?.addEventListener("change", (event) => {
      step.type = event.target.value;
      saveState();
    });
    item.querySelector(".step-duration")?.addEventListener("input", (event) => {
      step.duration = event.target.value;
      lesson.duration = lessonDurationLabel(lesson);
      els.lessonDuration.textContent = lesson.duration;
      saveState();
    });
    item.querySelector(".step-description")?.addEventListener("input", (event) => {
      step.description = event.target.value;
      saveState();
    });
    item.querySelector(".step-evidence")?.addEventListener("input", (event) => {
      step.evidence = event.target.value;
      saveState();
    });
    els.lessonSteps.append(item);
  });
}

function lessonActivityEditContent(step) {
  return `
    <div class="lesson-activity-grid">
      <div class="lesson-activity-meta">
        <label>
          <span class="field-label">Activity Type</span>
          <select class="text-input step-type" aria-label="Activity type">
            ${inquiryActivityTypes.map((type) => `<option value="${escapeAttr(type)}" ${step.type === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span class="field-label">Duration</span>
          <input class="text-input step-duration" type="number" min="0" step="5" value="${escapeAttr(step.duration)}" aria-label="Duration in minutes" />
        </label>
      </div>
      <label>
        <span class="field-label">Activity Details</span>
        <textarea class="text-area step-description" rows="3" aria-label="Activity details">${escapeHtml(step.description || "")}</textarea>
      </label>
      <label>
        <span class="field-label">Evidence for Assessment</span>
        <textarea class="text-area step-evidence" rows="3" aria-label="Evidence for assessment">${escapeHtml(step.evidence || "")}</textarea>
      </label>
    </div>
  `;
}

function lessonActivityDisplayContent(step) {
  return `
    <div class="lesson-activity-display">
      <div>
        <div class="lesson-activity-display-label">Activity Type</div>
        <div class="lesson-activity-display-value">${escapeHtml(step.type || "Not set")}</div>
      </div>
      <div>
        <div class="lesson-activity-display-label">Duration</div>
        <div class="lesson-activity-display-value">${escapeHtml(step.duration ? `${step.duration} min` : "Not set")}</div>
      </div>
      <div>
        <div class="lesson-activity-display-label">Activity Details</div>
        <div class="lesson-activity-display-value">${escapeHtml(step.description || "Not set")}</div>
      </div>
      <div>
        <div class="lesson-activity-display-label">Evidence for Assessment</div>
        <div class="lesson-activity-display-value">${escapeHtml(step.evidence || "Not set")}</div>
      </div>
    </div>
  `;
}

function lessonActivitySummaryHtml(step, index) {
  return `
    <div class="lap-step-summary">
      <strong>${index + 1}. ${escapeHtml(step.type || "Activity")}${step.duration ? ` · ${escapeHtml(step.duration)} min` : ""}</strong>
      <br>${escapeHtml(step.description || "No activity detail")}
      ${step.evidence ? `<br><span>Evidence: ${escapeHtml(step.evidence)}</span>` : ""}
    </div>
  `;
}

function lessonActivitySummaryText(step) {
  const parts = [step.type || "Activity"];
  if (step.duration) parts.push(`${step.duration} min`);
  if (step.description) parts.push(step.description);
  if (step.evidence) parts.push(`Evidence: ${step.evidence}`);
  return parts.join(" - ");
}

function lessonEditContent(lesson) {
  return `
    <div class="lesson-structure-options">
      ${lessonStructureCards.map((label) => lessonStructureButton(label, lesson)).join("")}
    </div>
    ${lesson.structures.includes("Others") ? lessonOtherContent(lesson) : ""}
    <label class="field-label" for="details-${lesson.id}">Details of Activity</label>
    <textarea id="details-${lesson.id}" class="text-area lesson-details" rows="3" placeholder="What will students do, make, discuss, practise, or reflect on?">${escapeHtml(lesson.description || lesson.details)}</textarea>
  `;
}

function lessonOtherContent(lesson) {
  if (lesson.otherConfirmed && lesson.otherStructure?.trim()) {
    return `
      <div class="lesson-other-display">
        <span class="lesson-display-chip">${escapeHtml(lesson.otherStructure.trim())}</span>
        <button class="lesson-other-edit" type="button">Edit</button>
      </div>
    `;
  }
  return `
    <div class="lesson-other-editor">
      <input class="text-input lesson-other" type="text" value="${escapeAttr(lesson.otherStructure)}" placeholder="Enter other lesson structure" />
      <button class="lesson-other-confirm" type="button">${lesson.otherStructure?.trim() ? "Confirm" : "Add"}</button>
    </div>
  `;
}

function lessonDisplayContent(lesson) {
  const structures = lessonDisplayStructures(lesson);
  return `
    <div class="lesson-display-structures">
      ${structures.length ? structures.map((label) => `<span class="lesson-display-chip">${escapeHtml(label)}</span>`).join("") : `<span class="lesson-display-empty">No structure selected</span>`}
    </div>
    <div class="lesson-display-details">${escapeHtml(lesson.description || lesson.details || "No activity details added")}</div>
    ${lesson.steps?.length ? `<div class="lesson-display-activities">${lesson.steps.map((step, index) => `<div><strong>Activity ${index + 1}:</strong> ${escapeHtml(lessonActivitySummaryText(step))}</div>`).join("")}</div>` : ""}
  `;
}

function lessonDisplayStructures(lesson) {
  return lesson.structures
    .map((structure) => (structure === "Others" ? lesson.otherStructure?.trim() : structure))
    .filter(Boolean);
}

function lessonStructureButton(label, lesson) {
  const active = lesson.structures.includes(label);
  return `<button class="lesson-structure-card ${active ? "active" : ""}" data-structure="${escapeAttr(label)}" type="button">${escapeHtml(label)}</button>`;
}

function toggleLessonStructure(lesson, label) {
  if (lesson.structures.includes(label)) {
    lesson.structures = lesson.structures.filter((value) => value !== label);
    if (label === "Others") {
      lesson.otherStructure = "";
      lesson.otherConfirmed = false;
    }
  } else {
    lesson.structures.push(label);
  }
}

function suggestedCards(unit) {
  const suggestions = [];
  const selectedLoCodes = selectedLearningOutcomeCodes(unit);
  const selectedProcesses = selectedArtisticProcesses(unit);
  const dismissed = new Set(unit.dismissedSuggestions || []);

  loProcessSuggestions.forEach(({ lo, processes }) => {
    if (selectedLoCodes.has(lo)) {
      processes.forEach((process) => {
        const key = `lo:${lo}->process:${process}`;
        const groupKey = suggestionGroupKey("content", "artisticProcesses", process);
        if (!selectedProcesses.has(process) && !dismissed.has(key) && !dismissed.has(groupKey)) {
          suggestions.push({
            key,
            groupKey,
            reciprocalKey: `process:${process}->lo:${lo}`,
            zone: "content",
            type: "artisticProcesses",
            label: process,
          });
        }
      });
    }

    processes.forEach((process) => {
      const key = `process:${process}->lo:${lo}`;
      const label = learningOutcomeByCode(lo);
      const groupKey = suggestionGroupKey("alignment", "learningOutcomes", label);
      if (selectedProcesses.has(process) && !selectedLoCodes.has(lo) && !dismissed.has(key) && !dismissed.has(groupKey)) {
        suggestions.push({
          key,
          groupKey,
          reciprocalKey: `lo:${lo}->process:${process}`,
          zone: "alignment",
          type: "learningOutcomes",
          label,
        });
      }
    });
  });

  return uniqueSuggestions(suggestions).filter((suggestion) => suggestion.label);
}

function dismissSuggestion(unit, suggestion) {
  unit.dismissedSuggestions = unit.dismissedSuggestions || [];
  addUnique(unit.dismissedSuggestions, suggestion.key);
  if (suggestion.reciprocalKey) addUnique(unit.dismissedSuggestions, suggestion.reciprocalKey);
  addUnique(unit.dismissedSuggestions, suggestion.groupKey);
  unit.suggestionVersion = SUGGESTION_VERSION;
}

function suggestionHeader(type) {
  const labels = {
    artisticProcesses: "Suggested Artistic Process",
    learningOutcomes: "Suggested Learning Outcome",
  };
  return labels[type] || "Suggested";
}

function suggestionGroupKey(zone, type, label) {
  return `suggestion:${zone}:${type}:${label}`;
}

function selectedLearningOutcomeCodes(unit) {
  return new Set(
    [
      ...(unit.learningOutcomes?.primary || []),
      ...(unit.learningOutcomes?.supporting || []),
      ...(unit.boardCards || []).filter((card) => card.type === "learningOutcomes").map((card) => card.label),
    ]
      .map((value) => value.slice(0, 3)),
  );
}

function selectedArtisticProcesses(unit) {
  return new Set([
    ...(unit.learningContent?.artisticProcessCards || []),
    ...(unit.boardCards || []).filter((card) => card.type === "artisticProcesses").map((card) => card.label),
  ]);
}

function learningOutcomeByCode(code) {
  return activeCardLibrary()
    .find((category) => category.type === "learningOutcomes")
    ?.items.find((item) => item.startsWith(code));
}

function uniqueSuggestions(suggestions) {
  const seen = new Set();
  return suggestions.filter((suggestion) => {
    const key = `${suggestion.zone}:${suggestion.type}:${suggestion.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cardTypeLabel(type, card = {}) {
  const labels = {
    bigIdeas: "Big Idea",
    meaningText: card.label || "Meaning",
    learningOutcomes: "Learning Outcome",
    media: "Media",
    context: card.label || "Context",
    artisticProcesses: "Artistic Process",
    visualQualities: "Visual Quality",
    visualQualityText: "Visual Quality",
    coreExperiences: "Core Experience",
    teachingMoves: "Teaching Move",
    assessment: "Assessment",
    pedagogy: "Pedagogy",
    cc21: "21CC",
  };
  return labels[type] || "Card";
}

function addBoardCard(unit, payload, point) {
  const requestedZone = point?.zone || zoneForType(payload.type);
  const zone = zoneAllowsType(requestedZone, payload.type) ? requestedZone : zoneForType(payload.type);
  if (!allowsDuplicateBoardCard(payload.type, payload.label) && unit.boardCards.some((card) => card.type === payload.type && card.label === payload.label)) {
    const existing = unit.boardCards.find((card) => card.type === payload.type && card.label === payload.label);
    existing.lessonOrigin = false;
    existing.sourceLessonIds = [];
    existing.zone = zone;
    existing.order = nextBoardOrder(unit, zone);
    syncUnitCardToLessons(unit, existing);
    render();
    return;
  }
  const card = {
    id: uid("card"),
    type: payload.type,
    label: payload.label,
    zone,
    order: nextBoardOrder(unit, zone),
    value: defaultTextCardValue(unit, payload),
    confirmed: Boolean(defaultTextCardValue(unit, payload)),
    purpose: defaultPurpose(payload),
  };
  unit.boardCards.push(card);
  addLibraryItemToUnit(unit, payload, { silent: true });
  syncUnitCardToLessons(unit, card);
  render();
}

function removeBoardCard(unit, card) {
  const key = cardKey(card);
  unit.boardCards = unit.boardCards.filter((candidate) => candidate.id !== card.id);
  unit.lessons?.forEach((lesson) => {
    lesson.boardCards = (lesson.boardCards || []).filter((lessonCard) => lessonCard.unitCardKey !== key);
  });
  const stillHasSameCard = unit.boardCards.some((candidate) => candidate.type === card.type && candidate.label === card.label);
  if (stillHasSameCard) {
    syncMeaningTextCardsToUnit(unit);
    return;
  }
  const value = card.label;
  if (card.type === "learningOutcomes") {
    removeValueAtPath(unit, "learningOutcomes.primary", value);
    removeValueAtPath(unit, "learningOutcomes.supporting", value);
  } else if (["bigIdeas", "media", "coreExperiences", "cc21", "assessment", "pedagogy"].includes(card.type)) {
    removeValueAtPath(unit, card.type, value);
  } else if (card.type === "context") {
    removeValueAtPath(unit, "learningContent.contextCards", value);
  } else if (card.type === "artisticProcesses") {
    removeValueAtPath(unit, "learningContent.artisticProcessCards", value);
  } else if (card.type === "visualQualities") {
    removeValueAtPath(unit, "learningContent.visualQualityCards", value);
  }
  syncMeaningTextCardsToUnit(unit);
}

function addLessonBoardCard(unit, lesson, payload, options = {}) {
  if (!lesson || !payload) return;
  const requestedZone = options.zone || lessonZoneForType(payload.type);
  const zone = lessonZoneAllowsType(requestedZone, payload.type) ? requestedZone : lessonZoneForType(payload.type);
  const unitCard = ensureUnitHasCard(unit, payload, { source: "lesson", sourceLessonId: lesson.id });
  const inheritedFromUnit = Boolean(unitCard && !unitCard.lessonOrigin);
  const existing = lesson.boardCards.find((card) => card.type === payload.type && card.label === payload.label);
  if (existing && !allowsDuplicateBoardCard(payload.type, payload.label)) {
    existing.zone = zone;
    existing.inherited = inheritedFromUnit;
    existing.unitCardKey = inheritedFromUnit ? cardKey(unitCard) : "";
    existing.order = nextLessonCardOrder(lesson, zone);
    render();
    return;
  }
  lesson.boardCards.push({
    id: uid("lesson-card"),
    type: payload.type,
    label: payload.label,
    zone,
    order: nextLessonCardOrder(lesson, zone),
    inherited: inheritedFromUnit,
    unitCardKey: inheritedFromUnit ? cardKey(unitCard) : "",
  });
  render();
}

function ensureUnitHasCard(unit, payload, options = {}) {
  if (!unit || !payload) return null;
  const existing = unit.boardCards.find((card) => card.type === payload.type && card.label === payload.label);
  if (existing && !allowsDuplicateBoardCard(payload.type, payload.label)) {
    if (options.source === "lesson" && existing.lessonOrigin && options.sourceLessonId) {
      existing.sourceLessonIds = existing.sourceLessonIds || [];
      addUnique(existing.sourceLessonIds, options.sourceLessonId);
    }
    return existing;
  }
  const zone = zoneForType(payload.type);
  const card = {
    id: uid("card"),
    type: payload.type,
    label: payload.label,
    zone,
    order: nextBoardOrder(unit, zone),
    value: defaultTextCardValue(unit, payload),
    confirmed: Boolean(defaultTextCardValue(unit, payload)),
    purpose: defaultPurpose(payload),
    lessonOrigin: options.source === "lesson",
    sourceLessonIds: options.sourceLessonId ? [options.sourceLessonId] : [],
  };
  unit.boardCards.push(card);
  addLibraryItemToUnit(unit, payload, { silent: true });
  if (!card.lessonOrigin) syncUnitCardToLessons(unit, card);
  return card;
}

function syncUnitCardToLessons(unit, unitCard) {
  if (!unit || !unitCard) return;
  if (unitCard.lessonOrigin) return;
  unit.lessons?.forEach((lesson) => {
    lesson.removedUnitCardKeys = lesson.removedUnitCardKeys || [];
    if (lesson.removedUnitCardKeys.includes(cardKey(unitCard))) return;
    lesson.boardCards = lesson.boardCards || [];
    const existing = lesson.boardCards.find((card) => (card.unitCardKey || cardKey(card)) === cardKey(unitCard));
    if (existing) {
      existing.inherited = true;
      existing.unitCardKey = cardKey(unitCard);
      copyUnitCardFieldsToLessonCard(existing, unitCard);
      return;
    }
    lesson.boardCards.push({
      id: uid("lesson-card"),
      type: unitCard.type,
      label: unitCard.label,
      value: unitCard.value || "",
      confirmed: Boolean(unitCard.confirmed),
      zone: lessonZoneForType(unitCard.type),
      order: nextLessonCardOrder(lesson, lessonZoneForType(unitCard.type)),
      inherited: true,
      unitCardKey: cardKey(unitCard),
    });
  });
}

function copyUnitCardFieldsToLessonCard(lessonCard, unitCard) {
  lessonCard.type = unitCard.type;
  lessonCard.label = unitCard.label;
  lessonCard.value = unitCard.value || "";
  lessonCard.confirmed = Boolean(unitCard.confirmed);
  lessonCard.zone = lessonZoneForType(unitCard.type);
}

function uniqueBoardCards(cards) {
  const seen = new Set();
  return cards
    .filter((card) => {
      const key = allowsDuplicateBoardCard(card.type, card.label) ? `${card.id}:${card.type}:${card.label}` : `${card.type}:${card.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((card, index) => ({
      ...card,
      zone: zoneAllowsType(card.zone, card.type) ? card.zone : zoneForType(card.type),
      order: Number.isFinite(card.order) ? card.order : index + 1,
      confirmed: isTextCard(card.type) ? Boolean(card.confirmed || card.value) : card.confirmed,
      x: snap(Number(card.x) || 0),
      y: snap(Number(card.y) || 0),
    }));
}

function uniqueLessonCards(cards) {
  const seen = new Set();
  return cards
    .filter((card) => {
      const key = allowsDuplicateBoardCard(card.type, card.label) ? card.unitCardKey || `${card.id}:${card.type}:${card.label}` : `${card.type}:${card.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((card, index) => ({
      id: card.id || uid("lesson-card"),
      type: card.type,
      label: card.label,
      value: card.value || "",
      confirmed: Boolean(card.confirmed),
      zone: lessonZoneAllowsType(card.zone, card.type) ? card.zone : lessonZoneForType(card.type),
      order: Number.isFinite(card.order) ? card.order : index + 1,
      inherited: Boolean(card.inherited),
      unitCardKey: card.unitCardKey || (card.inherited ? cardKey(card) : ""),
    }));
}

function zoneForType(type) {
  const zones = {
    bigIdeas: "meaning",
    meaningText: "meaning",
    cc21: "alignment",
    learningOutcomes: "alignment",
    assessment: "alignment",
    pedagogy: "alignment",
    media: "content",
    context: "content",
    artisticProcesses: "content",
    visualQualities: "content",
    visualQualityText: "content",
    coreExperiences: "core",
  };
  return zones[type] || "content";
}

function lessonZoneForType(type) {
  const zones = {
    learningOutcomes: "curricular",
    cc21: "curricular",
    pedagogy: "pedagogy",
    teachingMoves: "pedagogy",
    assessment: "assessment",
    meaningText: "content",
    media: "content",
    context: "content",
    artisticProcesses: "content",
    visualQualities: "content",
    visualQualityText: "content",
    coreExperiences: "core",
  };
  return zones[type] || "content";
}

function lessonZoneDefinitions() {
  return [
    { key: "curricular", label: "Curricular Goals" },
    { key: "pedagogy", label: "Pedagogy and Teaching Actions" },
    { key: "assessment", label: "Assessment" },
    { key: "content", label: "Learning Content" },
    { key: "core", label: "Core Learning Experience" },
  ];
}

function lessonZoneLabel(zone) {
  return lessonZoneDefinitions().find((definition) => definition.key === zone)?.label || "Drag Into Lesson Board";
}

function zoneAllowsType(zone, type) {
  const allowed = {
    meaning: ["bigIdeas", "meaningText"],
    alignment: ["learningOutcomes", "pedagogy", "assessment", "cc21"],
    content: ["media", "context", "artisticProcesses", "visualQualities", "visualQualityText"],
    core: ["coreExperiences"],
  };
  return Boolean(zone && allowed[zone]?.includes(type));
}

function lessonZoneAllowsType(zone, type) {
  const allowed = {
    curricular: ["learningOutcomes", "cc21"],
    pedagogy: ["pedagogy", "teachingMoves"],
    assessment: ["assessment"],
    content: ["meaningText", "media", "context", "artisticProcesses", "visualQualities", "visualQualityText"],
    core: ["coreExperiences"],
  };
  return Boolean(zone && allowed[zone]?.includes(type));
}

function isTextCard(type) {
  return ["meaningText", "visualQualityText", "context"].includes(type);
}

function allowsDuplicateBoardCard(type, label = "") {
  return type === "visualQualityText" || type === "context" || (type === "meaningText" && label === "Guiding Question");
}

function textCardContent(card) {
  if (card.confirmed && card.value?.trim()) {
    return `
      <div class="board-card-title">${escapeHtml(card.value.trim())}</div>
      <div class="board-card-actions">
        <button class="board-card-expand" type="button">${card.expanded ? "Collapse" : "Expand"}</button>
        <button class="board-card-edit" type="button">Edit</button>
      </div>
    `;
  }
  return `
    ${textCardInput(card)}
    <button class="board-card-confirm" type="button">${card.value?.trim() ? "Confirm" : "Add"}</button>
  `;
}

function textCardInput(card) {
  const placeholder = textCardPlaceholder(card);
  return `<textarea class="text-area board-card-text" rows="4" aria-label="${escapeAttr(card.label)}" placeholder="${escapeAttr(placeholder)}">${escapeHtml(card.value || "")}</textarea>`;
}

function textCardPlaceholder(card) {
  if (card.type === "visualQualityText") return "Enter a visual quality focus";
  if (card.type === "context") return `Enter details for ${card.label}`;
  return card.label;
}

function defaultTextCardValue(unit, payload) {
  if (payload.type !== "meaningText") return "";
  if (payload.label === "Guiding Question") return guidingQuestionValues(unit).length ? "" : unit.guidingQuestion || "";
  if (payload.label === "Theme") return unit.theme || "";
  return "";
}

function syncMeaningTextCardsToUnit(unit) {
  const questions = guidingQuestionCardValues(unit);
  unit.guidingQuestions = questions;
  unit.guidingQuestion = questions[0] || "";
  const themeCard = (unit.boardCards || []).find((card) => card.type === "meaningText" && card.label === "Theme" && card.value?.trim());
  unit.theme = themeCard?.value?.trim() || "";
}

function guidingQuestionCardValues(unit) {
  return (unit.boardCards || [])
    .filter((card) => card.type === "meaningText" && card.label === "Guiding Question" && card.value?.trim())
    .map((card) => card.value.trim());
}

function guidingQuestionValues(unit) {
  const cardValues = guidingQuestionCardValues(unit);
  if (cardValues.length) return cardValues;
  return (unit.guidingQuestions || []).filter(Boolean);
}

function guidingQuestionSummary(unit) {
  return guidingQuestionValues(unit).join("; ") || unit.guidingQuestion || "";
}

function nextBoardOrder(unit, zone) {
  const zoneCards = unit.boardCards.filter((card) => (card.zone || zoneForType(card.type)) === zone);
  return zoneCards.length ? Math.max(...zoneCards.map((card) => card.order || 0)) + 1 : 1;
}

function nextLessonCardOrder(lesson, zone) {
  const zoneCards = lesson.boardCards.filter((card) => (card.zone || lessonZoneForType(card.type)) === zone);
  return zoneCards.length ? Math.max(...zoneCards.map((card) => card.order || 0)) + 1 : 1;
}

function overlayChips(unit) {
  const active = state.overlays;
  const chips = [];
  if (active.bigIdeas) chips.push(...shortenAll(unit.bigIdeas));
  if (active.learningOutcomes) chips.push(...shortenAll(unit.learningOutcomes.primary, true));
  if (active.cc21) chips.push(...shortenAll(unit.cc21));
  if (active.media) chips.push(...shortenAll(unit.media));
  if (active.assessment) chips.push(...shortenAll(unit.assessment));
  if (active.coreExperiences) chips.push(...shortenAll(unit.coreExperiences));
  return chips.slice(0, 8).map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("");
}

function shortenAll(values = [], isLo = false) {
  return values.map((value) => {
    if (isLo) return value.split(":")[0];
    return value.length > 30 ? `${value.slice(0, 27)}...` : value;
  });
}

function startTimelinePointer(event, unit, block) {
  if (event.button !== 0 && event.pointerType === "mouse") return;
  timelineDrag = {
    unitId: unit.id,
    mode: "move",
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originalStart: unit.start,
    originalLocalWeek: timelineLocalWeek(unit.start),
    originalYear: timelineYearForStart(unit.start),
  };
  block.setPointerCapture(event.pointerId);
  block.addEventListener("pointermove", moveTimelinePointer);
  block.addEventListener("pointerup", endTimelinePointer);
  block.addEventListener("pointercancel", endTimelinePointer);
}

function moveTimelinePointer(event) {
  if (!timelineDrag) return;
  const unit = state.units.find((candidate) => candidate.id === timelineDrag.unitId);
  if (!unit) return;
  const deltaWeeks = Math.round((event.clientX - timelineDrag.startX) / weekWidth());
  const year = timelineYearAtPoint(event.clientY) || timelineDrag.originalYear;
  unit.start = clampUnitStartInYear(unit, year, timelineDrag.originalLocalWeek + deltaWeeks);
  renderUnits();
  renderHealth();
  renderEditor();
}

function endTimelinePointer(event) {
  event.currentTarget.releasePointerCapture(timelineDrag.pointerId);
  const unit = state.units.find((candidate) => candidate.id === timelineDrag.unitId);
  if (unit) packTimelineYear(timelineYearForStart(unit.start));
  timelineDrag = null;
  render();
}

function timelineYearAtPoint(clientY) {
  let closestYear = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  els.timelineGrid.querySelectorAll(".timeline-lane-row").forEach((lane) => {
    const rect = lane.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(clientY - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestYear = Number(lane.dataset.year);
    }
  });
  return closestYear;
}

function timelinePlacementFromPoint(clientX, clientY, unit) {
  let closestLane = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  els.timelineGrid.querySelectorAll(".timeline-lane-row").forEach((lane) => {
    const rect = lane.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(clientY - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestLane = lane;
    }
  });
  if (!closestLane) return null;
  const rect = closestLane.getBoundingClientRect();
  const year = Number(closestLane.dataset.year);
  const rawWeek = Math.floor((clientX - rect.left) / weekWidth()) + 1;
  return {
    year,
    start: clampUnitStartInYear(unit, year, rawWeek),
  };
}

function renderHealth() {
  const overlaps = findOverlaps();
  const timelineUnits = state.units.filter((unit) => unit.inTimeline !== false);
  const sorted = timelineUnits.slice().sort((a, b) => a.start - b.start);
  let gapCount = 0;
  for (let i = 1; i < sorted.length; i += 1) {
    if (timelineYearForStart(sorted[i].start) !== timelineYearForStart(sorted[i - 1].start)) continue;
    const previousEnd = sorted[i - 1].start + unitTimelineDuration(sorted[i - 1]) - 1;
    if (sorted[i].start > previousEnd + 1) gapCount += 1;
  }

  const coveredWeeks = new Set();
  timelineUnits.forEach((unit) => {
    for (let week = unit.start; week < unit.start + unitTimelineDuration(unit); week += 1) coveredWeeks.add(week);
  });

  const bigIdeas = new Set(timelineUnits.flatMap((unit) => overviewValues(unit, "bigIdeas")));
  const los = new Set(
    timelineUnits.flatMap((unit) =>
      (unit.lessons || [])
        .flatMap((lesson) => incidenceValuesForLesson(lesson, "learningOutcomes"))
        .map((lo) => lo.slice(0, 3)),
    ),
  );

  const pills = [
    `${coveredWeeks.size}/${WEEK_COUNT} weeks planned`,
    `${bigIdeas.size}/3 Big Ideas used`,
    `${los.size}/6 LOs touched`,
    `${timelineUnits.length} units in 2YIP`,
  ];
  if (gapCount) pills.push(`${gapCount} timeline gaps`);
  if (overlaps.size) pills.push(`${overlaps.size} overlapping units`);

  els.timelineHealth.innerHTML = `
    <div class="timeline-summary-pills">
      ${pills
        .map((pill) => `<span class="health-pill ${pill.includes("overlap") || pill.includes("gap") ? "warn" : ""}">${escapeHtml(pill)}</span>`)
        .join("")}
    </div>
    <section class="timeline-analysis" aria-label="2YIP planning analysis">
      <div class="analysis-heading">
        <p class="eyebrow">HOD Overview</p>
        <h3>Planning Incidence</h3>
      </div>
      <div class="analysis-grid">
        ${renderIncidenceGroup("Big Ideas", timelineUnits, "bigIdeas", libraryItemsByType("bigIdeas"))}
        ${renderIncidenceGroup("Learning Outcomes", timelineUnits, "learningOutcomes", libraryItemsByType("learningOutcomes"), { source: "lesson" })}
        ${renderIncidenceGroup("21CC Emphasis", timelineUnits, "cc21", libraryItemsByType("cc21"), { source: "lesson" })}
        ${renderIncidenceGroup("Core Learning Experiences", timelineUnits, "coreExperiences", libraryItemsByType("coreExperiences"), { source: "lesson" })}
        ${renderIncidenceGroup("Assessment", timelineUnits, "assessment", libraryItemsByType("assessment"), { source: "lesson" })}
        ${renderPedagogyGroup(timelineUnits)}
      </div>
    </section>
  `;
}

function renderIncidenceGroup(title, units, type, expectedValues = [], options = {}) {
  const lessonBased = options.source === "lesson";
  const rows = lessonBased ? lessonIncidenceRows(units, type, expectedValues) : incidenceRows(units, type, expectedValues);
  if (!rows.length) {
    return `
      <article class="analysis-card">
        <h4>${escapeHtml(title)}</h4>
        <p class="not-planned">Not yet planned</p>
      </article>
    `;
  }
  const maxTotal = Math.max(1, ...rows.map((row) => lessonBased ? row.lessonCount : row.weeks));
  return `
    <article class="analysis-card">
      <h4>${escapeHtml(title)}</h4>
      <div class="analysis-list">
        ${rows.map((row) => `
          <div class="analysis-row ${row.unitCount ? "" : "empty"}">
            <div class="analysis-row-main">
              <span>${escapeHtml(row.label)}</span>
              <small>${incidenceRowMeta(row, lessonBased)}</small>
            </div>
            <div class="analysis-bar" aria-hidden="true">
              <span style="width: ${row.unitCount ? Math.max(8, ((lessonBased ? row.lessonCount : row.weeks) / maxTotal) * 100) : 0}%"></span>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function incidenceRowMeta(row, lessonBased) {
  if (!row.unitCount) return "Not yet planned";
  if (!lessonBased) {
    return `${row.unitCount} ${row.unitCount === 1 ? "unit" : "units"} · ${row.weeks} ${row.weeks === 1 ? "week" : "weeks"}`;
  }
  return `${row.lessonCount} ${row.lessonCount === 1 ? "lesson" : "lessons"} · ${row.unitCount} ${row.unitCount === 1 ? "unit" : "units"}`;
}

function renderPedagogyGroup(units) {
  const rows = lessonIncidenceRows(units, "pedagogy", libraryItemsByType("pedagogy"));
  const activeRows = rows.filter((row) => row.unitCount);
  const totalLessons = activeRows.reduce((total, row) => total + row.lessonCount, 0);
  const colors = ["#2f6f73", "#b5493a", "#d49a2a", "#4d5f91", "#7a5b9a", "#5f6f7a"];
  let cursor = 0;
  const stops = activeRows.map((row, index) => {
    const start = cursor;
    const end = totalLessons ? cursor + (row.lessonCount / totalLessons) * 100 : cursor;
    cursor = end;
    return `${colors[index % colors.length]} ${start}% ${end}%`;
  });
  return `
    <article class="analysis-card pedagogy-analysis-card">
      <h4>Pedagogy</h4>
      ${activeRows.length ? `
        <div class="pedagogy-chart-layout">
          <div class="pedagogy-pie" style="background: conic-gradient(${stops.join(", ")});" aria-hidden="true"></div>
          <div class="analysis-list">
            ${rows.map((row, index) => `
              <div class="analysis-row ${row.unitCount ? "" : "empty"}">
                <div class="analysis-row-main">
                  <span><i class="analysis-swatch" style="background:${colors[index % colors.length]}"></i>${escapeHtml(row.label)}</span>
                  <small>${incidenceRowMeta(row, true)}</small>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : `<p class="not-planned">Not yet planned</p>`}
    </article>
  `;
}

function incidenceRows(units, type, expectedValues = []) {
  const labels = uniqueReadableValues([
    ...expectedValues.map((value) => canonicalIncidenceLabel(value, type)),
    ...units.flatMap((unit) => incidenceValuesForUnit(unit, type)),
  ]);
  return labels.map((label) => {
    const matchingUnits = units.filter((unit) => incidenceValuesForUnit(unit, type).includes(label));
    return {
      label,
      unitCount: matchingUnits.length,
      weeks: matchingUnits.reduce((total, unit) => total + unitTimelineDuration(unit), 0),
    };
  });
}

function incidenceValuesForUnit(unit, type) {
  return overviewValues(unit, type).map((value) => canonicalIncidenceLabel(value, type));
}

function lessonIncidenceRows(units, type, expectedValues = []) {
  const lessonEntries = units.flatMap((unit) =>
    (unit.lessons || []).map((lesson) => ({
      unit,
      lesson,
      values: incidenceValuesForLesson(lesson, type),
    })),
  );
  const labels = uniqueReadableValues([
    ...expectedValues.map((value) => canonicalIncidenceLabel(value, type)),
    ...lessonEntries.flatMap((entry) => entry.values),
  ]);
  return labels.map((label) => {
    const matchingEntries = lessonEntries.filter((entry) => entry.values.includes(label));
    const matchingUnitIds = new Set(matchingEntries.map((entry) => entry.unit.id));
    return {
      label,
      unitCount: matchingUnitIds.size,
      lessonCount: matchingEntries.length,
      weeks: matchingEntries.length,
    };
  });
}

function incidenceValuesForLesson(lesson, type) {
  return uniqueReadableValues(
    (lesson.boardCards || [])
      .filter((card) => card.type === type)
      .map((card) => canonicalIncidenceLabel(card.label, type)),
  );
}

function canonicalIncidenceLabel(value, type) {
  if (type === "pedagogy" && value === "Inquiry-Based Learning") return "Inquiry Based Learning";
  return value;
}


function findOverlaps() {
  const overlaps = new Set();
  const timelineUnits = state.units.filter((unit) => unit.inTimeline !== false);
  for (let i = 0; i < timelineUnits.length; i += 1) {
    for (let j = i + 1; j < timelineUnits.length; j += 1) {
      const a = timelineUnits[i];
      const b = timelineUnits[j];
      const aEnd = a.start + unitTimelineDuration(a) - 1;
      const bEnd = b.start + unitTimelineDuration(b) - 1;
      if (a.start <= bEnd && b.start <= aEnd) {
        overlaps.add(a.id);
        overlaps.add(b.id);
      }
    }
  }
  return overlaps;
}

function renderEditor() {
  const unit = selectedUnit();
  if (!unit) {
    els.emptyState.classList.remove("hidden");
    els.unitEditor.classList.add("hidden");
    return;
  }

  els.emptyState.classList.add("hidden");
  els.unitEditor.classList.remove("hidden");
  state.selectedUnitId = unit.id;

  els.editorTitle.textContent = unit.title || "Untitled Unit";
  els.unitTitle.value = unit.title || "";
  els.unitArtTask.value = unit.artTask || "";
  els.unitStart.value = unit.start;
  els.unitDuration.value = unitTimelineDuration(unit);
  els.unitStudentDevelopment.value = unit.studentDevelopment || "";
  els.unitTeachingFocus.value = unit.teachingFocus || "";
  els.unitContext.value = unit.learningContent?.context || "";
  els.unitProcesses.value = unit.learningContent?.artisticProcesses || "";
  els.unitVisualQualities.value = unit.learningContent?.visualQualities || "";
  els.unitNotes.value = unit.notes || "";
  renderTags(unit);
  renderActivitySequence(unit);
  renderExportPreview(unit);
}

function renderTags(unit) {
  const groups = [
    ["Big Ideas", "bigIdeas"],
    ["Primary Learning Outcomes", "learningOutcomes.primary"],
    ["Supporting Learning Outcomes", "learningOutcomes.supporting"],
    ["Media / Art Forms", "media"],
    ["Context Cards", "learningContent.contextCards"],
    ["Artistic Processes", "learningContent.artisticProcessCards"],
    ["Visual Qualities", "learningContent.visualQualityCards"],
    ["Core Experiences", "coreExperiences"],
    ["21CC", "cc21"],
    ["Assessment", "assessment"],
    ["Pedagogy", "pedagogy"],
  ];

  els.unitTags.innerHTML = groups
    .map(([title, path]) => {
      const values = getPath(unit, path) || [];
      const chips = values
        .map(
          (value) => `
            <span class="chip">
              ${escapeHtml(value)}
              <button class="tag-remove" data-path="${path}" data-value="${escapeAttr(value)}" type="button">x</button>
            </span>`,
        )
        .join("");
      return `
        <div class="tag-group">
          <div class="tag-group-title">${title}</div>
          <div class="tag-list">${chips || '<span class="chip">Drop or tap library item</span>'}</div>
        </div>`;
    })
    .join("");

  els.unitTags.querySelectorAll(".tag-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeValueAtPath(unit, button.dataset.path, button.dataset.value);
      render();
    });
  });
}

function renderActivitySequence(unit) {
  els.activitySequence.innerHTML = "";
  for (let offset = 0; offset < unitTimelineDuration(unit); offset += 1) {
    const slot = document.createElement("section");
    slot.className = "week-slot";
    slot.dataset.offset = offset;
    slot.innerHTML = `<div class="week-label">Lesson Slot ${offset + 1}</div>`;
    slot.addEventListener("dragover", allowDrop);
    slot.addEventListener("dragenter", () => slot.classList.add("drag-over"));
    slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      slot.classList.remove("drag-over");
      const payload = getDropPayload(event);
      if (payload) addActivityFromPayload(unit, payload, offset);
    });

    unit.activities
      .filter((activity) => activity.weekOffset === offset)
      .forEach((activity) => slot.append(renderActivityCard(unit, activity)));

    els.activitySequence.append(slot);
  }
}

function renderActivityCard(unit, activity) {
  const card = document.createElement("article");
  card.className = "activity-card";
  card.innerHTML = `
    <div class="activity-actions">
      <strong>${escapeHtml(activity.title)}</strong>
      <button class="small-button" type="button">Remove</button>
    </div>
    <input class="text-input activity-title" value="${escapeAttr(activity.title)}" aria-label="Activity title" />
    <textarea class="text-area activity-purpose" rows="2" aria-label="Activity purpose">${escapeHtml(activity.purpose || "")}</textarea>
  `;
  card.querySelector(".small-button").addEventListener("click", () => {
    unit.activities = unit.activities.filter((candidate) => candidate.id !== activity.id);
    render();
  });
  card.querySelector(".activity-title").addEventListener("input", (event) => {
    activity.title = event.target.value;
    saveState();
    renderExportPreview(unit);
  });
  card.querySelector(".activity-purpose").addEventListener("input", (event) => {
    activity.purpose = event.target.value;
    saveState();
  });
  return card;
}

function renderExportPreview(unit) {
  const rows = [
    ["Duration", unitLessonDurationLabel(unit)],
    ["Student Development", unit.studentDevelopment],
    ["Teaching & Learning Focus", unit.teachingFocus],
    ["Unit Title", unit.title],
    ["Art Task", unit.artTask],
    ["Big Idea", unit.bigIdeas.join("; ")],
    ["Guiding Question", guidingQuestionSummary(unit)],
    ["Theme", unit.theme],
    ["Learning Outcomes", [...unit.learningOutcomes.primary, ...unit.learningOutcomes.supporting].join("; ")],
    ["Learning Content", contentSummary(unit)],
    ["Learning Experiences", [...unit.coreExperiences, ...unit.activities.map((activity) => activity.title)].join("; ")],
    ["Lessons", lessonSummary(unit)],
    ["Pedagogy", unit.pedagogy.join("; ")],
    ["Assessment", unit.assessment.join("; ")],
  ];

  els.exportPreview.innerHTML = rows
    .map(([term, description]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(description || "Not set")}</dd>`)
    .join("");
}

function lessonSummary(unit) {
  return (unit.lessons || [])
    .map((lesson, index) => {
      const structures = lesson.structures
        .map((structure) => (structure === "Others" && lesson.otherStructure ? lesson.otherStructure : structure))
        .join(", ");
      const description = lesson.description || lesson.details;
      const activities = lesson.steps?.length ? ` Activities: ${lesson.steps.map(lessonActivitySummaryText).join(" | ")}` : "";
      return `Lesson ${index + 1}: ${structures || "Structure not set"}${description ? ` - ${description}` : ""}${activities}`;
    })
    .join("; ");
}

function contentSummary(unit) {
  const content = unit.learningContent || {};
  return [
    content.context && `Context: ${content.context}`,
    contextFields(unit).length && `Context fields: ${contextFields(unit).join(", ")}`,
    content.artisticProcesses && `Processes: ${content.artisticProcesses}`,
    unit.media.length && `Media: ${unit.media.join(", ")}`,
    content.visualQualities && `Visual qualities: ${content.visualQualities}`,
    content.contextCards?.length && `Context cards: ${content.contextCards.join(", ")}`,
    content.artisticProcessCards?.length && `Artistic process cards: ${content.artisticProcessCards.join(", ")}`,
    content.visualQualityCards?.length && `Visual quality cards: ${content.visualQualityCards.join(", ")}`,
    visualQualityFields(unit).length && `Visual quality fields: ${visualQualityFields(unit).join(", ")}`,
  ]
    .filter(Boolean)
    .join(" | ");
}

function contextFields(unit) {
  return (unit.boardCards || [])
    .filter((card) => card.type === "context" && card.value?.trim())
    .map((card) => `${card.label}: ${card.value.trim()}`);
}

function visualQualityFields(unit) {
  return (unit.boardCards || [])
    .filter((card) => card.type === "visualQualityText" && card.value?.trim())
    .map((card) => card.value.trim());
}

function renderOverlayButtons() {
  document.querySelectorAll(".overlay-toggle").forEach((button) => {
    button.classList.toggle("active", Boolean(state.overlays[button.dataset.overlay]));
  });
}

function allowDrop(event) {
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = ["boardCard", "lessonCard"].includes(dragPayload?.kind) ? "move" : "copy";
}

function getDropPayload(event) {
  const transfer = event.dataTransfer;
  const candidates = [
    transfer?.getData("application/json"),
    transfer?.getData("text/plain"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Keep trying the next available payload format.
    }
  }
  return dragPayload;
}

function addLibraryItemToUnit(unit, payload, options = {}) {
  if (!payload) return;
  if (payload.type === "teachingMoves") return;
  if (payload.type === "learningOutcomes") {
    const destination = unit.learningOutcomes.primary.length < 2 ? unit.learningOutcomes.primary : unit.learningOutcomes.supporting;
    addUnique(destination, payload.label);
  } else if (Array.isArray(unit[payload.type])) {
    addUnique(unit[payload.type], payload.label);
  } else if (payload.type === "context") {
    addUnique(unit.learningContent.contextCards, payload.label);
  } else if (payload.type === "artisticProcesses") {
    addUnique(unit.learningContent.artisticProcessCards, payload.label);
  } else if (payload.type === "visualQualities") {
    addUnique(unit.learningContent.visualQualityCards, payload.label);
  }
  if (!options.silent) render();
}

function addActivityFromPayload(unit, payload, weekOffset) {
  unit.activities.push({
    id: uid("activity"),
    title: payload.label,
    type: payload.type,
    weekOffset,
    purpose: defaultPurpose(payload),
  });
  if (payload.type === "assessment") addUnique(unit.assessment, payload.label);
  if (payload.type === "coreExperiences") addUnique(unit.coreExperiences, payload.label);
  if (payload.type === "media") addUnique(unit.media, payload.label);
  if (payload.type === "context") addUnique(unit.learningContent.contextCards, payload.label);
  if (payload.type === "artisticProcesses") addUnique(unit.learningContent.artisticProcessCards, payload.label);
  if (payload.type === "visualQualities") addUnique(unit.learningContent.visualQualityCards, payload.label);
  render();
}

function defaultPurpose(payload) {
  const prompts = {
    teachingMoves: "What should students notice, practise, evidence, or reflect on here?",
    assessment: "What evidence of learning will this gather, and how will feedback move learning forward?",
    coreExperiences: "How does this build drawing or portfolio habits?",
    media: "How does this medium serve the inquiry or intended learning?",
  };
  return prompts[payload.type] || "";
}

function addUnique(list, value) {
  if (!list.includes(value)) list.push(value);
}

function getPath(object, path) {
  return path.split(".").reduce((current, part) => current?.[part], object);
}

function removeValueAtPath(object, path, value) {
  const list = getPath(object, path);
  if (!Array.isArray(list)) return;
  const index = list.indexOf(value);
  if (index >= 0) list.splice(index, 1);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function blankUnit(overrides = {}) {
  const nextStart = clamp(
    Math.max(1, ...state.units.map((unit) => unit.start + unitTimelineDuration(unit) + 1)),
    1,
    WEEK_COUNT,
  );
  return {
    id: uid("unit"),
    inTimeline: true,
    title: "Untitled Unit",
    artTask: "",
    start: nextStart,
    duration: 1,
    studentDevelopment: "",
    teachingFocus: "",
    guidingQuestion: "",
    guidingQuestions: [],
    theme: "",
    bigIdeas: [],
    learningOutcomes: { primary: [], supporting: [] },
    media: [],
    coreExperiences: [],
    cc21: [],
    assessment: [],
    learningContent: {
      context: "",
      artisticProcesses: "",
      visualQualities: "",
      contextCards: [],
      artisticProcessCards: [],
      visualQualityCards: [],
    },
    pedagogy: [],
    notes: "",
    boardCards: [],
    lessons: [],
    dismissedSuggestions: [],
    suggestionVersion: SUGGESTION_VERSION,
    activities: [],
    ...overrides,
  };
}

function createUnitFromSetup(destination) {
  const title = els.newUnitTitle.value.trim() || "Untitled Unit";
  const lessonCount = clamp(Number.parseInt(els.newUnitLessons.value, 10) || 1, 1, 40);
  const selectedIdeas = [...els.newUnitBigIdeas.querySelectorAll("input:checked")].map((input) => input.value);
  const unit = blankUnit({
    title,
    duration: lessonCount,
    bigIdeas: selectedIdeas,
  });
  selectedIdeas.forEach((idea) => {
    unit.boardCards.push({
      id: uid("card"),
      type: "bigIdeas",
      label: idea,
      zone: "meaning",
      order: nextBoardOrder(unit, "meaning"),
      value: "",
      confirmed: false,
      purpose: defaultPurpose({ type: "bigIdeas", label: idea }),
    });
  });
  unit.lessons = Array.from({ length: lessonCount }, () => createLesson(unit));
  state.units.push(unit);
  state.selectedUnitId = unit.id;
  state.selectedLessonId = unit.lessons[0]?.id || "";
  unitSetupOpen = false;
  boardHeaderEditing = { title: false, performanceTask: false };
  state.unitOverviewOpen = false;
  state.lessonOverviewOpen = false;
  state.currentScreen = destination === "board" ? "board" : "timeline";
  render();
}

els.addUnit.addEventListener("click", () => {
  unitSetupOpen = true;
  els.newUnitTitle.value = "";
  els.newUnitLessons.value = "4";
  render();
  window.setTimeout(() => els.newUnitTitle.focus(), 0);
});

els.cancelUnitSetup.addEventListener("click", () => {
  unitSetupOpen = false;
  render();
});

els.createUnitTimeline.addEventListener("click", () => createUnitFromSetup("timeline"));

els.createUnitBoard.addEventListener("click", () => createUnitFromSetup("board"));

els.unitSetupModal.addEventListener("click", (event) => {
  if (event.target !== els.unitSetupModal) return;
  unitSetupOpen = false;
  render();
});

els.newPlan?.addEventListener("click", () => {
  openPlanSetup();
});

els.cancelPlanSetup?.addEventListener("click", () => {
  planSetupOpen = false;
  render();
});

els.createPlan?.addEventListener("click", async () => {
  if (!canManageActiveWorkspace()) {
    renderCloudStatus("Only the workspace owner can create plans", "Sign out");
    return;
  }
  const title = els.newPlanTitle.value.trim();
  const subject = els.newPlanSubject.value;
  const teamName = workspaceLabel();
  await persistCurrentPlanBeforeSwitch();
  state = createPlanState({ title, subject, teamName });
  state.currentScreen = "timeline";
  localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, activePlanId());
  planSetupOpen = false;
  saveState();
  render();
  if (cloud.loaded) await saveCloudStateNow();
});

els.planSetupModal?.addEventListener("click", (event) => {
  if (event.target !== els.planSetupModal) return;
  planSetupOpen = false;
  render();
});

els.planSelect?.addEventListener("change", (event) => {
  switchPlan(event.target.value);
});

els.newWorkspace?.addEventListener("click", () => {
  openWorkspaceSetup();
});

els.cancelWorkspaceSetup?.addEventListener("click", () => {
  workspaceSetupOpen = false;
  render();
});

els.createWorkspace?.addEventListener("click", async () => {
  if (!cloud.user) {
    renderCloudStatus("Sign in before creating a team", "Sign in");
    return;
  }
  workspaceSetupOpen = false;
  renderCloudStatus("Creating team workspace...", "Sign out", true);
  try {
    await createTeamWorkspace(els.newWorkspaceName.value);
    renderCloudStatus(`Workspace ready: ${workspaceLabel()}`, "Sign out");
  } catch (error) {
    console.warn("Workspace creation failed", error);
    renderCloudStatus(`Team creation failed: ${error.code || error.message || "check rules"}`, "Sign out");
  }
});

els.workspaceSetupModal?.addEventListener("click", (event) => {
  if (event.target !== els.workspaceSetupModal) return;
  workspaceSetupOpen = false;
  render();
});

els.workspaceSelect?.addEventListener("change", (event) => {
  switchWorkspace(event.target.value);
});

els.workspaceHome?.addEventListener("click", () => {
  state.currentScreen = "workspace";
  workspaceDirectoryWorkspaceId = "";
  render();
});

els.resetDemo.addEventListener("click", () => {
  state = structuredClone(defaultState);
  render();
});

els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.currentScreen = button.dataset.screen;
    if (state.currentScreen === "lesson") state.lessonOverviewOpen = false;
    render();
  });
});

els.timeline.addEventListener("dragover", (event) => {
  const payload = getDropPayload(event);
  if (payload?.kind !== "timelineUnit") return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
});

els.timeline.addEventListener("drop", (event) => {
  event.preventDefault();
  const payload = getDropPayload(event);
  if (payload?.kind !== "timelineUnit") return;
  const unit = state.units.find((candidate) => candidate.id === payload.unitId);
  if (!unit) return;
  const placement = timelinePlacementFromPoint(event.clientX, event.clientY, unit);
  if (!placement) return;
  unit.start = placement.start;
  unit.inTimeline = true;
  packTimelineYear(placement.year);
  state.selectedUnitId = unit.id;
  dragPayload = null;
  render();
});

els.unitLayer.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".unit-block-delete");
  if (!removeButton) return;
  event.preventDefault();
  event.stopPropagation();
  removeUnitFromTimeline(removeButton.dataset.unitId);
});

els.boardZones.forEach((zone) => {
  zone.addEventListener("click", () => {
    state.selectedBoardZone = zone.dataset.zone;
    render();
  });
  zone.addEventListener("keydown", (event) => {
    if (isInteractiveTarget(event.target)) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    state.selectedBoardZone = zone.dataset.zone;
    render();
  });
  zone.addEventListener("dragover", allowDrop);
  zone.addEventListener("dragenter", () => {
    state.selectedBoardZone = zone.dataset.zone;
    renderLibrary();
    updateBoardZoneSelection();
    zone.classList.add("zone-over");
  });
  zone.addEventListener("dragleave", (event) => {
    if (!zone.contains(event.relatedTarget)) zone.classList.remove("zone-over");
  });
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    zone.classList.remove("zone-over");
    const unit = selectedUnit();
    const payload = getDropPayload(event);
    if (!unit || !payload) return;
    placePayloadOnBoard(unit, payload, zone.dataset.zone);
  });
});

function isInteractiveTarget(target) {
  return Boolean(target?.closest?.("textarea, input, button, select, [contenteditable='true']"));
}

els.unitBoard.addEventListener("dragover", allowDrop);
els.unitBoard.addEventListener("drop", (event) => {
  event.preventDefault();
  const unit = selectedUnit();
  const payload = getDropPayload(event);
  if (!unit || !payload) return;
  placePayloadOnBoard(unit, payload, nearestBoardZone(event.clientX, event.clientY));
});

els.lessonBoardZones.forEach((zone) => {
  zone.addEventListener("click", () => {
    state.selectedLessonZone = zone.dataset.lessonZone;
    render();
  });
  zone.addEventListener("keydown", (event) => {
    if (isInteractiveTarget(event.target)) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    state.selectedLessonZone = zone.dataset.lessonZone;
    render();
  });
  zone.addEventListener("dragover", allowDrop);
  zone.addEventListener("dragenter", () => {
    state.selectedLessonZone = zone.dataset.lessonZone;
    renderLibrary();
    updateLessonZoneSelection();
    zone.classList.add("zone-over");
  });
  zone.addEventListener("dragleave", (event) => {
    if (!zone.contains(event.relatedTarget)) zone.classList.remove("zone-over");
  });
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    zone.classList.remove("zone-over");
    const lesson = selectedLesson();
    const payload = getDropPayload(event);
    if (!lesson || !payload) return;
    placePayloadOnLessonBoard(lesson, payload, zone.dataset.lessonZone);
  });
});

els.lessonPlanningBoard.addEventListener("dragover", allowDrop);
els.lessonPlanningBoard.addEventListener("drop", (event) => {
  event.preventDefault();
  const lesson = selectedLesson();
  const payload = getDropPayload(event);
  if (!lesson || !payload) return;
  placePayloadOnLessonBoard(lesson, payload, nearestLessonZone(event.clientX, event.clientY));
});

function placePayloadOnBoard(unit, payload, targetZone) {
  if (payload.type === "teachingMoves") return;
  if (payload.kind === "boardCard") {
    const card = unit.boardCards.find((candidate) => candidate.id === payload.cardId);
    if (card) {
      const zone = zoneAllowsType(targetZone, card.type) ? targetZone : zoneForType(card.type);
      card.zone = zone;
      card.order = nextBoardOrder(unit, zone);
      render();
    }
    return;
  }
  addBoardCard(unit, payload, {
    zone: zoneAllowsType(targetZone, payload.type) ? targetZone : zoneForType(payload.type),
  });
}

function placePayloadOnLessonBoard(lesson, payload, targetZone) {
  const unit = selectedUnit();
  if (payload.kind === "lessonCard") {
    const card = lesson.boardCards.find((candidate) => candidate.id === payload.cardId);
    if (card) {
      const zone = lessonZoneAllowsType(targetZone, card.type) ? targetZone : lessonZoneForType(card.type);
      card.zone = zone;
      card.order = nextLessonCardOrder(lesson, zone);
      render();
    }
    return;
  }
  if (payload.kind === "boardCard") return;
  addLessonBoardCard(unit, lesson, payload, {
    zone: lessonZoneAllowsType(targetZone, payload.type) ? targetZone : lessonZoneForType(payload.type),
  });
}

function nearestBoardZone(clientX, clientY) {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  els.boardZones.forEach((zone) => {
    const rect = zone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(centerX - clientX, centerY - clientY);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = zone.dataset.zone;
    }
  });
  return nearest || "activity";
}

function nearestLessonZone(clientX, clientY) {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  els.lessonBoardZones.forEach((zone) => {
    const rect = zone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(centerX - clientX, centerY - clientY);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = zone.dataset.lessonZone;
    }
  });
  return nearest || "content";
}

els.arrangeBoard.addEventListener("click", () => {
  const unit = selectedUnit();
  if (!unit) return;
  state.unitOverviewOpen = true;
  render();
});

els.clearBoard.addEventListener("click", () => {
  const unit = selectedUnit();
  if (!unit) return;
  unit.boardCards = [];
  render();
});

els.addLesson.addEventListener("click", () => {
  const unit = selectedUnit();
  if (!unit) return;
  unit.lessons = unit.lessons || [];
  const lesson = createLesson(unit);
  unit.lessons.push(lesson);
  syncUnitDurationToLessons(unit);
  state.selectedLessonId = lesson.id;
  state.lessonOverviewOpen = false;
  render();
});

els.addLessonFromBoard.addEventListener("click", () => {
  const unit = selectedUnit();
  if (!unit) return;
  unit.lessons = unit.lessons || [];
  const lesson = createLesson(unit);
  unit.lessons.push(lesson);
  syncUnitDurationToLessons(unit);
  state.selectedLessonId = lesson.id;
  state.lessonOverviewOpen = false;
  state.currentScreen = "lesson";
  render();
});

els.saveUnit.addEventListener("click", () => {
  const unit = selectedUnit();
  if (!unit) return;
  boardHeaderEditing = { title: false, performanceTask: false };
  saveState();
  renderUnitList();
  renderUnits();
  renderBoard();
  showSaveStatus("Saved");
});

els.editBoardTitle.addEventListener("click", () => {
  boardHeaderEditing.title = true;
  renderBoard();
  els.boardTitle.focus();
  els.boardTitle.select();
});

els.editBoardPerformanceTask.addEventListener("click", () => {
  boardHeaderEditing.performanceTask = true;
  renderBoard();
  els.boardPerformanceTask.focus();
});

els.boardTitle.addEventListener("input", (event) => {
  const unit = selectedUnit();
  if (!unit) return;
  unit.title = event.target.value;
  els.editorTitle.textContent = unit.title || "Untitled Unit";
  if (document.activeElement !== els.unitTitle) els.unitTitle.value = unit.title || "";
  renderUnitList();
  renderUnits();
  renderExportPreview(unit);
  saveState();
});

els.boardTitle.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  boardHeaderEditing.title = false;
  renderBoard();
});

els.confirmBoardTitle.addEventListener("click", () => {
  boardHeaderEditing.title = false;
  renderBoard();
});

els.boardTitle.addEventListener("blur", () => {
  boardHeaderEditing.title = false;
  renderBoard();
});

els.boardPerformanceTask.addEventListener("input", (event) => {
  const unit = selectedUnit();
  if (!unit) return;
  unit.artTask = event.target.value;
  if (document.activeElement !== els.unitArtTask) els.unitArtTask.value = unit.artTask || "";
  renderExportPreview(unit);
  saveState();
});

els.boardPerformanceTask.addEventListener("blur", () => {
  boardHeaderEditing.performanceTask = false;
  renderBoard();
});

els.confirmBoardPerformanceTask.addEventListener("click", () => {
  boardHeaderEditing.performanceTask = false;
  renderBoard();
});

els.lessonTitle.addEventListener("input", (event) => {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.title = event.target.value;
  renderLibrary();
  renderLessonPicker(els.lessonPickerList, selectedUnit());
  saveState();
});

els.lessonDescription.addEventListener("input", (event) => {
  const lesson = selectedLesson();
  if (!lesson) return;
  syncLessonDescription(lesson, event.target.value);
  saveState();
});

els.lessonObjectives.addEventListener("input", (event) => {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.objectives = event.target.value;
  saveState();
});

function saveCurrentLesson() {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.confirmed = true;
  state.lessonOverviewOpen = false;
  saveState();
  render();
  els.lessonSaveStatus.textContent = "Saved";
  els.confirmLessonBoard.textContent = "Saved";
  window.setTimeout(() => {
    els.lessonSaveStatus.textContent = "";
    els.confirmLessonBoard.textContent = "Save Lesson";
  }, 1200);
}

els.confirmLessonBoard.addEventListener("click", saveCurrentLesson);

els.saveLessonBottom.addEventListener("click", saveCurrentLesson);

els.editLessonBoard.addEventListener("click", () => {
  const lesson = selectedLesson();
  if (!lesson) return;
  state.lessonOverviewOpen = !state.lessonOverviewOpen;
  render();
});

els.chooseLessonImage.addEventListener("click", () => {
  els.lessonImageUpload.click();
});

els.lessonImageUpload.addEventListener("change", (event) => {
  const lesson = selectedLesson();
  const file = event.target.files?.[0];
  if (!lesson || !file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    lesson.imageDataUrl = String(reader.result || "");
    lesson.imageName = file.name;
    event.target.value = "";
    render();
  });
  reader.readAsDataURL(file);
});

els.removeLessonImage.addEventListener("click", () => {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.imageDataUrl = "";
  lesson.imageName = "";
  render();
});

els.addLessonStep.addEventListener("click", () => {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.steps = lesson.steps || [];
  lesson.steps.push(createLessonStep());
  render();
});

document.querySelectorAll(".overlay-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.overlay;
    state.overlays[key] = !state.overlays[key];
    render();
  });
});

els.unitTitle.addEventListener("input", (event) => {
  const unit = selectedUnit();
  unit.title = event.target.value;
  if (document.activeElement !== els.boardTitle) els.boardTitle.value = unit.title || "";
  renderUnitList();
  renderUnits();
  renderExportPreview(unit);
  saveState();
});

els.unitArtTask.addEventListener("input", (event) => {
  const unit = selectedUnit();
  unit.artTask = event.target.value;
  if (document.activeElement !== els.boardPerformanceTask) els.boardPerformanceTask.value = unit.artTask || "";
  renderExportPreview(unit);
  saveState();
});

els.unitStart.addEventListener("change", (event) => {
  const unit = selectedUnit();
  const requestedStart = clamp(Number(event.target.value), 1, WEEK_COUNT);
  unit.start = clampUnitStartInYear(unit, timelineYearForStart(requestedStart), timelineLocalWeek(requestedStart));
  render();
});

els.unitDuration.addEventListener("change", (event) => {
  const unit = selectedUnit();
  unit.duration = clamp(Number(event.target.value), 1, 12);
  unit.start = clampUnitStartInYear(unit, timelineYearForStart(unit.start));
  render();
});

els.unitNotes.addEventListener("input", (event) => {
  selectedUnit().notes = event.target.value;
  saveState();
});

els.unitStudentDevelopment.addEventListener("input", (event) => {
  const unit = selectedUnit();
  unit.studentDevelopment = event.target.value;
  renderExportPreview(unit);
  saveState();
});

els.unitTeachingFocus.addEventListener("input", (event) => {
  const unit = selectedUnit();
  unit.teachingFocus = event.target.value;
  renderExportPreview(unit);
  saveState();
});

els.unitContext.addEventListener("input", (event) => {
  const unit = selectedUnit();
  unit.learningContent.context = event.target.value;
  renderExportPreview(unit);
  saveState();
});

els.unitProcesses.addEventListener("input", (event) => {
  const unit = selectedUnit();
  unit.learningContent.artisticProcesses = event.target.value;
  renderExportPreview(unit);
  saveState();
});

els.unitVisualQualities.addEventListener("input", (event) => {
  const unit = selectedUnit();
  unit.learningContent.visualQualities = event.target.value;
  renderExportPreview(unit);
  saveState();
});

els.addActivity.addEventListener("click", () => {
  const unit = selectedUnit();
  unit.activities.push({
    id: uid("activity"),
    title: "New Activity Clip",
    type: "custom",
    weekOffset: 0,
    purpose: "",
  });
  render();
});

els.cloudAuth?.addEventListener("click", toggleCloudAuth);
els.loginGoogle?.addEventListener("click", toggleCloudAuth);
els.loginReset?.addEventListener("click", resetCloudSignIn);

window.addEventListener("error", (event) => {
  console.warn("Planner startup error", event.error || event.message);
  renderLoginGate(`Startup paused: ${event.message || "reload and try again."}`, false);
});

window.addEventListener("beforeunload", saveStateSafely);
window.addEventListener("popstate", () => {
  historySyncPaused = true;
  applyLocationToState();
  render();
  historySyncPaused = false;
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveStateSafely();
});
window.setInterval(saveStateSafely, 2000);

window.__ART_APP_BOOTED__ = true;
initCloudSync();
try {
  syncHistoryToScreen({ replace: true });
  render();
} catch (error) {
  console.warn("Planner render failed", error);
  renderLoginGate(firebaseErrorMessage(error, "Planner startup paused. Reload and try again."), false);
}
