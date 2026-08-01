# reference-gamentic-platform — runtime, editing and verification on Gamentic

Shared reference for any game built on this platform, VN or not. Pointed at by the genre templates; holds no genre content of its own. Everything here was paid for in a live build — treat each ⚠ as a scar, not a suggestion.

---

## Editing a game safely

- **Story data through `read_data` / `write_data`, code through `edit_game` find/replace.** `write_data` receives object and array values JSON-stringified (platform bug) → write scalar fields one at a time, or do bulk surgery with `edit_game`. Chunked upload ≤3000 chars.
- ⚠ **Address a script command by its CONTENT, never by a hard-coded index across calls.** Locate the node by `cmd`, and verify by re-reading the WHOLE array afterwards rather than the single field you wrote. Another agent inserting one command shifts every index — a "restore" once wrote into the wrong command and turned a `bgm` into an option-less `choice`, hanging the game at the title with no error.
- **`edit_game` is fail-closed**: if any `find` is missing or ambiguous the entire batch is rejected, so a failed batch changes nothing. Include enough surrounding text to make each `find` unique.
- **Two agents may share a game.** Re-read state before editing; version numbers move between your own calls.

## Verifying what you built

- **The embed URL is the reliable probe:** open `/api/games/<id>/embed` in a browser and drive it with JS. The runtime exposes `VN.flags`, `VN.goto()`, `VN.S` (`label`, `pc`, `bg`, `line`, `choices`, `actors`), so a whole branch can be walked and asserted headlessly. The play page wraps the game in a cross-origin iframe and cannot be read.
- ⚠ **`playtest_screenshot` renders a BLACK canvas** for any game whose assets are served as `media/…` paths — its headless environment cannot resolve them. Automated visual checking is unavailable there; read state through the embed and have the owner eyeball the play page for anything visual.
- **Automation reaches gameplay through the menu only if number keys pick rows.** `playtest_screenshot` can click the screen centre and press keys, nothing else — so bind `1`–`9` in any custom menu. Keys sent in one burst arrive faster than beats advance, so send generously and check where you actually landed.
- **A game auto-restores the last save on load.** Clear `localStorage` before probing a fresh run, or you resume mid-story and misread the result.

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

## ⚠⚠ `VN.goto()` does not clear `S.choices`

The runtime's internal picker clears the pending menu; the public `VN.goto()` does not. A hand-rolled menu that only calls `VN.goto(o.goto)` leaves the choice list live — the next scene draws, but every later click is still treated as a menu pick, so dialogue can never advance and the old rows stay painted on top in the in-game skin style (that mismatch is the visible tell). **Set `VN.S.choices = null` immediately before `VN.goto()`.** `S.line` also survives the jump, so clear `S.line` / `S.shown` / `S.who` when drawing a title, or stale dialogue sits under the buttons.

## Settings overlay without runtime support

Point the menu row at a real no-op label (`settings` = `[{goto: start}]`) so it degrades safely, then intercept it in the pick handler (`if (o.goto === 'settings') { OPEN = true; return; }`) — deliberately skipping `goto`, so the title stays live underneath. Draw the panel from `VN_SKIN.choice` on the LAST row index; while it is open the capture handler swallows every click and routes to your own hot-rects, with `pointermove` / `pointerup` for slider dragging and Escape to close.

**Volume:** the runtime builds `Audio` objects that never enter the DOM, so hook `HTMLMediaElement.prototype.play` to collect them and set `volume` on each call — a looping element is music, a one-shot is sfx. Store `musicVolume` / `sfxVolume` in `GAME_CONFIG` so the same knobs appear in the inspector.

## Bilingual (EN + zh-TW)

- Every `say` gets a twin gated on `if: "!lang_tw"` / `if: "lang_tw"`; the TW name plate uses a second character id.
- A language row gotos a tiny setter label (`set_tw` = `[set, goto start]`). Option-level `set` + `goto` on the same option is unreliable — the flag can fail to apply before the jump.
- Compound conditions are undocumented: clone the label instead and split arrivals with two stacked gotos.
- **Audit every CJK string after writing.** Unicode-escape slips produce plausible-looking wrong characters — nine of them survived one pass. Dump every `if: "lang_tw"` string through the embed URL and read them back.
