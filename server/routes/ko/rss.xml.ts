import { site } from "../../../locales/ko.json";

export default defineEventHandler((event) =>
  renderRssFeed(event, {
    contentPath: "ko/articles",
    feedPath: "/ko/rss.xml",
    language: "ko",
    site,
  }),
);
