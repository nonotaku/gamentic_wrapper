# template-dating-horror-vn — v2 (genre-flow skill)

**This is a TECHNIQUE pack, NOT a script.** Nothing below is canonical content — every example is illustrative. Reuse the FLOW, the SYSTEMS and the ART ECONOMY; invent the content fresh for each game. Informed by the market signals of *How to Date an Entity* (itch.io 4.7★/1,389 — `data/analysis/itch_1i76fbh.md`) and genre conventions; production recipes proven on `g96d22c` (Tea with the Godmother). Built on the Gamentic `visual-novel` runtime — you write ONLY `GAME_DATA`.

## When to use
Dating-sim × horror/mystery VN: "survive the encounter with an entity", monster romance, analog-horror narrative. One run 12–20 min, replayed for other routes.

---

## 1. Game-flow skeleton (the "always" structure)

```
Main menu → Prologue → First encounter → Interactive scenes ×N (status accumulates)
         → [route split] → Route scenes → Ending → Result screen
```

**Main-menu technique:** the `start` label = [bg, bgm, choice] ONLY — no dialogue before the menu (booting into a dialog box reads as unfinished, and the player reads narration-then-menu as "the game already started without me").
- **Rows: Start / How to play / ⚙ Settings** — and nothing else. Do NOT give language, volume or text speed their own rows: one row per FUNCTION, with everything adjustable living inside the Settings overlay (§6). A language row plus a language setting is the same function twice, and the menu is the one screen where duplication is most visible.
- **Every row must be reachable by mouse AND by number key** (1–9 picks the nth row). Costs three lines in the pick handler, and it is the only way an automated playtest can get past a custom menu — without it every later screenshot has to be faked by rewriting the script, which is how this project once hung the whole game (§6).
- The title screen needs a **wordmark** (game name + one-line subtitle) drawn above the rows — the menu bar alone reads as a debug UI. Make it language-aware along with the rows.
- Menu rows that set state must goto tiny setter labels, never `set`+`goto` on the option itself (see the bilingual pattern in §6).
- Keep the rows OFF the key art's focal point. The runtime centres them at 42% canvas height, i.e. exactly over a portrait's face; expose the geometry as config so the placement can be tuned per game (§6).

**Prologue technique (no fixed scenes — pick an APPROACH per game):**
- Purpose: establish who the player is and why they are here; set up the normal (or break it immediately). **The main character does NOT formally appear yet** — a silhouette, a voice, a shadow at most. Keep them withheld.
- Three technique families (pick one per game, invent the content):
  - **Arrival** — how you came to this place (a letter / moving in / getting lost / an invitation)
  - **Incident** — something shatters the ordinary and pulls you in
  - **Cold-open** — a dream / a flash-forward of an ending, then cut back to the beginning (suspense hook)
- Construction: 4–6 narration beats + 2–3 CG or bg transitions; **reach the point within one minute**; always end ON the threshold of the first encounter (a door, an empty chair, a shadow).
- Advanced: plant the first route flag inside the prologue ("what did you bring", "why did you answer the door") — the player starts writing their route before the character is even met. Proven shape: end the prologue on a choice of three, each option `goto`ing a tiny label that sets ONE boolean flag, says a single line, and re-merges into a shared "enter" label. On g96d22c: knock again / push the door open / step back into the trees → `via_knock` / `via_push` / `via_back`. The player has declared what kind of guest they are before the character exists on screen.

**First-encounter technique:** only after the prologue has set the stage does the character appear — and the appearance itself must be an EVENT (a CG or slideshow, see §6), never "the scene opens and they're just standing there".

---

## 2. Two-layer status system (technique, not fixed stats)

| Layer | What it is | What feeds it |
|---|---|---|
| **Numeric layer** | one affection/trust/fear value (rename per game) | mainly dialogue choices |
| **Route layer** | qualitative flags — "what kind of person you are to them" | mainly non-dialogue interactions |

**Interaction-verb techniques** (all implemented as choice menus; true click-hotspots are in the §7 wishlist) — mix 2–3 kinds per scene, never dialogue alone:
- **Dialogue choice** — the standard pick-one-of-three → feeds the numeric layer
- **Environment interaction** — "Where do you look? / What do you touch?" (her hand · the teacup · the window · nothing) → plants route flags
- **Learning** — asking questions, examining objects for information → knowledge flags that unlock later `if`-gated options (players discover "knowing more opened this choice")
- **Give / receive** — offering something, accepting or refusing what they hand you → mixed numeric + flag

**Wiring iron rule:** EVERY interaction must write something (`add` or `set`) — an interaction with no consequence is a fake interaction. Numeric changes must produce a visible reaction within two beats (§4).

---

## 3. Routes & endings — default SMALL

- **Default: one mid-game route split → 2–3 routes; ~2 endings per route (4–6 total).** Don't launch with many — extra endings are post-launch content patches, not launch scope.
- Resolution order: **route flags decide WHICH route** (qualitative) → within the route, **the numeric layer decides WHICH of its endings** (good/bad). Never carve all endings out of one numeric axis (single axis = the player feels they're "farming points"; branched routes = the player feels their choices shaped the story).
- Every ending: named + a one-line epilogue + an "X of N endings" replay hint. Never a bare "Game Over".
- Hidden ending (optional): a cross-route condition (e.g. all three knowledge flags collected) — one is enough.

---

## 4. Art economy — the choice must be SEEN

**Distance state machine (the core technique):** the character has three tiers — far (full body) / mid (waist-up) / close (chest-up) — all derived from the SAME approved original via minimal-delta krea-edit (identity cannot drift). A good choice → they step one tier closer; a bad one → they step back or turn away. **Distance IS the meter the player sees** — no number displayed, and nothing to guess.

- ⚠ **The tiers are made by BODY FRAMING, not by scaling.** The runtime draws every sprite at the same on-screen height, so "the same figure, smaller" is impossible from the script — and impossible from the generator too (asked for "55% of the canvas", krea returns ~95% every time). What actually changes the apparent size is how much BODY is in the frame: full body → small head → far; waist-up → close. Two full-body sprites intended as different distances render identically — that mistake is what made one entrance read as "the same picture sliding sideways". Mechanics and failure modes: §6 *Sprite staging & movement*.
- The expression set (6, see §6) is shared across all three tiers; a `show` with a new key + pos does the swap.
- **Per-scene art budget:** 1 bg (+1 "wrong" variant optional) + the tier set + 1 key CG at the scene's turning point ≈ **3–5 new images per scene**; everything else is reuse.
- **Feedback iron rule:** every meaningful choice produces a visible change within two beats (distance / expression / bg / prop / shake + sting). The player instantly knows "that one counted".
- Key CGs are reserved for major turns; ordinary beats use sprite swaps — CGs are the heavy accent, don't inflate them.

---

## 5. Numeric defaults (starting points — tune in the editor, not canon)

Numeric layer starts at 50 (conceptual range 0–100); safe choice ±5; bold choice ±12; catastrophic choice −25 (**always telegraphed by tone**, paired with `shake` + `sfx_sting` + the bg variant). 8–12 beats and 2–3 interactions per chapter; 3 chapters ≈ 12–18 min. Danger tells: below ~30 → hollow expression + `bgm_tension`; above ~65 → pleased.

---

## 6. Platform production recipes (PROVEN on g96d22c — keep these verbatim)

**Runtime contract:** shell = `GAME_CONFIG {textSpeed}` + `GAME_ASSETS/GAME_AUDIO/GAME_DATA` markers + `// __GI_VN_RUNTIME__`; title & endings are script labels; look-and-feel via `GAME_DATA.theme` (a square `boxImage` misaligns the text → build the box from theme colours instead). Balance lives in script data (edit via the script panel / `write_data`).

**Art recipe v2:** character = beautiful human FIRST, horror as detail (faint-third-eye level); style keywords VERBATIM at prompt start: `painterly, rough brushwork, visible brush strokes, dry brush, gouache style, matte flat colors, sketchy rough lineart, unblended shading, textured brush edges`; there is no negative-prompt field — fold it in as a suffix: `— avoid: photorealistic, photo, elderly, wrinkles, 3D render, polished, clean lineart`. Workflow: `concept_art` ×4 → user picks → `import_asset` the picked original as the base sprite (do NOT re-roll) → krea-edit variants from it. Prompt traps (krea2): `visual novel character sprite` / glam adjectives → polished anime; `character sheet` → hallucinated photo insets; `mature female` alone → elderly. Reference-image-driven redesign (user pastes target screenshots) converges in 1–2 rounds; blind style words took 5.

**Cutout:** a pale/textured source background makes the keyer eat pale FACES → krea-edit `change the background to pure flat white` first, THEN key. Never use a green screen (sheer fabric picks up a green tint).

**Expression variants:** same white-bg original + MINIMAL-DELTA prompts ("keep her EXACT same face shape … change nothing else"); loosely-described big expression changes make krea-edit redraw/anime-ify the face.

**Restyling environments to match a sprite:** img2img, never fresh generation — the title comes from the character's own original ("make the same character seated at …" keeps identity; a square title cover-crops fine on the VN canvas); backgrounds come from the existing approved bg. Carry the character's red accent into the environment (red curtains / red tea) so character + scenes read as one palette; overt horror belongs ONLY in `bg_wrong`.

**Entrance sequence — 3-shot storyboard, sprites over one bg (the SAFE default).** The identity rule behind it: whichever image is the krea-edit BASE keeps its identity. Composing "room-as-base + character-as-reference" REDRAWS her every time (three such CGs produced three different women), while "character-as-base + minimal-delta edit" is pixel-stable. Therefore:
- Shot 1 "you open the door" — environment-only CG (base = the room bg, add a doorway frame + POV). No character in the CG → zero identity risk; place the character as a normal sprite over it. Keep the sprite OFF the darkest area (a black-gowned figure on a dark curtain is invisible; move her to a lit part of the frame).
- Shot 2 "she sits" — room bg + a seated sprite. The seated sprite must be generated PROPLESS (no table/chair/saucer baked in) or it collides with the room's own furniture.
- Shot 3 "she invites you" — room bg + an inviting-gesture sprite, timed under her invitation line.
All character sprites derive from the ONE approved original with minimal-delta pose prompts.

**🔬 OPEN LEAD — full-scene CGs, status UNVERIFIED. Do not follow this as guidance yet; it is a hypothesis awaiting a test.**
<!-- PARKED PENDING VERIFICATION — the claim below rests on a single sample (one CG whose face happened to come out right). Until it is reproduced, treat full-scene character CGs as unsolved and use the sprite route above.
Sprites-over-one-bg is the safe default, but it can never give a real camera angle, a doorway POV, an over-the-shoulder shot or true depth. Whole-scene regeneration can, so record the state of the experiment rather than a verdict:
- **What is already solved:** face identity. The one CG built as **character-as-base + room-as-refImage** ("place image1's woman into image2's parlor…") came back with her face, veil, ribbon and hair CORRECT. Every earlier failure had used the room as the base. Treat "the character image is always the base" as the fixed rule, not a preference.
- **What blocked that attempt:** ASPECT, not likeness. krea-edit inherits the BASE image's dimensions, and the approved character original is square — so the CG came out 512×512, and the 16:9 canvas cover-cropped away the whole gesture. Prompt text ("wide 16:9 landscape") does not override it; `sizePx` is only a long-edge cap.
- **The next experiment to run** (untested, cheap): first build a **16:9 character plate** — take the approved original and krea-edit it onto a wide empty canvas (character to one side, the rest plain/neutral) so you own a WIDE image that is still HER. Then use THAT as the base, room as ref. Identity comes from the base, the 16:9 ratio comes from the base too. If it works, whole-scene CGs are unlocked for every shot.
- **Fallback repair pass, also untested:** if a scene's face still drifts, run a second edit with the SCENE as base and a minimal-delta prompt that changes only the face toward the approved design — editing pixels that already exist is far more stable than painting a character in from scratch.
- **Two constraints that stay true regardless:** keep her mid-shot or larger (small faces drift most), and keep the subject in the UPPER ~65% of the frame or the dialogue box eats it.
-->


**Sprite staging & movement — what the engine can and cannot express** (all learned the hard way on g96d22c):

*What `show` actually gives you.* One knob: `pos` (0 = far left, 1 = far right). No scale, no vertical offset, no tween — a new `pos` snaps. Sprites are bottom-anchored and drawn at a fixed on-screen height regardless of the source image's dimensions. Everything below is built inside those limits.

*The four things that DO read as movement:*
1. **Framing change** (full body ↔ waist-up ↔ chest-up) = the approach/retreat axis. This is the only reliable depth cue — see §4.
2. **`pos` change** = lateral movement. Safe to smooth: an rAF loop that writes `S.actors[who].pos` each frame turns the snap into a glide (the runtime reads `pos` every frame, so nothing else needs patching). Verified working.
3. **Pose change** (standing / seated / gesturing) = the beat itself. Generate each pose from the ONE approved original with a minimal-delta prompt.
4. **Expression swap** = the emotional beat, free of any layout risk.

*What does NOT work — do not spend a session rediscovering these:*
- ⚠ **Per-`show` `scale` via a `drawImage` hook renders the sprite as NOTHING.** Rewriting the destination rect in a `CanvasRenderingContext2D.prototype.drawImage` wrapper makes the character silently vanish in the real runtime (proved by deleting the `scale` field and having her reappear instantly). Tween `pos` if you like; never try to scale.
- ⚠ **Walking poses are structurally invisible.** The dialogue box covers the bottom ~33% of the canvas, so legs and stride are always behind it. A "mid-stride" sprite is indistinguishable from a standing one. Sell motion above the waist (lean, trailing veil, arm) or through framing — never buy art for legs.
- ⚠ **A dark sprite on a dark background disappears.** A black-gowned figure at `pos 0.5` in front of a dark curtain read as an empty room; the fix was `pos 0.72`, over the lit bookshelves. Always check the sprite's silhouette against the exact spot in the bg where you place it.
- ⚠ **Sprites must be PROPLESS.** A seated sprite generated with its own table/saucer baked in collides with the room's furniture (two tables). Prompt "no table, no chair, no furniture, no background"; a chair the character is actually sitting on is the one acceptable exception.
- ⚠ **`hide` before a new `show`** when the pose changes substantially, so the swap reads as a cut rather than a smear.

*Cost note:* every failure above was an art-generation failure that art could never have fixed — they are engine constraints. Diagnose the layout before ordering more images.

**Environment-first sequences — a PROVEN process for scenes, and the current way to stage ACTION.**
Scope note: what is validated here is ENVIRONMENTS. Presenting the CHARACTER inside full scenes is still unsolved (see the parked lead below). Environment-first is how you keep shipping while that stays open — deliberately choose what can be told without the character on screen.
Why it holds: rooms, doors, trees and props have NO identity to preserve, so the generator cannot break them the way it breaks a face.

**ENVIRONMENT + CAMERA = how you show the PLAYER'S ACTION without ever drawing the player.** This is what the g96d22c prologue actually proves. Background art alone made the player's own actions read clearly — walking up to the house, pushing the door, stepping through — with no avatar, no hands and no character on screen. The engine cannot move a sprite meaningfully (see *Sprite staging & movement*), so this is where action lives.

Three modes — choose one per beat:
1. **Camera only.** The place is unchanged; the camera moves. This reads as the player TRAVELLING: wide forest with a distant house → that same house's door in close-up = "you walked up to it".
2. **Environment only.** The camera is locked; the world's state changes. This reads as the player ACTING: identical framing, doors shut → doors parted with light between them = "you pushed them open". The strongest of the three, precisely because a locked camera makes the change unmistakably the RESULT OF WHAT YOU DID.
3. **Both.** Camera moves and the state changes — save it for the payoff beat (the doors are open and you are suddenly inside).

- **PROVEN:** the push-in, the tilt-down and the pan left/right (mode 1), and the locked-camera state change (mode 2). A single scene can chain them — g96d22c ch1 runs push-in → tilt-down → pan right → pan back, and every move carries a story beat.
- **The OVERLAP ANCHOR is what turns two pictures into one camera move.** Consecutive shots must share a recognisable object, placed so that it travels across the frame in the direction of the move. g96d22c's tilt-down: the up-shot shows only the tips of the candelabra's flames entering at the BOTTOM edge; the next shot has the whole candelabra centre-frame. The eye follows the flames down and reads one camera tilting. Take the anchor away and the same two images read as two different rooms. Build it into the prompt explicitly ("let only the very tips of the candle flames enter at the bottom edge").
- **Give the move a reason — it should reveal information, not just move.** That same tilt-down says "the ceiling is far higher than the little house outside could hold", i.e. the camera delivers the inside-doesn't-match-outside beat that narration would otherwise have to state flatly.
- **`hide` the sprite for the duration of an environment-only camera move**, then `show` it again when the camera returns. The sprite is drawn at a fixed screen position, so if the camera pans away the character keeps standing in the middle of the new framing. ⚠ Scope: this applies to shots that are meant to be environment-only. It is NOT a rule that camera moves and characters cannot mix — that combination simply has not been tested yet (below).
- **UNTESTED, same principle:** pull back. Any camera move is fair game; the requirement is that consecutive shots stay in the SAME environment.
**STRATEGIC LEAD — put the character back in the frame by choosing shots where her FACE is never rendered.** The identity problem exists only where a face exists. So stop fighting to reproduce the face and instead pick shots that do not need one:
- the character seen FROM BEHIND, doing something (reaching for a book, pouring at a sideboard)
- a backlit silhouette
- a hands-or-detail close-up (her fingers on the cup, the hem of her gown)
- the face hidden by the veil, hair, or an object passing in front of it
- a reflection — mirror, window, the surface of the tea

This is the same move as environment-first: sidestep the generator's weakness rather than out-argue it. Identity then rests on things that DO survive regeneration — silhouette, hair with its silver streak, veil shape, gown, the one red accent. Treat it as the main route to getting the character into full scenes, not as a novelty.
Also untested, same family: a camera move WITH the character in shot — a hard push-in to a close-up of her drinking told as two images, or left/right variants of one shot used to visualise a choice.
- **Change only what the mode changes.** In mode 2 the camera must be pixel-identical between the two shots — move it as well and the change stops reading as the player's action and becomes a scene transition instead.
- **The already-approved shot is the anchor; new shots conform to IT, not the reverse.** On g96d22c the interior reveal was fixed, so the prologue doors were rebuilt to match its door. Make the match list explicit and check it item by item: door/prop type, handle, panel cutting, palette, contrast, brush texture. Continuity notes come back as a checklist, not as "it feels off".
- **Never trim the style keyword block to shorten a prompt.** Cutting it produced smooth photo-real doors inside a gouache game and was spotted immediately. Shorten the description; never the style.
- **`generate_asset` accepts an `aspect` parameter** (`16:9`, `21:9`, `2:3`…) and returns exactly that (1280×720 verified). `character_sprite`/krea-edit does NOT — it inherits the base image's dimensions. So **open a new scene with `generate_asset` at the aspect you need, then derive every later shot from it** with krea-edit, which inherits the correct ratio. This is the real answer to the square-CG problem that cost this project dozens of generations.
- **Chain-editing is SAFE for environments** (it is poison for characters): shot 2 from shot 1, shot 3 from shot 2 — that is what keeps the wood grain, lantern and railing identical across the sequence.
- Remember to `hide` the character before the first background of a prologue, or the title-screen sprite is left standing in your forest.

**Bilingual EN + zh-TW:** every say gets a twin (`if:"!lang_tw"` / `if:"lang_tw"`); the TW name plate uses a second character id; the language row gotos tiny setter labels (`set_tw` = [set, goto start]) — never rely on option-level set+goto in one option; compound conditions are undocumented → clone the label and split arrivals with two stacked gotos; ALWAYS audit CJK strings after writing (open the embed URL and verify headlessly via `VN.flags` / `VN.goto()` / `VN.S`).

**Custom main menu (skin + geometry):** the runtime hard-codes choice rows at **42% canvas height** (`hitChoice` and the drawing share one formula), so "just draw them lower" = unclickable. Build it as ONE block that owns drawing AND input:
- **One geometry function feeds both the draw and the hit-test.** Compute `bx/by/bw/bh` for row `index` in a single place; draw with it, and store it into a `RECTS[index]` array that the click handler tests against. Two copies of the maths WILL drift.
- Inside `window.VN_SKIN.choice`, branch on `VN.S.label === 'start'`: the title uses its own geometry from `GAME_CONFIG` (`menuYPct` = vertical CENTRE of the row stack, `menuWPct`, `menuRowH`, `menuGap`, `showTitle`, `titleYPct`, `titleSize`); in-game choices use the theme values. Draw the wordmark on `index === 0`, and any overlay on the LAST index so it paints over the rows.
- **Input: `pointerdown` on WINDOW at CAPTURE phase** (the runtime binds on the canvas in bubble phase, so capture always wins). On a hit: apply `VN.flags[o.set]=o.value`, **clear `VN.S.choices`**, then `VN.goto(...)`, then `stopPropagation()`. Skipping the swallow leaves a GHOST hit-zone at the 42% band — clicking the artwork fires the wrong row. Skipping the `choices` clear bricks the game (see the next entry).
- **Also bind `keydown` for `1`–`9`** → pick the nth row (and Escape → close the overlay). Mouse-only menus cannot be exercised by `playtest_screenshot`, which can only click the screen centre.
- Only ONE block may own the menu. If you append a newer version later, disable the old one with a global kill-switch (`if (window.__MENU_V4) return;` inside the old handler) — two capture handlers = every click fires TWICE.
- Put all geometry into `GAME_CONFIG` + the `schema` param of `edit_game` so the user tunes it live with sliders (`__GI_SET` Object.assigns onto the same config object — read it every frame). ⚠ A config key that no code reads = a dead knob; always wire both ends. ⚠ The editor's SAVED config overrides the HTML defaults, so changing a default in the source has no effect once the user has touched that slider — read the live value with `get_game`.

**⚠⚠ `VN.goto()` does NOT clear `S.choices` — the #1 way a custom menu bricks the game.** The runtime's internal picker clears the pending menu; the public `VN.goto()` does not. So a hand-rolled menu that calls `VN.goto(o.goto)` leaves the choice list live: the next scene draws, but the runtime keeps treating EVERY click as a menu pick, so dialogue can never advance and the old menu rows stay painted on top (in the in-game skin style, which is the visible tell). Every row is affected, not just the one you tested. Fix: `VN.S.choices = null;` immediately before `VN.goto()`. Related: `S.line` also survives the jump, so returning to a menu label leaves stale dialogue text under the buttons — clear `S.line`/`S.shown`/`S.who` when drawing the title.

**Settings overlay (music / sfx / language) without runtime support:** make the menu row `goto` a real no-op label (`settings` = `[{goto: start}]`, so it degrades safely), then intercept it in the pick handler (`if (o.goto === 'settings') { OPEN = true; return; }`) — deliberately NOT calling goto, so the title stays live underneath. Draw the panel from inside `VN_SKIN.choice` on the LAST row index so it paints over the rows; while open, the capture-phase handler swallows every click and routes to your own hot-rects (sliders, pills, close), plus `pointermove`/`pointerup` for slider dragging and Escape to close. **Volume control:** the runtime builds its own `Audio` objects that are never in the DOM, so hook `HTMLMediaElement.prototype.play` to collect them and set `volume` on each call — looping element = music, one-shot = sfx. Store values in `GAME_CONFIG` (`musicVolume`, `sfxVolume`) so the same knobs appear in the inspector.

**Editing:** scripts are edited ONLY via `read_data`/`write_data` (the HTML is MBs of base64); `write_data` object/array values arrive JSON-stringified (bug) → write field-by-field, or use `edit_game` find/replace for bulk surgery; chunked upload ≤3000 chars. ⚠ `search_game_source` blows up the context when a match lands on a base64 asset line (5M chars) — to inspect runtime internals, open `/api/games/<id>/embed` in a browser and run JS there (the play page iframe is cross-origin and unreadable). ⚠⚠ NEVER address a script command by a hard-coded index across calls (e.g. the "temporarily turn `start[N]` into a goto to screenshot past the menu" trick): another agent inserting one command shifts the array and your "restore" writes into the WRONG command — this silently turned a `bgm` into an option-less `choice` and hung the whole game. Re-read the array, locate the node by `cmd`, and verify by re-reading the WHOLE array afterwards, not the single field you wrote.

**Audio:** `bgm_main` + `bgm_tension` from one instrument family; sfx: click / choice / sting / prop sounds (teacup etc.).

---

## 7. Runtime wishlist (platform extensions this genre wants)

1. **Hotspot interaction mode** — true click-on-body-part / click-on-object (currently emulated with choice menus)
2. **Persistent endings gallery** — localStorage + a menu entry
3. **Main-menu Load/Settings hooks** — expose the runtime's save/load to menu labels
