# reference-3d-blockworld — Three.js blocks + billboards for a 2D-art world

Owner direction, measured and priced: **no generated meshes** — primitive blocks for the world, camera-facing 2D billboards for crowds, the DOM shell unchanged (`reference-game-shell.md`: canvas draws the world, DOM draws the UI — the world canvas just becomes WebGL). Provenance: Tank War 3D (`g0220a5`, shipped and playing well) + the BLOCKWORLD RIG (`g891f14`, 2026-08-06 — the standing instrument: keys `1/2/3` crowd 50/150/400, `4/5/6` camera pitch, texture matrix and perf panel on-screen).

## Getting three.js — the convention, owner-confirmed

**`__GI_LIB_THREE__` is a LABEL, not an injection**: the AI building the game supplies the library itself and delivers it via MCP (that is how Tank War 3D got its copy). Nothing server- or client-side ever fills the marker — four measurements confirmed, and the owner confirmed the design. The `__GI_LIVE2D_RUNTIME__` marker IS server-injected, which is exactly why every agent guessed wrong here; the asymmetry is tracked in `PLATFORM-BUGS.md` §10 as a documentation gap.

**The standing base: seed game `gaac970`** — three.js **r160** core (extracted from Tank War 3D's live copy) inlined under the marker, plus a liveness probe (`THREE PRESENT r160`, spinning box, frame count). Build a 3D game ON it (replace the probe script, keep the lib block) or re-run the procedure: extract the lib locally, assemble shell+lib on disk, chunk-upload via raw JSON-RPC to the MCP endpoint (`begin_game_upload → append_game_html ≤6KB × N → commit_game`) so 700KB never crosses an agent context. r160 notes: `*BufferGeometry` aliases gone, no bundled `GLTFLoader` (the blockworld route needs neither meshes nor loaders), colour management via `colorSpace`/`SRGBColorSpace`.

⚠ **Editing a seeded game**: the lib is one ~670KB minified line — never `edit_game` against it, and near it the hazard is CONTEXT, not just the query: a match four lines from the lib with default context drags the whole 670KB into the result — keep queries specific AND `contextLines ≤ 3` anywhere near the head. Game code lives in `src/` files; `game.html` carries only markers, the lib and `<script src>` tags.

**Working a seeded game, in order** (each learned the hard way):
- Read the editable region in three searches: `__GI_LIB_THREE__` (ctx 6) for the head · `__GI_CONFIG__` for the markers · the probe's tail string for the boot script.
- The probe's `<pre id="out">` is load-bearing — replace markup and script in the SAME `edit_game` batch, or the live headless check fail-closes on the orphaned reference.
- Write every `src/` file FIRST (unreferenced files are fine), then swap probe → `<script src>` tags in one atomic batch — referencing a file before it exists bounces the whole edit.

## Textures — the CORS truth (measured; supersedes Tank War 3D's in-source comment)

- The media endpoint **now serves CORS**: load with `crossOrigin='anonymous'` and the WebGL upload succeeds — `THREE.TextureLoader` (which sets it by default) is correct and sufficient. A load WITHOUT the attribute still dies at `texImage2D`.
- ⚠ The failure symptom is **pure-black lit surfaces**, never an error page — the image itself loads fine and only dies at upload. Black world = suspect CORS before lighting. **Probe it, don't eyeball it** (4 lines): drain `gl.getError()`, `renderer.initTexture(tex)` in try/catch, read the error back, print the verdict on-screen. And keep the procedural CanvasTexture as each material's INITIAL map, swapping only on a clean probe — a CORS regression then degrades instead of going black.
- ⚠ Tank War 3D's `applyTex` comment ("textures MUST come from inlined data URIs") is **stale** — do not inherit its base64 pipeline when remixing; keep data URIs only as a fallback.
- ⚠ **Cache poisoning**: an image cached from a non-CORS request makes a later `crossOrigin` load of the SAME URL fail from cache alone — cache-bust per mode when testing.
- Procedural **`CanvasTexture`** (painted on a same-document canvas) never taints — the zero-dependency path for block textures, free and re-themeable in code.
- ⚠ `access-control-allow-origin` is not a CORS-safelisted response header — JS always reads `none`; trust the response `type=cors`, not header readability.

## Billboards — the crowd recipe

- Geometry: `PlaneGeometry(1,1)` then `geo.translate(0, 0.5, 0)` — **the bottom-edge pivot IS the grounding fix**; a centre pivot lifts feet off the floor as the camera pitches.
- Face the camera **in the shader, view space** — zero per-instance CPU:
  ```glsl
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  mvPosition.xy += vec2(position.x * aHeight * uAspect, position.y * aHeight);
  ```
  (The CPU alternative — copy the camera quaternion per instance + `setMatrixAt` — costs ~43 ns/instance and is also fine.) A real crowd also needs a per-instance ATLAS cell (`aCell` attribute + derived UVs over one texture) — and a custom `ShaderMaterial` gets no colour-management include, so an sRGB-tagged atlas washes out: tag it `THREE.NoColorSpace` and painted values land verbatim.
- `alphaTest: 0.35`, **never** `transparent: true` — `discard` keeps depth writes, so the crowd needs no back-to-front sort and intersects blocks cleanly.
- ⚠ `crowd.frustumCulled = false` — shader offsets break the bounding box; without this the whole crowd vanishes when the camera turns.
- **The crowd is THREE InstancedMeshes** — sprite, blob shadow (ground-flat quads, `depthWrite: false`), HP bar — every TD needs the third; measured cost of a 400-strong crowd: exactly +3 draw calls.
- Measured cost: draw calls **constant in N** (the whole rig renders in 7, +1 while the beam fires); instance updates ~55 ns each — **400 billboards ≈ 0.04 ms CPU/frame**. The real ceiling is fill rate, which only a real GPU can show.

## Renderer & world

- Full-window canvas, `setPixelRatio(Math.min(devicePixelRatio, 2))`, resize handler (Tank War recipe). No fixed-stage letterbox — 3D re-renders at native size every frame. **The DOM shell's ANATOMY is unchanged; its FIT PASS is deleted**: the UI becomes a full-window layer with viewport-anchored px panels and `clamp()` type (a letterboxed 1600×900 UI stage would put black bars over live 3D). The fit readout's 3D fields: `canvas attr vs css vs window, dpr, "native — no stretch"`.
- ⚠ SwiftShader runs sim time at a fraction of wall-clock — a dt clamp tuned for real machines (0.05) can need loosening (~0.1) just to get combat inside a capture window.
- Terrain and towers are primitives with procedural (or generated, CORS-loaded) textures + normal maps; **high ground is a real raised box** — the 2D template's painted 5px lift becomes actual Y.
- ⚠ Match aim helpers to the geometry's axis — a +Y cylinder aimed with a +Z-stretching matrix stands perpendicular to its target (a real rig bug).
- ⚠ Match the FOG to the camera the same way: fixed `Fog(near, far)` + an orbit camera means one zoom-out and the whole board is flat fog (screenshot-confirmed). Drive `near ≈ r×0.62, far ≈ r×2.3` from the live orbit radius each frame — and push the same pair into the billboard shader's fog uniform, or crowd and blocks fog apart.
- Seed every random placement — an unseeded world reshuffles per load and makes screenshots incomparable. Layout and per-instance decoration (clutter yaw) are TWO streams: derive a second seed for the decoration or the blocks re-rotate every load while the layout holds.

## Measuring in the harness

⚠ The harness GPU is **SwiftShader — a CPU software rasteriser**. fps there is noise (non-monotonic across runs; 400 instances can read faster than 50) — never tune on it. Trust **draw calls** and **burst CPU timings** (time N reps and take the MINIMUM of ~5 rounds; `performance.now()` is coarsened, single-frame sub-ms reads are flat 0.00). Real fps verdicts come from the owner's GPU on the play page.
