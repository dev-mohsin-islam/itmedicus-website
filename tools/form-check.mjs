/**
 * Contact form probe — drives the real form in headless Chrome.
 *
 *   node tools/form-check.mjs [baseUrl]
 *
 * Reports the field inventory, every validation path, what the success path
 * actually does, and captures screenshots of each state.
 */
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:5180';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9343;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const proc = spawn(
  CHROME,
  [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--force-device-scale-factor=1', `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.join(root, 'qa', '.chrome-form'), 'about:blank',
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
const navigations = [];
const consoleErrors = [];

ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    return;
  }
  if (m.method === 'Page.frameScheduledNavigation' || m.method === 'Page.frameRequestedNavigation') {
    navigations.push(m.params.url);
  }
  if (m.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(m.params.exceptionDetails.text);
  }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
    consoleErrors.push(m.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
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
await send('Emulation.setFocusEmulationEnabled', { enabled: true });
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: BASE + '/contact/' });
await wait(1400);

const js = async (expression) => {
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

const shot = async (file, h = 1150) => {
  const data = await send('Page.captureScreenshot', {
    format: 'png', clip: { x: 0, y: 0, width: 1440, height: h, scale: 1 },
  });
  await writeFile(path.join(root, 'qa', file), Buffer.from(data.data, 'base64'));
};

/* ---------------------------------------------------------------- structure */

const inventory = await js(`(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return null;
  const fields = [...form.querySelectorAll('input, select, textarea')].map(el => {
    const label = el.id ? document.querySelector('label[for="' + el.id + '"]') : null;
    return {
      name: el.name,
      tag: el.tagName.toLowerCase(),
      type: el.type,
      required: el.required,
      hasLabel: !!(label && label.textContent.trim()),
      described: el.getAttribute('aria-describedby') || null,
      options: el.tagName === 'SELECT' ? [...el.options].map(o => o.value) : undefined,
    };
  });
  return {
    action: form.getAttribute('action'),
    method: form.getAttribute('method'),
    novalidate: form.hasAttribute('novalidate'),
    submitLabel: form.querySelector('[type=submit]').textContent.trim(),
    statusRole: form.querySelector('[data-form-status]')?.getAttribute('role') || null,
    fields,
  };
})()`);

if (!inventory) {
  console.log('  form not found — aborting');
  process.exit(1);
}

const required = inventory.fields.filter((f) => f.required).map((f) => f.name);
check(
  'all eight fields present',
  inventory.fields.length === 8,
  inventory.fields.map((f) => f.name).join(', ')
);
check(
  'every field has a label',
  inventory.fields.every((f) => f.hasLabel),
  inventory.fields.filter((f) => !f.hasLabel).map((f) => f.name).join(', ') || 'all labelled'
);
check(
  'required fields are name, email, message, consent',
  required.sort().join(',') === 'consent,email,message,name',
  required.join(', ')
);
check(
  'form degrades without JavaScript',
  inventory.action && inventory.action.startsWith('mailto:') && inventory.method === 'post',
  `action=${inventory.action} method=${inventory.method} novalidate=${inventory.novalidate}`
);
check(
  'enquiry type offers five options',
  inventory.fields.find((f) => f.name === 'enquiryType')?.options.length === 5,
  inventory.fields.find((f) => f.name === 'enquiryType')?.options.join(' / ')
);

await shot('form-1-default.png');

/* ------------------------------------------------------------- empty submit */

let state = await js(`(() => {
  document.querySelector('[data-contact-form]').requestSubmit();
  return {
    errors: document.querySelectorAll('.field.has-error').length,
    invalid: document.querySelectorAll('[aria-invalid="true"]').length,
    status: document.querySelector('[data-form-status]').className,
    text: document.querySelector('[data-form-status]').textContent.trim(),
    focus: document.activeElement.id,
  };
})()`);
check('empty submit is blocked and flags every required field', state.errors === 4 && state.invalid === 4, JSON.stringify(state));
check('first invalid field takes focus', state.focus === 'name', 'focus → ' + state.focus);
check('error banner is shown and announced', /is-visible/.test(state.status) && state.status.includes('err'), state.text);
await shot('form-2-errors.png');

/* -------------------------------------------------------------- error reset */

state = await js(`(() => {
  const el = document.querySelector('#name');
  el.value = 'Ayesha Rahman';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return {
    remaining: document.querySelectorAll('.field.has-error').length,
    cleared: !document.querySelector('#name').closest('.field').classList.contains('has-error'),
  };
})()`);
check('typing clears the field-level error', state.cleared && state.remaining === 3, `${state.remaining} remaining`);

/* ------------------------------------------------------------ email format */

state = await js(`(() => {
  const set = (sel, v) => { const el = document.querySelector(sel); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
  set('#email', 'ayesha@');
  set('#message', 'We would like to discuss digitising a prescription workflow for two clinics.');
  document.querySelector('[data-contact-form]').requestSubmit();
  return {
    emailErr: document.querySelector('#email-error').textContent.trim(),
    flagged: document.querySelector('#email').getAttribute('aria-invalid') === 'true',
    errors: document.querySelectorAll('.field.has-error').length,
  };
})()`);
// Two fields fail here: the malformed email and the still-unchecked consent.
check('malformed email is rejected with a specific message', state.flagged && state.errors === 2, `"${state.emailErr}" (${state.errors} errors)`);

/* ------------------------------------------------------- consent gating */

state = await js(`(() => {
  const email = document.querySelector('#email');
  email.value = 'ayesha@example.com';
  email.dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelector('[data-contact-form]').requestSubmit();
  const consentErr = document.querySelector('#consent').closest('.field');
  return {
    errors: document.querySelectorAll('.field.has-error').length,
    consentFlagged: consentErr.classList.contains('has-error'),
    status: document.querySelector('[data-form-status]').className,
  };
})()`);
check('submission is blocked until consent is given', state.consentFlagged && state.errors === 1, JSON.stringify(state));

/* ------------------------------------------------------------- success path */

navigations.length = 0;
state = await js(`(() => {
  const set = (sel, v) => { const el = document.querySelector(sel); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
  set('#organisation', 'Eastern Clinics Ltd');
  set('#phone', '+880 1700-000000');
  set('#enquiryType', 'Business enquiry');
  set('#subject', 'Prescription workflow project');
  document.querySelector('#consent').checked = true;
  document.querySelector('#consent').dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelector('[data-contact-form]').requestSubmit();
  const s = document.querySelector('[data-form-status]');
  return { cls: s.className, text: s.textContent.trim() };
})()`);

await wait(600);
const mailto = navigations.find((u) => u.startsWith('mailto:')) || null;

check('valid submission reaches the success state', state.cls.includes('form-status--ok'), state.text.slice(0, 70));
check(
  'it hands off to email with the message pre-filled',
  !!mailto,
  mailto ? decodeURIComponent(mailto).slice(0, 96) + '…' : 'no mailto navigation observed'
);
await shot('form-3-success.png');

/* ------------------------------------------------------------- mobile layout */

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await wait(400);
const mobile = await js(`(() => {
  const form = document.querySelector('[data-contact-form]');
  const r = form.getBoundingClientRect();
  const widest = Math.max(...[...form.querySelectorAll('input, select, textarea, button')].map(e => e.getBoundingClientRect().right));
  return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, widest: Math.round(widest), viewport: 390 };
})()`);
check('form fits the viewport at 390 px', mobile.overflow === 0 && mobile.widest <= mobile.viewport, JSON.stringify(mobile));

console.log(`\n${results.filter((r) => r.pass).length}/${results.length} form checks passed`);
console.log('console errors during run:', consoleErrors.length ? consoleErrors.join(' | ') : 'none');

ws.close();
proc.kill('SIGKILL');
process.exit(results.some((r) => !r.pass) ? 1 : 0);
