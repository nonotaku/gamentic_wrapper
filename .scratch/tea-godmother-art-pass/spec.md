# Tea with the Godmother — art pass 2 (`g96d22c`)

Status: ready-for-agent
Owner findings: 7, recorded 2026-08-01 from a play-test of v278. The owner expects more to follow — this pass is not the full list.

**Nothing in the game has been changed for this pass.** Grilled and documented only.

## What the owner saw

Seven items, verbatim: settings UI bug · the open-door sprite is weird when the box is hidden · she smiles on first meeting when a natural face is wanted · wording and visual do not match · weird greeting sprite · wrong chairs · a last-minute smile turning to a sad face.

Grilling collapsed these into six tickets. Findings 3 and 7 are one decision (the ch1 expression arc); findings 4 and 5 are one action (retire the invite sprite).

## Decisions

1. **The expression arc runs cold to warm.** She meets you behind a courteous mask and the smile arrives only when she invites you to sit. The smile becomes a reward instead of the resting state — the template's rule, previously unapplied in ch1.
2. **The closed-eye polite smile carries both courtesy and displeasure, separated by the third eye.** Mask intact = third eye closed; control slipping = third eye open and staring while the smile holds. Owner's design, and stronger than a second face: the tell is that she *cannot* keep all three eyes shut.
3. **Sprites carry no furniture.** The chair is cut, not restyled.
4. **The doorway figure is painted into the CG, not staged as a sprite.**
5. **The reaching hand is retired.** The invitation is carried by the line and by the smile arriving on that beat.

## What falls out of decision 3

Cutting the chair is the load-bearing change. Every expression sprite after ch1 is already a standing bust derived from the canon; `char_gm_seated_v3` and `char_gm_invite` are the only seated ones, and **their chair is the only thing that made the seated/standing split visible**. Once it is gone, seated and standing sprites are interchangeable, and the whole arc lands with no new character art:

| ch1 beat | sprite | new art |
|---|---|---|
| 「她落座斟茶。對面的位子，是你的。」 | closed-eye polite (today's `char_gm_angry`) | none |
| 「你來了。坐吧，小客人。」 | smile (`char_gm_seated_v3`, chair cut) | chair cut |
| 「面紗底下，無數琥珀色的眼睛…」 | nothing — the smile stays up | none |

Three generations total for the pass: the door silhouette, the third-eye-open cold face, and the chair cut.

## Facts established while grilling

- **Bottom-anchored sprites cannot express depth.** `show` has no vertical offset, so a shrunken "far" sprite still stands on the canvas bottom edge — the foreground floor. No amount of resizing puts her on a CG's distant floor line. Distance has to be painted, not staged.
- **`cg_door` contains no figure.** Its prompt asked for a backlit woman at the back; the generated image is an empty room. The doll in the screenshot is entirely the sprite.
- **Room-as-base is safe exactly once: when identity is deliberately unreadable.** A backlit silhouette has no lace, veil shape or face to drift, so the doorway shot is the one place the normally-forbidden edit is the right tool.
- **Dead assets.** `char_gm_toned` and `cg_back_shelf` are in `GAME_ASSETS` and referenced by no label; every `art_title*` variant is unused because `start` uses `bg_parlor`. Not defects — clean-up candidates, and they cost the owner headroom.
- **The mid-game is visually static** — ch2 is `bg_parlor` end to end, ch3 is `bg_wrong` end to end, and she is pinned at `pos 0.66` from the end of ch1 onward with only the face changing. The template's distance meter is unimplemented after ch1. The owner did not raise this; it is offered, not assumed.

## Naming debt

`char_gm_angry` becomes the *polite* face under decision 2, and the new third-eye-open variant becomes the angry one. The asset name will then be actively misleading. Rename on the next asset-touching pass, or the next person to read the script will mis-stage it.
