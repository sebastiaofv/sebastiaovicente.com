import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. Parsed as UTC so the day never drifts. */
  date: string;
  /** Date of the most recent substantive edit, when applicable. */
  updated?: string;
  description?: string;
  /** When set, the row links here instead of to a local post page. */
  external?: string;
  draft?: boolean;
};

export type Post = PostMeta & { content: string };

export function parsePost(fileName: string, raw: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (error) {
    throw new Error(`${fileName}: invalid frontmatter`, { cause: error });
  }
  const { data, content } = parsed;

  const fail = (message: string): never => {
    throw new Error(`${fileName}: ${message}`);
  };

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail("filename must use lowercase letters, numbers and single hyphens");
  }

  function text(field: string, required = false): string | undefined {
    const value: unknown = data[field];
    if (value === undefined && !required) return undefined;
    if (typeof value !== "string" || !value.trim()) {
      return fail(`"${field}" must be a non-empty string`);
    }
    return value.trim();
  }

  function date(field: string): string {
    const iso: unknown = data[field];
    if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      return fail(`"${field}" must be a quoted YYYY-MM-DD date`);
    }
    const parsed = new Date(`${iso}T00:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== iso) {
      return fail(`"${field}" must be a real calendar date`);
    }
    return iso;
  }

  const published = date("date");
  const updated = data.updated === undefined ? undefined : date("updated");
  if (updated && updated < published) fail('"updated" cannot precede "date"');
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    fail('"draft" must be true or false, without quotes');
  }
  const external = text("external");
  if (external) {
    let url: URL;
    try {
      url = new URL(external);
    } catch {
      return fail('"external" must be an absolute HTTP(S) URL');
    }
    if (!["http:", "https:"].includes(url.protocol)) {
      fail('"external" must use HTTP or HTTPS');
    }
  }
  return {
    slug,
    title: text("title", true)!,
    date: published,
    updated,
    description: text("description"),
    external,
    draft: data.draft ?? false,
    content,
  };
}

/** Newest first. Drafts are excluded outside of `next dev`. */
export function getAllPosts({
  directory = POSTS_DIR,
  includeDrafts = process.env.NODE_ENV === "development",
}: { directory?: string; includeDrafts?: boolean } = {}): Post[] {
  if (!fs.existsSync(directory)) return [];
  const seen = new Set<string>();
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map(({ name }) => {
      const post = parsePost(name, fs.readFileSync(path.join(directory, name), "utf8"));
      if (seen.has(post.slug)) throw new Error(`${name}: duplicate slug "${post.slug}"`);
      seen.add(post.slug);
      return post;
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Posts bucketed by year, newest year first — the shape the index renders. */
export function getPostsByYear(): { year: string; posts: Post[] }[] {
  const buckets = new Map<string, Post[]>();

  for (const post of getAllPosts()) {
    const year = post.date.slice(0, 4);
    const bucket = buckets.get(year);
    if (bucket) bucket.push(post);
    else buckets.set(year, [post]);
  }

  return [...buckets.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, posts]) => ({ year, posts }));
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-07-15" -> "Jul 15". Manual so it never shifts by timezone. */
export function formatDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

/** "2026-07-15" -> "July 15, 2026" */
export function formatDateLong(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
