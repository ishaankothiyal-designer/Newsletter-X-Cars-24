# Flatland colour system for The Pitstop

## Source and study

Paths below are relative to the `pitstop` project root.

Reference: `../FLATLAND_2_SEPTEMBER.pdf`, 38 physical pages. SHA-256: `9b8c0c05b438cd7b762eaf467b9f97e5055c4617c90ddedc8690880ceff6e8e1`. The reference PDF is retained as the source artwork. The study reviewed the complete page sequence, representative full-page renders, full-page vector fills and extracted text colours. Reproducible evidence is in `../output/flatland-colour-study/pages.json` and the three contact sheets.

Exact primitive values below come from PDF vector fills, not anti-aliased screenshot samples. The original extracted SVGs retain the source grid, circles, opacity and background geometry. The existing manifest records physical page provenance and sampled extraction checks.

## What the source establishes

- Repeated paper families create rhythm: green appears on physical pages 4–5, 16–17 and 30–31; pink on 8–9, 22 and 34; lemon on 12–13 and 20–21; cream on 10, 24 and 36. Illustration pages can extend or vary these colours.
- The pastel papers predominantly use black ink. Extracted vector text on the inspected type-led pages is `#000000`. Stronger blue/purple illustration-led pages visually use light text as well, so those treatments should not be mixed casually into regular reading cards.
- Colour belongs to the whole paper, not a tinted outline around an unrelated white card. Source grids remain subtle background material, not an added set of decorative labels.
- Magenta and saturated purple are expressive exceptions. Including every available source hue in every reading sequence would lose the source's grouping and rhythm.

## Primitives

| Name | Exact vector fill | Physical PDF page | Existing source SVG |
|---|---|---:|---|
| Cream | `#FFF7E8` | 10 | `cream-grid.svg` |
| Sky blue | `#80C5FF` | 32 | `blue-grid.svg` |
| Builder green | `#C6E496` | 4 | `green-grid.svg` |
| Pink | `#F9D1F4` | 22 | `pink-grid.svg` |
| Lemon | `#FAFFAD` | 12 | `yellow-grid.svg` |
| Mint | `#CAFAE0` | 28 | `mint-grid.svg` |
| Ice blue | `#E7F2FF` | 2 | `ice-grid.svg` |
| Magenta | `#EF5FA3` | 14 | `magenta-grid.svg` |
| Closing purple | `#6153FF` | 38 | Solid reference fill; not used as routine reading paper |
| Primary ink | `#000000` | Type-led pages including 4, 10, 12, 22, 28, 32 | Live type, rules and borders |

`#333333` is a semantic muted-ink choice derived for the web reader, rather than a claimed PDF primitive. It passes 4.5:1 contrast against all five active chapter papers. Existing Cars24 blue `#4736FE` remains the action colour; it is distinct from Flatland's closing purple.

## Current application to V8: varied editorial pages

The user's latest direction replaces the earlier one-colour-per-chapter mapping. Every page now has an explicit paper and layout in `stories.js` → `colourSystem.pages`. The reading order and chapter grouping are unchanged; colour is no longer a chapter identifier.

The sequence uses all eight existing source stocks. Each rolling group of four sheets has four different stocks, including the end-to-cover wraparound, so the active card and its visible neighbours contrast. This is a deliberate adaptation for a stacked reader; the PDF itself sometimes repeats a colour on adjacent pages.

The underlying backgrounds remain the original extracted Flatland SVGs. Black is the primary ink. Secondary ink is #333333, except on magenta where #111111 preserves 4.5:1 contrast. Framed pages use white interiors, as on source pages 10 and 34.

## Editorial grammar

- **Framed reading panels** — rounded white fields, black outlines, a slight hard shadow; source physical pages 10 and 34.
- **Posters** — heavy, rounded sentence-case headings with an outlined paper-shaped emphasis; source pages 4, 8, and 18.
- **Open pages** — a clear headline and editorial spot illustration with ample negative space; source pages 16, 20, and 27.
- **Illustration-led pages** — existing people-and-work scenes beneath the title; source pages 7, 17, and 25.
- **Perspectives** — centred headline composition, a framed key phrase, prose and an illustration underneath; source pages 12 and 31. No quotation marks or invented quotations are added.

The bundled Parkinsans face (already used by V6) supplies rounded heavy display type, with Geist for reading text. The PDF's custom Type 3 fonts do not expose a reliable family name; Parkinsans is a visual interpretation rather than a claimed extraction. The Pitstop masthead remains unchanged. Emphasis wraps existing headline text verbatim, and no labels or extra story copy are added.

The full-bleed cover, cover subtitle, centred header, story illustrations, source panels, stacked geometry, swipe-over-links behaviour, and page-turn sound are retained. `flatland-ui.css` isolates the new editorial treatments. Older V6 files are untouched.

## Validation

`tests/v8-content.test.cjs` checks all 34 explicit assignments, eight source stocks, four distinct stocks in every rolling stack, five story layouts, exact headline emphasis, contrast and root/saved-route parity. Motion and sound regressions remain separate checks. Browser evidence at `../output/v8-flatland-editorial-audit.json` covers 34 pages at 320×568, 393×852, 844×390, and 1440×900. Long stories retain internal vertical reading scroll; text is not truncated to force a one-screen fit.
