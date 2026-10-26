const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const search = document.querySelector("#help-search");
const sections = [...document.querySelectorAll(".searchable")];
const noResults = document.querySelector(".no-results");
const navLinks = [...document.querySelectorAll(".side-nav a")];
const searchStatus = document.querySelector("#help-search-status");
const searchClear = document.querySelector("#help-search-clear");
const searchableText = new Map(sections.map(section => [section,
  normalize(`${section.dataset.search ?? ""} ${section.textContent ?? ""}`),
]));
const detailsBeforeSearch = new Map();
let selectedSection = sections[0];
const offlineNotice = document.querySelector(".offline-notice");
if (offlineNotice) offlineNotice.hidden = location.protocol !== "file:";

function anchorTarget(hash) {
  try { return document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return null; }
}

function showSection(section) {
  selectedSection = section;
  for (const candidate of sections) candidate.hidden = candidate !== section;
  for (const link of navLinks) {
    const active = link.hash === `#${section?.id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

const filenameCopyStatus = document.querySelector("#filename-copy-status");
async function copyFilename(filename) {
  try {
    await navigator.clipboard.writeText(filename);
    return;
  } catch {
    // Local file help may not have Clipboard API permission. Keep an offline
    // copy path in the same click action before offering manual selection.
  }
  const previousFocus = document.activeElement;
  const buffer = document.createElement("textarea");
  buffer.className = "clipboard-buffer";
  buffer.value = filename;
  buffer.readOnly = true;
  buffer.setAttribute("aria-label", "コピーするファイル名");
  document.body.append(buffer);
  try {
    buffer.focus({ preventScroll: true });
    buffer.select();
    if (!document.execCommand("copy")) throw new Error("Copy unavailable");
  } finally {
    buffer.remove();
    previousFocus?.focus({ preventScroll: true });
  }
}

for (const code of document.querySelectorAll(".filename-table code")) {
  const filename = code.textContent.trim();
  const row = document.createElement("span");
  row.className = "filename-copy-row";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filename-copy-button";
  button.textContent = "コピー";
  button.setAttribute("aria-label", `${filename} をコピー`);
  code.replaceWith(row);
  row.append(code, button);
  let resetLabel;
  button.addEventListener("click", async () => {
    try {
      await copyFilename(filename);
      button.textContent = "コピー済み";
      window.clearTimeout(resetLabel);
      resetLabel = window.setTimeout(() => { button.textContent = "コピー"; }, 2000);
      if (filenameCopyStatus) filenameCopyStatus.textContent = `${filename} をコピーしました。`;
    } catch {
      window.clearTimeout(resetLabel);
      button.textContent = "コピー";
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection?.removeAllRanges();
      selection?.addRange(range);
      if (filenameCopyStatus) filenameCopyStatus.textContent = "ファイル名を選択しました。Ctrl+Cでコピーしてください。";
    }
  });
}

let savedTheme;
try { savedTheme = localStorage.getItem("lipsyncone-help-theme"); } catch { /* File help also works without storage permission. */ }
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
}

function updateThemeButton() {
  const theme = root.dataset.theme === "dark" ? "dark" : "light";
  for (const image of document.querySelectorAll("img[data-theme-light][data-theme-dark]")) {
    const source = image.dataset[theme === "dark" ? "themeDark" : "themeLight"];
    image.setAttribute("src", source);
    const trigger = image.closest("a.image-zoom-trigger");
    if (trigger) trigger.setAttribute("href", source);
  }
  if (!themeButton) return;
  const dark = root.dataset.theme === "dark";
  themeButton.textContent = dark ? "ライト表示" : "ダーク表示";
  themeButton.setAttribute(
    "aria-label",
    dark ? "ライトテーマに切り替える" : "ダークテーマに切り替える",
  );
}

updateThemeButton();

themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try { localStorage.setItem("lipsyncone-help-theme", next); } catch { /* The current page can still switch themes. */ }
  updateThemeButton();
});

function normalize(value) {
  return value.normalize("NFKC").trim().toLocaleLowerCase("ja");
}

function filterHelp() {
  const query = normalize(search?.value ?? "");
  const terms = query.split(/\s+/u).filter(Boolean);
  const matches = sections.filter(section => terms.every(term => searchableText.get(section).includes(term)));
  for (const section of sections) {
    for (const detail of section.querySelectorAll("details")) {
      if (terms.length) {
        if (!detailsBeforeSearch.has(detail)) detailsBeforeSearch.set(detail, detail.open);
        if (matches.includes(section) && terms.every(term => normalize(detail.textContent ?? "").includes(term))) detail.open = true;
      } else if (detailsBeforeSearch.has(detail)) {
        detail.open = detailsBeforeSearch.get(detail);
        detailsBeforeSearch.delete(detail);
      }
    }
  }
  for (const link of navLinks) {
    const section = document.getElementById(link.hash.slice(1))?.closest(".searchable");
    link.hidden = !matches.includes(section);
  }
  const bookmarked = anchorTarget(location.hash)?.closest(".searchable") ?? sections[0];
  showSection(terms.length ? (matches.includes(selectedSection) ? selectedSection : matches[0]) : bookmarked);
  if (noResults) noResults.hidden = matches.length > 0;
  if (searchClear) searchClear.hidden = terms.length === 0;
  if (searchStatus) searchStatus.textContent = terms.length
    ? `「${search.value.trim()}」の検索結果：${matches.length}件。目次から項目を選んでください。`
    : `${sections.length}項目の使い方を掲載しています。目次から選んだ項目を表示します。`;
}

search?.addEventListener("input", filterHelp);
searchClear?.addEventListener("click", () => {
  if (search) search.value = "";
  filterHelp();
  search?.focus();
});
function revealAnchor(hash, scroll = false) {
  const target = anchorTarget(hash || `#${sections[0]?.id}`);
  if (!target) return;
  if (search?.value) { search.value = ""; filterHelp(); }
  const section = target.closest(".searchable");
  if (section) showSection(section);
  else if (target.id === "top") showSection(sections[0]);
  for (let parent = target; parent; parent = parent.parentElement) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
  }
  if (scroll) {
    target.scrollIntoView({ block: "start", behavior: "instant" });
    // The section is a keyboard destination too, without adding a tab stop.
    if (section) { section.tabIndex = -1; section.focus({ preventScroll: true }); }
  }
}
// Task links and bookmarks must also reach filtered or folded sections.
document.addEventListener("click", event => {
  const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (anchor) revealAnchor(anchor.hash);
});
window.addEventListener("hashchange", () => revealAnchor(location.hash, true));
filterHelp();
revealAnchor(location.hash, location.hash.length > 1);
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    search?.focus();
  }
  if (event.key === "Escape" && document.activeElement === search && search) {
    search.value = "";
    filterHelp();
    search.blur();
  }
});

const imageLightbox = document.querySelector(".image-lightbox");
const lightboxImage = imageLightbox?.querySelector(".image-lightbox-image");
const lightboxCaption = imageLightbox?.querySelector(".image-lightbox-caption");
const lightboxClose = imageLightbox?.querySelector(".image-lightbox-close");
const lightboxHitArea = imageLightbox?.querySelector(".image-lightbox-hit-area");
const imageZoomTriggers = [...document.querySelectorAll(".image-zoom-trigger")];
let lastImageTrigger = null;

function openImageLightbox(trigger) {
  if (!(imageLightbox instanceof HTMLDialogElement) || !lightboxImage || !lightboxCaption) return;
  const sourceImage = trigger.querySelector("img");
  if (!(sourceImage instanceof HTMLImageElement)) return;

  lastImageTrigger = trigger;
  lightboxImage.src = trigger.href;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = sourceImage.closest("figure")?.querySelector("figcaption")?.textContent?.trim()
    || sourceImage.alt;
  document.body.classList.add("image-lightbox-open");
  imageLightbox.showModal();
}

for (const trigger of imageZoomTriggers) {
  trigger.addEventListener("click", (event) => {
    if (!(trigger instanceof HTMLAnchorElement)) return;
    event.preventDefault();
    openImageLightbox(trigger);
  });
}

lightboxClose?.addEventListener("click", () => imageLightbox?.close());
lightboxHitArea?.addEventListener("click", () => imageLightbox?.close());
imageLightbox?.addEventListener("click", (event) => {
  if (event.target === imageLightbox) imageLightbox.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageLightbox?.open) {
    event.preventDefault();
    imageLightbox.close();
  }
});
imageLightbox?.addEventListener("close", () => {
  document.body.classList.remove("image-lightbox-open");
  if (lightboxImage) lightboxImage.removeAttribute("src");
  lastImageTrigger?.focus();
  lastImageTrigger = null;
});
