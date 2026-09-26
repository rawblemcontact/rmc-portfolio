from pathlib import Path

path = Path("src/pages/Home.tsx")
s = path.read_text(encoding="utf-8")

# Props cleanup
s = s.replace(
    "  dualInline = false,\n  orchestratedReveal = false,\n  revealActive = false,\n  revealReduceMotion = false,\n  headerRevealDelayMs = 0,\n  gridRevealDelayMs = 0,\n",
    "  dualInline = false,\n",
)
s = s.replace(
    "  dualInline?: boolean;\n  orchestratedReveal?: boolean;\n  revealActive?: boolean;\n  revealReduceMotion?: boolean;\n  headerRevealDelayMs?: number;\n  gridRevealDelayMs?: number;\n",
    "  dualInline?: boolean;\n",
)

# Remove isOrchestrated block through rowZonePad
start = s.find("  const isOrchestrated = orchestratedReveal")
end = s.find("  const rowZonePad = dualInline ? SKILLS_ROW_ZONE_PADDING_DUAL")
if start != -1 and end != -1:
    s = (
        s[:start]
        + "  const panelHeader = SKILLS_DATA[slide];\n"
        + "  const headerCompact = dualInline && variant === \"inline\";\n\n"
        + "  const rowZoneBackdrop = dualInline ? null : <div aria-hidden className={SKILLS_ROW_STRIP_BG} />;\n\n"
        + "  const rowZonePad = dualInline ? \"relative w-full min-w-0\" : SKILLS_ROW_ZONE_PADDING;\n"
        + s[end + len("  const rowZonePad = dualInline ? SKILLS_ROW_ZONE_PADDING_DUAL : SKILLS_ROW_ZONE_PADDING;") :]
    )

# Static section header
header_start = s.find("  /** Same rail header as #experience")
header_end = s.find("  return (\n  <UiverseCard", header_start)
if header_start != -1 and header_end != -1:
    static_header = '''  /** Same rail header as #experience .nav-header (title + gray subhead + divider). */
  const sectionHeader = (
    <motion.div
      className={[
        "skills-subpanel-header nav-header relative z-[1] flex-shrink-0 min-w-0",
        headerCompact ? "skills-subpanel-header--compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <motion.div className="career-nav-section-labels min-w-0 pr-0">
        <p className="career-nav-section-subtitle">{panelHeader.title}</p>
        <p className="career-nav-section-title">{panelHeader.subtitle}</p>
      </motion.div>
      <motion.div className="career-nav-section-divider" aria-hidden />
'''
    # find icon block end - still inside sectionHeader
    icon_marker = "      {SKILLS_SHOW_IDEA_GEAR_DECOR ? ("
    icon_start = s.find(icon_marker, header_start)
    icon_end = s.find("    </motion.div>\n  );\n\n  return (\n  <UiverseCard", header_start)
    if icon_start != -1 and icon_end != -1:
        icon_block = s[icon_start:icon_end]
        s = s[:header_start] + static_header + icon_block + s[icon_end:]

# Remove panel stagger props on motion.div key=slide
s = s.replace(
    """        {...(isOrchestrated
          ? {}
          : {
              variants: skillsPanelStaggerParent,
              initial: "hidden" as const,
              whileInView: "show" as const,
              viewport: { once: false, amount: 0.08 },
            })}""",
    "",
)
s = s.replace(
    '          {...(!isOrchestrated ? { variants: skillsPanelStaggerChild } : {})}\n',
    "",
)

# Remove orchestrated card branches
import re
s = re.sub(
    r"                  if \(isOrchestrated\) \{.*?                  return \(\n",
    "                  return (\n",
    s,
    flags=re.DOTALL,
)

# SkillArsenal flourish
flourish_start = s.find("  const [skillsIconFlourish")
flourish_end = s.find("  return (\n    <section\n      id=\"skills\"", flourish_start)
if flourish_start != -1 and flourish_end != -1:
    s = s[:flourish_start] + s[flourish_end:]

s = s.replace('data-skills-icon-flourish={skillsIconFlourish ? "true" : undefined}\n      ', "")

# Static SKILLS title
s = re.sub(
    r"""            <motion\.div
                className="w-full max-w-\[min\(100%,1180px\)\]"
                initial=\{\{ opacity: 0, y: -28 \}\}
                animate=\{
                  revealActive
                    \? \{ opacity: 1, y: 0 \}
                    : \{ opacity: 0, y: -28 \}
                \}
                transition=\{
                  duration: revealRm \? 0\.01 : SKILLS_REVEAL_TITLE_FADE_MS / 1000,
                  delay: revealRm \? 0 : SKILLS_REVEAL_ROW_ZONES_LEAD_MS / 1000,
                  ease: SKILLS_CONTENT_EASE,
                \}
                style=\{\{ willChange: "transform, opacity" \}\}
              >
                <SectionHeader
                  title="SKILLS"
                  align="center"
                  showBar=\{false\}
                  compact
                  titleFade""",
    '''            <motion.div className="w-full max-w-[min(100%,1180px)]">
                <SectionHeader
                  title="SKILLS"
                  align="center"
                  showBar={false}
                  compact
                  titleStatic''',
    s,
    flags=re.DOTALL,
)

# Intro stagger
s = s.replace(
    """                  variants={skillsChromeStaggerParent}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.2 }}
                  onAnimationStart={(def) => {
                    if (def !== "show") return;
                    scheduleSkillsIconFlourish(SKILLS_INTRO_MOTION_END_S);
                  }}
""",
    "",
)
s = s.replace("                  <motion.div variants={skillsChromeStaggerChild}>", "                  <motion.div>")

# Panel calls
s = re.sub(
    r"\n                        orchestratedReveal\n                        revealActive=\{revealActive\}\n                        revealReduceMotion=\{revealRm\}\n                        headerRevealDelayMs=\{SKILLS_REVEAL_[^\}]+\}\n                        gridRevealDelayMs=\{SKILLS_REVEAL_[^\}]+\}",
    "",
    s,
)

s = re.sub(
    r"onAnimationStart=\{\(\) => \{\s*scheduleSkillsIconFlourish\(SKILLS_OVERLAY_MOTION_END_S\);\s*\}\}\n",
    "",
    s,
)

# dual inline shell padding
s = s.replace(
    '? "relative z-10 flex min-h-0 max-h-[min(calc(50dvh-3.75rem),22rem)] max-sm:max-h-[min(calc(50dvh-3.25rem),19rem)] flex-col overflow-hidden px-3 sm:px-6 md:px-10 lg:px-12 pt-0 pb-1.5 sm:pt-1 sm:pb-3 md:pt-1.5 md:pb-4 text-left shadow-[0_0_18px_rgba(0,0,0,0.45),0_0_14px_rgba(34,211,238,0.1)]"',
    '? "relative z-10 flex min-h-0 max-h-[min(calc(50dvh-3.75rem),22rem)] max-sm:max-h-[min(calc(50dvh-3.25rem),19rem)] flex-col overflow-hidden px-0 pt-0 pb-0 text-left"',
)

# UiverseCard dual overflow
if "overflow: visible;" not in s[s.find("skills-subcard.skills-subcard-dual") : s.find("skills-subcard.skills-subcard-dual") + 200]:
    s = s.replace(
        """  &.skills-subcard.skills-subcard-dual {
    max-height: min(calc(50dvh - 3.75rem), 22rem);
    @media (max-width: 639px) {
      max-height: min(calc(50dvh - 3.25rem), 19rem);
    }
  }""",
        """  &.skills-subcard.skills-subcard-dual {
    max-height: min(calc(50dvh - 3.75rem), 22rem);
    overflow: visible;
    @media (max-width: 639px) {
      max-height: min(calc(50dvh - 3.25rem), 19rem);
    }
  }""",
    )

path.write_text(s, encoding="utf-8")
print("ok", "isOrchestrated" in s, "SKILLS_REVEAL" in s)
