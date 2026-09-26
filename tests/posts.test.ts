import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { getAllPosts, parsePost } from "../lib/posts";

const post = (extra = "") => `---\ntitle: "A post"\ndate: "2026-09-08"\n${extra}\n---\nBody`;

test("valid dates, explicit false and updates survive parsing", () => {
  const result = parsePost("a-post.mdx", post('draft: false\nupdated: "2026-09-09"'));
  assert.equal(result.date, "2026-09-08");
  assert.equal(result.updated, "2026-09-09");
  assert.equal(result.draft, false);
});

test("malformed publication data fails with the source filename", () => {
  for (const raw of [
    post('draft: "false"'),
    post('draft: ['),
    post('external: "javascript:alert(1)"'),
    post('external: "/relative"'),
    post('updated: "2026-09-07"'),
    post().replace('"2026-09-08"', '"2026-02-30"'),
    post().replace('"2026-09-08"', '"not-a-date"'),
    post().replace('"2026-09-08"', '2026-02-30'),
    post().replace('"A post"', '42'),
  ]) assert.throws(() => parsePost("a-post.mdx", raw), /a-post\.mdx:/);
});

test("production listing excludes drafts and rejects duplicate URLs", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "site-posts-"));
  try {
    writeFileSync(path.join(directory, "published.mdx"), post());
    writeFileSync(path.join(directory, "draft.mdx"), post("draft: true"));
    assert.deepEqual(getAllPosts({ directory, includeDrafts: false }).map(p => p.slug), ["published"]);
    assert.equal(getAllPosts({ directory, includeDrafts: true }).length, 2);
    writeFileSync(path.join(directory, "published.md"), post());
    assert.throws(() => getAllPosts({ directory }), /duplicate slug/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
