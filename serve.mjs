/**
 * Minimal static preview server for the built site.
 *
 *   node serve.mjs            → http://localhost:5180
 *   node serve.mjs 8080       → custom port
 *
 * Serves ./dist with directory-index resolution and a 404 fallback.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The site is built into the project root, which also contains source and
// tooling — those paths are refused so a preview never exposes them.
const root = path.dirname(fileURLToPath(import.meta.url));

const DENY = new Set([
  'src', 'tools', 'qa', 'assets/source', '.git',
  'build.mjs', 'serve.mjs', 'package.json', 'README.md',
  'LAUNCH-CHECKLIST.md', '.gitignore',
]);
const port = Number(process.argv[2] || process.env.PORT || 5180);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

if (!existsSync(path.join(root, 'index.html'))) {
  console.error('index.html not found — run `node build.mjs` first.');
  process.exit(1);
}

function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const safe = path.normalize(clean).replace(/^(\.\.[/\\])+/, '');
  const candidate = path.join(root, safe);

  if (!candidate.startsWith(root)) return null;

  const rel = path.relative(root, candidate).split(path.sep).join('/');
  for (const blocked of DENY) {
    if (rel === blocked || rel.startsWith(blocked + '/')) return null;
  }
  return candidate;
}

const server = createServer(async (req, res) => {
  let target = resolveTarget(req.url || '/');
  if (!target) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    let info = await stat(target).catch(() => null);

    if (info && info.isDirectory()) {
      target = path.join(target, 'index.html');
      info = await stat(target).catch(() => null);
    }

    if (!info) {
      const notFound = path.join(root, '404.html');
      const html = await readFile(notFound).catch(() => '<h1>404</h1>');
      res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(html);
      return;
    }

    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500).end('Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`\n  ITmedicus preview → http://localhost:${port}\n  serving ${root}\n`);
});
