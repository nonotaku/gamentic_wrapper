// Gamentic fetcher
// Downloads the curated, human-made open-source HTML5 games listed in data/curated.json
// into ./games/<slug>/ and builds data/catalog.json with metadata + GitHub stars.
//
// Usage: node scripts/fetch-games.mjs [--force]
//   --force  re-download games even if the folder already exists

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GAMES_DIR = path.join(ROOT, 'games');
const DATA_DIR = path.join(ROOT, 'data');
const THUMBS_DIR = path.join(ROOT, 'public', 'thumbs');
const FORCE = process.argv.includes('--force');
const UA = { 'User-Agent': 'gamentic-local-game-portal' };

for (const d of [GAMES_DIR, DATA_DIR, THUMBS_DIR]) fs.mkdirSync(d, { recursive: true });
const curated = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'curated.json'), 'utf8'));

const CAT_HUE = {
  puzzle: 262, arcade: 330, action: 8, classic: 48, shooter: 200, racing: 152,
  adventure: 25, strategy: 215, sports: 130, card: 280, idle: 95, platformer: 180, other: 230,
};

function xmlEsc(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
}

function writeThumb(g) {
  const hue = CAT_HUE[g.category] ?? 230;
  const hue2 = (hue + 42) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="hsl(${hue},65%,26%)"/><stop offset="1" stop-color="hsl(${hue2},75%,12%)"/>
  </linearGradient></defs>
  <rect width="640" height="360" fill="url(#g)"/>
  <circle cx="540" cy="60" r="130" fill="hsl(${hue2},70%,32%)" opacity="0.25"/>
  <circle cx="80" cy="330" r="105" fill="hsl(${hue},70%,42%)" opacity="0.18"/>
  <text x="320" y="192" font-size="118" text-anchor="middle">${g.emoji}</text>
  <text x="320" y="306" font-size="34" font-weight="700" text-anchor="middle" fill="#f2f4fb" opacity="0.95" font-family="Segoe UI, system-ui, sans-serif">${xmlEsc(g.title)}</text>
</svg>`;
  fs.writeFileSync(path.join(THUMBS_DIR, `${g.slug}.svg`), svg);
}

async function ghMeta(repo) {
  try {
    const r = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { ...UA, Accept: 'application/vnd.github+json' },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function downloadZip(repo, branch, dest) {
  const url = `https://codeload.github.com/${repo}/zip/refs/heads/${branch}`;
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`download HTTP ${r.status} (${url})`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function extractZip(zipPath, slug) {
  const tmp = path.join(GAMES_DIR, `_tmp_${slug}`);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const r = spawnSync('tar', ['-xf', zipPath, '-C', tmp], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`unzip failed: ${r.stderr || r.status}`);
  const entries = fs.readdirSync(tmp).filter((e) => !e.startsWith('.'));
  let srcDir = tmp;
  if (entries.length === 1 && fs.statSync(path.join(tmp, entries[0])).isDirectory()) {
    srcDir = path.join(tmp, entries[0]);
  }
  const dest = path.join(GAMES_DIR, slug);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.renameSync(srcDir, dest);
  fs.rmSync(tmp, { recursive: true, force: true });
  return dest;
}

function findEntry(dir, preferred) {
  for (const c of [preferred, 'index.html', 'index.htm'].filter(Boolean)) {
    if (fs.existsSync(path.join(dir, c))) return c;
  }
  const htmls = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.html'));
  htmls.sort((a, b) => a.length - b.length);
  return htmls[0] || null;
}

const catalog = [];
const failures = [];

for (const g of curated) {
  process.stdout.write(`- ${g.title} (${g.repo}) ... `);
  try {
    const meta = await ghMeta(g.repo);
    const branch = g.branch || meta?.default_branch || 'master';
    const dest = path.join(GAMES_DIR, g.slug);
    const already = !FORCE && fs.existsSync(dest) && !!findEntry(dest, g.entry);
    if (already) {
      process.stdout.write('cached ');
    } else {
      const zip = path.join(GAMES_DIR, `_${g.slug}.zip`);
      const bytes = await downloadZip(g.repo, branch, zip);
      process.stdout.write(`${(bytes / 1048576).toFixed(1)}MB `);
      extractZip(zip, g.slug);
      fs.rmSync(zip, { force: true });
    }
    const entry = findEntry(dest, g.entry);
    if (!entry) throw new Error('no HTML entry file found after extraction');
    const stars = meta?.stargazers_count ?? null;
    catalog.push({
      id: `local:${g.slug}`,
      slug: g.slug,
      title: g.title,
      author: g.author,
      category: g.category,
      tags: g.tags || [],
      desc: g.blurb || meta?.description || '',
      repoUrl: `https://github.com/${g.repo}`,
      homepage: meta?.homepage || '',
      stars,
      license: meta?.license?.spdx_id || 'see repo',
      created: String(meta?.created_at || `${g.year}-01-01`).slice(0, 10),
      emoji: g.emoji,
      entry,
      playUrl: `/play/local/${g.slug}/${entry}`,
      url: `https://github.com/${g.repo}`,
      thumb: `/thumbs/${g.slug}.svg`,
      source: 'local',
      embed: 'iframe',
    });
    writeThumb(g);
    console.log(`ok  ⭐${stars ?? '?'}  entry=${entry}`);
  } catch (e) {
    failures.push({ game: g.title, error: String(e.message || e) });
    console.log(`FAILED: ${e.message || e}`);
  }
}

fs.writeFileSync(
  path.join(DATA_DIR, 'catalog.json'),
  JSON.stringify({ builtAt: new Date().toISOString(), games: catalog }, null, 2)
);
console.log(`\ncatalog.json written: ${catalog.length}/${curated.length} games ready in ./games/`);
if (failures.length) {
  console.log('Failures:');
  for (const f of failures) console.log(`  - ${f.game}: ${f.error}`);
}
