import { useEffect, useRef } from "react";
import { portalText as t } from "./portalText";
import "./portal-research-stats.css";

// Catalogue counts, not a claim that every method is an installed executable.
// References use a conservative lower bound across the maintained evidence.
const researchMetrics = [
  { value: 15, label: "Assay & data workflows" },
  { value: 34, label: "Research skills" },
  { value: 48, label: "Catalogued methods & tools" },
  { value: 53, suffix: "+", label: "Research references" },
];

export function PortalResearchStats() {
  const section = useRef<HTMLElement>(null);
  const metrics = useRef<HTMLDListElement>(null);
  const complete = useRef(false);

  useEffect(() => {
    const grid = metrics.current;
    if (!grid) return;
    const digits = Array.from(grid.querySelectorAll<HTMLElement>("[data-count-target]"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let started = false;

    const finish = () => {
      cancelAnimationFrame(frame);
      for (const digit of digits) digit.textContent = digit.dataset.countTarget || "0";
      complete.current = true;
      observer?.disconnect();
    };
    const start = () => {
      if (started || complete.current) return;
      started = true;
      observer?.disconnect();
      const began = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - began) / 700, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        for (const digit of digits) {
          const value = String(Math.floor(Number(digit.dataset.countTarget) * eased));
          if (digit.textContent !== value) digit.textContent = value;
        }
        if (progress < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    };
    const onPreference = () => {
      if (preference.matches) finish();
    };

    if (complete.current || preference.matches || !("IntersectionObserver" in window)) {
      finish();
    } else {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) start();
      }, {
        root: section.current?.closest(".liquid-portal") || null,
        rootMargin: "0px 0px -48px 0px",
        threshold: 0.2,
      });
      // Wait for the numbers themselves on narrow screens, where copy sits above.
      observer.observe(grid);
    }
    preference.addEventListener("change", onPreference);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  return <section ref={section} className="liquid-research-stats" aria-labelledby="liquid-research-stats-title">
    <div className="liquid-research-stats-copy">
      <h2 id="liquid-research-stats-title">{t("Research, brought together.")}</h2>
      <p>{t("Bringing established liquid-biopsy methods together with the expertise of researchers at Leicester Cancer Research Centre.")}</p>
      <a className="liquid-text-link" href="#/explore">{t("Learn more")}</a>
    </div>
    <dl ref={metrics} className="liquid-research-stats-grid">
      {researchMetrics.map(metric => <div className="liquid-research-stat" key={metric.label}>
        <dt>{t(metric.label)}</dt>
        <dd>
          <span className="liquid-research-stat-number" aria-hidden="true">
            <span data-count-target={metric.value}>0</span>
            {metric.suffix && <span className="liquid-research-stat-suffix">{metric.suffix}</span>}
          </span>
          <span className="liquid-research-stat-accessible">
            {metric.suffix ? t("{0} or more", { 0: metric.value }) : metric.value}
          </span>
        </dd>
      </div>)}
    </dl>
  </section>;
}
