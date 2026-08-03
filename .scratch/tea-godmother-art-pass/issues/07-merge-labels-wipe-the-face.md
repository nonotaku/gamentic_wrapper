# 07 — Merge labels wipe the face the player just earned

Status: ready-for-human
Owner finding: "it will turn from smile into this sad face which is weird" — reported for the beat **after drinking**
Shipped: g96d22c v297

## Diagnosis

`c2_join` and `b_join` are merge labels: three branches each reconverge on them. Both opened with an unconditional `show char_gm_neutral`.

The effect, one beat after the strongest reaction in the chapter:

```
c2_deep   >>> char_gm_excited   「噢，我喜歡你。大膽的客人…」
c2_join   >>> char_gm_neutral   「一頁撕下的殘頁…」
```

You drink deep, she tells you she likes you — and the next line she is blank. Same at `b_join`: whatever you gave her, pleased or offended, is erased before the ledger beat. The game reads as having forgotten what you did.

This is the **same defect as owner finding 7** ("last minute smile turn sad face"), which was diagnosed in 03 as a stray `show` in `ch1` and fixed only there. The pattern was never checked for elsewhere. It occurs at exactly the two merge points in the game.

## Decision

Delete the `show` from both merge labels. A merge label needs none: every incoming path already has a sprite on screen, so the expression the branch established simply carries into the shared narration — which is what the feedback rule wants in the first place.

## Verified (TW walk, v297)

| path | before | after |
|---|---|---|
| drink deep | excited → neutral | **excited holds** |
| refuse the tea | angry → neutral | **angry holds** |
| give a bright memory | pleased → neutral | **pleased holds** |
| give nothing | → neutral | prior expression holds |

## Comments

**2026-08-01.** Found only because the owner rejected a fix aimed at the wrong chapter. I had read "turns from smile into a sad face" as a complaint about `ch1` and spent two generations (30 credits) reworking the first-meeting sprite, then swapped `ch1` to `char_gm_neutral` — which made a chapter the owner was happy with worse. Reverted at v295–296; `ch1` is back to the closed-eye mask it had.

The rule went into `template-dating-horror-vn.md` beside the feedback rule: a merge label must not re-show a face.

**Lesson for me, not for the file:** when a symptom recurs after a fix, the first question is whether the same *pattern* exists elsewhere, not whether the fix was good enough. Grepping every merge label for a leading `show` would have found both sites in one pass and cost nothing.
