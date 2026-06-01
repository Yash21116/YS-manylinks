module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isConfigured = !!(process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_HASH);
  res.status(200).json({ configured: isConfigured });
};
