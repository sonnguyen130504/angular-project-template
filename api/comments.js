/**
 * Vercel Serverless Function — Comments API
 *
 * In-memory store: comments live as long as this serverless instance is alive.
 * Resets on redeploy (by design). All users sharing the same instance see
 * the same comments in real-time.
 *
 * Endpoints:
 *   GET  /api/comments          → return all comments (newest first)
 *   POST /api/comments          → add a new comment
 *   POST /api/comments/like     → toggle like on a comment
 */

// ── In-memory store (module-level, shared across requests on the same instance) ──
const SEED_COMMENTS = [
  {
    id: 'seed_1',
    author: 'Alex Chen',
    avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    content: 'Really love the spring animation playground — the physics solver is buttery smooth. Would be awesome to see bezier curve support too!',
    timestamp: new Date(Date.now() - 3_600_000 * 2).toISOString(),
    likes: 5,
  },
  {
    id: 'seed_2',
    author: 'Minh Tran',
    avatarColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    content: "Clean design tokens and the dark mode is chef's kiss. Checkout flow could use a progress stepper though 🤔",
    timestamp: new Date(Date.now() - 3_600_000 * 8).toISOString(),
    likes: 3,
  },
  {
    id: 'seed_3',
    author: 'Sara Williams',
    avatarColor: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    content: 'The component gallery is super useful for our design system audit. Great reference implementation!',
    timestamp: new Date(Date.now() - 86_400_000).toISOString(),
    likes: 7,
  },
];

// Global array — persists for the lifetime of this serverless instance
let comments = [...SEED_COMMENTS];

// ── CORS headers ──────────────────────────────────────────────────
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const BASE_BAD_WORDS = [
  'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'dick', 'cunt', 'whore', 'slut', 'nigger', 'nigga', 'pussy', 'crap', 'prick',
  'dit', 'deo', 'buoi', 'cac', 'lon', 'vcl', 'clgt', 'vl', 'dm', 'dmm', 'cmn', 'dech', 'du'
];

const BASE_BAD_PHRASES = [
  'oc cho',
  'cho de',
  'con di',
  'di diem',
  'bu cu',
  'bu lol',
  'du me',
  'du ma',
  'ngu lo',
];

const HOMOGLYPH_MAP = {
  a: ['a', '@', '4', 'à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ', 'â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ'],
  b: ['b'],
  c: ['c', '(', '{', '['],
  d: ['d', 'đ'],
  e: ['e', '3', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ề', 'ế', 'ể', 'ễ', 'ệ'],
  g: ['g', '9'],
  h: ['h', '#'],
  i: ['i', '1', '!', '|', 'j', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
  l: ['l', '1', '|'],
  n: ['n'],
  o: ['o', '0', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ', 'ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ'],
  p: ['p'],
  r: ['r'],
  s: ['s', '$', '5'],
  t: ['t', '7', '+'],
  u: ['u', 'v', 'w', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự'],
  v: ['v'],
  y: ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
};

const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;
const MIN_REPEAT = /([a-zđ])\1{2,}/gi;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeFlexibleRegex(term) {
  const parts = term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.split('').map((char) => {
      const chars = HOMOGLYPH_MAP[char] ?? [char];
      return `(?:${chars.map(escapeRegex).join('|')})+`;
    }).join('[\\W_]*'));
  return new RegExp(`(?:^|\\W)${parts}(?:$|\\W)`, 'giu');
}

const FILTER_LIST = [
  ...BASE_BAD_WORDS.map(makeFlexibleRegex),
  ...BASE_BAD_PHRASES.map(makeFlexibleRegex),
  /\b[dđ]+\W*[iíìỉĩịyýỳỷỹỵ]+\W*t+/giu,
  /\b[dđ]+\W*[eêéèẻẽẹếềểễệ]+\W*o+\W*s*/giu,
  /\b[l]+\W*[oòóỏõọôồốổỗộơờớởỡợ]+\W*n+/giu,
  /\b[c]+\W*[aàáảãạăằắẳẵặâầấẩẫậ]+\W*[c]+/giu,
  /\b[b]+\W*[uùúủũụưừứửữự]+\W*[oòóỏõọôồốổỗộơờớởỡợ]*\W*[iìíỉĩịyýỳỷỹỵ]+/giu,
];

function normalizeText(text) {
  let s = String(text).toLowerCase();
  s = s.replace(ZERO_WIDTH, '');
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/đ/g, 'd');
  const charMap = {
    '@': 'a', '4': 'a',
    '1': 'i', '!': 'i', '|': 'i', 'j': 'i',
    '0': 'o',
    '3': 'e',
    '$': 's',
    '7': 't',
    '9': 'g',
    w: 'u',
    v: 'u',
  };
  s = s.split('').map((c) => charMap[c] || c).join('');
  return s.replace(MIN_REPEAT, '$1$1');
}

function containsProfanity(text) {
  const normalized = normalizeText(text);
  return FILTER_LIST.some((r) => {
    r.lastIndex = 0;
    return r.test(normalized);
  });
}

function filterProfanity(text) {
  let output = String(text);
  for (const r of FILTER_LIST) {
    r.lastIndex = 0;
    output = output.replace(r, (match) => '*'.repeat(match.length));
  }
  return output;
}

function uid() {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function json(res, status, data) {
  res.status(status).json(data);
}

// ── Handler ───────────────────────────────────────────────────────
export default function handler(req, res) {
  // Apply CORS headers to all responses
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { url, method, body } = req;
  const isLike = url.includes('/like');

  // ── GET /api/comments ────────────────────────────────────────
  if (method === 'GET') {
    return json(res, 200, comments);
  }

  // ── POST /api/comments/like ───────────────────────────────────
  if (method === 'POST' && isLike) {
    const { id, action } = body ?? {};
    if (!id) return json(res, 400, { error: 'Missing comment id' });

    const idx = comments.findIndex(c => c.id === id);
    if (idx === -1) return json(res, 404, { error: 'Comment not found' });

    if (action === 'unlike') {
      comments[idx] = { ...comments[idx], likes: Math.max(0, comments[idx].likes - 1) };
    } else {
      comments[idx] = { ...comments[idx], likes: comments[idx].likes + 1 };
    }
    return json(res, 200, comments[idx]);
  }

  // ── POST /api/comments ────────────────────────────────────────
  if (method === 'POST' && !isLike) {
    const { author, content, avatarColor } = body ?? {};

    if (!author || !content || !avatarColor) {
      return json(res, 400, { error: 'Missing required fields: author, content, avatarColor' });
    }

    const normalizedContent = String(content);
    const hasProfanity = containsProfanity(normalizedContent);

    const newComment = {
      id: uid(),
      author: String(author).slice(0, 30),
      avatarColor: String(avatarColor),
      content: (hasProfanity ? filterProfanity(normalizedContent) : normalizedContent).slice(0, 500),
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    // Prepend (newest first)
    comments = [newComment, ...comments];

    // Cap at 500 comments to avoid unbounded memory growth
    if (comments.length > 500) comments = comments.slice(0, 500);

    return json(res, 201, newComment);
  }

  return json(res, 405, { error: 'Method not allowed' });
}
