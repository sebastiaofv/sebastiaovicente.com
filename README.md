# sebastiaovicente.com

Personal site and blog. Next.js 15, Tailwind v4, local MDX posts. Builds to a fully static `out/` directory for GitHub Pages; no Node.js server is needed in production.

Use Node.js 24 and npm. Commit `package-lock.json` and use `npm ci` for reproducible installs.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint, TypeScript, content tests, production build
npm run start      # preview the exported out/ directory at localhost:3000
npx playwright install chromium
npm run test:e2e   # production browser checks; build first
```

Development writes to `.next-dev/`; production builds use `.next/` and export the finished site to `out/`, so the two can run independently. The production build downloads Inter through `next/font/google` and therefore needs network access. The deployed site serves the font locally.

## Writing a post

Add a `.mdx` or `.md` file in `content/posts/`. Use a lowercase, hyphen-separated filename; it becomes the URL slug. Slugs must be unique across both extensions.

```mdx
---
title: "What I learned"
date: "2026-09-08"
description: "A concise summary of this specific article."
---

Your writing here.
```

| Field | Required | Effect |
| --- | --- | --- |
| `title` | yes | Non-empty heading and page title |
| `date` | yes | Quoted, valid `YYYY-MM-DD` publication date |
| `description` | no | Search/social description and RSS summary; page metadata falls back to the site description |
| `updated` | no | Quoted `YYYY-MM-DD` date of a substantive edit, no earlier than publication; used in the page, sitemap and structured data |
| `external` | no | Absolute HTTP(S) URL; the index links to it and the local page provides a source link (static hosts cannot issue application redirects) |
| `draft` | no | Unquoted `true` hides the post in production; `false` publishes it |

Posts appear in the blog, RSS and sitemap at the next build. Future dates do **not** schedule publication: use `draft: true` until ready. Drafts are visible in development, carry `noindex`, and are always excluded from RSS and the sitemap. The example external-link post is a draft.

GFM tables and syntax-highlighted code fences are supported. JavaScript expressions inside MDX are disabled by the renderer. MDX is trusted executable content: only repository authors should supply it. Import/export statements inside MDX files are not supported by this renderer. To expose a React component, import it in the post page and pass it through the `components` prop on `MDXRemote`.

## Content and design

- `site.config.ts` owns the name, site URL, description and contact details. The canonical production origin is `https://sebastiaovicente.com`.
- `app/page.tsx` contains the homepage copy. The invented biography has been removed; add only verified personal history.
- `components/PhotoStrip.tsx` displays abstract SVG illustrations as a sketchbook. Replace the assets and captions with genuine photos when available, and then rename the section. Use appropriately sized images; rendering uses `next/image` with server-side optimization disabled for static hosting. Optimize/compress replacement images before adding them.
- `components/Column.tsx` owns the shared reading width and responsive spacing.
- `app/globals.css` owns colours, typography, prose, photo sizing and reduced-motion support.
- `components/ThemeToggle.tsx` uses native radio controls. Light/dark persist when storage is available; system mode removes the override. The inline layout script applies saved settings before first paint.

## SEO

`lib/metadata.ts` supplies per-page canonical, Open Graph, Twitter and RSS-discovery tags. The root icon is `app/icon.svg`; `app/share-image.png/route.tsx` generates the shared 1200×630 PNG card. Posts emit escaped `BlogPosting` JSON-LD matching their visible author and dates. Set a specific description on every published post.

The sitemap includes only published local posts. Post modification dates use `updated`, falling back to publication; home/index omit modification dates because no reliable edit timestamp is recorded. Do not bump dates for unrelated deploys.

After deployment:

1. Verify that HTTP and alternate hostnames redirect to `https://sebastiaovicente.com` with permanent redirects in the hosting provider.
2. Verify the production domain in Google Search Console and submit `/sitemap.xml`.
3. Inspect a home/blog/post URL for crawlability and canonical selection, and validate an article with Google's Rich Results Test.
4. Check mobile Core Web Vitals with PageSpeed Insights and Search Console once real traffic data exists.
5. Keep preview deployments protected or `noindex` using the hosting provider's preview controls.

These provider/account checks cannot be completed by a local build. No analytics or Search Console credentials are required by the application.

## Structure

```text
app/                    routes, layout, RSS, sitemap, robots, icon and share image
components/             Column, BackLink, PhotoStrip, ThemeToggle
content/posts/          trusted local Markdown/MDX
lib/posts.ts            validated content loading, sorting and dates
lib/metadata.ts         shared metadata and article structured data
lib/mdx.ts              typed Markdown plugin configuration
tests/                  content and metadata regressions; browser checks
.github/workflows/      lint, typecheck, tests, build and browser CI
```

## GitHub Pages deployment

Run `npm run build` to compile the complete website into `out/`. You can serve that directory with any static web host; `npm run start` previews those exact files locally. Every post has its own `index.html`, so direct links and refreshes work. RSS, sitemap, robots and the PNG share image are generated at build time.

The included GitHub Actions workflow runs checks and browser tests, uploads `out/`, and deploys on pushes to the repository's default branch. Pull requests run checks only. You can also run it manually from the Actions tab on the default branch.

One-time repository setup:

1. Push this project to your GitHub repository.
2. Open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. Set the custom domain to **sebastiaovicente.com** and enable **Enforce HTTPS** once GitHub has issued the certificate. Retain the domain's existing GitHub Pages DNS configuration.
4. Push to the default branch or run **Check and deploy Pages** from Actions.

`public/CNAME` records the intended domain and `public/.nojekyll` preserves Next.js's `_next` assets when copying the export to a branch-based Pages site. The custom domain must still be configured in GitHub's settings. Deploy the contents of `out/`, not `.next/`.

This configuration targets the domain root at `https://sebastiaovicente.com`. A project URL such as `username.github.io/repository/` would additionally need a `basePath` and corresponding asset/metadata URL changes; it is not the configured production address.

A scoped npm override keeps Next.js 15’s PostCSS dependency on a patched 8.5 release. Reassess the override when upgrading Next.js.
