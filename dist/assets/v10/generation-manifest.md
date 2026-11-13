# Pitstop V10 newspaper image generation

Date: 13 November 2026
Provider: built-in Codex image_gen. Each asset generated separately, original bitmap copied immediately and retained unchanged here; website uses 1600 × 900 WebP conversions (quality 88).
Authorization: user explicitly requested Maker Agent image regeneration for V10, newspaper/newsprint style, retained Cars24 logo identity and brand colours, discarded Flatland. This is a one-off art direction, with newspaper paper and engraving treatment overriding social-campaign canvas and flat illustration defaults. No persistent Maker rules changed.

## Layout plan

- Business: hero-led landscape reportage; one focal handover, horizontally balanced. Full-canvas hero, contained faces/hands; supporting hub edge crops. Newspaper style selected by user supersedes LT/DT campaign layout.
- Tech: hero-led close reportage, slightly elevated view; two engineers and one laptop. Full-canvas hero, focal interaction contained.
- Life: hero-led collective portrait around diya; centre-low action anchor, faces contained, supporting table edge crop.

## Reference map

- Maker Agent v2 master skill and CREATIVE-DIRECTION.md: rules-only, not attached. Copy brand palette, human locality, deliberate framing, style purity, export discipline. Ignore social aspect-ratio/theme defaults overridden by requested newspaper website.
- No external image references attached. User newspaper direction is a textual run-specific direction anchor.
- Official Cars24 logo is not generated in these scene assets. Parent page composes official unchanged SVG identity and accessible live HTML typography outside the bitmap. No raster logo overlay or simulated wordmark.

## Prompts

### press-business.png

Create a wide 16:9 editorial illustration intended for a Cars24 company newspaper, not an advertisement. The scene: a South Asian Indian customer in neutral casual clothing receiving car keys from a staff colleague beside a compact SUV in a contemporary Indian car marketplace hub, with restrained distant parked vehicles. One focal car-handover moment, all faces and key-carrying hands clear and contained; supporting hub structure can crop at far edges. Newspaper engraved reportage illustration: beautiful precise crosshatching, stipple, dense lithographic halftone dots and screenprinted ink, tangible slightly imperfect registration on clean near-white #F5F5F5 newsprint. High contrast near-black #161616 engraving and selective vivid Cars24 blue #4736FE ink on the car body and staff shirt. Blue is the dominant chromatic accent, neutrals carry the paper and ink, tiny mint #63FFB1 only in a supporting detail. Wide horizontally balanced composition with confident visual hierarchy, natural perspective, mature editorial art direction, plausible human anatomy, no flat cartoon, no comic book, no 3D rendering, no stock-photo gloss, no gradient blobs. No text, numbers, letters, logos, wordmarks, badges, typography or frames anywhere. Do not render hex values as text. The entire output is one clean newspaper illustration.

### press-tech.png

Create one wide 16:9 editorial newspaper illustration for the technology section of Cars24's company newspaper. Subject is two South Asian Indian product engineers collaborating around a laptop prototype in a plausible contemporary office; the laptop screen shows only a single simple side silhouette of a compact car and a few abstract geometric interface blocks, no text whatsoever. One dominant focal human collaboration moment and one supporting laptop. Show faces, hands and laptop clearly, contained, close reportage composition viewed slightly from above, desk touches lower edge, no extraneous tech objects or infographic network. Mature newspaper engraved reportage art: precise crosshatching and stippling, lithographic halftone print dots, tactile screenprint ink and subtle misregistration on near-white #F5F5F5 newsprint. High contrast near-black #161616 ink, selective saturated Cars24 blue #4736FE on laptop and one garment, blue dominant chromatic accent, neutrals everywhere else, tiny mint #63FFB1 detail allowed. Wardrobe modern neutral casual. Crisp natural proportions and anatomy, sophisticated editorial realism rendered as engraving. No cartoon/Flatland illustration, no 3D gloss, no gradients, no generic floating UI cards, no glowing brain, no robot, no network diagram. No letters, numbers, typography, captions, logos, wordmarks, frames or borders anywhere. Do not render hex values as text.

### press-life.png

Create one wide 16:9 editorial newspaper illustration for the people-and-culture section of Cars24's company newspaper. Subject: a small group of three South Asian Indian colleagues at their contemporary office during Diwali, warmly gathered around one small clay diya lamp on a shared table, one colleague carefully lighting it while the others smile. A restrained marigold garland in the distant office window suggests Diwali, avoid a decorative festival poster. One dominant collective human moment and one supporting diya lamp. Mature newspaper reportage engraved illustration: precise fine crosshatching and stippling, lithographic halftone dots, tactile screenprint ink with subtle imperfect registration on clean near-white #F5F5F5 newsprint. High contrast near-black #161616 ink; selective saturated Cars24 blue #4736FE on two garments and a subtle office element, blue dominant chromatic accent, most paper and skin/clothes neutral, tiny contextual warm orange only on flame and small garland. Friendly professional South Asian people, neutral modern casual office wardrobe, believable anatomy, protect every face and the lighting interaction, supporting table can crop at lower edge. Wide horizontal cinematic but quiet composition, foreground humans with restrained office depth. Same sophistication as an engraved Sunday newspaper feature. No Flatland, no flat cartoon/comic characters, no 3D rendering, no stock photograph gloss, no gradient blobs, no glowing effects. No text, numbers, letters, typography, logos, wordmarks, frames or borders anywhere. Do not render hex values as text.

## Visual QA

All three inspected from image_gen results: consistent mature crosshatched/halftone newsprint art; bright blue dominant chromatic accent, neutral ink/paper, tiny mint (business/tech) or orange (Diwali). Faces and focal hands clear. No text or logos hallucinated. Illustrations are imagined editorial scenes, not documentary event photography. Business SUV has recognisable generic contemporary design, no visible maker branding. Tech shows a simple car silhouette on laptop without readable UI. Life shows three colleagues lighting diya. No Flatland assets were used.

## Exact sources

- business: /Users/a39236/.codex/generated_images/01a1d4ff-a4c3-7e60-9ee9-43e822e7f627/exec-cabf35da-c44b-4645-909d-89d50809f945.png
- tech: /Users/a39236/.codex/generated_images/01a1d4ff-a4c3-7e60-9ee9-43e822e7f627/exec-10699921-c57d-4376-a291-b7a5cf81e96a.png
- life: /Users/a39236/.codex/generated_images/01a1d4ff-a4c3-7e60-9ee9-43e822e7f627/exec-85fb8b61-40a7-4f77-a106-dd2061c7ef07.png

## Website exports

/Users/a39236/Desktop/AI Workflow/Newsletter x flatland/newsletter-x-cars-24/dist/assets/v10/{press-business,press-tech,press-life}.webp



# V10 cover revision

User requested V9 cover composition in the approved newspaper ink style.

- Composition reference: original `dist/assets/cover-wide.webp`, attached as actual image input. Four colleagues, laptop, celebratory poses, winding road and car preserved.
- Style reference: `dist/assets/v10/press-tech.webp`, attached as actual image input. Engraved crosshatching, halftone, Cars24 blue, neutral paper.
- Built-in imagegen reference edit. No generated text or logo.
- Exact PNG archived as `press-cover.png` in this export; project delivery is `dist/assets/v10/press-cover.webp`.
- Visual QA: four characters and roles retained, laptop focal interaction, people remain in frame, no trophy/speech bubble/key decorations.
- User directed no visible illustration labels or generic captions. Provenance stays in this manifest and descriptive image alt text.
