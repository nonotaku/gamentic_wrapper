# reference-canvas-i18n — EN + zh-TW for canvas-shell games

Proven in `gbe4dbe` (full translation: UI chrome → content → story), owner policy: **voice stays English; text translates**. This is the canvas-game approach — the VN runtime's `say`-twin bilingual system is a different animal (`reference-gamentic-platform.md`).

## Architecture — the dictionary is keyed by the ENGLISH SOURCE STRING

```js
const UI_ZH = { 'COUNTER': '對策', 'CLEAR {n} FIRST': '先通關第 {n} 關', /* … */ };
const L = s => (lang === 'zh' && UI_ZH[s]) || s;
```

- A missing entry falls back to visible English — never a blank, never a key. English mode is a zero-cost passthrough.
- ⚠ **Placeholders live INSIDE the key** (`CLEAR {n} FIRST`, substituted after `L()`): splitting the string around the placeholder loses it in one of the languages — that scar shipped as an English stage-gate with no stage number.

## Static DOM — the `data-i18n` walker

```js
applyLang() {
  for (const el of document.querySelectorAll('[data-i18n]')) {
    if (!el.dataset.i18nEn) el.dataset.i18nEn = el.textContent;   // cache the ORIGINAL once
    el.textContent = L(el.dataset.i18nEn);
  }
}
```

- ⚠ Cache the original on first pass — without `data-i18nEn`, an element whose key is a short tag prints the TAG in English mode, and a second switch translates an already-translated string. Every re-run translates from the ORIGINAL.
- Run `applyLang()` BEFORE the first render (a saved language preference must take effect at boot), and again on every switch.
- `setLang` = store the preference (try/catch — storage throws in production) + `applyLang()` + rebuild the screens that render from data (menu, HUD bar, settings).

## Dynamic text — translate at RENDER time

Anything built from data (codex entries, tooltips, wave banners, canvas-drawn labels) calls `L()` at the moment it renders — never bake translations into the data tables, or switching language leaves stale text behind.

## Layer order

Translate in three passes, shipping each before starting the next: **UI chrome → content (names, descriptions, codex lore) → story dialogue**. Voice lines stay English throughout; translated text carries the meaning.

## Scars from the dictionary work

- ⚠ Large dictionary edits truncate in transit — split into several smaller edit calls.
- ⚠ An inline `//` comment inside a data block silently swallowed a `.map()` call during one dictionary edit — trait chips vanished with no error. Keep dictionary edits mechanical; no inline comments in data blocks.
- ⚠ Audit every CJK string AFTER writing by rendering it and reading it back — unicode-escape slips produce plausible-looking wrong characters (a sibling VN pass counted nine that survived review).
