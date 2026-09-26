import { getAllPosts } from "@/lib/posts";
import { site } from "@/site.config";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts({ includeDrafts: false });

  const items = posts
    .map((post) => {
      const url = post.external ?? `${site.url}/blog/${post.slug}/`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="false">${escape(`${site.url}/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>${
        post.description
          ? `\n      <description>${escape(post.description)}</description>`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${escape(site.url)}</link>
    <description>${escape(site.description)}</description>
    <language>${escape(site.locale)}</language>
    <atom:link href="${escape(`${site.url}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
