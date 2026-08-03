/* Gamentic portal — client logic (no dependencies)
   Views: home (pick a game website) → site (browse its games) → inventory (my collection) */
const $ = (s) => document.querySelector(s);

const SRC_INFO = {
  local:        { label: 'My library',          badge: 'LOCAL',   color: '#7c5cff', ico: '💾', tag: 'Games stored in ./games/ — playable offline, source code included.' },
  itch:         { label: 'itch.io',             badge: 'itch.io', color: '#fa5c5c', ico: '🎪', tag: 'Top-rated free indie HTML5 games from the itch.io charts.' },
  gamepix:      { label: 'GamePix',             badge: 'GamePix', color: '#ffb400', ico: '🟡', tag: 'Embeddable casual games, ranked by GamePix quality score.' },
  gamemonetize: { label: 'GameMonetize',        badge: 'GameMon', color: '#00c9a7', ico: '💠', tag: 'Popular casual & arcade games, playable inside the portal.' },
  github:       { label: 'GitHub open source',  badge: 'GitHub',  color: '#9ecbff', ico: '🐙', tag: 'Star-ranked open-source games — ⬇ downloadable into your library.' },
};
const CAT_EMOJI = {
  all: '🎮', puzzle: '🧩', arcade: '🕹️', action: '⚔️', platformer: '🏃', racing: '🏎️',
  shooter: '🚀', adventure: '🗺️', strategy: '♟️', sports: '🏓', card: '🃏',
  idle: '⏳', classic: '👾', other: '✨',
};

const state = { view: 'home', site: 'all', cat: 'all', sources: new Set(Object.keys(SRC_INFO)), sort: 'top', q: '' };
let DB = { games: [], stats: {}, analyses: new Set(), sourceMeta: {}, cats: [], inventory: [] };
let current = null;          // game open in the player modal
let es = null, esDone = false;
let lastAnalysis = null;     // {id, meta, label} for the ↻ button

/* ---------------- helpers ---------------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(n);
const safeId = (id) => String(id).replace(/[^a-zA-Z0-9._-]/g, '_');
const b64url = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const stOf = (id) => DB.stats[id] || {};
const invHas = (id) => DB.inventory.some((g) => g.id === id);

function toast(msg, ms = 3200) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), ms);
}

function score(g) {
  const st = stOf(g.id);
  let s = (st.liked ? 400 : 0) + (st.plays || 0) * 60;
  if (g.source === 'local') s += 250;
  if (g.stars) s += Math.log10(g.stars + 1) * 120;
  if (g.quality) s += g.quality * 2;
  if (g.rankScore) s += g.rankScore;
  return s;
}
const metricVal = (g) => g.stars ?? g.quality ?? g.rankScore ?? 0;

/* ---------------- data ---------------- */
async function init() {
  bind();
  try {
    const [j, inv] = await Promise.all([
      (await fetch('/api/games')).json(),
      (await fetch('/api/inventory')).json(),
    ]);
    DB.games = [...j.local, ...j.remote];
    DB.stats = j.stats || {};
    DB.analyses = new Set(j.analyses || []);
    DB.sourceMeta = j.sources || {};
    DB.cats = j.cats || [];
    DB.inventory = inv.inventory || [];
    render();
  } catch (e) {
    toast('Failed to load catalog: ' + e.message);
  }
  health();
  setInterval(health, 10000); // heartbeat: claude status + stale-page self-reload
  refreshRemote(false); // fill/refresh stale sources in the background
}

async function refreshRemote(force) {
  const ico = $('#refreshIco');
  ico.classList.add('spin');
  try {
    const j = await (await fetch('/api/remote' + (force ? '?refresh=1' : ''))).json();
    const locals = DB.games.filter((g) => g.source === 'local');
    DB.games = [...locals, ...j.remote];
    DB.sourceMeta = { ...DB.sourceMeta, ...j.sources };
    render();
    if (force) {
      const errs = Object.values(j.sources).filter((s) => s.error);
      toast(errs.length ? `Refreshed with ${errs.length} source error(s)` : 'All game websites refreshed ✓');
    }
  } catch (e) {
    toast('Remote refresh failed: ' + e.message);
  }
  ico.classList.remove('spin');
}

let bootId = null;
async function health() {
  try {
    const j = await (await fetch('/api/health')).json();
    // self-heal: the server stamps every restart with a new boot id — when it changes
    // (new version deployed), every open page reloads itself so no tab can go stale
    if (bootId && j.boot && j.boot !== bootId) { location.reload(); return; }
    bootId = j.boot || bootId;
    const dot = $('#claudeDot');
    if (j.claude?.ok) { dot.classList.add('ok'); dot.title = `Claude CLI ready — ${j.claude.version}`; }
    else { dot.classList.add('bad'); dot.title = 'Claude CLI not found on PATH — reviews will not work'; }
  } catch { /* server briefly down (restarting) — next tick will catch it */ }
}

async function postEvent(type, id) {
  try {
    const j = await (await fetch('/api/event', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
    })).json();
    DB.stats[id] = { plays: j.plays, liked: j.liked, lastPlayed: j.lastPlayed };
  } catch { /* offline is fine */ }
}

/* ---------------- views / router ---------------- */
function show(view) {
  state.view = view;
  $('#viewHome').hidden = view !== 'home';
  $('#viewSite').hidden = view !== 'site';
  $('#viewInv').hidden = view !== 'inventory';
  render();
}

function enterSite(key) {
  state.site = key;
  state.cat = 'all';
  state.sources = key === 'all' ? new Set(Object.keys(SRC_INFO)) : new Set([key]);
  $('#srcBox').hidden = key !== 'all';
  $('#siteTitle').textContent = key === 'all'
    ? '🌐 All websites'
    : `${SRC_INFO[key].ico} ${SRC_INFO[key].label}`;
  show('site');
  window.scrollTo(0, 0);
}

function render() {
  $('#invCount').textContent = DB.inventory.length;
  if (state.view === 'home') renderHome();
  if (state.view === 'site') { renderCats(); renderSources(); renderGrid(); }
  if (state.view === 'inventory') renderInv();
}

/* ---------------- home: website cards ---------------- */
function renderHome() {
  const counts = {};
  for (const g of DB.games) counts[g.source] = (counts[g.source] || 0) + 1;
  const total = DB.games.length;
  const cardsData = [
    { key: 'inventory', ico: '🎒', label: 'My inventory', color: '#ffd166',
      count: `${DB.inventory.length} collected`, tag: 'Your personal collection — play, download, review and rank it.' },
    { key: 'all', ico: '🌐', label: 'All websites', color: '#7c5cff',
      count: `${total} games`, tag: 'Browse every source together in one ranked view.' },
    ...Object.entries(SRC_INFO).map(([k, s]) => {
      const meta = DB.sourceMeta[k] || {};
      return { key: k, ico: s.ico, label: s.label, color: s.color,
        count: `${counts[k] || 0} games${meta.error ? ' · ⚠ feed error' : ''}`, tag: s.tag };
    }),
  ];
  $('#siteCards').innerHTML = cardsData.map((c) => `
    <button class="sitecard" data-site="${c.key}" style="--c:${c.color}">
      <span class="bigico">${c.ico}</span>
      <b>${esc(c.label)}</b>
      <span class="scount">${esc(c.count)}</span>
      <p>${esc(c.tag)}</p>
      <span class="enter">Enter →</span>
    </button>`).join('');
}

/* ---------------- site view ---------------- */
function visibleGames() {
  const q = state.q.toLowerCase().trim();
  let list = DB.games.filter((g) => state.sources.has(g.source));
  if (state.cat !== 'all') list = list.filter((g) => g.category === state.cat);
  if (q) list = list.filter((g) =>
    `${g.title} ${g.author || ''} ${g.desc || ''} ${(g.tags || []).join(' ')} ${g.category}`.toLowerCase().includes(q));
  const sorts = {
    top: (a, b) => score(b) - score(a),
    metric: (a, b) => metricVal(b) - metricVal(a),
    plays: (a, b) => (stOf(b.id).plays || 0) - (stOf(a.id).plays || 0) || score(b) - score(a),
    likes: (a, b) => ((stOf(b.id).liked ? 1 : 0) - (stOf(a.id).liked ? 1 : 0)) || score(b) - score(a),
    new: (a, b) => String(b.created || '').localeCompare(String(a.created || '')),
    az: (a, b) => a.title.localeCompare(b.title),
  };
  return list.sort(sorts[state.sort] || sorts.top);
}

function renderCats() {
  const pool = DB.games.filter((g) => state.sources.has(g.source));
  const counts = { all: pool.length };
  for (const g of pool) counts[g.category] = (counts[g.category] || 0) + 1;
  const cats = ['all', ...DB.cats.filter((c) => counts[c])];
  $('#cats').innerHTML = cats.map((c) => `
    <button data-cat="${c}" class="${state.cat === c ? 'on' : ''}">
      <span>${CAT_EMOJI[c] || '🎮'}</span> ${c === 'all' ? 'All games' : c}
      <span class="cnt">${counts[c] || 0}</span>
    </button>`).join('');
}

function renderSources() {
  if (state.site !== 'all') return;
  const counts = {};
  for (const g of DB.games) counts[g.source] = (counts[g.source] || 0) + 1;
  $('#sources').innerHTML = Object.entries(SRC_INFO).map(([k, s]) => {
    const meta = DB.sourceMeta[k] || {};
    const err = meta.error ? `<span class="err" title="${esc(meta.error)}">⚠</span>` : '';
    return `<label>
      <input type="checkbox" data-src="${k}" ${state.sources.has(k) ? 'checked' : ''}>
      <span class="swatch" style="background:${s.color}"></span>
      ${s.label} ${err}
      <span class="cnt">${counts[k] || 0}</span>
    </label>`;
  }).join('');
}

function actionsHTML(g, invView) {
  const st = stOf(g.id);
  const isLocal = g.source === 'local';
  const isGh = /^gh:/.test(g.id) && !g.stored;
  const isItch = g.source === 'itch' && !g.stored && !g.noSource;
  const canDL = isGh || isItch;
  const has = invHas(g.id);
  const dlTitle = isLocal || g.stored ? 'Already stored in ./games/'
    : isGh ? 'Download the source into ./games/ (stores it locally)'
    : isItch ? 'Search the itch.io page for the developer\'s public source code and download it'
    : g.noSource ? 'No public source found for this game — play & analyze only'
    : 'GamePix / GameMonetize games are closed-source — play & analyze only';
  return `<div class="actions">
    <button data-act="play" title="Play">▶</button>
    <button data-act="inv" class="${has ? 'on2' : ''}" title="${invView || has ? 'Remove from inventory' : 'Add to inventory'}">${invView ? '🗑' : has ? '✓' : '🎒'}</button>
    <button data-act="dl" title="${esc(dlTitle)}" ${isLocal || !canDL ? 'disabled' : ''}>${isLocal || g.stored ? '💾' : '⬇'}</button>
    <button data-act="review" class="${DB.analyses.has(safeId(g.id)) ? 'on2' : ''}" title="Claude review${DB.analyses.has(safeId(g.id)) ? ' (saved — instant)' : ''}">🤖</button>
    <button data-act="like" class="${st.liked ? 'on' : ''}" title="Like">${st.liked ? '❤' : '🤍'}</button>
  </div>`;
}

function cardHTML(g, i, invView) {
  const st = stOf(g.id);
  const rank = i < 3 ? ['🥇', '🥈', '🥉'][i] : '#' + (i + 1);
  const metric = g.metric ? g.metric.value : (g.stars != null ? `⭐ ${fmt(g.stars)}` : '');
  const mLabel = g.metric ? g.metric.label : 'GitHub stars';
  return `<article class="card" data-id="${esc(g.id)}">
    <div class="thumbwrap">
      <img loading="lazy" src="${esc(g.thumb || '')}" alt=""
           onerror="this.style.display='none';this.parentElement.classList.add('noimg')">
      <span class="rank" title="rank in this view">${rank}</span>
      <span class="srcbadge" style="--c:${SRC_INFO[g.source].color}">${SRC_INFO[g.source].badge}</span>
      ${st.liked ? '<span class="likedmark">❤</span>' : ''}
    </div>
    <div class="cbody">
      <h3 title="${esc(g.title)}">${esc(g.title)}</h3>
      <div class="meta">
        <span>${CAT_EMOJI[g.category] || '🎮'} ${esc(g.category)}</span>
        ${metric ? `<span title="${esc(mLabel)}">${esc(metric)}</span>` : ''}
        ${st.plays ? `<span title="my views (plays)">👁 ${st.plays}</span>` : ''}
      </div>
      ${actionsHTML(g, invView)}
    </div>
  </article>`;
}

function renderGrid() {
  const list = visibleGames();
  $('#empty').hidden = list.length > 0;
  const localCount = DB.games.filter((g) => g.source === 'local').length;
  $('#statsline').textContent =
    `${list.length} game${list.length === 1 ? '' : 's'} · ${localCount} stored locally · ` +
    `category: ${state.cat} · ranked by ${$('#sort').selectedOptions[0]?.textContent.trim() || 'top'}`;
  $('#grid').innerHTML = list.map((g, i) => cardHTML(g, i, false)).join('');
}

/* ---------------- inventory view ---------------- */
function renderInv() {
  const q = state.q.toLowerCase().trim();
  let list = [...DB.inventory];
  if (q) list = list.filter((g) => `${g.title} ${g.category}`.toLowerCase().includes(q));
  list.sort((a, b) => score(b) - score(a));
  $('#invEmpty').hidden = list.length > 0;
  $('#invGrid').innerHTML = list.map((g, i) => cardHTML(g, i, true)).join('');
}

async function invToggle(g) {
  try {
    if (invHas(g.id)) {
      await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'remove', id: g.id }) });
      DB.inventory = DB.inventory.filter((x) => x.id !== g.id);
      toast(`Removed “${g.title}” from inventory`);
    } else {
      await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'add', game: g }) });
      DB.inventory.push(g);
      toast(`Added “${g.title}” to inventory 🎒`);
    }
  } catch (e) { toast('Inventory update failed: ' + e.message); }
  render();
  if (current && current.id === g.id) syncModalBtns();
}

/* ---------------- download (GitHub → ./games/) ---------------- */
async function downloadGame(g, btn) {
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  let dlId = g.id;
  if (!/^gh:/.test(dlId)) {
    // closed-store game (itch.io): look for the developer's public repo on its page
    if (btn) btn.textContent = '🔎';
    toast(`Searching “${g.title}” page for public source code…`);
    try {
      const f = await (await fetch('/api/findsource', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: g.url, title: g.title, author: g.author }),
      })).json();
      if (!f.repo) throw new Error(f.error || 'not found');
      dlId = 'gh:' + f.repo;
      toast(`Found public source: ${f.repo} — downloading…`);
      if (btn) btn.textContent = '⏳';
    } catch (e) {
      g.noSource = true;
      toast(`No public source for “${g.title}” — most itch.io games are closed-source. You can still ▶ play and 🤖 analyze it.`, 6500);
      render();
      return;
    }
  }
  toast(`Downloading “${g.title}” into ./games/ …`);
  try {
    const j = await (await fetch('/api/download', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dlId, title: g.title, author: g.author, category: g.category, desc: g.desc, thumb: g.thumb, stars: g.stars }),
    })).json();
    if (j.error) throw new Error(j.error);
    g.stored = true;
    if (!DB.games.some((x) => x.id === j.game.id)) DB.games.push(j.game);
    if (invHas(g.id)) {
      await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'remove', id: g.id }) });
      DB.inventory = DB.inventory.filter((x) => x.id !== g.id);
      await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'add', game: j.game }) });
      DB.inventory.push(j.game);
    }
    toast(`✓ Stored in games/${j.game.slug} — now playable offline as a LOCAL game`);
    render();
  } catch (e) {
    toast('Download failed: ' + e.message, 6000);
    if (btn) { btn.textContent = '⬇'; btn.disabled = false; }
  }
}

/* ---------------- player modal ---------------- */
function openGame(g) {
  current = g;
  $('#modal').hidden = false;
  document.body.classList.add('locked');
  $('#mEmoji').textContent = g.emoji || CAT_EMOJI[g.category] || '🎮';
  $('#mTitle').textContent = g.title;
  const bits = [
    SRC_INFO[g.source].label,
    g.category,
    g.author ? 'by ' + g.author : '',
    g.metric ? `${g.metric.label}: ${g.metric.value}` : (g.stars != null ? `⭐ ${fmt(g.stars)} stars` : ''),
    g.license && g.license !== 'see repo' ? g.license : '',
  ].filter(Boolean);
  $('#mMeta').textContent = bits.join('  ·  ');
  $('#mSite').href = g.url || g.playUrl;
  syncModalBtns();

  const frame = $('#mFrame');
  const cover = $('#mCover');
  if (g.embed === 'iframe') {
    cover.hidden = true;
    frame.style.display = '';
    frame.src = g.playUrl;
    countPlay(g);
  } else {
    frame.src = 'about:blank';
    frame.style.display = 'none';
    cover.hidden = false;
    const th = $('#cThumb');
    const ce = $('#cEmoji');
    const showEmoji = () => { th.style.display = 'none'; ce.style.display = ''; };
    ce.textContent = g.emoji || CAT_EMOJI[g.category] || '🎮';
    if (g.thumb) { ce.style.display = 'none'; th.style.display = ''; th.onerror = showEmoji; th.src = g.thumb; }
    else showEmoji();
    $('#cDesc').textContent = g.desc || `${g.title} — a ${g.category} game on ${SRC_INFO[g.source].label}`;
    $('#cPlay').href = g.playUrl;
  }
}

function countPlay(g) {
  postEvent('play', g.id).then(() => render());
}

function closeModal() {
  $('#mFrame').src = 'about:blank';
  $('#modal').hidden = true;
  document.body.classList.remove('locked');
  current = null;
  render();
}

function syncModalBtns() {
  if (!current) return;
  const liked = stOf(current.id).liked;
  $('#mLike').classList.toggle('on', !!liked);
  $('#mLikeTxt').textContent = liked ? 'Liked' : 'Like';
  const has = invHas(current.id);
  $('#mInv').textContent = has ? '✓ Collected' : '🎒 Collect';
  $('#mInv').classList.toggle('on2', has);
}

/* ---------------- Claude analysis (single game or batch ranking) ---------------- */
function openAnalysisFor(id, metaObj, label, force = false, depth = 'brief') {
  lastAnalysis = { id, meta: metaObj, label, depth };
  $('#aBrief').classList.toggle('on2', depth === 'brief');
  $('#aDeep').classList.toggle('on2', depth === 'deep');
  $('#apanel').hidden = false;
  const body = $('#aBody');
  const status = (t) => { $('#aStatus').textContent = t; };

  if (es) { es.close(); es = null; }
  esDone = false;
  let acc = '';
  body.innerHTML = `<p class="amuted">「${esc(label)}」 — contacting your local Claude CLI…</p>`;
  status('starting');

  let u = `/api/analyze?id=${encodeURIComponent(id)}&depth=${depth}${force ? '&force=1' : ''}`;
  if (metaObj) u += `&meta=${b64url(JSON.stringify(metaObj))}`;
  es = new EventSource(u);

  es.onmessage = (ev) => {
    let j;
    try { j = JSON.parse(ev.data); } catch { return; }
    if (j.t === 'meta') status(`model: ${j.model}`);
    if (j.t === 'start') status(`${j.mode} — thinking… (can take 1–2 min)`);
    if (j.t === 'cached') status('saved analysis');
    if (j.t === 'tick') status(`still analyzing… ${j.secs}s (Claude is working)`);
    if (j.t === 'delta') { acc += j.text; body.innerHTML = md2html(acc) + '<span class="cursor"></span>'; body.scrollTop = body.scrollHeight; }
    if (j.t === 'block') { acc += (acc ? '\n\n' : '') + j.text; body.innerHTML = md2html(acc) + '<span class="cursor"></span>'; body.scrollTop = body.scrollHeight; }
    if (j.t === 'done') {
      esDone = true;
      body.innerHTML = md2html(j.full || acc);
      status('done ✓ (saved to data/analysis/)');
      DB.analyses.add(safeId(id));
      es.close(); es = null;
      render();
    }
    if (j.t === 'err') {
      esDone = true;
      body.innerHTML = `<div class="aerr"><b>Analysis failed.</b><br>${esc(j.message)}</div>`;
      status('failed');
      es.close(); es = null;
    }
  };
  es.onerror = () => {
    if (es) { es.close(); es = null; }
    if (!esDone) {
      status('stream interrupted');
      body.insertAdjacentHTML('beforeend',
        '<p class="amuted">Connection to the analysis stream was lost — press ↻ to run again.</p>');
    }
  };
}

function reviewGame(g, force = false) {
  openAnalysisFor(g.id, g.source !== 'local' ? g : null, g.title, force);
}

function runBatch(games, label, key) {
  const top = games.slice(0, 10);
  if (top.length < 2) return toast('Need at least 2 games in this view to rank them');
  const meta = {
    batch: true, title: label,
    games: top.map((g) => ({
      title: g.title, author: g.author, category: g.category,
      metric: g.metric ? `${g.metric.label}: ${g.metric.value}` : (g.stars != null ? `stars: ${g.stars}` : ''),
      desc: (g.desc || '').slice(0, 140), source: g.source,
    })),
  };
  openAnalysisFor(key, meta, label);
}

function closeAnalysis() {
  $('#apanel').hidden = true;
  if (es) { es.close(); es = null; }
}

/* minimal markdown → html (headings, lists, bold/italic/code, fences, links) */
function md2html(src) {
  const escT = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const blocks = [];
  let s = String(src).replace(/\r/g, '');
  s = s.replace(/```[\w-]*\n([\s\S]*?)(```|$)/g, (_, code) => {
    blocks.push(`<pre><code>${escT(code)}</code></pre>`);
    return `\x00${blocks.length - 1}\x00`;
  });
  const inline = (t) => escT(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const out = [];
  let inUl = false, inOl = false, para = [];
  const flushP = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  const closeL = () => { if (inUl) { out.push('</ul>'); inUl = false; } if (inOl) { out.push('</ol>'); inOl = false; } };
  for (const raw of s.split('\n')) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) { flushP(); closeL(); const lv = Math.min(h[1].length + 1, 5); out.push(`<h${lv}>${inline(h[2])}</h${lv}>`); continue; }
    if (/^\s*[-*]\s+/.test(line)) { flushP(); if (inOl) { out.push('</ol>'); inOl = false; } if (!inUl) { out.push('<ul>'); inUl = true; } out.push('<li>' + inline(line.replace(/^\s*[-*]\s+/, '')) + '</li>'); continue; }
    if (/^\s*\d+[.)]\s+/.test(line)) { flushP(); if (inUl) { out.push('</ul>'); inUl = false; } if (!inOl) { out.push('<ol>'); inOl = true; } out.push('<li>' + inline(line.replace(/^\s*\d+[.)]\s+/, '')) + '</li>'); continue; }
    if (/^\s*---+\s*$/.test(line)) { flushP(); closeL(); out.push('<hr>'); continue; }
    if (line.trim() === '') { flushP(); closeL(); continue; }
    para.push(line);
  }
  flushP(); closeL();
  return out.join('\n').replace(/\x00(\d+)\x00/g, (_, i) => blocks[+i]);
}

/* ---------------- events ---------------- */
function gridClick(e) {
  const actBtn = e.target.closest('button[data-act]');
  const card = e.target.closest('.card');
  if (!card) return;
  const g = DB.games.find((x) => x.id === card.dataset.id) || DB.inventory.find((x) => x.id === card.dataset.id);
  if (!g) return;
  if (actBtn) {
    e.stopPropagation();
    const act = actBtn.dataset.act;
    if (act === 'play') openGame(g);
    if (act === 'inv') invToggle(g);
    if (act === 'dl') downloadGame(g, actBtn);
    if (act === 'review') reviewGame(g);
    if (act === 'like') { postEvent(stOf(g.id).liked ? 'unlike' : 'like', g.id).then(render); }
    return;
  }
  openGame(g);
}

function bind() {
  $('#grid').addEventListener('click', gridClick);
  $('#invGrid').addEventListener('click', gridClick);
  $('#siteCards').addEventListener('click', (e) => {
    const c = e.target.closest('.sitecard');
    if (!c) return;
    if (c.dataset.site === 'inventory') show('inventory');
    else enterSite(c.dataset.site);
  });
  $('#brandBtn').addEventListener('click', () => show('home'));
  $('#backHome').addEventListener('click', () => show('home'));
  $('#backHome2').addEventListener('click', () => show('home'));
  $('#invBtn').addEventListener('click', () => show('inventory'));

  $('#cats').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    render();
  });
  $('#sources').addEventListener('change', (e) => {
    const cb = e.target.closest('input[data-src]');
    if (!cb) return;
    cb.checked ? state.sources.add(cb.dataset.src) : state.sources.delete(cb.dataset.src);
    render();
  });
  $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderGrid(); });
  $('#q').addEventListener('input', (e) => {
    state.q = e.target.value;
    if (state.view === 'home' && state.q.trim()) enterSite('all');
    else render();
  });
  $('#refreshBtn').addEventListener('click', () => refreshRemote(true));

  $('#batchBtn').addEventListener('click', () => {
    const label = `${$('#siteTitle').textContent} · ${state.cat} — top 10`;
    runBatch(visibleGames(), label, `batch:${state.site}:${state.cat}`);
  });
  $('#batchInvBtn').addEventListener('click', () => {
    runBatch([...DB.inventory].sort((a, b) => score(b) - score(a)), 'My inventory — full ranking', 'batch:inventory');
  });

  $('#mClose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', (e) => { if (e.target === $('#modal')) closeModal(); });
  $('#mLike').addEventListener('click', async () => {
    if (!current) return;
    await postEvent(stOf(current.id).liked ? 'unlike' : 'like', current.id);
    syncModalBtns();
  });
  $('#mInv').addEventListener('click', () => { if (current) invToggle(current); });
  $('#mAnalyze').addEventListener('click', () => { if (current) reviewGame(current); });
  $('#aRedo').addEventListener('click', () => {
    if (lastAnalysis) openAnalysisFor(lastAnalysis.id, lastAnalysis.meta, lastAnalysis.label, true, lastAnalysis.depth || 'brief');
  });
  $('#aBrief').addEventListener('click', () => {
    if (lastAnalysis) openAnalysisFor(lastAnalysis.id, lastAnalysis.meta, lastAnalysis.label, false, 'brief');
  });
  $('#aDeep').addEventListener('click', () => {
    if (lastAnalysis) openAnalysisFor(lastAnalysis.id, lastAnalysis.meta, lastAnalysis.label, false, 'deep');
  });
  $('#aClose').addEventListener('click', closeAnalysis);
  $('#cPlay').addEventListener('click', () => { if (current) countPlay(current); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('#apanel').hidden) closeAnalysis();
      else if (!$('#modal').hidden) closeModal();
    }
    if (e.key === '/' && document.activeElement !== $('#q')) { e.preventDefault(); $('#q').focus(); }
  });
}

init();
