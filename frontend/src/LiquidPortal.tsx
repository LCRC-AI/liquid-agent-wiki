import { useEffect, useRef, useState } from "react";
import { PortalAppearance } from "./PortalAppearance";
import { PortalCapabilities } from "./PortalCapabilities";
import { PortalWave } from "./PortalWave";
import { currentLanguage, t } from "./i18n";

const DNA_HISTORY = "https://le.ac.uk/news/2019/september/10-celebrating-35-years-of-dna-fingerprinting";
const LIQUID_RESEARCH = "https://le.ac.uk/lcrc/research/liquid-biopsy-for-detection-and-stratification-of-cancer";

function docsHref(path = "") {
  return `./docs/${currentLanguage() === "zh-CN" ? "zh" : "en"}/${path}`;
}

// Keep existing bookmarks useful while moving detailed instruction into Docs.
function legacyDestination(route: string): string | null {
  const section = route.replace(/^#\//, "").split("?")[0];
  if (["about", "values", "mission"].includes(section)) return "#/story";
  if (["capabilities", "evidence"].includes(section)) return "#/explore";
  if (section === "install" || section === "guides/setup") return docsHref("getting-started/installation/");
  if (section === "gallery") return docsHref("getting-started/workspace-walkthrough/");
  if (section.startsWith("gallery/")) {
    const page = section.split("/")[1];
    return docsHref(page === "joint" ? "guides/linked-tasks-and-memory/" : page === "skills" ? "guides/professional-skills/" : "guides/cfdna-analysis/");
  }
  if (section.startsWith("guides/")) {
    const guide = section.split("/")[1];
    const paths: Record<string, string> = {
      data: "getting-started/web-ui/", results: "getting-started/web-ui/",
      autopilot: "getting-started/quickstart/", llm: "guides/openai-configuration/",
      deployment: "getting-started/installation/", privacy: "guides/local-data-privacy/",
    };
    return docsHref(paths[guide] || "getting-started/workspace-walkthrough/");
  }
  if (section === "guides" || section === "modes") return docsHref();
  if (section === "trust") return docsHref("guides/local-data-privacy/");
  return null;
}

function PortalHeader({ page }: { page: string }) {
  const docs = docsHref();
  return <header className="liquid-header">
    <nav className="portal-nav liquid-navigation" aria-label={t("Portal navigation")}>
      <a className="liquid-brand" href="#/" aria-label={t("LIQUID-Agent home")}>
        <img src="./assets/portal/liquid-agent-mark.png" width="29" height="29" alt="" />
        <span>LIQUID-Agent</span>
      </a>
      <div className="portal-tags liquid-links">
        <a href="#/explore" aria-current={page === "explore" ? "page" : undefined}>{t("Explore")}</a>
        <a href="#/story" aria-current={page === "story" ? "page" : undefined}>{t("Our story")}</a>
        <a href={docs}>{t("Docs")}</a>
      </div>
      <div className="liquid-header-actions">
        <PortalAppearance showTheme={false} />
        <a className="portal-nav-cta liquid-button" href={docsHref("getting-started/installation/")}>{t("Try it")}</a>
      </div>
      <details className="liquid-mobile-menu" key={page} onClick={event => {
        if (!(event.target instanceof Element) || !event.target.closest("a")) return;
        event.currentTarget.open = false;
        event.currentTarget.querySelector<HTMLElement>("summary")?.focus();
      }}>
        <summary aria-label={t("Open portal menu")}>{t("Menu")}</summary>
        <nav aria-label={t("Mobile navigation")}>
          <a href="#/explore" aria-current={page === "explore" ? "page" : undefined}>{t("Explore")}</a>
          <a href="#/story" aria-current={page === "story" ? "page" : undefined}>{t("Our story")}</a>
          <a href={docs}>{t("Docs")}</a>
          <PortalAppearance showTheme={false} />
        </nav>
      </details>
    </nav>
  </header>;
}

const FOOTER_GROUPS = [
  { title: "Start", links: [
    { label: "Install", path: "getting-started/installation/" },
    { label: "Attach data", path: "getting-started/web-ui/" },
    { label: "Plan and run", path: "getting-started/quickstart/" },
    { label: "Review outputs", path: "guides/images-and-result-actions/" },
  ] },
  { title: "Examples", links: [
    { label: "Fragmentomics", path: "guides/cfdna-analysis/" },
    { label: "LPWGS / CNV", path: "guides/cfdna-analysis/" },
    { label: "Joint sources", path: "guides/linked-tasks-and-memory/" },
    { label: "Skill memory", path: "guides/professional-skills/" },
  ] },
  { title: "Resources", links: [
    { label: "Docs", path: "" },
    { label: "Workflow examples", path: "getting-started/workspace-walkthrough/" },
    { label: "Current capabilities", path: "reference/capability-matrix/" },
  ] },
];

function PortalFooter() {
  return <footer className="portal-footer liquid-footer" aria-label={t("Liquid Agent site map")}>
    <div className="liquid-footer-top">
      <div className="liquid-footer-brand">
        <a className="liquid-footer-wordmark" href="#/">LIQUID-Agent</a>
        <a className="liquid-university-logo" href="https://le.ac.uk/" target="_blank" rel="noreferrer">
          <img src="./assets/portal/university-of-leicester.svg" width="180" height="48" alt={t("University of Leicester")} loading="lazy" />
        </a>
      </div>
      {FOOTER_GROUPS.map(group => <nav key={group.title} aria-label={t("{0} links", { 0: t(group.title) })}>
        <h2>{t(group.title)}</h2>
        {group.links.map(link => <a key={link.label} href={docsHref(link.path)}>{t(link.label)}</a>)}
        {group.title === "Resources" && <a href="https://github.com/LCRC-AI/liquid-agent-wiki" target="_blank" rel="noreferrer">{t("Public repository")}</a>}
      </nav>)}
    </div>
    <div className="liquid-footer-bottom">
      <span>© {new Date().getFullYear()} LIQUID-Agent.</span>
      <span>{t("For liquid-biopsy research.")}</span>
      <a className="portal-footer-terms" href={docsHref("release-terms/")}>{t("Terms of Use")}</a>
    </div>
  </footer>;
}

function PortalHome() {
  return <main id="liquid-main" tabIndex={-1}>
    <section className="portal-hero liquid-hero liquid-hero-immersive">
      <PortalWave className="liquid-hero-wave" />
      <div className="liquid-hero-body">
        <h1>{t("Tracing the origins of danger.")}</h1>
        <p>{t("AI for liquid-biopsy research, helping scientists investigate the molecular signals of cancer.")}</p>
        <a className="liquid-text-link" href="#/explore">{t("Explore LIQUID-Agent")}</a>
      </div>
    </section>
    <section className="liquid-home-statement">
      <h2>{t("Earlier insight begins with a closer look.")}</h2>
      <p>{t("We bring intelligence to the research question, helping scientists follow small signals toward a deeper understanding of cancer.")}</p>
      <a className="liquid-text-link" href="#/story">{t("Our story")}</a>
    </section>
  </main>;
}

function PortalStory() {
  return <main id="liquid-main" className="liquid-story" tabIndex={-1}>
    <section className="portal-hero liquid-hero">
      <h1>{t("Earlier insight. More tomorrows.")}</h1>
      <p>{t("Our ambition is to help researchers understand cancer sooner, through the molecular clues it leaves behind.")}</p>
    </section>
    <section className="liquid-history" aria-labelledby="liquid-history-title">
      <div className="liquid-history-year" aria-hidden="true">1984</div>
      <div className="liquid-story-copy">
        <h2 id="liquid-history-title">{t("A discovery that taught us to look closer.")}</h2>
        <p>{t("In 1984, Sir Alec Jeffreys discovered DNA fingerprinting at the University of Leicester, revealing the power of looking closely at molecular differences.")}</p>
        <p>{t("That breakthrough transformed forensic science. Its enduring lesson is broader: small differences can carry profound meaning.")}</p>
        <a className="liquid-text-link" href={DNA_HISTORY} target="_blank" rel="noreferrer">{t("The Leicester discovery")}</a>
      </div>
    </section>
    <section className="liquid-research-story">
      <h2>{t("From identity to possibility.")}</h2>
      <p>{t("Today, Leicester’s liquid-biopsy research investigates cancer signals in blood, including circulating tumour DNA, to study detection, relapse and treatment response.")}</p>
      <a className="liquid-text-link" href={LIQUID_RESEARCH} target="_blank" rel="noreferrer">{t("Liquid-biopsy research at Leicester")}</a>
    </section>
    <section className="liquid-ambition">
      <h2>{t("Intelligence in service of life.")}</h2>
      <p>{t("Inspired by that scientific tradition, LIQUID-Agent brings AI into liquid-biopsy analysis, helping researchers connect data, evidence and the next meaningful question.")}</p>
      <p>{t("We work toward a future where earlier understanding opens more possibilities. Scientific judgment remains with the researcher; our role is to support it.")}</p>
      <a className="liquid-text-link" href="#/explore">{t("Explore the research workspace")}</a>
    </section>
  </main>;
}

export function LiquidPortal({ route }: { route: string }) {
  const shell = useRef<HTMLDivElement>(null);
  const language = currentLanguage();
  const destination = legacyDestination(route);
  const page = route.startsWith("#/explore") ? "explore" : route.startsWith("#/story") ? "story" : "home";
  const [immersed, setImmersed] = useState(page === "home");
  useEffect(() => {
    setImmersed(page === "home");
    const hero = shell.current?.querySelector(".liquid-hero-immersive");
    if (page !== "home" || !hero) return;
    const observer = new IntersectionObserver(([entry]) => setImmersed(entry.isIntersecting), {
      root: shell.current, rootMargin: "-76px 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [page]);
  useEffect(() => {
    document.title = `LIQUID-Agent | ${page === "explore" ? t("Explore") : page === "story" ? t("Our story") : t("Tracing the origins of danger.")}`;
  }, [page, language]);
  useEffect(() => {
    if (destination) { window.location.replace(destination); return; }
    shell.current?.scrollTo({ top: 0, behavior: "instant" });
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      shell.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(menu => {
        menu.open = false;
        menu.querySelector<HTMLElement>("summary")?.focus();
      });
    };
    shell.current?.addEventListener("keydown", closeMenu);
    const element = shell.current;
    return () => element?.removeEventListener("keydown", closeMenu);
  }, [route, destination, page]);
  return <div ref={shell} className={`liquid-portal${page === "home" ? " liquid-portal-home" : ""}${immersed && page === "home" ? " liquid-portal-immersed" : ""}`}>
    <a className="liquid-skip" href="#liquid-main" onClick={event => {
      event.preventDefault();
      document.getElementById("liquid-main")?.focus();
    }}>{t("Skip to content")}</a>
    <PortalHeader page={page} />
    {page === "explore" ? <PortalCapabilities /> : page === "story" ? <PortalStory /> : <PortalHome />}
    <PortalFooter />
  </div>;
}
