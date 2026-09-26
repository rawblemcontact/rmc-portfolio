---
name: portfoliov2-terminal
description: >-
  Runs npm scripts and shell commands for PortfolioTRUEV2 (Vite React SPA) on
  Windows/PowerShell: dev server, build, preview, tunnel. Use when starting
  local dev, verifying production build, or debugging install/script failures.
disable-model-invocation: true
---

# PortfolioTRUEV2 — terminal execution

## Working directory

Run commands from the **repository root** (where `package.json` and `package-lock.json` live).

## Core scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server — `http://localhost:5173`, binds `0.0.0.0` |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run share` | `localtunnel` on port 5173 (optional remote view) |

No environment variables are required for normal dev/build.

## Expectations

- **Node**: lockfile is npm; install with `npm install` if dependencies are missing.
- **Typecheck**: `npx tsc --noEmit` may report known Framer Motion typing noise; Vite build is the practical gate unless the user asks for strict TS cleanup.
- **Benign warning**: circular chunk warning (`react -> vendor -> react`) during build is noted in `AGENTS.md`.

## Windows notes

- Use PowerShell-friendly syntax; paths in instructions should use forward slashes or quoted paths when spaces appear.
- If port 5173 is busy, check the Vite console for the actual port.

## Safety

- Do not run destructive git commands (`reset --hard`, force push) unless the user explicitly requests them.
- Prefer foreground dev server in Cursor terminals; avoid long background jobs unless the user wants them.
