---
name: typography-audit
description: >-
  Manual /typography-audit command for PortfolioTRUEV2. Runs ONLY when the user
  explicitly types /typography-audit — never auto-invoke. Audits typography
  hierarchy across desktop, tablet, and mobile in a single pass; applies only
  subtle refinements for readability, consistency, or hierarchy; stops after one
  pass with a concise summary (no re-audit loop).
disable-model-invocation: true
---

# /typography-audit

**Manual command only.** Do not run this workflow unless the user's message explicitly contains **`/typography-audit`**. Do not auto-invoke from CSS edits, PR reviews, or ambient context.

## Invocation gate

If the user did **not** type `/typography-audit`, stop — do not follow this skill.

## Mission (user intent — follow verbatim)

Audit the typography hierarchy across the entire project.

Check desktop, tablet, and mobile layouts for:
- Heading hierarchy (H1–H6)
- Body text readability
- Button, label, caption, and navigation text
- Font sizes, weights, line heights, and spacing
- Consistent visual hierarchy across all pages
- Text wrapping, clipping, and overflow
- Responsive scaling so typography remains balanced at every breakpoint

The current typography is already close to the desired result. Make only subtle, intentional refinements where there is a clear improvement. Avoid large visual changes or redesigning the type scale. Preserve the existing design language, layout, colors, branding, and overall feel.

Only adjust typography when there is a noticeable benefit to readability, accessibility, consistency, or hierarchy.

Perform **one audit pass only**. Do not automatically run a second review, re-audit, or iterative refinement after making changes. Make your best improvements in a single pass, then stop and provide a concise summary of what was changed.

## Single-pass rule (hard stop)

1. **One audit → one fix batch → one summary.** No follow-up passes, no “let me double-check,” no second sweep.
2. After delivering the summary, **stop**. Do not re-open sections unless the user asks.
3. If issues remain, list them as **deferred** in the summary — do not fix them in this run.

## Scope arguments (optional)

Parse tokens after `/typography-audit`:

| Argument | Meaning |
|----------|---------|
| *(none)* | Full portfolio — hero, command menu, all five section overlays |
| `hero` | Hero / command menu only |
| `profile` | `#profile` |
| `projects` | `#projects` (SHOWCASE + FEATURED WRITING) |
| `experience` | `#experience` |
| `skills` | `#skills` |
| `contact` / `social` | `#social` |
| `all` | Same as default — every surface |

**Examples**

```
/typography-audit
/typography-audit experience
/typography-audit projects skills
```

## Repo context (read first)

1. `AGENTS.md` — editing discipline; most UI in `src/pages/Home.tsx`.
2. `.cursor/rules/neo-tokyo-game-ui.mdc` — display, technical labels, body, eyebrow roles; left-align; Satoshi + monospace.
3. `.cursor/rules/Breakpoint-Isolation.mdc` — type fixes for one tier must not alter others; verify non-target breakpoints after shared-rule edits.
4. [portfolio-type-reference.md](../viewport-optimize/portfolio-type-reference.md) — global tokens, per-section roles, ratio targets, fix patterns.
5. `src/index.css` — `--section-main-font-display`, `--section-subhead-font`, section `--*-type-*` overrides.
6. [portfoliov2-browser](../portfoliov2-browser/SKILL.md) — dev server, manual checks.

## Viewport matrix (audit at each tier)

| Tier | Size(s) | Notes |
|------|---------|-------|
| Desktop | 1440×900, spot 1920×1080 & 1280×720 | `pointer: fine` tokens; primary hierarchy reference |
| Tablet landscape | 1024×768 | iPad rules; `(any-pointer: coarse)` blocks in `index.css` |
| Tablet portrait | 768×1024 | Stacked layouts, rail/tab type |
| Mobile | 390×844, spot 375×667 | Safe-area, command menu, single column |

Open each section overlay at **each tier** (or only scoped sections if arguments given). Smoke hero + command menu on every tier.

## Audit checklist

| Area | What to check |
|------|----------------|
| Heading hierarchy | Semantic order; section mains vs subheads vs card titles; no inverted steps (body louder than headline) |
| Body readability | Line length, `line-height`, grey/muted contrast (`text-mono-2`, `color-mix`) |
| UI chrome | Command menu labels, micro actions (OPEN/VIEW/ENTER), nav headers, tabs, CTAs |
| Buttons & labels | Tap targets on mobile; eyebrow vs button label distinction |
| Captions & meta | Dates, tags, stat labels, folder tab text, PDF chrome |
| Cross-section parity | `.section-main-header-title` within ~±2px across sections unless intentional override |
| Wrapping & overflow | `line-clamp`, `truncate`, `min-w-0`, clipped skill tags or project titles |
| Responsive scaling | `clamp()` steps; no `transform: scale()` on text; tier-specific vars not leaking |

**Portfolio ratio targets** (desktop reference — see type reference): headline ÷ display ≈ 0.62–0.68; body ÷ display ≈ 0.42–0.50; eyebrow ÷ display ≈ 0.32–0.38.

## Fix discipline

1. **Subtle only** — tweak existing tokens (`clamp` bounds, `line-height`, letter-spacing, one step in a scale). No new type families or global rescale.
2. **All viewport tiers** — every fix must be verified and applied at **desktop, tablet landscape, tablet portrait, and mobile**. Prefer base/unscoped rules when the improvement is universal; add tier-specific `@media` overrides only when a breakpoint needs a different clamp or scale. Do not ship desktop-only or mobile-only fixes unless a tier has a documented layout constraint (e.g. ultra-compact fold fit).
3. **Smallest diff** — prefer section-scoped CSS vars on `#projects`, `#experience`, `#skills`, etc. inside the correct `@media` block.
4. **Typography-only** — do not change layout, colors, motion, or copy unless a type fix strictly requires `min-w-0` / wrap behavior.
5. **No redesign** — if unsure whether a change is “subtle,” skip it and note as deferred.
6. **Eyebrow floor** — micro labels, captions, and mono eyebrows should not fall below `--section-eyebrow-font` minimum (`0.6875rem`) at any tier unless fold-fit scaling explicitly requires it (document in summary).
7. **Shared rules** — if you must edit unscoped `index.css`, confirm all four tiers still match intent.

### Optional measurement

If Playwright MCP is available, run [measure-type-hierarchy.js](../viewport-optimize/scripts/measure-type-hierarchy.js) at desktop (`sectionId` per section, `sweepPortfolio: true`) to catch adjacent roles within ~1px. **Not required** — code + browser inspection is sufficient for this pass.

## Surfaces to visit (default scope)

- Hero / command menu (`SYSTEM // PORTFOLIO`, nav rows, micro labels)
- PROFILE — display, body paragraphs, stat/mono labels
- PROJECTS — showcase cards, FEATURED WRITING folder tabs/titles/CTAs
- EXPERIENCE — rail headers, tab stack, resume card (`.tabs-content`)
- SKILLS — section header, column titles, card rows, rail eyebrows
- CONTACT — section title, link labels

## Final summary (required — concise)

When the single pass completes, deliver **only** this structure (keep brief):

```markdown
# Typography Audit Summary

## Scope
[Sections + viewports audited]

## Changes made
- `path` — [one line: what type role changed and why]

## Deferred (not fixed this pass)
- [Issue + section + viewport — optional]

## Regression note
[One line if shared CSS was touched; which tiers were spot-checked]
```

Do **not** produce a long report, do **not** start a second audit, do **not** ask to continue unless the user requests another run.

## Related commands

- Fold + type optimize (multi-pass allowed): `/viewport-optimize` — [viewport-optimize](../viewport-optimize/SKILL.md)
- Layout/responsive audit: `/responsive-audit` — [responsive-audit](../responsive-audit/SKILL.md)
