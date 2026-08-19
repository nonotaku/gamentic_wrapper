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

## Addendum 4 — 2026-08-05 · sound pass, round 1 (v376–v380, 20 cr)

Grilled from a full-script audit rather than a backlog: bilingual turned out COMPLETE (102 EN / 102 TW gated, plus mirrored language-specific labels — no English leaks), and the real gap was audio — 2 BGM tracks, 4 cues, 3 SFX across 61 labels.

**Principle the owner picked: sound goes where the WRITING already describes a sound.** Four new SFX, all verified firing at runtime:

| sfx | label | the line it serves |
|---|---|---|
| `sfx_knock` | `prologue` | 「門上沒有名字。你敲了門。沒有任何回應。」 |
| `sfx_knock_dead` | `pro_knock` | 「你再敲一次。聲音進去了，卻沒有回來。」— same knock, tail swallowed, anechoic |
| `sfx_door` | `pro_enter` | 「門沒有鎖。從來都沒有。」(all three prologue branches converge here) |
| `sfx_drink` | `c2_deep` + `c2_sip` | the drink the whole ending ladder hangs on |

Deliberately left silent by the owner: the room-degradation steps, and the ch3 hard cut to `bg_wrong`. **Music is settled as-is** — a score decaying with the room was proposed twice and declined both times ("music is ok for now"); the two existing tracks stay. Do not re-open it unasked.

⚠ **Correction to `reference-gamentic-platform.md`: synthetic pointer events do NOT advance this runtime; synthetic keyboard does.** `pointerdown`/`pointerup`/`click` on window, document and canvas all left `S.pc` unmoved (30 clicks, three targets); `keydown` Enter/Space advanced it 4→10 immediately. The platform file currently recommends the pointer route — it needs the fix next time the owner runs the skill.

## Addendum 5 — 2026-08-05 · the sip bug (v384, free)

**Found by simulating the whole choice tree, not by playing.** A JS walker over `GAME_DATA.script` — follow `goto`, fork at every `choice`, carry the flags, record where `end` fires — enumerated all 5,538 paths in one call. Keep this technique: it is the only way to audit an ending ladder honestly, and it costs nothing. (Its one artefact: `end_taken` / `end_bring_home` look unreachable because they `goto` their `_via` labels before ending — normalise the `_via` suffix before counting.)

**The defect:** `drank` was set only by 一飲而盡, so 淺嘗即止 was indistinguishable from refusing. `r_hungry`'s fallback for `!drank` is `end_fled`, whose prose has the player bolting for the door — **354 of 646 fled endings were polite sippers**, some at favor 72, who had sat through the entire game.

**The fix:** a new `tasted` flag, set by BOTH drinking options; `r_hungry`'s fled exit now keys off `!tasted`. `drank` still gates the fed route in `resolve`, so a sip is a taste and not a meal. Sippers now land on `end_unfed` — she was given a mouthful, not a meal, which is what that ending already says.

Verified twice: the simulator re-run shows fled = 292 paths, **all refusals**, no sippers, no deep-drinkers, and all 8 endings still reachable; and a live runtime probe (`goto c2_sip` → flags → `goto resolve`) lands on `end_unfed` with `tasted: true, drank: false`.

⚠ **Still true and knowingly accepted:** the game offers no "leave" choice anywhere, so `end_fled`'s prose describes an action even refusers never took. The owner chose to fix only the sip routing. Two free options remain if it is ever reopened — rewrite the two opening lines so it reads as never having stayed, or add a fourth 「起身離開」 option in `ch3`.

## Addendum 6 — 2026-08-05 · the void face, and the change made visible (v465–v470)

**The devouring is now shown, in three stages, using art the owner picked after a long exploration** (~45 generations; the winners and the technique lessons are the lasting part).

The visual language: her face becomes flat matte black with only her own narrow pale eyes left in it, and the black then spreads down her body with a torn, irregular edge — never a smooth gradient. `asset:a43d290737b` is the canon base for the whole line; derive from it, not from a later chain link.

| stage | sprite | where |
|---|---|---|
| a thread of black at the collar, body still clean | `char_gm_spread_early` | `end_devoured`, on "The candles go out" |
| across the shoulders, tearing as it goes | `char_gm_void_spread` | on "Do not be afraid" |
| all but a few pale islands taken | `char_gm_spread_deep` | on "a spoon, gently stirring" |
| what is under the veil | `char_gm_void_half_a` | `t_veil`, for the two lines the hand is through it, then back to `char_gm_calm` |

**No new dialogue was written** — the three stages ride the three lines the ending already had, so the change happens while she talks. Verified: script order correct, all four sprites load at 1024², and a live probe holds `char_gm_spread_early` at the first line rather than racing ahead.

Kept but unwired, deliberately: `char_gm_void`, `_third`, `_many`, `char_gm_grin` + `_m1`, `char_gm_slits` + `_tilt`, `char_gm_void_black`, `_head`, `_half_b`. The dead-asset warning now names 15 — that is expected, not a defect.

## Addendum 7 — 2026-08-05 · she makes a sound when her face changes (v471–v488, 55 cr)

Not voice acting — five short wordless breaths, fired on the **expression swap** rather than the line. 234 say lines would have been unbearable; there are 32 shows, and each one is the moment her feeling actually changes.

`vo_pleased` (pleased/excited) · `vo_warm` (smile/neutral, and her arrival, her first words, her leaving) · `vo_cold` (the Mask, all five offences) · `vo_hurt` (hurt/sad) · `vo_hollow` (the danger tell). All `generate_speech`, voice **`woman_calm`** — the owner auditioned all four female presets on one identical line and picked it.

**Deliberately silent:** the veil reveal and the three devouring stages. Those beats already carry a sting and the tension track, and the transformation reads better without her.

Wiring note worth reusing: `edit_game` with `replaceAll` on the exact `show` block per sprite key does the whole set in one batch, and conditional shows (`if: favor>=65`) need the **same `if` on the sfx** or the sound fires when the sprite does not. Verified: 32 cues, every one paired to the show that follows it, no if-mismatches, no missing audio files, and a live probe heard `vo_hurt` / `vo_cold` / `vo_hollow` at the right labels.

⚠ **Accent lives in words, not in breaths — but the SFX engine cannot make a human breath.** Wordless takes via `generate_sound` came back unusable; the fix for "too American" was changing the TTS voice, not the engine.

**Owner verdict 2026-08-06: the breaths are "not performing good".** The pattern was deliberately left OUT of the template when the session's lessons were promoted — and the owner then ordered the removal. **All 32 cues are out (v505–v536) and the five `vo_` audio files deleted (v537); expression swaps are silent again.** Verified: zero `vo_` cues left, zero dangling references, spot-checked labels structurally intact, `sfx_teacup`/`sfx_sting` untouched.

⚠ **The removal had to go through `write_data`, because `edit_game` is now HARD-BLOCKED on this game.** A new validation gate opens the game in a headless browser and rejects the whole batch on any `console.error` — and the two `generate_music` BGM tracks are hosted at `/asset/*.mp3`, which the sandboxed origin cannot fetch (no CORS header). Every `edit_game` on any game with hosted music now fails with "拒收 — 隻遊戲喺 headless 瀏覽器實測開唔到", regardless of what the edit touches; retried, deterministic. **Escalation of PLATFORM-BUGS item 6, filed as item 16.** Until the platform fixes it (CORS on `/asset`, or exempting the platform's own hosts from the gate), script edits on this game go through `write_data` — delete array items HIGHEST INDEX FIRST within a label — and `delete_asset` still works.

## Addendum 8 — 2026-08-05 · the reveal chapter finally reveals something (v489, free)

`ch3` had her say **"Look at me as I am"** with no `show` at all — the player kept whatever face chapter two left behind. Worse, `t_gaze`'s narration counts her eyes *until counting loses meaning* over a sprite with two. The writing had been promising a reveal the art never delivered.

Settled by grilling: **she offers, and how much you see is what you chose.** One axis, three payoffs, all from sprites already in the game:

| beat | sprite | reading |
|---|---|---|
| `ch3`, on her invitation | `char_gm_void` | she gives half — the face is a void, but the eyes and the small smile are still hers |
| `t_gaze` — hold her gaze | `char_gm_void_many` | you accept what was offered, and the narration's many eyes are finally there |
| `t_veil` — lift the veil | `char_gm_void_black` (was `_half_a`) | you took more than was offered, so you see all of her, and she shouts |
| `t_bow` — look away | `char_gm` unchanged | you declined, so she puts it back |

`ch3` stays silent; `t_gaze` keeps `vo_pleased`, because a monster face over her genuinely moved hum is the point — it is still her. Verified live: the void lands on her invitation line, `t_veil` reaches `_black`, `t_bow` unchanged.

Known seam, accepted: after `t_gaze` the question beats show her ordinary faces again — she recomposes without saying so. `t_veil` has a line for it ("Forgive me. The tea has gone bitter"); `t_gaze` does not. Add one if it ever grates.

**Extended immediately after (v492).** The owner's framing: the Void is not a progression but *her mask slipping*, and **she goes back to normal when the player does the right thing** — which is what `t_veil` and `t_bow` were already doing. So the state now drops at every beat where she is seen through, and `char_gm_void_half_a` is the base face for all of them:

| beat | was | now |
|---|---|---|
| `ch3` invitation | `char_gm_void` | `char_gm_void_half_a` |
| `ask_past` — what were you before | `char_gm_hurt` | `char_gm_void_half_a` |
| `ask_twelve` — the twelve guests | `char_gm_hurt` | `char_gm_void_half_a` |
| `ask_monster` — you call her one | `char_gm_polite` | `char_gm_void_half_a` |
| `q_truth` — the stolen pages laid out | `char_gm_sad` | `char_gm_void_half_a` |

Unchanged on purpose: `t_bow`, `q_sweet`, `ask_en` (courtesy keeps her face), the two extremes (`t_gaze` many-eyes, `t_veil` all-black), `ch1`, and **all eight endings** — the owner scoped the Void to chapter three so the last thing the player sees of her is still a person. The voice cues stay as they were, so the emotion still comes from her breath and her words while the face carries only how much performance is left. `Void` is now a term in `CONTEXT.md`. Verified live; `char_gm_hurt` is now unused but kept.

## Addendum 9 — 2026-08-05 · every ending gets its own last image (v493–v504, 105 cr)

Four endings shared `bg_wrong` — including `end_bring_home`, the one the game itself calls the hardest. A coverage audit put it plainly: three different paths, one picture.

The three that already had a CG turned out to use a grammar worth copying — **sprite carries the dialogue, then the screen cuts to an object CG and the sprite hides, so the ending card lands on the image.** The four new ones follow it exactly, so 7 of 8 endings now close on their own picture (`end_devoured` uses its three-stage sprite progression instead, deliberately).

| ending | closing CG |
|---|---|
| A Guest Remembered | `cg_end_spoon` — her hand laying the spoon across the saucer, the tea half drunk |
| You Stay | `cg_end_stitch` — her hands stitching red thread into the black lace hem, the promise she said she would sew in |
| The Thirteenth Page | `cg_end_thirteen` — her hand setting one more cup at the end of the row |
| You Bring Her Home | `cg_end_leave` — the door open on the night, the two of you walking out |

**Owner's art direction: keep the object close-up language, but put her in it.** The answer was *her hands* — `cg_end_thread` already had a hand in frame, so no new visual language was invented and no face means no identity drift.

⚠ **`cg_end_leave` is the first time the player has ever been drawn.** Every earlier beat kept him off-screen on purpose (the prologue even cut the hands off the door-push). The owner asked for two figures here because it is the one ending where you leave together — but he now has a look (dark long coat, short hair, seen from behind), and any future shot of him has to match it.

Generation notes: adding a second figure failed silently the first time because her back filled the doorway — **there was no room for him**, and no prompt fixes a composition problem; the fix was moving her aside and placing both figures beyond the threshold. Krea also drew a floating hand when only hands were asked for, and connecting the arm needed its own single-axis edit.

Probe recipe for audio, worth reusing: wrap `HTMLMediaElement.prototype.play`, record `this.src`, then `VN.goto` each label. Anything whose `sfx` sits before the label's first `say` fires on the goto alone; anything after a `say` needs the keyboard advance above.
- **Same day, later — the looms were rejected in place and replaced by a CG (v361–v374, 165 cr).** Trade offer now hands the screen to `cg_shadow_offer` (she fills the frame, dark void behind, two candle flames as the only背景, sprite hidden); each trade branch reopens with `bg_parlor_cold`; drink offer reverted to plain `char_gm` with `cg_cup_offer` carrying the beat; both loom sprites and the working file `cg_shadow_sq` deleted from the game. Verified: all three branches restore the room with their own expression, all 27 script-referenced art keys load, console clean. Full record + the generation lessons: `.scratch/ch2-rework/spec.md` §Superseded 2026-08-04. Wallet 個人 2,490 at close.

## Addendum 10 — 2026-08-06 → 08-10 · the prose refine (art frozen, text is the work now)

The owner called the art ~80% done and moved the whole effort to **wording and story, judged in
Chinese** — they read Chinese better than English, so Chinese is now the original and English is
the translation. Their diagnosis of the shipped prose, verbatim in substance: it reads as Western
aphorism, not VN narration — too fast, no build-up, **no protagonist inner monologue**, almost no
interaction detail, no visible link to the "dark fairy tale" subtitle, and above all
**"你的句子很多都意義不明"** (they named "（茶,是有耐心的）", "（門沒有鎖。從來都沒有。）",
"房間還是原樣。房間已不是原樣。" as the type).

**Approved style** (sample-tested before any rewrite): 你-narration + parenthesised first-person
inner voice + sensory build-up + interaction detail (pouring, porcelain, the chair) + her
fairy-tale self-awareness. Old ideas are kept; the *saying* of them is made plain.
**Scope**: 重點加肉 — spine beats ×3, transitions and branch reactions ×1.5.
**Workflow the owner chose**: one chapter at a time, Chinese draft → owner approves → land →
next chapter; **English deferred** until all Chinese is locked, so English players keep seeing the
old, unbroken version behind the language gate.

Drafts and full landed text live in `.scratch/story-refine/`. Status:

| chapter | labels | zh lines | versions | state |
|---|---|---|---|---|
| prologue + ch1 | 16 | → ~65 | v538–900 | landed, owner scored it 75/100 and said that is enough for now |
| ch2 (the bargain) | 7 | 13 → ~45 | v901–1088 | landed |
| ch3 (reveal / questions / last question) | 10 | 16 → **89** | v1092–1098 | landed |
| the eight endings | — | — | — | **next** |
| English retranslation | all | — | — | deferred until the Chinese is locked |

**The one naming rule that governs every line**: she has no name. The nameplate is `???` in both
languages; nobody in the story calls her 教母; the stolen page is the only place the word appears.

**Tooling — this changed on 08-10 and it matters more than anything else here.**
`edit_game` is **unblocked** (PLATFORM-BUGS #16 no longer reproduces; probed with a real edit,
then 17 more edits across four batches). `write_data` still stringifies structure (#17). The
division of labour that fell out of it, and that the ending pass should start from:

- **`edit_game` find/replace** to insert new script items — a whole chapter is ~4 calls.
- **`write_data` scalar** (`script.<label>[i].text`) to change one existing line — no string
  matching, so no way to miss.
- **Probe `edit_game` with one small real edit before assuming it is locked.** The leaf-write
  workaround costs ~500 calls per chapter; find/replace costs 4.
- **Never hand-escape CJK as `\uXXXX` in a tool argument.** Two characters went wrong that way in
  one afternoon (`却`/`卻` killed a whole batch, `扈`/`扇` shipped a typo). Paste the Chinese.
- Still true from the leaf-write era: **`read_data` the label before touching it.** Chinese and
  English `say` items are interleaved and `choice`/`goto`/`sfx` sit among them, so no index can
  be inferred.

**Verification recipe used for every chapter** (cheap, no screenshots needed): run a structural
scan in the embed over `window.GAME_DATA.script` — every `say` has text, every `goto`/`choice`
target exists, every `bg`/`show` key is in `GAME_ASSETS`, every label terminates, nothing sits
after an unconditional terminator — then `VN.flags.lang_tw = true; VN.goto(label)` for each label
and read `VN.S.line`. ⚠ The scan must **skip `if`-bearing `goto`/`end`**: conditional gotos
(`goto X if lang_tw` then `goto Y`) are this script's routing idiom, and a checker that treats the
first goto as terminal reports a wave of false "unreachable" errors. The one surviving hit,
`ch1: unreachable from [29]`, is a deliberate fallback goto behind a choice — not a defect.

### Addendum 10b — 2026-08-10 · the endings, and the Chinese is now complete (v1099–1104)

Owner's call after chapter three: *"no need we make all first"* — skip the per-chapter test, finish
everything. So the last question's three answers and all eight endings landed in the same pass.
41 edits, five `edit_game` batches. **The Chinese script is now complete end to end.**

| | zh lines |
|---|---|
| prologue + ch1 | ~65 |
| ch2 | ~45 |
| ch3 | 89 |
| last question + 8 endings | 44 → **123** |

Three things the owner had listed as known-but-unactioned were cleared here, because a prose pass
is the right place for all of them:

1. **`end_fled` described an action no choice performs.** It opened "你拔腿就跑" but its actual
   entry condition is `!tasted` — a guest who never touched the cup and sat politely through the
   entire tea. Rewritten as what really happens: the tea ends, you bow, you walk to the door, and
   *then* she stops you. The `shake` moved off the top of the label to land on the turn.
2. **Ending-name collision** 1／8 被吞噬 vs 2／8 整個吞噬 → 2／8 is now **整個收下** ("received
   whole" — her polite register is the horror).
3. **3／8 不夠下飯 broke tone** (a diner idiom in a gothic fairy tale) → **嚥不下的客人**, which
   picks up her own line 「而你沒有給我任何一樣，值得嚥下的東西」.

All eight ending names are now distinct.

**Verification:** structural scan clean (61 labels; the only hit is `ch1[29]`, a deliberate
fallback goto behind a choice); full-tree simulation walks **6,318 paths and reaches all eight
endings**, no orphans; every label's Chinese lines dumped and proofread line by line.

⚠ **The proofreading step is not optional, and this is the third time the same trap fired.**
Hand-escaping CJK as `\uXXXX` put two wrong characters into shipped text — **蜡** (simplified) for
**蠟**, and **攬** (embrace) for **攔** (block), the latter inverting a sentence's meaning
("椅子沒有攬你" = the chair did not embrace you, where it must read "did not stop you"). Neither
errors out: both are valid characters, both find/replace cleanly, and the structural scan cannot
see them. Only dumping every label's text and reading it caught them. Rules: **paste Chinese
literally into tool arguments, never escape it**, and **always dump-and-read after landing**.
A logic slip surfaced the same way — `q_truth` is gated `pages>=2` but the new prose counted
"一頁。兩頁。三頁。"; the player holds two at that moment.

**Remaining on this game:** the English retranslation (deferred by the owner until the Chinese is
locked — it now is). English players continue to see the old, unbroken text behind the language
gate, so there is no rush and no breakage.

## Addendum 11 — 2026-08-10 · the bad endings get their own deaths (v1105–1115, 120 cr)

Owner's finding: *"some of the ending does not have a cg like being eat, and some bad end should
be about the mystery godmother eliminate us in different way."* Audit confirmed both halves —
`end_devoured` was the only ending with no closing CG (it ended on a white-background sprite), and
all seven CGs that did exist were still-life close-ups, so no bad ending showed her actually doing
anything. Owner then chose the widest option: **all five bad endings**.

**The base that made it cheap: `cg_shadow_offer`.** It is already 16:9, full-frame her, void
behind, two candle flames, and owner-approved style — so every new CG is a ONE-STEP krea-edit off
it and inherits ratio, identity and brushwork for free. That skips the 3-step "16:9 transplant
chain" (~45cr each) documented in Addendum 6.

| ending | how she removes you | asset | takes |
|---|---|---|---|
| 1／8 被吞噬 | **eats you** — face is one flat black void, two narrow eyes looking down at you, the cup still lit at the bottom | `cg_end_devoured` (new) | 4 |
| 2／8 整個收下 | **folds you in** — both arms wide, open empty hands reaching past both edges | `cg_end_shut` (replaced) | 2 |
| 3／8 嚥不下的客人 | **pours you back out** — cup tipped over, a ribbon of pale gold running into the saucer | `cg_end_cup` (replaced) | 1 |
| 4／8 被她帶走 | **keeps you on a lead** — red thread hooked over her raised finger, running out of frame to your wrist | `cg_end_thread` (replaced) | 2 |
| 5／8 你留下來 | **sews you in** — needle and red thread stitched into the black lace hem | `cg_end_stitch` (replaced) | 1 |

Four were replaced in place (same GAME_ASSETS key) so **no script edit was needed and no orphan
assets were created**; the old versions stay in the library as restore points. Only `end_devoured`
needed script work: `bg cg_end_devoured` + `hide gm` inserted before its ending card, so all eight
endings now close on an image.

**Deliberate scope call:** only 1／8 uses the void face. The other four keep her ordinary human
face — Addendum 8 scoped the Void to chapter three so the last thing the player sees is still a
person, and a polite face performing the act is worse anyway. 1／8 is the one ending where you
saw what she is, so it is the one that gets the black face.

### Three tooling facts this cost credits to learn

1. **`character_sprite` keys the background out unless you pass `transparent: false`.** Three
   takes went white before this landed. The output is a transparent PNG and the preview renders
   alpha as white, which reads exactly like "the model ignored my background instruction". Any
   full-scene CG must set it explicitly.
2. **To free a held object, give the OBJECT a new place — not just the hands a new job.**
   `reference-vn-art.md` already says a pose rewrite frees a prop; that was not enough here (take
   one left the red thread looped round the teacup handle). What worked: *"with one hand she has
   pushed the teacup and its saucer far away to the side of the table, where they now sit small
   and forgotten"*. Relocating beats removing, and it never triggers the never-name-what-you-want-
   gone failure.
3. **The image in the tool result is a 512px thumbnail, not the output.** I flagged the new CGs as
   low-resolution on that basis; measuring the served files says every one is **1280×695**, larger
   than the 768×410 originals. Judge resolution by loading `GAME_ASSETS[key]` and reading
   `naturalWidth`, never by the preview.

Items 1 and 2 belong in `templates/reference-vn-art.md` — that file is owner-gated, so they are
parked here until the owner runs `/writing-great-skills`.

Verified: all eight endings resolve a closing CG, every key exists in `GAME_ASSETS`, every file
loads at 1280×695, every ending hides the sprite before the card. Personal wallet 9,926 at close.

## Addendum 12 — 2026-08-11/12 · the devoured ending, and what a long art loop costs (v1105–1161)

Owner's finding after the endings shipped: `end_devoured` was the only ending with no closing CG,
and none of the bad-ending CGs showed her *doing* anything. They chose the widest fix — all five
bad endings get a "her + void" image — and that part landed cleanly in one pass off
`cg_shadow_offer` (16:9, full-frame her, void behind, approved style, so every new CG is a
ONE-STEP krea-edit that inherits ratio, identity and brushwork for free):

| ending | how she removes you | asset |
|---|---|---|
| 2／8 整個收下 | folds you in — arms wide, empty open hands past both edges | `cg_end_shut` |
| 3／8 嚥不下的客人 | pours you back out — cup tipped, a ribbon of pale gold into the saucer | `cg_end_cup` |
| 4／8 被她帶走 | keeps you on a lead — red thread over her raised finger, out of frame | `cg_end_thread` |
| 5／8 你留下來 | sews you in — needle and red thread into the black lace hem | `cg_end_stitch` |

Then 1／8 被吞噬 ate the rest of the session. **~30 generations on one image, ending back where it
started.** The final state is deliberately conservative: the CG is the clean extreme close-up of
her void face derived from `char_gm_void_half_a`, no marks, and `endShot` is 0.

**What the owner actually wanted, and what finally answered it.** After rejecting a grin, a gaping
maw, a Kuchisake slit, a scrawled mouth and a found-footage restyle, the real note was: *"it should
be see her transform from a human form to void before, and the CG is the void form coming to the
player and consuming the player."* The ending had always opened with her face **already** black —
there was no turning. The fix needed **one** new sprite; everything else was art generated weeks
ago and never once drawn:

`char_gm_calm` → **`char_gm_void_creep`** (new: the black crept in from hairline, ear and jaw,
her own face a shrinking island with her eyes, nose, mouth and blush still human) →
`char_gm_void_head` → `char_gm_spread_early` → `char_gm_void_spread` → `char_gm_spread_deep` → CG.
Chapter text went 11 → 18 zh lines. `char_gm_void_head` came off the never-drawn list.
**Look in `list_assets` before generating: this game had a whole unused transformation in it.**

### The expensive lessons

1. **krea-edit cannot MOVE an existing mark.** Every "shift it down / make it thinner" prompt
   repaints the whole region and re-rolls everything in it. Four consecutive attempts to move one
   red line: two repainted her lower face as pale skin (destroying the void), one deleted the
   scribble, one ate an eye. If a mark is in the wrong place, **redraw the whole mark from the
   clean base with the position stated against a non-anatomical landmark** ("two thirds of the way
   between her eyes and the top of her collar"). Never say "at the height a mouth would be" — that
   phrasing makes the model restore anatomy.
2. **Chain-edit drift is cumulative and fatal.** Nine links deep the owner said "not even the same
   person". Rebuild from canon every few steps; never chain past ~3.
3. **`character_sprite` keys the background out unless `transparent: false`.** Three takes went
   "white background" before this landed — the output is a transparent PNG and the preview shows
   alpha as white, which reads exactly like the model ignoring the instruction.
4. **To free a held object, give the object a new PLACE, not the hands a new job.**
   `reference-vn-art.md` says a pose rewrite frees a prop; that was not enough. What worked:
   *"with one hand she has pushed the teacup and its saucer far away to the side of the table,
   where they now sit small and forgotten."*
5. **The image in the tool result is a 512px thumbnail, not the output.** Measure the served file
   (`GAME_ASSETS[key]` → `naturalWidth`); these CGs are all 1280×695.
6. **Stop hand-escaping CJK as `\uXXXX`.** Four wrong characters shipped this session alone —
   `却`/`卻`, `扈`/`扇`, `蜡`/`蠟`, `攬`/`攔`, plus `顒`/`頜`, `脆`/`脖`, `膠`/`膀`. None error;
   none show up in a structural scan. Paste the Chinese, then dump every label and read it.

### The code path (still live, currently idle)

Because generation could not place a mark reliably, the mouth scrawl was moved into canvas code
with inspector sliders — and that exposed a real platform fact worth keeping:
**the top-biased cover-crop patch rewrites the runtime's 5-argument `drawImage` into a 9-argument
source-rect call.** A hook that only tests `arguments.length === 5` therefore never fires on any
background, silently. It also pins `sy = 0`, so on a square CG only the top 56% of the image is
ever on screen. Both are now handled in the devoured hook (`cgPan` controls the crop). The scrawl
code, the `endShot` 0/1/2 switch, the per-frame lofi effect and `previewDevoured` all remain in the
source and are reachable — `endShot 0` + `scrawlOn false` is simply the chosen state.

### Platform state at close — the owner cannot open the editor

Verified from the served build that **the game itself is healthy**: 61 labels, VN runtime alive,
52 assets, 41 config keys, only the known Cloudflare RUM CORS noise. Two server-side flags changed
between v1142 and v1160 that **no tool available here can set**:

- `teamId`: `null` → `9e5cee62-…` (gamenticOffcial — the owner's own team)
- `pendingUpdate`: `false` → **`true`, and it does not clear** (polled twice, minutes apart)

`commit_game` cannot clear it — it requires an `uploadId` from the chunked-upload flow. This needs
the platform side. Meanwhile `edit_game` / `write_data` / generation all still work, so work is not
blocked; only the owner's visual slider tuning is. Filed as PLATFORM-BUGS #18.

## Addendum 13 — 2026-08-12 → 08-19 · the devoured CG lands, one beat by hand, her own interface, and her voice (v1162–1376)

**Supersedes Addendum 12's "final state is deliberately conservative" line.** The devoured CG is
now **T** — she lunges across the table, her hands already black tendrils (`cg_end_devoured`), with
the per-frame lo-fi filter on top (`lofiOn`, default on; knobs in the inspector). `endShot` is gone
(`dropConfigKeys`). The six-sprite turning from Addendum 12 still precedes it. The scrawl path and
`previewDevoured` remain in the source, off by default; 14 `scrawl*` config keys sit in GAME_CONFIG
with no schema field — harmless, and droppable with `dropConfigKeys` once the owner retires the path.

What finally moved it: the owner's **three actual HTDAE ending screenshots** — a mid-shot, the
entity *acting*, the player as a fragment, one colour cast. Every close-up, every mouth, every
found-footage restyle before that was built on my reading of a game the owner had in their head.
"Ask for their references before the first generation" is now in `reference-vn-art.md`.

**Editor outage — resolved.** The remix test (`gba33c9`, a throwaway copy; ignore or delete)
isolated the fault to this game's own server record (PLATFORM-BUGS #18); the owner later reported
the editor usable again. Nothing here fixed it.

**One beat by hand — the ledger.** `src/minigames.js` registers `GI_MINIGAMES.ledger`; `b_join`
ends in the runtime's **native** `minigame` command (`win: p2_clean`, `lose: p2_caught` →
`p2_take` / `p2_none` / `p2_seen` / `p2_shut` → `ch2_out`). She rights the twelve cups with her back
turned (`char_gm_back_b`); you pull the loose pages 1:1 with the hand; caught = one line from her,
`favor −5`, third catch closes the book. Knobs the owner tunes: `ledgerPullDist`, `ledgerKeep`.
Headless hooks: `__LEDGER_STEP(dt, n)`, `__LEDGER_POINT(type, x, y)`. Every scar and the design
rules went into the new `templates/reference-vn-minigame.md` — read that before touching it.

**Her interface.** `src/dialog_skin.js`: `VN_SKIN.paintedBox` paints `ui_box_a3` as the dialogue
frame (config `paintedBox`, `boxPad`, `boxTopPad`, `boxOverhang`); `wrapChoice()` **wraps** the
existing `VN_SKIN.choice` and paints a parchment strip per in-game row, red thread on hover, and
stands down while `S.mg` is set. Main menu: the `bg_parlor_f5` void shows behind the candles on the
f4 dip tick every `menuVoidEvery` cycles at `menuVoidAlpha` — both inspector knobs.

**Cleanup.** 34 unused assets deleted; the preview page removed; `endShot` retired.
**Templates.** Two owner-invoked `/writing-great-skills` rounds: `reference-vn-minigame.md` (new),
`template-dating-horror-vn.md` v6, `reference-gamentic-platform.md` v4, `reference-vn-art.md`
additions, INDEX rows, PLATFORM-BUGS #16 fixed / #17 re-probed / #18 isolated / #19 drawImage.

### Her voice (the main event of this addendum) — v1162 onward, ≈250 cr

Owner's choice: **C 日文語音 + 中文字幕** — only *her* lines are voiced, Japanese audio under the
Chinese subtitle; the English mode stays silent. After auditioning 16 candidates the voice is
**`ja_059`** (taken as `voice_gm`). The register is **A 貴族女主人**: 「わたし」, command forms
〜なさい, sentence-final 〜のよ／〜わ, no です・ます; 「小さなお客様」 for 小客人, 「坊や」 once in
`b_worst`, 「人間」 for 凡人, 「まるごと、いただくわ」 for 整個收下, 「いなさい」 for 留下吧, 「……。」
for her silences. **The owner delegated the Japanese entirely** — "do not ask me for it because I
do not know either Japanese" — so the script is mine and the owner judges by ear only; do not send
them JA text to review.

- **Script of record:** `.scratch/story-refine/voice-ja.tsv` — 112 rows: `label, idx, zh, ja,
  emotion, speed`. Generated with `generate_speech(voice:"ja_059", emotion, intensity 0.4 — 0.3 on
  the silences, 0.6 on the one angry line — speed 0.75–0.9)`; the engine has no real emotion takes
  for this actor, so every emotion is the neutral take re-coloured (fine at these intensities).
- **Wiring:** `"voice": "vo_<label>_<idx>"` on every `gmt` say, added after `"if": "lang_tw"`
  (two abbreviations: `end_devoured → end_dev`, `end_bring_home → end_home`). **112/112 wired**,
  every key present in `GAME_AUDIO` (structure probe at v1375); playback confirmed by wrapping
  `HTMLMediaElement.prototype.play` and `VN.goto`-ing labels whose first zh line is hers
  (`dia/vo_end_taken_2.mp3`, `vo_end_woven_2`, `vo_end_guest_2`, `vo_ch1_19`). The 16 audition
  takes (`vo_test_*`) are deleted from the game.
- **Cost:** ≈1–3 cr a line by length; the 28 ending lines were 61 cr.
- ⚠ **Auditioning lesson.** `list_voices` previews were inaudible in the pane and useless to the
  owner anyway; what worked was generating the *same real line* for each candidate and wiring it
  into `ch1[19]` for in-game A/B. And the owner hears register before timbre — the "人妻" wording
  was rejected before any voice was; settle the wording first, then shop voices.
- ⚠ **Shared wallet.** Between two consecutive `generate_speech` calls the balance went
  124533 → 122430 with nothing of mine in between — another session was spending on the same
  wallet. Check `budget_status` before attributing cost.

### State at close

v1376 on the **draft** (the embed serves it; `/play/` still serves the last commit — do not commit
without the owner). Owner still to tune in the inspector: ledger difficulty, the lo-fi filter,
`menuVoidAlpha` / `menuVoidEvery`, the box pads. Deferred and unasked: English retranslation of the
whole script; English-mode voice (none exists by design); dropping the dormant `scrawl*` keys.
