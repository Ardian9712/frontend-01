const API = 'https://make.fun/api';
const memory = new Map();
const pending = new Map();
const PREFIX = 'makefun:v1:';
function read(url) {
  if (memory.has(url)) return memory.get(url);
  try {
    const entry = JSON.parse(sessionStorage.getItem(PREFIX + url));
    if (entry && 'body' in entry) { memory.set(url, entry); return entry; }
  } catch { /* Storage may be disabled or full. */ }
}
function save(url, entry) {
  memory.set(url, entry);
  try { sessionStorage.setItem(PREFIX + url, JSON.stringify(entry)); } catch { /* Memory remains available. */ }
}
export function get(path) {
  if (!path.startsWith('/') || path.startsWith('//')) return Promise.reject(new Error('Invalid API path'));
  const url = API + path;
  if (pending.has(url)) return pending.get(url);
  const cached = read(url);
  if (cached && Date.now() - cached.at < 15000) return Promise.resolve(cached.body);
  const request = (async () => {
    const headers = cached?.etag ? { 'If-None-Match': cached.etag } : {};
    const response = await fetch(url, { method: 'GET', headers });
    if (response.status === 304 && cached) {
      save(url, { ...cached, at: Date.now() });
      return cached.body;
    }
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const body = await response.json();
    save(url, { body, etag: response.headers.get('ETag'), at: Date.now() });
    return body;
  })().finally(() => pending.delete(url));
  pending.set(url, request);
  return request;
}
export const getBounties = () => get('/competitions?status=open&activity=times');
export const getBounty = slug => get(`/competitions/${encodeURIComponent(slug)}`);
export const getLeaderboard = slug => get(`/competitions/${encodeURIComponent(slug)}/leaderboard`);
export const getSubmissions = (slug, cursor = null) => get(`/competitions/${encodeURIComponent(slug)}/submissions?limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
export const getProfile = handle => get(`/profiles/${encodeURIComponent(handle)}`);
