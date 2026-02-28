import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Star, Heart, Zap, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOVER, SPRING, TAP } from "@/lib/motion";

const menuItems = [
  { id: "profile", label: "PROFILE.", icon: User, color: "bg-red-600" },
  { id: "projects", label: "PROJECTS.", icon: Zap, color: "bg-yellow-400" },
  { id: "experience", label: "WORK EXPERIENCE.", icon: Star, color: "bg-blue-600" },
  { id: "social", label: "COMMUNITY.", icon: Heart, color: "bg-pink-500" },
  { id: "skills", label: "SKILLS.", icon: Briefcase, color: "bg-green-600" },
];

export interface NavigationProps {
  isHeroInView?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isHeroInView = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const itemButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const sectionIds = useMemo(() => menuItems.map((i) => i.id), []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  // Track active section for clear nav state.
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most "in view" section.
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        const id = best?.target?.id;
        if (id) setActiveSection(id);
      },
      {
        // Middle-of-viewport bias (feels deliberate)
        root: null,
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0.05, 0.15, 0.25, 0.4, 0.6],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  // Premium keyboard behavior: Esc closes, focus management.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    // Focus first item on open
    setTimeout(() => itemButtonRefs.current[0]?.focus(), 0);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Return focus to toggle on close.
  useEffect(() => {
    if (isOpen) return;
    toggleButtonRef.current?.focus?.();
  }, [isOpen]);

  const focusItem = (index: number) => {
    const safe = Math.max(0, Math.min(index, menuItems.length - 1));
    itemButtonRefs.current[safe]?.focus();
  };

  return (
    <>
      {/* Nav button: tucked off-screen on hero, then slams in when you leave (hero → nav transition) */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={false}
        animate={{
          opacity: isHeroInView ? 0 : 1,
          x: isHeroInView ? 24 : 0,
          y: isHeroInView ? -32 : 0,
          scale: isHeroInView ? 0.7 : 1,
        }}
        style={{ pointerEvents: isHeroInView ? "none" : "auto" }}
        transition={SPRING.panel}
      >
        <Button
          ref={toggleButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="icon"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-full w-16 h-16 bg-white text-black hover:bg-black hover:text-white transition-colors duration-200 border-4 border-black p-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <div className="relative w-full h-full flex items-center justify-center">
             <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
             >
                {isOpen ? <X size={32} strokeWidth={3} /> : <Menu size={32} strokeWidth={3} />}
             </motion.div>
          </div>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click-outside close */}
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-30 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.nav
              id="site-nav"
              aria-label="Site navigation"
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%", skewX: -10 }}
              animate={{ x: "0%", skewX: 0 }}
              exit={{ x: "100%", skewX: -10 }}
              transition={SPRING.panel}
              className="fixed inset-y-0 right-0 w-full md:w-[380px] bg-black/95 z-40 border-l-4 border-white/20 flex flex-col justify-center p-6 md:p-8 shadow-2xl"
            >
              <div className="flex flex-col space-y-3">
                {menuItems.map((item, index) => {
                  const isActive = activeSection === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ x: 80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <motion.button
                        ref={(el) => {
                          itemButtonRefs.current[index] = el;
                        }}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            focusItem(index + 1);
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            focusItem(index - 1);
                          }
                          if (e.key === "Home") {
                            e.preventDefault();
                            focusItem(0);
                          }
                          if (e.key === "End") {
                            e.preventDefault();
                            focusItem(menuItems.length - 1);
                          }
                        }}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "group w-full text-left relative overflow-hidden p-3 md:p-4 rounded-lg",
                          "border border-white/10 hover:border-white/25",
                          "bg-transparent hover:bg-white/5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                          isActive ? "bg-white/10 border-white/35" : "",
                        ].join(" ")}
                        whileHover={{ x: 6, ...HOVER }}
                        whileTap={TAP}
                        transition={SPRING.ui}
                      >
                        {/* Rainbow personality: slim accent bar (not full wipe) */}
                        <span
                          aria-hidden
                          className={[
                            "absolute left-0 top-0 bottom-0 w-1.5",
                            item.color,
                            "opacity-90",
                            "transition-[width,opacity] duration-200",
                            "group-hover:w-2.5 group-hover:opacity-100",
                            isActive ? "w-2.5 opacity-100" : "",
                          ].join(" ")}
                        />

                        <div className="flex items-center gap-3 pl-3">
                          <item.icon
                            className={[
                              "w-6 h-6 shrink-0 text-white/90 transition-colors",
                              isActive ? "text-white" : "group-hover:text-white",
                            ].join(" ")}
                            strokeWidth={2.5}
                          />
                          <span className="text-xl md:text-2xl font-display text-white tracking-[0.14em] uppercase">
                            {item.label}
                          </span>

                          {/* Active indicator dot (monochrome) */}
                          {isActive && (
                            <span
                              aria-hidden
                              className="ml-auto h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.12)]"
                            />
                          )}
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="absolute bottom-6 left-6 text-zinc-500 font-mono text-xs md:text-sm">
                <p>ROBBIE MCLAUGHLIN // PORTFOLIO</p>
                <p>LAST LOGIN: TODAY</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
