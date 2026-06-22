# PortfolioTRUEV2 — typography reference for `/viewport-optimize`

Read this when tuning **font sizes** and **hierarchy** inside a section or against the portfolio as a whole.

## Global tokens (`src/index.css` `:root` / `@theme`)

| Token | Role | Typical use |
|-------|------|-------------|
| `--section-main-font-display` | **Display** | Section mains: PROFILE, PROJECTS, EXPERIENCE, SKILLS, CONTACT |
| `--section-subhead-font` | **Subhead** | Muted line under section title; career/showcase subheads |
| `--section-rail-font` | **Rail** | Experience career rail titles, panel headings |
| `--section-rail-eyebrow-font` | **Rail eyebrow** | Experience rail micro labels |
| `--section-eyebrow-font` | **Eyebrow** | Command micro labels (OPEN, VIEW, ENTER), small CTAs |

**Neo Tokyo roles** (`.cursor/rules/neo-tokyo-game-ui.mdc`): display → technical label → body → eyebrow. Left-align; monospace for labels; Satoshi for display/body.

## Section-internal hierarchy (expected order, largest → smallest)

Each section should have **distinct steps** — no two adjacent roles within ~1px.

### `#projects` (desktop fine-pointer overrides)

Scoped tokens on `#projects` in `@media (min-width: 1024px) and (pointer: fine)`:

| Role | CSS var | Elements |
|------|---------|----------|
| display | `--projects-type-display` | `.section-main-header-title` |
| headline | `--projects-type-headline` | `.featured-writing-item-title` |
| card | `--projects-type-card` | `.project-card-title` |
| ui | `--projects-type-ui` | folder tab labels |
| body | `--projects-type-body` | `.project-card-tagline`, `.featured-writing-item-subtitle`, description |
| eyebrow | `--projects-type-eyebrow` | `.featured-writing-view-cta` |

**Order:** display > headline > card > ui ≥ body > eyebrow

**Grey/muted body** should not fall below portfolio `--section-eyebrow-font` at desktop; prefer parity with `--section-subhead-font` × ~0.85–0.95 for card taglines.

### `#skills` (desktop fine-pointer overrides)

Uniform scale via `--skills-fit` (default **0.9**) on the **original** SKILLS layout — type, spacing, and card `--skills-page-scale: calc(1.1 * var(--skills-fit))`. Full `PROFILE_VIEWPORT_CONTENT_MAX` width preserved.

| Role | Source | Elements |
|------|--------|----------|
| display | `--section-main-font-display` × `--skills-fit` | `.section-main-header-title` |
| rail | `--section-rail-font` × `--skills-fit` | `.career-nav-section-subtitle` |
| column / body | base clamp × `--skills-page-scale` | `.skills-subcategory-column-title`, `.skills-page-card-row` |
| rail eyebrow | `--section-rail-eyebrow-font` × `--skills-fit` | `.career-nav-section-title` |

**Order:** display > rail > column ≥ body > rail eyebrow

### `#experience` (desktop fine-pointer overrides)

Scoped tokens on `#experience` in `@media (min-width: 1024px) and (pointer: fine)`:

| Role | CSS var | Elements |
|------|---------|----------|
| display | `--experience-type-display` | `.career-nav-section-subtitle` (rail "Experience") |
| subhead | `--experience-type-subhead` | `.career-nav-section-title` ("Career Overview") |
| panel | `--experience-type-panel` | `.panel-title`, `.card-title` |
| tab | `--experience-type-tab` | `.tab-title` |
| body | `--experience-type-body` | `.panel-description`, `.card-text`, `.feature-list li` |
| eyebrow | `--experience-type-eyebrow` | `.tab-subtitle`, `.experience-skill-tag`, `.stat-label` |

**Order:** rail display > rail subhead; panel > body > tab > eyebrow (panel column separate from rail)

### Other sections (default utilities + `index.css`)

| Section | Display | Body / muted | Notes |
|---------|---------|--------------|-------|
| `#profile` | `.section-main-header-title` | `.font-body.text-mono-2` paragraphs | Match `PROFILE_VIEWPORT_CONTENT_MAX` shell |
| `#experience` | `.nav-header .section-main-header-title` | `.career-nav-section-title`, panel copy | Desktop: `--experience-type-*` on `#experience` (`pointer: fine`) — display → subhead → panel → tab → body → caption |
| `#skills` | `.skills-header .section-main-header-title` | subcategory mono, column titles | SKILLS gutters = PROFILE |
| `#social` | `.section-main-header-title` | contact link labels | |

## Portfolio-wide parity checks

When optimizing one section, compare at **1440×900 desktop**:

1. **Section display titles** — all `.section-main-header-title` (or section-specific equivalent) should be within **±2px** unless a section has an intentional override (e.g. `#projects` `--projects-type-display`).
2. **Muted body** — `text-mono-2` / `color-mix(mono-2)` copy should not read smaller than command-menu micro labels (`--section-eyebrow-font`).
3. **Subhead vs body** — section subheads (`--section-subhead-font`) should stay louder than grey body in the same section.
4. **Internal ratios** — headline ÷ display ≈ **0.62–0.68**; body ÷ display ≈ **0.42–0.50**; eyebrow ÷ display ≈ **0.32–0.38**.

## Fix patterns (minimal diff)

1. **Section-scoped CSS vars** — e.g. `--projects-type-*` on `#projects` inside desktop `pointer: fine` block.
2. **Never** `transform: scale()` on text.
3. **Scale type + spacing together** — use `--*-fit` or proportional `clamp`; if body grows, trim header `margin-bottom` or panel `gap` to preserve fold.
4. **Breakpoint isolation** — desktop type tokens must not leak to tablet/mobile; verify all four tiers after shared edits.

## Measurement scripts

| Script | Purpose |
|--------|---------|
| `scripts/measure-fold.js` | Fold fit, overflow, vertical gap symmetry |
| `scripts/measure-type-hierarchy.js` | In-section roles + portfolio cross-section sample |
