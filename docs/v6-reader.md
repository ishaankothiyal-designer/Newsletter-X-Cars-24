# V6 — viewport reader and cards to the back

V6 preserves the V5 newspaper identity, original Flatland themes, editorial line illustrations, and verified source links. It adds a persistent back sheet and a device-height mobile reader.

## Mobile and tablet layout

At widths up to 1024px, the complete reader shell fits within the available viewport height. A compact newspaper header and fixed reading controls surround the card area. Safe-area insets preserve space around device cutouts and the home indicator. The card receives the remaining space. On short landscape viewports, the large masthead is collapsed while the logo, edition identity, reader controls, and footer remain.

Long content scrolls inside the active card. Vertical touch gestures scroll that card; horizontal gestures turn to the next story. Overflow text is not removed or compressed to fit. Every story footer remains reachable within its scroll region. The selected story stays selected when available browser height changes. Source and version dialogs scroll independently within the same available viewport.

The implementation uses [dynamic viewport sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length), [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport) for available-height updates, and [safe-area environment variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env). Pinch zoom does not trigger a competing UI-height adjustment.

## Card-to-back interaction

A forward swipe moves the whole outgoing paper around the left edge and tucks it behind the upcoming stack. The paper remains opaque, and its edge remains visible at the back after the turn. Only the active sheet is interactive. Rapid navigation cancels superseded animation, and reduced motion changes the stack immediately without animated travel.

Desktop retains the content-sized deck. V1–V5 are preserved unchanged, including V5’s full-height page-scrolling design.

## Validation

`tests/v6-mobile-viewport-audit.cjs` checks all 33 cards on both the root and saved V6 routes at 320×568, 360×640, 375×667, 393×852, 414×896, 430×932, 768×1024, 844×390, 932×430, and 1024×768. It checks shell and control bounds, inner-scroll reachability, overflow, touch gestures, opaque card-to-back animation, dynamic height changes, source links, Contents, reduced motion, and an automated accessibility scan. `tests/v6-stack-audit.cjs` also checks desktop motion, rapid navigation, and stack state.

These are Chrome browser and emulated touch checks. Physical iOS and Android toolbar, notch, and orientation behaviour remain separate device-testing limits.
