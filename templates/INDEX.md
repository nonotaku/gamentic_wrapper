# INDEX — templates staging area

One line per file: what it is, who consumes it, how it was validated. This folder stages the
gamentic server's skill registry (`get_skill`) — flat on purpose, because the registry is flat;
the `template- / reference- / technique-` prefix IS the folder structure. Definitions of the
three kinds: `../CONTEXT.md`. Routing rule for genre asks vs named-game asks:
`C:\Project\gametic\gamentic_gameskill_rewritten\INDEX.md`.

## Platform-general (every game, every genre)

| File | What | Validation |
|---|---|---|
| [reference-runtime-surfaces.md](reference-runtime-surfaces.md) | What each serving surface forbids (sandbox matrix, harness drift) | Measured by probe rig `g8bb0c7`, re-runnable in one screenshot |
| [reference-gamentic-platform.md](reference-gamentic-platform.md) | Editing, verification, storage, VN-runtime traps | v2 — live-build scars; three claims re-measured 2026-08-04 |

## Cross-genre (any canvas-shell game; genre templates point here)

| File | What | Validation |
|---|---|---|
| [reference-game-shell.md](reference-game-shell.md) | The DOM shell: display pipeline, register, menu/loader/settings/records anatomy | Distilled from NEON's shell; hardened by the WYRMWARD retrofit loop |
| [reference-3d-blockworld.md](reference-3d-blockworld.md) | Three.js blocks + 2D billboards world (no generated meshes); seed workflow, CORS truth, crowd recipe, harness perf caveats | Tank War 3D (shipped) + rig `g891f14` measurements + THE LAST PICNIC blind build (`gaac970`) |
| [reference-live2d-character.md](reference-live2d-character.md) | Rig generation → flat-part runtime → crop pattern | v2 — VESPER (`gbe4dbe`) + ORISS blind build (`g6ead49`) |
| [reference-story-dialogue.md](reference-story-dialogue.md) | Story layer for action games — **free to use, not a mandate** | Proven in `gbe4dbe`; voice pipeline validated by the ORISS voice pass |
| [reference-canvas-i18n.md](reference-canvas-i18n.md) | EN + zh-TW for canvas games (dictionary-by-source-string) | Proven in `gbe4dbe` full translation; no blind test yet |
| [reference-talent-tree.md](reference-talent-tree.md) | Icon talent tree that composes a loadout — **free to use, not a mandate** | Proven in `gbe4dbe`; no blind test yet |
| [reference-vn-art.md](reference-vn-art.md) | VN-family art recipes: identity/canon rule, prompts, camera grammar — **an optional art reference, nothing is gated on it** | Proven across the VN lineage (`g96d22c`, `gcc67a8`) |

## Genre blueprints (read when building that genre)

| File | Genre | Validation |
|---|---|---|
| [template-isometric-tower-defense.md](template-isometric-tower-defense.md) | Isometric tower defense | v9 — three blind builds (one max-scope, crash-resumed) + two blind retrofits + owner visual-QA rounds |
| [template-dating-horror-vn.md](template-dating-horror-vn.md) | Dating-sim × horror VN | v4 — shipped twice (`g96d22c`, `gcc67a8`); +3 rules & 2 optional reveal patterns from the 08-06 polish |
| [template-decision-court.md](template-decision-court.md) | Yes/No petition kingdom sim | v1 — distilled from *Sort the Court* analysis |

## Experiment logs (never uploaded; promote on proof, then delete)

- [technique-character-in-scene.md](technique-character-in-scene.md) — character-in-full-scene leads, partly resolved
- [technique-scene-backgrounds.md](technique-scene-backgrounds.md) — depth/layers/focus, untested

## Not for upload

- [PLATFORM-BUGS.md](PLATFORM-BUGS.md) — open tooling bugs for the platform team (8 items)
- [game-plan-abyss-healer-vn.md](game-plan-abyss-healer-vn.md) — one game's plan, VN lineage
- This INDEX (regenerate against the registry at upload time)

## Upload-day notes

- Skill name = filename minus `.md`; cross-file pointers rewrite from filenames to
  `get_skill("name")` at upload, not before.
- Upload `template-*` and `reference-*` only, and only validated versions; `technique-*`
  never ships.
- Trigger wiring lives server-side (the MCP instruction text) — adding a template to the
  registry without its trigger line means it never fires.
