# PLATFORM-BUGS — for the platform team (from the template blind tests, 2026-08-05)

Found while fresh agents built COGSPIRE `g3ddaec` and WYRMWARD `g6ead49` from
`template-isometric-tower-defense.md`. Tooling bugs, not template content — fix server-side,
then delete the entry (and the file when empty). Items 1–3 reproduced in BOTH builds.

1. **`list_assets` wire-scanner greps only `game.html`.** A game whose draw code lives in
   `src/` files gets every image and audio key flagged "generated but never used" even while
   screenshots prove them on screen — 14 wired images + all audio false-flagged in one build,
   and the warning repeats on every subsequent edit. Scan the whole file set the game serves.

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
