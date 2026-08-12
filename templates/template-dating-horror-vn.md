# template-dating-horror-vn — v5 (genre-flow skill)

**A technique pack, not a script.** Every example below is illustrative — reuse the FLOW, the SYSTEMS and the ART ECONOMY, and invent the content fresh per game. Informed by *How to Date an Entity* (itch.io 4.7★/1,389 — `data/analysis/itch_1i76fbh.md`); proven on `g96d22c` (Tea with the Godmother) and `gcc67a8` (Get Well Soon).

**Two companions carry everything platform-shaped, so this file can stay about the genre:**
- Making the art — identity, prompts, expressions, camera grammar, budget → **`reference-vn-art.md`**
- Making the runtime behave — menu, bilingual, editing, verification, storage → **`reference-gamentic-platform.md`**

Read the matching companion before ordering art or touching code. Unvalidated leads: `technique-character-in-scene.md`, `technique-scene-backgrounds.md`.

*v3 (2026-08-01): re-cut per writing-great-skills — cross-genre production recipes moved into the two shared references, so each file has one job and one source of truth.*

*v4 (2026-08-06): three rules paid for on `g96d22c` — fallback-gate prose, the player-camera decision, script-described sound — plus two optional reveal patterns.*

*v5 (2026-08-12): §2 Prose added after the same game's script was rewritten end to end on the owner's verdict 「意義不明」; endings gained the naming rule and one visible method per bad ending.*

## When to use
Dating-sim × horror/mystery VN — "survive the encounter with an entity": monster romance, analog-horror narrative. One run 12–20 min, replayed for other routes.

---

## 1. Flow skeleton

```
Main menu → Prologue → First encounter → Interactive scenes ×N (status accumulates)
         → [route split] → Route scenes → Ending → Result screen
```

**Main menu** — `start` = `[bg, bgm, choice]` and nothing else. Dialogue before the menu reads as "the game already started without me".
- **Rows: Start / How to play / ⚙ Settings.** One row per FUNCTION; everything adjustable lives inside the Settings overlay. A language row plus a language setting is the same function twice, and the menu is where that shows most.
- A **wordmark** (game name + one-line subtitle) above the rows, language-aware like the rows — a bare menu bar reads as debug UI.
- Keep the rows off the key art's focal point; the runtime centres them exactly over a portrait's face.
- Build recipe, hit-testing and the number-key binding: `reference-gamentic-platform.md`.

**Prologue** — establish who the player is and why they are here. **The character does not formally appear yet**: a silhouette, a voice, a shadow at most.
- Pick one approach per game: **Arrival** (a letter, moving in, getting lost, an invitation) · **Incident** (something shatters the ordinary and pulls you in) · **Cold-open** (a dream or flash-forward, then cut back).
- 4–6 narration beats plus 2–3 CG or bg transitions; reach the point within a minute; end ON the threshold of the first encounter — a door, an empty chair, a shadow.
- **Plant the first route flag here.** End on a choice of three, each option `goto`ing a tiny label that sets ONE boolean flag, says a single line, and re-merges into a shared "enter" label (knock again / push the door open / step back → `via_knock` / `via_push` / `via_back`). The player declares what kind of guest they are before the character exists on screen.

**First encounter** — the appearance is an EVENT (a CG or a slideshow), never "the scene opens and they're standing there".

---

## 2. Prose — the sentence is the genre

**The failure mode is aphorism.** Short lines, wide gaps, meaning carried by contradiction — *the room is the same. the room is not the same.* · *(tea is patient)* · *(the door was not locked. it never was.)* It reads as style to whoever wrote it and as **意義不明** — *I cannot tell what this sentence means* — to whoever plays it. A whole shipped script was rewritten on that one verdict.

**What VN narration is made of**, and what aphorism drops:

- **你-narration** — second person, doing and noticing, line after line
- **(the inner voice, in parentheses)** — the protagonist's own thought. Aphorism has no room for it, and it is where dread actually lives
- **Sensory build-up** — the beat before the beat: the tea going darker, the shadows falling the wrong way
- **Interaction detail** — the pour, the porcelain, the chair. Two people in a room have to touch things
- **The antagonist knowing she is inside a story** — one line a chapter, and it is what ties the game to its own subtitle

Keep the old ideas and say them plainly: every aphorism above survived its rewrite as a scene. *The shadows fall in a direction the candles do not explain* is the same thought, and the player can see it.

**Budget the meat — spine beats ×3, transitions and branch reactions ×1.5.** One rewrite ran ~100 → ~320 lines and 10 → 18 minutes without adding a single beat.

**Write the owner's stronger language first, and let the gate cover the other.** Judge, revise and lock one language completely, then retranslate. Every `say` is already `if`-gated per language, so players of the other one keep reading the old unbroken text throughout and the rewrite ships in one piece instead of half-translated.

---

## 3. Two-layer status

| Layer | What it is | What feeds it |
|---|---|---|
| **Numeric layer** | one affection / trust / fear value (rename per game) | mainly dialogue choices |
| **Route layer** | qualitative flags — "what kind of person you are to them" | mainly non-dialogue interactions |

**Interaction verbs** — mix 2–3 kinds per scene so a scene is never dialogue alone:
- **Dialogue choice** — pick-one-of-three → feeds the numeric layer
- **Environment interaction** — "where do you look / what do you touch" → plants route flags
- **Learning** — asking questions, examining objects → knowledge flags that unlock later `if`-gated options, so players discover that knowing more opened a choice
- **Give / receive** — offering something, accepting or refusing what they hand you → mixed

**Wiring rule: every interaction writes state** (`add` or `set`). An interaction with no consequence is a fake interaction, and a flag nothing reads is the same failure one step later — grep your own flags before shipping.

---

## 4. Routes & endings — default SMALL

- **One mid-game route split → 2–3 routes; ~2 endings each (4–6 total).** Extra endings are a post-launch patch, not launch scope.
- **Route flags decide WHICH route; the numeric layer decides WHICH ending inside it.** Carving all endings from one numeric axis makes the player feel they are farming points; branched routes make them feel their choices shaped the story.
- Every ending: named, one-line epilogue, and an "X of N endings" replay hint.
- **Name each ending after what she actually does, and check no two names collide.** *Devoured* and *Taken Whole* shipped as endings 1 and 2 and read as the same ending written twice; *Not Worth Swallowing* broke register — a diner idiom inside a gothic fairy tale. Renaming from her own vocabulary — *Received Whole*, *The Guest She Could Not Swallow* — separated them and put her voice on the ending card.
- Optional hidden ending: ONE cross-route condition, e.g. all three knowledge flags collected.
- **Write the priority order as a sentence before coding it** — "offence outranks hunger, hunger outranks interest, interest outranks collection" — then implement it as that ladder. Whichever gate is meant to override the others has to be checked first, or the best-behaved player still hits the wrong ending.
- **A fallback gate collects everyone the gates above it rejected — read its ending's prose against ALL of them.** A shipped `!drank → you bolt for the door` looked airtight until a full-path walk showed 354 of that ending's 646 arrivals were polite sippers, some at favour 72: the middle drink option set no flag, so a taste was indistinguishable from a refusal. Give the middle option its own flag (a sip is a taste, not a meal). Then the deeper check: if no choice in the game performs the action the ending narrates — nobody can actually walk out — either add that choice or re-aim the prose at something every arrival truly did.

**Gating patterns — pick what the story wants, or none.** Route flags on their own are enough to ship a good split. Each pattern below is one way to make an ending feel earned rather than scored; each costs one flag plus some ending copy.

- **Channel** — one early action, dressed as courtesy, opens the pipe the whole transaction must pass through. Drink the tea and she can take a memory from you; refuse it and she has no way to take *part* of you, so she takes all of you. Refusing the channel never reads as refusing the entity — that gap is the trap. The player cannot see it at the time, which is the point: on replay the first chapter becomes the murder weapon. It works when the action is early, physical, and dressed as flavour, and when every ending it gates says the causality out loud.
- **Knowledge gate** — a stolen page, an overheard name: it adds later options no one else can see, and what the player DOES with the knowledge splits the routes. Cheap, because the options are text.
- **Posture** — how the player entered (knocked / walked in / turned back) decides nothing on its own and flavours the epilogue instead. The lightest pattern; use it when a choice should be remembered rather than obeyed.

---

## 5. Art economy — the choice must be SEEN

**Distance is the meter.** The character has three tiers — far (full body) / mid (waist-up) / close (chest-up), all derived from the one canon original. A good choice steps them one tier closer; a bad one steps them back or turns them away. No number displayed, and nothing for the player to guess. Far + mid alone are enough to ship the axis.

⚠ The tiers come from **body framing, not scaling** — the engine draws every sprite at the same on-screen height, so two full-body sprites intended as different distances render identically. How to produce and stage them: `reference-vn-art.md`.

- **One expression set shared across all tiers**; a `show` with a new key swaps it. Default the resting face to NEUTRAL and spend the smile on warm beats — a permanent smile makes real warmth mean nothing.
- **Feedback rule: every meaningful choice produces a visible change within two beats** — distance, expression, bg, prop, or `shake` + `sfx_sting`. The player instantly knows that one counted.
- ⚠ **And the MERGE label must not take it back.** A `show` at the top of a label that branches reconverge on overwrites the face the branch just earned — two beats after she says *I like you*, she is blank, and the game reads as having forgotten what you did. Give merge labels no `show` at all: every incoming path already has a sprite up, so the expression the player provoked is what carries the next line. Both merge points of a shipped game had this, and it was reported as "the smile turns into a sad face".
- **Danger tells** carry the hidden meter: below ~30 → hollow expression + `bgm_tension`; above ~65 → pleased.
- Budget ≈ 3–5 new images per scene, everything else reuse.
- **The player is a camera until you decide otherwise — and the first drawing designs him.** This lineage crops him out on purpose; the prologue's door-push cut the hands off its own shot. If one beat earns an exception (the ending where you leave together), take it knowingly: the moment he has a coat and a haircut, every later shot of him must match. Make that call at art-planning time, not at the eighth ending.

**Endings: let her speak, then CUT to the consequence.** An ending needs no new picture of the character. Play her last line on a sprite you already own, then change the background to the OBJECT or PLACE the ending turns on and `hide` her — a wrist with a red thread wound round it, a cold cup, doors closing on a thinning line of light. Faceless, so nothing can drift; environment-priced; and an object the player already recognises lands harder than one more bust. One image per ending buys the whole set, and the cut itself is the punctuation.

**Give every bad ending its own method, and let the picture carry it.** Seven object CGs — a cup, a thread, a door — left the player unable to tell one death from another, because none of them showed her doing anything. One method each, visible in the frame: she eats you · folds you in, arms wide · tips the cup and pours you back out · hooks the red thread over one finger and it runs off-frame to your wrist · sews a red stitch into her hem. Cheap when one existing full-frame character CG (16:9, her filling the frame, void behind) is the base for all of them — one edit each, with ratio, identity and brushwork inherited.

**Scope a medium break to exactly one ending.** Breaking the game's painting for the one moment the picture itself should fail is a shock; doing it five times makes it the style, and the hand-painted game vanishes at the last minute.

**Reveal patterns — optional, like the gating patterns: take one only if the story stages a true form.**

- **The frame answers the line.** A line that aims the player's eyes — *look at me as I am* — is a promise the art keeps on that line, not later. Something changes as she says it, and what the player chooses next decides how much more they see. A shipped reveal chapter said that line over an unchanged sprite, and the game's one invitation showed nothing.
- **The true form is a state, not an expression.** One slipped-mask image, dropped whenever she is seen through, back whenever the player answers well — emotion stays in the words and the voice while the face carries only how much of the performance is left. A monster face per mood reads as random image swaps; the single image read as a mask slipping.

---

## 6. Numeric defaults

Tune these in the editor; they are starting points, not canon. Numeric layer starts at **50** (range 0–100). Safe choice **±5**; bold choice **±12**; catastrophic **−25**, always telegraphed by tone and paired with `shake` + `sfx_sting` + the "wrong" bg variant. **8–12 beats and 2–3 interactions per chapter; 3 chapters ≈ 12–18 min.**

---

## 7. Audio

`bgm_main` + `bgm_tension` from one instrument family, so the tension cue reads as the same world going wrong. Sfx: click / choice / sting / one prop sound the story keeps touching.

**Place sfx where the writing already describes a sound.** Grep the script for knocks, doors, pours, pages, spoons, hums — a line that names a sound and plays none is a promise broken, and those beats outrank any generic UI click. When the words themselves upgrade a sound — *the sound goes in, and does not come back* — that is a sound design: give the same action a second, altered take instead of reusing the first.

---

## 8. Runtime wishlist

1. **Hotspot interaction** — true click-on-object, currently emulated with choice menus
2. **Persistent endings gallery** — localStorage plus a menu entry
3. **Menu Load/Settings hooks** — expose the runtime's save/load to menu labels

---

## 9. Ship checklist — the build is not done until every box passes

- [ ] Menu is exactly Start / How to play / ⚙ Settings, wordmark drawn, rows clear of the art's focal point, number keys 1–9 pick rows
- [ ] Every interaction writes state, and every flag written is read by something
- [ ] Every numeric change shows a visible reaction within two beats
- [ ] Route flags pick the route; the numeric layer picks the ending; every ending named + epilogue + "X of N" hint
- [ ] Both languages walked end-to-end through the embed URL, every CJK string read back
- [ ] `list_assets` headroom reported to the owner; zero superseded assets left behind
- [ ] A fresh run reaches gameplay through the menu with no script rewriting
- [ ] game-screens pass: title and result screens per the platform skill
