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

## Addendum — 2026-08-03 (new machine)

- The original MCP token in `~/.claude.json` was a **non-owner account**: public reads worked, every write to `g96d22c` failed with "someone else's private game". Owner supplied a new token; both `gametic_wrapper` project entries now point at `https://mcp.gamentic.net/mcp` (note the `mcp.` subdomain). Verified out-of-band (HTTP handshake + wallet list): 個人 6,171 + team `gamenticOffcial` 1,955 → owner account confirmed. A stale old-token entry remains under the `C:/Users/jason/.local/bin` project key (owner not yet asked to clean it).
- Identity check for any future session: `set_active_wallet` with no args — the owner account shows the `gamenticOffcial` team wallet; no team wallet = wrong account, stop and tell the owner.
- **Owner approved outstanding item (b)**: `via_*` bilingual branches in `end_taken`/`end_bring_home`. Plan (four labels `end_taken_via`/`tw_end_taken_via`/`end_bring_home_via`/`tw_end_bring_home_via` + goto pairs matching the `t_bow` idiom) and all six zh lines were shown to the owner in chat; wording not yet commented on. **Not landed** — blocked on session restart to load the new token. Game still v330; nothing changed server-side.

## Addendum 2 — 2026-08-03 afternoon (menu-ambience arc; supersedes stale lines above)

- The `via_*` bilingual branches ARE live (owner landed v331–336 themselves; all same-day version bumps and credit gaps were confirmed owner activity, not a foreign agent).
- **Menu ambience: shipped v340, then judged insufficient.** Owner verdict on the krea-edit frame-flip (`bg_parlor_f2/f3` flicker + `f4` dip via end-of-file drawImage substitution, `menuAnimFps` slider in 主選單, `window.__menuAnimN` proof counter): **the whole background boils between frames — the requirement is that ONLY light and shadow move; every other pixel stays still.** Independent krea edits can't deliver that (each one micro-redraws the frame). The flip stays live meanwhile; slider → 0 = static. The planned f2-based f4 redo was CANCELLED as moot.
- **Format leads for the redo (owner picked 1 → BUILT as v343, verified: patches ready, probe counter fires, console clean):**
  1. *Masked composite* ✅ **SHIPPED v343**: static `bg_parlor` drawn untouched every frame; three feathered elliptical patches (flames cx .500/cy .310/rx .088/ry .120; steam .392/.520/.048/.135 and .617/.520/.048/.135, normalized) composited from f2/f3/f4; f4 dip tick = flat `rgba(8,6,18,0.14)` overlay (light-only). Same `menuAnimFps` slider. `window.__menuAnimReady` (9 patches built) + `__menuAnimN` are the probe hooks. Room pixels physically cannot move; zero new generation.
  2. *Pure code light*: static bg + animated radial glow / vignette dim in canvas — light literally the only change; fully tunable, zero generation.
  3. *Parked*: true cinemagraph via image2video with a start-frame lock (needs platform OpenArt back ON or another engine; two seedance text2video takes already failed on style, 100 cr each).
- **v341: title sprite removed** (owner order) — `start`'s `show gm` → `hide gm` (also clears any sprite a Play-again return would leave). Verified: `actors: []` at `start`, substitution path still fires (offscreen-draw probe 0→1), `goto('ch1')` alive, console clean.
- `character_sprite` = LOCAL synchronous krea-edit on this deployment; the OpenArt settings switch does NOT affect it (its description text lies). `sprite_animation` IS OpenArt-backed + 256px cap.
- ⚠ The embed does NOT reliably auto-advance past the title — one observed 'ch1' auto-advance was an anomaly; design probes around `VN.goto` (clear `S.choices` first), not around auto-play.
- Wallet 個人 ≈ 4,892 after the three frames (3×15 cr); the two rejected videos cost 200 cr earlier. Versions 337–341 all this session's work.

## Addendum 3 — 2026-08-04 (grill + Near looms; supersedes the Outstanding table above)

- Menu ambience: owner rejected the whole-frame flip (boil), picked the masked composite → **v343 shipped and approved** ("good and cool"); technique written into `templates/reference-vn-art.md` §Living backgrounds via the owner-invoked writing-great-skills pass.
- **ch2-rework spec: ALL questions closed** by a grilling session (record in `.scratch/ch2-rework/spec.md` §Settled 2026-08-04). Headline: the two offers pull her to **Near** — extreme-close-up loom sprites `char_gm_near` / `char_gm_polite_near` wired at the two offer choices (**v360**, verified). `pos 0.66` note is superseded by this; `char_gm_back_b` is a deliberate KEEP (ignore the warning); no per-branch outcome art (offer-CG principle stands).
- ⚠ New hard trap, 5 attempts definitive: **krea-edit cannot detach a held object** (the teacup) — hand and object are fused; accept or avoid at canon time. Pending promotion to the reference file.
- The owner runs a SECOND parallel session on the animated_cg/CG pipeline (v342–352, sandbox remix `gce8ca9`) — its record lives in the shared memory file; division holds: that thread owns animated CG experiments, this thread shipped menu + Near.
- ~~Outstanding item (a) `char_gm_angry` framing~~ **CLOSED without a generation (v375):** the owner chose to retire the open-forehead face rather than reshoot it. All five displeasure beats (`c2_refuse`, `b_worst`, `t_veil`, `ask_monster`, `end_fled`) now `show char_gm_polite`, which also carries the `ch1` first meeting. Verified: no script reference to `char_gm_angry` remains, all 26 art keys load, console clean. `CONTEXT.md` **Mask** rewritten — one face, the words decide the reading. `char_gm_angry` left injected but unused, alongside `char_gm_back_b`; both are deliberate keeps, so the dead-asset warning now names two.
- **The handoff backlog is empty.** Open threads live elsewhere: `.scratch/ch2-rework/spec.md` (mid-game record, all questions closed) and the owner's parallel animated_cg pipeline.
- **Same day, later — the looms were rejected in place and replaced by a CG (v361–v374, 165 cr).** Trade offer now hands the screen to `cg_shadow_offer` (she fills the frame, dark void behind, two candle flames as the only背景, sprite hidden); each trade branch reopens with `bg_parlor_cold`; drink offer reverted to plain `char_gm` with `cg_cup_offer` carrying the beat; both loom sprites and the working file `cg_shadow_sq` deleted from the game. Verified: all three branches restore the room with their own expression, all 27 script-referenced art keys load, console clean. Full record + the generation lessons: `.scratch/ch2-rework/spec.md` §Superseded 2026-08-04. Wallet 個人 2,490 at close.
