import fs from "fs";

const path = "src/pages/Home.tsx";
let s = fs.readFileSync(path, "utf8");

// Remove animation constants (keep ambient marquee section)
const constStart = s.indexOf("const SKILLS_CONTENT_EASE:");
const constEnd = s.indexOf("/** Background marquee (not inside cards)");
if (constStart !== -1 && constEnd !== -1) {
  s = s.slice(0, constStart) + s.slice(constEnd);
}

// SkillsSubskillsPanel: strip orchestrated props
s = s.replace(
  /  dualInline = false,\n  orchestratedReveal = false,\n  revealActive = false,\n  revealReduceMotion = false,\n  headerRevealDelayMs = 0,\n  gridRevealDelayMs = 0,\n/g,
  "  dualInline = false,\n",
);
s = s.replace(
  /  dualInline\?: boolean;\n  orchestratedReveal\?: boolean;\n  revealActive\?: boolean;\n  revealReduceMotion\?: boolean;\n  headerRevealDelayMs\?: number;\n  gridRevealDelayMs\?: number;\n/g,
  "  dualInline?: boolean;\n",
);

// Panel body: isOrchestrated through rowZoneBackdrop
s = s.replace(
  /  const isOrchestrated = orchestratedReveal && variant === "inline" && dualInline;\n\n  const panelHeader = SKILLS_DATA\[slide\];\n  const headerCompact = dualInline && variant === "inline";\n  const headerLabelsDelayS[\s\S]*?const rowZoneBackdrop =[\s\S]*?    \);\n\n  const rowZonePad/,
  `  const panelHeader = SKILLS_DATA[slide];
  const headerCompact = dualInline && variant === "inline";

  const rowZoneBackdrop = dualInline ? null : <motion.div aria-hidden className={SKILLS_ROW_STRIP_BG} />;

  const rowZonePad`,
);

// Static section header (replace motion block until "return (")
const headerStart = s.indexOf("  /** Same rail header as #experience");
const headerEnd = s.indexOf("  return (\n  <UiverseCard", headerStart);
if (headerStart !== -1 && headerEnd !== -1) {
  const staticHeader = `  /** Same rail header as #experience .nav-header (title + gray subhead + divider). */
  const sectionHeader = (
    <div
      className={[
        "skills-subpanel-header nav-header relative z-[1] flex-shrink-0 min-w-0",
        headerCompact ? "skills-subpanel-header--compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="career-nav-section-labels min-w-0 pr-0">
        <p className="career-nav-section-subtitle">{panelHeader.title}</p>
        <p className="career-nav-section-title">{panelHeader.subtitle}</p>
      </div>
      <div className="career-nav-section-divider" aria-hidden />
`;
  s = s.slice(0, headerStart) + staticHeader + s.slice(headerEnd);
}

// Remove panel stagger on content shell
s = s.replace(
  /\{\.\.\.\(isOrchestrated\n          \? \{\}\n          : \{\n              variants: skillsPanelStaggerParent,\n              initial: "hidden" as const,\n              whileInView: "show" as const,\n              viewport: \{ once: false, amount: 0\.08 \},\n            \}\)\}\n/g,
  "",
);
s = s.replace(
  /\{\.\.\.\(!isOrchestrated \? \{ variants: skillsPanelStaggerChild \} : \{\}\)\}\n/g,
  "",
);

// motion.div wrappers -> div (panel inner)
s = s.replace(
  /<motion\.motion\.div\n        key=\{slide\}/g,
  "<motion.div\n        key={slide}",
);
s = s.replace(
  /        <motion\.div\n          className=\{\n            "relative z-\[1\] flex-1 min-h-0"\n          \}\n/g,
  '        <motion.div className="relative z-[1] flex-1 min-h-0">\n',
);

// Remove orchestrated card animation branches (both core and tools)
const orchBlock =
  /                  if \(isOrchestrated\) \{\n                    return \(\n                      <motion\.div\n                        key=\{[^}]+\}\n                        className=\{columnClass\}[\s\S]*?                    \);\n                  \}\n                  return \(\n/g;
s = s.replace(orchBlock, "                  return (\n");

// SkillArsenal flourish + title
s = s.replace(
  /  const \[skillsIconFlourish[\s\S]*?  useEffect\(\(\) => \{\n    if \(!revealActive[\s\S]*?  \}, \[revealActive, revealRm, scheduleSkillsIconFlourish\]\);\n\n  return \(\n    <section\n      id="skills"\n      data-skills-icon-flourish=\{skillsIconFlourish \? "true" : undefined\}\n/,
  `  return (
    <section
      id="skills"
`,
);

s = s.replace(
  /<motion\.motion\.motion\.div\n                className="w-full max-w-\[min\(100%,1180px\)\]"\n                initial=\{\{ opacity: 0, y: -28 \}\}[\s\S]*?              >\n                <SectionHeader\n                  title="SKILLS"[\s\S]*?                  titleFade\n/,
  `<div className="w-full max-w-[min(100%,1180px)]">
                <SectionHeader
                  title="SKILLS"
                  align="center"
                  showBar={false}
                  compact
                  titleStatic
`,
);

s = s.replace(
  /<\/motion\.div>\n            <\/div>\n            \{\/\* Cards area/,
  `</motion.div>
            </motion.div>
            {/* Cards area`,
);

// Fix botched closing - find title section end
s = s.replace(
  /<\/motion\.motion\.motion\.div>\n            <\/div>\n            \{\/\* Cards area/,
  `</motion.div>
            </motion.div>
            {/* Cards area`,
);

// Simpler title fix
s = s.replace(
  /<motion\.div\n                className="w-full max-w-\[min\(100%,1180px\)\]"\n                initial=\{\{ opacity: 0, y: -28 \}\}[\s\S]*?ease: SKILLS_CONTENT_EASE,\n                \}\}\n                style=\{\{ willChange: "transform, opacity" \}\}\n              >\n                <SectionHeader\n                  title="SKILLS"\n                  align="center"\n                  showBar=\{false\}\n                  compact\n                  titleFade\n                  titleClassName="font-semibold"\n                  className="!mb-4 sm:!mb-5 md:!mb-6"\n                \/>\n              <\/motion\.motion\.div>/,
  `<motion.div className="w-full max-w-[min(100%,1180px)]">
                <SectionHeader
                  title="SKILLS"
                  align="center"
                  showBar={false}
                  compact
                  titleStatic
                  titleClassName="font-semibold"
                  className="!mb-4 sm:!mb-5 md:!mb-6"
                />
              </motion.div>`,
);

// Intro stagger removal
s = s.replace(
  /                  variants=\{skillsChromeStaggerParent\}\n                  initial="hidden"\n                  whileInView="show"\n                  viewport=\{\{ once: false, amount: 0\.2 \}\}\n                  onAnimationStart=\{\(def\) => \{\n                    if \(def !== "show"\) return;\n                    scheduleSkillsIconFlourish\(SKILLS_INTRO_MOTION_END_S\);\n                  \}\}\n/g,
  "",
);
s = s.replace(/                  <motion\.div variants=\{skillsChromeStaggerChild\}>\n/g, "                  <motion.div>\n");
s = s.replace(
  /<motion\.span\n                            className="block font-display[\s\S]*?delay: 0\.15 \}\}\n                          >\n                            CORE COMPETENCIES\n                          <\/motion\.span>/,
  '<span className="block font-display font-semibold uppercase tracking-nav-caps leading-snug text-white h-[52px]" style={{ fontSize: `${SKILLS_CARD_LAYOUT.core.title.fontSize}px`, textShadow: "0 0 10px rgba(0,0,0,0.9)" }}>CORE COMPETENCIES</span>',
);
s = s.replace(
  /<motion\.span\n                            className="block font-display[\s\S]*?delay: 0\.25 \}\}\n                          >\n                            TOOLKIT\n                          <\/motion\.span>/,
  '<span className="block font-display font-semibold uppercase tracking-nav-caps leading-snug text-white h-[52px]" style={{ fontSize: `${SKILLS_CARD_LAYOUT.tools.title.fontSize}px`, textShadow: "0 0 10px rgba(0,0,0,0.9)" }}>TOOLKIT</span>',
);

// Panel calls
s = s.replace(
  /                        dualInline\n                        orchestratedReveal\n                        revealActive=\{revealActive\}\n                        revealReduceMotion=\{revealRm\}\n                        headerRevealDelayMs=\{SKILLS_REVEAL_HEADER_DELAY_MS\}\n                        gridRevealDelayMs=\{SKILLS_REVEAL_[A-Z_]+\}\n/g,
  "                        dualInline\n",
);

s = s.replace(/scheduleSkillsIconFlourish\(SKILLS_OVERLAY_MOTION_END_S\);\n                  \}\n/g, "");

// Header fit + outer card (from prior work)
s = s.replace(
  'const SKILLS_ROW_ZONE_PADDING_DUAL = "p-2 sm:p-2.5 md:p-3";',
  'const SKILLS_ROW_ZONE_PADDING_DUAL = "px-2.5 py-2.5 sm:px-3 sm:py-3 md:px-3.5 md:py-3";',
);
s = s.replace(
  'className="career-nav-section-labels min-w-0 pr-0 sm:pr-12"',
  'className="career-nav-section-labels min-w-0 pr-0"',
);
s = s.replace(
  '? "relative z-10 flex min-h-0 max-h-[min(calc(50dvh-3.75rem),22rem)] max-sm:max-h-[min(calc(50dvh-3.25rem),19rem)] flex-col overflow-hidden px-3 sm:px-6 md:px-10 lg:px-12 pt-0 pb-1.5 sm:pt-1 sm:pb-3 md:pt-1.5 md:pb-4 text-left shadow-[0_0_18px_rgba(0,0,0,0.45),0_0_14px_rgba(34,211,238,0.1)]"',
  '? "relative z-10 flex min-h-0 max-h-[min(calc(50dvh-3.75rem),22rem)] max-sm:max-h-[min(calc(50dvh-3.25rem),19rem)] flex-col overflow-hidden px-0 pt-0 pb-0 text-left"',
);
s = s.replace(
  'const SKILLS_SUBCATEGORY_CARD_FACE =\n  "skills-card-surface rounded-[0.95rem] border-0 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:rounded-[1.05rem]',
  'const SKILLS_SUBCATEGORY_CARD_FACE =\n  "skills-card-surface transition-[background-color] duration-300 ease-out',
);

// dual rowZoneBackdrop at start of panel - fix motion.div to div
s = s.replace(
  'const rowZoneBackdrop = dualInline ? null : <motion.div aria-hidden className={SKILLS_ROW_STRIP_BG} />;',
  'const rowZoneBackdrop = dualInline ? null : <motion.div aria-hidden className={SKILLS_ROW_STRIP_BG} />;',
);

fs.writeFileSync(path, s);
console.log("done", {
  isOrchestrated: s.includes("isOrchestrated"),
  SKILLS_REVEAL: s.includes("SKILLS_REVEAL"),
  skillsChromeStagger: s.includes("skillsChromeStagger"),
  scheduleSkillsIconFlourish: s.includes("scheduleSkillsIconFlourish"),
});
