# reference-talent-tree — an icon talent tree that composes a loadout

**A shelf of proven shapes, not a mandate.** Column count, tier count, currency, theme — all free; every concrete number below is one game's instantiation (NEON BASTION tech tree, `gbe4dbe`). The bones that earned their keep, and the platform scars ⚠, are what this file carries.

## The bones (proven)

- **A fixed point budget** (exposed as a knob) spent on **parent-gated columns** — each node requires the one above it, so a column is a commitment, not a shopping list.
- **Icon nodes with hover tooltips** (name · cost · effect · requirement) — the "talent tree look" the owner asked for by name; a text-list tree reads as a settings page.
- **Ability lines, not stat lines.** NEON's own design note: *"every node changes what the skill DOES, so spending here rebuilds how you play rather than nudging a multiplier."* Passive percentages are filler between ability nodes, never the spine.
- **Skills live IN the tree**: active abilities are nodes, so the tree composes the player's loadout — spending points is building a kit, and two players' trees play differently.

## NEON's instantiation

3 columns (its skins: CONTROL / POWER / ORDNANCE, each headed by an icon) · ~5 tiers per column on a 900px canvas (measured: 5 nodes lay out to 461px with ~130px spare; **a 6th tier overflows — grow SIDEWAYS with a fourth column, never down**) · 21 generated node icons + 3 column icons · stage clears earn the point currency (RP), capped.

## Interplay with campaign difficulty

If stages scale against the tree power a player is EXPECTED to have, the tree and the difficulty curve are one system — the expectation curve and its rework warning live in `template-isometric-tower-defense.md` (§ Towers & economy); a tree rework that adds non-damage lines weakens that assumption, so revisit the curve there, not here.

## Scars

- ⚠ **Read the real CSS before any layout fix**: two rules for the same grid id can coexist and the LATER one wins — three "fixes" to the earlier rule changed nothing until the owner said *"read the real css first"*.
- ⚠ Generate node icons in batches and **wire each immediately** — an unreferenced asset is invisible and the platform warns on every subsequent edit, forever.
- Do the layout arithmetic (node size × tiers + gaps vs canvas height) BEFORE generating icons — icons for a tier that cannot fit are wasted credits.
