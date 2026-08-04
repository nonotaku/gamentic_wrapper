# ch2 — big change (PARKED, to be grilled)

Status: needs-info
Type: grilling
Raised: 2026-08-01, by the owner, at the end of the art pass (`.scratch/tea-godmother-art-pass/`)

**Nothing is to be built from this file yet.** It exists so the thread is not lost; the design gets settled in a grilling session first.

## What the owner said

> "for the change in drinking I stay not thinking it is a good change it fix the cg"
> "mark it down as ch2 big change and we use grill to firm the things later"

Read literally: the drinking change is **not accepted**, and the owner's instinct points at the CG rather than at the expression. The exact intent is not established — do not guess it in the grill, ask it.

## What changed in ch2 that this is reacting to

`c2_join` opened with an unconditional `show char_gm_neutral`, which erased the face each branch had just set — you drank deep, she said *I like you*, and one beat later she was blank. Ticket 07 of the art pass deleted that `show`, so the branch's expression now persists into the shared narration. Shipped v297, verified across four branches.

That fix is correct as far as it goes — it stops the game contradicting itself. The owner's reservation is about something else, and the likeliest reading is that **holding a sprite is not what this beat actually needs**: the drink is the trade, the single most important action in the game, and it is currently carried by a bust swapping expression against a background that has not changed since chapter one.

## What ch2 looks like today

- One background, `bg_parlor`, from the first line to the last — the same room as the title and as ch1.
- Two sprite beats: `char_gm_back_b` while she makes the offer with her back turned, then a front-facing bust.
- She is pinned at `pos 0.66` for the whole chapter; only the face changes.
- The drink itself — the channel the entire ending ladder hangs off — has **no art of its own**. No cup, no hand, no close-up, no state change in the room.

The art pass spec recorded the same shape as an unraised observation: the mid-game is visually static and the template's distance meter is unimplemented after ch1.

## Questions for the grill

1. Which part of the drinking beat is wrong — the expression holding, the absence of a CG, or the whole staging of the chapter?
2. Should the drink get its own CG (a cup close-up, a hand lifting it, the room changing as it goes down), and does it need one per branch — deep / sip / refuse — or one shared image?
3. Does the room change when the trade is made? Bringing `bg_wrong` forward, or an intermediate state, would let ch2 carry consequence the way ch3 does.
4. Does she leave `pos 0.66` in this chapter at all — approach, distance, or a second position?
5. Is the merge-label fix itself to be kept, reverted, or replaced by something that sets a face deliberately per branch?

## Settled 2026-08-01 (grilling)

**Scope is both transactions, not one chapter.** The owner means the whole middle: the drink (chapter 1, despite its `c2_*` labels) and the trade (chapter 2). See `CONTEXT.md`, *Chapter vs choice*.

**The defect the owner has been reporting all along is one beat.** `ch2` shows `char_gm_neutral` at the moment she turns back from the bookshelf to propose the trade. After a chapter of `char_gm`'s smile, the face goes flat for no reason the story gives — owner: *"the smile disappear and come with a sad face for no reason"*.

Two earlier fixes aimed at the same words missed it: the `ch1` arc rework (03) and the merge-label fix (07). Both were real improvements; neither touched this beat.

**`char_gm_neutral` is not a neutral face — it is a Hurt face.** Inner brows raised, lids heavy and downcast, mouth corners down. Reserve it for beats where something lands on her:

- `ask_monster` — the player calls her a monster (currently the closed-eye displeasure face)
- `ask_past` / `ask_twelve` — asking who she used to be, and about the twelve guests who called her a monster (currently no sprite at all)

**Consequence: the cast has no true Neutral.** Every existing face is a smile, a mask, a hurt, a grief or a hollow. Whatever the trade beat gets must come from that set or be generated.

## Shipped 2026-08-01 — v302–v304

**The reported defect is fixed.** `char_gm_calm` was generated as a true Neutral — level brows, level mouth corners, steady forward gaze, level chin — by specifying the physical opposite of every driver of the sorrowful read, without ever using the word *sad* (naming it teaches it). One generation, 15 credits.

It replaced the Hurt face at all four sites where a Neutral was meant: **`ch2`** (the trade beat, the actual complaint), `ask_en`, `ask_tw`, `end_guest`.

`char_gm_neutral` is now the Hurt face and lands where her past is raised — `ask_past` 「這一次，先僵住的是她。」 and `ask_twelve` 「十二個。是的。他們的杯子還在架上。」 Both beats previously had **no sprite at all** and inherited whatever face preceded them.

**`char_gm_neutral` was then rejected outright and deleted** (v306–v309). Placing it in `ask_past` / `ask_twelve` was a process error on my part: I asked the owner *where the Hurt face belongs* without ever asking *whether the image itself was acceptable*. Their earlier "mark it down for later" was a note to record, not an approval to use.

Removal was done in full: both placements reverted, `t_veil`'s use swapped to `char_gm_calm` (she is apologising there — regaining composure, not being wounded), the asset deleted, and **the dangling default sprite repaired** — `gm` and `gmt` both declared `char_gm_neutral` as their fallback, which the runtime reaches whenever a `show` omits its key. Integrity checked afterwards: no show or bg points at a missing asset, no show lacks a key, no character has a dead default.

**Settled at v310–v318.** The first `char_gm_calm` was rejected too — also a sad face — and the reason was finally named: *a half-lidded character has no free neutral*. Removing her smile from a face whose eyes already rest half-closed produces sorrow, because half-lidded plus a level mouth is how sadness is drawn. Both failures were the same mistake made twice.

Four candidates were generated and **shown before anything was wired**. The owner picked the one that keeps the faintest lift at the mouth corners; brow variants were explored at their suggestion (a lift confined to the inner ends is the sadness signal, both ends together reads open). It went in as `char_gm_calm`, replacing the image behind the existing key so **no script edit was needed** at any of the five sites or the default sprite.

The rejected image returned as `char_gm_hurt` — imported from the library for free — and now lands on `ask_past` 「這一次，先僵住的是她。」 and `ask_twelve` 「十二個。是的。他們的杯子還在架上。」 Both beats previously had no expression change at all. It carries through into her closing question 「當你離開這個房間……你會記得我嗎？」, which reads as intended.

**Process failure worth keeping.** Both rejected sprites were wired into the game before the owner ever saw them; the second time was immediately after being told not to. The rule now is: generate, show, wait for approval, then wire.

## Shipped 2026-08-01 — v319–v329 · the mid-game rework

Grilled to a design, then built. **The room degrades one step per transaction and never recovers** — that single mechanic answers both things the owner asked for: the actions feel irreversible *because* the world will not go back, and the room starts going wrong long before chapter 3.

| beat | what plays |
|---|---|
| 「杯中蒸氣裊裊。某種金色的東西在裡頭盤繞。」 | `cg_cup_offer` — the cup in extreme close-up, a gold thread coiling in the steam |
| drink deep / sip / refuse | unchanged |
| all three converge | **`bg_parlor_cold`** — flames tipped violet, the light gone cold |
| 「她起身走向書架。」 | `cg_back_shelf` — a CG generated long ago and never used |
| 「一個願望，換一段記憶。」 | `cg_shelf_cups` — a row of cups on the shelf, receding into darkness |
| worst / happiest / no bargain | unchanged |
| all three converge | **`bg_parlor_overgrown`** — vines through the shelves, cobwebs, the lace yellowed: decades have passed while you sat there |
| chapter 3 | `bg_wrong`, hard cut |

**Placing the CGs on the OFFER rather than the outcome** is what lets one image serve all three branches — it shows what is on the table, not what you did, so refusing never contradicts the picture. Both offer lines already described a close-up; nobody had drawn them.

`bg_parlor` now appears only before anything has been given: the title, `ch1`, and the return from the cup CG. Verified on two opposite paths (deep+worst, refuse+none) that the room never reverts.

### What the grill changed about the plan

- **A degradation ladder needs a different channel per step, not more of the same.** The first stage 2 attempt only deepened stage 1's cold and the owner could not tell them apart — correctly, since they are seen minutes apart, never side by side.
- **The wall-shadow idea died on the composition.** `bg_wrong`'s signature leaning figure works because that room has pale walls; `bg_parlor` has a dark curtained window behind the table and nothing to cast onto. Two generations were lost before I looked at what the frame actually contains.
- **The owner supplied the answer: time.** She takes memories, so time is her medium — the room simply ages while you sit in it. Better than any apparition, and it needs nothing to jump out.
- **Degradation accumulates.** The first overgrown pass had warm brown vines and read as the room recovering. Stage 2 must carry stage 1's cold as well as its own change.

## Still open — the questions this file was opened for

The face was the reported symptom. Nothing yet addresses the shape of the mid-game itself: one background from the drink to chapter 3, `pos 0.66` throughout, and **no art for either transaction** — the two actions the whole ending ladder hangs on. Questions 1–5 above stand.

## Related

- `.scratch/tea-godmother-art-pass/issues/07-merge-labels-wipe-the-face.md` — the change being questioned
- `templates/template-dating-horror-vn.md` §3 gating patterns — the drink is the Channel

## Settled 2026-08-04 (grilling, second pass) — questions 1–5 CLOSED

Scope agreed: everything except three residues was already answered by v302–329. The residues, grilled one by one:

- **Q4 (does she move):** she does — **the two offers pull her to Near**. "Still point" (she never moves, the room does) was put up as the recommendation and rejected; the owner wants 迫近感. Direction sharpened mid-build to an extreme close-up: face and chest fill the frame, veil spilling past the edges, a shade dangerous — she looms. `Near` is now a CONTEXT.md term.
- **Faces:** one per offer — the smile looms at the drink, the Mask (eyes closed, faint closed forehead mark) looms at the trade.
- **Placement:** each Near lands on the existing show-before-choice (drink: after the cup CG; trade: after `cg_shelf_cups`), `pos` stays 0.66. The branch shows that follow restore normal distance automatically.
- **Q2 residue (per-branch outcome art):** none — the offer-CG principle stands; consequence is already carried by her face and by the room ladder.
- **`char_gm_back_b`:** kept deliberately, unused. Not an open item; ignore the server's dead-asset warning.

## Shipped 2026-08-04 — v353–v360

`char_gm_near` + `char_gm_polite_near` generated (150 cr including detours), wired at the two offer choices (v360), script refs + image loads + console verified through the embed.

## Superseded 2026-08-04 — v361–v374 · the looms became a CG

**The Near looms did not survive contact with the game.** Owner's verdict on seeing them in place: "quite bad effect". Grilled again; the settled shape:

| beat | what plays now |
|---|---|
| drink offer | `cg_cup_offer` carries it; the sprite reverts to plain `char_gm` |
| trade offer | **`cg_shadow_offer`** takes the screen — she fills the frame, pure dark behind, sprite hidden |
| each trade branch | restores `bg_parlor_cold`, then its own expression |

`char_gm_near`, `char_gm_polite_near` and the working file `cg_shadow_sq` were deleted from the game (library copies remain). **The offer-CG principle survived** — the CG shows what is on the table at the moment of asking, so all three branches can share it.

**A CG taking over a choice needs the branches to take the room back.** `b_worst` / `b_happy` / `b_none` each `show` an expression; without an explicit `bg` at their start the sprite would have stood on top of the CG of herself. Each branch now opens with `bg_parlor_cold`, and `b_none` — which had no `show` of its own and used to inherit the offer's sprite — got `char_gm_calm` so it does not open on an empty room.

**What the CG went through (11 takes, 165 credits) — the two rules that cost the most:**

- **The base carries identity, and I broke that rule first.** Takes 1–2 used the scene as base with her as reference; the face came back redrawn (thick white hair section, rounder face) and the owner named it immediately. Flipping to her as base fixed it in one generation.
- **Naming what you want gone keeps it.** "Remove every small glowing eye" left the eyes in place twice; they only went when the contaminated base was abandoned and the prompt described the target state alone, never mentioning them.
- Amber eyes in darkness generate as **cat eyes** — vertical slit pupils survived a positive description, an avoid-list, and her own eye as a two-image shape reference. The owner cut them entirely; a single enormous eye with a round pupil did render correctly, and was then cut too.
- Final direction after three rounds of owner notes: full-frame character, dark void behind, **a hint of background only** (two candle flames), lighting and gouache texture restated in full. Pure black alone read as flat and styleless; the full parlour read as too busy and shrank her.

**Trap (5 failed attempts, solid):** krea-edit cannot detach a HELD object from a character — the white-plate recipe, kept-parts enumeration, bottom-edge description and arms-out-of-frame ALL failed to remove the teacup her hand holds; hand and held object are fused. Both canons hold the cup, so every derivation inherits it. Resolution: the cup was accepted as her iconography (every shipped bust holds one). **Promoted to `reference-vn-art.md` 2026-08-04**, together with the base-carries-identity relapse and the cat-eyes prior.
