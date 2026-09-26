---
name: portfoliov2-responsive-qa
description: >-
  Responsive design QA for PortfolioTRUEV2: desktop/tablet/mobile passes,
  overflow and spacing, typography scale, flex/grid behavior, hierarchy and
  motion at breakpoints, plus readability and accessibility flags. Use when
  reviewing or testing layout after CSS/Tailwind changes, SHOWCASE or overlay
  work, or when the user asks for responsive QA or breakpoint verification.
disable-model-invocation: true
---

# PortfolioTRUEV2 — responsive design QA

## Context

- Read `AGENTS.md` for SHOWCASE height tokens (`DETAIL_CARD_H`), overlay scroll rules, dot/carousel padding, and FEATURED WRITING overflow guidance.
- Read `.cursor/rules/neo-tokyo-game-ui.mdc` for typography roles (display/body vs monospace labels), grid/hover motion, and accent discipline.

## Viewport passes

Run **three** passes (or devtools device presets) at representative widths:

| Tier | Approx width | Focus |
|------|----------------|--------|
| Mobile | 360–430px | Single column, tap targets, line length, safe-area |
| Tablet | 768–834px | Intermediate columns, carousel/folder proportions |
| Desktop | 1280px+ | Full grid, hover states, max-width readability |

Slowly **resize** the window between tiers to catch breakpoint cliffs (jumps, wraps, truncation).

## Overflow and spacing

- **Horizontal**: no unintended sideways scroll on `body` or main sections; use devtools to find elements wider than the viewport. Align with repo guidance: `overflow-x-hidden` where clipping is intentional; do not fix by hiding overflow on ancestors that must show FEATURED WRITING/footer content vertically.
- **Vertical**: section panels should scroll in the **overlay** scroller (`AGENTS.md`); inner regions should not trap scroll unless deliberate.
- **Spacing**: consistent padding/margin rhythm across breakpoints (no random one-off `px` clusters); check gap utilities in flex/grid match neighboring sections.

## Typography scaling

- **Hierarchy**: titles, section labels, and body should remain distinct at small widths — no “everything same size” collapse unless intentional.
- **Line length**: long prose blocks should not become edge-to-edge on large screens if the design uses content max-widths elsewhere.
- **Monospace labels**: stay readable (not microscopic); watch `text-*` and `leading-*` at `sm`/`lg` steps.
- **Truncation**: ellipsis or clamps should not kill critical labels; verify menu/command rows.

## Flex and grid responsiveness

- Confirm **wrap** behavior: `flex-wrap`, `grid-cols-*` responsive steps, and `min-w-0` on flex children where text overflow is expected.
- **Alignment**: no accidental `stretch` that squashes media or cards; check `items-*` / `justify-*` at each tier.
- **Order**: if `order` or hidden-on-breakpoint utilities are used, tab order and visual order still make sense for keyboard users.

## Component adaptation

- Carousels, folder chrome, and overlays should **reflow** without overlapping controls or clipping CTAs.
- Images/PDF thumbs: aspect ratios and max heights stable across breakpoints.
- Sticky/fixed chrome: does not cover primary actions or focus rings on small screens.

## Accessibility and readability

- **Contrast**: white/zinc on black remains legible; accent colors are not the only state indicator.
- **Touch targets**: interactive rows/buttons meet comfortable hit areas on mobile.
- **Focus**: visible focus when tabbing at each breakpoint; no off-screen focus traps.
- **Motion**: hover-only affordances have a keyboard or visible equivalent; respect reduced-motion expectations if the app implements them.

## Hierarchy and animation quality

- **Visual rank**: Neo Tokyo command structure (labels above content, index cues) should survive narrow widths — no muddy stacking.
- **Motion**: Framer Motion / CSS transitions should not stutter or overshoot at mobile; durations feel consistent with desktop (not sluggish or hyper-fast only on one tier).
- **Hover-dependent UI**: on touch devices, ensure critical info is not hover-only.

## Deliverable format

Report findings as:

1. **Severity** — Blocker / Major / Minor / Polish  
2. **Viewport** — mobile | tablet | desktop | resize transition  
3. **Evidence** — route/section, element or class hint, what breaks  
4. **Suggested fix direction** — Tailwind/layout pattern, link to `AGENTS.md` constraint if relevant  

## Related skill

- Baseline browser verification: [portfoliov2-browser](../portfoliov2-browser/SKILL.md)
