# 01 — Settings panel: the close button is jammed against the language row

Status: ready-for-human
Owner finding: "setting ui little bug"
Shipped: g96d22c v279

## Diagnosis

Measured from the `overlay(ctx, W, H)` block in `game.html`. Panel height is fixed at `ph = 250`, and the rows stack:

| element | top | bottom |
|---|---|---|
| divider | `py + 54` | |
| Music slider | `py + 86` | |
| Sound slider | `py + 130` | |
| Language pills | `py + 176` | `py + 204` |
| Close button | `py + 206` | `py + 236` |
| panel edge | | `py + 250` |

**2px between the language pills and the close button, 14px below it.** The button is not escaping the panel — it is crushed against the row above while the frame below it goes unused. 250px is one row short for four rows.

## Decision

Give the panel room and centre the gaps. Raise `ph`, and derive the close button's y from the last row rather than from the panel edge (`py + ph - 44` is what couples it to the wrong thing).

## Acceptance

- Even breathing room above and below the close button, in both languages.
- Panel still fits a short viewport: `ph` is compared against `H` before use.
- Sliders and pills still hit where they are drawn — `HOT` rects come from the same numbers as the draw.

## Comments

**2026-08-01 — shipped as v279.** `ph` 250 → 288, and `HOT.close` now takes `y` after a `y += 54` step instead of `py + ph - 44`.

Layout read back out of the live source:

| | top | bottom |
|---|---|---|
| Language pills | 176 | 204 |
| Close | 230 | 262 |
| panel | 0 | 288 |

Gap above the close button 26px, gap below 26px — symmetric, where it was 2px and 14px. Panel still clears the 540px canvas. Hit rects are structurally safe: `pill()` returns the rect of what it just drew, so draw and hit-test cannot diverge.

⚠ **Verified by arithmetic, not by eye.** The browser pane was collapsed for this session, so `requestAnimationFrame` was frozen and no screenshot was possible (see `reference-gamentic-platform.md`). Numbers confirmed; appearance still needs the owner.

