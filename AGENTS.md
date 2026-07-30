# AGENTS.md

Instructions for AI assistants and automation working on this repository.

## Cursor Cloud — environment

### Overview

This is a **client-only React portfolio SPA** (no backend, no database, no API). Most UI and content live in `src/pages/Home.tsx` (large file: sections, SHOWCASE carousel, FEATURED WRITING, overlays, and navigation wiring).

### Stack

- Vite 7 + React 19 + TypeScript 5.6 + Tailwind CSS v4
- Framer Motion for animations, shadcn/ui (Radix) components
- Package manager: **npm** (lockfile: `package-lock.json`)

### Running the dev server

```
npm run dev
```

Starts Vite on `http://localhost:5173` (binds `0.0.0.0`). No environment variables needed.

### Building

```
npm run build
```

Output goes to `dist/`. There is a circular chunk warning (`react -> vendor -> react`) which is benign.

### Known issues

- `npx tsc --noEmit` may report pre-existing type issues (e.g. Framer Motion `ease` typing in some components). This does **not** block the build or dev server since Vite uses esbuild/SWC, not `tsc`.
- `@icons-pack/react-simple-icons` declares `engines.node >=24` but often works on Node 22.
- Replit-specific Vite plugins load only when `REPL_ID` env var is set; safely skipped outside Replit.

### Linting / Testing

No ESLint config or test framework is present in this repo. There are no automated tests to run.

---

## Design language (mandatory)

The Cursor rule **`.cursor/rules/neo-tokyo-game-ui.mdc`** (`alwaysApply: true`) defines the Neo Tokyo / command UI look: typography, grid overlays, accents, motion habits. Follow it for new UI; do not drift toward generic “startup” styling unless the user asks.

---

## Rules and guidelines — implementation

Use this section when changing SHOWCASE, section panels, or layout-heavy areas.

### Where things live

| Area | Location |
|------|----------|
| SHOWCASE carousel, FEATURED WRITING, project detail / FLIP, section slide-in panels | `src/pages/Home.tsx` |
| Folder tab strip + FEATURED WRITING chrome | `src/components/ShowcaseAttachedTabStrip.tsx` |
| PDF first-page thumbnails (FEATURED WRITING) | `src/components/FeaturedWritingPdfThumbnail.tsx` |
| Global scrollbar utilities | `src/index.css` (`.no-scrollbar`, etc.) |

Prefer **small, focused components** in `src/components/` when extracting from `Home.tsx`; keep behavior and tokens consistent with existing patterns.

### Visual parity (SHOWCASE)

- **Cards** (carousel tiles, project detail hero, FEATURED WRITING folder): share the same **rounded grey border** vocabulary — e.g. `border-white/[0.09]`, `rounded-[11px] sm:rounded-xl`, and the same **shadow** language as other showcase surfaces unless the user requests a change.
- **Heights**: carousel cards and the flying-card / detail anchor use the shared **`DETAIL_CARD_H`** height string in `Home.tsx` (includes `min(..., …svh)` caps). Keep new showcase surfaces aligned with that token unless there is a deliberate exception.

### Section overlay (full-screen panels: projects, profile, etc.)

- The sliding **`motion.div`** (fixed `inset-0`) is the scroll container for tall content. It uses **`overflow-y-auto`** on most sections, and **`no-scrollbar`** plus WebKit / `scrollbarWidth` / `msOverflowStyle` suppression so **scrolling works but scrollbars stay hidden**.
- **Do not** stack `overflow-hidden` and `h-full` on the projects subtree in a way that **clips** the FEATURED WRITING block. For `currentSection === "projects"`, the inner wrapper should allow vertical overflow to reach the panel scroller (`overflow-y-visible` on the appropriate wrapper); the panel scrolls, not an inner scrollbar (unless explicitly desired).

### `#projects` / SHOWCASE column

- Avoid forcing **`h-full`** on inner containers in ways that cap height and clip content below the carousel. Prefer **`min-h-full`** on the section where “at least full viewport” is needed, and let content grow so the **overlay** can scroll with hidden scrollbars.
- Use **`overflow-x-hidden`** where horizontal clipping is required; avoid unnecessary **`overflow-y-hidden`** on ancestors of the folder card.
- Bottom spacing: section padding can use **`max(..., env(safe-area-inset-bottom))`** so content clears notches and home indicators.

### SHOWCASE carousel — dot pager alignment

- Use **one horizontal padding wrapper** around both the **dot row** and the **Embla viewport** (`px-2 sm:px-4 lg:px-2 xl:px-3` — match FEATURED WRITING insets). Do not duplicate different horizontal padding on dots vs. carousel.
- Dots are **`justify-end`**. If the cluster still sits slightly past the **card border**, nudge the dot group **left** with a small **`-translate-x-*`** on the dot flex (responsive values as needed). Align optically to the **bordered** cards, not an arbitrary screen edge.

### FEATURED WRITING

- Tabs map to PDFs and copy via the data structures next to **`ShowcaseWritingFeaturedPanel`** in `Home.tsx`.
- Thumbnails: **`FeaturedWritingPdfThumbnail`** loads page 1 with **pdfjs**; URLs are **cached** in-module to avoid re-render flashes.
- Folder body: avoid **`overflow-hidden`** clipping the footer row; use **`overflow-x-hidden`** and allow vertical visibility where needed. Keep **View PDF** placement consistent with the current design (user may refine position).

### PDFs elsewhere

- **`PdfJsDocumentView`** and related flows use **`no-scrollbar`** on internal scroll areas where appropriate.

### PROFILE viewport gutters (side margins)

Desktop left/right gaps on `#profile` come from the **centered two-column row** (text + gap + mascot), not container padding alone. Other sections that must match PROFILE (e.g. SKILLS) use shared `PROFILE_*` constants and `PROFILE_VIEWPORT_CONTENT_MAX` in `Home.tsx`. See `.cursor/skills/portfoliov2-profile-viewport-gutters/SKILL.md`.

### General editing discipline

- Match existing **imports, naming, and Tailwind** style in `Home.tsx`.
- **Minimize scope**: change only what the task requires; avoid drive-by refactors across unrelated sections of `Home.tsx`.
- After layout or CSS changes that affect overflow, **verify** in the browser: no clipped FEATURED WRITING footer, no visible scrollbar on the section panel (unless explicitly requested).

---

## Changelog (human-maintained)

| Date | Note |
|------|------|
| 2026-07 | **PORTFOLIO SPEED** — named hover/press reaction preset in `src/lib/motion.ts` (`PORTFOLIO_SPEED`). Snappy like MAIN MENU / EXPERIENCE, slightly softer than `TAP` / `SPRING.tap`. Apply only when the user asks; currently used by PROJECTS main 4 cards. |
| 2026-05 | Added always-on project rule `.cursor/rules/portfoliov2-senior-frontend-agent.mdc` (agent stack, architecture, SHOWCASE/SKILLS workflow). |
| 2026-05 | Added PROFILE viewport gutters note + `portfoliov2-profile-viewport-gutters` skill; SKILLS uses `PROFILE_VIEWPORT_CONTENT_MAX`. |
| 2026-04 | Added “Rules and guidelines — implementation”; corrected paths from legacy `client/src` to `src`. |
