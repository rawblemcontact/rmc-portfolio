import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const PortfolioDebugContext = createContext(false);
const RuleOfThirdsContext = createContext(false);
const DESKTOP_LAYOUT_STORAGE_KEY_PREFIX = "portfolio.debug.desktopLayout.v1";

export type DesktopLayoutSectionId = "profile" | "experience" | "projects";

export type ProfileDesktopLayoutDebugValues = {
  leftOffsetX: number;
  leftOffsetY: number;
  rightOffsetX: number;
  rightOffsetY: number;
  leftScale: number;
  leftWidthScale: number;
  rightScale: number;
  rightWidthScale: number;
};

/** Locked desktop PROFILE layout — tuned via debug panel (Jun 2026). */
export const PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS: ProfileDesktopLayoutDebugValues = {
  leftOffsetX: -5,
  leftOffsetY: 42,
  rightOffsetX: -194,
  rightOffsetY: 0,
  leftScale: 0.89,
  leftWidthScale: 1,
  rightScale: 1,
  rightWidthScale: 1,
};

/** Locked desktop EXPERIENCE layout — tuned via debug panel (Jun 2026). */
export const EXPERIENCE_DESKTOP_LAYOUT_DEBUG_DEFAULTS: ProfileDesktopLayoutDebugValues = {
  leftOffsetX: 35,
  leftOffsetY: 31,
  rightOffsetX: -36,
  rightOffsetY: 25,
  leftScale: 0.95,
  leftWidthScale: 1,
  rightScale: 0.95,
  rightWidthScale: 1,
};

/** Locked desktop PROJECTS layout — tuned via debug panel (Jun 2026). */
export const PROJECTS_DESKTOP_LAYOUT_DEBUG_DEFAULTS: ProfileDesktopLayoutDebugValues = {
  leftOffsetX: 35,
  leftOffsetY: 31,
  rightOffsetX: -36,
  rightOffsetY: 25,
  leftScale: 0.95,
  leftWidthScale: 1,
  rightScale: 0.95,
  rightWidthScale: 1,
};

const SECTION_DESKTOP_LAYOUT_DEBUG_DEFAULTS: Record<
  DesktopLayoutSectionId,
  ProfileDesktopLayoutDebugValues
> = {
  profile: PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS,
  experience: EXPERIENCE_DESKTOP_LAYOUT_DEBUG_DEFAULTS,
  projects: PROJECTS_DESKTOP_LAYOUT_DEBUG_DEFAULTS,
};

function sectionDesktopLayoutDefaults(sectionId: DesktopLayoutSectionId) {
  return SECTION_DESKTOP_LAYOUT_DEBUG_DEFAULTS[sectionId];
}

function sanitizeProfileDesktopLayoutValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readProfileDesktopLayoutDebugValues(): ProfileDesktopLayoutDebugValues {
  return readSectionDesktopLayoutDebugValues("profile");
}

export function saveProfileDesktopLayoutDebugValues(values: ProfileDesktopLayoutDebugValues) {
  saveSectionDesktopLayoutDebugValues("profile", values);
}

function desktopLayoutStorageKey(sectionId: DesktopLayoutSectionId) {
  return `${DESKTOP_LAYOUT_STORAGE_KEY_PREFIX}.${sectionId}`;
}

export function readSectionDesktopLayoutDebugValues(
  sectionId: DesktopLayoutSectionId,
): ProfileDesktopLayoutDebugValues {
  const defaults = sectionDesktopLayoutDefaults(sectionId);
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(desktopLayoutStorageKey(sectionId));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<ProfileDesktopLayoutDebugValues>;
    return {
      leftOffsetX: sanitizeProfileDesktopLayoutValue(parsed.leftOffsetX, defaults.leftOffsetX),
      leftOffsetY: sanitizeProfileDesktopLayoutValue(parsed.leftOffsetY, defaults.leftOffsetY),
      rightOffsetX: sanitizeProfileDesktopLayoutValue(parsed.rightOffsetX, defaults.rightOffsetX),
      rightOffsetY: sanitizeProfileDesktopLayoutValue(parsed.rightOffsetY, defaults.rightOffsetY),
      leftScale: sanitizeProfileDesktopLayoutValue(parsed.leftScale, defaults.leftScale),
      leftWidthScale: sanitizeProfileDesktopLayoutValue(
        parsed.leftWidthScale,
        defaults.leftWidthScale,
      ),
      rightScale: sanitizeProfileDesktopLayoutValue(parsed.rightScale, defaults.rightScale),
      rightWidthScale: sanitizeProfileDesktopLayoutValue(
        parsed.rightWidthScale,
        defaults.rightWidthScale,
      ),
    };
  } catch {
    return defaults;
  }
}

export function saveSectionDesktopLayoutDebugValues(
  sectionId: DesktopLayoutSectionId,
  values: ProfileDesktopLayoutDebugValues,
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(desktopLayoutStorageKey(sectionId), JSON.stringify(values));
  console.info(`[${sectionId.toUpperCase()} Desktop Layout Saved]`, values);
}

function isFnToggleKey(event: KeyboardEvent) {
  return (
    event.key === "Fn" ||
    event.key === "F13" ||
    event.code === "FnLeft" ||
    event.code === "FnRight"
  );
}

function isDebugToggleKey(event: KeyboardEvent) {
  return event.key === "w" || event.key === "W";
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function PortfolioDebugProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [ruleOfThirdsEnabled, setRuleOfThirdsEnabled] = useState(false);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!isDev) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      if (isFnToggleKey(event)) {
        event.preventDefault();
        setEnabled((value) => !value);
        return;
      }

      if (isDebugToggleKey(event)) {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        event.preventDefault();
        setEnabled((value) => !value);
        return;
      }

      if (event.key === "q" || event.key === "Q") {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        event.preventDefault();
        setRuleOfThirdsEnabled((value) => !value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDev]);

  return (
    <PortfolioDebugContext.Provider value={isDev && enabled}>
      <RuleOfThirdsContext.Provider value={isDev && ruleOfThirdsEnabled}>
        {children}
      </RuleOfThirdsContext.Provider>
    </PortfolioDebugContext.Provider>
  );
}

export function usePortfolioDebugEnabled() {
  return useContext(PortfolioDebugContext);
}

export function useRuleOfThirdsEnabled() {
  return useContext(RuleOfThirdsContext);
}
