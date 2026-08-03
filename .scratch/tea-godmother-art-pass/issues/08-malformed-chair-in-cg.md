# 08 — The chair in `cg_parlor_right` is malformed

Status: ready-for-human
Owner finding: 6, "wrong chairs" — **this is what it always meant**
Shipped: g96d22c v301

## Diagnosis

Owner, after three wrong guesses from me: *"the blue seat is a single chair but have two backs."*

Exactly that. In `cg_parlor_right` the blue chair on the right carries **two oval padded backs above one seat cushion** — an impossible object, produced by the generator when the pan-right edit re-drew that corner of the room. It is the shot that plays under 「桌子對面，一張椅子早就替你拉開了」 / "Across the table, a chair has already been pulled out for you", so the line points straight at it.

Nothing about count, placement, camera or the sprite was ever the issue.

## Decision

Regenerate `cg_parlor_right` changing only the chair: exactly one armchair, one back, one seat, drawn back from the table as if pulled out for a guest. Room, camera and lighting untouched.

Prompt built from three rules learned earlier the same day: state the target count positively (*exactly one armchair and nothing else to sit on*), never name the fault (saying "two backs" would have taught the model to draw them), and restate the style block in full because changing an object is a moderate delta.

## Result

One well-formed armchair, correctly angled and pulled back. Two side effects beyond the approved scope, flagged to the owner:

- It is **larger and more central** than before. Incidentally this lifts it clear of the dialogue box, which covers the frame from 67% down and previously hid nine tenths of it.
- Its **style no longer matches the room**: `bg_parlor` has slim armless oval-back side chairs; this is a tufted armchair with arms. By *canon shot wins*, the room is canon and the chair should defer to it.

## Comments

**2026-08-01.** Three rounds were spent interpreting the sentence "wrong chairs" — first as the chair baked into the seated sprite (four generations, ~60 credits, and the sprite was eventually retired from the script anyway), then as a count/placement mismatch, then as the dialogue box hiding the subject. Each was a plausible reading of the words. None was the defect, which was visible the moment anyone looked at the chair as an object.

The rule went into `reference-vn-art.md`: look at the object before interpreting the complaint. Generators make impossible things, and an owner seeing one has no vocabulary for it beyond "wrong".

Note that ticket 05 was built on the first misreading. Retiring the seated sprite was still a real improvement — mask → smile is now a pure expression change with no framing jump — but it never addressed finding 6.
