/**
 * Visual + runtime QA harness.
 *
 * Launches headless Chrome, visits each route over the preview server,
 * records console errors, checks for horizontal overflow and a few
 * layout invariants, and writes full-page screenshots to ./qa
 *
 *   node tools/qa.mjs [baseUrl]
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'qa');
const base = process.argv[2] || 'http://127.0.0.1:5180';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;

const SHOTS = [
  { name: 'home-desktop', path: '/', w: 1440, h: 900 },
  { name: 'home-mobile', path: '/', w: 390, h: 844 },
  { name: 'about-desktop', path: '/about/', w: 1440, h: 900 },
  { name: 'products-desktop', path: '/products/', w: 1440, h: 900 },
  { name: 'product-dims', path: '/products/dims/', w: 1440, h: 900 },
  { name: 'services-desktop', path: '/services/', w: 1440, h: 900 },
  { name: 'industries-desktop', path: '/industries/', w: 1440, h: 900 },
  { name: 'insights-desktop', path: '/insights/', w: 1440, h: 900 },
  { name: 'article-desktop', path: '/insights/offline-first-healthcare-applications/', w: 1440, h: 900 },
  { name: 'contact-desktop', path: '/contact/', w: 1440, h: 900 },
  { name: 'careers-desktop', path: '/careers/', w: 1440, h: 900 },
  { name: 'legal-desktop', path: '/privacy/', w: 1440, h: 900 },
  { name: 'mobile-products', path: '/products/', w: 390, h: 844 },
  { name: 'tablet-home', path: '/', w: 820, h: 1100 },
];

const ALL_ROUTES = [
  '/', '/about/', '/products/', '/services/', '/industries/', '/insights/',
  '/careers/', '/contact/', '/privacy/', '/terms/', '/404.html',
  '/products/dims/', '/products/patient-aid/', '/products/pdm/', '/products/dims-vet/',
  '/products/pharma-plus/', '/products/skinvd/', '/products/mdoctor-agent/', '/products/med-dictionary/',
  '/insights/offline-first-healthcare-applications/', '/insights/digitising-prescription-workflow/',
  '/insights/planning-a-healthcare-mobile-application/',
  '/insights/digital-engagement-for-pharmaceutical-organisations/',
];

/* ---------------------------------------------------------------- cdp ---- */

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.listeners.forEach((fn) => fn(msg));
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error('CDP timeout: ' + method));
        }
      }, 30000);
    });
  }

  on(fn) {
    this.listeners.push(fn);
  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsConnect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  return new CDP(ws);
}

/* -------------------------------------------------------------- browser --- */

async function launch() {
  const proc = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--force-color-profile=srgb',
      `--remote-debugging-port=${PORT}`,
      '--user-data-dir=' + path.join(root, 'qa', '.chrome-profile'),
      'about:blank',
    ],
    { stdio: 'ignore', detached: false }
  );

  for (let i = 0; i < 80; i++) {
    await wait(250);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return proc;
    } catch {}
  }
  throw new Error('Chrome did not expose the debugging port');
}

async function newTarget() {
  const res = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
  if (!res.ok) throw new Error('Could not create target: ' + res.status);
  return res.json();
}

/* ---------------------------------------------------------------- checks -- */

const PROBE = `(() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  const offenders = [];
  if (overflow > 1) {
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > doc.clientWidth + 1.5 && r.width > 0 && getComputedStyle(el).position !== 'fixed') {
        offenders.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0,3).join('.') : ''));
      }
    });
  }
  const h1 = document.querySelectorAll('h1');
  const title = document.title;
  const imgsNoAlt = [...document.images].filter(i => !i.hasAttribute('alt')).length;
  const emptyLinks = [...document.querySelectorAll('a')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label')).length;
  return {
    title,
    h1Count: h1.length,
    h1: h1[0] ? h1[0].textContent.trim().slice(0, 90) : null,
    overflow,
    offenders: offenders.slice(0, 6),
    height: document.body.scrollHeight,
    imgsNoAlt,
    emptyLinks,
    unreplaced: (document.body.innerHTML.match(/undefined|\\[object Object\\]|NaN/g) || []).length,
    navLinks: document.querySelectorAll('.nav-list a').length,
    footerCols: document.querySelectorAll('.footer-col').length
  };
})()`;

/* ------------------------------------------------------------------ main --- */

await mkdir(outDir, { recursive: true });
const browser = await launch();
const target = await newTarget();
const cdp = await wsConnect(target.webSocketDebuggerUrl);

const consoleErrors = [];
const aborted = [];
const reqUrls = new Map();
cdp.on((msg) => {
  if (msg.method === 'Network.requestWillBeSent') {
    reqUrls.set(msg.params.requestId, msg.params.request.url);
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  }
  if (msg.method === 'Network.loadingFailed') {
    const url = reqUrls.get(msg.params.requestId) || '?';
    // A lazily loaded image or font that is still in flight when the page
    // navigates away is aborted by the browser; that is not a site defect.
    if (msg.params.errorText === 'net::ERR_ABORTED') aborted.push(url);
    else consoleErrors.push('LOAD FAILED: ' + msg.params.errorText + ' — ' + url);
  }
});

await cdp.send('Page.enable');
await cdp.send('Runtime.enable');
await cdp.send('Network.enable');

async function visit(url, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width < 700,
  });
  await cdp.send('Page.navigate', { url });
  await wait(120);
  for (let i = 0; i < 60; i++) {
    const { result } = await cdp.send('Runtime.evaluate', {
      expression: 'document.readyState', returnByValue: true,
    });
    if (result.value === 'complete') break;
    await wait(120);
  }
  await wait(450);
  // Force every reveal element to its settled state: captureBeyondViewport
  // does not fire IntersectionObserver for content below the fold.
  await cdp.send('Runtime.evaluate', {
    expression: `document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'));`,
  });
  await wait(500);
}

async function probe() {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression: PROBE, returnByValue: true,
  });
  return result.value;
}

async function shot(file, width) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollHeight', returnByValue: true,
  });
  const height = Math.min(result.value + 40, 12000);
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  await writeFile(path.join(outDir, file + '.png'), Buffer.from(data, 'base64'));
}

/* 1. every route: console health + overflow */
const report = [];
const before = consoleErrors.length;
for (const route of ALL_ROUTES) {
  await visit(base + route, 1440, 900);
  const info = await probe();
  report.push({ route, ...info, errors: consoleErrors.length - before });
}

/* 2. mobile overflow pass */
const mobile = [];
for (const route of ['/', '/products/', '/contact/', '/services/', '/insights/']) {
  await visit(base + route, 390, 844);
  const info = await probe();
  mobile.push({ route, mobileOverflow: info.overflow, offenders: info.offenders });
}

/* 3. screenshots */
for (const s of SHOTS) {
  await visit(base + s.path, s.w, s.h);
  await shot(s.name, s.w);
  process.stdout.write(`  shot ${s.name}\n`);
}

await writeFile(path.join(outDir, 'report.json'), JSON.stringify({ report, mobile, consoleErrors }, null, 2));

/* ------------------------------------------------------------------ print --- */

console.log('\n=== ROUTE HEALTH ===');
let problems = 0;
for (const r of report) {
  const bad = r.overflow > 1 || r.h1Count !== 1 || r.unreplaced > 0 || r.errors > 0 || r.emptyLinks > 0;
  if (bad) problems++;
  console.log(
    `${bad ? 'FAIL' : ' ok '} ${r.route.padEnd(58)} h1:${r.h1Count} ovf:${String(r.overflow).padStart(2)} bad:${r.unreplaced} err:${r.errors} emptyA:${r.emptyLinks} h:${r.height}`
  );
}

console.log('\n=== MOBILE OVERFLOW ===');
for (const m of mobile) {
  console.log(`${m.mobileOverflow > 1 ? 'FAIL' : ' ok '} ${m.route.padEnd(20)} overflow:${m.mobileOverflow} ${m.offenders.join(', ')}`);
}

console.log('\n=== CONSOLE (' + consoleErrors.length + ') ===');
consoleErrors.slice(0, 12).forEach((e) => console.log('  • ' + e.slice(0, 200)));

console.log(`\n${problems} route(s) with issues · screenshots in qa/\n`);

try { cdp.ws.close(); } catch {}
browser.kill('SIGKILL');
process.exit(0);
