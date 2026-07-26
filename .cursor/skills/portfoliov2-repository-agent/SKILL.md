---
name: portfoliov2-repository-agent
description: >-
  Works in the PortfolioTRUEV2 Neo Tokyo React/Vite portfolio repo: structure,
  safe editing, builds, frontend debugging, browser verification, GitHub flow,
  and design memory. Use when the user works in this repository, mentions
  Home.tsx SHOWCASE, FEATURED WRITING, Neo Tokyo UI, Vite, or asks for
  repo-aware assistance without changing unrelated product code.
disable-model-invocation: false
---

# PortfolioTRUEV2 — repository agent

## First reads

1. Root `AGENTS.md` — stack, scripts, where UI lives, SHOWCASE/overlay rules, editing discipline.
2. `.cursor/rules/neo-tokyo-game-ui.mdc` — mandatory visual/motion language (grid, typography, accents, hover motion).

## Goals the agent should meet

- Map the **project structure** before large edits; know `Home.tsx` is the main surface and components live under `src/components/`.
- **Inspect and edit safely**: read surrounding code, match imports and Tailwind style, minimize scope, avoid drive-by refactors (especially in `Home.tsx`).
- **Run** `npm run dev` and `npm run build` from the repo root; interpret failures and fix only what the task requires.
- **Debug frontend** issues with console/network awareness, reproduce steps, and respect overflow/scroll rules in `AGENTS.md`.
- **Browser / UI**: run or assume dev server at `http://localhost:5173`, verify responsive breakpoints, keyboard focus, and motion reduced where appropriate.
- **Remember conventions**: treat `AGENTS.md` + Neo Tokyo rule as source of truth; record new architecture or design decisions in `AGENTS.md` Changelog (dated rows) when the user wants persistence.
- **Styling and animation**: align with Neo Tokyo tokens; reuse Framer Motion patterns already in the file; keep SHOWCASE visual parity (borders, radii, `DETAIL_CARD_H`).

## Specialized skills (load when relevant)

| Topic | Skill |
|-------|--------|
| Paths, search, safe file ops | [portfoliov2-filesystem](../portfoliov2-filesystem/SKILL.md) |
| npm / shell / dev & build | [portfoliov2-terminal](../portfoliov2-terminal/SKILL.md) |
| Live UI checks, responsive, a11y | [portfoliov2-browser](../portfoliov2-browser/SKILL.md) |
| Responsive layout QA (breakpoints, overflow, type, flex/grid) | [portfoliov2-responsive-qa](../portfoliov2-responsive-qa/SKILL.md) |
| Multi-viewport screenshot pass + breakage report | [responsive-testing](../responsive-testing/SKILL.md) |
| Manual full responsive audit + fix loop (`/responsive-audit` only; supports viewport args) | [responsive-audit](../responsive-audit/SKILL.md) |
| Manual above-the-fold viewport optimize (`/viewport-optimize` only; Playwright fold + type hierarchy + 4-tier regression) | [viewport-optimize](../viewport-optimize/SKILL.md) |
| Match PROFILE left/right viewport gutters (SKILLS, overlays) | [portfoliov2-profile-viewport-gutters](../portfoliov2-profile-viewport-gutters/SKILL.md) |
| Branches, PRs, `gh` | [portfoliov2-github](../portfoliov2-github/SKILL.md) |
| Changelog + durable notes | [portfoliov2-project-memory](../portfoliov2-project-memory/SKILL.md) |

## Safety defaults

- Change only files the user’s task requires; do not restyle or rewrite the portfolio “while setting up skills.”
- After layout/CSS changes touching overlays or SHOWCASE, verify in browser: no clipped FEATURED WRITING footer, hidden scrollbars on section panels unless requested.
