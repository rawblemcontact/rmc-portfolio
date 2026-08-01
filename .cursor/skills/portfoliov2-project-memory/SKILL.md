---
name: portfoliov2-project-memory
description: >-
  Persists PortfolioTRUEV2 conventions and dated changelog rows. Use when the
  user wants to record styling, animation, or structural decisions for future
  sessions. Not for routine UI edits.
disable-model-invocation: true
---

# PortfolioTRUEV2 — persistent project memory

## Canonical sources (do not duplicate blindly)

1. **`AGENTS.md`** — thin always-on: stack, scripts, retrieval, QA budget.
2. **`.cursor/skills/portfoliov2-showcase-overlays/SKILL.md`** — SHOWCASE / overlays / `#projects` implementation rules.
3. **`.cursor/rules/neo-tokyo-game-ui.mdc`** — visual/motion law for the command UI aesthetic.

## What to record

- **Architecture**: where new domains live (e.g. extracted component boundaries, data for writing tabs).
- **Design**: agreed deviations from Neo Tokyo defaults (with rationale and scope).
- **Animation**: standard durations/easing shared across sections if the user locks them in.
- **A11y/responsive**: breakpoints or patterns the user wants repeated (focus treatment, safe-area padding).

## How to persist

- Prefer a **new row** in the **Changelog** table below (date + short note). Keep entries **factual and brief**.
- If a decision belongs in SHOWCASE/overlay implementation rules, add a tight bullet to `portfoliov2-showcase-overlays` **only** when the user confirms.
- Do **not** overwrite or delete prior changelog history.

## Changelog (human-maintained)

| Date | Note |
|------|------|
| 2026-07 | **Docs token cut** — SHOWCASE/overlay walls moved from `AGENTS.md` to `portfoliov2-showcase-overlays`; changelog lives here; `AGENTS.md` slimmed to stack + retrieval. |
| 2026-07 | **Agent token control** — `.cursor/section-map.md`; mandatory Grep/`offset`/`limit` retrieval for `Home.tsx`/`index.css`; senior always-on rule slimmed to pointer. |
| 2026-07 | **PORTFOLIO SPEED** — named hover/press reaction preset in `src/lib/motion.ts` (`PORTFOLIO_SPEED`). Snappy like MAIN MENU / EXPERIENCE, slightly softer than `TAP` / `SPRING.tap`. Apply only when the user asks; currently used by PROJECTS main 4 cards. |
| 2026-05 | Added always-on project rule `.cursor/rules/portfoliov2-senior-frontend-agent.mdc` (short pointer; deep layout in skills). |
| 2026-05 | Added PROFILE viewport gutters note + `portfoliov2-profile-viewport-gutters` skill; SKILLS uses `PROFILE_VIEWPORT_CONTENT_MAX`. |
| 2026-04 | Added SHOWCASE/overlay implementation rules; corrected paths from legacy `client/src` to `src`. |

## Session hygiene

- When starting a large task, skim thin `AGENTS.md` + Neo Tokyo; load `portfoliov2-showcase-overlays` if the task touches SHOWCASE/overlays.
- If memory conflicts with code, **trust the repo** and flag the mismatch to the user.

## Safety

- Never “record memory” by rewriting portfolio UI in `src/` unless that is the explicit task; metadata lives in Cursor skills / `AGENTS.md` as appropriate.
