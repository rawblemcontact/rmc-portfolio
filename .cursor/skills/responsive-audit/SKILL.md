---
name: responsive-audit
description: >-
  Manual /responsive-audit command for PortfolioTRUEV2. Runs ONLY when the user
  explicitly types /responsive-audit — never auto-invoke. Accepts viewport
  arguments (desktop, tablet-landscape, tablet-portrait, mobile-large,
  mobile-small, all). Tests and fixes only the requested viewport(s), re-tests
  those viewports, and produces a scoped audit report.
disable-model-invocation: true
---

# /responsive-audit

**Manual command only.** Do not run this workflow unless the user's message explicitly contains **`/responsive-audit`**. Do not auto-invoke from layout/CSS edits, PR reviews, or ambient context.

## Invocation gate

If the user did **not** type `/responsive-audit`, stop — do not follow this skill.

## Viewport arguments (required)

Parse tokens immediately after `/responsive-audit`. Multiple viewports may be specified in one command.

| Argument | Width(s) tested |
|----------|-----------------|
| `desktop` | 1920px, 1440px |
| `tablet-landscape` | 1024px |
| `tablet-portrait` | 768px |
| `mobile-large` | 430px |
| `mobile-small` | 375px |
| `all` | Every width in the table above (full audit) |

**Examples**

```
/responsive-audit tablet-landscape
/responsive-audit tablet-portrait
/responsive-audit mobile-large
/responsive-audit tablet-landscape tablet-portrait
/responsive-audit all
```

**Argument rules**

- If **no** viewport argument is given, ask the user which viewport(s) to target before proceeding. Do not assume `all`.
- If **`all`** is present, ignore other tokens and run the full audit at every supported width.
- Otherwise, test **only** the union of explicitly named viewports — no extra widths.

## Viewport-scoped discipline

1. **Test only** the viewport(s) specified by the command arguments.
2. **Apply fixes only** for issues observed at the selected viewport(s).
3. **Minimize impact** on non-selected breakpoints — verify shared-rule edits do not alter other tiers.
4. **Do not modify desktop layouts** when auditing tablet-only viewports unless absolutely necessary (e.g. shared unscoped rule is the root cause).
5. **Do not modify tablet layouts** when auditing mobile-only viewports unless absolutely necessary.
6. **Avoid broad global CSS** when a viewport-scoped solution exists.
7. **Prefer targeted fixes**: Tailwind breakpoint prefixes (`max-lg:`, `md:`, `max-md:`, arbitrary variants like `max-[430px]:`), scoped rules in `index.css` with explicit media queries — not unscoped base styles.
8. Preserve existing design, functionality, animations, and visual hierarchy.
9. Make the **smallest possible code changes** required to resolve issues.
10. **Re-test only** the selected viewport(s) after fixes are applied.

When `all` is used, perform the existing full responsiveness audit across every supported viewport and re-test all widths after fixes.

## Repo context (read first)

1. `AGENTS.md` — overlay scroll, SHOWCASE/FEATURED WRITING overflow, editing discipline.
2. `.cursor/rules/neo-tokyo-game-ui.mdc` — design language (must preserve).
3. `.cursor/rules/Breakpoint-Isolation.mdc` — fix only the breakpoint tier that breaks; keep others identical.
4. `docs/responsive-reference.md` — Tailwind default breakpoints vs QA buckets.
5. [portfoliov2-browser](../portfoliov2-browser/SKILL.md) — dev server, manual browser checks.
6. [portfoliov2-responsive-qa](../portfoliov2-responsive-qa/SKILL.md) — overflow, flex/grid, hierarchy checklist.

## Workflow

### 1. Launch and inspect

1. Start or confirm `npm run dev` (see [portfoliov2-terminal](../portfoliov2-terminal/SKILL.md)).
2. Open `http://localhost:5173` (or the port Vite prints).
3. Use browser devtools or available browser MCP tools when present; otherwise manual resize + code inspection.

### 2. Scope recent changes

Determine affected surfaces before testing:

```bash
git diff --name-only HEAD~5
git diff --name-only
git log -5 --oneline
```

Map changed files to UI areas (most layout lives in `src/pages/Home.tsx` and `src/components/`). Prioritize audit passes on sections touched by recent diffs; still smoke-test hero, command menu, and all five section overlays **at the selected width(s) only**.

### 3. Breakpoint passes (selected viewports only)

Build the test list from parsed arguments:

| Argument | Width(s) |
|----------|----------|
| `desktop` | 1920px, 1440px |
| `tablet-landscape` | 1024px |
| `tablet-portrait` | 768px |
| `mobile-large` | 430px |
| `mobile-small` | 375px |

At **each selected width**, visit:

- Hero / command menu
- Each section overlay: PROFILE, PROJECTS (SHOWCASE + FEATURED WRITING), EXPERIENCE, SKILLS, CONTACT
- Any routes or modals opened from recent changes

When multiple adjacent selected widths are tested, slowly resize between them to catch breakpoint cliffs **within the selected range only**.

### 4. Check for and fix

| Issue | What to look for |
|-------|------------------|
| Horizontal scrolling | `document.documentElement.scrollWidth > innerWidth`; wide fixed widths |
| Viewport overflow | Content past viewport edges; missing `overflow-x-hidden` where intentional |
| Clipped / truncated text | Bad `line-clamp`, missing `min-w-0`, ellipsis on critical labels |
| Content off-screen | Absolute/fixed positioning; negative margins; `100vw` scrollbar bleed |
| Broken flexbox | Missing wrap, wrong `flex-shrink`, stretch squashing media |
| Broken grid | Wrong `grid-cols-*` at tier; gap collapse |
| Improper scaling | Images/PDF thumbs; `svh` caps (`DETAIL_CARD_H`) |
| Misaligned elements | Dot pager vs card borders; PROFILE gutter parity |
| Excessive whitespace | Dead gaps after reflow; empty flex space |
| Hidden / inaccessible content | `overflow-hidden` clipping FEATURED WRITING footer; hover-only info on touch |
| Framer Motion issues | Layout shift, stutter, overshoot; check `useReducedMotion` paths |
| Tablet-specific issues | 768–1024px intermediate columns, carousel/folder proportions |
| Mobile issues | Tap targets, safe-area, single-column reflow |
| Overlapping elements | z-index, sticky chrome covering CTAs |
| Sections not fitting viewport | Overlay scroller vs inner trapped scroll |

**Fix selection priority** (most to least scoped):

1. Arbitrary variant at exact width (`max-[430px]:`, `min-[769px]:max-lg:`)
2. Tailwind breakpoint prefix matching the tier (`max-md:`, `md:max-lg:`, `lg:`)
3. Section-scoped CSS with explicit `@media` in `index.css`
4. Shared base / unscoped change — **last resort**; document why in the report

Do not change content or copy. Do not introduce new features. Do not redefine global Tailwind breakpoints (see `docs/responsive-reference.md`).

### 5. Re-test loop

1. After each fix batch, re-run passes at **only the selected viewport(s)** on affected sections.
2. Iterate until **major** issues are resolved at those viewports.
3. Minor/polish items may remain — document them in the report.
4. When the audit was **not** `all`, note in the report any areas that may benefit from `/responsive-audit all`.

## Final report (required)

Deliver this structure when the audit completes:

```markdown
# Responsive Audit Report

## Summary
[One paragraph: scope, viewports targeted, overall health, fix count]

## Viewport(s) tested
- [e.g. tablet-landscape @ 1024px]
- [e.g. tablet-portrait @ 768px]

## Files modified
- `path/to/file` — [brief reason; note if fix is viewport-scoped]

## Issues discovered
| Severity | Viewport | Section / component | Issue | Status |
|----------|----------|---------------------|-------|--------|
| Blocker / Major / Minor / Polish | e.g. 768px (tablet-portrait) | e.g. PROJECTS carousel | … | Fixed / Open |

## Fixes applied
- **[Section]** @ **[viewport]** — [what changed, scoping strategy, minimal diff rationale]

## Potential regressions / follow-up
- [Non-tested viewports that share edited selectors or may need `/responsive-audit all`]
- [Anything not auto-fixable: subjective polish, device-specific, motion edge cases]
```

Severity guide: **Blocker** = unusable or major overflow; **Major** = broken layout or clipped primary content; **Minor** = misalignment or spacing; **Polish** = optional refinement.

## Regression targets (PortfolioTRUEV2)

After fixes, verify at **each selected viewport** (and spot-check adjacent non-selected widths if shared CSS was touched):

- Section overlay scrolls; scrollbars hidden (`no-scrollbar`).
- FEATURED WRITING footer not clipped.
- SHOWCASE dots align with card borders.
- SKILLS desktop gutters match PROFILE (`PROFILE_VIEWPORT_CONTENT_MAX`) — when `desktop` or `all` is selected.
- `prefers-reduced-motion` paths usable.
- No new horizontal bleed on mobile — when any mobile viewport is selected or shared CSS was edited.
