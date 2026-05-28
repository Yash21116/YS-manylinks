/* data.js — shared data layer for index.html and admin.html
   Content lives in localStorage. Secret hash lives in config.js. */

const STORAGE_KEY = 'landingData';

const DEFAULTS = {
  profile: {
    initials: 'YD',
    image:    '',
    name:     'Yash Dev',
    role:     'Full Stack Developer · Builder',
    bio:      'Building things for the web — dev tooling, systems, and clean interfaces.',
    socials: {
      github:   '#',
      linkedin: '#',
      twitter:  '#'
    }
  },
  projects: [
    {
      name: 'Neural Style Transfer',
      type: 'main',
      desc: 'Apply artistic styles to images in real time using deep convolutional networks and VGG-19 feature extraction — runs locally, no cloud required.',
      tags: ['Python', 'PyTorch', 'OpenCV', 'CUDA'],
      link: '#'
    },
    {
      name: 'CLI Task Manager',
      type: 'side',
      desc: 'Terminal-native task tracker with projects, labels, due dates, and fuzzy search.',
      tags: ['Go', 'Cobra', 'SQLite'],
      link: '#'
    },
    {
      name: 'Realtime Chat',
      type: 'side',
      desc: 'WebSocket group chat with rooms, emoji reactions, and live presence indicators.',
      tags: ['Node.js', 'Socket.io', 'React'],
      link: '#'
    },
    {
      name: 'Crypto Dashboard',
      type: 'side',
      desc: 'Live price tracker with portfolio P&L, candlestick charts, and alert rules.',
      tags: ['Next.js', 'Tailwind', 'REST API'],
      link: '#'
    },
    {
      name: 'Portfolio API',
      type: 'side',
      desc: 'REST API for portfolio projects with versioning, tagging, and media uploads.',
      tags: ['FastAPI', 'PostgreSQL', 'Docker'],
      link: '#'
    },
    {
      name: 'WASM Highlighter',
      type: 'side',
      desc: 'Zero-dependency syntax highlighter compiled to WebAssembly for sub-ms parsing.',
      tags: ['Rust', 'WASM', 'TypeScript'],
      link: '#'
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

/* ── Secret — SHA-256 hash stored in config.js as window.ADMIN_SECRET_HASH ── */
function hasSecret() {
  return typeof window.ADMIN_SECRET_HASH === 'string' &&
         window.ADMIN_SECRET_HASH.length > 0;
}

async function checkSecret(input) {
  if (!hasSecret()) return false;
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
