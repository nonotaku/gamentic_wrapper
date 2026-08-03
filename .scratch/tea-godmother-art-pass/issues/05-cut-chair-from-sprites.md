# 05 — Cut the chair out of the seated sprites

Status: ready-for-human
Owner finding: "wrong chairs"
Shipped: g96d22c v300 — solved by retiring the sprite, not by cleaning it

## Diagnosis

`char_gm_seated_v3` and `char_gm_invite` both carry a **plain brown wooden chair baked into the sprite**, despite their prompts reading `ABSOLUTELY NO chair`. The room's own chairs in `bg_parlor` are blue upholstered and carved, so the two appear side by side and disagree.

The reference rule already says sprites must be propless, with a chair she actually sits on as the single exception. That exception is what let this through — but a chair only works as an exception when it matches the room, and this one never did.

## Decision

Cut the chair. Do not restyle it to match the room, and do not restyle the room to match it: a sprite chair has to agree with the room's perspective and eye level as well as its colour, and it has to keep agreeing at every `pos` she can stand at. That is a bill that keeps arriving.

## Why this ticket is load-bearing

Every expression sprite after ch1 — `pleased`, `neutral`, `excited`, `sad`, `hollow`, `angry` — is a **standing** bust cut from the canon. The chair in these two is the only reason the seated/standing split is visible at all; the dialogue box hides everything below the chest. Remove it and seated and standing sprites become interchangeable, which is what lets 03 land with no new character art and stops the next new expression from re-opening the same problem.

## Acceptance

- No furniture in either sprite; transparent background preserved (PNG colour type 6).
- Her posture still reads as settled — shoulders low, gown pooling — with nothing under her.
- Both languages walked through ch1 with the box hidden, checking nothing is left floating where the chair used to sit.

## Comments

**2026-08-01 — shipped as v287.** One generation, 15 credits.

Only `char_gm_seated_v3` was touched. `char_gm_invite` is retired by 04, so cutting its chair would have been a generation spent on an asset nobody will ever see — worth checking for whenever two tickets name the same file.

Phrased as the proven cutout recipe (state the target background, rather than ordering a removal): *change the background to pure flat white with absolutely nothing in it… plain white where the wooden chair used to be*. She came back unchanged — face, smile, veil, silver streak, red lining, ribbon, teacup and posture all intact — with the chair back and legs gone.

⚠ **A brown fragment of the chair survives at the very bottom-right**, beside her skirt. The dialogue box covers roughly the bottom third of the canvas, so it is hidden in normal play — but the hide-box toggle added earlier this session exposes it, and that toggle is exactly how the owner found the last defect. One more generation to clear it; not spent yet.

**2026-08-01 — two more generations, mostly a lesson.** v298 tried to clear the fragment by describing it: *the small brown fragment of wooden chair*, followed by *no chair, no chair leg, no furniture*. It came back with a **whole chair back** down the right side — five mentions of the word taught the model the picture contains one. Textbook negation, and the file already warned about it in the abstract.

v299 re-ran from the v287 image with the object never mentioned at all, only the target state (*pure flat white edge to edge, only the woman left*). The chair back is gone; a thin brown sliver survives at the very bottom edge, smaller than the original remnant and below the dialogue box. Stopped there — clearly diminishing returns.

The rule now sits in `reference-vn-art.md` beside the cutout recipe, because it explains why that recipe works. Cost: 2 generations, 6817 → 6787.

**Reopened — owner still sees the chair.** Three generations have not cleared it, so stop re-rolling the same edit. What has not been tried:

- **Crop rather than repaint.** The remnant sits at the very bottom edge; a straight canvas crop of the bottom strip removes it with no generator involved. The sprite is bottom-anchored and the dialogue box covers that band anyway, so the loss is invisible in play.
- **A different base.** Every attempt has descended from the one image that had a chair in it. `char_gm_seated` (the earlier seated variant, currently dead) or a fresh seated pose from canon may simply not have one.
- **Drop the seated pose.** With the chair gone the sprite reads as a bust anyway (see below) — an existing standing bust could take the beat for zero cost.

**2026-08-01 — fixed at v300 by deleting the sprite from the script, for nothing.**

The other two candidates died on inspection, which is why looking first was worth more than another generation:

- *Crop the bottom strip* — wrong. At full resolution the remnant sits in the bottom-RIGHT corner (≈84–89% across, ≈80–100% down) and overlaps the fall of her veil. Any rectangular crop takes veil with it. I had proposed this from the downscaled preview, where it looked like a bottom-edge sliver.
- *Use the older `char_gm_seated`* — worse. It carries a larger chair AND a white table.

`ch1` now shows the canon bust `char_gm` at both beats. It is completely propless, and it is the image `char_gm_polite` was cut from — same pose, same crop, eyes open instead of shut — so **mask → smile is now a pure expression change with no framing jump**, which the seated sprite could never give. `char_gm_seated_v3` is referenced nowhere.

Four generations were spent trying to clean an asset that the script did not need. The cheaper question — *does this beat require a seated sprite at all?* — was available from the first attempt.

