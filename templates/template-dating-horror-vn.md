# template-dating-horror-vn — v3 (genre-flow skill)

**A technique pack, not a script.** Every example below is illustrative — reuse the FLOW, the SYSTEMS and the ART ECONOMY, and invent the content fresh per game. Informed by *How to Date an Entity* (itch.io 4.7★/1,389 — `data/analysis/itch_1i76fbh.md`); proven on `g96d22c` (Tea with the Godmother) and `gcc67a8` (Get Well Soon).

**Two companions carry everything platform-shaped, so this file can stay about the genre:**
- Making the art — identity, prompts, expressions, camera grammar, budget → **`reference-vn-art.md`**
- Making the runtime behave — menu, bilingual, editing, verification, storage → **`reference-gamentic-platform.md`**

Read the matching companion before ordering art or touching code. Unvalidated leads: `technique-character-in-scene.md`, `technique-scene-backgrounds.md`.

*v3 (2026-08-01): re-cut per writing-great-skills — cross-genre production recipes moved into the two shared references, so each file has one job and one source of truth.*

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

## 2. Two-layer status

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

## 3. Routes & endings — default SMALL

- **One mid-game route split → 2–3 routes; ~2 endings each (4–6 total).** Extra endings are a post-launch patch, not launch scope.
- **Route flags decide WHICH route; the numeric layer decides WHICH ending inside it.** Carving all endings from one numeric axis makes the player feel they are farming points; branched routes make them feel their choices shaped the story.
- Every ending: named, one-line epilogue, and an "X of N endings" replay hint.
- Optional hidden ending: ONE cross-route condition, e.g. all three knowledge flags collected.

---

## 4. Art economy — the choice must be SEEN

**Distance is the meter.** The character has three tiers — far (full body) / mid (waist-up) / close (chest-up), all derived from the one canon original. A good choice steps them one tier closer; a bad one steps them back or turns them away. No number displayed, and nothing for the player to guess. Far + mid alone are enough to ship the axis.

⚠ The tiers come from **body framing, not scaling** — the engine draws every sprite at the same on-screen height, so two full-body sprites intended as different distances render identically. How to produce and stage them: `reference-vn-art.md`.

- **One expression set shared across all tiers**; a `show` with a new key swaps it. Default the resting face to NEUTRAL and spend the smile on warm beats — a permanent smile makes real warmth mean nothing.
- **Feedback rule: every meaningful choice produces a visible change within two beats** — distance, expression, bg, prop, or `shake` + `sfx_sting`. The player instantly knows that one counted.
- **Danger tells** carry the hidden meter: below ~30 → hollow expression + `bgm_tension`; above ~65 → pleased.
- Budget ≈ 3–5 new images per scene, everything else reuse.

---

## 5. Numeric defaults

Tune these in the editor; they are starting points, not canon. Numeric layer starts at **50** (range 0–100). Safe choice **±5**; bold choice **±12**; catastrophic **−25**, always telegraphed by tone and paired with `shake` + `sfx_sting` + the "wrong" bg variant. **8–12 beats and 2–3 interactions per chapter; 3 chapters ≈ 12–18 min.**

---

## 6. Audio

`bgm_main` + `bgm_tension` from one instrument family, so the tension cue reads as the same world going wrong. Sfx: click / choice / sting / one prop sound the story keeps touching.

---

## 7. Runtime wishlist

1. **Hotspot interaction** — true click-on-object, currently emulated with choice menus
2. **Persistent endings gallery** — localStorage plus a menu entry
3. **Menu Load/Settings hooks** — expose the runtime's save/load to menu labels

---

## 8. Ship checklist — the build is not done until every box passes

- [ ] Menu is exactly Start / How to play / ⚙ Settings, wordmark drawn, rows clear of the art's focal point, number keys 1–9 pick rows
- [ ] Every interaction writes state, and every flag written is read by something
- [ ] Every numeric change shows a visible reaction within two beats
- [ ] Route flags pick the route; the numeric layer picks the ending; every ending named + epilogue + "X of N" hint
- [ ] Both languages walked end-to-end through the embed URL, every CJK string read back
- [ ] `list_assets` headroom reported to the owner; zero superseded assets left behind
- [ ] A fresh run reaches gameplay through the menu with no script rewriting
- [ ] game-screens pass: title and result screens per the platform skill
