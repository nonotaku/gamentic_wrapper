# technique-character-in-scene — getting the character INTO full scenes

**Status: experiment log.** One lead has now partly resolved; the rest is unvalidated. Proven recipes live in `reference-vn-art.md` — promote a lead there the moment it passes, and delete it from here.

Character details below (veil, silver streak, red accent) are illustrative from `g96d22c` — substitute each game's own identity markers.

---

## The problem

Sprites over one bg can never give a real camera angle, a doorway POV, an over-the-shoulder shot, or true depth with the character IN the frame. Whole-scene regeneration can — but the generator drifts faces. The base rule (`reference-vn-art.md`) is the fixed constraint every lead works within.

## Lead 1 — full-scene character CGs · blocked on ASPECT, not likeness

Evidence: two samples. Do not treat as guidance until reproduced at 16:9.

- **Identity is already solved.** A CG built as **canon-as-base + room-as-refImage** ("place image1's woman into image2's parlor…") came back with her face, veil, ribbon and hair correct — twice. Every earlier failure had used the room as base.
- **Aspect blocked it.** krea-edit inherits the base's dimensions, and the canon sprite is square, so the CG arrived 512×512 and the 16:9 canvas cropped the whole gesture away. Prompt text does not override this; `sizePx` is only a long-edge cap.
- **Next experiment (untested, one generation): a 16:9 canon plate.** krea-edit the canon original onto a wide empty canvas — character to one side, the rest plain — so you own a WIDE image that is still HER. Use that as base with the room as ref: identity and ratio then both come from the base. If it holds, whole-scene CGs unlock for every shot.
- **Fallback repair pass (tested once, inconclusive):** with the SCENE as base and a minimal-delta prompt aimed only at the face, a LARGE face corrected cleanly toward canon while a small distant face did not move. So a repair pass is worth trying when the face occupies real estate, and is not a rescue for wide shots.
- **Constant constraints:** keep her mid-shot or larger — small faces drift most — and keep the subject in the UPPER ~65% of the frame or the dialogue box eats it.

## Lead 2 — faceless shots · RESOLVED, and narrower than hoped

The strategy was "the face is the only unstable part, so choose shots without one". Testing split it in two:

- ❌ **Faceless full-scene CG (room as base) fails.** A back view composed into the room lost the lace, the veil shape and the hair silhouette, and its saturation did not match the sprite set. Removing the face removes FACE drift only — with the face gone, COSTUME becomes the entire identity, and costume drifts just as readily.
- ✅ **Faceless SPRITE (canon as base) works and ships.** "Turn her to face away" as a minimal-delta edit inherited the lace, veil and hair-lining exactly, keyed cleanly, and matched the rest of the set. It is in `g96d22c` ch2, where she makes her offer with her back turned.
- **Bonus:** a back-turned character is staging, not just risk-avoidance — refusing to look at you while making an offer carries more menace than any front-facing line, and a forehead marking becomes the only open eye in frame.

Remaining faceless shot types, still untested: backlit silhouette · hands-or-detail close-up · face hidden behind the veil or a passing object · reflection in mirror, window or tea. All should be attempted canon-as-base first.

## Lead 3 — camera moves WITH the character in shot

Untested. A hard push-in to a close-up of her drinking told as two images; left/right variants of one shot used to visualise a choice. Every proven camera move so far deliberately removed the character (`reference-vn-art.md`), so this is the open half of that grammar.

---

## Test plan

A throwaway sandbox game (a few beats, one bg, one sprite) — never the shipped VNs. Owner judges screenshots. Cheapest first: Lead 1's 16:9 plate is a single generation; Lead 3 needs two images of one existing scene.
