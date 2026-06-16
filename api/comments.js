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

    const newComment = {
      id: uid(),
      author: String(author).slice(0, 30),
      avatarColor: String(avatarColor),
      content: String(content).slice(0, 500),
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
