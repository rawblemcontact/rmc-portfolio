# PortfolioTRUEV2 — Quick Project Review

A quick reference of the codebase for shared context. See also `.cursor/rules/neo-tokyo-game-ui.mdc` for UI rules.

---

## What it is

Single-page portfolio for **Robbie McLaughlin** (Writer / Digital Media / Narrative Systems). The app is a **command-style, Neo Tokyo / Persona-inspired** experience: left-aligned typography, technical labels, index numbers, colored underlines on hover, and a grid-overlay aesthetic. Design is governed by the workspace rule `neo-tokyo-game-ui`.

---

## Tech stack

| Layer             | Choice                                                                            |
| ----------------- | --------------------------------------------------------------------------------- |
| **Build**         | Vite 7, React 19, TypeScript                                                      |
| **Styling**       | Tailwind v4, Satoshi (Fontshare), styled-components (used in Home/Skills)         |
| **Animation**     | Framer Motion (variants, AnimatePresence, useInView, useReducedMotion)            |
| **State / Data**  | React state only; TanStack Query + queryClient present but not used for data yet  |
| **Routing**       | None — single scroll/slide flow; wouter is in package.json but unused             |
| **UI primitives** | Radix-based shadcn-style components under `client/src/components/ui/` (50+ files) |

**Vite config**: Root is `vite.config.ts`; app root is `client/`; path aliases `@/` → `client/src`, `@assets/` → `attached_assets`. Custom plugin `metaImagesPlugin` for meta images; Replit plugins only when `REPL_ID` is set.

---

## App structure

- **Entry**: `client/index.html` → `client/src/main.tsx` → `client/src/App.tsx`.
- **App.tsx**: Wraps app in `QueryClientProvider`, `TooltipProvider`, `Toaster`; renders `<Home />` only (no router).
- **Single page**: All content lives in `client/src/pages/Home.tsx` (~1,530 lines): hero, menu, sections, resume view, and all section content in one file.

---

## User flow (high level)

- **Hero**: “SYSTEM // PORTFOLIO”, name “ROBBIE MCLAUGHLIN”, tagline, START button (morph animation), 48px grid overlay, Satoshi + monospace labels.
- **Menu**: Full-screen “MENU” with 5 items (Profile, Projects, Work Experience, Involvement, Skills). Index numbers (01–05), icons, colored underlines on hover (red/yellow/blue/pink/green), 6px horizontal shift. Click navigates to a **section panel**.
- **Section panel**: Overlay that slides in from the right with accent edge (color per section). Contains: Profile (PhantomProfile), Projects (stack + detail slides), Experience, Involvement, Skills (SkillArsenal with Core/Tools cards). “Back to menu” returns to menu.
- **Resume mode**: Toggle (FileText icon) switches to a print-style **ResumeView** (white bg, black text) with profile, skills, experience, projects, involvement, education. Toggle again (Zap) returns to the main experience.
- **Mobile**: Hamburger opens **SideNavOverlay** (drawer from right) with same nav items and contact links.

---

## Theming and motion

- **CSS**: `client/src/index.css` — Tailwind theme with Persona-style palette (cyan primary, dark bg), `--font-display/heading/body` = Satoshi, `--radius: 0` (sharp). Utilities: `.no-scrollbar`, `.p5-shadow`, `.animate-swhing`, `.animate-grid-drift`, skills-specific classes (connector line, node pulse).
- **Motion**: `client/src/lib/motion.ts` — `EASE.out`, `DUR` (micro → slow), `SPRING.ui` / `SPRING.panel`, `TAP`/`HOVER`. Home.tsx uses shared `PANEL_TRANSITION`, `GRID_CELL_SIZE` (48px), `GridPhaseContext` for synced grid drift, and `TextShutter` for directional text reveal.

---

## Notable implementation details

- **Single file**: Home.tsx contains Hero, RainbowMenuSlide, SideNavOverlay, PhantomProfile, project stack/detail, experience, social, full Skills system (ChipIcon, BranchDiagram, SkillsWebHooks, SkillsExpandedView, UiverseCard-style SkillArsenal), ResumeView, and all navigation/transition state. Good candidate for future splitting if we add features.
- **Sections**: Rendered by `currentSection` (profile, projects, project-1/2/3, experience, social, skills). Transition state (`isTransitioning`, `transitionTarget`, `menuPanelAtRight`) drives panel slide and accent edge animation; reduced-motion is respected.
- **Slides**: Two main slides (hero, menu) in a horizontal scroll container; `IntersectionObserver` sets `currentSlideId` for hero vs menu. Keyboard: Arrow Left/Right scroll slides; Home/End go to hero/menu.
- **Placeholders**: Several sections show “coming soon” or placeholder copy (e.g. experience, involvement, project details). Contact in side nav uses `robbie@example.com` and generic Instagram link.
- **Skills**: Two Uiverse-style cards (“Core Competencies”, “Tools and Technologies”) with SVG icons; no expand/panel logic wired in this version (SkillsWebHooks / SkillsExpandedView / BranchDiagram exist in file but SkillArsenal currently only shows the two cards).

---

## File layout (relevant)

- **client/src**: `App.tsx`, `main.tsx`, `index.css`; `pages/Home.tsx`; `components/` (FillIcon, TiltCard, WordsPullUp, FloatingPhone, icons/, ui/); `lib/` (motion.ts, queryClient.ts, utils.ts); `hooks/` (use-mobile, use-toast).
- **Root**: `package.json`, `vite.config.ts`, `vite-plugin-meta-images` (or similar), `.cursor/rules/neo-tokyo-game-ui.mdc`.

---

## Summary

PortfolioTRUEV2 is a **Vite + React 19 + Tailwind v4** single-page portfolio with a **Neo Tokyo / command-UI** look, Framer Motion animations, and all main content in **Home.tsx**. Navigation is hero → menu → section panels (and optional resume view); no URL routing. This review gives shared context for follow-up tasks (e.g. new sections, refactors, or content updates).
