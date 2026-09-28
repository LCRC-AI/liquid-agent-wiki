import { currentLanguage, t } from "./i18n";

const capabilities = [
  { title: "Plan, run, and follow the evidence", body: "Review a focused plan, run its next step, inspect figures and tables, then continue from completed work. Frozen prediction studies keep training and validation separate.", path: "reference/capability-matrix/" },
  { title: "Ask directly from a figure", body: "Select a result region or combine up to four images in one question. Where a figure has a data map, follow the selected marks back to their source evidence.", path: "guides/images-and-result-actions/" },
  { title: "Connect work across tasks", body: "Select two or more conversations to create a linked task with source summaries. Compare findings and publish a combined report without losing the original context.", path: "guides/linked-tasks-and-memory/" },
  { title: "Keep useful context, quietly", body: "Task memory preserves progress and corrections. User memory carries relevant preferences across conversations; current instructions take priority as older adaptive context gradually fades.", path: "guides/linked-tasks-and-memory/" },
  { title: "Review how your skills evolve", body: "The agent can draft reusable improvements from your instructions. Inspect additions and deletions, then accept or refuse them in chat or the Skills library.", path: "guides/professional-skills/" },
  { title: "Choose cloud or local inference", body: "Use GPT-6 Luna, Sol or Astra, optional Gemini, or a compatible local multimodal model. Named profiles share the scientific tools; assess hardware fit and model quality for your workload.", path: "guides/local-models/" },
];

export function PortalOverview() {
  const docs = `./docs/${currentLanguage() === "zh-CN" ? "zh" : "en"}/`;
  return (
    <section id="portal-research" className="portal-section portal-research" aria-labelledby="portal-research-title">
      <div className="portal-research-intro">
        <p className="portal-kicker">{t("The research workspace")}</p>
        <h2 id="portal-research-title">{t("One question can become a continuing investigation.")}</h2>
        <p>{t("Work with cfDNA signals, declared cfRNA and assay tables, or completed study outputs. Each step keeps its inputs, results and limitations in view.")}</p>
        <a className="portal-text-link" href={`${docs}reference/capability-matrix/`}>{t("Current capabilities and limits")} <span aria-hidden="true">↗</span></a>
      </div>
      <div className="portal-capability-index">
        {capabilities.map((item, index) => (
          <a key={item.path + item.title} href={docs + item.path}>
            <span className="portal-index-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div><h3>{t(item.title)}</h3><p>{t(item.body)}</p></div>
            <span className="portal-index-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      <div className="portal-evidence-strip">
        <a href={`${docs}getting-started/workspace-walkthrough/`}>
          <img src="./assets/portal/figure-follow-up.png" loading="lazy" decoding="async" width="1680" height="1100" alt={t("Real workspace: regions from two different cfRNA figures attached to one question.")} />
          <span><small>01 / {t("FIGURE FOLLOW-UP")}</small><strong>{t("Two figures. One grounded question.")}</strong></span>
        </a>
        <a href={`${docs}guides/linked-tasks-and-memory/`}>
          <img src="./assets/portal/linked-tasks.png" loading="lazy" decoding="async" width="1680" height="1100" alt={t("Real workspace: a linked conversation compares registered results from two source tasks.")} />
          <span><small>02 / {t("LINKED TASKS")}</small><strong>{t("Bring separate results into the same conversation.")}</strong></span>
        </a>
        <p>{t("Screenshots come from documented API-backed workflows. Branding has since been refreshed; current controls and model labels may differ.")}</p>
      </div>
    </section>
  );
}
