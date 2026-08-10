const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const search = document.querySelector("#help-search");
const sections = [...document.querySelectorAll(".searchable")];
const noResults = document.querySelector(".no-results");
const navLinks = [...document.querySelectorAll(".side-nav a")];

const savedTheme = localStorage.getItem("lipsyncone-help-theme");
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
} else if (matchMedia("(prefers-color-scheme: light)").matches) {
  root.dataset.theme = "light";
}

themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("lipsyncone-help-theme", next);
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
