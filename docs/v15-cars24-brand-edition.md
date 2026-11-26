# V15 — Cars24 brand edition (October–November 2026)

Local route: `/versions/v15/`. Same 19 stories, structure and embedded base64 images as V14 — only the `<style>` block (and fonts) were replaced. No separate `img/` folder, no shared `stories.js`, and V8–V14 are unchanged.

## What it is

- The same content as V14 (19 stories in three parts — **Business**, **Builders at work**, **Life at Cars24** — plus the puzzle page), restyled from the retro comic-book look into a clean Cars24 brand look.
- Built mobile-first: every layout (story cards, fact grids, the hub tracker, games) stacks to a single column by default, with wider-screen layouts added only above 640/760/1000px breakpoints.

## Design

- Palette from the Cars24 brand book: Brand Blue `#4736FE` leading, Brand Blue 700 `#2B2098` for depth, a light blue tint `#EBE9FF` for callouts/quote highlights, white/near-black neutrals for text, mint `#63FFB1` used sparingly for correct-answer states in the games.
- Typography is Geist Sans (embedded as base64 `@font-face`, so it renders with no external font request), replacing the comic edition's Bangers/Comic Neue/Impact stack.
- No halftone texture, hard offset shadows, rotated stickers or speech-bubble tails — callouts and pull-quotes use a flat rounded panel with a blue left border instead.
- Chapter headers use a trapezoid-clipped label (the Cars24 brand shape) instead of a comic badge.

## Verification

```sh
node tests/v15-content.test.cjs
```

Checks the 19-story order, the three parts and the games section, that every image exists, that the comic fonts/external font fetch are gone, and that the Cars24 brand blue and embedded Geist font are present.
