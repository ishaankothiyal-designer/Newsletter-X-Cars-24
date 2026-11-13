# Newsletter X Cars 24

The Pitstop — Cars24’s October 2026 newsletter. A responsive, swipeable editorial reader inspired by Flatland.

## Links

- [Live site on Vercel](https://newsletter-x-cars-24.vercel.app/)
- [GitHub Pages](https://ishaankothiyal-designer.github.io/Newsletter-X-Cars-24/)
- [Public repository](https://github.com/ishaankothiyal-designer/Newsletter-X-Cars-24)
- [Vercel project dashboard](https://vercel.com/design-ea38/newsletter-x-cars-24)

The current V8 edition includes 25 stories in four chapters, eight paper colours, varied editorial layouts, story illustrations, source notes, and a soft page-turn sound. V8 remains at the default URL. V9 adds a continuous vertical edition at `/versions/v9/`, with the same 25 stories, artwork, notes, and source links. No version picker or retired editions are restored.

## Local preview

No dependencies or build step are required.

```sh
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765/ . The current edition is also available at `/versions/v8/`.

## Validation

Requires Node.js 22 or later.

```sh
node tests/v9-content.test.cjs
node tests/v8-content.test.cjs
node tests/v8-images.test.cjs
node tests/v8-motion.test.cjs
node tests/v8-viewport.test.cjs
node tests/v8-touch.test.cjs
node tests/v8-sound.test.cjs
```

## Deployments

- **GitHub Pages:** pushes to `main` run the checks and publish `dist/` through the Pages workflow.
- **Vercel:** the connected project serves `dist/` as a static site. `vercel.json` specifies the output directory; no build command or environment variables are needed.

## Project layout

- `dist/` — complete deployable site, including local artwork, fonts, and sound.
- `dist/reader.js` — current navigation and card motion.
- `dist/reader.css` and `dist/flatland-ui.css` — responsive reader and editorial treatments.
- `dist/stories.js` — stories, chapters, page colours, layout treatments, and sources.
- `dist/page-sound.js` — optional page-turn audio.
- `dist/versions/v8/` — V8 entry point, identical to the default reader.
- `dist/versions/v9/` — continuous vertical newsletter; shares root story data and assets.
- `scripts/package-v9.py` — exports a self-contained HTML copy for HTML Hub.
- `tests/` — content, gesture, motion, viewport, and sound checks.
- `docs/` — design decisions and asset provenance.
- `scripts/` and `source-assets/` — reproducible editorial spot graphics and soft audio preparation.

## Assets and rights

The Cars24 name, logo, editorial content, and supplied illustrations retain their respective owners’ rights. Publication of this repository does not grant a general licence to those materials. Third-party assets retain their stated licences. The paper recording’s public-domain provenance is documented in `docs/page-turn-audio-source.md`; the bundled Anton licence is retained beside the font.

The runtime contains no service credentials or server-side secrets. Story source links may point to systems that require their own authentication.

Both editions include the Dhanteras sales update (381 cars in one day), place Frontier ’26 under Tech Updates, and omit the Australia Finance and reporting cards. Functional card labels omit personal names; attribution remains in story notes.

### V10 — newspaper edition

V10 is a separate continuous-scroll edition at `/versions/v10/`, based on V9's shared 25-story dataset. It replaces the prior art direction with a broadsheet masthead, ruled columns, textured neutral paper, CARS24 blue identity, and newly generated newspaper ink illustrations. Default V8 and V9 are unchanged.

Run `node tests/v10-content.test.cjs` to verify content preservation. Run `python3 scripts/package-v10.py` to write the standalone `../output/The-Pitstop-V10.html`. Reference research and design decisions are documented in `docs/v10-newspaper-direction.md`.
