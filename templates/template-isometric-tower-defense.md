# template-isometric-tower-defense — v5

**Proven blueprint** distilled from our own shipped game **NEON BASTION** (`g86bd9a` v373 = pure-TD baseline; `gbe4dbe` = full build with story/tech-tree/i18n layers). Not a reimplementation of someone else's game: every number below was tuned live on this platform and owner-playtested (NORMAL verdict: "not too hard, not too easy"). Treat each ⚠ as a scar — it was paid for.

*v2 (2026-08-05): re-cut after the COGSPIRE blind build (`g3ddaec`, a fresh agent given only this file) — its 22-item friction log patched in with source-verified numbers; presentation baseline added per owner policy.*
*v3 (2026-08-05): second blind build (WYRMWARD `g6ead49`, Opus 5, fantasy theme — zero theme resistance) — tower-side anchor added, sell/move economy corrected against source, endless budget and the master HP chain published, ladder/floor made self-consistent, bot-sim verification made explicit.*
*v4 (2026-08-05): owner visual QA of blind build #2 caught what the checklist could not — blur from stretch-scaling and a 2000s-website UI register. Display pipeline section added (fixed stage + uniform scale + DOM-draws-the-UI, mandated), presentation register made concrete.*
*v5 (2026-08-05): the WYRMWARD retrofit (v41) ran the two v4 sections blind and filed 13 frictions — both sections tightened: fit snippet made self-contained, pointer math corrected, art-in-DOM ruled, fit proven by on-screen readout, register given font stacks / z-order / sfx delegation / control budget.*

## When to use
Isometric grid tower defense: build towers on open cells beside multi-route enemy paths, survive authored waves plus an endless mode — Arknights / Kingdom Rush lineage. Session 15–30 min per stage, campaign of seeded stages.

Sibling spec: `gamentic_gameskill_rewritten/strategy_game/TowerDefence.md` is a tiny 4-tower jam game (flat grid, 1 HP heart) — reach for it only when the ask is explicitly minimal/retro.

## Iron numbers (projection + board)

| Thing | Value | Why |
|---|---|---|
| Canvas | 1600×900 | HUD legible at 800px screenshot scale |
| Tile | `TILE_W 78, TILE_H 39` (2:1 diamond), `TW2 39, TH2 19.5` | classic iso; halves precomputed because every projection uses them |
| Grid | **18×14** | board width `(w+h)*TW2` = 1248px exceeds the 1120px between two ~240px HUD panels — legal because the diamond's EMPTY corners tuck under the panels; only the wide mid-band must clear them |
| Projection | `W(x,y) = { x: ox+(x-y)*TW2, y: oy+(x+y)*TH2 }` | centre BOTH axes on the routes' screen extremes: `ox = CANVAS_W/2-(minSX+maxSX)/2`, `oy = CANVAS_H/2-(minSY+maxSY)/2 + 30` (+30 clears the top HUD bar) |
| Anchor enemy | 55 hp / 1.4 spd / bounty 4 — **pre-multiplier** (×1.45 floor lands it ~80 effective at normal, hpScale 1) | everything on the enemy side scales off it |
| Anchor tower | 32 dmg @ 0.8/s = **25.6 dps**, range 3.4, cost 100 | two shots kill the raw anchor enemy, three kill the floored one — every other role prices off this |
| Tower costs | base 90–150 (anchor 100; slow-field cheapest at 90, sustained beam dearest at 150) | first tower affordable on starting credits, second needs one wave of bounties. Path tiers price ≈ 90–100 / 160–200 / 400–440. Selling refunds **75% of invested**; MOVING a tower — reposition is a shipped mechanic — costs **15% of invested** |

⚠ **Integer grid coords are CELL CENTRES** — a tile spans ±0.5 in grid space. Terrain tiles, height lifts and hit tests drawn corner-to-corner land half a tile off, and the error *looks like* a z-height bug (we "fixed" tower lift first; the real cause was the origin convention). Pick one convention, write it as a comment at the projection function, derive everything from it.

## Display pipeline — how the game stays sharp

The stage is a FIXED 1600×900 element the window never resizes; a fit pass scales the WHOLE stage uniformly and letterboxes the rest:

```js
// #stage { position:absolute; top:0; left:0; width:1600px; height:900px; transform-origin:0 0; }
// (at the default transform-origin 50% 50% this exact formula mis-centres the stage)
const s = Math.min(innerWidth / 1600, innerHeight / 900);
stage.style.transform = `translate(${(innerWidth - 1600*s)/2}px, ${(innerHeight - 900*s)/2}px) scale(${s})`;
// world-coordinate input = (clientX - stageRect.left) / s — bare clientX/s is off by the
// letterbox bar. DOM-relative measurements (getBoundingClientRect widgets) are ALREADY in
// scaled space; dividing there double-corrects.
```

- ⚠ `canvas { width:100%; height:100% }` stretches the raster to the window — aspect breaks on any non-16:9 screen and everything blurs. A blind build shipped exactly this; the owner caught it on sight.
- **Canvas draws the WORLD; DOM draws the UI.** Transform-scaled DOM text re-rasterises crisply at every window size, while canvas text is a raster that blurs with it — and only DOM can reach the presentation register below (CSS glow, hover transitions). Canvas-drawn buttons read as a 2000s website game. **Art inside a DOM panel is still art**: key art as a CSS background, portraits as `<img>` over `GAME_ASSETS`, and an entity that exists only as draw code gets its own small canvas in the panel.
- World canvases sit 1:1 inside the stage — attribute size = stage px (NEON layers a static background canvas under the live one) — with `imageSmoothingQuality = 'high'` on world draws.
- **Prove the fit with an on-screen readout** (window size, `s`, stage ratio, bar widths, canvas attr vs css) — a fixed-viewport screenshot cannot show a resize; the readout can, and it is what satisfies the letterbox checklist line.
- Retrofitting a canvas-drawn UI: delete its immediate-mode hit state wholesale — one leftover hover/panel guard eats every click the new DOM panels should receive.

## Enemy taxonomy: trash / threat / boss

Three tiers with different jobs — the wave engine, balance maths and codex all key off this split. **The mechanics and numbers are the template; the skins are not**: each game names and themes its own roster, and the test for a skin word is whether it only works in one theme. Damage comes in **four types** (NEON: `phys / energy / cold / viral`; a beast theme might say claw / venom / frost / rot) — two main types counter-paired against the defences (armour blunts one, barrier-gates absorb the other), a control type carrying the slows, and a decay type for damage-over-time. Boss phases gate on type — one axis, three systems fed.

- **Trash** (4 roles: basic · fast · swarm-cheap · spawned-child): only a health bar — AoE clears them for free. Bounty 1–5.
- **Threat**: one mechanic each that punishes a pure-AoE answer *for a different reason* — soak · barrier gate · stealth (needs detection) · self-heal · tower-disable · support aura · spawner. NEON's instantiation with tuned numbers: armor 0.35 · barrier 95 over 125 hp · 92 hp stealthed · regen 12/s · disable every 5s r2.2 for 2.5s · heal aura r2.0 at 9 hp/s · prints 6 spawn. Bounty 9–30.
- **Boss**: phase-scripted on hp thresholds with per-type damage multipliers and a shouted label per phase — e.g. NEON's act-1 boss, 1350 hp: `>66% energy×0 "USE PHYSICAL"` → `>33% phys×0.25 "USE ENERGY"` → `everything ×1.25 + spd ×1.25 "IT RUNS!"`. Escalate across acts (3000 hp + spawns every 6s; 4600 hp + disable pulses every 9s + rotating weak points). Bounty 280–500. **Bosses resist control**: stun ×0.2, slow ×0.5 — CC helps, never trivialises.

**Detection is a branch stat, not a tower**: put `detect: true` on a cheap support-branch tier (NEON: the adjacency-buff tower's range branch t1 at cost 90, plus the seeker's guardian t2); any live detector reveals stealthed units within `detectRange 3.5`. The wave preview must warn — `NO DETECTION BUILT!` — when a stealth wave approaches with zero detectors, or that wave is an unexplained wipe.

## Wave engine

Two sources, one shape pass:

```js
this.waves = opts.waves || (this.endless ? [] : WAVES);   // hand-authored table for campaign
```
⚠ **Non-endless runs never call `genWave`** — the hand-authored `WAVES` table bypasses it entirely. Any wave-behaviour change made only in `genWave` silently does nothing in campaign. This bit us twice (archetypes, then threat timing). Route every wave through the shared shaping pass in the Engine constructor instead.

**Archetypes shape TIMING ONLY** — composition and counts stay authored. Each wave gets one:

```js
const WAVE_SHAPE = {
  probe:  { gapLo:0.12, gapSpan:0.18, stepLo:1,   stepSpan:2,   pick:'cheap', want:2, bud:0.7 },
  tide:   { gapLo:0.09, gapSpan:0.13, stepLo:0.5, stepSpan:1.5, pick:'cheap', want:2, bud:1 },
  siege:  { gapLo:1.4,  gapSpan:1.2,  stepLo:4,   stepSpan:5,   pick:'heavy', want:2, bud:1 },
  column: { gapLo:0.5,  gapSpan:0.6,  stepLo:1.2, stepSpan:1.6, pick:'heavy', want:3, bud:1 },
  ambush: { gapLo:0.15, gapSpan:0.25, stepLo:0,   stepSpan:0.6, pick:'mix',   want:3, bud:1 },
};
// per group:  gap = gapLo + rng*gapSpan          seconds BETWEEN UNITS inside the group
// group start: at += stepLo + rng*stepSpan       seconds between GROUP STARTS
// genWave only: pick sorts the candidate pool by cost (cheap-first | heavy-first | shuffled)
// and groups draw from the front — cheap→many small groups, heavy→few big ones;
// want caps group count, bud scales the wave budget
```
Five felt rhythms (trickle-scout / flood / slow heavies / spaced convoy / burst) from one enemy list — cheaper than authoring five enemy sets, and the player reads the difference immediately.

**Threat ladder** — when each question type may first appear, plus a floor:

```js
const THREAT_LADDER = [ {from:4,t:'soak'}, {from:5,t:'barrierGate'}, {from:7,t:'stealth'},
                        {from:9,t:'selfHeal'}, {from:11,t:'disable'}, {from:13,t:'support'} ];
// the SCHEDULE is the template — soak → barrier gate → stealth → self-heal → disable → support,
// each key renamed to whatever your theme calls that mechanic. The 7th mechanic (spawner)
// arrives via authored waves in NEON — give it a rung if your build leans on generated waves.
// floor: from THREAT_LADDER[0].from onward (never a hardcoded number), a wave where every
// group is trash promotes one group to the newest unlocked threat, CUTTING its count — a
// threat is worth several trash units (any hp-budget-ish conversion is fine; 14 trash must
// not become 14 barrier-gates)
```
The floor exists because authored tables drift: someone adds a filler wave and the mid-game goes flat. The `from` numbers assume ~18-wave stages — for a shorter run, remap the rungs across your wave count keeping at least one wave between rungs (naive proportional scaling collides on rounding and can land a threat before the floor even starts).

## Difficulty method (the part worth stealing)

Playtest lesson: **with 8 towers, several are AoE — trash evaporates and only the stealth unit ever threatened.** The fix that worked, in order:

1. **Count, not HP**: `WAVE_COUNT_MUL 1.4` more bodies, not spongier ones (applied in the generated-wave budget — authored tables were re-authored by hand). Sponges feel like lag; crowds feel like pressure.
2. **Non-boss HP floor**: `hpMul = hpBase * (isBoss ? 1+(mut.hp-1)*0.5 : mut.hp * TRASH_HP_MUL)` with `TRASH_HP_MUL 1.45` — the name is historical: it multiplies **every non-boss** (threats included). Bosses were already right, so they are excluded — and mutators hit bosses at HALF strength and never multiply boss count (a doubled boss is a brick wall, not a variation).
3. **Threats earlier** (the ladder above) — pressure comes from questions, not stats.

These numbers assume an 8-role, AoE-rich roster; a smaller slice keeps them as config knobs and re-tunes by playtest. Mutator default is neutral `{hp:1, n:1, spd:1, gold:0}`; a mutator's economy side rides the map's start bonus, so the engine never special-cases it.

**The whole HP multiplier chain, one line** (every section above plugs into it):
```js
hp = def.hp * hpCurve(wave) * diffMul[difficulty] * (map.hpScale || 1)
   * (isBoss ? 1 + (mut.hp - 1) * 0.5 : mut.hp * TRASH_HP_MUL);
// hpCurve = your per-wave growth curve (any monotone curve works; the knobs scale it).
// diffMul { easy: 0.78, normal: 1.0, hard: 1.32 } — the one global difficulty lever.
// Authored maps DECLARE hpScale (default 1); the route-geometry formula fills it for
// generated maps only.
```

Anchor every balance claim to a deliberately placed test subject (force a tower onto a high cell, pin a wave to one archetype) — a random playthrough proves nothing about the knob you turned. And since screenshots cannot place towers at all, **balance is provable only by a headless bot-sim**: a scripted build order buying at real prices, seeded runs, verdict printed on-screen (the 3/10-vs-13/13 evidence below and both blind builds' tuning came from exactly this). Bisect the global lever in small steps — the kill→bounty→tower loop makes it **a cliff, not a slope** (one blind build measured dead-by-wave-4 at 1.45 and flawless at 1.8 on the same lever).

## Terrain

- **High ground**: 5% of non-route cells, ×1.25 on range AND on every offensive output stat the role has (`dmg`, `dps`, `dot`, area damage — a role whose whole output lives in one odd key must still get it) — applied INSIDE `towerStats` to the already-merged stats, so tooltips, combat and the codex all agree; the renderer lifts the tower sprite 5px screen-up from its cell-centre anchor so it stands ON the slab, not beside it. **Rubble**: 9% of the same pool, blocks building. Both drawn from generated tile art assets, not hand-coded polygons.
- Seed both from an **FNV hash of the route geometry** ⚠ — generated maps have no `map.id`, so seeding from id gave every generated map the same terrain.
- Authored maps smaller than the grid scale up:
```js
if (map.w < GRID_W || map.h < GRID_H) {
  const sx = GRID_W/map.w, sy = GRID_H/map.h;
  map = {...map, w:GRID_W, h:GRID_H, routes: map.routes.map(r => r.map(p => [Math.round(p[0]*sx), Math.round(p[1]*sy)]))};
}
```
- `cellFree(gx,gy)` is the **single build gate** — routes, rubble, occupied, all of it. Two gates drift.

## Towers & economy

- **8 roles, mechanics first**: line-pierce + chain-jump (the two counter-paired main types) · slow field (control) · spreading DoT (decay) · seeking projectiles · sustained beam · road-printed area denial · adjacency buff. NEON's skins — railgun / tesla / cryo / virus / drone / laser / mine / amp — rename per theme. Spread the roles across the four damage types; boss phases and threat immunities test exactly that spread.
- Balance roles by **dps per 100 credits** — NEON buffed its seeker the moment it measured worst-in-roster (19.4/100cr with no compensating multiplier). Income beyond bounties: wave-clear bonus `40 + 10×wave`, plus interest on banked credits capped at 30.
- Each tower: base stats + **3 branching paths × 3 tiers**; a tier object is merged over the running stat block as absolute overrides — no additive stacking bugs, and the codex can print truth by reading the same table. A tower commits to **ONE path** (`tw.path`) at its first tier buy — under absolute-override merge, mixed investment would silently last-win every shared key.
- ⚠ Towers store `gx/gy` only — any helper written with `tw.x` fails silently. One coordinate vocabulary per entity.
- `towerStats(tw, skipBuffs)` — the one stat resolver, and tooltip, combat AND codex must all call it; preview flags like `skipBuffs` (price yourself without recursion, show unbuffed truth) are what make the codex-matches-tooltip checklist line satisfiable at all.
- **The adjacency-buff role can't pay for itself as a pure buff** — at small tower counts a percentage multiplier never out-earns another tower. NEON redeems it by making it the cheap detection carrier (§ taxonomy) — reason enough to place one. A build that drops the role moves `detect` to another cheap tier-1 instead.
- Campaign difficulty rides a **tree-expectation curve** (`CAMPAIGN_TECH = [1.00,1.00,1.10,1.28,1.00,1.20,1.38,1.03]`): stage n scales against the meta-progression a player is EXPECTED to arrive with — a full tree ≈ +35% effective power (dmg ×1.22, rate ×1.14), and the curve mirrors it. ⚠ When a rework lets players spend the same points on non-DPS lines, the assumption weakens — bring the peaks *down*, don't trust the old curve.
- 3 paths × 3 tiers scales down cleanly (a slice shipped 2 × 2 with the same absolute-override merge) — cut tiers, never the merge rule.

## Campaign & endless

- **A stage IS its seed**: `{t, seed, mut, waves}` — validated seed + designed mutator + run length. 8 stages, ~18 waves each, stage n unlocks by clearing n−1. Depth of generated mode, zero extra map authoring, every stage reproducible.
- Route generators: `single / converge / split / shifting` — mode and biome are read from seed digits, so the seed browser doubles as a level editor.
- **Generated-map difficulty is a route-geometry formula, not a guess**: `hpScale = clamp(0.5–2, (0.70 + (avgRouteLen−20)·0.015) · shiftPenalty · spawnRelief · genHpMul)` with `spawnRelief = 1 − (spawnCount−1)·0.07` — the relief exists because a bot playtest beat multi-spawn maps 3/10 vs 13/13 single-route. Long routes pay more; extra entrances pay relief.
- Endless: `genWave` spends a budget per wave — `budget = (8 + n × endlessRamp) × WAVE_COUNT_MUL`, **linear**, default ramp 3.2; a boss wave pins the boss group at count 1 and pays for it with `budget × 0.55` on the rest. Count scaling lives HERE, in the budget — boss counts never scale. Archetypes cycle, ladder keeps unlocking.

## Screens & shell

- Front menu = **3 rows** — play / records / settings, worded in the game's own voice (NEON: Begin Operation / Archive / System) — over key art; everything else nests. A menu that lists every subscreen reads as a debug build. Archive fronts whatever records exist — codex when built, a field manual / best-scores screen in a slice; the row count holds either way.
- **Loader**: preload `GAME_ASSETS` behind a progress bar counting `load`/`error` events ⚠ — not `decode()` promises and not `img.complete` (false in the same tick the Image is created, everywhere). Time the gate out (~12s) and `try/catch` the whole thing — never trap the player behind a loader.
- ⚠ `showScreen` toggles a **hardcoded id list** (it comes with the DOM shell the display pipeline mandates) — a new overlay does nothing until its id joins the list. Grep for the list the moment a new screen "never appears".
- **Codex reads live definition tables** (TOWERS/ENEMIES + per-entry lore), so it cannot drift from the game. Animated entries reuse the sprite registry for a click-to-zoom preview.
- Unlocks and dev toggles live in **Settings**, not the menu.

## Presentation baseline (default on, swap — never start bare)

Owner policy: builders customise **from a beautiful baseline, not from a blank page** — blank pages are how ugly ships. Adopt this shell, then re-theme palette / typeface / key art per game; every piece is replaceable, none is skippable-to-nothing:

- Menu: full-bleed key art, dimmed toward the row strip; wordmark with a subtle glow + one-line sub-title; 3 rows left-aligned with per-row accent colours.
- Loader: thin progress bar + percentage over a darkened frame of the same key art.
- HUD: two dark side panels (~240px) with accent borders; icons, not labels, for the resource/status readouts.
- Every button: hover state + hover/click sfx. A silent button reads as broken.
- **Register — what "beautiful" means concretely** (NEON's shell as evidence): a radial-gradient stage backdrop; panels in translucent dark glass with 1px accent borders and a soft outer glow — store the accent twice (`--accent` hex + `--accent-rgb` triplet) so borders and rgba glows share one hue; uppercase display type with wide letter-spacing for titles and a compact numeric face (`ui-monospace, Consolas, monospace` + `tabular-nums` — webfonts are CSP-blocked, so name system stacks); scanline + vignette overlay divs ABOVE the world canvas and BELOW the DOM UI, `pointer-events: none`; 120–200ms ease-out hover transitions everywhere.
- The browser-default test cuts deep: it outlaws native `<input>` controls, so budget a hand-built slider and switch (pointer capture). Wire hover/click sfx by **delegation on a marker class** — per-button listeners die on every `innerHTML` rebuild.

## Production sandbox — four build rules

Matrix and evidence: `reference-runtime-surfaces.md`. The harness grants allowances production revokes — and it is drifting toward production, so re-check the matrix rather than memorising it. A passing playtest proves nothing about these:

1. Storage **throws** in production — try/catch every touch; a session must be completable with no persistence at all.
2. Window dialogs return cancel-values silently — in-DOM dialogs only, two-step arm for destructive buttons.
3. Canvas readback (`getImageData`/`toDataURL`) **throws** in production — no feature may depend on it.
4. Audio unlocks on first `pointerdown` — gate boot behind a click; register every sound at init (a late key needs its own `new Audio(GAME_AUDIO[k])`).

## Sprite animation (video-generated sheets — account-gated)

```js
const SPRITE_ANIM = {
  enemy_boss1: { sheet: 'enemy_boss1_anim', frames: 8, fps: 7 },   // video-generated sheet
  enemy_boss2: { proc: true, frames: 8, fps: 9 },                  // procedural build (no sheet)
};
```
- ⚠ `sprite_animation` is FORBIDDEN on accounts with OpenArt off — check before promising sheets. The registry shape still earns its keep there: drive a **procedural frame index** (bob height, part rotation, emitter offsets keyed on `frame`) through the same `SPRITE_ANIM` entry, and every consumer — draw path, preview, pinned-frame verification — works unchanged.
- Horizontal sheets; draw `drawImage(img, f*fw, 0, fw, fh, …)` with ⚠ `fw = img.naturalWidth / frames` — aspect maths on sheet width squashes the sprite by the frame count. Fall back to the still when the sheet is missing.
- DOM preview: CSS `steps(frames)` animating `background-position-x` across the **full sheet width in px** ⚠ — percentage positions map across (image − element) and land between frames.
- **A still screenshot cannot prove animation.** Pin the frame index (or read `getAnimations()[0].currentTime` via an on-screen debug line) and compare two grabs. Put every animated entity in the codex preview — a late-game boss is unreachable in a headless run, and the codex is how the pinned-frame check reaches it without playing.

## GAME_CONFIG knobs (expose all in schema)

`WAVE_COUNT_MUL, TRASH_HP_MUL` (the two compensation levers — in a new build name the second `nonBossHpMul`; NEON's key is historical and it multiplies every non-boss) · `diffMul` per difficulty (`{easy .78, normal 1, hard 1.32}` — the global lever the bot-sim bisects) · `endlessRamp 3.2` (endless budget slope) · `genHpMul 1` (multiplies the generated-map hpScale formula) · hi-ground % / bonus · rubble % · startCredits · `voiceLines` (bool — mutes wave/boss VO lines; omit the knob entirely in a build with no speech, a dead toggle is worse than none). Balance lives in config + the WAVES/CAMPAIGN tables so the owner tunes without code.

## Asset slots

- Tower sprites ×8 + tier-3 per-path variants (`spriteMaxPaths`), enemy sprites per type, boss stills + 8-frame anim sheets where the account allows (§ Sprite animation)
- Terrain: high-ground and rubble tile art (iso diamond, drawn at cell centre), map backgrounds per biome, menu key art
- UI icons (HUD ×7, meta-tree nodes as needed) — generate in batches, wire each immediately: an unreferenced asset is invisible and the platform warns forever
- Audio: ui click/hover, per-tower fire, boss stingers, bgm — all registered at init (see sandbox §4)

## Build checklist (done = every line true)

Projection comment states the cell-centre convention · every wave (campaign AND endless) passes through the shaping pass · every wave from the first ladder rung onward contains a threat unit · a detector is purchasable before the first stealth wave · a forced high-ground tower measurably outranges a flat one · `cellFree` is the only build gate · a reload mid-campaign survives storage throwing · X/quit works with dialogs suppressed · resizing the window letterboxes (no stretch) and HUD text stays crisp at every size · a scripted bot-sim completes a full run and prints its verdict on-screen · boss animates — two pinned-frame grabs differ (sheet or procedural) · codex numbers match a live tower's tooltip · owner has playtested one full NORMAL stage.

## Optional layers (own templates pending)

Live2D companion character · two-character story dialogue · EN/zh-TW i18n · icon talent tree — each proven in `gbe4dbe`; add after the loop above is fun bare.
