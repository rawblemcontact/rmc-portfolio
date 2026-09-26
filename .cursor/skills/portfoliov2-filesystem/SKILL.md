---
name: portfoliov2-filesystem
description: >-
  Navigates PortfolioTRUEV2 safely: key paths, ripgrep/search habits, reading
  before editing, and avoiding risky bulk renames. Use when locating
  components, PDF/showcase code, rules, or when the user asks where files live
  or how to explore the tree without breaking the SPA.
disable-model-invocation: true
---

# PortfolioTRUEV2 — filesystem access

## Layout (high signal)

| Area | Path |
|------|------|
| Main page / SHOWCASE / overlays | `src/pages/Home.tsx` |
| Shared UI pieces | `src/components/` |
| Global CSS utilities | `src/index.css` |
| App entry | `src/main.tsx`, `src/App.tsx` |
| Agent/repo docs | `AGENTS.md` |
| Cursor UI rules | `.cursor/rules/neo-tokyo-game-ui.mdc` |
| Project agent skills | `.cursor/skills/` |

## Practices

- **Read before edit**: open the target file and imports; for `Home.tsx`, locate the section (projects, writing, motion blocks) before patching.
- **Search**: prefer scoped search for symbols and Tailwind class names; keep patterns specific to avoid noise in `dist/` or `node_modules/` (those are usually gitignored — still avoid scanning them intentionally).
- **Moves/extracts**: prefer new small files under `src/components/` when splitting from `Home.tsx`; wire props and keep design tokens consistent with call sites.
- **Do not** delete or rewrite assets (PDFs, images, public files) unless the user explicitly requests it.

## Safety

- No broad automated formatting of the whole repo for a local change.
- If unsure which of several similar components applies, grep for the user-facing string or the Radix primitive name, then confirm in the file header/exports.
