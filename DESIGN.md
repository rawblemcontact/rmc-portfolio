# Neo Tokyo Game UI

**A futuristic command-based portfolio interface inspired by Japanese game UI and Swiss editorial grids.**

---

## Design Philosophy

Neo Tokyo Game UI blends precision-driven command-line aesthetics with the clarity of Japanese RPG interfaces and the structural rigor of Swiss graphic design. The result is a dark, technical, high-contrast system that feels both futuristic and intentional.

---

## Core Principles

### 1. Command interface, not SaaS
- **Left-align all typography** — no centered hero layouts
- **Technical labels** above primary content (e.g. `SYSTEM // PORTFOLIO`, `NAVIGATION`)
- **Index numbers** for lists (01, 02, 03…) — monospace, muted
- **Micro labels** on the right (OPEN, VIEW, ENTER) — action-oriented, not decorative

### 2. Grids and structure
- **Subtle grid overlays** on key sections (hero, menu) — ~3% white opacity, 48px cells
- **Divider lines** between list items, not bordered boxes
- **Sharp corners** for technical elements; rounded only for primary CTAs when appropriate

### 3. Precision over softness
- **Hover feels precise** — 6px horizontal shift, 200–300ms ease-out
- **Underlines** instead of vertical bars for accent — animate on hover (`scaleX` 0→1)
- **No soft shadows or pill-shaped containers** for command lists

### 4. Typography
- **Satoshi Bold** for display/headings
- **Satoshi Medium** for body
- **Monospace** for technical labels, indexes, and micro actions
- **Uppercase + letter-spacing** for command-style labels

---

## Color

- **Background**: Black (#0a0a0a, #000)
- **Primary text**: White
- **Secondary text**: Zinc 400/500
- **Accent**: Cyan (primary), plus rainbow motif (red, yellow, blue, pink, green) for menu items — used minimally and deliberately

---

## Motion

See `P3R_MOTION_RULES.md` for detailed motion tokens. Key alignments:

- **UI transitions**: 160–260ms, ease-out
- **Hover shift**: 200–300ms
- **Underline reveal**: same timing, `scaleX` from left
- **No bounce** — ease-out, not spring

---

## Reference Sections

| Section | Traits |
|---------|--------|
| **Hero** | Left-align, `SYSTEM // PORTFOLIO`, grid overlay, micro metadata line, rounded START CTA |
| **Menu** | Command list (index + icon + label + micro), divider lines, colored underlines on hover, grid overlay |
| **Cards** | Avoid boxed cards; prefer rows with dividers and precise hover states |

---

## Checkpoints (revert reference)

### Skills cards — display-only (current)
**State to revert to if we re-add click/expand later.**

- **Location:** `client/src/pages/Home.tsx` — `SkillCardMorph`, `SkillArsenal`, `SKILLS_DATA`.
- **Behavior:** Two cards (Core Competencies, Tools & Technologies) are display-only. No click handler; no expand/slide/flip. Cards show neutral front face only, with float animation and hover (translateZ, scale) intact.
- **Data:** Subskill content kept in `SKILLS_DATA` (core/tools with categories and items). No expanded container is rendered.
- **To restore this state:** Use git to return to the commit created after this checkpoint (see commit message containing “Skills cards display-only checkpoint”).
