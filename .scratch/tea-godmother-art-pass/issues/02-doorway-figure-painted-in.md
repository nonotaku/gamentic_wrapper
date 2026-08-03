# 02 — Doorway beat: paint the silhouette into the CG, retire the sprite

Status: ready-for-human
Owner finding: "the open door art of the 立繪 is so weird when hide"
Shipped: g96d22c v280 (art) + v281 (script)

## Diagnosis

The beat is `ch1`: `bg cg_door` → `show char_gm_far @0.72` → 「你推開門。門後，一道蒙紗的身影已經在等。」

- `cg_door` is an **empty** room seen through a doorway. Its prompt asked for a backlit woman at the back; the generated image has none. Everything the owner sees is the sprite.
- `char_gm_far` is the canon standing sprite shrunk to ~55% of canvas height with transparent padding under her feet — a lit, fully-detailed figure at doll scale.
- **`show` has no vertical offset.** Sprites are bottom-anchored, so she stands on the canvas bottom edge = the foreground floor, while the CG's floor recedes into the room. Padding under her feet only floats her; it cannot put her on a distant floor line. Resizing cannot fix this.
- The line promises 一道蒙紗的**身影** — a silhouette. A brightly lit sprite contradicts the words as well as the perspective.

Hiding the dialogue box exposes the whole frame at once, which is why this beat is where the owner noticed.

## Decision

Paint a small backlit veiled silhouette into `cg_door` at the back of the room, and drop the `show` for this beat.

Room-as-base is workable here because the shot is far and back-turned, so no face has to survive. **It does not follow that identity can be left unsaid** — see the comments below, where assuming exactly that cost four generations.

## Acceptance

- She reads as standing deep in the room, dark against the candlelight, face unreadable.
- Only one figure in the frame, in the upper half so the dialogue box cannot eat her.
- `char_gm_far` no longer shown at this beat. If it ends up referenced nowhere, list it for clean-up.
- Checked with the dialogue box hidden (`H`), since that is how the defect was found.

## Comments

**2026-08-01 — shipped as v280 (art) + v281 (script).** One generation, 15 credits.

`cg_door` re-edited in place with itself as base: one veiled figure added to the right of the candelabra, in front of the red curtain, behind the tea table. She came back as an unbroken dark shape with no face, standing on the room's own floor line and reading as genuinely far away — which is the thing a sprite could not do at any size. The doorway frame, table, teacups, candelabra and darkness are unchanged.

Room-as-base behaved exactly as predicted: with identity deliberately unreadable there was nothing to drift. The style words were restated in full because adding a figure is a large delta — the lesson from the `char_gm_leave` failure, applied ahead of time, and the render held.

`show char_gm_far` removed from `ch1`. Walked: the beat is now `bg cg_door` with no actor. **`char_gm_far` is referenced nowhere in the script** — clean-up candidate, not deleted.

⚠ Judged from the generator's own preview of the image, not from the game rendering it. The composite (CG + dialogue box + hidden-box view) still needs the owner's eye.

**2026-08-01 — rejected, and four more generations.** The owner turned v280 down on three counts: the figure was a flat black shape that did not match the room's brushwork, she was floating (no hem contact, no shadow), and — the one that mattered — she did not look like the same person.

The third was my error, and it came from a bad inference. I had reasoned "a silhouette has no identity to drift, so the base need not carry identity", and then quietly dropped identity from the prompt as well. **Nothing to drift is not the same as identity appearing.** Both prompts said "a tall veiled woman" and named none of her markers, so the generator drew a stranger, correctly. `reference-vn-art.md` already said even faceless shots need the costume specified; I wrote the ticket claiming the opposite.

Attempts:

| | base | result |
|---|---|---|
| v280 | `cg_door` (empty) | flat black, floating, generic |
| `cg_door_a` | v280 (figure present) | **two women** — the edit verb read as *add* |
| `cg_door_b` | clean original | painted and grounded, still generic, room lightened |
| `cg_door_c` | clean original + full identity block | lace veil finally reads, but too large and too near |
| `cg_door_d` | clean original + back fully turned, scale anchored to the candelabra | **shipped** |

The owner supplied the resolution: turned away and standing far, the detail requirement drops — the framing pays for the identity rather than fighting it. Three rules went into `reference-vn-art.md` from this: distance as an identity budget, the edit verb reading as ADD, and anchoring scale to an object rather than a percentage (four attempts ignored "a third of the frame"; "the same height as the candelabra" moved it).

Cost: 5 generations, 105 credits, 7052 → 6947.

`ch1` now points at `cg_door_d`. **Dead assets left behind: `cg_door`, `cg_door_a`, `cg_door_b`, `cg_door_c`** — plus the pre-existing `char_gm_far`, `char_gm_seated`, `cg_back_shelf`, `char_gm_back`, `char_gm_back_a`, `char_gm_toned`. Ten in total, none deleted.

