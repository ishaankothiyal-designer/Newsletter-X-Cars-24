# V13 — V9-based October illustration and card repair

V13 is based on V9 from `764db90`, not the November V11/V12 editions. Route: `/versions/v13/`.

All V9 copy, 23-story ordering, four chapters, per-story overrides, hidden-story choices, glossary, external links, and alt descriptions are retained. The shared story files and V8–V12 product files are unchanged. `tests/v13-content.test.cjs` verifies these constraints against the actual V9 renderer.

## Artwork

Maker Agent art direction follows the supplied Flatland reference: pastel paper, crisp black outlines, connected editorial metaphors, restrained lavender offsets, and stippled grounding. The 17 existing vector spot concepts are repaired in `dist/assets/story-graphics/v13/`, with consistent 480 × 300 viewBoxes and safe margins. Regenerate them with `python3 scripts/build-v13-art.py`.

Six existing larger scenes — academy, Codex, hackathon, Diwali, Milo, and badminton — are retained. Their wrappers now contain the full compositions and respect their aspect ratios instead of stretching or cropping them. This is native vector repair and image-layout work; no image-generation provider was used.

## Interaction and layout

Each card has its corresponding art on the summary side. The disclosure layout uses the verified V12 natural-sizing approach while retaining V9's stories and chapter composition. Paired cards share a height; active content stays in normal document flow without height calculations. Desktop pointer hover shows a non-interactive “Tap to read more” cue, reusing V9's existing wording. Touch retains the static action. Hidden faces remain inert, and closing via the back button or Escape returns focus.

## Validation

All 11 content/reader checks passed. `tests/v13-layout.test.cjs` verified all 23 cards at 320, 375, 414, 768, 1024, and 1440px: image decode, open/close, content bounds, Escape/focus return, paired heights, and document overflow. Pointer cue, simulated touch, and all 17 SVG safe bounds passed. No page errors or missing assets.

```sh
PLAYWRIGHT_MODULE=/path/to/playwright \
PITSTOP_URL=http://127.0.0.1:8798/versions/v13/ \
node tests/v13-layout.test.cjs
```
