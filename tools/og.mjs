/**
 * Renders src/og/og-card.html to src/assets/og-default.png (1200×630)
 * using headless Chrome, so the social share image matches the live design.
 *
 *   node tools/og.mjs
 */
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9334;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const proc = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.join(root, 'qa', '.chrome-og'),
    'about:blank',
  ],
  { stdio: 'ignore' }
);

let version = null;
for (let i = 0; i < 80 && !version; i++) {
  await wait(250);
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    if (res.ok) version = await res.json();
  } catch {}
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
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(root, 'src/og/og-card.html')).href });
await wait(2500); // allow webfont to arrive

const { data } = await send('Page.captureScreenshot', {
  format: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
});

await mkdir(path.join(root, 'src/assets/img'), { recursive: true });
await writeFile(path.join(root, 'src/assets/img/og-default.png'), Buffer.from(data, 'base64'));
console.log('wrote src/assets/img/og-default.png');

ws.close();
proc.kill('SIGKILL');
process.exit(0);
