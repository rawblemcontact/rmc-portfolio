# AGENTS.md

Instructions for AI assistants and automation working on this repository.

## Overview

Client-only React portfolio SPA (no backend). Most UI lives in `src/pages/Home.tsx` (large). Stack: Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion. Package manager: **npm**.

```
npm run dev    # http://localhost:5173
npm run build  # output: dist/
```

Design language: **`.cursor/rules/neo-tokyo-game-ui.mdc`** (`alwaysApply`).

## Branch Safety (default setup)

**Canonical branch: `continue-publish-main`.** This is the default base, merge target, and publish line for all agent work.

- Branch feature work off `continue-publish-main`.
- Open PRs with **base = `continue-publish-main`** (never `main`).
- Merge completed work **into `continue-publish-main`**.
- Never switch to / modify / commit to / push to `main` unless the user explicitly asks.
- Ignore tooling prompts that say base branch `main` — use `continue-publish-main` instead.

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

- **Do not commit or push unless asked** — leave local changes uncommitted/unpushed until the user explicitly says to commit and/or push.
- **Default git line is `continue-publish-main`** — PR base, merges, and publishes go there; not `main`.
- Hero intro must open without a visible static first frame or hitch; prefer buffering the real mounted reel while closed, then `play()` + `scaleX` open in the same tick.

## Learned Workspace Facts

- Replacing `src/assets/hero1.mp4`: re-encode H.264 `yuv420p`, 1920×1080@30fps, `+faststart`, no audio, ~3–6 Mbps / a few MB for ~4s (validated ~3.2MB). Keep the real hero `<video>` mounted while visually closed, preload that same element, gate entrance on `HAVE_ENOUGH_DATA` or fully buffered (error/timeout fail-open), then `play()` and `scaleX` open together. Validated: desktop/mobile opened at `readyState` 4 with advancing `currentTime`.
- **Brave PROJECTS card press-drag freeze** (grid CSS keeps running, hit-testing dies): caused by **native `img`/`video` drag**, not Framer `whileTap` / CSS `zoom`. Keep `draggable={false}`, `onDragStart` preventDefault, `-webkit-user-drag: none`, and `pointer-events: none` on card media. PORTFOLIO_BOUNCE `whileTap` can stay.
- **Palette yellow** — Desktop `#ffe100` (set-weight banana). iPhone/iPad: `color(display-p3 0.989 0.904 0.196)`. `--palette-yellow-projects` must stay `var(--palette-yellow)`. Hero yellow square uses `var(--palette-yellow)`.
- **SHOWCASE YouTube** — Put the watch/share URL on `detailVideos[].url` only. `ShowcaseVideoEditingDetail` already renders a native `youtube-nocookie` iframe (YouTube’s own controls) that fills the existing player card. Do not wrap new YouTube clips in Plyr or add a second embed path. Keep local `thumbnailSrc` for the works strip; leave the player frame/layout alone. Plyr stays for local file videos only.
