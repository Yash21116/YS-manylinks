/**
 * server.js — zero-dependency static server with .env injection.
 * Reads .env on every request to /config.js so you can update the
 * secret hash without restarting.
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3333;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
};

// Parse .env without any npm dependency
function readEnv() {
  try {
    return fs.readFileSync(path.join(ROOT, '.env'), 'utf-8')
      .split('\n')
      .reduce((acc, line) => {
        const t = line.trim();
        if (!t || t.startsWith('#')) return acc;
        const eq = t.indexOf('=');
        if (eq > 0) acc[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
        return acc;
      }, {});
  } catch { return {}; }
}

http.createServer((req, res) => {
  const reqPath = req.url.split('?')[0];
  const urlPath = reqPath === '/' ? '/index.html' : reqPath;

  // Inject ADMIN_SECRET_HASH from .env into config.js on the fly
  if (urlPath === '/config.js') {
    const env = readEnv();
    const plaintext = env.ADMIN_PASSWORD || env.ADMIN_SECRET_HASH || '';
    const hash = crypto.createHash('sha256').update(plaintext).digest('hex');
    res.writeHead(200, { 'Content-Type': MIME['.js'], 'Cache-Control': 'no-store' });
    res.end(`window.ADMIN_SECRET_HASH = '${hash}';\n`);
    return;
  }

  const filePath = path.resolve(ROOT, urlPath.slice(1));

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });

}).listen(PORT, '127.0.0.1', () =>
  console.log(`\n  Landing page  →  http://localhost:${PORT}\n  Admin         →  http://localhost:${PORT}/admin.html\n`)
);
