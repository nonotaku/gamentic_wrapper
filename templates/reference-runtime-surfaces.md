# reference-runtime-surfaces — what each serving surface forbids

Measured 2026-08-04 with the standing probe rig `g8bb0c7` (PROBE RIG: every verdict prints on-screen, so one screenshot — or one innerText read — re-runs the whole audit). Four routes, two different games, identical wrapping: these facts are game-type-independent, VN included.

**The iron rule: never trust an allowance the harness grants — production revokes it.** Every player route (`/play/<id>` page iframe, `/play/<id>/embed`, `/api/games/<id>/embed`, even opened top-level — the CSP header travels with the document) serves the game sandboxed `allow-scripts allow-pointer-lock allow-downloads`, with no `allow-same-origin` and no `allow-modals`. The harness (`playtest_screenshot`, HeadlessChrome at `gamentic.test`) started with no sandbox at all and is **converging toward production day by day** — between 08-04 and 08-05 it gained dialog suppression (now logs `document is sandboxed… allow-modals not set`), canvas taint, and cookie blocking, while storage still works there. Re-run the rig before leaning on any harness-only allowance.

| Probe | Harness (drifting → production) | Production (all player routes) |
|---|---|---|
| `localStorage` / `sessionStorage` | OK *(still, as of 08-05)* | **THROW SecurityError** (opaque origin — the getter itself throws) |
| cookies | OK 08-04 → **THROW** 08-05 | **THROW SecurityError** |
| `confirm` / `alert` / `prompt` | auto-dismissed 08-04 → **sandbox-suppressed** 08-05 (console error) | suppressed ≤1ms, cancel-values |
| canvas `getImageData` / `toDataURL` after drawing `media/` art | OK 08-04 → **THROW** 08-05 (tainted) | **THROW SecurityError** (tainted) |
| `audio.play()` before first gesture | BLOCKED (`AudioContext` suspended) | BLOCKED (unlocks on `pointerdown`) |
| `media/` images | load + render | load + render (`?t=` cache-buster per serve) |
| `img.decode()` | resolves | resolves |
| `img.complete` read in the creation tick | false | false |

Build consequences, one line each: design every session completable with storage throwing (try/catch, silent fresh-run fallback) · dialogs in-DOM only · pixel proof production-side = fetch the PNG and read byte 25 (colour type 6 = RGBA) · gate boot behind a click and register every sound at init.

**Quirks that belong to a tool, not the platform:** "`img.decode()` always rejects" and "rAF frozen / screenshots time out" are the in-app browser pane only (a collapsed or backgrounded tab has `document.hidden = true`, so rAF stops — true of any hidden automation tab, including a real Chrome driven in the background). Confirm a frame counter is advancing before reading any render result as evidence.
