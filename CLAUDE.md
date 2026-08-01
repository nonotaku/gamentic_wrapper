# Gamentic Wrapper

Local HTML5 game portal + the template lab for the gamentic.net game platform. The portal itself is documented in `README.md`; game-template technique packs and game plans live in `templates/`, under three prefixes:

- `template-*.md` — a genre blueprint: flow, systems, numbers. Proven content only.
- `reference-*.md` — cross-genre production knowledge any template can point at (`reference-vn-art.md` for making art that survives regeneration, `reference-gamentic-platform.md` for runtime, editing and verification). Proven content only; a fact belongs in exactly one of these, and templates link rather than restate.
- `technique-*.md` — leads and experiment logs. Nothing here is guidance until a sandbox test passes; then it is promoted into a `reference-*` or `template-*` file and deleted from the technique file.

## Agent skills

### Issue tracker

Issues and specs live as local markdown under `.scratch/<feature-slug>/` in this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, default strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root, created lazily by `/domain-modeling`. See `docs/agents/domain.md`.
