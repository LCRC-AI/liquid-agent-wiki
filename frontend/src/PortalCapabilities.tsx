import { useEffect, useState } from "react";
import { currentLanguage, t } from "./i18n";
import "./portal-capabilities.css";

const researchSteps = [
  {
    title: "Understand your data.",
    body: "Inspect supported liquid-biopsy inputs, sample metadata and quality before deciding which questions the data can answer.",
  },
  {
    title: "Plan and run the analysis.",
    body: "Turn a research question into a focused plan. Review the next step, run the analysis and inspect its outputs.",
  },
  {
    title: "Continue from the evidence.",
    body: "Ask follow-up questions from figures, tables and completed work, keeping the source evidence and its limitations in view.",
  },
];

export function PortalCapabilities() {
  const docs = `./docs/${currentLanguage() === "zh-CN" ? "zh" : "en"}/`;
  const [playing, setPlaying] = useState(() =>
    typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [restart, setRestart] = useState(0);
  const [animationFailed, setAnimationFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => {
      setAnimationFailed(false);
      setPosterFailed(false);
      if (!event.matches) setRestart(value => value + 1);
      setPlaying(!event.matches);
    };
    preference.addEventListener("change", onChange);
    return () => preference.removeEventListener("change", onChange);
  }, []);

  const toggleDemo = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setAnimationFailed(false);
    setPosterFailed(false);
    // A fresh URL gives the original GIF a new decoder and restarts its first frame.
    setRestart(value => value + 1);
    setPlaying(true);
  };
  const demoSource = playing
    ? `./assets/liquid-agent-demo.gif${restart ? `?play=${restart}` : ""}`
    : "./assets/portal/liquid-agent-demo-poster.png";

  return (
    <main id="liquid-main" className="liquid-capabilities" aria-labelledby="liquid-explore-title" tabIndex={-1}>
      <section className="liquid-capabilities-hero">
        <h1 id="liquid-explore-title">{t("Start with data. Get to analysis.")}</h1>
        <p>{t("A liquid-biopsy research workspace for turning questions into plans, results and continuing investigation.")}</p>
        <a className="liquid-text-link" href={docs}>{t("Read the Docs")}</a>
      </section>

      <figure className="liquid-capabilities-demo" data-motion={posterFailed ? "unavailable" : playing ? "playing" : "stopped"}>
        {posterFailed ? <div className="liquid-capabilities-demo-unavailable" role="status">
          {t("The demo preview could not be loaded.")}
        </div> : <img
          key={demoSource}
          src={demoSource}
          width="2292"
          height="1440"
          loading="lazy"
          decoding="async"
          alt={t("LiquidBiopsy workspace demo showing a research question, an analysis plan, and results.")}
          onError={() => {
            if (playing) {
              setAnimationFailed(true);
              setPlaying(false);
            } else {
              setPosterFailed(true);
            }
          }}
        />}
        <figcaption>
          <span>{t("A look inside the research workspace.")}</span>
          <button className="liquid-capabilities-demo-control" type="button" onClick={toggleDemo}>
            {t(playing ? "Stop demo" : "Play demo")}
          </button>
        </figcaption>
        {animationFailed && !posterFailed && <p className="liquid-capabilities-demo-error" role="status">
          {t("The animated demo could not be loaded. A still image is shown.")}
        </p>}
      </figure>

      <div className="liquid-capabilities-workflow">
        {researchSteps.map((step) => (
          <article className="liquid-capabilities-step" key={step.title}>
            <h2>{t(step.title)}</h2>
            <p>{t(step.body)}</p>
          </article>
        ))}
      </div>

      <a className="liquid-capabilities-docs" href={`${docs}getting-started/workspace-walkthrough/`}>
        {t("Read the research workflow")}
      </a>
    </main>
  );
}
