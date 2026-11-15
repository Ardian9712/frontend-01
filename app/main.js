import { getBounties, getBounty, getLeaderboard, getProfile } from './api.js';
import { board, bounty, leaderboard, profile } from './views.js';
import { esc } from './format.js';
const app = document.getElementById('app');
const search = document.getElementById('search');
const searchBox = document.getElementById('board-search');
let version = 0, boardData, leaderboardData, currentComp, page = 1;
const options = { query: '', filter: 'all', sort: 'pot' };
function paintBoard() { app.innerHTML = board({ ...boardData, ...options }); }
async function render() {
  const ticket = ++version;
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const isBoard = hash === '#/' || hash === '#';
  searchBox.hidden = !isBoard;
  app.setAttribute('aria-busy', 'true');
  app.innerHTML = '<div class="loading" role="status"><span class="spinner"></span><h2>Finding the good stuff…</h2><p>Loading the latest from make.fun.</p></div>';
  try {
    let html, title;
    const match = hash.match(/^#\/bounty\/([^/]+)(\/leaderboard)?\/?$/);
    const user = hash.match(/^#\/u\/([^/]+)\/?$/);
    if (match) {
      const slug = decodeURIComponent(match[1]);
      if (match[2]) {
        const data = await getLeaderboard(slug);
        if (ticket !== version) return;
        currentComp = { ...data.competition, slug, phase: data.phase };
        leaderboardData = data.entries || []; page = 1;
        html = leaderboard(currentComp, leaderboardData, page); title = `${currentComp.title} · Leaderboard`;
      } else {
        const data = await getBounty(slug);
        html = bounty(data); title = data.title;
      }
    } else if (user) {
      const data = await getProfile(decodeURIComponent(user[1]));
      html = profile(data); title = `@${data.handle}`;
    } else if (isBoard) {
      boardData = await getBounties(); html = board({ ...boardData, ...options }); title = 'The bounty board';
    } else {
      html = '<section class="empty"><h1>This page wandered off.</h1><p>There are plenty of good challenges back on the board.</p><a class="button" href="#/">Back to the board</a></section>'; title = 'Page not found';
    }
    if (ticket !== version) return;
    app.innerHTML = html;
    document.title = `${title} | make.fun`;
  } catch {
    if (ticket !== version) return;
    app.innerHTML = '<section class="empty error" role="alert"><span class="error-icon">↻</span><h1>A little connection trouble.</h1><p>We couldn’t load the latest data. Give it another try in a moment.</p><a href="' + esc(location.hash || '#/') + '" class="button" data-retry>Try again ↗</a><a class="back" href="#/">Back to the board</a></section>';
  } finally {
    if (ticket === version) {
      app.setAttribute('aria-busy', 'false');
      window.__shotReady = true;
    }
  }
}
search.addEventListener('input', () => { options.query = search.value; if (boardData) paintBoard(); });
app.addEventListener('change', event => { if (event.target.id === 'sort') { options.sort = event.target.value; paintBoard(); } });
app.addEventListener('click', event => {
  const button = event.target.closest('button, a');
  if (!button) return;
  if (button.hasAttribute('data-retry')) { event.preventDefault(); render(); }
  if (button.hasAttribute('data-filter')) { options.filter = button.dataset.filter; paintBoard(); }
  if (button.hasAttribute('data-clear')) { Object.assign(options, { query: '', filter: 'all' }); search.value = ''; paintBoard(); }
  if (button.hasAttribute('data-page')) { page = Number(button.dataset.page); app.innerHTML = leaderboard(currentComp, leaderboardData, page); app.scrollIntoView({ behavior: 'smooth' }); }
  if (button.hasAttribute('data-browse')) { event.preventDefault(); document.getElementById('challenges').scrollIntoView({ behavior: 'smooth' }); }
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !searchBox.hidden && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, select, [contenteditable]')) { event.preventDefault(); search.focus(); }
});
window.addEventListener('hashchange', () => { window.scrollTo(0,0); render(); });
render();
