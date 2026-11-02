import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
test("gallery tabs, multiple images, keyboard and focus", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("#image-panel .project-card")).toHaveCount(4);
  const open = page.locator("#image-panel .project-open").first();
  await open.click();
  await expect(page.locator("dialog")).toBeVisible();
  await expect(page.locator("#image-count")).toHaveText("1 / 2");
  await page.locator("#next-image").click();
  await expect(page.locator("#image-count")).toHaveText("2 / 2");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#image-count")).toHaveText("1 / 2");
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(open).toBeFocused();
  await page.locator("#video-tab").click();
  await expect(page.locator("#image-panel")).toBeHidden();
  await expect(page.locator("#video-panel .project-card")).toHaveCount(2);
  await page.locator("#video-panel .project-open").first().click();
  await expect(
    page.getByText("هنا سيُعرض فيديو المشروع", { exact: true }),
  ).toBeVisible();
  await page.locator("#close-dialog").click();
  await page.locator("#image-tab").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#video-tab")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(errors).toEqual([]);
});
test("all local images and logos load; layout fits viewport", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".tool-card")).toHaveCount(8);
  const images = page.locator("img:visible");
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBeTruthy();
  }
  expect(await page.locator(".tool-fallback").count()).toBe(0);
  await page.locator('#video-tab').click();
  for (const image of await page.locator('#video-panel img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBeTruthy();
  }
  for (const width of [320, 375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `width ${width}`,
    ).toBe(true);
  }
});
test("supported external video opens as an embedded player and is removed on close", async ({
  page,
}) => {
  const data = await readFile(
    new URL("../../data.js", import.meta.url),
    "utf8",
  );
  await page.route("**/data.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: data + '\nportfolio.videos[0].src = "https://youtu.be/abcdefghijk";',
    }),
  );
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Test embed</body></html>",
    }),
  );
  await page.goto("/");
  await page.locator("#video-tab").click();
  await page.locator("#video-panel .project-open").first().click();
  await expect(page.locator("dialog iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
  await page.locator("#close-dialog").click();
  await expect(page.locator("iframe")).toHaveCount(0);
});
test("MP4 is playable inside the modal", async ({ page }) => {
  test.skip(
    !process.env.TEST_MP4_PATH,
    "Supply TEST_MP4_PATH for the local playback fixture; no videos are stored in the portfolio.",
  );
  const data = await readFile(
    new URL("../../data.js", import.meta.url),
    "utf8",
  );
  await page.route("**/data.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: data + '\nportfolio.videos[0].src = "assets/videos/browser-test.mp4";',
    }),
  );
  await page.route("**/assets/videos/browser-test.mp4", (route) =>
    route.fulfill({
      path: process.env.TEST_MP4_PATH,
      contentType: "video/mp4",
    }),
  );
  await page.goto("/");
  await page.locator("#video-tab").click();
  await page.locator("#video-panel .project-open").first().click();
  const video = page.locator("dialog video");
  await expect(video).toBeVisible();
  await expect
    .poll(() => video.evaluate((el) => el.readyState))
    .toBeGreaterThanOrEqual(2);
  await video.evaluate((el) => el.play());
  await expect
    .poll(() => video.evaluate((el) => el.currentTime))
    .toBeGreaterThan(0);
  await page.locator("#close-dialog").click();
  await expect(page.locator("video")).toHaveCount(0);
});
