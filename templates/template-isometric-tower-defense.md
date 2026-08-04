# template-isometric-tower-defense — v1

**Proven blueprint** distilled from our own shipped game **NEON BASTION** (`g86bd9a` v373 = pure-TD baseline; `gbe4dbe` = full build with story/tech-tree/i18n layers). Not a reimplementation of someone else's game: every number below was tuned live on this platform and owner-playtested (NORMAL verdict: "not too hard, not too easy"). Treat each ⚠ as a scar — it was paid for.

## When to use
Isometric grid tower defense: build towers on open cells beside multi-route enemy paths, survive authored waves plus an endless mode — Arknights / Kingdom Rush lineage. Session 15–30 min per stage, campaign of seeded stages.

Sibling spec: `gamentic_gameskill_rewritten/strategy_game/TowerDefence.md` is a tiny 4-tower jam game (flat grid, 1 HP heart) — reach for it only when the ask is explicitly minimal/retro.

## Iron numbers (projection + board)

| Thing | Value | Why |
|---|---|---|
| Canvas | 1600×900 | HUD legible at 800px screenshot scale |
| Tile | `TILE_W 78, TILE_H 39` (2:1 diamond), `TW2 39, TH2 19.5` | classic iso; halves precomputed because every projection uses them |
| Grid | **18×14** | board width on screen = `(w+h)*TW2`; two ~240px HUD side panels cap it at 1248px |
| Projection | `W(x,y) = { x: ox+(x-y)*TW2, y: oy+(x+y)*TH2 }` | auto-centre via `ox = CANVAS_W/2 - (minScreenX+maxScreenX)/2` |
| Trash HP ceiling | ~55 hp / 1.4 spd (basic), bounty 4 | anchor enemy; everything scales off it |
| Tower entry cost | 100 | first tower affordable on starting credits, second needs one wave of bounties |

⚠ **Integer grid coords are CELL CENTRES** — a tile spans ±0.5 in grid space. Terrain tiles, height lifts and hit tests drawn corner-to-corner land half a tile off, and the error *looks like* a z-height bug (we "fixed" tower lift first; the real cause was the origin convention). Pick one convention, write it as a comment at the projection function, derive everything from it.

## Enemy taxonomy: trash / threat / boss

Three tiers with different jobs — the wave engine, balance maths and codex all key off this split:

- **Trash** (`drone, swarm, sprinter, brood`): dies in groups, feeds bounty economy. Traits empty.
- **Threat**: one mechanic each that invalidates one player habit — `tank` (soak), `shielded` (immune to energy until popped), `cloak` (invisible outside detection), `regen`, `emp` (disables towers), `warden` (command aura, heals). A wave with a threat unit asks a question; trash-only waves are a metronome.
- **Boss**: multi-phase scripted (phased weak points / alternating immunity + brood spawns / rotating weak points + EMP). One per act climax.

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
```
Five felt rhythms (trickle-scout / flood / slow heavies / spaced convoy / burst) from one enemy list — cheaper than authoring five enemy sets, and the player reads the difference immediately.

**Threat ladder** — when each question type may first appear, plus a floor:

```js
const THREAT_LADDER = [ {from:4,t:'tank'}, {from:5,t:'shielded'}, {from:7,t:'cloak'},
                        {from:9,t:'regen'}, {from:11,t:'emp'}, {from:13,t:'warden'} ];
// floor: any wave ≥4 with zero threat units promotes one trash group to the newest unlocked threat
```
The floor exists because authored tables drift: someone adds a filler wave and the mid-game goes flat.

## Difficulty method (the part worth stealing)

Playtest lesson: **with 8 towers, several are AoE — trash evaporates and only the cloak unit ever threatened.** The fix that worked, in order:

1. **Count, not HP**: `WAVE_COUNT_MUL 1.4` more bodies, not spongier ones. Sponges feel like lag; crowds feel like pressure.
2. **Trash-only HP floor**: `hpMul = hpBase * (isBoss ? 1+(mut.hp-1)*0.5 : mut.hp * TRASH_HP_MUL)` with `TRASH_HP_MUL 1.45` — bosses were already right, so they are *excluded* from the compensation.
3. **Threats earlier** (the ladder above) — pressure comes from questions, not stats.

Anchor every balance claim to a deliberately placed test subject (force a tower onto a high cell, pin a wave to one archetype) — a random playthrough proves nothing about the knob you turned.

## Terrain

- **High ground**: 5% of non-route cells, +25% range and damage for the tower on it. **Rubble**: 9%, blocks building. Both drawn from generated tile art assets, not hand-coded polygons.
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

- **8 roles** (`railgun` pierce-line physical / `tesla` chain / `cryo` slow / `virus` DoT spread / `drone` seek / `laser` sustain / `mine` area denial / `amp` adjacency buff). Physical-vs-energy split matters because `shielded` eats energy.
- Each tower: base stats + **3 branching paths × 3 tiers**; a tier object is merged over the running stat block as absolute overrides — no additive stacking bugs, and the codex can print truth by reading the same table.
- ⚠ Towers store `gx/gy` only — any helper written with `tw.x` fails silently. One coordinate vocabulary per entity.
- `towerStats(tw, skipBuffs)` — the one stat resolver; `skipBuffs` exists so the buff tower can price itself without recursion.
- **AMP is an open problem**: a pure percentage buff must out-earn the tower you could have placed instead; at small tower counts it can't. Ship it as a late-game luxury or redesign — do not pretend it balances.
- Campaign difficulty rides a **tech-expectation curve** (`CAMPAIGN_TECH = [1.00,1.00,1.10,1.28,1.00,1.20,1.38,1.03]`): peaks assume passive tech DPS. ⚠ When a rework lets players spend the same points on non-DPS lines, the assumption weakens — bring the peaks *down*, don't trust the old curve.

## Campaign & endless

- **A stage IS its seed**: `{t, seed, mut, waves}` — validated seed + designed mutator + run length. 8 stages, ~18 waves each, stage n unlocks by clearing n−1. Depth of generated mode, zero extra map authoring, every stage reproducible.
- Route generators: `single / converge / split / shifting` — mode and biome are read from seed digits, so the seed browser doubles as a level editor.
- Endless: `genWave` + ramp knob (`endlessRamp`), archetypes cycle, ladder keeps unlocking.

## Screens & shell

- Front menu = **3 rows** (Begin Operation / Archive / System) over key art; everything else nests. A menu that lists every subscreen reads as a debug build.
- **Loader**: preload `GAME_ASSETS` behind a progress bar counting `load`/`error` events ⚠ — not `decode()` promises and not `img.complete` (false in the same tick the Image is created, everywhere). Time the gate out (~12s) and `try/catch` the whole thing — never trap the player behind a loader.
- ⚠ `showScreen` toggles a **hardcoded id list** — a new overlay does nothing until its id joins the list. Grep for the list the moment a new screen "never appears".
- **Codex reads live definition tables** (TOWERS/ENEMIES + per-entry lore), so it cannot drift from the game. Animated entries reuse the sprite registry for a click-to-zoom preview.
- Cheats/unlocks live in **Settings**, not the menu.

## Production sandbox — four build rules

Matrix and evidence: `reference-runtime-surfaces.md`. The harness is more permissive than production, so a passing playtest proves nothing about these:

1. Storage **throws** in production — try/catch every touch; a session must be completable with no persistence at all.
2. Window dialogs return cancel-values silently — in-DOM dialogs only, two-step arm for destructive buttons.
3. Canvas readback (`getImageData`/`toDataURL`) **throws** in production — no feature may depend on it.
4. Audio unlocks on first `pointerdown` — gate boot behind a click; register every sound at init (a late key needs its own `new Audio(GAME_AUDIO[k])`).

## Sprite animation (video-generated sheets)

```js
const SPRITE_ANIM = { enemy_boss1: { sheet:'enemy_boss1_anim', frames:8, fps:7 }, /* … */ };
```
- Horizontal sheets; draw `drawImage(img, f*fw, 0, fw, fh, …)` with ⚠ `fw = img.naturalWidth / frames` — aspect maths on sheet width squashes the sprite by the frame count. Fall back to the still when the sheet is missing.
- DOM preview: CSS `steps(frames)` animating `background-position-x` across the **full sheet width in px** ⚠ — percentage positions map across (image − element) and land between frames.
- **A still screenshot cannot prove animation.** Pin the frame index (or read `getAnimations()[0].currentTime` via an on-screen debug line) and compare two grabs.

## GAME_CONFIG knobs (expose all in schema)

`WAVE_COUNT_MUL, TRASH_HP_MUL, endlessRamp, genHpMul, hi-ground %/bonus, rubble %, startCredits, voiceLines(bool)` — balance lives in config + the WAVES/CAMPAIGN tables so the owner tunes without code.

## Asset slots

- Tower sprites ×8 + tier-3 per-path variants (`spriteMaxPaths`), enemy sprites per type, boss stills + 8-frame anim sheets (`sprite_animation`)
- Terrain: high-ground and rubble tile art (iso diamond, drawn at cell centre), map backgrounds per biome, menu key art
- UI icons (HUD ×7, tech/skill nodes as needed) — generate in batches, wire each immediately: an unreferenced asset is invisible and the platform warns forever
- Audio: ui click/hover, per-tower fire, boss stingers, bgm — all registered at init (see sandbox §4)

## Build checklist (done = every line true)

Projection comment states the cell-centre convention · every wave (campaign AND endless) passes through the shaping pass · every wave ≥4 contains a threat unit · a forced high-ground tower measurably outranges a flat one · `cellFree` is the only build gate · a reload mid-campaign survives storage throwing · X/quit works with dialogs suppressed · boss animates in two differing pinned-frame grabs · codex numbers match a live tower's tooltip · owner has playtested one full NORMAL stage.

## Optional layers (own templates pending)

Live2D operator · two-character story briefings · EN/zh-TW i18n · icon talent tree — each proven in `gbe4dbe`; add after the loop above is fun bare.
