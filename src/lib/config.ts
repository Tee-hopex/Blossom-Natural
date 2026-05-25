// ── Backend URL ────────────────────────────────────────────────────────────
// Production: set VITE_API_URL in Vercel dashboard (no trailing slash)
//             e.g. https://blossom-natural-api.onrender.com
// Development: leave unset — Vite's dev-server proxy handles /api/* for you
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';
