const API = 'https://make.fun/api';
const memory = new Map();
const pending = new Map();
const failures = new Set();
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
export const activity = { requests: 0, updated: 0, stale: false };
export function get(path, force = false) {
  if (!path.startsWith('/') || path.startsWith('//')) return Promise.reject(new Error('Invalid API path'));
  const url = API + path;
  if (pending.has(url)) return pending.get(url);
  const cached = read(url);
  if (!force && cached && Date.now() - cached.at < 15000) { activity.updated = Math.max(activity.updated, cached.at); return Promise.resolve(cached.body); }
  const request = (async () => {
    const headers = cached?.etag ? { 'If-None-Match': cached.etag } : {};
    activity.requests++;
    window.dispatchEvent(new Event('api-activity'));
    const response = await fetch(url, { method: 'GET', headers });
    if (response.ok || response.status === 304) { activity.updated = Date.now(); failures.delete(url); activity.stale = failures.size > 0; }
    if (response.status === 304 && cached) {
      save(url, { ...cached, at: Date.now() });
      return cached.body;
    }
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const body = await response.json();
    save(url, { body, etag: response.headers.get('ETag'), at: Date.now() });
    return body;
  })().catch(error => { failures.add(url); activity.stale = true; activity.updated = Math.max(activity.updated, cached?.at || 0); if (cached) return cached.body; throw error; }).finally(() => pending.delete(url));
  pending.set(url, request);
  return request;
}
export const getBounties = force => get('/competitions?activity=times', force);
export const getBounty = (slug, force) => get(`/competitions/${encodeURIComponent(slug)}`, force);
export const getLeaderboard = (slug, force) => get(`/competitions/${encodeURIComponent(slug)}/leaderboard`, force);
export const getSubmissions = (slug, cursor = null) => get(`/competitions/${encodeURIComponent(slug)}/submissions?limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
export const getProfile = (handle, force) => get(`/profiles/${encodeURIComponent(handle)}`, force);
