import type { H3Event } from "h3";
import { serverQueryContent } from "#content/server";

type FeedOptions = {
  contentPath: string;
  feedPath: string;
  language: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function renderRssFeed(
  event: H3Event,
  { contentPath, feedPath, language }: FeedOptions,
) {
  const { siteUrl, siteName, siteDescription } = useRuntimeConfig().public;
  const homeUrl = new URL(language === "en" ? "/" : `/${language}`, siteUrl);
  const feedUrl = new URL(feedPath, siteUrl);

  const articles = await serverQueryContent(event, contentPath)
    .where({ _extension: { $eq: "md" } })
    .sort({ createdAt: -1 })
    .only(["_path", "title", "description", "createdAt"])
    .find();

  const items = articles.map((article) => {
    const link = escapeXml(new URL(article._path!, siteUrl).href);
    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
    </item>`;
  });

  setResponseHeader(
    event,
    "Content-Type",
    "application/rss+xml; charset=utf-8",
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(homeUrl.href)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>${language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl.href)}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;
}
