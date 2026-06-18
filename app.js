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
const DELETED_WORKSPACE_CATALOG_STORAGE_KEY = "art-curriculum-deleted-workspace-catalog";
const DELETED_PLAN_CATALOG_STORAGE_KEY = "art-curriculum-deleted-plan-catalog";
const LAST_GOOD_PLAN_CATALOG_STORAGE_KEY = "art-curriculum-last-good-plan-catalog";
const LAST_SNAPSHOT_META_STORAGE_KEY = "art-curriculum-last-snapshot-meta";
const CLOUD_WORKSPACE_PREFIX = "teacher-workspace";
const TEAM_WORKSPACE_PREFIX = "team-workspace";
const CLOUD_PLAN_ID = "main-planner-state";
const SUGGESTION_VERSION = 3;
const SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000;
const EDIT_LOCK_TIMEOUT_MS = 2 * 60 * 1000;
const EDIT_LOCK_HEARTBEAT_MS = 25 * 1000;
const EDIT_SESSION_STORAGE_KEY = "art-curriculum-editor-session-id";
const CLOUD_IMAGE_MAX_CHARS = 320000;
const CLOUD_IMAGE_TOTAL_MAX_CHARS = 620000;
const IMAGE_PREVIEW_MAX_SIDE = 1100;
const SHARED_CARD_TYPES = new Set(["cc21"]);
const hiddenPlanningCards = new Set(["Communication, Collaboration and Information Skills"]);
const lessonOnlyCardTypes = new Set(["teachingMoves", "cc21Goals"]);
const deprecatedArtisticProcessCards = new Set([
  "Observe, record and reflect",
  "Gather and research",
  "Generate visual possibilities",
  "Experiment with materials and methods",
  "Create artworks to communicate ideas",
  "Evaluate and give feedback",
]);
const assessmentLabelMap = {
  "Diagnostic drawing check": "Diagnostic Check",
  "Formative critique": "Formative Assessment",
  "Portfolio review": "Formative Assessment",
  "Weighted assessment": "Summative Assessment",
  "Self-assessment checklist": "Self Assessment",
  "Reflection prompt": "Self Assessment",
  "End-of-year evidence": "Summative Assessment",
};
const learningOutcomeLabelMap = {
  "LO4: Develop personally relevant works of art independently or with others.":
    "LO4: Develop personally relevant works of art independently or with others, with consideration for aesthetic qualities and social and cultural awareness.",
};
const naturalSortCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

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
      "LO4: Develop personally relevant works of art independently or with others, with consideration for aesthetic qualities and social and cultural awareness.",
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
      "AP1: Observe, record and reflect on what they see and experience",
      "AP2: Gather and research on different types of visual and other information",
      "AP3: Generate visual possibilities by experimenting with different materials, tools, methods, images and ideas",
      "AP4: Create artworks to communicate ideas",
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
      "Experiential Learning",
      "Embodied Learning",
      "Disciplinary & Interdisciplinary Learning",
      "Dialogic Talk",
    ],
  },
  {
    title: "Teaching Actions",
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
      "Diagnostic Check",
      "Formative Assessment",
      "Summative Assessment",
      "Self Assessment",
      "Peer Assessment",
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

const libraryCardDetails = {
  "Art helps us to see in new ways.": {
    tone: "yellow",
    title: "Art helps us to see in new ways.",
    detailLabel: "Context",
    context: [
      "Artists use a variety of means such as sketching and photography to record what they see in the world around them. Each method of recording has its unique features and helps us to focus on different aspects and visual qualities of what we see.",
      "Artists also change the visual attributes of what they see to draw attention to the world around us.",
    ],
  },
  "Art tells stories about our world.": {
    tone: "pink",
    title: "Art tells stories about our world.",
    detailLabel: "Context",
    context: [
      "Artworks often present a different perspective to events depicted, and provide a glimpse into the lives and concerns of artists and the people they portray.",
      "We can learn about community, and aspects of how people live, and relate to one another by understanding the events depicted; and why and how people are depicted together in artworks.",
    ],
  },
  "Art influences the way we live.": {
    tone: "blue",
    title: "Art influences the way we live.",
    detailLabel: "Context",
    context: [
      "Art is inseparable from daily life. Almost everything around us had been put together using visual principles. Art is present as part of our daily living, from the design and ergonomics of things we use, to advertisements we see around us, to the design of everyday spaces we navigate through. Over time, many of these unique images, artefacts and dwelling spaces have come to represent the cultures from which they originate. Artists use their knowledge of how images work to communicate certain ideas and persuade people to take actions.",
    ],
  },
  "Critical Thinking": {
    tone: "orange",
    title: "Critical Thinking",
    detailLabel: "",
    context: [
      "Critical Thinking refers to the ability to exercise sound reasoning and metacognitive thinking to interpret and analyse information and evidence, draw conclusions, make decisions, and solve problems.",
    ],
  },
  "Adaptive Thinking": {
    tone: "orange",
    title: "Adaptive Thinking",
    detailLabel: "",
    context: [
      "Adaptive Thinking refers to the ability to apply learnt knowledge and skills strategically and with flexibility in different or new and evolving contexts.",
    ],
  },
  "Inventive Thinking": {
    tone: "orange",
    title: "Inventive Thinking",
    detailLabel: "",
    context: [
      "Inventive Thinking refers to the ability to frame, investigate and explore issues, generate innovative ideas, and evaluate them to form novel and useful responses.",
    ],
  },
  "Communication Skills": {
    tone: "orange",
    title: "Communication",
    detailLabel: "",
    context: [
      "Effective communication refers to the ability to convey information and exchange ideas clearly and coherently through multimodal ways for specific purposes, audiences and contexts.",
    ],
  },
  "Collaboration Skills": {
    tone: "orange",
    title: "Collaboration",
    detailLabel: "",
    context: [
      "Effective collaboration refers to the ability to work together in a respectful manner to share responsibilities and make collective decisions to meet shared goals.",
    ],
  },
  "Information Skills": {
    tone: "orange",
    title: "Information Skills",
    detailLabel: "",
    context: [
      "Information Skills refer to the ability to source for, select, evaluate and synthesise digital and non-digital information with discernment. It also entails ethical and responsible practices when using, sharing and creating information.",
    ],
  },
  "Civic Literacy": {
    tone: "orange",
    title: "Civic Literacy",
    detailLabel: "",
    context: [
      "Civic Literacy refers to the ability to understand the nation’s values, governance, context and realities, form one’s civic identity, and constructively engage with and contribute to one’s community and nation.",
    ],
  },
  "Global Literacy": {
    tone: "orange",
    title: "Global Literacy",
    detailLabel: "",
    context: [
      "Global Literacy refers to the ability to understand and think with discernment about world issues and interact responsibly and constructively with people from and beyond Singapore on such issues.",
    ],
  },
  "Cross-cultural Literacy": {
    tone: "orange",
    title: "Cross-Cultural Literacy",
    detailLabel: "",
    context: [
      "Cross-Cultural Literacy refers to the ability to sensitively understand, appreciate and interact with different social, cultural and religious communities and their perspectives.",
    ],
  },
  "Diagnostic Check": {
    tone: "blue",
    title: "Diagnostic Assessment",
    detailLabel: "",
    context: [
      "Diagnostic assessment is normally used at the start of a unit to find out what students already know and where their misconceptions lie, so that teaching can be planned at the right level and pace. It supports developmentally appropriate teaching by giving you a clear picture of students' starting points before you begin.",
      "Use what you find to adjust the sequence, depth, or pace of your unit plan. Share the findings with students too, so they are aware of their own starting points. Avoid using diagnostic information to label or limit students. Treat it as a springboard for learning, not a fixed judgement of ability.",
    ],
  },
  "Formative Assessment": {
    tone: "blue",
    title: "Formative Assessment",
    detailLabel: "",
    context: [
      "Formative assessment happens during teaching and learning to help students improve, rather than to assign grades. It can range from informal in-class strategies to more structured tasks, and is essential for helping students become self-directed learners who can monitor and take ownership of their own progress.",
      "Plan specific moments in your unit where you will check for understanding, and plan what you will do with that information. Remember that formative assessment only works when the feedback loop is closed. Avoid letting these assessments quietly become high-stakes in students' eyes by keeping the focus firmly on learning and growth.",
    ],
  },
  "Summative Assessment": {
    tone: "blue",
    title: "Summative Assessment",
    detailLabel: "",
    context: [
      "Summative assessment is conducted normally at the end of a unit to report on what students have achieved. While its primary purpose is to measure learning, it can also be used formatively, for example, by having students reflect on their performance and identify next steps for improvement.",
      "Be clear about the purpose and communicate it to students. Ensure the weighting and demand of the task are appropriate. Avoid over-inflating the perceived stakes, as this adds unnecessary pressure and anxiety for both students and teachers.",
    ],
  },
  "Self Assessment": {
    tone: "blue",
    title: "Self-Assessment",
    detailLabel: "",
    context: [
      "As one of the two key drivers of student assessment literacy, self-assessment involves students making judgements about their own learning and progress. It is at the heart of developing self-directed learners, as the process of reflecting on one's own work builds the metacognitive and self-regulatory skills students need for lifelong learning.",
      "Give students structured tools to guide their reflection, such as co-constructed checklists or learning targets, and encourage them to think about not just what went wrong but why and what they will do differently. Self-assessment works best when students trust it is genuinely for their own growth. Keep it low-stakes and separate from grading.",
    ],
  },
  "Peer Assessment": {
    tone: "blue",
    title: "Peer Assessment",
    detailLabel: "",
    context: [
      "As one of the two key drivers of student assessment literacy, peer assessment involves students evaluating each other's work using clear criteria, acting as learning resources for one another. Beyond providing feedback, the process of assessing a peer's work deepens students' own understanding of what quality looks like and builds important collaborative skills.",
      "Provide students with clear rubrics or criteria so their feedback is specific and useful, and build in time for them to act on what they receive. Students need to be explicitly taught how to give constructive feedback. Without this scaffolding, peer assessment can easily become superficial or unhelpful.",
    ],
  },
  "Experiential Learning": {
    tone: "pedagogy",
    title: "Experiential Learning",
    detailLabel: "",
    context: [
      "Students engage directly with real-world environments, materials, or situations. The unit is designed around a cycle of experience, reflection, and application — helping students make meaningful connections between what they do and what they learn.",
      "Unit Design Prompt: What concrete experience will anchor this unit, and how will students reflect and apply what they learn?",
    ],
  },
  "Embodied Learning": {
    tone: "pedagogy",
    title: "Embodied Learning",
    detailLabel: "",
    context: [
      "Physical and sensory engagement is not just an activity — it is the primary vehicle for understanding. Teachers design creative experiences where students use movement, gesture, or making to surface and express their thinking.",
      "Unit Design Prompt: How will students use their bodies and senses to make meaning across this unit?",
    ],
  },
  "Disciplinary & Interdisciplinary Learning": {
    tone: "pedagogy",
    title: "Disciplinary & Interdisciplinary Learning",
    detailLabel: "",
    context: [
      "Students are immersed in the ways of thinking, questioning, and problem-solving characteristic of a discipline or across disciplines. Teachers design tasks that require students to apply disciplinary lenses to authentic, complex problems.",
      "Unit Design Prompt: What disciplinary thinking or cross-disciplinary connections do you want students to develop in this unit?",
    ],
  },
  "Dialogic Talk": {
    tone: "pedagogy",
    title: "Dialogic Talk",
    detailLabel: "",
    context: [
      "Purposeful talk is the engine of learning. Teachers design structured opportunities for students to articulate, challenge, and refine their thinking through dialogue — moving beyond recitation towards genuine intellectual exchange.",
      "Unit Design Prompt: What kinds of talk will you design for, and how will dialogue help students build understanding in this unit?",
    ],
  },
  "Guiding Question": {
    tone: "orange",
    title: "Guiding Question",
    detailLabel: "",
    context: [
      "Beginning with questions helps to ground the lesson unit in inquiry-led approaches.",
    ],
  },
  "Theme": {
    tone: "orange",
    title: "Theme",
    detailLabel: "",
    context: [
      "A central subject or narrative used to situate art learning within authentic, real-world contexts to make it more meaningful for students.",
    ],
  },
  "Drawing: Observe": {
    tone: "teal",
    title: "Through drawing...\nI observe",
    detailLabel: "Elaboration",
    context: [
      "Observational drawing encourages students to go slow to explore, notice, sense-make and think about the stimulus more thoroughly.",
    ],
  },
  "Drawing: Think": {
    tone: "teal",
    title: "Through drawing...\nI think",
    detailLabel: "Elaboration",
    context: [
      "Drawing can be used as a tool to generate, develop, organize, encode and communicate personal ideas.",
    ],
  },
  "Drawing: Imagine": {
    tone: "teal",
    title: "Through drawing...\nI imagine",
    detailLabel: "Elaboration",
    context: [
      "Through drawing, students make marks on paper and are encouraged to imagine the possibilities of what the drawing can be.",
    ],
  },
  "Portfolio: Document": {
    tone: "coreExperiences",
    title: "Portfolio: Document",
    detailLabel: "",
    context: [
      "Students establish habits and routines that support day-to-day generation, keeping and management of materials that could contribute to a portfolio.",
      "Students learn basic photo-documentation skills to ensure artworks are accurately and clearly captured. Students learn to label, store and organise their materials either in analogue or digital ways.",
    ],
  },
  "Portfolio: Curate": {
    tone: "coreExperiences",
    title: "Portfolio: Curate",
    detailLabel: "",
    context: [
      "Students consider their intended narrative as they select a body of visuals from existing materials generated from day-to-day learning.",
      "Students learn to arrange, sequence and assemble selected materials in a coherent manner to convey their intended narrative. Curation can be done individually, in pairs or in groups.",
    ],
  },
  "Portfolio: Reflect": {
    tone: "coreExperiences",
    title: "Portfolio: Reflect",
    detailLabel: "",
    context: [
      "When curating, students undergo a reflective process of recalling learning, observing connections in thoughts and interests, and evaluating their endeavours in overcoming personal artistic boundaries.",
      "When viewing presentations by others, students learn to relate, to contribute their views respectfully, and to situate their art making. Reflection invites self-assessment.",
    ],
  },
  "Portfolio: (Re)present": {
    tone: "coreExperiences",
    title: "Portfolio: (Re)present",
    detailLabel: "",
    context: [
      "Presentations can be formal or informal, in pairs, small groups or with larger audiences, and in the form of oral presentation or showcases.",
      "Presenting to others involves organising and externalising ideas, thoughts and feelings that are internalised when learning; students learn to articulate a representation of themselves.",
      "Participatory mechanisms that encourage interaction or feedback, such as inviting the audience to leave notes for the presenter, can be built in.",
    ],
  },
  "AP1: Observe, record and reflect on what they see and experience": {
    tone: "process",
    title: "Artistic Process 1: Observe, record and reflect on what they see and experience",
    detailLabel: "",
    context: [
      "Students observe closely and accurately by examining from different perspectives and representing details and visual qualities of what they see around them and in artworks.",
      "Students are curious about what they see by generating questions and ideas, taking initiative to learn more about visual phenomena and what they see around them and in artworks.",
      "Students capture and present what they see and experience using various tools and strategies, such as quick sketching, photography, composing images with framing and focus, and describing what they see in oral and written forms.",
      "Students evaluate and form personal ideas and opinions about what they see and experience.",
      "Students share with others, give and receive feedback on their observations, ideas and opinions about what they see around them and in artworks.",
    ],
  },
  "AP2: Gather and research on different types of visual and other information": {
    tone: "process",
    title: "Artistic Process 2: Gather and research on different types of visual and other information",
    detailLabel: "",
    context: [
      "Students generate guiding questions and relevant areas for visual and informational research about a theme, topic or subject matter by themselves and with others.",
      "Students search for relevant visual resources using conventional and digital means, including first-hand observation, sketching, close observation studies, photographs, print sources and digital sources.",
      "Students evaluate, select and use visual and informational materials relevant to the focus and scope of their search.",
      "Students evaluate their own and others' research processes.",
    ],
  },
  "AP3: Generate visual possibilities by experimenting with different materials, tools, methods, images and ideas": {
    tone: "process",
    title: "Artistic Process 3: Generate visual possibilities by experimenting with different materials, tools, methods, images and ideas",
    detailLabel: "",
    context: [
      "Students generate different visual ideas appropriate to intentions using multiple strategies, such as representing from various angles, magnifying details, playing with elements and principles of design, applying different artistic styles and inventing new strategies.",
      "Students experiment with different art techniques, art materials and tools to achieve intentions or create new effects.",
      "Students evaluate, select and develop ideas to express ideas and achieve intentions.",
      "Students evaluate their own and others' use of visual strategies and experimentation.",
    ],
  },
  "AP4: Create artworks to communicate ideas": {
    tone: "process",
    title: "Artistic Process 4: Create artworks to communicate ideas",
    detailLabel: "",
    context: [
      "Students generate, formulate and express ideas for art making, such as in response to given themes.",
      "Students use a range of materials and techniques associated with media such as drawing, painting, photography, design and sculpture to achieve desired outcomes.",
      "Students conceptualise, plan and carry out ideas and processes to make artworks to express ideas, including devising plans, selecting visual strategies and monitoring their work processes.",
      "Students evaluate their own and give feedback to others' art making processes and artworks based on given criteria.",
    ],
  },
};

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

const reflectionCheckpointPurposes = [
  "Curricular goal",
  "21CC learning goals",
];

const teachingActionLibrary = [
  {
    id: "know-want-to-know-learnt",
    title: "Know, Want to Know, Learnt",
    description: "Students record what they Know, Want to know, and have Learnt",
    area: "Activating Prior Knowledge",
    activityTypes: ["Connect & Wonder", "Reflect"],
    pedagogies: [],
    keywords: ["kwl", "prior knowledge", "reflect"],
  },
  {
    id: "concept-cartoons",
    title: "Concept Cartoons",
    description: "Visual scenarios surface and challenge student preconceptions",
    area: "Activating Prior Knowledge",
    activityTypes: ["Connect & Wonder", "Investigate"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["misconceptions", "scenario", "visual"],
  },
  {
    id: "scenario-task-action-reflection",
    title: "Scenario, Task, Action, Reflection",
    description: "A real-world scenario anchors student inquiry from analysis to reflection",
    area: "Activating Prior Knowledge",
    activityTypes: ["Connect & Wonder", "Investigate"],
    pedagogies: ["Experiential Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["scenario", "real-world", "reflection"],
  },
  {
    id: "thinking-with-objects",
    title: "Thinking with Objects",
    description: "Meaningful objects and key questions connect students to subject matter",
    area: "Activating Prior Knowledge",
    activityTypes: ["Connect & Wonder", "Investigate", "Make"],
    pedagogies: ["Experiential Learning", "Embodied Learning"],
    keywords: ["objects", "questions", "stimulus"],
  },
  {
    id: "discrepant-events",
    title: "Discrepant Events",
    description: "A surprising event sparks curiosity and hooks students into learning",
    area: "Arousing Interest",
    activityTypes: ["Connect & Wonder"],
    pedagogies: ["Experiential Learning"],
    keywords: ["surprise", "curiosity", "hook"],
  },
  {
    id: "teach-a-friend",
    title: "Teach a Friend",
    description: "Students teach a concept to a peer to deepen understanding",
    area: "Arousing Interest",
    activityTypes: ["Make", "Express"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["peer teaching", "explain", "share"],
  },
  {
    id: "using-stories-and-images",
    title: "Using Stories and Images",
    description: "Narratives and visuals make learning meaningful and memorable",
    area: "Arousing Interest",
    activityTypes: ["Connect & Wonder", "Investigate", "Express"],
    pedagogies: ["Experiential Learning", "Embodied Learning"],
    keywords: ["stories", "images", "narrative"],
  },
  {
    id: "chalk-talk",
    title: "Chalk Talk",
    description: "Silent written discussion where students respond to a prompt on paper",
    area: "Encouraging Learner Engagement",
    activityTypes: ["Connect & Wonder", "Investigate", "Reflect"],
    pedagogies: ["Embodied Learning", "Dialogic Talk"],
    keywords: ["silent discussion", "written response", "prompt"],
  },
  {
    id: "engage-explore-apply",
    title: "Engage, Explore, Apply",
    description: "Three-phase structure moving students from engagement to application",
    area: "Encouraging Learner Engagement",
    activityTypes: ["Connect & Wonder", "Investigate", "Make"],
    pedagogies: ["Experiential Learning", "Embodied Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["phase", "apply", "engage"],
  },
  {
    id: "facilitating-productive-academic-discussion",
    title: "Facilitating Productive Academic Discussion",
    description: "Structured discussion pushes students to reason and build on each other's ideas",
    area: "Encouraging Learner Engagement",
    activityTypes: ["Connect & Wonder", "Investigate", "Express"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["discussion", "reasoning", "talk"],
  },
  {
    id: "repeat-clarify-understand",
    title: "Repeat, Clarify, Understand",
    description: "Students Repeat, Clarify, and deepen Understanding through structured interaction",
    area: "Encouraging Learner Engagement",
    activityTypes: ["Express", "Reflect"],
    pedagogies: ["Dialogic Talk"],
    keywords: ["clarify", "interaction", "understand"],
  },
  {
    id: "use-of-analogies",
    title: "Use of Analogies",
    description: "Familiar comparisons make abstract concepts accessible",
    area: "Providing Clear Explanation",
    activityTypes: ["Investigate", "Make"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning"],
    keywords: ["analogy", "comparison", "explanation"],
  },
  {
    id: "demonstration",
    title: "Demonstration",
    description: "Teacher shows students how to do something before asking them to try",
    area: "Providing Clear Explanation",
    activityTypes: ["Make"],
    pedagogies: ["Experiential Learning", "Embodied Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["demo", "model", "technique"],
  },
  {
    id: "models-as-teaching-aids",
    title: "Models as Teaching Aids",
    description: "Physical or conceptual models represent abstract ideas concretely",
    area: "Providing Clear Explanation",
    activityTypes: ["Investigate", "Make"],
    pedagogies: ["Embodied Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["model", "concrete", "representation"],
  },
  {
    id: "model-thinking-aloud",
    title: "Model Thinking Aloud",
    description: "Teacher verbalises thinking to make expert reasoning visible",
    area: "Providing Clear Explanation",
    activityTypes: ["Make"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["think aloud", "reasoning", "model"],
  },
  {
    id: "visual-organisers",
    title: "Visual Organisers",
    description: "Graphic tools help students organise and connect ideas",
    area: "Providing Clear Explanation",
    activityTypes: ["Investigate", "Make", "Reflect"],
    pedagogies: ["Embodied Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["graphic organiser", "organise", "connect"],
  },
  {
    id: "managing-transitions",
    title: "Managing Transitions",
    description: "Smooth movement between activities maintains lesson flow",
    area: "Pacing and Maintaining Momentum",
    activityTypes: ["Make"],
    pedagogies: [],
    keywords: ["transition", "flow", "pace"],
  },
  {
    id: "pause-and-reflect",
    title: "Pause and Reflect",
    description: "Deliberate pauses allow students to consolidate thinking mid-lesson",
    area: "Pacing and Maintaining Momentum",
    activityTypes: ["Investigate", "Make", "Reflect"],
    pedagogies: ["Experiential Learning"],
    keywords: ["pause", "consolidate", "reflect"],
  },
  {
    id: "activating-time-fillers",
    title: "Activating Time Fillers",
    description: "Purposeful short activities maintain engagement during downtime",
    area: "Pacing and Maintaining Momentum",
    activityTypes: ["Make"],
    pedagogies: [],
    keywords: ["time filler", "downtime", "engagement"],
  },
  {
    id: "whiteboarding",
    title: "Whiteboarding",
    description: "Students collaboratively solve problems on whiteboards to make thinking visible",
    area: "Facilitating Collaborative Learning",
    activityTypes: ["Connect & Wonder", "Investigate"],
    pedagogies: ["Embodied Learning", "Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["whiteboard", "collaboration", "visible thinking"],
  },
  {
    id: "jigsaw",
    title: "Jigsaw",
    description: "Students become experts on one part of a topic and teach it to peers",
    area: "Facilitating Collaborative Learning",
    activityTypes: ["Investigate", "Express"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["expert group", "peer teaching", "collaboration"],
  },
  {
    id: "reciprocal-teaching",
    title: "Reciprocal Teaching",
    description: "Students take turns leading discussion using four comprehension strategies",
    area: "Facilitating Collaborative Learning",
    activityTypes: ["Investigate", "Express"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["discussion", "student-led", "comprehension"],
  },
  {
    id: "think-pair-share",
    title: "Think, Pair, Share",
    description: "Students think individually, discuss in pairs, then share with the class",
    area: "Facilitating Collaborative Learning",
    activityTypes: ["Connect & Wonder", "Investigate", "Express"],
    pedagogies: ["Dialogic Talk"],
    keywords: ["pair", "share", "discussion"],
  },
  {
    id: "scouting-for-information",
    title: "Scouting for Information",
    description: "Students collaboratively research and gather information from sources",
    area: "Facilitating Collaborative Learning",
    activityTypes: ["Investigate"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning"],
    keywords: ["research", "sources", "information"],
  },
  {
    id: "engagement-through-collaboration-and-interactivity-using-information-and-communications-technology",
    title: "Engagement through Collaboration and Interactivity Using Information and Communications Technology",
    description: "Digital tools facilitate collaborative learning experiences",
    area: "Facilitating Collaborative Learning",
    activityTypes: ["Investigate", "Make"],
    pedagogies: ["Experiential Learning", "Embodied Learning", "Dialogic Talk"],
    keywords: ["ict", "digital", "collaboration", "technology"],
  },
  {
    id: "initiate-respond-follow-up-chains",
    title: "Initiate, Respond, Follow-up Chains",
    description: "Structured Initiate-Respond-Follow-up sequences deepen student responses",
    area: "Using Questions to Deepen Learning",
    activityTypes: ["Express", "Reflect"],
    pedagogies: ["Dialogic Talk"],
    keywords: ["questioning", "follow-up", "response"],
  },
  {
    id: "pumping",
    title: "Pumping",
    description: "Follow-up prompts push students to elaborate beyond surface-level answers",
    area: "Using Questions to Deepen Learning",
    activityTypes: ["Connect & Wonder", "Investigate", "Express"],
    pedagogies: ["Dialogic Talk"],
    keywords: ["questioning", "elaborate", "prompt"],
  },
  {
    id: "refine-refine-and-refine",
    title: "Refine, Refine and Refine",
    description: "Iterative questioning improves precision in student thinking and expression",
    area: "Using Questions to Deepen Learning",
    activityTypes: ["Make", "Express", "Reflect"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["refine", "iterate", "precision"],
  },
  {
    id: "generating-questions",
    title: "Generating Questions",
    description: "Students generate their own questions to drive and own their inquiry",
    area: "Using Questions to Deepen Learning",
    activityTypes: ["Connect & Wonder", "Investigate"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning"],
    keywords: ["questions", "inquiry", "student questions"],
  },
  {
    id: "challenge-me",
    title: "Challenge Me",
    description: "Students interrogate each other's ideas through structured questioning",
    area: "Using Questions to Deepen Learning",
    activityTypes: ["Investigate", "Express", "Reflect"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["challenge", "questioning", "peer"],
  },
  {
    id: "clarify-sensitise-influence",
    title: "Clarify, Sensitise, Influence",
    description: "Questions Clarify thinking, Sensitise students to issues, and Influence perspectives",
    area: "Using Questions to Deepen Learning",
    activityTypes: ["Connect & Wonder", "Investigate"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["clarify", "sensitise", "influence"],
  },
  {
    id: "socratic-method-of-questioning",
    title: "Socratic Method of Questioning",
    description: "Probing questions help students examine assumptions and deepen reasoning",
    area: "Using Questions to Deepen Learning",
    activityTypes: ["Connect & Wonder", "Investigate", "Express", "Reflect"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["socratic", "assumptions", "probing"],
  },
  {
    id: "pass-it-round",
    title: "Pass It Round",
    description: "A question or idea is passed around the class to build collective understanding",
    area: "Concluding the Lesson",
    activityTypes: ["Express", "Reflect"],
    pedagogies: ["Dialogic Talk"],
    keywords: ["share", "collective", "question"],
  },
  {
    id: "3-2-1-summariser",
    title: "3-2-1 Summariser",
    description: "Students identify 3 things learnt, 2 questions, and 1 application",
    area: "Concluding the Lesson",
    activityTypes: ["Reflect"],
    pedagogies: ["Experiential Learning"],
    keywords: ["summarise", "exit ticket", "reflect"],
  },
  {
    id: "my-learning-checklist",
    title: "My Learning Checklist",
    description: "Students assess their own understanding against lesson objectives",
    area: "Concluding the Lesson",
    activityTypes: ["Reflect"],
    pedagogies: ["Experiential Learning"],
    keywords: ["checklist", "self-assessment", "objectives"],
  },
  {
    id: "my-visual-representation",
    title: "My Visual Representation",
    description: "Students represent their learning visually through drawing, maps, or graphs",
    area: "Concluding the Lesson",
    activityTypes: ["Investigate", "Make", "Express"],
    pedagogies: ["Experiential Learning", "Embodied Learning"],
    keywords: ["visual", "mind map", "drawing"],
  },
  {
    id: "what-have-i-learnt",
    title: "What Have I Learnt",
    description: "Students reflect on What they learnt and How they learnt it",
    area: "Concluding the Lesson",
    activityTypes: ["Reflect"],
    pedagogies: ["Experiential Learning"],
    keywords: ["reflection", "learning", "metacognition"],
  },
  {
    id: "affirm-question-suggest",
    title: "Affirm, Question, Suggest",
    description: "Structured feedback that Affirms, Questions, and Suggests next steps",
    area: "Checking for Understanding and Providing Feedback",
    activityTypes: ["Make", "Express", "Reflect"],
    pedagogies: ["Dialogic Talk"],
    keywords: ["feedback", "critique", "peer"],
  },
  {
    id: "comment-only-feedback",
    title: "Comment Only Feedback",
    description: "Written comments without grades focus students on improvement",
    area: "Checking for Understanding and Providing Feedback",
    activityTypes: ["Make", "Reflect"],
    pedagogies: [],
    keywords: ["feedback", "comment", "assessment"],
  },
  {
    id: "justify-my-thinking",
    title: "Justify My Thinking",
    description: "Students explain the reasoning behind their answers",
    area: "Checking for Understanding and Providing Feedback",
    activityTypes: ["Investigate", "Express", "Reflect"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["justify", "reasoning", "explain"],
  },
  {
    id: "i-do-i-know-i-check",
    title: "I Do, I Know, I Check",
    description: "Students self-assess their ability to perform, explain, and verify their learning",
    area: "Checking for Understanding and Providing Feedback",
    activityTypes: ["Make", "Reflect"],
    pedagogies: ["Experiential Learning"],
    keywords: ["self-assessment", "check", "understanding"],
  },
  {
    id: "reverse-engineering-multiple-choice-questions",
    title: "Reverse Engineering Multiple Choice Questions",
    description: "Students analyse multiple choice question options to surface and address misconceptions",
    area: "Checking for Understanding and Providing Feedback",
    activityTypes: ["Investigate"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning"],
    keywords: ["mcq", "misconception", "analysis"],
  },
  {
    id: "share-my-learning",
    title: "Share My Learning",
    description: "Students share their learning with peers to consolidate and receive feedback",
    area: "Checking for Understanding and Providing Feedback",
    activityTypes: ["Express", "Reflect"],
    pedagogies: ["Experiential Learning", "Dialogic Talk"],
    keywords: ["share", "feedback", "consolidate"],
  },
  {
    id: "thumbometer",
    title: "Thumbometer",
    description: "A quick gesture indicates each student's level of understanding",
    area: "Checking for Understanding and Providing Feedback",
    activityTypes: ["Make", "Reflect"],
    pedagogies: [],
    keywords: ["quick check", "gesture", "understanding"],
  },
  {
    id: "demonstrating-my-understanding-through-mind-maps",
    title: "Demonstrating My Understanding through Mind Maps",
    description: "Students create mind maps to organise and show their understanding",
    area: "Supporting Self-Directed Learning",
    activityTypes: ["Connect & Wonder", "Investigate", "Reflect"],
    pedagogies: ["Disciplinary & Interdisciplinary Learning"],
    keywords: ["mind map", "organise", "understanding"],
  },
  {
    id: "role-play",
    title: "Role Play",
    description: "Students take on roles to explore concepts, perspectives, or scenarios",
    area: "Supporting Self-Directed Learning",
    activityTypes: ["Connect & Wonder", "Express"],
    pedagogies: ["Experiential Learning", "Embodied Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["role", "perspective", "scenario"],
  },
  {
    id: "facilitating-online-forum-discussion",
    title: "Facilitating Online Forum Discussion",
    description: "Asynchronous online discussion extends thinking beyond the classroom",
    area: "Supporting Self-Directed Learning",
    activityTypes: ["Investigate", "Express", "Reflect"],
    pedagogies: ["Dialogic Talk"],
    keywords: ["online", "forum", "discussion"],
  },
  {
    id: "show-and-tell",
    title: "Show and Tell",
    description: "Students present their learning to an audience to demonstrate understanding",
    area: "Setting Meaningful Assignments",
    activityTypes: ["Express"],
    pedagogies: ["Experiential Learning", "Embodied Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["present", "audience", "share"],
  },
  {
    id: "practice-for-mastery",
    title: "Practice for Mastery",
    description: "Repeated practice with feedback builds fluency in skills or knowledge",
    area: "Setting Meaningful Assignments",
    activityTypes: ["Make"],
    pedagogies: ["Experiential Learning", "Embodied Learning", "Disciplinary & Interdisciplinary Learning"],
    keywords: ["practice", "mastery", "fluency"],
  },
  {
    id: "your-choice",
    title: "Your Choice",
    description: "Students choose how they demonstrate their learning to promote agency",
    area: "Setting Meaningful Assignments",
    activityTypes: ["Connect & Wonder", "Investigate", "Make", "Express", "Reflect"],
    pedagogies: ["Experiential Learning", "Embodied Learning", "Disciplinary & Interdisciplinary Learning", "Dialogic Talk"],
    keywords: ["choice", "agency", "assignment"],
  },
];

const legacyTeachingActionAliases = {
  "gallery-walk": "pass-it-round",
  "peer-critique": "affirm-question-suggest",
  "see-think-wonder": "generating-questions",
  "material-exploration": "engage-explore-apply",
  "teacher-demonstration": "demonstration",
  "visual-journaling": "what-have-i-learnt",
  "artist-statement-writing": "show-and-tell",
  "moodboard-curation": "scouting-for-information",
};

const teachingAreaOrder = [
  "Activating Prior Knowledge",
  "Arousing Interest",
  "Encouraging Learning Engagement",
  "Providing Clear Explanation",
  "Pacing and Maintaining Momentum",
  "Facilitating Collaborative Learning",
  "Using Questions to Deepen Learning",
  "Checking for Understanding and Providing Feedback",
  "Supporting Self-Directed Learning",
  "Setting Meaningful Assignments",
  "Concluding the Lesson",
];

const teachingAreaDisplayLabels = {
  "Encouraging Learner Engagement": "Encouraging Learning Engagement",
};

teachingActionLibrary.forEach((action) => {
  libraryCardDetails[action.title] = {
    tone: "teachingMoves",
    title: action.title,
    detailLabel: "",
    context: [
      action.description,
      `Teaching area: ${teachingActionAreaLabel(action.area || "General")}`,
      ...(action.pedagogies.length ? [`Linked pedagogies: ${action.pedagogies.join(", ")}`] : []),
      `Useful activity types: ${action.activityTypes.join(", ")}`,
    ],
  };
});

const artisticProcessLabels = {
  ap1: "AP1: Observe, record and reflect on what they see and experience",
  ap2: "AP2: Gather and research on different types of visual and other information",
  ap3: "AP3: Generate visual possibilities by experimenting with different materials, tools, methods, images and ideas",
  ap4: "AP4: Create artworks to communicate ideas",
};

const loProcessSuggestions = [
  {
    lo: "LO1",
    processes: [artisticProcessLabels.ap1, artisticProcessLabels.ap2],
  },
  {
    lo: "LO2",
    processes: [artisticProcessLabels.ap2, artisticProcessLabels.ap3],
  },
  {
    lo: "LO3",
    processes: [artisticProcessLabels.ap3, artisticProcessLabels.ap4],
  },
  {
    lo: "LO4",
    processes: [artisticProcessLabels.ap4],
  },
  {
    lo: "LO5",
    processes: [artisticProcessLabels.ap1, artisticProcessLabels.ap4],
  },
  {
    lo: "LO6",
    processes: [artisticProcessLabels.ap1, artisticProcessLabels.ap2],
  },
];

const cc21LessonGoalGroups = [
  {
    domain: "Critical, Adaptive and Inventive Thinking",
    competencies: [
      {
        competency: "Critical Thinking",
        emphasis: "Critical Thinking",
        goals: [
          {
            code: "CAIT 1",
            title: "Exercises sound reasoning and decision-making",
            milestone: "Students can use evidence and adopt different viewpoints to explain their reasoning and decisions.",
          },
          {
            code: "CAIT 2",
            title: "Uses metacognition to enhance, monitor and regulate thinking",
            milestone: "Students can reflect on their thoughts, attitudes, behaviour, actions and draw on relevant cognitive strategies to determine and act on the modifications required.",
          },
        ],
      },
      {
        competency: "Adaptive Thinking",
        emphasis: "Adaptive Thinking",
        goals: [
          {
            code: "CAIT 3",
            title: "Assesses different contexts and situations to make connections and draw new insights",
            milestone: "Students can understand the similarities and differences between different contexts or situations and how this might affect their perspective or approach.",
          },
          {
            code: "CAIT 4",
            title: "Manages complexities and ambiguities by adjusting perspective and strategies",
            milestone: "Students can draw on different perspectives and strategies to adjust their approach when required, applying learnt knowledge and skills in unfamiliar contexts.",
          },
        ],
      },
      {
        competency: "Inventive Thinking",
        emphasis: "Inventive Thinking",
        goals: [
          {
            code: "CAIT 5",
            title: "Explores possibilities and generates novel and useful ideas",
            milestone: "Students can generate ideas that may involve modifying existing ones and explore different pathways that are appropriate to respond to an issue or challenge.",
          },
          {
            code: "CAIT 6",
            title: "Evaluates and refines ideas to formulate novel and useful solutions",
            milestone: "Students can evaluate and refine their ideas using relevant strategies and based on a set of criteria that is appropriate for the task or context.",
          },
        ],
      },
    ],
  },
  {
    domain: "Communication, Collaboration and Information Skills",
    competencies: [
      {
        competency: "Communication",
        emphasis: "Communication Skills",
        goals: [
          {
            code: "CCI 1",
            title: "Effectively communicates information and co-constructs meaning",
            milestone: "Students can convey and evaluate knowledge to co-construct new understandings and ideas coherently, while considering the specific purpose and context of communication.",
          },
          {
            code: "CCI 2",
            title: "Engages empathetically with diverse perspectives",
            milestone: "Students can respond with respect and empathy. Students are sensitive to the diverse backgrounds that influence different perspectives while interacting with others.",
          },
        ],
      },
      {
        competency: "Collaboration",
        emphasis: "Collaboration Skills",
        goals: [
          {
            code: "CCI 3",
            title: "Interacts and works effectively in group settings to contribute to shared goals",
            milestone: "Students can manage disagreements with group members and take in suggestions, while contributing to the completion of a task to meet the shared goals.",
          },
          {
            code: "CCI 4",
            title: "Collectively defines and negotiates roles and tasks to achieve group goals",
            milestone: "Students can determine and effectively assume the role they will play by considering the dynamics of the group.",
          },
        ],
      },
      {
        competency: "Information Skills",
        emphasis: "Information Skills",
        goals: [
          {
            code: "CCI 5",
            title: "Locates and evaluates digital and non-digital information and resources",
            milestone: "Students can select, organise and synthesise information from multiple sources and verify the accuracy, credibility and currency of information by cross-referencing multiple sources.",
          },
          {
            code: "CCI 6",
            title: "Creates and shares information ethically and responsibly",
            milestone: "Students can consider the impact of what they share and create, maintain positive relationships with others, and acknowledge sources of information.",
          },
        ],
      },
    ],
  },
  {
    domain: "Civic, Global and Cross-Cultural Literacy",
    competencies: [
      {
        competency: "Civic Literacy",
        emphasis: "Civic Literacy",
        goals: [
          {
            code: "CGC 1",
            title: "Demonstrates understanding of values, ideals and issues of significance",
            milestone: "Students can describe and explain issues that affect the culture, social and economic development, governance, future and identity of Singapore, and understand multiple perspectives on them.",
          },
          {
            code: "CGC 2",
            title: "Plays active and constructive roles to improve the school, community and nation",
            milestone: "Students can plan and organise programmes with others that contribute to school and community, with support. Students can differentiate the civic roles played by individuals, groups and organisations in contributing to the community and nation.",
          },
        ],
      },
      {
        competency: "Global Literacy",
        emphasis: "Global Literacy",
        goals: [
          {
            code: "CGC 3",
            title: "Aware of global issues, interconnections and trends, and forms informed perspectives",
            milestone: "Students can demonstrate awareness of global issues, explain their impact and describe Singapore's role in addressing issues in the global community.",
          },
          {
            code: "CGC 4",
            title: "Interacts confidently with people from Singapore and beyond on global issues",
            milestone: "Students can interact respectfully with people from Singapore and other countries to understand each other better and/or discuss global issues and reach relevant conclusions.",
          },
        ],
      },
      {
        competency: "Cross-Cultural Literacy",
        emphasis: "Cross-cultural Literacy",
        goals: [
          {
            code: "CGC 5",
            title: "Aware of and appreciates the cultural background and identity of self and others",
            milestone: "Students can appreciate the value of a diversity of cultural and religious communities' heritage, customs, and perspectives, and their contributions to Singapore and the world.",
          },
          {
            code: "CGC 6",
            title: "Shows sensitivity and openness in interactions with diverse communities",
            milestone: "Students can demonstrate empathy, awareness of their own biases, and appropriate behaviour towards the lived experiences of people from different social, cultural and religious backgrounds within and beyond Singapore.",
          },
        ],
      },
    ],
  },
];

const cc21LessonGoals = cc21LessonGoalGroups.flatMap((domain) =>
  domain.competencies.flatMap((competency) =>
    competency.goals.map((goal) => ({
      ...goal,
      domain: domain.domain,
      competency: competency.competency,
      emphasis: competency.emphasis,
      label: `${goal.code}: ${goal.title}`,
    })),
  ),
);

cc21LessonGoals.forEach((goal) => {
  libraryCardDetails[goal.label] = {
    tone: "purple",
    title: goal.label,
    detailLabel: "",
    context: [
      `${goal.competency} | ${goal.domain}`,
      `Lower Secondary milestone: ${goal.milestone}`,
    ],
  };
});

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
  showAll21ccLessonGoals: false,
  activeTeachingActionPickerStepId: "",
  activeTeachingActionDetailStepId: "",
  activeTeachingActionDetailId: "",
  teachingActionSearch: "",
  showAllTeachingActions: false,
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
      assessment: ["Diagnostic Check", "Formative Assessment"],
      learningContent: {
        context: "School environment and everyday visual culture.",
        artisticProcesses: "Observe, record and reflect; gather and research; generate visual possibilities.",
        visualQualities: "Line, texture, space, contrast.",
        contextCards: ["Topic / Subject Matter"],
        artisticProcessCards: [artisticProcessLabels.ap1, artisticProcessLabels.ap3],
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
      assessment: ["Formative Assessment"],
      learningContent: {
        context: "Objects, memory, community, and personal narratives.",
        artisticProcesses: "Gather and research; create artworks to communicate ideas.",
        visualQualities: "Colour, balance, emphasis, composition.",
        contextCards: ["Personal / Social / Cultural Meaning"],
        artisticProcessCards: [artisticProcessLabels.ap2, artisticProcessLabels.ap4],
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
  storage: null,
  user: null,
  loaded: false,
  status: "Local save",
};
let workspaceCatalog = loadWorkspaceCatalog();
let workspaceSharedLibrary = loadWorkspaceSharedLibrary();
let planCatalog = loadPlanCatalog();
let deletedWorkspaceCatalog = loadDeletedWorkspaceCatalog();
let deletedPlanCatalog = loadDeletedPlanCatalog();
let state = loadState();
let dragPayload = null;
let timelineDrag = null;
let timelineClick = { unitId: "", at: 0 };
let boardHeaderEditing = { title: false, performanceTask: false };
let unitSetupOpen = false;
let planSetupOpen = false;
let workspaceSetupOpen = false;
let cloudSaveTimer = null;
let authStateTimer = null;
let cloudSyncPaused = false;
let historySyncPaused = false;
let saveWritesPaused = false;
let workspaceMembers = [];
let workspaceInvites = [];
let userAccessiblePlans = [];
let workspaceDirectoryWorkspaceId = "";
let workspaceDirectoryLoading = false;
let planCatalogVerified = false;
let cloudSaveBlocked = false;
let cardDetailInsertAction = null;
let lastPersistedContentHash = "";
let activePlanRevision = 0;
let editLock = {
  mode: "none",
  info: null,
  sessionId: getEditorSessionId(),
};
let editLockHeartbeatTimer = null;

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
  recoveryTrash: document.querySelector("#recovery-trash"),
  recoveryModal: document.querySelector("#recovery-modal"),
  recoveryTitle: document.querySelector("#recovery-title"),
  recoveryBody: document.querySelector("#recovery-body"),
  recoveryClose: document.querySelector("#recovery-close"),
  cardDetailModal: document.querySelector("#card-detail-modal"),
  cardDetailPreview: document.querySelector("#card-detail-preview"),
  cardDetailTitle: document.querySelector("#card-detail-title"),
  cardDetailLabel: document.querySelector("#card-detail-label"),
  cardDetailContext: document.querySelector("#card-detail-context"),
  cardDetailCancel: document.querySelector("#card-detail-cancel"),
  cardDetailInsert: document.querySelector("#card-detail-insert"),
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
  arrangeLessonBoard: document.querySelector("#arrange-lesson-board"),
  saveLessonBottom: document.querySelector("#save-lesson-bottom"),
  lessonTopSaveStatus: document.querySelector("#lesson-top-save-status"),
  lessonSaveStatus: document.querySelector("#lesson-save-status"),
  lessonTitle: document.querySelector("#lesson-title"),
  lessonDuration: document.querySelector("#lesson-duration"),
  lessonDescription: document.querySelector("#lesson-description"),
  lessonObjectives: document.querySelector("#lesson-objectives"),
  lessonMeaningBrief: document.querySelector("#lesson-meaning-brief"),
  lessonImagePreview: document.querySelector("#lesson-image-preview"),
  lessonImageUpload: document.querySelector("#lesson-image-upload"),
  chooseLessonImage: document.querySelector("#choose-lesson-image"),
  removeLessonImage: document.querySelector("#remove-lesson-image"),
  lessonImageStatus: document.querySelector("#lesson-image-status"),
  lessonInheritedChips: document.querySelector("#lesson-inherited-chips"),
  lessonPlanningBoard: document.querySelector("#lesson-planning-board"),
  mobileLessonTabs: document.querySelector("#mobile-lesson-tabs"),
  mobileLessonCardPicker: document.querySelector("#mobile-lesson-card-picker"),
  lessonBoardZones: document.querySelectorAll(".lesson-zone"),
  lessonBoardStructures: document.querySelector("#lesson-board-structures"),
  lessonSteps: document.querySelector("#lesson-steps"),
  addLessonStep: document.querySelector("#add-lesson-step"),
  addReflectionCheckpoint: document.querySelector("#add-reflection-checkpoint"),
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
  overviewUnit: document.querySelector("#overview-unit"),
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
  lockPanel: document.querySelector("#lock-panel"),
  lockStatus: document.querySelector("#lock-status"),
  takeOverLock: document.querySelector("#take-over-lock"),
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
    const storedPlanId = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY);
    const catalogPlanId = planCatalog.find(planBelongsToActiveWorkspace)?.id || "";
    const activePlanId = storedPlanId || catalogPlanId;
    const savedRaw = activePlanId ? localStorage.getItem(planStateStorageKey(activePlanId)) : localStorage.getItem(STORAGE_KEY);
    const saved = savedRaw ? JSON.parse(savedRaw) : null;
    const loaded = saved && Array.isArray(saved.units) ? normalizeState(saved) : structuredClone(defaultState);
    loaded.currentScreen = screenFromLocation();
    if (activePlanId && (!loaded.plan?.id || loaded.plan.id === CLOUD_PLAN_ID)) {
      loaded.plan = normalizePlanMetadata({ ...(loaded.plan || {}), id: activePlanId });
    }
    if ((activePlanId && loaded.plan?.id === activePlanId) || saved) {
      savePlanToCatalog(loaded.plan);
      localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, loaded.plan.id);
    } else {
      localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
    }
    return loaded;
  } catch {
    const fallback = structuredClone(defaultState);
    fallback.currentScreen = screenFromLocation();
    localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
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
  normalized.showAll21ccLessonGoals = Boolean(normalized.showAll21ccLessonGoals);
  normalized.activeTeachingActionPickerStepId = normalized.activeTeachingActionPickerStepId || "";
  normalized.activeTeachingActionDetailStepId = normalized.activeTeachingActionDetailStepId || "";
  normalized.activeTeachingActionDetailId = normalized.activeTeachingActionDetailId || "";
  normalized.teachingActionSearch = normalized.teachingActionSearch || "";
  normalized.showAllTeachingActions = Boolean(normalized.showAllTeachingActions);
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
    assessment: normalizePlanningValues(unit.assessment || [], "assessment"),
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
    deletedAt: plan.deletedAt || "",
    deletedBy: plan.deletedBy || "",
    deletedReason: plan.deletedReason || "",
    lastVerifiedAt: plan.lastVerifiedAt || "",
    stale: Boolean(plan.stale),
  };
}

function normalizeWorkspaceMetadata(workspace = {}) {
  return {
    id: workspace.id || activeWorkspaceId(),
    name: workspace.name || "My Workspace",
    type: workspace.type || "personal",
    role: workspace.role || "owner",
    createdBy: workspace.createdBy || "",
    deletedAt: workspace.deletedAt || "",
    deletedBy: workspace.deletedBy || "",
    deletedReason: workspace.deletedReason || "",
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
  const saved = cardLibrary
    .map((category) => ({
      title: category.title || "Cards",
      type: category.type || "",
      items: Array.isArray(category.items) ? category.items : [],
    }))
    .filter((category) => includeShared ? SHARED_CARD_TYPES.has(category.type) : !SHARED_CARD_TYPES.has(category.type))
    .filter((category) => category.title && category.items.length);
  const merged = fallback.map((defaultCategory) => {
    const savedCategory = saved.find((category) => category.type === defaultCategory.type && category.title === defaultCategory.title)
      || saved.find((category) => category.type === defaultCategory.type);
    if (!savedCategory) return defaultCategory;
    return {
      ...defaultCategory,
      items: mergeLibraryItems(defaultCategory, savedCategory.items),
    };
  });
  saved
    .filter((category) => !merged.some((candidate) => candidate.type === category.type || candidate.title === category.title))
    .forEach((category) => merged.push(category));
  return merged.filter((category) => category.items.length);
}

function mergeLibraryItems(defaultCategory, savedItems) {
  if (defaultCategory.type === "assessment") return defaultCategory.items;
  const normalizedDefaults = defaultCategory.items
    .map((entry) => normalizeLibraryEntry(defaultCategory, entry))
    .filter((entry) => isCurrentLibraryEntry(entry));
  const seen = new Set(normalizedDefaults.map(libraryEntryKey));
  const customItems = savedItems
    .map((entry) => normalizeLibraryEntry(defaultCategory, entry))
    .filter((entry) => isCurrentLibraryEntry(entry))
    .filter((entry) => {
      const key = libraryEntryKey(entry);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((entry) => entry.type === defaultCategory.type ? entry.label : { label: entry.label, type: entry.type });
  return [...defaultCategory.items, ...customItems];
}

function libraryEntryKey(entry) {
  return `${entry.type}:${entry.label}`;
}

function isCurrentLibraryEntry(entry) {
  if (entry.type === "artisticProcesses" && deprecatedArtisticProcessCards.has(entry.label)) return false;
  return !hiddenPlanningCards.has(entry.label);
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

function loadDeletedWorkspaceCatalog() {
  try {
    const catalog = JSON.parse(localStorage.getItem(DELETED_WORKSPACE_CATALOG_STORAGE_KEY));
    return Array.isArray(catalog) ? catalog.map(normalizeWorkspaceMetadata) : [];
  } catch {
    return [];
  }
}

function saveDeletedWorkspaceCatalog() {
  localStorage.setItem(DELETED_WORKSPACE_CATALOG_STORAGE_KEY, JSON.stringify(deletedWorkspaceCatalog));
}

function loadDeletedPlanCatalog() {
  try {
    const catalog = JSON.parse(localStorage.getItem(DELETED_PLAN_CATALOG_STORAGE_KEY));
    return Array.isArray(catalog) ? catalog.map(normalizePlanMetadata) : [];
  } catch {
    return [];
  }
}

function saveDeletedPlanCatalog() {
  localStorage.setItem(DELETED_PLAN_CATALOG_STORAGE_KEY, JSON.stringify(deletedPlanCatalog));
}

function lastGoodPlanCatalogStorageKey(workspaceId = activeWorkspaceId()) {
  const userId = cloud.user?.uid || "local";
  return `${LAST_GOOD_PLAN_CATALOG_STORAGE_KEY}:${userId}:${workspaceId || "local-workspace"}`;
}

function saveLastGoodPlanCatalog(workspaceId = activeWorkspaceId(), plans = plansForActiveWorkspace()) {
  const visiblePlans = plans
    .map(normalizePlanMetadata)
    .filter((plan) => !plan.deletedAt);
  localStorage.setItem(lastGoodPlanCatalogStorageKey(workspaceId), JSON.stringify(visiblePlans));
}

function loadLastGoodPlanCatalog(workspaceId = activeWorkspaceId()) {
  try {
    const catalog = JSON.parse(localStorage.getItem(lastGoodPlanCatalogStorageKey(workspaceId)));
    return Array.isArray(catalog) ? catalog.map(normalizePlanMetadata) : [];
  } catch {
    return [];
  }
}

function lastGoodPlanStateStorageKey(planId = activePlanId(), workspaceId = activeWorkspaceId()) {
  const userId = cloud.user?.uid || "local";
  return `${LAST_GOOD_PLAN_CATALOG_STORAGE_KEY}:state:${userId}:${workspaceId || "local-workspace"}:${planId || CLOUD_PLAN_ID}`;
}

function loadLastGoodPlanState(planId = activePlanId(), workspaceId = activeWorkspaceId()) {
  try {
    const saved = JSON.parse(localStorage.getItem(lastGoodPlanStateStorageKey(planId, workspaceId)));
    return saved && Array.isArray(saved.units) ? normalizeState(saved) : null;
  } catch {
    return null;
  }
}

function savePlanToCatalog(plan = state.plan) {
  const normalized = normalizePlanMetadata(plan);
  if (normalized.deletedAt) {
    planCatalog = planCatalog.filter((entry) => !(entry.id === normalized.id && entry.workspaceId === normalized.workspaceId));
    const existingDeleted = deletedPlanCatalog.find((entry) => entry.id === normalized.id && entry.workspaceId === normalized.workspaceId);
    if (existingDeleted) Object.assign(existingDeleted, normalized);
    else deletedPlanCatalog.push(normalized);
    savePlanCatalog();
    saveDeletedPlanCatalog();
    return;
  }
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
  if (state.currentScreen !== "workspace" || planMetaById(activePlanId())) {
    saveState();
  }
  if (cloud.loaded) await saveCloudStateNow();
}

async function switchPlan(planId, options = {}) {
  if (!planId || (planId === activePlanId() && !options.force)) return;
  const currentScreen = options.targetScreen || state.currentScreen;
  if (!options.skipPersist) await persistCurrentPlanBeforeSwitch();
  await releaseEditingLock();
  localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, planId);
  const catalogPlan = planMetaById(planId);
  let nextState = loadLocalPlanState(planId) || loadLastGoodPlanState(planId);
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
        activePlanRevision = Number(snapshot.data()?.revision || 0);
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
  localStorage.setItem(planStateStorageKey(planId), JSON.stringify(state));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(lastGoodPlanStateStorageKey(planId), JSON.stringify(cleanCloudState(state)));
  lastPersistedContentHash = planStateContentHash(state);
  if (cloud.loaded && state.currentScreen !== "workspace") {
    await acquireEditingLock({ allowSameUserTakeover: true });
  }
  render();
}

function plansForActiveWorkspace() {
  return planCatalog.filter((plan) => planBelongsToActiveWorkspace(plan) && !plan.deletedAt);
}

function deletedPlansForActiveWorkspace() {
  return deletedPlanCatalog.filter((plan) => planBelongsToActiveWorkspace(plan) && plan.deletedAt);
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
  await releaseEditingLock();
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
  state.currentScreen = "workspace";
  localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
  render();
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
  localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
  state.currentScreen = "workspace";
  planCatalogVerified = true;
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

async function renameWorkspace(workspaceId) {
  const workspace = workspaceCatalog.find((entry) => entry.id === workspaceId);
  if (!cloud.user || !cloud.db || !workspace || workspace.role !== "owner" || workspace.type !== "team") return;
  const nextName = window.prompt("Rename workspace", workspace.name || "Workspace");
  const trimmedName = (nextName || "").trim();
  if (!trimmedName || trimmedName === workspace.name) return;
  renderCloudStatus("Renaming workspace...", "Sign out", true);
  await cloud.db.collection("workspaces").doc(workspaceId).set({
    name: trimmedName,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  await cloud.db.collection("users").doc(cloud.user.uid).set({
    workspaces: {
      [workspaceId]: {
        ...normalizeWorkspaceMetadata(workspace),
        name: trimmedName,
      },
    },
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  workspace.name = trimmedName;
  saveWorkspaceCatalog();
  renderCloudStatus("Workspace renamed", "Sign out");
  render();
}

async function deleteWorkspace(workspaceId) {
  const workspace = workspaceCatalog.find((entry) => entry.id === workspaceId);
  if (!cloud.user || !cloud.db || !workspace || workspace.role !== "owner" || workspace.type !== "team") return;
  const workspaceName = workspace.name || "this team workspace";
  const confirmed = window.confirm(`Delete "${workspaceName}" and all 2YIP plans inside it? This cannot be undone.`);
  if (!confirmed) return;
  const typedName = window.prompt(`Type the workspace name to confirm deletion:\n${workspaceName}`);
  if ((typedName || "").trim() !== workspaceName) {
    renderCloudStatus("Workspace deletion cancelled", "Sign out");
    return;
  }
  renderCloudStatus("Deleting workspace...", "Sign out", true);
  window.clearTimeout(cloudSaveTimer);
  const wasActiveWorkspace = workspaceId === activeWorkspaceId();
  const fallbackWorkspaceId = wasActiveWorkspace ? personalWorkspaceId(cloud.user.uid) : activeWorkspaceId();
  const workspaceRef = cloud.db.collection("workspaces").doc(workspaceId);
  try {
    const plansSnapshot = await workspaceRef.collection("plans").get();
    for (const planDoc of plansSnapshot.docs) {
      const data = planDoc.data() || {};
      if (data.state) await createPlanSnapshot("before-delete", data.state, { planId: planDoc.id, workspaceId });
      await markPlanDeleted(workspaceId, planDoc.id, "workspace-delete");
    }
    await workspaceRef.set({
      deletedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      deletedAtMs: Date.now(),
      deletedBy: cloud.user.uid,
      deletedReason: "workspace-delete",
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn("Workspace document deletion failed", error);
    renderCloudStatus(`Workspace delete failed: ${error.code || error.message || "check rules"}`, "Sign out");
    return;
  }
  await cloud.db.collection("users").doc(cloud.user.uid).set({
    workspaces: {
      [workspaceId]: {
        ...normalizeWorkspaceMetadata(workspace),
        deletedAt: new Date().toISOString(),
        deletedBy: cloud.user.uid,
        deletedReason: "workspace-delete",
      },
    },
    lastWorkspaceId: fallbackWorkspaceId,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  const deletedWorkspace = normalizeWorkspaceMetadata({
    ...workspace,
    deletedAt: new Date().toISOString(),
    deletedBy: cloud.user.uid,
    deletedReason: "workspace-delete",
  });
  workspaceCatalog = workspaceCatalog.filter((entry) => entry.id !== workspaceId);
  deletedWorkspaceCatalog = [
    ...deletedWorkspaceCatalog.filter((entry) => entry.id !== workspaceId),
    deletedWorkspace,
  ];
  planCatalog = planCatalog.filter((plan) => plan.workspaceId !== workspaceId);
  saveWorkspaceCatalog();
  saveDeletedWorkspaceCatalog();
  savePlanCatalog();
  removeLocalPlansForWorkspace(workspaceId);
  localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, fallbackWorkspaceId);
  if (wasActiveWorkspace) {
    localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }
  workspaceDirectoryWorkspaceId = "";
  await loadCloudWorkspaceCatalog();
  if (wasActiveWorkspace) {
    await loadCloudWorkspaceLibrary();
    await loadCloudPlanCatalog();
  }
  state.currentScreen = "workspace";
  renderCloudStatus("Workspace deleted", "Sign out");
  render();
}

async function renamePlan(planId) {
  if (!cloud.user || !cloud.db || !canManagePlanSharing()) return;
  const plan = planMetaById(planId);
  if (!plan) return;
  const nextTitle = window.prompt("Rename 2YIP plan", plan.title || "Untitled Plan");
  const trimmedTitle = (nextTitle || "").trim();
  if (!trimmedTitle || trimmedTitle === plan.title) return;
  renderCloudStatus("Renaming 2YIP...", "Sign out", true);
  const planRef = cloud.db.collection("workspaces").doc(activeWorkspaceId()).collection("plans").doc(planId);
  const snapshot = await planRef.get();
  const remoteState = snapshot.exists ? snapshot.data()?.state : null;
  if (remoteState?.plan) remoteState.plan.title = trimmedTitle;
  const update = {
    title: trimmedTitle,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  };
  if (remoteState?.plan) update.state = remoteState;
  await planRef.set(update, { merge: true });
  plan.title = trimmedTitle;
  if (activePlanId() === planId) {
    state.plan.title = trimmedTitle;
    saveState();
  } else {
    savePlanCatalog();
  }
  renderCloudStatus("2YIP renamed", "Sign out");
  render();
}

async function deletePlan(planId) {
  if (!cloud.user || !cloud.db || !canManagePlanSharing()) return;
  const plan = planMetaById(planId);
  if (!plan) return;
  const planTitle = plan.title || "this 2YIP";
  const confirmed = window.confirm(`Move "${planTitle}" to Trash? It can be restored from the Workspace page.`);
  if (!confirmed) return;
  renderCloudStatus("Deleting 2YIP...", "Sign out", true);
  window.clearTimeout(cloudSaveTimer);
  const planSnapshot = await cloud.db.collection("workspaces").doc(activeWorkspaceId()).collection("plans").doc(planId).get();
  const planState = planSnapshot.exists ? planSnapshot.data()?.state : null;
  await createPlanSnapshot("before-delete", planState || state, { planId, workspaceId: activeWorkspaceId() });
  await markPlanDeleted(activeWorkspaceId(), planId, "plan-delete");
  const deletedPlan = normalizePlanMetadata({
    ...plan,
    deletedAt: new Date().toISOString(),
    deletedBy: cloud.user.uid,
    deletedReason: "plan-delete",
  });
  planCatalog = planCatalog.filter((entry) => !(entry.id === planId && entry.workspaceId === activeWorkspaceId()));
  deletedPlanCatalog = [
    ...deletedPlanCatalog.filter((entry) => !(entry.id === planId && entry.workspaceId === activeWorkspaceId())),
    deletedPlan,
  ];
  savePlanCatalog();
  saveDeletedPlanCatalog();
  localStorage.removeItem(planStateStorageKey(planId, activeWorkspaceId()));
  if (activePlanId() === planId) localStorage.removeItem(STORAGE_KEY);
  const nextPlan = firstPlanForActiveWorkspace();
  if (activePlanId() === planId && nextPlan) {
    await switchPlan(nextPlan.id, { targetScreen: "workspace", skipPersist: true, force: true });
    state.currentScreen = "workspace";
  } else if (activePlanId() === planId) {
    state.currentScreen = "workspace";
    localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
  }
  workspaceDirectoryWorkspaceId = "";
  renderCloudStatus("2YIP deleted", "Sign out");
  render();
}

async function markPlanDeleted(workspaceId, planId, reason = "plan-delete") {
  const planRef = cloud.db.collection("workspaces").doc(workspaceId).collection("plans").doc(planId);
  await planRef.set({
    deletedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    deletedAtMs: Date.now(),
    deletedBy: cloud.user.uid,
    deletedReason: reason,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

function removeLocalPlansForWorkspace(workspaceId) {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${STORAGE_KEY}:${workspaceId}:`)) localStorage.removeItem(key);
  });
}

async function cleanupPlanMembers(workspaceId, planId) {
  const membersSnapshot = await cloud.db
    .collection("workspaces")
    .doc(workspaceId)
    .collection("plans")
    .doc(planId)
    .collection("members")
    .get();
  await Promise.all(membersSnapshot.docs.map((memberDoc) => memberDoc.ref.delete()));
}

async function cleanupWorkspaceMembers(workspaceId) {
  const membersSnapshot = await cloud.db.collection("workspaces").doc(workspaceId).collection("members").get();
  const ownMemberDoc = membersSnapshot.docs.find((memberDoc) => memberDoc.id === cloud.user.uid);
  const otherMemberDocs = membersSnapshot.docs.filter((memberDoc) => memberDoc.id !== cloud.user.uid);
  await Promise.all(otherMemberDocs.map((memberDoc) => memberDoc.ref.delete()));
  if (ownMemberDoc) await ownMemberDoc.ref.delete();
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
      ? uniqueLessonCards((lesson.boardCards || []).filter((card) => isVisiblePlanningCard(card) && cardAllowedOnLessonBoard(card)))
      : uniqueLessonCards([...(lesson.boardCards || []).filter(cardAllowedOnLessonBoard), ...lessonCardsFromUnit(unit, removedUnitCardKeys)]);
    return {
      id: lesson.id || uid("lesson"),
      title: lesson.title || `Lesson ${index + 1}`,
      description: lesson.description || lesson.details || "",
      objectives: lesson.objectives || "",
      duration: lesson.duration || "",
      imageUrl: lesson.imageUrl || "",
      imagePath: lesson.imagePath || "",
      imageDataUrl: lesson.imageDataUrl || "",
      imageName: lesson.imageName || "",
      imageSaveNotice: lesson.imageSaveNotice || "",
      imageUploadStatus: lesson.imageUploadStatus || "",
      structures: Array.isArray(lesson.structures) ? lesson.structures : [],
      otherStructure: lesson.otherStructure || "",
      otherConfirmed: Boolean(lesson.otherConfirmed || lesson.otherStructure),
      details: lesson.description || lesson.details || "",
      customisation: lesson.customisation || "",
      boardCards: baseCards,
      removedUnitCardKeys,
      lessonBoardInitialized: true,
      dismissedSuggestions: lesson.suggestionVersion === SUGGESTION_VERSION ? lesson.dismissedSuggestions || [] : [],
      suggestionVersion: SUGGESTION_VERSION,
      steps: normalizeLessonSteps(lesson.steps || []),
      confirmed: Boolean(lesson.confirmed),
    };
  });
}

function normalizeLessonSteps(steps) {
  return steps.map((step) => {
    const kind = step.kind === "reflectionCheckpoint" ? "reflectionCheckpoint" : "activity";
    const reflectionPurpose = reflectionCheckpointPurposes.includes(step.reflectionPurpose)
      ? step.reflectionPurpose
      : "Curricular goal";
    const reflectionPrompt = step.reflectionPrompt || (kind === "reflectionCheckpoint" ? step.description || "" : "");
    return {
      id: step.id || uid("step"),
      kind,
      type: kind === "reflectionCheckpoint" ? "Reflection Checkpoint" : inquiryActivityTypes.includes(step.type) ? step.type : "Connect & Wonder",
      duration: kind === "reflectionCheckpoint" ? 5 : step.duration || "",
      description: kind === "reflectionCheckpoint" ? reflectionPrompt : step.description || "",
      evidence: kind === "reflectionCheckpoint" ? reflectionPurpose : step.evidence || step.customisation || "",
      customisation: step.customisation || "",
      reflectionPurpose,
      reflectionPrompt,
      teachingActions: normalizeTeachingActions(step.teachingActions || []),
      confirmed: Boolean(step.confirmed),
    };
  });
}

function normalizeTeachingActions(actions) {
  return (actions || [])
    .map((action) => {
      if (!action) return null;
      const title = typeof action === "string" ? action : action.title || "";
      const id = typeof action === "string" ? teachingActionIdFromTitle(action) : action.id || teachingActionIdFromTitle(title);
      const metadata = teachingActionById(id) || teachingActionByTitle(title);
      if (!metadata) return null;
      return {
        id: metadata.id,
        title: metadata.title,
      };
    })
    .filter(Boolean)
    .filter((action, index, list) => list.findIndex((candidate) => candidate.id === action.id) === index);
}

function teachingActionById(id) {
  return teachingActionLibrary.find((action) => action.id === id)
    || teachingActionLibrary.find((action) => action.id === legacyTeachingActionAliases[id]);
}

function teachingActionByTitle(title) {
  return teachingActionLibrary.find((action) => action.title === title);
}

function teachingActionIdFromTitle(title) {
  return slugify(title || "");
}

function visibleValues(values) {
  return values.filter((value) => !hiddenPlanningCards.has(value));
}

function normalizePlanningValues(values, type) {
  return uniqueReadableValues(visibleValues(values).map((value) => normalizePlanningLabel(value, type)));
}

function normalizePlanningLabel(value, type) {
  if (type === "assessment") return assessmentLabelMap[value] || value;
  if (type === "learningOutcomes") return learningOutcomeLabelMap[value] || value;
  return value;
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
    .filter(cardAllowedOnLessonBoard)
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
  const label = normalizePlanningLabel(card.label || "", card.type);
  if (allowsDuplicateBoardCard(card.type, label) && card.id) return `${card.id}:${card.type}:${label}`;
  return `${card.type}:${label}`;
}

function unitLessonFeaturedCardKeys(unit) {
  const keys = new Set();
  (unit.lessons || []).forEach((lesson) => {
    (lesson.boardCards || [])
      .filter(isVisiblePlanningCard)
      .forEach((card) => {
        if (card.unitCardKey) keys.add(card.unitCardKey);
        keys.add(cardKey(card));
      });
  });
  return keys;
}

function unitCardNotFeaturedInAnyLesson(unit, card, featuredLessonCardKeys) {
  const lessons = unit.lessons || [];
  if (!lessons.length || !card || !lessonZoneAllowsType(lessonZoneForType(card.type), card.type)) return false;
  if (featuredLessonCardKeys.has(cardKey(card))) return false;
  if ((card.sourceLessonIds || []).some((lessonId) => lessons.some((lesson) => lesson.id === lessonId))) return false;
  return true;
}

function createLesson(unit) {
  const number = (unit.lessons?.length || 0) + 1;
  return {
    id: uid("lesson"),
    title: `Lesson ${number}`,
    description: "",
    objectives: "",
    duration: "",
    imageUrl: "",
    imagePath: "",
    imageDataUrl: "",
    imageName: "",
    imageSaveNotice: "",
    imageUploadStatus: "",
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
    kind: "activity",
    type: "Connect & Wonder",
    duration: "",
    description: "",
    evidence: "",
    customisation: "",
    teachingActions: [],
    confirmed: false,
  };
}

function createReflectionCheckpointStep() {
  return {
    id: uid("step"),
    kind: "reflectionCheckpoint",
    type: "Reflection Checkpoint",
    duration: 5,
    description: "",
    evidence: "Curricular goal",
    customisation: "",
    reflectionPurpose: "Curricular goal",
    reflectionPrompt: "",
    teachingActions: [],
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

function planContentScore(planState) {
  const valueLength = (value) => String(value || "").trim().length;
  return (planState?.units || []).reduce((total, unit) => {
    const lessonScore = (unit.lessons || []).reduce((lessonTotal, lesson) => {
      const stepScore = (lesson.steps || []).reduce((stepTotal, step) => (
        stepTotal
        + valueLength(step.description)
        + valueLength(step.evidence)
        + valueLength(step.customisation)
        + valueLength(step.duration)
      ), 0);
      return lessonTotal
        + 20
        + valueLength(lesson.title)
        + valueLength(lesson.description)
        + valueLength(lesson.details)
        + valueLength(lesson.objectives)
        + stepScore;
    }, 0);
    return total
      + 50
      + valueLength(unit.title)
      + valueLength(unit.artTask)
      + (unit.boardCards || []).length * 10
      + lessonScore;
  }, 0);
}

function planStateForContentHash(planState) {
  const clone = cleanCloudState(planState || {});
  [
    "currentScreen",
    "selectedUnitId",
    "selectedLessonId",
    "selectedBoardZone",
    "selectedLessonZone",
    "unitOverviewOpen",
    "lessonOverviewOpen",
    "activeTeachingActionPickerStepId",
    "activeTeachingActionDetailStepId",
    "activeTeachingActionDetailId",
    "teachingActionSearch",
    "showAllTeachingActions",
    "localSavedAtMs",
    "cloudSavedAtMs",
  ].forEach((key) => delete clone[key]);
  (clone.units || []).forEach((unit) => {
    (unit.lessons || []).forEach((lesson) => {
      delete lesson.imageUploadStatus;
      delete lesson.imageSaveNotice;
    });
  });
  return clone;
}

function planStateContentHash(planState) {
  return stateHash(planStateForContentHash(planState));
}

function applyLoadedPlanState(planState, snapshotId, snapshotData = {}) {
  state = normalizeState(planState);
  state.plan = normalizePlanMetadata({
    ...state.plan,
    id: snapshotId,
    title: snapshotData.title || state.plan.title,
    subject: snapshotData.subject || state.plan.subject,
    teamId: snapshotData.teamId || state.plan.teamId,
    teamName: snapshotData.teamName || state.plan.teamName,
    role: planMetaById(snapshotId)?.role || state.plan.role,
  });
  savePlanToCatalog(state.plan);
  localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, activePlanId());
  localStorage.setItem(planStateStorageKey(), JSON.stringify(state));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(lastGoodPlanStateStorageKey(), JSON.stringify(cleanCloudState(state)));
  lastPersistedContentHash = planStateContentHash(state);
  activePlanRevision = Number(snapshotData.revision || state.plan?.revision || activePlanRevision || 0);
}

function saveState(options = {}) {
  if (saveWritesPaused) return;
  if (state.currentScreen !== "workspace" && firstPlanForActiveWorkspace() && !canEditActivePlan()) {
    if (!options.localOnly) renderCloudStatus("Read-only. Saving paused until you take over editing.", cloud.user ? "Sign out" : "Sign in");
    return;
  }
  if (cloud.available && !cloud.user && els.loginGate && !els.loginGate.classList.contains("hidden")) return;
  const storedPlanId = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY);
  if (storedPlanId && state.plan?.id && state.plan.id !== storedPlanId) {
    renderCloudStatus("Plan loading. Saving paused to prevent overwrite.", cloud.user ? "Sign out" : "Sign in");
    return;
  }
  if (state.currentScreen === "workspace" && !planMetaById(activePlanId())) return;
  state.plan = normalizePlanMetadata(state.plan);
  state.cardLibrary = normalizeCardLibrary(state.cardLibrary);
  const currentContentHash = planStateContentHash(state);
  const hasContentChange = currentContentHash !== lastPersistedContentHash || options.forceCloud;
  if (options.localOnly && !hasContentChange) return;
  if (!hasContentChange && !options.forceLocal) return;
  if (hasContentChange) {
    state.localSavedAtMs = Date.now();
    lastPersistedContentHash = currentContentHash;
  }
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
  if (hasContentChange && planContentScore(state) > 0) {
    localStorage.setItem(lastGoodPlanStateStorageKey(), JSON.stringify(cleanCloudState(state)));
  }
  if (!options.localOnly && hasContentChange) scheduleCloudSave();
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

function saveTimeLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function setSaveStatus(statusElements, message) {
  statusElements.filter(Boolean).forEach((element) => {
    element.textContent = message;
  });
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
  if (nextScreen === "workspace" && state.currentScreen !== "workspace") {
    persistCurrentPlanBeforeSwitch().then(releaseEditingLock).catch((error) => console.warn("Back navigation save/release failed", error));
  } else if (nextScreen !== "workspace" && state.currentScreen === "workspace" && cloud.loaded && firstPlanForActiveWorkspace()) {
    acquireEditingLock({ allowSameUserTakeover: true }).then(() => render()).catch((error) => console.warn("Back navigation lock failed", error));
  }
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
    cloud.storage = window.firebase.storage ? window.firebase.storage() : null;
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
  saveWritesPaused = true;
  if (!user) {
    setEditLockMode("none", null);
    stopEditLockHeartbeat();
    saveWritesPaused = false;
    els.appShell.classList.add("hidden");
    els.loginGate.classList.remove("hidden");
    renderLoginGate("Sign in to open your planner.", false);
    renderCloudStatus("Not signed in", "Sign in");
    return;
  }

  renderLoginGate("Loading your planner...", true);
  renderCloudStatus("Loading cloud save...", "Sign out", true);
  const warnings = [];
  const runLoadStep = async (label, action, fallbackValue = undefined) => {
    try {
      return await action();
    } catch (error) {
      console.warn(`${label} failed`, error);
      warnings.push(`${label}: ${errorLabel(error)}`);
      return fallbackValue;
    }
  };
  try {
    const requestedScreen = screenFromLocation();
    await runLoadStep("Workspace setup", () => ensureCloudWorkspace(user));
    await runLoadStep("Invite check", () => acceptPendingInvites(user));
    await runLoadStep("Workspace list", () => loadCloudWorkspaceCatalog());
    await runLoadStep("Shared card library", () => loadCloudWorkspaceLibrary());
    const planCatalogLoaded = await runLoadStep("2YIP list", () => loadCloudPlanCatalog(), false);
    const planContentLoaded = await runLoadStep("2YIP content", () => loadCloudState(), false);
    const hasVerifiedPlanContent = planContentLoaded === "remote" || planContentLoaded === "local" || !firstPlanForActiveWorkspace();
    cloud.loaded = hasVerifiedPlanContent;
    if (!hasVerifiedPlanContent) {
      planCatalogVerified = false;
      state.currentScreen = "workspace";
    } else {
      state.currentScreen = requestedScreen === "workspace" || !firstPlanForActiveWorkspace() ? "workspace" : requestedScreen;
    }
    if (state.currentScreen !== "workspace" && hasVerifiedPlanContent && firstPlanForActiveWorkspace()) {
      await runLoadStep("Editing lock", () => acquireEditingLock({ allowSameUserTakeover: true }), false);
    } else {
      setEditLockMode("none", null);
      stopEditLockHeartbeat();
    }
    if (state.currentScreen === "lesson") state.lessonOverviewOpen = false;
    workspaceDirectoryWorkspaceId = "";
    els.loginGate.classList.add("hidden");
    els.appShell.classList.remove("hidden");
    if (!hasVerifiedPlanContent || planCatalogLoaded === false) planCatalogVerified = false;
    saveWritesPaused = !hasVerifiedPlanContent;
    render();
    if (!hasVerifiedPlanContent) {
      renderCloudStatus("Full 2YIP did not load. Staying in Workspace to prevent data loss.", "Sign out");
    } else if (warnings.length) {
      renderCloudStatus(`Opened last known planner. Online refresh issue: ${warnings[0]}`, "Sign out");
    } else {
      renderCloudStatus(planCatalogLoaded === false
        ? "Could not refresh online plans. Showing last known list."
        : `Cloud save: ${user.displayName || user.email || "signed in"}`, "Sign out");
    }
    saveWritesPaused = false;
  } catch (error) {
    console.warn("Cloud load failed", error);
    cloud.loaded = false;
    planCatalogVerified = false;
    state.currentScreen = screenFromLocation() === "workspace" ? "workspace" : state.currentScreen || "workspace";
    workspaceDirectoryWorkspaceId = "";
    els.loginGate.classList.add("hidden");
    els.appShell.classList.remove("hidden");
    saveWritesPaused = true;
    render();
    saveWritesPaused = false;
    renderCloudStatus(`Opened local copy. Online load failed: ${errorLabel(error)}`, "Sign out");
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
  const validatedAccess = await validateAccessiblePlanAccess(userData);
  const workspaces = validatedAccess.workspaces;
  userAccessiblePlans = Object.values(validatedAccess.accessiblePlans);
  const personalWorkspace = { id: personalWorkspaceId(cloud.user.uid), name: "My Planner", type: "personal", role: "owner" };
  const cloudWorkspaces = [personalWorkspace, ...Object.values(workspaces).filter((workspace) => workspace?.id !== personalWorkspace.id)];
  workspaceCatalog = cloudWorkspaces.map((workspace) => normalizeWorkspaceMetadata(workspace));
  deletedWorkspaceCatalog = Object.values(userData.workspaces || {})
    .filter((workspace) => workspace?.deletedAt)
    .map(normalizeWorkspaceMetadata);
  saveWorkspaceCatalog();
  saveDeletedWorkspaceCatalog();
  const allowedIds = new Set(workspaceCatalog.map((workspace) => workspace.id));
  const preferredId = allowedIds.has(userData.lastWorkspaceId) ? userData.lastWorkspaceId : personalWorkspace.id;
  const activeId = activeWorkspaceId();
  if (!allowedIds.has(activeId)) localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, preferredId);
}

async function validateAccessiblePlanAccess(userData = {}) {
  const rawWorkspaces = userData.workspaces || {};
  const rawAccessiblePlans = userData.accessiblePlans || {};
  const validAccessiblePlans = {};
  const validWorkspaceIds = new Set();
  const cleanup = { accessiblePlans: {}, workspaces: {} };
  let cleanupNeeded = false;

  for (const [key, sharedPlan] of Object.entries(rawAccessiblePlans)) {
    if (!sharedPlan?.workspaceId || !sharedPlan?.planId) continue;
    try {
      const snapshot = await cloud.db
        .collection("workspaces")
        .doc(sharedPlan.workspaceId)
        .collection("plans")
        .doc(sharedPlan.planId)
        .get();
      if (snapshot.exists) {
        const data = snapshot.data() || {};
        if (data.deletedAt) {
          continue;
        }
        validAccessiblePlans[key] = {
          ...sharedPlan,
          planTitle: data.title || sharedPlan.planTitle,
          subject: data.subject || sharedPlan.subject || "Art",
          stale: false,
        };
        validWorkspaceIds.add(sharedPlan.workspaceId);
        continue;
      }
    } catch (error) {
      console.warn("Could not verify shared plan; keeping last known access", sharedPlan, error);
      validAccessiblePlans[key] = { ...sharedPlan, stale: true };
      validWorkspaceIds.add(sharedPlan.workspaceId);
      continue;
    }
    validAccessiblePlans[key] = { ...sharedPlan, stale: true };
    validWorkspaceIds.add(sharedPlan.workspaceId);
  }

  const validWorkspaces = {};
  for (const [workspaceId, workspace] of Object.entries(rawWorkspaces)) {
    if (workspace?.deletedAt) {
      continue;
    } else if (workspace?.role === "owner" || validWorkspaceIds.has(workspaceId)) {
      validWorkspaces[workspaceId] = workspace;
    }
  }

  if (cleanupNeeded) {
    const update = { updatedAt: window.firebase.firestore.FieldValue.serverTimestamp() };
    if (Object.keys(cleanup.accessiblePlans).length) update.accessiblePlans = cleanup.accessiblePlans;
    if (Object.keys(cleanup.workspaces).length) update.workspaces = cleanup.workspaces;
    await cloud.db.collection("users").doc(cloud.user.uid).set(update, { merge: true });
  }

  return { workspaces: validWorkspaces, accessiblePlans: validAccessiblePlans };
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
  const loadedDeletedPlans = [];
  const plansRef = cloud.db.collection("workspaces").doc(cloudWorkspaceId()).collection("plans");
  try {
    if (canManageActiveWorkspace()) {
      const snapshot = await plansRef.get();
      snapshot.forEach((doc) => {
        const data = doc.data() || {};
        const meta = normalizePlanMetadata({
          id: doc.id,
          title: data.title || data.state?.plan?.title || "Untitled Plan",
          subject: data.subject || data.state?.plan?.subject || "Art",
          teamId: data.teamId || data.state?.plan?.teamId || "",
          teamName: data.teamName || data.state?.plan?.teamName || "",
          workspaceId,
          role: "owner",
          deletedAt: data.deletedAt || "",
          deletedBy: data.deletedBy || "",
          deletedReason: data.deletedReason || "",
          lastVerifiedAt: new Date().toISOString(),
        });
        (meta.deletedAt ? loadedDeletedPlans : loadedPlans).push(meta);
      });
    } else {
      const sharedPlans = userAccessiblePlans.filter((plan) => plan.workspaceId === cloudWorkspaceId());
      for (const sharedPlan of sharedPlans) {
        try {
          const snapshot = await plansRef.doc(sharedPlan.planId).get();
          if (snapshot.exists) {
            const data = snapshot.data() || {};
            const meta = normalizePlanMetadata({
              id: snapshot.id,
              title: data.title || sharedPlan.planTitle,
              subject: data.subject || sharedPlan.subject,
              teamId: data.teamId || data.state?.plan?.teamId || "",
              teamName: data.teamName || data.state?.plan?.teamName || "",
              workspaceId,
              role: sharedPlan.role || "editor",
              deletedAt: data.deletedAt || "",
              deletedBy: data.deletedBy || "",
              deletedReason: data.deletedReason || "",
              lastVerifiedAt: new Date().toISOString(),
            });
            (meta.deletedAt ? loadedDeletedPlans : loadedPlans).push(meta);
          } else {
            loadedPlans.push(normalizePlanMetadata({ ...sharedPlan, id: sharedPlan.planId, title: sharedPlan.planTitle, stale: true }));
          }
        } catch (error) {
          console.warn("Could not refresh shared plan; keeping last known plan", sharedPlan, error);
          loadedPlans.push(normalizePlanMetadata({ ...sharedPlan, id: sharedPlan.planId, title: sharedPlan.planTitle, stale: true }));
        }
      }
    }
  } catch (error) {
    console.warn("Cloud plan catalog refresh failed", error);
    const fallbackPlans = loadLastGoodPlanCatalog(workspaceId);
    if (fallbackPlans.length) {
      planCatalog = [
        ...planCatalog.filter((plan) => plan.workspaceId !== workspaceId),
        ...fallbackPlans.map((plan) => normalizePlanMetadata({ ...plan, stale: true })),
      ];
      savePlanCatalog();
    }
    renderCloudStatus("Could not refresh online plans. Showing last known list.", "Sign out");
    planCatalogVerified = false;
    return false;
  }
  planCatalog = [
    ...planCatalog.filter((plan) => plan.workspaceId !== workspaceId),
    ...loadedPlans,
  ];
  deletedPlanCatalog = [
    ...deletedPlanCatalog.filter((plan) => plan.workspaceId !== workspaceId),
    ...loadedDeletedPlans,
  ];
  savePlanCatalog();
  saveDeletedPlanCatalog();
  saveLastGoodPlanCatalog(workspaceId, loadedPlans);
  planCatalogVerified = true;
  const requestedPlanId = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY) || state.plan?.id || "";
  const availablePlans = plansForActiveWorkspace();
  const nextPlan = availablePlans.find((plan) => plan.id === requestedPlanId) || availablePlans[0] || null;
  if (nextPlan && !availablePlans.some((plan) => plan.id === state.plan?.id)) {
    localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, nextPlan.id);
    state.plan = normalizePlanMetadata({
      ...(state.plan || {}),
      ...nextPlan,
      id: nextPlan.id,
      workspaceId,
    });
  }
  return true;
}

async function loadCloudState() {
  if (!firstPlanForActiveWorkspace()) return;
  const planRef = cloudPlanRef();
  let snapshot;
  try {
    snapshot = await planRef.get();
  } catch (error) {
    console.warn("Cloud state load failed; keeping local state", error);
    const fallbackPlanId = activePlanId();
    const fallbackState = loadLocalPlanState(fallbackPlanId) || loadLastGoodPlanState(fallbackPlanId);
    if (fallbackState && planContentScore(fallbackState) > 0) {
      cloudSyncPaused = true;
      applyLoadedPlanState(fallbackState, fallbackPlanId, fallbackState.plan || {});
      cloudSyncPaused = false;
      renderCloudStatus("Could not refresh online plan. Showing last known local version.", "Sign out");
      return "local";
    }
    renderCloudStatus("Could not refresh online plan. Full plan loading paused.", "Sign out");
    return false;
  }
  const remoteState = snapshot.exists ? snapshot.data()?.state : null;
  if (snapshot.exists && snapshot.data()?.deletedAt) {
    renderCloudStatus("This 2YIP is in Trash. Restore it before editing.", "Sign out");
    return false;
  }
  if (remoteState && Array.isArray(remoteState.units)) {
    const snapshotData = snapshot.data() || {};
    const normalizedRemote = normalizeState(remoteState);
    activePlanRevision = Number(snapshotData.revision || 0);
    cloudSyncPaused = true;
    applyLoadedPlanState(normalizedRemote, snapshot.id, snapshotData);
    cloudSyncPaused = false;
    render();
    return "remote";
  }
  renderCloudStatus("No online plan body found. Local copy kept; saving paused to prevent overwrite.", "Sign out");
  return false;
}

function scheduleCloudSave() {
  if (cloudSyncPaused || !cloud.available || !cloud.user || !cloud.loaded || !cloud.db) return;
  if (!canEditActivePlan()) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(saveCloudStateNow, 900);
}

async function saveCloudStateNow(options = {}) {
  window.clearTimeout(cloudSaveTimer);
  if (!cloud.available || !cloud.user || !cloud.db) return false;
  if (state.currentScreen === "workspace") return false;
  if (!canEditActivePlan()) {
    renderCloudStatus("Read-only. Saving paused until you take over editing.", "Sign out");
    return false;
  }
  const planMeta = planMetaById(activePlanId());
  if (!planCatalogVerified || !planMeta || planMeta.deletedAt || planMeta.stale || state.plan?.id !== activePlanId() || state.plan?.workspaceId !== activeWorkspaceId()) {
    cloudSaveBlocked = true;
    renderCloudStatus("Plan not verified. Saving paused to prevent overwrite.", "Sign out");
    return false;
  }
  try {
    state.localSavedAtMs = Date.now();
    const cleanState = cleanCloudState(state);
    cleanState.cloudSavedAtMs = Date.now();
    cleanState.localSavedAtMs = state.localSavedAtMs;
    const saveResult = await cloud.db.runTransaction(async (transaction) => {
      const ref = cloudPlanRef();
      const snapshot = await transaction.get(ref);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      const now = Date.now();
      const currentLock = data.editingLock || null;
      if (!lockIsActive(currentLock, now) || !lockBelongsToThisSession(currentLock)) {
        throw Object.assign(new Error("Editing lock lost."), { code: "editing-lock-lost", remoteState: data.state, snapshotData: data });
      }
      const remoteRevision = Number(data.revision || 0);
      if (!options.ignoreRevision && remoteRevision !== activePlanRevision) {
        throw Object.assign(new Error("A newer cloud version exists."), { code: "revision-mismatch", remoteState: data.state, snapshotData: data, revision: remoteRevision });
      }
      const nextRevision = remoteRevision + 1;
      const nextLock = lockPayload(now);
      transaction.set(ref, {
        title: activePlanTitle(),
        subject: state.plan?.subject || "Art",
        teamId: state.plan?.teamId || "",
        teamName: state.plan?.teamName || "",
        workspaceId: activeWorkspaceId(),
        state: cleanState,
        revision: nextRevision,
        editingLock: nextLock,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      return { revision: nextRevision, lock: nextLock };
    });
    activePlanRevision = saveResult.revision;
    setEditLockMode("editing", saveResult.lock);
    state.cloudSavedAtMs = cleanState.cloudSavedAtMs;
    localStorage.setItem(planStateStorageKey(), JSON.stringify(state));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(lastGoodPlanStateStorageKey(), JSON.stringify(cleanState));
    await createPlanSnapshot("autosave", cleanState, { onlyIfDue: true });
    cloudSaveBlocked = false;
    lastPersistedContentHash = planStateContentHash(state);
    renderCloudStatus(`Cloud saved: ${cloud.user.displayName || cloud.user.email || "signed in"}`, "Sign out");
    return true;
  } catch (error) {
    console.warn("Cloud save failed", error);
    if ((error.code === "revision-mismatch" || error.code === "editing-lock-lost") && error.remoteState && Array.isArray(error.remoteState.units)) {
      const normalizedRemote = normalizeState(error.remoteState);
      const snapshotData = error.snapshotData || {};
      activePlanRevision = Number(error.revision ?? snapshotData.revision ?? activePlanRevision);
      cloudSyncPaused = true;
      applyLoadedPlanState(normalizedRemote, activePlanId(), snapshotData);
      cloudSyncPaused = false;
      setEditLockMode("readonly", snapshotData.editingLock || null);
      stopEditLockHeartbeat();
      render();
      renderCloudStatus(error.code === "revision-mismatch" ? "Newer online version found. Saving paused." : "Editing lock lost. Saving paused.", "Sign out");
      return false;
    }
    localStorage.setItem(lastGoodPlanStateStorageKey(), JSON.stringify(cleanCloudState(state)));
    renderCloudStatus(`Saved locally, cloud retry pending: ${error.code || error.message || "check rules"}`, "Sign out");
    return false;
  }
}

async function commitPlanSaveNow({ statusElement, statusElements = [], buttons = [], successMessage = "Saved online" } = {}) {
  const buttonList = buttons.filter(Boolean);
  const statusList = [statusElement, ...statusElements].filter(Boolean);
  const originalLabels = buttonList.map((button) => button.textContent);
  buttonList.forEach((button) => {
    button.disabled = true;
    button.textContent = "Saving...";
  });
  setSaveStatus(statusList, "Saving online now...");
  if (cloud.user) renderCloudStatus("Saving online now...", "Sign out", true);
  saveState();
  const savedOnline = await saveCloudStateNow();
  const time = saveTimeLabel();
  const message = savedOnline
    ? `${successMessage} at ${time}`
    : (cloud.available && cloud.user ? "Saved locally; online retry pending" : "Saved locally");
  setSaveStatus(statusList, message);
  renderCloudStatus(message, cloud.user ? "Sign out" : "Sign in");
  buttonList.forEach((button, index) => {
    button.disabled = false;
    button.textContent = savedOnline ? "Saved online" : originalLabels[index];
  });
  window.setTimeout(() => {
    setSaveStatus(statusList, "");
    buttonList.forEach((button, index) => {
      button.textContent = originalLabels[index];
    });
  }, 3500);
  return savedOnline;
}

function cleanCloudState(value) {
  const cleanState = JSON.parse(JSON.stringify(value));
  (cleanState.units || []).forEach((unit) => {
    (unit.lessons || []).forEach((lesson) => {
      if (lesson.imageDataUrl) {
        lesson.imageDataUrl = "";
        if (!lesson.imageUrl) {
          lesson.imageSaveNotice = "Image preview is stored only on this device. Upload again to save it online.";
        }
      }
    });
  });
  return cleanState;
}

function imageSizeLabel(dataUrl = "") {
  const bytes = Math.round((dataUrl.length * 3) / 4);
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function compressImageFile(file) {
  if (!file.type?.startsWith("image/")) throw new Error("Choose an image file.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImageElement(objectUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image compression unavailable.");
    const sourceMax = Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height, 1);
    const maxSides = [IMAGE_PREVIEW_MAX_SIDE, 900, 720, 560];
    const qualities = [0.76, 0.66, 0.56, 0.48];
    let bestDataUrl = "";
    for (const maxSide of maxSides) {
      const scale = Math.min(1, maxSide / sourceMax);
      canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
      canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of qualities) {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (!bestDataUrl || dataUrl.length < bestDataUrl.length) bestDataUrl = dataUrl;
        if (dataUrl.length <= CLOUD_IMAGE_MAX_CHARS) return dataUrl;
      }
    }
    return bestDataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function dataUrlToBlob(dataUrl) {
  const [header, payload] = dataUrl.split(",");
  const mimeType = header.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(payload || "");
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

function safeStorageFileName(name = "lesson-reference.jpg") {
  const cleaned = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || "lesson-reference.jpg";
}

function lessonImageStoragePath(lesson, fileName) {
  return [
    "workspaces",
    activeWorkspaceId(),
    "plans",
    activePlanId(),
    "lessons",
    lesson.id,
    `${Date.now()}-${safeStorageFileName(fileName)}`,
  ].join("/");
}

function verifyCloudImageUploadReady() {
  const planMeta = planMetaById(activePlanId());
  if (!cloud.available || !cloud.user || !cloud.storage) {
    throw new Error("Cloud image upload is not ready. Check that Firebase Storage is enabled.");
  }
  if (!canEditActivePlan()) {
    throw new Error("Read-only. Take over editing before uploading an image.");
  }
  if (!planCatalogVerified || !planMeta || planMeta.deletedAt || planMeta.stale || state.plan?.id !== activePlanId() || state.plan?.workspaceId !== activeWorkspaceId()) {
    throw new Error("Plan is not verified yet. Reopen this 2YIP before uploading an image.");
  }
}

async function uploadLessonImageDataUrl(lesson, file, dataUrl) {
  verifyCloudImageUploadReady();
  const blob = dataUrlToBlob(dataUrl);
  const path = lessonImageStoragePath(lesson, file.name);
  const ref = cloud.storage.ref(path);
  const upload = await ref.put(blob, {
    contentType: blob.type || "image/jpeg",
    customMetadata: {
      workspaceId: activeWorkspaceId(),
      planId: activePlanId(),
      lessonId: lesson.id,
    },
  });
  const downloadUrl = await upload.ref.getDownloadURL();
  return { downloadUrl, path, sizeLabel: imageSizeLabel(dataUrl) };
}

async function deleteCloudStoragePath(path) {
  if (!path || !cloud.storage) return false;
  try {
    await cloud.storage.ref(path).delete();
    return true;
  } catch (error) {
    console.warn("Cloud image delete failed", error);
    return false;
  }
}

function snapshotMetaStorageKey(planId = activePlanId(), workspaceId = activeWorkspaceId()) {
  const userId = cloud.user?.uid || "local";
  return `${LAST_SNAPSHOT_META_STORAGE_KEY}:${userId}:${workspaceId || "local-workspace"}:${planId || CLOUD_PLAN_ID}`;
}

function loadSnapshotMeta(planId = activePlanId(), workspaceId = activeWorkspaceId()) {
  try {
    return JSON.parse(localStorage.getItem(snapshotMetaStorageKey(planId, workspaceId))) || {};
  } catch {
    return {};
  }
}

function saveSnapshotMeta(meta, planId = activePlanId(), workspaceId = activeWorkspaceId()) {
  localStorage.setItem(snapshotMetaStorageKey(planId, workspaceId), JSON.stringify(meta));
}

function stateHash(value) {
  const serialized = JSON.stringify(value || {});
  let hash = 0;
  for (let index = 0; index < serialized.length; index += 1) {
    hash = ((hash << 5) - hash + serialized.charCodeAt(index)) | 0;
  }
  return String(hash);
}

async function createPlanSnapshot(reason = "manual", planState = state, options = {}) {
  if (!cloud.available || !cloud.user || !cloud.db) return false;
  const planId = options.planId || activePlanId();
  const workspaceId = options.workspaceId || activeWorkspaceId();
  if (!planId || !workspaceId) return false;
  const cleanState = cleanCloudState(planState);
  cleanState.plan = normalizePlanMetadata({ ...(cleanState.plan || {}), id: planId, workspaceId });
  const hash = stateHash(cleanState);
  const meta = loadSnapshotMeta(planId, workspaceId);
  const now = Date.now();
  if (hash === meta.hash) return false;
  if (options.onlyIfDue && meta.createdAtMs && now - meta.createdAtMs < SNAPSHOT_INTERVAL_MS) return false;
  const unitCount = Array.isArray(cleanState.units) ? cleanState.units.length : 0;
  const lessonCount = (cleanState.units || []).reduce((total, unit) => total + (unit.lessons?.length || 0), 0);
  const cardCount = (cleanState.units || []).reduce((total, unit) => total + (unit.boardCards?.length || 0), 0);
  await cloud.db
    .collection("workspaces")
    .doc(workspaceId)
    .collection("plans")
    .doc(planId)
    .collection("snapshots")
    .doc(uid("snapshot"))
    .set({
      planId,
      workspaceId,
      title: cleanState.plan?.title || activePlanTitle(),
      subject: cleanState.plan?.subject || "Art",
      state: cleanState,
      reason,
      hash,
      unitCount,
      lessonCount,
      cardCount,
      createdBy: cloud.user.uid,
      createdByEmail: cloud.user.email || "",
      createdAtMs: now,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    });
  saveSnapshotMeta({ hash, createdAtMs: now, reason }, planId, workspaceId);
  return true;
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

function lockOwnerName(lock = editLock.info) {
  return lock?.displayName || lock?.email || "another teacher";
}

function lockIsActive(lock, now = Date.now()) {
  return Boolean(lock?.sessionId && Number(lock.expiresAtMs || 0) > now);
}

function lockBelongsToThisSession(lock) {
  return Boolean(lock?.sessionId === editLock.sessionId && lock?.uid === cloud.user?.uid);
}

function lockPayload(now = Date.now()) {
  return {
    sessionId: editLock.sessionId,
    uid: cloud.user?.uid || "",
    email: cloud.user?.email || "",
    displayName: cloud.user?.displayName || cloud.user?.email || "Teacher",
    updatedAtMs: now,
    expiresAtMs: now + EDIT_LOCK_TIMEOUT_MS,
  };
}

function canEditActivePlan() {
  if (state.currentScreen === "workspace") return true;
  if (!cloud.available || !cloud.user || !cloud.loaded || !firstPlanForActiveWorkspace()) return false;
  return editLock.mode === "editing" && lockBelongsToThisSession(editLock.info);
}

function setEditLockMode(mode, info = null) {
  editLock.mode = mode;
  editLock.info = info;
  renderLockStatus();
}

function stopEditLockHeartbeat() {
  window.clearInterval(editLockHeartbeatTimer);
  editLockHeartbeatTimer = null;
}

function startEditLockHeartbeat() {
  stopEditLockHeartbeat();
  editLockHeartbeatTimer = window.setInterval(refreshEditingLock, EDIT_LOCK_HEARTBEAT_MS);
}

async function acquireEditingLock(options = {}) {
  if (!cloud.user || !cloud.db || !firstPlanForActiveWorkspace() || state.currentScreen === "workspace") {
    setEditLockMode("none", null);
    stopEditLockHeartbeat();
    return false;
  }
  const force = Boolean(options.force);
  const allowSameUserTakeover = options.allowSameUserTakeover !== false;
  try {
    const result = await cloud.db.runTransaction(async (transaction) => {
      const ref = cloudPlanRef();
      const snapshot = await transaction.get(ref);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      const now = Date.now();
      const currentLock = data.editingLock || null;
      const active = lockIsActive(currentLock, now);
      const sameSession = active && lockBelongsToThisSession(currentLock);
      const sameUser = active && currentLock.uid === cloud.user.uid;
      if (!active || sameSession || force || (allowSameUserTakeover && sameUser)) {
        const nextLock = lockPayload(now);
        transaction.set(ref, { editingLock: nextLock }, { merge: true });
        return { owns: true, lock: nextLock, revision: Number(data.revision || 0) };
      }
      return { owns: false, lock: currentLock, revision: Number(data.revision || 0) };
    });
    activePlanRevision = result.revision;
    if (result.owns) {
      setEditLockMode("editing", result.lock);
      startEditLockHeartbeat();
      renderCloudStatus(`Editing as ${lockOwnerName(result.lock)}`, "Sign out");
      return true;
    }
    setEditLockMode("readonly", result.lock);
    stopEditLockHeartbeat();
    renderCloudStatus(`Read-only: ${lockOwnerName(result.lock)} is editing`, "Sign out");
    return false;
  } catch (error) {
    console.warn("Editing lock failed", error);
    setEditLockMode("readonly", null);
    stopEditLockHeartbeat();
    renderCloudStatus(`Editing lock unavailable: ${errorLabel(error)}`, "Sign out");
    return false;
  }
}

async function refreshEditingLock() {
  if (!cloud.user || !cloud.db || editLock.mode !== "editing" || state.currentScreen === "workspace") {
    stopEditLockHeartbeat();
    return false;
  }
  try {
    const result = await cloud.db.runTransaction(async (transaction) => {
      const ref = cloudPlanRef();
      const snapshot = await transaction.get(ref);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      const now = Date.now();
      const currentLock = data.editingLock || null;
      if (!lockIsActive(currentLock, now) || lockBelongsToThisSession(currentLock)) {
        const nextLock = lockPayload(now);
        transaction.set(ref, { editingLock: nextLock }, { merge: true });
        return { owns: true, lock: nextLock, revision: Number(data.revision || 0) };
      }
      return { owns: false, lock: currentLock, revision: Number(data.revision || 0) };
    });
    activePlanRevision = result.revision;
    if (result.owns) {
      setEditLockMode("editing", result.lock);
      return true;
    }
    setEditLockMode("readonly", result.lock);
    stopEditLockHeartbeat();
    renderCloudStatus(`This plan is open elsewhere. Saving paused.`, "Sign out");
    render();
    return false;
  } catch (error) {
    console.warn("Editing lock heartbeat failed", error);
    setEditLockMode("readonly", editLock.info);
    stopEditLockHeartbeat();
    renderCloudStatus(`Editing lock lost: ${errorLabel(error)}`, "Sign out");
    render();
    return false;
  }
}

async function releaseEditingLock() {
  if (!cloud.user || !cloud.db || editLock.mode !== "editing") return false;
  stopEditLockHeartbeat();
  try {
    await cloud.db.runTransaction(async (transaction) => {
      const ref = cloudPlanRef();
      const snapshot = await transaction.get(ref);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      if (lockBelongsToThisSession(data.editingLock || null)) {
        transaction.set(ref, {
          editingLock: window.firebase.firestore.FieldValue.delete(),
        }, { merge: true });
      }
    });
    setEditLockMode("none", null);
    return true;
  } catch (error) {
    console.warn("Editing lock release failed", error);
    setEditLockMode("none", null);
    return false;
  }
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
  const storedPlanId = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY);
  if (storedPlanId && (!state.plan?.id || state.plan.id === CLOUD_PLAN_ID)) return storedPlanId;
  if (storedPlanId && state.plan?.id !== storedPlanId && !planMetaById(state.plan?.id)) return storedPlanId;
  return state.plan?.id || storedPlanId || CLOUD_PLAN_ID;
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

function renderLockStatus() {
  if (!els.lockPanel || !els.lockStatus || !els.takeOverLock) return;
  const show = state.currentScreen !== "workspace" && Boolean(cloud.user) && Boolean(firstPlanForActiveWorkspace());
  els.lockPanel.classList.toggle("hidden", !show);
  if (!show) return;
  const editing = canEditActivePlan();
  els.lockPanel.classList.toggle("read-only", !editing);
  if (editing) {
    els.lockStatus.textContent = `Editing as ${lockOwnerName(editLock.info)}`;
    els.takeOverLock.classList.add("hidden");
    return;
  }
  const owner = editLock.info ? lockOwnerName(editLock.info) : "another session";
  const sameUser = editLock.info?.uid && editLock.info.uid === cloud.user?.uid;
  els.lockStatus.textContent = sameUser
    ? "This plan is open in another tab. Saving paused."
    : `Read-only: ${owner} is editing`;
  els.takeOverLock.textContent = sameUser ? "Continue Here" : "Take Over Editing";
  els.takeOverLock.classList.remove("hidden");
}

function applyEditingMode() {
  renderLockStatus();
  const readOnly = state.currentScreen !== "workspace" && Boolean(firstPlanForActiveWorkspace()) && !canEditActivePlan();
  els.appShell?.classList.toggle("plan-read-only", readOnly);
  [els.timelineScreen, els.boardScreen, els.lessonScreen, els.cardLibraryPanel, els.lessonPickerPanel].filter(Boolean).forEach((root) => {
    root.querySelectorAll("input, textarea, select, button").forEach((control) => {
      const allowed = control.matches("#overview-unit, #edit-lesson-board, .back-to-planning, .copy-unit-overview, .export-unit-word, .export-lesson-word, .overview-open-lesson, .lesson-open-board, .lesson-picker-unit, .lesson-picker-lesson");
      control.disabled = readOnly && !allowed;
    });
  });
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
    await releaseEditingLock();
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

function errorLabel(error) {
  const code = error?.code || "";
  if (code === "permission-denied" || code === "firestore/permission-denied") return "Firebase rules blocked access";
  if (code === "failed-precondition") return "Firebase needs an index or rule update";
  if (code) return code;
  if (error?.message) return error.message;
  if (error?.name) return error.name;
  return "unknown error";
}

function getEditorSessionId() {
  try {
    const existing = sessionStorage.getItem(EDIT_SESSION_STORAGE_KEY);
    if (existing) return existing;
    const next = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(EDIT_SESSION_STORAGE_KEY, next);
    return next;
  } catch {
    return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
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
  applyEditingMode();
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
  els.resetDemo?.classList.toggle("hidden", true);
  els.plannerKicker.textContent = showWorkspace ? "Workspace" : workspaceLabel();
  els.plannerTitle.textContent = showWorkspace ? "Weave" : activePlanTitle();
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
  if (state.currentScreen !== "workspace" || planMetaById(activePlanId())) {
    savePlanToCatalog(state.plan);
  }
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
      const canEditWorkspace = meta.role === "owner" && meta.type === "team";
      const canDeleteWorkspace = canEditWorkspace && meta.type === "team";
      const workspaceActions = canEditWorkspace
        ? `
          <div class="plan-card-actions">
            <button class="primary-button workspace-open-button" type="button" data-workspace-id="${escapeAttr(meta.id)}">Open</button>
            <button class="ghost-button workspace-rename-button" type="button" data-workspace-id="${escapeAttr(meta.id)}">Rename</button>
            ${canDeleteWorkspace ? `<button class="ghost-button danger-button workspace-delete-button" type="button" data-workspace-id="${escapeAttr(meta.id)}">Delete</button>` : ""}
          </div>
        `
        : `
          <div class="plan-card-actions">
            <button class="primary-button workspace-open-button" type="button" data-workspace-id="${escapeAttr(meta.id)}">Open</button>
          </div>
        `;
      return `
        <article class="workspace-card${selected}" data-workspace-id="${escapeAttr(meta.id)}">
          <span class="workspace-card-eyebrow">${escapeHtml(meta.type === "team" ? "Team Workspace" : "Personal Workspace")}</span>
          <strong>${escapeHtml(meta.name || "Workspace")}</strong>
          <small>${escapeHtml(meta.role === "owner" ? "Owner" : "Editor")}</small>
          ${workspaceActions}
        </article>
      `;
    })
    .join("");
  const newWorkspaceCard = document.createElement("button");
  newWorkspaceCard.className = "workspace-card create-card";
  newWorkspaceCard.type = "button";
  newWorkspaceCard.innerHTML = `<span class="workspace-card-eyebrow">New Team</span><strong>Create Team Workspace</strong><small>Invite colleagues by email</small>`;
  newWorkspaceCard.addEventListener("click", openWorkspaceSetup);
  els.workspaceCardGrid.append(newWorkspaceCard);
  els.workspaceCardGrid.querySelectorAll(".workspace-open-button").forEach((button) => {
    button.addEventListener("click", () => switchWorkspace(button.dataset.workspaceId));
  });
  els.workspaceCardGrid.querySelectorAll(".workspace-rename-button").forEach((button) => {
    button.addEventListener("click", () => renameWorkspace(button.dataset.workspaceId));
  });
  els.workspaceCardGrid.querySelectorAll(".workspace-delete-button").forEach((button) => {
    button.addEventListener("click", () => deleteWorkspace(button.dataset.workspaceId));
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
            <button class="ghost-button plan-history-button" type="button" data-plan-id="${escapeAttr(meta.id)}">History</button>
            ${canManagePlanSharing() ? `<button class="ghost-button plan-rename-button" type="button" data-plan-id="${escapeAttr(meta.id)}">Rename</button>` : ""}
            ${canManagePlanSharing() ? `<button class="ghost-button danger-button plan-delete-button" type="button" data-plan-id="${escapeAttr(meta.id)}">Delete</button>` : ""}
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
  els.planCardGrid.querySelectorAll(".plan-history-button").forEach((button) => {
    button.addEventListener("click", () => openPlanHistory(button.dataset.planId));
  });
  els.planCardGrid.querySelectorAll(".plan-rename-button").forEach((button) => {
    button.addEventListener("click", () => renamePlan(button.dataset.planId));
  });
  els.planCardGrid.querySelectorAll(".plan-delete-button").forEach((button) => {
    button.addEventListener("click", () => deletePlan(button.dataset.planId));
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

function openRecoveryModal(title, bodyHtml) {
  if (!els.recoveryModal) return;
  els.recoveryTitle.textContent = title;
  els.recoveryBody.innerHTML = bodyHtml;
  els.recoveryModal.classList.remove("hidden");
}

function closeRecoveryModal() {
  if (!els.recoveryModal) return;
  els.recoveryModal.classList.add("hidden");
  els.recoveryBody.innerHTML = "";
}

function openTrashView() {
  const deletedWorkspaces = deletedWorkspaceCatalog.filter((workspace) => workspace.deletedAt);
  const deletedPlans = deletedPlansForActiveWorkspace();
  const workspaceHtml = deletedWorkspaces.length
    ? deletedWorkspaces.map((workspace) => `
      <article class="recovery-item">
        <strong>${escapeHtml(workspace.name || "Deleted Workspace")}</strong>
        <small>Workspace deleted ${escapeHtml(dateLabel(workspace.deletedAt))}</small>
        <button class="primary-button restore-workspace-button" type="button" data-workspace-id="${escapeAttr(workspace.id)}">Restore Workspace</button>
      </article>
    `).join("")
    : `<p class="muted-copy">No deleted workspaces.</p>`;
  const planHtml = deletedPlans.length
    ? deletedPlans.map((plan) => `
      <article class="recovery-item">
        <strong>${escapeHtml(plan.title || "Deleted 2YIP")}</strong>
        <small>${escapeHtml(plan.subject || "Subject")} · deleted ${escapeHtml(dateLabel(plan.deletedAt))}</small>
        <button class="primary-button restore-plan-button" type="button" data-plan-id="${escapeAttr(plan.id)}">Restore 2YIP</button>
      </article>
    `).join("")
    : `<p class="muted-copy">No deleted 2YIP plans in this workspace.</p>`;
  openRecoveryModal("Trash", `
    <div class="recovery-list">
      <p class="eyebrow">Workspaces</p>
      ${workspaceHtml}
      <p class="eyebrow">2YIP Plans</p>
      ${planHtml}
    </div>
  `);
  els.recoveryBody.querySelectorAll(".restore-workspace-button").forEach((button) => {
    button.addEventListener("click", () => restoreWorkspace(button.dataset.workspaceId));
  });
  els.recoveryBody.querySelectorAll(".restore-plan-button").forEach((button) => {
    button.addEventListener("click", () => restorePlan(button.dataset.planId));
  });
}

async function restoreWorkspace(workspaceId) {
  const workspace = deletedWorkspaceCatalog.find((entry) => entry.id === workspaceId);
  if (!cloud.user || !cloud.db || !workspace) return;
  renderCloudStatus("Restoring workspace...", "Sign out", true);
  const workspaceRef = cloud.db.collection("workspaces").doc(workspaceId);
  await workspaceRef.set({
    deletedAt: window.firebase.firestore.FieldValue.delete(),
    deletedAtMs: window.firebase.firestore.FieldValue.delete(),
    deletedBy: window.firebase.firestore.FieldValue.delete(),
    deletedReason: window.firebase.firestore.FieldValue.delete(),
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  const plansSnapshot = await workspaceRef.collection("plans").get();
  await Promise.all(plansSnapshot.docs.map((planDoc) => planDoc.ref.set({
    deletedAt: window.firebase.firestore.FieldValue.delete(),
    deletedAtMs: window.firebase.firestore.FieldValue.delete(),
    deletedBy: window.firebase.firestore.FieldValue.delete(),
    deletedReason: window.firebase.firestore.FieldValue.delete(),
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true })));
  await cloud.db.collection("users").doc(cloud.user.uid).set({
    workspaces: {
      [workspaceId]: {
        ...normalizeWorkspaceMetadata(workspace),
        deletedAt: "",
        deletedBy: "",
        deletedReason: "",
      },
    },
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  deletedWorkspaceCatalog = deletedWorkspaceCatalog.filter((entry) => entry.id !== workspaceId);
  saveDeletedWorkspaceCatalog();
  await loadCloudWorkspaceCatalog();
  await loadCloudPlanCatalog();
  closeRecoveryModal();
  renderCloudStatus("Workspace restored", "Sign out");
  render();
}

async function restorePlan(planId) {
  const plan = deletedPlansForActiveWorkspace().find((entry) => entry.id === planId);
  if (!cloud.user || !cloud.db || !plan) return;
  renderCloudStatus("Restoring 2YIP...", "Sign out", true);
  await cloud.db.collection("workspaces").doc(activeWorkspaceId()).collection("plans").doc(planId).set({
    deletedAt: window.firebase.firestore.FieldValue.delete(),
    deletedAtMs: window.firebase.firestore.FieldValue.delete(),
    deletedBy: window.firebase.firestore.FieldValue.delete(),
    deletedReason: window.firebase.firestore.FieldValue.delete(),
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  deletedPlanCatalog = deletedPlanCatalog.filter((entry) => !(entry.id === planId && entry.workspaceId === activeWorkspaceId()));
  saveDeletedPlanCatalog();
  await loadCloudPlanCatalog();
  closeRecoveryModal();
  renderCloudStatus("2YIP restored", "Sign out");
  render();
}

async function openPlanHistory(planId) {
  if (!cloud.user || !cloud.db || !planId) return;
  renderCloudStatus("Loading history...", "Sign out", true);
  try {
    const snapshot = await cloud.db
      .collection("workspaces")
      .doc(activeWorkspaceId())
      .collection("plans")
      .doc(planId)
      .collection("snapshots")
      .orderBy("createdAtMs", "desc")
      .limit(12)
      .get();
    const snapshots = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const body = snapshots.length
      ? snapshots.map((item) => `
        <article class="recovery-item">
          <strong>${escapeHtml(item.title || "2YIP Snapshot")}</strong>
          <small>${escapeHtml(dateLabel(item.createdAtMs))} · ${escapeHtml(item.reason || "snapshot")} · ${Number(item.unitCount) || 0} units · ${Number(item.lessonCount) || 0} lessons</small>
          <button class="primary-button restore-snapshot-button" type="button" data-plan-id="${escapeAttr(planId)}" data-snapshot-id="${escapeAttr(item.id)}">Restore This Version</button>
        </article>
      `).join("")
      : `<p class="muted-copy">No snapshots yet. A snapshot is created after changes are saved for about 5 minutes, and before delete or restore actions.</p>`;
    openRecoveryModal("Plan History", `<div class="recovery-list">${body}</div>`);
    els.recoveryBody.querySelectorAll(".restore-snapshot-button").forEach((button) => {
      button.addEventListener("click", () => restoreSnapshot(button.dataset.planId, button.dataset.snapshotId));
    });
    renderCloudStatus("History loaded", "Sign out");
  } catch (error) {
    console.warn("History load failed", error);
    renderCloudStatus(`History unavailable: ${error.code || error.message || "check rules"}`, "Sign out");
  }
}

async function restoreSnapshot(planId, snapshotId) {
  if (!cloud.user || !cloud.db || !planId || !snapshotId) return;
  const confirmed = window.confirm("Restore this 2YIP version? A safety snapshot of the current version will be created first.");
  if (!confirmed) return;
  const planRef = cloud.db.collection("workspaces").doc(activeWorkspaceId()).collection("plans").doc(planId);
  const currentSnapshot = await planRef.get();
  const currentState = currentSnapshot.exists ? currentSnapshot.data()?.state : null;
  if (currentState) await createPlanSnapshot("before-restore", currentState, { planId, workspaceId: activeWorkspaceId() });
  const selectedSnapshot = await planRef.collection("snapshots").doc(snapshotId).get();
  const snapshotState = selectedSnapshot.exists ? selectedSnapshot.data()?.state : null;
  if (!snapshotState?.plan) {
    renderCloudStatus("Selected snapshot is not restorable", "Sign out");
    return;
  }
  await planRef.set({
    title: snapshotState.plan.title || "Restored 2YIP",
    subject: snapshotState.plan.subject || "Art",
    teamId: snapshotState.plan.teamId || "",
    teamName: snapshotState.plan.teamName || "",
    state: snapshotState,
    deletedAt: window.firebase.firestore.FieldValue.delete(),
    deletedAtMs: window.firebase.firestore.FieldValue.delete(),
    deletedBy: window.firebase.firestore.FieldValue.delete(),
    deletedReason: window.firebase.firestore.FieldValue.delete(),
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, planId);
  await loadCloudPlanCatalog();
  await switchPlan(planId, { targetScreen: "timeline", skipPersist: true, force: true });
  closeRecoveryModal();
  renderCloudStatus("Snapshot restored", "Sign out");
}

function dateLabel(value) {
  if (!value) return "unknown date";
  if (typeof value === "number") return new Date(value).toLocaleString();
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toLocaleString();
  return "unknown date";
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
    await acquireEditingLock({ allowSameUserTakeover: true });
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

function cardPreviewTone(type) {
  const tones = {
    bigIdeas: "tone-big-ideas",
    meaningText: "tone-meaning",
    learningOutcomes: "tone-learning-outcomes",
    media: "tone-media",
    context: "tone-context",
    artisticProcesses: "tone-artistic-processes",
    visualQualities: "tone-visual-qualities",
    visualQualityText: "tone-visual-qualities",
    coreExperiences: "tone-core-experiences",
    teachingMoves: "tone-teaching-moves",
    assessment: "tone-assessment",
    pedagogy: "tone-pedagogy",
    cc21: "tone-cc21",
    cc21Goals: "tone-cc21",
  };
  return tones[type] || "tone-default";
}

function cardPreviewTitle(payload) {
  if (!payload) return "Card";
  if (isTextCard(payload.type) && payload.value?.trim()) return payload.value.trim();
  return payload.label || cardTypeLabel(payload.type, payload);
}

function cardDetailFor(payload) {
  if (!payload) return null;
  const label = normalizePlanningLabel(payload.label || "", payload.type);
  return libraryCardDetails[label] || {
    tone: cardPreviewTone(payload.type),
    title: cardPreviewTitle({ ...payload, label }),
    detailLabel: "",
    context: ["Coming soon."],
  };
}

function openCardDetail(payload, onInsert, options = {}) {
  const detail = cardDetailFor(payload);
  if (!detail || !els.cardDetailModal) {
    onInsert?.();
    return;
  }

  const mode = options.mode || "insert";
  cardDetailInsertAction = mode === "insert" ? onInsert : null;
  els.cardDetailPreview.className = `big-idea-preview ${cardPreviewTone(payload.type)} no-label`;
  els.cardDetailTitle.textContent = detail.title;
  if (els.cardDetailLabel) {
    els.cardDetailLabel.textContent = "";
    els.cardDetailLabel.classList.add("hidden");
  }
  els.cardDetailContext.innerHTML = detail.context.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  els.cardDetailCancel?.classList.toggle("hidden", mode !== "insert");
  if (els.cardDetailInsert) {
    els.cardDetailInsert.textContent = mode === "insert" ? "Insert Into Board" : "Return To Board";
  }
  els.cardDetailModal.classList.remove("hidden");
}

function closeCardDetail() {
  cardDetailInsertAction = null;
  els.cardDetailModal?.classList.add("hidden");
}

function handleLibraryCardClick(payload, onInsert) {
  openCardDetail(payload, onInsert, { mode: "insert" });
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
        handleLibraryCardClick({ type, label }, () => {
          if (state.currentScreen === "board") {
            addBoardCard(unit, { type, label }, { zone: state.selectedBoardZone });
          } else {
            addLibraryItemToUnit(unit, { type, label });
          }
        });
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
  const type = typeof entry === "string" ? category.type : entry.type;
  const label = typeof entry === "string" ? entry : entry.label;
  return {
    label: normalizePlanningLabel(label, type),
    type,
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
      block.setAttribute("draggable", "false");
      block.setAttribute("role", "button");
      block.setAttribute("aria-pressed", String(unit.id === state.selectedUnitId));
      block.setAttribute("aria-label", `${unit.title || "Untitled Unit"} on timeline. Click to select, double click to open Unit Board.`);
      block.tabIndex = 0;
      block.dataset.unitId = unit.id;
      block.title = `${unit.title || "Untitled Unit"} · Sec ${year} · ${timelineWeekRangeLabel(unit)} · Click to select, double click to open Unit Board`;
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
      block.addEventListener("dblclick", (event) => {
        if (event.target.closest(".unit-block-delete")) return;
        event.preventDefault();
        state.selectedUnitId = unit.id;
        state.unitOverviewOpen = false;
        state.currentScreen = "board";
        render();
      });
      block.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        state.selectedUnitId = unit.id;
        if (event.key === "Enter") {
          state.unitOverviewOpen = false;
          state.currentScreen = "board";
        }
        render();
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
  unit.boardCards = uniqueBoardCards(unit.boardCards || []);
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
  els.clearBoard.classList.add("hidden");
  els.arrangeBoard.classList.toggle("hidden", showOverview);
  els.overviewUnit.classList.toggle("hidden", showOverview);
  if (showOverview) {
    renderUnitOverview(unit);
    return;
  }
  updateBoardZoneSelection();
  els.boardZones.forEach((zone) => {
    zone.querySelector(".zone-cards").innerHTML = "";
  });
  const featuredLessonCardKeys = unitLessonFeaturedCardKeys(unit);

  unit.boardCards
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach((card) => {
      const notFeatured = unitCardNotFeaturedInAnyLesson(unit, card, featuredLessonCardKeys);
      const node = document.createElement("article");
      node.className = "board-card";
      if (notFeatured) node.classList.add("not-featured-in-lessons");
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
      ${notFeatured ? `<div class="board-card-status">Not featured in any lessons</div>` : ""}
    `;
    node.querySelector(".board-card-remove").addEventListener("click", (event) => {
      event.stopPropagation();
      selectBoardZone(card.zone || zoneForType(card.type));
      removeBoardCard(unit, card);
      render();
    });
    node.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isInteractiveTarget(event.target)) return;
      const cardZone = card.zone || zoneForType(card.type);
      selectBoardZone(cardZone);
      openCardDetail(card, null, { mode: "view" });
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
        selectBoardZone(card.zone || zoneForType(card.type));
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
        selectBoardZone(card.zone || zoneForType(card.type));
        card.confirmed = false;
        syncUnitCardToLessons(unit, card);
        render();
      });
    }
    const expandButton = node.querySelector(".board-card-expand");
    if (expandButton) {
      expandButton.addEventListener("click", (event) => {
        event.stopPropagation();
        selectBoardZone(card.zone || zoneForType(card.type));
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
  els.overviewUnit.classList.add("hidden");
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
        <button class="ghost-button export-unit-word" type="button">Download Word</button>
      </div>
    </div>
    <article class="unit-document">
      <dl class="lap-summary-list unit-summary-list">
        <dt>Performance Task / Evidence of Learning</dt><dd>${renderTeacherText(unit.artTask || "Not yet planned")}</dd>
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
  els.unitOverview.querySelector(".export-unit-word").addEventListener("click", () => {
    exportUnitWord(unit);
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
          ${renderTeacherText(description)}
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
              ${renderTeacherText(description || "Not yet planned")}
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
  const cardValues = sortedPlanningCards(unit.boardCards || [], {
    zoneForType,
    typeOrder: unitCardTypeOrder(),
  })
    .filter((card) => card.type === type)
    .map((card) => readableCardValue(card));
  return sortedReadableValues(uniqueReadableValues(cardValues.length ? cardValues : base), type);
}

function contextOverviewValues(unit) {
  const cardValues = sortedPlanningCards(unit.boardCards || [], {
    zoneForType,
    typeOrder: unitCardTypeOrder(),
  }).filter((card) => card.type === "context").map((card) => readableCardValue(card));
  if (cardValues.length) return sortedReadableValues(uniqueReadableValues(cardValues), "context");
  return sortedReadableValues(uniqueReadableValues([
    unit.learningContent?.context,
    ...(unit.learningContent?.contextCards || []),
  ]), "context");
}

function visualQualityOverviewValues(unit) {
  const cardValues = sortedPlanningCards(unit.boardCards || [], {
    zoneForType,
    typeOrder: unitCardTypeOrder(),
  })
    .filter((card) => card.type === "visualQualities" || card.type === "visualQualityText")
    .map((card) => readableCardValue(card));
  if (cardValues.length) return uniqueReadableValues(cardValues);
  return sortedReadableValues(uniqueReadableValues([
    unit.learningContent?.visualQualities,
    ...(unit.learningContent?.visualQualityCards || []),
  ]), "visualQualities");
}

function themeValues(unit) {
  const cardValues = sortedPlanningCards(unit.boardCards || [], {
    zoneForType,
    typeOrder: unitCardTypeOrder(),
  })
    .filter((card) => card.type === "meaningText" && card.label === "Theme")
    .map((card) => readableCardValue(card));
  if (cardValues.length) return sortedReadableValues(uniqueReadableValues(cardValues), "meaningText");
  return sortedReadableValues(uniqueReadableValues([
    unit.theme,
  ]), "meaningText");
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

function exportUnitWord(unit) {
  const title = `${unit.title || "Untitled Unit"} Unit Plan`;
  downloadWordDocument(`${safeDownloadName(unit.title || "unit-plan")}-unit-plan.doc`, title, unitWordExportHtml(unit));
  showSaveStatus("Unit Word document downloaded");
}

function exportLessonWord(unit, lesson) {
  const title = `${unit.title || "Untitled Unit"} ${lessonNumber(unit, lesson)}`;
  downloadWordDocument(`${safeDownloadName(`${unit.title || "unit"}-${lessonNumber(unit, lesson)}`)}-lesson-plan.doc`, title, lessonWordExportHtml(unit, lesson));
  setSaveStatus([els.lessonTopSaveStatus, els.lessonSaveStatus], "Lesson Word document downloaded");
}

function safeDownloadName(value = "art-plan") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "art-plan";
}

function downloadWordDocument(filename, title, bodyHtml) {
  const html = wordDocumentHtml(title, bodyHtml);
  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function wordDocumentHtml(title, bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; line-height: 1.35; }
    h1 { font-size: 24pt; margin: 0 0 12pt; }
    h2 { font-size: 15pt; margin: 18pt 0 6pt; border-bottom: 1px solid #d8d0c4; padding-bottom: 4pt; }
    h3 { font-size: 11pt; margin: 10pt 0 4pt; color: #6f6a61; text-transform: uppercase; }
    p { margin: 0 0 8pt; }
    ul, ol { margin-top: 4pt; }
    .formatted-teacher-text p { margin: 0 0 8pt; }
    .formatted-teacher-text ul, .formatted-teacher-text ol { margin: 4pt 0 8pt; padding-left: 18pt; }
    .formatted-field-label { margin: 8pt 0 3pt; color: #6f6a61; font-size: 9pt; font-weight: bold; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin: 8pt 0 14pt; }
    th, td { border: 1px solid #d8d0c4; padding: 6pt; vertical-align: top; }
    th { background: #f4efe7; text-align: left; }
    .meta-table td:first-child { width: 28%; font-weight: bold; color: #6f6a61; }
    .not-planned { color: #777; font-style: italic; }
    img { max-width: 420px; height: auto; margin: 8pt 0 12pt; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function unitWordExportHtml(unit) {
  const sections = unitOverviewCopySections(unit);
  return `
    <h1>${escapeHtml(unit.title || "Untitled Unit")}</h1>
    <table class="meta-table">
      <tr><td>Performance Task / Evidence of Learning</td><td>${wordParagraph(unit.artTask || "Not yet planned")}</td></tr>
      <tr><td>Lesson Count</td><td>${escapeHtml(unitLessonCountLabel(unit))}</td></tr>
    </table>
    ${sections.map(([title, groups]) => wordGroupedSection(title, groups)).join("")}
    <h2>Lesson Sequence</h2>
    ${unit.lessons?.length ? `
      <table>
        <tr><th>Lesson</th><th>Title</th><th>Description / Details</th><th>Activities</th></tr>
        ${unit.lessons.map((lesson, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(lesson.title || "Untitled Lesson")}</td>
            <td>${wordParagraph(lesson.description || lesson.details || "Not yet planned")}</td>
            <td>${lesson.steps?.length ? `<ul>${lesson.steps.map((step) => `<li>${escapeHtml(lessonActivitySummaryText(step))}</li>`).join("")}</ul>` : `<span class="not-planned">Not yet planned</span>`}</td>
          </tr>
        `).join("")}
      </table>
    ` : `<p class="not-planned">Not yet planned</p>`}
  `;
}

function lessonWordExportHtml(unit, lesson) {
  const lessonImageSrc = lesson.imageUrl || lesson.imageDataUrl;
  const structures = lessonDisplayStructures(lesson);
  const meaningGroups = [
    ["Big Idea(s)", overviewValues(unit, "bigIdeas")],
    ["Guiding Question(s)", guidingQuestionValues(unit)],
    ["Theme", themeValues(unit)],
  ];
  return `
    <h1>${escapeHtml(`${unit.title || "Untitled Unit"} - ${lessonNumber(unit, lesson)}`)}</h1>
    ${lessonImageSrc ? `<img src="${escapeAttr(lessonImageSrc)}" alt="${escapeAttr(lesson.imageName || "Lesson reference image")}">` : ""}
    <table class="meta-table">
      <tr><td>Lesson Title</td><td>${wordParagraph(lesson.title || "Not set")}</td></tr>
      <tr><td>Lesson Description</td><td>${wordParagraph(lesson.description || "Not set")}</td></tr>
      <tr><td>Lesson Objectives</td><td>${wordParagraph(lesson.objectives || "Not set")}</td></tr>
      <tr><td>Lesson Duration</td><td>${escapeHtml(lessonDurationLabel(lesson))}</td></tr>
    </table>
    ${wordGroupedSection("Meaning Reference", meaningGroups)}
    ${wordGroupedSection("Curricular Goals", [
      ["Learning Outcomes", lessonOverviewValues(lesson, "learningOutcomes")],
      ["21CC Emphasis", lessonOverviewValues(lesson, "cc21")],
      ["21CC Lesson Goals", lessonOverviewValues(lesson, "cc21Goals")],
    ])}
    ${wordGroupedSection("Learning Content", [
      ["Media / Art Forms", lessonOverviewValues(lesson, "media")],
      ["Context", lessonOverviewValues(lesson, "context")],
      ["Artistic Processes", lessonOverviewValues(lesson, "artisticProcesses")],
      ["Visual Qualities", lessonOverviewValues(lesson, "visualQualities")],
      ["Other Visual Qualities", lessonOverviewValues(lesson, "visualQualityText")],
    ])}
    ${wordGroupedSection("Core Learning Experiences", [["Core Learning Experiences", lessonOverviewValues(lesson, "coreExperiences")]])}
    ${wordGroupedSection("Pedagogy", [
      ["Pedagogy", lessonOverviewValues(lesson, "pedagogy")],
      ["Legacy Teaching Action Cards", lessonOverviewValues(lesson, "teachingMoves")],
    ])}
    ${wordGroupedSection("Assessment", [["Assessment", lessonOverviewValues(lesson, "assessment")]])}
    ${wordGroupedSection("Lesson Structure", [["Lesson Structure", structures]])}
    <h2>Learning Activities</h2>
    ${lesson.steps?.length ? `
      <table>
        <tr><th>Activity</th><th>Type</th><th>Duration</th><th>Details</th><th>Evidence for Assessment</th><th>Teaching Actions</th></tr>
        ${lesson.steps.map((step, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(step.type || "Not set")}</td>
            <td>${step.duration ? `${escapeHtml(String(step.duration))} minutes` : `<span class="not-planned">Not set</span>`}</td>
            <td>${wordParagraph(step.description || "Not yet planned")}</td>
            <td>${wordParagraph(step.evidence || "Not yet planned")}</td>
            <td>${wordTeachingActions(step)}</td>
          </tr>
        `).join("")}
      </table>
    ` : `<p class="not-planned">Not yet planned</p>`}
  `;
}

function wordTeachingActions(step) {
  const actions = lessonTeachingActionEntries(step);
  if (!actions.length) return `<span class="not-planned">Not yet planned</span>`;
  return `
    <ul>
      ${actions.map(({ action }) => `
        <li>
          <strong>${escapeHtml(action.title)}</strong>
        </li>
      `).join("")}
    </ul>
  `;
}

function wordGroupedSection(title, groups) {
  return `
    <h2>${escapeHtml(title)}</h2>
    ${groups.map(([label, values]) => `
      <h3>${escapeHtml(label)}</h3>
      ${wordList(values)}
    `).join("")}
  `;
}

function wordList(values) {
  const items = (values || []).filter(Boolean);
  return items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : `<p class="not-planned">Not yet planned</p>`;
}

function renderTeacherText(value, options = {}) {
  const fallback = options.fallback || "Not yet planned";
  const text = String(value || "").replace(/\r\n?/g, "\n").trim();
  if (!text) return `<p class="not-planned">${escapeHtml(fallback)}</p>`;

  const blocks = [];
  let paragraphLines = [];
  let listType = "";
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push(`<p>${paragraphLines.map((line) => escapeHtml(line.trim())).filter(Boolean).join("<br>")}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    const tag = listType === "ol" ? "ol" : "ul";
    blocks.push(`<${tag}>${listItems.map((item) => `<li>${escapeHtml(item.trim())}</li>`).join("")}</${tag}>`);
    listType = "";
    listItems = [];
  };

  text.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const numbered = line.match(/^(\d+)[.)]\s+(.+)$/);
    const bulleted = line.match(/^[-*•]\s+(.+)$/);

    if (numbered || bulleted) {
      const nextType = numbered ? "ol" : "ul";
      flushParagraph();
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push(numbered ? numbered[2] : bulleted[1]);
      return;
    }

    if (listItems.length) {
      listItems[listItems.length - 1] = `${listItems[listItems.length - 1]} ${line}`;
      return;
    }

    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return `<div class="formatted-teacher-text">${blocks.join("")}</div>`;
}

function wordParagraph(value) {
  return renderTeacherText(value);
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
    ${renderTeacherText(unit.artTask || "Not yet planned")}
    <p><strong>Lesson Count:</strong> ${escapeHtml(unitLessonCountLabel(unit))}</p>
    ${unitOverviewCopySections(unit).map(([title, groups]) => `
      <h2>${escapeHtml(title)}</h2>
      ${groups.map(([label, values]) => `
        <h3>${escapeHtml(label)}</h3>
        ${values?.length ? `<ul>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>` : "<p>Not yet planned</p>"}
      `).join("")}
    `).join("")}
    <h2>Lesson Sequence</h2>
    ${unit.lessons?.length ? `<ol>${unit.lessons.map((lesson) => `<li><strong>${escapeHtml(lesson.title || "Untitled Lesson")}</strong>${renderTeacherText(lesson.description || lesson.details || "Not yet planned")}${lesson.steps?.length ? `<ul>${lesson.steps.map((step) => `<li>${escapeHtml(lessonActivitySummaryText(step))}</li>`).join("")}</ul>` : ""}</li>`).join("")}</ol>` : "<p>Not yet planned</p>"}
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

function selectBoardZone(zoneKey) {
  if (!zoneKey) return;
  state.selectedBoardZone = zoneKey;
  renderLibrary();
  updateBoardZoneSelection();
  renderMobileBoardTabs();
  renderMobileUnitCardPicker(selectedUnit());
}

function updateLessonZoneSelection() {
  els.lessonBoardZones.forEach((zone) => {
    const isSelected = zone.dataset.lessonZone === state.selectedLessonZone;
    zone.classList.toggle("selected-zone", isSelected);
    zone.setAttribute("aria-selected", String(isSelected));
    zone.tabIndex = 0;
  });
}

function selectLessonZone(zoneKey) {
  if (!zoneKey) return;
  state.selectedLessonZone = zoneKey;
  renderLibrary();
  updateLessonZoneSelection();
  renderMobileLessonTabs();
  const unit = selectedUnit();
  renderMobileLessonCardPicker(unit, selectedLesson(unit));
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
          ${lesson.confirmed ? "" : `<div class="lesson-subtitle">Lesson Structure</div>`}
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
    card.querySelector(".lesson-remove").addEventListener("click", async () => {
      const confirmed = window.confirm(`Remove ${lesson.title || `Lesson ${index + 1}`}? A recovery snapshot will be created first.`);
      if (!confirmed) return;
      await createPlanSnapshot("before-delete", state);
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
  els.arrangeLessonBoard.classList.toggle("hidden", showOverview);
  els.editLessonBoard.textContent = showOverview ? "Back To Lesson" : "Overview";

  if (showOverview) {
    els.lessonConfirmedView.innerHTML = lessonConfirmedSummary(unit, lesson);
    els.lessonConfirmedView.querySelector(".export-lesson-word")?.addEventListener("click", () => {
      exportLessonWord(unit, lesson);
    });
    return;
  }

  if (document.activeElement !== els.lessonTitle) els.lessonTitle.value = lesson.title || "";
  els.lessonDuration.textContent = lessonDurationLabel(lesson);
  if (document.activeElement !== els.lessonDescription) els.lessonDescription.value = lesson.description || "";
  if (document.activeElement !== els.lessonObjectives) els.lessonObjectives.value = lesson.objectives || "";
  renderLessonMeaningReference(unit);
  renderLessonImage(lesson);
  lesson.boardCards = (lesson.boardCards || []).filter(cardAllowedOnLessonBoard);
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

  lessonLibrarySections(unit, state.selectedLessonZone, lesson).forEach((section) => {
    const category = createLibraryCategory(section.title, `lesson:${state.selectedLessonZone}:${section.title}`);

    section.items.forEach((item) => {
      const isAction = Boolean(item.action);
      const button = document.createElement("button");
      button.className = "library-item";
      if (isAction) button.classList.add("library-action");
      button.type = "button";
      button.textContent = item.label;
      button.draggable = !isAction;
      button.dataset.type = item.type || "libraryAction";
      button.dataset.label = item.label;
      button.addEventListener("dragstart", (event) => {
        if (isAction) return;
        dragPayload = { type: item.type, label: item.label };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
        event.dataTransfer.effectAllowed = "copy";
      });
      button.addEventListener("dragend", () => {
        dragPayload = null;
      });
      button.addEventListener("click", () => {
        if (handleLibraryAction(item)) return;
        handleLibraryCardClick({ type: item.type, label: item.label }, () => {
          addLessonBoardCard(unit, lesson, { type: item.type, label: item.label });
        });
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
  const sections = lessonLibrarySections(unit, state.selectedLessonZone, lesson)
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
      if (item.action) button.classList.add("library-action");
      button.type = "button";
      button.textContent = item.label;
      button.dataset.type = item.type || "libraryAction";
      button.dataset.label = item.label;
      button.addEventListener("click", () => {
        if (handleLibraryAction(item)) return;
        handleLibraryCardClick(item, () => onAdd(item));
      });
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

function handleLibraryAction(item) {
  if (!item?.action) return false;
  if (item.action === "toggleAll21ccGoals") {
    state.showAll21ccLessonGoals = !state.showAll21ccLessonGoals;
    render();
    saveState();
    return true;
  }
  return false;
}

function lessonLibrarySections(unit, zone = null, lesson = null) {
  const sections = [
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
    ...cc21LessonGoalLibrarySections(unit, lesson, zone || "curricular"),
    {
      title: "Pedagogy",
      zone: "pedagogy",
      items: lessonItemsFromValues("pedagogy", [
        ...(unit.pedagogy || []),
        ...libraryItemsByType("pedagogy"),
      ]),
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
        ...currentArtisticProcessValues(unit.learningContent?.artisticProcessCards || []),
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
  ];
  return sections
    .filter((section) => !zone || section.zone === zone)
    .map((section) => ({ ...section, items: uniqueLessonLibraryItems(section.items) }))
    .filter((section) => section.items.length);
}

function cc21LessonGoalLibrarySections(unit, lesson, zone = "curricular") {
  const sections = [];
  const suggestedGoals = cc21GoalsForEmphases(selected21ccEmphases(unit, lesson));
  if (suggestedGoals.length) {
    sections.push({
      title: "Suggested 21CC Lesson Goals",
      zone: "curricular",
      items: suggestedGoals.map(cc21GoalLibraryItem),
    });
  }
  sections.push({
    title: "Browse All 21CC Goals",
    zone: "curricular",
    items: [{
      type: "libraryAction",
      label: state.showAll21ccLessonGoals ? "Hide full 21CC map" : "Browse all 21CC goals",
      action: "toggleAll21ccGoals",
    }],
  });
  if (!state.showAll21ccLessonGoals || isAll21ccGoalMapCollapsed(zone)) return sections;
  cc21LessonGoalGroups.forEach((domain) => {
    domain.competencies.forEach((competency) => {
      sections.push({
        title: competency.competency,
        zone: "curricular",
        items: competency.goals.map((goal) => cc21GoalLibraryItem({
          ...goal,
          domain: domain.domain,
          competency: competency.competency,
          emphasis: competency.emphasis,
          label: `${goal.code}: ${goal.title}`,
        })),
      });
    });
  });
  return sections;
}

function isAll21ccGoalMapCollapsed(zone = "curricular") {
  return Boolean(
    state.collapsedCategories[`lesson:${zone}:Browse All 21CC Goals`] ||
    state.collapsedCategories[`mobile-lesson:${zone}:Browse All 21CC Goals`],
  );
}

function cc21GoalLibraryItem(goal) {
  return { type: "cc21Goals", label: goal.label };
}

function selected21ccEmphases(unit, lesson) {
  const unitCc21Cards = (unit?.boardCards || []).filter((card) => card.type === "cc21");
  const unitLevelCc21Cards = unitCc21Cards.filter((card) => !card.lessonOrigin);
  const legacyUnitCc21Values = unitCc21Cards.length ? [] : unit?.cc21 || [];
  return visibleValues([
    ...legacyUnitCc21Values,
    ...unitLevelCc21Cards.map((card) => card.label),
    ...(lesson?.boardCards || []).filter((card) => card.type === "cc21").map((card) => card.label),
  ]);
}

function cc21GoalsForEmphases(emphases) {
  const selected = new Set(emphases);
  if (!selected.size) return [];
  return cc21LessonGoals.filter((goal) => selected.has(goal.emphasis) || selected.has(goal.domain));
}

function cc21GoalByLabel(label) {
  return cc21LessonGoals.find((goal) => goal.label === label);
}

function suggestedLessonCc21Outcomes(unit, lesson) {
  if (!unit || !lesson) return [];
  const selectedOutcomes = new Set(selected21ccEmphases(unit, lesson));
  const dismissed = new Set(lesson.dismissedSuggestions || []);
  const selectedGoals = uniqueReadableValues(
    (lesson.boardCards || [])
      .filter((card) => card.type === "cc21Goals")
      .map((card) => card.label),
  );
  const suggestions = selectedGoals
    .map(cc21GoalByLabel)
    .filter(Boolean)
    .filter((goal) => goal.emphasis && !selectedOutcomes.has(goal.emphasis))
    .map((goal) => ({
      key: `cc21Goal:${goal.label}->cc21:${goal.emphasis}`,
      groupKey: suggestionGroupKey("curricular", "cc21", goal.emphasis),
      zone: "curricular",
      type: "cc21",
      label: goal.emphasis,
      sourceLabel: goal.label,
    }));
  return uniqueSuggestions(suggestions).filter((suggestion) => !dismissed.has(suggestion.key) && !dismissed.has(suggestion.groupKey));
}

function lessonItemsFromValues(type, values) {
  return values.filter(Boolean).map((label) => ({ type, label }));
}

function currentArtisticProcessValues(values) {
  return visibleValues(values).filter((value) => !deprecatedArtisticProcessCards.has(value));
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
  const lessonImageSrc = lesson.imageUrl || lesson.imageDataUrl;
  return `
    <section class="lap-summary lesson-document">
      <div class="unit-overview-heading lesson-overview-heading">
        <div>
          <p class="eyebrow">Lesson Board</p>
          <h2>${escapeHtml(`${unit.title || "Untitled Unit"} · ${lessonNumber(unit, lesson)}`)}</h2>
        </div>
        <div class="unit-overview-actions">
          <button class="ghost-button export-lesson-word" type="button">Download Word</button>
        </div>
      </div>
      ${lessonImageSrc ? `<img class="lap-summary-image" src="${escapeAttr(lessonImageSrc)}" alt="${escapeAttr(lesson.imageName || "Lesson reference image")}" />` : ""}
      <dl class="lap-summary-list lesson-summary-list">
        <dt>Lesson Title</dt><dd>${escapeHtml(lesson.title || "Not set")}</dd>
        <dt>Lesson Description</dt><dd>${renderTeacherText(lesson.description || "Not set", { fallback: "Not set" })}</dd>
        <dt>Lesson Objectives</dt><dd>${renderTeacherText(lesson.objectives || "Not set", { fallback: "Not set" })}</dd>
        <dt>Lesson Duration</dt><dd>${escapeHtml(lessonDurationLabel(lesson))}</dd>
        <dt>Curricular Goals</dt><dd>${lessonOverviewGroups(lesson, [
          ["Learning Outcomes", "learningOutcomes"],
          ["21CC Emphasis", "cc21"],
          ["21CC Lesson Goals", "cc21Goals"],
        ])}</dd>
        <dt>Learning Content</dt><dd>${lessonOverviewGroups(lesson, [
          ["Media / Art Forms", "media"],
          ["Context", "context"],
          ["Artistic Processes", "artisticProcesses"],
          ["Visual Qualities", "visualQualities"],
          ["Other Visual Qualities", "visualQualityText"],
        ])}</dd>
        <dt>Core Learning Experiences</dt><dd>${lessonOverviewGroups(lesson, [["Core Learning Experiences", "coreExperiences"]])}</dd>
        <dt>Pedagogy</dt><dd>${lessonOverviewGroups(lesson, [
          ["Pedagogy", "pedagogy"],
          ["Legacy Teaching Action Cards", "teachingMoves"],
        ])}</dd>
        <dt>Assessment</dt><dd>${lessonOverviewGroups(lesson, [["Assessment", "assessment"]])}</dd>
        <dt>Lesson Structure</dt><dd>${lessonOverviewList(structures)}</dd>
        <dt>Learning Activities</dt><dd>${lesson.steps?.length ? lesson.steps.map((step, index) => lessonActivityOverviewHtml(step, index)).join("") : `<span class="not-planned">Not yet planned</span>`}</dd>
      </dl>
    </section>
  `;
}

function lessonOverviewGroups(lesson, groups) {
  return unitOverviewInlineGroups(groups.map(([label, type]) => [label, lessonOverviewValues(lesson, type)]));
}

function lessonOverviewValues(lesson, type) {
  return sortedReadableValues(
    uniqueReadableValues(
      sortedPlanningCards(lesson.boardCards || [], {
        zoneForType: lessonZoneForType,
        typeOrder: lessonCardTypeOrder(),
      })
      .filter((card) => card.type === type)
      .map((card) => readableCardValue(card)),
    ),
    type,
  );
}

function lessonOverviewList(values) {
  const items = (values || []).filter(Boolean);
  return items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<span class="not-planned">Not yet planned</span>`;
}

function lessonActivityOverviewHtml(step, index) {
  return `
    <div class="unit-summary-lesson lesson-summary-activity">
      <div>
        <strong>Activity ${index + 1}${step.type ? `: ${escapeHtml(step.type)}` : ""}</strong>
        ${step.duration ? `<p><strong>Duration:</strong> ${escapeHtml(String(step.duration))} minutes</p>` : ""}
        ${step.description ? renderTeacherText(step.description) : `<p class="not-planned">Details not yet planned</p>`}
        ${step.evidence ? `<div class="formatted-field-label">Evidence for Assessment</div>${renderTeacherText(step.evidence)}` : ""}
        ${lessonTeachingActionsOverviewHtml(step)}
        ${step.customisation ? `<div class="formatted-field-label">Customisation</div>${renderTeacherText(step.customisation)}` : ""}
      </div>
    </div>
  `;
}

function lessonTeachingActionsOverviewHtml(step) {
  const actions = lessonTeachingActionEntries(step);
  if (!actions.length) return "";
  return `
    <div class="lesson-overview-actions-list">
      <div class="formatted-field-label">Teaching Actions</div>
      <ul>
        ${actions.map(({ action }) => `
          <li>
            <strong>${escapeHtml(action.title)}</strong>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

function lessonTeachingActionEntries(step) {
  return normalizeTeachingActions(step.teachingActions || [])
    .map((selection) => ({ selection, action: teachingActionById(selection.id) }))
    .filter((entry) => entry.action);
}

function renderLessonImage(lesson) {
  const imageSrc = lesson.imageUrl || lesson.imageDataUrl;
  const imageMeta = [
    lesson.imageName || "Uploaded image",
    lesson.imageUrl ? "saved online" : "",
    lesson.imageDataUrl ? imageSizeLabel(lesson.imageDataUrl) : "",
  ].filter(Boolean).join(" · ");
  els.lessonImagePreview.innerHTML = imageSrc
    ? `<img src="${escapeAttr(imageSrc)}" alt="${escapeAttr(lesson.imageName || "Lesson reference image")}" /><span>${escapeHtml(imageMeta)}</span>`
    : `<span>${escapeHtml(lesson.imageSaveNotice || "No image uploaded")}</span>`;
  renderLessonImageStatus(lesson);
  els.removeLessonImage.disabled = !imageSrc && !lesson.imagePath;
}

function renderLessonImageStatus(lesson) {
  if (!els.lessonImageStatus) return;
  const message = lesson.imageUploadStatus || lesson.imageSaveNotice || "";
  const lowerMessage = message.toLowerCase();
  els.lessonImageStatus.textContent = message;
  els.lessonImageStatus.className = `image-upload-status${lowerMessage.includes("failed") || lowerMessage.includes("not ready") || lowerMessage.includes("could not") || lowerMessage.includes("pending") ? " error" : ""}`;
}

function setLessonImageStatus(lesson, message, tone = "") {
  if (lesson) lesson.imageUploadStatus = message;
  if (!els.lessonImageStatus) return;
  els.lessonImageStatus.textContent = message;
  els.lessonImageStatus.className = `image-upload-status${tone ? ` ${tone}` : ""}`;
}

function renderLessonPlanningBoard(lesson) {
  els.lessonBoardZones.forEach((zone) => {
    zone.querySelector(".zone-cards").innerHTML = "";
  });
  lesson.boardCards = uniqueLessonCards(lesson.boardCards || []).filter(cardAllowedOnLessonBoard);

  lesson.boardCards
    .slice()
    .filter(cardAllowedOnLessonBoard)
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
        selectLessonZone(card.zone || lessonZoneForType(card.type));
        if (card.inherited) {
          lesson.removedUnitCardKeys = lesson.removedUnitCardKeys || [];
          addUnique(lesson.removedUnitCardKeys, card.unitCardKey || cardKey(card));
        }
        lesson.boardCards = lesson.boardCards.filter((candidate) => candidate.id !== card.id);
        render();
      });
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isInteractiveTarget(event.target)) return;
        selectLessonZone(card.zone || lessonZoneForType(card.type));
        openCardDetail(card, null, { mode: "view" });
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
  renderLessonSuggestions(selectedUnit(), lesson);
}

function renderLessonSuggestions(unit, lesson) {
  suggestedLessonCc21Outcomes(unit, lesson).forEach((suggestion) => {
    const zone = document.querySelector(`.lesson-zone[data-lesson-zone="${suggestion.zone}"] .zone-cards`);
    if (!zone) return;
    const node = document.createElement("article");
    node.className = "suggestion-card lesson-suggestion-card";
    node.dataset.suggestionKey = suggestion.key;
    node.dataset.suggestionGroupKey = suggestion.groupKey;
    node.innerHTML = `
      <div class="suggestion-label">${escapeHtml(suggestionHeader(suggestion.type))}</div>
      <div class="suggestion-title">${escapeHtml(suggestion.label)}</div>
      <div class="suggestion-source">From ${escapeHtml(suggestion.sourceLabel)}</div>
      <div class="suggestion-actions">
        <button class="suggestion-add" type="button">Add</button>
        <button class="suggestion-dismiss" type="button">Dismiss</button>
      </div>
    `;
    node.querySelector(".suggestion-add").addEventListener("click", (event) => {
      event.stopPropagation();
      addLessonBoardCard(unit, lesson, { type: suggestion.type, label: suggestion.label }, { zone: suggestion.zone });
    });
    node.querySelector(".suggestion-dismiss").addEventListener("click", (event) => {
      event.stopPropagation();
      dismissLessonSuggestion(lesson, suggestion);
      saveState();
      render();
    });
    zone.append(node);
  });
}

function renderLessonMeaningReference(unit) {
  if (!els.lessonMeaningBrief) return;
  const groups = [
    ["Big Idea", overviewValues(unit, "bigIdeas")],
    ["Guiding Question", guidingQuestionValues(unit)],
    ["Theme", themeValues(unit)],
  ];
  els.lessonMeaningBrief.innerHTML = `
    <div class="lesson-meaning-grid">
      ${groups.map(([label, values]) => `
        <div class="lesson-meaning-item">
          <span>${escapeHtml(label)}</span>
          <p>${escapeHtml(values.join("; ") || "Not set")}</p>
        </div>
      `).join("")}
    </div>
  `;
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
    if (isReflectionCheckpoint(step)) item.classList.add("reflection-checkpoint-card");
    item.draggable = true;
    item.dataset.stepId = step.id;
    if (step.confirmed) item.classList.add("confirmed");
    const stepTitle = isReflectionCheckpoint(step) ? "Reflection Checkpoint" : `Activity ${index + 1}`;
    const stepKind = isReflectionCheckpoint(step) ? (step.reflectionPurpose || step.evidence || "Curricular goal") : step.type || "Activity";
    const stepDuration = isReflectionCheckpoint(step) ? "5 min" : step.duration ? `${step.duration} min` : "Duration not set";
    item.innerHTML = `
      <div class="lesson-card-header ${step.confirmed ? "lesson-flow-header" : ""}">
        <div>
          <div class="lesson-number">${escapeHtml(stepTitle)}</div>
          ${step.confirmed
            ? `<div class="lesson-flow-kicker"><span>${escapeHtml(stepKind)}</span><span>${escapeHtml(stepDuration)}</span></div>`
            : `<div class="lesson-subtitle">${isReflectionCheckpoint(step) ? "5 minutes" : "Inquiry Activity"}</div>`}
        </div>
        <div class="lesson-actions">
          <button class="activity-move" data-direction="up" type="button" ${index === 0 ? "disabled" : ""} aria-label="Move Activity ${index + 1} up">↑</button>
          <button class="activity-move" data-direction="down" type="button" ${index === lesson.steps.length - 1 ? "disabled" : ""} aria-label="Move Activity ${index + 1} down">↓</button>
          ${step.confirmed ? `<button class="activity-edit" type="button">Edit</button>` : `<button class="activity-confirm" type="button">Confirm</button>`}
          <button class="lesson-remove" type="button">Remove</button>
        </div>
      </div>
      ${step.confirmed ? lessonActivityDisplayContent(step) : lessonActivityEditContent(step)}
      ${renderTeachingActionsForStep(step, lesson)}
    `;
    item.querySelectorAll(".activity-move").forEach((button) => {
      button.addEventListener("click", () => {
        moveLessonActivity(lesson, index, button.dataset.direction);
      });
    });
    bindLessonActivityDragReorder(item, lesson, step);
    item.querySelector(".lesson-remove").addEventListener("click", async () => {
      const confirmed = window.confirm(`Remove Activity ${index + 1}? A recovery snapshot will be created first.`);
      if (!confirmed) return;
      await createPlanSnapshot("before-delete", state);
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
    item.querySelector(".checkpoint-purpose")?.addEventListener("change", (event) => {
      step.reflectionPurpose = event.target.value;
      step.evidence = event.target.value;
      saveState();
    });
    item.querySelector(".checkpoint-prompt")?.addEventListener("input", (event) => {
      step.reflectionPrompt = event.target.value;
      step.description = event.target.value;
      saveState();
    });
    bindTeachingActionControls(item, lesson, step);
    els.lessonSteps.append(item);
  });
}

function renderTeachingActionsForStep(step, lesson) {
  step.teachingActions = normalizeTeachingActions(step.teachingActions || []);
  const selectedActions = step.teachingActions
    .map((selection) => ({ selection, metadata: teachingActionById(selection.id) }))
    .filter((entry) => entry.metadata);
  const pickerOpen = state.activeTeachingActionPickerStepId === step.id;
  const detailOpen = state.activeTeachingActionDetailStepId === step.id
    ? teachingActionById(state.activeTeachingActionDetailId)
    : null;
  const detailSelected = Boolean(detailOpen && step.teachingActions.some((selection) => selection.id === detailOpen.id));
  return `
    <section class="activity-teaching-actions" aria-label="Teaching actions">
      <div class="activity-teaching-header">
        <div>
          <div class="lesson-flow-label">Teaching Actions</div>
        </div>
        <button class="activity-action-picker-toggle" type="button">
          ${pickerOpen ? "Close" : "Browse Teaching Actions"}
        </button>
      </div>
      ${selectedActions.length ? `
        <div class="activity-action-chips">
          ${selectedActions.map(({ selection, metadata }) => `
            <button class="activity-action-chip" type="button" data-action-id="${escapeAttr(metadata.id)}">
              ${escapeHtml(metadata.title)}
            </button>
          `).join("")}
        </div>
      ` : `<p class="activity-teaching-empty">Optional ideas for shaping this activity.</p>`}
      ${pickerOpen ? renderTeachingActionPicker(step, lesson) : ""}
      ${detailOpen ? renderTeachingActionDetail(detailOpen, detailSelected) : ""}
    </section>
  `;
}

function renderTeachingActionPicker(step, lesson) {
  const search = (state.teachingActionSearch || "").trim().toLowerCase();
  const selectedIds = new Set((step.teachingActions || []).map((selection) => selection.id));
  const actions = teachingActionsForActivity(step, lesson, search);
  const suggestedActions = actions.filter((entry) => entry.suggested).slice(0, 4);
  const browsing = state.showAllTeachingActions || Boolean(search);
  const browseGroups = groupTeachingActionsByArea(actions.map((entry) => entry.action));
  const openArea = openTeachingActionArea(browseGroups);
  return `
    <div class="activity-action-picker">
      <div class="activity-action-picker-top">
        <strong>Suggested for this activity</strong>
        <input class="text-input activity-action-search" type="search" placeholder="Search teaching actions" value="${escapeAttr(state.teachingActionSearch || "")}" />
      </div>
      <div class="activity-action-options">
        ${suggestedActions.length ? suggestedActions.map(({ action }) => teachingActionOptionHtml(action, selectedIds, true)).join("") : `<p class="activity-teaching-empty">No strong suggestions yet. Browse the full library if you want ideas.</p>`}
      </div>
      <button class="activity-action-browse-toggle" type="button" aria-expanded="${String(browsing)}">
        ${browsing ? "Hide More Teaching Actions" : "Browse More Teaching Actions"}
      </button>
      ${browsing ? `
        <div class="activity-action-browse">
          ${browseGroups.length ? browseGroups.map(([area, groupActions]) => `
            <section class="activity-action-area">
              <button class="activity-action-area-toggle" type="button" data-area="${escapeAttr(area)}" aria-expanded="${String(area === openArea)}">
                <span>${escapeHtml(area)}</span>
                <span>${groupActions.length} actions</span>
              </button>
              ${area === openArea ? `<div class="activity-action-options">
                ${groupActions.map((action) => teachingActionOptionHtml(action, selectedIds, suggestedActions.some((entry) => entry.action.id === action.id))).join("")}
              </div>` : ""}
            </section>
          `).join("") : `<p class="activity-teaching-empty">No teaching actions match this search.</p>`}
        </div>
      ` : ""}
    </div>
  `;
}

function teachingActionOptionHtml(action, selectedIds, suggested = false) {
  return `
    <article class="activity-action-option ${suggested ? "suggested" : ""}" data-action-id="${escapeAttr(action.id)}" role="button" tabindex="0">
      <div>
        <div class="activity-action-option-title">${escapeHtml(action.title)}</div>
        <p>${escapeHtml(action.description)}</p>
        <div class="activity-action-tags">
          ${suggested ? `<span>Suggested</span>` : ""}
          ${action.area ? `<span>${escapeHtml(action.area)}</span>` : ""}
          ${action.activityTypes.slice(0, 3).map((type) => `<span>${escapeHtml(type)}</span>`).join("")}
        </div>
      </div>
      <button class="activity-action-add" type="button" data-action-id="${escapeAttr(action.id)}" ${selectedIds.has(action.id) ? "disabled" : ""}>
        ${selectedIds.has(action.id) ? "Added" : "Add"}
      </button>
    </article>
  `;
}

function groupTeachingActionsByArea(actions) {
  const groups = new Map();
  actions.forEach((action) => {
    const area = teachingActionAreaLabel(action.area || "Other Teaching Actions");
    if (!groups.has(area)) groups.set(area, []);
    groups.get(area).push(action);
  });
  return [...groups.entries()].sort(([areaA], [areaB]) => teachingAreaSortIndex(areaA) - teachingAreaSortIndex(areaB) || areaA.localeCompare(areaB));
}

function teachingActionAreaExpanded(area) {
  return Boolean(state.collapsedCategories[`teachingActionArea:${area}`]);
}

function clearTeachingActionAreaExpansion() {
  Object.keys(state.collapsedCategories)
    .filter((categoryKey) => categoryKey.startsWith("teachingActionArea:"))
    .forEach((categoryKey) => {
      delete state.collapsedCategories[categoryKey];
    });
}

function openTeachingActionArea(groups) {
  if (!groups.length) return "";
  const expanded = groups.find(([area]) => teachingActionAreaExpanded(area));
  return expanded?.[0] || "";
}

function teachingActionAreaLabel(area) {
  return teachingAreaDisplayLabels[area] || area;
}

function teachingAreaSortIndex(area) {
  const index = teachingAreaOrder.indexOf(area);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function renderTeachingActionDetail(action, selected = false) {
  return `
    <div class="activity-action-detail-backdrop">
      <div class="activity-action-detail" role="dialog" aria-label="${escapeAttr(action.title)}">
        <div class="activity-action-detail-controls">
          ${selected
            ? `<button class="activity-action-remove" type="button" data-action-id="${escapeAttr(action.id)}" aria-label="Remove teaching action">Delete</button>`
            : `<button class="activity-action-detail-add" type="button" data-action-id="${escapeAttr(action.id)}">Add</button>`}
          <button class="activity-action-detail-close" type="button" aria-label="Return to activity">✓</button>
        </div>
        <div class="activity-action-detail-head">
          <div>
            <div class="lesson-flow-label">Teaching Action</div>
            <h4>${escapeHtml(action.title)}</h4>
          </div>
        </div>
        <p>${escapeHtml(action.description)}</p>
        <div class="activity-action-meta">
          ${action.area ? `<span>Area: ${escapeHtml(teachingActionAreaLabel(action.area))}</span>` : ""}
          ${action.pedagogies.length ? `<span>Pedagogy: ${escapeHtml(action.pedagogies.join(", "))}</span>` : ""}
          <span>Useful in: ${escapeHtml(action.activityTypes.join(", "))}</span>
        </div>
      </div>
    </div>
  `;
}

function teachingActionsForActivity(step, lesson, search = "") {
  const selectedPedagogies = selectedLessonPedagogies(lesson);
  return teachingActionLibrary
    .map((action) => ({
      action,
      score: teachingActionSuggestionScore(action, step, selectedPedagogies, search),
    }))
    .filter((entry) => entry.score > -100)
    .sort((a, b) => b.score - a.score || a.action.title.localeCompare(b.action.title))
    .map((entry) => ({
      action: entry.action,
      suggested: entry.score >= 20,
    }));
}

function teachingActionSuggestionScore(action, step, selectedPedagogies, search) {
  const searchable = [
    action.title,
    action.description,
    action.area || "",
    ...action.pedagogies,
    ...action.activityTypes,
    ...(action.keywords || []),
  ].join(" ").toLowerCase();
  if (search && !searchable.includes(search)) return -100;
  const stepType = isReflectionCheckpoint(step) ? "Reflect" : step.type;
  let score = search ? 5 : 0;
  if (action.activityTypes.includes(stepType)) score += 20;
  const pedagogyMatches = action.pedagogies.filter((pedagogy) => selectedPedagogies.has(pedagogy)).length;
  score += pedagogyMatches * 12;
  if (!search && score === 0) score = 1;
  return score;
}

function selectedLessonPedagogies(lesson) {
  return new Set(
    (lesson?.boardCards || [])
      .filter((card) => card.type === "pedagogy")
      .map((card) => card.label),
  );
}

function bindTeachingActionControls(scope, lesson, step) {
  scope.querySelector(".activity-action-picker-toggle")?.addEventListener("click", () => {
    const isOpen = state.activeTeachingActionPickerStepId === step.id;
    state.activeTeachingActionPickerStepId = isOpen ? "" : step.id;
    state.activeTeachingActionDetailStepId = "";
    state.activeTeachingActionDetailId = "";
    state.teachingActionSearch = "";
    state.showAllTeachingActions = false;
    clearTeachingActionAreaExpansion();
    renderLessonSteps(lesson);
  });
  scope.querySelector(".activity-action-browse-toggle")?.addEventListener("click", () => {
    const nextOpen = !state.showAllTeachingActions;
    state.showAllTeachingActions = nextOpen;
    clearTeachingActionAreaExpansion();
    renderLessonSteps(lesson);
  });
  scope.querySelectorAll(".activity-action-area-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const area = button.dataset.area;
      const key = `teachingActionArea:${area}`;
      const alreadyOpen = Boolean(state.collapsedCategories[key]);
      clearTeachingActionAreaExpansion();
      if (!alreadyOpen) {
        state.collapsedCategories[key] = true;
      }
      renderLessonSteps(lesson);
      if (!alreadyOpen) {
        focusTeachingActionArea(step.id, area);
      }
    });
  });
  scope.querySelector(".activity-action-search")?.addEventListener("input", (event) => {
    state.teachingActionSearch = event.target.value;
    renderLessonSteps(lesson);
    const nextSearch = els.lessonSteps.querySelector(`.lesson-step-card[data-step-id="${CSS.escape(step.id)}"] .activity-action-search`);
    nextSearch?.focus();
    if (nextSearch) nextSearch.selectionStart = nextSearch.selectionEnd = nextSearch.value.length;
  });
  scope.querySelectorAll(".activity-action-option").forEach((card) => {
    const openPreview = (event) => {
      if (event.target.closest(".activity-action-add")) return;
      state.activeTeachingActionDetailStepId = step.id;
      state.activeTeachingActionDetailId = card.dataset.actionId;
      renderLessonSteps(lesson);
    };
    card.addEventListener("click", openPreview);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openPreview(event);
    });
  });
  scope.querySelectorAll(".activity-action-add").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addTeachingActionToStep(step, button.dataset.actionId);
      state.activeTeachingActionDetailStepId = "";
      state.activeTeachingActionDetailId = "";
      saveState();
      renderLessonSteps(lesson);
    });
  });
  scope.querySelectorAll(".activity-action-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTeachingActionDetailStepId = step.id;
      state.activeTeachingActionDetailId = button.dataset.actionId;
      state.activeTeachingActionPickerStepId = "";
      renderLessonSteps(lesson);
    });
  });
  scope.querySelector(".activity-action-detail-backdrop")?.addEventListener("click", (event) => {
    if (!event.target.classList.contains("activity-action-detail-backdrop")) return;
    state.activeTeachingActionDetailStepId = "";
    state.activeTeachingActionDetailId = "";
    renderLessonSteps(lesson);
  });
  scope.querySelector(".activity-action-detail-close")?.addEventListener("click", () => {
    state.activeTeachingActionDetailStepId = "";
    state.activeTeachingActionDetailId = "";
    renderLessonSteps(lesson);
  });
  scope.querySelector(".activity-action-detail-add")?.addEventListener("click", (event) => {
    addTeachingActionToStep(step, event.currentTarget.dataset.actionId);
    state.activeTeachingActionDetailStepId = "";
    state.activeTeachingActionDetailId = "";
    saveState();
    renderLessonSteps(lesson);
  });
  scope.querySelector(".activity-action-remove")?.addEventListener("click", (event) => {
    removeTeachingActionFromStep(step, event.currentTarget.dataset.actionId);
    state.activeTeachingActionDetailStepId = "";
    state.activeTeachingActionDetailId = "";
    saveState();
    renderLessonSteps(lesson);
  });
}

function focusTeachingActionArea(stepId, area) {
  window.requestAnimationFrame(() => {
    const stepNode = els.lessonSteps?.querySelector(`.lesson-step-card[data-step-id="${CSS.escape(stepId)}"]`);
    const areaNode = stepNode
      ?.querySelector(`.activity-action-area-toggle[data-area="${CSS.escape(area)}"]`)
      ?.closest(".activity-action-area");
    areaNode?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}

function addTeachingActionToStep(step, actionId) {
  const metadata = teachingActionById(actionId);
  if (!metadata) return;
  step.teachingActions = normalizeTeachingActions(step.teachingActions || []);
  if (step.teachingActions.some((selection) => selection.id === metadata.id)) return;
  step.teachingActions.push({ id: metadata.id, title: metadata.title });
}

function removeTeachingActionFromStep(step, actionId) {
  step.teachingActions = (step.teachingActions || []).filter((selection) => selection.id !== actionId);
}

function bindLessonActivityDragReorder(node, lesson, step) {
  node.addEventListener("dragstart", (event) => {
    const interactiveTarget = event.target.closest("button, input, textarea, select");
    if (interactiveTarget && interactiveTarget !== node) {
      event.preventDefault();
      return;
    }
    dragPayload = { kind: "lessonActivityReorder", lessonId: lesson.id, stepId: step.id };
    event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
    event.dataTransfer.setData("application/json", JSON.stringify(dragPayload));
    event.dataTransfer.effectAllowed = "move";
    node.classList.add("dragging");
  });
  node.addEventListener("dragover", (event) => {
    const payload = readDragPayload(event);
    if (payload?.kind !== "lessonActivityReorder" || payload.lessonId !== lesson.id || payload.stepId === step.id) return;
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
    if (payload?.kind !== "lessonActivityReorder" || payload.lessonId !== lesson.id || payload.stepId === step.id) return;
    event.preventDefault();
    reorderLessonActivityRelative(lesson, payload.stepId, step.id, position);
  });
  node.addEventListener("dragend", () => {
    node.classList.remove("dragging", "lesson-drop-target", "drop-before", "drop-after");
    dragPayload = null;
  });
}

function moveLessonActivity(lesson, index, direction) {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (!lesson.steps || targetIndex < 0 || targetIndex >= lesson.steps.length) return;
  const [step] = lesson.steps.splice(index, 1);
  lesson.steps.splice(targetIndex, 0, step);
  saveState();
  render();
}

function reorderLessonActivityRelative(lesson, movingStepId, targetStepId, position = "before") {
  if (!lesson?.steps?.length) return;
  const from = lesson.steps.findIndex((step) => step.id === movingStepId);
  let to = lesson.steps.findIndex((step) => step.id === targetStepId);
  if (from < 0 || to < 0 || from === to) return;
  if (position === "after") to += 1;
  const [step] = lesson.steps.splice(from, 1);
  if (from < to) to -= 1;
  lesson.steps.splice(to, 0, step);
  saveState();
  render();
}

function isReflectionCheckpoint(step) {
  return step?.kind === "reflectionCheckpoint" || step?.type === "Reflection Checkpoint";
}

function lessonActivityEditContent(step) {
  if (isReflectionCheckpoint(step)) return reflectionCheckpointEditContent(step);
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

function reflectionCheckpointEditContent(step) {
  return `
    <div class="lesson-activity-grid reflection-checkpoint-grid">
      <div>
        <span class="field-label">Duration</span>
        <div class="checkpoint-duration-text">5 minutes</div>
      </div>
      <label>
        <span class="field-label">Purpose</span>
        <select class="text-input checkpoint-purpose" aria-label="Reflection checkpoint purpose">
          ${reflectionCheckpointPurposes.map((purpose) => `<option value="${escapeAttr(purpose)}" ${step.reflectionPurpose === purpose ? "selected" : ""}>${escapeHtml(purpose)}</option>`).join("")}
        </select>
      </label>
      <label>
        <span class="field-label">Reflection Prompt</span>
        <textarea class="text-area checkpoint-prompt" rows="2" aria-label="Reflection prompt">${escapeHtml(step.reflectionPrompt || step.description || "")}</textarea>
      </label>
    </div>
  `;
}

function lessonActivityDisplayContent(step) {
  if (isReflectionCheckpoint(step)) return reflectionCheckpointDisplayContent(step);
  return `
    <div class="lesson-flow-content">
      <div class="lesson-flow-main">
        <div class="lesson-flow-label">Activity details</div>
        <div class="lesson-flow-text">${renderTeacherText(step.description || "Not set", { fallback: "Not set" })}</div>
      </div>
      <aside class="lesson-flow-side">
        <div class="lesson-flow-label">Evidence</div>
        <div class="lesson-flow-text">${renderTeacherText(step.evidence || "Not set", { fallback: "Not set" })}</div>
      </aside>
    </div>
  `;
}

function reflectionCheckpointDisplayContent(step) {
  return `
    <div class="lesson-flow-content reflection-flow-content">
      <div class="lesson-flow-main">
        <div class="lesson-flow-label">Reflection prompt</div>
        <div class="lesson-flow-text">${renderTeacherText(step.reflectionPrompt || step.description || "Not set", { fallback: "Not set" })}</div>
      </div>
      <aside class="lesson-flow-side">
        <div class="lesson-flow-label">Purpose</div>
        <div class="lesson-flow-text">${escapeHtml(step.reflectionPurpose || step.evidence || "Curricular goal")}</div>
      </aside>
    </div>
  `;
}

function lessonActivitySummaryHtml(step, index) {
  return `
    <div class="lap-step-summary">
      <strong>${index + 1}. ${escapeHtml(step.type || "Activity")}${step.duration ? ` · ${escapeHtml(step.duration)} min` : ""}</strong>
      ${renderTeacherText(step.description || "No activity detail", { fallback: "No activity detail" })}
      ${step.evidence ? `<span>Evidence:</span>${renderTeacherText(step.evidence)}` : ""}
    </div>
  `;
}

function lessonActivitySummaryText(step) {
  const parts = [isReflectionCheckpoint(step) ? "Reflection Checkpoint" : step.type || "Activity"];
  if (isReflectionCheckpoint(step)) {
    parts.push("5 min");
    parts.push(`Purpose: ${step.reflectionPurpose || step.evidence || "Curricular goal"}`);
    if (step.reflectionPrompt || step.description) parts.push(step.reflectionPrompt || step.description);
    return parts.join(" - ");
  }
  if (step.duration) parts.push(`${step.duration} min`);
  if (step.description) parts.push(step.description);
  if (step.evidence) parts.push(`Evidence: ${step.evidence}`);
  return parts.join(" - ");
}

function lessonActivityCount(lesson) {
  return (lesson.steps || []).filter((step) => !isReflectionCheckpoint(step)).length;
}

function lessonCheckpointCount(lesson) {
  return (lesson.steps || []).filter(isReflectionCheckpoint).length;
}

function lessonEvidenceSummary(lesson) {
  const evidence = (lesson.steps || [])
    .map((step) => step.evidence)
    .filter((value) => value && value !== "None" && value !== "Curricular goal" && value !== "21CC learning goals");
  return uniqueReadableValues(evidence).slice(0, 2).join("; ");
}

function lessonCountLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
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
  const activityCount = lessonActivityCount(lesson);
  const checkpointCount = lessonCheckpointCount(lesson);
  const evidence = lessonEvidenceSummary(lesson);
  const meta = [
    lessonDurationMinutes(lesson) ? lessonDurationLabel(lesson) : "",
    activityCount ? lessonCountLabel(activityCount, "activity", "activities") : "",
    checkpointCount ? lessonCountLabel(checkpointCount, "reflection checkpoint") : "",
    evidence ? `Evidence: ${evidence}` : "",
  ].filter(Boolean);
  return `
    <div class="lesson-display-structures">
      ${structures.length ? structures.map((label) => `<span class="lesson-display-chip">${escapeHtml(label)}</span>`).join("") : `<span class="lesson-display-empty">No structure selected</span>`}
    </div>
    <div class="lesson-display-details">${escapeHtml(lesson.description || lesson.details || "No lesson description added")}</div>
    ${meta.length ? `<div class="lesson-display-meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}
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

function dismissLessonSuggestion(lesson, suggestion) {
  lesson.dismissedSuggestions = lesson.dismissedSuggestions || [];
  addUnique(lesson.dismissedSuggestions, suggestion.key);
  addUnique(lesson.dismissedSuggestions, suggestion.groupKey);
  lesson.suggestionVersion = SUGGESTION_VERSION;
}

function suggestionHeader(type) {
  const labels = {
    artisticProcesses: "Suggested Artistic Process",
    learningOutcomes: "Suggested Learning Outcome",
    cc21: "Suggested 21CC Outcome",
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
    ...currentArtisticProcessValues(unit.learningContent?.artisticProcessCards || []),
    ...(unit.boardCards || []).filter((card) => card.type === "artisticProcesses").map((card) => card.label),
  ].filter((value) => !deprecatedArtisticProcessCards.has(value)));
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
    teachingMoves: "Teaching Action",
    assessment: "Assessment",
    pedagogy: "Pedagogy",
    cc21: "21CC",
    cc21Goals: "21CC Lesson Goal",
  };
  return labels[type] || "Card";
}

function addBoardCard(unit, payload, point) {
  const normalizedPayload = {
    ...payload,
    label: normalizePlanningLabel(payload.label || "", payload.type),
  };
  const requestedZone = point?.zone || zoneForType(payload.type);
  const zone = zoneAllowsType(requestedZone, normalizedPayload.type) ? requestedZone : zoneForType(normalizedPayload.type);
  const incomingKey = cardKey(normalizedPayload);
  if (!allowsDuplicateBoardCard(normalizedPayload.type, normalizedPayload.label) && unit.boardCards.some((card) => cardKey(card) === incomingKey)) {
    const existing = unit.boardCards.find((card) => cardKey(card) === incomingKey);
    if (normalizedPayload.type === "coreExperiences") {
      addLibraryItemToUnit(unit, normalizedPayload, { silent: true });
      saveState();
      render();
      return;
    }
    existing.label = normalizedPayload.label;
    existing.lessonOrigin = false;
    existing.sourceLessonIds = [];
    existing.zone = zone;
    existing.order = nextBoardOrder(unit, zone);
    syncUnitCardToLessons(unit, existing);
    saveState();
    render();
    return;
  }
  const card = {
    id: uid("card"),
    type: normalizedPayload.type,
    label: normalizedPayload.label,
    zone,
    order: nextBoardOrder(unit, zone),
    value: defaultTextCardValue(unit, normalizedPayload),
    confirmed: Boolean(defaultTextCardValue(unit, normalizedPayload)),
    purpose: defaultPurpose(normalizedPayload),
  };
  unit.boardCards.push(card);
  addLibraryItemToUnit(unit, normalizedPayload, { silent: true });
  syncUnitCardToLessons(unit, card);
  saveState();
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
  saveState();
}

function addLessonBoardCard(unit, lesson, payload, options = {}) {
  if (!lesson || !payload) return;
  const normalizedPayload = {
    ...payload,
    label: normalizePlanningLabel(payload.label || "", payload.type),
  };
  if (!cardAllowedOnLessonBoard(normalizedPayload)) return;
  const requestedZone = options.zone || lessonZoneForType(normalizedPayload.type);
  const zone = lessonZoneAllowsType(requestedZone, normalizedPayload.type) ? requestedZone : lessonZoneForType(normalizedPayload.type);
  const syncToUnit = !lessonOnlyCardTypes.has(normalizedPayload.type);
  const unitCard = syncToUnit ? ensureUnitHasCard(unit, normalizedPayload, { source: "lesson", sourceLessonId: lesson.id }) : null;
  const inheritedFromUnit = Boolean(unitCard && !unitCard.lessonOrigin);
  const incomingKey = cardKey(normalizedPayload);
  const existing = lesson.boardCards.find((card) => cardKey(card) === incomingKey);
  if (existing && !allowsDuplicateBoardCard(normalizedPayload.type, normalizedPayload.label)) {
    existing.label = normalizedPayload.label;
    existing.zone = zone;
    existing.inherited = inheritedFromUnit;
    existing.unitCardKey = inheritedFromUnit ? cardKey(unitCard) : "";
    existing.order = nextLessonCardOrder(lesson, zone);
    saveState();
    render();
    return;
  }
  lesson.boardCards.push({
    id: uid("lesson-card"),
    type: normalizedPayload.type,
    label: normalizedPayload.label,
    zone,
    order: nextLessonCardOrder(lesson, zone),
    inherited: inheritedFromUnit,
    unitCardKey: inheritedFromUnit ? cardKey(unitCard) : "",
  });
  saveState();
  render();
}

function ensureUnitHasCard(unit, payload, options = {}) {
  if (!unit || !payload) return null;
  const normalizedPayload = {
    ...payload,
    label: normalizePlanningLabel(payload.label || "", payload.type),
  };
  const incomingKey = cardKey(normalizedPayload);
  const existing = unit.boardCards.find((card) => cardKey(card) === incomingKey);
  if (existing && !allowsDuplicateBoardCard(normalizedPayload.type, normalizedPayload.label)) {
    existing.label = normalizedPayload.label;
    if (options.source === "lesson" && existing.lessonOrigin && options.sourceLessonId) {
      existing.sourceLessonIds = existing.sourceLessonIds || [];
      addUnique(existing.sourceLessonIds, options.sourceLessonId);
    }
    return existing;
  }
  const zone = zoneForType(normalizedPayload.type);
  const card = {
    id: uid("card"),
    type: normalizedPayload.type,
    label: normalizedPayload.label,
    zone,
    order: nextBoardOrder(unit, zone),
    value: defaultTextCardValue(unit, normalizedPayload),
    confirmed: Boolean(defaultTextCardValue(unit, normalizedPayload)),
    purpose: defaultPurpose(normalizedPayload),
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
  if (!cardAllowedOnLessonBoard(unitCard)) return;
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
      const label = normalizePlanningLabel(card.label, card.type);
      const key = allowsDuplicateBoardCard(card.type, label) ? `${card.id}:${card.type}:${label}` : `${card.type}:${label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((card, index) => ({
      ...card,
      label: normalizePlanningLabel(card.label, card.type),
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
      const label = normalizePlanningLabel(card.label, card.type);
      const key = allowsDuplicateBoardCard(card.type, label) ? card.unitCardKey || `${card.id}:${card.type}:${label}` : `${card.type}:${label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((card, index) => ({
      id: card.id || uid("lesson-card"),
      type: card.type,
      label: normalizePlanningLabel(card.label, card.type),
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
    cc21Goals: "curricular",
    pedagogy: "pedagogy",
    teachingMoves: "pedagogy",
    assessment: "assessment",
    media: "content",
    context: "content",
    artisticProcesses: "content",
    visualQualities: "content",
    visualQualityText: "content",
    coreExperiences: "core",
  };
  return zones[type] || "content";
}

function cardAllowedOnLessonBoard(card) {
  return Boolean(card && lessonZoneAllowsType(lessonZoneForType(card.type), card.type));
}

function lessonZoneDefinitions() {
  return [
    { key: "curricular", label: "Curricular Goals" },
    { key: "pedagogy", label: "Pedagogy" },
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
    curricular: ["learningOutcomes", "cc21", "cc21Goals"],
    pedagogy: ["pedagogy", "teachingMoves"],
    assessment: ["assessment"],
    content: ["media", "context", "artisticProcesses", "visualQualities", "visualQualityText"],
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
  const cardValues = sortedPlanningCards(unit.boardCards || [], {
    zoneForType,
    typeOrder: unitCardTypeOrder(),
  })
    .filter((card) => card.type === "meaningText" && card.label === "Guiding Question" && card.value?.trim())
    .map((card) => card.value.trim());
  if (cardValues.length) return cardValues;
  return sortedReadableValues((unit.guidingQuestions || []).filter(Boolean), "meaningText");
}

function guidingQuestionSummary(unit) {
  return guidingQuestionValues(unit).join("; ") || unit.guidingQuestion || "";
}

function nextBoardOrder(unit, zone) {
  const zoneCards = unit.boardCards.filter((card) => (card.zone || zoneForType(card.type)) === zone);
  return zoneCards.length ? Math.max(...zoneCards.map((card) => card.order || 0)) + 1 : 1;
}

function nextLessonCardOrder(lesson, zone) {
  const zoneCards = lesson.boardCards.filter((card) => cardAllowedOnLessonBoard(card) && (card.zone || lessonZoneForType(card.type)) === zone);
  return zoneCards.length ? Math.max(...zoneCards.map((card) => card.order || 0)) + 1 : 1;
}

function arrangeUnitBoardCards(unit) {
  if (!unit) return;
  arrangePlanningCards(unit.boardCards || [], {
    zoneForType,
    zoneAllowsType,
    typeOrder: unitCardTypeOrder(),
  });
}

function arrangeLessonBoardCards(lesson) {
  if (!lesson) return;
  lesson.boardCards = (lesson.boardCards || []).filter(cardAllowedOnLessonBoard);
  arrangePlanningCards(lesson.boardCards, {
    zoneForType: lessonZoneForType,
    zoneAllowsType: lessonZoneAllowsType,
    typeOrder: lessonCardTypeOrder(),
  });
}

function unitCardTypeOrder() {
  return [
    "bigIdeas",
    "meaningText",
    "media",
    "context",
    "artisticProcesses",
    "visualQualities",
    "visualQualityText",
    "coreExperiences",
    "learningOutcomes",
    "cc21",
    "pedagogy",
    "assessment",
  ];
}

function lessonCardTypeOrder() {
  return [
    "learningOutcomes",
    "cc21",
    "cc21Goals",
    "media",
    "context",
    "artisticProcesses",
    "visualQualities",
    "visualQualityText",
    "coreExperiences",
    "pedagogy",
    "teachingMoves",
    "assessment",
  ];
}

function arrangePlanningCards(cards, options) {
  cards.forEach((card) => {
    const homeZone = options.zoneForType(card.type);
    card.zone = options.zoneAllowsType(homeZone, card.type) ? homeZone : card.zone;
  });
  const zones = [...new Set(cards.map((card) => card.zone || options.zoneForType(card.type)))];
  zones.forEach((zone) => {
    sortedPlanningCards(cards.filter((card) => (card.zone || options.zoneForType(card.type)) === zone), options)
      .forEach((card, index) => {
        card.order = index + 1;
      });
  });
}

function sortedPlanningCards(cards, options) {
  const typeRank = new Map((options.typeOrder || []).map((type, index) => [type, index]));
  return [...cards].sort((a, b) => {
    const zoneDelta = compareNatural(options.zoneForType(a.type), options.zoneForType(b.type));
    if (!options.ignoreZone && zoneDelta) return zoneDelta;
    const typeDelta = (typeRank.get(a.type) ?? 99) - (typeRank.get(b.type) ?? 99);
    if (typeDelta) return typeDelta;
    return compareNatural(readableCardValue(a) || a.label || "", readableCardValue(b) || b.label || "");
  });
}

function sortedReadableValues(values, type) {
  const filtered = (values || []).filter(Boolean);
  if (type === "learningOutcomes") return sortLearningOutcomes(filtered);
  return [...filtered].sort(compareNatural);
}

function compareNatural(a, b) {
  return naturalSortCollator.compare(String(a || ""), String(b || ""));
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
  const movedPixels = Math.hypot(event.clientX - timelineDrag.startX, event.clientY - timelineDrag.startY);
  if (movedPixels < 6 && !timelineDrag.moved) return;
  timelineDrag.moved = true;
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
  if (unit) {
    state.selectedUnitId = unit.id;
    if (timelineDrag.moved) packTimelineYear(timelineYearForStart(unit.start));
    if (!timelineDrag.moved) {
      const now = Date.now();
      const isDoubleClick = timelineClick.unitId === unit.id && now - timelineClick.at < 420;
      timelineClick = { unitId: unit.id, at: now };
      if (isDoubleClick) {
        state.unitOverviewOpen = false;
        state.currentScreen = "board";
        timelineClick = { unitId: "", at: 0 };
      }
    }
  }
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
      ${renderPlanningAttention(timelineUnits)}
      <div class="analysis-grid">
        ${renderDistributionGroup("Big Ideas", timelineUnits, "bigIdeas", libraryItemsByType("bigIdeas"))}
        ${renderIncidenceGroup("Learning Outcomes", timelineUnits, "learningOutcomes", libraryItemsByType("learningOutcomes"), { source: "lesson" })}
        ${renderIncidenceGroup("21CC Emphasis", timelineUnits, "cc21", libraryItemsByType("cc21"), { source: "lesson" })}
        ${renderIncidenceGroup("21CC Learning Goals", timelineUnits, "cc21Goals", cc21LessonGoals.map((goal) => goal.label), { source: "lesson", collapsible: true })}
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
  const notPlannedCount = rows.filter((row) => !row.unitCount).length;
  const coveredCount = rows.length - notPlannedCount;
  if (!rows.length) {
    return `
      <article class="analysis-card">
        <h4>${escapeHtml(title)}</h4>
        <p class="not-planned">Not yet planned</p>
      </article>
    `;
  }
  const maxTotal = Math.max(1, ...rows.map((row) => lessonBased ? row.lessonCount : row.weeks));
  const content = `
    <div class="analysis-card-summary">
      <span>${coveredCount}/${rows.length} covered</span>
      ${notPlannedCount ? `<strong>${notPlannedCount} need attention</strong>` : `<strong>Balanced coverage</strong>`}
    </div>
    <div class="analysis-list ${options.collapsible ? "compact-analysis-list" : ""}">
      ${rows.map((row) => `
        <div class="analysis-row ${row.unitCount ? "" : "empty"}">
          <div class="analysis-row-main">
            <span>${formatIncidenceLabel(row.label, type)}</span>
            <small>${incidenceRowMeta(row, lessonBased)}</small>
          </div>
          <div class="analysis-row-status">
            <span class="coverage-pill ${coverageClass(row, lessonBased)}">${coverageLabel(row, lessonBased)}</span>
            ${row.unitCount ? `<div class="analysis-bar" aria-hidden="true"><span style="width: ${Math.max(8, ((lessonBased ? row.lessonCount : row.weeks) / maxTotal) * 100)}%"></span></div>` : ""}
          </div>
        </div>
      `).join("")}
    </div>
  `;
  if (options.collapsible) {
    return `
      <article class="analysis-card analysis-card-collapsible">
        <details>
          <summary>
            <span>${escapeHtml(title)}</span>
            <small>${coveredCount}/${rows.length} covered</small>
          </summary>
          ${content}
        </details>
      </article>
    `;
  }
  return `
    <article class="analysis-card">
      <h4>${escapeHtml(title)}</h4>
      ${content}
    </article>
  `;
}

function renderDistributionGroup(title, units, type, expectedValues = []) {
  const rows = incidenceRows(units, type, expectedValues);
  const activeRows = rows.filter((row) => row.unitCount);
  const totalWeeks = activeRows.reduce((total, row) => total + row.weeks, 0);
  const colors = ["#2f6f73", "#d49a2a", "#b5493a", "#7a5b9a", "#4d5f91"];
  let cursor = 0;
  const stops = activeRows.map((row, index) => {
    const start = cursor;
    const end = totalWeeks ? cursor + (row.weeks / totalWeeks) * 100 : cursor;
    cursor = end;
    return `${colors[index % colors.length]} ${start}% ${end}%`;
  });
  return `
    <article class="analysis-card distribution-analysis-card">
      <h4>${escapeHtml(title)}</h4>
      ${activeRows.length ? `
        <div class="distribution-layout">
          <div>
            <div class="distribution-donut" style="background: conic-gradient(${stops.join(", ")});" aria-hidden="true">
              <span>${activeRows.length}/${rows.length}</span>
            </div>
            <small class="distribution-caption">ideas used</small>
          </div>
          <div class="analysis-list">
            ${rows.map((row, index) => `
              <div class="analysis-row ${row.unitCount ? "" : "empty"}">
                <div class="analysis-row-main">
                  <span><i class="analysis-swatch" style="background:${colors[index % colors.length]}"></i>${escapeHtml(row.label)}</span>
                  <small>${incidenceRowMeta(row, false)}</small>
                </div>
                <span class="coverage-pill ${coverageClass(row, false)}">${coverageLabel(row, false)}</span>
              </div>
            `).join("")}
          </div>
        </div>
      ` : `<p class="not-planned">Not yet planned</p>`}
    </article>
  `;
}

function renderPlanningAttention(units) {
  const checks = [
    ["Big Ideas", incidenceRows(units, "bigIdeas", libraryItemsByType("bigIdeas"))],
    ["Learning Outcomes", lessonIncidenceRows(units, "learningOutcomes", libraryItemsByType("learningOutcomes"))],
    ["21CC Emphasis", lessonIncidenceRows(units, "cc21", libraryItemsByType("cc21"))],
    ["21CC Learning Goals", lessonIncidenceRows(units, "cc21Goals", cc21LessonGoals.map((goal) => goal.label))],
  ];
  const items = checks
    .map(([label, rows]) => {
      const notPlanned = rows.filter((row) => !row.unitCount).length;
      return notPlanned ? `${notPlanned} ${label} not yet planned` : "";
    })
    .filter(Boolean);
  if (!items.length) return `<div class="attention-strip settled">All tracked areas have some coverage.</div>`;
  return `
    <div class="attention-strip">
      <strong>Needs attention</strong>
      ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
}

function formatIncidenceLabel(label, type) {
  const match = label.match(/^([A-Z]+ ?\d+|LO\d+):\s*(.+)$/);
  if (!match) return escapeHtml(label);
  return `<strong>${escapeHtml(match[1])}</strong> ${escapeHtml(match[2])}`;
}

function coverageLabel(row, lessonBased) {
  if (!row.unitCount) return "Not planned";
  const count = lessonBased ? row.lessonCount : row.weeks;
  if (count <= 2) return "Low";
  return "Covered";
}

function coverageClass(row, lessonBased) {
  if (!row.unitCount) return "empty";
  const count = lessonBased ? row.lessonCount : row.weeks;
  if (count <= 2) return "low";
  return "covered";
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
  value = normalizePlanningLabel(value, type);
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
  planCatalogVerified = true;
  activePlanRevision = 0;
  savePlanToCatalog(state.plan);
  localStorage.setItem(planStateStorageKey(), JSON.stringify(state));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(lastGoodPlanStateStorageKey(), JSON.stringify(cleanCloudState(state)));
  lastPersistedContentHash = planStateContentHash(state);
  if (cloud.loaded) await acquireEditingLock({ force: true });
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

els.workspaceHome?.addEventListener("click", async () => {
  await persistCurrentPlanBeforeSwitch();
  await releaseEditingLock();
  state.currentScreen = "workspace";
  workspaceDirectoryWorkspaceId = "";
  render();
});

els.recoveryTrash?.addEventListener("click", openTrashView);

els.recoveryClose?.addEventListener("click", closeRecoveryModal);

els.recoveryModal?.addEventListener("click", (event) => {
  if (event.target !== els.recoveryModal) return;
  closeRecoveryModal();
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
    if (card && cardAllowedOnLessonBoard(card)) {
      const zone = lessonZoneAllowsType(targetZone, card.type) ? targetZone : lessonZoneForType(card.type);
      card.zone = zone;
      card.order = nextLessonCardOrder(lesson, zone);
      render();
    }
    return;
  }
  if (payload.kind === "boardCard") return;
  if (!cardAllowedOnLessonBoard(payload)) return;
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
  if (!unit || !canEditActivePlan()) return;
  arrangeUnitBoardCards(unit);
  saveState();
  render();
});

els.overviewUnit.addEventListener("click", () => {
  const unit = selectedUnit();
  if (!unit) return;
  state.unitOverviewOpen = true;
  render();
});

els.clearBoard.addEventListener("click", async () => {
  const unit = selectedUnit();
  if (!unit) return;
  const confirmed = window.confirm("Clear all cards on this unit board? A recovery snapshot will be created first.");
  if (!confirmed) return;
  await createPlanSnapshot("before-clear", state);
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

els.saveUnit.addEventListener("click", async () => {
  const unit = selectedUnit();
  if (!unit) return;
  boardHeaderEditing = { title: false, performanceTask: false };
  renderUnitList();
  renderUnits();
  renderBoard();
  await commitPlanSaveNow({
    statusElement: els.saveStatus,
    buttons: [els.saveUnit],
    successMessage: "Saved online",
  });
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

async function saveCurrentLesson() {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.confirmed = true;
  state.lessonOverviewOpen = false;
  render();
  await commitPlanSaveNow({
    statusElement: els.lessonSaveStatus,
    statusElements: [els.lessonTopSaveStatus],
    buttons: [els.confirmLessonBoard, els.saveLessonBottom],
    successMessage: "Lesson saved online",
  });
}

els.confirmLessonBoard.addEventListener("click", saveCurrentLesson);

els.saveLessonBottom.addEventListener("click", saveCurrentLesson);

els.arrangeLessonBoard.addEventListener("click", () => {
  const unit = selectedUnit();
  const lesson = selectedLesson(unit);
  if (!lesson || !canEditActivePlan()) return;
  arrangeLessonBoardCards(lesson);
  saveState();
  render();
});

els.editLessonBoard.addEventListener("click", () => {
  const lesson = selectedLesson();
  if (!lesson) return;
  state.lessonOverviewOpen = !state.lessonOverviewOpen;
  render();
});

els.chooseLessonImage.addEventListener("click", () => {
  els.lessonImageUpload.click();
});

els.lessonImageUpload.addEventListener("change", async (event) => {
  const lesson = selectedLesson();
  const file = event.target.files?.[0];
  if (!lesson || !file) return;
  const previousPath = lesson.imagePath || "";
  renderCloudStatus("Uploading image to cloud...", cloud.user ? "Sign out" : "Sign in", true);
  setLessonImageStatus(lesson, "Checking cloud image upload...", "uploading");
  try {
    verifyCloudImageUploadReady();
    setLessonImageStatus(lesson, "Compressing image for cloud upload...", "uploading");
    const dataUrl = await compressImageFile(file);
    setLessonImageStatus(lesson, "Uploading image to cloud...", "uploading");
    const uploaded = await uploadLessonImageDataUrl(lesson, file, dataUrl);
    lesson.imageUrl = uploaded.downloadUrl;
    lesson.imagePath = uploaded.path;
    lesson.imageDataUrl = "";
    lesson.imageName = file.name;
    lesson.imageSaveNotice = `Image uploaded online (${uploaded.sizeLabel}).`;
    setLessonImageStatus(lesson, "Saving image link to lesson...", "uploading");
    saveState();
    const savedOnline = await saveCloudStateNow();
    if (previousPath && previousPath !== uploaded.path) {
      deleteCloudStoragePath(previousPath);
    }
    const message = savedOnline
      ? "Image uploaded and saved online."
      : "Image uploaded; lesson link saved locally, online retry pending.";
    lesson.imageUploadStatus = message;
    lesson.imageSaveNotice = message;
    render();
    setLessonImageStatus(lesson, message, savedOnline ? "success" : "error");
    renderCloudStatus(message, cloud.user ? "Sign out" : "Sign in");
  } catch (error) {
    console.warn("Image upload failed", error);
    const message = error?.message || "Image upload failed.";
    lesson.imageUploadStatus = message;
    lesson.imageSaveNotice = message;
    render();
    setLessonImageStatus(lesson, message, "error");
    renderCloudStatus(message, cloud.user ? "Sign out" : "Sign in");
  } finally {
    event.target.value = "";
  }
});

els.removeLessonImage.addEventListener("click", async () => {
  const lesson = selectedLesson();
  if (!lesson) return;
  const previousPath = lesson.imagePath || "";
  setLessonImageStatus(lesson, "Removing image...", "uploading");
  lesson.imageDataUrl = "";
  lesson.imageUrl = "";
  lesson.imagePath = "";
  lesson.imageName = "";
  lesson.imageSaveNotice = "Image removed.";
  lesson.imageUploadStatus = "Image removed.";
  saveState();
  if (previousPath) await deleteCloudStoragePath(previousPath);
  if (cloud.loaded) await saveCloudStateNow();
  render();
});

els.addLessonStep.addEventListener("click", () => {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.steps = lesson.steps || [];
  lesson.steps.push(createLessonStep());
  lesson.duration = lessonDurationLabel(lesson);
  saveState();
  render();
});

els.addReflectionCheckpoint.addEventListener("click", () => {
  const lesson = selectedLesson();
  if (!lesson) return;
  lesson.steps = lesson.steps || [];
  lesson.steps.push(createReflectionCheckpointStep());
  lesson.duration = lessonDurationLabel(lesson);
  saveState();
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
els.takeOverLock?.addEventListener("click", async () => {
  renderCloudStatus("Taking over editing...", "Sign out", true);
  await acquireEditingLock({ force: true });
  render();
});
els.loginGoogle?.addEventListener("click", toggleCloudAuth);
els.loginReset?.addEventListener("click", resetCloudSignIn);
els.cardDetailCancel?.addEventListener("click", closeCardDetail);
els.cardDetailInsert?.addEventListener("click", () => {
  const action = cardDetailInsertAction;
  closeCardDetail();
  if (action) action();
});
els.cardDetailModal?.addEventListener("click", (event) => {
  if (event.target === els.cardDetailModal) closeCardDetail();
});

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
lastPersistedContentHash = planStateContentHash(state);
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
