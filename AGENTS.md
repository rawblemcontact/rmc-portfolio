# AGENTS.md

Instructions for AI assistants and automation working on this repository.

## Overview

Client-only React portfolio SPA (no backend). Most UI lives in `src/pages/Home.tsx` (large). Stack: Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion. Package manager: **npm**.

```
npm run dev    # http://localhost:5173
npm run build  # output: dist/
```

Design language: **`.cursor/rules/neo-tokyo-game-ui.mdc`** (`alwaysApply`).

## Agent retrieval (mandatory — token control)

`Home.tsx` and `index.css` are very large. **Never** open either file in full.

1. Open **`.cursor/section-map.md`** for Grep symbols/selectors.
2. **Grep** the target symbol (use `-C` / `head_limit` when a definition or short window is enough).
3. **Read** with `offset`/`limit` ≈ **150–400 lines**; widen only if the match is incomplete.
4. After a successful patch, **do not** re-read the same region unless verifying a failure.
5. Prefer Grep over Read when you only need a name, constant, or class string.

### Browser QA budget

Default: **1–2** targeted screenshots or focused checks on the affected section. Multi-viewport screenshot storms only when the user runs **`/responsive-audit`** or **`/viewport-optimize`**.

## Deep layout rules (load on demand)

SHOWCASE carousel, FEATURED WRITING, section overlays, `#projects` overflow/scroll, and related parity tokens live in:

**`.cursor/skills/portfoliov2-showcase-overlays/SKILL.md`**

Load that skill when the task touches those areas. Do not duplicate those walls here.

PROFILE side-gutter parity: **`.cursor/skills/portfoliov2-profile-viewport-gutters/SKILL.md`**.

Durable changelog / memory: **`.cursor/skills/portfoliov2-project-memory/SKILL.md`**.
