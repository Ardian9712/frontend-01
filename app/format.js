export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export function money(value) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) : '—';
}
export function date(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 'Not announced' : `${d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC`;
}
export function timeLeft(value) {
  const ms = new Date(value).getTime() - Date.now();
  if (!Number.isFinite(ms)) return 'Deadline pending';
  if (ms <= 0) return 'Ended';
  const d = Math.floor(ms / 86400000), h = Math.floor(ms % 86400000 / 3600000), m = Math.floor(ms % 3600000 / 60000);
  return d ? `${d}d ${h}h left` : h ? `${h}h ${m}m left` : `${Math.max(1, m)}m left`;
}
export const pct = value => value == null || !Number.isFinite(Number(value)) ? '—' : `${(Number(value) / 10000).toFixed(2)}%`;
export const num = value => value == null || !Number.isFinite(Number(value)) ? '—' : Number(value).toLocaleString('en-US');
export const shortAddr = value => value ? `${String(value).slice(0, 6)}…${String(value).slice(-4)}` : '—';
export const plural = (n, one, many = `${one}s`) => Number(n) === 1 ? one : many;
