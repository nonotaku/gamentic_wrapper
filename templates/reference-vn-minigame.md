# reference-vn-minigame — a thirty-second interaction inside a fifteen-minute story

Shared reference for any VN on Gamentic that wants the player to *do* one beat by hand instead of picking it from a menu. Pointed at by the genre templates; holds no genre content of its own. Proven once, on `g96d22c` (Tea with the Godmother, the ledger scene) — treat each ⚠ as a scar.

Two words carry this file. The **host** is the object the runtime hands you when your minigame starts — canvas, context, logical size, and the one function that hands the story back. A **beat** is the story moment your minigame replaces; the game is that beat done by hand, and it should be judged as a beat, not as a game.

---

## The runtime already has this

**Do not build an overlay.** The VN runtime carries a first-class `minigame` script command. A game on this platform shipped a whole overlay harness — its own rAF loop polling the label, capture-phase listeners with `stopImmediatePropagation`, hand-rolled hand-back — because its author did not know. The command does all of it:

```json
{ "cmd": "minigame", "key": "ledger", "win": "p2_clean", "lose": "p2_caught" }
```

```js
window.GI_MINIGAMES = window.GI_MINIGAMES || {};
window.GI_MINIGAMES.ledger = function (host) {
  // host = { canvas, ctx, W, H, done }
  // paint on host.ctx, listen on host.canvas, then host.done(true|false)
};
```

While `S.mg` is set the runtime **stops drawing and stops listening** — `advance()`, `onDown` and `keydown` all return at once — so the canvas and the input are yours with nothing to fight. `done(ok)` clears `S.mg` and `goto`s `win` or `lose` (omit both and the script simply continues). An unregistered key `console.warn`s and skips the beat rather than hanging the game. `window.__vnMgDone(ok)` is the runtime's own QA hook: it forces the current minigame to finish either way, so a path walk can cross a minigame without playing it.

Register from a `src/` file loaded after the marker blocks (`<script src="src/minigames.js">` before `</body>`, never in `<head>` — the validator rejects a `src/` script that runs before `GAME_CONFIG`/`GAME_ASSETS` exist).

## Coordinates: the host's, not the canvas's

⚠ **`host.W` / `host.H` are logical sizes, and `W` is not 960.** The runtime pins `VH = 540` and lets `VW` follow the window's aspect (480–1920), then draws through `setTransform(DPR…)`. So every position in a minigame is a fraction of `host.W`/`host.H`, hit-testing divides pointer coordinates by the canvas's client rect into that same logical space, and `cv.width` — device pixels — is never used for layout. The overlay game mentioned above laid out in `cv.width` and every hit target drifts on a hi-DPI screen. The runtime's own comment on the same trap: *cv.width 係裝置像素,但成套版面用緊邏輯尺寸(VW/VH)*.

## Two scars in the shared context

- ⚠ **Leave the 2D context as you found it.** A minigame on this platform once returned with `textAlign = 'center'` still set, and the VN's dialogue spawned half a line to the left for the rest of the run — the runtime only sets alignment on the choice branch and inherits whatever it was left. Wrap every frame in `save()`/`restore()` and set `textAlign`, `textBaseline`, `globalAlpha`, `lineCap`, `lineJoin` explicitly at the top of the frame.
- ⚠ **Hold the `S.mg` object you were started with, and stop when it changes.** If anything else ends the minigame — the QA hook, a reload, a second minigame — your rAF loop must detach rather than keep painting over the story. `if (VN.S.mg !== MYMG) { detach(); return; }` at the top of the loop.

## You cannot see it, and neither can the owner

- ⚠ **A hidden browser pane freezes `requestAnimationFrame` and reports a 0×0 canvas rect**, so from a probe your loop never runs and synthetic pointer events never reach it. Ship two headless hooks that mirror the runtime's own `__vnStep`: `__X_STEP(dt, n)` (advance `n` updates and draw one frame) and `__X_POINT('down'|'move'|'up', x, y)` (feed logical coordinates straight into your handlers). With those, the whole scene — every outcome, every flag write — is verifiable from a script. Without them it is not verifiable at all.
- ⚠ **Ask for the owner's screenshot on version one.** The first ledger build laid out a code-drawn silhouette, floating page tabs and a shelf of twelve tiny cups from geometry alone; the owner's verdict was *totally don't know what is doing here*, and every fix that landed afterwards came from a screenshot. Treat the first screenshot as part of the build, not as feedback on it.

## Design rules that survived contact

- **Open on a full safe window.** The first version opened on the warning phase; the player was caught three times before reading the instruction line. The player has to be able to read the one line of instruction and get a hand on the thing before the first threat.
- **The thing the hand holds moves 1:1 with the hand.** Anything else reads as broken. Put difficulty in *how far* it must travel and *how much progress survives letting go* — never in a speed cap.
- ⚠ **Difficulty knobs must not interlock.** A speed cap plus a partial spring-back on release produced a page that reached 98% every safe window and never freed: the cap bounds progress per window, the spring-back takes a fixed fraction back, and the two meet at an asymptote below the finish. Test the *best possible* play against the *longest* the scene lasts before shipping either knob.
- **The clock is a thing in the room, not a bar.** Twelve cups being righted one by one is the ledger scene's timer; there is no bar and no number anywhere on screen. Whatever counts down should be something she is doing.
- **Only motion and touch give the player away.** A page pulled halfway and released *rests* — it is part of the book again. Punishing a resting state makes letting go feel useless, and letting go is the whole skill.
- **Failure is a line, not a screen.** She says one thing per catch and closes the book on the third; the scene then routes to an out-label like any other beat. See the genre template for the voice rules; the mechanism here is only that `done(false)` lands on a label with prose, never on a retry.
- **Write flags once, at the end, derived.** `page1`/`page2` are set only on a full pull; `pages` is *computed* from the booleans at hand-back, never incremented — so it can never double-count against a flag the player earned earlier. `catches` and `seen` are written the same way. One write, before `host.done()`.

## The worked example — the ledger scene

Chapter two of `g96d22c`. She leaves the ledger open and turns to right the twelve cups on the shelf; you pull the loose pages out while her back is turned.

- **Cycle:** chime + cup *i* flips upright + a shadow sweeps across the book (warning ≈0.55s, shrinking) → she turns (0.9s; her real sprite swaps from `char_gm_back_b` to `char_gm_calm`) → back turned (safe). Twelve cycles, ≈40s.
- **Pull:** press the torn corner poking out of the book's edge, drag; the page follows 1:1 and its fragment text is revealed on the paper as it emerges. Release and it slides back to `keep × best` and rests. Full pull = `ledgerPullDist × W`; `ledgerKeep` is the resting fraction. Both are inspector knobs.
- **Caught:** a hand on the book, or a page still moving, at the instant she turns. `favor −5`, one line from her, 1.3s freeze. Third catch: she closes the ledger.
- **Ends on** every page taken · the twelfth cup · the third catch · the 「收手」 button.
- **Hands back to** `p2_clean` (0 catches → `p2_take` if any page, else `p2_none`) or `p2_caught` (`p2_shut` on three, else `p2_seen`); all four continue to `ch2_out`.
- **Difficulty as shipped:** a steady hand takes both pages by the second cup — the defaults are gentle on purpose; the owner tunes `ledgerPullDist` / `ledgerKeep` in the inspector.
