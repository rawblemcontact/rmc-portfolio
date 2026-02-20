# Persona-style Motion Rules (Master Reference)

Source reference: `c:\Users\robbi\Desktop\YTDown.com_YouTube_Persona-3-Reload-Menus_Media_fXgKcM20M08_001_1080p.mp4` (1080p, 60fps).

Goal: capture the *rules* behind Persona 3 Reload UI motion so we can reproduce the feel consistently in this portfolio without re-watching the video every time.

---

## Global principles (what makes it feel “Persona / Nintendo polished”)

- **Layered motion, not global motion**: the whole screen rarely “moves.” Instead, *overlays/panels/highlights* move over a mostly stable base.
- **Speed with control**: transitions feel fast, but readability is protected by sequencing (wipe → stabilize → text becomes readable).
- **No goofy bounce**: almost everything is **ease-out** or **ease-in-out**. If a “settle” exists, it’s subtle (no elastic).
- **Hard shapes + soft fades**: geometry is crisp (diagonal slabs/stripes), while fades/opacity smooth over cuts.
- **Stagger is intentional**: lists feel staged; not every element animates at once.
- **“Confirm” ≠ “Hover”**: selection movement is quick; confirm triggers a more dramatic screen wash/wipe.

---

## Motion tokens (recommended ranges)

These are not exact numbers from the game; they’re practical “rule ranges” that match the feel.

- **Micro** (selection tick, underline snap): **80–140ms**
- **UI** (row reveal, small panel slide): **160–260ms**
- **Transition wipe** (screen wash): **420–720ms**
- **Ambient drift** (background life): **8–16s loops**, desynced

Stagger:
- **Row/word/char stagger**: **30–60ms** per item (use less for chars, more for rows)

---

## Easing rules

- **Default**: ease-out (fast start → smooth stop)
- **For wipes**: ease-in-out (so the wipe doesn’t “blink” on/off)
- **Avoid**: spring bounce unless it’s extremely damped (most Persona motion is not bouncy)

Practical cubic-bezier set:
- **Ease-out**: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- **Ease-in-out**: `cubic-bezier(0.45, 0, 0.55, 1)`

---

## Always-on layers (ambient “alive” feeling)

### A) Background drift / parallax
- Very slow, small movement (≈ 1–2% of viewport over 8–16s)
- Ease-in-out loop
- Multiple layers with different speeds/phases (never synchronized)

### B) Floating fragments (confetti/shards/squares)
- Small elements drifting + subtle rotation
- Different sizes = different speeds (parallax implication)
- Opacity gently breathes (not pulsing aggressively)
- Offsets are phase-shifted so loops never align

Rule: ambient layers must **never compete with text** (keep contrast stable).

---

## Transition primitives (the “Persona language”)

### 1) Confirm transition: Screen Wash + Diagonal Stripe Wipe
Used when an option is *confirmed* (e.g., clicking a main menu item).

**Stacked layers (top to bottom):**
1. **Dim layer**: quick dark tint to mask scroll/cut (opacity peak ~0.18–0.35)
2. **Accent wash**: full-screen accent color pulse (short-lived)
3. **White highlight flash**: very quick screen flash (even shorter)
4. **Diagonal streak/slab**: thick diagonal geometry sweeps across
5. (Optional) **Trailing accent band** with blend mode (“screen” / additive feel)

**Sequencing rule (critical):**
- The wipe must be visible *before* the content changes, and must remain long enough that the content change feels “under” it.
- Do not start the new screen’s key text animation until **after** the wipe peak.

**Timing template (typical):**
- t=0ms: start dim + start accent wash
- t=60–120ms: white highlight flash peaks then fades
- t=120–220ms: diagonal streak becomes prominent
- t=140–200ms: trigger underlying navigation/scroll/cut near wipe peak
- t=420–720ms: wash fades away after the new screen is readable

**Geometry rules:**
- Diagonal streak must be **thick** (if it’s thin, it looks like a glitchy line)
- Use multiple stripes/slabs (one shape looks cheap)
- Prefer hard edges + slight texture/gradient inside the slab

### 2) Enter-menu transition: “Ink/Splash reveal”
Used for big state change into a menu context.

Rules:
- Organic mask expands quickly (non-uniform edges)
- UI appears only after the mask covers most of the screen
- The mask should feel like it becomes the new canvas (not just a wipe line)

Timing:
- 300–700ms for the splash takeover
- UI readability begins after coverage stabilizes

---

## List + menu staging rules

### Selection change (hover/arrow navigation)
- Highlight bar moves quickly (≈120–180ms)
- Little/no opacity changes (stability = clarity)
- Optional tiny accent tick (underline, red edge) with the bar

### Panel open / list reveal
- Panel slides in (x/y 8–24px), opacity 0→1
- Rows stagger in (30–60ms per row)
- Rows use y+opacity; avoid large rotations or scale

### Text reveal
- Game often uses *grouped* reveal: headline stabilizes first, then detail text.
- If revealing by character, keep total duration long enough to be seen **after arrival** (do not start mid-transition).

---

## Readability safety rules (non-negotiable)

- Never animate large text blocks with subpixel transforms for long durations (it can shimmer/jitter).
- Wipes must not hide critical text for too long; the wipe should cover the *change* moment, not linger into reading.
- Staggers must complete while the viewer is *present* (trigger on “arrived” state, not “in transit”).

---

## Implementation guidance (for this portfolio)

- Trigger “confirm wipes” on:
  - clicking MENU items
  - clicking side-nav items
- Trigger text staggers (char/word) only when:
  - the target slide is the active slide (arrived), OR
  - the overlay is fully open (side-nav)
- Respect accessibility:
  - `prefers-reduced-motion`: skip wipes, skip staggers (instant state change)
  - keep focus management stable (close overlays immediately on navigate)

---

## Quick checklist (when implementing any new animation)

- **Purpose**: does it communicate state change or hierarchy?
- **Layering**: is it moving the right layer (panel/highlight) instead of the whole screen?
- **Timing**: does the viewer actually see it after arrival?
- **Easing**: is it ease-out / ease-in-out (not bouncy)?
- **Readability**: does text stay crisp and readable?
- **Reduced motion**: does it degrade cleanly?

