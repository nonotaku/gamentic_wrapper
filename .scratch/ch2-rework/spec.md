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

## Still open — the questions this file was opened for

The face was the reported symptom. Nothing yet addresses the shape of the mid-game itself: one background from the drink to chapter 3, `pos 0.66` throughout, and **no art for either transaction** — the two actions the whole ending ladder hangs on. Questions 1–5 above stand.

## Related

- `.scratch/tea-godmother-art-pass/issues/07-merge-labels-wipe-the-face.md` — the change being questioned
- `templates/template-dating-horror-vn.md` §3 gating patterns — the drink is the Channel
