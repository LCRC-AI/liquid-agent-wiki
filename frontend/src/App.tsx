import { MouseEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PortalOverview } from "./PortalOverview";
import { PortalAppearance } from "./PortalAppearance";
import { currentLanguage, subscribeLanguage, t } from "./i18n";

function LiquidAgentMark({ className = "" }: { className?: string }) {
  return <img className={className} src="./liquid-agent-drop-logo-v3.png" alt="" aria-hidden="true" draggable={false} />;
}

const PORTAL_SAMPLE_RUNS = [
  {
    id: "fragmentomics",
    label: "Raw-signal fragmentomics",
    dataset: "GSE171434 cfDNA raw-signal tracks",
    status: "Real local example",
    sourceLabel: "GEO GSE171434",
    sourceHref: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE171434",
    sourceStatus: "Mounted public dataset",
    evidenceStatus: "Executed raw-signal run on a representative local bigWig track",
    launchHint: "Attach GSE171434/suppl; the agent selects a lightweight representative coverage track for first-pass raw-signal review.",
    inputShape: "BED.GZ fragment-center files plus bigWig signal tracks",
    validates: "Folder scan, raw-signal planning, bigWig ingestion, numeric signal summary, and PNG review figures",
    caveat: "The gallery run uses one representative bigWig track for responsiveness; full-cohort fragment-level analysis can be launched separately.",
    focus: "Raw cfDNA signal inspection",
    capabilities: ["bigWig raw signal", "browser tracks", "static review figures"],
    intent: "Run first-pass raw-signal review on a representative cfDNA signal track.",
    prompt: "Use GSE171434/suppl and run a first-pass raw-signal analysis with reviewable plots.",
    reply:
      "I detected BED.GZ fragment-center files and bigWig raw-signal tracks. For a responsive first pass, I will use the smallest representative bigWig track, summarize genome-wide signal, write a browser-track manifest, and generate reviewable PNG figures.",
    steps: ["scan folder", "select lightweight track", "summarize signal", "plot", "export track manifest"],
    artifacts: ["cfdna_raw_signal__sample_summary.csv", "cfdna_raw_signal__sample_bin_heatmap.png", "cfdna_raw_browser_tracks__manifest.csv"],
    report: [
      "The GSE171434 example contains 12 BED.GZ fragment-center files and 6 bigWig raw-signal tracks.",
      "The example used one 63 MB representative bigWig track and produced 512 genome-wide signal bins.",
      "Generated numeric signal summaries, PNG figures, and a browser-track manifest under the dataset folder.",
    ],
    table: [
      ["bed_gz_files", "12"],
      ["bigwig_tracks", "6"],
      ["example_track", "63 MB"],
      ["review_figures", "2"],
    ],
    visual: [18, 33, 71, 46, 89, 42],
  },
  {
    id: "cnv",
    label: "Supplied CNV matrix",
    dataset: "GSE186573 plasma DNA-seq CNV matrix",
    status: "Real local example",
    sourceLabel: "GEO GSE186573",
    sourceHref: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE186573",
    sourceStatus: "Mounted public dataset",
    evidenceStatus: "Executed supplied-matrix run on the local data disk",
    launchHint: "Attach GSE186573 or a similar CNV matrix folder; the agent can analyze it without re-running raw alignment.",
    inputShape: "Gene-level CNV CPM matrix with sample columns",
    validates: "Matrix orientation detection, CRC/NC label inference, numeric summaries, and heatmap output",
    caveat: "This is a supplied CNV signal-matrix review, not tumor-fraction inference.",
    focus: "CNV supplied matrix analysis",
    capabilities: ["CNV matrix", "label inference", "review figures"],
    intent: "Inspect an already supplied CNV signal matrix and produce reviewable outputs.",
    prompt: "Use GSE186573/suppl and run the safest first-pass CNV matrix analysis and plots.",
    reply:
      "I detected GSE186573_DNA-CNV_CPM_matrix_gene.txt.gz as a supplied CNV matrix. I will keep outputs inside the accession folder and generate matrix summaries, feature effects, a heatmap, and interactive PCA.",
    steps: ["scan folder", "detect CNV matrix", "infer labels", "summarize matrix", "plot"],
    artifacts: ["cfdna_cnv_matrix__sample_summary.csv", "cfdna_cnv_matrix__heatmap.png", "cfdna_cnv_matrix__feature_effects.csv"],
    report: [
      "The GSE186573 example used 86 samples and 1000 representative CNV matrix features.",
      "Sample labels were inferred from CRC/NC sample-name tokens.",
      "Generated CSV summaries and a PNG heatmap under the dataset visualisation folder.",
    ],
    table: [
      ["samples", "86"],
      ["features_used", "1000"],
      ["label_source", "sample-name tokens"],
    ],
    visual: [41, 72, 64, 35, 79, 58],
  },
  {
    id: "methylation",
    label: "Supplied methylation matrix",
    dataset: "GSE186575 plasma DNA-Met promoter matrix",
    status: "Real local example",
    sourceLabel: "GEO methylation-enrichment reference",
    sourceHref: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE186575",
    sourceStatus: "Mounted public dataset",
    evidenceStatus: "Executed promoter-matrix run on the local data disk",
    launchHint: "Attach GSE186575 or a similar methylation matrix folder; no FASTA is required for the supplied-matrix route.",
    inputShape: "Promoter-level methylation CPM matrix with sample columns",
    validates: "Methylation matrix detection, CRC/NC label inference, feature summaries, and heatmap output",
    caveat: "This path summarizes a released methylation signal matrix; it does not claim raw read-level methylation calling.",
    focus: "Methylation supplied matrix analysis",
    capabilities: ["methylation matrix", "group summaries", "review figures"],
    intent: "Analyze a released methylation matrix and produce reviewable outputs.",
    prompt: "Use GSE186575/suppl and run a first-pass methylation matrix summary with plots.",
    reply:
      "I detected GSE186575_DNA-Met_CPM_matrix_promoter.txt.gz as a supplied methylation matrix. I will summarize sample-level signals, infer CRC/NC grouping from names, and write heatmap plus tabular artifacts.",
    steps: ["scan folder", "detect methylation matrix", "infer labels", "summarize features", "plot"],
    artifacts: ["cfdna_methylation_matrix__sample_summary.csv", "cfdna_methylation_matrix__heatmap.png", "cfdna_methylation_matrix__feature_effects.csv"],
    report: [
      "The GSE186575 example used 98 samples and 1000 representative methylation matrix features.",
      "Sample labels were inferred from CRC/NC sample-name tokens.",
      "Generated CSV summaries and a PNG heatmap under the dataset visualisation folder.",
    ],
    table: [
      ["samples", "98"],
      ["features_used", "1000"],
      ["label_source", "sample-name tokens"],
    ],
    visual: [55, 64, 49, 71, 76, 69],
  },
  {
    id: "methylation-array",
    label: "Methylation array signal",
    dataset: "GSE214344 plasma cfDNA EPIC-like signal matrix",
    status: "Real local example",
    sourceLabel: "GEO GSE214344",
    sourceHref: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE214344",
    sourceStatus: "Mounted public dataset",
    evidenceStatus: "Executed methylated/unmethylated signal-matrix run on the local data disk",
    launchHint: "Attach GSE214344/suppl; the agent computes beta-like values from paired methylated and unmethylated signal columns.",
    inputShape: "CpG rows with methylated, unmethylated, and detection-p-value columns",
    validates: "EPIC-like signal parsing, beta-proxy conversion, matrix summaries, and heatmap output",
    caveat: "Beta-like values are computed from supplied array signal columns; downstream interpretation still needs study metadata.",
    focus: "Methylation array supplied signal analysis",
    capabilities: ["EPIC-like matrix", "beta proxy", "review figures"],
    intent: "Summarize a methylation array signal matrix without raw sequencing preprocessing.",
    prompt: "Use GSE214344/suppl and summarize the methylated/unmethylated signal matrix.",
    reply:
      "I detected GSE214344_MatrixSignalGEO.txt.gz as an EPIC-like signal matrix. I will compute beta-like values, summarize samples and features, and generate heatmap plus tabular artifacts.",
    steps: ["scan folder", "detect array signal", "compute beta proxy", "summarize matrix", "plot"],
    artifacts: ["cfdna_methylation_matrix__sample_summary.csv", "cfdna_methylation_matrix__heatmap.png", "cfdna_methylation_matrix__feature_effects.csv"],
    report: [
      "The GSE214344 example used 12 samples and 1000 representative CpG features.",
      "The parser used methylated / (methylated + unmethylated) as a beta-like signal.",
      "Generated CSV summaries and a PNG heatmap under the dataset visualisation folder.",
    ],
    table: [
      ["samples", "12"],
      ["features_used", "1000"],
      ["value_kind", "beta proxy"],
    ],
    visual: [37, 61, 48, 69, 57, 74],
  },
  {
    id: "variant",
    label: "Variant / VAF",
    dataset: "MSK-ACCESS cfDNA mutation subset",
    status: "Real local example",
    sourceLabel: "cBioPortal msk_access_2021",
    sourceHref: "https://www.cbioportal.org/study/summary?id=msk_access_2021",
    sourceStatus: "Public cBioPortal example subset",
    evidenceStatus: "Executed variant/VAF run on a local MSK-ACCESS cfDNA-style mutation subset",
    launchHint: "Attach project/msk_access_2021/suppl; the agent detects mutation/VAF tables and routes them into raw-signal variant review.",
    inputShape: "Mutation CSV with sample, patient, gene, position, ref/alt counts, and derived VAF",
    validates: "Variant table detection, VAF parsing, ref/alt count support, PNG VAF visualization, and numeric summaries",
    caveat: "This example subset uses MSK-ACCESS-style sample identifiers from a mixed public study and is not intended for clinical interpretation.",
    focus: "Variant normalization and VAF cautions",
    capabilities: ["variant table", "VAF summary", "review figures"],
    intent: "Normalize variant tables, summarize VAF, and write reviewable outputs.",
    prompt: "Use project/msk_access_2021/suppl and run a safe first-pass ctDNA variant VAF analysis with reviewable plots.",
    reply:
      "I found a mutation-style table with sample, gene, coordinate, ref/alt count, and VAF fields. I will summarize VAF by sample and gene, generate PNG VAF views, and keep interpretation cautions explicit.",
    steps: ["scan variants", "normalize columns", "VAF QC", "gene recurrence", "caution report"],
    artifacts: [
      "cfdna_raw_variants__analysis_summary.txt",
      "cfdna_raw_variants__sample_summary.csv",
      "cfdna_raw_variants__vaf_distribution.png",
      "cfdna_raw_variants__gene_summary.csv",
    ],
    report: [
      "The MSK-ACCESS example parsed 2025 mutation rows across 580 cfDNA-style samples.",
      "Generated VAF row tables, sample summaries, gene summaries, and a PNG VAF distribution.",
      "Interpretation remains conservative because this is a workflow example rather than a clinical finding.",
    ],
    table: [
      ["variant_rows", "2025"],
      ["samples", "580"],
      ["primary_signal", "VAF / recurrence"],
      ["review_figures", "1"],
    ],
    visual: [22, 31, 45, 58, 36, 74],
  },
  {
    id: "joint",
    label: "Joint sources",
    dataset: "GSE186607-style umbrella",
    status: "Source-aware autopilot",
    sourceLabel: "GEO multi-source liquid-biopsy reference",
    sourceHref: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE186607",
    sourceStatus: "Public GEO umbrella series",
    evidenceStatus: "Guided joint-source workflow with source isolation before comparison",
    launchHint: "Select a parent folder; the client can detect child dataset folders automatically.",
    inputShape: "Several child folders with different liquid-biopsy signal families",
    validates: "Source detection, per-source plans, joint inventory, comparison report",
    caveat: "Joint mode compares run receipts; it does not merge incompatible signals silently.",
    focus: "Multi-source inventory and comparison",
    capabilities: ["source detection", "joint plan", "comparison report"],
    intent: "Attach multiple folders, run per-source safe plans, then write a joint inventory.",
    prompt: "Use this parent folder. If it contains several liquid-biopsy datasets, analyze each safely and give me a joint summary.",
    reply:
      "I detected three candidate sources with different signal families. I will create source-specific plans first, run safe summaries independently, then combine outputs into a joint source inventory and comparison report.",
    steps: ["detect sources", "per-source plan", "safe runs", "joint inventory", "comparison report"],
    artifacts: ["joint_source_inventory.tsv", "joint_run_summary.md", "source_comparison_matrix.tsv"],
    report: [
      "3 sources detected: interval-style fragmentomics, LPWGS coverage bins, and region-signal matrix.",
      "Each source keeps its own blockers and outputs; failed optional steps do not stop other sources.",
      "Joint report summarizes comparable metadata, generated outputs, and recommended next experiments.",
    ],
    table: [
      ["sources", "3"],
      ["joint_mode", "enabled"],
      ["next_action", "compare source reports"],
    ],
    visual: [44, 62, 54, 78, 49, 66],
  },
  {
    id: "skills",
    label: "Skill memory",
    dataset: "Paper notes + cfDNA cohort",
    status: "Knowledge-assisted planning",
    sourceLabel: "Paper notes plus liquid-biopsy cohort",
    sourceHref: "#/guides/llm",
    sourceStatus: "Local skill-memory walkthrough",
    evidenceStatus: "Guided skill-memory workflow; generated outputs remain the evidence source",
    launchHint: "Ingest notes first, then ask the agent to reuse the skill while planning a local cohort.",
    inputShape: "Expert notes, paper snippets, and a cfDNA-style source folder",
    validates: "Skill distillation, context matching, plan revision, audit wording",
    caveat: "Skill memory changes planning context; generated outputs remain the evidence source.",
    focus: "Reusable expertise during planning",
    capabilities: ["paper notes", "skill matching", "audit wording"],
    intent: "Ingest expert notes and use matched skill context during planning.",
    prompt: "Read these paper notes, remember the assay cautions, then use that context when planning this cfDNA analysis.",
    reply:
      "I distilled the notes into a reusable local skill and matched it during planning. The run will prioritize raw-signal inspection, metadata checks, and conservative interpretation language for this assay family.",
    steps: ["ingest notes", "distill skill", "match context", "revise plan", "audit wording"],
    artifacts: ["skill_guided_plan.md", "skill_context_trace.json", "learned_skill/SKILL.md"],
    report: [
      "Created a portable local skill from high-signal paper and expert-note content.",
      "Matched skill context changed the example plan toward cautious assay-family matching.",
      "Final plan records which recommendations came from generated outputs versus reusable domain notes.",
    ],
    table: [
      ["skill_items", "7"],
      ["matched_context", "assay caution"],
      ["next_action", "run skill-guided plan"],
    ],
    visual: [36, 48, 69, 72, 63, 57],
  },
];

type PortalSampleRun = typeof PORTAL_SAMPLE_RUNS[number];

function portalSampleGuideHref(sample: PortalSampleRun) {
  if (sample.id === "joint") return "#/guides/data";
  if (sample.id === "skills") return "#/guides/llm";
  if (sample.id === "cnv" || sample.id === "methylation" || sample.id === "methylation-array") return "#/guides/results";
  return "#/guides/autopilot";
}

const PORTAL_RUN_VIEWS = [
  { key: "chat", label: "Chat" },
  { key: "plan", label: "Plan" },
  { key: "results", label: "Results" },
  { key: "artifacts", label: "Artifacts" },
] as const;

type PortalRunView = typeof PORTAL_RUN_VIEWS[number]["key"];

const PORTAL_GALLERY_RECEIPT_STAGES = [
  { key: "source", label: "Source" },
  { key: "control", label: "Control" },
  { key: "outputs", label: "Outputs" },
  { key: "review", label: "Review" },
] as const;

type PortalGalleryReceiptStage = typeof PORTAL_GALLERY_RECEIPT_STAGES[number]["key"];

const PORTAL_AGENT_OPERATIONS = [
  {
    key: "attach",
    label: "Attach",
    title: "Point the agent at a folder.",
    control: "New chat -> Choose folder, or paste an absolute dataset path.",
    output: "A local workspace is created and the source drawer records exactly what folder is bound.",
    guideHref: "#/guides/data",
    runView: "chat",
  },
  {
    key: "scan",
    label: "Scan",
    title: "Let the agent inspect what is real.",
    control: "Bind a folder, then ask: scan this dataset and explain what can run safely.",
    output: "The agent detects file shapes, likely signal families, missing inputs, and safe next tasks.",
    guideHref: "#/guides/data",
    runView: "plan",
  },
  {
    key: "plan",
    label: "Plan",
    title: "Choose a defensible run path.",
    control: "Review the generated plan, blockers, recommended task, and command preview.",
    output: "A readable task plan appears before execution, with blocked work separated from runnable work.",
    guideHref: "#/guides/autopilot",
    runView: "plan",
  },
  {
    key: "run",
    label: "Run",
    title: "Advance one safe step at a time.",
    control: "Click Run next step, or ask the agent to run the recommended step.",
    output: "Working notes stream while the selected step runs; failures become blockers and trigger replanning instead of hiding silently.",
    guideHref: "#/guides/autopilot",
    runView: "artifacts",
  },
  {
    key: "review",
    label: "Review",
    title: "Read the outputs, not just the logs.",
    control: "Open Refresh results and inspect tables, figures, reports, and the execution brief.",
    output: "The browser surfaces the result table, visualization preview, artifacts, and concise run summary.",
    guideHref: "#/guides/results",
    runView: "results",
  },
  {
    key: "refine",
    label: "Refine",
    title: "Turn findings into the next question.",
    control: "Ask a follow-up such as: explain the strongest signal and recommend the next safe check.",
    output: "The next plan is grounded in the current outputs, source context, and recorded blockers.",
    guideHref: "#/guides/results",
    runView: "chat",
  },
] as const;

type PortalAgentOperation = typeof PORTAL_AGENT_OPERATIONS[number];



function portalOperationOutcome(operation: PortalAgentOperation, sample: PortalSampleRun) {
  const primaryTable = sample.table[0];
  if (operation.key === "attach") return t("{0} becomes the active workspace for {1}.", { 0: t(sample.dataset), 1: t(sample.label) });
  if (operation.key === "scan") return t("Detected signals: {0}.", { 0: sample.capabilities.map(item => t(item)).join(", ") });
  if (operation.key === "plan") return t("Planned path: {0}.", { 0: sample.steps.map(item => t(item)).join(" -> ") });
  if (operation.key === "run") return t("Expected artifacts: {0}.", { 0: sample.artifacts.slice(0, 2).join(", ") });
  if (operation.key === "review" && primaryTable) return t("Review starts from {0} = {1}.", { 0: t(primaryTable[0]), 1: t(primaryTable[1]) });
  return t(sample.report[sample.report.length - 1] || sample.intent);
}

function portalTraceForOperation(sample: PortalSampleRun, operation: PortalAgentOperation) {
  const trace = [
    {
      key: "attach",
      label: "source",
      text: t("Bound {0} and recorded the selected folder before planning.", { 0: t(sample.dataset) }),
    },
    {
      key: "scan",
      label: "scan",
      text: t("Detected {0} and separated safe tasks from setup notes.", { 0: sample.capabilities.map(item => t(item)).join(", ") }),
    },
    {
      key: "plan",
      label: "plan",
      text: t("Prepared {0} ordered steps: {1}.", { 0: sample.steps.length, 1: sample.steps.slice(0, 3).map(item => t(item)).join(" -> ") }),
    },
    {
      key: "run",
      label: "run",
      text: t("Expected outputs include {0}.", { 0: sample.artifacts.slice(0, 2).join(", ") }),
    },
    {
      key: "review",
      label: "review",
      text: t(sample.report[0]) || t("Reviewed the generated report for {0}.", { 0: t(sample.label) }),
    },
    {
      key: "refine",
      label: "next",
      text: t(sample.report[sample.report.length - 1]) || t("Recommended the next safe question for {0}.", { 0: t(sample.label) }),
    },
  ];
  const activeIndex = Math.max(0, trace.findIndex((item) => item.key === operation.key));
  return { trace, activeIndex };
}











const PORTAL_ABOUT_VALUES = [
  {
    title: "Data first. Dashboard second.",
    body: "The product starts from the folder a scientist actually has, then builds the plan around files that are present.",
    proof: "Dataset folders, source lists, scan summaries, and run plans are visible before execution.",
    href: "#/guides/data",
  },
  {
    title: "Automation should leave receipts.",
    body: "Every run leaves a brief, artifacts, blockers, and next steps a translational team can audit.",
    proof: "Autopilot surfaces working notes, task status, generated artifacts, and final execution briefs.",
    href: "#/guides/autopilot",
  },
  {
    title: "Local by default.",
    body: "Sensitive liquid-biopsy data stays on the workstation or controlled server. The public portal is only the front door.",
    proof: "Try it opens the installation guide. Analysis runs only in your installed local workspace.",
    href: "#/guides/deployment",
  },
  {
    title: "Expertise should compound.",
    body: "Papers, cohort notes, and lab preferences become reusable skills instead of one-off chat history.",
    proof: "Skill memory can preserve domain cautions and reuse them in later liquid-biopsy planning.",
    href: "#/gallery/skills",
  },
];

const PORTAL_TEAM_MODEL = [
  {
    label: "Scientists",
    title: "Ask in domain language.",
    body: "Users start with a folder and a biological question, not a script inventory.",
  },
  {
    label: "Agent",
    title: "Convert intent into safe work.",
    body: "The agent scans evidence, proposes feasible tasks, runs valid steps, and records blockers.",
  },
  {
    label: "Engineers",
    title: "Keep the analysis transparent.",
    body: "Python modules keep scans, plans, runs, blockers, and reports traceable.",
  },
];

const PORTAL_ROLE_SCENARIOS = [
  {
    role: "Bench scientist",
    moment: "A dataset folder arrived before a plan.",
    ask: "What can we safely learn from these cfDNA files?",
    agent:
      "Scans the folder, classifies usable liquid-biopsy signals, separates safe work from missing setup, and drafts a plan in domain language.",
    receipt: "Dataset inventory, safe first plan, setup blockers, run brief",
    href: "#/guides/data",
    proof: ["folder first", "plain-language plan", "blockers visible"],
  },
  {
    role: "Bioinformatician",
    moment: "Several cohorts need one auditable run loop.",
    ask: "Can we run source-specific tasks without merging incompatible signals?",
    agent:
      "Keeps sources isolated, runs valid summaries per source, records skipped steps, and produces a joint inventory only after each source remains traceable.",
    receipt: "Source inventory, per-source receipts, comparison report",
    href: "#/gallery/joint",
    proof: ["source-aware", "safe continuation", "joint report"],
  },
  {
    role: "Translational lead",
    moment: "A result needs to be reviewed before the next experiment.",
    ask: "What changed, what is weak, and what should we do next?",
    agent:
      "Shows report notes, generated artifacts, figures, tables, and transformed working summaries so the next step is based on reviewable evidence.",
    receipt: "Run summary, result previews, next-step recommendation",
    href: "#/guides/results",
    proof: ["artifacts", "figures", "final brief"],
  },
  {
    role: "Project maintainer",
    moment: "The team wants reuse, not another one-off chat.",
    ask: "Can project knowledge become part of future planning?",
    agent:
      "Turns expert notes into local skill context, matches relevant cautions during planning, and keeps generated outputs as the evidence source.",
    receipt: "Local skill, context trace, skill-guided plan",
    href: "#/gallery/skills",
    proof: ["skill memory", "context trace", "local control"],
  },
] as const;

type PortalRoleScenario = typeof PORTAL_ROLE_SCENARIOS[number];

const PORTAL_PROJECT_MAP = [
  {
    label: "Front door",
    title: "A public portal that does not touch private data.",
    body:
      "The public website explains the product, shows examples, and links to installation documentation. It is not an analysis server.",
    proof: ["installation guide", "gallery previews", "download and install"],
    href: "#/guides/deployment",
  },
  {
    label: "Workspace",
    title: "A local browser console for real work.",
    body:
      "Chats, dataset folders, source lists, planned tasks, working notes, and generated artifacts stay in one local workspace.",
    proof: ["dataset workspaces", "source drawer", "results panel"],
    href: "#/guides/data",
  },
  {
    label: "Run kernel",
    title: "A transparent Python engine behind the interface.",
    body:
      "The npm shell and browser UI stay thin. Scans, plans, runs, blockers, and reports are still produced by explicit Python modules.",
    proof: ["scan", "autopilot", "review outputs"],
    href: "#/guides/autopilot",
  },
  {
    label: "Evidence loop",
    title: "Examples show the path before data is mounted.",
    body:
      "The Gallery demonstrates public-dataset-style liquid-biopsy workflows with chat, plans, reports, tables, visuals, and artifacts.",
    proof: ["fragmentomics", "CNV", "variant"],
    href: "#/gallery",
  },
];

const PORTAL_FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "#/" },
      { label: "Examples", href: "#/gallery" },
      { label: "Install", href: "#/guides/setup" },
      { label: "Guides", href: "#/guides" },
      { label: "About", href: "#/about" },
    ],
  },
  {
    title: "Start",
    links: [
      { label: "Install", href: "#/guides/setup" },
      { label: "Attach data", href: "#/guides/data" },
      { label: "Plan and run", href: "#/guides/autopilot" },
      { label: "Review outputs", href: "#/guides/results" },
    ],
  },
  {
    title: "Examples",
    links: [
      { label: "Fragmentomics", href: "#/gallery/fragmentomics" },
      { label: "LPWGS / CNV", href: "#/gallery/cnv" },
      { label: "Joint sources", href: "#/gallery/joint" },
      { label: "Skill memory", href: "#/gallery/skills" },
    ],
  },
];

const PORTAL_FOOTER_COMMANDS = ["liquid-agent", "liquid-agent cli", "liquid-agent wiki", "liq"];

const PORTAL_GUIDES = [
  {
    title: "Install once",
    body: "Run the installer and choose your user data directory when prompted. After that, launch the agent without thinking about conda.",
    command: "./install_liquid_agent.command",
  },
  {
    title: "Open the front door",
    body: "Open the public homepage and documentation.",
    command: "liquid-agent wiki",
  },
  {
    title: "Go straight to work",
    body: "Open chat, data binding, runs, and result review in the local workspace.",
    command: "liquid-agent",
  },
  {
    title: "Stay in terminal",
    body: "Power users keep the same assistant, source logic, LLM routing, and autopilot from the CLI.",
    command: "liquid-agent cli",
  },
];

const PORTAL_SETUP_PATHS = [
  {
    id: "mac",
    label: "One-click Mac",
    eyebrow: "Lowest friction",
    title: "Install from Finder, then use short commands.",
    body:
      "Install from the downloaded repository with Python and Node.js available. Choose a dedicated personal-information folder; research datasets are attached later.",
    command: "./install_liquid_agent.command",
    result: "Adds liquid-agent, liquid-web, liquid-client, and liq launchers.",
    bestFor: "Biology users on this workstation",
    opens: "Global launch commands",
    checks: ["captures runtime", "adds launchers", "keeps local files local"],
    href: "#/guides/setup",
  },
  {
    id: "terminal",
    label: "Linux install",
    eyebrow: "Reproducible",
    title: "Install from a shell when you manage the machine.",
    body:
      "Run the Linux installer from the repository. It installs application dependencies and remembers the selected Python environment and personal-information directory.",
    command: "bash install_liquid_agent_linux.sh --user-data-dir \"$HOME/Liquid Agent Data\"",
    result: "Creates the same command family from the current checkout.",
    bestFor: "Engineers and shared workstations",
    opens: "Command-line installer log",
    checks: ["same launchers", "scriptable setup", "no manual conda step after install"],
    href: "#/guides/setup",
  },
  {
    id: "portal",
    label: "Web workspace",
    eyebrow: "Recommended",
    title: "Open the local agent workspace.",
    body:
      "After installation, start here to chat, attach data, review plans, and inspect results.",
    command: "liquid-agent",
    result: "Opens the agent workspace directly in the browser.",
    bestFor: "Installed users ready to begin analysis",
    opens: "Agent workspace",
    checks: ["chat", "sources", "results"],
    href: "#/guides/data",
  },
  {
    id: "windows",
    label: "Windows install",
    eyebrow: "Native Windows",
    title: "Install from PowerShell or Command Prompt.",
    body: "Prepare Python and Node.js, then run the Windows installer from the extracted repository. Quote your personal-information directory if its path contains spaces.",
    command: '.\\install_liquid_agent_windows.cmd -UserDataDir "D:\\Liquid Agent Data"',
    result: "Registers the same Web and CLI launch commands on Windows.",
    bestFor: "Windows research workstations",
    opens: "Native Windows installer",
    checks: ["private user storage", "Web and CLI", "optional local models"],
    href: "#/guides/setup",
  },
] as const;



type PortalSetupPath = typeof PORTAL_SETUP_PATHS[number];





const PORTAL_GUIDE_MODULES = [
  {
    id: "setup",
    title: "Install and launch",
    kicker: "Start here",
    summary: "Install command shims once, then launch the Web workspace or terminal shell without manually activating a conda environment.",
    outcome: "You can open the public-facing portal, direct browser client, or terminal shell from one command family.",
    exampleHref: "#/gallery/fragmentomics",
    commands: ["./install_liquid_agent.command --user-data-dir \"$HOME/Liquid Agent Data\"", "liquid-agent web", "liquid-agent client", "liquid-agent cli"],
    steps: ["Run the installer from the checkout.", "Choose a personal-information folder, then launch liquid-agent.", "Use liquid-agent to open the Web workspace or liquid-agent cli for terminal workflows."],
  },
  {
    id: "data",
    title: "Attach data",
    kicker: "Workspace model",
    summary: "The user works in dataset folders. Absolute folders are accepted; relative dataset names resolve under the configured data root.",
    outcome: "The agent has a concrete dataset workspace and can scan real files before proposing a plan.",
    exampleHref: "#/gallery/joint",
    commands: ["I want to use this dataset folder: /path/to/dataset", "/use <dataset_a> <dataset_b>", "/sources add <dataset_c>"],
    steps: ["Start a new chat.", "Choose a folder or paste a path.", "Add multiple sources when a joint analysis is needed."],
  },
  {
    id: "autopilot",
    title: "Plan and run",
    kicker: "Agent loop",
    summary: "The agent scans the folder, explains feasible tasks, runs safe steps, records blockers, and keeps going when remaining work is still valid.",
    outcome: "You get a safe execution plan, live progress, blockers when needed, and a final run brief.",
    exampleHref: "#/gallery/fragmentomics",
    commands: ["Run the full analysis end to end.", "/plan", "/autopilot"],
    steps: ["Scan files and existing outputs.", "Generate a medically readable plan.", "Run preprocessing, analysis, visualization, and review where feasible."],
  },
  {
    id: "results",
    title: "Inspect outputs",
    kicker: "Review",
    summary: "The console exposes generated tables, figures, reports, working-note summaries, and final execution briefs without making users browse raw output folders.",
    outcome: "Tables, figures, reports, and execution summaries are visible from the browser before deeper file review.",
    exampleHref: "#/gallery/cnv",
    commands: ["Refresh results", "/review", "/output"],
    steps: ["Open Results.", "Preview figures and text artifacts.", "Use the final brief to decide the next analysis step."],
  },
  {
    id: "llm",
    title: "Model control",
    kicker: "LLM routing",
    summary: "GPT-6 Luna is the cloud default; Sol and Astra are explicit choices. The menu also supports Gemini and named local multimodal profiles.",
    outcome: "The selected GPT model uses your OpenAI key. Errors remain visible without silently changing providers or model tiers.",
    exampleHref: "#/gallery/skills",
    commands: ["/llm models", "/llm key", "/llm use auto"],
    steps: ["Add your OpenAI API key.", "Select a model by name; check its key or local-server readiness.", "Inspect API errors rather than treating offline guidance as a live model reply."],
  },
  {
    id: "deployment",
    title: "Portal and client",
    kicker: "Deployment",
    summary: "The same front door can run locally or be hosted publicly. Real analysis stays in the user's installed local runtime.",
    outcome: "A public website can explain the product, while real dataset execution remains in the user's local runtime.",
    exampleHref: "#/gallery/joint",
    commands: ["liquid-agent web", "liquid-agent client", "liquid-agent portal", "liquid-web"],
    steps: ["Use Try it on the public homepage to read the installation documentation.", "After installation, run liquid-agent web to open the workspace directly.", "Use liquid-agent portal only to preview the public homepage locally."],
  },
];

const PORTAL_GUIDE_PATHWAYS = [
  {
    id: "first-run",
    label: "First run",
    title: "I need to install and open the product.",
    body: "Install once, then run liquid-agent to open the Web workspace.",
    guideId: "setup",
    command: "liquid-agent web",
    checks: ["command shim", "workspace opens", "Try it opens docs"],
  },
  {
    id: "data-ready",
    label: "I have data",
    title: "I have a folder and want a safe plan.",
    body: "Attach a dataset folder, let the agent scan what is present, and review the safe plan before running anything.",
    guideId: "data",
    command: "I want to use this dataset folder: /path/to/dataset",
    checks: ["source attached", "files scanned", "plan ready"],
  },
  {
    id: "run-review",
    label: "Review outputs",
    title: "I need to inspect results and decide the next step.",
    body: "Use result refresh, artifact previews, report summaries, and transformed working traces to understand what happened.",
    guideId: "results",
    command: "Refresh results",
    checks: ["tables", "figures", "run brief"],
  },
  {
    id: "model-choice",
    label: "Model setup",
    title: "I need to choose a GPT model or manage my API key.",
    body: "Keep the default model or choose another by name. One OpenAI API key supports all available GPT models; costs vary by model.",
    guideId: "llm",
    command: "composer model menu",
    checks: ["GPT tier chosen", "key dialog", "explicit errors"],
  },
  {
    id: "public-front-door",
    label: "Public portal",
    title: "I want to host the portal as the project front door.",
    body: "Keep the public site as product and documentation, while real dataset execution stays in the installed local runtime.",
    guideId: "deployment",
    command: "liquid-agent portal",
    checks: ["static portal", "installation guide", "download and install"],
  },
] as const;

type PortalGuidePathway = typeof PORTAL_GUIDE_PATHWAYS[number];

const PORTAL_GUIDE_CONCEPTS = [
  {
    id: "command-shim",
    label: "Command shim",
    title: "Install once. Launch anywhere.",
    body:
      "The user-facing command is npm-owned. The shim remembers the Python environment so scientists do not need to activate conda before opening the portal, client, or CLI.",
    guideId: "setup",
    command: "./install_liquid_agent.command --user-data-dir \"$HOME/Liquid Agent Data\"",
    exampleHref: "#/launch",
    proof: ["npm entrypoint", "captured env", "portal/client/CLI"],
  },
  {
    id: "source-model",
    label: "Source model",
    title: "A folder becomes a workspace.",
    body:
      "Absolute paths, relative dataset names, and multiple source folders all resolve into one auditable workspace before any analysis is planned.",
    guideId: "data",
    command: "I want to use this dataset folder: /path/to/dataset",
    exampleHref: "#/gallery/joint",
    proof: ["folder picker", "source drawer", "joint inventory"],
  },
  {
    id: "safe-loop",
    label: "Safe loop",
    title: "Plan first. Run only valid work.",
    body:
      "Autopilot scans available files, explains feasible work, records blockers, and continues the safe remainder instead of pretending every step can run.",
    guideId: "autopilot",
    command: "/autopilot",
    exampleHref: "#/gallery/fragmentomics",
    proof: ["scan", "plan", "blockers", "run brief"],
  },
  {
    id: "result-receipts",
    label: "Result receipts",
    title: "Outputs should be inspectable.",
    body:
      "Tables, figures, artifacts, transformed working notes, and final summaries stay visible so a user can decide what to trust and what to do next.",
    guideId: "results",
    command: "Refresh results",
    exampleHref: "#/gallery/variant",
    proof: ["tables", "figures", "artifacts", "review"],
  },
  {
    id: "model-routing",
    label: "Model routing",
    title: "OpenAI GPT by default.",
    body:
      "Choose the economical GPT tier or explicitly select a higher tier. Manage your key locally; unavailable models and API errors are reported without automatic provider switching.",
    guideId: "llm",
    command: "composer model menu",
    exampleHref: "#/gallery/skills",
    proof: ["GPT tiers", "key prompt", "explicit errors"],
  },
  {
    id: "public-handoff",
    label: "Public to local",
    title: "Public site outside. Local runtime inside.",
    body:
      "The public portal explains the product. Try it opens the detailed installation docs directly, without checking for a local workspace. Real analysis stays in the user's local runtime.",
    guideId: "deployment",
    command: "liquid-agent web",
    exampleHref: "#/handoff",
    proof: ["public portal", "installation docs", "download and install"],
  },
] as const;

type PortalGuideConcept = typeof PORTAL_GUIDE_CONCEPTS[number];

const PORTAL_METHOD_ATLAS = [
  {
    id: "preprocessing",
    label: "Preprocessing",
    title: "Prepare interval, coverage, and variant signals before analysis.",
    body:
      "Maps the docs preprocessing guide into a web workflow: detect input family, run assay-aware cleanup, record blockers, and produce reusable intermediate tables.",
    docPath: "docs/guides/preprocessing.md",
    guideHref: "#/guides/autopilot",
    exampleHref: "#/gallery/fragmentomics",
    command: "Run preprocessing first, then continue safe downstream analysis.",
    proof: ["interval QC", "LPWGS preparation", "variant normalization"],
  },
  {
    id: "encoding",
    label: "Encoding",
    title: "Turn prepared liquid-biopsy signals into reusable feature stores.",
    body:
      "Summarizes the encoding guide without exposing raw implementation lists: choose a signal-aware encoder, preserve assay semantics, and write feature stores for downstream analysis.",
    docPath: "docs/guides/blood-encoding.md",
    guideHref: "#/guides/autopilot",
    exampleHref: "#/gallery/methylation",
    command: "Encode this source with the safest default encoder for its signal family.",
    proof: ["signal-aware defaults", "feature stores", "metadata-ready outputs"],
  },
  {
    id: "analysis",
    label: "cfDNA analysis",
    title: "Move from feature stores or raw summaries to reviewable outputs.",
    body:
      "Connects standard cfDNA analysis, visualization, and raw-signal review to the browser result panel and gallery run receipts.",
    docPath: "docs/guides/cfdna-analysis.md",
    guideHref: "#/guides/results",
    exampleHref: "#/gallery/cnv",
    command: "Run standard cfDNA analysis and refresh results.",
    proof: ["tables", "figures", "raw-signal summaries"],
  },
  {
    id: "methods",
    label: "Method advisor",
    title: "Compare external methods against local safe routes.",
    body:
      "Maps fragmentomics, methylation, CNV, variant, cfRNA, EV-miRNA, CTC, and proteomics questions to methods such as cfDNAPro, FinaleToolkit, WisecondorX, PureCN, FACETS, MethylBERT, CelFEER, UXM, and cfTools, with dependency status, command templates, references, and internal fallback tasks.",
    docPath: "docs/reference/liquid-biopsy-methods.md",
    guideHref: "#/guides/results",
    exampleHref: "#/gallery/fragmentomics",
    command: "Generate a method advice report for this dataset.",
    proof: ["tool fit", "dependency checks", "internal fallbacks"],
  },
  {
    id: "skills",
    label: "Skill memory",
    title: "Convert expert notes into reusable local planning context.",
    body:
      "Maps the professional skill guide into a product workflow: ingest high-signal notes, match relevant cautions, and keep generated outputs as the evidence source.",
    docPath: "docs/guides/professional-skills.md",
    guideHref: "#/guides/llm",
    exampleHref: "#/gallery/skills",
    command: "Remember these expert notes, then use them when planning this analysis.",
    proof: ["paper notes", "context trace", "audit wording"],
  },
  {
    id: "interfaces",
    label: "Interfaces",
    title: "Keep CLI, Web UI, and Python API aligned around one local kernel.",
    body:
      "Connects reference docs for npm commands and Python entrypoints to the portal/client split, so advanced users can move between UI and scripts without changing the analysis model.",
    docPath: "docs/reference/cli.md",
    guideHref: "#/guides/deployment",
    exampleHref: "#/launch",
    command: "liquid-agent web",
    proof: ["npm command", "browser client", "Python kernel"],
  },
] as const;

type PortalMethodAtlasItem = typeof PORTAL_METHOD_ATLAS[number];

function portalGuideConceptForGuide(guideId: string) {
  return PORTAL_GUIDE_CONCEPTS.find((concept) => concept.guideId === guideId) || PORTAL_GUIDE_CONCEPTS[0];
}

const PORTAL_NAV_ITEMS = [
  { label: "Home", href: "#/" },
  { label: "Examples", href: "#/gallery" },
  { label: "Install", href: "#/guides/setup" },
  { label: "Guides", href: "#/guides" },
  { label: "About", href: "#/about" },
];

function portalNavIsActive(route: string, href: string) {
  if (href === "#/") return route === "#/" || route === "" || ["#/start", "#/launch", "#/product", "#/handoff"].includes(route);
  if (href === "#/gallery") return route.startsWith("#/gallery") || ["#/evidence", "#/capabilities"].includes(route);
  if (href === "#/guides/setup") return route === "#/guides/setup";
  if (href === "#/guides") return route === "#/guides" || ["#/modes", "#/trust"].includes(route) || (route.startsWith("#/guides/") && route !== "#/guides/setup");
  if (href === "#/about") return route.startsWith("#/about") || route === "#/values";
  return route === href;
}

function portalHomeSectionForHash(section: string) {
  if (["start", "product", "launch", "handoff"].includes(section)) return "top";
  if (["evidence", "capabilities"].includes(section)) return "gallery";
  if (["modes", "trust"].includes(section)) return "guides";
  if (["install", "values"].includes(section)) return section;
  return "";
}

function portalInstallationHref() {
  const locale = currentLanguage() === "zh-CN" ? "zh" : "en";
  return `./docs/${locale}/getting-started/installation/`;
}

function PortalTryLink({ className }: { className?: string }) {
  return <a className={className} href={portalInstallationHref()}>{t("Try it")}</a>;
}

function PortalNav({ route, showTheme = true }: { route: string; showTheme?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const closeMenu = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && mobileMenuRef.current?.contains(target)) return;
      setMobileMenuOpen(false);
    };
    const closeOnRouteChange = () => setMobileMenuOpen(false);
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("touchstart", closeMenu);
    window.addEventListener("hashchange", closeOnRouteChange);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("touchstart", closeMenu);
      window.removeEventListener("hashchange", closeOnRouteChange);
    };
  }, [mobileMenuOpen]);


  const handleNavItemClick = (href: string) => {
    setMobileMenuOpen(false);
    const section = href.replace(/^#\//, "");
    if (href === "#/") {
      window.setTimeout(scrollPortalToTop, 40);
      return;
    }
    const homeSection = portalHomeSectionForHash(section);
    if (homeSection) {
      window.setTimeout(() => scrollPortalElementIntoView(homeSection), 80);
    }
  };

  return (
    <nav className="portal-nav" aria-label={t("Portal navigation")}>
      <a className="portal-brand" href="#/" onClick={scrollPortalToTop} aria-label={t("Liquid Agent home")}>
        <span><LiquidAgentMark className="portal-brand-logo" /></span>
        <strong>LIQUID-Agent</strong>
      </a>
      <div className="portal-tags">
        <a href={`./docs/${currentLanguage() === "zh-CN" ? "zh" : "en"}/`}>{t("Docs")}</a>
        {PORTAL_NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            className={portalNavIsActive(route, item.href) ? "active" : ""}
            aria-current={portalNavIsActive(route, item.href) ? "page" : undefined}
            href={item.href}
            onClick={() => handleNavItemClick(item.href)}
          >
            {t(item.label)}
          </a>
        ))}
      </div>
      <div className="portal-appearance-actions">
        <PortalAppearance showTheme={showTheme} />
        <PortalTryLink className="portal-nav-cta" />
      </div>
      <div className="portal-mobile-menu-wrap" ref={mobileMenuRef} onKeyDown={event => {
        if (event.key === "Escape") {
          event.preventDefault();
          setMobileMenuOpen(false);
          mobileMenuRef.current?.querySelector("button")?.focus();
        }
      }}>
        <button
          type="button"
          className="portal-mobile-toggle"
          aria-label={mobileMenuOpen ? t("Close portal menu") : t("Open portal menu")}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        {mobileMenuOpen && (
          <div className="portal-mobile-menu" role="menu">
            <a href={`./docs/${currentLanguage() === "zh-CN" ? "zh" : "en"}/`} role="menuitem">{t("Docs")}</a>
            {PORTAL_NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                className={portalNavIsActive(route, item.href) ? "active" : ""}
                aria-current={portalNavIsActive(route, item.href) ? "page" : undefined}
                href={item.href}
                role="menuitem"
                onClick={() => handleNavItemClick(item.href)}
              >
                {t(item.label)}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function PortalFooter() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyFooterCommand = async (command: string) => {
    const ok = await copyPortalText(command);
    const feedback = ok ? command : `failed:${command}`;
    setCopiedCommand(feedback);
    window.setTimeout(() => setCopiedCommand((value) => (value === feedback ? null : value)), ok ? 1600 : 6000);
  };

  return (
    <footer className="portal-footer" aria-label={t("Liquid Agent site map")}>
      <div className="portal-footer-brand">
        <span><LiquidAgentMark className="portal-footer-logo" /></span>
        <strong>LIQUID-Agent</strong>
        <p>{t("Local-first liquid-biopsy analysis. Public front door, private runtime.")}</p>
        <PortalTryLink className="portal-primary" />
      </div>

      <div className="portal-footer-map">
        {PORTAL_FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={t("{0} links", { 0: t(column.title) })}>
            <strong>{t(column.title)}</strong>
            {column.links.map((link) => (
              <a key={link.href} href={link.href}>{t(link.label)}</a>
            ))}
          </nav>
        ))}
      </div>

      <div className="portal-footer-commands">
        <strong>{t("Launch locally")}</strong>
        <div>
          {PORTAL_FOOTER_COMMANDS.map((command) => (
            <button key={command} type="button" className="portal-command-pill" onClick={() => void copyFooterCommand(command)}>
              <code>{command}</code>
              <span>{portalCopyLabel(copiedCommand, command, "copy", "copied")}</span>
            </button>
          ))}
        </div>
        <small>{t("npm commands call the installed local Python analysis kernel.")}</small>
      </div>
    </footer>
  );
}

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return route;
}

function scrollPortalElementIntoView(elementId: string, offset = 84, behavior: ScrollBehavior = "smooth") {
  const shell = document.querySelector(".portal-shell");
  const element = document.getElementById(elementId);
  if (!(shell instanceof HTMLElement) || !(element instanceof HTMLElement)) {
    element?.scrollIntoView({ behavior, block: "start" });
    return;
  }
  const isMobile = window.innerWidth <= 640;
  const shellRect = shell.getBoundingClientRect();
  const target = element.classList.contains("portal-section")
    ? isMobile ? element : element.querySelector(".portal-section-heading") || element
    : element;
  const elementRect = target.getBoundingClientRect();
  const effectiveOffset = isMobile ? 60 : offset;
  const previousScrollBehavior = shell.style.scrollBehavior;
  if (behavior === "auto") shell.style.scrollBehavior = "auto";
  shell.scrollTo({
    top: shell.scrollTop + elementRect.top - shellRect.top - effectiveOffset,
    behavior,
  });
  if (behavior === "auto") {
    window.requestAnimationFrame(() => {
      shell.style.scrollBehavior = previousScrollBehavior;
    });
  }
}

function scrollPortalToTop() {
  const shell = document.querySelector(".portal-shell");
  if (shell instanceof HTMLElement) {
    shell.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function copyPortalText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function portalCopyLabel(state: string | null, key: string, idle: string, done: string) {
  if (state === key) return t(done);
  if (state === `failed:${key}`) return t("Copy unavailable; select text");
  return t(idle);
}

function PortalRunExplorer({
  sample,
  activeView,
  onViewChange,
  deep = false,
}: {
  sample: PortalSampleRun;
  activeView: PortalRunView;
  onViewChange: (view: PortalRunView) => void;
  deep?: boolean;
}) {
  const [copiedPromptFor, setCopiedPromptFor] = useState<string | null>(null);

  const copySamplePrompt = async () => {
    const ok = await copyPortalText(t(sample.prompt));
    const feedback = ok ? sample.id : `failed:${sample.id}`;
    setCopiedPromptFor(feedback);
    window.setTimeout(() => setCopiedPromptFor((value) => (value === feedback ? null : value)), ok ? 1600 : 6000);
  };

  return (
    <div className={`portal-run-explorer${deep ? " portal-run-explorer-deep" : ""}`}>
      <div className="portal-run-tabs" role="tablist" aria-label={t("{0} example run views", { 0: t(sample.label) })}>
        {PORTAL_RUN_VIEWS.map((view) => (
          <button
            key={view.key}
            type="button"
            role="tab"
            aria-selected={activeView === view.key}
            className={activeView === view.key ? "active" : ""}
            onClick={() => onViewChange(view.key)}
          >
            {t(view.label)}
          </button>
        ))}
      </div>

      <div className={`portal-run-panel ${activeView}`} role="tabpanel">
        {activeView === "chat" && (
          <div className={`portal-sample-chat${deep ? " portal-deep-chat" : ""}`}>
            <p className="portal-user-bubble">{t(sample.prompt)}</p>
            <p className="portal-agent-bubble">{t(sample.reply)}</p>
            <div className="portal-mini-report portal-run-brief">
              <strong>{t("Run brief")}</strong>
              <span>{t(sample.intent)}</span>
            </div>
          </div>
        )}

        {activeView === "plan" && (
          <div className="portal-plan-preview">
            <article>
              <span>{t("Status")}</span>
              <strong>{t(sample.status)}</strong>
              <p>{t(sample.intent)}</p>
            </article>
            <div className="portal-run-timeline">
              {sample.steps.map((step, index) => (
                <span key={step}><b>{index + 1}</b>{t(step)}</span>
              ))}
            </div>
          </div>
        )}

        {activeView === "results" && (
          <div className="portal-sample-output portal-results-output">
            <article>
              <h3>{t("Report preview")}</h3>
              {sample.report.map((line) => <p key={line}>{t(line)}</p>)}
            </article>
            <article className="portal-bars" aria-label={t("{0} visualization preview", { 0: t(sample.label) })}>
              <h3>{t("Visualization preview")}</h3>
              <p>{t("Illustrative layout, not measured values. See the walkthrough for real outputs.")}</p>
              <div>
                {sample.visual.map((value, index) => (
                  <span key={`${sample.id}-${index}`} style={{ height: `${value}%` }} />
                ))}
              </div>
            </article>
            <article className="portal-table-card portal-table-card-wide">
              <h3>{t("Result table")}</h3>
              {sample.table.map(([key, value]) => (
                <p key={key}>
                  <span>{t(key)}</span>
                  <strong>{t(value)}</strong>
                </p>
              ))}
            </article>
          </div>
        )}

        {activeView === "artifacts" && (
          <div className="portal-artifact-browser">
            <article>
              <h3>{t("Generated artifacts")}</h3>
              <p>{t("These are representative files a completed local run would leave for review.")}</p>
            </article>
            <div>
              {sample.artifacts.map((artifact) => (
                <span key={artifact}>
                  <b>{artifact.split(".").pop()}</b>
                  {artifact}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="portal-run-actions" aria-label={t("{0} reusable example actions", { 0: t(sample.label) })}>
        <button type="button" onClick={() => void copySamplePrompt()}>
          {portalCopyLabel(copiedPromptFor, sample.id, "Copy prompt", "Prompt copied")}
        </button>
        <a href={portalSampleGuideHref(sample)}>{t("Matching guide")}</a>
        <a href={`#/gallery/${sample.id}`}>{t("Open example")}</a>
      </div>
    </div>
  );
}

function PortalSampleProvenance({ sample }: { sample: PortalSampleRun }) {
  return (
    <section className="portal-sample-provenance" aria-label={t("{0} dataset card", { 0: t(sample.label) })}>
      <div className="portal-sample-provenance-head">
        <p className="portal-kicker">{t("Dataset card")}</p>
        <h3>{t(sample.dataset)}</h3>
        <a
          href={sample.sourceHref}
          target={sample.sourceHref.startsWith("http") ? "_blank" : undefined}
          rel={sample.sourceHref.startsWith("http") ? "noreferrer" : undefined}
        >{t("Open reference ")}</a>
      </div>
      <div className="portal-sample-provenance-grid">
        <article>
          <small>{t("Public reference")}</small>
          <strong>{t(sample.sourceLabel)}</strong>
          <span>{t(sample.sourceStatus)}</span>
        </article>
        <article>
          <small>{t("Run status")}</small>
          <strong>{t(sample.evidenceStatus)}</strong>
          <span>{t(sample.focus)}</span>
        </article>
        <article>
          <small>{t("Input shape")}</small>
          <strong>{t(sample.inputShape)}</strong>
          <span>{t(sample.validates)}</span>
        </article>
        <article>
          <small>{t("Run locally")}</small>
          <strong>{t(sample.launchHint)}</strong>
          <span>{t(sample.caveat)}</span>
        </article>
      </div>
    </section>
  );
}

function portalFirstArtifact(sample: PortalSampleRun, extensions: string[]) {
  return sample.artifacts.find((artifact) => extensions.some((extension) => artifact.endsWith(extension))) || sample.artifacts[0];
}

function portalNextAction(sample: PortalSampleRun) {
  return sample.table.find(([key]) => key.includes("next"))?.[1] || "inspect outputs";
}

function PortalRunPackage({ sample }: { sample: PortalSampleRun }) {
  const [copiedFor, setCopiedFor] = useState<string | null>(null);
  const reportArtifact = portalFirstArtifact(sample, [".md", ".txt"]);
  const tableArtifact = portalFirstArtifact(sample, [".tsv", ".csv", ".json"]);
  const figureArtifact = portalFirstArtifact(sample, [".png", ".svg", ".pdf"]);
  const packageItems = [
    {
      label: "Brief",
      value: reportArtifact,
      note: sample.report[0] || sample.intent,
    },
    {
      label: "Table",
      value: tableArtifact,
      note: sample.table[0] ? `${sample.table[0][0]} = ${sample.table[0][1]}` : sample.focus,
    },
    {
      label: "Figure",
      value: figureArtifact,
      note: sample.focus,
    },
    {
      label: "Next",
      value: portalNextAction(sample),
      note: sample.report[sample.report.length - 1] || sample.intent,
    },
  ];

  const copyPackage = async () => {
    const checklist = [
      `${sample.label} run package`,
      `Dataset: ${sample.dataset}`,
      `Prompt: ${sample.prompt}`,
      ...packageItems.map((item) => `${item.label}: ${item.value}`),
      `Artifacts: ${sample.artifacts.join(", ")}`,
    ].join("\n");
    const ok = await copyPortalText(checklist);
    const feedback = ok ? sample.id : `failed:${sample.id}`;
    setCopiedFor(feedback);
    window.setTimeout(() => setCopiedFor((value) => (value === feedback ? null : value)), ok ? 1600 : 6000);
  };

  return (
    <section className="portal-run-package" aria-label={t("{0} deliverable package", { 0: t(sample.label) })}>
      <div className="portal-run-package-head">
        <div>
          <p className="portal-kicker">{t("Run package")}</p>
          <h3>{t("What the user gets after the run.")}</h3>
        </div>
        <button type="button" onClick={() => void copyPackage()}>
          {portalCopyLabel(copiedFor, sample.id, "Copy checklist", "Copied")}
        </button>
      </div>
      <div className="portal-run-package-grid">
        {packageItems.map((item) => (
          <article key={item.label}>
            <small>{t(item.label)}</small>
            <strong>{t(item.value)}</strong>
            <span>{t(item.note)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PortalOperationPlaybook({
  sample,
  activeOperation,
  onOperationChange,
}: {
  sample: PortalSampleRun;
  activeOperation: PortalAgentOperation;
  onOperationChange: (operation: PortalAgentOperation) => void;
}) {
  return (
    <section className="portal-operation-playbook" aria-label={t("{0} operation playbook", { 0: t(sample.label) })}>
      <div className="portal-operation-head">
        <p className="portal-kicker">{t("Operate the agent")}</p>
        <h3>{t("Control path, expected output, and where to look.")}</h3>
      </div>
      <div className="portal-operation-grid">
        <div className="portal-operation-steps" aria-label={t("Agent operation steps")}>
          {PORTAL_AGENT_OPERATIONS.map((operation, index) => (
            <button
              key={operation.key}
              type="button"
              className={operation.key === activeOperation.key ? "active" : ""}
              onClick={() => onOperationChange(operation)}
            >
              <small>{t(String(index + 1).padStart(2, "0"))}</small>
              <strong>{t(operation.label)}</strong>
              <span>{t(operation.title)}</span>
            </button>
          ))}
        </div>
        <article className="portal-operation-detail">
          <p>{t(activeOperation.label)}</p>
          <h4>{t(activeOperation.title)}</h4>
          <code>{t(activeOperation.control)}</code>
          <div>
            <small>{t("What changes")}</small>
            <strong>{t(activeOperation.output)}</strong>
          </div>
          <div>
            <small>{t("Applied to ")}{t(sample.dataset)}</small>
            <strong>{t(portalOperationOutcome(activeOperation, sample))}</strong>
          </div>
          <a href={activeOperation.guideHref}>{t("Open matching guide")}</a>
        </article>
      </div>
    </section>
  );
}

function PortalRunTrace({
  sample,
  activeOperation,
}: {
  sample: PortalSampleRun;
  activeOperation: PortalAgentOperation;
}) {
  const { trace, activeIndex } = portalTraceForOperation(sample, activeOperation);
  return (
    <section className="portal-run-trace" aria-label={t("{0} working trace", { 0: t(sample.label) })}>
      <div className="portal-run-trace-head">
        <div>
          <p className="portal-kicker">{t("Working trace")}</p>
          <h3>{t("Progress summaries, not private thoughts.")}</h3>
        </div>
        <span>{t(activeOperation.label)} · {t(sample.dataset)}</span>
      </div>
      <div className="portal-run-trace-grid">
        <div className="portal-run-trace-console">
          {trace.map((item, index) => (
            <p
              key={item.key}
              className={index < activeIndex ? "complete" : index === activeIndex ? "active" : ""}
            >
              <b>{t(String(index + 1).padStart(2, "0"))}</b>
              <span>{t(item.text)}</span>
            </p>
          ))}
        </div>
        <aside className="portal-run-trace-card">
          <small>{t("Current receipt")}</small>
          <strong>{t(activeOperation.title)}</strong>
          <span>{t(portalOperationOutcome(activeOperation, sample))}</span>
          <div>
            <em>{t(sample.artifacts.length)}{t(" artifacts")}</em>
            <em>{t(sample.table.length)}{t(" table rows")}</em>
            <em>{t(sample.report.length)}{t(" report notes")}</em>
          </div>
        </aside>
      </div>
    </section>
  );
}

function portalGalleryReceiptDetail(
  stage: PortalGalleryReceiptStage,
  sample: PortalSampleRun,
  activeOperation: PortalAgentOperation
) {
  if (stage === "source") {
    return {
      eyebrow: "Detected source",
      title: `${t(sample.dataset)} -> ${t(sample.label)}`,
      body: `The agent starts with local files, then classifies the usable liquid-biopsy signal before it plans any run.`,
      code: t(sample.prompt),
      chips: sample.capabilities,
      rows: [
        ["focus", sample.focus],
        ["status", sample.status],
        ["first step", sample.steps[0] || "scan"],
      ],
    };
  }
  if (stage === "control") {
    return {
      eyebrow: "Agent control",
      title: activeOperation.title,
      body: activeOperation.output,
      code: t(activeOperation.control),
      chips: sample.steps,
      rows: [
        ["operation", activeOperation.label],
        ["view", activeOperation.runView],
        ["guide", activeOperation.guideHref.replace("#/guides/", "")],
      ],
    };
  }
  if (stage === "outputs") {
    return {
      eyebrow: "Generated outputs",
      title: t("{0} reviewable artifacts", { 0: sample.artifacts.length }),
      body: `The local run leaves concrete files, tables, figures, and summaries that can be inspected from the browser or filesystem.`,
      code: sample.artifacts.join(" | "),
      chips: sample.artifacts.map((artifact) => artifact.split(".").pop() || artifact),
      rows: sample.table,
    };
  }
  return {
    eyebrow: "Review checkpoint",
    title: "A concise conclusion, not a hidden chain.",
    body: sample.report.map(item => t(item)).join(" "),
    code: t(sample.report[0] || sample.intent),
    chips: ["brief", "blockers", "next step"],
    rows: [
      ["primary signal", sample.table.find(([key]) => key.includes("signal"))?.[1] || sample.focus],
      ["next action", sample.table.find(([key]) => key.includes("next"))?.[1] || "inspect outputs"],
      ["artifact count", String(sample.artifacts.length)],
    ],
  };
}

function PortalGalleryReceipt({
  sample,
  activeOperation,
}: {
  sample: PortalSampleRun;
  activeOperation: PortalAgentOperation;
}) {
  const [activeStage, setActiveStage] = useState<PortalGalleryReceiptStage>("source");
  const detail = portalGalleryReceiptDetail(activeStage, sample, activeOperation);

  return (
    <section className="portal-gallery-receipt" aria-label={t("{0} run receipt", { 0: t(sample.label) })}>
      <div className="portal-gallery-receipt-head">
        <div>
          <p className="portal-kicker">{t("Run receipt")}</p>
          <h3>{t("Follow the evidence from folder to finding.")}</h3>
        </div>
        <span>{t(sample.dataset)}</span>
      </div>
      <div className="portal-gallery-receipt-grid">
        <div className="portal-gallery-receipt-tabs" role="tablist" aria-label={t("{0} receipt stages", { 0: t(sample.label) })}>
          {PORTAL_GALLERY_RECEIPT_STAGES.map((stage) => (
            <button
              key={stage.key}
              type="button"
              role="tab"
              aria-selected={activeStage === stage.key}
              className={activeStage === stage.key ? "active" : ""}
              onClick={() => setActiveStage(stage.key)}
            >
              {t(stage.label)}
            </button>
          ))}
        </div>
        <article className="portal-gallery-receipt-detail" role="tabpanel">
          <p>{t(detail.eyebrow)}</p>
          <h4>{t(detail.title)}</h4>
          <span>{t(detail.body)}</span>
          <code>{detail.code}</code>
          <div className="portal-gallery-receipt-chips">
            {detail.chips.slice(0, 6).map((chip) => <small key={chip}>{t(chip)}</small>)}
          </div>
          <div className="portal-gallery-receipt-table">
            {detail.rows.slice(0, 4).map(([key, value]) => (
              <p key={key}>
                <span>{t(key)}</span>
                <strong>{t(value)}</strong>
              </p>
            ))}
          </div>
        </article>
        <aside className="portal-gallery-receipt-visual" aria-label={t("{0} signal preview", { 0: t(sample.label) })}>
          <strong>{t(sample.focus)}</strong>
          <div>
            {sample.visual.map((value, index) => (
              <span key={`${sample.id}-receipt-${index}`} style={{ height: `${value}%` }} />
            ))}
          </div>
          <small>{t(activeStage)}{t(" receipt · ")}{t(sample.status)}</small>
        </aside>
      </div>
    </section>
  );
}

function PortalHome({ route }: { route: string }) {
  const [activeSample, setActiveSample] = useState(PORTAL_SAMPLE_RUNS[0]);
  const [activeSampleView, setActiveSampleView] = useState<PortalRunView>("chat");
  const [activeGuide, setActiveGuide] = useState(PORTAL_GUIDE_MODULES[0]);
  const [activeSetupPath, setActiveSetupPath] = useState<PortalSetupPath>(PORTAL_SETUP_PATHS[2]);
  const [copiedInstallCommand, setCopiedInstallCommand] = useState<string | null>(null);
  const [copiedSetupCommand, setCopiedSetupCommand] = useState<string | null>(null);

  useEffect(() => {
    const section = route.replace(/^#\//, "");
    const homeSection = portalHomeSectionForHash(section);
    if (!homeSection) return;
    const first = window.setTimeout(() => scrollPortalElementIntoView(homeSection, 84, "auto"), 30);
    const settle = window.setTimeout(() => scrollPortalElementIntoView(homeSection, 84, "auto"), 420);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(settle);
    };
  }, [route]);

  const selectPortalSample = (sample: PortalSampleRun) => {
    setActiveSample(sample);
    setActiveSampleView("chat");
  };

  const copyInstallCommand = async (command: string) => {
    const ok = await copyPortalText(command);
    const feedback = ok ? command : `failed:${command}`;
    setCopiedInstallCommand(feedback);
    window.setTimeout(() => setCopiedInstallCommand((value) => (value === feedback ? null : value)), ok ? 1600 : 6000);
  };

  const copySetupCommand = async (command: string) => {
    const ok = await copyPortalText(command);
    const feedback = ok ? command : `failed:${command}`;
    setCopiedSetupCommand(feedback);
    window.setTimeout(() => setCopiedSetupCommand((value) => (value === feedback ? null : value)), ok ? 1600 : 6000);
  };






  return (
    <main className="portal-shell portal-home">
      <div className="portal-bg" aria-hidden="true" />
      <a className="portal-skip" href="#portal-research">{t("Skip to capabilities")}</a>
      <PortalNav route={route} showTheme={false} />

      <section id="top" className="portal-hero">
        <div className="portal-hero-copy">
          <p className="portal-kicker">{t("Local-first AI for liquid-biopsy analysis")}</p>
          <h1>{t("Start with data. Get to analysis.")}</h1>
          <p>{t("Bring a dataset and a scientific question. Review a focused plan, run the steps you choose, and explore the evidence together. ")}</p>
          <div className="portal-hero-actions">
            <PortalTryLink className="portal-primary" />
            <a className="portal-secondary" href="#/gallery">{t("Watch a run")}</a>
          </div>
          <div className="portal-proof">
            <span>{t("local data folders")}</span>
            <span>{t("planned runs")}</span>
            <span>{t("reviewed outputs")}</span>
          </div>
        </div>

        <a
          className="portal-demo"
          href="./assets/liquid-agent-demo.gif?v=20260916-borderless"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("Open the demo at full resolution")}
        >
          <img
            src="./assets/liquid-agent-demo.gif?v=20260916-borderless"
            width="2292"
            height="1440"
            decoding="async"
            alt={t("LIQUID-Agent demo: browse skills, select a dataset, review and run a plan, and explore reports and interactive figures.")}
          />
        </a>
      </section>

      <PortalOverview />

      <section id="gallery" className="portal-section portal-gallery">
        <div className="portal-section-heading">
          <p>{t("Examples")}</p>
          <h2>{t("Capabilities are easiest to trust when you can inspect a run.")}</h2>
          <span>{t("Signal-specific examples combine workflow, evidence receipts, supported outputs, and boundary notes in one place.")}</span>
          <a className="portal-section-action" href="#/gallery">{t("Explore examples")}</a>
        </div>
        <div className="portal-gallery-grid">
          <div className="portal-sample-list">
            {PORTAL_SAMPLE_RUNS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className={sample.id === activeSample.id ? "active" : ""}
                onClick={() => selectPortalSample(sample)}
              >
                <strong>{t(sample.label)}</strong>
                <small>{t(sample.dataset)}</small>
                <span>{t(sample.intent)}</span>
              </button>
            ))}
          </div>
          <div className="portal-sample-stage">
            <div className="portal-sample-meta">
              <span>{t(activeSample.label)}</span>
              <strong>{t(activeSample.dataset)}</strong>
              <small>{[activeSample.status, ...activeSample.steps].map(item => t(item)).join(" -> ")}</small>
            </div>
            <PortalRunExplorer sample={activeSample} activeView={activeSampleView} onViewChange={setActiveSampleView} />
          </div>
        </div>
      </section>

      <section id="install" className="portal-section portal-install">
        <div className="portal-section-heading">
          <p>{t("Install")}</p>
          <h2>{t("A local workspace. On your machine.")}</h2>
          <span>{t("Choose macOS, Linux or Windows. Keep your personal application storage separate from your research data; then launch with liquid-agent.")}</span>
        </div>
        <div className="portal-setup-board">
          <div className="portal-setup-lanes" aria-label={t("Setup and launch paths")}>
            {PORTAL_SETUP_PATHS.map((path) => (
              <button
                key={path.id}
                type="button"
                className={path.id === activeSetupPath.id ? "active" : ""}
                onClick={() => setActiveSetupPath(path)}
              >
                <small>{t(path.eyebrow)}</small>
                <strong>{t(path.label)}</strong>
                <span>{t(path.command)}</span>
              </button>
            ))}
          </div>
          <article className="portal-setup-detail">
            <p className="portal-kicker">{t(activeSetupPath.eyebrow)}</p>
            <h3>{t(activeSetupPath.title)}</h3>
            <span>{t(activeSetupPath.body)}</span>
            <button
              type="button"
              className="portal-setup-command"
              aria-live="polite"
              onClick={() => void copySetupCommand(activeSetupPath.command)}
            >
              <code>{activeSetupPath.command}</code>
              <small>{portalCopyLabel(copiedSetupCommand, activeSetupPath.command, "copy command", "copied")}</small>
            </button>
            <div className="portal-setup-facts">
              <p>
                <small>{t("Best for")}</small>
                <strong>{t(activeSetupPath.bestFor)}</strong>
              </p>
              <p>
                <small>{t("Opens")}</small>
                <strong>{t(activeSetupPath.opens)}</strong>
              </p>
              <p>
                <small>{t("Result")}</small>
                <strong>{t(activeSetupPath.result)}</strong>
              </p>
            </div>
            <div className="portal-setup-checks" aria-label={t("{0} checks", { 0: t(activeSetupPath.label) })}>
              {activeSetupPath.checks.map((check) => <small key={check}>{t(check)}</small>)}
            </div>
            <nav aria-label={t("{0} next steps", { 0: t(activeSetupPath.label) })}>
              <a href={activeSetupPath.href}>{t("Open matching guide")}</a>
              <PortalTryLink />
            </nav>
          </article>
        </div>
        <div className="portal-install-shortcuts" aria-label={t("Quick command copies")}>
          {PORTAL_GUIDES.map((guide) => (
            <button type="button" key={guide.command} onClick={() => void copyInstallCommand(guide.command)}>
              <strong>{t(guide.title)}</strong>
              <code>{guide.command}</code>
              <span>{portalCopyLabel(copiedInstallCommand, guide.command, "copy", "copied")}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="guides" className="portal-section portal-docs">
        <div className="portal-section-heading">
          <p>{t("Guides")}</p>
          <h2>{t("Learn by doing, not digging through docs.")}</h2>
          <a className="portal-section-action" href="#/guides">{t("Open guides")}</a>
        </div>
        <div className="portal-guide-system">
          <div className="portal-guide-tabs">
            {PORTAL_GUIDE_MODULES.map((guide) => (
              <button
                key={guide.id}
                type="button"
                className={guide.id === activeGuide.id ? "active" : ""}
                onClick={() => setActiveGuide(guide)}
              >
                <small>{t(guide.kicker)}</small>
                <strong>{t(guide.title)}</strong>
              </button>
            ))}
          </div>
          <article className="portal-guide-detail">
            <p>{t(activeGuide.kicker)}</p>
            <h3>{t(activeGuide.title)}</h3>
            <span>{t(activeGuide.summary)}</span>
            <div className="portal-guide-columns">
              <div>
                <strong>{t("Workflow")}</strong>
                {activeGuide.steps.map((step, index) => (
                  <p key={step}><b>{index + 1}</b>{t(step)}</p>
                ))}
              </div>
              <div>
                <strong>{t("Commands and prompts")}</strong>
                {activeGuide.commands.map((command) => <code key={command}>{command}</code>)}
              </div>
            </div>
          </article>
        </div>
        <div className="portal-doc-grid">
          <a href="#/guides/setup">
            <strong>{t("Installation")}</strong>
            <span>{t("Command shim, Python extras, environment capture.")}</span>
          </a>
          <a href="#/gallery">
            <strong>{t("Analysis examples")}</strong>
            <span>{t("Fragmentomics, CNV burden, methylation, variant, joint-source, and skill-memory previews.")}</span>
          </a>
          <a href="#/guides/deployment">
            <strong>{t("Local operating model")}</strong>
            <span>{t("CLI, web console, Python kernel, and local data boundaries.")}</span>
          </a>
          <a href={`./docs/${currentLanguage() === "zh-CN" ? "zh" : "en"}/reference/capability-matrix/`}>
            <strong>{t("Current capabilities and limits")}</strong>
            <span>{t("See available features, supported inputs, and operating boundaries.")}</span>
          </a>
        </div>
      </section>

      <section id="values" className="portal-section portal-values">
        <div>
          <p className="portal-kicker">{t("Team and values")}</p>
          <h2>{t("Built for answers your team can defend.")}</h2>
          <a className="portal-section-action" href="#/about">{t("Read the vision")}</a>
        </div>
        <div className="portal-value-grid">
          <article>
            <h3>{t("Start where the data lives")}</h3>
            <p>{t("Folders, questions, and result previews are first-class interactions.")}</p>
          </article>
          <article>
            <h3>{t("No silent magic")}</h3>
            <p>{t("Runs produce notes, blockers, outputs, and final summaries users can inspect.")}</p>
          </article>
          <article>
            <h3>{t("Local ownership")}</h3>
            <p>{t("Scientific computation stays local. Cloud models receive bounded context and the images you submit; compatible local models offer a private inference option.")}</p>
          </article>
        </div>
      </section>

      <PortalFooter />
    </main>
  );
}

function PortalGalleryPage({ route }: { route: string }) {
  const routeId = route.replace(/^#\/gallery\/?/, "");
  const initialSample = PORTAL_SAMPLE_RUNS.find((sample) => sample.id === routeId) || PORTAL_SAMPLE_RUNS[0];
  const [activeSample, setActiveSample] = useState(initialSample);
  const [activeSampleView, setActiveSampleView] = useState<PortalRunView>("chat");
  const [activeOperation, setActiveOperation] = useState<PortalAgentOperation>(PORTAL_AGENT_OPERATIONS[0]);

  useEffect(() => {
    const nextId = route.replace(/^#\/gallery\/?/, "");
    const nextSample = PORTAL_SAMPLE_RUNS.find((sample) => sample.id === nextId);
    if (nextSample) {
      setActiveSample(nextSample);
      setActiveSampleView("chat");
      setActiveOperation(PORTAL_AGENT_OPERATIONS[0]);
      window.setTimeout(() => scrollPortalElementIntoView("gallery-run-detail", 84, "auto"), 40);
      return;
    }
    setActiveSample(PORTAL_SAMPLE_RUNS[0]);
    setActiveSampleView("chat");
    setActiveOperation(PORTAL_AGENT_OPERATIONS[0]);
    window.setTimeout(() => scrollPortalToTop(), 40);
  }, [route]);


  const selectSample = (sample: typeof PORTAL_SAMPLE_RUNS[number], event?: MouseEvent<HTMLAnchorElement>) => {
    event?.preventDefault();
    setActiveSample(sample);
    setActiveSampleView("chat");
    setActiveOperation(PORTAL_AGENT_OPERATIONS[0]);
    window.location.hash = `#/gallery/${sample.id}`;
    window.setTimeout(() => {
      scrollPortalElementIntoView("gallery-run-detail");
    }, 30);
  };

  const selectOperation = (operation: PortalAgentOperation) => {
    setActiveOperation(operation);
    setActiveSampleView(operation.runView);
  };

  return (
    <main className="portal-shell">
      <div className="portal-bg" aria-hidden="true" />
      <PortalNav route={route} />

      <section className="portal-subhero">
        <p className="portal-kicker">{t("Gallery")}</p>
        <h1>{t("See analysis before you run it.")}</h1>
        <span>{t("Choose a liquid-biopsy workflow and inspect the chat, plan, artifacts, report, table, and visual output. ")}</span>
        <div className="portal-subnav">
          <a href="#/">{t("Home")}</a>
          <a href="#/guides/autopilot">{t("Autopilot guide")}</a>
          <PortalTryLink />
        </div>
      </section>

      <section className="portal-gallery-overview" aria-label={t("Example workflow overview")}>
        <div className="portal-gallery-overview-head">
          <p className="portal-kicker">{t("Workflow map")}</p>
          <h2>{t("Choose by signal, not by guesswork.")}</h2>
          <span>{t("Each example highlights a different liquid-biopsy operating pattern, from one cohort to multi-source runs.")}</span>
        </div>
        <div className="portal-sample-matrix">
          {PORTAL_SAMPLE_RUNS.map((sample) => (
            <a
              key={sample.id}
              href={`#/gallery/${sample.id}`}
              className={sample.id === activeSample.id ? "active" : ""}
              onClick={(event) => selectSample(sample, event)}
            >
              <small>{t(sample.dataset)}</small>
              <strong>{t(sample.label)}</strong>
              <span>{t(sample.focus)}</span>
              <div>
                {sample.capabilities.map((capability) => <em key={capability}>{t(capability)}</em>)}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="gallery-run-detail" className="portal-page-grid portal-gallery-page-grid">
        <aside className="portal-page-index" aria-label={t("Gallery examples")}>
          {PORTAL_SAMPLE_RUNS.map((sample) => (
            <a
              key={sample.id}
              href={`#/gallery/${sample.id}`}
              className={sample.id === activeSample.id ? "active" : ""}
              onClick={(event) => selectSample(sample, event)}
            >
              <strong>{t(sample.label)}</strong>
              <small>{t(sample.dataset)}</small>
              <span>{t(sample.intent)}</span>
            </a>
          ))}
        </aside>

        <article className="portal-deep-card">
          <div className="portal-sample-meta">
            <span>{t(activeSample.status)}</span>
            <strong>{t(activeSample.dataset)}</strong>
            <small>{t(activeSample.steps.join(" -> "))}</small>
          </div>
          <PortalSampleProvenance sample={activeSample} />
          <PortalRunExplorer
            sample={activeSample}
            activeView={activeSampleView}
            onViewChange={setActiveSampleView}
            deep
          />
          <PortalGalleryReceipt sample={activeSample} activeOperation={activeOperation} />
          <PortalRunPackage sample={activeSample} />
          <PortalRunTrace sample={activeSample} activeOperation={activeOperation} />
          <PortalOperationPlaybook
            sample={activeSample}
            activeOperation={activeOperation}
            onOperationChange={selectOperation}
          />
          <div className="portal-deep-actions">
            <PortalTryLink className="portal-primary" />
            <a className="portal-secondary" href="#/guides/autopilot">{t("Open run guide")}</a>
          </div>
        </article>
      </section>

      <PortalFooter />
    </main>
  );
}

function PortalGuidesPage({ route }: { route: string }) {
  const routeId = route.replace(/^#\/guides\/?/, "");
  const initialGuide = PORTAL_GUIDE_MODULES.find((guide) => guide.id === routeId) || PORTAL_GUIDE_MODULES[0];
  const [activeGuide, setActiveGuide] = useState(initialGuide);
  const [activePathway, setActivePathway] = useState<PortalGuidePathway>(
    PORTAL_GUIDE_PATHWAYS.find((pathway) => pathway.guideId === initialGuide.id) || PORTAL_GUIDE_PATHWAYS[0]
  );
  const [activeGuideConcept, setActiveGuideConcept] = useState<PortalGuideConcept>(
    portalGuideConceptForGuide(initialGuide.id)
  );
  const [activeMethodGuide, setActiveMethodGuide] = useState<PortalMethodAtlasItem>(PORTAL_METHOD_ATLAS[0]);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const activeGuideIndex = PORTAL_GUIDE_MODULES.findIndex((guide) => guide.id === activeGuide.id);
  const previousGuide = activeGuideIndex > 0 ? PORTAL_GUIDE_MODULES[activeGuideIndex - 1] : null;
  const nextGuide = activeGuideIndex >= 0 && activeGuideIndex < PORTAL_GUIDE_MODULES.length - 1
    ? PORTAL_GUIDE_MODULES[activeGuideIndex + 1]
    : null;

  useEffect(() => {
    const nextId = route.replace(/^#\/guides\/?/, "");
    const nextGuide = PORTAL_GUIDE_MODULES.find((guide) => guide.id === nextId);
    if (nextGuide) {
      setActiveGuide(nextGuide);
      setActiveGuideConcept(portalGuideConceptForGuide(nextGuide.id));
      setActivePathway((current) =>
        current.guideId === nextGuide.id
          ? current
          : PORTAL_GUIDE_PATHWAYS.find((pathway) => pathway.guideId === nextGuide.id) || current
      );
      window.setTimeout(() => scrollPortalElementIntoView("guide-detail", 84, "auto"), 40);
      return;
    }
    setActiveGuide(PORTAL_GUIDE_MODULES[0]);
    setActivePathway(PORTAL_GUIDE_PATHWAYS[0]);
    setActiveGuideConcept(PORTAL_GUIDE_CONCEPTS[0]);
    window.setTimeout(() => scrollPortalToTop(), 40);
  }, [route]);


  const selectGuide = (guide: typeof PORTAL_GUIDE_MODULES[number]) => {
    setActiveGuide(guide);
    setActivePathway((current) =>
      current.guideId === guide.id
        ? current
        : PORTAL_GUIDE_PATHWAYS.find((pathway) => pathway.guideId === guide.id) || current
    );
    setCopiedCommand(null);
    window.location.hash = `#/guides/${guide.id}`;
    window.setTimeout(() => scrollPortalElementIntoView("guide-detail"), 30);
  };

  const selectPathway = (pathway: PortalGuidePathway) => {
    const guide = PORTAL_GUIDE_MODULES.find((item) => item.id === pathway.guideId) || PORTAL_GUIDE_MODULES[0];
    setActivePathway(pathway);
    selectGuide(guide);
  };

  const openConceptGuide = (concept: PortalGuideConcept) => {
    const guide = PORTAL_GUIDE_MODULES.find((item) => item.id === concept.guideId) || PORTAL_GUIDE_MODULES[0];
    selectGuide(guide);
  };

  const copyGuideCommand = async (command: string) => {
    try {
      await navigator.clipboard?.writeText(command);
    } catch {
      // Clipboard can be unavailable in restricted browsers; the visible command remains selectable.
    }
    setCopiedCommand(command);
    window.setTimeout(() => setCopiedCommand((value) => (value === command ? null : value)), 1600);
  };

  return (
    <main className="portal-shell">
      <div className="portal-bg" aria-hidden="true" />
      <PortalNav route={route} />

      <section className="portal-subhero">
        <p className="portal-kicker">{t("Guides")}</p>
        <h1>{t("Launch fast. Run clean.")}</h1>
        <span>{t("Short interactive guides for setup, data binding, autopilot, results, model control, deployment, and the full method docs. ")}</span>
        <div className="portal-subnav">
          <a href="#/">{t("Home")}</a>
          <a href="#/gallery">{t("Examples")}</a>
          <PortalTryLink />
        </div>
      </section>

      <section className="portal-guide-flow" aria-label={t("Liquid Agent onboarding flow")}>
        <div className="portal-guide-flow-head">
          <div>
            <p className="portal-kicker">{t("Onboarding path")}</p>
            <h2>{t("From install to first reviewed output.")}</h2>
          </div>
          <span>{activeGuideIndex + 1} / {t(PORTAL_GUIDE_MODULES.length)}</span>
        </div>
        <div className="portal-guide-flow-steps">
          {PORTAL_GUIDE_MODULES.map((guide, index) => {
            const state = index === activeGuideIndex ? "active" : index < activeGuideIndex ? "complete" : "pending";
            return (
              <button
                key={guide.id}
                type="button"
                className={state}
                onClick={() => selectGuide(guide)}
              >
                <small>{t(String(index + 1).padStart(2, "0"))}</small>
                <strong>{t(guide.title)}</strong>
                <span>{t(guide.kicker)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="portal-guide-map" aria-label={t("Liquid Agent guide concept map")}>
        <div className="portal-guide-map-head">
          <div>
            <p className="portal-kicker">{t("Concept map")}</p>
            <h2>{t("Pick the idea, then open the exact guide.")}</h2>
          </div>
          <a href={activeGuideConcept.exampleHref}>{t("Related surface")}</a>
        </div>
        <div className="portal-guide-map-grid">
          <div className="portal-guide-concept-list">
            {PORTAL_GUIDE_CONCEPTS.map((concept) => (
              <button
                key={concept.id}
                type="button"
                className={concept.id === activeGuideConcept.id ? "active" : ""}
                onClick={() => setActiveGuideConcept(concept)}
              >
                <strong>{t(concept.label)}</strong>
                <span>{t(concept.title)}</span>
              </button>
            ))}
          </div>
          <article className="portal-guide-concept-detail">
            <p className="portal-kicker">{t(activeGuideConcept.label)}</p>
            <h3>{t(activeGuideConcept.title)}</h3>
            <span>{t(activeGuideConcept.body)}</span>
            <button type="button" onClick={() => void copyGuideCommand(activeGuideConcept.command)}>
              <code>{activeGuideConcept.command}</code>
              <small>{copiedCommand === activeGuideConcept.command ? t("copied") : t("copy")}</small>
            </button>
            <div>
              {activeGuideConcept.proof.map((item) => <em key={item}>{t(item)}</em>)}
            </div>
            <nav aria-label={t("{0} concept actions", { 0: t(activeGuideConcept.label) })}>
              <button type="button" onClick={() => openConceptGuide(activeGuideConcept)}>{t("Open guide ")}</button>
              <a href={activeGuideConcept.exampleHref}>{t("View example")}</a>
            </nav>
          </article>
        </div>
      </section>

      <section className="portal-method-atlas" aria-label={t("Liquid Agent method atlas")}>
        <div className="portal-method-atlas-head">
          <div>
            <p className="portal-kicker">{t("Method atlas")}</p>
            <h2>{t("Match the polished guide to the full project docs.")}</h2>
          </div>
          <code>{activeMethodGuide.docPath}</code>
        </div>
        <div className="portal-method-atlas-grid">
          <div className="portal-method-list">
            {PORTAL_METHOD_ATLAS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === activeMethodGuide.id ? "active" : ""}
                onClick={() => setActiveMethodGuide(item)}
              >
                <small>{t(item.label)}</small>
                <strong>{t(item.title)}</strong>
              </button>
            ))}
          </div>
          <article className="portal-method-detail">
            <p className="portal-kicker">{t(activeMethodGuide.label)}</p>
            <h3>{t(activeMethodGuide.title)}</h3>
            <span>{t(activeMethodGuide.body)}</span>
            <button type="button" onClick={() => void copyGuideCommand(activeMethodGuide.command)}>
              <code>{activeMethodGuide.command}</code>
              <small>{copiedCommand === activeMethodGuide.command ? t("copied") : t("copy")}</small>
            </button>
            <div>
              {activeMethodGuide.proof.map((item) => <em key={item}>{t(item)}</em>)}
            </div>
            <nav aria-label={t("{0} method actions", { 0: t(activeMethodGuide.label) })}>
              <a href={activeMethodGuide.guideHref}>{t("Open web guide")}</a>
              <a href={activeMethodGuide.exampleHref}>{t("View example")}</a>
            </nav>
          </article>
        </div>
      </section>

      <section className="portal-guide-chooser" aria-label={t("Guide start chooser")}>
        <div className="portal-guide-chooser-head">
          <div>
            <p className="portal-kicker">{t("Start chooser")}</p>
            <h2>{t("Tell the guide what you are trying to do.")}</h2>
          </div>
          <a href={activeGuide.exampleHref}>{t("Related example")}</a>
        </div>
        <div className="portal-guide-chooser-grid">
          <div className="portal-guide-chooser-list">
            {PORTAL_GUIDE_PATHWAYS.map((pathway) => (
              <button
                key={pathway.id}
                type="button"
                className={pathway.id === activePathway.id ? "active" : ""}
                onClick={() => selectPathway(pathway)}
              >
                <strong>{t(pathway.label)}</strong>
                <span>{t(pathway.title)}</span>
              </button>
            ))}
          </div>
          <article className="portal-guide-chooser-detail">
            <p className="portal-kicker">{t(activePathway.label)}</p>
            <h3>{t(activePathway.title)}</h3>
            <span>{t(activePathway.body)}</span>
            <button type="button" onClick={() => void copyGuideCommand(activePathway.command)}>
              <code>{activePathway.command}</code>
              <small>{copiedCommand === activePathway.command ? t("copied") : t("copy")}</small>
            </button>
            <div>
              {activePathway.checks.map((check) => <em key={check}>{t(check)}</em>)}
            </div>
            <nav aria-label={t("{0} guide actions", { 0: t(activePathway.label) })}>
              <a href={`#/guides/${activePathway.guideId}`}>{t("Open guide")}</a>
              <PortalTryLink />
            </nav>
          </article>
        </div>
      </section>

      <section className="portal-page-grid portal-guide-page-grid">
        <aside className="portal-page-index" aria-label={t("Guide modules")}>
          {PORTAL_GUIDE_MODULES.map((guide) => (
            <button
              key={guide.id}
              type="button"
              className={guide.id === activeGuide.id ? "active" : ""}
              onClick={() => selectGuide(guide)}
            >
              <small>{t(guide.kicker)}</small>
              <strong>{t(guide.title)}</strong>
              <span>{t(guide.summary)}</span>
            </button>
          ))}
        </aside>

        <article id="guide-detail" className="portal-deep-card portal-guide-deep-card">
          <p className="portal-kicker">{t(activeGuide.kicker)}</p>
          <h2>{t(activeGuide.title)}</h2>
          <span>{t(activeGuide.summary)}</span>
          <div className="portal-guide-outcome">
            <small>{t("Outcome")}</small>
            <strong>{t(activeGuide.outcome)}</strong>
          </div>
          <div className="portal-guide-columns">
            <div>
              <strong>{t("Workflow")}</strong>
              {activeGuide.steps.map((step, index) => (
                <p key={step}><b>{index + 1}</b>{t(step)}</p>
              ))}
            </div>
            <div className="portal-command-rail">
              <strong>{t("Commands and prompts")}</strong>
              {activeGuide.commands.map((command) => (
                <button key={command} type="button" onClick={() => void copyGuideCommand(command)}>
                  <code>{command}</code>
                  <span>{portalCopyLabel(copiedCommand, command, "copy", "copied")}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="portal-guide-stepper" aria-label={t("Guide sequence")}>
            <button type="button" disabled={!previousGuide} onClick={() => previousGuide && selectGuide(previousGuide)}>
              <small>{t("Previous")}</small>
              <strong>{t(previousGuide?.title) || t("Start")}</strong>
            </button>
            <button type="button" disabled={!nextGuide} onClick={() => nextGuide && selectGuide(nextGuide)}>
              <small>{t("Next")}</small>
              <strong>{t(nextGuide?.title) || t("Complete")}</strong>
            </button>
          </div>
          <div className="portal-guide-reference">
            <a href={activeGuide.exampleHref}>{t("See related example")}</a>
            <a href="#/guides/deployment">{t("Portal deployment model")}</a>
            <PortalTryLink />
          </div>
        </article>
      </section>

      <PortalFooter />
    </main>
  );
}

function PortalAboutPage() {
  const [activeValue, setActiveValue] = useState(PORTAL_ABOUT_VALUES[0]);
  const [activeScenario, setActiveScenario] = useState<PortalRoleScenario>(PORTAL_ROLE_SCENARIOS[0]);
  const [activeProjectLayer, setActiveProjectLayer] = useState(PORTAL_PROJECT_MAP[0]);


  return (
    <main className="portal-shell">
      <div className="portal-bg" aria-hidden="true" />
      <PortalNav route="#/about" />

      <section className="portal-subhero portal-about-hero">
        <p className="portal-kicker">{t("Vision")}</p>
        <h1>{t("Make liquid-biopsy analysis feel immediate.")}</h1>
        <span>{t("The goal is not another dashboard. It is a local scientific agent that turns messy data folders into traceable plans, reproducible outputs, and defensible next steps. ")}</span>
        <div className="portal-subnav">
          <a href="#/">{t("Home")}</a>
          <a href="#/gallery">{t("Examples")}</a>
          <a href="#/guides">{t("Guides")}</a>
          <PortalTryLink />
        </div>
      </section>

      <section className="portal-about-grid">
        <article className="portal-manifesto-card">
          <p className="portal-kicker">{t("Mission")}</p>
          <h2>{t("From files to findings, without turning scientists into software engineers.")}</h2>
          <span>{t("Liquid Agent is built for translational teams that need speed, local control, and outputs that can be reviewed by humans before they influence decisions. ")}</span>
        </article>
        <div className="portal-about-values portal-principle-lab">
          <div className="portal-principle-list" aria-label={t("Operating principles")}>
            {PORTAL_ABOUT_VALUES.map((value) => (
              <button
                key={value.title}
                type="button"
                className={value.title === activeValue.title ? "active" : ""}
                onClick={() => setActiveValue(value)}
              >
                <strong>{t(value.title)}</strong>
                <span>{t(value.body)}</span>
              </button>
            ))}
          </div>
          <article className="portal-principle-detail">
            <p className="portal-kicker">{t("Operating principle")}</p>
            <h3>{t(activeValue.title)}</h3>
            <span>{t(activeValue.body)}</span>
            <div>
              <small>{t("How this shows up")}</small>
              <strong>{t(activeValue.proof)}</strong>
            </div>
            <a href={activeValue.href}>{t("Explore this in the product")}</a>
          </article>
        </div>
      </section>

      <section className="portal-project-map" aria-label={t("Liquid Agent project map")}>
        <div className="portal-section-heading">
          <p>{t("Project map")}</p>
          <h2>{t("One product surface. Four connected layers.")}</h2>
          <span>{t("The portal is the front door, but real analysis stays local and auditable. Each layer has a clear job so the system stays explainable. ")}</span>
        </div>
        <div className="portal-project-map-grid">
          <div className="portal-project-layer-list" aria-label={t("Project layers")}>
            {PORTAL_PROJECT_MAP.map((layer, index) => (
              <button
                key={layer.label}
                type="button"
                className={layer.label === activeProjectLayer.label ? "active" : ""}
                onClick={() => setActiveProjectLayer(layer)}
              >
                <small>{t(String(index + 1).padStart(2, "0"))}</small>
                <strong>{t(layer.label)}</strong>
                <span>{t(layer.title)}</span>
              </button>
            ))}
          </div>
          <article className="portal-project-layer-detail">
            <p className="portal-kicker">{t("Selected layer")}</p>
            <h3>{t(activeProjectLayer.title)}</h3>
            <span>{t(activeProjectLayer.body)}</span>
            <div>
              {activeProjectLayer.proof.map((item) => <small key={item}>{t(item)}</small>)}
            </div>
            <a href={activeProjectLayer.href}>{t("Open related product path")}</a>
          </article>
        </div>
      </section>

      <section className="portal-role-lab" aria-label={t("Liquid Agent role scenarios")}>
        <div className="portal-section-heading">
          <p>{t("Role scenarios")}</p>
          <h2>{t("Built around the jobs inside a liquid-biopsy team.")}</h2>
          <span>{t("These are not testimonials. They show the collaboration scenarios the product supports.")}</span>
        </div>
        <div className="portal-role-board">
          <div className="portal-role-list">
            {PORTAL_ROLE_SCENARIOS.map((scenario) => (
              <button
                key={scenario.role}
                type="button"
                className={scenario.role === activeScenario.role ? "active" : ""}
                onClick={() => setActiveScenario(scenario)}
              >
                <small>{t(scenario.role)}</small>
                <strong>{t(scenario.moment)}</strong>
              </button>
            ))}
          </div>
          <article className="portal-role-detail">
            <p className="portal-kicker">{t(activeScenario.role)}</p>
            <h3>{t(activeScenario.ask)}</h3>
            <span>{t(activeScenario.agent)}</span>
            <div className="portal-role-receipt">
              <small>{t("Reviewable receipt")}</small>
              <strong>{t(activeScenario.receipt)}</strong>
            </div>
            <div className="portal-role-proof">
              {activeScenario.proof.map((item) => <small key={item}>{t(item)}</small>)}
            </div>
            <a href={activeScenario.href}>{t("Open matching path")}</a>
          </article>
        </div>
      </section>

      <section className="portal-team-model">
        <div className="portal-section-heading">
          <p>{t("Team model")}</p>
          <h2>{t("Scientists stay in control. Automation does the repetitive work.")}</h2>
        </div>
        <div className="portal-team-strip">
          {PORTAL_TEAM_MODEL.map((item) => (
            <article key={item.label}>
              <span>{t(item.label)}</span>
              <h3>{t(item.title)}</h3>
              <p>{t(item.body)}</p>
            </article>
          ))}
        </div>
      </section>



      <PortalFooter />
    </main>
  );
}

export function App() {
  useSyncExternalStore(subscribeLanguage, currentLanguage, () => "en");
  const route = useHashRoute();
  if (route.startsWith("#/gallery")) return <PortalGalleryPage route={route} />;
  if (route.startsWith("#/guides")) return <PortalGuidesPage route={route} />;
  if (route.startsWith("#/about")) return <PortalAboutPage />;
  return <PortalHome route={route} />;
}
