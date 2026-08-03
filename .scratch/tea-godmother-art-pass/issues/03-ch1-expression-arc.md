# 03 — ch1 expression arc: run it cold to warm

Status: ready-for-human
Owner findings: "she is smiling at first want a natural face as first time meeting" · "last minute smile turn sad face which is weird"
Blocked by: 05 (the chair must be cut before the seated and standing sprites can be mixed) — cleared
Shipped: g96d22c v288

## Diagnosis

`ch1` stages, in order: `char_gm_far` (smiling) → `char_gm_seated_v3` (smiling) → `char_gm_invite` (smiling) → `char_gm_neutral`.

**The arc runs backwards.** The warmest face is spent on a stranger who has not yet spoken to you, and by the time she actually invites you in she has gone flat — which is why the neutral at 「面紗底下，無數琥珀色的眼睛靜靜落在你身上。」 reads as *sad*. It is not a sad sprite; it is a warm face withdrawn for no reason the player can see.

Two owner findings, one cause.

## Decision

Cold to warm. She meets you behind a courteous mask; the smile arrives on the invitation and stays.

| beat | sprite |
|---|---|
| 「她落座斟茶。對面的位子，是你的。」 | closed-eye polite smile — today's `char_gm_angry` |
| 「你來了。坐吧，小客人。茶，是有耐心的。」 | smile — `char_gm_seated_v3`, chair cut |
| 「面紗底下，無數琥珀色的眼睛…」 | **no `show` at all** — the smile stays up |

The last row is the whole of finding 7: the "sudden change of face" was a `show` that should never have existed. Deleting it costs nothing and fixes it.

No new character art. The closed-eye sprite is a standing bust and the seated one loses its chair under 05, so the two mix without a seam.

## Acceptance

- First sight of her face is the mask, not the smile.
- The smile appears on the invitation line and is still up when the first choice opens.
- Walked in both languages — the TW twin lines carry the same `show` commands.

## Comments

**2026-08-01 — shipped as v288**, together with 04. No new art.

⚠ **The plan above was wrong on its last row.** It said the closing beat needs no `show` because "the smile stays up" — but between the invitation and that beat, `ch1` does `hide` + `bg cg_parlor_right` for the pan-right shot, which clears the actor. With no `show` she would simply have been absent. The closing beat re-shows the smile instead.

Shipped sequence, identical in EN and TW:

| beat | sprite |
|---|---|
| 你推開門… | — (the silhouette lives in the CG, see 02) |
| 她落座斟茶 | `char_gm_angry` — the mask |
| 茶室裡瀰漫著佛手柑… | mask holds |
| **你來了。坐吧，小客人** | `char_gm_seated_v3` — the smile arrives here |
| 桌子對面，一張椅子… | — (pan right) |
| 面紗底下，無數琥珀色的眼睛… | `char_gm_seated_v3` — smile continues |

Both findings resolved: the first sight of her face is now the courteous mask, and the "sudden sad face" is gone because the smile no longer withdraws.

`char_gm_angry` is currently doing double duty — polite here, displeased in five other labels. 06 separates them by opening the third eye.

