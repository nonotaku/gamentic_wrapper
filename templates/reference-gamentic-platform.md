# reference-gamentic-platform — runtime, editing and verification on Gamentic

Shared reference for any game built on this platform, VN or not. Pointed at by the genre templates; holds no genre content of its own. Everything here was paid for in a live build — treat each ⚠ as a scar, not a suggestion.

---

## Editing a game safely

- **Story data through `read_data` / `write_data`, code through `edit_game` find/replace.** `write_data` receives object and array values JSON-stringified (platform bug) → write scalar fields one at a time, or do bulk surgery with `edit_game`. Chunked upload ≤3000 chars.
- ⚠ **Address a script command by its CONTENT, never by a hard-coded index across calls.** Locate the node by `cmd`, and verify by re-reading the WHOLE array afterwards rather than the single field you wrote. Another agent inserting one command shifts every index — a "restore" once wrote into the wrong command and turned a `bgm` into an option-less `choice`, hanging the game at the title with no error.
- **`edit_game` is fail-closed**: if any `find` is missing or ambiguous the entire batch is rejected, so a failed batch changes nothing. Include enough surrounding text to make each `find` unique.
- **Two agents may share a game.** Re-read state before editing; version numbers move between your own calls.
- **One condition per `goto`.** Compound conditions (`a && b`) are undocumented, so express branching as a ladder of tiny labels with a single test per hop. A multi-way ending resolver and a language split are both written this way, and each hop stays independently verifiable.
- **`write_data` cannot write arrays or objects** — the value arrives JSON-stringified, so a whole new label written that way becomes the string `"[]"`. Add or replace a label with `edit_game` find/replace; keep `write_data` for scalar fields.

## Verifying what you built

- **The embed URL is the reliable probe:** open `/api/games/<id>/embed` in a browser and drive it with JS. The runtime exposes `VN.flags`, `VN.goto()`, `VN.S` (`label`, `pc`, `bg`, `line`, `choices`, `actors`), so a whole branch can be walked and asserted headlessly. The play page wraps the game in a cross-origin iframe and cannot be read.
- ⚠ **`playtest_screenshot` renders a BLACK canvas** for any game whose assets are served as `media/…` paths — its headless environment cannot resolve them. Automated visual checking is unavailable there; read state through the embed instead.
- **Automation reaches gameplay through the menu only if number keys pick rows.** `playtest_screenshot` can click the screen centre and press keys, nothing else — so bind `1`–`9` in any custom menu. Keys sent in one burst arrive faster than beats advance, so send generously and check where you actually landed.
- **A game auto-restores the last save on load.** Clear `localStorage` before probing a fresh run, or you resume mid-story and misread the result.
- ⚠ **A collapsed browser pane freezes the page.** `document.hidden` goes true, so `requestAnimationFrame` stops, screenshots time out and timers throttle to a crawl. "The draw hook was never called" then measures the pane, not the code. Confirm a frame counter (`S.t`) is still advancing before reading any render result as evidence — and drive the story by dispatching `pointerdown` on the canvas, which keeps working while the loop is frozen.
- ⚠ **The canvas and its `media/` images are cross-origin-tainted**, so `toDataURL` and `getImageData` both throw and there is no pixel check of any kind. What survives: `fetch` the PNG and read byte 25 — colour type `6` is RGBA, which is how you prove a sprite really got its alpha channel. Anything genuinely visual ends with the owner's own eyes; say so plainly instead of implying you saw it.

## Assets and storage

- **Storage moved (2026-07-31).** Newly injected assets are served as relative paths (`GAME_ASSETS.x === "media/x.png"`) instead of embedded base64. Check one value to see which regime a given game is in — older games still carry embedded data URIs.
- ⚠ **Embedded regime: a hard ~15MB ceiling.** Past it the gameId is DEAD and the build restarts from zero — one game died exactly this way mid-iteration. Tell the owner about the ceiling at build start and report headroom whenever art is ordered.
- ⚠ **Two separate stores.** Deleting from the gallery/asset page does NOT shrink a game — the copy embedded in the game is what counts, and only the editor's own asset panel (or `delete_asset`) removes it. Deleting a gallery original also makes it unusable as a krea-edit base afterwards.
- **`search_game_source` is safe again** under the media/ regime; under the embedded regime a match landing on a base64 line returns megabytes and blows up the context.
- **Billing:** confirm the active wallet with `set_active_wallet` at session start and after any server restart — a restart silently reset it from the owner's personal wallet to a team wallet mid-session.

## Backups

`/api/games/<id>/embed` downloads the whole game as one HTML file; every `media/<name>` beside it is fetchable the same way. A PowerShell loop over those two facts backs up a game (code + story + art) in seconds without passing anything through the context. Private (unpublished) games refuse this route — those need the authenticated MCP tools or a temporary publish.

## VN runtime contract

Shell = `GAME_CONFIG {textSpeed}` + `GAME_ASSETS` / `GAME_AUDIO` / `GAME_DATA` markers + `// __GI_VN_RUNTIME__`. Title and endings are script labels. Look-and-feel comes from `GAME_DATA.theme` — a square `boxImage` misaligns the text, so build the box from theme colours. Balance lives in script data, editable by the owner in the script panel.

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

## Two levers for UI the runtime never planned for

**A DOM button is immune to the canvas.** Every handler in this file — the runtime's advance-on-click, the menu, the choice rows — bails unless `e.target` IS the canvas, so an absolutely-positioned button cannot collide with any of them. Spend DOM on anything outside the painted scene (a hide toggle, a restart button, the boot gate) and keep canvas work for what must sit inside the art. Follow the canvas's `getBoundingClientRect()` on a slow interval so the button tracks resizes and letterboxing.

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
- **Audit every CJK string after writing.** Unicode-escape slips produce plausible-looking wrong characters — nine of them survived one pass. Dump every `if: "lang_tw"` string through the embed URL and read them back.
- ⚠ **Twin options double every incoming edge.** Each choice carries an EN row and a TW row pointing at the same label, so any graph pass over the script counts a plain branch target as a merge point — one such pass flagged nine correct labels as defects. Dedupe incoming edges by source label before trusting the shape of the flow.
