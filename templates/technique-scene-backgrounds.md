# technique-scene-backgrounds — depth, layers and focus (UNTESTED)

**Status: not implemented, nothing here has been validated.** It is a design note, to be tried in a dedicated test game rather than retrofitted into an existing one. Proven presentation techniques live in `template-dating-horror-vn.md` (§6 *Environment-first sequences* and *Sprite staging & movement*).

---

## The problem this would solve

Two limits of the standard "one background + character sprites" setup:

1. **A sprite on a flat background reads as pasted on.** The runtime always draws characters above the background, so a character can never stand *behind* a table, a railing or a doorframe — they float in front of the room instead of sitting inside it. Colour-grading the sprite (brightness / saturation applied at draw time) makes it belong tonally, but not spatially.
2. **Sprite-only scenes cannot express movement.** Camera movement currently costs one whole generated image per beat. There is no cheap way to move within a scene you already own.

## Three ideas, cheapest first

### 1. Focus — background blur
Blur the background while a character speaks so attention lands on them; clear it when they are not the subject. Pure code (`ctx.filter = 'blur(Npx)'` on the background draw), no new art, one config knob, instantly reversible.
⚠ Blur expresses ATTENTION, not travel. It cannot replace a camera move — "you are looking at them" is a different statement from "you walked closer". Expect to use both.

### 2. Layered scenes — a foreground plate
Split a room into **background → character → foreground**. The foreground plate (the near edge of a table, a chair back, a doorframe — transparent everywhere else) is drawn AFTER the sprites, so the character stands behind it. This is the single change that would stop sprites reading as stickers.
- Art cost: one extra transparent image per scene, and it can usually be cut from the background you already have rather than generated fresh.
- Extension: individual props as their own layers, so a character can be placed between them.

### 3. Parallax + per-layer depth of field
Once layers exist: on a camera move, shift the foreground further than the background, and blur the far layer more than the near one. This is what would allow an in-scene camera move WITHOUT generating a new full image per beat — the payoff that makes ideas 1 and 2 worth the trouble.

## Runtime reality

The VN runtime exposes one `bg` plus actors, and actors always draw above the background. There is no foreground layer and no z-ordering, so this needs custom code:
- A `drawImage` wrapper can intercept every image draw — that is where per-layer blur and tint belong (this project already uses one for sprite colour grading).
- A foreground plate needs a draw hook that runs AFTER the sprites. An appended `requestAnimationFrame` loop is the candidate: callbacks fire in registration order, and a block appended after the runtime should therefore draw on top. **Unverified — confirm this before building on it.**
- Layer keys can follow a naming convention (`<bg key>_fg`) so no script syntax changes; the layer is picked up automatically whenever that background is shown.

## Minimal validation before investing

One image, one beat, one question: cut a foreground plate out of an existing background (a table edge, a railing), draw it above the sprites, and put a character behind it. If the character does not read as visibly more *inside* the scene, the layering direction is not worth its art cost — stop there.

## Cost summary

| Idea | New art | Code | Risk |
|---|---|---|---|
| Background blur | none | small | low, fully reversible |
| Foreground plate | 1 cutout per scene | medium (needs an after-sprites draw hook) | medium — hook ordering unverified |
| Parallax + per-layer DoF | reuses the layers above | larger | only worth it once layers exist |

---

## Review notes (Claude, 2026-07-31 — technical annotations, still untested)

- **The rAF-ordering assumption is credible but has a hidden dependency.** Same-frame rAF callbacks do fire in registration order, and since each loop re-registers during its own callback, the order is stable after the first frame. The real question is different: **does the runtime even repaint every frame?** Many VN runtimes paint lazily (only on state change). If so, a parallel rAF loop still works for an always-on overlay (it repaints over the last frame), but per-frame ordering vs the runtime stops mattering — and a cheaper, safer hook exists:
- **Microtask trick for the foreground plate** (suggest trying FIRST): in the existing `drawImage` wrapper, whenever a sprite draw is seen, schedule `Promise.resolve().then(drawForegroundPlate)` (guard so it schedules once per paint pass). Microtasks run after the current JS turn — i.e. after the runtime's ENTIRE paint pass — so the plate always lands above all sprites regardless of rAF ordering or lazy painting. No second loop, no ordering assumption.
- **Blur: pre-render, don't per-frame filter.** `ctx.filter='blur(…)'` on every background draw re-computes the blur constantly. Instead, render each background ONCE into an offscreen canvas at load (sharp + blurred copies), then crossfade their alphas — cheaper, and the focus shift becomes animatable (a 300ms ease reads as a lens pull, which sells the effect).
- **Foreground plates need zero generation.** A table edge / railing is a straight CROP of the bottom strip of the background you already own (canvas crop at build time, alpha-fade the top edge). Only generate a plate when the object doesn't exist in the bg — same lesson as the ch1_b hotspot door: the thing must visibly exist first.
- **Validation order stays as written** (plate first) — but run the blur test in the same session since it is nearly free; the two together ("she blurs the room behind her as she leans in") is the demo that will actually convince.
- **Where to test:** a throwaway sandbox game (2 beats, 1 bg, 1 sprite), NOT decision-court and NOT the shipped VNs. If the plate passes the one-image test, promote the recipe into template §6; if it fails, this file records why and we stop at blur.
