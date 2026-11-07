## Current motion and sound refinement

The original V6 stack geometry and opaque card-to-back path remain, with responsive release timing. The old fixed 720/480ms timings described in the historical sections below are superseded: departure is 140–300ms based on remaining distance and flick velocity, followed by a 300ms return behind the stack. Each leg has its own easing; the timeline itself is linear. Snap-back is 200ms. Release begins at the last painted transform, without forcing a final drag write and immediate layout read. Height-only mobile viewport changes defer during a drag or settling animation; width/orientation changes remain immediate.

The harsh synthetic noise is replaced by a trimmed, filtered, faded public-domain paper recording. Its mastered RMS is approximately 0.025 and peak 0.22, with no added landing impact. Native playback is tied to the departure duration, preserving pitch. The cue is aligned once to the visual timestamp; small native start delays are trimmed, while delays over 90ms are skipped. Touchend retries only blocked playback within 75ms and never restarts an already-pending clip. Re-grabbing a card stops the old cue. Preview playback is unrestricted by the animation deadline.

Browser checks: completed and rapid swipes, interruption, one active card, opaque stable depths 0–3, and silent short-drag snap-back. Observed native audio start latency in this browser was 5–6ms. Motion, viewport, sound, and content regressions pass. This is not hardware frame-rate profiling or physical iOS audio verification.

# V8 reader — current design

The active implementation uses a varied Flatland editorial system: eight source stocks, four different colours in every visible four-card stack, and five story layouts. The previous chapter-wide colour mapping and uniform uppercase condensed story headings are superseded. See `flatland-colour-system.md` for the current colour and page-layout contract.

The issue still has 34 cards: original-art cover, accordion contents, five chapter introductions, 26 stories and ending. It retains the full-bleed original people artwork, cover subtitle, centred masthead, story graphics, notes and sources, V6 stack motion, swipe-over-links interaction and optional page-turn sound.

The sections below record earlier implementation work; where their colour or typography descriptions differ, the current contract above takes precedence.

# V8 — V6 design, lighter reading furniture

V8 retains the frozen V6 visual language: original Flatland SVG stock, source-derived black newspaper typography, paper impression and printed image halftone, square-corner sheets, and V6’s opaque card-to-back path and stack transforms. V6 itself is unchanged. The refinement removes redundant labels and surrounding furniture rather than replacing the design language.

The header uses a black Cars24 logo on the left, a truly centred Pitstop wordmark, and the issue month, Contents, and Versions on the right. On phones, Versions is inside the menu. The old masthead apparatus, rails, taglines and page footer are absent. Story cards contain a human title, an illustration where relevant, the prose, Story notes & sources, and one story counter. Original attribution, source links, status qualifiers, and full supplied prose remain available in the source panel. The second Diwali illustration is available there as well.

The reading order is 34 cards: opening cover, accordion contents, five chapter introductions, 26 individual stories, and ending. Chapters are Business highlights (7), Tech highlights (7), Builders at work (3), Life at Cars24 (5), and Thoughts & perspectives (4). The five former customer/dealer stories were removed at the user's request. The Dealer App product release remains in Tech.

All five chapter names are visible in the collapsed contents card on tested phones. Each accordion reveals story links and Open chapter; only one is expanded at a time. Chapter introductions list their own stories. Contents also provides previous/next actions as an alternative to swiping on phones. Desktop retains small side arrows and keyboard navigation. Read again returns to the cover; Add your story opens the existing form.

The cover uses portrait and landscape edits of the original V6 people-around-the-laptop artwork. The original group, poses, palette and illustration style are retained while the surrounding artwork is extended for full-bleed framing. The live Pitstop masthead overlays the image; the issue number and cover date are removed. The date appears only in the page header. No inset image or top/bottom letterboxing remains. The unrelated replacement Higgsfield scene is not used. Source prompts and asset provenance are in `v8-cover-assets.md`.

The viewport shell retains independently scrolling active paper, safe-area support, zoom, and dynamic available-height sizing. No text is reduced to fit. Only the active card is interactive. Long stories and expanded contents scroll within the paper; the surrounding page stays fixed.

Validation: `node tests/v8-content.test.cjs` checks the 26-story / five-chapter / 34-card contract, removal of the five stories, original source status, original cover usage, root/saved-route parity, and preservation of V6’s motion path, opacity and layering. Syntax and diff checks pass. In-app browser QA covered all 34 cards at 320×568, 375×667, 393×852, 414×896, 768×1024, 844×390, 1024×768, 1280×720, and 1440×900: 306 combinations. Checks cover outer and inner horizontal overflow, header and reader bounds, one active card, and all collapsed chapter names fitting. Additional UI checks cover accordion exclusivity, chapter/story jumps, mobile Versions, source links and extra artwork, scroll reachability, opaque card-to-back dragging, and preserving the current story across height changes. Evidence: `../output/v8-refined-audit.json` and refined desktop/mobile screenshots.

Physical iOS/Android toolbar, notch and touch behaviour remain device-testing limits. The 771-delivery lending figure is retained as supplied, with the existing reconciliation note. Future release targets and estimated savings retain their qualifiers.

## Swipe continuity refinement

V6’s stack offsets, rotations, opaque exit/layer handoff/return path, and 720ms outgoing / 480ms follower timings are preserved. Motion now reads all in-flight transforms before cancelling animations or writing styles. A new horizontal drag starts from those rendered transforms instead of snapping the stack to rest on pointer-down. Pointer samples are coalesced into one requestAnimationFrame write; the drag width is cached and only the visible sheets request compositing layers. The old back sheet remains underneath until the outgoing paper lands. Unchanged VisualViewport events no longer reset animation. Velocity-based flick acceptance, release reversals, vertical-reading intent, interrupted drags and reduced motion are covered by `tests/v8-motion.test.cjs`.

The updated browser audit (`../output/v8-swipe-audit.json`) covers 306 card/viewport combinations, edge-to-edge cover bounds, true header centring and collision avoidance, rapid swipes and stable stack depths 0–3, opacity, short drag snap-back and a scrollable story footer. Physical touch and hardware frame-rate profiling remain separate device checks; no fixed FPS guarantee is claimed.

## Source-derived colour revision

The complete 38-page Flatland PDF was reviewed through contact sheets, representative full-page renders, vector fills and text colours. Exact stocks are assigned per chapter: Business cream (#FFF7E8, physical page 10), Tech sky blue (#80C5FF, p32), Builders green (#C6E496, p4), Life pink (#F9D1F4, p22), and Perspectives lemon (#FAFFAD, p12). Every introduction and story in a chapter shares its stock. Cover/contents support is cream, and the ending uses mint (#CAFAE0, p28). Black ink follows the source's type-led pages. The full contract and reserved source colours are documented in `flatland-colour-system.md`.

136 browser card/viewport observations match the chapter-paper contract with no overflow or opacity failures. The content test checks exact source SVG fills, paper assignments, issue-number removal and muted-text contrast; the motion regression test still passes. Evidence: `../output/v8-flatland-colour-audit.json`.

## Swiping over card controls

Horizontal gestures can begin on story links, chapter buttons, source buttons, and contents accordion rows. A capture-phase click guard prevents the release of a drag from activating the control underneath; stationary taps and keyboard activation retain their normal behaviour. Vertical gestures still relinquish to the card’s reading scroll, and editable fields remain excluded. Regression coverage checks links, buttons, summaries, post-swipe taps, vertical intent, and keyboard clicks. Browser checks at 393×852 confirm story-link and accordion swipes turn exactly one card, ordinary taps still navigate/expand, and source-button swipes do not open the notes dialog.

## Story graphics

Every story has its own supporting visual: 18 ink-and-paper spot graphics, three new editorial illustrations (Milo, badminton, and the People & Culture Hackathon), and five retained scenes. Assets and prompt provenance, compact rendering for long stories, and the 78-observation responsive audit are documented in `v8-story-art.md`.

## Page-turn audio

Committed animated card changes play a short, quiet paper rustle synthesised through Web Audio. The reusable audio context is unlocked by a pointer or keyboard gesture; loading the issue, vertical reading, cancelled drags, boundary swipes, and direct chapter/story jumps stay silent. New turns replace the previous sound, and hidden tabs stop playback. The menu's Page sound control saves an on/off preference locally. Unsupported or blocked audio never prevents navigation. `tests/v8-sound.test.cjs` checks the sound envelope, silent unlock, context reuse, overlap prevention, persistent mute, hidden/unsupported playback, and one sound per actual turn. Browser checks confirm swiping over story links, menu toggling, and persistence after reload without console warnings or errors. Physical Safari audio routing and device volume remain device checks.

## Native audio correction

The initial Web Audio rustle is superseded by a preloaded native audio element and an original 420ms WAV at a clearly audible level. The same element is silently primed on contact, then restarted only for committed turns. A token prevents an asynchronous warm-up from muting or pausing an actual turn. A recently blocked/starting turn retries directly within touchend for WebKit activation. Enabling sound previews it; the menu also offers Test page sound. Mute persists and hidden tabs stop audio. Runtime browser evidence confirms the player enters playing after a swipe and then emits ended, and the test button plays. Device-specific Safari routing remains a physical-device verification limit. The mobile gesture choice follows https://webkit.org/blog/6784/new-video-policies-for-ios/ . `scripts/create-page-sound.py` reproduces the sound asset without external audio sources.
