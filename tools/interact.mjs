/**
 * Interaction tests — drives the real UI in headless Chrome.
 *
 *   node tools/interact.mjs
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeFile } from 'node:fs/promises';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:5180';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9335;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const proc = spawn(
  CHROME,
  [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--force-device-scale-factor=1', `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.join(root, 'qa', '.chrome-int'), 'about:blank',
  ],
  { stdio: 'ignore' }
);

for (let i = 0; i < 80; i++) {
  await wait(250);
  try { if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) break; } catch {}
}

const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true });
  ws.addEventListener('error', rej, { once: true });
});

let id = 0;
const pending = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send('Page.enable');
await send('Runtime.enable');

async function go(url, width = 1440, height = 900) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });
  await send('Page.navigate', { url });
  await wait(700);
}

const evalJs = async (expression) => {
  const { result, exceptionDetails } = await send('Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise: true,
  });
  if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description || ''));
  return result.value;
};

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? ' ok ' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

/* 1. mobile drawer ------------------------------------------------------- */
await go(BASE + '/', 390, 844);
await evalJs(`document.querySelector('.menu-toggle').click()`);
await wait(300);
let st = await evalJs(`(() => {
  const d = document.getElementById('mobile-nav');
  return { hidden: d.hidden, locked: document.body.classList.contains('is-locked'),
           focusIn: d.contains(document.activeElement) };
})()`);
check('mobile drawer opens', st.hidden === false && st.locked === true, JSON.stringify(st));
check('mobile drawer moves focus inside', st.focusIn === true);

await evalJs(`document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}))`);
await wait(300);
st = await evalJs(`({ hidden: document.getElementById('mobile-nav').hidden, locked: document.body.classList.contains('is-locked') })`);
check('Escape closes drawer and unlocks scroll', st.hidden === true && st.locked === false, JSON.stringify(st));

/* 2. mega menu on hover / focus ----------------------------------------- */
await send('Emulation.setFocusEmulationEnabled', { enabled: true });
await go(BASE + '/about/', 1440, 900);
const mega = await evalJs(`(() => {
  const panel = document.querySelector('.megamenu');
  const before = getComputedStyle(panel).visibility;
  const trigger = document.querySelector('.nav-item.has-menu a');
  trigger.focus();
  return new Promise(r => setTimeout(() => r({
    before, after: getComputedStyle(panel).visibility,
    focused: document.activeElement === trigger,
    links: panel.querySelectorAll('a').length,
    current: document.querySelectorAll('.nav-link[aria-current]').length,
  }), 200));
})()`);
check('mega menu reveals on keyboard focus', mega.before === 'hidden' && mega.after === 'visible', JSON.stringify(mega));
check('mega menu lists all 8 products', mega.links === 9, `${mega.links} links (8 + browse all)`);
check('current page marked in navigation', mega.current === 1, `${mega.current} aria-current`);

// Real pointer hover (CSS :hover cannot be faked from script).
const navBox = await evalJs(`(() => {
  const r = document.querySelector('.nav-item.has-menu a').getBoundingClientRect();
  return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
})()`);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: navBox.x, y: navBox.y });
await wait(700);
const hoverState = await evalJs(`(() => ({
  cols: [...document.querySelectorAll('.mm-col')].map(c => Number(getComputedStyle(c).opacity)),
  promo: Number(getComputedStyle(document.querySelector('.mm-promo')).opacity),
  panel: getComputedStyle(document.querySelector('.megamenu')).visibility,
}))()`);
check(
  'mega-menu columns fade in on pointer hover',
  hoverState.panel === 'visible' && hoverState.cols.every((o) => o > 0.95) && hoverState.promo > 0.95,
  JSON.stringify(hoverState)
);

const menuShot = await send('Page.captureScreenshot', { format: 'png' });
await writeFile(path.join(root, 'qa', 'menu-open.png'), Buffer.from(menuShot.data, 'base64'));

/* 3. product filter ------------------------------------------------------ */
await go(BASE + '/products/', 1440, 900);
const filter = await evalJs(`(() => {
  const btn = [...document.querySelectorAll('.filter-btn')].find(b => b.dataset.filter === 'veterinary');
  btn.click();
  const cards = [...document.querySelectorAll('.product-card')];
  return {
    pressed: btn.getAttribute('aria-pressed'),
    visible: cards.filter(c => !c.hidden).length,
    total: cards.length,
    count: document.querySelector('[data-filter-count]').textContent,
  };
})()`);
check('filter narrows the directory', filter.visible === 1 && filter.pressed === 'true', JSON.stringify(filter));
check('filter announces the result count', filter.count === '1 product', filter.count);

const reset = await evalJs(`(() => {
  document.querySelector('.filter-btn[data-filter="all"]').click();
  return document.querySelectorAll('.product-card:not([hidden])').length;
})()`);
check('“All products” restores the full list', reset === 8, `${reset} visible`);

/* 3b. product artwork renders ------------------------------------------- */
await go(BASE + '/products/', 1440, 900);
const icons = await evalJs(`(() => {
  const imgs = [...document.querySelectorAll('.product-card .pc-icon img')];
  return {
    count: imgs.length,
    loaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
    sources: [...new Set(imgs.map(i => i.getAttribute('src')))].sort(),
    missing: [...document.querySelectorAll('.product-card .pc-icon--mono')].length,
  };
})()`);
check(
  'every product card renders its artwork',
  icons.count === 7 && icons.loaded === 7 && icons.missing === 1,
  JSON.stringify(icons)
);

/* 4. contact form validation -------------------------------------------- */
await go(BASE + '/contact/', 1440, 900);
let form = await evalJs(`(() => {
  document.querySelector('[data-contact-form]').requestSubmit();
  return {
    errors: document.querySelectorAll('.field.has-error').length,
    statusVisible: document.querySelector('[data-form-status]').classList.contains('is-visible'),
    focused: document.activeElement.id,
  };
})()`);
check('empty form submit blocks and marks fields', form.errors >= 2 && form.statusVisible, JSON.stringify(form));
check('first invalid field receives focus', form.focused === 'name', form.focused);

form = await evalJs(`(() => {
  const set = (sel, val) => { const el = document.querySelector(sel); el.value = val; el.dispatchEvent(new Event('input', {bubbles:true})); };
  set('#name', 'Ayesha Rahman');
  set('#email', 'not-an-email');
  set('#message', 'We would like to discuss a prescription workflow project.');
  document.querySelector('#consent').checked = true;
  document.querySelector('[data-contact-form]').requestSubmit();
  return {
    errors: document.querySelectorAll('.field.has-error').length,
    emailErr: document.querySelector('#email-error').textContent,
    invalidEmailFlagged: document.querySelector('#email').getAttribute('aria-invalid') === 'true',
  };
})()`);
check('invalid email is rejected with a specific message', form.invalidEmailFlagged && form.errors === 1, form.emailErr);

form = await evalJs(`(() => {
  const el = document.querySelector('#email');
  el.value = 'ayesha@example.com';
  el.dispatchEvent(new Event('input', {bubbles:true}));
  document.querySelector('[data-contact-form]').requestSubmit();
  const s = document.querySelector('[data-form-status]');
  return { ok: s.classList.contains('form-status--ok'), text: s.textContent.trim().slice(0, 60) };
})()`);
check('valid submission reaches the success state', form.ok === true, form.text);

/* 5. reveal + nav state -------------------------------------------------- */
await go(BASE + '/', 1440, 900);
const navstate = await evalJs(`(() => {
  window.scrollTo(0, 600);
  return new Promise(r => setTimeout(() => r({
    stuck: document.querySelector('.site-header').classList.contains('is-stuck'),
    progress: document.querySelector('.scroll-progress span').style.width,
  }), 250));
})()`);
check('header switches to stuck state on scroll', navstate.stuck === true, 'progress ' + navstate.progress);

/* 6. details accordion --------------------------------------------------- */
await go(BASE + '/services/', 1440, 900);
const acc = await evalJs(`(() => {
  const d = document.querySelectorAll('details.acc-item');
  return { total: d.length, firstOpen: d[0].open };
})()`);
check('FAQ renders as native disclosure widgets', acc.total === 6 && acc.firstOpen === true, `${acc.total} items`);

/* 7. motion layer -------------------------------------------------------- */
await go(BASE + '/', 1440, 900);
const brandLogo = await evalJs(`(() => {
  const h = document.querySelector('.site-header .brandlogo');
  const f = document.querySelector('.site-footer .brandlogo');
  return {
    headerSrc: h ? h.getAttribute('src') : null,
    headerLoaded: h ? h.complete && h.naturalWidth > 0 : false,
    footerSrc: f ? f.getAttribute('src') : null,
    footerLoaded: f ? f.complete && f.naturalWidth > 0 : false,
  };
})()`);
check(
  'official logo loads in header and footer',
  brandLogo.headerLoaded && brandLogo.footerLoaded && /logo/.test(brandLogo.headerSrc),
  JSON.stringify(brandLogo)
);

const settled = await evalJs(`(() => {
  return new Promise(r => setTimeout(() => {
    const els = [...document.querySelectorAll('.hero-copy > *'), document.querySelector('.hero-visual')];
    return r(els.map(e => Number(getComputedStyle(e).opacity)));
  }, 1900));
})()`);
check(
  'entrance animation settles (nothing left invisible)',
  settled.length >= 5 && settled.every((o) => o > 0.98),
  settled.map((o) => o.toFixed(2)).join(', ')
);

const counters = await evalJs(`(() => {  document.querySelector('.proof-strip').scrollIntoView({ block: 'center' });
  return new Promise(r => setTimeout(() => r(
    [...document.querySelectorAll('[data-count]')].map(e => e.textContent.trim())
  ), 1500));
})()`);
check('proof numbers count up to their values', counters.join(',') === '2011,8,4,3', counters.join(', '));

const tilt = await evalJs(`(() => {
  const card = document.querySelector('.product-card-link');
  const r = card.getBoundingClientRect();
  card.dispatchEvent(new PointerEvent('pointermove', {
    clientX: r.left + r.width * 0.8, clientY: r.top + r.height * 0.25, bubbles: true,
  }));
  const after = getComputedStyle(card);
  const rx = card.style.getPropertyValue('--rx');
  const ry = card.style.getPropertyValue('--ry');
  card.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
  return { rx, ry, mx: card.style.getPropertyValue('--mx'), transform: after.transform.slice(0, 24) };
})()`);
check('product cards tilt toward the pointer', tilt.rx !== '' && tilt.ry !== '', JSON.stringify(tilt));

/* 8. reduced motion ------------------------------------------------------ */
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});
await go(BASE + '/', 1440, 900);
const rm = await evalJs(`(() => {
  const h1 = document.querySelector('.hero h1');
  const visual = document.querySelector('.hero-visual');
  const reveal = document.querySelector('.reveal');
  return {
    h1Animation: getComputedStyle(h1).animationName,
    h1Opacity: getComputedStyle(h1).opacity,
    visualOpacity: getComputedStyle(visual).opacity,
    revealOpacity: getComputedStyle(reveal).opacity,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
})()`);
check(
  'reduced motion: no entrance animation, content visible',
  rm.reduced && rm.h1Animation === 'none' && rm.h1Opacity === '1' && rm.visualOpacity === '1' && rm.revealOpacity === '1',
  JSON.stringify(rm)
);
await send('Emulation.setEmulatedMedia', { features: [] });

/* 9. works straight from disk (no server) -------------------------------- */const fileUrl = pathToFileURL(path.join(root, 'about/index.html')).href;
await go(fileUrl, 1440, 900);
const offline = await evalJs(`(() => {
  const sheets = [...document.styleSheets].filter(s => s.href && /(base|components|pages|animations)\\.css/.test(s.href));
  const logo = document.querySelector('.site-header .brandlogo');
  return {
    sheets: sheets.length,
    font: getComputedStyle(document.body).fontFamily,
    logoHref: logo ? logo.getAttribute('src') : null,
    logoLoaded: logo ? logo.complete && logo.naturalWidth > 0 : false,
    logoPx: logo ? logo.naturalWidth + 'x' + logo.naturalHeight : null,
    logoH: logo ? Math.round(logo.getBoundingClientRect().height) : null,
    navHref: document.querySelector('.nav-list a').getAttribute('href'),
    cssOk: getComputedStyle(document.querySelector('.site-header')).position === 'sticky',
  };
})()`);
check(
  'site works opened from disk (file://) with logo rendered',
  offline.sheets === 4 && offline.cssOk && offline.logoLoaded && offline.logoH > 20,
  JSON.stringify(offline)
);

/* summary */
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed\n`);
ws.close();
proc.kill('SIGKILL');
process.exit(failed.length ? 1 : 0);
