# Game plan — "Get Well Soon" · abyss-healer dating-horror VN

> **STATUS: BUILT & VERIFIED 2026-07-30 — gameId `gcc67a8`** (private).
> Editor https://gamentic.net/edit/gcc67a8 · Play https://gamentic.net/play/gcc67a8
> 51 script labels, EN + zh-TW throughout, **6 endings**, no console errors.
> Two things below were changed by the owner during the build; the amended text is marked **[AMENDED]**.
> An earlier gameId `g80cc23` was abandoned after hitting the platform's 15MB embedded-asset ceiling during concept iteration.


Premise (from the owner): you were on a ship, fell into the ocean, and were saved by a deep-sea abyss entity. She brings you to her house on the sea floor. You are sick. She tenderly nurses you back to health — because **she only eats healthy people**.

Built strictly on `templates/template-dating-horror-vn.md` (v2, the technique pack). This plan instantiates the techniques; scene content stays free for the build session + owner.

## The twist that drives everything
The numeric layer is **HEALTH (recovery), not affection** — the template's "rename per game" rule, inverted for horror:
- She heals you with real tenderness. Every treatment you accept moves you closer to "ready to eat".
- Staying sick keeps you safe from her hunger — but sickness itself can kill you.
- Danger tells at BOTH ends: health low → dying tells (pale vignette, weak text shake); health high → HER hunger tells (she stares a beat too long, the pantry stays locked, knives get quieter).
- Qualitative affection lives in the ROUTE layer (flags), not the number — her attachment is earned through interactions, and it's what can save you at 100 health.

## Flow skeleton (template §1)
- **Main menu**: Start / How to play / ⚙ Language (EN + zh-TW, reuse the proven bilingual pattern).
- **Prologue — technique family: Incident** (shipwreck): 4–6 narration beats, 2–3 CGs — deck at night → storm → falling into black water → sinking as the light dies → something vast rising beneath (SILHOUETTE ONLY — keep her withheld) → wake on the threshold: bone-rafter ceiling, lantern light, salt-and-herb smell. End ON the encounter threshold (a door opening; a shadow with a bowl).
- **Prologue route flag**: what you clutch while sinking (a locket / a knife / nothing) — plants the first route flag before she's ever seen.
- **First encounter = an EVENT**: her entrance done as a key CG / slideshow (independent two-image composes per template §6).

## Status system (template §2)
- **Numeric**: `health`, start LOW (~25 — you're sick), conceptual 0–100. "Eatable" threshold ~80; dying at 0.
- **Interaction verbs per scene (mix 2–3, never dialogue-only)**:
  - Dialogue / care choices → health ± (drink the broth? take the medicine? eat what she cooked?)
  - Environment — "While she's away, you look at…" (the locked pantry · the bone charms · the window into the trench · just rest) → route flags
  - Learning — ask about her scars / the sea / "previous patients" → knowledge flags that unlock later options
  - Give/receive — she offers gifts from wrecks; accept/refuse → mixed
- Iron rule applies: every interaction writes something; visible reaction within two beats.

## Routes & endings (template §3 — default SMALL, per owner: 2–3 routes, ~2 endings each)
Launch scope: **2 routes + 1 hidden = 5 endings.** — **[AMENDED: shipped as 6.** The plan's own "dying at 0" needed a real screen, so a fail ending was added: **"Too Late" / 「來不及」** — she holds you all the way down and then does not eat, because you were never well and she has rules. In-game counters read "1 of 6 endings".**]**
- Route split (mid-game, flags-first): **Deceive** (hide your recovery, play sick) vs **Truth** (let her see you heal; face what she is).
  - Deceive: "The Forever Patient" (she keeps you; soft horror) / "Found Out" (she smells the lie)
  - Truth: "The First Meal Refused" (attachment beats hunger — true end) / "Well Enough to Eat" (healed, unloved, dinner)
- Hidden (cross-route, all knowledge flags): what made her this way — one hidden ending only.
- All endings named + one-line epilogue + "X of N endings" hint.

## Art direction (template §4 + §6 recipes)
- **Her**: abyssal beauty, HUMAN-beautiful first — pale luminous skin, long dark hair that drifts as if underwater, deep-sea touches as ACCENTS only (faint bioluminescent freckles, gill-line shadows at the neck, eyes slightly too dark). **One accent colour: abyssal teal-glow** (this game's counterpart of the Godmother's blood-red), carried into the environment (lantern glow, luminous herbs).
  - **[AMENDED — the owner overrode "accents only".** Final locked design: **大姐姐** (mature but young, composed, faintly teasing) with **八尺大人** oppressive height and an exaggerated **3:7 body-to-leg ratio**; fish traits are WORN, not hinted — teal scales over bare shoulders and arms, large translucent fan fins on both forearms, fin-ears, webbed hands. Costume: dark wrapped-linen chest band + woven kelp rope belt + trailing kelp skirt, barefoot. The accent colour and the human-first face survived unchanged; the "faint-third-eye level" restraint did not. Note for reuse: heavier fish traits do cost some of the "I trust her" read that the horror reversal leans on — the warmth had to be carried by her dialogue instead.**]**
  - **[AMENDED — art pipeline.** The distance state machine is real but is built with krea-edit **two-image** mode (image2 supplies the target framing), because text-only reframing does not work. Shipped with **far + mid** tiers only; the close-up tier was never made.**]**
- Same VERBATIM style keywords + negative suffix as template §6; concept_art ×4 → owner picks → import original as base → krea-edit variants; white-bg before cutout.
- **Distance state machine**: far/mid/close from one original. Expression set includes a **"hungry"** variant (this game's `hollow`) triggered at HIGH health.
- Scenes: sickroom in the bone house (+`bg_wrong`: lanterns out, too many eyes outside the window), optional second bg (pantry / trench window). Budget ≈3–5 new images per scene.
- Audio: bgm_main = slow underwater lullaby (music-box family), bgm_tension = pressure drone; sfx: bubbles, bowl/spoon, distant whale-song, sting.

## Numeric starting points (tunable, not canon)
health start 25 · gentle care +8 · full treatment +12 · refuse 0 to −5 · overexert/incident −15 (telegraphed) · chapter tick −5 if untreated. Chapters: 3 — Fever Days / Mending Days / The Last Supper. Run 12–18 min.

## Build conventions
Platform recipes, bilingual pattern, menu skin, editing rules: ALL in template §6 — follow them verbatim. ESRB T, genre "story". Owner replies in Traditional Chinese (HK); game text EN + zh-TW.
