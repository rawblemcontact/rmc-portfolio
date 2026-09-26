---
name: portfoliov2-repository-agent
description: >-
  Manual PortfolioTRUEV2 repo-ops reference: section-map retrieval, safe edits,
  builds, debugging, GitHub, design memory. Load only when the user explicitly
  asks for repository-agent help or repo-setup guidance — not for routine UI edits.
disable-model-invocation: true
---

# PortfolioTRUEV2 — repository agent

**Manual / explicit load only.** Do not auto-invoke for ordinary coding tasks; `AGENTS.md` and the slim senior rule already cover defaults.

## First reads

1. Root `AGENTS.md` — stack, scripts, **retrieval rules**, QA budget.
2. `.cursor/section-map.md` — Grep symbols for `Home.tsx` / `index.css` (never full-file read).
3. `.cursor/rules/neo-tokyo-game-ui.mdc` — mandatory visual/motion language.
4. `.cursor/skills/portfoliov2-showcase-overlays/SKILL.md` — when the task touches SHOWCASE / overlays / FEATURED WRITING / `#projects`.

## Goals the agent should meet

- Locate code via **section-map → Grep → Read `offset`/`limit`**; do not map all of `Home.tsx`. Know components also live under `src/components/`.
- **Inspect and edit safely**: read surrounding code only, match imports and Tailwind style, minimize scope, avoid drive-by refactors.
- **Run** `npm run dev` and `npm run build` from the repo root; interpret failures and fix only what the task requires.
- **Debug frontend** with console/network awareness; respect overflow/scroll rules in `portfoliov2-showcase-overlays`.
- **Browser / UI**: `http://localhost:5173`; default **1–2** targeted checks; full multi-viewport only for `/responsive-audit` or `/viewport-optimize`.
- **Remember conventions**: thin `AGENTS.md` + Neo Tokyo; SHOWCASE walls in `portfoliov2-showcase-overlays`; changelog via `portfoliov2-project-memory`.
- **Styling and animation**: Neo Tokyo tokens; reuse Framer Motion patterns; SHOWCASE parity (`DETAIL_CARD_H`, borders, radii).

## Specialized skills (load when relevant)

| Topic | Skill |
|-------|--------|
| SHOWCASE / overlays / FEATURED WRITING / `#projects` | [portfoliov2-showcase-overlays](../portfoliov2-showcase-overlays/SKILL.md) |
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
- After layout/CSS changes touching overlays or SHOWCASE, verify in browser (budget in `AGENTS.md`): no clipped FEATURED WRITING footer, hidden scrollbars on section panels unless requested.
