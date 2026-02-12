const raw = (import.meta.env.VITE_API_URL || '').trim();
const normalized = raw.replace(/\/+$/, '');
export const API_URL = normalized.endsWith('/api') ? normalized.slice(0, -4) : normalized;
