// Force rebuild: 2024-05-21
import { motion, AnimatePresence, Variants, useInView, useReducedMotion, useMotionValue, useTransform, animate } from "framer-motion";
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { FillIcon } from "@/components/FillIcon";
import { UserFilledIcon } from "@/components/icons/UserFilledIcon";
import { DUR, EASE, HOVER, SPRING, TAP } from "@/lib/motion";
import { 
  Instagram, 
  Linkedin, 
  Mail, 
  Star, 
  Trophy,
  GraduationCap,
  Heart,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Menu,
  X,
  LucideIcon,
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase
} from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { WordsPullUp } from "@/components/WordsPullUp";
import { FloatingPhone } from "@/components/FloatingPhone";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DUR.slow, ease: EASE.out }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Stacked panel: 380–420ms, decisive, no bounce (anime-tech / Persona-adjacent)
const PANEL_TRANSITION = {
  duration: 0.4,
  ease: [0.65, 0, 0.35, 1] as const, // slightly smoother cubic-bezier
};
const CONTENT_SETTLE_DELAY = 0.06; // 60ms after panel settles

// Shared grid phase so all grid backgrounds stay in sync (no jolt on transition)
const GRID_DRIFT_DURATION = 12;
const GRID_CELL_SIZE = 48;
const GridPhaseContext = createContext<number>(0);

function useGridPhase() {
  return useContext(GridPhaseContext);
}

const gridOverlayStyle = {
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
  `,
  backgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
};

// Motion-only glow on leading accent edge: faint light-bleed, 10–15% opacity, 8–16px blur
const ACCENT_GLOW = {
  blur: 12,
  opacity: 0.12,
};
function accentGlowShadow(hex: string, active: boolean): string {
  if (!active) return "none";
  const hexAlpha = Math.round(ACCENT_GLOW.opacity * 255).toString(16).padStart(2, "0");
  return `0 0 ${ACCENT_GLOW.blur}px ${hex}${hexAlpha}`;
}

// --- TEXT SHUTTER (Persona-style directional reveal, inspired by The Line Studio / Framer) ---
type TextShutterProps = {
  text: string;
  className?: string;
  direction?: "ltr" | "rtl";
  duration?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "p";
  delay?: number;
  /** Split by "words" (spaces) or "chars" for letter-by-letter */
  split?: "words" | "chars" | "none";
  /** "mount" = animate on load; "viewport" = animate when scrolled into view */
  trigger?: "mount" | "viewport";
};

const TextShutter = ({
  text,
  className = "",
  direction = "ltr",
  duration = DUR.base,
  stagger = 0.06,
  as: Tag = "span",
  delay = 0,
  split = "words",
  trigger = "mount",
}: TextShutterProps) => {
  const isLtr = direction === "ltr";
  const closedClip = isLtr ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  const openClip = "inset(0 0 0 0)";

  const parts = split === "words" ? text.split(/\s+/) : split === "chars" ? Array.from(text) : [text];
  const isSpace = split === "words" && parts.length > 1;

  const MotionTag = motion[Tag] as typeof motion.span;

  const transition = (i: number) => ({
    duration,
    delay: delay + i * stagger,
    ease: EASE.out,
  });

  return (
    <MotionTag className={className} style={{ overflow: "visible" }}>
      {parts.map((part, i) => (
        <motion.span
          key={i}
          initial={{ clipPath: closedClip }}
          {...(trigger === "viewport"
            ? {
                whileInView: { clipPath: openClip },
                viewport: { once: true, margin: "-40px 0px -40px 0px" },
                transition: transition(i),
              }
            : {
                animate: { clipPath: openClip },
                transition: transition(i),
              })}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
          }}
        >
          <span style={{ display: "inline-block" }}>{part}</span>
          {isSpace && i < parts.length - 1 ? "\u00A0" : null}
        </motion.span>
      ))}
    </MotionTag>
  );
};

// --- COMPONENTS ---

const SLIDE =
  "no-scrollbar w-screen h-screen flex-shrink-0 snap-start overflow-y-auto overflow-x-hidden overscroll-y-contain";

const scrollToId = (id: string, behavior: ScrollBehavior = "smooth") => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior, block: "nearest", inline: "start" });
};

const NAV_ITEMS: { id: string; label: string; icon: LucideIcon; color: string; sub: string; microLabel: string }[] = [
  { id: "profile", label: "PROFILE", sub: "Summary", icon: User, color: "bg-red-600", microLabel: "OPEN" },
  { id: "projects", label: "PROJECTS", sub: "Projects", icon: Zap, color: "bg-yellow-400", microLabel: "VIEW" },
  { id: "experience", label: "WORK EXPERIENCE", sub: "Career History", icon: Star, color: "bg-blue-600", microLabel: "ENTER" },
  { id: "social", label: "INVOLVEMENT", sub: "Involvement", icon: Heart, color: "bg-pink-500", microLabel: "VIEW" },
  { id: "skills", label: "SKILLS", sub: "Skills", icon: Briefcase, color: "bg-green-600", microLabel: "OPEN" },
];

// Section id → accent color (hex) for transition panel edge (matches MENU item colors)
const SECTION_ACCENT_COLOR: Record<string, string> = {
  profile: "#dc2626",
  projects: "#facc15",
  "project-1": "#facc15",
  "project-2": "#facc15",
  "project-3": "#facc15",
  experience: "#2563eb",
  social: "#ec4899",
  skills: "#16a34a",
};

const CMD_HOVER = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

const BackToMenuButton = ({
  show,
  onBack,
}: {
  show: boolean;
  onBack: () => void;
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: DUR.fast, ease: EASE.out }}
          className="fixed z-50"
          style={{
            left: "calc(0.75rem + env(safe-area-inset-left))",
            bottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          }}
        >
          <motion.div whileHover={HOVER} whileTap={TAP} transition={SPRING.ui}>
            <Button
              type="button"
              onClick={onBack}
              aria-label="Back to menu"
              className="h-10 md:h-11 rounded-full bg-black/55 text-white hover:bg-black/75 border border-white/25 backdrop-blur-md shadow-none px-3.5 md:px-4 font-heading text-[10px] md:text-xs tracking-[0.14em] uppercase flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ChevronLeft size={18} aria-hidden />
              Back to menu
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SectionHeader = ({
  title,
  subtitle,
  align = "left",
  color = "text-white",
  showBar = true,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  color?: string;
  showBar?: boolean;
  compact?: boolean;
}) => (
  <div
    className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"} ${
      compact ? "mb-10" : "mb-16"
    } relative z-10`}
  >
    {showBar && (
      <motion.div 
        initial={{ scaleX: 0, originX: align === "center" ? 0.5 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        className="bg-cyan-500 h-2 w-24 mb-4"
      />
    )}
    <h2 className={`${compact ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"} font-display ${color} leading-none tracking-tight -translate-y-0.5`}>
      <TextShutter text={title} as="span" direction="ltr" duration={0.45} stagger={0.04} split="words" trigger="viewport" />
    </h2>
    {subtitle && (
      <p className="font-heading text-sm md:text-base mt-3 bg-white/10 text-white px-3 py-1 inline-block tracking-[0.18em] uppercase border border-white/15 backdrop-blur-sm">
        {subtitle}
      </p>
    )}
  </div>
);

// --- HERO SECTION ---
const Hero = ({
  onStart,
  isResumeMode,
  toggleResumeMode,
  heroInViewRef,
  active,
}: {
  onStart: () => void;
  isResumeMode: boolean;
  toggleResumeMode: () => void;
  heroInViewRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
}) => {
  const reduceMotion = useReducedMotion();
  const [starting, setStarting] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const startTimersRef = useRef<number[]>([]);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevActiveRef = useRef<boolean>(false);
  const [squareMetrics, setSquareMetrics] = useState<{ size: number; gap: number }>({
    size: 18,
    gap: 10,
  });

  useEffect(() => {
    const ready = () => setFontsReady(true);
    if (document.fonts?.ready) {
      document.fonts.ready.then(ready);
    } else {
      ready();
    }
    const fallback = window.setTimeout(ready, 1200);
    return () => {
      window.clearTimeout(fallback);
      startTimersRef.current.forEach((t) => window.clearTimeout(t));
      startTimersRef.current = [];
    };
  }, []);

  // Reset only when returning to the hero slide (active false -> true).
  // This prevents "looping" and also avoids cancelling the click animation.
  useEffect(() => {
    const wasActive = prevActiveRef.current;
    if (!wasActive && active) setStarting(false);
    prevActiveRef.current = active;
  }, [active]);

  const onStartClick = () => {
    if (starting) return;
    if (reduceMotion) {
      onStart();
      return;
    }

    // Compute square sizes relative to the actual button size (true morph feel).
    const btn = startBtnRef.current;
    if (btn) {
      const w = btn.clientWidth;
      const h = btn.clientHeight;
      const gap = Math.max(8, Math.round(w * 0.045));
      const size = Math.max(14, Math.floor(Math.min(h * 0.55, (w - gap * 3) / 4)));
      setSquareMetrics({ size, gap });
    }

    setStarting(true);

    // Let the morph begin, but don't wait for completion.
    startTimersRef.current.forEach((t) => window.clearTimeout(t));
    startTimersRef.current = [];
    startTimersRef.current.push(
      // Ensure the viewer sees the animation before navigating.
      window.setTimeout(() => onStart(), 500),
    );
  };

  const gridPhase = useGridPhase();
  return (
    <section id="hero" className={`relative h-screen w-full overflow-hidden bg-black text-white flex items-center p-6 md:p-10 lg:p-14 ${SLIDE}`}>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{ ...gridOverlayStyle, backgroundPosition: `${gridPhase}px ${gridPhase}px` }}
      />
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-start text-left">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-start w-full"
        >
          <motion.div
            variants={{ hidden: { opacity: 1 }, visible: { opacity: 1 } }}
            className="mb-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: fontsReady ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className="font-mono text-xs md:text-sm text-zinc-500 tracking-[0.2em] uppercase"
            >
              <TextShutter text="SYSTEM // PORTFOLIO" direction="rtl" duration={0.3} stagger={0} split="none" delay={0} />
            </motion.p>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 1 }, visible: { opacity: 1 } }}
            className="relative mb-4 font-display text-6xl md:text-8xl lg:text-9xl leading-none tracking-tighter"
          >
            <span className="block text-white">
              <TextShutter text="ROBBIE" as="span" direction="ltr" duration={0.3} stagger={0} split="none" delay={0.32} />
            </span>
            <span className="block text-cyan-500">
              <TextShutter text="MCLAUGHLIN" as="span" direction="rtl" duration={0.3} stagger={0} split="none" delay={0.64} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: fontsReady ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="font-mono text-[11px] md:text-xs text-zinc-500 tracking-widest uppercase mb-12"
          >
            Writer / Digital Media / Narrative Systems
          </motion.p>

          <motion.div ref={heroInViewRef} variants={fadeInUp} className="flex items-center">
            <motion.div
              whileHover={HOVER}
              whileTap={TAP}
              transition={SPRING.ui}
            >
              <Button
                size="lg"
                className={`font-display text-xl uppercase tracking-widest h-16 w-48 rounded-full transition-all border-4 group relative ${
                  starting ? "overflow-visible" : "overflow-hidden"
                } ${
                  starting
                    ? "bg-black text-white border-transparent disabled:opacity-100 disabled:bg-black disabled:text-white"
                    : "bg-white hover:bg-zinc-200 text-black border-transparent hover:border-cyan-500"
                }`}
                onClick={onStartClick}
                disabled={starting}
                ref={startBtnRef}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {!starting ? (
                      <motion.span
                        key="start-label"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18, ease: EASE.out }}
                        className="flex items-center justify-center gap-2"
                      >
                        START <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="start-squares"
                        initial={false}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.1, ease: EASE.out }}
                        className="flex w-full items-center justify-between"
                        aria-hidden
                        style={{
                          paddingInline: Math.max(12, Math.round(squareMetrics.gap * 0.8)),
                          gap: squareMetrics.gap,
                        }}
                      >
                        {[0, 1, 2, 3].map((i) => (
                          <motion.span
                            key={i}
                            className="bg-white rounded-md transform-gpu"
                            style={{
                              width: squareMetrics.size,
                              height: squareMetrics.size,
                              willChange: "transform, opacity",
                            }}
                            initial={{ y: 12, opacity: 0, rotate: 0 }}
                            animate={{
                              y: [12, -16, 0],
                              rotate: [0, 180],
                              opacity: [0, 1, 1, 1],
                            }}
                            transition={{
                              duration: 0.34,
                              delay: i * 0.055,
                              ease: EASE.out,
                              times: [0, 0.55, 1],
                            }}
                          />
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const RainbowMenuSlide = ({
  active,
  onNavigate,
  lockedFillId,
}: {
  active: boolean;
  onNavigate: (id: string) => void;
  lockedFillId: string | null;
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [playLabels, setPlayLabels] = useState(false);
  const gridPhase = useGridPhase();

  useEffect(() => {
    if (!active) {
      setPlayLabels(false);
      return;
    }
    const t = window.setTimeout(() => setPlayLabels(true), 40);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <section
      id="menu"
      className={`relative h-screen bg-black text-white flex items-center justify-center p-6 md:p-10 overflow-hidden ${SLIDE}`}
      aria-label="Menu"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{ ...gridOverlayStyle, backgroundPosition: `${gridPhase}px ${gridPhase}px` }}
      />
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-heading text-sm tracking-[0.22em] uppercase text-zinc-400 mb-2">Navigation</p>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight leading-none">MENU</h2>
          </div>
        </div>

        <div className="flex flex-col">
          {NAV_ITEMS.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              onFocus={() => setHoveredId(item.id)}
              onBlur={() => setHoveredId(null)}
              className="group relative w-full text-left py-4 md:py-4 border-b border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-inset"
              whileTap={TAP}
              transition={SPRING.ui}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="font-mono text-xs text-zinc-500 tabular-nums w-8 md:w-10 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <FillIcon
                    icon={item.icon}
                    filledIcon={item.id === "profile" ? UserFilledIcon : undefined}
                    forceFilled={lockedFillId === item.id || hoveredId === item.id}
                    className="w-5 h-5 md:w-6 md:h-6 text-white shrink-0 ml-3 md:ml-4"
                    strokeWidth={2.5}
                  />
                  <motion.span
                    className="font-display text-lg md:text-xl tracking-[0.12em] uppercase text-white pl-3 md:pl-4 block"
                    animate={{ x: hoveredId === item.id ? 6 : 0 }}
                    transition={CMD_HOVER}
                  >
                    <WordsPullUp
                      text={item.label}
                      stagger={0.03}
                      delay={0.05}
                      y={12}
                      play={playLabels}
                    />
                  </motion.span>
                </div>
              </div>
              <motion.span
                aria-hidden
                className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left ${item.color}`}
                initial={false}
                animate={{ scaleX: hoveredId === item.id ? 1 : 0 }}
                transition={CMD_HOVER}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

const SideNavOverlay = ({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.nav
            aria-label="Navigation"
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-black border-l-4 border-white/20 p-6 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SPRING.panel}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">Menu</p>
                <p className="font-display text-3xl tracking-[0.14em] uppercase leading-none">Navigate</p>
              </div>
              <motion.div whileTap={TAP} transition={SPRING.ui}>
                <Button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="h-12 w-12 rounded-full bg-white text-black hover:bg-black hover:text-white border-2 border-black p-0"
                >
                  <X size={22} aria-hidden />
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-col">
              {NAV_ITEMS.map((item, idx) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  onHoverStart={() => setHoveredId(item.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(item.id)}
                  onBlur={() => setHoveredId(null)}
                  className="group relative w-full text-left py-4 border-b border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-inset"
                  whileTap={TAP}
                  transition={SPRING.ui}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="font-mono text-xs text-zinc-500 tabular-nums w-8 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <FillIcon
                        icon={item.icon}
                        filledIcon={item.id === "profile" ? UserFilledIcon : undefined}
                        forceFilled={hoveredId === item.id}
                        className="w-5 h-5 text-white shrink-0 ml-3"
                        strokeWidth={2.5}
                      />
                      <motion.span
                        className="font-display text-base tracking-[0.12em] uppercase text-white pl-3 block"
                        animate={{ x: hoveredId === item.id ? 6 : 0 }}
                        transition={CMD_HOVER}
                      >
                        <WordsPullUp
                          text={item.label}
                          stagger={0.03}
                          delay={0.05}
                          y={12}
                          play={open}
                        />
                      </motion.span>
                    </div>
                  </div>
                  <motion.span
                    aria-hidden
                    className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left ${item.color}`}
                    initial={false}
                    animate={{ scaleX: hoveredId === item.id ? 1 : 0 }}
                    transition={CMD_HOVER}
                  />
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
                  Contact
                </span>
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  Esc to close
                </span>
              </div>

              <div className="flex items-center gap-3">
                <motion.a
                  href="mailto:robbie@example.com"
                  aria-label="Email"
                  whileHover={{ y: -3 }}
                  className="bg-zinc-900/80 p-3 rounded-full text-zinc-300 transition-colors border border-white/10 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Mail size={18} aria-hidden />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/robbie-mclaughlin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  whileHover={{ y: -3 }}
                  className="bg-zinc-900/80 p-3 rounded-full text-zinc-300 transition-colors border border-white/10 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Linkedin size={18} aria-hidden />
                </motion.a>
                <motion.a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  whileHover={{ y: -3 }}
                  className="bg-zinc-900/80 p-3 rounded-full text-zinc-300 transition-colors border border-white/10 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Instagram size={18} aria-hidden />
                </motion.a>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

// --- PROFILE (About) ---
const SectionGridOverlay = () => {
  const phase = useGridPhase();
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
      style={{ ...gridOverlayStyle, backgroundPosition: `${phase}px ${phase}px` }}
      aria-hidden
    />
  );
};

const PhantomProfile = () => {
  return (
    <section id="profile" className={`relative py-16 md:py-20 pb-12 bg-black text-white scroll-mt-6 ${SLIDE}`}>
      <SectionGridOverlay />
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center lg:items-start">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full lg:w-1/2"
          >
             <SectionHeader title="PROFESSIONAL PROFILE" subtitle="SUMMARY" color="text-white" showBar={false} compact />
             
             <div className="relative">
                <div className="absolute -left-4 top-4 w-full h-full bg-white/5 border border-white/10"></div>
                <div className="relative bg-white/5 border-l-8 border-red-600 p-6 md:p-7 shadow-xl p5-shadow">
                  <p className="font-body text-lg md:text-xl leading-relaxed text-zinc-100 font-medium mb-4">
                    Communications-focused writer and digital media coordinator with a proven track record in interactive content creation and community management.
                  </p>
                  <p className="font-body text-base md:text-lg text-zinc-300 leading-relaxed mb-6">
                    Expert in blending creative storytelling with analytical strategy to drive engagement. Demonstrated reliability and leadership in high-pressure service environments.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Badge icon={GraduationCap} label="B.A. Writing" sub="University of Victoria" />
                    <Badge icon={Trophy} label="Distinction" sub="Top Academic Performance" highlight />
                  </div>
                </div>
             </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full lg:w-1/2 flex justify-center mt-6 lg:mt-0"
          >
            {/* Avatar Placeholder Icon */}
            <TiltCard className="w-full max-w-sm md:max-w-md">
              <div className="relative aspect-square bg-zinc-950 border-4 border-white/15 overflow-hidden shadow-[12px_12px_0px_0px_rgba(255,255,255,0.06)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-zinc-400">
                  <div className="rounded-full border-4 border-white/20 bg-black/40 p-4 shadow-md">
                    <User size={72} />
                  </div>
                  <span className="font-heading text-sm tracking-[0.2em] uppercase">
                    Profile Placeholder
                  </span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Badge = ({ icon: Icon, label, sub, highlight = false }: { icon: LucideIcon; label: string; sub: string; highlight?: boolean }) => (
  <div
    className={`flex items-center gap-3 p-3 border-2 shadow-md ${
      highlight
        ? 'bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border-amber-500 text-black shadow-lg'
        : 'bg-white border-black text-black'
    }`}
  >
    <Icon size={24} strokeWidth={2.5} />
    <div>
      <div className="font-heading leading-none text-lg">{label}</div>
      <div className="font-mono text-xs opacity-80">{sub}</div>
    </div>
  </div>
);

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center group border-b border-zinc-800 pb-2 last:border-0">
    <span className="text-zinc-400 group-hover:text-white transition-colors">{label}</span>
    <span className="text-cyan-400 uppercase">{value}</span>
  </div>
);

// --- PROJECTS (stacked cards, all visible and selectable) ---
const PROJECT_CARDS = [
  { id: "project-1", label: "Project 1" },
  { id: "project-2", label: "Project 2" },
  { id: "project-3", label: "Project 3" },
];

const cardEase = [0.25, 0.46, 0.45, 0.94] as const;

const ProjectsStack = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <div className="flex justify-center items-center py-8 overflow-x-auto overflow-y-hidden">
    <div className="flex items-end justify-center gap-8 md:gap-12">
      {PROJECT_CARDS.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: cardEase, delay: index * 0.1 }}
        >
          <motion.button
            type="button"
            onClick={() => onSelect(card.id)}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.25, ease: cardEase }}
            className="flex-shrink-0 w-[180px] md:w-[220px] h-[240px] md:h-[280px] rounded-xl bg-zinc-800/70 border-2 border-white/15 flex items-center justify-center shadow-xl hover:border-yellow-400/50 hover:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black relative"
          >
            <span className="font-heading text-sm md:text-base text-zinc-400 tracking-[0.14em] uppercase px-4">
              {card.label}
            </span>
          </motion.button>
        </motion.div>
      ))}
    </div>
  </div>
);

const ProjectDetailSlide = ({
  id,
  title,
  onBack,
}: {
  id: string;
  title: string;
  onBack: () => void;
}) => (
  <section id={id} className={`relative py-16 md:py-20 pb-12 bg-black text-white scroll-mt-6 ${SLIDE}`}>
    <SectionGridOverlay />
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Back to Projects
        </Button>
        <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-8">{title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-zinc-800/60 border border-white/10 p-6 min-h-[200px] flex items-center justify-center">
            <p className="text-zinc-500 text-sm">Project details coming soon</p>
          </div>
          <div className="rounded-xl bg-zinc-800/60 border border-white/10 p-6 min-h-[200px] flex items-center justify-center">
            <p className="text-zinc-500 text-sm">Additional content placeholder</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PalaceProjects = ({ onSelectProject }: { onSelectProject: (id: string) => void }) => (
  <section id="projects" className={`relative flex flex-col justify-center py-16 md:py-20 bg-black text-white scroll-mt-6 ${SLIDE}`}>
    <SectionGridOverlay />
    <div className="container mx-auto px-6 relative z-10">
      <SectionHeader title="SELECTED WORK" subtitle="PROJECTS" align="center" showBar={false} compact />
      <ProjectsStack onSelect={onSelectProject} />
    </div>
  </section>
);

const ProjectPoint = ({ text }: { text: string }) => (
  <div className="flex items-start">
    <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0 fill-current" />
    <span className="font-body text-base md:text-lg text-zinc-300 leading-relaxed">{text}</span>
  </div>
);

// --- EXPERIENCE ---
const ConfidantExperience = () => {
  return (
    <section id="experience" className={`relative flex flex-col justify-center py-16 md:py-20 bg-black text-white scroll-mt-6 ${SLIDE}`}>
       <SectionGridOverlay />
       <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.2 }}
           transition={{ duration: 0.55, ease: cardEase, delay: 0 }}
         >
           <SectionHeader title="PROFESSIONAL EXPERIENCE" subtitle="CAREER HISTORY" color="text-white" align="center" showBar={false} />
         </motion.div>
         
         <div className="max-w-4xl w-full mx-auto mt-12 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.55, ease: cardEase, delay: 0.1 }}
                className="rounded-xl bg-zinc-800/60 border border-white/10 p-8 min-h-[200px] w-full max-w-2xl flex items-center justify-center"
              >
                <p className="text-zinc-500 text-sm">Experience details coming soon</p>
              </motion.div>
         </div>
       </div>
    </section>
  );
};

// --- INVOLVEMENT ---
const SocialLink = () => {
  return (
    <section id="social" className={`relative flex flex-col justify-center py-16 md:py-20 bg-black text-white scroll-mt-6 ${SLIDE}`}>
      <SectionGridOverlay />
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: cardEase, delay: 0 }}
          className="flex flex-col md:flex-row items-center gap-8 mb-12"
        >
           <h2 className="text-5xl md:text-7xl font-display text-white relative z-10">
             INVOLVEMENT
           </h2>
           <motion.div
             whileHover={HOVER}
             transition={SPRING.ui}
             className="bg-pink-500 text-white p-4 rounded-full border-4 border-white shadow-xl"
           >
             <Heart size={32} fill="white" />
           </motion.div>
        </motion.div>
        
        <div className="max-w-4xl w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, ease: cardEase, delay: 0.1 }}
            className="rounded-xl bg-zinc-800/60 border border-white/10 p-8 min-h-[200px] w-full max-w-2xl flex items-center justify-center"
          >
            <p className="text-zinc-500 text-sm">Involvement details coming soon</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- SKILL ARSENAL: Iconographic microchip activation system ---
type SkillSubPanel = { title: string; titleCase: string; subtitle: string; items: string[] };

const SKILLS_MAJOR_CATEGORIES: {
  id: "core" | "tools";
  label: string;
  panels: SkillSubPanel[];
}[] = [
  {
    id: "core",
    label: "CORE COMPETENCIES",
    panels: [
      { title: "WRITING & NARRATIVE", titleCase: "Writing & Narrative", subtitle: "Core Competency", items: ["Content Writing", "Content Editing", "Proof reading", "Storytelling", "Narrative Development"] },
      { title: "DIGITAL & VISUAL MEDIA", titleCase: "Digital & Visual Media", subtitle: "Core Competency", items: ["Digital Media Coordination", "Social Media Operations", "Audience Engagement", "Visual Communication", "Content Production"] },
      { title: "PROFESSIONAL PRACTICES", titleCase: "Professional Practices", subtitle: "Professional Discipline", items: ["Research", "Fact-Checking", "Time Management", "Team Collaboration", "Independent Work"] },
    ],
  },
  {
    id: "tools",
    label: "TOOLS & TECHNOLOGIES",
    panels: [
      { title: "DESIGN & PRODUCTIVITY", titleCase: "Design & Productivity", subtitle: "Tools & Technologies", items: ["Microsoft Office 365", "Adobe Creative Suite", "Canva", "Procreate", "Clip Studio Pro"] },
      { title: "VIDEO & WRITING", titleCase: "Video & Writing", subtitle: "Production Tools", items: ["DaVinci Resolve", "CapCut", "Final Draft", "Arc Studio"] },
      { title: "SOCIAL PLATFORMS", titleCase: "Social Platforms", subtitle: "Distribution Platforms", items: ["Hootsuite", "TikTok Creator Tools", "Instagram Reels", "YouTube Shorts"] },
    ],
  },
];

// ─── SKILLS SYSTEM CONSTANTS ────────────────────────────────────────────────
const BRANCH_DRAW_MS = 0.32;
const BRANCH_EASE: [number, number, number, number] = [0.4, 0, 0.6, 1];
const SKILLS_DEFAULT_OPACITY = 0.28;
const BACK_MS = 300;
const SLIDE_OFFSET_PX = 280;
const NODE_R = 2.5;
const STROKE_CLR = "rgba(255,255,255,0.5)";
// GRID_CELL_SIZE is already defined globally (line 60)

// ─── CHIP ICON ──────────────────────────────────────────────────────────────
const ChipIcon = ({ size = 104, className = "" }: { size?: number; className?: string }) => {
  const PIN_COUNT = 6;
  const PIN_LEN = 8;
  const BODY_INSET = PIN_LEN;
  const bodySize = size - BODY_INSET * 2;
  const pinStep = bodySize / (PIN_COUNT + 1);
  const GRID = 4;
  const cellW = bodySize / (GRID + 1);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} width={size} height={size} aria-hidden>
      {/* Internal grid — subtle, aligned */}
      <g opacity={0.1}>
        {Array.from({ length: GRID }).map((_, r) =>
          Array.from({ length: GRID }).map((_, c) => (
            <rect
              key={`g${r}${c}`}
              x={BODY_INSET + cellW * 0.5 + c * cellW}
              y={BODY_INSET + cellW * 0.5 + r * cellW}
              width={cellW * 0.5}
              height={cellW * 0.5}
              fill="white"
            />
          ))
        )}
      </g>
      {/* Chip body — increased contrast */}
      <rect
        x={BODY_INSET}
        y={BODY_INSET}
        width={bodySize}
        height={bodySize}
        fill="none"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1"
      />
      {/* Pins — all four sides, evenly spaced, consistent 1px, precise */}
      {Array.from({ length: PIN_COUNT }).map((_, i) => {
        const offset = BODY_INSET + pinStep * (i + 1);
        return (
          <React.Fragment key={`pin-${i}`}>
            <line x1={offset} y1={BODY_INSET} x2={offset} y2={0} stroke={STROKE_CLR} strokeWidth="1" strokeLinecap="square" />
            <line x1={offset} y1={size - BODY_INSET} x2={offset} y2={size} stroke={STROKE_CLR} strokeWidth="1" strokeLinecap="square" />
            <line x1={BODY_INSET} y1={offset} x2={0} y2={offset} stroke={STROKE_CLR} strokeWidth="1" strokeLinecap="square" />
            <line x1={size - BODY_INSET} y1={offset} x2={size} y2={offset} stroke={STROKE_CLR} strokeWidth="1" strokeLinecap="square" />
          </React.Fragment>
        );
      })}
    </svg>
  );
};

// ─── BRANCH DIAGRAM ─────────────────────────────────────────────────────────
// Calculates paths from actual DOM positions using refs, but enforces
// a calm, symmetrical tree (chip → junction → 3 cards).
const BranchDiagram = ({
  chipRef,
  titleRef,
  cardRefs,
  containerRef,
  focusedIndex = null,
  reverse = false,
}: {
  chipRef: React.RefObject<HTMLDivElement>;
  titleRef: React.RefObject<HTMLSpanElement>;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement>;
  focusedIndex?: number | null;
  reverse?: boolean;
}) => {
  type Segment = { x1: number; y1: number; x2: number; y2: number };

  const [trunkSegments, setTrunkSegments] = useState<Segment[]>([]);
  const [branchSegments, setBranchSegments] = useState<Segment[]>([]);
  const [nodes, setNodes] = useState<[number, number][]>([]);
  const dashOffset = useMotionValue(0);

  const calculate = useCallback(() => {
    if (!chipRef.current || !titleRef.current || !containerRef.current) return;
    if (cardRefs.current.length < 3) return;
    if (!cardRefs.current[0] || !cardRefs.current[1] || !cardRefs.current[2]) return;

    const container = containerRef.current.getBoundingClientRect();
    const chip = chipRef.current.getBoundingClientRect();
    const title = titleRef.current.getBoundingClientRect();
    const cards = cardRefs.current.map((card) => card?.getBoundingClientRect()).filter(Boolean) as DOMRect[];

    const cx = chip.left + chip.width / 2 - container.left;
    const chipBottomY = chip.bottom - container.top;

    const titleTopY = title.top - container.top;
    const titleBottomY = title.bottom - container.top;

    const junctionX = cx;
    const junctionY = titleBottomY + GRID_CELL_SIZE; // 1 grid cell below title

    const cardCenters = cards.map((card) => ({
      x: card.left + card.width / 2 - container.left,
      y: card.top - container.top,
    }));

    // Trunk: chip → title top, title bottom → junction
    const newTrunk: Segment[] = [
      { x1: cx, y1: chipBottomY, x2: cx, y2: titleTopY },
      { x1: cx, y1: titleBottomY, x2: junctionX, y2: junctionY },
    ];

    // Branches: junction → each card center
    const newBranches: Segment[] = cardCenters.map((pt) => ({
      x1: junctionX,
      y1: junctionY,
      x2: pt.x,
      y2: pt.y,
    }));

    const newNodes: [number, number][] = [
      [cx, chipBottomY],
      [cx, titleTopY],
      [cx, titleBottomY],
      [junctionX, junctionY],
      ...cardCenters.map((pt) => [pt.x, pt.y] as [number, number]),
    ];

    setTrunkSegments(newTrunk);
    setBranchSegments(newBranches);
    setNodes(newNodes);
  }, [cardRefs, chipRef, containerRef, titleRef]);

  useEffect(() => {
    const timer = window.setTimeout(calculate, 80);
    window.addEventListener("resize", calculate);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", calculate);
    };
  }, [calculate]);

  useEffect(() => {
    if (!reverse && (trunkSegments.length > 0 || branchSegments.length > 0)) {
      const controls = animate(dashOffset, 800, {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      });
      return () => controls.stop();
    }
  }, [reverse, dashOffset, trunkSegments.length, branchSegments.length]);

  const container = containerRef.current?.getBoundingClientRect();
  if (!container) return null;

  const viewBox = `0 0 ${container.width} ${container.height}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Trunk segments: chip → title, title → junction */}
      {trunkSegments.map((seg, idx) => (
        <motion.line
          key={`trunk-${idx}`}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={STROKE_CLR}
          strokeWidth="1"
          strokeLinecap="butt"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: reverse ? 0 : 1 }}
          transition={{ duration: BRANCH_DRAW_MS, ease: BRANCH_EASE, delay: idx * BRANCH_DRAW_MS * 0.35 }}
        />
      ))}

      {/* Branches: junction → cards (de‑emphasize non‑focused when focusedIndex is set) */}
      {branchSegments.map((seg, idx) => {
        const isDimmed = focusedIndex !== null && idx !== focusedIndex;
        return (
          <motion.line
            key={`branch-${idx}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={isDimmed ? "rgba(255,255,255,0.22)" : STROKE_CLR}
            strokeWidth="1"
            strokeLinecap="butt"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: reverse ? 0 : 1 }}
            transition={{
              duration: BRANCH_DRAW_MS,
              ease: BRANCH_EASE,
              delay: BRANCH_DRAW_MS * 0.6,
            }}
          />
        );
      })}

      {/* Subtle current pulse along the main trunk only */}
      {trunkSegments.length > 0 && (
        <motion.line
          x1={trunkSegments[0].x1}
          y1={trunkSegments[0].y1}
          x2={trunkSegments[trunkSegments.length - 1].x2}
          y2={trunkSegments[trunkSegments.length - 1].y2}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1"
          strokeLinecap="butt"
          strokeDasharray="10 28"
          style={{ strokeDashoffset: dashOffset }}
          initial={{ opacity: 0 }}
          animate={{ opacity: reverse ? 0 : 0.75 }}
          transition={{ duration: 0.2, ease: BRANCH_EASE, delay: BRANCH_DRAW_MS }}
        />
      )}

      {/* Node markers */}
      {nodes.map(([cx, cy], idx) => {
        // Last three nodes correspond to the card connection points.
        const isCardNode = idx >= nodes.length - 3;
        const cardIdx = isCardNode ? idx - (nodes.length - 3) : null;
        const isDimmed =
          isCardNode && focusedIndex !== null && cardIdx !== null && cardIdx !== focusedIndex;

        return (
          <motion.circle
            key={`node-${idx}`}
            cx={cx}
            cy={cy}
            r={NODE_R}
            fill="black"
            stroke={isDimmed ? "rgba(255,255,255,0.22)" : STROKE_CLR}
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: reverse ? 0 : 1, opacity: reverse ? 0 : 1 }}
            transition={{
              duration: 0.18,
              ease: BRANCH_EASE,
              delay: BRANCH_DRAW_MS * 0.7 + idx * 0.04,
            }}
          />
        );
      })}
    </svg>
  );
};

// ─── SKILLS MOTION CONSTANTS (P3R / neo-Tokyo: UI 160–260ms, stagger 30–60ms) ──
const SKILLS_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1]; // ease-out
const SKILLS_HOVER_DUR = 0.2;   // ~200ms selection feel (smoother)
const SKILLS_EXPAND_DUR = 0.3;  // panel settle (slightly longer for polish)
const SKILLS_STAGGER = 0.05;    // 50ms per item (more pronounced stagger)
const SKILLS_UNDERLINE_DUR = 0.24;
const SKILLS_HOVER_SHIFT_PX = 8; // Ball travel: increased for more dynamic feel
const SKILLS_CARD_HOVER_SCALE = 1.04; // More pronounced hover scale
const SKILLS_CARD_HOVER_Y = -12; // More lift on hover // Ball travel: slower so it’s readable (was 0.5)

// ─── TEXTURE OVERLAY ─────────────────────────────────────────────────────────
const TextureOverlay = ({ opacity = 0.03 }: { opacity?: number }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
      opacity,
      mixBlendMode: "overlay",
    }}
  />
);

// ─── SKILL CARD DATA ──────────────────────────────────────────────────────────
const SKILLS_DATA = {
  core: {
    title: "CORE COMPETENCIES",
    categories: [
      {
        title: "Writing & Narrative",
        items: [
          "Content Writing",
          "Content Editing",
          "Proof reading",
          "Storytelling",
          "Narrative Development",
        ],
      },
      {
        title: "Digital & Visual Media",
        items: [
          "Digital Media Coordination",
          "Social Media Operations",
          "Audience Engagement",
          "Visual Communication",
          "Content Production",
        ],
      },
      {
        title: "Professional Practices",
        items: [
          "Research",
          "Fact-Checking",
          "Time Management",
          "Team Collaboration",
          "Independent Work",
        ],
      },
    ],
  },
  tools: {
    title: "TOOLS & TECHNOLOGIES",
    categories: [
      {
        title: "Design & Productivity",
        items: [
          "Microsoft Office 365",
          "Adobe Creative Suite",
          "Canva",
          "Procreate",
          "Clip Studio Pro",
        ],
      },
      {
        title: "Video & Writing",
        items: ["DaVinci Resolve", "CapCut", "Final Draft", "Arc Studio"],
      },
      {
        title: "Social Platforms",
        items: [
          "Hootsuite",
          "TikTok Creator Tools",
          "Instagram Reels",
          "YouTube Shorts",
        ],
      },
    ],
  },
};

// Subskill text content (container removed; kept handy — use SKILLS_DATA.core / SKILLS_DATA.tools above)
// Core: Writing & Narrative, Digital & Visual Media, Professional Practices + items each.
// Tools: Design & Productivity, Video & Writing, Social Platforms + items each.

// ─── DIAGONAL CONNECTOR GEOMETRY ─────────────────────────────────────────────
// Single sharp line: origin = midpoint of top card’s right edge, end = midpoint of bottom card’s left edge.
// Cards placed with ~35% diagonal separation; line and node use same 0–100 coordinate system.
const WEBHOOKS_CORE_ACCENT = "#16a34a";
const WEBHOOKS_TOOLS_ACCENT = "#0891b2";
const WEBHOOKS_IDLE_BORDER = "rgba(255,255,255,0.25)";
const DIAGONAL_START = { x: 38, y: 20 };
const DIAGONAL_END   = { x: 62, y: 80 };
const DIAGONAL_MID   = { x: 50, y: 50 };
const SKILLS_CARD_EASE = [0.22, 1, 0.36, 1] as const;
const SKILLS_CARD_DUR = 0.22;

const SkillsWebHooks = ({
  leftLabel,
  rightLabel,
  onClickLeft,
  onClickRight,
  reducedMotion,
}: {
  leftLabel: string;
  rightLabel: string;
  onClickLeft: () => void;
  onClickRight: () => void;
  reducedMotion: boolean;
}) => {
  const [hoverTarget, setHoverTarget] = useState<"left" | "right" | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    if (hoverTarget) setPulseKey((k) => k + 1);
  }, [hoverTarget]);
  const cardDur = reducedMotion ? 0 : SKILLS_CARD_DUR;
  const isActive = hoverTarget !== null;
  const lineStroke =
    hoverTarget === "left"
      ? WEBHOOKS_CORE_ACCENT
      : hoverTarget === "right"
        ? WEBHOOKS_TOOLS_ACCENT
        : WEBHOOKS_IDLE_BORDER;

  return (
    <div
      className="relative w-full max-w-4xl mx-auto aspect-[4/3] max-h-[420px] flex items-center justify-center"
      onMouseLeave={() => setHoverTarget(null)}
    >
      {/* Upper-left card: positioned for right-edge midpoint at (38, 20) in viewBox */}
      <motion.div
        className="absolute left-[8%] top-[8%] w-[30%] min-w-[200px] max-w-[280px]"
        onMouseEnter={() => setHoverTarget("left")}
        animate={{
          y: hoverTarget === "left" ? SKILLS_CARD_HOVER_Y : 0,
          scale: hoverTarget === "left" ? SKILLS_CARD_HOVER_SCALE : 1,
          rotateZ: hoverTarget === "left" ? -1 : 0,
        }}
        transition={{ duration: cardDur, ease: SKILLS_CARD_EASE }}
        style={{ willChange: "transform" }}
      >
        <button
          type="button"
          onClick={onClickLeft}
          className="relative w-full h-[100px] md:h-[116px] rounded-lg overflow-hidden skills-card-diagonal flex items-center justify-center py-6 px-6 text-center transition-shadow duration-300"
          style={{
            boxShadow: hoverTarget === "left" 
              ? "0 12px 24px -8px rgba(22,163,74,0.3), 0 0 0 1px rgba(22,163,74,0.2)" 
              : "none",
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none opacity-0"
            animate={{ opacity: hoverTarget === "left" ? 0.12 : 0 }}
            transition={{ duration: cardDur, ease: SKILLS_CARD_EASE }}
            style={{
              background: "linear-gradient(168deg, rgba(22,163,74,0.2) 0%, transparent 60%)",
              willChange: "opacity",
            }}
          />
          <motion.span 
            className="relative z-10 font-display text-sm md:text-base font-semibold uppercase tracking-[0.1em] text-white"
            animate={{
              scale: hoverTarget === "left" ? 1.05 : 1,
            }}
            transition={{ duration: cardDur * 0.8, ease: SKILLS_CARD_EASE }}
          >
            {leftLabel}
          </motion.span>
        </button>
      </motion.div>

      {/* Lower-right card: positioned for left-edge midpoint at (62, 80) in viewBox */}
      <motion.div
        className="absolute right-[8%] bottom-[8%] w-[30%] min-w-[200px] max-w-[280px]"
        onMouseEnter={() => setHoverTarget("right")}
        animate={{
          y: hoverTarget === "right" ? SKILLS_CARD_HOVER_Y : 0,
          scale: hoverTarget === "right" ? SKILLS_CARD_HOVER_SCALE : 1,
          rotateZ: hoverTarget === "right" ? 1 : 0,
        }}
        transition={{ duration: cardDur, ease: SKILLS_CARD_EASE }}
        style={{ willChange: "transform" }}
      >
        <button
          type="button"
          onClick={onClickRight}
          className="relative w-full h-[100px] md:h-[116px] rounded-lg overflow-hidden skills-card-diagonal flex items-center justify-center py-6 px-6 text-center transition-shadow duration-300"
          style={{
            boxShadow: hoverTarget === "right" 
              ? "0 12px 24px -8px rgba(8,145,178,0.3), 0 0 0 1px rgba(8,145,178,0.2)" 
              : "none",
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none opacity-0"
            animate={{ opacity: hoverTarget === "right" ? 0.12 : 0 }}
            transition={{ duration: cardDur, ease: SKILLS_CARD_EASE }}
            style={{
              background: "linear-gradient(168deg, rgba(8,145,178,0.2) 0%, transparent 60%)",
              willChange: "opacity",
            }}
          />
          <motion.span 
            className="relative z-10 font-display text-sm md:text-base font-semibold uppercase tracking-[0.1em] text-white"
            animate={{
              scale: hoverTarget === "right" ? 1.05 : 1,
            }}
            transition={{ duration: cardDur * 0.8, ease: SKILLS_CARD_EASE }}
          >
            {rightLabel}
          </motion.span>
        </button>
      </motion.div>

      {/* Single connector: origin = top card right-mid, end = bottom card left-mid; 1.5–2px, sharp */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.line
            x1={DIAGONAL_START.x}
            y1={DIAGONAL_START.y}
            x2={DIAGONAL_END.x}
            y2={DIAGONAL_END.y}
            className="skills-connector-line"
            stroke={lineStroke}
            animate={{
              strokeOpacity: isActive ? 0.85 : 0.4,
              strokeWidth: isActive ? 2.5 : 1.5,
            }}
            transition={{
              duration: cardDur,
              ease: SKILLS_CARD_EASE,
            }}
          />
        </svg>
        {/* Node dot at geometric midpoint; pulses once per hover (remount via pulseKey) */}
        <motion.div
          key={pulseKey}
          className={`absolute z-10 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 skills-node-dot ${isActive ? "skills-node-pulse-once" : ""}`}
          style={{
            left: `${DIAGONAL_MID.x}%`,
            top: `${DIAGONAL_MID.y}%`,
          }}
          animate={{
            backgroundColor: isActive ? lineStroke : "rgba(255,255,255,0.4)",
            scale: isActive ? [1, 1.4, 1.2, 1] : 1,
            boxShadow: isActive 
              ? `0 0 12px ${lineStroke}, 0 0 24px ${lineStroke}40` 
              : "none",
          }}
          transition={{
            backgroundColor: { duration: cardDur, ease: SKILLS_CARD_EASE },
            scale: isActive 
              ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: cardDur, ease: SKILLS_CARD_EASE },
            boxShadow: { duration: cardDur, ease: SKILLS_CARD_EASE },
          }}
        />
      </div>
    </div>
  );
};

// ─── SKILLS EXPANDED VIEW (morphed title + panel; no cards, no line/ball) ──────
const SKILLS_VIEW_TRANSITION = { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const };

const SkillsExpandedView = ({
  data,
  expandedId,
  onClose,
  reducedMotion,
}: {
  data: typeof SKILLS_DATA.core;
  expandedId: "core" | "tools";
  onClose: () => void;
  reducedMotion: boolean;
}) => {
  const accent = expandedId === "core" ? WEBHOOKS_CORE_ACCENT : WEBHOOKS_TOOLS_ACCENT;
  const expandDur = reducedMotion ? 0 : SKILLS_EXPAND_DUR;
  const stagger = reducedMotion ? 0 : SKILLS_STAGGER;

  return (
    <motion.div
      key="skills-expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: SKILLS_VIEW_TRANSITION }}
      transition={SKILLS_VIEW_TRANSITION}
      className="w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* Morphed title: card becomes this main title */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: expandDur * 1.2, 
          ease: [0.16, 1, 0.3, 1],
          delay: reducedMotion ? 0 : 0.05,
        }}
        className="w-full flex items-center justify-between gap-4 mb-6"
      >
        <motion.h2
          className="font-display text-2xl md:text-3xl font-semibold uppercase tracking-[0.08em] text-white border-l-4 pl-4"
          style={{ borderLeftColor: accent }}
          initial={{ borderLeftWidth: 0 }}
          animate={{ borderLeftWidth: 4 }}
          transition={{ duration: expandDur * 0.8, delay: expandDur * 0.3 }}
        >
          {data.title}
        </motion.h2>
        <motion.button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg px-3 py-2 transition-colors duration-200"
          aria-label="Back to skills"
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </motion.button>
      </motion.div>

      {/* Subskills panel */}
      <div className="w-full">
        <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {data.categories.map((category, catIdx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: expandDur * 0.9,
                  ease: SKILLS_EASE,
                  delay: stagger * catIdx,
                }}
                className="border-l border-white/10 pl-4"
              >
                <h4 className="font-display text-xs md:text-sm uppercase tracking-[0.06em] text-white/90 mb-2 md:mb-3 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item, itemIdx) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: expandDur * 0.75,
                        ease: SKILLS_EASE,
                        delay: stagger * catIdx + itemIdx * 0.035,
                      }}
                      className="font-mono text-[11px] md:text-xs text-white/75 tracking-tight leading-tight"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── SKILLS EXPANDED PANEL (category list only; used when we need just the panel) ─
const SkillsExpandedPanel = ({
  data,
  reducedMotion,
}: {
  data: typeof SKILLS_DATA.core;
  reducedMotion: boolean;
}) => {
  const expandDur = reducedMotion ? 0 : SKILLS_EXPAND_DUR;
  const stagger = reducedMotion ? 0 : SKILLS_STAGGER;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease: SKILLS_EASE } }}
      transition={{ duration: expandDur, ease: SKILLS_EASE }}
      className="mt-10 w-full max-w-4xl mx-auto"
    >
        <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {data.categories.map((category, catIdx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: expandDur * 0.9,
                  ease: SKILLS_EASE,
                  delay: stagger * catIdx,
                }}
                className="border-l border-white/10 pl-4"
              >
                <h4 className="font-display text-xs md:text-sm uppercase tracking-[0.06em] text-white/90 mb-2 md:mb-3 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item, itemIdx) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: expandDur * 0.75,
                        ease: SKILLS_EASE,
                        delay: stagger * catIdx + itemIdx * 0.035,
                      }}
                      className="font-mono text-[11px] md:text-xs text-white/75 tracking-tight leading-tight"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
  );
};

// ─── SKILL ARSENAL (dual-layer: undercard expands, P3R-style reveal) ─────────────
// P3R motion: UI 160–260ms, ease-out, panel slide + row stagger (30–60ms), y+opacity
const MORPH_DUR = 0.22;
const MORPH_EASE = [0.2, 0.8, 0.2, 1] as const; // P3R ease-out
const P3R_STAGGER_MS = 45; // 30–60ms per row
const PHONE_W = 384;
const PHONE_H = 224;
// Expanded panel (portal): overlay uses flexbox so panel is always centered and correctly sized
const EXPANDED_PANEL_WIDTH = "92vw";
const EXPANDED_PANEL_MAX_W = 1280;
const EXPANDED_OVERLAY_TOP_VH = 12;
const EXPANDED_OVERLAY_BOTTOM_REM = 1.5;

type SkillCardId = "core" | "tools";

const EXPANDED_HEIGHT = "calc(100vh - 14vh - 3rem)";
const Z_ACTIVE_DEFAULT = 10;

/** Expanded skills panel (portal) — kept for reference; skills use in-card expansion. */

const SkillsExpandedPortal = ({
  expandedCard,
  onBack,
  reducedMotion,
}: {
  expandedCard: SkillCardId | null;
  onBack: () => void;
  reducedMotion: boolean;
}) => {
  const data = expandedCard ? SKILLS_DATA[expandedCard] : null;
  const staggerSec = reducedMotion ? 0 : P3R_STAGGER_MS / 1000;

  const overlay = (
    <AnimatePresence mode="wait">
      {expandedCard && data ? (
        <motion.div
          key={expandedCard}
          className="fixed inset-0 z-[45] flex justify-center items-start pointer-events-auto"
          style={{
            paddingTop: `${EXPANDED_OVERLAY_TOP_VH}vh`,
            paddingBottom: `${EXPANDED_OVERLAY_BOTTOM_REM}rem`,
            paddingLeft: "4vw",
            paddingRight: "4vw",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex-1 flex flex-col min-h-0 rounded-[2.5rem_0_2.5rem_0] border-2 border-white/40 overflow-hidden bg-black"
            style={{
              width: EXPANDED_PANEL_WIDTH,
              maxWidth: EXPANDED_PANEL_MAX_W,
            }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: MORPH_EXPAND_DUR, ease: MORPH_EXPAND_EASE }}
          >
          <div className="absolute inset-0 rounded-[inherit] overflow-y-auto border-0" aria-hidden />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onBack(); }}
            className="absolute top-3 right-4 z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white border border-white/20 rounded-lg px-2.5 py-1.5 transition-colors duration-200"
            aria-label="Back to skills"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="relative z-0 pt-12 pb-6 px-6">
            <motion.h3
              className="font-display text-sm font-semibold uppercase tracking-wider text-white/95 mb-4 text-center"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1], delay: reducedMotion ? 0 : 0.12 }}
            >
              {data.title}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
              {data.categories.map((cat, catIdx) => (
                <motion.div
                  key={cat.title}
                  className="border-l border-white/20 pl-4"
                  initial={reducedMotion ? false : { opacity: 0, y: 10, x: -8 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                    delay: reducedMotion ? 0 : 0.18 + staggerSec * (catIdx + 1),
                  }}
                  whileHover={{ x: 4 }}
                >
                  <motion.h4
                    className="font-display text-xs uppercase tracking-wider text-white/90 mb-2 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: reducedMotion ? 0 : 0.18 + staggerSec * (catIdx + 1) + 0.1 }}
                  >
                    {cat.title}
                  </motion.h4>
                  <ul className="space-y-1">
                    {cat.items.map((item, itemIdx) => (
                      <motion.li
                        key={item}
                        className="font-mono text-xs text-white/85"
                        initial={reducedMotion ? false : { opacity: 0, y: 6, x: -4 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{
                          duration: 0.26,
                          ease: [0.16, 1, 0.3, 1],
                          delay: reducedMotion ? 0 : 0.18 + staggerSec * (catIdx + 1) + itemIdx * 0.04 + 0.15,
                        }}
                        whileHover={{ x: 2, opacity: 1 }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
};

/**
 * Skills card: 3D flip in place. Float and hover unchanged.
 * Layers: card-wrapper (perspective) → float-layer (y only) → flip-layer (rotateY only) → front/back faces.
 */
const SkillCardMorph = ({
  data,
  accentClass,
  reducedMotion,
}: {
  data: typeof SKILLS_DATA.core;
  accentClass: string;
  reducedMotion: boolean;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [backFaceRevealed, setBackFaceRevealed] = useState(false);

  return (
    <div
      className="flex flex-col items-center card-wrapper"
      style={{
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: "1.5rem",
        perspective: 1100,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div className="relative flex flex-col overflow-visible" style={{ width: "100%", height: "100%" }}>
        {/* float-layer: floating idle animation only (translateY); preserve-3d so flip-layer stays smooth */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center float-layer"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ y: reducedMotion ? 0 : [0, -8] }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
        >
          {/* flip-layer: rotateY only; explicit origin + translateZ(0) to reduce glitches */}
          <motion.div
            className="flip-layer"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              transformOrigin: "50% 50%",
              backfaceVisibility: "hidden",
            }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              duration: 0.7,
              ease: [0.4, 0, 0.2, 1],
              type: "tween",
            }}
            onAnimationComplete={() => {
              if (isFlipped) setBackFaceRevealed(true);
            }}
          >
            {/* Front face: existing card JSX unchanged */}
            <div
              className="card-face front"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <button
                type="button"
                className="border-0 bg-transparent p-0 cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateY(-30deg) rotateX(15deg)",
                }}
                onClick={() => setIsFlipped((prev) => !prev)}
                aria-label={`Flip card to see ${data.title} details`}
              >
                <div
                  className={`absolute w-96 h-56 rounded-[24px] ${accentClass}`}
                  style={{ transform: "translateZ(-4px) translateY(0)" }}
                  aria-hidden
                />
                <motion.div
                  initial={{ transform: "translateZ(8px) translateY(-2px)" }}
                  whileHover={{
                    transform: "translateZ(40px) translateY(-12px) rotateX(-2deg)",
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-96 h-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white bg-black p-1 pl-[3px] pt-[3px]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative z-0 h-full w-full overflow-hidden rounded-[20px] bg-black flex items-center justify-center p-3">
                    <h3 className="font-display text-base font-semibold uppercase tracking-wider text-white text-center leading-tight max-w-full font-normal not-italic">
                      {data.title}
                    </h3>
                  </div>
                </motion.div>
              </button>
            </div>
            {/* Back face: rotateY(180deg) + translateZ(-1px) to avoid z-fighting at 90deg */}
            <div
              className="card-face back"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg) translateZ(-1px)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center rounded-[inherit]">
                <div
                  className="relative w-96 h-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white bg-black p-1 pl-[3px] pt-[3px] overflow-y-auto no-scrollbar"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative z-0 h-full w-full rounded-[20px] bg-black p-4 flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFlipped(false);
                        setBackFaceRevealed(false);
                      }}
                      className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white border border-white/20 rounded-lg px-2.5 py-1.5 transition-colors duration-200 self-end mb-3"
                      aria-label="Flip card back"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/95 mb-3 text-center">
                      {data.title}
                    </h3>
                    {/* Subskill content fades in only after flip animation completes */}
                    <motion.div
                      className="grid grid-cols-1 gap-3 text-left"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: backFaceRevealed ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {data.categories.map((cat) => (
                        <div key={cat.title} className="border-l border-white/20 pl-3">
                          <h4 className="font-display text-xs uppercase tracking-wider text-white/90 mb-1 font-semibold">
                            {cat.title}
                          </h4>
                          <ul className="space-y-0.5">
                            {cat.items.map((item) => (
                              <li key={item} className="font-mono text-xs text-white/85">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const SkillArsenal = () => {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <section
        id="skills"
        className={`relative flex flex-col bg-black text-white scroll-mt-6 min-h-screen py-16 md:py-20 ${SLIDE}`}
      >
        <SectionGridOverlay />
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center flex-1 min-h-0 justify-center">
          <SectionHeader title="SKILLS" align="center" showBar={false} compact />
          <div className="relative w-full mx-auto mt-10 md:mt-14 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-4xl">
            <SkillCardMorph
              data={SKILLS_DATA.core}
              accentClass="bg-emerald-500"
              reducedMotion={!!reducedMotion}
            />
            <SkillCardMorph
              data={SKILLS_DATA.tools}
              accentClass="bg-cyan-500"
              reducedMotion={!!reducedMotion}
            />
          </div>
        </div>
      </section>
    </>
  );
};

// --- RESUME COMPONENT ---
const ResumeView = () => {
  return (
    <div className="bg-white min-h-screen text-black font-sans p-8 md:p-16 max-w-5xl mx-auto selection:bg-gray-200 selection:text-black">
      {/* Header */}
      <header className="border-b-2 border-black pb-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">Robbie McLaughlin</h1>
        <p className="text-xl text-gray-700 mb-4">Writer • Digital Media Coordinator • Content Creator</p>
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <a href="mailto:robbie@example.com" className="flex items-center gap-2 hover:underline">
            <Mail size={16} /> robbie@example.com
          </a>
          <span className="flex items-center gap-2">
            <Linkedin size={16} /> <a href="https://linkedin.com/in/robbie-mclaughlin" className="hover:underline">linkedin.com/in/robbie-mclaughlin</a>
          </span>
          <span className="flex items-center gap-2">
            <GraduationCap size={16} /> B.A. Writing, University of Victoria (Distinction)
          </span>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Professional Profile</h2>
        <p className="leading-relaxed text-gray-800">
          Communications-focused writer and digital media coordinator with a proven track record in interactive content creation and community management. Expert in blending creative storytelling with analytical strategy to drive engagement. Demonstrated reliability and leadership in high-pressure service environments.
        </p>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Skills & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div>
            <h4 className="font-bold mb-2">Core Competencies</h4>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Content Editing & Production</li>
              <li>Social Media Operations</li>
              <li>Community Management</li>
              <li>Digital Strategy & Analytics</li>
              <li>Creative Writing & Storytelling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Technical Proficiency</h4>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Adobe Creative Suite</li>
              <li>DaVinci Resolve</li>
              <li>CapCut</li>
              <li>Hootsuite</li>
              <li>Canva</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Experience</h2>
        
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-bold">Starbucks</h3>
            <span className="text-gray-600 font-medium">2018 — Present</span>
          </div>
          <p className="italic text-gray-700 mb-3">Barista & Team Member</p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-800">
            <li>Consistently recognized for "Rank 10" reliability and teamwork in a high-volume, high-pressure environment.</li>
            <li>Demonstrated strong communication skills and adaptability during peak service hours.</li>
            <li>Maintained high standards of customer service and product quality.</li>
          </ul>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Projects</h2>
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-bold">RAWBLEM</h3>
            <span className="text-gray-600 font-medium">Independent Digital Content & Interactive Media</span>
          </div>
          <p className="italic text-gray-700 mb-3">TikTok-focused interactive content project</p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-800">
            <li>Produced high-engagement TikTok interactive content focusing on narrative storytelling.</li>
            <li>Scripted, filmed, and edited short-form videos using CapCut and DaVinci Resolve.</li>
            <li>Analyzed engagement metrics (views, retention, shares) to iterate on content strategy and optimize for platform algorithms.</li>
          </ul>
        </div>
      </section>

      {/* Involvement */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Involvement</h2>
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-bold">University of Victoria E-Sports Community</h3>
            <span className="text-gray-600 font-medium">Volunteer</span>
          </div>
          <p className="italic text-gray-700 mb-3">Social Media Coordinator</p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-800">
            <li>Managed social media channels to increase community engagement and event attendance.</li>
            <li>Created and edited digital content for promotional campaigns.</li>
            <li>Facilitated communication between players, organizers, and the broader university community.</li>
          </ul>
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Education</h2>
        <div>
          <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-bold">University of Victoria</h3>
            <span className="text-gray-600 font-medium">Distinction</span>
          </div>
          <p className="italic text-gray-700">Bachelor of Arts in Writing</p>
        </div>
      </section>
      
      <footer className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-200">
        <p>Portfolio available at: [Portfolio URL]</p>
      </footer>
    </div>
  );
};

export default function Home() {
  const [isResumeMode, setIsResumeMode] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<string | "menu" | null>(null);
  const [menuPanelAtRight, setMenuPanelAtRight] = useState(false);
  const reduceMotion = useReducedMotion();
  const heroInViewRef = useRef<HTMLDivElement | null>(null);
  const isHeroInView = useInView(heroInViewRef, { margin: "-100px 0px 0px 0px" });
  const slidesRef = useRef<HTMLDivElement | null>(null);
  const slideOrder = ["hero", "menu"];
  const [currentSlideId, setCurrentSlideId] = useState<string>("hero");
  const [menuLockedFillId, setMenuLockedFillId] = useState<string | null>(null);
  const prevSlideIdRef = useRef<string>("hero");
  const transitionTimeoutsRef = useRef<number[]>([]);

  // Single global grid phase so all grid overlays stay in sync (no jolt on panel transition)
  const [gridPhase, setGridPhase] = useState(0);
  useEffect(() => {
    const tick = () => setGridPhase(((performance.now() / 1000) * (GRID_CELL_SIZE / GRID_DRIFT_DURATION)) % GRID_CELL_SIZE);
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, []);

  const handleStart = () => {
    scrollToId("menu", reduceMotion ? "auto" : "smooth");
  };

  const navigateTo = (id: string) => {
    setIsSideNavOpen(false);
    if (isTransitioning) return;

    if (reduceMotion) {
      setCurrentSection(id === "menu" ? null : id);
      return;
    }

    transitionTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
    transitionTimeoutsRef.current = [];

    if (id === "menu") {
      setMenuPanelAtRight(true);
      const raf = requestAnimationFrame(() => {
        setTransitionTarget("menu");
        setIsTransitioning(true);
        setMenuPanelAtRight(false);
      });
      transitionTimeoutsRef.current.push(
        window.setTimeout(() => {
          setCurrentSection(null);
          setIsTransitioning(false);
          setTransitionTarget(null);
        }, PANEL_TRANSITION.duration * 1000)
      );
    } else {
      setCurrentSection(id);
      setTransitionTarget(id);
      setIsTransitioning(true);
      transitionTimeoutsRef.current.push(
        window.setTimeout(() => {
          setIsTransitioning(false);
          setTransitionTarget(null);
        }, PANEL_TRANSITION.duration * 1000)
      );
    }
  };

  useEffect(() => {
    return () => transitionTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const prev = prevSlideIdRef.current;
    if (prev !== "menu" && currentSlideId === "menu") {
      setMenuLockedFillId(null);
    }
    prevSlideIdRef.current = currentSlideId;
  }, [currentSlideId]);

  const navigateFromMenu = (id: string) => {
    setMenuLockedFillId(id);
    navigateTo(id);
  };

  useEffect(() => {
    if (isResumeMode) return;
    const root = slidesRef.current;
    if (!root) return;

    const elements = slideOrder
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        const id = best?.target?.id;
        if (id) setCurrentSlideId(id);
      },
      { root, threshold: [0.45, 0.6, 0.75, 0.9] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isResumeMode, slideOrder]);

  return (
    <GridPhaseContext.Provider value={gridPhase}>
    <div
      className={`selection:bg-cyan-500 selection:text-white transition-colors duration-500 ${
        isResumeMode ? "min-h-screen overflow-x-hidden bg-white" : "h-screen w-screen overflow-hidden"
      }`}
      style={!isResumeMode ? { backgroundColor: "#0a0a0a", backgroundImage: "none" } : undefined}
    >
      {/* Top-right controls (Resume + Hamburger) */}
      <motion.div
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
        initial={false}
        animate={{
          opacity: isResumeMode ? 1 : 1,
          y: 0,
          scale: 1,
        }}
        transition={SPRING.ui}
      >
        {!isResumeMode && (currentSlideId !== "menu" || currentSection !== null) && (
          <motion.div whileTap={TAP} transition={SPRING.ui}>
            <Button
              type="button"
              onClick={() => setIsSideNavOpen(true)}
              aria-label="Open navigation menu"
              className="h-16 w-16 rounded-full bg-white text-black hover:bg-black hover:text-white border-4 border-black p-0 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Menu size={26} aria-hidden />
            </Button>
          </motion.div>
        )}

        <motion.div
          layoutId="resume-button"
          whileTap={TAP}
          transition={SPRING.ui}
        >
          <Button 
            onClick={() => setIsResumeMode(!isResumeMode)}
            size="lg"
            aria-label={isResumeMode ? "Exit resume mode" : "Enter resume mode"}
            className={`shadow-xl border-4 transition-colors duration-200 font-display text-xl uppercase tracking-widest rounded-full h-16 w-16 p-0 flex items-center justify-center ${
              isResumeMode 
                ? "bg-black text-white border-white hover:bg-zinc-800" 
                : "bg-white text-black border-black hover:bg-black hover:text-white"
            }`}
          >
            {isResumeMode ? <Zap size={24} /> : <FileText size={24} />}
          </Button>
        </motion.div>
      </motion.div>

      {!isResumeMode && (
        <SideNavOverlay
          open={isSideNavOpen}
          onClose={() => setIsSideNavOpen(false)}
          onNavigate={navigateFromMenu}
        />
      )}

      {/* Back to menu — above panels so it stays clickable when viewing a section */}
      {!isResumeMode && (
        <BackToMenuButton
          show={currentSection !== null}
          onBack={() => navigateTo("menu")}
        />
      )}

      {/* Interaction lock during panel transition */}
      {!isResumeMode && isTransitioning && (
        <div className="fixed inset-0 z-[70] pointer-events-auto" aria-hidden />
      )}

      {isResumeMode ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <ResumeView />
        </motion.div>
      ) : (
        <>
          <motion.div
            className="fixed inset-0 no-scrollbar"
            style={{
              zIndex:
                transitionTarget === "menu"
                  ? 30
                  : currentSection === null && !transitionTarget
                    ? 40
                    : 30,
              pointerEvents: currentSection && transitionTarget !== "menu" ? "none" : "auto",
              backgroundColor: "#0a0a0a",
              boxShadow:
                !reduceMotion && (currentSection || transitionTarget) && transitionTarget !== "menu"
                  ? "inset -16px 0 24px rgba(0,0,0,0.4)"
                  : "none",
            }}
            animate={{
              opacity: reduceMotion
                ? currentSection
                  ? 0
                  : 1
                : menuPanelAtRight
                  ? 1
                  : transitionTarget === "menu"
                    ? 1
                    : (currentSection || transitionTarget)
                      ? 0.65
                      : 1,
              x: reduceMotion
                ? "0%"
                : menuPanelAtRight
                  ? "100%"
                  : transitionTarget === "menu"
                    ? "0%"
                    : (currentSection || transitionTarget)
                      ? "-4%"
                      : "0%",
            }}
            transition={{
              duration: reduceMotion
                ? 0.2
                : transitionTarget === "menu"
                  ? 0
                  : menuPanelAtRight
                    ? 0
                    : PANEL_TRANSITION.duration,
              ease: PANEL_TRANSITION.ease,
            }}
          >
            <div
              ref={slidesRef}
              tabIndex={0}
              aria-label="Portfolio slideshow"
              className="no-scrollbar flex h-screen w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth focus:outline-none"
              style={{ backgroundColor: "transparent", backgroundImage: "none" }}
              onKeyDown={(e) => {
              if (!slidesRef.current) return;
              if (e.key === "ArrowRight") {
                e.preventDefault();
                slidesRef.current.scrollBy({ left: window.innerWidth, behavior: "smooth" });
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                slidesRef.current.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
              }
              if (e.key === "Home") {
                e.preventDefault();
                scrollToId("hero");
              }
              if (e.key === "End") {
                e.preventDefault();
                if (currentSection) navigateTo("menu");
                else scrollToId("menu");
              }
            }}
          >
            <Hero 
              onStart={handleStart}
              isResumeMode={isResumeMode}
              toggleResumeMode={() => setIsResumeMode(!isResumeMode)}
              heroInViewRef={heroInViewRef}
              active={currentSlideId === "hero"}
            />
            <RainbowMenuSlide
              active={currentSlideId === "menu"}
              onNavigate={navigateFromMenu}
              lockedFillId={menuLockedFillId}
            />
          </div>
          </motion.div>

          {/* Section panel: layered black, accent edge when incoming, content settle */}
          {currentSection && (
            <motion.div
              className="fixed inset-0 overflow-y-auto overflow-x-hidden no-scrollbar"
              style={{
                backgroundColor: "#000",
                zIndex: currentSection ? 40 : 30,
                pointerEvents: transitionTarget === "menu" ? "none" : "auto",
                boxShadow:
                  currentSection && transitionTarget !== "menu"
                    ? "-6px 0 20px rgba(0,0,0,0.25)"
                    : transitionTarget === "menu"
                      ? "inset -16px 0 24px rgba(0,0,0,0.4)"
                      : "none",
              }}
              aria-label={`Section: ${currentSection}`}
              initial={
                !reduceMotion && transitionTarget && transitionTarget !== "menu"
                  ? { opacity: 0.95, x: "100%", clipPath: "inset(0 100% 0 0)" }
                  : false
              }
              animate={{
                opacity: reduceMotion ? 1 : 1,
                x: reduceMotion ? "0%" : "0%",
                clipPath:
                  reduceMotion
                    ? "inset(0 0 0 0)"
                    : transitionTarget === "menu"
                      ? "inset(0 0 0 100%)"
                      : "inset(0 0 0 0)",
              }}
              transition={{
                duration: reduceMotion ? 0.2 : PANEL_TRANSITION.duration,
                ease: PANEL_TRANSITION.ease,
              }}
            >
              {!reduceMotion && transitionTarget !== "menu" && transitionTarget === currentSection && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] z-10 pointer-events-none"
                  style={{
                    backgroundColor: SECTION_ACCENT_COLOR[currentSection] ?? "#06b6d4",
                    boxShadow: accentGlowShadow(SECTION_ACCENT_COLOR[currentSection] ?? "#06b6d4", true),
                  }}
                  aria-hidden
                />
              )}
              {!reduceMotion && transitionTarget === "menu" && (
                <motion.div
                  className="absolute top-0 bottom-0 w-[2px] z-10 pointer-events-none"
                  style={{
                    backgroundColor: SECTION_ACCENT_COLOR[currentSection] ?? "#06b6d4",
                    transform: "translateX(-2px)",
                    boxShadow: accentGlowShadow(SECTION_ACCENT_COLOR[currentSection] ?? "#06b6d4", true),
                  }}
                  aria-hidden
                  initial={{ left: "0%" }}
                  animate={{ left: "100%" }}
                  transition={{
                    duration: PANEL_TRANSITION.duration,
                    ease: PANEL_TRANSITION.ease,
                  }}
                />
              )}
              <motion.div
                initial={reduceMotion ? false : { opacity: 1, x: "0%" }}
                animate={{
                  opacity: reduceMotion ? 1 : transitionTarget === "menu" ? 0.65 : 1,
                  x: reduceMotion ? "0%" : transitionTarget === "menu" ? "5%" : "0%",
                }}
                transition={{
                  duration: reduceMotion ? 0.2 : PANEL_TRANSITION.duration,
                  ease: PANEL_TRANSITION.ease,
                }}
              >
                {currentSection === "profile" && <PhantomProfile />}
                {currentSection === "projects" && <PalaceProjects onSelectProject={(id) => navigateTo(id)} />}
                {currentSection === "project-1" && <ProjectDetailSlide id="project-1" title="Project 1" onBack={() => navigateTo("projects")} />}
                {currentSection === "project-2" && <ProjectDetailSlide id="project-2" title="Project 2" onBack={() => navigateTo("projects")} />}
                {currentSection === "project-3" && <ProjectDetailSlide id="project-3" title="Project 3" onBack={() => navigateTo("projects")} />}
                {currentSection === "experience" && <ConfidantExperience />}
                {currentSection === "social" && <SocialLink />}
                {currentSection === "skills" && <SkillArsenal />}
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
    </GridPhaseContext.Provider>
  );
}
