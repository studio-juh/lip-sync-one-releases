const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const search = document.querySelector("#help-search");
const sections = [...document.querySelectorAll(".searchable")];
const noResults = document.querySelector(".no-results");
const navLinks = [...document.querySelectorAll(".side-nav a")];

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

const savedTheme = localStorage.getItem("lipsyncone-help-theme");
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
  localStorage.setItem("lipsyncone-help-theme", next);
  updateThemeButton();
});

function normalize(value) {
  return value.trim().toLocaleLowerCase("ja");
}

function filterHelp() {
  const query = normalize(search?.value ?? "");
  let visibleCount = 0;
  for (const section of sections) {
    const searchable = normalize(`${section.dataset.search ?? ""} ${section.textContent ?? ""}`);
    const visible = query === "" || searchable.includes(query);
    section.hidden = !visible;
    if (visible) visibleCount += 1;
  }
  if (noResults) noResults.hidden = visibleCount > 0;
}

search?.addEventListener("input", filterHelp);
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

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
  if (!visible) return;
  for (const link of navLinks) {
    link.classList.toggle("active", link.hash === `#${visible.target.id}`);
  }
}, { rootMargin: "-18% 0px -68%", threshold: [0.05, 0.2, 0.5] });

for (const section of sections) observer.observe(section);

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
