export default defineEventHandler((event) =>
  renderRssFeed(event, {
    contentPath: "ko/articles",
    feedPath: "/ko/rss.xml",
    language: "ko",
  }),
);
