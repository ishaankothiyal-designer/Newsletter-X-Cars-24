# The Pitstop — V8 only

V8 is the only edition, served at `/` and `/versions/v8/`. The header and contents menu contain no version controls. The Contents menu has no Page sound or Test page sound controls; page-turn audio remains automatic on committed swipes. Earlier version directories, manifests, pickers, preview pages, and unused reader implementations have been removed.

## Current motion and sound refinement

The original V6 stack geometry and opaque card-to-back path remain, with responsive release timing. The old fixed 720/480ms timings described in the historical sections below are superseded: departure is 140–240ms based on remaining distance and flick velocity (210ms by default), followed by a 240ms return behind the stack. Each leg has its own easing; the timeline itself is linear. Snap-back is 160ms. Release begins at the last painted transform, without forcing a final drag write and immediate layout read. Height-only mobile viewport changes defer during a drag or settling animation; width/orientation changes remain immediate.

The harsh synthetic noise is replaced by a trimmed, filtered, faded public-domain paper recording. Its mastered RMS is approximately 0.025 and peak 0.22, with no added landing impact. Native playback is tied to the departure duration, preserving pitch. The cue is aligned once to the visual timestamp; small native start delays are trimmed, while delays over 90ms are skipped. Touchend retries only blocked playback within 75ms and never restarts an already-pending clip. Re-grabbing a card stops the old cue. Preview playback is unrestricted by the animation deadline.

Browser checks: completed and rapid swipes, interruption, one active card, opaque stable depths 0–3, and silent short-drag snap-back. Observed native audio start latency in this browser was 5–6ms. Motion, viewport, sound, and content regressions pass. This is not hardware frame-rate profiling or physical iOS audio verification.


## Content and design

The 34-card issue contains the original illustrated cover, accordion contents, five chapter introductions, 26 individual stories and an ending with Read again / Add your story. All four visible papers use different source-derived Flatland stocks. Five story-layout treatments use rounded headline type, ink frames, existing illustrations and supporting graphics. Story notes preserve original source links and qualifiers.

See `flatland-colour-system.md`, `v8-story-art.md`, `v8-cover-assets.md`, and `page-turn-audio-source.md` for current design and asset provenance. The current source map is `sources.js`.

## Validation

Content checks enforce V8-only files, absence of version controls, root/V8 parity, story integrity, colour contrast and complete artwork. Motion, viewport and sound tests cover interrupted drags, velocity-based release, quiet synchronised audio, silent snap-back and deferred mobile toolbar resizing.

## November 12: lighter gestures and image readiness

Horizontal intent starts at 6px. A committed turn needs the smaller of 28px or 6.5% of the card width, or a 12px flick at 0.22px/ms. Release includes the final pointer position; a tiny backwards wobble no longer cancels a swipe. Vertical reading, stationary link taps, interruption, ghost-click suppression, and reduced motion retain their existing behavior.

`reader-images.js` loads and decodes the current card, four ahead, and two behind without waiting in the animation. Current art has high fetch priority. Scene images have JPEG/PNG alternatives; spot graphics use deterministic PNG renders of the original SVGs, with those SVGs retained as fallbacks. The cover and Diwali illustrations use optimized WebP files with original PNG alternatives. A bounded retry and a failure-only Reload image action handle transient download or decode errors.

All 29 original live asset paths returned HTTP 200; no permanent missing-file failure was reproduced. Chrome local checks loaded all 26 story images and the cover, advanced with a 28px desktop drag and 24px drag at a 393×852 viewport, and allowed dragging from chapter story links. No console errors or horizontal viewport overflow were observed. These checks do not measure physical-device frame rate.

To regenerate spot PNGs, install `@resvg/resvg-js` as optional development tooling and run `node scripts/rasterize-story-graphics.cjs`; the script also accepts an absolute module path. Rendering preserves the original art at 800px width. There are no new site runtime dependencies.
