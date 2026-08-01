# template-decision-court — v1

**Proven blueprint** distilled from *Sort the Court* (itch.io, 4.7★ / 10,857 ratings — analysis at `data/analysis/itch_sort-the-court.md`; genre sibling: *Reigns*). A binary-choice kingdom sim: petitioners ask, the monarch answers Yes/No, three resources shift, the city grows.

## When to use
"Ruler holding court" decision games: fantasy kingdom, space station commander, school principal, shop landlord — any skin where characters petition and one Yes/No moves an economy. One-input, mobile-friendly, joke-a-turn tone. Session 10–25 min, finite-but-generous content.

## Core state (iron numbers)
| Thing | Value | Why |
|---|---|---|
| `gold` | start **20**, floor 0 | spend fuel; hitting 0 forces poverty events, NOT death |
| `pop` (citizens) | start **5**, win at **≥100** | the progress bar of the whole game |
| `happy` | start **60**, range 0–100, **0 = revolt ending** | the only hard-fail stat |
| normal event delta | gold ±2–8 · pop ±1–3 · happy ±3–8 | felt but survivable |
| big-swing event | ±15–25 on one stat, **≤1 per day**, telegraphed by tone | the "oh no / jackpot" spike |
| day length | **6–9 petitioners**, then a day-transition card | natural session chunking |
| event pool | **≥48 events** across 12–18 recurring characters | recurrence = charm; StC's whole appeal is "oh it's YOU again" |
| quest chains | 3–5 arcs, 3–4 events each, flag-gated in order | gives the pool a spine |
| upgrades | 6–10 buildings; cost gold + pop threshold; each unlocks new event types | the reinvest loop that makes Yes/No feel like strategy |

## Event schema (all content is data, editable in the editor)
```jsonc
{ "id":"dragon_offer", "who":"dragon", "text":"I shall guard your gold... for a modest fee.",
  "yes": { "gold":-6, "happy":+4, "set":"dragon_hired", "reply":"The vault has never felt warmer." },
  "no":  { "happy":-3, "reply":"The dragon leaves. Something smells singed." },
  "if":"built_vault && !dragon_hired", "weight":2, "once":false }
```
- Every choice MUST change ≥1 stat or set a flag — no fake choices.
- `reply` line after every answer — the consequence is the punchline.
- Draw order: eligible quest-chain events first, else weighted random, no same character twice in a row.

## The three iron feel-rules (from StC's reviews)
1. **Consequences guessable but surprising** — ~70% of outcomes match intuition, ~30% subvert it; NEVER random-feeling punishment.
2. **Instant feedback** — floating `+3 🙂 / −5 🪙` numbers on answer, stat icons pulse; the stamp sound IS the game feel.
3. **One input** — Y/N keys, click, tap; everything else is automatic.

## Screens (game-screens compliant)
title (logo + Start + high-day record) → day loop (petitioner card + HUD: 🪙 gold / 👥 pop / 🙂 happy always visible) → day-transition (day N, net changes recap) → endings: **Revolt** (happy 0), **A Hundred Strong** (pop ≥100, win), **The Long Reign** (survive day 30 without either — neutral). All named, replay button.

## GAME_CONFIG (expose in schema)
`startGold, startPop, startHappy, winPop, dayLength, bigSwingScale (0.5–2), deltaScale (0.5–2), maxDays` — balance lives in config + event data, both user-tunable.

## Asset slots
- 12–18 character portraits (one base style via `character_sprite` consistency; transparent busts)
- throne-room bg (+1 "festival" variant), day-transition card art
- stat icons ×3, YES/NO stamp buttons
- audio: bgm_court (warm lute loop) + bgm_trouble (low-happy variant), sfx: stamp ×2 (yes/no pitched apart), coin, crowd-cheer, crowd-grumble
- Art recipe: `reference-vn-art.md` — the owner's style block verbatim at the start of every prompt, one block for characters, bgs and key art alike

## Writing rubric
- Petition ≤ 140 chars; reply ≤ 90 chars; humor from characters wanting *reasonable things badly* or *absurd things politely*
- Callbacks: later events reference earlier answers via flags ("The dragon you hired wants dental.")
- Never moralize a choice — consequences speak.

## Platform notes (Gamentic)
- NOT the VN runtime — custom vanilla-canvas loop per get_convention (GAME_CONFIG marker + schema), events in `GAME_DATA.events` (editable via read_data/write_data)
- Reuse the write_data field-by-field rule for object edits; chunked upload ≤3000 chars
- Shared platform traps, editing rules and verification route: **`reference-gamentic-platform.md`**. The two that bite this genre hardest: the **embedded-asset ceiling** (12–18 portraits plus backgrounds can reach it — `delete_asset` junk as you go and report headroom to the owner) and the **content-not-index rule** for script edits.
- Art prompting, style-block discipline and the identity rule: **`reference-vn-art.md`** — the portrait set is one canon original plus minimal-delta variants, same as any VN cast.
- ESRB E · genre "strategy"
