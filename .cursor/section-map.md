# Section map (agent retrieval)

Use **Grep → Read `offset`/`limit` (~150–400 lines)**. Never full-file read `Home.tsx` or `index.css`. Prefer symbols/selectors over line numbers (they drift).

## `src/pages/Home.tsx`

| Area | Grep / symbol |
|------|----------------|
| Nav + accents | `NAV_ITEMS`, `SECTION_ACCENT_COLOR` |
| SHOWCASE timing / heights | `SHOWCASE_TIME_DIV`, `DETAIL_CARD_H`, `SHOWCASE_COLUMN_MAX` |
| PROFILE shell / gutters | `PROFILE_SECTION_CONTAINER`, `PROFILE_LAYOUT_ROW`, `PROFILE_LEFT_COLUMN`, `PROFILE_VIEWPORT_CONTENT_MAX` |
| Supporting projects | `SupportingProjectsSection` |
| FEATURED WRITING | `ShowcaseWritingFeaturedPanel`, `SHOWCASE_WRITING_TAB_FEATURED` |
| Projects carousel / FLIP | `PalaceProjects` |
| Experience | `ConfidantExperience` |
| Contact | `SocialLink` |
| SKILLS flags / arsenal | `SKILLS_SHOW_INTRO_PAIR_CARDS`, `SkillArsenal` |
| Page shell / overlays | `export default function Home` |
| Tab strip / PDF thumbs | `src/components/ShowcaseAttachedTabStrip.tsx`, `FeaturedWritingPdfThumbnail.tsx` |
| Motion presets | `src/lib/motion.ts` (`EASE`, `DUR`, `SPRING`, `PORTFOLIO_SPEED`) |
| Accents CSS vars | `src/styles/portfolio-palette.css` |

## `src/index.css`

| Area | Grep / selector |
|------|-----------------|
| Theme tokens | `@theme` |
| Base / utilities layers | `@layer base`, `@layer utilities` |
| Grid overlay | `.portfolio-grid-overlay` |
| SKILLS page / cards | `#skills`, `.skills-card-surface` |
| PROJECTS / cards | `#projects`, `.project-card-surface` |
| PROFILE | `#profile` |
| EXPERIENCE nav | `#experience`, `.nav-header` |
| CONTACT header | `#social` |
| Hidden scrollbars | `.no-scrollbar` |
| Section title chrome | `.section-main-header-title` |
