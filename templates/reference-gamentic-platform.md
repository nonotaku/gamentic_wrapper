# reference-gamentic-platform — runtime, editing and verification on Gamentic

Shared reference for any game built on this platform, VN or not. Pointed at by the genre templates; holds no genre content of its own. Everything here was paid for in a live build — treat each ⚠ as a scar, not a suggestion.

*v2 (2026-08-04): three verification claims re-measured with probe rig `g8bb0c7` and corrected in place; the per-surface restriction matrix moved to `reference-runtime-surfaces.md`.*

*v3 (2026-08-12): the two `write_data` bullets collapsed into one division of labour; probe-the-lock, scan/walk/simulate, the conditional-goto false positive and the slider lever added; the CJK bullet re-aimed at the cause instead of the audit.*

*v4 (2026-08-13): the canvas is 540-tall-and-window-wide (settle the frame with the owner first); the `minigame` command pointer; "Skinning the box and the rows" (wrap `.choice`, alias `.box`, skip `boxImage`); screenshot-on-version-one. Minigame mechanics live in the new `reference-vn-minigame.md`.*

---

## Editing a game safely

- **`edit_game` inserts and reshapes; `write_data` changes one existing scalar.** `write_data` receives object and array values JSON-stringified (platform bug), so a whole label written that way becomes the string `"[]"` and the game dies at the first click. Add or restructure commands with `edit_game` find/replace; use `write_data` for a single field (`script.<label>[i].text`), where there is no string to match and therefore nothing to get wrong — which makes it the safer tool for a pure text fix. Chunked upload ≤3000 chars.
- **Probe a lock before building the workaround.** A tool written off as dead stays dead in your notes long after the platform fixes it. `edit_game` was recorded as hard-blocked and re-opened on the first throwaway real edit; the leaf-write workaround that assumption bought cost ~500 calls per chapter where find/replace cost four. One small genuine edit, at the start of any session that plans to route around a tool.
- ⚠ **Address a script command by its CONTENT, never by a hard-coded index across calls.** Locate the node by `cmd`, and verify by re-reading the WHOLE array afterwards rather than the single field you wrote. Another agent inserting one command shifts every index — a "restore" once wrote into the wrong command and turned a `bgm` into an option-less `choice`, hanging the game at the title with no error.
- **`edit_game` is fail-closed**: if any `find` is missing or ambiguous the entire batch is rejected, so a failed batch changes nothing. Include enough surrounding text to make each `find` unique.
- **Two agents may share a game.** Re-read state before editing; version numbers move between your own calls.
- **One condition per `goto`.** Compound conditions (`a && b`) are undocumented, so express branching as a ladder of tiny labels with a single test per hop. A multi-way ending resolver and a language split are both written this way, and each hop stays independently verifiable.

## Verifying what you built

- **Three passes, because each is blind to what the others catch: scan, walk, simulate.** *Scan* the whole script for shape — every `say` has text, every `goto` and `choice` target exists, every `bg`/`show` key is in `GAME_ASSETS`, every label terminates. *Walk* each label with `VN.goto` and read `S.line` back, the only proof that the text you wrote is the text that plays. *Simulate* the tree in plain JS — follow gotos, fork at choices, carry flags, record where `end` fires — to prove every ending is still reachable and count the paths into each. The scan cannot see a wrong word, the walk cannot see routing, and the simulation cannot see either; one game shipped a bug that only the third pass could find (5,538 paths, one tool call, zero credits).
- **Restrictions differ per surface** (dev harness vs play page vs embeds) — `reference-runtime-surfaces.md` is the measured matrix; check which surface you are on before trusting any probe result.
- **The embed URL is the reliable probe:** open `/api/games/<id>/embed` in a browser and drive it with JS. The runtime exposes `VN.flags`, `VN.goto()`, `VN.S` (`label`, `pc`, `bg`, `line`, `choices`, `actors`), so a whole branch can be walked and asserted headlessly. The play page wraps the game in a cross-origin iframe and cannot be read.
- **`playtest_screenshot` renders `media/…` assets normally** (re-measured 2026-08-04; an earlier regime returned black). Automated visual checking works in the harness — and the harness is MORE permissive than production, so a passing screenshot says nothing about storage, dialogs or canvas readback.
- **Automation reaches gameplay through the menu only if number keys pick rows.** `playtest_screenshot` can click the screen centre and press keys, nothing else — so bind `1`–`9` in any custom menu. Keys sent in one burst arrive faster than beats advance, so send generously and check where you actually landed.
- **A game auto-restores the last save only where storage works (the dev harness).** On every production route `localStorage`/`sessionStorage`/cookies THROW SecurityError, so embed probes always start fresh — and a player's mid-story save cannot survive a reload; script progress must tolerate that.
- ⚠ **`S.bg === 'x'` proves the script ran, not that anything is on screen.** A beat whose background had been deleted from `GAME_ASSETS` walked clean through every state assertion and rendered pure black. Close the loop with the image itself: `new Image()` every key any `show` or `bg` references and wait for `onload`. Cheap, and it is the only check that distinguishes a working scene from a black one.
- ⚠ **Another agent may prune assets under you.** Re-using a long-unreferenced asset is the exact moment a cleanup pass elsewhere deletes it. After pointing the script at anything that was previously dead, re-check that it still exists — and prefer `import_asset` from the library ref, which restores it for free.
- ⚠ **Ask for the owner's screenshot on version one of anything drawn.** Layout built from geometry alone — a code-drawn figure, tabs, a shelf of tiny cups — earned the verdict *"totally don't know what is doing here"*, and every fix that landed afterwards came from a screenshot. You cannot see the canvas (below), so the first screenshot is part of the build; ask for it before asking whether it works.
- ⚠ **A collapsed browser pane freezes the page.** `document.hidden` goes true, so `requestAnimationFrame` stops, screenshots time out and timers throttle to a crawl. "The draw hook was never called" then measures the pane, not the code. Confirm a frame counter (`S.t`) is still advancing before reading any render result as evidence — and drive the story by dispatching `pointerdown` on the canvas, which keeps working while the loop is frozen.
- ⚠ **Canvas taint is a production fact, not a universal one**: on play/embed routes `toDataURL` and `getImageData` throw (opaque origin), while the harness reads pixels freely. Production-side, what survives is `fetch` the PNG and read byte 25 — colour type `6` is RGBA, which is how you prove a sprite really got its alpha channel. Anything genuinely visual ends with the owner's own eyes; say so plainly instead of implying you saw it.

## Assets and storage

- **Storage moved (2026-07-31).** Newly injected assets are served as relative paths (`GAME_ASSETS.x === "media/x.png"`) instead of embedded base64. Check one value to see which regime a given game is in — older games still carry embedded data URIs.
- ⚠ **Embedded regime: a hard ~15MB ceiling.** Past it the gameId is DEAD and the build restarts from zero — one game died exactly this way mid-iteration. Tell the owner about the ceiling at build start and report headroom whenever art is ordered.
- ⚠ **Two separate stores.** Deleting from the gallery/asset page does NOT shrink a game — the copy embedded in the game is what counts, and only the editor's own asset panel (or `delete_asset`) removes it. Deleting a gallery original also makes it unusable as a krea-edit base afterwards.
- **`search_game_source` is safe again** under the media/ regime; under the embedded regime a match landing on a base64 line returns megabytes and blows up the context.
- **Billing:** confirm the active wallet with `set_active_wallet` at session start and after any server restart — a restart silently reset it from the owner's personal wallet to a team wallet mid-session.

## Backups

`/api/games/<id>/embed` downloads the whole game as one HTML file; every `media/<name>` beside it is fetchable the same way. A PowerShell loop over those two facts backs up a game (code + story + art) in seconds without passing anything through the context. Private (unpublished) games refuse this route — those need the authenticated MCP tools or a temporary publish.

## VN runtime contract

Shell = `GAME_CONFIG {textSpeed}` + `GAME_ASSETS` / `GAME_AUDIO` / `GAME_DATA` markers + `// __GI_VN_RUNTIME__`. Title and endings are script labels. Look-and-feel comes from `GAME_DATA.theme`. Balance lives in script data, editable by the owner in the script panel.

⚠ **The canvas is 540 tall and as wide as the window.** The runtime pins `VH = 540` and lets `VW` follow the window's aspect (clamped 480–1920), drawing through `setTransform(DPR…)`; the `<canvas width=960>` in the shell is a placeholder the runtime overwrites. Consequences: every hand-drawn layout is a **fraction** of the logical size, never a pixel constant; `cv.width` is device pixels and drifts on hi-DPI — hit-tests divide the pointer by the client rect into logical space; and a square CG cover-cropped into that frame shows only its top 56%. **Settle the frame with the owner before laying anything out** — state the default (960×540 logical, wider on wide windows) and ask whether they want it locked; a layout built on the wrong assumption is rebuilt, not tuned.

**The runtime has a first-class `minigame` command** — `{cmd:"minigame", key, win, lose}` hands the canvas and input to `GI_MINIGAMES[key](host)` and routes on `host.done(ok)`. Reach for it before writing any overlay; the contract, its scars and a worked example are in `reference-vn-minigame.md`.

## Custom main menu

The runtime hard-codes choice rows at **42% canvas height**, with `hitChoice` and the drawing sharing one formula — so drawing them lower without owning the hit-test makes them unclickable. Build the menu as ONE block that owns drawing AND input:

- **One geometry function feeds both the draw and the hit-test.** Compute the row rect once, draw from it, and store it in a `RECTS[index]` array the click handler tests against. Two copies of the maths will drift.
- Inside `window.VN_SKIN.choice`, branch on `VN.S.label === 'start'`: the title uses its own geometry from `GAME_CONFIG` (`menuYPct` is the vertical CENTRE of the row stack, plus `menuWPct`, `menuRowH`, `menuGap`, `showTitle`, `titleYPct`, `titleSize`); in-game choices use the theme values. Draw the wordmark on `index === 0` and any overlay on the LAST index, so it paints above the rows.
- **Input: `pointerdown` on WINDOW at CAPTURE phase** — the runtime binds on the canvas in bubble phase, so capture always wins. On a hit: apply `VN.flags[o.set] = o.value`, clear `VN.S.choices`, call `VN.goto(...)`, then `stopPropagation()`. Without the swallow a GHOST hit-zone survives at the 42% band and clicking the artwork fires the wrong row.
- **Bind `keydown` for `1`–`9`** to pick the nth row, and Escape to close an overlay.
- **Exactly one block may own the menu.** When you append a newer version, disable the old one with a global kill-switch inside its handler — two capture handlers make every click fire twice.
- Put all geometry into `GAME_CONFIG` plus the `schema` param of `edit_game`, so the owner tunes it live. ⚠ A config key no code reads is a dead knob — wire both ends. ⚠ Once the owner touches a slider, the editor's SAVED config overrides the HTML defaults; read live values with `get_game`.

## ⚠⚠ Three traps in `VN.goto()`

**It does not clear `S.choices`.** The runtime's internal picker clears the pending menu; the public `VN.goto()` does not. A hand-rolled menu that only calls `VN.goto(o.goto)` leaves the choice list live — the next scene draws, but every later click is still treated as a menu pick, so dialogue can never advance and the old rows stay painted on top in the in-game skin style (that mismatch is the visible tell). **Set `VN.S.choices = null` immediately before `VN.goto()`.** `S.line` also survives the jump, so clear `S.line` / `S.shown` / `S.who` when drawing a title, or stale dialogue sits under the buttons.

**A goto to a label that does not exist ends the game, silently.** `goto` treats the miss as `S.over = true` and returns; every later `step()` then bails at once. The game keeps painting and keeps taking clicks while nothing advances, with no error anywhere. One mistyped label name reads exactly like a broken click handler — check `S.over` first when a game stops responding.

**It cannot restart an ended game.** `step()` bails while `S.over` is set, so `VN.goto('start')` after an ending does nothing. `VN.start(label)` clears `S.over` and then gotos — use it for anything that resumes after an ending. `start` re-`show`s its own actors but never clears the ones already there, so wipe `S.actors` yourself or the ending's sprite haunts the title.

## Settings overlay without runtime support

Point the menu row at a real no-op label (`settings` = `[{goto: start}]`) so it degrades safely, then intercept it in the pick handler (`if (o.goto === 'settings') { OPEN = true; return; }`) — deliberately skipping `goto`, so the title stays live underneath. Draw the panel from `VN_SKIN.choice` on the LAST row index; while it is open the capture handler swallows every click and routes to your own hot-rects, with `pointermove` / `pointerup` for slider dragging and Escape to close.

**Volume:** the runtime builds `Audio` objects that never enter the DOM, so hook `HTMLMediaElement.prototype.play` to collect them and set `volume` on each call — a looping element is music, a one-shot is sfx. Store `musicVolume` / `sfxVolume` in `GAME_CONFIG` so the same knobs appear in the inspector.

## Skinning the box and the rows

Both are `VN_SKIN` hooks; the runtime draws its own only while the hook is not a function. Two rules make a skin survive contact with everything else in the file:

- **`VN_SKIN.box`: paint your art, then lay the text with the runtime's numbers.** Name baseline, line height, `maxLines`, arrow corner — take every one from `box.theme`, so switching the skin off moves nothing. Paint a generated frame with `drawImage` from its opaque bounds (trim the alpha margin once) and let it overhang the box rect a few px so a torn edge reads; the parchment is the name-plate, a hairline underline replaces the plate. Install under your own key (`VN_SKIN.paintedBox`) and alias to `.box` on a short interval — the hide toggle sets `.box = function(){}` and deletes it to restore, and a skin that overwrites blindly will fight it. Reach for this, not `theme.boxImage`: `boxImage` stretches the whole image to the box's aspect and every corner ornament shears.
- **`VN_SKIN.choice`: wrap, never replace.** By the time a game has a custom menu, `.choice` is already owned by the block that draws the title, the settings overlay and computes the hit `RECTS` for every row. Capture the current function, install a wrapper that calls it first (title, hit-boxes and hover state stay exactly as it computed them), and only then paint your row over its rect for in-game choices — same `bw = W*choiceW`, `bh`, `gap`, `y0 = H*0.42 - …`, so the row you draw is the row it hit-tests. Guard with the same `S.label !== 'start'` split it uses, and skip while `S.mg` is set so a minigame's own buttons are not painted over. Mark the wrapper (`fn.__wrapped = true`) and re-check on an interval, because later blocks may reinstall `.choice`.

Both skins on `g96d22c` share one image, `ui_box_a3`, sliced two ways — the box takes the whole leaf, each row takes the plain band below the lace — so the interface reads as one object. Why that object: `template-dating-horror-vn.md` §5.

## Three levers for what the runtime never planned for

**A DOM button is immune to the canvas.** Every handler in this file — the runtime's advance-on-click, the menu, the choice rows — bails unless `e.target` IS the canvas, so an absolutely-positioned button cannot collide with any of them. Spend DOM on anything outside the painted scene (a hide toggle, a restart button, the boot gate) and keep canvas work for what must sit inside the art. Follow the canvas's `getBoundingClientRect()` on a slow interval so the button tracks resizes and letterboxing.

**A slider beats a re-roll.** When a generator cannot place something precisely — a mark on a face, a mask over a scene — stop paying per attempt and draw it in code: a few strokes inside the `drawImage` hook, its numbers in `GAME_CONFIG`, its knobs in the inspector `schema`. Four generations to move one drawn line failed four different ways and twice destroyed the character; the same placement became a slider the owner drags, at zero further cost and reversible in one value. The moment the note is *"a bit lower"*, the work belongs in code. Give the owner a preview toggle in the same group so they can see the shot without playing to it — and remember `requestAnimationFrame` is paused while a browser pane is hidden, so rAF-driven work is unobservable to you and has to be verified on their screen.

**An empty override hook is a hide.** The runtime draws its dialogue box only while `window.VN_SKIN.box` is NOT a function, so installing `function(){}` hides the box and `delete`ing it restores the original exactly — nothing reimplemented, nothing to drift. Look for this shape wherever a runtime offers "your hook, or my default". While hidden, park `S.choices` in a variable so a row nobody can see cannot be clicked blind, and let the next click restore the UI instead of advancing the story.

## The boot gate — one overlay, two problems

A `bgm` in the `start` label runs before the player has clicked anything, so autoplay policy silences it; the tell is that music appears only once something re-enters `start` (a language toggle, say). Separately, a cold load paints the title in pieces as each file arrives.

Both die to the same overlay: preload every `GAME_ASSETS` image behind a progress bar, then hold the game behind a **click-to-begin** button. The click is the gesture the autoplay policy wants, and it re-enters `start` so `bgm` runs AFTER it.

- Resuming paused looping elements on the first `pointerdown` is the obvious fix and **does not hold** — gate the boot rather than patch it afterwards.
- Block on images; fire the `GAME_AUDIO` fetches without awaiting them, and time the gate out (~12s) so one dead file cannot strand the player.
- Re-enter `start` only while the label still IS `start`. The runtime auto-restores the last save, and a player resuming mid-story must not be thrown back to the title.

## Bilingual (EN + zh-TW)

- Every `say` gets a twin gated on `if: "!lang_tw"` / `if: "lang_tw"`; the TW name plate uses a second character id.
- A language row gotos a tiny setter label (`set_tw` = `[set, goto start]`). Option-level `set` + `goto` on the same option is unreliable — the flag can fail to apply before the jump.
- Language branches follow the one-condition-per-`goto` rule above: clone the label and split arrivals with two stacked gotos.
- ⚠ **Paste CJK literally into tool arguments.** Hand-escaping to `\uXXXX` produces plausible wrong characters that nothing downstream catches — `卻`→`却`, `扇`→`扈`, `蠟`→`蜡`, `攔`→`攬` (that last one inverted a sentence: *the chair did not stop you* became *did not embrace you*). They raise no error, they match find/replace cleanly, and a structural scan is blind to them; sixteen have shipped this way across two passes. Backstop, since one always gets through: after landing, dump every label's strings through the embed URL and read them.
- ⚠ **A conditional `goto` pair is the routing idiom, not a dead end.** `goto X if lang_tw` followed by a bare `goto Y` is how every language split and ending resolver in this lineage is written, so a checker that treats the first `goto` as terminal calls everything after it unreachable — sixteen false positives in one run, on a script with no defect. Skip `if`-bearing `goto` and `end` when deciding where a label actually stops.
- ⚠ **Twin options double every incoming edge.** Each choice carries an EN row and a TW row pointing at the same label, so any graph pass over the script counts a plain branch target as a merge point — one such pass flagged nine correct labels as defects. Dedupe incoming edges by source label before trusting the shape of the flow.
