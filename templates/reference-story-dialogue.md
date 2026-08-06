# reference-story-dialogue — a story layer for an action game

**A shelf of proven shapes, not a mandate.** Take any subset, reshape any piece — nothing here is required, and every concrete value is one game's instantiation (NEON BASTION campaign story, `gbe4dbe`). The only hard lines are the platform scars, marked ⚠.

## The scene shape that worked

Two-character comms dialogue over a CG background: the player-side commander and the game's companion character, each in a portrait chip; **the speaker is lit, the listener dimmed**. Clicking anywhere advances one beat.

- The companion's portrait is the live rig crop (`reference-live2d-character.md`) — it blinks and lip-syncs through the scene for free.
- The player-side portrait is a **faceless** figure (helmet, hood, silhouette): no face means no drift, and the player projects themselves into it.
- A single-narrator version was built first and the owner rejected it as "too bored" — the second voice is what made the scenes carry.

## Beats

A beat is `[speaker, line, vo?]`; a scene is an array of beats plus an optional CG name.

- **Any beat may name its own scene; anything without one falls back to a default CG** — new art can be added a beat at a time and the story never shows a blank.
- Always skippable, and remembered as seen. ⚠ Storage throws in production (`reference-runtime-surfaces.md`) — "seen" needs an in-session fallback so a player who reloads is never trapped re-reading.
- ⚠ A new full-screen scene does nothing until its id joins the shell's screen list (`template-isometric-tower-defense.md` § Screens).

## Delivery cadence (NEON's instantiation — free to reshape)

- Comms-chip lines during play carry most beats; the full-screen dialogue scene is reserved for act boundaries (NEON: stages 1 / 5 / 8).
- Story lives in the authored campaign only — generated and endless runs stay clean.
- Writing voice, all skin: NEON used military-procedural with an occasional personal aside, the adversary as the system itself turned, and each stage mutator framed as the adversary answering your last win. Replace wholesale to fit your theme.

## Voice pipeline

- `generate_speech`, English lines (owner policy: voice stays EN; text translates — `reference-canvas-i18n.md`). One line per call, no batch, no audition — pick the voice from the bare roster names and let the owner's ears judge the result; say so plainly.
- ⚠ **A recording cannot say `{n}`.** Templated lines (wave numbers, muster names) stay text-only BY DESIGN — split every channel's pool into voiced fixed lines + text-only templated lines. Once-per-run beats (greeting, victory, defeat) are voiced-only so they always speak; repeating channels mix with a voiced bias (~0.7).
- ⚠ **`generate_speech` returns no duration.** Measure it at runtime off the audio's `loadedmetadata`, and retime the mouth if a line starts before its header lands. The text formula (`0.9 + chars × 0.055`s) is FALLBACK ONLY — measured against real recordings it erred **+1.1s and −1.0s on adjacent lines**; never time a real recording with it.
- Voice is a single channel — a new line stops the last. Gate playback in order: audio unlock → `voiceLines` → volume. First `pointerdown` unlocks audio; the story screen's advance click doubles as the gesture.
- ⚠ Register every audio key at init; a lazily-added key needs its own `new Audio(GAME_AUDIO[k])`.
- Expose `voiceLines` (bool) so VO can be silenced without silencing text — and prove the wiring on-screen (`vo=key · dur · talk`); **audibility cannot be verified headlessly**, the owner's ears are the final check.
