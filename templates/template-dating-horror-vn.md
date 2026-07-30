# template-dating-horror-vn — v1

**Proven blueprint** distilled from *How to Date an Entity (and stay alive)* (itch.io, 4.7★ / 1,389 ratings — see `data/analysis/itch_1i76fbh.md`), with code patterns cross-referenced from `games/anxiety` (ncase, open source). Built ON TOP of the Gamentic `visual-novel` runtime — you write ONLY `GAME_DATA`, never a dialogue engine.

## When to use
Dating-sim × horror VN: "survive the date with an entity", monster romance, analog-horror narrative. One run 12–20 min, replay-to-collect-endings.

## Core state (iron numbers)
| Thing | Value | Why |
|---|---|---|
| `favor` (hidden Interest meter) | flag, **START = 50**, range 0–100 | the single driver of everything |
| polite / safe choice | **+5** | teaches the meter exists |
| bold / flirt choice | **+12** (or −12 when mistimed) | risk-reward spike |
| catastrophic choice | **−25**, always telegraphed by tone | the horror lever; pair with `shake` + `sfx_sting` |
| truth pages (`page1..3`) | 3 collectible flags | secret-ending currency (HTDAE's "endings as collectibles") |
| chapters | 3 × 8–12 beats | 12–18 min run |
| choices per chapter | 2–3, **every one sets/adds something** | platform rule: choices must have consequences |

## The meter is NEVER shown as a number
Entity "tells" instead (HTDAE's key trick):
- favor ≥ 65 → swap sprite `char_gm_pleased`; favor ≤ 30 → `char_gm_hollow` + `bgm_tension`
- catastrophic pick → `shake` + `sfx_sting` + background swap to `bg_wrong`

## Ending resolution — evaluate IN THIS ORDER (flags before bands)
```
pages>=3  → The Thirteenth Page   (secret)
favor>=80 → Woven into Her Tales  (obsession bad-romance)
favor>=60 → The Godmother's Favorite (true ending)
favor>=35 → A Guest Remembered    (neutral)
favor>=15 → Fled into the Night   (escape)
else      → Devoured              (failure)
```
6–10 endings, ALL named + 1-line epilogue + "X of N endings" replay hint. Never bare "Game Over".

## Runtime contract (Gamentic)
- Shell: `GAME_CONFIG {textSpeed}` + `GAME_ASSETS/GAME_AUDIO/GAME_DATA` markers + `// __GI_VN_RUNTIME__`
- Title & result screens = script labels (`title` menu with Start / About; per game-screens skill)
- `GAME_DATA.theme`: storybook look — `boxImage` = generated lace-frame `ui_dialogbox`, parchment palette
- Assets: 3 character variants (neutral/pleased/hollow — `character_sprite` with `baseImage` for consistency), 2 backgrounds (normal + "wrong" variant), title key art
- **Proven art recipe v2** (user-validated on g96d22c, 2026-07-29, after 7 concept rounds):
  - **Design language** (modelled on HTDAE's "Mrs"): beautiful mature woman — narrow sleepy half-closed eyes, gentle blushing smile *a little too warm to be safe*, ONE blood-red accent against a muted palette (red ribbon at the lace collar + red lining hidden inside the black hair), horror restrained to a faint third-eye hint; the `hollow` variant opens the third eye and kills the smile. Anime facial proportions are FINE — what the user rejects is *polish*, not anime.
  - **Style keywords VERBATIM at prompt start**: `painterly, rough brushwork, visible brush strokes, dry brush, gouache style, matte flat colors, sketchy rough lineart, unblended shading, textured brush edges`
  - **Negative prompt**: generators here have no negative field — fold it in as a suffix: `— avoid: photorealistic, photo, elderly, wrinkles, 3D render, polished, clean lineart`
  - **Workflow**: `concept_art` batches of 4 → user picks → `import_asset` the picked ref as the base sprite (no re-roll = exact fidelity) → krea-edit expression variants from the same original.
  - **Cutout gotcha**: a pale/textured concept background makes the keyer eat pale FACES. Fix: krea-edit `change the background to pure flat white` first. Do NOT use a green screen — sheer fabric (veils) picks up a green tint.
  - **Prompt traps** (krea2): `visual novel character sprite` / glam adjectives → polished anime; `character sheet` → hallucinated photo insets; `mature female` alone → elderly. Reference-image-driven redesign (user pastes screenshots of the target look) converges in 1–2 rounds; blind style words took 5.
  - **Restyling title/bgs to match a new sprite**: krea-edit img2img, NOT fresh generation — title from the character's own original (`make the same character seated at …` keeps identity; a square title cover-crops fine on the VN canvas), backgrounds from the existing approved bg (`make the brushwork rougher … change the curtains to deep blood-red` keeps composition). Carry the sprite's red accent into the environment (red curtains / red tea) so character + scenes read as one palette; bg_wrong is the one place overt horror belongs (veiled shadow figure, violet-black flames).
- Audio: `bgm_main` (eerie music-box waltz) + `bgm_tension` (dissonant drone), sfx `click / choice / sting / teacup`
- Balance lives in script data (editable in the 劇本 panel / `write_data`); `textSpeed` exposed in schema

## Writing rubric
- Choices read as PERSONALITY, not stat math; catastrophic options telegraphed by tone
- ≤60 chars per `say`; horror escalates through environment beats, not gore
- Branches re-merge (`goto` back) to keep content writable

## Bilingual support (EN + zh-TW, proven on g96d22c)
No runtime hack needed — the VN runtime's `if` works on EVERY command and choice option:
- Every say gets an EN twin (`"if":"!lang_tw"`) + TW twin (`"if":"lang_tw"`); TW gm lines use a second character id (`gmt` = same sprite, name 「教母」) so the name plate localizes.
- Title = a MAIN MENU, not dialogue: `start` is just [bg, bgm, choice] — no say lines before the menu (players read boot-into-dialog-box as unfinished). 6 if-gated options; the language row reads as a setting (`⚙ 語言 Language — 繁體中文` / `— English`) and gotos tiny labels `set_tw` / `set_en` (each = [set lang_tw, goto start]). Do NOT put `set`+`goto` on the option itself — execution order is undocumented and the flag can silently not apply; the label route is guaranteed. Localize `theme.logLabel` bilingually ("☰ Log／記錄 (L)").
- Compound conditions (`pages>=2 && lang_tw`) are NOT documented — for an option that needs lang + a flag, clone that one label for TW (`tw_t_join`) and split arrivals with two stacked gotos: `{goto tw_x, if lang_tw}` then `{goto x}`.
- Editing: `write_data` arrays/objects arrive JSON-stringified (bug) → bulk script surgery goes through `edit_game` find/replace on the pretty-printed GAME_DATA (6-space entries, 8-space fields; find must match exactly; ~30 edits ran clean). Scalar fixes via `write_data` paths.
- ⚠ ALWAYS audit CJK strings after writing (unicode-escape typos): open `/api/games/<id>/embed` in a browser (the play page iframe is cross-origin) and JS-dump every `if:"lang_tw"` text in one pass. Runtime exposes `VN.flags` / `VN.goto()` / `VN.S{label,line,who,choices,bg}` — set `lang_tw=true`, goto a label, and assert lines/choices without screenshots.

## Expression set + conversation beats (proven)
6 sprite variants: neutral / pleased / hollow (favor tells) + sad / angry / excited (beat swaps via `show` with explicit `pos`). Beat map that worked: excited→bold-choice reward; angry→refuse/insult/veil-lift/fled; pleased→flattery/gaze/good-end; sad→vulnerable truth/secret-end; hollow→devoured; restore neutral at merge labels. Generate variants from the SAME white-bg krea original with MINIMAL-DELTA prompts ("keep her EXACT same face shape, same narrow sleepy eye style … change nothing else") — describing big expression changes loosely (e.g. "eyes wide sparkling") makes krea-edit anime-ify/redraw the face.

## Entrance CG slideshow (proven)
Stand→walk→arrive→sit as 4 full-scene CGs played via `bg` swaps + one if-gated narration line per frame (player clicks through; bg auto-fades). Generation: each frame = an INDEPENDENT two-image compose (image1 = the SAME empty room bg, image2 = the character original) with the identity spelled out feature-by-feature in every prompt + "only one woman in the room". Do NOT chain-edit frames ("move her" duplicates the figure instead of moving it). Keep her mid-shot or larger (small faces drift off-model), pin scene props that must persist ("keep the tall silver candelabra…"), and pin screen side ("on the LEFT half of the frame") for continuity.

## v1 known limitation
Persistent endings-gallery across sessions needs a runtime extension (localStorage) — v1 shows the earned ending name + total-endings count in the result copy.
