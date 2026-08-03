# 06 — The third eye opens when she is displeased

Status: ready-for-human
Source: owner, during grilling — not one of the seven play-test findings
Blocked by: 03 (the polite face has to take up its new role before the cold one is cut from it) — cleared
Shipped: g96d22c v289–v292

## The problem it solves

Under 03 the closed-eye polite smile becomes her first-meeting face. It is currently the *displeasure* face, used in five places — `c2_refuse`, `b_worst`, `t_veil`, `ask_monster`, `end_fled` — so one image would be asked to mean both "welcome" and "you have offended me".

## Decision

One face, two states, separated by the forehead eye:

- **Mask intact** — both eyes closed, faint polite smile, third eye closed. Courtesy.
- **Control slipping** — the same closed eyes and the same smile, and the third eye **open, staring straight out**. Displeasure.

The smile never breaks, which is the point: what betrays her is not an expression she chooses but the one she cannot keep shut. This is the reference rule "restraint still needs a signal" paid off at its strongest — an eye that opens while the other two stay closed is the only open eye in the frame.

## Art note

Minimal delta from the existing closed-eye sprite, canon-as-base, changing the forehead only. Restate the style words in full — the earlier lesson is that a small delta holds style and a large one does not, and "open one eye" must not become an excuse to redraw the face.

Prompt shape: change ONLY the marking on her forehead — it opens into a fully formed eye, iris and pupil clear, staring directly at the viewer. Both of her own eyes stay completely closed and the polite closed-mouth smile stays exactly as it is. No brow movement, no mouth change, no reshaping of the closed eyes.

## Acceptance

- Side by side with the polite version, the only difference is the forehead.
- Re-pointed at all five displeasure labels; the polite version keeps `ch1` only.
- Rename both assets in the same pass — `char_gm_angry` will otherwise be the name of the *polite* face (see spec, Naming debt).

## Comments

**2026-08-01 — shipped as v289–v292.** Two generations plus a free import.

**The rename cost nothing.** `import_asset` accepts an `asset:` library ref, so the existing polite image was re-injected under the new key `char_gm_polite` without generating anything. Then the third-eye version *overwrote* `char_gm_angry` — so the five displeasure labels inherited the new face with **no script edits at all**, and only `ch1` had to be repointed. Ordering the two moves this way turned six edits into one. Verified: `char_gm_polite` → `ch1`; `char_gm_angry` → `c2_refuse`, `b_worst`, `t_veil`, `ask_monster`, `end_fled`.

**The first generation failed silently** — it returned a near-identical image with the forehead marking untouched. The marking is small and partly under hair, so "it opens into a fully formed eye" read as a decorative flourish. The retry landed by making the instruction physical: an eye **the same size as one of her own eyes**, with named lids, lashes, a pale amber iris and a black pupil, plus an explicit "not a gem, not a symbol" and an order to sweep the hair clear of it. Scale-by-comparison again — the same lever that fixed the doorway figure. Amber was chosen to answer the line 「無數琥珀色的眼睛」.

⚠ **The framing drifted.** The new sprite is a tighter crop — her head is roughly 18% larger than in `char_gm_polite`, with the veil less spread. Since the engine draws every sprite at one on-screen height, switching to displeasure now reads as a small push-in. It can pass as menace, but it does not match the framing of the other expression sprites (`pleased`, `hollow`, `sad`, `neutral`, `excited`), which all share the canon crop. One reframe generation would settle it; not spent.

Cost: 2 generations. Balance 6932 → 6832.

**2026-08-01 — the polite half was rejected in play, and abandoned.** Shipped as v293–v294.

Seen at sprite size in the game, `char_gm_polite` read as **sad**, not courteous — owner's words, "this sad face". The cause is legible once stated: at that scale the restrained smile is invisible and only the lid shape survives, and lids curving downward over a lowered chin are sadness in any style. Two generations tried to lift the chin and straighten the lids. Both failed the same way — **krea-edit does not turn a head**; it re-composed the frame instead, leaving the angle untouched and the crop drifting off the rest of the set.

Resolved for free instead: `ch1` now shows **`char_gm_neutral`**, which was purpose-built for exactly this ("the face composed and unreadable — she is simply waiting"), has OPEN eyes so it cannot read as downcast, and shares the canon framing with every other expression sprite. Walked in TW: neutral → neutral → smile on the invitation → smile.

The third-eye half of this ticket stands and is untouched — `char_gm_angry` keeps the five displeasure labels. Only the polite half is withdrawn.

`char_gm_polite` is now referenced nowhere. Two rules went into `reference-vn-art.md`: a closed-eye face cannot double as the welcoming one, and krea-edit will not turn a head.

⚠ Still open from this ticket: `char_gm_angry`'s framing runs ~18% tighter than the rest of the set.

