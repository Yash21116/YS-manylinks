module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    // Fallback: return empty data if Redis not configured
    return res.status(200).json({
      profile: {
        initials: 'YS',
        image: '',
        name: 'Yash Shedke',
        role: 'Full Stack Developer · Builder',
        bio: 'Building things for the web — dev tooling, systems, and clean interfaces.',
        socials: { github: '#', linkedin: '#', twitter: '#' }
      },
      projects: []
    });
  }

  try {
    const response = await fetch(`${url}/get/landing-page-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      // Key doesn't exist yet, return defaults
      return res.status(200).json({
        profile: {
          initials: 'YS',
          image: '',
          name: 'Yash Shedke',
          role: 'Full Stack Developer · Builder',
          bio: 'Building things for the web — dev tooling, systems, and clean interfaces.',
          socials: { github: '#', linkedin: '#', twitter: '#' }
        },
        projects: []
      });
    }

    const data = await response.json();
    const profile = JSON.parse(data.result || '{}');

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error loading profile:', error);
    // Return defaults on error
    res.status(200).json({
      profile: {
        initials: 'YS',
        image: '',
        name: 'Yash Shedke',
        role: 'Full Stack Developer · Builder',
        bio: 'Building things for the web — dev tooling, systems, and clean interfaces.',
        socials: { github: '#', linkedin: '#', twitter: '#' }
      },
      projects: []
    });
  }
};
