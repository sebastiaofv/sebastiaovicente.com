import type { Metadata } from "next";
import { site } from "../site.config";
import type { PostMeta } from "./posts";

export const shareImage = `${site.url}/share-image.png`;

/** Keep search, social previews and RSS discovery consistent on every page. */
export function pageMetadata({
  title,
  description = site.description,
  path,
  post,
}: {
  title: string;
  description?: string;
  path: string;
  post?: PostMeta;
}): Metadata {
  const url = new URL(path.endsWith("/") ? path : `${path}/`, site.url).href;
  const images = [{ url: shareImage, width: 1200, height: 630, alt: site.description }];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
    authors: [{ name: site.name, url: site.url }],
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      images,
      ...(post
        ? {
            type: "article" as const,
            publishedTime: post.date,
            modifiedTime: post.updated ?? post.date,
            authors: [site.url],
          }
        : { type: "website" as const }),
    },
    twitter: { card: "summary_large_image", title, description, images },
    ...(post?.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export function articleJsonLd(post: PostMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? site.description,
    url: `${site.url}/blog/${post.slug}/`,
    mainEntityOfPage: `${site.url}/blog/${post.slug}/`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: site.name, url: site.url },
    inLanguage: site.locale,
  };
}

/** Prevent content from closing a JSON-LD script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
