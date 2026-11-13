# V8 story artwork

All 26 stories now have a distinct visual. Eighteen use original editable SVG spot illustrations, three have newly generated editorial scenes, and five retain the existing illustrations. The cover, chapter stocks, copy, source qualifiers, and V6 swipe path remain unchanged.

The spots use ink outlines, source-derived Flatland accents, and a small halftone grounding shadow. They are editorial metaphors, not measured charts or representations of actual product screens. The approval and backend graphics preserve the distinction between a completed step and checks still to come. No metrics, labels, dates, or badges are added to the reading surface.

## Files and rendering

- Assets: `dist/assets/story-graphics/` and the matching saved V8 asset directory.
- SVG source: `scripts/create-story-graphics.py` (reproducible).
- Story-level source, alternative text, and treatment: `visual` in `stories.js`.
- Raw generated originals remain in the Codex generated-images directory; production WebP derivatives are at most 1200 pixels wide.
- Illustration composition is completed in the existing webpage, with the retained black Cars24 logo, Anton headline, Geist body, and Flatland chapter stock. These supporting images intentionally contain no embedded branding or typography: an additional social-poster composition would repeat the reading furniture the user removed.
- Images are lazy-loaded, have reserved dimensions and descriptive alternative text, and do not intercept pointer input. Spots use `contain` to preserve their complete silhouette. New editorial scenes also use `contain`, keeping faces and gestures intact; their warm paper matte is intentional. Long stories receive smaller artwork.

## Built-in image-generation prompt set

Provider: built-in `image_gen`; use case `illustration-story`. Shared direction: hand-painted editorial newspaper illustration, imperfect black outlines, subtle risograph grain, Flatland optimism, sky blue #80C5FF, soft pink #F9D1F4, builder green #C6E496, warm cream, black ink. Central horizontal composition, readable when small, no words, dates, UI labels, logos, watermarks, or named-person likenesses. Illustrations are not documentary photographs.

1. **Badminton** — A South Asian woman and man in comfortable sports clothing beside a badminton net, holding rackets and sharing an understated high-five after a game. One shuttlecock and a small trophy on a bench. Natural proportions, readable silhouettes, one clear moment, airy background. Original: `exec-050d3318-812d-4d4e-8ecb-0c4326f81c1d.png`; production: `badminton.webp`.
2. **Milo** — A calm South Asian colleague in a green shirt at a desk, laptop partly visible, gently pausing with a warm cup of tea. Small plant, open notebook, one unlettered conversation bubble on the laptop. Quiet natural expression. No robot, medical symbols, or claims; the story's therapy qualification stays in live text. Original: `exec-d857d9e9-beb1-4ba9-b3a8-7b052afb4b0e.png`; production: `milo.webp`.
3. **People & Culture Hackathon** — Three South Asian colleagues around a worktable connecting paper workflow shapes with a pencil. An open laptop, pinned notes without writing; one colleague shares an idea while another moves a paper node. Grounded everyday teamwork, warm observed human moment. No futuristic robots, dashboards, gradients, charts, badges, or confetti. Original: `exec-15ac93f3-8b66-4d68-81d4-f9514242ceb4.png`; production: `hackathon.webp`.

## Validation

Content and motion regression checks pass. All 26 stories were checked in the in-app browser at 320×568, 393×852, and 1440×900 (78 observations): every image loaded, every image had alternative text, the active card stayed inside the viewport, and there was no horizontal overflow. Longer prose remains vertically scrollable inside its sheet, including on small phones; it is not clipped or reduced to tiny type. A swipe starting on the Miles illustration advances to the next story, and the long startup story's sources remain reachable by scrolling. Evidence: `../output/v8-story-art-audit.json`, mobile and desktop screenshots. Physical mobile Safari testing remains outside this browser check.

## Dhanteras update · 13 November 2026

V8 and V9 now contain 25 stories after the requested removals and addition. The Dhanteras illustration is an original editable SVG at `dist/assets/story-graphics/dhanteras.svg`, mirrored into V8. It reuses the existing car silhouette, Flatland palette, black outlines, and halftone ground with a diya. The cars are symbolic; the supplied figure of 381 sales remains in the story copy. Frontier now sits in Tech Updates, and functional eyebrow labels omit personal names.
