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
