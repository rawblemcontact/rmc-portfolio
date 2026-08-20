# AGENTS.md

Instructions for AI assistants and automation working on this repository.

## Overview

Client-only React portfolio SPA (no backend). Most UI lives in `src/pages/Home.tsx` (large). Stack: Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion. Package manager: **npm**.

```
npm run dev    # http://localhost:5173
npm run build  # output: dist/
```

Design language: **`.cursor/rules/neo-tokyo-game-ui.mdc`** (`alwaysApply`).

## Branch Safety

All work in this repository must stay on `continue-publish-main`.

- Never switch to `main`.
- Never modify `main`.
- Never commit to `main`.
- Never push to `main`.
- All development work, commits, and pushes for this project must use `continue-publish-main`.

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

## Learned User Preferences

- Hero intro must open without a visible static first frame or hitch; prefer buffering the real mounted reel while closed, then `play()` + `scaleX` open in the same tick.

## Learned Workspace Facts

- Replacing `src/assets/hero1.mp4`: re-encode H.264 `yuv420p`, 1920×1080@30fps, `+faststart`, no audio, ~3–6 Mbps / a few MB for ~4s (validated ~3.2MB). Keep the real hero `<video>` mounted while visually closed, preload that same element, gate entrance on `HAVE_ENOUGH_DATA` or fully buffered (error/timeout fail-open), then `play()` and `scaleX` open together. Validated: desktop/mobile opened at `readyState` 4 with advancing `currentTime`.
