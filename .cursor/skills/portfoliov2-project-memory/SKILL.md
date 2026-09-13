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
| 2026-09-13 | **Palette yellow undo** — Desktop back to `#ffe100` (undid `#ffe400` and `#ffe800`). iOS P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow set match 3** — Desktop `#ffe400` (one lift from `#ffe100`). iOS P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow set match 2** — Desktop `#ffe100` (one lift from `#ffdc00`, still set-weight). iOS P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow set match** — Desktop `#ffdc00` so it sits with red/green/blue/violet without going acid or mustard. iOS P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow banana** — Desktop `#ffea00` (backed off acid `#fff000`). iOS P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow pop** — Desktop `#fff000` to match iPhone/iPad P3 punch. iOS P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow same look** — Desktop `#ffee00` (sRGB stand-in for iPhone banana). iPhone/iPad keep P3 `color(display-p3 0.989 0.904 0.196)`. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow unified** — One token: P3 `color(display-p3 0.989 0.904 0.196)` + sRGB `#ffe600`. No desktop/iPhone split. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow more neon** — Desktop/sRGB `#ffee00` (more neon than `#ffec10`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow slightly neon** — Desktop/sRGB `#ffec10` (slightly more neon than `#ffe91c`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow slightly more** — Desktop/sRGB `#ffe91c` (slightly more yellow than `#ffe924`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow less pale** — Desktop/sRGB `#ffe924` (a little less pale than `#ffe92a`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lil paler 2** — Desktop/sRGB `#ffe92a` (a little paler than `#ffe922`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lil paler** — Desktop/sRGB `#ffe922` (a little paler than `#ffe914`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow slightly paler** — Desktop/sRGB `#ffe914` (whisper of blue vs `#ffe900`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow slightest more** — Desktop/sRGB `#ffe900` (slightest more yellow than `#ffe800`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow a little more** — Desktop/sRGB `#ffe800` (more yellow than `#ffe500`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lock** — Desktop/sRGB `#ffe500` (one hair more gold than `#ffe600`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lemon hair light** — Desktop/sRGB `#ffe600` (one hair lighter than `#ffe500`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lemon gold hair 2** — Desktop/sRGB `#ffe500` (one hair less gold than `#ffe400`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lemon gold hair** — Desktop/sRGB `#ffe400` (slightest gold from `#ffe600`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lemon chroma 3** — Desktop/sRGB `#ffe600` (blue channel gone). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lemon chroma 2** — Desktop/sRGB `#ffe818` (less wash than `#ffe830`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lemon chroma** — Desktop/sRGB `#ffe830` (less faded than `#ffec42`). iPhone P3 unchanged. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow desktop lift** — Desktop/sRGB `#ffec42`; iPhone P3 unchanged (`color-gamut: p3` + `pointer: coarse`). Removed 2px glow. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow P3-on-sRGB** — P3 token only in `@media (color-gamut: p3)`. sRGB desktop keeps `#ffe600` plus a 5px glow on 2px yellow bars (menu / PROJECTS header). `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow P3** — `--palette-yellow` stays `#ffe600` on sRGB; wide-gamut gets `color(display-p3 0.989 0.904 0.196)`. Hero square fill is `var(--palette-yellow)`. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow banana 4** — `#ffe600` (one notch up from `#ffe000`). `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow banana 3** — `#ffe000` (one notch up from `#ffda00`). `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow banana 2** — `#ffda00` (one notch up from `#ffd400`). `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow banana** — `#ffd400` (lift from `#ffcc00` dark-banana). Still one token. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow ink 3** — `#ffcc00` (same-size darken from `#ffd200`). PROJECTS header rule taken off the title-stack `translateY` so the 2px bar is not subpixel-mixed. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow ink 2** — `#ffd200` (same-size darken from `#ffd800`). No underline width change. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow ink** — `#ffd800` (slight darken from `#ffde00`, still one token). No underline width change. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow gold** — `#ffde00` (slight gold from `#ffe700`). No underline width change. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow chroma** — `#ffe700` (same L as `#ffe73a`, blue channel dropped). No underline width change. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow nudge** — `#ffe73a` (~15% toward hero square `#FFC90F`). `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-13 | **Palette yellow lock** — `#ffec42` lemon, lifted so the 2px menu bar doesn’t read dark. `--palette-yellow-projects` aliases `--palette-yellow`. |
| 2026-09-12 | **Brave PROJECTS press-drag freeze** — Symptom: after press+drag-off a main PROJECTS card in Brave, hit-testing dies while grid CSS keeps animating; Chrome OK. Root cause: **native thumbnail `img`/`video` drag**, not Framer `whileTap` or cluster CSS `zoom`. Fix: `draggable={false}` + `onDragStart` preventDefault on card button/media; CSS `-webkit-user-drag: none` + `pointer-events: none` on card media. Keep PORTFOLIO_BOUNCE `whileTap`. Do not “fix” by stripping bounce or chasing zoom/Framer again. |
| 2026-09-06 | **FAILED (do not retry blindly) — Mobile PDF loader grid drift** — Symptom: on phone only, PDF viewer grid BG stalls then snap-catches-up while loading; iPad/desktop OK (same `grid-drift-bg` / `background-position`). Goal: continuous drift like iPad — no freeze, no snap, no color change. All attempts **reverted**. Failed: (1) CSS `gridDriftSmoothCompositor` + `-48px` inset on `.pdf-viewer-grid-drift`; (2) bitmap 48px tile + transform-only layer + pdf.js yields/DPR cap/early page-1 ready; (3) defer pdf.js until after loader (fetch-only gate, mount `PdfJsDocumentView` on `showFrame`). User rejected freeze-during-load. Likely root: phone main-thread pegged by pdf.js parse/canvas during full-screen loader; iPad has budget. Next try needs a new approach (not the three above). Touch: `PdfViewerGridBackdrop`, `SupportingPdfPreviewDialog`, `PdfJsDocumentView`, `index.css` grid rules. |
| 2026-08 | **Hero stutter-free reel** — When replacing `src/assets/hero1.mp4`, re-encode H.264 `yuv420p`, 1920×1080@30fps, `+faststart`, no audio, ~3–6 Mbps / a few MB for ~4s (validated ~3.2MB). Keep the real hero `<video>` mounted while visually closed; preload that same element; gate entrance on `HAVE_ENOUGH_DATA` or fully buffered (error/timeout fail-open); call `play()` and `scaleX` open in the same tick (no static frame). QA: desktop/mobile opened at `readyState` 4 with advancing `currentTime`. |
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
