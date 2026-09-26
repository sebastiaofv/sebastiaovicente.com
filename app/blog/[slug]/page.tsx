import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxOptions } from "@/lib/mdx";
import { Column } from "@/components/Column";
import { pageMetadata, articleJsonLd, serializeJsonLd } from "@/lib/metadata";
import { BackLink } from "@/components/BackLink";
import { formatDateLong, getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const metadata = pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    post,
  });
  if (post.external) {
    return {
      ...metadata,
      alternates: { ...metadata.alternates, canonical: post.external },
      robots: { index: false, follow: true },
    };
  }
  return metadata;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();
  // A static host cannot issue a server redirect. Preserve direct visits to
  // link-only entries with an explicit source link.
  if (post.external) {
    return (
      <Column>
        <BackLink href="/blog" label="Blog" />
        <article className="prose">
          <h1 className="mb-4 text-[18px] font-medium">{post.title}</h1>
          {post.description && <p>{post.description}</p>}
          <p><a href={post.external}>Read at the original source &rarr;</a></p>
        </article>
      </Column>
    );
  }

  return (
    <Column>
      <BackLink href="/blog" label="Blog" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd(post)) }} />
      <article className="prose">
        <h1 className="mb-1 text-[18px] font-medium">{post.title}</h1>
        <div className="mb-8 text-muted">
          <span>By <a href={site.url}>{site.name}</a> · </span>
          <time dateTime={post.date}>{formatDateLong(post.date)}</time>
          {post.updated && <> · Updated <time dateTime={post.updated}>{formatDateLong(post.updated)}</time></>}
        </div>

        <MDXRemote source={post.content} options={mdxOptions} />
      </article>
    </Column>
  );
}
