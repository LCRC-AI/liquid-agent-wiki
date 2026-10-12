import { Fragment } from "react";
import { LiquidWordmark } from "./LiquidWordmark";
import { findPortalNews, portalNews } from "./portalNewsContent";
import "./portal-news.css";

const INSTALLER_DOWNLOAD = "https://huggingface.co/datasets/LCRC-AI/liquid-agent";

function NewsText({ text }: { text: string }) {
  return <>{text.split("LIQUID-Agent").map((part, index) => <Fragment key={index}>
    {index > 0 && <LiquidWordmark />}{part}
  </Fragment>)}</>;
}

export function PortalNewsBlock() {
  return <section className="liquid-news" aria-labelledby="liquid-news-title">
    <h2 id="liquid-news-title" className="liquid-news-title">News</h2>
    <div className="liquid-news-grid">
      {portalNews.map(item => <a className="liquid-news-card" key={item.slug}
        href={`#/news/${item.slug}`} aria-labelledby={`news-${item.slug}-title`}>
        <h3 id={`news-${item.slug}-title`}><NewsText text={item.title} /></h3>
        <p>{item.summary}</p>
        <img className="liquid-news-illustration" src={item.illustration} width="1200" height="900"
          alt="" loading="lazy" decoding="async" />
        <span className="liquid-news-read">Read the announcement <span aria-hidden="true">↗</span></span>
      </a>)}
    </div>
  </section>;
}

export function PortalNewsArticle({ route }: { route: string }) {
  const item = findPortalNews(route);
  if (!item) return <main id="liquid-main" className="liquid-news-article" tabIndex={-1}>
    <a className="liquid-news-back" href="#/">Back to home</a>
    <h1>News article not found</h1>
    <p>This announcement is unavailable. Return to the homepage for the latest news.</p>
  </main>;
  return <main id="liquid-main" className="liquid-news-article" tabIndex={-1}>
    <a className="liquid-news-back" href="#/">← Back to home</a>
    <article aria-labelledby="liquid-announcement-title">
      <header className="liquid-news-article-header">
        <h1 id="liquid-announcement-title"><NewsText text={item.title} /></h1>
        <p className="liquid-news-subtitle">{item.subtitle}</p>
      </header>
      <div className="liquid-news-article-body">
        {item.introduction.map(paragraph => <p key={paragraph}><NewsText text={paragraph} /></p>)}
        {item.sections.map(section => <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}><NewsText text={paragraph} /></p>)}
        </section>)}
      </div>
      <footer className="liquid-news-article-ending">
        <nav className="liquid-news-article-links" aria-label="Beta release resources">
          <a className="liquid-text-link" href={INSTALLER_DOWNLOAD} target="_blank" rel="noopener noreferrer">Download installer</a>
        </nav>
        <div className="liquid-news-article-date"><time dateTime={item.date}>{item.dateLabel}</time></div>
      </footer>
      <img className="liquid-news-article-illustration" src={item.illustration} width="1200" height="900"
        alt="" loading="lazy" decoding="async" />
    </article>
  </main>;
}
