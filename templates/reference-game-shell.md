# reference-game-shell — the DOM shell every game starts from

Owner policy made concrete: **customise from a beautiful baseline, never start bare** — blank pages are how ugly ships. Distilled from NEON BASTION's shell (`gbe4dbe`), hardened by the WYRMWARD retrofit loop (`g6ead49` v41–v60). Every piece re-themes per game (palette, typeface, key art, wording); none is skippable-to-nothing. Camera and combat VFX are the genre template's business — this file is the chrome around the world.

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
- **Canvas draws the WORLD; DOM draws the UI.** Transform-scaled DOM text re-rasterises crisply at every window size, while canvas text is a raster that blurs with it — and only DOM reaches the register below. Canvas-drawn buttons read as a 2000s website game. **Art inside a DOM panel is still art**: key art as a CSS background, portraits as `<img>` over `GAME_ASSETS`, an entity that exists only as draw code gets its own small canvas.
- World canvases sit 1:1 inside the stage — attribute size = stage px (NEON layers a static background canvas under the live one) — with `imageSmoothingQuality = 'high'`.
- **Prove the fit with an on-screen readout** (window size, `s`, stage ratio, bar widths, canvas attr vs css) — a fixed-viewport screenshot cannot show a resize; the readout can.
- Retrofitting a canvas-drawn UI: delete its immediate-mode hit state wholesale — one leftover hover/panel guard eats every click the new DOM panels should receive.

## Register — what "beautiful" means concretely

- A radial-gradient stage backdrop; panels in translucent dark glass with 1px accent borders and a soft outer glow — store the accent twice (`--accent` hex + `--accent-rgb` triplet) so borders and rgba glows share one hue.
- Uppercase display type with wide letter-spacing for titles; a compact numeric face (`ui-monospace, Consolas, monospace` + `tabular-nums`) — webfonts are CSP-blocked, name system stacks.
- Scanline + vignette overlay divs ABOVE the world canvas and BELOW the DOM UI, `pointer-events: none`.
- 120–200ms ease-out hover transitions everywhere; hover/click sfx **delegated on a marker class** (per-button listeners die on every `innerHTML` rebuild).
- **The test: a control that could pass for a browser default is not done** — which outlaws native `<input>`; budget a hand-built slider and switch (pointer capture).

## Screen map

```
boot gate → FRONT MENU → ops view (mode/stage select) → play (+pause) → win/lose
                      ↘ records/archive · settings (overlays, return to front)
```

- ⚠ `showScreen` toggles a **hardcoded id list** — a new overlay does nothing until its id joins the list. Grep for the list the moment a new screen "never appears".

## Front menu — two levels, three rows

- **Front level**: full-bleed key art dimmed toward the row strip · an ambient-FX layer on its own canvas (rate exposed as a knob) · an eyebrow tagline · the wordmark (NEON: an `<h1>` glitch treatment via `data-text` layers) with a soft glow · one-line subtitle · **exactly 3 rows** — play / records / settings, worded in the game's own voice, per-row accent colours. A menu that lists every subscreen reads as a debug build.
- **Ops level** (opened by the play row, front never scrolls): mode strip (campaign / generated / endless…) + stage cards. A stage card = art thumb + scrim + index + tag chips + difficulty pips + CLEARED badge; locked = grayscale + lock glyph, hover refuses.
- Unlocks and dev toggles live in **Settings**, not the menu.

## Boot gate / loader

Preload `GAME_ASSETS` behind a thin progress bar + percentage over a darkened frame of the key art, counting `load`/`error` events ⚠ — not `decode()` promises and not `img.complete` (false in the same tick the Image is created, everywhere). Time the gate out (~12s) and `try/catch` the whole thing — never trap the player behind a loader. The first click through the gate doubles as the audio-unlock gesture.

## In-game chrome

- **HUD**: two dark side panels (~240px) with accent borders; icons, not labels, for resource/status readouts; the world stays clear between them (an iso board's empty corners may tuck under the panels).
- **Wave/event banner**: transient, animates in and out — never a persistent counter box.
- **Settings anatomy**: hand-built sliders and switches; each row carries its own note field (⚠ coupling "is a cheat" to row INDEX silently mislabels the next inserted row — a real scar); language row when i18n exists; dev/unlock toggles grouped last.
- **Records/archive**: data-driven from the live definition tables so it cannot drift from the game; animated entries reuse the sprite/rig registry with a click-to-zoom preview — this is also how verification reaches late-game entities without playing to them.
- **Win/lose**: named result title + one-line subtitle in the game's voice, a row of stat tiles, a record callout when beaten, and a big one-tap replay. Pause is an overlay with resume / abandon (two-step arm).

## Shell checklist

Resizing letterboxes (no stretch) and HUD text stays crisp at every size · every button has hover state + hover/click sfx · no control could pass for a browser default · the boot gate times out rather than trapping · new screens are in the screen list · settings rows carry per-row notes.
