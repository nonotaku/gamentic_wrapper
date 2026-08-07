# PLATFORM-BUGS — for the platform team (from the template blind tests, 2026-08-05)

Found while fresh agents built COGSPIRE `g3ddaec` and WYRMWARD `g6ead49` from
`template-isometric-tower-defense.md`. Tooling bugs, not template content — fix server-side,
then delete the entry (and the file when empty). Items 1–3 reproduced in BOTH builds.

1. **`list_assets` wire-scanner greps only `game.html` — and only literal member access.** A
   game whose draw code lives in `src/` files gets every key flagged "generated but never
   used" even while screenshots prove them on screen; and (08-06, third build) the scanner
   only matches literal `GAME_ASSETS.<name>`, so table-driven access (`A(k)`, `GAME_AUDIO[k]`
   loops — the correct pattern for a 50-asset game) false-positives ALL 48 assets with
   instructions that would rewrite working render code. Repeats on every call, cannot be
   dismissed. Scan the whole served file set and recognise dynamic access. (08-06, 3D build:
   since the convention MANDATES the multi-file layout, the audit is 100% false positives by
   design on every convention-following game — it flagged all 17 keys of a build whose art is
   visibly on screen.)

2. **Three contradictory size limits.** `create_game` rejects >5000 chars citing
   "unstable-connection mode" and tells you chunks ≤3000; `append_game_html`'s own schema says
   ≤8000 (≤4000 unstable) and its description ≤15000; `write_game_file` accepted 12k without
   complaint — and 18.5k in the second build. Pick one number per path and make every message
   quote it.

3. **`budget_status` misattribution.** Reported ~90 credits of recent spend as pre-create
   `concept_art` calls in a session that made no such calls. Either the attribution key or the
   session scoping is wrong; spend reports agents act on (budget guards!) must be trustworthy.

4. **Harness sandbox rollout is partial** (see `reference-runtime-surfaces.md`): as of 08-05
   the playtest harness suppresses dialogs, taints canvas and blocks cookies like production —
   but still allows `localStorage`, which production throws on. If the convergence is
   deliberate, finish it (storage too) so "passes playtest" finally implies "works live"; if
   it is not deliberate, someone changed the harness without announcing it.

5. **Account settings self-contradict on `concept_art`**: declared FORBIDDEN (OpenArt off) and
   PRIMARY (krea2 on) in the same settings block. Agents cannot tell which to believe.

6. **`edit_game` trips the platform's own "外部 URL" warning on every edit** of any game that
   used `generate_music` — the tool injects HOSTED audio URLs, then the self-containment
   linter flags them forever. Either inline the audio or teach the linter the platform's own
   hosts. (This also explains the persistent warning on `gbe4dbe` all session.)

7. **`get_skill("live2d")`'s injected runtime defaults its canvas to `#stage`** — the exact id
   the fixed-stage display pipeline owns in shell-based games — and `generate_live2d_rig`'s
   `next` field sends every caller there ("get_skill(\"live2d\") NOW"). Following both
   platform instructions verbatim hijacks the game's display pipeline. Make the runtime
   require an explicit canvas id, or at least not default to `#stage`. (Found 2026-08-06
   during the ORISS blind build on `g6ead49`.)

8. **REVERSED by measurement (08-06, rig `g891f14`): the media endpoint NOW serves CORS.** `crossOrigin='anonymous'` loads AND uploads to WebGL (response `type=cors`); only a load WITHOUT the attribute still dies at `texImage2D`. Remaining actions: (a) Tank War 3D's in-source `applyTex` scar comment ("textures MUST be inlined data URIs") is now STALE and teaches every remixer a pointless base64 pipeline — update or annotate it; (b) note the symptom for docs: the failure mode is pure-black lit surfaces, never an error page.

10. **`__GI_LIB_THREE__` is an undocumented convention with a misleading sibling.** Owner
    clarified (08-06): the marker is a LABEL — the AI supplies three.js itself and delivers
    it via MCP; no injection exists or is planned. But `__GI_LIVE2D_RUNTIME__` IS
    server-injected ("do NOT write the runtime yourself"), so four independent measurements
    all guessed injection and filed this as a broken feature. Fix is documentation: state the
    AI-supplies convention wherever 3D is mentioned (a `get_skill("3d")` would be the natural
    home), or implement injection for symmetry. Interim base: seed game `gaac970` (r160
    inlined + liveness probe) and the chunked raw-JSON-RPC upload procedure in
    `reference-3d-blockworld.md`.

11. **`review_asset` publishes no accepted `subjectPct` band — and the metric is alpha-cutout
    only.** Opaque-pixel measurement makes a tall thin subject (a figure with a banner pole,
    visually dominating its frame) measure 19.9%; an agent's honest 42% was rejected with
    "你多數冇真正睇過張圖" — an accusation of not looking, on a correct look. And for a
    `transparent:false` tileable texture the honest visual answer (100%) is auto-rejected;
    the "right" answer is the measured 3–7%. Publish the tolerance and the metric's meaning.

15. **A game cannot be renamed.** Editing `<title>` does not propagate to the library;
    `edit_game`'s `schema.title` names only the inspector panel; `set_genre` exists but no
    `set_title`. The only rename path is a full chunked re-upload — exactly what the seed
    workflow exists to avoid. Consequence: the first 3D game shipped with its library entry
    and cover banner reading "3D SEED - three.js inlined (base, not a game)".

12. **No schema-only update path.** `edit_game` requires at least one `edits` entry, so
    removing a dead knob from the inspector schema forces an unrelated carrier edit;
    `update_game` needs the full `html` the other tools warn against pulling.

13. **`validate_game` requires the full `html` even when `gameId` is supplied** — unusable on
    a multi-file game without the whole-file pull its sibling tools prohibit. Accept a
    gameId-only validation.

14. **`·` (middot) round-trips wrong through `read_game_file` → `edit_game_file`.** A find
    string copied verbatim from read output fails to match; agents fall back to ASCII-only
    substrings. Normalise encoding on one side or the other.

9. **`generate_speech` tooling gaps** (ORISS voice pass, 14 lines): (a) returns `kb` but not
   DURATION in seconds — every lip-synced consumer must measure at runtime and carry a retime
   path; (b) one line per synchronous call, no batch — 14 lines bumped 14 game versions;
   (c) no audition — the agent picks a voice blind and cannot hear the result on any surface;
   (d) the 8-name voice roster ("woman_calm"…) has no register descriptions. Also: the
   external-URL linter warning (item 6) names NO offending asset, so every unrelated edit
   reads as if it introduced the problem, and `playtest_screenshot` has no way to report
   that a sound was emitted — audio work is unverifiable end-to-end in the harness.
