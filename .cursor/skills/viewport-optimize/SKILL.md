---
name: viewport-optimize
description: >-
  Manual /viewport-optimize command for PortfolioTRUEV2. Runs ONLY when the user
  explicitly types /viewport-optimize — never auto-invoke. Uses Playwright to
  evaluate the current page/section as a senior UI designer, fit content above
  the fold on desktop, optimize typography hierarchy (in-section + portfolio-wide),
  apply minimal CSS/layout tweaks, then regression-test desktop, tablet landscape,
  tablet portrait, and mobile. Verify visually before stopping.
disable-model-invocation: true
---

# /viewport-optimize

**Manual command only.** Do not run unless the user's message explicitly contains **`/viewport-optimize`**. Do not auto-invoke from layout edits, PR reviews, or ambient context.

## Invocation gate

If the user did **not** type `/viewport-optimize`, stop — do not follow this skill.

## Mission (user intent — follow verbatim)

Use Playwright. Open the current page and evaluate it as a senior UI designer.

Ensure the entire page/section fits comfortably above the fold on desktop.

Optimize font sizes, typography hierarchy, element proportions, spacing, padding, margins, alignment, and viewport utilization.

Reduce wasted space and oversized elements while preserving all content, styling, branding, colors, animations, and functionality.

Make the smallest changes necessary.

Validate desktop, tablet landscape, tablet portrait, and mobile to ensure no regressions.

Verify the result visually before stopping.

## Scope arguments (optional)

Parse tokens after `/viewport-optimize`:

| Argument | Meaning |
|----------|---------|
| *(none)* | Optimize the **section or surface the user is discussing**; if unclear, default to the open overlay in browser or ask once. |
| `hero` | Hero / command menu only |
| `profile` | `#profile` |
| `projects` | `#projects` (SHOWCASE + FEATURED WRITING) |
| `experience` | `#experience` |
| `skills` | `#skills` |
| `contact` / `social` | `#social` |
| `all` | Every section overlay + hero smoke pass |
| `type` / `typography` | **Type-only pass** — hierarchy + portfolio parity; skip layout unless type change breaks fold |

**Examples**

```
/viewport-optimize
/viewport-optimize projects
/viewport-optimize projects type
/viewport-optimize profile skills
```

## Tooling — Playwright required

1. Confirm `npm run dev` (see [portfoliov2-terminal](../portfoliov2-terminal/SKILL.md)).
2. Use **`user-playwright`** MCP — read tool schemas under `mcps/user-playwright/tools/` before calling.
3. **Do not** substitute cursor-ide-browser unless Playwright is unavailable; if blocked, report and stop.
4. Primary tools: `browser_navigate`, `browser_resize`, `browser_run_code_unsafe`, `browser_take_screenshot`, `browser_click` / `browser_evaluate` for navigation.

### Measurement scripts

Scripts live in `.cursor/skills/viewport-optimize/scripts/`. **Read the file from the repo**, then pass its full contents as the `code` argument to `browser_run_code_unsafe` (Playwright MCP `filename` only resolves under its server root, not the workspace).

Edit constants at the top of each script (`sectionId`, `sweepPortfolio`, etc.) before running.

| Script | Purpose |
|--------|---------|
| `scripts/measure-fold.js` | Fold fit: overflow, top/bottom gap, symmetry (`gapDeltaPx`) |
| `scripts/measure-type-hierarchy.js` | In-section type roles + portfolio cross-section sample |

**Typography reference:** [portfolio-type-reference.md](./portfolio-type-reference.md) — global tokens, per-section roles, ratio targets, fix patterns.

## Repo context (read first)

1. `AGENTS.md` — overlay scroll, SHOWCASE tokens, editing discipline.
2. `.cursor/rules/neo-tokyo-game-ui.mdc` — typography roles, grid, motion (preserve).
3. `.cursor/rules/Breakpoint-Isolation.mdc` — desktop fixes must not alter tablet/mobile unless shared rules are unavoidable; verify all tiers after shared edits.
4. [portfoliov2-profile-viewport-gutters](../portfoliov2-profile-viewport-gutters/SKILL.md) — when PROFILE/PROJECTS/SKILLS gutters are in scope.
5. `src/index.css` — `--section-main-font-display`, `--section-subhead-font`, section overrides (e.g. `#projects --projects-type-*`).

## Viewport matrix (always test after fixes)

| Tier | Size | Height | Notes |
|------|------|--------|-------|
| Desktop | 1440×900 | also spot 1920×1080, 1280×720 | **Primary optimize target** — above-the-fold fit |
| Tablet landscape | 1024×768 | coarse pointer if emulatable | iPad rules; `pointer: coarse` CSS may apply |
| Tablet portrait | 768×1024 | | Portrait tab/folder layouts |
| Mobile | 390×844 | also 375×667 | Safe-area, single column |

## Workflow

### 1. Baseline — open and measure

1. Navigate to `http://localhost:5173`.
2. Open target section (command menu click or `navigateTo` equivalent).
3. At **desktop** sizes, run **both** scripts (unless `type`-only scope):

**Fold** (`measure-fold.js`):

| Metric | Target |
|--------|--------|
| `panelOverflowPx` | **0** for showcase list views |
| `bottomGapPx` | **≤ ~24px** when flex-start; **symmetric** when centered (`gapDeltaPx` ≈ **0**) |
| `gapDeltaPx` | **|Δ| ≤ 4px** when section uses vertical centering |
| `clipped` | **false** |
| `headerFontPx`, `cardHeightPx`, `contentHeightPx` | proportion sanity |

**Typography** (`measure-type-hierarchy.js` — set `sectionId`, `sweepPortfolio: true`):

| Output | Target |
|--------|--------|
| `hierarchy.issues` | **empty** — no flat or inverted adjacent roles |
| `hierarchy.ratios` | display → headline ≈ **0.62–0.68**; body ≈ **0.42–0.50**; eyebrow ≈ **0.32–0.38** |
| `portfolioParity` | **empty** — display within **±2px** of portfolio median; muted body ≥ `--section-eyebrow-font` |
| `typographyOk` | **true** |

4. Capture **screenshot** before changes (`viewport-optimize-before.png`).

### 2. Senior UI designer review (write briefly before coding)

For the target section, note:

- **In-section hierarchy**: Are display / headline / card / ui / body / eyebrow distinct? Grey text readable?
- **Portfolio parity**: Does section display match other section mains? Is muted copy smaller than command micro labels?
- **Proportions**: Cards, thumbs, mascots vs viewport — oversized or squashed?
- **Rhythm**: Padding/margin gaps — consistent or lopsided (especially dead bottom space)?
- **Alignment**: Dots, gutters, rule lines, tab strips — optical alignment with borders?
- **Utilization**: Flex growth, `min-h-full`, `justify-center` vs `flex-start` — empty bands?

Rank issues: **fold blockers** (overflow/clipping) → **wasted vertical space** → **type/scale polish** → **portfolio drift**.

### 3. Fix — minimal diff only

**Priority order**

1. Layout/flex fill (section fills panel; kill bottom black band) — often `#projects` / wrapper `flex-1`, `pointer: fine` desktop scoping.
2. **Typography tokens** — section-scoped vars (e.g. `--projects-type-display` … `--projects-type-eyebrow`) wired to semantic roles; scale **type + line-height + gap** together when body grows.
3. Proportional scale tokens (`--*-fit`, `clamp`, `svh`) — **never height-only squish**; scale type + spacing + size together.
4. Typography caps in scoped `@media (min-width: 1024px) and (pointer: fine)` — not global `html` font changes.
5. Trim padding/margin (`padding-top`, header `margin-bottom`, section `pb`) before deleting content.

#### Typography fix patterns

| Problem | Fix |
|---------|-----|
| Flat hierarchy (card title ≈ headline) | Bump headline or lower card; keep **≥1.5px** step between adjacent roles |
| Grey body too small | Raise `--*-type-body`; optionally trim panel `gap` / header margin to preserve fold |
| Grey body too large vs white titles | Lower body or raise card/headline — body must stay **below** card in hierarchy |
| Section display drifts from portfolio | Align to `--section-main-font-display` unless intentional override |
| Muted below eyebrow token | Body floor = `max(computed body, --section-eyebrow-font)` at desktop |
| Type fix breaks fold | Re-run `measure-fold.js`; compensate spacing before shrinking type |

**Do not**

- Remove copy, features, animations, or brand colors.
- Drive-by refactors across unrelated `Home.tsx` blocks.
- Change tablet/mobile tiers when optimizing desktop unless verifying regressions afterward.
- Use `transform: scale()` on text (blurry); prefer font-size / spacing tokens.
- Edit `:root` `--section-main-font-display` for one section — use section-scoped overrides.

**Prefer**

- Section-scoped rules in `src/index.css` with explicit media queries.
- Reuse existing tokens (`DETAIL_CARD_H`, `PROFILE_VIEWPORT_CONTENT_MAX`, `SECTION_MAIN_HEADER_*`, `--section-*-font-*`).
- Semantic role vars per section (`--projects-type-*` pattern) — document in [portfolio-type-reference.md](./portfolio-type-reference.md).
- `pointer: fine` for laptop/desktop vs `any-pointer: coarse` for iPad-only rules.

### 4. Regression pass — all four tiers

After each fix batch, re-run **both** measurement scripts and screenshots at:

- Desktop: 1440×900 (required), 1280×720 if short viewport rules touched.
- Tablet landscape: 1024×768.
- Tablet portrait: 768×1024.
- Mobile: 390×844.

**Regression checklist** (PortfolioTRUEV2)

- Section overlay scrolls; scrollbars hidden.
- FEATURED WRITING footer not clipped (`#projects`).
- SHOWCASE dots align with card borders.
- SKILLS gutters match PROFILE on desktop.
- No new horizontal bleed on mobile.
- `prefers-reduced-motion` paths still usable (smoke).
- **Typography:** `typographyOk` true at desktop; no tablet/mobile size regression from shared rules.

If a shared rule regresses a non-target tier, revert or split the rule before continuing.

### 5. Visual verification — required gate

**Do not stop until:**

1. Desktop screenshot **after** fixes (`viewport-optimize-after.png`) reviewed at 1440×900.
2. Side-by-side mental check: hierarchy preserved, grey text readable, no crushed type, no clipped CTAs.
3. Metrics improved vs baseline (overflow/clipping resolved; gap symmetry; `typographyOk` true).

If metrics pass but screenshot looks wrong, iterate.

## Final report (required)

```markdown
# Viewport Optimize Report

## Target
[Section / surface optimized]

## Summary
[One paragraph: designer read, what changed, fold + typography outcome]

## Fold metrics (desktop 1440×900)
| Metric | Before | After |
|--------|--------|-------|
| panelOverflowPx | | |
| topGapPx | | |
| bottomGapPx | | |
| gapDeltaPx | | |
| clipped | | |

## Typography (desktop 1440×900)
| Role | Before (px) | After (px) |
|------|-------------|------------|
| display | | |
| headline | | |
| card | | |
| body | | |
| eyebrow | | |

**Hierarchy issues:** [none / list]
**Portfolio parity:** [ok / drift notes]
**typographyOk:** [true/false]

## Files modified
- `path` — [minimal change + scoping]

## Regression
| Tier | Size | Status | Notes |
|------|------|--------|-------|
| Desktop | 1440×900 | OK / Issue | |
| Tablet landscape | 1024×768 | | |
| Tablet portrait | 768×1024 | | |
| Mobile | 390×844 | | |

## Screenshots
- Before: viewport-optimize-before.png
- After: viewport-optimize-after.png
```

## Related commands

- Full breakpoint audit/fix loop: `/responsive-audit` — [responsive-audit](../responsive-audit/SKILL.md)
- General responsive QA checklist: [portfoliov2-responsive-qa](../portfoliov2-responsive-qa/SKILL.md)
