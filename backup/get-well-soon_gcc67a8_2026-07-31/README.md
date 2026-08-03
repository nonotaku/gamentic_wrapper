# Get Well Soon — backup

**Game:** `gcc67a8` · https://gamentic.net/edit/gcc67a8 · https://gamentic.net/play/gcc67a8
**Refreshed:** 2026-08-01, at game version 145 (**public**, ESRB T, genre story)
**Folder name still says 07-31** — that was the first capture (v108). The old-capture mid sprites are also preserved in `media_pre-2026-08-01/`.

### 2026-08-01: a day of sprite experiments, fully reverted
Several attempts were made to fix the chest defect (matte-master sprite set, a tint layer, an in-game background keyer). The owner rejected the direction and ordered a full revert the same day. **Content now matches v108 again**: the five original hue-matched sprites are back (the four mid shots byte-match the original files; `gm_far` is the same source asset re-encoded), every line of added code was removed, and config/schema are character-identical to v108. Only the platform's version counter advanced (now 145 — it cannot be rewound).

---

## Open it offline

Double-click **`game-gcc67a8-offline.html`**. It is fully self-contained — every image, sound and both music tracks resolve to the local `media/` folder, so it plays with no network and no login.

`game-gcc67a8-live.html` is the untouched download. It is identical except the two music tracks still point at signed `gamentic.net` URLs, **and those tokens expire** — that is the only reason the offline copy exists. Keep both; the live one is the byte-exact record.

---

## What is in here

| Folder | Contents |
|---|---|
| `game-gcc67a8-offline.html` | Playable offline build (86 KB) |
| `game-gcc67a8-live.html` | Byte-exact download from the server |
| `media/` | 29 files, 7.6 MB — all art, sfx and music the game actually loads |
| `audio/` | The two music tracks pulled separately (also copied into `media/`) |
| `working/` | Source files used to build the game, see below |
| `docs/` | Game plan, the VN technique template, and the project memory file |

**The HTML contains everything that is not binary**: the full 51-label bilingual script (`GAME_DATA`), the theme, the injected VN runtime, my `VN_SKIN` title/menu skin, and the `__GWS_HS` click-hotspot system. Nothing about the game logic lives anywhere else.

### `working/`
- `upload2.html` — the last full build I chunk-uploaded (script + skin, no assets)
- `upload.html` — the same without the skin block
- `getwellsoon.html` — the original hand-authored source before flattening
- `skin.js` — the `VN_SKIN.choice` block on its own

---

## ⚠ What this backup does NOT contain

The gamentic **asset library** is behind a login — direct `gamentic.net/asset/<ref>` fetches return **403**, so I could only capture images that were injected into the game itself. These library masters are **not** backed up and exist only on gamentic:

| Purpose | ref |
|---|---|
| Pre-hue-correction neutral | `aafc9036f71` |
| Pre-hue-correction gentle (warm face) | `a65803b0616` |
| Pre-hue-correction worried | `acf3d52a78f` |
| Pre-hue-correction hungry — **owner liked this expression** | `a48e71a2824` |
| Pre-hue-correction far/full-body | `a2c5b668895` |
| Mid master before white-bg | `a9aa7b998b6` |
| Full-body master before white-bg | `a3d1d2e5573` |
| **3:7 proportion reference (tall2)** — proportion transfer only works by passing this as `refImage` | `a18872f302a` |
| D3 — the source of the approved face | `a283ac8764a` |
| Leg-anatomy reference | `ae9134e735f` |
| bg_sick before the roped door was added | `a2fed8ea938` |

To capture these, download them from a logged-in browser session (the gallery at https://gamentic.net/gallery) and drop them into `art/`.

Several intermediate versions *were* captured, because they had been injected as game assets — see `media/`: `neutral_fix`, `gentle_fix`, `worried_fix`, `hungry_fix`, `hungry_fix2`, `far_fix`, `neutral_matte`, `new_*_white2/3`, `regen_mid`.

---

## Known defects at the time of this backup

1. **White/dark patches on the chest** — present, and accepted by the owner for now (all 2026-08-01 fix attempts were reverted at their order). The true cause, established by alpha-channel measurement: the server's cutout keyer eats the near-white chest pixels, leaving small **transparent holes** (~645 px in the chest of `gm_neutral`) that show the dark scene through the sprite. It is *not* a painted highlight and *not* caused by any colour pass — the pale chest exists in the earliest master (`asset:a9aa7b998b6`), so no revert can remove it either. Lessons kept: measure the alpha channel before diagnosing "white patches"; check a defect's oldest ancestor before accepting a revert as the remedy; judge sprites composited over the real dark background, never on the white working background.
2. The main-menu image is still unsatisfactory to the owner (deferred by the owner).
3. `bg_wrong` only got the "lantern out" half — the "too many eyes at the window" never rendered.
4. No close-up distance tier — far and mid only.
5. Interaction is thin: 10 interaction points, and 9 of them are the same verb (pick from a list). Only `ch1_b` uses click hotspots.

## Restoring

The script and all code can be restored by chunk-uploading `working/upload2.html` (`begin_game_upload` → `append_game_html` ≤3000 chars per chunk → `commit_game` with the gameId). `commit_game` preserves injected assets automatically, so a full rewrite will not wipe the art. Art is restored with `import_asset` from either a library `asset:` ref or a URL.
