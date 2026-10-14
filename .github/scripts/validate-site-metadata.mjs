import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const siteRoot = resolve(repositoryRoot, "site");

const pages = [
  {
    path: "index.html",
    canonical: "https://lipsyncone.studiojuh.com/",
    expectedType: "SoftwareApplication",
  },
  {
    path: "help/index.html",
    canonical: "https://lipsyncone.studiojuh.com/help/",
    expectedType: "WebSite",
  },
];

const sitemap = await read("sitemap.xml");
const robots = await read("robots.txt");
const llms = await read("llms.txt");
const legacyLp = await read("lp/index.html");
const productPage = await read("index.html");
const verificationFiles = (await readdir(siteRoot)).filter((name) => /^google[a-z0-9]+\.html$/.test(name));

assert.match(robots, /^User-agent: \*$/m);
assert.match(robots, /^User-agent: OAI-SearchBot$/m);
assert.match(
  robots,
  /^Sitemap: https:\/\/lipsyncone\.studiojuh\.com\/sitemap\.xml$/m,
);
assert.match(llms, /^# LipSyncOne$/m);
assert.match(llms, /音声解析はPC内で行い/);
assert.match(legacyLp, /<meta name="robots" content="noindex, follow">/);
assert.match(legacyLp, /<meta http-equiv="refresh" content="0; url=\/">/);
assert.match(legacyLp, /window\.location\.replace\("\/"/);
assert.match(productPage, /https:\/\/hanairo-m\.booth\.pm\/items\/8707179/);
assert.match(productPage, /https:\/\/ko-fi\.com\/studiojuh/);
assert.ok(verificationFiles.length > 0, "site root must include a Google verification file");

for (const name of verificationFiles) {
  assert.equal((await read(name)).trim(), `google-site-verification: ${name}`);
}

for (const page of pages) {
  const html = await read(page.path);
  assert.match(html, /<html lang="ja"/);
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large">/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${escapeRegExp(page.canonical)}">`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${escapeRegExp(page.canonical)}">`));
  assert.match(sitemap, new RegExp(`<loc>${escapeRegExp(page.canonical)}</loc>`));

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  assert.equal(jsonLdBlocks.length, 1, `${page.path} must have one JSON-LD block`);
  const data = JSON.parse(jsonLdBlocks[0][1]);
  const types = data["@graph"].map((entry) => entry["@type"]);
  assert.ok(types.includes(page.expectedType), `${page.path} is missing ${page.expectedType}`);
}

assert.match(productPage, /href="\/downloads\/LipSyncOne_SampleAssets_v1\.zip" download/);
const sampleZip = await readFile(resolve(siteRoot, "downloads/LipSyncOne_SampleAssets_v1.zip"));
assert.ok(sampleZip.length > 0, "stage the free sample ZIP before deploying");
assert.match(productPage, /href="\/downloads\/LipSyncOne_SampleAssets2_v1\.zip" download/);
assert.ok((await readFile(resolve(siteRoot, "downloads/LipSyncOne_SampleAssets2_v1.zip"))).length > 0, "stage sample 2 before deploying");


// Search snippets must describe the same page across HTML, social cards and JSON-LD.
const pageHtml = new Map(await Promise.all(pages.map(async (page) => [page.canonical, await read(page.path)])));
for (const page of pages) {
  const html = pageHtml.get(page.canonical);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  assert.ok(title && description, page.path + " must describe its content");
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, page.path + " must have one primary heading");
  for (const field of ["og:title", "twitter:title"]) {
    assert.match(html, new RegExp('(?:property|name)="' + field + '" content="' + escapeRegExp(title) + '"'));
  }
  for (const field of ["og:description", "twitter:description"]) {
    assert.match(html, new RegExp('(?:property|name)="' + field + '" content="' + escapeRegExp(description) + '"'));
  }
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1])["@graph"];
  const webPage = graph.find((entry) => entry["@type"] === "WebPage");
  if (webPage) { assert.equal(webPage.name, title); assert.equal(webPage.description, description); }
  const software = graph.find((entry) => entry["@type"] === "SoftwareApplication");
  if (software) assert.equal(software.description, description);
  // Descriptive links must take readers to a real section, including across pages.
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href, page.canonical);
    if (url.origin !== "https://lipsyncone.studiojuh.com" || !url.hash) continue;
    const target = pageHtml.get(url.origin + url.pathname);
    if (!target) continue;
    assert.match(target, new RegExp('\\bid="' + escapeRegExp(decodeURIComponent(url.hash.slice(1))) + '"'), href + " must target an existing section");
  }
}

console.log("site metadata validation passed");

async function read(path) {
  return readFile(resolve(siteRoot, path), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
