const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    const storedSecret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_HASH || '';

    if (!storedSecret) {
      return res.status(200).json({ valid: false });
    }

    // Hash both inputs and compare
    const inputHash = crypto.createHash('sha256').update(password || '').digest('hex');
    const storedHash = crypto.createHash('sha256').update(storedSecret).digest('hex');

    res.status(200).json({ valid: inputHash === storedHash });
  } catch (error) {
    console.error('verify-admin error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
};
