---
name: portfoliov2-project-memory
description: >-
  Persists PortfolioTRUEV2 conventions and architecture decisions: AGENTS.md as
  canonical guide, Neo Tokyo rule cross-reference, and dated changelog rows
  for durable memory. Use when the user wants to record styling, animation, or
  structural decisions for future sessions or contributors.
disable-model-invocation: true
---

# PortfolioTRUEV2 — persistent project memory

## Canonical sources (do not duplicate blindly)

1. **`AGENTS.md`** — stack, scripts, file map, SHOWCASE/overlay implementation rules, editing discipline, **Changelog** table.
2. **`.cursor/rules/neo-tokyo-game-ui.mdc`** — visual/motion law for the command UI aesthetic.

## What to record

- **Architecture**: where new domains live (e.g. extracted component boundaries, data for writing tabs).
- **Design**: agreed deviations from Neo Tokyo defaults (with rationale and scope).
- **Animation**: standard durations/easing shared across sections if the user locks them in.
- **A11y/responsive**: breakpoints or patterns the user wants repeated (focus treatment, safe-area padding).

## How to persist

- Prefer a **new row** in the `AGENTS.md` Changelog table (date + short note). Keep entries **factual and brief**.
- If a decision belongs in the implementation section (not just historical), add a tight bullet there **only** when the user confirms.
- Do **not** overwrite or delete prior changelog history.

## Session hygiene

- When starting a large task, skim `AGENTS.md` + Neo Tokyo rule instead of assuming prior chat context.
- If memory conflicts with code, **trust the repo** and flag the mismatch to the user.

## Safety

- Never “record memory” by rewriting portfolio UI in `src/` unless that is the explicit task; metadata lives in `AGENTS.md` / Cursor config as appropriate.
