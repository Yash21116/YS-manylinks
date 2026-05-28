module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    // Parse body (Vercel doesn't auto-parse for plain Node handlers)
    let data = req.body;
    if (typeof data === 'string') data = JSON.parse(data);

    const value = JSON.stringify(data);

    // Upstash REST API pipeline format: send Redis command as array
    // ["SET", key, value, "EX", ttl_in_seconds]
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['SET', 'landing-page-profile', value, 'EX', 31536000]
      ])
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('save-profile error:', error.message);
    res.status(500).json({ error: 'Failed to save profile', details: error.message });
  }
};
