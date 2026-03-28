# Responsive reference (design buckets vs Tailwind)

Use this when tuning layout so mental model matches the tools in this repo.

## Target buckets (product / QA)

| Bucket | Range | Examples |
|--------|------|----------|
| 1. Mobile (small) | 320px – 480px | Narrow phones |
| 2. Large mobile / small tablet | 481px – 768px | Large phones, foldables, small tablets |
| 3. Tablet / small laptop | 769px – 1024px | iPads, small laptops, split desktop |
| 4. Desktop | 1025px – 1440px+ | Standard and large monitors |

## What this project actually uses

Stack: **Tailwind CSS v4** via `client/src/index.css` (`@import "tailwindcss"`). There are **no custom breakpoint overrides** in `@theme`, so utilities use **Tailwind defaults**:

| Token | Min width | CSS |
|-------|-----------|-----|
| *(none)* | 0px | Base (mobile-first) |
| `sm:` | **640px** | `@media (min-width: 640px)` |
| `md:` | **768px** | `@media (min-width: 768px)` |
| `lg:` | **1024px** | `@media (min-width: 1024px)` |
| `xl:` | **1280px** | `@media (min-width: 1280px)` |
| `2xl:` | **1536px** | `@media (min-width: 1536px)` |

`max-sm:`, `max-md:`, `max-lg:` etc. mean **below** the next breakpoint (e.g. `max-lg:` = below 1024px).

## Alignment with the four buckets

- **Bucket 1 (320–480)**  
  Fully covered by **base** styles only. There is **no** built-in stop at 480px; anything without `sm:` applies from 0px up to 639px.

- **Bucket 2 (481–768)**  
  - 481–639px: still **base** only (same as bucket 1 for unprefixed classes).  
  - 640–768px: **`sm:`** is active; **`md:`** turns on **at 768px** (same line as bucket 2’s upper bound).

- **Bucket 3 (769–1024)**  
  **`md:`** and **`max-lg:`** territory. **`lg:`** starts at **1024px** (one pixel below “1025px desktop” wording; in practice identical).

- **Bucket 4 (1025+)**  
  **`lg:`** and up (`xl:`, `2xl:`). **`xl:`** (1280px) sits inside your 1025–1440+ range for finer desktop tuning.

## Gaps to remember when tweaking

1. **No 480px or 481px breakpoint** — Tailwind does not split “small phone” vs “large phone” by default. Use **arbitrary variants** when needed, e.g. `max-[480px]:`, `min-[481px]:max-md:`, etc.
2. **`sm` is 640px**, not 481px — “Large mobile” in the table starts earlier than `sm:`.
3. **Bucket boundaries are guidelines** — Prefer testing at **320, 375, 390, 414, 768, 1024, 1280, 1440** rather than only exact bucket edges.

## Quick mapping cheat sheet

- “Phone-only” (roughly bucket 1 + narrow bucket 2): often **`max-sm:`** (below 640) or **`max-md:`** (below 768), depending on design.
- “Tablet portrait / small laptop”: often **`md:`** + **`max-lg:`**.
- “Desktop layout”: typically **`lg:`** (1024px+).

Update this file if `@theme` gains custom `--breakpoint-*` values or a `tailwind.config` adds `screens`.

---

## Safe adjustment policy (remember for future work)

**Treat the four buckets above as the design / QA reference.** The codebase still uses Tailwind’s **default** `sm` / `md` / `lg` / … — that is intentional so existing layouts keep working.

**What we have now is good.** Default breakpoints with no custom `screens` override is a solid, standard setup; the UI already responds well across widths. **There is no need to change the global breakpoint system** for the bucket table to be useful — that table is mainly for **how you think about QA and targeted tweaks**. Reworking Tailwind’s global breakpoints would **not** be a small cleanup; it would **shift every** `sm:` / `md:` / `lg:` **rule at once** and is very likely to **break layout** until everything is re-tested and fixed.

When aligning UI to those guidelines:

1. **Do not** change global Tailwind breakpoint values (`sm`, `md`, `lg`, etc.) unless you plan a **full-project audit** — every prefixed class would shift at once.
2. **Do** prefer **additive** changes:
   - New named breakpoints in `@theme` (e.g. bucket-specific names at 480px / 481px) used only where needed, **or**
   - **Arbitrary variants** on specific components (`max-[480px]:`, `min-[481px]:max-md:`, …).
3. **Migrate incrementally** (page or section at a time) and smoke-test **Home** and any layout-heavy views.

This file is the canonical place to re-read buckets, default Tailwind mapping, gaps, and this policy before responsiveness tweaks.
