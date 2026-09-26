import { pageMetadata } from "@/lib/metadata";
import { Column } from "@/components/Column";
import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { formatDate, getPostsByYear } from "@/lib/posts";

export const metadata = pageMetadata({
  title: "Blog",
  description: "Notes on quantitative development, reproducible models and the software behind them.",
  path: "/blog",
});

export default function BlogIndex() {
  const years = getPostsByYear();

  return (
    <Column>
      <BackLink />

      <h1 className="mb-8 text-[18px] font-medium">Blog</h1>

      {years.length === 0 ? (
        <p className="text-muted">Nothing published yet.</p>
      ) : (
        <div className="space-y-3">
          {years.map(({ year, posts }) => (
            <section key={year} className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline gap-x-3 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-x-4">
              <h2 className="py-1 text-sm text-muted tabular-nums">
                {year}
              </h2>

              <ul className="min-w-0 space-y-3">
                {posts.map((post) => {
                  const isExternal = Boolean(post.external);

                  return (
                    <li key={post.slug}>
                      <Link
                        href={post.external ?? `/blog/${post.slug}`}
                        {...(isExternal
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className="group flex items-baseline justify-between gap-2 py-1 sm:gap-4"
                      >
                        <span className="min-w-0 [overflow-wrap:anywhere] decoration-muted underline-offset-2 group-hover:underline">
                          {post.title}
                          {isExternal && (
                            <span className="ml-1 text-muted">&#8599;</span>
                          )}
                          {post.draft && (
                            <span className="ml-2 text-muted">draft</span>
                          )}
                        </span>
                        <time dateTime={post.date} className="shrink-0 text-muted tabular-nums">
                          {formatDate(post.date)}
                        </time>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Column>
  );
}
