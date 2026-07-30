// Gamentic — local HTML5 game portal server (zero dependencies)
//
//  - Serves the portal UI (public/) and the locally stored games (games/)
//  - Aggregates rankings from real game websites: itch.io, GamePix, GameMonetize, GitHub
//  - Tracks local views (plays) + likes per game in data/stats.json
//  - Streams game analysis from the local `claude` CLI over SSE (/api/analyze)
//
// Run: node server.mjs   →  http://localhost:4321

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(ROOT, 'public');
const GAMES_DIR = path.join(ROOT, 'games');
const DATA_DIR = path.join(ROOT, 'data');
const CACHE_DIR = path.join(DATA_DIR, 'cache');
const ANALYSIS_DIR = path.join(DATA_DIR, 'analysis');
const PORT = Number(process.env.PORT || 4321);
const ALT_PORT = Number(process.env.ALT_PORT || 4545); // backup door: fresh origin = fresh browser connection pool
const BOOT_ID = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); // changes every restart → live pages self-reload
const CACHE_TTL = 24 * 3600 * 1000; // refresh remote listings daily
const UA = { 'User-Agent': 'gamentic-local-game-portal' };

for (const d of [GAMES_DIR, DATA_DIR, CACHE_DIR, ANALYSIS_DIR]) fs.mkdirSync(d, { recursive: true });

// ---------------------------------------------------------------- utilities

const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.md': 'text/plain', '.map': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon', '.cur': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.eot': 'application/vnd.ms-fontobject',
  '.wasm': 'application/wasm', '.appcache': 'text/cache-manifest', '.manifest': 'text/cache-manifest',
  '.glsl': 'text/plain', '.vert': 'text/plain', '.frag': 'text/plain', '.vs': 'text/plain', '.fs': 'text/plain',
  '.obj': 'text/plain', '.mtl': 'text/plain', '.dae': 'application/xml',
};

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}
function send(res, code, body, headers = {}) {
  const buf = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': typeof body === 'object' && !Buffer.isBuffer(body) ? 'application/json' : 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(buf);
}
function readBody(req, limit = 1 << 20) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(new Error('body too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
function safeId(id) { return String(id).replace(/[^a-zA-Z0-9._-]/g, '_'); }
function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }

function serveFile(res, absRoot, rel, cache = 'no-cache') {
  let p = path.normalize(path.join(absRoot, decodeURIComponent(rel)));
  if (!p.startsWith(absRoot)) return send(res, 403, 'forbidden');
  let st;
  try { st = fs.statSync(p); } catch { return send(res, 404, 'not found: ' + rel); }
  if (st.isDirectory()) {
    p = path.join(p, 'index.html');
    try { st = fs.statSync(p); } catch { return send(res, 404, 'no index.html in ' + rel); }
  }
  const mime = MIME[path.extname(p).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime, 'Content-Length': st.size, 'Cache-Control': cache });
  fs.createReadStream(p).pipe(res);
}

// ---------------------------------------------------------------- categories & filters

const CATS = ['puzzle', 'arcade', 'action', 'platformer', 'racing', 'shooter', 'adventure', 'strategy', 'sports', 'card', 'idle', 'classic', 'other'];
const CAT_ALIASES = {
  puzzles: 'puzzle', 'hidden-object': 'puzzle', 'match-3': 'puzzle', match3: 'puzzle', mahjong: 'puzzle',
  'mahjong & connect': 'puzzle', bejeweled: 'puzzle', quiz: 'puzzle', words: 'puzzle', jigsaw: 'puzzle',
  merge: 'puzzle', sudoku: 'puzzle', brain: 'puzzle', 'visual novel': 'adventure', 'interactive fiction': 'adventure',
  hypercasual: 'arcade', casual: 'arcade', agility: 'arcade', clicker: 'idle', incremental: 'idle',
  fighting: 'action', battle: 'action', war: 'action', stickman: 'action', io: 'action', '.io': 'action', multiplayer: 'action',
  'racing & driving': 'racing', driving: 'racing', cars: 'racing', car: 'racing',
  shooting: 'shooter', 'shoot em up': 'shooter', shmup: 'shooter', sniper: 'shooter',
  rpg: 'adventure', 'role playing': 'adventure', horror: 'adventure', escape: 'adventure', survival: 'adventure',
  'tower defense': 'strategy', defense: 'strategy', simulation: 'strategy', management: 'strategy',
  sport: 'sports', soccer: 'sports', football: 'sports', basketball: 'sports', pool: 'sports', golf: 'sports',
  cards: 'card', 'cards & board': 'card', board: 'card', 'board games': 'card', solitaire: 'card', poker: 'card',
  platform: 'platformer', 'jump & run': 'platformer', classics: 'classic', retro: 'classic',
};
function normCat(c) {
  if (!c) return 'other';
  const k = String(c).toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (CATS.includes(k)) return k;
  if (CAT_ALIASES[k]) return CAT_ALIASES[k];
  const k2 = k.replace(/ /g, '-');
  return CAT_ALIASES[k2] || 'other';
}

// The goal: surface human-made games only. Two guards:
//  1) keyword screen on title/description for AI-generated content
//  2) the GitHub discovery query is restricted to repos created before 2023 (pre AI-codegen era)
const AI_RE = /\b(ai[- ]generated|ai[- ]made|ai[- ]created|generated (with|by) ai|(made|built|created|written) (with|by) (an ai|chatgpt|gpt-?[345o]?|claude|gemini|copilot|cursor|windsurf)|chatgpt|vibe[- ]?cod(e|ed|ing)|text[- ]to[- ]game)\b/i;
const ADULT_RE = /(\b18\s*\+|nsfw|hentai|erotic|porn|lewd|adults? only|sexual)/i;
function humanMadeAndSafe(text) {
  return !AI_RE.test(text) && !ADULT_RE.test(text);
}

// ---------------------------------------------------------------- remote sources

async function fetchItch() {
  const feeds = [
    { genre: null, cat: null },
    { genre: 'puzzle', cat: 'puzzle' }, { genre: 'action', cat: 'action' },
    { genre: 'platformer', cat: 'platformer' }, { genre: 'shooter', cat: 'shooter' },
    { genre: 'strategy', cat: 'strategy' }, { genre: 'racing', cat: 'racing' },
    { genre: 'sports', cat: 'sports' }, { genre: 'card-game', cat: 'card' },
  ];
  const tag = (xml, name) => {
    const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
    if (!m) return '';
    let v = m[1].trim();
    const cd = v.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
    if (cd) v = cd[1];
    return v.trim();
  };
  const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const byLink = new Map();
  const results = await Promise.allSettled(feeds.map(async (f) => {
    const url = f.genre
      ? `https://itch.io/games/genre-${f.genre}/html5.xml`
      : `https://itch.io/games/top-rated/html5.xml`;
    const r = await fetch(url, { headers: UA });
    if (!r.ok) throw new Error(`itch ${f.genre || 'top'} HTTP ${r.status}`);
    const xml = await r.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    items.slice(0, 30).forEach((item, i) => {
      const link = tag(item, 'link');
      if (!link) return;
      const title = tag(item, 'plainTitle') || strip(tag(item, 'title'));
      const rawTitle = tag(item, 'title');
      const desc = strip(tag(item, 'description')).slice(0, 240);
      const price = tag(item, 'price');
      if (price && price !== '$0.00') return; // free games only
      if (!humanMadeAndSafe(title + ' ' + rawTitle + ' ' + desc)) return;
      const img = tag(item, 'imageurl') || (item.match(/<img[^>]+src="([^"]+)"/) || [])[1] || '';
      let cat = f.cat;
      if (!cat) {
        const brackets = [...rawTitle.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
        for (const b of brackets) { const c = normCat(b); if (c !== 'other') { cat = c; break; } }
      }
      const author = (() => { try { return new URL(link).hostname.split('.')[0]; } catch { return 'itch.io dev'; } })();
      const existing = byLink.get(link);
      if (existing) { if (existing.category === 'other' && cat) existing.category = cat; return; }
      byLink.set(link, {
        id: 'itch:' + hash(link),
        title, author, category: cat || 'other',
        desc, thumb: img, url: link, playUrl: link, embed: 'external',
        source: 'itch', metric: { label: 'itch.io popularity', value: `#${i + 1}` },
        rankScore: Math.max(0, 100 - i * 3),
        created: tag(item, 'createDate').slice(0, 16),
      });
    });
  }));
  const errs = results.filter((r) => r.status === 'rejected').length;
  if (byLink.size === 0 && errs) throw new Error('all itch.io feeds failed');
  return [...byLink.values()];
}

async function fetchGamePix() {
  const r = await fetch('https://feeds.gamepix.com/v2/json?sid=1&pagination=96&page=1&order=quality', { headers: UA });
  if (!r.ok) throw new Error(`gamepix HTTP ${r.status}`);
  const j = await r.json();
  const items = j.items || j.data || [];
  return items.map((it) => {
    const q = Number(it.quality_score) || 0;
    const quality = Math.round((q <= 1 ? q * 100 : q));
    const play = it.url || `https://play.gamepix.com/${it.namespace}/embed?sid=1`;
    return {
      id: 'gp:' + (it.id || it.namespace),
      title: it.title, author: 'GamePix studio',
      category: normCat(it.category),
      desc: (it.description || it.content_text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240),
      thumb: it.image || it.banner_image || '',
      url: `https://www.gamepix.com/play/${it.namespace}`,
      playUrl: play, embed: 'iframe', source: 'gamepix',
      metric: { label: 'GamePix quality score', value: `${quality}/100` },
      quality, rankScore: quality,
      created: String(it.date_published || '').slice(0, 16),
    };
  }).filter((g) => g.title && humanMadeAndSafe(g.title + ' ' + g.desc));
}

async function fetchGameMonetize() {
  const r = await fetch('https://gamemonetize.com/feed.php?format=0&num=100&page=1', { headers: UA });
  if (!r.ok) throw new Error(`gamemonetize HTTP ${r.status}`);
  const arr = await r.json();
  if (!Array.isArray(arr)) throw new Error('gamemonetize: unexpected payload');
  return arr.map((it, i) => ({
    id: 'gm:' + it.id,
    title: it.title, author: 'GameMonetize studio',
    category: normCat(it.category),
    desc: String(it.description || '').replace(/&bull;/g, '•').replace(/\s+/g, ' ').trim().slice(0, 240),
    thumb: it.thumb || it.thumbnail || it.image || '',
    url: it.url, playUrl: it.url, embed: 'iframe', source: 'gamemonetize',
    metric: { label: 'GameMonetize rank', value: `#${i + 1}` },
    rankScore: Math.max(0, 100 - i),
    created: '',
  })).filter((g) => g.title && humanMadeAndSafe(g.title + ' ' + g.desc));
}

const GH_TOPIC_CAT = [
  ['platformer', 'platformer'], ['puzzle', 'puzzle'], ['puzzle-game', 'puzzle'], ['shooter', 'shooter'],
  ['shmup', 'shooter'], ['racing', 'racing'], ['rpg', 'adventure'], ['roguelike', 'adventure'],
  ['adventure', 'adventure'], ['strategy', 'strategy'], ['tower-defense', 'strategy'], ['chess', 'strategy'],
  ['card-game', 'card'], ['cards', 'card'], ['idle', 'idle'], ['incremental-game', 'idle'], ['clicker', 'idle'],
  ['tetris', 'classic'], ['pacman', 'classic'], ['snake', 'classic'], ['pong', 'classic'], ['arcade', 'arcade'],
  ['space', 'shooter'], ['io-game', 'action'], ['multiplayer', 'action'], ['sports', 'sports'],
];
const GH_EXCLUDE_RE = /(engine|framework|boilerplate|template|starter|tutorial|course|awesome|library|\bsdk\b|plugin|emulator|collection|\blist\b|editor|\bide\b|challenge|examples|development solution)/i;
const GH_EXCLUDE_TOPICS = new Set(['game-engine', 'engine', 'framework', 'library', 'awesome', 'awesome-list', 'boilerplate', 'template', 'ai', 'chatgpt', 'llm', 'openai', 'game-development']);
// known non-games that slip past the keyword screens
const GH_BLOCKLIST = new Set([
  'metroxe/one-html-page-challenge', 'digitsensitive/phaser3-typescript',
  'marketingpipeline/termino.js', 'phasereditor2d/phasereditor2d-v3', 'bitmasterv/egerpro',
]);

async function fetchGitHub(localRepos) {
  const queries = [
    'topic:html5-game stars:>200 created:<2023-01-01',
    'topic:browser-game stars:>300 created:<2023-01-01',
  ];
  const byName = new Map();
  for (const q of queries) {
    const r = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=50`, {
      headers: { ...UA, Accept: 'application/vnd.github+json' },
    });
    if (!r.ok) { if (byName.size) break; throw new Error(`github HTTP ${r.status}`); }
    const j = await r.json();
    for (const it of j.items || []) byName.set(it.full_name, it);
  }
  const out = [];
  for (const it of byName.values()) {
    const topics = it.topics || [];
    const text = `${it.name} ${it.description || ''}`;
    if (GH_BLOCKLIST.has(it.full_name.toLowerCase())) continue;
    if (GH_EXCLUDE_RE.test(text)) continue;
    if (topics.some((t) => GH_EXCLUDE_TOPICS.has(t))) continue;
    if (!humanMadeAndSafe(text)) continue;
    if (localRepos.has(it.full_name.toLowerCase())) continue; // already in local library
    let cat = 'other';
    for (const [t, c] of GH_TOPIC_CAT) if (topics.includes(t)) { cat = c; break; }
    const home = /^https?:\/\//.test(it.homepage || '') ? it.homepage : '';
    out.push({
      id: 'gh:' + it.full_name,
      title: it.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      author: it.owner?.login || 'unknown',
      category: cat,
      desc: (it.description || '').slice(0, 240),
      thumb: `https://opengraph.githubassets.com/1/${it.full_name}`,
      url: it.html_url,
      playUrl: home || it.html_url,
      embed: home && home.includes('github.io') ? 'iframe' : 'external',
      source: 'github',
      metric: { label: 'GitHub stars', value: `⭐ ${it.stargazers_count}` },
      stars: it.stargazers_count,
      created: (it.created_at || '').slice(0, 10),
      openSource: true,
    });
  }
  out.sort((a, b) => (b.stars || 0) - (a.stars || 0));
  return out;
}

const SOURCES = {
  itch: { label: 'itch.io', fn: fetchItch },
  gamepix: { label: 'GamePix', fn: fetchGamePix },
  gamemonetize: { label: 'GameMonetize', fn: fetchGameMonetize },
  github: { label: 'GitHub open source', fn: fetchGitHub },
};

// Manual import: any game folder dropped into games/ (e.g. an official itch.io
// download, unzipped) is auto-cataloged; vanished folders are auto-removed.
function scanManualGames(catalog) {
  let changed = false;
  const before = catalog.games.length;
  catalog.games = catalog.games.filter((g) => {
    try { return fs.existsSync(path.join(GAMES_DIR, g.slug)); } catch { return false; }
  });
  if (catalog.games.length !== before) changed = true;
  const known = new Set(catalog.games.map((g) => g.slug));
  let dirs = [];
  try { dirs = fs.readdirSync(GAMES_DIR); } catch { return changed; }
  for (const dir of dirs) {
    if (dir.startsWith('_') || dir.startsWith('.') || known.has(dir)) continue;
    const full = path.join(GAMES_DIR, dir);
    try { if (!fs.statSync(full).isDirectory()) continue; } catch { continue; }
    let entry = findHtmlEntry(full);
    if (!entry) {
      // unzipped-into-a-subfolder case: descend one level if there's exactly one dir
      try {
        const subs = fs.readdirSync(full).filter((s) => {
          try { return fs.statSync(path.join(full, s)).isDirectory(); } catch { return false; }
        });
        if (subs.length === 1) {
          const e2 = findHtmlEntry(path.join(full, subs[0]));
          if (e2) entry = `${subs[0]}/${e2}`;
        }
      } catch { /* ignore */ }
    }
    if (!entry) continue;
    catalog.games.push({
      id: `local:${dir}`, slug: dir,
      title: dir.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      author: 'imported', category: 'other', tags: [],
      desc: 'Imported game (dropped into games/ — e.g. an official itch.io download)',
      stars: null, license: 'see the original store page', created: '',
      emoji: '📦', entry,
      playUrl: '/play/local/' + [dir, ...entry.split('/')].map(encodeURIComponent).join('/'),
      url: '', thumb: '', source: 'local', embed: 'iframe', imported: true,
    });
    changed = true;
    console.log(`[gamentic] imported manual game: games/${dir} (entry: ${entry})`);
  }
  return changed;
}

function localRepoSet() {
  const catalog = readJSON(path.join(DATA_DIR, 'catalog.json'), { games: [] });
  return new Set(catalog.games.map((g) => (g.repoUrl || '').replace('https://github.com/', '').toLowerCase()));
}

async function getSource(name, refresh = false) {
  const file = path.join(CACHE_DIR, `${name}.json`);
  const cached = readJSON(file, null);
  if (!refresh && cached && Date.now() - cached.fetchedAt < CACHE_TTL) return { ...cached, stale: false };
  try {
    const games = await SOURCES[name].fn(name === 'github' ? localRepoSet() : undefined);
    const fresh = { fetchedAt: Date.now(), games };
    writeJSON(file, fresh);
    return { ...fresh, stale: false };
  } catch (e) {
    if (cached) return { ...cached, stale: true, error: String(e.message || e) };
    return { fetchedAt: 0, games: [], error: String(e.message || e) };
  }
}

async function getAllRemote(refresh = false) {
  const names = Object.keys(SOURCES);
  const settled = await Promise.allSettled(names.map((n) => getSource(n, refresh)));
  const games = [];
  const meta = {};
  settled.forEach((s, i) => {
    const n = names[i];
    if (s.status === 'fulfilled') {
      games.push(...s.value.games);
      meta[n] = { label: SOURCES[n].label, count: s.value.games.length, fetchedAt: s.value.fetchedAt, error: s.value.error || null };
    } else {
      meta[n] = { label: SOURCES[n].label, count: 0, fetchedAt: 0, error: String(s.reason) };
    }
  });
  return { games, meta };
}

// ---------------------------------------------------------------- stats (local views + likes)

const STATS_FILE = path.join(DATA_DIR, 'stats.json');
let stats = readJSON(STATS_FILE, {});
let statsTimer = null;
function saveStats() {
  clearTimeout(statsTimer);
  statsTimer = setTimeout(() => writeJSON(STATS_FILE, stats), 250);
}

// ---------------------------------------------------------------- inventory (the user's game collection)

const INV_FILE = path.join(DATA_DIR, 'inventory.json');
let inventory = readJSON(INV_FILE, []);
const saveInventory = () => writeJSON(INV_FILE, inventory);

// ---------------------------------------------------------------- download a GitHub game into ./games/

function extractZipTo(zipPath, slug) {
  const tmp = path.join(GAMES_DIR, `_tmp_${slug}`);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const r = spawnSync('tar', ['-xf', zipPath, '-C', tmp], { encoding: 'utf8' });
  if (r.status !== 0) {
    // tolerate partial extraction (some zips contain a few files Windows can't create) —
    // only fail if nothing usable came out
    const got = (() => { try { return fs.readdirSync(tmp).filter((e) => !e.startsWith('.')); } catch { return []; } })();
    if (!got.length) throw new Error(`unzip failed: ${r.stderr || r.status}`);
    console.warn(`[gamentic] partial unzip for ${slug} (continuing): ${(r.stderr || '').split('\n')[0]}`);
  }
  const entries = fs.readdirSync(tmp).filter((e) => !e.startsWith('.'));
  let srcDir = tmp;
  if (entries.length === 1 && fs.statSync(path.join(tmp, entries[0])).isDirectory()) srcDir = path.join(tmp, entries[0]);
  const dest = path.join(GAMES_DIR, slug);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.renameSync(srcDir, dest);
  fs.rmSync(tmp, { recursive: true, force: true });
  return dest;
}

function findHtmlEntry(dir, preferred) {
  for (const c of [preferred, 'index.html', 'index.htm', 'docs/index.html', 'public/index.html', 'dist/index.html'].filter(Boolean)) {
    if (fs.existsSync(path.join(dir, c))) return c;
  }
  const htmls = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.html'));
  htmls.sort((a, b) => a.length - b.length);
  return htmls[0] || null;
}

async function downloadRepoGame(repo, hint = {}) {
  const slug = repo.split('/')[1].toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  const catalogFile = path.join(DATA_DIR, 'catalog.json');
  const catalog = readJSON(catalogFile, { games: [] });
  const destDir = path.join(GAMES_DIR, slug);
  const existing = catalog.games.find((g) => g.slug === slug);
  if (existing && fs.existsSync(destDir)) return existing;

  let meta = null;
  try {
    const r = await fetch(`https://api.github.com/repos/${repo}`, { headers: { ...UA, Accept: 'application/vnd.github+json' } });
    if (r.ok) meta = await r.json();
  } catch { /* rate-limited is fine */ }

  // Try branches until one yields a playable build. Source branches first (canonical),
  // then gh-pages — build-required repos usually publish their COMPILED site there.
  const zip = path.join(GAMES_DIR, `_${slug}.zip`);
  const tried = [];
  let entry = null;
  for (const br of [...new Set([meta?.default_branch, 'main', 'master', 'gh-pages'].filter(Boolean))]) {
    let got = false;
    try {
      const r = await fetch(`https://codeload.github.com/${repo}/zip/refs/heads/${br}`, { headers: UA });
      if (!r.ok) { tried.push(`${br}: HTTP ${r.status}`); continue; }
      fs.writeFileSync(zip, Buffer.from(await r.arrayBuffer()));
      got = true;
    } catch (e) { tried.push(`${br}: ${e.message}`); }
    if (!got) continue;
    extractZipTo(zip, slug);
    fs.rmSync(zip, { force: true });
    entry = findHtmlEntry(destDir);
    if (entry) { tried.push(`${br}: ✓ playable`); break; }
    tried.push(`${br}: no playable HTML`);
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  if (!entry) {
    throw new Error(`no ready-to-play build on any branch (${tried.join(' · ')}) — this repo needs a build step`);
  }
  const game = {
    id: `local:${slug}`, slug,
    title: hint.title || repo.split('/')[1].replace(/[-_]/g, ' '),
    author: hint.author || repo.split('/')[0],
    category: hint.category || 'other', tags: [],
    desc: hint.desc || meta?.description || '',
    repoUrl: `https://github.com/${repo}`, homepage: meta?.homepage || '',
    stars: meta?.stargazers_count ?? hint.stars ?? null,
    license: meta?.license?.spdx_id || 'see repo',
    created: String(meta?.created_at || '').slice(0, 10),
    emoji: hint.emoji || '🎮', entry,
    playUrl: `/play/local/${slug}/${entry}`,
    url: `https://github.com/${repo}`,
    thumb: hint.thumb || `https://opengraph.githubassets.com/1/${repo}`,
    source: 'local', embed: 'iframe', downloaded: true,
  };
  catalog.games = catalog.games.filter((g) => g.slug !== slug).concat(game);
  writeJSON(catalogFile, catalog);
  return game;
}

// ---------------------------------------------------------------- Claude analysis

const RUNNING = new Map(); // game id -> in-flight analysis run (shared by all viewers)
const MAX_ANALYSES = 2;    // hard cap on concurrent claude processes
function broadcast(run, obj) {
  const line = `data: ${JSON.stringify(obj)}\n\n`;
  for (const r of run.emitters) { try { r.write(line); } catch { /* client gone */ } }
}

let claudeInfo = null;
function claudeVersion() {
  if (claudeInfo) return claudeInfo;
  const r = spawnSync('claude', ['--version'], { shell: true, encoding: 'utf8', timeout: 20000 });
  claudeInfo = r.status === 0
    ? { ok: true, version: String(r.stdout || '').trim() }
    : { ok: false, version: null };
  return claudeInfo;
}

function localAnalysisPrompt(g, st) {
  return `You are a veteran game designer and engineer reviewing an HTML5 game stored in my local game library.

GAME: ${g.title} — by ${g.author}
Category: ${g.category} | Tags: ${(g.tags || []).join(', ')}
GitHub: ${g.repoUrl} (⭐ ${g.stars ?? '?'} stars) | License: ${g.license} | First created: ${g.created}
Description: ${g.desc}
My local portal stats: ${st?.plays || 0} plays, liked: ${st?.liked ? 'yes' : 'no'}

The complete source code is on disk at: games/${g.slug}/  (entry point: games/${g.slug}/${g.entry})
Use Read/Glob/Grep to inspect it — read the entry HTML and the main scripts, skim the rest.

Write a markdown report with exactly these sections:
## Verdict
One-paragraph summary, then scores out of 10 for: Fun, Code quality, Learning value.
## How it plays
Core loop, controls, difficulty curve, typical session length.
## Under the hood
Engine/libraries, rendering approach (canvas/WebGL/DOM), game loop, input handling, audio, persistence. Note anything clever you actually found in the code.
## What makes it good
Design + engineering highlights.
## Weak spots
Dated patterns, code smells, missing features.
## Steal these ideas
Concrete techniques worth reusing in my own games.

Keep it under ~700 words. Be specific — cite real file names and functions you saw.
Start your report directly with "## Verdict" — no preamble, no narration of your process.`;
}

function remoteAnalysisPrompt(g, localTitles) {
  return `You are a veteran game analyst. I found this HTML5 game on ${g.source} and want an assessment before deciding to feature it in my local game portal.

GAME: ${g.title}${g.author ? ' — by ' + g.author : ''}
Category: ${g.category}
Source page: ${g.url}
Ranking metric there: ${g.metric ? `${g.metric.label}: ${g.metric.value}` : 'n/a'}
Description: ${g.desc || '(none)'}

You may WebFetch the source page (at most 2 pages) for extra context.

Write a markdown report with exactly these sections:
## Verdict
Is it worth featuring? Score out of 10, one-paragraph justification.
## Gameplay
What the game is, its core loop, and what makes this genre tick.
## Why it ranks
Why this game likely earns its ranking/rating on ${g.source}.
## Design notes
Mechanics and UX patterns to expect; anything to watch out for (ads, dark patterns).
## Similar games
3 comparable titles${localTitles ? `, including any from my local library if relevant (${localTitles})` : ''}.

Keep it under ~450 words.
Start your report directly with "## Verdict" — no preamble, no narration of your process.`;
}

function batchPrompt(m) {
  const rows = (m.games || []).map((g, i) =>
    `${i + 1}. ${g.title}${g.author ? ' — by ' + g.author : ''} | category: ${g.category} | ${g.metric || 'no metric'} | ${g.source}${g.desc ? ' | ' + g.desc : ''}`
  ).join('\n');
  return `You are a veteran game critic. Review this GROUP of HTML5 games together and produce a definitive ranked verdict for my game portal.

GROUP: ${m.title} (${(m.games || []).length} games)
${rows}

Write a markdown report with exactly these sections:
## Ranking
A numbered list ranking ALL the games from best to worst. Each line: **Name** — score/10 — one-line verdict.
## Top pick
Why #1 wins for this group.
## Notable mentions
2–3 games with something special (design, innovation, polish).
## Skip these
Any not worth the time, and why — be honest.
## Group insights
What this group says about the genre/source, and what a game developer should learn from it.

Base judgments on the metadata given plus your knowledge of these games/genres; do not invent facts.
Keep it under ~600 words. Start directly with "## Ranking" — no preamble.`;
}

function runClaude(prompt, onEvent, onDone) {
  let finished = false;
  let attempt = 0;

  const start = (includePartial) => {
    attempt++;
    const args = ['-p', '--output-format', 'stream-json', '--verbose',
      '--max-turns', '12', '--allowedTools', 'Read,Glob,Grep,WebFetch,WebSearch'];
    if (includePartial) args.push('--include-partial-messages');
    const child = spawn('claude', args, { cwd: ROOT, shell: true, windowsHide: true });

    let buf = '';
    let acc = '';
    let sawDelta = false;
    let gotResult = false;
    let stderr = '';

    const timer = setTimeout(() => {
      if (!finished) {
        onEvent({ t: 'err', message: 'analysis timed out after 6 minutes' });
        finished = true;
        killTree(child);
        onDone(null);
      }
    }, 6 * 60 * 1000);

    child.stdin.on('error', () => { /* EPIPE when the CLI exits early — the close handler reports it */ });
    try { child.stdin.write(prompt); child.stdin.end(); } catch { /* ignore */ }
    child.stderr.on('data', (d) => { stderr += d; });
    child.stdout.on('data', (d) => {
      buf += d;
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        let j;
        try { j = JSON.parse(line); } catch { continue; }
        if (j.type === 'system' && j.subtype === 'init') {
          onEvent({ t: 'meta', model: j.model || '' });
        } else if (j.type === 'stream_event') {
          const e = j.event;
          if (e && e.type === 'content_block_delta' && e.delta && e.delta.type === 'text_delta') {
            sawDelta = true;
            acc += e.delta.text;
            onEvent({ t: 'delta', text: e.delta.text });
          }
        } else if (j.type === 'assistant' && !sawDelta) {
          const txt = (j.message?.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
          if (txt) { acc += (acc ? '\n\n' : '') + txt; onEvent({ t: 'block', text: txt }); }
        } else if (j.type === 'result') {
          gotResult = true;
          clearTimeout(timer);
          if (!finished) {
            finished = true;
            const full = (typeof j.result === 'string' && j.result.trim()) ? j.result : acc;
            onDone(full);
          }
        }
      }
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (finished || gotResult) return;
      const flagProblem = /include-partial-messages|unknown option|unknown argument/i.test(stderr);
      if (includePartial && flagProblem && attempt < 2) { start(false); return; }
      finished = true;
      if (acc.trim()) { onDone(acc); return; }
      onEvent({ t: 'err', message: (stderr || `claude exited with code ${code}`).slice(-900) });
      onDone(null);
    });
    child.on('error', (e) => {
      clearTimeout(timer);
      if (finished) return;
      finished = true;
      onEvent({ t: 'err', message: 'could not start claude CLI: ' + e.message });
      onDone(null);
    });
    return child;
  };

  return start(true);
}

function killTree(child) {
  try { spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { shell: true, timeout: 10000 }); } catch { /* ignore */ }
}

// ---------------------------------------------------------------- request router

const handler = async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  try {
    // ---- portal UI + local game files
    // portal shell is served with no-store so browsers can never run a stale version
    if (p === '/') return serveFile(res, PUB, 'index.html', 'no-store');
    if (p.startsWith('/play/local/')) return serveFile(res, GAMES_DIR, p.slice('/play/local/'.length));

    // ---- API
    if (p === '/api/games') {
      const catalog = readJSON(path.join(DATA_DIR, 'catalog.json'), { games: [] });
      if (scanManualGames(catalog)) writeJSON(path.join(DATA_DIR, 'catalog.json'), catalog);
      const remote = [];
      const meta = {};
      for (const n of Object.keys(SOURCES)) {
        const c = readJSON(path.join(CACHE_DIR, `${n}.json`), null);
        if (c) { remote.push(...c.games); meta[n] = { label: SOURCES[n].label, count: c.games.length, fetchedAt: c.fetchedAt }; }
        else meta[n] = { label: SOURCES[n].label, count: 0, fetchedAt: 0 };
      }
      let analyses = [];
      try { analyses = fs.readdirSync(ANALYSIS_DIR).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)); } catch { /* ignore */ }
      return send(res, 200, { local: catalog.games, remote, sources: meta, stats, analyses, cats: CATS });
    }

    if (p === '/api/remote') {
      const { games, meta } = await getAllRemote(url.searchParams.get('refresh') === '1');
      return send(res, 200, { remote: games, sources: meta, stats });
    }

    if (p === '/api/event' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req) || '{}');
      const { id, type } = body;
      if (!id || !['play', 'like', 'unlike'].includes(type)) return send(res, 400, { error: 'bad event' });
      const st = (stats[id] ||= { plays: 0, liked: false });
      if (type === 'play') { st.plays++; st.lastPlayed = Date.now(); }
      if (type === 'like') st.liked = true;
      if (type === 'unlike') st.liked = false;
      saveStats();
      return send(res, 200, { id, ...st });
    }

    if (p === '/api/inventory' && req.method === 'GET') {
      return send(res, 200, { inventory });
    }

    if (p === '/api/inventory' && req.method === 'POST') {
      const b = JSON.parse(await readBody(req) || '{}');
      if (b.op === 'add' && b.game && b.game.id) {
        if (!inventory.find((g) => g.id === b.game.id)) { inventory.push(b.game); saveInventory(); }
        return send(res, 200, { ok: true, count: inventory.length });
      }
      if (b.op === 'remove' && b.id) {
        inventory = inventory.filter((g) => g.id !== b.id);
        saveInventory();
        return send(res, 200, { ok: true, count: inventory.length });
      }
      return send(res, 400, { error: 'bad inventory op' });
    }

    // scan a game's page (e.g. itch.io) for a public source repo the developer linked
    if (p === '/api/findsource' && req.method === 'POST') {
      const b = JSON.parse(await readBody(req) || '{}');
      const pageUrl = b.url || '';
      if (!/^https?:\/\//.test(pageUrl)) return send(res, 400, { error: 'bad url' });
      try {
        const r = await fetch(pageUrl, { headers: UA });
        if (!r.ok) return send(res, 502, { error: `game page HTTP ${r.status}` });
        const html = await r.text();
        const repos = [...html.matchAll(/github\.com\/([A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+)/g)]
          .map((m) => m[1].replace(/\.git$/, ''))
          .filter((x) => !/^(sponsors|features|topics|about|site|marketplace|apps|orgs|settings)\//i.test(x));
        const uniq = [...new Set(repos)];
        if (uniq.length) return send(res, 200, { repo: uniq[0], via: 'page-link', candidates: uniq.slice(0, 5) });

        // fallback: itch authors usually reuse their username on GitHub — search their repos by title words
        const author = (b.author || '').trim() || (() => { try { return new URL(pageUrl).hostname.split('.')[0]; } catch { return ''; } })();
        const tokens = String(b.title || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
          .filter((w) => w.length > 2 && !['the', 'and', 'with', 'for', 'game'].includes(w));
        if (author) {
          const gh = async (q) => {
            const rr = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=20`, { headers: { ...UA, Accept: 'application/vnd.github+json' } });
            if (!rr.ok) return [];
            return (await rr.json()).items || [];
          };
          let items = tokens.length ? await gh(`user:${author} ${tokens[0]}`) : [];
          if (!items.length) items = await gh(`user:${author}`);
          const scored = items.map((it) => {
            const hay = `${it.name} ${it.description || ''}`.toLowerCase();
            return { it, score: tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0) };
          }).filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score || (b.it.stargazers_count || 0) - (a.it.stargazers_count || 0));
          if (scored.length) {
            return send(res, 200, { repo: scored[0].it.full_name, via: 'github-author-match', candidates: scored.slice(0, 5).map((x) => x.it.full_name) });
          }
        }
        return send(res, 404, { error: 'no public source found — no repo link on the page and no matching GitHub repo under the author\'s name' });
      } catch (e) {
        return send(res, 500, { error: String(e.message || e) });
      }
    }

    if (p === '/api/download' && req.method === 'POST') {
      const b = JSON.parse(await readBody(req) || '{}');
      const m = /^gh:(.+)$/.exec(b.id || '');
      if (!m) return send(res, 400, { error: 'only GitHub open-source games can be downloaded into the library' });
      try {
        const game = await downloadRepoGame(m[1], b);
        return send(res, 200, { ok: true, game });
      } catch (e) {
        return send(res, 500, { error: String(e.message || e) });
      }
    }

    if (p === '/api/health') {
      const catalog = readJSON(path.join(DATA_DIR, 'catalog.json'), { games: [] });
      return send(res, 200, { ok: true, boot: BOOT_ID, claude: claudeVersion(), localGames: catalog.games.length });
    }

    if (p === '/api/analysis') {
      const id = url.searchParams.get('id') || '';
      const file = path.join(ANALYSIS_DIR, safeId(id) + '.md');
      if (!fs.existsSync(file)) return send(res, 404, { error: 'no analysis yet' });
      return send(res, 200, fs.readFileSync(file, 'utf8'), { 'Content-Type': 'text/markdown; charset=utf-8' });
    }

    if (p === '/api/analyze') {
      const id = url.searchParams.get('id') || '';
      const force = url.searchParams.get('force') === '1';
      if (!id) return send(res, 400, { error: 'missing id' });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      // absolute lifetime cap so an abandoned stream can never pin a browser connection forever
      const sseCap = setTimeout(() => { try { res.end(); } catch { /* gone */ } }, 8 * 60 * 1000);
      req.on('close', () => clearTimeout(sseCap));
      const emit = (obj) => { try { res.write(`data: ${JSON.stringify(obj)}\n\n`); } catch { /* client gone */ } };
      try { res.write('retry: 60000\n\n'); } catch { /* slow down zombie-page reconnect storms */ }

      const file = path.join(ANALYSIS_DIR, safeId(id) + '.md');
      if (!force && fs.existsSync(file)) {
        emit({ t: 'cached' });
        emit({ t: 'done', full: fs.readFileSync(file, 'utf8') });
        return res.end();
      }

      if (!claudeVersion().ok) {
        emit({ t: 'err', message: 'claude CLI not found on PATH. Install Claude Code to enable analysis.' });
        return res.end();
      }

      // resolve the game: local catalog first, else metadata passed by the client
      const catalog = readJSON(path.join(DATA_DIR, 'catalog.json'), { games: [] });
      const local = catalog.games.find((g) => g.id === id);
      let game = local;
      if (!game) {
        try {
          const b64 = (url.searchParams.get('meta') || '').replace(/-/g, '+').replace(/_/g, '/');
          game = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
        } catch { /* ignore */ }
      }
      if (!game) { emit({ t: 'err', message: 'unknown game id and no metadata supplied' }); return res.end(); }

      const localTitles = catalog.games.map((g) => g.title).slice(0, 12).join(', ');
      const prompt = local ? localAnalysisPrompt(local, stats[id])
        : game.batch ? batchPrompt(game)
        : remoteAnalysisPrompt(game, localTitles);

      // one run per game: extra clicks/tabs attach to the same in-flight run
      let run = RUNNING.get(id);
      if (!run) {
        if (RUNNING.size >= MAX_ANALYSES) {
          emit({ t: 'err', message: `${RUNNING.size} analyses are already running. Please wait for them to finish (1–2 min), then try again.` });
          return res.end();
        }
        run = { emitters: new Set(), acc: '', mode: local ? 'source-code review' : (game.batch ? 'group review & ranking' : 'metadata review'), model: '', secs: 0 };
        RUNNING.set(id, run);
        run.timer = setInterval(() => {
          run.secs += 15;
          broadcast(run, { t: 'tick', secs: run.secs });
        }, 15000);
        runClaude(prompt, (ev) => {
          if (ev.t === 'meta') run.model = ev.model;
          if (ev.t === 'delta') run.acc += ev.text;
          if (ev.t === 'block') run.acc += (run.acc ? '\n\n' : '') + ev.text;
          broadcast(run, ev);
        }, (full) => {
          clearInterval(run.timer);
          if (full && full.trim()) {
            // agentic runs sometimes narrate before the report — keep from the first heading
            const h = full.search(/^##\s/m);
            const clean = h > 0 ? full.slice(h) : full;
            fs.writeFileSync(file, clean);
            broadcast(run, { t: 'done', full: clean });
          }
          for (const r of run.emitters) { try { r.end(); } catch { /* gone */ } }
          RUNNING.delete(id);
        });
      }
      emit({ t: 'start', mode: run.mode });
      if (run.model) emit({ t: 'meta', model: run.model });
      if (run.acc) emit({ t: 'delta', text: run.acc }); // replay what the run produced so far
      run.emitters.add(res);
      req.on('close', () => run.emitters.delete(res));
      // NOTE: a started analysis always runs to completion (bounded by MAX_ANALYSES
      // and the 6-minute timeout) so the result still lands in data/analysis/.
      return;
    }

    // ---- static portal assets (no-store: always run the latest UI code)
    return serveFile(res, PUB, p, 'no-store');
  } catch (e) {
    return send(res, 500, { error: String(e.message || e) });
  }
};

process.on('uncaughtException', (e) => console.error('[gamentic] uncaught exception:', e));
process.on('unhandledRejection', (e) => console.error('[gamentic] unhandled rejection:', e));

const server = http.createServer(handler);
server.keepAliveTimeout = 5000;
server.headersTimeout = 10000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  🎮 Gamentic running →  http://localhost:${PORT}\n`);
  const catalog = readJSON(path.join(DATA_DIR, 'catalog.json'), { games: [] });
  console.log(`  local games stored: ${catalog.games.length}  (folder: ${GAMES_DIR})`);
  console.log(`  remote sources: ${Object.values(SOURCES).map((s) => s.label).join(', ')}`);
});
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is busy. Run with another port:  set PORT=5000 && node server.mjs`);
    process.exit(1);
  }
  throw e;
});

// Backup door on a second port. A stuck/zombie tab can exhaust the browser's
// 6-connections-per-origin pool for :4321 and block every new tab on that origin;
// a different port is a different origin with a fresh pool, so it always opens.
if (ALT_PORT && ALT_PORT !== PORT) {
  const alt = http.createServer(handler);
  alt.keepAliveTimeout = 5000;
  alt.headersTimeout = 10000;
  alt.on('error', () => console.error(`  (backup port ${ALT_PORT} unavailable — continuing with :${PORT} only)`));
  alt.listen(ALT_PORT, '127.0.0.1', () => console.log(`  backup door →  http://localhost:${ALT_PORT}`));
}
