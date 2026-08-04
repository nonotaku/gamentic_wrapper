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

## Chapter vs choice

A `c<N>_` label prefix numbers the **choice**, not the chapter. `c2_deep` is the second choice of the game and lives in chapter 1. Chapters are the `ch<N>` labels alone.
