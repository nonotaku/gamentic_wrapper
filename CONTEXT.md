# CONTEXT

Glossary for this repo. Terms only — no implementation detail, no decisions, no plans.

## Expression

What a character's face is doing in a beat. Named by what it **reads as on screen at sprite size**, never by what the prompt asked for.

⚠ An asset name records the intent of the generation, not the result. Two faces in `g96d22c` were named for expressions they do not depict, and both cost real time before anyone checked the picture. Read the art, then name it.

## Neutral

Composed and unreadable — she is simply waiting, neither warm nor cold. The resting face a character returns to when nothing is happening to her.

In `g96d22c` this is `char_gm_calm`, and it is also the cast's default sprite. It took three attempts: the character rests half-lidded, so simply removing her smile produces sorrow rather than composure. The accepted face keeps the faintest lift at the mouth corners.

## Hurt

Warmth withdrawn by something that landed — being called a monster, being reminded of what she used to be. Distinct from **Neutral** (an absence of feeling) and from **Sad** (settled grief rather than a fresh wound).

In `g96d22c` this is `char_gm_hurt`, and it lands on exactly two beats: being asked who she was before, and being asked about the twelve guests who called her a monster. It shares its framing and pose with **Neutral** — the whole difference is the lift at the mouth corners, present for composure and gone for a wound.

## Mask

Eyes closed while a courteous smile holds. One face for both "I am being polite at you" and "you have offended me" — the beat's words decide which, and the player reads the same shut eyes as warmth or as a door closing depending on what was just said.

A variant with the forehead marking OPEN was drawn to separate the two, and retired: its framing sat tighter than the rest of the set, so displeasure arrived as a visible jump in her size. In `g96d22c` one image, `char_gm_polite`, now carries the first meeting and all five offences.

## Near

The chest-up, leaning-in framing — she has closed the distance and the frame no longer holds all of her. The pressure register of the approach axis, reserved for the moment an offer waits on the player's answer: proximity itself says "decide". Distinct from the resting waist-up framing every other beat uses; the engine has no zoom, so distance is always carried by the art's own crop.

Carried by a **CG**, not a sprite: sprites are drawn at a fixed on-screen height, so a close crop makes a bust look cropped rather than close. In `g96d22c` the trade offer hands the whole screen to `cg_shadow_offer` and hides the sprite; the sprite versions were tried first and read badly.

## Void

The face gone — a flat black shape where hers was, holding only her own eyes. Not an **Expression** but a *state*: what shows when the courteous performance drops, and what the player stops seeing the moment they are courteous again.

It is reversible by design. She lets it go herself when she invites you to look, it slips whenever she is seen through — asked what she was before, called what she is, shown the pages she wrote — and it is back to her own face wherever the player answers well. Emotion still comes from the words and her voice; the Void only says how much of the performance is left.

In `g96d22c` one image carries the state (`char_gm_void_half_a`, head and neck black, her body still human) and two carry its extremes: `char_gm_void_many` when you accept the look she offered, `char_gm_void_black` when you take more than she offered. Chapter three only — the endings keep her human faces, so the last thing you see of her is still a person.

## Chapter vs choice

A `c<N>_` label prefix numbers the **choice**, not the chapter. `c2_deep` is the second choice of the game and lives in chapter 1. Chapters are the `ch<N>` labels alone.

## Server skill

An entry in the gamentic server's skill registry, served to every agent on the platform via `get_skill(name)`. Written by the platform team only — this team; the `templates/` folder is its staging area, and a file only becomes a server skill when the team uploads it.

## Template

A `template-*` file: a genre blueprint distilled from a shipped, playtested game — iron numbers, schemas, feel rules. One genre, one file. Distinct from a **Reference** (shared facts several templates point at, no genre content) and from a **Technique** (`technique-*`: an experiment log of unvalidated leads — never uploaded; promoted into a template or reference the moment it proves out, and deleted from the log).

## Surface

A distinct environment a game runs in: the dev harness (`playtest_screenshot`), the play page, the embed routes, the in-app browser pane. Restrictions attach to surfaces, not to game types — the measured matrix is `templates/reference-runtime-surfaces.md`, and the probe rig (game `g8bb0c7`) re-runs the audit with one screenshot: every verdict prints on-screen.

## Scar

A ⚠ rule paid for by a real failure in a live build. A scar is cited with what it cost, never softened into a suggestion — and it names the surface or tool it belongs to, because a scar filed against the wrong owner (a pane quirk blamed on the platform) misleads exactly as long as it survives.

## Night vs Run

A **Night** is one outing — leave, scavenge, reach the extraction point, come back. A **Run** is the whole attempt, however many Nights it lasts, ending in the one bad ending.

The two are separate because **failure means different things to each**. Dying costs the player a Night: the haul is lost and she wakes back at the shelter, but the attempt continues. Only missing a **Rent** payment ends the Run. Collapsing them — "she dies, so it's over" — was the reading first proposed and rejected: it makes every death terminal and the loop is never seen. Death is therefore compounding rather than fatal; two or three lost Nights are what actually kill a Run.

## Rent

The standing debt the shelter charges to let her sleep behind its walls — supplies owed on a fixed cadence, not a difficulty knob.

Rent is the **only** thing that ends a Run, which is what makes it the game's clock rather than one of its costs. It is modelled on the father's debt in *Goblin Vyke: The Thief Tycoon*, where an outing means something because what you bring home is owed to someone. A rule with no creditor — "you must hand over supplies every third night" with nobody asking — was tried first and left the shelter with no reason to exist.

## Run scope vs Profile scope

**Run scope** is everything a Run's ending wipes: supplies, injury, the Rent clock, which Night you are on. **Profile scope** is what outlives it.

The distinction is worth naming even while Profile scope holds a single record, because the line is drawn in the save format and moving it later rewrites saves. Whatever a player buys once and keeps — the weapons and skills already planned but deliberately unbuilt — can only live in Profile scope; choosing to defer them was already a choice to have two scopes.

## Gameplay canon vs Portrait canon

One character, two approved originals. The **Gameplay canon** is side-on, full-body and already in motion, on a plain plate — the only shape `sprite_animation` accepts as a base. The **Portrait canon** is front-on and detailed, for the screens where she is drawn large.

VN work needs one canon per character, so a second one reads as drift until you look at where each is spent: a character on a platform stage stands roughly a sixth of the screen tall, and detail bought at that size is not visible. Splitting the canon buys the painterly face back on the title, result and ending screens without paying for it in every frame of a run cycle. Both still derive from the same design; see **Canon** in `templates/reference-vn-art.md` for the identity rule they both obey.

## Noise

What every action costs. Moving, landing, taking a supply, forcing a gate and firing all emit a sound with a radius, and a radius is the only thing the infected can act on — they have no other sense of the player until they can see her.

Noise is the game's currency because it is the only cost attached to going faster. Limited ammunition was the one existing decision that had teeth, and the reason it worked is that spending it hurt; noise generalises that to every verb. It is drawn, never abstracted: each sound puts an expanding ring on screen at its own radius, so the rule and its picture are the same object. A zone multiplies it — a tunnel is worth more than a rooftop — which is what gives twelve zones distinct characters without twelve sets of rules.

## Investigate vs Lock

The two things a zombie does about a **Noise**. **Investigate** is heard-but-not-seen: it turns, walks to where the sound was, waits, and goes back to its patrol. **Lock** is seen: it commits to the player until it loses her.

Only Lock is dangerous, and only sight causes it — which keeps a death traceable to a decision the player made. The states are shown above the head (`?` and `!`) because a rule the player cannot read is indistinguishable from an unfair one. Entering Lock also shrieks once, and that shriek is an ordinary Noise, so alarm spreads through the system already in play rather than through a separate alert rule; neighbours only ever reach Investigate from it, so each step of the cascade is weaker than the last.

## Hiding

Stepping into cover to break sight instantly, paid for in the two things a Night is actually made of: time and information. The Run's clock keeps going while she waits out the giving-up timer and the loitering that follows, and while hidden the view narrows and the map goes dark.

Sound still draws. That is the point of hiding rather than a mechanic bolted beside it: it flips the player from the thing making **Noise** into the thing reading it, so the same rings that were a liability a moment ago become the only instrument she has. Cover is placed by zone and deliberately unequal — the tunnels are full of it and the rooftops have almost none — so each zone trades being heard against having somewhere to go.

## Skin

The themed naming and art over a mechanic. `emp` is the tech skin of the tower-disable mechanic; an animal theme would skin the same mechanic another way — so a template that says "emp" has smuggled one theme into every future game built from it. Templates carry mechanics and numbers; skins belong to the individual game. The tell: a word that only works in one theme (emp, cloak, viral) is a skin word sitting in a mechanic's seat — replace it with the general word (disable, stealth, decay). Owner's rule, first applied across `template-isometric-tower-defense.md` v2; concrete themed values stay only when explicitly labelled as one game's instantiation.
