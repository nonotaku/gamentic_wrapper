# 🎮 Gamentic — local HTML5 game wrapper & portal

A zero-dependency localhost web portal that **finds good-quality, human-made HTML5 games,
stores them in a folder, ranks them by category, and analyzes them with your local Claude Code CLI**.

## Quick start

```bash
npm run fetch    # download / update the stored games (already done on first setup)
npm start        # → http://localhost:4321
```

No npm dependencies — everything runs on plain Node.js (≥18) built-ins.

## What it does

| Requirement | How it's covered |
|---|---|
| Find good-quality HTML5 games & store in a folder | `npm run fetch` downloads 16 legendary open-source games (2048, HexGL, A Dark Room, Pac-Man, Underrun, Elevator Saga…) into `./games/<slug>/` — fully playable offline |
| Localhost web wrapper over different game websites | The portal aggregates live rankings from **itch.io** (RSS), **GamePix** (quality feed), **GameMonetize** (feed), and **GitHub** (star search) next to your local library — ~400+ games |
| Games must not be AI-made | Curated list = classics from 2010-2018 (pre-AI era). GitHub discovery is restricted to repos **created before 2023**, and every source passes a keyword screen that drops "AI-generated / ChatGPT / vibe-coded" titles (plus an adult-content screen) |
| Categories + ranking by views/likes/etc. | 13 categories (puzzle, arcade, racing, shooter…). Rank by: blended top score, site metric (⭐ GitHub stars / GamePix quality /100 / itch & GameMonetize popularity rank), **your local views (plays)**, **your likes**, newest, A-Z |
| Analyze games with Claude | The 🤖 Analyze button pipes the game to your local `claude` CLI. For stored games Claude **reads the actual source code** (Read/Glob/Grep); for remote games it reviews the metadata (and may WebFetch the game page). Results stream live and are cached in `data/analysis/` |

## Folder layout

```
gamentic/
├─ server.mjs             # the portal server (http://localhost:4321)
├─ scripts/fetch-games.mjs# game finder/downloader
├─ games/                 # ★ the stored games, one folder each
│  ├─ 2048/  hexgl/  adarkroom/  …
├─ public/                # portal UI (vanilla HTML/CSS/JS)
├─ data/
│  ├─ curated.json        # the human-made game list (add your own here)
│  ├─ catalog.json        # built by the fetcher (metadata + stars)
│  ├─ stats.json          # your local views & likes
│  ├─ cache/              # cached listings from the game websites (24 h TTL)
│  └─ analysis/           # saved Claude analyses (markdown)
```

## Using the portal

The portal has three levels:

1. **Home** — a directory of game websites (My library, itch.io, GamePix, GameMonetize,
   GitHub open source, All, and your 🎒 Inventory). Click one to enter its wrap.
2. **Inside a website** — browse that site's games with the category sidebar, ranking
   selector and search. 🥇🥈🥉/#n are positions in the current view.
3. **🎒 Inventory** — your personal collection, like a game shelf.

Every game card has five action icons:

| Icon | Action |
|---|---|
| ▶ | Play (embedded player, or new tab for sites that refuse embedding) |
| 🎒 / ✓ / 🗑 | Add to / remove from your inventory |
| ⬇ / 💾 | Download source into `./games/` — it becomes a LOCAL game, playable offline. 💾 = already stored. GitHub games download directly; **itch.io games auto-search for the developer's public repo** (page-link scan, then author-name match on GitHub) — closed-source titles report "no public source". GamePix/GameMonetize are always closed-source |
| 🤖 | Claude review of this single game (source-code review for stored games) |
| 🤍 / ❤ | Like — feeds your ranking |

Group ranking:

- **🤖 Rank this view** (sidebar, inside a website) — one Claude report that ranks the top 10
  games of the current category/view, with scores, a top pick, and skip-list.
- **🤖 Review & rank inventory** — the same, for everything you've collected.

Other notes:

- Every play counts a view (👁); views + likes are stored in `data/stats.json` and feed
  the "Top score" ranking. The inventory lives in `data/inventory.json`.
- **⟳** re-fetches all game websites (otherwise cached for 24 h).
- Analyses stream live, run at most 2 at a time (extra clicks attach to the running one),
  and are cached in `data/analysis/` — the 🤖 icon turns green when a saved report exists.

## Importing games you downloaded yourself (e.g. official itch.io downloads)

Many itch.io games offer an official **Download** button (the developer provides the files).
Download the game there, unzip it, and drop the folder into `./games/` — the portal
auto-detects any folder containing a playable HTML file and lists it as a LOCAL game
(📦 imported). Delete the folder and it de-lists automatically. Note: only **HTML5/web
builds** are playable inside the portal; Windows/Mac builds run outside the browser.
Browser-only itch games (no Download button) can't be stored — play them via the portal
and use 🤖 analysis instead. (The portal never rips files from itch's servers.)

## Adding more games to the library

Add an entry to `data/curated.json` (any static open-source HTML5 game on GitHub):

```json
{ "slug": "my-game", "title": "My Game", "author": "Someone",
  "repo": "owner/repo", "category": "puzzle", "emoji": "🧩",
  "year": 2016, "blurb": "Why it's good." }
```

Optional: `"branch"` (defaults to the repo's default branch), `"entry"` (defaults to `index.html`).
Then run `npm run fetch`.

## Notes & troubleshooting

- **Port busy** → `set PORT=4545 && node server.mjs`
- **GitHub API rate limit** (60 req/h unauthenticated) → stars may show `?` temporarily; re-run later.
- **A stored game shows a blank screen in tests** → games driven by `requestAnimationFrame`
  pause while the tab is hidden; they run when visible.
- **Licenses** — stored games keep their upstream licenses (mostly MIT; HexGL is
  non-commercial). They're stored for personal local play; don't redistribute without checking.
- Analyses use your Claude Code login (the `claude` CLI), tools restricted to
  read-only (`Read,Glob,Grep,WebFetch,WebSearch`), max 12 turns, 6-minute cap.
