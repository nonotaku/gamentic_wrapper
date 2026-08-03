# Handoff: fix the sprite keyer-holes — Get Well Soon (`gcc67a8`)

**Task from the owner (2026-08-01): "fix the holes only, dont change the face."**
Success = the five `gm_*` sprites render with no see-through holes, and every already-visible pixel is bit-identical to today. Nothing else about the game changes.

**STATUS 2026-08-01 evening: DEFERRED by the owner — "mark down the current first and i will do it later." No path is approved; the game was NOT modified this session (reads + embed-console probes only). Do not start any candidate path below without a fresh explicit go from the owner.**

**⚠ Owner direction added 2026-08-01 (supersedes the old recommended plan): ALL work on this game goes through the gamentic browser editor or MCP only. No local tools/pipelines for game content, fixes, or fix-data — local Python hole-fill work was explicitly stopped and its files deleted. If the platform can't do something: record it as a platform lesson (`submit_feedback`) or redo the platform operation (`import_asset` re-key), don't work around it locally.**

## The defect, in three lines

The character's chest is painted near-white. gamentic's server-side cutout keyer mistakes those pixels for background when art is imported, deleting them → **transparent holes inside the body** (measured 2026-08-01: 6,970 enclosed px in gm_neutral, ~27k across all five, incl. the chest blobs ~630 px and a dot on the forehead). Over the dark bone-room scene the holes read as dark blotches. On a white background they are invisible — that is why art review never caught them.

## Current game state

- `gcc67a8`, **public**, content == v108 (all of 2026-08-01's art experiments were reverted at the owner's order; version counter ~145+).
- Live sprites (hue-matched set, FINAL, faces locked): neutral `asset:a68e5a012e8` · gentle `asset:ab43adf05fe` · worried `asset:a19db1a1cab` · hungry `asset:ae83d2c5339` · far `asset:aa5c161a823`.
- **The source assets behind all five live sprites still exist, `canEdit:true`, as JPG on flat white bg** (krea-edit outputs `neutral_fix`, `gentle_fix`, `worried_fix`, `hungry_fix2`, `far_fix`) — JPG has no alpha, so the "hole" areas are intact in the originals. `import_asset(url: "asset:…", transparent: true/false, sizePx)` can re-run the key-out from them. Test any re-key under a tmp GAME_ASSETS name first (then `delete_asset`), never straight over `gm_*`.
- Live sprites are 512×512 RGBA; live media == local backup bit-identical (sha256-verified 2026-08-01).
- Local backup: `C:\Project\gamentic\backup\get-well-soon_gcc67a8_2026-07-31\` (offline-playable, synced to v108 content).

## Facts that kill or enable each fix path (verified 2026-08-01)

1. **The game canvas is tainted.** `media/*` requests resolve cross-origin (CDN behind the API path), so `getImageData` on the game canvas OR on any offscreen canvas that drew a runtime-loaded sprite throws SecurityError. Pixel verification on the composited game frame is impossible.
2. **`crossOrigin='anonymous'` loads of the same `media/gm_*.png?t=…` URLs are CORS-clean** — a canvas drawn from such an image can be read. In-page pixel work IS possible via a CORS reload; verify in the embed page's console, not locally.
3. **Naive "fill every enclosed transparent region" is WRONG for these sprites.** It also fills the see-through gaps between hair strands / hair-and-body / armpit with smears — a large, obvious art change. Verified visually 2026-08-01. Never ship the plain holefill algorithm.
4. **Working discriminator (measured on all five sprites):** rim of a true keyer hole is predominantly light (the eaten pixels were near-white, their surviving rim continues light); hair gaps have dark rims. Rule: rim pixel = opaque(α≥40) 4-neighbour counted with multiplicity, "light" = r+g+b ≥ 450; fill a cluster iff light-fraction ≥ 0.74. Real holes measured ≥ 78% (chest 83–100%), intended gaps ≤ 69% — clean natural margin. Threshold survives canvas premultiply quantization noise (±1–2%).
5. `submit_feedback` is the platform's self-learn lessons system (topic + lesson), not a support ticket — right place to record the keyer gotcha.
6. Headless verification hooks (runtime-provided, survive regeneration): `__vnStep(n)`, `__vnRender(n)`, `__vnState()` on `https://gamentic.net/api/games/gcc67a8/embed`. Set `VN.S.fade=0` after `goto`; clear stale `S.choices`; `ch1_c` shows the actor (`pos` 0.68); actor draw is `ctx.drawImage(a.img, W*a.pos-iw/2, H-ih, iw, ih)` with `ih=H*0.8`. Sprite loading: runtime keeps `new Image()` per key in a closure `IMG` cache; `GAME_ASSETS` values are relative `media/<name>.<ext>?t=<token>`.

## Candidate paths (owner picks; none pre-approved)

- **A. Platform re-key test (owner's "redo the background remove"):** `import_asset` one original (e.g. `asset:a68e5a012e8`) into a tmp name, then in the embed console CORS-load the new media and count enclosed α<40 px. If the keyer still eats interior near-white → path dead, `delete_asset` the tmp. If clean → re-import all five over the real names (owner confirm first: a re-key can shift silhouette edge alpha vs the accepted-FINAL sprites).
- **B. In-game draw-time fix, 100% via `edit_game`:** JS after the runtime end marker: on first draw of a `gm_*` image, CORS-reload it, flood-classify, fill ONLY clusters passing the rim rule (fact 4), swap a repaired canvas in a `drawImage` wrapper. All traps below apply. Verify counts + bit-identity in the embed console.
- **C. Record the keyer lesson via `submit_feedback`** (can accompany A or B).

## Traps that already burned this task — do not rediscover them

1. **`/* __GI_VN_RUNTIME__ ... */` block is regenerated server-side on every serve.** Code placed inside it is stored, `edit_game` reports success, version bumps — and players never get it. Put ALL custom code AFTER `/* __GI_VN_RUNTIME__ end */` (where `VN_SKIN` / `__GWS_HS` live — those survive).
2. Diagnostic tell for trap 1: `GAME_CONFIG` (line ~7) is injected fresh at serve time, so config changes appear while the code beside them is missing.
3. **When wrapping `drawImage`, call the SAVED original inside your helper** (`var real = P.drawImage; ... real.call(g, im, 0, 0)`). Using the patched one recurses infinitely and hangs the game on the first sprite.
4. Do not build the repaired image with canvas composite modes (`multiply` + `destination-in`) — that path once blanked the sprites entirely. Write pixels via `getImageData`/`putImageData` on a CORS-clean copy; never touch alpha except hole pixels →255.
5. **Verify by executing, not by grepping the served HTML** — a string check said "hook installed" while the code was a stack-overflow bomb.
6. Hole test that settles it (game-canvas taint blocks pixel diffs there): verify at the sprite level in-page — CORS-load the sprite, classify enclosed clusters, and after any fix assert enclosed-after = 0 for filled clusters, non-filled clusters and all α≥40 pixels bit-identical.

## Owner constraints (hard)

- Face/art must not change — the matte-master fix was rejected with "it is not the same person" even though it was technically clean. Hair/armpit see-through gaps are ART — do not fill them (trap: fact 3).
- No uploading their art to third-party hosts (Higgsfield etc. — explicitly stopped).
- Browser editor / MCP only; no local tooling for game work (2026-08-01 order).
- Present the plan and get a yes BEFORE editing the game ([[intent-statements-need-confirm]]).
- The game is public — edits go live immediately; verify before walking away.

Delete this file when the fix has shipped and been verified.
