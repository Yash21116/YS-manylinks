/* data.js — shared data layer for index.html and admin.html
   Content lives in localStorage. Secret hash lives in config.js. */

const STORAGE_KEY = 'landingData';

const DEFAULTS = {
  profile: {
    initials: 'YS',
    image: '',
    name: 'Yash Shedke',
    role: 'Full Stack Developer · Builder',
    bio: 'Building things for the people, on the web.\nsystems and clean interfaces.',
    socials: {
      github: 'https://github.com/Yash21116',
      linkedin: 'https://www.linkedin.com/in/shade~kay/',
      twitter: 'https://stuff-unsaid.vercel.app/'
    }
  },
  projects: [
    {
      name: 'Unsaid — A Sanctuary for Your Thoughts',
      type: 'main',
      desc: 'A daily journaling application and intelligent counseling platform. Discover a secure, private sanctuary to explore your thoughts, reflect on your journey, and achieve lasting mental clarity and peace.',
      tags: ['Journaling', 'AI Counseling', 'Wellbeing', 'Safe Space'],
      link: 'https://stuff-unsaid.vercel.app/'
    },
    {
      name: 'GitPortfolio — Instant Developer Portfolios',
      type: 'side',
      desc: 'Transform your GitHub profile into a sleek, high-performance developer portfolio in seconds. Automatically syncs your repositories, contributions, and bio into a premium, responsive showcase.',
      tags: ['GitHub API', 'Portfolio Builder', 'Edge Hosting', 'Automation'],
      link: 'https://git-portfolio-builder.vercel.app/'
    },
    {
      name: 'Nexus Reels — AI-Powered Video Curator',
      type: 'side',
      desc: 'A library to save, organize, and query informational short-form videos. Powered by an AI-assisted chat interface that parses transcripts and answers questions about your content in real time.',
      tags: ['Short-form Video', 'Semantic Search', 'AI Agent'],
      link: 'https://nexus-reels.vercel.app/'
    }
  ]
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULTS);
    const parsed = JSON.parse(raw);
    if (parsed && parsed.profile && Array.isArray(parsed.projects)) {
      // Back-fill type field for older saved data
      parsed.projects = parsed.projects.map((p, i) => ({
        type: i === 0 ? 'main' : 'side',
        ...p
      }));
      return parsed;
    }
  } catch (e) {
    console.warn('loadData failed:', e);
  }
  return clone(DEFAULTS);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ── Secret — SHA-256 hash check against dynamic env ── */
async function checkSecret(input) {
  if (typeof window.ADMIN_SECRET_HASH !== 'string' || window.ADMIN_SECRET_HASH.length === 0) {
    return false;
  }
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex === window.ADMIN_SECRET_HASH;
}

/* ── HTML escaping ─────────────────────────────────────────── */
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
