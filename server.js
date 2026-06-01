/**
 * server.js — zero-dependency static server with server-side auth.
 * Handles admin login verification on the backend to prevent
 * exposing password hashes to the client.
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

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

// Verify admin password server-side
function verifyAdminPassword(plaintext) {
  const env = readEnv();
  const stored = env.ADMIN_PASSWORD || env.ADMIN_SECRET_HASH || '';
  if (!stored) return false;
  const inputHash = crypto.createHash('sha256').update(plaintext).digest('hex');
  const storedHash = crypto.createHash('sha256').update(stored).digest('hex');
  return inputHash === storedHash;
}

http.createServer((req, res) => {
  const reqPath = req.url.split('?')[0];
  const urlPath = reqPath === '/' ? '/index.html' : reqPath;

  // Server-side admin password verification
  if (urlPath === '/api/verify-admin' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body);
        const isValid = verifyAdminPassword(password || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: isValid }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // Check if admin is configured (don't expose the hash)
  if (urlPath === '/api/admin-configured') {
    const env = readEnv();
    const isConfigured = !!(env.ADMIN_PASSWORD || env.ADMIN_SECRET_HASH);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ configured: isConfigured }));
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
