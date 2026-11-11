/**
 * Static audit of the built site — no browser needed.
 *
 *   node tools/audit.mjs
 *
 * Checks internal links, metadata, heading structure, duplicate ids, alt text,
 * sitemap coverage and page weight.
 */
import { readFile, stat } from 'node:fs/promises';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = root;
// Tooling and sources live beside the generated site now — never audit them.
const SKIP = new Set(['src', 'tools', 'qa', 'node_modules', '.git']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const all = walk(dist);
const htmlFiles = all.filter((f) => f.endsWith('.html') && !f.includes(path.join('assets')));
if (!htmlFiles.length) {
  console.error('no built pages found — run `node build.mjs` first');
  process.exit(1);
}
const issues = [];
const add = (level, file, message) => issues.push({ level, file: path.relative(dist, file), message });

/* ------------------------------------------------------------------ pages */

const routes = new Map(); // url -> file
for (const file of htmlFiles) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  const url = rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? '/' + rel.slice(0, -'index.html'.length) : '/' + rel;
  routes.set(url, file);
}

let totalHtml = 0;
let totalLinkCount = 0;

for (const [url, file] of routes) {
  const html = await readFile(file, 'utf8');
  totalHtml += Buffer.byteLength(html);

  if (!/<title>[^<]{10,}<\/title>/.test(html)) add('error', file, 'missing or too-short <title>');
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) add('error', file, 'missing description');
  if (!/<link rel="canonical" href="https?:\/\//.test(html)) add('error', file, 'missing absolute canonical');
  if (!/<meta property="og:image"/.test(html)) add('error', file, 'missing og:image');
  if (!/<html lang="en"/.test(html)) add('error', file, 'missing lang attribute');

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) add('error', file, `${h1s.length} h1 elements`);

  // heading level jumps
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      add('warn', file, `heading jumps h${levels[i - 1]} → h${levels[i]}`);
      break;
    }
  }

  // duplicate ids
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) add('error', file, `duplicate id: ${[...new Set(dupes)].join(', ')}`);

  // images without alt
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt=/.test(t));
  if (noAlt.length) add('error', file, `${noAlt.length} img without alt`);

  // unresolved template values
  if (/undefined|\[object Object\]|\{\{/.test(html)) add('error', file, 'unresolved template value');

  // search-snippet hygiene
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  if (title.length > 70) add('warn', file, `title ${title.length} chars (may truncate)`);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (desc.length > 170) add('warn', file, `description ${desc.length} chars`);
  if (desc.length < 70) add('warn', file, `description only ${desc.length} chars`);

  // structured data must parse and declare a type
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) add('error', file, 'no JSON-LD');
  for (const [, raw] of blocks) {
    let data;
    try { data = JSON.parse(raw); }
    catch { add('error', file, 'invalid JSON-LD'); continue; }
    const nodes = data['@graph'] || [data];
    if (!data['@context']) add('error', file, 'JSON-LD without @context');
    for (const node of nodes) {
      if (!node['@type']) add('error', file, `JSON-LD node without @type`);
    }
  }
  if (!/Organization/.test(html)) add('error', file, 'no Organization entity');

  // internal links + asset references
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;
    totalLinkCount++;
    const clean = ref.split('#')[0].split('?')[0];
    if (!clean) continue;
    let target = path.resolve(path.dirname(file), clean);
    if (!existsSync(target) && existsSync(target + '.html')) target += '.html';
    const ok = existsSync(target) && (target.endsWith('.html') || stat(target));
    if (!existsSync(target)) add('error', file, `broken link → ${ref}`);
  }
}

/* ---------------------------------------------------------------- sitemap */

const sitemapPath = path.join(dist, 'sitemap.xml');
if (!existsSync(sitemapPath)) add('error', sitemapPath, 'sitemap missing');
else {
  const xml = await readFile(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://itmedicus.com', ''));
  for (const loc of locs) {
    if (!routes.has(loc)) add('error', sitemapPath, `sitemap URL has no page: ${loc}`);
  }
  const missing = [...routes.keys()].filter((u) => !locs.includes(u) && u !== '/404.html');
  if (missing.length) add('warn', sitemapPath, `pages not in sitemap: ${missing.join(', ')}`);
}

/* -------------------------------------------------------------- reporting */

const images = all.filter((f) => /\.(png|jpe?g|webp|svg)$/.test(f));
const imgBytes = (await Promise.all(images.map((f) => stat(f)))).reduce((n, s) => n + s.size, 0);
const biggest = (
  await Promise.all(images.map(async (f) => ({ f: path.relative(dist, f), size: (await stat(f)).size })))
).sort((a, b) => b.size - a.size).slice(0, 4);

const errors = issues.filter((i) => i.level === 'error');
const warns = issues.filter((i) => i.level === 'warn');

console.log(`\nStatic audit — ${routes.size} pages, ${totalLinkCount} internal references`);
console.log(`HTML ${(totalHtml / 1024).toFixed(0)} KB · images ${(imgBytes / 1024 / 1024).toFixed(2)} MB across ${images.length} files`);
console.log(`largest images: ${biggest.map((b) => `${b.f} ${(b.size / 1024).toFixed(0)}KB`).join(', ')}`);

if (errors.length) {
  console.log(`\nERRORS (${errors.length})`);
  for (const e of errors) console.log(`  ${e.file}  ${e.message}`);
} else console.log('\nno errors');

if (warns.length) {
  console.log(`\nWARNINGS (${warns.length})`);
  for (const w of warns.slice(0, 12)) console.log(`  ${w.file}  ${w.message}`);
} else console.log('no warnings');

console.log('');
process.exit(errors.length ? 1 : 0);
