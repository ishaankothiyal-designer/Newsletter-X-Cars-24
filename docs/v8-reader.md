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

## November 12: one-screen stories and merged Builders chapter

This section supersedes the earlier five-chapter structure and native media playback implementation. The edition now has 26 stories, four chapters, and 33 cards: Business highlights (7), Builders at Work (10), Life at Cars24 (5), and Thoughts & perspectives (4). The former Tech stories precede the three existing Builders stories. The old `#chapter-tech` link resolves to `#chapter-builders`.

The five flagged updates—H1, Startup Challenge, Figma/CMS, People & Culture Hackathon, and Diwali—have concise main-card summaries. Other long headlines and summaries were tightened as needed; all story bodies are at most 38 words. Full supplied updates remain unchanged in Story notes & sources, along with names, details, and status qualifiers. Source metadata and story IDs remain intact. Chapter cards use brief two-column navigation labels on phones, keeping all ten Builders entries reachable without scrolling.

At the default text size, 16px story text and responsive artwork fit all 33 cards at 360×640, 360×800, 375×667, 390×844, 393×852, 402×874, 430×932, 440×956, and 1440×900 CSS pixels. Chrome DOM measurements report zero vertical or horizontal overflow on every card; see `mobile-viewport-audit.json`. The overview was measured collapsed. Expanded navigation, source dialogs, enlarged text, and smaller viewports retain scrolling for accessibility. These are viewport simulations, not physical iPhone/Android device or hardware FPS tests. No unannounced device dimensions are assumed.

Audio uses one asynchronously decoded Web Audio buffer. The release handler never awaits decoding, resume, or playback; locked, loading, failed, or late audio cues are skipped. The cue is scheduled on the next animation frame, uses the recording’s natural pitch, and fades its tail to the paper’s departure timing. Repeated gestures cancel old cues, and reduced motion suppresses the cue. A short gain fade avoids abrupt cancellation clicks. Implementation references: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode and https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData .

Resting sheets reuse known transforms; only in-flight animations need computed-style reads. Image warming is deferred to the next frame. Trackpad deltas accumulate to 18px and lock to one turn per momentum burst, resetting after 110ms without horizontal input. Regression tests cover tiny deltas, inertia, reverse gestures, interruption, links, cancellation, reduced motion, and unavailable audio. Six consecutive 26px Chrome drags with sound enabled each advanced one page and retained exactly one active card.

## November 12: top alignment and very short repeated swipes

Story content now starts at the top of the sheet; the source row remains at the bottom, leaving open space below the summary. The main story group has no auto vertical margins.

Horizontal intent begins at 4px. A slow 8px drag or 6px flick at 0.14px/ms commits a turn. Stationary taps, 2px pointer jitter, and vertical movement do not turn the card. This supersedes the larger thresholds in earlier notes.

Rapid forward swipes preserve an earlier outgoing paper’s return animation instead of cancelling and freezing it mid-path. Each return retires independently; its completion cannot clear a newer transition. Re-grabbing a returning paper itself still freezes that paper at its rendered transform. Immediate jumps, viewport resets, and reduced motion cancel outstanding transitions as before.

Regression checks cover retained outgoing animations, cleanup of stale returns, reverse re-grabs, tiny drags, tap jitter, and previous gesture/audio contracts. The local browser advanced through eight consecutive 8px forward drags and four 8px reverse drags, retained one active card, and settled to exactly depths 0–3 without console errors.

## November 12: mobile recording and native-pan cancellation

The supplied 29.8-second mobile recording shows an overview card moving left then returning to its starting page, with vertical browser/page movement visible around the attempts. The recording also shows the earlier vertically centred copy. The gesture interruption suggests browser pan arbitration; the exact device event stream was not available.

Fitting papers now use `touch-action: pinch-zoom` instead of allowing native vertical panning across every paper. Actual overflow is measured before contact, with reads batched before attribute writes; expanded papers use `pan-y pinch-zoom`. Modes refresh after viewport changes, font readiness, and accordion toggles. A non-passive touchmove fallback prevents native panning only on fitting papers or after horizontal intent is established. Multi-touch remains unblocked, and a second finger cancels the active card drag without changing pages. Root overscroll is disabled to prevent page bounce. Source dialogs retain their normal scroll behavior.

The touch-action contract and pointercancel interaction are documented at https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action . The relevant distinction is established before the gesture begins, rather than changing touch-action partway through contact.

Local Chrome verification at 390×640: the collapsed overview reports no overflow and pinch-zoom; opening Thoughts & perspectives produces 155px of overflow and switches to pan-y pinch-zoom; closing it restores the swipe mode. Ten successive 8px horizontal / 3px vertical diagonal drags advanced exactly one page each. All 33 default papers reported no overflow; the stack settled to depths 0–3 with one active paper and no console errors. The iPhone/WebKit cancellation path is covered with event-policy regressions, not physical-device reproduction.
