# reference-vn-art — producing character art that survives regeneration

Shared reference for any character-driven VN on Gamentic. Pointed at by the genre templates; holds no genre content of its own. Proven on `g96d22c` (Tea with the Godmother) and `gcc67a8` (Get Well Soon). Unvalidated leads live in `technique-character-in-scene.md`.

Two words carry this file. **Canon** is the one approved image everything else must match — the character's original sprite, or the first approved shot of a room. **Drift** is what happens to a character when the generator redraws instead of edits her.

---

## The base rule — the base carries identity

In every krea-edit, **whichever image is the BASE keeps its identity; anything passed as a reference gets redrawn.** Room-as-base with the character as reference produced three different women; canon-as-base with a minimal-delta prompt is pixel-stable.

Everything below is a consequence:

- Every character variant — expression, pose, framing, back view — derives from the ONE canon original.
- krea-edit inherits the base's **dimensions** too. Prompt text cannot override aspect (see *Aspect*).
- Chain-editing is safe for environments (no identity to drift) and poison for characters.
- A back view removes FACE drift but not COSTUME drift: with the room as base the veil, lace and saturation all came back wrong. Even faceless shots take canon as base.

## Prompting krea2 / krea-edit

- **Style block verbatim at prompt start**, every time: `painterly, rough brushwork, visible brush strokes, dry brush, gouache style, matte flat colors, sketchy rough lineart, unblended shading, textured brush edges`. Shortening a prompt costs description, never style — trimming the block once produced smooth photo-real doors inside a gouache game.
- **No negative-prompt field exists** — fold it in as a suffix: `— avoid: photorealistic, photo, elderly, wrinkles, 3D render, polished, clean lineart`.
- **Character design:** beautiful human first, horror as detail (a faint third eye, not full scales). Heavy monster traits eat the "I trust her" read that a horror reversal leans on; if the owner wants them anyway, the warmth has to come from dialogue instead.
- **Prompt traps:** `visual novel character sprite` and glam adjectives → polished anime; `character sheet` → hallucinated photo insets; `mature female` alone → elderly. Directional words in imperative form get PAINTED AS TEXT ("pushed inward" appeared as signage on the doors) — describe geometry instead, and add `no text, no words, no letters`.
- **Reference images beat description.** Owner-pasted target screenshots converged a redesign in 1–2 rounds where blind style words took 5.
- **Workflow:** `concept_art` ×4 → owner picks → `import_asset` the picked original as canon → krea-edit every variant from it.
- **Local engines only** — `concept_art` / `generate_asset` / `character_sprite`. OpenArt is banned by standing owner rule even though the MCP exposes `openart_asset` / `openart_video`.

## Expressions

Minimal-delta prompts from the canon white-bg original: "keep her EXACT same face shape … change nothing else". Loosely-described big changes make krea-edit redraw and anime-ify the face.

- **Default to a NEUTRAL face.** A gentle smile as the resting sprite reads as "she is interested in you" from the first line, and the warmth then means nothing when she is actually pleased. Ship neutral as the default and spend the smile on warm beats only.
- **Restraint still needs a signal.** An "anger" edit that only drained warmth was indistinguishable from neutral. Express in-character anger by changing something visible while staying in character — for a habitually half-lidded character, *eyes closing into a polite smile that no longer reaches them* reads colder than any scowl, and the forehead marking becomes the only open eye in the frame.
- **Keep the eye shape.** "Wide-eyed" edits enlarge the eyes into generic anime and break the design; ask for the same narrow shape and move the signal elsewhere (pupil size, shadow, gaze direction).
- Ladder that shipped: neutral · gentle smile (interest) · pleased · excited · sad · cold (closed-eye smile) · hollow.

## Cutout

A pale or textured source background makes the keyer eat pale FACES → krea-edit `change the background to pure flat white` first, THEN key. Sheer fabric picks up a green tint from a chroma key, so white is the only safe plate.

Sprites must be **propless** — "no table, no chair, no furniture, no background". A chair the character actually sits on is the one exception; anything else collides with the room's own furniture.

## Colour grading — make sprites belong to the room

Canon sprites are painted on white and read brighter and more saturated than a painted room, so they sit ON the scene rather than IN it. Fix this in code, not in art: apply `brightness / saturate / contrast` to ACTOR images only inside the `drawImage` hook, and expose the three values in `GAME_CONFIG` + schema so the owner tunes them live. Values that shipped: `0.88 / 0.85 / 1`.

Regeneration cannot do this job — asking krea to "match the CG's tone" made it paint the whole room back in, because tone and scene are entangled for the model.

## Sprite staging — what the engine can and cannot express

`show` gives ONE knob: `pos` (0 = far left, 1 = far right). No scale, no vertical offset, no tween. Sprites are bottom-anchored and drawn at a fixed on-screen height whatever the source dimensions.

**The four things that read as movement:**
1. **Framing change** (full body ↔ waist-up ↔ chest-up) — the approach/retreat axis, and the only reliable depth cue.
2. **`pos` change** — lateral movement. An rAF loop writing `S.actors[who].pos` each frame turns the snap into a glide. Verified.
3. **Pose change** (standing / seated / gesturing / back-turned) — the beat itself.
4. **Expression swap** — the emotional beat, free of layout risk.

**Engine constraints — diagnose the layout before ordering more images:**
- Per-`show` `scale` through a `drawImage` hook renders the sprite as NOTHING. Deleting the `scale` field brought her back instantly. Tween `pos`; leave scale alone.
- The dialogue box covers the bottom ~33% of the canvas, so legs and stride never show. Sell motion above the waist — a lean, a trailing veil, an arm — and keep art budget off legs entirely.
- A dark sprite on a dark background disappears (a black-gowned figure at `pos 0.5` before a dark curtain read as an empty room; `pos 0.72` over lit bookshelves fixed it). Check the silhouette against the exact spot where you place it.
- `hide` before a substantially different `show`, so the swap reads as a cut rather than a smear.

**Reframing to a new tier:** krea-edit TWO-IMAGE mode — image1 = canon, image2 = a reference showing the target crop, prompt "frame like image2". Text-only reframe prompts do not reliably change the crop. Far + mid alone are enough to ship the approach axis.

## Environment-first sequences — staging ACTION

Rooms, doors, trees and props have no identity to drift, so the generator cannot break them the way it breaks a face. **Environment plus camera shows the PLAYER'S action without ever drawing the player** — a prologue made walking up to a house, pushing its door and stepping through read clearly with no avatar, no hands and no character on screen.

Three modes, one per beat:
1. **Camera only** — place unchanged, camera moves = the player TRAVELLING (wide forest with a distant house → that house's door in close-up).
2. **Environment only** — camera locked, world state changes = the player ACTING (identical framing, doors shut → doors parted with light between them). The strongest mode: a locked camera makes the change unmistakably the result of what you did, so keep the two shots pixel-identical apart from the change.
3. **Both** — save it for the payoff beat.

- **Proven moves:** push-in, tilt-down, pan left/right (mode 1) and the locked-camera state change (mode 2). One scene can chain them — push-in → tilt-down → pan right → pan back, each carrying a beat. Pull-back is untested but the same principle: any move works while consecutive shots stay in the SAME environment.
- **The overlap ANCHOR turns two pictures into one camera move.** Consecutive shots share a recognisable object placed so it travels across the frame in the move's direction — a tilt-down had only the candle-flame tips entering at the BOTTOM edge of shot 1 and the whole candelabra centre-frame in shot 2, so the eye follows the flames down. Without an anchor the same two images read as two different rooms. Write the anchor into the prompt explicitly.
- **Give the move a reason** — it should reveal information. That tilt-down delivered "the ceiling is far higher than the little house outside could hold", a beat narration would otherwise state flatly.
- **`hide` the sprite for the duration of an environment-only move**, then `show` when the camera returns — sprites sit at a fixed screen position and would otherwise stand mid-air in the new framing. Also `hide` before a prologue's first background, or the title sprite is left standing in your forest.
- **Canon shot wins.** When a shot is already approved, rebuild the others to match IT. Check item by item — prop type, handle, panel cutting, palette, contrast, brush texture — so continuity comes back as a checklist rather than "it feels off".

## Aspect

`generate_asset` takes an `aspect` parameter (`16:9`, `21:9`, `2:3`…) and returns exactly that (1280×720 verified). krea-edit has no such parameter and inherits the base's dimensions.

**So open every new scene with `generate_asset` at the aspect you need, then derive later shots from it by chain-editing.** A square base yields a square CG, and the 16:9 canvas cover-crops ~44% of its height away — the failure that cost dozens of generations before the parameter was found.

## Entrance sequence — 3-shot storyboard

The safe default while character-in-scene stays unsolved: sprites over one bg, with the environment doing the camera work.

1. **"You open the door"** — environment-only CG (base = the room bg, add a doorway frame and POV). No character in the CG, so no drift; place the character as a sprite over it, on a LIT part of the frame.
2. **"She sits"** — room bg + a seated propless sprite.
3. **"She invites you"** — room bg + an inviting-gesture sprite, timed under her invitation line.

## Asset budget & hygiene

Per scene: 1 bg (+1 "wrong" variant optional) + the tier set + 1 key CG at the turning point ≈ **3–5 new images**; everything else is reuse. Key CGs are the heavy accent — spend them on major turns only.

Order art against a budget the owner can see: `list_assets` before each scene's order, `delete_asset` every superseded variant the moment it is replaced, and import only the picked original — never concept candidates "to compare later". Storage rules and the embedded-size ceiling live in `reference-gamentic-platform.md`.
