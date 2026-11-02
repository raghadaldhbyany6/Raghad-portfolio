import { portfolio, tools } from "./data.js";
const $ = (selector) => document.querySelector(selector);
const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};
export function videoSource(src) {
  if (!src) return null;
  let url;
  try {
    url = new URL(src, globalThis.location?.href || "https://example.com/");
  } catch {
    return null;
  }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  const host = url.hostname.replace(/^www\./, "");
  let id;
  if (
    [
      "youtube.com",
      "m.youtube.com",
      "youtu.be",
      "youtube-nocookie.com",
    ].includes(host)
  ) {
    id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : url.searchParams.get("v") ||
          url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    return /^[A-Za-z0-9_-]{11}$/.test(id || "")
      ? { type: "embed", url: `https://www.youtube-nocookie.com/embed/${id}` }
      : null;
  }
  if (["vimeo.com", "player.vimeo.com"].includes(host)) {
    id = url.pathname.match(/(?:\/video)?\/(\d+)\/?$/)?.[1];
    return id
      ? { type: "embed", url: `https://player.vimeo.com/video/${id}` }
      : null;
  }
  return /\.mp4$/i.test(url.pathname) ? { type: "file", url: url.href } : null;
}
if (typeof document !== "undefined") {
  const dialog = $("#project-dialog");
  let current = null,
    index = 0,
    opener = null;
  function showImage() {
    const img = make("img");
    img.src = current.images[index];
    img.alt = `${current.title} — صورة ${index + 1}`;
    $("#dialog-media").replaceChildren(img);
    $("#image-count").textContent = `${index + 1} / ${current.images.length}`;
    $("#previous-image").disabled = $("#next-image").disabled =
      current.images.length < 2;
  }
  function open(project, type, button) {
    current = project;
    index = 0;
    opener = button;
    $("#dialog-title").textContent = project.title;
    $("#dialog-description").textContent = project.description;
    $("#dialog-category").textContent = project.category;
    $("#image-controls").hidden = type !== "images";
    if (type === "images") showImage();
    else {
      const source = videoSource(project.src);
      let media;
      if (!source) {
        media = make("div", "empty-video");
        media.append(
          make("div", "empty-icon", "▷"),
          make(
            "h3",
            "",
            project.src ? "تعذر عرض رابط الفيديو" : "هنا سيُعرض فيديو المشروع",
          ),
          make(
            "p",
            "",
            project.src
              ? "استخدمي ملف MP4 أو رابط YouTube أو Vimeo صالحًا."
              : "هذا مكان تجريبي. لم تُرفع أي فيديوهات بعد. يمكنك إضافة ملفك لاحقًا في مجلد الفيديوهات وتحديث ملف البيانات.",
          ),
          make("code", "", "assets/videos/ → data.js"),
        );
      } else if (source.type === "file") {
        media = make("video");
        media.controls = true;
        media.playsInline = true;
        media.preload = "metadata";
        media.poster = project.poster;
        const sourceEl = make("source");
        sourceEl.src = source.url;
        sourceEl.type = "video/mp4";
        media.append(sourceEl);
        media.append(make("p", "", "متصفحك لا يدعم تشغيل الفيديو."));
        media.addEventListener("error", () => {
          $("#dialog-media").append(
            make(
              "p",
              "empty-video",
              "تعذر تحميل الفيديو. تحققي من مسار الملف وصلاحيات الوصول.",
            ),
          );
        });
      } else {
        media = make("iframe");
        media.src = source.url;
        media.title = project.title;
        media.allow = "fullscreen; picture-in-picture";
        media.allowFullscreen = true;
        media.referrerPolicy = "strict-origin-when-cross-origin";
      }
      $("#dialog-media").replaceChildren(media);
    }
    dialog.showModal();
    $("#close-dialog").focus();
  }
  for (const type of ["images", "videos"])
    for (const project of portfolio[type]) {
      const card = make("article", "project-card");
      const button = make("button", "project-open");
      button.type = "button";
      button.setAttribute("aria-label", `عرض ${project.title}`);
      const art = make("div", "project-art");
      const img = make("img");
      img.src = type === "images" ? project.images[0] : project.poster;
      img.alt = project.title;
      img.loading = "lazy";
      img.decoding = "async";
      art.append(img);
      if (project.placeholder)
        art.append(make("span", "art-badge", "نموذج تجريبي"));
      if (type === "videos") {
        const play = make("div", "play");
        play.append(make("span", "", "▶"));
        art.append(play);
      } else art.append(make("span", "project-arrow", "↗︎"));
      const meta = make("div", "project-meta");
      meta.append(
        make("h3", "", project.title),
        make(
          "span",
          "",
          type === "images" && project.images.length > 1
            ? `${project.images.length} صور · ${project.category}`
            : project.category,
        ),
      );
      button.append(
        art,
        meta,
        make("p", "project-description", project.description),
      );
      button.addEventListener("click", () => open(project, type, button));
      card.append(button);
      $(type === "images" ? "#image-panel" : "#video-panel").append(card);
    }
  const tabs = [...document.querySelectorAll("[role=tab]")];
  function selectTab(tab) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      $("#" + item.getAttribute("aria-controls")).hidden = !selected;
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const next =
          event.key === "Home"
            ? tabs[0]
            : event.key === "End"
              ? tabs.at(-1)
              : tabs[(i + 1) % tabs.length];
        selectTab(next);
        next.focus();
      }
    });
  });
  for (const tool of tools) {
    const card = make("a", "tool-card");
    card.href = tool.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `${tool.name} — يفتح في نافذة جديدة`);
    const img = make("img", "tool-icon");
    img.src = `assets/logos/${tool.name.toLowerCase().replaceAll(" ", "-")}.png`;
    img.alt = `شعار ${tool.name}`;
    img.width = 43;
    img.height = 43;
    img.loading = "lazy";
    img.addEventListener(
      "error",
      () => {
        const fallback = make(
          "span",
          "tool-fallback",
          tool.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 3),
        );
        fallback.setAttribute("aria-label", tool.name);
        img.replaceWith(fallback);
      },
      { once: true },
    );
    card.append(
      img,
      make("span", "external", "↗︎"),
      make("h3", "", tool.name),
      make("p", "", tool.label),
    );
    $("#tools-grid").append(card);
  }
  $("#previous-image").addEventListener("click", () => {
    index = (index - 1 + current.images.length) % current.images.length;
    showImage();
  });
  $("#next-image").addEventListener("click", () => {
    index = (index + 1) % current.images.length;
    showImage();
  });
  dialog.addEventListener("keydown", (event) => {
    if (
      !$("#image-controls").hidden &&
      ["ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();
      $(event.key === "ArrowLeft" ? "#next-image" : "#previous-image").click();
    }
  });
  $("#close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    $("#dialog-media").replaceChildren();
    opener?.focus();
  });
  $("#year").textContent = new Date().getFullYear();
  if (portfolio.email) {
    $("#email-link").href = `mailto:${portfolio.email}`;
    $("#email-link").hidden = false;
    $("#contact-pending").hidden = true;
  }
}
