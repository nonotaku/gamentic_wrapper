# 04 — Retire `char_gm_invite`

Status: ready-for-human
Owner findings: "wording and visual not match" · "weird greeting 立繪"
Shipped: g96d22c v288 (with 03)

## Diagnosis

Two findings, one sprite.

**It fires a beat early.** `ch1` runs `show char_gm_invite` and then says 「茶室裡瀰漫著佛手柑與舊紙頁的氣味。」 — a line about *smell*. Her arm is already extended in invitation while the narration is describing bergamot and old paper. The actual invitation, 「你來了。坐吧，小客人。」, lands on the next beat.

**The hand is malformed.** Verified against the asset itself: the open palm is larger than her head, the forearm vanishes behind the gown so the arm has no anchor, and the fingers splay without articulation. The prompt also asked that her other hand keep the teacup — the cup is gone.

## Decision

Drop the sprite; do not regenerate it.

Hands are the least reliable thing this generator produces and we have the proof in hand. The invitation is already carried twice over — by the line itself, and by the smile that now arrives on exactly that beat under 03. A reaching arm is a third statement of the same thing, bought at the highest art risk in the pass.

## Acceptance

- `char_gm_invite` shown nowhere; the invitation beat is an expression change only.
- Listed for asset clean-up once nothing references it.
- No timing mismatch left in `ch1`: every `show` sits on the line it belongs to.

## Comments

**2026-08-01 — shipped as v288**, in the same batch as 03. No art, no credits.

The `show` was deleted rather than moved: under the new arc the bergamot line keeps the mask, and the smile that lands on 「你來了。坐吧，小客人」 carries the invitation on its own. Walked in both languages — every `show` in `ch1` now sits on the line it belongs to, and `char_gm_invite` is referenced nowhere in the script.

Retiring it also saved a generation in 05: the chair only had to be cut out of `char_gm_seated_v3`.

`char_gm_invite` added to the dead-asset list; not deleted.

