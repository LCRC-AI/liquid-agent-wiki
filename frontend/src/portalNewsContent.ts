export const portalNews = [
  {
    slug: "introducing-liquid-agent",
    title: "Introducing LIQUID-Agent",
    summary: "Our first beta brings conversational AI to liquid-biopsy research, from the initial question to analysis plans and reviewable results.",
    subtitle: "A research workspace for following molecular signals, with the evidence and the researcher in view.",
    date: "2026-10-12",
    dateLabel: "12 October 2026",
    illustration: "./assets/portal/news/first-beta-test-tube.png",
    introduction: [
      "Today we are introducing the first beta of LIQUID-Agent, a local research workspace designed to help scientists investigate the molecular signals found in liquid-biopsy data. It brings natural-language interaction, scientific tools and reviewable results into one place, helping researchers move from an initial question to a focused analysis and a considered next step.",
      "Liquid-biopsy research draws on many kinds of evidence. Understanding that evidence requires attention to what was measured, how the data were prepared and which conclusions the available inputs can support. LIQUID-Agent starts there: with the data and the research question.",
    ],
    sections: [
      {
        heading: "From a question to an analysis",
        paragraphs: [
          "Researchers can attach a local dataset and ask LIQUID-Agent to inspect its structure, identify supported inputs and explain missing prerequisites. The agent can propose an analysis plan, run the steps the researcher authorizes and bring the resulting figures, tables and reports back into the conversation.",
          "The first beta includes established workflows for cfDNA fragment signals, low-pass whole-genome sequencing and copy-number summaries, supported methylation signals and variant tables. Available operations depend on the input format, installed tools and required resources. Suggestions for further analysis are distinguished from steps the workspace can execute.",
        ],
      },
      {
        heading: "Keep the evidence in view",
        paragraphs: [
          "Results are starting points for further investigation. Researchers can ask questions about generated figures and tables, examine a selected figure region and continue from completed work. Linked conversations help bring findings from related tasks into a shared discussion while retaining their source context.",
          "A professional skill library supplies domain and workflow guidance. Task memory supports continuity, and proposed changes to reusable guidance can be inspected and accepted or declined by the researcher.",
        ],
      },
      {
        heading: "A local workspace, with researcher control",
        paragraphs: [
          "Scientific tools process data in the local workspace. Researchers choose their model connection and control what is shared with it. Cloud connections use conversation content and permitted summaries, while analysis files remain available locally for review.",
          "Researchers remain in charge of the question, the analysis scope and the next action. Plans can be revised, active work can be stopped and earlier results can be revisited. This beta is designed for research and supports scientific judgment through visible evidence.",
        ],
      },
      {
        heading: "Join the first beta",
        paragraphs: [
          "This first release begins with limited early access. We invite researchers to explore the workspace and share feedback on its usefulness, clarity and scientific fit. The Docs explain how to get started, and Try it takes you to the early-access information and application.",
        ],
      },
    ],
  },
];

export function findPortalNews(route: string) {
  return portalNews.find(item => route === `#/news/${item.slug}`);
}
