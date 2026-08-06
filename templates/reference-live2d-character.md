# reference-live2d-character — a layered 2D character that blinks, breathes and talks

Cross-genre reference, proven as VESPER in NEON BASTION's remix (`gbe4dbe`) and blind-validated as ORISS in WYRMWARD (`g6ead49` v45): a comms-chip figure who blinks, breathes, sways and lip-syncs. The pipeline: `generate_live2d_rig` decomposes ONE character image into ~16–21 transparent parts; a small canvas runtime paints them in z order with offset/scale motion. No SDK, no bones — flat parts, small maths.

*v2 (2026-08-06): ORISS blind build filed 10 frictions — retry prompt given, manifest self-contradiction trap added, the server `live2d` runtime reconciled (and its `#stage` hijack flagged), readback ordering inverted for rigged characters, pinned-pose fallback given its shape, crop derivation rule added.*

⚠ **Two runtimes exist — pick deliberately.** The rig tool's own output says `get_skill("live2d") NOW`, and that server skill injects a ~14KB mesh/warp/physics runtime (`// __GI_LIVE2D_RUNTIME__`, "do NOT write the runtime yourself") — the OPPOSITE of this reference's hand-written flat-part runtime. This reference documents the hand runtime: proven twice, ~150 lines, fully yours. If you take the server runtime instead, know that it defaults its canvas to `document.getElementById('stage')` — in a game whose display pipeline owns `#stage`, following it verbatim hijacks the whole display. Point it at a dedicated canvas or stay hand-rolled.

## Generating the rig

- **Nothing may cross the face.** A boom mic in the prompt returned 14 parts with NO mouth and half an eye stack — blink and lip-sync impossible. Prompt *"nothing crosses her face at all: no microphone arm, no visor, no fringe over the eyes"*; over-ear headphones touching only the ears are fine. A good split has mouth + eyewhite / irides / eyelash / eyebrow per side. **Health-check by diffing the TAG LIST against those named parts, never by count** — a 17-part rig arrived with no mouth and no eyebrows; the count read healthy while the split was broken. The nose staying baked into the face costs nothing.
- **Style trades against layer separation, hard.** Anime prompts split clean but read cute; *"painterly semi-realistic, mature"* comes back older and still splits fine; pushing further (named AAA concept-art styles, skin pores, stated age) returns `degraded` — a better face split but missing topwear/front hair and a body collapsed into an oversized neck. **The mature-anime middle ground is where the tool works.**
- Regenerate when: any face part missing · the `degraded` flag · a clothing/body part absent · any part's box equal to the full canvas (next section). **The retry prompt tightens the face clause concretely** — *bare forehead, all hair behind the ears, mouth explicitly open and unobstructed* — that exact tightening turned a mouthless 17-part reject into a clean 21-part rig on the next roll. Re-run with the SAME `name`: keys overwrite in place, and a superset tag set leaves zero orphans to `delete_asset`.

## Trust the boxes, never the tags

- A full-canvas part tagged "back hair" is the inpainted UNDER-LAYER, not hair. Check every part's w/h against the canvas before grouping; a full-canvas part grouped as hair makes the sway offset drag the whole figure.
- Parts arrive as `[key, x, y, w, h, depth, group]` and positions come straight from the manifest — the runtime never re-lays-out, it only offsets around those anchors.
- **The manifest can contradict ITSELF**: mirrored parts carry near-identical depths (differences of ~0.002 are noise), and one rig sorted an iris BEHIND its own sclera — a hollow white socket on one eye while the other rendered fine. Repair surgically: lift the iris above its own eyewhite only; never reshuffle the global z order, and leave lashes above the front hair.

## The runtime (one canvas per character)

- Paint parts in z order onto the character's own canvas (VESPER: 367×560), `imageSmoothingQuality 'high'`.
- ⚠ Give the character its OWN image cache and hand it the asset map at start. A character block declared above the injected `GAME_ASSETS` that names that global makes the platform's upload guard anchor on the first mention and reject later edits as asset loss — a single-file-regime hazard; in a multi-file game the rule costs only a duplicate fetch, keep it for uniformity or drop it knowingly.
- ⚠ `img.complete` is false in the same tick the Image is created — warm the cache in one call, measure in the next. A first-read "0/N decoded" is the measurement itself constructing the images, not a load failure.

## Motion numbers (VESPER's instantiation, tuned for a **face box ~72px on screen**)

| Motion | Value | Why |
|---|---|---|
| Breath | `sin(t·1.15) · 1.7px` vertical — body ×0.45, head full | the body moves less than the head |
| Head sway | `sin(t·0.63)`; per part `x += sway · (1−depth) · 8` | nearer parts shift further — reads as the head turning |
| Front hair | `sway · 3.2` | rides with the head |
| Back hair | `sin(t·0.63 − 0.55) · 12` | **phase LAG is what reads as hair physics** — same direction as the turn, just late; opposing it looked like nothing moved |
| Blink | every 1.6–4.0s; 0.20s triangle down-and-up; closes to 0.04 | ⚠ scale-aware: at 72px a 0.14s blink didn't register — the smaller the render, the slower and more frequent the blink |
| Eye close | squash the eye part's box onto its anchor LINE — y moves toward it, height scales with it | lids close to a line, not shrink to a point |
| Mouth rest | scale **0.13** | the art was DRAWN open — small is closed |
| Lip-sync | `0.20 + 0.72 · (0.5+0.5·sin(t·19.5)) · (0.62+0.38·sin(t·6.7))` | a fast flap under a slower envelope — never a metronome |
| Talk length | `0.9 + chars · 0.055` seconds when no VO duration exists | flaps roughly as long as the line takes to say |

This file stops at the mouth on purpose — the voice itself (speech generation, registration, duration-driven talk, the templated-line constraint) is `reference-story-dialogue.md` § Voice pipeline.

## The crop pattern — one rig, every portrait, zero drift

Every other portrait of the character is a `<canvas>` that BLITS a head crop of the live rig each frame (VESPER: `drawImage(rigCanvas, 32,26,250,250 → 0,0,250,250)`). **Derive the crop, don't copy it**: centre on the face box, reach just past the mouth, then widen by the largest sway amplitude — back hair swings ±12px and clips at a tight crop edge (ORISS shipped 254 → 274 for exactly this). The portrait IS the rig: it cannot drift in style, and it blinks and lip-syncs for free. Generating a separate bust guarantees drift — that scar shipped as "two different VESPERs on screen at once".

## Placement per genre

- Action/strategy: the comms chip IS the character's home — a standing corner figure competes with the board and was removed on owner review. The chip speaks on wave events, story beats and idle lines.
- VN/story screens: the same rig at full size as the speaking portrait, with the same crop pattern for any inset.

## Verification

- One screenshot cannot prove blink or talk. ⚠ **For a rigged character, canvas readback is dead on arrival**: `generate_live2d_rig` always lands parts as `media/…`, which taint the canvas on every sandboxed surface (`reference-runtime-surfaces.md`) — prove the throw once, then go straight to pinned poses. The **ASCII luminance ramp** readback (a blink = eye rows going blank with one dark lid line; a pixel COUNT can't distinguish "collapsed correctly" from "drew garbage") stays available only for hand-imported data-URI parts.
- **Pinned poses have a shape**: the pin must FREEZE the idle motion (t=0) so a pair differs ONLY in the thing being proved — otherwise breath/sway contaminate the diff — and the grab needs a magnified face panel, because an eye at chip scale is ~8px in a screenshot. Cycle LIVE → EYES OPEN → EYES SHUT → TALK on one dev key.
- Overlap maths: `getBoundingClientRect` on both boxes — computed `right`/`bottom` are relative to the offset parent and report nonsense.

## Asset hygiene

- Every superseded rig is dead base64/media the game still carries. `edit_game` cannot drop assets — `delete_asset` promptly, or the embedded-regime size ceiling (~23MB) blocks all new art at the worst moment.
- Remix BEFORE stripping the character from a parent game — `remix_game` copies exactly what is live at that moment.
