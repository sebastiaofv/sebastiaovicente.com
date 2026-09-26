import assert from "node:assert/strict";
import { test } from "node:test";
import { articleJsonLd, pageMetadata, serializeJsonLd } from "../lib/metadata";

test("post previews and canonical describe the same page", () => {
  const post = { slug: "example", title: "Example", date: "2026-09-08", description: "A specific description", draft: true };
  const meta = pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, post });
  assert.equal(meta.openGraph?.title, post.title);
  assert.equal(meta.twitter?.title, post.title);
  assert.equal(meta.twitter?.description, post.description);
  assert.equal(meta.alternates?.canonical, "https://sebastiaovicente.com/blog/example/");
  assert.ok(meta.alternates?.types?.["application/rss+xml"]);
  assert.ok(meta.openGraph?.images);
  assert.deepEqual(meta.robots, { index: false, follow: false });
});

test("JSON-LD keeps update dates and cannot close its script tag", () => {
  const data = articleJsonLd({ slug: "example", title: "</script><script>alert(1)</script>", date: "2026-09-08", updated: "2026-09-09" });
  const serialized = serializeJsonLd(data);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), data);
  assert.equal(data.dateModified, "2026-09-09");
});
