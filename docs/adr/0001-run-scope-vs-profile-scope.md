# Split state into Run scope and Profile scope from v1, even though Profile scope is nearly empty

DAWN DEBT ends a Run with a bad ending and, in v1, carries nothing forward — so a single flat state object would be the obvious build. We are splitting it anyway: **Run scope** (supplies, injury, Rent clock, current Night) is wiped on a Run's ending, **Profile scope** (in v1, only the best-Nights record) survives it. The reason is that the weapons and skills bought with surplus supplies are already designed and deliberately deferred to a later phase, and a permanent purchase can only live in Profile scope — deferring them was already a decision to have two scopes. Drawing the line now costs nothing; drawing it later rewrites the save format of a game people have already played.

## Consequences

- v1 behaviour is exactly what a flat model would produce, so the split is invisible in play. A future reader will find two scopes where one would do — that is deliberate, not leftover scaffolding.
- The mandatory result screen needs a high-score and a "new record" callout, so Profile scope has to exist in v1 regardless; the split is not speculative work added for a phase that may never come.
