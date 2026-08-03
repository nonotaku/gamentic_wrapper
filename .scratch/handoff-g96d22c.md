# Handoff — `g96d22c` Tea with the Godmother, art + mid-game pass (2026-08-01)

For a fresh session on another machine. Owner replies in **Traditional Chinese (HK)**; keep that.

This is the *live product* workstream. The other handoff in this folder (`handoff-inspection-horror.md`) covers a different, forward-looking agenda (a new genre template) and predates everything below — where the two disagree, this file is newer. Two of its lines are now stale: `CONTEXT.md` **does** exist, and `g96d22c` **is** under active authorised edit.

## Reaching the game

- Editor `https://gamentic.net/edit/g96d22c` · play `https://gamentic.net/play/g96d22c`
- Everything goes through the **game-inspector MCP**. No local pipelines — owner rejected that route (see memory `platform-native-fixes-only`).
- Headless probe: `https://gamentic.net/api/games/g96d22c/embed`, driven with JS. `VN.flags`, `VN.goto()`, `VN.S` are exposed.
- **Version at handoff: 330.** Balance: personal wallet, ~6227 credits.

## What the session did

**Runtime features** — a preload gate ending in a click-to-begin button (fixes autoplay-blocked title music *and* asset pop-in in one move); a hide-dialogue-box toggle on `H`; a Play again button on endings driven off `S.over`.

**Art** — four ending CGs; the doorway figure painted into `cg_door_d`; the invite sprite retired; the seated sprite retired in favour of the canon bust; a third eye that opens on displeasure; a true neutral face; a hurt face.

**Mid-game rework (the big one)** — both transactions now have an offer CG, and **the room degrades one step per transaction and never recovers**:

| beat | image |
|---|---|
| 「杯中蒸氣裊裊。某種金色的東西在裡頭盤繞。」 | `cg_cup_offer` |
| after the drink (`c2_join`) | **`bg_parlor_cold`** — violet flame tips, cold cast |
| 「她起身走向書架。」 | `cg_back_shelf` |
| 「一個願望，換一段記憶。」 | `cg_shelf_cups` |
| after the memory (`b_join`) | **`bg_parlor_overgrown`** — vines, cobwebs, decades passed |
| chapter 3 | `bg_wrong`, hard cut |

`bg_parlor` now appears only before anything has been given (title, `ch1`, the return from the cup CG). **Do not reintroduce it anywhere after the drink** — the whole point is that the room cannot recover.

## Expression vocabulary — do not re-derive

Defined in `CONTEXT.md`. Every sprite is named for what it **reads as on screen**, not for what its prompt asked for; two assets previously lied about this and cost hours.

`char_gm` smile · `char_gm_polite` mask, third eye closed · `char_gm_angry` mask, third eye **open** (displeasure) · `char_gm_calm` neutral, also the cast default · `char_gm_hurt` wounded · `char_gm_sad` grief · `char_gm_hollow` danger tell

## Outstanding

| item | cost |
|---|---|
| `char_gm_angry` framing runs ~18% tighter than the rest of the set | 1 generation |
| Six `via_*` epilogue lines in `end_taken` / `end_bring_home` are English-only; the runtime has no compound `if`, so each ending needs a pair of language-branch labels | free |
| `char_gm_back_b` is the only dead asset left | free |
| She is pinned at `pos 0.66` for the whole mid-game; the owner has not asked for this to change | — |

`.scratch/ch2-rework/spec.md` still holds the unanswered staging questions.

## Traps that cost real time today

- ⚠ **`S.bg === 'x'` proves the script ran, not that anything is on screen.** A beat whose background had been deleted passed every state assertion and rendered pure black. Close the loop by `new Image()`-ing every key any `show`/`bg` references and waiting for `onload`.
- ⚠ **Another agent edits this game.** An unexplained version bump, a 140-credit accounting gap, and the silent deletion of `cg_back_shelf` all landed mid-session. Re-read state before editing; re-check anything previously dead that you have just reactivated.
- ⚠ `VN.goto()` to a label that does not exist **ends the game silently** — `S.over` goes true and every later step bails with no error. It reads exactly like a broken click handler.
- ⚠ The browser pane may be collapsed, which freezes `requestAnimationFrame` and kills screenshots; the canvas is also cross-origin-tainted, so there is **no pixel check available**. State + generator previews are all an agent can verify. Say so plainly rather than implying the game was seen.

Full versions of these live in `templates/reference-gamentic-platform.md` and `reference-vn-art.md`.

## Working agreement the owner enforced (honour it)

1. **Generate → show the owner → wait for approval → only then wire it in.** Broken twice in this session, both times expensive. Asking *where a sprite belongs* is not the same as asking *whether the image is acceptable*.
2. **Look at the object before interpreting the complaint.** "The chairs are wrong" meant a chair with two backs on one seat. Three rounds were spent reading the sentence instead of opening the picture.
3. **`templates/` edits go through `/mattpocock-skills:writing-great-skills`.** Claude cannot self-invoke it — it is user-invoked only. If its content is not in context, say so and ask the owner to run it.
4. **OpenArt is banned.** Local krea2 / krea-edit only.
5. Bill the **personal wallet**; confirm with `set_active_wallet` at session start.

## First move

Ask the owner which outstanding item to take, or whether they are resuming the mid-game staging questions in `ch2-rework/spec.md`. Nothing above is pre-authorised to build.
