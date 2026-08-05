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
- ⚠ **The rule breaks quietest when the picture is mostly scene.** A CG is a room with a woman in it, so the room feels like the subject and the scene becomes the base by reflex — and her face comes back redrawn every time. Written down, followed for weeks, then broken twice in one afternoon on exactly that reasoning. **Whoever must stay herself is the base, however little of the frame she occupies.**
- **Distance is an identity BUDGET.** The further off and the more turned away she is, the fewer markers have to land — a distant back view is her if the outline is right. So let the markers the beat needs choose the framing: fine ones (a silver streak, a red lining, a collar ribbon) survive only at mid-shot or closer, and at doorway distance nothing but the outline reads. Whatever must read has to be NAMED — veil length and edge, hair length, gown line. Leaving them out does not buy an anonymous figure, it buys a stranger: four generations of "a tall veiled woman" produced four different women, and the fault was the missing description, not drift.

## Prompting krea2 / krea-edit

- **Style block verbatim at prompt start**, every time: `painterly, rough brushwork, visible brush strokes, dry brush, gouache style, matte flat colors, sketchy rough lineart, unblended shading, textured brush edges`. Shortening a prompt costs description, never style — trimming the block once produced smooth photo-real doors inside a gouache game.
- **No negative-prompt field exists** — fold it in as a suffix: `— avoid: photorealistic, photo, elderly, wrinkles, 3D render, polished, clean lineart`.
- **Character design:** beautiful human first, horror as detail (a faint third eye, not full scales). Heavy monster traits eat the "I trust her" read that a horror reversal leans on; if the owner wants them anyway, the warmth has to come from dialogue instead.
- **Prompt traps:** `visual novel character sprite` and glam adjectives → polished anime; `character sheet` → hallucinated photo insets; `mature female` alone → elderly. Directional words in imperative form get PAINTED AS TEXT ("pushed inward" appeared as signage on the doors) — describe geometry instead, and add `no text, no words, no letters`.
- **Reference images beat description.** Owner-pasted target screenshots converged a redesign in 1–2 rounds where blind style words took 5. It restores as well as it designs: a collar and ribbon lost in an earlier edit came back at 70% from careful description and at 100% from feeding the original back as image2 and saying *copy image2's neckline*.
- **Ask for one more, not for five.** "Five eyes scattered across the face" collapses to a normal pair every time — a face has two eyes, and the prior wins. "Keep the pair she has and open three MORE" lands all five. Count from what is already in the picture; the generator adds far more reliably than it re-plans.
- **Name a mark's geometry, not its colour.** "Two flat pale shapes for eyes" produced filled ovals and a banana grin — a cartoon smiley. "A thin crescent LINE, one curved stroke tapering to a point at each end, hollow inside" produced the intended mark. Say line or stroke or opening, give it a thickness, and say what is inside it.
- **Orientation decides what a mark reads as.** The same slit on a black face is a gill when it stands vertical and an eye when it lies horizontal. Fix the axis before arguing about the count.
- **Irregularity has to be specified as unequal sizes, not as "random".** Asking for scattered marks gives tidy rows; asking for *one much longer than the rest, two middling, two tiny nicks, no two level with each other* gives the mess. Randomness the model can draw is a list of concrete differences.
- **Delta size decides whether style survives.** A pose change or a light change holds; adding a whole new element — a second figure — dragged the render into polished anime with a redesigned gown. Restate the style words IN FULL for a big delta, and prompt against the specific way it drifts (`NOT smooth, NOT glossy, NOT polished anime illustration`); "same gouache style" only carries a small one.
- **Picking the base for a fix turns on one question: is the thing you are changing already in the picture?**
  - **A property of the whole image** — light, tone, palette — takes your own flawed output as base and changes only that axis. A daylit night scene came back correct in one generation with the composition untouched; re-running from the original would have rolled the composition too.
  - **A subject already in the frame** takes the clean original instead. "Change ONLY the standing figure", aimed at a picture that already had one, produced a SECOND figure in the foreground — **the edit verb reads as ADD whenever its subject is already present.** Go back to the version without it and fold the correction into the instruction that put it there.
- **krea-edit lightens by default.** "Same palette" does not buy darkness. Spell out the low-key state — *almost the whole frame in deep shadow, lit only by one candle, nothing daylit* — or a midnight scene comes back as an afternoon.
- **krea-edit will not open a hand — but it will redraw an arm.** A held object is fused to the hand that holds it: the white-plate recipe, an enumeration of every part to keep, a description of what the bottom edge should contain, and arms lowered out of frame all failed to take one teacup off one sprite, five generations running. What finally worked was never mentioning the cup at all and rewriting the whole pose — *both arms folded across her chest* — because the arms get redrawn from scratch and whatever they held goes with them. **Remove a prop by giving the hands a new job.**
- ⚠ **A region edit repaints the whole region, features and all.** Changing which skin is black — the ear, then the neck, then the chest — wiped the eyes out of the face every single time, four times running, however explicitly the prompt listed them as unchanged. The generator holds "face" and "skin" as one object, so it repaints the object rather than the part. **Split it in two passes: change the skin, then add the features back as their own edit.** Both passes land; neither survives being asked together. The same fusion runs sideways — restoring pale skin under a lace bodice took the bodice's shoulders off with it, and the fix was to copy the garment back from the original as image2 rather than describe it.
- **Some subjects have a stronger prior than your prompt.** Glowing amber eyes in darkness render as CAT eyes — vertical slit pupils survived a positive description of a round pupil, an avoid-list naming slit pupils, and a two-image reference supplying the character's own eye shape. When three angles fail, the prior is the design: either take what the generator insists on, or cut the element. One enormous eye with a round pupil rendered correctly at the first attempt — **scale beat repetition**, because a big shape is drawn as anatomy where a small one is drawn as a glint.
- **krea-edit will not turn a head.** Ask for a lifted chin or a changed gaze and you get a re-composed frame instead — the pose holds and the crop moves, so the sprite stops matching the rest of the set. Head angle and eye direction are fixed at canon; choose a base that already holds the angle you need.
- **Anchor scale to an object in the frame.** "About a third of the frame tall" was ignored four times running; "the same height as the candelabra" moved it. The model measures against what it can see, not against the canvas.
- **Look at the object before interpreting the complaint.** "The chairs are wrong" cost three rounds of guessing — the sprite's chair? the count? the placement? the camera? — when the chair in the picture was simply malformed: one seat carrying two backs. Generators produce impossible objects, and an owner who sees one has no word for it but *wrong*. When a complaint names a thing, open the art and examine that thing as an object first; only then read the sentence for meaning.
- **Check the base before blaming drift.** Traits that look like drift are often faithfully inherited: a "too red" hairstyle and a raised arm both came straight from the base sprite, not from the edit. `view_asset` the base first — it is free, and it decides whether you are fixing the edit or the canon.
- **Workflow:** `concept_art` ×4 → owner picks → `import_asset` the picked original as canon → krea-edit every variant from it.
- **Local engines only** — `concept_art` / `generate_asset` / `character_sprite`. OpenArt is banned by standing owner rule even though the MCP exposes `openart_asset` / `openart_video`.

## Expressions

Minimal-delta prompts from the canon white-bg original: "keep her EXACT same face shape … change nothing else". Loosely-described big changes make krea-edit redraw and anime-ify the face.

- **Default to a NEUTRAL face.** A gentle smile as the resting sprite reads as "she is interested in you" from the first line, and the warmth then means nothing when she is actually pleased. Ship neutral as the default and spend the smile on warm beats only.
- **Restraint still needs a signal.** An "anger" edit that only drained warmth was indistinguishable from neutral. Change something visible while staying in character — for a habitually half-lidded character, *eyes closing while the polite smile holds* reads colder than any scowl, and a forehead marking that OPENS is the tell she cannot suppress: the only eye in the frame still looking at you.
- **The closed-eye mask carries a first meeting too.** Eyes shut behind a courteous smile is "I am being polite AT you" as readily as it is displeasure — the same image opens a game and closes a door. Separate the two by what the forehead does, not by drawing a second face.
- ⚠ **A half-lidded character has no free neutral.** Take the smile off a face whose eyes already rest half-closed and you get sorrow, not composure — half-lidded plus a level mouth is the standard drawing of sadness. Two generations failed identically before the cause was named. The resting face needs something positive holding it up: leaving *the faintest lift at the mouth corners* was what finally read as calm. Brows are the other lever, and the strongest — a lift confined to the INNER ends is the sadness signal, while both ends rising together reads as open and attentive.
- **Keep the eye shape.** "Wide-eyed" edits enlarge the eyes into generic anime and break the design; ask for the same narrow shape and move the signal elsewhere (pupil size, shadow, gaze direction).
- Ladder that shipped: neutral · gentle smile (interest) · pleased · excited · sad · cold (closed-eye smile) · hollow.

## Cutout

A pale or textured source background makes the keyer eat pale FACES → krea-edit `change the background to pure flat white` first, THEN key. Sheer fabric picks up a green tint from a chroma key, so white is the only safe plate.

Sprites must be **propless** — anything the sprite carries collides with the room's own furniture, and a chair it sits on is no exception: the sprite's chair has to agree with the room's chairs in style, angle and eye level, at every `pos` the character can stand at.

⚠ **Never name what you want gone.** A cleanup prompt that said *the small brown fragment of chair* and then added *no chair, no chair leg, no furniture* came back with a WHOLE chair — five mentions taught the model the picture has one. The white-plate recipe works precisely because it names only the target state. Describe the frame you want — *pure flat white edge to edge, only the woman left in the picture* — and let the unwanted thing go unmentioned.

**When the thing to remove is already in the base, no wording saves you** — a base is evidence, and "remove every small glowing eye" left the eyes where they were twice over. Restart from an input that never contained it and describe the target state alone; the eyes vanished the moment the contaminated base was dropped.

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

## Living backgrounds — cinemagraph, not boil

A menu or idle scene wants motion, but krea-edit repaints the WHOLE frame on every variant — "change ONLY the flames" still micro-shifts the table, the cups, every brushstroke — so flipping full-frame variants reads as **boil**: the whole painting wobbles. The form that shipped is a **cinemagraph**: the canon background drawn static every frame, with motion composited only where light lives.

- **Frames:** derive variant B from canon with an imperative minimal-delta prompt naming just the moving elements (flames lean, steam rises); CHAIN C from B, D from C — chaining keeps the set mutually consistent (environments chain safely), where independent derivations double the drift between frames. Each hop softens the image; by the third generation the blur is visible, so spend late hops on frames that can afford it (a dim "dip" beat reads fine soft).
- **Composite:** hook `drawImage` (the same idiom as colour grading above): while the title label is active and the drawn image is the canon bg, draw the static base first, then paste feathered elliptical patches cut from the current frame — normalized centre/radius ellipses over each moving zone, alpha solid to 55% of the radius then fading to the edge (`destination-in` radial gradient) — so the seam between moving and frozen pixels never shows.
- **Cadence:** an fps config slider (default 2 — storybook low-frame pacing; 0 = static), and an irregular pattern — eight flicker ticks, then one dip — beats a metronome. The dip tick is a flat translucent darkening of the whole frame: a light-only change, no pixel moves.
- **Verification is counters, not pixels** (the canvas is cross-origin-tainted — `reference-gamentic-platform.md`): expose a ready flag once patches are built and increment a counter inside the composite path; an offscreen `drawImage` of the canon URL fires the path deterministically even while a hidden pane freezes rAF.
- ⚠ `animated_cg` (LTX) drifts and cannot loop — play it once as a cutscene; a menu loop is this composite's job.

Shipped and owner-verified on `g96d22c` v343 (three patches: candelabra flames + two steam wisps).

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
