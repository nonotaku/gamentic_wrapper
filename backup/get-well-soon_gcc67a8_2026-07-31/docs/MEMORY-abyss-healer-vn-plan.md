---
name: abyss-healer-vn-plan
description: "Get Well Soon (gcc67a8) — 2nd VN from template v2: abyss entity heals the shipwrecked player in order to eat them healthy; SHIPPED playable, locked art refs, open items"
metadata:
  node_type: memory
  type: project
  originSessionId: 8308f031-f100-44b6-8d4b-64852d2d1a78
  modified: 2026-07-31T08:46:10.022Z
---

Second test game of the dating-horror VN **template v2**: shipwreck survivor nursed by a deep-sea entity who **only eats healthy people** — numeric layer is HEALTH (start 25, "eatable" ≥70/80), so recovery = countdown; her attachment lives in route flags. Related: [[tea-godmother-vn-template]] (first template game, g96d22c).

**SHIPPED & VERIFIED 2026-07-30 — gameId `gcc67a8`** (editor https://gamentic.net/edit/gcc67a8 · play https://gamentic.net/play/gcc67a8). Still PRIVATE (not published — owner's call).
- Playable end-to-end: menu → prologue (shipwreck) → 3 chapters → route split → **6 endings**, full EN + zh-TW. 51 script labels, JSON-validated, all goto targets verified, CJK round-trip verified, no console errors.
- ⚠ **Abandoned gameId `g80cc23`** — same title, hit the 15MB asset ceiling during concept iteration. Do not resume it.

**Locked character design (v2, REDESIGNED 2026-07-31 — v1 refs superseded):** 大姐姐 (mature but young, composed, faintly teasing) + **八尺大人** oppressive height, fish traits WORN not hinted. v1 was rejected because the scales stopped at the arms — a bare human midriff and bare human legs made her read as "a human wearing scaled sleeves". **v2 rule: NO bare human skin anywhere** — continuous teal scales from cheekbones → throat → shoulders → arms → midriff → hips → both legs → flat FINNED feet (no human toes). Legs stay human in SHAPE (she must walk, kneel, sit at the bedside) and clearly separate — never a merged tail. Dark wrapped-linen chest band + woven kelp rope belt + long kelp skirt. Palette: deep blue-black / drowned indigo / bone grey + ONE accent = abyssal teal.
- **v2 white-bg masters (krea-edit bases):** mid `asset:aafc9036f71` · far/full-body `asset:a2c5b668895`
- v2 pre-white-bg: mid `asset:a9aa7b998b6` · full-body `asset:a3d1d2e5573` (ratio ≈3.7:6.3; owner accepted short of the 3:7 target rather than lose image quality to more stacking)
- **v2 expressions (white-bg, HUE-MATCHED — these are the live ones):** neutral `asset:a68e5a012e8` · gentle `asset:ab43adf05fe` · worried `asset:a19db1a1cab` · hungry `asset:ae83d2c5339` · far/full-body `asset:aa5c161a823`
- **The face/body colour rule:** her body is **pale light blue-green (seafoam)**. The face must be the SAME hue. Name the target by SAMPLING, not by an absolute colour word — *"the pale light blue-green seafoam tone of her own shoulder scales"*. Absolute words mislead: "cold blue-white" over-corrected the face into blue-grey and the owner flagged it immediately.
- **Near-white faces get eaten by the cutout keyer** → the "broken pixels" the owner saw in gm_worried/gm_hungry. Pushing the face hue toward the body's blue-green moved it away from the white background and fixed the holes as a side effect — same root cause, one fix.
- **"do NOT change X" is too weak for krea-edit.** Hue-correcting hungry with a polite "do not change her expression" silently erased the toothy grin. What works: state a FAILURE CONDITION plus an explicit feature list — *"she MUST keep her mouth open in a wide stretched grin showing two rows of small even teeth, and her eyes MUST stay wide open with the whites visible… If the grin closes or the wide stare softens, the edit has failed."* That preserved it exactly.
- ⚠ **Never write "warmer" in an expression prompt** — krea-edit reads it as colour temperature and repaints the whole face into warm pink human skin while the body stays cold blue-white. That one word caused the "gentle still has human skin" defect. Say "tender"/"softer" plus an explicit lock: *"her face must stay the SAME COLD BLUE-WHITE tone as her body, pale bloodless lips, no pink, no blush, no rosy cheeks, no human skin tone"*.
- ⚠ Fixing tone by RE-DERIVING the expression from neutral reframes and redraws the face (worried came back as a big-eyed close-up). Fix tone as a **colour-only edit of the existing expression sprite** — *"this is a colour correction only, do not change expression / eyes / mouth / framing"* — that keeps everything and shifts only the palette.
- v2 title art `asset:ad6febf9e1f` — **owner rejected putting the character on the title at all** (it spends the mystery). Now a patient's-eye view UP at the whale-bone ribcage ceiling: hanging herbs, one teal lantern, an ambiguous dark form overhead, no figure. Bonus: a ceiling shot is pure texture, so the hard-coded 42% menu band and the title never cover anything important — a standing figure always collides with them. `titleYPct` 0.075.
- Keep v1 **`asset:a18872f302a` (tall2)** — it is the **3:7 proportion reference**; proportion transfer only works by passing it as `refImage`, never by words.
- ~~v1 superseded: mid `ae696209aca` · far `a216c1f0ca7` · D3 `a283ac8764a`~~
- In-game keys: `gm_far` `gm_neutral` `gm_gentle` `gm_worried` **`gm_hungry`** (high-health danger tell — eyes fixed, whites showing, grin one notch too wide; the standout asset)
- Scenes: `bg_sick` `bg_wrong` `bg_deck` `bg_sink` `bg_rise` (silhouette-only entity) `art_title`
- Audio: `bgm_main` (underwater lullaby) `bgm_tension` (pressure drone) + sfx bubble/bowl/whale/sting/click

**Systems as built:** health 25 start, +12 full care / +8 partial / −5 refuse / +4–6 rest, −3 chapter tick; tells at BOTH ends (≥70 hungry sprite + sting, ≤15 dying + bgm_tension). Numeric counters `know` (max 4) and `bond` (max 7) gate endings so every condition stays single (compound `if` still unsupported). Endings: Deceive → The Forever Patient / Found Out · Truth → The First Meal Refused (true) / Well Enough to Eat · cross-route hidden **The Nine Knots** (`know>=4`) · fail state **Too Late** (health≤0).

**ESRB quirk (cost a wasted 15-chunk re-upload):** the rating self-changed T→E10 once `published` became `"pending"`. `commit_game(esrb:"T")` returns `stored:true` with no warning but the value is silently discarded while pending; `set_genre`/`update_game` have no esrb field. The owner fixed it in the website editor in seconds (metadata-only — version stayed 33, HTML untouched). Always re-read with `get_game` after a commit where esrb matters; if it did not stick, hand it to the owner instead of re-uploading.

**Click hotspots SHIPPED (ch1_b only)** — the "while she is gone, you look at…" scene is no longer a menu list: the player clicks the bone charms / the round window / the rope-bound door directly on `bg_sick`, plus a "just close your eyes" pill. `__GWS_HS` holds the rects in canvas fractions; the skin is WRAPPED (not rewritten) so every other scene keeps stock rows and stock hit areas. Verified with synthetic PointerEvents through the embed URL: miss = no flag, each hit = exactly one correct flag, and a normal choice two scenes later still works. `bg_sick` was re-generated to actually contain the roped door (`asset:ae6f9f9d5af`) — a hotspot must sit on something visible. Full recipe fed back via submit_feedback(visual-novel).

⚠ **Cleanup owed:** 13 intermediate working images are still embedded in the game (`ref_legs_a/c`, `concept_d3_scaled/2`, `gm_full_new1-4`, `new_*_white`). They are dead weight heading back toward the 15MB ceiling. There is no delete-asset tool and `allowAssetLoss` does not drop them — the workaround is to `import_asset` a tiny 8px image over each junk key.

**Open items (owner hasn't decided):**
1. `published` is `"pending"` — origin unknown (owner didn't confirm submitting it). Not public yet.
2. `bg_wrong` only got the "lantern out" half; the "too many eyes at the window" didn't render.
3. Third distance tier (close-up) never made — far + mid only.
4. Title wordmark slightly overlaps her chin at `titleYPct` 0.17 (tunable in the editor).
5. `sfx_click` generated but unused (runtime plays its own).
6. She is unnamed ("She"/「她」) — no name reveal written.

**Platform lessons fed back via submit_feedback** (topics tooling / asset-direction / visual-novel) — read those via `get_skill` rather than re-deriving. Headline traps: `allowAssetLoss` does NOT free embedded assets (only a new game does); krea-edit reframes only via a two-image framing reference, caps at 512px, and barely moves on re-edits; `write_data` still JSON-stringifies arrays; any `write_data` invalidates later `edit_game` find strings.
