import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { portfolio, tools } from "../data.js";
import { videoSource } from "../app.js";
test("all sample project assets exist and IDs are unique", async () => {
  const projects = [...portfolio.images, ...portfolio.videos];
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  assert.ok(portfolio.images.some((p) => p.images.length > 1));
  for (const p of projects) {
    assert.ok(p.title && p.description);
    for (const f of p.images || [p.poster])
      await access(new URL("../" + f, import.meta.url));
  }
});
test("all eight named tools have local logos and HTTPS links", async () => {
  assert.equal(tools.length, 8);
  for (const tool of tools) {
    assert.equal(new URL(tool.url).protocol, "https:");
    const f = new URL(
      "../assets/logos/" +
        tool.name.toLowerCase().replaceAll(" ", "-") +
        ".png",
      import.meta.url,
    );
    const bytes = await readFile(f);
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  }
});
test("MP4 local and remote paths are accepted", () => {
  assert.equal(videoSource("assets/videos/demo.mp4").type, "file");
  assert.equal(
    videoSource("https://example.com/demo.MP4?token=example").type,
    "file",
  );
});
test("YouTube and Vimeo links become supported privacy-aware embeds", () => {
  assert.equal(
    videoSource("https://youtu.be/abcdefghijk").url,
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
  assert.equal(
    videoSource("https://www.youtube.com/watch?v=abcdefghijk").type,
    "embed",
  );
  assert.equal(
    videoSource("https://youtube.com/shorts/abcdefghijk").type,
    "embed",
  );
  assert.equal(
    videoSource("https://vimeo.com/123456").url,
    "https://player.vimeo.com/video/123456",
  );
});
test("empty, unsupported and executable video URLs are rejected", () => {
  for (const src of [
    "",
    "javascript:alert(1)",
    "data:text/html,hello",
    "https://youtube.com/watch?v=bad",
    "https://example.com/file.html",
    "https://youtube.com.evil.test/watch?v=abcdefghijk",
  ])
    assert.equal(videoSource(src), null);
});
