## Verdict

**8.5/10 for template-reference value.** *That's Not My Neighbor* is the cleanest proof that the *Papers, Please* inspect-and-adjudicate loop compresses to a single screen and one binary choice: a visitor at a glass window, a stack of documents, approve or deny. Everything is data-driven — a resident roster, a catalogue of discrepancies, a survival-state ending selector — which is exactly the shape our two-layer template convention wants, and it fills a genre gap the local library has no entry for. It docks a point and a half because the phenomenon behind its 4.7★ (see Numbers) was streamer jumpscare theatre at Steam/YouTube scale, not mechanical depth, and because the *free itch build is a downloadable Godot desktop game, not HTML5* — you rebuild the loop, you don't embed it. Build on the loop; ignore the delivery.

## System inventory

**Player verbs** (one line each):
- Receive a visitor at the window — opens a **verdict beat** (one visitor inspected then judged; the session unit, reused verbatim below).
- Read the **Daily Visitor List** — the roster of who is expected.
- Open **the file** — the per-resident ground-truth dossier (photo, name, apartment, ID number), reused verbatim below.
- Inspect the **ID Badge** — the visitor's own document, forgeable on every pixel.
- Read the **Entry Request Form** / run the **Checklist** — states profession/purpose; can demand a missing document.
- Compare face and papers against the **tell table** — the catalogue of discrepancy types, reused verbatim below.
- Use **the phone** — the verification oracle: call the apartment; if the real neighbor answers, the visitor is an impostor.
- **Approve** (open door) or **Deny** (call the D.D.D., the Doppelganger Detection Department) — the verdict.
- Lock door — closes the beat, advances to the next visitor.

**Meters / resources / state:**
- **Survivor set** — which residents are still alive; the only persistent state; drives the ending. Reused verbatim below.
- **Strike ladder** — the false-rejection escalation counter (Nightmare). Reused verbatim below.
- Memory — the uninstrumented resource; no on-screen bar; recall of the roster is the meter. The only surfaced tallies are day-end.

## Numbers & balance

| Constant | Value | Flag |
|---|---|---|
| Release (itch) | Feb 15, 2024 | confirmed |
| itch build version | 1.2.0.2 | confirmed |
| Steam remake | v2.0, 2025, $2.99+ | confirmed |
| Session length | ~30 min | confirmed |
| Rating | 4.7★ / 1,582 ratings | confirmed |
| Campaign length | 7 days (itch) / up to 5 (Steam) | confirmed |
| Endings | 5 | confirmed |
| Selectable modes | 4 (Campaign, Arcade, Nightmare, Custom) + Tutorial | confirmed |
| Residents / roster | ~20 | inferred |
| Nightmare roster | ~20 | inferred |
| Day-end rank scale | S–F | inferred |
| Nightmare: undetected impostor | instant game over | confirmed |
| Nightmare: false-reject strikes | 2 (Entity → attack) | confirmed |
| Nightmare achievements | 8 (incl. Collector) | confirmed |
| Languages | EN, ES-LA, ZH | confirmed |
| Anomaly categories in tell table | ~10–12 | inferred |
| Visitors per day | ~8–15 | inferred |

## Flow & screens

Boot → title/menu → mode select (four tiles + Tutorial; see Numbers). A **shift** is an ordered list of **verdict beats** with the door locked between them; there is no mid-shift save — a run *is* a shift. **Campaign** chains day-shifts (see Numbers) into a persistent run; between days a results screen tallies impostors caught / neighbors killed / impostors admitted and issues a day-end rank. The **survivor set** carried across days selects one of the 5 endings on the final day. **Arcade** is one endless shift with punishment deferred to shift-end. **Nightmare** raises tell subtlety, kills instantly on any admitted impostor, governs false rejections through the **strike ladder**, and terminates in a card game against the Nightmare Clown that must be won to complete the run. Replay loop: Campaign is ~2h and re-run for all 5 endings / rank-S; Arcade, Nightmare, and Custom are the infinite layer; the jumpscare-on-failure is the retention hook.

## Presentation as mechanics

- Each resident is a fixed-scale hand-drawn bust framed in the window, so the player memorizes a canonical face and reads deltas — the art *is* the photo half of **the file**.
- Difficulty is an art parameter: Arcade entries in the **tell table** are gross (brown-vs-blue eyes, a missing mustache); Nightmare entries shrink to a barely-visible horn tip or a wrong tattoo. Same table, finer rendering.
- Body-horror entries (neck stitching, blood around the eyes, a half-hidden extra arm) reward close looking and double as dread beats — the reward for scrutiny is also the scare.
- Failure and payoff share a frame: admitting an impostor plays the kill/jumpscare that *also* ends the run — punishment channel and horror content are one event.
- The Entity — a purplish face with hollow eye sockets and a gaping mouth — renders the **strike ladder**: it appears on strike one, attacks on strike two.
- Audio is quiet-doorman ambience punctuated only by the phone ring and the attack sting, so the sting lands.

## Why it works

1. **One decision, fully legible.** The player always knows the win condition (spot the difference against **the file**) and always feels the loss was fair (the tell was there) — the *Papers, Please* fairness contract minus the bureaucracy.
2. **Memory is the meter.** No visible resource; the resource is recall of the roster, so mastery is felt rather than displayed and every correct call feels earned.
3. **Streamer-shaped failure.** Deferred punishment (Arcade) lets creators build dread; instant punishment (Nightmare) delivers the on-camera jumpscare. The free, frictionless itch build means the rating count (see Numbers) is the *residue* of a Steam/YouTube phenomenon, not its cause.

## Template extraction

Target file: `template-inspection-horror.md`. Reuse the bust-sprite + expression-swap workflow from `reference-vn-art.md`.

**Numeric layer (GAME_CONFIG, defaults):** `residentCount: 20`, `visitorsPerDay: 12`, `dayCount: 7`, `impostorRate: 0.35` (ramp 0.3→0.6 across days), `tellSubtletyByDay: [1,1,2,2,3,3,3]` (eligible tell-table tiers), `falseRejectStrikes: 2`, `rankThresholds` (S–F cutoffs on the day tally), `instantDeath: false` (Arcade) / `true` (Nightmare).

**Route flags (named, with setter):** `neighborsAlive[residentCount]` — bitmask; a bit clears when an impostor of that resident is admitted; drives ending selection. `dddFalseCalls` — increments on denying a real neighbor; feeds the strike ladder. `entityAngered` — true once the strike ladder hits 1. `endingReached` — one of `MODEL_EMPLOYEE` (no deaths), `JUST_LIKE_HENRY` (≥1 alive), `CONSPIRACY` (only the doctor dies), `SIX_FEET_UNDER` (admit everyone), `ONE_CALL` (reject everyone); set on the final day from the **survivor set**. `vipSeen[]` — flags special visitors for unlocks.

**Interaction verbs to build:** show visitor; open/drag document; compare field; phone-verify; approve; deny; lock. Mouse/tap-only.

**Art asset list (counts):** ~20 canonical resident busts; ~1–2 impostor variants each (~40 sprites) via expression-swap (wrong eye/brow/mole); 4 document templates (Daily Visitor List, File Folder, ID Badge, Entry Request Form); 1 desk/window background; 1 Entity face + 1 attack/jumpscare frame; ~5 SFX (phone, stamp, door, sting, ambient).

**OUT OF SCOPE (v1):** the Card game / Nightmare Clown; Custom Mode editor; the parallel Nightmare roster; achievement system. Ship Campaign polished, alone.

**Open design questions (for a grilling session):**
1. Data-driven **tell table** or hand-authored per-visitor scripts — which one keeps variants cheap?
2. Default mode: deferred punishment (Arcade) or instant jumpscare (Nightmare)?
3. With OpenArt banned, can expression-swap alone hit ~40 "same face, one wrong feature" sprites, or must we cut the roster?
4. Is memory the meter, or do we surface a visible checklist HUD (easier, less pure)?
5. Are 20 residents memorizable in one session (see Numbers), or cut to ~10 for mobile?
6. Bilingual EN/zh-TW: does name-misspelling-as-tell survive translation, or do we go visual-only?
7. Endings: full `neighborsAlive` bitmask, or a 3-tier survival simplification?
8. Phone: real per-resident logic, or a single "call = truth reveal" abstraction?

**Local-library comparison:** closest tonal sibling is **A Dark Room** (minimalist, dread-driven, decision-led — but text-idle, not character-scrutiny); **Cube Composer** shares the read-the-rule-then-satisfy-it legibility. Nothing else (2048, Hextris, Astray, Clumsy Bird, T-Rex Runner, Pac-Man Canvas, Canvas Tetris, Onslaught! Arena, Radius Raid, Underrun) has a judgment/inspection loop — there is no in-house runtime to crib, so this is a from-scratch loop with borrowed art tooling.

## Sources

- Fetched — [itch.io store page](https://nachogames.itch.io/thats-not-my-neighbor): format, engine, accessibility, languages, rating, session length, release, versions.
- Fetched — [ScreenRant, How To Catch Doppelgangers](https://screenrant.com/thats-not-my-neighbor-how-to-catch-doppelgangers/): documents, ID-badge forgery, phone logic.
- Fetched — [ScreenRant, Nightmare Mode changes](https://screenrant.com/thats-not-my-neighbor-nightmare-mode-changes/): instant death, strike ladder, the Entity, card game, achievement count.
- Search summaries (direct fetch blocked 402/403/451, corroborated) — [Dot Esports campaign endings](https://dotesports.com/indies/news/all-thats-not-my-neighbor-campaign-mode-endings-and-how-to-get-them) (5 endings + conditions); [Fandom Campaign Mode](https://thats-not-my-neighbor.fandom.com/wiki/Campaign_Mode) and [TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/ThatsNotMyNeighbor) (day count, roster size).