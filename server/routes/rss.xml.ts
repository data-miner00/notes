export default defineEventHandler((event) =>
  renderRssFeed(event, {
    contentPath: "articles",
    feedPath: "/rss.xml",
    language: "en",
  }),
);
