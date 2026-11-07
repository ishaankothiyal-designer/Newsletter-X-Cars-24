# The Pitstop V5 — newspaper layout and story deck

Research and implementation: 3 November 2026. Audience: Cars24 colleagues. Purpose: catch up on October, one story at a time.

## Reading the supplied references

The poster reference is closer to a risograph editorial collage than a conventional daily newspaper. Its defining elements are compressed, heavy uppercase type; one dominant ink colour on warm paper; a ruled modular grid; oversized lead typography; image blocks with a printed texture; and small supporting text placed in narrow side columns. The visual interest comes from a controlled collision of scales, rather than rounded containers. Fonts cannot be reliably identified from this image; V5 uses locally hosted Anton for a comparable condensed display role, with Geist for readable article text and Geist Mono for page furniture.

The album reference communicates a deck: the front item is fully visible, with two offset items behind it. Depth and overlap explain that more items are available. V5 adopts that spatial relationship while making each item an editorial page. It uses restrained paper corners rather than the album artwork's large rounded corners. The screenshot establishes a visual reference; it cannot establish the original interaction's timing, physics, or usability.

These images are design evidence, not instructions or newsletter source material. No text or subjects from the poster have been inserted into the newsletter.

## Research findings and design consequences

### 1. Editorial identity should survive changes in format

[Mark Porter Associates: The Guardian](https://markporter.com/work/the-guardian) describes extending the newspaper's design philosophy across print, websites, mobile sites, and apps. The useful principle for this project is continuity of identity across formats. V5 translates newspaper devices into a responsive reader: masthead, edition strip, section index, folio, lead headline, byline, image caption, and page number.

The traditional newspaper grid is adapted to the available space. On desktop, a section rail and upcoming-story note surround the main deck. On mobile, that surrounding furniture collapses into the masthead, Contents, and reading controls, and bylines move above the full-width article copy. Each card still has a recognisable newspaper hierarchy. This application is an editorial design judgment, not a usability result from the cited project.

### 2. Newspaper cues must support actual reading

The relevant lesson from newspaper redesign is a readable hierarchy rather than literal miniature newsprint. The implementation uses a large condensed headline with a separate sans-serif reading face. Article prose is kept in one main reading column beside a narrow byline rail; 35–60-word story summaries do not need multiple tiny text columns. Metric stories use a numeric lead, illustrated stories use a photo block, and statement stories use a headline, accent line, and numbered editorial stamp.

The deck now measures every card at its natural content height and uses the tallest result as a shared frame. The frame is at least square; smaller screens scroll the page vertically instead of scrolling inside a card. Content is never truncated by line clamps. A newspaper-like density is retained in the structure, while body text remains selectable HTML. Image treatments are CSS effects applied to existing editorial illustrations, with captions preserving their status as imagined scenes.

### 3. A 30-item deck needs an index

[NN/g: Carousel Usability](https://www.nngroup.com/articles/designing-effective-carousels/) recommends short carousels and identifies the cost of navigating many items. This edition contains 30 supplied stories, so the design knowingly exceeds that recommendation. A deck alone would make browsing inefficient.

V5 therefore retains the full Contents index, desktop chapter jumps, story counts, deep links, back/next buttons, and local resume. There is no autoplay. The deck is a reading mode; the index provides direct access to every story. The source's five-item recommendation is not treated as evidence that a 30-story deck is optimal. This is a tradeoff made to preserve the requested interaction and supplied content.

### 4. Show that more stories exist

[NN/g: The Illusion of Completeness](https://www.nngroup.com/articles/illusion-of-completeness/) discusses how a composition can appear complete despite content being off-screen. V5 shows two upcoming card edges rather than relying on dots alone. Supporting cues include a swipe instruction, a story counter, a Next button, and an upcoming headline on desktop. Whether these cues are sufficient for this audience should be checked with users; this implementation has browser verification rather than a user study.

### 5. Navigation cannot depend on swiping

[W3C WAI: Carousels](https://www.w3.org/WAI/tutorials/carousels/) requires keyboard operation, understandable focus management, and communication of changing content. V5 provides next/back buttons, left/right arrows, direct story links, and a polite announcement of the new story. Only the active card is interactive; inactive cards use both `inert` and `aria-hidden`. Focus moves to the reader if the previously focused card becomes inactive. Native dialogs isolate their keyboard interaction and restore focus when dismissed.

The [WAI animation guidance](https://www.w3.org/WAI/tutorials/carousels/animations/) specifically discusses hiding transitioning items from assistive technology. V5 treats only the selected story as the accessible slide even when an outgoing card is still visible during its exit. Because movement is reader initiated, no pause control is needed for automatic progression.

### 6. Preserve vertical reading and browser zoom

[MDN: touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action) documents how the browser and page share gesture handling. V5 uses `pan-y pinch-zoom` on the reader. Vertical gestures remain available for scrolling the page, and browser pinch zoom remains available. A custom horizontal gesture begins only after horizontal intent is established. Interactive links and buttons do not begin card drags. Pointer cancellation restores the current card.

### 7. Motion should explain the deck

[MDN: Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) supplies the native animation API used in V5. The motion changes only transform and opacity, leaving article layout stable. The top card tracks the pointer, then leaves the deck with a small rotation while the next card moves forward. Short accidental movements settle back. A direction reversal cancels an opposing flick. Bounds resist over-dragging at the beginning and end.

Timing is a project choice: approximately 390 ms for the departing card and 480 ms for the incoming stack. Those timings are not presented as research-proven constants. New navigation cancels superseded animation and continues from the visible transform. Chapter jumps and explicit index links land directly without flying across unrelated stories.

[MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) informs the motion alternative. V5 removes transition animation and drag rotation for that preference, while preserving swipe, buttons, keyboard navigation, and content access. [MDN: inert](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert) documents the inactive-card behavior.

## Colour and asset decisions

The prior Flatland palette remains the base: cream, Cars24 blue, green, pink, yellow, mint, and ice/sky blue. V5 now uses the original Flatland background SVGs, mapped to the paper colour of each card and scaled uniformly with cover. The source colours and grid geometry are preserved at full opacity. Deep blue provides legible editorial ink. Subtle procedural grain on the page shell suggests printing without baking text into raster assets; the earlier card halftone overlay is removed so the original Flatland patterns remain clean. The original extracted Flatland assets remain available to V4 and the background gallery.

Existing newsletter facts, source notes, external links, dates, target-versus-outcome distinctions, and all 30 stories remain in the existing `stories.js`. The edition opens with a dedicated newspaper title page: live Anton typography, the cream Flatland grid, ruled sections, and the existing team illustration in the same blue print treatment as the stories. A separate newspaper front page using the academy illustration follows it. A text link points to the existing story submission form.

## Version isolation

V1–V4 files are preserved byte for byte, checked against SHA-256 hashes collected before editing. V5 has a permanent saved reader under `versions/v5/`; the main URL defaults to V5. The shared picker registers the new version without editing the old snapshots. The production Site retains its existing identity and workspace access policy.

## Verification and limits

The browser audit exercises all 33 cards (opening slide, front page, 30 stories, completion) at 320, 375, 393, 414, 768, 844, and 1440 pixels. It checks horizontal overflow and the active/inactive accessibility state, then exercises navigation, direct index jumps, rapid input, mouse drag, cancellation, boundaries, deep links, resume, dialogs, and reduced motion. The audit runs axe against the active reader. Results are saved in `output/v5-browser-audit.json` outside the published site.

Desktop Chrome and emulated mobile touch are implementation checks. They do not substitute for physical iOS/Android testing, screen-reader testing with a person, or usability research with Cars24 colleagues. Existing October reporting remains historical and has not been independently re-reported as part of this design task.

## V5 refinement — patterns, editorial accents, and opening

The original Flatland SVG backgrounds replace solid fills in V5. Cream, green, pink, yellow, mint, sky, and ice variants retain the extracted artwork without recolouring or distortion. Every story receives a small editorial dingbat; a story-specific SVG line illustration appears as a small editorial cut beside images, numbers, or the statement-page colophon. Decorative marks are hidden from assistive technology and do not intercept pointers. Stars are restrained four-point accents rather than repeating wallpaper.

The opening uses live newspaper typography and the team illustration in blue ink. It is followed by the newspaper front page and all 30 stories. Progress, Contents numbering, chapter jumps, announcements, and resume storage account for both introductory slides. The existing story IDs remain stable. V1–V4 are untouched; both the root reader and the permanent V5 route receive the refinement.

## Latest refinement — consistent opening and editorial line art

The opening now follows the story cards: condensed uppercase title, cream Flatland paper, blue print illustration, folio, rules, and a live submission link. The original poster remains available in historical versions and on disk. All emoji have been replaced with monochrome SVG line drawings (tools, keys, charts, racket, seedling, telescope, and other story-specific motifs) in the reader ink colour. Their geometry and stroke weight are consistent across devices. There are no emoji fonts, rotated stickers, or full-colour decorative pictograms. The small line drawings remain decorative and non-interactive.

## Colour sequence

Adjacent V5 cards use different original Flatland themes. The opening is cream, the newspaper front page is pink, and the first story is green, followed by cream, pink, ice blue, yellow, sky blue, and mint. The Voice of Autonauts survey uses yellow after the pink badminton card. Every adjacent pair across the 33-card edition is checked for distinct background assets.

## Content fitting across the deck

The 33 cards are measured at their natural height after font loading and when viewport or text dimensions change. Every card shares the tallest required height, with a square minimum and a small rounding allowance. This retains the full Startup Challenge copy, deadline, link, graphic, and source footer inside the card. Internal vertical scroll regions have been removed; vertical wheel and touch gestures scroll the outer page. Horizontal gestures, buttons, and arrow keys still navigate the deck. The reusable `tests/v5-deck-fit-audit.cjs` checks every card at eight screen sizes on both routes and checks enlarged body text.

## Responsive bylines and surrounding newsprint

All 30 reporter bylines now use separate label and name elements with controlled spacing rather than blank line breaks. Desktop attribution uses a padded 112px column, while phones place the label and name above full-width article text with a dividing rule. Mobile body text is 15px, and reader controls, source links, and submission links have at least 44px touch height. The shared deck height continues to measure all content after wrapping changes.

The surrounding page uses a lightweight local SVG newsprint background: warm cream, grain, faint column marks, and fold lines. Its scale adjusts on phones. Original Flatland patterns remain on the story cards. Background marks are decorative artwork rather than unreadable duplicate article text or content exposed to assistive technology.
