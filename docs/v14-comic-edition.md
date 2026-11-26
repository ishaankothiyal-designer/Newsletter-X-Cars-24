# V14 — Retro comic-book edition (October–November 2026)

Local route: `/versions/v14/`. A single standalone `index.html` — all images are embedded as base64 data URIs, so there is no separate `img/` folder. It does not use the shared `stories.js` data, and V8–V13 are unchanged.

## What it is

- 20 stories from October and November 2026, in three parts: **Business**, **Builders at work** and **Life at Cars24**.
- Bonus puzzle page: mini 6×6 sudoku, word jumble and memory match.
- Each story has a "Background story" line for readers who don't know the topic, a short body, key numbers and a "Why it matters" line.
- Facts were checked against the original Slack posts.

## Design

- Retro Indian comic-book look: red sunburst cover, aged newsprint paper, Ben-Day halftone dots, thick black panel borders and hard offset shadows.
- Headings in Bangers (falls back to Anton/Impact), captions and speech bubbles in Comic Neue, body copy in Inter.
- A sticky top bar with part links and a reading-progress line.
- Pictures are shown whole (never cropped), and speech bubbles sit beside or below a picture, never on top of faces.

## Verification

```sh
node tests/v14-content.test.cjs
```

Checks the 19-story order, the three parts and the games section, that every image exists, and that copy removed in review stays removed.
