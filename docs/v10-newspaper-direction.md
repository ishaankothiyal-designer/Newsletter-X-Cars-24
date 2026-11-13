# V10 — The Pitstop newspaper

Continuous scroll based on V9, sharing the same 25 stories, four sections, original updates, credits, caveats, and source links. V8 and V9 remain unchanged.

## Visual system

Neutral #F5F5F5 paper with restrained grain, ink #161616, CARS24 blue #4736FE, occasional mint in illustration. Georgia for editorial text and Geist for interface text. Labels are 12px, body copy 16px, all article headlines 28px, and section headings/figures 32–40px. All story formats use the same type and spacing rules.

The compact masthead contains the official CARS24 logo, The Pitstop, and one issue date. The opening illustration leads directly into useful headlines and a single chapter navigation. There are no taglines, visible version badges, repeated date furniture, decorative image captions, generic chapter descriptions, duplicate contents blocks, or repeated editorial images.

Mobile headlines form a full-width vertical list. Story grids adapt to their content width. Every article uses consistent spacing after its divider and between its label, headline, figure, copy, and source notes; source notes follow content without bottom alignment. Long URLs wrap inside their columns. Navigation height is measured for anchor scrolling; in short landscape windows it scrolls with the document.

## Image direction

The new cover is a reference-based translation of V9's `assets/cover-wide.webp`: the same four colleagues celebrating around a laptop, winding road, and small car. Its composition is retained in the new newspaper crosshatching/halftone treatment, using `assets/v10/press-tech.webp` as the style reference. Generated output is `assets/v10/press-cover.webp`; exact source PNG and provenance are archived in Maker export `125_pitstop-newspaper_13-Nov/v2/`.

Cover, technology, and Diwali images each appear once. The original supplied supplementary art remains accessible inside source notes. Provenance is documented in `dist/assets/v10/generation-manifest.md`, without visible production labels in the reading layout.

## Research

- https://in.pinterest.com/pin/361695413843006993/ — Pelusa Estudio newspaper: large serif title, restrained metadata, line art, ruled modules. Reviewed in the user's signed-in Chrome session.
- https://es.pinterest.com/pin/143130094403478857/ — newspaper front page: nameplate, column hierarchy, supporting stories.
- https://www.behance.net/gallery/2374460/The-New-York-Times-Layouts — image-to-column proportions.

UI/UX Pro Max informed content-driven grids, readable metadata, a limited type scale, reserved image geometry, and browser validation. References inform layout; reference artwork is not reused.

## Validation and export

`node tests/v10-content.test.cjs` verifies all story data, sources, and chapter membership; removed decorative furniture; the new cover; and unique editorial image URLs.

With a separately installed Playwright:

```sh
PLAYWRIGHT_MODULE=/path/to/node_modules/playwright node tests/v10-layout.test.cjs
```

The browser audit checks 162 widths from 160–3840px, component overflow, grid collisions, expanded sources, 200%/300% text, compact header heights, full-width mobile headlines, consistent article spacing, deep links, and short landscape behavior. Results: `docs/v10-layout-audit.json`. `PITSTOP_URL` overrides the default `http://localhost:8010/versions/v10/`.

`python3 scripts/package-v10.py` creates the self-contained `../output/The-Pitstop-V10.html`.
