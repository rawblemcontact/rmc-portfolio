---
name: portfoliov2-profile-viewport-gutters
description: >-
  Matches section left/right viewport gutters to #profile in PortfolioTRUEV2 by
  reusing the centered two-column shell (text column + gap + mascot) and
  PROFILE_VIEWPORT_CONTENT_MAX. Use when the user asks for PROFILE side gaps,
  equal margins, gutter parity, aligning SKILLS/EXPERIENCE/PROJECTS to PROFILE,
  or fixing content sitting too close to screen edges on desktop.
disable-model-invocation: false
---

# PROFILE viewport gutters (PortfolioTRUEV2)

## Core idea

`#profile` side gaps on desktop are **not** only `container` + `px-4 sm:px-6`.

They come from a **centered flex row** whose width is:

`left text column` + `gap` + `RAWBLEM mascot column`

That whole block is `justify-center` inside the container. Matching another section means matching **that row’s total width and centering**—not stretching content to the full container inner width.

## Source of truth in code

In `src/pages/Home.tsx` (near `SHOWCASE_COLUMN_MAX`), reuse these constants—do not duplicate magic numbers elsewhere:

| Constant | Role |
|----------|------|
| `PROFILE_SECTION_CONTAINER` | `container mx-auto px-4 sm:px-6 relative z-20` |
| `PROFILE_LAYOUT_ROW` | Centered flex row + responsive gaps |
| `PROFILE_LEFT_COLUMN` | Profile text column max widths (`38rem` → `44rem`) |
| `PROFILE_MASCOT_COLUMN` / `PROFILE_MASCOT_FRAME` | Right column + mascot sizes |
| `PROFILE_VIEWPORT_CONTENT_MAX` | **Full row width** (left + gap + mascot) for wide sections |

`PROFILE_VIEWPORT_CONTENT_MAX` breakpoints (must stay in sync with mascot frame sizes):

- `lg`: `calc(38rem + 5rem + 300px)` — gap-20, mascot `md` max 300px
- `xl`: `calc(40rem + 9rem + 312px)` — gap-36, mascot 312px
- `2xl`: `calc(44rem + min(14rem, 12vw) + 348px)` — gap + mascot 348px

## Apply to a section (e.g. SKILLS)

**Reference implementation:** `SkillArsenal` in `Home.tsx`.

```tsx
<motion.div className={`${PROFILE_SECTION_CONTAINER} z-10 flex ... lg:flex lg:items-center`}>
  <motion.div className={`${PROFILE_LAYOUT_ROW} min-h-0 w-full flex-1`}>
    <motion.div
      className={`${PROFILE_VIEWPORT_CONTENT_MAX} … -ml-[3px] flex min-h-0 flex-1 flex-col`}
    >
      {/* section content — full width of shell, not full viewport */}
    </motion.div>
  </motion.div>
</motion.div>
```

Rules:

1. **Shell** uses `PROFILE_VIEWPORT_CONTENT_MAX` + `mx-auto` (included in constant)—one centered column as wide as PROFILE’s entire row.
2. **Do not** add a fake invisible mascot spacer; width math replaces it.
3. **Do not** only cap inner content at `58rem` (`SHOWCASE_COLUMN_MAX`) unless the section is SHOWCASE— that centers a narrower column and **will not** match PROFILE’s left edge.
4. **Left-align** section titles with PROFILE: `text-left` + `-ml-[3px]` on the shell or header (PROFILE `SectionHeader` uses `-ml-[3px]`).
5. Keep `min-w-0` / `overflow-x-hidden` on shell and grids so cards don’t blow past gutters on small widths.
6. On `< lg`, shell is `w-full`; gutters = container padding only (same as PROFILE mobile).

## Anti-patterns

| Wrong | Why |
|-------|-----|
| `container px-4` only, content `w-full` | Desktop content hugs container edges; gaps ≠ PROFILE |
| Inner `max-w-[1180px]` centered alone | Extra inset; left edge won’t line up with PROFILE title |
| `content + invisible mascot` spacer | Fragile; prefer `PROFILE_VIEWPORT_CONTENT_MAX` |
| Widen shell past row total | Breaks right gutter symmetry |

## When PROFILE shell differs

- **Narrow section** (profile text only): use `PROFILE_LEFT_COLUMN` inside `PROFILE_LAYOUT_ROW` with real mascot column—copy `PhantomProfile` structure.
- **SHOWCASE / EXPERIENCE rail**: may use `SHOWCASE_COLUMN_MAX` + inner `px-*` wrappers for carousel alignment—that is a **different** gutter contract; don’t mix with PROFILE row math unless user explicitly wants PROFILE parity.

## Verification

1. `npm run build`
2. Browser: open PROFILE slide/panel, then target section; compare **left edge** of main title and **right edge** of content to PROFILE (and to top-right nav icons on overlay sections).
3. Check `lg`, `xl`, `2xl` and one mobile width; confirm no horizontal scroll.
4. If changing mascot or left-column max widths in PROFILE, **update `PROFILE_VIEWPORT_CONTENT_MAX` calc** in the same edit.

## Changing PROFILE layout

If PROFILE column widths, gaps, or mascot `max-w` change:

1. Update `PROFILE_*` constants in `Home.tsx`
2. Recompute `PROFILE_VIEWPORT_CONTENT_MAX` at each breakpoint
3. Re-verify every section using the shell (currently SKILLS)

## Related

- [portfoliov2-repository-agent](../portfoliov2-repository-agent/SKILL.md) — repo map + `AGENTS.md`
- [portfoliov2-responsive-qa](../portfoliov2-responsive-qa/SKILL.md) — overflow and breakpoint checks
