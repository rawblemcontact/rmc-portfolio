---
name: portfoliov2-browser
description: >-
  Verifies PortfolioTRUEV2 in the browser after UI changes: dev URL, responsive
  breakpoints, motion, focus/keyboard, and common overlay/showcase regressions.
  Use when debugging layout, carousel, FEATURED WRITING, section panels, or
  accessibility, or when the user asks how to test the live UI.
disable-model-invocation: true
---

# PortfolioTRUEV2 — browser inspection and testing

## Baseline

1. Start or confirm `npm run dev` (see `portfoliov2-terminal`).
2. Open `http://localhost:5173` (or the port Vite prints).

## Responsive UI

- Check **mobile**, **tablet**, and **desktop** widths; pay attention to SHOWCASE card height caps (`DETAIL_CARD_H` / `svh` behavior).
- Validate **horizontal overflow**: section panels often need `overflow-x-hidden` without clipping vertical content (see `AGENTS.md`).

## Neo Tokyo / motion

- Hover interactions use **underline scale** and **6px row shift** per `.cursor/rules/neo-tokyo-game-ui.mdc`.
- Respect `prefers-reduced-motion` if the codebase exposes toggles or media queries — do not add seizure-inducing flashing.

## Accessibility checks (manual)

- **Keyboard**: Tab through command/menu controls; ensure focus order is logical and focus rings visible.
- **Dialogs/overlays**: Esc to close if implemented; return focus to trigger.
- **Contrast**: white/zinc on black should remain readable; cyan accents are decorative — do not rely on color alone for state.
- **Labels**: icon-only controls need `aria-label` or visible text consistent with existing components.

## Regression targets from `AGENTS.md`

- Section overlay: scrolling works, **scrollbars stay hidden** (`no-scrollbar` pattern).
- **FEATURED WRITING**: footer row not clipped; PDF thumb loading acceptable.
- **SHOWCASE dots**: padding alignment with carousel per repo guidelines.

## Tooling gap

There is **no** bundled Playwright/Cypress in this repo. Prefer **manual** verification plus targeted code inspection unless the user adds a test stack.

## Related skills

- Structured responsive passes (overflow, type scale, flex/grid, hierarchy, motion): [portfoliov2-responsive-qa](../portfoliov2-responsive-qa/SKILL.md)
- Multi-viewport screenshots + breakage report: [responsive-testing](../responsive-testing/SKILL.md)
