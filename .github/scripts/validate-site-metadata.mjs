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
    canonical: "https://studio-juh.github.io/lip-sync-one-releases/",
    expectedType: "WebSite",
  },
  {
    path: "lp/index.html",
    canonical: "https://studio-juh.github.io/lip-sync-one-releases/lp/",
    expectedType: "SoftwareApplication",
  },
];

const sitemap = await read("sitemap.xml");
const robots = await read("robots.txt");
const llms = await read("llms.txt");
const verificationFiles = (await readdir(siteRoot)).filter((name) => /^google[a-z0-9]+\.html$/.test(name));

assert.match(robots, /^User-agent: \*$/m);
assert.match(robots, /^User-agent: OAI-SearchBot$/m);
assert.match(
  robots,
  /^Sitemap: https:\/\/studio-juh\.github\.io\/lip-sync-one-releases\/sitemap\.xml$/m,
);
assert.match(llms, /^# LipSyncOne$/m);
assert.match(llms, /音声解析はPC内で行い/);
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

console.log("site metadata validation passed");

async function read(path) {
  return readFile(resolve(siteRoot, path), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
