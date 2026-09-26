import { expect, test } from "@playwright/test";

test("published HTML has consistent search and social metadata", async ({ page, request }) => {
  await page.goto("/blog/hello-world");
  await expect(page).toHaveTitle("Hello, world | Sebastião Vicente");
  for (const key of ["og:title", "twitter:title"]) {
    await expect(page.locator(`meta[property="${key}"], meta[name="${key}"]`)).toHaveAttribute("content", "Hello, world");
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sebastiaovicente.com/blog/hello-world/");
  await expect(page.locator('link[type="application/rss+xml"]')).toHaveCount(1);
  const json = JSON.parse(await page.locator('script[type="application/ld+json"]').innerHTML());
  expect(json["@type"]).toBe("BlogPosting");
  expect(json.author.name).toBe("Sebastião Vicente");
  await page.goto("/blog");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://sebastiaovicente.com/blog/");
  for (const url of ["/blog/link-example", "/blog/does-not-exist", "/does-not-exist"]) {
    expect((await request.get(url)).status()).toBe(404);
  }
  for (const url of ["/sitemap.xml", "/feed.xml"]) {
    const response = await request.get(url);
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).not.toContain("link-example");
  }
  const image = await request.get("/share-image.png");
  expect(image.ok()).toBeTruthy();
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await request.get("/icon.svg")).ok()).toBeTruthy();
});

for (const width of [320, 375, 640, 1280]) {
  test(`photo strip stays within a ${width}px viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const photos = page.locator(".photo-card");
    for (const index of [0, 6]) {
      await photos.nth(index).focus();
      await page.keyboard.press("Enter");
      await expect(photos.nth(index)).toHaveAttribute("aria-pressed", "true");
      await expect(photos.nth(index)).toHaveCSS("scale", width < 640 ? "1.2" : "1.5");
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
      await expect(photos.nth(index)).toHaveAttribute("aria-pressed", "false");
    }
    await page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo(0, 0);
    });
    await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true, animations: "disabled" });
  });
}

test("theme supports radio keyboard controls, persistence and blocked storage", async ({ page }) => {
  await page.goto("/");
  const system = page.getByRole("radio", { name: "System", exact: true });
  await system.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Dark", exact: true })).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.getByRole("radio", { name: "Dark", exact: true })).toBeChecked();
  await system.check();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  await page.reload();
  await page.getByRole("radio", { name: "Light", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});
