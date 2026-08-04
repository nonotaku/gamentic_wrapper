# reference-runtime-surfaces — what each serving surface forbids

Measured 2026-08-04 with the standing probe rig `g8bb0c7` (PROBE RIG: every verdict prints on-screen, so one screenshot — or one innerText read — re-runs the whole audit). Four routes, two different games, identical wrapping: these facts are game-type-independent, VN included.

**The iron rule: the dev harness is MORE permissive than production.** Every player route (`/play/<id>` page iframe, `/play/<id>/embed`, `/api/games/<id>/embed`, even opened top-level — the CSP header travels with the document) serves the game sandboxed `allow-scripts allow-pointer-lock allow-downloads`, with no `allow-same-origin` and no `allow-modals`. The harness (`playtest_screenshot`, HeadlessChrome at `gamentic.test`) has no sandbox at all — so a passing playtest proves nothing about the THROW rows below.

| Probe | Harness | Production (all player routes) |
|---|---|---|
| `localStorage` / `sessionStorage` / cookies | OK | **THROW SecurityError** (opaque origin — the getter itself throws) |
| `confirm` / `alert` / `prompt` | auto-dismissed ~5ms, cancel-values | suppressed ≤1ms, cancel-values |
| canvas `getImageData` / `toDataURL` after drawing `media/` art | OK, untainted | **THROW SecurityError** (tainted) |
| `audio.play()` before first gesture | BLOCKED (`AudioContext` suspended) | BLOCKED (unlocks on `pointerdown`) |
| `media/` images | load + render | load + render (`?t=` cache-buster per serve) |
| `img.decode()` | resolves | resolves |
| `img.complete` read in the creation tick | false | false |

Build consequences, one line each: design every session completable with storage throwing (try/catch, silent fresh-run fallback) · dialogs in-DOM only · pixel proof production-side = fetch the PNG and read byte 25 (colour type 6 = RGBA) · gate boot behind a click and register every sound at init.

**Quirks that belong to a tool, not the platform:** "`img.decode()` always rejects" and "rAF frozen / screenshots time out" are the in-app browser pane only (a collapsed or backgrounded tab has `document.hidden = true`, so rAF stops — true of any hidden automation tab, including a real Chrome driven in the background). Confirm a frame counter is advancing before reading any render result as evidence.
