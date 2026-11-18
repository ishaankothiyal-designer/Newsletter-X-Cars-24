# V12 — V11 artwork and layout polish

Local route: `/versions/v12/`. Based on V11 at `4ff5ea2`.

All 21 story objects, facts, headings, bodies, detail text, labels, links, and alt text are preserved from V11. All rendered page text is identical. The additional pointer cue reuses the existing “Tap to read more” label. V8–V11 product files and shared story data are unchanged.

## Direction

Maker Agent art direction, the supplied Flatland reference pages, UI/UX Pro Max layout guidance, and Maverick implementation discipline. The user's Flatland brief takes precedence over generic brand campaign defaults: pastel paper stocks, crisp black outlines, restrained lavender offset shadows, stippling, and contained editorial motifs. This is a repair of existing native SVG artwork; no image generation provider was used.

The 21 repaired assets live under `dist/assets/story-graphics/v12/`. Each has the same 480 × 300 viewBox, optical scale, stroke system, and safe inset. `python3 scripts/build-v12-art.py` reproduces them using the original V11 image descriptions.

## Layout and interaction

- All card fronts carry their corresponding illustration in a consistent contained art region.
- Grid rows align paired cards. Active faces size naturally; no fixed card heights or JavaScript measurements.
- Card opening and closing retain V11's front/back content, with native buttons, inert hidden controls, focus return, and Escape support.
- One 24px desktop gap, 20px mobile gap, and consistent 32px / 24px / 20px responsive card padding.
- Pointer cue follows a fine pointer over a closed card, clamps inside the viewport, ignores clicks, and updates while scrolling. Touch devices keep the original visible “Tap to read more” action.
- Existing cover composition, brand assets, chapter ordering, and story ordering are retained.

## Verification

`node tests/v12-content.test.cjs` compares V12 story fields and the complete rendered page copy against V11. It permits only illustration-path changes.

Browser regression:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright \
PITSTOP_URL=http://127.0.0.1:8797/versions/v12/ \
node tests/v12-layout.test.cjs
```

Verified all 21 cards at 320, 375, 414, 768, 1024, and 1440px: image decode, open/close, detail content bounds, Escape/focus return, equal paired heights, and document width. Also verified fine-pointer cue, touch tapping, and safe SVG geometry for all 21 assets. No browser page errors or missing assets. All ten content/reader checks passed.
