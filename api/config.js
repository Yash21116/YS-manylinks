const crypto = require('crypto');

module.exports = function handler(req, res) {
  const plaintext = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_HASH || '';
  const hash = plaintext ? crypto.createHash('sha256').update(plaintext).digest('hex') : '';
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache');
  res.end(`window.ADMIN_SECRET_HASH = '${hash}';\n`);
};
