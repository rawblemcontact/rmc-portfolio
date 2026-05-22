---
name: portfoliov2-github
description: >-
  Git and GitHub workflows for PortfolioTRUEV2: branches, commits, pull
  requests, and optional GitHub CLI. Use when preparing changes for review,
  drafting PR descriptions, or syncing with remote without unsafe force
  operations.
disable-model-invocation: true
---

# PortfolioTRUEV2 — GitHub integration

## Local Git (safe defaults)

- Inspect state: `git status`, `git diff`, `git log -n 20 --oneline`.
- Branch for work: short, descriptive names (`fix/showcase-dots-align`, `feat/writing-tab-a11y`).
- Commit when the user asks: message should state **what** and **why** in complete sentences; scope to the task.

## Pull requests

- Keep PRs **focused**; avoid mixing unrelated refactors with `Home.tsx` layout fixes.
- Description should mention **risk areas** (SHOWCASE, FEATURED WRITING, PDF viewer, Framer Motion).
- Link to any user-reported issue or design note if applicable.

## GitHub CLI (`gh`)

If installed and authenticated:

- `gh pr create` / `gh pr view` / `gh pr checks` for PR flow.
- Do not close or merge unless the user asks.

## Forbidden without explicit user request

- `git push --force` to shared branches
- History rewriting on `main` / default branch
- Deleting remotes or mass `git clean -fdx`

## Portfolio-specific review hints

- Call out **overflow/scroll** changes — high risk for FEATURED WRITING clipping.
- Call out **new dependencies** — client-only SPA should stay lean unless justified.
