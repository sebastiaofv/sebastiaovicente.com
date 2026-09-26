import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts({ includeDrafts: false })
    .filter((post) => !post.external)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}/`,
      lastModified: post.updated ?? post.date,
    }));

  return [
    { url: `${site.url}/` },
    { url: `${site.url}/blog/` },
    ...posts,
  ];
}
