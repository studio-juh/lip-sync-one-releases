const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const search = document.querySelector("#help-search");
const sections = [...document.querySelectorAll(".searchable")];
const noResults = document.querySelector(".no-results");
const navLinks = [...document.querySelectorAll(".side-nav a")];

const savedTheme = localStorage.getItem("lipsyncone-help-theme");
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
}

function updateThemeButton() {
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
