import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const PortfolioDebugContext = createContext(false);
const RuleOfThirdsContext = createContext(false);
const HeroDebugContext = createContext(false);
const MainMenuDebugContext = createContext(false);
const DESKTOP_LAYOUT_STORAGE_KEY_PREFIX = "portfolio.debug.desktopLayout.v1";

export type DesktopLayoutSectionId = "profile" | "experience" | "projects";

export type ProfileDesktopLayoutDebugValues = {
  leftOffsetX: number;
  leftOffsetY: number;
  rightOffsetX: number;
  rightOffsetY: number;
  leftScale: number;
  leftWidthScale: number;
  leftHeightScale: number;
  rightScale: number;
  rightWidthScale: number;
  rightHeightScale: number;
};

/** Locked desktop PROFILE layout — tuned via debug panel (Jun 2026). */
export const PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS: ProfileDesktopLayoutDebugValues = {
  leftOffsetX: 84,
  leftOffsetY: 60,
  rightOffsetX: -117,
  rightOffsetY: 66,
  leftScale: 0.89,
  leftWidthScale: 0.8,
  leftHeightScale: 1,
  rightScale: 1.03,
  rightWidthScale: 1,
  rightHeightScale: 1,
};

/** Locked desktop EXPERIENCE layout — tuned via debug panel (Jun 2026). */
export const EXPERIENCE_DESKTOP_LAYOUT_DEBUG_DEFAULTS: ProfileDesktopLayoutDebugValues = {
  leftOffsetX: 9,
  leftOffsetY: 36,
  rightOffsetX: 28,
  rightOffsetY: 40,
  leftScale: 0.95,
  leftWidthScale: 1,
  leftHeightScale: 1,
  rightScale: 1,
  rightWidthScale: 1,
  rightHeightScale: 0.9,
};

/** Locked desktop PROJECTS layout — tuned via debug panel (Jun 2026). */
export const PROJECTS_DESKTOP_LAYOUT_DEBUG_DEFAULTS: ProfileDesktopLayoutDebugValues = {
  leftOffsetX: 119,
  leftOffsetY: 16,
  rightOffsetX: 120,
  rightOffsetY: 29,
  leftScale: 0.96,
  leftWidthScale: 0.84,
  leftHeightScale: 1,
  rightScale: 0.96,
  rightWidthScale: 0.84,
  rightHeightScale: 1,
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

export type DesktopLayoutApplyMode = "crisp" | "crisp-contained" | "transform";

/** PROFILE left uses crisp-contained (inner wrapper); PROFILE right uses transform (flex-safe). */
export function buildDesktopLayoutSideStyle(
  values: ProfileDesktopLayoutDebugValues,
  side: "left" | "right",
  mode: DesktopLayoutApplyMode,
): CSSProperties {
  const offsetX = side === "left" ? values.leftOffsetX : values.rightOffsetX;
  const offsetY = side === "left" ? values.leftOffsetY : values.rightOffsetY;
  const scale = side === "left" ? values.leftScale : values.rightScale;
  const widthScale = side === "left" ? values.leftWidthScale : values.rightWidthScale;
  const heightScale = side === "left" ? values.leftHeightScale : values.rightHeightScale;
  const transformOrigin = side === "left" ? "left top" : "right top";

  if (mode === "transform") {
    return {
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) scaleX(${widthScale})`,
      transformOrigin,
    };
  }

  const zoom = scale * heightScale;
  const style: CSSProperties = {
    transform: `translate(${offsetX}px, ${offsetY}px)`,
    transformOrigin,
    zoom,
  };

  if (mode === "crisp") {
    const widthPercent = heightScale !== 0 ? (widthScale / heightScale) * 100 : widthScale * 100;
    style.width = `${widthPercent}%`;
    style.maxWidth = "none";
    return style;
  }

  // crisp-contained: keep parent flex sizing at 1× width/height; only apply width when tuned.
  if (widthScale !== 1 || heightScale !== 1) {
    const widthPercent = heightScale !== 0 ? (widthScale / heightScale) * 100 : widthScale * 100;
    style.width = `${widthPercent}%`;
  }

  return style;
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
      leftHeightScale: sanitizeProfileDesktopLayoutValue(
        parsed.leftHeightScale,
        defaults.leftHeightScale,
      ),
      rightScale: sanitizeProfileDesktopLayoutValue(parsed.rightScale, defaults.rightScale),
      rightWidthScale: sanitizeProfileDesktopLayoutValue(
        parsed.rightWidthScale,
        defaults.rightWidthScale,
      ),
      rightHeightScale: sanitizeProfileDesktopLayoutValue(
        parsed.rightHeightScale,
        defaults.rightHeightScale,
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

function isHeroDebugToggleKey(event: KeyboardEvent) {
  return event.key === "e" || event.key === "E";
}

function isMainMenuDebugToggleKey(event: KeyboardEvent) {
  return event.key === "m" || event.key === "M";
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function PortfolioDebugProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [ruleOfThirdsEnabled, setRuleOfThirdsEnabled] = useState(false);
  const [heroDebugEnabled, setHeroDebugEnabled] = useState(false);
  const [mainMenuDebugEnabled, setMainMenuDebugEnabled] = useState(false);
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

      if (isHeroDebugToggleKey(event)) {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        event.preventDefault();
        setHeroDebugEnabled((value) => !value);
        return;
      }

      if (isMainMenuDebugToggleKey(event)) {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        event.preventDefault();
        setMainMenuDebugEnabled((value) => !value);
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
      <HeroDebugContext.Provider value={isDev && heroDebugEnabled}>
        <MainMenuDebugContext.Provider value={isDev && mainMenuDebugEnabled}>
          <RuleOfThirdsContext.Provider value={isDev && ruleOfThirdsEnabled}>
            {children}
          </RuleOfThirdsContext.Provider>
        </MainMenuDebugContext.Provider>
      </HeroDebugContext.Provider>
    </PortfolioDebugContext.Provider>
  );
}

export function usePortfolioDebugEnabled() {
  return useContext(PortfolioDebugContext);
}

export function useHeroDebugEnabled() {
  return useContext(HeroDebugContext);
}

export function useMainMenuDebugEnabled() {
  return useContext(MainMenuDebugContext);
}

export function useRuleOfThirdsEnabled() {
  return useContext(RuleOfThirdsContext);
}
