/**
 * Vercel serverless function — serves window.ADMIN_SECRET_HASH
 * from the ADMIN_SECRET_HASH environment variable set in the
 * Vercel dashboard (Settings → Environment Variables).
 *
 * Mapped to /config.js via vercel.json rewrites so it's a
 * drop-in replacement for the local server.js behaviour.
 */
module.exports = function handler(req, res) {
  const keys = Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('KEY') && !k.includes('AUTH') && !k.includes('TOKEN'));
  const hash = (process.env.ADMIN_SECRET_HASH || '').replace(/['"\\]/g, '');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache');
  res.end(`// Env keys: ${keys.join(', ')}\nhas_hash: ${!!process.env.ADMIN_SECRET_HASH}\nwindow.ADMIN_SECRET_HASH = '${hash}';\n`);
};
