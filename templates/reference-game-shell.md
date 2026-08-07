# reference-game-shell — the DOM shell every game starts from

Owner policy made concrete: **customise from a beautiful baseline, never start bare** — blank pages are how ugly ships. Distilled from NEON BASTION's shell (`gbe4dbe`), hardened by the WYRMWARD retrofit loop (`g6ead49` v41–v60). Every piece re-themes per game (palette, typeface, key art, wording); none is skippable-to-nothing. Camera and combat VFX are the genre template's business — this file is the chrome around the world.

## Display pipeline — how the game stays sharp

**2D-canvas builds only** — a 3D world renders full-window at native size, the fit pass is deleted, and the UI becomes a full-window layer with viewport-anchored panels (`reference-3d-blockworld.md` § Renderer). The anatomy below (menu, loader, register, HUD split) is renderer-independent and applies everywhere.

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
- **Canvas draws the WORLD; DOM draws the UI.** Transform-scaled DOM text re-rasterises crisply at every window size, while canvas text is a raster that blurs with it — and only DOM reaches the register below. Canvas-drawn buttons read as a 2000s website game. **Art inside a DOM panel is still art**: key art as a CSS background, portraits as `<img>` over `GAME_ASSETS`, an entity that exists only as draw code gets its own small canvas.
- World canvases sit 1:1 inside the stage — attribute size = stage px (NEON layers a static background canvas under the live one) — with `imageSmoothingQuality = 'high'`.
- **Prove the fit with an on-screen readout** (window size, `s`, stage ratio, bar widths, canvas attr vs css) — a fixed-viewport screenshot cannot show a resize; the readout can.
- Retrofitting a canvas-drawn UI: delete its immediate-mode hit state wholesale — one leftover hover/panel guard eats every click the new DOM panels should receive.

## Register — what "beautiful" means concretely

- A radial-gradient stage backdrop; panels in translucent dark glass with 1px accent borders and a soft outer glow — store the accent twice (`--accent` hex + `--accent-rgb` triplet) so borders and rgba glows share one hue.
- Uppercase display type with wide letter-spacing for titles; a compact numeric face (`ui-monospace, Consolas, monospace` + `tabular-nums`) — webfonts are CSP-blocked, name system stacks.
- A full-screen **atmosphere overlay in the game's own idiom** ABOVE the world canvas and BELOW the DOM UI, `pointer-events: none` — NEON's idiom is scanlines + vignette; a sunlit garden used paper grain + warm vignette. The z-order and the click-transparency are the rule; the motif is skin.
- 120–200ms ease-out hover transitions everywhere; hover/click sfx **delegated on a marker class** (per-button listeners die on every `innerHTML` rebuild).
- **The test: a control that could pass for a browser default is not done** — which outlaws native `<input>`; budget a hand-built slider and switch (pointer capture).

## Screen map

```
boot gate → FRONT MENU → ops view (mode/stage select) → play (+pause) → win/lose
                      ↘ records/archive · settings (overlays, return to front)
```

- ⚠ Screen visibility and the hardcoded id list: the list itself is the trap — **derive the screen list from the DOM** (collect every `.screen` id at boot) so a new overlay can never be silently omitted, **and initialise the current-screen pointer from the markup's opening screen** — a `cur` that only `show()` ever writes is null at boot and the first keypress does nothing. Grep for a hardcoded list only when retrofitting an older shell.
- **Every screen is keyboard-reachable**: Enter advances the happy path (boot gate → menu → play), Escape backs out — the headless harness sends keys plus one centre click, so a mouse-only shell can never even pass its own boot gate in a capture run.

## Front menu — two levels, three rows

- **Front level**: full-bleed key art dimmed toward the row strip · an ambient-FX layer on its own canvas (rate exposed as a knob) · an eyebrow tagline · the wordmark (NEON: an `<h1>` glitch treatment via `data-text` layers) with a soft glow · one-line subtitle · **exactly 3 rows** — play / records / settings, worded in the game's own voice, per-row accent colours. A menu that lists every subscreen reads as a debug build.
- **Ops level** (opened by the play row, front never scrolls): mode strip (campaign / generated / endless…) + stage cards. A stage card = art thumb + scrim + index + tag chips + difficulty pips + CLEARED badge; locked = grayscale + lock glyph, hover refuses.
- Unlocks and dev toggles live in **Settings**, not the menu.

## Boot gate / loader

Preload `GAME_ASSETS` behind a thin progress bar + percentage over a darkened frame of the key art, counting `load`/`error` events ⚠ — not `decode()` promises and not `img.complete` (false in the same tick the Image is created, everywhere). Time the gate out (~12s) and `try/catch` the whole thing — never trap the player behind a loader. The first click through the gate doubles as the audio-unlock gesture. **Register `GAME_AUDIO` in the same gate and print an on-screen `audio N/N registered` readout** — audio is the one subsystem a screenshot cannot check, and a completely silent game passes every visual review (one build shipped 21 correct call sites and zero generated sounds; nothing caught it).

## In-game chrome

- **HUD — the functional split is the rule; the layout is skin.** One surface answers *"what do I do next"* (economy readouts, build palette, wave preview); the other answers *"what is this thing"* (a contextual inspector that fills on selection and sits collapsed when nothing is selected). Never two inspectors; never planning tools scattered across both. NEON's instantiation: two dark ~240px side panels, planning LEFT, selection RIGHT, world clear between them (an iso board's empty corners may tuck under the panels). Same split, other licensed layouts: bottom build bar + floating selection popover · single panel + edge strip — choose per genre and input style. Icons, not labels, for readouts everywhere. ⚠ Two blind builds converged on identical twin panels because an earlier version of this bullet described the layout without the split — the shape without its reason cargo-cults. And the leak is usually subtler than twins: a third build parked the wave preview (a planning tool) on top of the inspector — half a violation that the geometry hides. Test per WIDGET, not per panel: each answers exactly one of the two questions, and the wave preview/muster always answers the first.
- **Wave/event banner**: transient, animates in and out — never a persistent counter box.
- **Settings anatomy**: hand-built sliders and switches; each row carries its own note field (⚠ coupling "is a cheat" to row INDEX silently mislabels the next inserted row — a real scar); language row when i18n exists; dev/unlock toggles grouped last.
- **Records/archive**: data-driven from the live definition tables so it cannot drift from the game; animated entries reuse the sprite/rig registry with a click-to-zoom preview — this is also how verification reaches late-game entities without playing to them.
- **Win/lose**: named result title + one-line subtitle in the game's voice, a row of stat tiles, a record callout when beaten, and a big one-tap replay. Pause is an overlay with resume / abandon (two-step arm).
- ⚠ **The click-shield trap**: a `pointer-events:none` UI root with `#ui * { pointer-events: auto }` re-enables every DESCENDANT — including any full-bleed wrapper. One `inset:0` chrome wrapper then silently eats every world click (`ev.target` is never the canvas; drag and wheel die with it while every KEYBOARD path keeps working — that split is the tell; a real build shipped unplayable this way). Wrappers stay `none`; only NAMED controls take `auto` back. Same class, same audit: a debug readout without `pointer-events:none` shadowing the board, and a scrollable flex child missing `min-height: 0` folding its last controls out of reach.

## Input verification — hit-test or it proves nothing

A self-test that dispatches synthetic events **at the element it expects** makes `ev.target` correct by construction — it reports green straight over a click shield. Every input test resolves each probe point through `document.elementFromPoint` FIRST and dispatches on whatever is actually on top. Ship two instruments:
- **Control audit** (one key): hit-test every visible control at its own centre, classify reachable / scrolled-away-in-its-own-scroller / **BLOCKED by a foreign layer**, print the blocker's selector.
- **Input readout** (permanent): every pointerdown prints the `elementFromPoint` hit, the canvas rect it was measured against, client→world→cell, and a verdict word (`PLACED / OCCUPIED / NO-CRUMBS / NO-SELECTION / NO-HIT / UI …`) — a silent refusal is a bug in itself; every refusal also speaks on-screen in the game's voice.

## Shell checklist

Resizing letterboxes (no stretch) and HUD text stays crisp at every size · every button has hover state + hover/click sfx and the `audio N/N registered` readout proves the sounds exist · no control could pass for a browser default · the boot gate times out rather than trapping · the screen list is derived from the DOM · settings rows carry per-row notes · planning and selection live on distinct surfaces, and there is exactly one inspector · a HIT-TESTED real-pointer test performs the core action end-to-end and the control audit reports zero blocked, zero folded-away controls.
