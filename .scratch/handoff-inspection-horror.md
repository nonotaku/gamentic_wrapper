# Handoff — Gamentic template-lab workstreams (2026-08-01)

For a fresh session in the repo root with the **mattpocock-skills plugin loaded**. The owner replies in **Traditional Chinese (HK)**; keep that.

> **Cross-machine note:** this copy lives in the repo (`.scratch/handoff-inspection-horror.md`) so it travels via git. On a machine where Claude's project memory is empty, the memory files referenced below have snapshots at `.scratch/memory-snapshot/` — read those instead, and treat them as the project knowledge base (asset refs, platform gotchas, owner decisions). Machine setup for resuming: see "Resuming on another computer" in `README.md`.

## Project in one breath
Local HTML5 game portal (`README.md`, runs at `http://localhost:4321` / backup `:4545`, start via `start-gamentic.bat`) + the **template lab** for the gamentic.net AI game platform: hit games are analyzed, distilled into technique packs under `templates/`, then proven by building real games on the game-inspector MCP. Repo: `https://github.com/nonotaku/gamentic_wrapper` (private, clean as of commit `0b5f36c`). Project memory auto-loads (see `MEMORY.md` index — esp. `tea-godmother-vn-template`, `abyss-healer-vn-plan`); `CLAUDE.md` + `docs/agents/*` define the local-markdown issue tracker (`.scratch/`), triage labels, and lazy domain-doc layout — all freshly set up and unused so far.

## State (reference, don't re-derive)
- **Proven skill**: `templates/template-dating-horror-vn.md` (v2 technique pack; §6 = hard-won platform recipes). Two shipped VNs prove it: `g96d22c` (Tea with the Godmother) and `gcc67a8` (Get Well Soon, private).
- **Speced, not built**: `templates/template-decision-court.md` (Sort the Court formula).
- **Untested by design**: `templates/technique-scene-backgrounds.md` (fg-plate / blur / parallax + review notes) — gated OUT of the skill until a sandbox test passes.
- Analyses live in `data/analysis/`; the portal itself is feature-complete and not the current focus.

## CHOSEN next workstream (owner decided 2026-08-01) — start here
**`template-inspection-horror`** — a new genre pack distilled from *That's Not My Neighbor* (doorman ID-check vs doppelgangers; itch 4.7★/1,582 on the free build, Steam/streamer-scale phenomenon; closed-source desktop → formula extraction only, like Buckshot). Lineage: Papers, Please; free web precursor *The Republia Times* at dukope.com for feel reference.

**The owner explicitly wants the PLAN produced through `/mattpocock-skills:grill-with-docs` — do NOT pre-write a game-plan file.** Research material for the grill: `data/analysis/itch_thats-not-my-neighbor__deep.md` (**full teardown** — system inventory, numbers, flow, template extraction, ready-made grill questions; the portal now has two analysis depths and this is the deep one) plus the quick brief at `data/analysis/itch_thats-not-my-neighbor.md`. Grill topics to surface (leads, not decisions): checklist-verification loop + daily shifts; numeric layer = mistakes/suspicion, route flags = who you admitted; ending ladder per template v3 §3; the platform's minimal-delta sprite pipeline as the doppelganger "spot the wrong detail" generator (unique advantage — but let the grill decide if it's v1 scope); whether the VN runtime + proven hotspot recipe carries it or it needs a custom loop; a possible Godmother-universe skin. Companion references: `templates/reference-vn-art.md`, `templates/reference-gamentic-platform.md`, `templates/template-dating-horror-vn.md` (v3 structure to mirror).

## Backlog, routed per ask-matt (owner picks; don't start unasked)
1. **Decision-court test game** — entry: `/mattpocock-skills:grill-with-docs` on the idea, then to-spec → to-tickets → implement (or straight implement if it stays small). Spec exists; the grilling should target theme/skin + scope.
2. **gcc67a8 cleanup & polish** — entry: `/mattpocock-skills:to-tickets` into `.scratch/get-well-soon/issues/`. The item list (13 junk embedded assets near the 15MB ceiling, bg_wrong half-done, missing close-up tier, title overlap, pending-publish mystery) is in memory `abyss-healer-vn-plan.md` — do NOT triage (self-created work).
3. **Scene-depth sandbox** — entry: `/mattpocock-skills:prototype` per `technique-scene-backgrounds.md` (a pending task chip "Scene-depth tech demo" may exist; either route works). Promotion into the skill only on a pass, owner judges screenshots.
4. **Next-template research** (survivor-like / press-luck duel candidates etc.) — entry: `/mattpocock-skills:research`.

## Suggested skills
- `ask-matt` — re-route if the owner brings a new situation
- `grill-with-docs` / `to-spec` / `to-tickets` / `implement` — the main flow for any build; keep grill→tickets in ONE context window, `/handoff` if nearing the smart zone
- `prototype` — the scene-depth test (throwaway; keep the answer, delete the code)
- `domain-modeling` — terms are starting to matter (e.g. "technique vs template", "distance tier"); CONTEXT.md doesn't exist yet, create lazily
- `diagnosing-bugs` — for anything broken that resists a first look

## House rules the fresh agent must honor
- **Any game build/modify → game-inspector MCP**, and read the PLATFORM skills first (`get_convention`, `get_skill("visual-novel")`, `game-screens`, `game-balance`) before writing anything — owner's standing rule.
- Billing: personal wallet (個人), ~13.2k credits; concept_art batches → owner picks art, always.
- **OpenArt is banned** (owner's rule; local krea2/krea-edit engines are fine — see memory note).
- Proven techniques only in `template-*.md`; untested ideas stay in `technique-*.md` until validated.
- The two shipped games are owner-facing products: never edit `g96d22c`/`gcc67a8` without being asked.
- Files in `templates/` and memory are the single sources of truth — extend them, don't fork new copies.

## First move
Ask the owner which backlog item to start (1–4 above), then enter through the routed skill. Nothing here is pre-authorized to build.
