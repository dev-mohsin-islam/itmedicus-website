/**
 * Static site generator — zero dependencies.
 *
 *   node build.mjs
 *
 * Renders every page from src/content.mjs + src/pages/*, copies assets,
 * and writes sitemap.xml, robots.txt and the 404 page into ./dist
 */
import { mkdir, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { products, insights, site } from './src/content.mjs';
import { homePage } from './src/pages/home.mjs';
import { aboutPage } from './src/pages/about.mjs';
import { productsPage } from './src/pages/products.mjs';
import { productPage } from './src/pages/product.mjs';
import { servicesPage } from './src/pages/services.mjs';
import { industriesPage } from './src/pages/industries.mjs';
import { insightsPage, articlePage } from './src/pages/insights.mjs';
import { careersPage } from './src/pages/careers.mjs';
import { contactPage } from './src/pages/contact.mjs';
import { privacyPage, termsPage } from './src/pages/legal.mjs';
import { notFoundPage } from './src/pages/notfound.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));

/*
 * The built site is written to the project root, so index.html sits at the top
 * level and the folder can be uploaded or opened as-is. The root also holds the
 * source and tooling, so the clean step only ever removes the entries below —
 * it never deletes the directory itself.
 */
const dist = root;

const SITE_ENTRIES = [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'assets',
  'about',
  'careers',
  'contact',
  'industries',
  'insights',
  'privacy',
  'products',
  'services',
  'terms',
];

/* ------------------------------------------------------------------ pages */

const pages = [
  { url: '/', file: 'index.html', html: homePage(), priority: '1.0', changefreq: 'monthly' },
  { url: '/about/', file: 'about/index.html', html: aboutPage(), priority: '0.8' },
  { url: '/products/', file: 'products/index.html', html: productsPage(), priority: '0.9' },
  ...products.map((p) => ({
    url: `/products/${p.slug}/`,
    file: `products/${p.slug}/index.html`,
    html: productPage(p),
    priority: '0.8',
  })),
  { url: '/services/', file: 'services/index.html', html: servicesPage(), priority: '0.9' },
  { url: '/industries/', file: 'industries/index.html', html: industriesPage(), priority: '0.7' },
  { url: '/insights/', file: 'insights/index.html', html: insightsPage(), priority: '0.7' },
  ...insights.map((a) => ({
    url: `/insights/${a.slug}/`,
    file: `insights/${a.slug}/index.html`,
    html: articlePage(a),
    priority: '0.6',
    lastmod: a.date,
  })),
  { url: '/careers/', file: 'careers/index.html', html: careersPage(), priority: '0.6' },
  { url: '/contact/', file: 'contact/index.html', html: contactPage(), priority: '0.8' },
  { url: '/privacy/', file: 'privacy/index.html', html: privacyPage(), priority: '0.3' },
  { url: '/terms/', file: 'terms/index.html', html: termsPage(), priority: '0.3' },
  { url: '/404.html', file: '404.html', html: notFoundPage(), noindex: true },
];

/* --------------------------------------------------------------- helpers */

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.noindex)
    .map(
      (p) => `  <url>
    <loc>${site.origin}${p.url}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq || 'yearly'}</changefreq>
    <priority>${p.priority || '0.5'}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const ROBOTS = `# robots.txt — ${site.name}
User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${site.origin}/sitemap.xml
`;

/* ------------------------------------------------------------------ build */

async function build() {
  const started = Date.now();

  for (const entry of SITE_ENTRIES) {
    const target = path.resolve(root, entry);
    if (!target.startsWith(root + path.sep)) {
      throw new Error(`refusing to touch a path outside the project: ${target}`);
    }
    if (entry === 'assets' && existsSync(path.join(root, 'assets', 'source'))) {
      throw new Error(
        'assets/source is still present. Move the brand masters to src/assets/source before building, ' +
          'otherwise the generated assets folder would replace them.'
      );
    }
    if (existsSync(target)) await rm(target, { recursive: true, force: true });
  }
  await mkdir(dist, { recursive: true });

  // assets — styles, scripts and images are copied explicitly
  await mkdir(path.join(dist, 'assets/css'), { recursive: true });
  await mkdir(path.join(dist, 'assets/js'), { recursive: true });
  await mkdir(path.join(dist, 'assets/img'), { recursive: true });

  for (const f of ['base.css', 'components.css', 'pages.css', 'animations.css']) {
    await cp(path.join(root, 'src/assets', f), path.join(dist, 'assets/css', f));
  }
  await cp(path.join(root, 'src/assets/main.js'), path.join(dist, 'assets/js/main.js'));

  for (const f of [
    'itmedicus-logo.png',
    'itmedicus-logo-white.png',
    'app-mark-512.png',
    'apple-touch-icon.png',
    'favicon-32.png',
    'favicon-16.png',
    'og-default.png',
  ]) {
    await cp(path.join(root, 'src/assets/img', f), path.join(dist, 'assets/img', f));
  }
  await cp(path.join(root, 'src/assets/img/products'), path.join(dist, 'assets/img/products'), {
    recursive: true,
  });

  // pages
  for (const page of pages) {
    const out = path.join(dist, page.file);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, page.html, 'utf8');
  }

  await writeFile(path.join(dist, 'sitemap.xml'), sitemap(), 'utf8');
  await writeFile(path.join(dist, 'robots.txt'), ROBOTS, 'utf8');

  const kb = (s) => (s / 1024).toFixed(1) + ' KB';
  const htmlBytes = pages.reduce((n, p) => n + Buffer.byteLength(p.html), 0);

  console.log(`\n  ${site.name} — build complete in ${Date.now() - started}ms`);
  console.log(`  ${pages.length} pages · ${kb(htmlBytes)} HTML total`);
  console.log(`  output → project root (${root})\n`);
  for (const p of pages) {
    console.log(`  ${p.url === '/' ? '/' : p.url}  →  ${p.file}`);
  }
  console.log('');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
