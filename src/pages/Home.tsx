// Force rebuild: 2024-05-21
import {
  motion,
  AnimatePresence,
  Variants,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  startTransition,
  cloneElement,
  isValidElement,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { Button } from "../components/ui/button";
import { FillIcon } from "../components/FillIcon";
import { ProfileDesktopLayoutDebugPanel } from "../components/ProfileDesktopLayoutDebugPanel";
import {
  ProjectsTabletThumbnailDebugPanel,
  buildProjectsTabletThumbnailLockInSnippet,
  buildProjectsTabletThumbnailStyle,
  readProjectsTabletThumbnailDebugValues,
  saveProjectsTabletThumbnailDebugValues,
  seedProjectsTabletThumbnailDefaultsFromCards,
  type ProjectsTabletThumbnailControl,
  type ProjectsTabletThumbnailDebugValues,
  type ProjectsTabletThumbnailId,
} from "../components/ProjectsTabletThumbnailDebugPanel";
import {
  ProfileRedLineDebugPanel,
  PROFILE_RED_LINE_DEBUG_DEFAULTS,
  buildProfileRedLinePillDebugStyle,
  buildProfileRedLineSpanDebugStyle,
  type ProfileRedLineDebugValues,
} from "../components/ProfileRedLineDebugPanel";
import {
  ProjectDetailLayoutDebugPanel,
  PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS,
  projectDetailLayoutDefaultsForProject,
  projectDetailLayoutHasLockedDefaults,
  type ProjectDetailLayoutDebugValues,
} from "../components/ProjectDetailLayoutDebugPanel";
import {
  HeroAccentLayoutDebugPanel,
  HERO_MAIN_GLOBAL_LAYOUT_DEFAULTS,
  HERO_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS,
  HERO_SVG_LOCKUP_LAYOUT_DEFAULTS,
  HERO_VIDEO_GLOBAL_LAYOUT_DEFAULTS,
  buildHeroGlobalLayoutStyle,
  type HeroAccentIconKey,
  type HeroAccentLayoutControl,
  type HeroControlledViewport,
  type HeroGlobalLayoutControl,
} from "../components/HeroAccentLayoutDebugPanel";
import {
  MainMenuLayoutDebugPanel,
  MAIN_MENU_GLOBAL_LAYOUT_DEFAULTS,
  buildMainMenuGlobalLayoutStyle,
  type MainMenuGlobalLayoutControl,
} from "../components/MainMenuLayoutDebugPanel";
import {
  buildDesktopLayoutSideStyle,
  buildProjectsShowcaseDesktopClusterStyle,
  readSectionDesktopLayoutDebugValues,
  saveSectionDesktopLayoutDebugValues,
  EXPERIENCE_DESKTOP_LAYOUT_DEBUG_DEFAULTS,
  PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS,
  PROJECTS_DESKTOP_LAYOUT_DEBUG_DEFAULTS,
  type ProfileDesktopLayoutDebugValues,
  useHeroDebugEnabled,
  useMainMenuDebugEnabled,
  usePortfolioDebugEnabled,
  useRuleOfThirdsEnabled,
} from "../lib/portfolioDebugMode";
import { UserFilledIcon } from "../components/icons/UserFilledIcon";
import { DUR, EASE, HOVER, PORTFOLIO_SPEED, SHOWCASE_PDF_PROJECTS_FADE_OUT_S, SIDE_NAV_OVERLAY_FADE_S, SPRING, TAP } from "../lib/motion";
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
  ChevronUp,
  ExternalLink,
  Download,
  Menu,
  X,
  LucideIcon,
  FileText,
  Zap,
  User,
  Briefcase,
} from "lucide-react";
import styled from "styled-components";
import { TiltCard } from "../components/TiltCard";
import { FloatingPhone } from "../components/FloatingPhone";
import { ShowcaseAttachedTabStrip, type ShowcaseTabId } from "../components/ShowcaseAttachedTabStrip";
import { ShowcaseVideoEditingDetail, type ShowcaseDetailVideo } from "../components/ShowcaseVideoEditingDetail";
import { FeaturedWritingPdfThumbnail } from "../components/FeaturedWritingPdfThumbnail";
import { SupportingPdfPreviewDialog } from "../components/SupportingPdfPreviewDialog";
import robHeroSplitSvgRaw from "../assets/rob-hero-split.svg?raw";
import {
  SiArc,
  SiBytedance,
  SiHootsuite,
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiYoutubeshorts,
} from "@icons-pack/react-simple-icons";
import {
  IconBook,
  IconCertificate,
  IconChecklist,
  IconClock,
  IconDeviceDesktop,
  IconEdit,
  IconFileText,
  IconPalette,
  IconPencil,
  IconSearch,
  IconShare,
  IconUser,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
function AdobeSuiteIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="-1.5 -4 23 24"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-180.000000, -7602.000000)" fill="currentColor">
          <g transform="translate(56.000000, 160.000000)">
            <path d="M132.304608,7455.57278 C132.098266,7455.37843 131.326987,7454.63871 130.967391,7454.28563 C130.887258,7454.20728 130.813135,7454.16862 130.699947,7454.17167 C127.403481,7454.25307 126.17845,7451.40609 126.957742,7449.35174 C127.554732,7447.77664 129.208474,7446.81815 130.838176,7447.11424 C132.206445,7447.3615 132.549013,7447.9079 134.689562,7450.10571 C135.281544,7450.71418 136.260167,7449.80453 135.637134,7449.1635 C134.956004,7448.46346 134.290901,7447.74408 133.582727,7447.07354 C132.207447,7445.77113 130.586759,7445.38346 128.794788,7445.93801 C126.383791,7446.6818 124.97245,7449.21031 125.523364,7451.70625 C126.025196,7453.98038 127.982441,7455.57583 130.27324,7455.57787 C130.44252,7455.57787 132.135327,7455.58194 132.304608,7455.57278 M132.799428,7444.82384 C132.811448,7444.84012 132.814453,7444.84724 132.819462,7444.85029 C133.232146,7445.05583 133.623795,7445.29901 133.996413,7445.57272 C134.019451,7445.59002 134.077548,7445.5829 134.106596,7445.56458 C136.146979,7444.25098 138.77133,7444.70377 140.255792,7446.64009 C141.806363,7448.65984 141.33458,7451.20666 140.051453,7452.64541 C138.095209,7454.83712 135.067188,7454.61022 133.370375,7452.86926 C132.453855,7451.92909 131.531326,7450.99501 130.612803,7450.05687 C129.890605,7449.32122 128.958059,7450.34788 129.61014,7451.0001 C132.877558,7454.25714 133.423463,7455.22886 135.740305,7455.54124 C137.783693,7455.81494 139.816063,7455.08539 141.212378,7453.37395 C143.130558,7451.01842 142.972296,7447.64335 141.120225,7445.52999 C138.714236,7442.78577 135.043149,7442.91296 132.799428,7444.82384 M144,7449.15943 C144,7453.17655 141.585997,7456.48141 136.963332,7456.9983 C136.456492,7456.9983 130.314308,7457.00848 129.818486,7456.97897 C123.637236,7456.58316 121.640926,7447.86415 127.491627,7444.88997 C128.557395,7444.34764 129.811474,7444.1187 131.189759,7444.30592 C131.227822,7444.31203 131.281912,7444.29473 131.308957,7444.26726 C135.413763,7440.00696 143.231726,7441.81303 144,7449.15943" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function CanvaIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 192 192"
      width={size + 2}
      height={size + 2}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M95.2 170c-11.6 0-22-3.1-30.9-9.1-8.8-6-15.4-14.6-19.7-25.6-2.5-6.4-4-13.4-4.7-21.4-.8-9.5-.2-19.2 1.9-28.7 3.3-15.3 10-28.5 19.8-39.5 9.7-10.8 21.2-18.1 34.3-21.5 5.6-1.5 11.2-2.2 16.5-2.2 6.4 0 12.7 1.1 18.7 3.3 8.9 3.3 15 9 17.9 17 1.4 3.7 1.8 7.6 1.4 12-.6 6.2-2.6 11.7-6 16.4-3.9 5.4-8.6 8.7-14.3 10.1-1 .3-2.1.4-3.3.4-.5 0-.9 0-1.4-.1-1.7-.2-3.2-.9-4.2-2.2-1-1.3-1.4-3-1.2-4.7.3-2 1.1-3.7 1.9-5.1l.3-.6c1.6-3.2 3.1-6.2 3.9-9.4 1.3-5.4 1.3-9.5-.1-13.3-1.5-4-4.3-6.5-8.5-7.5-1.6-.4-3.2-.6-4.8-.6-3.6 0-7.4.9-11.4 2.7C93.4 44 86.7 50 81 58.7c-3.9 6-6.9 12.7-9.1 20.5-1.6 5.6-2.6 11.5-3.2 17.6-.3 2.9-.5 6.3-.5 9.6.1 9.7 1.5 17.4 4.5 24.2 3.3 7.6 7.8 12.9 13.9 16.3 4.1 2.3 8.7 3.5 13.6 3.5.8 0 1.7 0 2.6-.1 10.4-.8 19.6-5.5 28-14.3 4.3-4.5 7.9-9.7 11-15.9.5-.9 1-1.9 1.8-2.7 1-1.1 2.3-1.7 3.7-1.7 1.7 0 3.2.9 4.2 2.5 1.2 2 1.1 4.2.9 5.6-.6 4.1-2.1 8.1-4.6 12.8-7.2 12.9-17.1 22.4-29.4 28.3-6.3 3-13.1 4.7-20.1 5-1.1.1-2.1.1-3.1.1z"
        fill="none"
        stroke="currentColor"
        strokeWidth={12}
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </svg>
  );
}

function ProcreateIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size + 2}
      height={size + 2}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m 12.02324,13 c -0.33,0 -0.66,0 -1,0 -0.724,11.524 1.337,20.922 8.785,29.984 4.124,3.754 9.114,5.88 14.215,8.016 0,0.99 0,1.98 0,3 8.109,4.561 16.765,6.544 25.734,8.824 9.247,2.491 16.963,5.814 22.266,14.176 0.847,2.325 1.431,4.583 2,7 0.33,0 0.66,0 1,0 0.74,-11.094 -2.68,-21.544 -10,-30 -8.744,-8.619 -18.865,-12.166 -30.438,-15.375 -11.909,-3.311 -24.128,-8.531 -30.562,-19.625 -1.243,-3.225 -1.243,-3.225 -2,-6 z"
        fill="currentColor"
      />
      <path
        d="m 47.02324,46 c -1.963,1.875 -3.396,3.783 -5,6 0.785,0.193 1.57,0.387 2.379,0.586 3.209,0.795 6.415,1.604 9.621,2.414 1.237,0.309 2.475,0.619 3.75,0.938 8.228,2.689 15.969,6.844 20.5,14.5 1.712,3.484 3.473583,6.634626 5.456749,9.266294 L 85.02324,84 c 0.584,-8.761 -1.038,-17.536 -6.375,-24.75 -6.544,-6.811 -22.178,-16.819 -31.625,-13.25 z"
        fill="currentColor"
      />
      <path
        d="m 12.02324,13 c -0.33,0 -0.66,0 -1,0 -0.538,8.571 0.533,15.137 4,23 0.99,-1.32 1.98,-2.64 3,-4 0.784,0.557 1.567,1.114 2.375,1.688 7.44,4.954 15.382,8.57 24.187,10.124 11.168,2.177 20.864,7.202 30.438,13.188 0,-3 0,-3 -1.766,-4.867 -8.823,-7.131 -17.879,-10.516 -28.672,-13.508 -11.909,-3.311 -24.128,-8.531 -30.562,-19.625 -1.243,-3.225 -1.243,-3.225 -2,-6 z"
        fill="currentColor"
      />
      <path
        d="m 18.02324,31 -2,2 c 0.102,4.495 4.849784,5.049176 7.860784,8.384176 2.887,2.616 3.143216,7.615824 7.139216,7.615824 4,-4.471 4,-4.471 4,-7 l 3,-1 c -0.736,-0.242 -1.472,-0.485 -2.23,-0.734 -5.317,-1.826 -9.553,-3.433 -13.77,-7.266 -1.311,-0.709 -2.638,-1.395 -4,-2 z"
        fill="currentColor"
      />
      <path
        d="m 39.02324,39 c 0,0.66 0,1.32 0,2 0.609,0.211 1.218,0.422 1.845,0.639 16.073,5.587 16.073,5.587 31.155,13.361 1.327,0.679 2.658,1.35 4,2 -2.548,-6.486 -9.679,-10.337 -15.668,-13.336 -6.902,-2.846 -13.79,-5.041 -21.332,-4.664 z"
        fill="currentColor"
      />
      <path
        d="m 57.02324,56 c -1.664,0.348 -3.33,0.684 -5,1 0,0.66 0,1.32 0,2 -0.99,0.33 -1.98,0.66 -3,1 0.594,0.15 1.189,0.301 1.801,0.456 2.738,0.704 5.468,1.436 8.199,2.169 0.935,0.236 1.869,0.472 2.832,0.715 5.769,1.573 9.996,3.538 14.609,7.368 1.559,1.292 1.559,1.292 3.559,2.292 -3.594,-8.496 -10.46,-12.728 -18.09,-17.234 -1.91,-0.766 -1.91,-0.766 -4.91,0.234 z"
        fill="currentColor"
      />
      <path
        d="m 47.02324,46 c -1.963,1.875 -3.396,3.783 -5,6 1.935,0.531 3.873,1.049 5.812,1.562 1.619,0.436 1.619,0.436 3.27,0.879 4.722,0.904 8.629,-1.58 12.918,-3.441 -4.355,-4.8 -10.735,-7.367 -17,-5 z"
        fill="currentColor"
      />
      <path
        d="m 33.02324,52 c 4.159,4.728 10.47,6.826 16.625,7.25 0.784,-0.082 1.568,-0.165 2.375,-0.25 0,-0.66 0,-1.32 0,-2 2.31,0 4.62,0 7,0 -2.885,-2.885 -6.33,-3.284 -10.188,-4.188 -0.743,-0.19 -1.486,-0.38 -2.251,-0.576 -4.905,-1.165 -8.62,-1.263 -13.561,-0.236 z"
        fill="currentColor"
      />
      <path
        d="m 22.02324,29 c 0,3.418 0.823,4.878 3.039,7.434 4.266,3.407 9.718,5.22 14.961,6.566 2.402,-0.371 2.402,-0.371 4,-1 -1.65,-0.33 -3.3,-0.66 -5,-1 0,-1.32 0,-2.64 0,-4 -5.61,-2.64 -11.22,-5.28 -17,-8 z m 20,9 c -3,1 -3,1 -3,1 z"
        fill="currentColor"
      />
      <path
        d="m 54.77324,58.9375 c -1.078,0.009 -2.155,0.018 -3.266,0.027 -0.819,0.012 -1.639,0.024 -2.484,0.035 2.738,1.826 4.348,2.499 7.449,3.29 0.848,0.219 1.695,0.438 2.569,0.664 0.881,0.221 1.762,0.443 2.67,0.672 0.892,0.229 1.785,0.458 2.705,0.695 2.201,0.565 4.403,1.125 6.607,1.679 0,-0.989 0,-1.98 0,-3 -5.811,-3.037 -9.7,-4.133 -16.25,-4.062 z"
        fill="currentColor"
      />
      <path
        d="m 12.02324,17 c -0.33,0 -0.66,0 -1,0 -0.537,7.115 1.303,12.45 4,19 2,-3 2,-3 3,-6 -0.961,-2.375 -0.961,-2.375 -2.375,-5 -1.432,-2.689 -2.66,-5.104 -3.625,-8 z"
        fill="currentColor"
      />
      <path
        d="m 73.02324,63 c -0.66,0.33 -1.32,0.66 -2,1 1.517,4.55 5.169,6.501 9,9 -1.668,-3.941 -4.227,-6.789 -7,-10 z"
        fill="currentColor"
      />
      <path
        d="m 26.955809,47 -2,1 c 6.074,5.059 15.026147,9.417282 18.890147,9.170282 0.68,-0.268 -7.591147,-4.894282 -6.890147,-5.170282 -3.235,-2.156 -6.372,-3.615 -10,-5 z"
        fill="currentColor"
      />
      <path
        d="m 72.02324,51 c -0.66,0.99 -1.32,1.98 -2,3 1.98,0.99 3.96,1.98 6,3 -1.152,-2.468 -2.048,-4.048 -4,-6 z"
        fill="currentColor"
      />
    </svg>
  );
}

function CapCutIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="-4 -4 155 117"
      width={size}
      height={size}
      className={`block shrink-0 ${className ?? ""}`}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 16.397972,109.02936 C 9.6553448,107.52313 4.1553948,103.36396 1.2959418,97.608906 l -0.85502602,-1.72086 -0.09451,-9.74227 -0.09451,-9.74227 7.76015302,-4.06768 c 4.2680852,-2.23723 13.5028302,-6.98438 20.5216562,-10.54924 11.217349,-5.69727 12.712788,-6.54096 12.358895,-6.97253 -1.097188,-1.33804 -6.568991,-4.30779 -22.304446,-12.10542 -9.4647242,-4.6902 -17.4661382,-8.81712 -17.78092122,-9.17092 -0.507014,-0.56987 -0.592061,-1.45862 -0.745213,-7.787582 -0.210823,-8.712173 0.05343,-10.848678 1.77371302,-14.340614 C 3.4376348,8.1578797 5.3279258,6.0524497 8.6002358,3.8751297 11.83796,1.7208227 14.625541,0.71410668 18.476115,0.30852468 20.240367,0.12269568 37.383897,1.2268069e-4 61.60963,1.2968069e-4 c 43.40031,1.1e-5 42.07681,-0.0473500007 46.2957,1.65673401931 2.9774,1.202627 5.24678,2.695028 7.43291,4.888074 2.51989,2.52786 3.36338,3.9602703 4.15523,7.0563743 0.34474,1.347915 0.6803,2.504249 0.74568,2.569631 0.0654,0.06538 5.49222,-2.563163 12.05965,-5.841211 7.40966,-3.6984443 12.2915,-5.9600893 12.86506,-5.9600893 h 0.9243 v 8.3841543 8.384154 l -28.08129,13.971795 c -15.44471,7.68448 -30.45051,15.06982 -33.34622,16.41186 -2.89572,1.34203 -5.28354,2.58086 -5.30628,2.75294 -0.0983,0.74424 5.86013,4.16851 13.70004,7.87329 10.93954,5.16951 52.71149,25.98419 53.42485,26.62123 0.49238,0.4397 0.54755,1.23765 0.54755,7.91907 v 7.430114 l -0.98534,0.34349 c -0.54194,0.18892 -1.39792,0.34349 -1.90218,0.34349 -0.57132,0 -5.21253,-2.1876 -12.31546,-5.804804 -6.26925,-3.19264 -11.51947,-5.73011 -11.66716,-5.63883 -0.14769,0.0913 -0.35885,0.73081 -0.46925,1.42119 -0.29075,1.81829 -1.31626,4.40044 -2.39363,6.026974 -0.92963,1.40348 -4.46036,4.51871 -6.56146,5.7893 -1.99184,1.20452 -5.70662,2.23841 -9.24987,2.57441 -2.17321,0.20608 -17.97923,0.31551 -43.31455,0.29987 -32.135388,-0.0198 -40.257687,-0.10615 -41.76994,-0.44398 z M 99.46852,94.470196 c 1.41773,-0.18333 3.02782,-0.64395 4.06749,-1.16365 1.63624,-0.81792 1.73817,-0.93979 2.0729,-2.4785 0.19363,-0.89005 0.45063,-2.53884 0.57112,-3.66397 l 0.21908,-2.0457 -15.72317,-7.91271 c -19.07138,-9.59771 -24.63738,-12.27967 -26.83362,-12.92968 -2.52829,-0.74829 -6.1604,-0.63952 -8.71668,0.26104 -1.16617,0.41084 -10.638558,5.19536 -21.049754,10.63227 l -18.929448,9.88529 -0.08754,3.54724 -0.08754,3.54724 1.100835,1.06697 c 0.981224,0.95104 1.347693,1.08969 3.372817,1.27606 3.687154,0.33933 77.38596,0.31916 80.02351,-0.0219 z M 73.05834,40.783326 c 5.41075,-2.85989 15.0801,-7.71109 21.48745,-10.78044 13.19588,-6.321308 12.31428,-5.616721 11.9458,-9.547199 -0.2088,-2.22724 -0.97451,-3.652061 -2.34296,-4.359711 -2.66497,-1.378111 -3.04297,-1.390022 -44.29538,-1.395747 -25.31644,-0.0035 -39.740281,0.107281 -40.828285,0.313617 -1.019446,0.193334 -2.115028,0.668931 -2.780436,1.206999 l -1.098091,0.887948 -0.0881,3.637115 -0.0881,3.637115 15.106507,7.548813 c 8.308579,4.15185 17.040695,8.60505 19.404705,9.896 5.43971,2.97055 8.72406,4.14547 11.60392,4.15112 l 2.13525,0.004 z"
        fill="currentColor"
      />
    </svg>
  );
}

/** DaVinci Resolve — padded viewBox so the mark is not clipped at card icon sizes. */
function DavinciResolveIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="-1 -1 26 26"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M17.621 0 5.977.004c-1.37 0-2.756.345-3.762 1.11a4.925 4.925 0 0 0-1.61 2.003C.233 3.93 0 5.02 0 5.951l.012 12.2c.002 1.604.479 3.057 1.461 4.112.984 1.056 2.462 1.683 4.331 1.691L16.856 24c1.26.005 3.095-.036 4.303-.714 1.075-.605 2.025-1.556 2.497-2.984.278-.84.345-2.084.344-3.147l-.021-11.13c-.002-.888-.15-2.023-.547-2.934-.425-.976-1.181-1.815-2.322-2.425C20.353.26 19.123 0 17.622 0zm0 .93c1.378 0 2.538.295 3.04.565.977.523 1.544 1.166 1.889 1.96.315.721.47 1.793.473 2.572l.018 11.13c.002 1.013-.097 2.257-.298 2.86-.396 1.202-1.146 1.946-2.063 2.462-.814.457-2.612.593-3.82.588l-11.05-.044c-1.657-.007-2.832-.534-3.626-1.386-.792-.851-1.212-2.06-1.212-3.485L.999 5.95c0-.829.196-1.827.474-2.437.345-.757.75-1.207 1.365-1.674C3.585 1.27 4.868.97 6.08.97zm-5.66 3.423c-1.976.089-3.204 1.658-3.214 3.29.019 1.443 1.635 3.481 2.884 4.53.12.099.154.109.33.18.062.025.198-.047.327-.135.36-.245.993-.947 1.648-1.738a7.67 7.67 0 0 0 1.031-1.683c.409-.89.261-1.599.235-1.888a3.983 3.983 0 0 0-.99-1.692 3.36 3.36 0 0 0-2.251-.864zm4.172 7.922a10.185 10.185 0 0 0-3.244.61c-.15.058-.26.1-.374.17-.057.036-.11.135-.105.292.017.433.29 1.278.624 2.27.384 1.135 1.066 2.27 1.844 2.74a3.23 3.23 0 0 0 2.53.342c.832-.243 1.595-.868 1.962-1.546.986-1.818.19-3.548-1.121-4.417-.447-.296-1.133-.445-1.89-.46-.074 0-.15-.002-.226-.001zm-8.432.038a6.201 6.201 0 0 0-.752.047c-.596.078-.932.273-1.29.51a3.177 3.177 0 0 0-1.365 1.979c-.075.552-.086 1.053.033 1.507.433 1.389 1.326 2.222 2.847 2.452.636.028 1.37-.063 1.99-.45 1.269-.782 2.08-3.17 2.412-4.742.053-.176.035-.357-.013-.42-.005-.067-.044-.113-.19-.183-.398-.192-1.32-.417-2.375-.6a7.68 7.68 0 0 0-1.297-.1z"
      />
    </svg>
  );
}

function ArcStudioIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 57.11092 28.375101"
      width={size + 2}
      height={size + 2}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="m 51.384119,20.404801 c 0.5647,2.5583 0.8782,5.2289 0.9072,7.9656 l 4.8196,-0.0066 c -0.0015,-10.5208 -5.6958,-19.69794 -14.1647,-24.59293 4.081,4.67568 7.0283,10.35083 8.4379,16.63393 z m -50.70235625,7.9483 H 16.287219 c 0,-5.9826 4.1546,-11.0234 9.728,-12.3217 -1.9253,-1.7567 -4.2814,-3.0805 -6.8654,-3.7679 -6.628,2.1813 -11.2989502,6.3226 -14.2851402,9.8573 l -0.3435601,0.4129 c -0.11194,0.1366 -0.2213,0.2721 -0.32811,0.4064 l -0.3127599,0.3989 -0.2975201,0.3905 c -0.04832,0.0644 -0.09601,0.1283 -0.1430599,0.1919 l -0.27483,0.3762 -0.25981,0.3655 c -0.08412,0.12 -0.16575,0.238 -0.24492,0.3539 l -0.2301001,0.3413 -0.2153899,0.3278 -0.20079,0.3134 -0.1862701,0.2981 -0.25242,0.4163 -0.22032,0.3765 -0.12921,0.2274 -0.21646,0.3939 -0.16117295,0.3064 z"
        fill="currentColor"
      />
      <path
        d="m 3.6072687,15.767501 c -1.87558,3.793 -2.92017395,8.0828 -2.93026695,12.5948 l 0.106032,-0.2174 0.133735,-0.2605 0.24443995,-0.4532 0.18848,-0.3343 0.22024,-0.3773 0.25234,-0.4171 0.1862301,-0.2987 0.20076,-0.314 0.21536,-0.3285 0.23009,-0.342 0.24491,-0.3546 0.25982,-0.3663 0.2748399,-0.3769 c 0.09413,-0.1274 0.1907701,-0.2564 0.2899601,-0.3868 l 0.3051699,-0.3956 0.3204901,-0.4036 c 2.9536499,-3.6648 7.7804202,-8.18 14.8078202,-10.4917 -1.4297,-0.3801 -2.935,-0.5908 -4.4857,-0.5819 -4.2255,-0.013 -8.0974303,1.5494 -11.0647503,4.1056 z"
        fill="currentColor"
      />
      <defs>
        <linearGradient
          id="arcstudio_paint0_linear"
          x1="3.7210701"
          y1="14.7482"
          x2="52.403801"
          y2="14.7482"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-0.11328125,-0.560699)"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <path
        d="m 3.6077888,15.753101 c 2.96965,-2.544 6.8156302,-4.1095 11.0509302,-4.1095 1.5579,0 3.0671,0.1957 4.4789,0.587 2.5801,0.7339 4.9169,2.0548 6.8642,3.7671 0.925,-0.1957 1.8986,-0.2936 2.8723,-0.2936 7.0103,0 12.6575,5.675 12.6575,12.671 h 10.7589 c 0,-2.5685 -0.2995,-5.0939 -0.8183,-7.4957 l -0.1067,-0.4787 c -1.3631,-6.2621 -4.3327,-11.98602 -8.4221,-16.63367 C 38.805419,1.369831 34.034519,0 28.874119,0 17.823119,0 8.2326487,6.408851 3.6077888,15.753101 Z"
        fill="url(#arcstudio_paint0_linear)"
      />
    </svg>
  );
}

/** Audacity — `currentColor` for `text-portfolio-green` in `ToolIcon`. */
function AudacityIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 2.145c-2.487 0-4.755.776-6.428 2.08-1.673 1.303-2.76 3.169-2.76 5.244v.75C1.153 11.06 0 13.268 0 15.856c0 3.312 1.884 6 4.312 6V9.468c0-1.554.805-2.984 2.186-4.06C7.879 4.331 9.829 3.643 12 3.643c2.17 0 4.12.688 5.502 1.764 1.38 1.077 2.186 2.507 2.186 4.06v12.387c2.428 0 4.312-2.687 4.312-6 0-2.587-1.152-4.795-2.813-5.636v-.75c0-2.075-1.086-3.94-2.76-5.244-1.672-1.304-3.94-2.08-6.427-2.08zm0 6.153l-1.125 8.683L9.75 9.105l-.562 6.75-.376-.75-.375-4.5-.187 4.5-.563 1.313-.374-4.5-.376 3.562-.562-.937v2.625l-.563-2.11v-4.64a1.432 1.432 0 0 0-.937-.375v11.812c.375 0 .75-.187.937-.562v-3.375l.188.187.563 1.875.187-2.25.563 2.813v-3.562l.374.937.563 2.625v-3.562l.375.374.563 3.188.562-4.313 1.24 4.86.072-2.985.375-1.124.376 4.687 1.124-4.687.375 3.937.938-4.125.938 4.5.187-3.375.562-1.125.188 4.313.938-4.125.562 1.875.188-1.688.374.75v3.375c.188.375.563.562.938.562V10.043c-.375 0-.75.188-.938.375v4.813l-.374 1-.188-3.188-.375 2.437-.375-.75-.188-2.625-.937 3.563-.188-.75L15 9.293l-.562 4.875-.376 1.5-.75-5.062-.75 4.312-.375 1.125Z"
      />
    </svg>
  );
}

/** OBS Studio (Streamline Logos) — `currentColor` for `text-portfolio-green` in `ToolIcon`. */
function ObsStudioIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 12c0 6.075 -4.925 11 -11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11Zm-3.479 4.326a3.652 3.652 0 0 0 -5.23 -4.828 3.652 3.652 0 0 0 -0.912 5.122 0.466 0.466 0 0 1 0 0.584A5.56 5.56 0 0 1 12 18.391a5.478 5.478 0 0 1 -7.213 -1.597 3.653 3.653 0 0 0 6.528 -2.52 3.652 3.652 0 0 0 -3.971 -3.36 0.447 0.447 0 0 1 -0.494 -0.293 5.323 5.323 0 0 1 -0.328 -1.817 5.478 5.478 0 0 1 5.104 -5.478 3.652 3.652 0 1 0 1.954 6.921 3.58 3.58 0 0 0 1.734 -1.762 0.474 0.474 0 0 1 0.503 -0.283 5.18 5.18 0 0 1 1.661 0.648 5.479 5.479 0 0 1 2.043 7.476Z"
      />
    </svg>
  );
}

/** Cursor IDE — `currentColor` for `text-portfolio-green` in `ToolIcon`. */
function CursorIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      fillRule="evenodd"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <path d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z" />
    </svg>
  );
}

/** Twitch — `currentColor` for `text-portfolio-green` in `ToolIcon`. */
function TwitchIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.7 0L1.4 10.985V55.88h15.284V64h8.597l8.12-8.12h12.418l16.716-16.716V0H5.7zm51.104 36.3L47.25 45.85H31.967l-8.12 8.12v-8.12H10.952V5.73h45.85V36.3zM47.25 16.716v16.716h-5.73V16.716h5.73zm-15.284 0v16.716h-5.73V16.716h5.73z"
      />
    </svg>
  );
}

/** Neutral toolkit bullet mark when no brand asset is wired — matches `ToolIcon` size/color. */
function SkillsToolPlaceholderIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        fill="currentColor"
        d="M8.25 8.25h3.5v3.5h-3.5zm4 0h3.5v3.5h-3.5zm-4 4h3.5v3.5h-3.5zm4 0h3.5v3.5h-3.5z"
      />
    </svg>
  );
}

/** Microsoft four-square mark (svgrepo); `currentColor` so it matches `text-portfolio-green` in `ToolIcon`. */
function MicrosoftOffice365Icon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path fill="currentColor" d="M2,3h9v9H2V3m9,19H2V13h9v9M21,3v9H12V3h9m0,19H12V13h9Z" />
    </svg>
  );
}

// Tool label -> icon: React component (@icons-pack) or "favicon:domain" for Google favicon (styled to match)
const TOOL_ICONS: Record<
  string,
  | React.ComponentType<{ size?: number; className?: string }>
  | string
> = {
  "Microsoft Office 365": MicrosoftOffice365Icon,
  "Adobe Creative Suite": AdobeSuiteIcon,
  "Canva": CanvaIcon,
  "Procreate": ProcreateIcon,
  "DaVinci Resolve": DavinciResolveIcon,
  "CapCut": CapCutIcon,
  Audacity: AudacityIcon,
  "Arc Studio": ArcStudioIcon,
  "Hootsuite": SiHootsuite,
  "TikTok Creator Tools": SiTiktok,
  "Instagram Reels": SiInstagram,
  "YouTube Shorts": SiYoutubeshorts,
  Cursor: CursorIcon,
  "OBS Studio": ObsStudioIcon,
  Twitch: TwitchIcon,
};

const FAVICON_SIZE = 64; // Google returns better quality at 64+

function ToolIcon({ name, size = 18 }: { name: string; size?: number }) {
  const icon = TOOL_ICONS[name];
  if (!icon) return null;
  if (typeof icon === "string") {
    if (icon.startsWith("http") || icon.startsWith("/")) {
      return (
        <span className="inline-flex shrink-0 items-center justify-center [&>img]:size-6 [&>img]:object-contain">
          <img
            src={icon}
            alt=""
            width={24}
            height={24}
            className="tool-logo-custom block opacity-90"
          />
        </span>
      );
    }
    if (icon.startsWith("favicon:")) {
      const domain = icon.slice(8);
      return (
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${FAVICON_SIZE}`}
          alt=""
          width={size}
          height={size}
          className="skills-tool-icon-subskills block max-h-full max-w-full shrink-0 opacity-90"
        />
      );
    }
    return (
      <img
        src={`https://cdn.simpleicons.org/${icon}/ffffff`}
        alt=""
        width={size}
        height={size}
        className="skills-tool-icon-subskills block max-h-full max-w-full shrink-0 opacity-90"
      />
    );
  }
  const Icon = icon;
  return <Icon size={size} className="block shrink-0 text-portfolio-green opacity-90" />;
}

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

// Stacked panel: 380?420ms, decisive, no bounce (anime-tech / Persona-adjacent)
const PANEL_TRANSITION = {
  duration: 0.4,
  ease: [0.65, 0, 0.35, 1] as const, // slightly smoother cubic-bezier
};
const CONTENT_SETTLE_DELAY = 0.06; // 60ms after panel settles

/** Drift duration (seconds) — must match `gridDriftSmooth` in `index.css`. */
const GRID_DRIFT_DURATION = 12;
const GRID_CELL_SIZE = 48;

/**
 * Negative animation-delay so newly mounted overlays join the same wall-clock
 * phase without a perpetual root `setProperty` rAF (that starved hero letter CSS).
 */
function gridDriftPhaseDelaySec(): number {
  return -((performance.now() % (GRID_DRIFT_DURATION * 1000)) / 1000);
}

/** WebKit/iOS: thin 1px dual-gradient grids can composite away at ~4% opacity; repeating + webkit size is more reliable. */
const GRID_OVERLAY_STYLE_BASE: React.CSSProperties = {
  backgroundColor: "#121212",
  backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px), repeating-linear-gradient(0deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px)`,
  backgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
  WebkitBackgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
};

/** Stable per-mount style — delay frozen so React re-renders do not restart drift. */
function useSyncedGridOverlayStyle(): React.CSSProperties {
  const styleRef = useRef<React.CSSProperties | null>(null);
  if (styleRef.current == null) {
    const delay = `${gridDriftPhaseDelaySec()}s`;
    styleRef.current = {
      ...GRID_OVERLAY_STYLE_BASE,
      // CSS var + inline delay keep phase sync without a root rAF style write.
      ["--portfolio-grid-drift-delay" as string]: delay,
      animationDelay: delay,
    };
  }
  return styleRef.current;
}

/** Mount-only backdrop; drift phase synced via negative animation-delay. */
function SideNavGridBackdrop() {
  const style = useSyncedGridOverlayStyle();
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 grid-drift-bg portfolio-grid-overlay"
      style={style}
      aria-hidden
    />
  );
}

/** Hero / menu slide grid — same sync pattern as section overlays. */
function SlideGridOverlay() {
  const style = useSyncedGridOverlayStyle();
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 grid-drift-bg portfolio-grid-overlay"
      style={style}
      aria-hidden
    />
  );
}

// Motion-only glow on leading accent edge: faint light-bleed, 10?15% opacity, 8?16px blur
const ACCENT_GLOW = {
  blur: 12,
  opacity: 0.12,
};
/** Panel edge glow: supports `#rrggbb` or any CSS color (e.g. `var(--palette-blue)`). */
function accentGlowShadow(color: string, active: boolean): string {
  if (!active) return "none";
  const pct = Math.round(ACCENT_GLOW.opacity * 100);
  if (color.startsWith("#") && (color.length === 7 || color.length === 9)) {
    const hexAlpha = Math.round(ACCENT_GLOW.opacity * 255).toString(16).padStart(2, "0");
    return `0 0 ${ACCENT_GLOW.blur}px ${color.length === 7 ? color + hexAlpha : color}`;
  }
  return `0 0 ${ACCENT_GLOW.blur}px color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

/** Leading panel edge during wipe — PROJECTS uses full yellow so the line reads during the slide. */
function sectionPanelEdgeAccent(sectionId: string): string {
  if (
    sectionId === "projects" ||
    sectionId === "projects-supporting" ||
    sectionId.startsWith("project-")
  ) {
    return "var(--palette-yellow-projects)";
  }
  return SECTION_ACCENT_COLOR[sectionId] ?? "var(--palette-blue)";
}

// --- TEXT SHUTTER (Persona-style directional reveal, inspired by The Line Studio / Framer) ---
/** Stagger rank for center-out character reveal (0 = first letter to appear). */
const centerOutCharStaggerRank = (index: number, length: number): number => {
  const order: number[] = [];
  let left = Math.floor((length - 1) / 2);
  let right = Math.ceil((length - 1) / 2);
  while (order.length < length) {
    if (left >= 0 && !order.includes(left)) order.push(left);
    if (right < length && right !== left && !order.includes(right)) order.push(right);
    left--;
    right++;
  }
  return order.indexOf(index);
};

type TextShutterProps = {
  text: string;
  className?: string;
  direction?: "ltr" | "rtl" | "center" | "center-type";
  duration?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "p";
  delay?: number;
  /** Split by "words" (spaces) or "chars" for letter-by-letter */
  split?: "words" | "chars" | "none";
  /** "mount" = animate on load; "viewport" = animate when scrolled into view */
  trigger?: "mount" | "viewport";
  /** When trigger is viewport: if false, animation resets when leaving view so it plays again on re-entry */
  viewportOnce?: boolean;
  /** When trigger is mount: false keeps shutter closed until true (panel-gated entrances). */
  play?: boolean;
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
  viewportOnce = true,
  fade = false,
  play = true,
}: TextShutterProps & { fade?: boolean }) => {
  const isCenterType = direction === "center-type";
  const closedClip =
    direction === "center"
      ? "inset(0 50% 0 50%)"
      : direction === "ltr"
        ? "inset(0 100% 0 0)"
        : "inset(0 0 0 100%)";
  const openClip = "inset(0 0 0 0)";

  const effectiveSplit = isCenterType ? "chars" : split;
  const parts =
    effectiveSplit === "words"
      ? text.split(/\s+/)
      : effectiveSplit === "chars"
        ? Array.from(text)
        : [text];
  const isSpace = effectiveSplit === "words" && parts.length > 1;
  const useOpacity = fade || isCenterType;

  const MotionTag = motion[Tag] as typeof motion.span;

  const transition = (i: number) => ({
    duration,
    delay:
      delay +
      (isCenterType ? centerOutCharStaggerRank(i, parts.length) : i) * stagger,
    ease: EASE.out,
  });

  return (
    <MotionTag className={className} style={{ overflow: "visible" }}>
      {parts.map((part, i) => (
        <motion.span
          key={i}
          initial={useOpacity ? { opacity: 0 } : { clipPath: closedClip }}
          {...(trigger === "viewport"
            ? {
                whileInView: useOpacity ? { opacity: 1 } : { clipPath: openClip },
                viewport: { once: viewportOnce, margin: "-40px 0px -40px 0px" },
                transition: transition(i),
              }
            : {
                animate: useOpacity
                  ? { opacity: play ? 1 : 0 }
                  : { clipPath: play ? openClip : closedClip },
                transition: transition(i),
              })}
          style={{
            display: "inline-block",
            overflow: useOpacity ? "visible" : "hidden",
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

const SLIDE_NO_Y_SCROLL =
  "no-scrollbar w-screen h-screen flex-shrink-0 snap-start overflow-y-hidden overflow-x-hidden";

/** Extra top clearance for fixed nav + section headers (mobile/tablet only). */
const TOP_NAV_FIXED_TOP =
  "top-[max(calc(0.875rem+0.625rem),calc(env(safe-area-inset-top,0px)+1.125rem))] lg:top-6";
/** Fixed top-right / section back icon buttons — no fill (all breakpoints). */
const TOP_NAV_ICON_BUTTON_CLASS =
  "h-11 w-11 sm:h-14 sm:w-14 min-h-0 min-w-0 rounded-full border-0 bg-transparent p-0 text-white shadow-none transition-colors duration-200 hover:bg-transparent hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
/** #experience inner horizontal inset layers (mobile/tablet) — after `container px-5 sm:px-6`. */
const EXPERIENCE_GUTTER_OUTER_MAX_LG = "max-lg:px-1 max-lg:sm:px-2";
const EXPERIENCE_GUTTER_INNER_MAX_LG = "max-lg:px-2 max-lg:sm:px-4";
const EXPERIENCE_GUTTER_SHELL_OUTER = `w-full min-w-0 ${EXPERIENCE_GUTTER_OUTER_MAX_LG}`;
const EXPERIENCE_GUTTER_SHELL_INNER = `w-full min-w-0 ${EXPERIENCE_GUTTER_INNER_MAX_LG}`;

const scrollToId = (id: string, behavior: ScrollBehavior = "smooth") => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior, block: "nearest", inline: "start" });
};

const PROFILE_ACCENT_SOFT = "var(--palette-red)";
const NAV_SUBHEAD_GRAY = "color-mix(in srgb, var(--color-mono-2) 70%, transparent)";
const PROJECTS_ACCENT_SOFT = "var(--palette-yellow-projects)";

const NAV_ITEMS: { id: string; label: string; icon: LucideIcon; color: string; sub: string; microLabel: string }[] = [
  { id: "profile", label: "PROFILE", sub: "Summary", icon: User, color: "[background-color:var(--palette-red)]", microLabel: "OPEN" },
  { id: "projects", label: "PROJECTS", sub: "Projects", icon: Zap, color: "[background-color:var(--palette-yellow-projects)]", microLabel: "VIEW" },
  { id: "experience", label: "EXPERIENCE", sub: "Career History", icon: Star, color: "[background-color:var(--palette-blue)]", microLabel: "ENTER" },
  { id: "skills", label: "SKILLS", sub: "Skills", icon: Briefcase, color: "[background-color:var(--palette-green)]", microLabel: "OPEN" },
  { id: "social", label: "CONTACT", sub: "Contact", icon: Heart, color: "[background-color:var(--palette-orange)]", microLabel: "VIEW" },
];

// Section id ? panel edge accent (CSS vars from src/styles/portfolio-palette.css)
const SECTION_ACCENT_COLOR: Record<string, string> = {
  profile: PROFILE_ACCENT_SOFT,
  projects: PROJECTS_ACCENT_SOFT,
  "project-visual-design": PROJECTS_ACCENT_SOFT,
  "project-video-editing": PROJECTS_ACCENT_SOFT,
  "project-interactive-media": PROJECTS_ACCENT_SOFT,
  "project-slaywire": PROJECTS_ACCENT_SOFT,
  "projects-supporting": PROJECTS_ACCENT_SOFT,
  experience: "var(--palette-blue)",
  social: "var(--palette-orange)",
  skills: "var(--palette-green)",
};

const CMD_HOVER = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };
const CMD_HOVER_MS = CMD_HOVER.duration * 1000;

/** Accent underline wait before section nav; 0 when hover line is already fully extended. */
function cmdNavLineRemainingMs(
  id: string,
  hoveredId: string | null,
  lineHoverSinceRef: MutableRefObject<Partial<Record<string, number>>>,
): number {
  const hoverStarted = lineHoverSinceRef.current[id];
  if (
    hoveredId === id &&
    hoverStarted !== undefined &&
    performance.now() - hoverStarted >= CMD_HOVER_MS
  ) {
    return 0;
  }
  const startedAt = hoverStarted ?? performance.now();
  if (hoverStarted === undefined) {
    lineHoverSinceRef.current[id] = startedAt;
  }
  return Math.max(0, CMD_HOVER_MS - (performance.now() - startedAt));
}

function isCmdNavLineFullyOut(
  id: string,
  hoveredId: string | null,
  lineHoverSinceRef: MutableRefObject<Partial<Record<string, number>>>,
): boolean {
  const hoverStarted = lineHoverSinceRef.current[id];
  return (
    hoveredId === id &&
    hoverStarted !== undefined &&
    performance.now() - hoverStarted >= CMD_HOVER_MS
  );
}

function TextFade({
  direction,
  children,
  className = "",
  staggerChildren = 0.1,
}: {
  direction: "up" | "down";
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  const FADE_VARIANTS = {
    show: { opacity: 1, y: 0, transition: { type: "spring" as const } },
    hidden: { opacity: 0, y: direction === "down" ? -18 : 18 },
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const className = (child.props as { className?: string }).className;
        return typeof className === "string" ? (
          <motion.div variants={FADE_VARIANTS} className={className}>
            {child}
          </motion.div>
        ) : (
          <motion.div variants={FADE_VARIANTS}>{child}</motion.div>
        );
      })}
    </motion.div>
  );
}

const TOP_NAV_DESKTOP_MIN_PX = 1024;
const TOP_NAV_TABLET_MIN_PX = 768;
const TOP_NAV_TABLET_MAX_PX = 1366;
const TOP_NAV_TABLET_PORTRAIT_MQ = `(min-width: ${TOP_NAV_TABLET_MIN_PX}px) and (max-width: 1023.98px)`;
const TOP_NAV_TABLET_LANDSCAPE_MQ = `(min-width: ${TOP_NAV_TABLET_MIN_PX}px) and (max-width: ${TOP_NAV_TABLET_MAX_PX}px) and (orientation: landscape) and (any-pointer: coarse)`;
const TOP_NAV_BACK_BUTTON_OFFSET_Y_MOBILE = -0.2;
const TOP_NAV_BACK_BUTTON_OFFSET_Y_TABLET = 3.8;
const TOP_NAV_BACK_BUTTON_OFFSET_Y_DESKTOP = 7.1;

const matchesTopNavTabletViewport = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(TOP_NAV_TABLET_PORTRAIT_MQ).matches ||
    window.matchMedia(TOP_NAV_TABLET_LANDSCAPE_MQ).matches
  );
};

const BackToMenuButton = ({
  show,
  onBack,
  ariaLabel = "Back to menu",
  fadeOut = false,
  buttonDebug,
  debugActive = false,
}: {
  show: boolean;
  onBack: () => void;
  ariaLabel?: string;
  fadeOut?: boolean;
  buttonDebug: NavIconButtonDebugValues;
  debugActive?: boolean;
}) => {
  const [isTabletViewport, setIsTabletViewport] = useState(matchesTopNavTabletViewport);
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(`(min-width: ${TOP_NAV_DESKTOP_MIN_PX}px)`).matches &&
      !matchesTopNavTabletViewport(),
  );

  useEffect(() => {
    const desktopMq = window.matchMedia(`(min-width: ${TOP_NAV_DESKTOP_MIN_PX}px)`);
    const portraitMq = window.matchMedia(TOP_NAV_TABLET_PORTRAIT_MQ);
    const landscapeMq = window.matchMedia(TOP_NAV_TABLET_LANDSCAPE_MQ);
    const sync = () => {
      const tablet = portraitMq.matches || landscapeMq.matches;
      setIsTabletViewport(tablet);
      setIsDesktopViewport(desktopMq.matches && !tablet);
    };
    sync();
    if (typeof desktopMq.addEventListener === "function") {
      desktopMq.addEventListener("change", sync);
      portraitMq.addEventListener("change", sync);
      landscapeMq.addEventListener("change", sync);
      return () => {
        desktopMq.removeEventListener("change", sync);
        portraitMq.removeEventListener("change", sync);
        landscapeMq.removeEventListener("change", sync);
      };
    }
    desktopMq.addListener(sync);
    portraitMq.addListener(sync);
    landscapeMq.addListener(sync);
    return () => {
      desktopMq.removeListener(sync);
      portraitMq.removeListener(sync);
      landscapeMq.removeListener(sync);
    };
  }, []);

  const baseOffsetY = isDesktopViewport
    ? TOP_NAV_BACK_BUTTON_OFFSET_Y_DESKTOP
    : isTabletViewport
      ? TOP_NAV_BACK_BUTTON_OFFSET_Y_TABLET
      : TOP_NAV_BACK_BUTTON_OFFSET_Y_MOBILE;
  const offsetY = baseOffsetY + (debugActive ? buttonDebug.offsetY : 0);

  const useTabletDesktopSizing = isDesktopViewport || isTabletViewport;
  const iconSizePx = debugActive
    ? (buttonDebug.iconSize ?? 22)
    : isDesktopViewport
      ? 25
      : isTabletViewport
        ? 22
        : 21;

  const buttonStyle = useTabletDesktopSizing
    ? {
        width: `${buttonDebug.size}px`,
        height: `${buttonDebug.size}px`,
        minWidth: `${buttonDebug.size}px`,
        minHeight: `${buttonDebug.size}px`,
        transform: `translate(${buttonDebug.offsetX}px, ${offsetY}px)`,
      }
    : {
        transform: `translate(0px, ${offsetY}px)`,
      };

  return (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: fadeOut ? 0 : 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: DUR.fast, ease: EASE.out }}
        className={`fixed ${TOP_NAV_FIXED_TOP} left-1 z-50 max-sm:-translate-x-0.5 sm:left-4 sm:translate-x-0`}
      >
        <motion.div whileTap={TAP} transition={SPRING.tap}>
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            size="icon"
            aria-label={ariaLabel}
            className={TOP_NAV_ICON_BUTTON_CLASS}
            style={buttonStyle}
          >
            <ArrowLeft
              size={iconSizePx}
              strokeWidth={2}
              aria-hidden
              style={{ width: iconSizePx, height: iconSizePx, minWidth: iconSizePx, minHeight: iconSizePx }}
            />
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
  betweenTitleAndSubtitle,
  className: classNameProp,
  titleDelay = 0,
  titleDuration = 0.45,
  titleStagger = 0.04,
  viewportOnce = true,
  slideFade = false,
  slideFadeDuration,
  slideFadeDelay = 0,
  slideFadeActive,
  titleTrigger = "viewport",
  titleClassName,
  subtitleClassName,
  titleFade = false,
  titleStatic = false,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  color?: string;
  showBar?: boolean;
  compact?: boolean;
  betweenTitleAndSubtitle?: React.ReactNode;
  className?: string;
  /** Delay (seconds) before title animation starts, e.g. to match another element. */
  titleDelay?: number;
  /** Title TextShutter duration (seconds). */
  titleDuration?: number;
  /** Title TextShutter stagger (seconds). */
  titleStagger?: number;
  /** When true, title TextShutter uses viewport once: false so it resets on leave and plays again on entry. */
  viewportOnce?: boolean;
  /** When true, whole header slides up and fades in on entry. */
  slideFade?: boolean;
  /** Duration for slideFade (default 0.4). */
  slideFadeDuration?: number;
  /** Delay before slideFade starts (seconds). */
  slideFadeDelay?: number;
  /** When set, slideFade is driven by this flag instead of whileInView (single trigger, no viewport flicker). */
  slideFadeActive?: boolean;
  /** "mount" = animate once on mount only (no viewport); "viewport" = animate when in view. Use mount to prevent layout shift. */
  titleTrigger?: "mount" | "viewport";
  /** Extra classes for the title heading (e.g. xl/2xl scale). */
  titleClassName?: string;
  /** Optional subtitle classes (replaces default eyebrow styles when set). */
  subtitleClassName?: string;
  /** When true, title animates with a simple fade instead of the clip-path wipe. */
  titleFade?: boolean;
  /** When true, render title text without TextShutter animation. */
  titleStatic?: boolean;
}) => {
  const sizeClasses = "section-main-header-title";

  const baseClass = `flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"} ${
    compact ? "mb-10" : "mb-16"
  } relative z-10 ${classNameProp ?? ""}`;

  const content = (
    <>
      {showBar && (
        <motion.div
          initial={{ scaleX: 0, originX: align === "center" ? 0.5 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="bg-portfolio-blue h-2 w-24 mb-4"
        />
      )}
      <h2
        className={`${sizeClasses} ${titleClassName ?? ""} font-display ${color} leading-[0.95] -translate-y-0.5`}
      >
        {titleStatic ? (
          <span>{title}</span>
        ) : (
          <TextShutter
            text={title}
            as="span"
            direction="ltr"
            duration={titleDuration}
            stagger={titleStagger}
            split="words"
            trigger={titleTrigger}
            delay={titleDelay}
            viewportOnce={viewportOnce}
            fade={titleFade}
          />
        )}
      </h2>
      {betweenTitleAndSubtitle && (
        <div className="mt-4">{betweenTitleAndSubtitle}</div>
      )}
      {subtitle && (
        <p
          className={
            subtitleClassName ??
            "section-subhead-title font-display font-semibold mt-1.5"
          }
        >
          {subtitle}
        </p>
      )}
    </>
  );

  if (slideFade) {
    const slideTransition = {
      duration: slideFadeDuration ?? 0.4,
      ease: EASE.out,
    };
    if (slideFadeActive !== undefined) {
      return (
        <motion.div
          className={baseClass}
          initial={false}
          animate={{
            y: slideFadeActive ? 0 : 14,
            opacity: slideFadeActive ? 1 : 0,
          }}
          transition={{
            ...slideTransition,
            delay: slideFadeActive ? slideFadeDelay : 0,
          }}
        >
          {content}
        </motion.div>
      );
    }
    return (
      <motion.div
        className={baseClass}
        initial={{ y: 14, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: viewportOnce, amount: 0.2 }}
        transition={{ ...slideTransition, delay: slideFadeDelay }}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={baseClass}>{content}</div>;
};

// --- HERO NAME REVEAL ---
// Timed entrance — name + tagline + accent rainbow color fade (line sweep removed).
type HeroNameRevealStep = "hidden" | "sweep" | "reveal" | "done";

/** Kept for color-fade timing parity with the former line fade-out. */
const HERO_NAME_LINE_FADE_MS = 130;
/** Safe-area top inset in px (matches `env(safe-area-inset-top, 0px)`). */
function readSafeAreaInsetTopPx(): number {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;height:env(safe-area-inset-top,0px)";
  document.body.appendChild(probe);
  const px = probe.offsetHeight;
  document.body.removeChild(probe);
  return px;
}

/** Safe-area bottom inset in px (matches `env(safe-area-inset-bottom, 0px)`). */
function readSafeAreaInsetBottomPx(): number {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;height:env(safe-area-inset-bottom,0px)";
  document.body.appendChild(probe);
  const px = probe.offsetHeight;
  document.body.removeChild(probe);
  return px;
}

/**
 * Top edge of `ViewportRuleOfThirdsOverlay` — mobile band only (<768).
 * Mirrors the styled overlay: nav chrome below TOP_NAV_FIXED_TOP.
 */
function measureViewportRuleOfThirdsTopPx(): number {
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const navChromeRem = window.innerWidth >= 640 ? 3.5 : 2.75;
  const fromFixed = (0.875 + 0.625 + navChromeRem) * rootFontSize;
  const fromSafe = readSafeAreaInsetTopPx() + (1.125 + navChromeRem) * rootFontSize;
  return Math.max(fromFixed, fromSafe);
}

/** Vertical center of the rule-of-thirds ruler region (overlay top → viewport bottom). */
function measureViewportRuleOfThirdsCenterYPx(): number {
  return (measureViewportRuleOfThirdsTopPx() + window.innerHeight) / 2;
}

/** Map title lockup center at settle (y=0) to phase-1 reveal center. Mobile: full viewport center. */
function measureHeroPhase1RevealOffsetPx(motionEl: HTMLElement, lockupEl: HTMLElement): number {
  const transform = window.getComputedStyle(motionEl).transform;
  let translateY = 0;
  if (transform && transform !== "none") {
    translateY = new DOMMatrixReadOnly(transform).m42;
  }
  const centerParts = Array.from(lockupEl.querySelectorAll<HTMLElement>("[data-hero-center-part='true']"));
  const targetRect =
    centerParts.length > 0
      ? centerParts
          .map((node) => node.getBoundingClientRect())
          .reduce(
            (acc, rect) => ({
              top: Math.min(acc.top, rect.top),
              bottom: Math.max(acc.bottom, rect.bottom),
              left: Math.min(acc.left, rect.left),
              right: Math.max(acc.right, rect.right),
            }),
            {
              top: Number.POSITIVE_INFINITY,
              bottom: Number.NEGATIVE_INFINITY,
              left: Number.POSITIVE_INFINITY,
              right: Number.NEGATIVE_INFINITY,
            },
          )
      : lockupEl.getBoundingClientRect();
  const settleCenterY = (targetRect.top + targetRect.bottom) / 2 - translateY;
  const isMobileViewport = window.innerWidth < 768;
  const viewportCenterY = isMobileViewport
    ? measureViewportCenterYPx()
    : (window.visualViewport?.offsetTop ?? 0) + (window.visualViewport?.height ?? window.innerHeight) / 2;
  return viewportCenterY - settleCenterY;
}
/** Mobile Phase 1 — layout centers the lockup in 100svh; motion value stays at 0. */
/**
 * Mobile video card height band — keep in sync with `max-md:h-[…min(Nv h…)]` on the card.
 * When this drops, `heroMobileSettleOffsetPx` lifts the SVG by a matching share of Δvh.
 * Vertical placement targets full-viewport thirds — not the nav ruler band.
 */
const HERO_MOBILE_VIDEO_VH = 0.34;
/** Prior mobile video vh — SVG lift uses a fraction of (this − current) so gaps stay even. */
const HERO_MOBILE_VIDEO_VH_LIFT_FROM = 0.42;
/**
 * How much of the video-shorten Δvh pulls the name/SVG up.
 * Keep modest — gap floor clamp owns clearance so SVG never cuts the video on iPhone.
 */
const HERO_MOBILE_SVG_LIFT_FACTOR = 0.36;
/** Mobile settle — mirrors legacy `calc(20vh - 1.25rem)` + extra down nudge (px for Framer tween). */
const HERO_MOBILE_SETTLE_DOWN_NUDGE_REM = 2.15;
/** Minimum visible air between video card bottom and ROBBIE ink (mobile / Safari). */
const HERO_MOBILE_STACK_GAP_PX = 40;
function heroMobileSettleOffsetPx(): number {
  if (typeof window === "undefined") return 0;
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const base =
    window.innerHeight * 0.2 - rootFontSize * 1.25 + rootFontSize * HERO_MOBILE_SETTLE_DOWN_NUDGE_REM;
  /* Lift ROBBIE SVG with the height taken off the video card (partial so gaps stay even). */
  const videoShortenPx =
    window.innerHeight *
    Math.max(0, HERO_MOBILE_VIDEO_VH_LIFT_FROM - HERO_MOBILE_VIDEO_VH) *
    HERO_MOBILE_SVG_LIFT_FACTOR;
  return Math.max(0, base - videoShortenPx);
}

/** Keep in sync with hero video card mobile height clamp (`min(34vh,…)` / max-md). */
function measureHeroMobileVideoHeightPx(): number {
  if (typeof window === "undefined") return 0;
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const safeTop = readSafeAreaInsetTopPx();
  const vhBand = window.innerHeight * HERO_MOBILE_VIDEO_VH;
  const remCap = window.innerHeight - 11 * rootFontSize - Math.max(rootFontSize, safeTop);
  return Math.min(400, Math.max(150, Math.min(vhBand, remCap)));
}

/** Mobile video + SVG width as a fraction of PROFILE content (`px-5` gutters). */
const HERO_MOBILE_LOCKUP_WIDTH_SCALE = 0.9;

/** Mobile content width — PROFILE column × scale (video card + ROBBIE SVG). */
function measureHeroMobileProfileContentWidthPx(): number {
  if (typeof window === "undefined") return 0;
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const profileContent = window.innerWidth - 2 * rootFontSize * HERO_MOBILE_PROFILE_GUTTER_REM;
  return Math.max(0, Math.round(profileContent * HERO_MOBILE_LOCKUP_WIDTH_SCALE));
}

/** Reads the current rendered `translateY` (px) of an element's CSS transform matrix. */
function readTranslateYPx(el: Element | null): number {
  if (!el) return 0;
  const transform = window.getComputedStyle(el).transform;
  if (!transform || transform === "none") return 0;
  try {
    return new DOMMatrixReadOnly(transform).m42;
  } catch {
    return 0;
  }
}

/**
 * Settled ROBBIE ink top (screen px).
 * Uses SVG getBBox + root CTM so CSS letter-cascade translateY/opacity are ignored
 * (getBoundingClientRect mid-anim was pushing the stack then snapping at rest).
 */
function measureHeroNameInkTopSettledPx(): number | null {
  const svg = document.querySelector<SVGSVGElement>('#hero [data-hero-svg-root="true"] svg');
  if (!svg) return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) {
    const lockup = document.querySelector<HTMLElement>('[data-hero-name-lockup="true"]');
    return lockup ? lockup.getBoundingClientRect().top : null;
  }

  let inkTop = Number.POSITIVE_INFINITY;
  const letters = svg.querySelectorAll<SVGGraphicsElement>("[data-hero-name-letter]");
  for (const el of letters) {
    try {
      const bbox = el.getBBox();
      if (bbox.width < 0.5 || bbox.height < 0.5) continue;
      /* Letter paths live in svg user space (no SVG transform attrs). getBBox
       * ignores CSS cascade transforms; root getScreenCTM maps user → screen. */
      const pt = svg.createSVGPoint();
      pt.x = bbox.x;
      pt.y = bbox.y;
      const screen = pt.matrixTransform(ctm);
      inkTop = Math.min(inkTop, screen.y);
    } catch {
      /* getBBox throws if not rendered */
    }
  }

  if (!Number.isFinite(inkTop)) {
    const lockup = document.querySelector<HTMLElement>('[data-hero-name-lockup="true"]');
    if (lockup) return lockup.getBoundingClientRect().top;
    return null;
  }
  return inkTop;
}

/** Full-viewport vertical center (not the nav-aware ruler band). */
function measureViewportCenterYPx(): number {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  return (window.visualViewport?.offsetTop ?? 0) + viewportHeight / 2;
}

/**
 * How far to shift the settled mobile stack so its midpoint matches the
 * full-viewport center (viewport rule of thirds) — not the nav ruler band.
 * `assumedNameY` (the pending "settle" offset) is the coordinate space lockup/button rects
 * are normalized into; video is normalized to its natural (untransformed) grid position.
 * Reads each element's *currently rendered* transform directly (rather than trusting a
 * Framer Motion value's `.get()`, which can be a frame ahead of what's actually painted)
 * so the stack is measured from its true on-screen position and never mis-centers.
 */
function measureMobileHeroRotCenterNudgePx(assumedNameY: number): number {
  const lockup = document.querySelector<HTMLElement>('[data-hero-name-lockup="true"]');
  const nameStackEl = document.querySelector<HTMLElement>('[data-hero-mobile-name-stack="true"]');
  const videoStackEl = document.querySelector<HTMLElement>('[data-hero-mobile-video-stack="true"]');
  const videoEl =
    document.querySelector<HTMLElement>("#hero [data-hero-mobile-video-slot='true']") ??
    document.querySelector<HTMLElement>("#hero article");
  const btns = [...document.querySelectorAll<HTMLElement>("#hero button")].filter((b) => {
    const r = b.getBoundingClientRect();
    return r.height > 20 && r.width > 40;
  });
  if (!lockup || btns.length === 0) return 0;

  /* Normalize the name/button rects into the "assumedNameY" coordinate space, and the
     video rect back to its natural (untransformed) grid position — matching how the
     caller applies the result (`name = settle + nudge`, `video = nudge`). */
  const nameDy = assumedNameY - readTranslateYPx(nameStackEl);
  const videoDy = -readTranslateYPx(videoStackEl);

  const lockupRect = lockup.getBoundingClientRect();
  const lockupTop = lockupRect.top + nameDy;
  const lockupBottom = lockupRect.bottom + nameDy;
  const btnBottom = Math.max(...btns.map((b) => b.getBoundingClientRect().bottom)) + nameDy;

  let stackTop: number;
  let stackBottom: number;

  if (videoEl) {
    const videoRect = videoEl.getBoundingClientRect();
    const videoTop = videoRect.top + videoDy;
    const videoBottom = videoRect.bottom + videoDy;
    stackTop = Math.min(videoTop, lockupTop);
    stackBottom = Math.max(videoBottom, lockupBottom, btnBottom);
  } else {
    /* Video not mounted — estimate from row bottom + known card height. */
    const row = document.querySelector<HTMLElement>("#hero [data-hero-mobile-video-row='true']");
    const rowBottom = row?.getBoundingClientRect().bottom ?? lockupTop;
    const videoH = measureHeroMobileVideoHeightPx();
    const videoTop = rowBottom - videoH;
    stackTop = Math.min(videoTop, lockupTop);
    stackBottom = Math.max(rowBottom, lockupBottom, btnBottom);
  }

  const stackMid = (stackTop + stackBottom) / 2;
  const idealNudge = measureViewportCenterYPx() - stackMid;

  /* Safety clamp — keep CTA on-screen; allow sitting above the nav ruler band. */
  const bottomMargin = 12 + readSafeAreaInsetBottomPx();
  const maxNudge = window.innerHeight - bottomMargin - stackBottom;
  const topMargin = Math.max(8, readSafeAreaInsetTopPx() + 8);
  const minNudge = topMargin - stackTop;
  return Math.max(minNudge, Math.min(idealNudge, maxNudge));
}

function heroDesktopSettleOffsetPx(): number {
  if (typeof window === "undefined") return 0;
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const width = window.innerWidth;
  if (width < 768) return 0;
  if (width < 1024) {
    /* Tablet portrait — keep name + PORTFOLIO tucked under the video (no downward settle). */
    if (window.matchMedia("(orientation: portrait)").matches) return 0;
    return 0.75 * rootFontSize;
  }
  if (width <= 1366) return -1.5 * rootFontSize;
  return -0.75 * rootFontSize;
}
/** Tablet md–lg: portrait packs under video; landscape restores prior centered / video nudge. */
const HERO_TABLET_LANDSCAPE_NAME_CENTER =
  "[@media(min-width:768px)_and_(max-width:1023.98px)_and_(orientation:landscape)]:justify-center [@media(min-width:768px)_and_(max-width:1023.98px)_and_(orientation:landscape)]:pt-0";
const HERO_TABLET_LANDSCAPE_VIDEO_NUDGE =
  "[@media(min-width:768px)_and_(max-width:1023.98px)_and_(orientation:landscape)]:translate-y-8";
const HERO_NAME_SETTLE_DELAY_S = 0.2;
const HERO_NAME_SETTLE_DUR_S = 0.95;
/** @deprecated — video now opens first; kept for any residual timing refs. */
const HERO_VIDEO_REVEAL_START_GAP_S = 0.14;
const HERO_VIDEO_REVEAL_DELAY_S = 0;
const HERO_VIDEO_REVEAL_DELAY_MS = 0;
/** Mobile-only — no longer delaying video; open with desktop. */
const HERO_VIDEO_REVEAL_DELAY_MOBILE_EXTRA_S = 0;
const HERO_SETTLE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** scaleX reveal — no overshoot (y2 ≤ 1) so the card does not pop past full width at the end. */
const HERO_VIDEO_SCALE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HERO_VIDEO_GLOW_DELAY_S = 0.28;
const HERO_VIDEO_GLOW_DUR_S = 0.72;
const HERO_VIDEO_GLOW_PEAK = 0.55;
/** Brief beat after video opens before SVG fade-in. */
/** Brief beat after video starts opening before SVG fade-in (overlaps video scale). */
const HERO_LOCKUP_FADE_AFTER_VIDEO_MS = 120;
/** Slide distance for PORTFOLIO entrance (negative = from the left). */
const HERO_PORTFOLIO_ENTRANCE_X_PX = -28;
/** Shared duration for PORTFOLIO entrance opacity + x (play together). */
const HERO_PORTFOLIO_ENTRANCE_DUR_S = 0.42;
/**
 * PORTFOLIO click→MENU wait (mobile/tablet).
 * Matches snappy `--pressed` morph timings in index.css (wipe + arrows).
 */
const HERO_PORTFOLIO_HOVER_COMPLETE_MS = 420;
/** Min delay before MENU so a quick tap still shows shrink + spring bounce. */
const HERO_PORTFOLIO_TAP_FEEDBACK_MS = 340;
/** PORTFOLIO press-in — slightly slower than global TAP; release uses HERO_PORTFOLIO_TAP_SPRING. */
const HERO_PORTFOLIO_TAP = {
  scale: 0.94,
  transition: { type: "tween", duration: 0.22, ease: EASE.out },
} as const;
/** Softer / slower regrow than SPRING.tap. */
const HERO_PORTFOLIO_TAP_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.52,
} as const;
/** Idle float — starts after entrance (video scale + PORTFOLIO fade) finishes. */
const HERO_IDLE_FLOAT_START_MS = 700;
const HERO_IDLE_FLOAT_Y_PX = 1;
/** Full up↔down cycle. */
const HERO_IDLE_FLOAT_DUR_S = 5.6;
/** Sine samples (× amplitude) for an even, continuous loop with linear tweening. */
const HERO_IDLE_FLOAT_SINE = [0, -0.7071, -1, -0.7071, 0, 0.7071, 1, 0.7071, 0] as const;
/**
 * Mobile — same loop, phase-shifted to start at the most-down sample (+1).
 * Rest pose before float also sits at +amplitude so the SVG never drops into the cycle.
 */
const HERO_IDLE_FLOAT_SINE_FROM_BOTTOM = [1, 0.7071, 0, -0.7071, -1, -0.7071, 0, 0.7071, 1] as const;
const HERO_IDLE_FLOAT_TIMES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1] as const;
/** Subtle edge darkening on hero video card media. */
const HERO_VIDEO_CARD_VIGNETTE =
  "radial-gradient(ellipse 74% 70% at 50% 48%, transparent 26%, rgba(0,0,0,0.4) 100%)";
/** Hero video card width — matches name line span (58rem column + line bleed). */
const HERO_VIDEO_CARD_WIDTH_CLASS =
  "max-[639px]:w-full max-[639px]:max-w-full w-[calc(min(100%,58rem)-8.4rem+2*max(1.25rem,min(4vw,2.5rem)))] sm:w-[calc(min(100%,58rem)-8.9rem+2*max(1.25rem,min(4vw,2.5rem)))]";
/**
 * Mobile hero L/R gutter — must match PROFILE_SECTION_CONTAINER `px-5` (1.25rem).
 * Content width = 100vw − 2× this.
 */
const HERO_MOBILE_PROFILE_GUTTER_REM = 1.25;
/**
 * Mobile-cropped lockup viewBox — trims SVG side padding so the name/rule
 * span the PROFILE content column (rule path M9.0625→243.281 in source).
 */
const HERO_MOBILE_SVG_VIEWBOX = "9.0625 0 234.21875 94";
const HERO_MOBILE_SVG_VIEWBOX_W = 234.21875;
const HERO_MOBILE_SVG_VIEWBOX_H = 94;
/** Mobile hero name — fill PROFILE content width (same L/R gaps as #profile). */
const HERO_NAME_MOBILE_SHELL_CLASS =
  "max-md:mx-auto max-md:w-full max-md:max-w-full max-md:items-center";
const HERO_NAME_MOBILE_NAME_BOX_CLASS = "max-md:!w-full max-md:max-w-full";
const HERO_NAME_MOBILE_TAGLINE_CLASS =
  "max-md:mt-0 max-md:w-full max-md:max-w-full max-md:self-center max-md:translate-x-0 max-md:pl-0 max-md:pr-0 max-md:text-center max-md:tracking-[0.045em] max-md:whitespace-nowrap max-md:text-[clamp(0.55rem,2.95vw,0.924rem)] max-md:max-[400px]:text-[clamp(0.55rem,2.95vw,0.924rem)]";
const HERO_NAME_MOBILE_DISPLAY_FONT_CLASS =
  "max-md:text-[clamp(3.407rem,14.55vw,5.082rem)] max-md:max-[400px]:text-[clamp(3.176rem,13.4vw,5.082rem)]";
/**
 * Mobile PORTFOLIO CTA — content-sized (no band); presence via type/padding/hit target only.
 */
const HERO_NAME_MOBILE_PORTFOLIO_BUTTON_CLASS =
  "max-md:!h-auto max-md:!min-h-[2.55rem] max-md:!max-h-none max-md:!px-[1.25rem] max-md:!py-2 max-md:text-[0.72rem] max-md:[&_.texts]:gap-1 max-md:[&_.texts]:text-[0.72rem] max-md:[&_.texts]:!tracking-normal";
const HERO_NAME_SWEEP_MS = 700;
const HERO_NAME_SPLIT_MS = 600;
/** Rainbow accents — main-menu section colors (NAV order) for name/tagline/accent fades. */
const HERO_NAME_RAINBOW_MENU_IDS = ["profile", "projects", "experience", "skills", "social"] as const;
/** >1 shortens color-fade durations (2.25 = 50% faster twice from baseline). */
const HERO_NAME_COLOR_FADE_SPEED = 2.25;
const heroNameColorFadeMs = (ms: number) => Math.round(ms / HERO_NAME_COLOR_FADE_SPEED);
const HERO_NAME_RAINBOW_STAGGER_MS = heroNameColorFadeMs(72);
const HERO_NAME_LAST_RAINBOW_DELAY_MS =
  HERO_NAME_RAINBOW_STAGGER_MS * HERO_NAME_RAINBOW_MENU_IDS.length;
/** Rainbow flash — soft crossfade through section accents into white. */
const HERO_NAME_TEXT_RAINBOW_LAYER_MS = heroNameColorFadeMs(
  HERO_NAME_SPLIT_MS + HERO_NAME_LINE_FADE_MS + 280,
);
/** White resolve — starts after the color cascade begins to settle. */
const HERO_NAME_TEXT_WHITE_DELAY_MS = heroNameColorFadeMs(HERO_NAME_SPLIT_MS + 80);
const HERO_NAME_TEXT_WHITE_LAYER_MS =
  HERO_NAME_LAST_RAINBOW_DELAY_MS + heroNameColorFadeMs(HERO_NAME_LINE_FADE_MS + 220);
/** Entrance — white resolve complete (from reveal start). */
const HERO_NAME_TEXT_ENTRANCE_MS =
  HERO_NAME_TEXT_WHITE_DELAY_MS + HERO_NAME_TEXT_WHITE_LAYER_MS;
/** Brief hold after color fades resolve before settle / video. */
const HERO_NAME_COLOR_FADE_BEAT_MS = 320;
/** Name reveal start → color fades done + beat (gates settle phase). */
const HERO_NAME_PHASE1_COMPLETE_MS =
  HERO_NAME_SWEEP_MS + HERO_NAME_TEXT_ENTRANCE_MS + HERO_NAME_COLOR_FADE_BEAT_MS;
const HERO_NAME_EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Gentle ease across rainbow layers and into white. */
const HERO_NAME_TEXT_BLEND_EASE: [number, number, number, number] = [0.33, 0.0, 0.2, 1];
const HERO_NAME_TEXT_RAINBOW_BLEND_OPACITY = [0, 0.18, 0.42, 0.68, 0.78, 0.55, 0.3, 0.12, 0] as const;
const HERO_NAME_TEXT_RAINBOW_BLEND_TIMES = [0, 0.14, 0.3, 0.46, 0.6, 0.74, 0.86, 0.94, 1] as const;
const HERO_NAME_TEXT_WHITE_BLEND_OPACITY = [0, 0.05, 0.14, 0.3, 0.5, 0.7, 0.86, 0.95, 1] as const;
const HERO_NAME_TEXT_WHITE_BLEND_TIMES = [0, 0.1, 0.22, 0.38, 0.54, 0.7, 0.84, 0.93, 1] as const;
const HERO_NAME_TEXT_MASTER_FADE_MS = heroNameColorFadeMs(280);

/** Shared transitions — ROBBIE / MCLAUGHLIN / tagline / accent strip stay locked in sync. */
const heroNameMasterFadeTransition = (isVisible: boolean) => ({
  duration: isVisible ? HERO_NAME_TEXT_MASTER_FADE_MS / 1000 : 0,
  delay: 0,
  ease: HERO_NAME_TEXT_BLEND_EASE,
});

const heroNameRainbowLayerTransition = (isVisible: boolean, index: number) => ({
  duration: HERO_NAME_TEXT_RAINBOW_LAYER_MS / 1000,
  delay: isVisible ? (HERO_NAME_RAINBOW_STAGGER_MS * (index + 1)) / 1000 : 0,
  times: [...HERO_NAME_TEXT_RAINBOW_BLEND_TIMES],
  ease: HERO_NAME_TEXT_BLEND_EASE,
});

const heroNameWhiteLayerTransition = (isVisible: boolean) => ({
  duration: HERO_NAME_TEXT_WHITE_LAYER_MS / 1000,
  delay: isVisible ? HERO_NAME_TEXT_WHITE_DELAY_MS / 1000 : 0,
  times: [...HERO_NAME_TEXT_WHITE_BLEND_TIMES],
  ease: HERO_NAME_TEXT_BLEND_EASE,
});

/** Layout-metrics copy for the invisible tagline row (SVG tagline is the visible source). */
const HERO_TAGLINE_TEXT = "Writer · content production · social media";
/** Split lockup — first N `#FFFFFF` name paths are ROBBIE (6) + MCLAUGHLIN (10). */
const HERO_NAME_LETTER_COUNT = 16;
/** Cascade spacing — readable left→right pop across ROBBIE + MCLAUGHLIN. */
const HERO_NAME_LETTER_STAGGER_MS = 32;
/** Keep in sync with `animation-duration` on `[data-hero-name-letter]` in index.css. */
const HERO_NAME_LETTER_DURATION_MS = 324;
/** Name cascade end (from chrome/latch start) — gates tagline cascade reveal. */
const HERO_NAME_CASCADE_MS =
  (HERO_NAME_LETTER_COUNT - 1) * HERO_NAME_LETTER_STAGGER_MS + HERO_NAME_LETTER_DURATION_MS;
/**
 * Tagline letter cascade — gated after name.
 * Stream order: WRITER → X1 → CONTENT PRODUCTION → X2 → SOCIAL MEDIA.
 * Stagger is scaled so the full stream finishes in the same wall-clock window
 * as ROBBIE+MCLAUGHLIN (same letter duration / ease; denser stagger for more glyphs).
 */
/** Glyph counts in cream-path order (spaces are not paths). */
const HERO_TAGLINE_WRITER_LEN = 6;
const HERO_TAGLINE_CONTENT_LEN = 17;
const HERO_TAGLINE_SOCIAL_LEN = 11;
/** Stagger slots for · separators in the left→right stream. */
const HERO_TAGLINE_X1_DELAY_INDEX = HERO_TAGLINE_WRITER_LEN;
const HERO_TAGLINE_X2_DELAY_INDEX =
  HERO_TAGLINE_WRITER_LEN + 1 + HERO_TAGLINE_CONTENT_LEN;
/** Total cascade slots including X1 / X2. */
const HERO_TAGLINE_STREAM_LEN =
  HERO_TAGLINE_WRITER_LEN + 1 + HERO_TAGLINE_CONTENT_LEN + 1 + HERO_TAGLINE_SOCIAL_LEN;
const HERO_TAGLINE_STAGGER_MS = Math.max(
  1,
  Math.round(
    ((HERO_NAME_LETTER_COUNT - 1) * HERO_NAME_LETTER_STAGGER_MS) /
      (HERO_TAGLINE_STREAM_LEN - 1),
  ),
);
/** Tagline cascade end (from tagline latch / `data-hero-tagline-animate`). */
const HERO_TAGLINE_CASCADE_MS =
  (HERO_TAGLINE_STREAM_LEN - 1) * HERO_TAGLINE_STAGGER_MS + HERO_NAME_LETTER_DURATION_MS;
/**
 * PORTFOLIO slide+fade — only after ROBBIE/MCLAUGHLIN + tagline cascades both finish
 * (from lockup reveal: sweep → name cascade → tagline cascade).
 */
const HERO_PORTFOLIO_ENTRANCE_AFTER_SVG_MS =
  HERO_NAME_SWEEP_MS + HERO_NAME_CASCADE_MS + HERO_TAGLINE_CASCADE_MS;

/** Cream glyph index → stagger slot (inserts X1 / X2 beats between phrases). */
const heroTaglineGlyphDelayIndex = (glyphIndex: number) => {
  if (glyphIndex < HERO_TAGLINE_WRITER_LEN) return glyphIndex;
  if (glyphIndex < HERO_TAGLINE_WRITER_LEN + HERO_TAGLINE_CONTENT_LEN) {
    return glyphIndex + 1; // after X1
  }
  return glyphIndex + 2; // after X1 + X2
};

/** Inline hero lockup SVG — tag paths for stagger only; do not alter Frame 5 artwork. */
const prepareHeroLockupSvg = (raw: string) => {
  // Drop Figma-hidden red phrase blobs if they still export.
  let out = raw.replace(/<path d="[^"]*" fill="#FF4A4A"\/>/g, "");
  // Tagline × separators — assign by x-position (SVG DOM order is X2 then X1).
  out = out.replace(
    /<path d="(M(?:53\.5486|174\.052)[^"]*)" fill="(?:white|#FFFFFF|#ffffff)"\/>/g,
    (_match, d: string) => {
      const isX1 = d.startsWith("M53.5486");
      const i = isX1 ? HERO_TAGLINE_X1_DELAY_INDEX : HERO_TAGLINE_X2_DELAY_INDEX;
      const part = isX1 ? "x1" : "x2";
      return (
        `<path data-hero-tagline-sep="true" data-hero-tagline-part="${part}" d="${d}" fill="#FFFFFF" ` +
        `style="animation-delay:${i * HERO_TAGLINE_STAGGER_MS}ms"/>`
      );
    },
  );
  let letterIdx = 0;
  let taglineIdx = 0;
  /* Name + tagline ink — pure white. */
  out = out.replace(/<path d="([^"]*)" fill="(?:#FFFAEE|#FFFFFF|#ffffff)"\/>/g, (_match, d: string) => {
    if (letterIdx < HERO_NAME_LETTER_COUNT) {
      const i = letterIdx;
      const row = i < 6 ? "robbie" : "mclaughlin";
      const rowIndex = i < 6 ? i : i - 6;
      letterIdx += 1;
      // animation-delay survives SVG re-inject; keyframes run when root animate flag flips.
      return (
        `<path data-hero-name-letter="${i}" data-hero-name-row="${row}" data-hero-name-index="${rowIndex}" ` +
        `d="${d}" fill="#FFFFFF" style="animation-delay:${i * HERO_NAME_LETTER_STAGGER_MS}ms"/>`
      );
    }
    const glyphIndex = taglineIdx;
    const i = heroTaglineGlyphDelayIndex(glyphIndex);
    const part =
      glyphIndex < HERO_TAGLINE_WRITER_LEN
        ? "writer"
        : glyphIndex < HERO_TAGLINE_WRITER_LEN + HERO_TAGLINE_CONTENT_LEN
          ? "content"
          : "social";
    taglineIdx += 1;
    letterIdx += 1;
    return (
      `<path data-hero-tagline-letter="${glyphIndex}" data-hero-tagline-part="${part}" ` +
      `d="${d}" fill="#FFFFFF" style="animation-delay:${i * HERO_TAGLINE_STAGGER_MS}ms"/>`
    );
  });
  /*
   * Divider rule under MCLAUGHLIN.
   * Source wraps it in a drop-shadow <g filter>; CSS opacity on that filtered group
   * plus meet-scaling turns the 0.5uu hairline into a sub-pixel stroke that vanishes
   * on mobile / iPad (desktop preserveAspectRatio="none" scales it past ~1px).
   * Unwrap the filter and keep a device-pixel stroke so the rule stays visible.
   */
  out = out.replace(
    /<g filter="url\(#filter0_d_65_191\)">\s*<path d="M9\.0625 77\.25L243\.281 77\.25"[^/]*\/>\s*<\/g>/,
    '<path data-hero-name-rule="true" d="M9.0625 77.25L243.281 77.25" stroke="#FFFFFF" stroke-width="1.25" stroke-linejoin="bevel" vector-effect="non-scaling-stroke"/>',
  );
  /* Fallback if the filter wrapper is already gone in a future export. */
  out = out.replace(
    /<path d="M9\.0625 77\.25L243\.281 77\.25" stroke="(?:white|#FFFFFF|#ffffff)"[^/]*\/>/,
    '<path data-hero-name-rule="true" d="M9.0625 77.25L243.281 77.25" stroke="#FFFFFF" stroke-width="1.25" stroke-linejoin="bevel" vector-effect="non-scaling-stroke"/>',
  );
  return out
    .replace(/\swidth="283"/, ' width="100%"')
    .replace(/\sheight="94"/, ' height="100%"')
    .replace(
      "<svg ",
      '<svg class="block h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true" ',
    );
};
const HERO_ROB_LOCKUP_SVG = prepareHeroLockupSvg(robHeroSplitSvgRaw);

/** Hero name accent strip — first column icon (replaces Tabler pencil mark in hero only). */
function HeroAccentFirstIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={`origin-center scale-[1.22] ${className ?? ""}`.trim()}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="m348 933.47-131.95 55.172 55.172-131.95zm566.06-553.78s-135.47 141.19-199.97 206.26h-106.27c-74.25 0-134.39 60.188-134.39 134.39 0 28.406 15.516 53.203 38.484 66.422l-124.26 123.98-91.312-91.312c3.8438-1.2656 7.125-3.6562 9.4219-6.8438 47.156-10.734 84.516-48.938 92.953-98.297l0.375-2.3438 423-423zm-240.61 417.19 22.922 17.156c11.625 8.7188 13.266 25.547 3.5625 36.328-23.297 25.922-62.391 30.094-90.609 9.7031l-68.391-49.312 13.969-13.875zm-172.92-528.79c13.359-13.828 32.812-19.875 51.656-16.031l173.16 35.344c11.531 2.3438 20.531 8.6719 29.766 15.469l-167.11 167.16-38.719-14.906c-20.344-7.8281-43.406-3.1875-59.156 11.953l-85.641 82.219c-12.188 11.719-20.344 27.047-23.156 43.734l-19.594 114.98c-6.8906 40.5-42 70.125-83.062 70.125-18.094 0-32.391-14.531-32.766-32.062l27.469-226.64c1.5-12.141 6.8906-23.484 15.422-32.297zm474.47 144.42c10.359 0 18.75 8.3906 18.75 18.75v243.74c0 10.359-8.3906 18.75-18.75 18.75h-67.641c-17.484 0-34.641 4.9219-49.5 14.156l-69.188 42.984c-8.9062 5.5312-19.219 8.4844-29.719 8.4844h-208.97c-21.562 0-39.047-17.484-39.047-39.047 0-53.531 43.359-96.891 96.891-96.891h114.05c6.375 0 12-3.1875 15.422-8.0625 0.89062-0.65625 1.7812-1.3594 2.5781-2.1562l199.13-200.72zm-458.9 81.609c5.25-5.0625 12.938-6.6094 19.734-3.9844l23.156 8.9062-149.02 148.97 8.2969-48.703c1.5-8.7656 5.7656-16.828 12.188-22.969zm366.37-265.55c21.984-21.984 57.609-21.984 79.547 0l14.109 14.109c22.078 22.078 21.141 57.375 0 79.547l-33.844 33.844-93.656-93.656z"
      />
    </svg>
  );
}

/** Hero name accent strip — second column icon (replaces Tabler desktop mark in hero only). */
function HeroAccentSecondIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={`origin-center scale-[1.08] ${className ?? ""}`.trim()}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="m37.641 931.69c0 17.25 14.062 31.266 31.266 31.266h109.45v-62.156h-109.45c-17.25 0-31.266 14.016-31.266 30.891z"
      />
      <path
        fill="currentColor"
        d="m380.06 962.95h305.53c4.4062-22.875 14.438-44.109 28.453-62.156h-333.98z"
      />
      <path
        fill="currentColor"
        d="m175.13 772.87h628.31l-66.938-89.812c-21.234-28.453-30.094-63.328-24.844-98.25 5.2031-34.875 23.672-65.766 52.125-87 9.2344-6.7969 20.062-10.406 30.891-10.406 16.031 0 31.688 7.2188 42.094 21.234l112.69 150.74c2.0156-10.031 3.1875-20.859 3.1875-31.688v-368.06c0-80.203-64.969-145.18-145.13-145.18l-632.39 0.046875c-80.203 0-145.13 64.969-145.13 145.18v368.06c0 80.203 64.969 145.18 145.13 145.18zm178.03-454.26c0-30.891 33.281-50.531 60.562-35.672l225.32 125.11c28.078 15.656 28.078 55.734 0 71.391l-225.32 125.11c-26.859 14.812-60.562-4.8281-60.562-35.672z"
      />
      <path
        fill="currentColor"
        d="m1090.6 897.79c-13.5-2.2031-26.484-1.3594-38.578 1.7812-7.5 1.9219-15.422-1.2188-20.016-7.4531l-42.234-56.672 136.78-183.56c26.438-35.531 19.078-85.781-16.547-112.31l-157.55 211.6-157.6-211.6c-35.625 26.531-42.984 76.781-16.547 112.31l136.78 183.56-42.234 56.672c-4.6406 6.1875-12.516 9.375-20.016 7.4062-13.734-3.5625-28.734-4.1719-44.344-0.65625-37.078 8.25-66.141 38.766-72.328 76.172-9.7969 59.062 35.766 110.44 93.234 110.44 52.172 0 94.547-42.375 94.547-94.406 0-17.766-4.9688-34.406-13.547-48.609-4.0781-6.75-3.2812-15.328 1.4062-21.609l40.641-54.469 40.547 54.469c4.6875 6.3281 5.4375 14.906 1.4062 21.609-11.297 18.703-16.359 41.531-12.047 65.719 7.1719 40.078 40.406 71.484 80.859 76.594 61.359 7.7344 113.16-43.688 106.12-104.81-4.7812-41.531-37.453-75.469-78.797-82.125zm-261.19 132.47c-21.609 0-39.234-17.625-39.234-39.188 0-21.609 17.625-39.281 39.234-39.281s39.281 17.578 39.281 39.281-17.625 39.188-39.281 39.188zm123.05-201.71c-13.641 0-24.703-11.062-24.703-24.609 0-13.594 11.062-24.656 24.703-24.656s24.656 11.062 24.656 24.656-11.062 24.609-24.656 24.609zm123 201.71c-21.703 0-39.328-17.625-39.328-39.188 0-21.609 17.625-39.281 39.328-39.281s39.234 17.578 39.234 39.281-17.625 39.188-39.234 39.188z"
      />
      <path
        fill="currentColor"
        d="m261.42 841.08h35.391c17.109 0 30.984 17.109 30.984 30.984v119.53c0 17.109-13.875 30.984-30.984 30.984h-35.391c-17.109 0-30.984-17.109-30.984-30.984v-119.53c0-17.109 13.875-30.984 30.984-30.984z"
      />
    </svg>
  );
}

/** Hero name accent strip — third column icon (replaces Tabler video mark in hero only). */
function HeroAccentThirdIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="m311.47 243.75h73.488l-21.43 75h-73.484zm176.03 56.25v225h-131.25v67.238c0 12.004-4.7695 23.516-13.258 32.004-8.4883 8.4883-20 13.258-32.008 13.258-12.004 0-23.516-4.7695-32.004-13.258l-99.242-99.242h-48.488c-24.855-0.027344-48.684-9.9141-66.258-27.492-17.578-17.574-27.465-41.402-27.492-66.258v-300c0.027344-24.855 9.9141-48.684 27.492-66.258 17.574-17.578 41.402-27.465 66.258-27.492h450c24.855 0.027344 48.684 9.9141 66.258 27.492 17.578 17.574 27.465 41.402 27.492 66.258v37.5h-56.25c-34.797 0.042969-68.156 13.883-92.762 38.488s-38.445 57.965-38.488 92.762zm18.75-75c0.003906-4.9727-1.9727-9.7461-5.4883-13.262s-8.2891-5.4922-13.262-5.4883h-52.816l14.602-51.105c1.8164-6.4375 0.066406-13.352-4.5898-18.152-4.6562-4.8008-11.516-6.7578-18.004-5.1367-6.4883 1.6211-11.625 6.5742-13.477 13l-17.543 61.395h-73.488l14.602-51.105c1.8164-6.4375 0.066406-13.352-4.5898-18.152-4.6562-4.8008-11.516-6.7578-18.004-5.1367-6.4883 1.6211-11.625 6.5742-13.477 13l-17.543 61.395h-58.172c-6.6992 0-12.887 3.5742-16.238 9.375-3.3477 5.8008-3.3477 12.949 0 18.75 3.3516 5.8008 9.5391 9.375 16.238 9.375h47.457l-21.43 75h-63.527c-6.6992 0-12.887 3.5742-16.238 9.375-3.3477 5.8008-3.3477 12.949 0 18.75 3.3516 5.8008 9.5391 9.375 16.238 9.375h52.816l-14.602 51.105c-1.3594 4.7812-0.76562 9.9102 1.6484 14.258 2.418 4.3438 6.4609 7.5547 11.242 8.9219 1.6797 0.47266 3.418 0.71094 5.1641 0.71484 4.0703-0.007812 8.0312-1.3359 11.281-3.7891 3.25-2.457 5.6133-5.8984 6.7344-9.8164l17.543-61.395h73.488l-14.602 51.105c-1.3594 4.7812-0.76562 9.9102 1.6484 14.258 2.418 4.3438 6.4609 7.5547 11.242 8.9219 1.6797 0.47266 3.418 0.71094 5.1641 0.71484 4.0703-0.007812 8.0312-1.3359 11.281-3.7891 3.25-2.457 5.6133-5.8984 6.7344-9.8164l17.543-61.395h58.172c6.6992 0 12.887-3.5742 16.238-9.375 3.3477-5.8008 3.3477-12.949 0-18.75-3.3516-5.8008-9.5391-9.375-16.238-9.375h-47.457l21.43-75h63.527c4.9727 0.003906 9.7461-1.9727 13.262-5.4883s5.4922-8.2891 5.4883-13.262zm206.25 187.5v168.75h37.539l-0.039062-168.75zm243.75 18.75h-56.25c-6.4453 0-12.438-3.3086-15.871-8.7617-3.4297-5.457-3.8203-12.289-1.0312-18.102 16.809-35.047 15.309-65.094 6.3359-79.32-1.4805-2.3594-4.5234-6.3164-8.1836-6.3164-5.3477-0.47656-10.656 1.2812-14.668 4.8516-3.0352 3.5625-4.5195 8.1914-4.1172 12.855-0.76562 31.617-13.707 61.719-36.129 84.027-10.609 11.805-23.941 20.844-38.836 26.328v107.12c21.332 17.078 47.684 26.676 75 27.32h93.75c4.9727-0.003906 9.7383-1.9805 13.254-5.4961s5.4922-8.2812 5.4961-13.254v-112.5c-0.003906-4.9727-1.9805-9.7383-5.4961-13.254s-8.2812-5.4922-13.254-5.4961zm206.25-131.25v300c-0.027344 24.855-9.9141 48.684-27.492 66.258-17.574 17.578-41.402 27.465-66.258 27.492h-160.99l-99.242 99.242c-8.4883 8.4883-20 13.258-32.008 13.258-12.004 0-23.516-4.7695-32.004-13.258-8.4883-8.4883-13.258-20-13.258-32.004v-67.238h-112.5c-24.855-0.027344-48.684-9.9141-66.258-27.492-17.578-17.574-27.465-41.402-27.492-66.258v-300c0.027344-24.855 9.9141-48.684 27.492-66.258 17.574-17.578 41.402-27.465 66.258-27.492h450c24.855 0.027344 48.684 9.9141 66.258 27.492 17.578 17.574 27.465 41.402 27.492 66.258zm-150 150c-0.015625-14.914-5.9492-29.211-16.492-39.758-10.547-10.543-24.844-16.477-39.758-16.492h-28.949c10.523-29.098 8.3047-61.281-6.1172-88.66-8.2305-14.379-23.371-23.418-39.934-23.84-15.688-0.66016-30.918 5.3633-41.914 16.57-10.133 11.047-15.301 25.766-14.301 40.723-1.5977 21.242-10.809 41.188-25.945 56.176-3.7266 3.9297-7.8594 7.457-12.324 10.523-1.6875-8.5117-6.2734-16.18-12.977-21.691-6.7031-5.5156-15.109-8.5352-23.789-8.5508h-37.5c-9.9414 0.011719-19.473 3.9688-26.504 10.996-7.0273 7.0312-10.984 16.562-10.996 26.504v168.75c0.011719 9.9414 3.9688 19.473 10.996 26.504 7.0312 7.0273 16.562 10.984 26.504 10.996h37.5c7.1875-0.019531 14.219-2.1016 20.258-6.0039 6.0352-3.8984 10.824-9.4531 13.793-16 23.73 14.168 50.809 21.762 78.449 22.004h93.75c14.914-0.015625 29.211-5.9492 39.758-16.492 10.543-10.547 16.477-24.844 16.492-39.758zm-843.75 581.25c-12.613-0.023438-25.184-1.4062-37.5-4.125v69.75c0 23.445 12.508 45.109 32.812 56.832 20.305 11.723 45.32 11.723 65.625 0 20.305-11.723 32.812-33.387 32.812-56.832v-65.062c-6-0.375-12.375-0.5625-18.75-0.5625zm356.25-233.62v129.75c15.27-8.793 26.945-22.691 32.977-39.246 6.0312-16.555 6.0312-34.703 0-51.258-6.0312-16.555-17.707-30.453-32.977-39.246zm150 46.125h-56.25c-6.6992 0-12.887 3.5742-16.238 9.375-3.3477 5.8008-3.3477 12.949 0 18.75 3.3516 5.8008 9.5391 9.375 16.238 9.375h56.25c6.6992 0 12.887-3.5742 16.238-9.375 3.3477-5.8008 3.3477-12.949 0-18.75-3.3516-5.8008-9.5391-9.375-16.238-9.375zm5.9336 94.719-56.25-18.75c-4.7188-1.5859-9.875-1.2305-14.332 0.98828-4.457 2.2227-7.8477 6.125-9.4219 10.848-1.5781 4.7227-1.2109 9.8789 1.0195 14.328 2.2305 4.4531 6.1406 7.832 10.867 9.3984l56.25 18.75c6.3477 2.0977 13.332 0.66016 18.332-3.7773s7.2578-11.203 5.9258-17.754c-1.332-6.5547-6.0547-11.898-12.391-14.031zm-62.184-132.22c2.0156 0 4.0195-0.32812 5.9336-0.96875l56.25-18.75c4.7266-1.5664 8.6367-4.9453 10.867-9.3984 2.2305-4.4492 2.5977-9.6055 1.0195-14.328-1.5742-4.7227-4.9648-8.625-9.4219-10.848-4.457-2.2188-9.6133-2.5742-14.332-0.98828l-56.25 18.75c-5.6719 1.8984-10.102 6.3867-11.922 12.086-1.8164 5.6992-0.80859 11.926 2.7227 16.754 3.5273 4.832 9.1484 7.6914 15.133 7.6914zm-393.75 187.5v-262.5h-56.25c-46.891 0-90.219 25.016-113.66 65.625-23.449 40.609-23.449 90.641 0 131.25 23.445 40.609 66.773 65.625 113.66 65.625zm248.84-355.48c-3.9336-1.0938-8.1172-0.88281-11.922 0.59766-3.8086 1.4844-7.0312 4.1562-9.1914 7.6211-2.0312 3.3164-50.113 77.859-190.23 84.145v263.73c140.11 6.2852 188.19 80.824 190.17 84.035v-0.003906c2.8359 4.7227 7.5977 7.957 13.031 8.8516s10.984-0.64062 15.18-4.2031c4.1992-3.5625 6.6172-8.793 6.6172-14.297v-412.5c-0.007812-4.0742-1.3477-8.0391-3.8125-11.281-2.4648-3.2461-5.9219-5.5977-9.8477-6.6992z"
      />
    </svg>
  );
}

/** Baseline box in each accent cell; `sizePct` scales relative to this. */
const HERO_ACCENT_BASELINE_PCT = 78;

/** Locked hero accent layout — sizePct compensates for each icon's intrinsic SVG scale. */
const HERO_ACCENT_LAYOUT: Record<HeroAccentIconKey, HeroAccentLayoutControl> = {
  first: { sizePct: 88, offsetX: -1, offsetY: 0 },
  second: { sizePct: 80, offsetX: 1, offsetY: 0 },
  third: { sizePct: 74, offsetX: 0, offsetY: 0 },
};

const HERO_ACCENT_ICON_KEYS: HeroAccentIconKey[] = ["first", "second", "third"];
/** Two 3px dividers; remaining width splits evenly across three icon columns. */
const HERO_ACCENT_STRIP_DIVIDER_CLASS = "w-[3px] shrink-0 self-stretch bg-current";
const HERO_DESKTOP_DEBUG_MIN_PX = 1024;
/** Tablet band — same as PROFILE/PROJECTS; iPad landscape lives here, not desktop layout. */
const HERO_TABLET_MIN_PX = 768;
const HERO_TABLET_MAX_PX = 1366;
const HERO_IPAD_HORIZONTAL_SVG_LOCKUP_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: -11,
  offsetY: -35,
  scale: 1,
  widthScale: 0.94,
  heightScale: 1,
};
const HERO_IPAD_HORIZONTAL_VIDEO_GLOBAL_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  widthScale: 1,
  heightScale: 0.9,
};
const HERO_IPAD_HORIZONTAL_MAIN_GLOBAL_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 55,
  offsetY: 0,
  scale: 0.95,
  widthScale: 1,
  heightScale: 1,
};
const HERO_IPAD_HORIZONTAL_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 41,
  offsetY: -20,
  scale: 0.94,
  widthScale: 1,
  heightScale: 0.91,
};
const HERO_CONTROLLED_VIEWPORT_DEFAULT: HeroControlledViewport = "desktop";

const matchesHeroDesktopDebugViewport = () =>
  typeof window !== "undefined" && window.matchMedia(`(min-width: ${HERO_DESKTOP_DEBUG_MIN_PX}px)`).matches;
const matchesHeroTabletViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia(`(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px)`).matches;
const matchesHeroTabletLandscapeViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia(
    `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px) and (orientation: landscape)`,
  ).matches;

const HeroNameReveal = ({
  heroReady,
  revealActive,
  reduceMotion,
  button,
  wrapNameLockup,
  heroMainGlobalDebugStyle,
  heroPortfolioButtonGlobalDebugStyle,
  svgLockupDefaultsForViewport,
  heroDesktopViewport,
  heroControlledViewportActive,
  heroControlledViewport,
  onHeroControlledViewportChange,
  isMobileHeroLayout,
  mobileSvgNudgeXPx,
  videoGlobalDebugControls,
  mainGlobalDebugControls,
  portfolioButtonGlobalDebugControls,
  onVideoGlobalDebugChange,
  onMainGlobalDebugChange,
  onPortfolioButtonGlobalDebugChange,
  onGlobalDebugReset,
  onLiveTextReadyChange,
}: {
  heroReady: boolean;
  /** After video opens — starts SVG rainbow / fade at final position. */
  revealActive: boolean;
  reduceMotion: boolean | null;
  button: React.ReactNode;
  /**
   * Optional wrapper around the name/SVG grid only.
   * Mobile PORTFOLIO CTA stays outside so it does not inherit idle float.
   */
  wrapNameLockup?: (node: React.ReactNode) => React.ReactNode;
  heroMainGlobalDebugStyle?: React.CSSProperties;
  heroPortfolioButtonGlobalDebugStyle?: React.CSSProperties;
  svgLockupDefaultsForViewport: HeroGlobalLayoutControl;
  /** True desktop layout viewport (excludes tablet band). */
  heroDesktopViewport: boolean;
  /** Whether hero global debug transforms should apply on this viewport. */
  heroControlledViewportActive: boolean;
  heroControlledViewport: HeroControlledViewport;
  onHeroControlledViewportChange: (next: HeroControlledViewport) => void;
  isMobileHeroLayout: boolean;
  mobileSvgNudgeXPx: number;
  videoGlobalDebugControls: HeroGlobalLayoutControl;
  mainGlobalDebugControls: HeroGlobalLayoutControl;
  portfolioButtonGlobalDebugControls: HeroGlobalLayoutControl;
  onVideoGlobalDebugChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
  onMainGlobalDebugChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
  onPortfolioButtonGlobalDebugChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
  onGlobalDebugReset: () => void;
  /** Fires when split-SVG name letters are mounted — used to gate hero entrance. */
  onLiveTextReadyChange?: (ready: boolean) => void;
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const heroSvgAlignRef = useRef<HTMLDivElement>(null);
  const [heroSvgAlignX, setHeroSvgAlignX] = useState(0);
  const [step, setStep] = useState<HeroNameRevealStep>("hidden");
  const auxVisible = step === "reveal" || step === "done";
  const [accentDebugControls, setAccentDebugControls] = useState<
    Record<HeroAccentIconKey, HeroAccentLayoutControl>
  >(() => ({ ...HERO_ACCENT_LAYOUT }));
  const [svgLockupDebugControls, setSvgLockupDebugControls] = useState<HeroGlobalLayoutControl>(
    () => ({ ...svgLockupDefaultsForViewport }),
  );
  useEffect(() => {
    setSvgLockupDebugControls({ ...svgLockupDefaultsForViewport });
  }, [svgLockupDefaultsForViewport]);

  /** Mobile — font-size so tagline glyph width matches ROBBIE + accent lockup. */
  const [mobileTaglineFontPx, setMobileTaglineFontPx] = useState<number | null>(null);
  const [heroNameLettersReady, setHeroNameLettersReady] = useState(false);
  /** Latch — once the name cascade starts, never restart (avoids loop on parent re-renders). */
  const [nameCascadeLatched, setNameCascadeLatched] = useState(false);
  const nameCascadeLatchedRef = useRef(false);
  /** Tagline cascade — latched once after name cascade completes (never restarts). */
  const [taglineTypeLatched, setTaglineTypeLatched] = useState(false);
  const taglineTypeLatchedRef = useRef(false);
  /** True after name + tagline letter cascades have finished (gates layout churn). */
  const heroLetterEntranceSettledRef = useRef(false);
  const heroSvgMountRef = useRef<HTMLDivElement>(null);
  const heroSvgMountedRef = useRef(false);
  const heroDebugEnabled = useHeroDebugEnabled();
  const heroLockupSvg = HERO_ROB_LOCKUP_SVG;

  /**
   * Mount split SVG via DOM — do NOT use dangerouslySetInnerHTML on a
   * re-rendering host (React re-sets innerHTML and restarts letter cascades).
   *
   * Orientation / breakpoint resizes can replace the host DOM node (empty) while
   * our "already mounted" refs stay set — re-inject when the host has no <svg>.
   * If the cascade already latched, snap letters to the settled end-state so
   * remount does not replay the entrance. Always re-apply viewport fit attrs
   * (meet / mobile crop) — fresh markup defaults to preserveAspectRatio="none".
   */
  const heroSvgMountedHtmlRef = useRef<string | null>(null);
  /** Bumps when SVG is re-injected so align X remeasures against live glyphs. */
  const [svgMountEpoch, setSvgMountEpoch] = useState(0);
  useLayoutEffect(() => {
    const settleLatchedGlyphs = (host: HTMLElement) => {
      if (!nameCascadeLatchedRef.current) return;
      const settle = (selector: string) => {
        host.querySelectorAll(selector).forEach((node) => {
          const el = node as HTMLElement | SVGElement;
          el.style.setProperty("opacity", "1", "important");
          el.style.setProperty("transform", "none", "important");
          el.style.setProperty("animation", "none", "important");
        });
      };
      settle("[data-hero-name-letter]");
      if (taglineTypeLatchedRef.current) {
        settle("[data-hero-tagline-letter]");
        settle("[data-hero-tagline-sep]");
      }
    };

    /** Match mobile / tablet / desktop fit — prepared markup always ships `none`. */
    const applySvgViewportFit = (svg: SVGSVGElement) => {
      const mobile = window.matchMedia("(max-width: 767.98px)").matches;
      const tablet = window.matchMedia(
        `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px)`,
      ).matches;
      if (mobile) {
        if (svg.getAttribute("viewBox") !== HERO_MOBILE_SVG_VIEWBOX) {
          svg.setAttribute("viewBox", HERO_MOBILE_SVG_VIEWBOX);
        }
        if (svg.getAttribute("preserveAspectRatio") !== "xMidYMid meet") {
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
        return;
      }
      if (svg.getAttribute("viewBox") !== "0 0 283 94") {
        svg.setAttribute("viewBox", "0 0 283 94");
      }
      if (tablet) {
        if (svg.getAttribute("preserveAspectRatio") !== "xMidYMin meet") {
          svg.setAttribute("preserveAspectRatio", "xMidYMin meet");
        }
      } else if (svg.getAttribute("preserveAspectRatio") !== "none") {
        svg.setAttribute("preserveAspectRatio", "none");
      }
    };

    const ensureMounted = () => {
      const host = heroSvgMountRef.current;
      if (!host) return;
      const existing = host.querySelector("svg");
      let didInject = false;
      if (!existing || heroSvgMountedHtmlRef.current !== heroLockupSvg) {
        host.innerHTML = heroLockupSvg;
        heroSvgMountedHtmlRef.current = heroLockupSvg;
        heroSvgMountedRef.current = true;
        settleLatchedGlyphs(host);
        didInject = true;
      }
      const svg = host.querySelector("svg");
      if (svg instanceof SVGSVGElement) {
        applySvgViewportFit(svg);
      }
      if (didInject) {
        setSvgMountEpoch((n) => n + 1);
      }
    };

    ensureMounted();
    const host = heroSvgMountRef.current;
    if (!host) return;

    const onViewportRelayout = () => {
      const hostNode = heroSvgMountRef.current;
      const hasSvg = Boolean(hostNode?.querySelector("svg"));
      /* Mid letter entrance — only heal a missing host; skip fit/re-inject thrash. */
      if (nameCascadeLatchedRef.current && !heroLetterEntranceSettledRef.current && hasSvg) {
        return;
      }
      ensureMounted();
    };
    window.addEventListener("resize", onViewportRelayout);
    window.addEventListener("orientationchange", onViewportRelayout);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onViewportRelayout);
    const mqTablet = window.matchMedia(
      `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px)`,
    );
    const mqMobile = window.matchMedia("(max-width: 767.98px)");
    mqTablet.addEventListener("change", onViewportRelayout);
    mqMobile.addEventListener("change", onViewportRelayout);
    /* Parent remounts often show up as the host node being replaced — watch the shell. */
    const shell = host.parentElement;
    const ro = shell ? new ResizeObserver(onViewportRelayout) : null;
    if (shell && ro) ro.observe(shell);

    return () => {
      window.removeEventListener("resize", onViewportRelayout);
      window.removeEventListener("orientationchange", onViewportRelayout);
      vv?.removeEventListener("resize", onViewportRelayout);
      mqTablet.removeEventListener("change", onViewportRelayout);
      mqMobile.removeEventListener("change", onViewportRelayout);
      ro?.disconnect();
    };
  }, [heroLockupSvg, isMobileHeroLayout, heroDesktopViewport]);

  useLayoutEffect(() => {
    if (!heroReady || !revealActive) {
      // Keep latched reveal — don't yank chrome/letters back to hidden mid/post cascade.
      if (!nameCascadeLatchedRef.current) setStep("hidden");
      return;
    }

    if (reduceMotion) {
      nameCascadeLatchedRef.current = true;
      setNameCascadeLatched(true);
      taglineTypeLatchedRef.current = true;
      setTaglineTypeLatched(true);
      heroLetterEntranceSettledRef.current = true;
      setStep("done");
      return;
    }

    // Already started — do not recreate sweep/reveal timers (would loop cascade).
    if (nameCascadeLatchedRef.current) return;

    setStep("sweep");
    const revealTimer = window.setTimeout(() => {
      nameCascadeLatchedRef.current = true;
      setNameCascadeLatched(true);
      setStep("reveal");
    }, HERO_NAME_SWEEP_MS);
    const doneTimer = window.setTimeout(
      () => setStep("done"),
      HERO_NAME_PHASE1_COMPLETE_MS,
    );

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [heroReady, revealActive, reduceMotion]);

  /** Mark letter entrance settled after name + tagline cascades (gates layout thrash). */
  useEffect(() => {
    if (reduceMotion) {
      heroLetterEntranceSettledRef.current = true;
      return;
    }
    if (!nameCascadeLatched || heroLetterEntranceSettledRef.current) return;
    const settledTimer = window.setTimeout(() => {
      heroLetterEntranceSettledRef.current = true;
    }, HERO_NAME_CASCADE_MS + HERO_TAGLINE_CASCADE_MS);
    return () => {
      window.clearTimeout(settledTimer);
    };
  }, [nameCascadeLatched, reduceMotion]);

  /** Tagline letter cascade — starts only after ROBBIE / MCLAUGHLIN cascade finishes. */
  useLayoutEffect(() => {
    if (reduceMotion) {
      taglineTypeLatchedRef.current = true;
      setTaglineTypeLatched(true);
      return;
    }
    if (!nameCascadeLatched || taglineTypeLatchedRef.current) return;

    const taglineTimer = window.setTimeout(() => {
      taglineTypeLatchedRef.current = true;
      setTaglineTypeLatched(true);
    }, HERO_NAME_CASCADE_MS);

    return () => {
      window.clearTimeout(taglineTimer);
    };
  }, [nameCascadeLatched, reduceMotion]);

  /**
   * Non-mobile — align ROBBIE/MCLAUGHLIN letter ink to the video card left edge; freeze until resize.
   * Desktop fine: probe→lockup (+ locked SVG lockup offsetX in style; parent zoom).
   * Tablet: probe→lockup minus glyph inset (translate-only; no desktop lockup offset).
   * Mobile untouched.
   */
  useLayoutEffect(() => {
    if (!heroReady) {
      setHeroSvgAlignX(0);
      return;
    }

    const matchesNonMobile = () =>
      window.matchMedia(`(min-width: ${HERO_TABLET_MIN_PX}px)`).matches;

    const matchesDesktopLayout = () => {
      const desktop = window.matchMedia(`(min-width: ${HERO_DESKTOP_DEBUG_MIN_PX}px)`).matches;
      const tablet = window.matchMedia(
        `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px)`,
      ).matches;
      const tabletLandscape = window.matchMedia(
        `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px) and (orientation: landscape)`,
      ).matches;
      return (desktop && !tablet) || tabletLandscape;
    };

    /** Screen-px inset from align wrapper left → leftmost name glyph (stable under translateX). */
    const measureGlyphInsetPx = (alignEl: HTMLElement): number | null => {
      const svg = alignEl.querySelector("svg");
      if (!svg) return null;
      const alignLeft = alignEl.getBoundingClientRect().left;
      let glyphLeft = Infinity;
      for (const path of svg.querySelectorAll("path")) {
        const box = path.getBoundingClientRect();
        if (box.width > 2 && box.height > 8) {
          glyphLeft = Math.min(glyphLeft, box.left);
        }
      }
      if (!Number.isFinite(glyphLeft)) return null;
      return glyphLeft - alignLeft;
    };

    let frozen = false;
    const retryTimeouts: number[] = [];

    const measure = (force = false, attempt = 0) => {
      if (!matchesNonMobile()) {
        frozen = false;
        setHeroSvgAlignX(0);
        return;
      }
      if (frozen && !force) return;

      const lockup = containerRef.current?.querySelector<HTMLElement>(
        '[data-hero-name-lockup="true"]',
      );
      /* Prefer unscaled probe — never affected by video scaleX / settle / PORTFOLIO fade. */
      const probe = document.querySelector<HTMLElement>('[data-hero-video-align-probe="true"]');
      const alignEl = heroSvgAlignRef.current;
      if (!lockup || !probe || !alignEl) {
        if (attempt < 12) {
          retryTimeouts.push(
            window.setTimeout(() => measure(force, attempt + 1), 16 + attempt * 12),
          );
        }
        return;
      }
      if (probe.offsetWidth < 8) {
        if (attempt < 12) {
          retryTimeouts.push(
            window.setTimeout(() => measure(force, attempt + 1), 16 + attempt * 12),
          );
        }
        return;
      }

      const base =
        probe.getBoundingClientRect().left - lockup.getBoundingClientRect().left;

      let next = base;
      if (!matchesDesktopLayout()) {
        const inset = measureGlyphInsetPx(alignEl);
        /* Paths not painted yet / SVG remounting — retry; do not freeze a root-only align. */
        if (inset == null) {
          if (attempt < 12) {
            retryTimeouts.push(
              window.setTimeout(() => measure(force, attempt + 1), 16 + attempt * 12),
            );
          }
          return;
        }
        next = base - inset;
      }

      frozen = true;
      setHeroSvgAlignX((prev) => {
        const rounded = Math.round(next * 100) / 100;
        return Math.abs(rounded - prev) < 0.25 ? prev : rounded;
      });
    };

    const forceRemeasure = () => {
      frozen = false;
      measure(true, 0);
      retryTimeouts.push(window.setTimeout(() => measure(true, 0), 80));
      retryTimeouts.push(window.setTimeout(() => measure(true, 0), 200));
    };

    measure(true);
    const raf = window.requestAnimationFrame(() => measure(true));
    /* SVG mount can lag first layout — short retry for tablet glyph inset. */
    const retry = window.setTimeout(() => measure(true), 120);

    window.addEventListener("resize", forceRemeasure);
    window.addEventListener("orientationchange", forceRemeasure);
    const mqNonMobile = window.matchMedia(`(min-width: ${HERO_TABLET_MIN_PX}px)`);
    mqNonMobile.addEventListener("change", forceRemeasure);
    const mqOrientation = window.matchMedia("(orientation: portrait)");
    mqOrientation.addEventListener("change", forceRemeasure);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(retry);
      retryTimeouts.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("resize", forceRemeasure);
      window.removeEventListener("orientationchange", forceRemeasure);
      mqNonMobile.removeEventListener("change", forceRemeasure);
      mqOrientation.removeEventListener("change", forceRemeasure);
    };
  }, [heroReady, svgMountEpoch]);

  /** Mobile — scale tagline type so its one-line width matches the name lockup. */
  useLayoutEffect(() => {
    if (!heroReady) {
      setMobileTaglineFontPx(null);
      return;
    }

    const mq = window.matchMedia("(max-width: 767px)");
    const lockup = containerRef.current?.querySelector<HTMLElement>('[data-hero-name-lockup="true"]');
    const tagline = taglineRef.current;
    if (!lockup || !tagline) return;

    const measureIntrinsicGlyphWidth = () => {
      const spacer = tagline.querySelector<HTMLElement>(".invisible");
      if (spacer) {
        const w = Math.max(spacer.scrollWidth, spacer.getBoundingClientRect().width);
        if (w > 4) return w;
      }
      return Math.max(tagline.scrollWidth, tagline.getBoundingClientRect().width);
    };

    const fitTaglineToLockup = () => {
      if (!mq.matches) {
        setMobileTaglineFontPx(null);
        return;
      }

      const targetW = lockup.getBoundingClientRect().width;
      if (targetW < 8) return;

      const prev = {
        fontSize: tagline.style.fontSize,
        width: tagline.style.width,
        maxWidth: tagline.style.maxWidth,
      };

      /* Unconstrained probe — avoid max-width:100% clipping the measured glyph width. */
      tagline.style.maxWidth = "none";
      tagline.style.width = "max-content";
      tagline.style.fontSize = "100px";
      void tagline.offsetWidth;
      const probeW = measureIntrinsicGlyphWidth();
      tagline.style.fontSize = prev.fontSize;
      tagline.style.width = prev.width;
      tagline.style.maxWidth = prev.maxWidth;

      if (probeW < 4) return;

      const nextPx = (targetW / probeW) * 100;
      const clamped = Math.min(40, Math.max(7, nextPx));
      setMobileTaglineFontPx((prevPx) => {
        if (prevPx != null && Math.abs(prevPx - clamped) < 0.08) return prevPx;
        return clamped;
      });
    };

    fitTaglineToLockup();
    const ro = new ResizeObserver(() => fitTaglineToLockup());
    ro.observe(lockup);
    window.addEventListener("resize", fitTaglineToLockup);
    mq.addEventListener("change", fitTaglineToLockup);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fitTaglineToLockup);
      mq.removeEventListener("change", fitTaglineToLockup);
    };
  }, [heroReady, step]);

  useLayoutEffect(() => {
    let cancelled = false;
    let rafRetries = 0;
    const pendingRafs: number[] = [];
    const pendingTimeouts: number[] = [];

    const checkReady = () => {
      const root = heroSvgAlignRef.current;
      const count = root?.querySelectorAll("[data-hero-name-letter]").length ?? 0;
      if (count < HERO_NAME_LETTER_COUNT) return false;
      setHeroNameLettersReady(true);
      onLiveTextReadyChange?.(true);
      return true;
    };

    const schedule = () => {
      if (cancelled) return;
      if (checkReady()) {
        rafRetries = 0;
        return;
      }
      rafRetries += 1;
      if (rafRetries <= 45) {
        pendingRafs.push(window.requestAnimationFrame(schedule));
      } else {
        pendingTimeouts.push(window.setTimeout(schedule, 50));
      }
    };

    schedule();
    const ro = new ResizeObserver(() => {
      if (!cancelled) schedule();
    });
    const svgRoot = heroSvgAlignRef.current;
    if (svgRoot) ro.observe(svgRoot);
    window.addEventListener("resize", schedule);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      pendingRafs.forEach((id) => window.cancelAnimationFrame(id));
      pendingTimeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [isMobileHeroLayout, onLiveTextReadyChange, heroLockupSvg]);

  const activeAccentLayout = heroDebugEnabled ? accentDebugControls : HERO_ACCENT_LAYOUT;

  const handleAccentDebugChange = useCallback(
    (iconKey: HeroAccentIconKey, patch: Partial<HeroAccentLayoutControl>) => {
      setAccentDebugControls((prev) => ({
        ...prev,
        [iconKey]: { ...prev[iconKey], ...patch },
      }));
    },
    [],
  );

  const handleSvgLockupDebugChange = useCallback((patch: Partial<HeroGlobalLayoutControl>) => {
    setSvgLockupDebugControls((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleAccentDebugReset = useCallback(() => {
    setAccentDebugControls({ ...HERO_ACCENT_LAYOUT });
    setSvgLockupDebugControls({ ...svgLockupDefaultsForViewport });
    onGlobalDebugReset();
  }, [onGlobalDebugReset, svgLockupDefaultsForViewport]);

  /** Locked SVG layout on desktop-like hero viewports; otherwise keep translate-only auto-align. */
  const activeSvgLockupLayout = heroDebugEnabled
    ? svgLockupDebugControls
    : svgLockupDefaultsForViewport;
  const heroSvgLockupStyle: React.CSSProperties | undefined = (() => {
    if (!heroDesktopViewport) {
      const mobileNudgeX = isMobileHeroLayout ? mobileSvgNudgeXPx : 0;
      const nextX = Math.round(heroSvgAlignX + mobileNudgeX);
      return nextX ? { transform: `translateX(${nextX}px)` } : undefined;
    }
    /* Integer px — subpixel translate rasterizes the scaled SVG soft. */
    return buildHeroGlobalLayoutStyle(
      {
        ...activeSvgLockupLayout,
        offsetX: Math.round(heroSvgAlignX + activeSvgLockupLayout.offsetX),
        offsetY: Math.round(activeSvgLockupLayout.offsetY),
      },
      "left top",
    );
  })();

  const panelVideoDefaults =
    heroControlledViewport === "ipad"
      ? HERO_IPAD_HORIZONTAL_VIDEO_GLOBAL_LAYOUT_DEFAULTS
      : HERO_VIDEO_GLOBAL_LAYOUT_DEFAULTS;
  const panelMainDefaults =
    heroControlledViewport === "ipad"
      ? HERO_IPAD_HORIZONTAL_MAIN_GLOBAL_LAYOUT_DEFAULTS
      : HERO_MAIN_GLOBAL_LAYOUT_DEFAULTS;
  const panelPortfolioDefaults =
    heroControlledViewport === "ipad"
      ? HERO_IPAD_HORIZONTAL_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS
      : HERO_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS;

  const renderAccentIconCell = useCallback(
    (iconKey: HeroAccentIconKey) => {
      const control = activeAccentLayout[iconKey];
      const IconComponent =
        iconKey === "first" ? HeroAccentFirstIcon : iconKey === "second" ? HeroAccentSecondIcon : HeroAccentThirdIcon;
      const sizeScale = control.sizePct / HERO_ACCENT_BASELINE_PCT;

      return (
        <div className="relative h-full min-h-0 w-full min-w-0">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 flex items-center justify-center"
            style={{
              width: `${HERO_ACCENT_BASELINE_PCT}%`,
              height: `${HERO_ACCENT_BASELINE_PCT}%`,
              transform: `translate(calc(-50% + ${control.offsetX}px), calc(-50% + ${control.offsetY}px)) scale(${sizeScale})`,
              transformOrigin: "center center",
            }}
          >
            <IconComponent className="h-full w-full text-current" />
          </div>
        </div>
      );
    },
    [activeAccentLayout],
  );

  const renderAccentIconStrip = useCallback(
    () => (
      <div className="flex h-full w-full min-w-0">
        {HERO_ACCENT_ICON_KEYS.map((iconKey, index) => (
          <React.Fragment key={iconKey}>
            {index > 0 && <div className={HERO_ACCENT_STRIP_DIVIDER_CLASS} aria-hidden />}
            <div className="relative h-full min-w-0 flex-1 basis-0 overflow-hidden">
              {renderAccentIconCell(iconKey)}
            </div>
          </React.Fragment>
        ))}
      </div>
    ),
    [renderAccentIconCell],
  );

  const nameLockupGrid = (
        <div className="relative z-[1] grid w-full grid-cols-[auto_1fr] items-end max-md:flex max-md:w-full max-md:max-w-full max-md:flex-col max-md:items-center">
          <div
            ref={heroSvgAlignRef}
            data-hero-svg-align="true"
            className="pointer-events-none z-[2] col-start-1 row-start-1 row-span-2 h-full min-h-0 w-full min-w-0 self-stretch max-md:absolute max-md:inset-0"
            style={heroSvgLockupStyle}
          >
            <motion.div
              className="h-full w-full"
              initial={false}
              animate={{
                opacity:
                  reduceMotion || nameCascadeLatched || auxVisible ? 1 : 0,
              }}
              /* Instant show — letter cascade must not fight a shared opacity fade. */
              transition={{
                duration:
                  reduceMotion || nameCascadeLatched || !auxVisible ? 0 : 0.01,
              }}
            >
            {/*
              Name letters cascade via CSS keyframes when chrome flag flips once.
              SVG markup is mounted once into the inner host (see heroSvgMountRef).
            */}
            <div
              role="img"
              data-hero-svg-root="true"
              data-hero-chrome-animate={
                reduceMotion || nameCascadeLatched || auxVisible
                  ? "true"
                  : "false"
              }
              data-hero-tagline-animate={
                reduceMotion || taglineTypeLatched ? "true" : "false"
              }
              aria-label="Robbie McLaughlin — Writer, content production, and social media"
              className="block h-full w-full select-none [&_svg]:block [&_svg]:h-full [&_svg]:w-full max-md:flex max-md:items-center max-md:justify-center max-md:[&_svg]:!h-auto max-md:[&_svg]:!w-full max-md:[&_svg]:max-w-full max-md:[&_svg]:aspect-[234.21875/94]"
            >
              <div ref={heroSvgMountRef} className="h-full w-full max-md:flex max-md:h-auto max-md:w-full max-md:items-center max-md:justify-center" />
            </div>
            </motion.div>
          </div>
          {/* Name rectangle — col 1, row 1 */}
          <div
            data-hero-center-part="true"
            data-hero-name-lockup="true"
            className={`invisible col-start-1 row-start-1 w-fit min-w-0 select-none rounded-[11px] border border-transparent bg-transparent px-3 pt-3 pb-[0.234375rem] sm:rounded-xl sm:px-4 sm:pt-3.5 sm:pb-[0.28125rem] max-md:px-0 max-md:pt-0 max-md:w-full ${HERO_NAME_MOBILE_NAME_BOX_CLASS}`}
            aria-hidden
          >
            <h1 className="relative m-0 w-full max-w-full min-w-0 font-display [font-kerning:none]">
              {/* ROBBIE row — name left, accent strip fills remaining horizontal space (desktop parity). */}
              <div className="flex w-full min-w-0 items-end gap-2 sm:gap-3 max-md:gap-1.5">
                <span
                  className={`relative shrink-0 text-[clamp(2.28rem,8.85vw,5.95rem)] max-[400px]:text-[clamp(2rem,8.1vw,5.95rem)] font-bold uppercase leading-[0.8] tracking-[-0.036em] text-mono-0 sm:leading-[0.78] ${HERO_NAME_MOBILE_DISPLAY_FONT_CLASS}`}
                >
                  ROBBIE
                </span>
                <motion.div
                  aria-hidden
                  className={`relative h-full min-w-0 flex-1 self-end mr-[0.18rem] text-[clamp(2.28rem,8.85vw,5.95rem)] max-md:mr-0 ${HERO_NAME_MOBILE_DISPLAY_FONT_CLASS}`}
                  initial={false}
                  animate={{ opacity: reduceMotion ? 1 : auxVisible ? 1 : 0 }}
                  transition={heroNameMasterFadeTransition(!reduceMotion && auxVisible)}
                  style={{
                    height: "calc(1.04cap - 0.02em + 1px)",
                    marginBottom: "0.02em",
                  }}
                >
                  <div
                    className="absolute inset-0 overflow-hidden rounded-[7px] sm:rounded-[9px]"
                    style={{ clipPath: "inset(0 1px 0 1px)" }}
                  >
                  {reduceMotion ? (
                    <div className="absolute inset-0 overflow-hidden rounded-[7px] border-2 border-white bg-black text-white sm:rounded-[9px]">
                      {renderAccentIconStrip()}
                    </div>
                  ) : (
                    <>
                      {HERO_NAME_RAINBOW_MENU_IDS.map((id, index) => (
                        <motion.div
                          key={`aux-rainbow-${id}`}
                          className="absolute inset-0 overflow-hidden rounded-[7px] border-2 border-white text-white sm:rounded-[9px]"
                          style={{ backgroundColor: SECTION_ACCENT_COLOR[id] }}
                          initial={false}
                          animate={{ opacity: !auxVisible ? 0 : [...HERO_NAME_TEXT_RAINBOW_BLEND_OPACITY] }}
                          transition={heroNameRainbowLayerTransition(auxVisible, index)}
                        >
                          {renderAccentIconStrip()}
                        </motion.div>
                      ))}
                      <motion.div
                        className="absolute inset-0 overflow-hidden rounded-[7px] border-2 border-white bg-black text-white sm:rounded-[9px]"
                        initial={false}
                        animate={{ opacity: !auxVisible ? 0 : [...HERO_NAME_TEXT_WHITE_BLEND_OPACITY] }}
                        transition={heroNameWhiteLayerTransition(auxVisible)}
                      >
                        {renderAccentIconStrip()}
                      </motion.div>
                    </>
                  )}
                  </div>
                </motion.div>
              </div>
                <span
                className={`block text-[clamp(2.28rem,8.85vw,5.95rem)] max-[400px]:text-[clamp(2rem,8.1vw,5.95rem)] font-bold uppercase leading-[0.8] tracking-[-0.036em] text-mono-0 mt-[0.04em] sm:leading-[0.78] ${HERO_NAME_MOBILE_DISPLAY_FONT_CLASS}`}
              >
                MCLAUGHLIN
              </span>
            </h1>
          </div>
          {/* Button — col 2, row 1, nudged inward from edge */}
          <div className="col-start-2 row-start-1 self-end justify-self-end -translate-x-1 -translate-y-[0.44rem] pl-1.5 pr-1.5 max-md:hidden sm:-translate-x-1.5 sm:-translate-y-[0.44rem] sm:pl-5 sm:pr-4">
            {heroDesktopViewport ? (
              <div className="w-fit min-w-0 max-w-full" style={heroPortfolioButtonGlobalDebugStyle}>
                {button}
              </div>
            ) : (
              button
            )}
          </div>
          {/* Tagline rectangle — layout metrics only; visible tagline is baked into the SVG lockup. */}
          <p
            ref={taglineRef}
            data-hero-center-part="true"
            className={`invisible col-start-1 row-start-2 m-0 mt-0 w-full translate-x-px select-none rounded-[11px] border border-transparent bg-transparent pl-[1.16rem] pr-3 py-[0.4rem] max-[639px]:box-border max-[400px]:text-[0.74rem] font-display text-[clamp(0.8rem,2.25vw,0.92rem)] font-medium uppercase leading-snug tracking-[0.085em] text-white sm:mt-0 sm:rounded-xl sm:pl-[1.42rem] sm:pr-4 sm:py-[0.45rem] sm:text-[clamp(0.8rem,2.25vw,0.92rem)] ${HERO_NAME_MOBILE_TAGLINE_CLASS}`}
            aria-hidden
            style={mobileTaglineFontPx != null ? { fontSize: mobileTaglineFontPx } : undefined}
          >
            <span className="invisible block max-md:whitespace-nowrap">{HERO_TAGLINE_TEXT}</span>
          </p>
        </div>
  );

  const heroMainContent = (
      <span
        ref={containerRef}
        className="relative block w-full overflow-visible"
      >
        <div className={`max-md:flex max-md:flex-col ${HERO_NAME_MOBILE_SHELL_CLASS}`}>
        {/* Idle float wraps name/SVG grid only — mobile PORTFOLIO CTA stays outside. */}
        {wrapNameLockup ? wrapNameLockup(nameLockupGrid) : nameLockupGrid}
        {isValidElement(button) && (
          <div className="hidden max-md:flex max-md:justify-center max-md:mt-4 max-md:max-[400px]:mt-[1.125rem] max-md:w-full">
            {cloneElement(button as ReactElement<{ className?: string }>, {
              className: [button.props.className, "max-md:self-center"].filter(Boolean).join(" "),
            })}
          </div>
        )}
        </div>
      </span>
  );

  return (
    <div className="relative m-0 w-full max-w-full overflow-visible font-display [font-kerning:none] select-none">
      {/* Plain-text scan target for ATS/crawlers — clipped, zero layout, no pointer hit. */}
      <p className="sr-only pointer-events-none" aria-hidden="true" data-hero-ats-scan="true">
        Robbie McLaughlin. {HERO_TAGLINE_TEXT}. PORTFOLIO
      </p>
      {heroDebugEnabled &&
        typeof document !== "undefined" &&
        createPortal(
          <HeroAccentLayoutDebugPanel
            controls={accentDebugControls}
            defaults={HERO_ACCENT_LAYOUT}
            svgLockupControls={svgLockupDebugControls}
            svgLockupDefaults={svgLockupDefaultsForViewport}
            svgAutoAlignX={heroSvgAlignX}
            videoGlobalControls={videoGlobalDebugControls}
            mainGlobalControls={mainGlobalDebugControls}
            portfolioButtonGlobalControls={portfolioButtonGlobalDebugControls}
            videoGlobalDefaults={panelVideoDefaults}
            mainGlobalDefaults={panelMainDefaults}
            portfolioButtonGlobalDefaults={panelPortfolioDefaults}
            controlledViewport={heroControlledViewport}
            onControlledViewportChange={onHeroControlledViewportChange}
            onChange={handleAccentDebugChange}
            onSvgLockupChange={handleSvgLockupDebugChange}
            onVideoGlobalChange={onVideoGlobalDebugChange}
            onMainGlobalChange={onMainGlobalDebugChange}
            onPortfolioButtonGlobalChange={onPortfolioButtonGlobalDebugChange}
            onReset={handleAccentDebugReset}
          />,
          document.body,
        )}
      {heroDesktopViewport ? (
        <div className="w-fit min-w-0 max-w-full" style={heroMainGlobalDebugStyle}>
          {heroMainContent}
        </div>
      ) : (
        heroMainContent
      )}
    </div>
  );
};

// --- HERO SECTION ---
const Hero = ({
  onStart,
  onQuickProjects: _onQuickProjects,
  isResumeMode: _isResumeMode,
  toggleResumeMode: _toggleResumeMode,
  heroInViewRef,
  active,
}: {
  onStart: () => void;
  onQuickProjects: () => void;
  isResumeMode: boolean;
  toggleResumeMode: () => void;
  heroInViewRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
}) => {
  const reduceMotion = useReducedMotion();
  const [fontsReady, setFontsReady] = useState(false);
  const [heroMediaReady, setHeroMediaReady] = useState(false);
  const [heroRevealDelayDone, setHeroRevealDelayDone] = useState(false);
  const [heroLiveTextPreloaded, setHeroLiveTextPreloaded] = useState(false);
  const [sliderPhaseActive, setSliderPhaseActive] = useState(false);
  const [videoRevealActive, setVideoRevealActive] = useState(false);
  const [sliderAnimDone, setSliderAnimDone] = useState(false);
  const [heroIdleFloat, setHeroIdleFloat] = useState(false);
  const [lockupFadeReady, setLockupFadeReady] = useState(false);
  const [portfolioFadeReady, setPortfolioFadeReady] = useState(false);
  const [isMobileHeroLayout, setIsMobileHeroLayout] = useState(false);
  /** Mobile: video card width synced to ROBBIE+rectangle / MCLAUGHLIN lockup. */
  const [mobileLockupWidthPx, setMobileLockupWidthPx] = useState<number | null>(null);
  const [mobileSvgNudgeXPx, setMobileSvgNudgeXPx] = useState(0);
  const mobileNameY = useMotionValue(0);
  /**
   * Settle + ROT base for the name stack (excludes gap-clamp push + idle float).
   * Gap clamp is idempotent against this so Safari late layout can re-run safely.
   */
  const mobileHeroBaseNameYRef = useRef(0);
  /** Mobile video Y — settles in parallel with name so the stack centers on the viewport. */
  const mobileVideoY = useMotionValue(0);
  const desktopNameY = useMotionValue(0);
  const heroNameMotionRef = useRef<HTMLDivElement>(null);
  const [heroPhase1LayoutReady, setHeroPhase1LayoutReady] = useState(false);
  const sliderPhaseActiveRef = useRef(false);
  const heroDebugEnabled = useHeroDebugEnabled();
  const [heroControlledViewport, setHeroControlledViewport] =
    useState<HeroControlledViewport>(HERO_CONTROLLED_VIEWPORT_DEFAULT);
  const controlledVideoDefaults =
    heroControlledViewport === "ipad"
      ? HERO_IPAD_HORIZONTAL_VIDEO_GLOBAL_LAYOUT_DEFAULTS
      : HERO_VIDEO_GLOBAL_LAYOUT_DEFAULTS;
  const controlledMainDefaults =
    heroControlledViewport === "ipad"
      ? HERO_IPAD_HORIZONTAL_MAIN_GLOBAL_LAYOUT_DEFAULTS
      : HERO_MAIN_GLOBAL_LAYOUT_DEFAULTS;
  const controlledPortfolioDefaults =
    heroControlledViewport === "ipad"
      ? HERO_IPAD_HORIZONTAL_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS
      : HERO_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS;
  const [videoGlobalDebugControls, setVideoGlobalDebugControls] = useState<HeroGlobalLayoutControl>(
    () => ({ ...controlledVideoDefaults }),
  );
  const [mainGlobalDebugControls, setMainGlobalDebugControls] = useState<HeroGlobalLayoutControl>(
    () => ({ ...controlledMainDefaults }),
  );
  const [portfolioButtonGlobalDebugControls, setPortfolioButtonGlobalDebugControls] =
    useState<HeroGlobalLayoutControl>(() => ({ ...controlledPortfolioDefaults }));
  const [heroDesktopViewport, setHeroDesktopViewport] = useState(matchesHeroDesktopDebugViewport);
  const [heroTabletViewport, setHeroTabletViewport] = useState(matchesHeroTabletViewport);
  const [heroTabletLandscapeViewport, setHeroTabletLandscapeViewport] = useState(
    matchesHeroTabletLandscapeViewport,
  );
  const portfolioNavPendingRef = useRef(false);
  const portfolioPressStartedAtRef = useRef<number | null>(null);
  const portfolioNavTimerRef = useRef<number | null>(null);
  const viewportSvgLockupDefaults = heroTabletLandscapeViewport
    ? HERO_IPAD_HORIZONTAL_SVG_LOCKUP_LAYOUT_DEFAULTS
    : HERO_SVG_LOCKUP_LAYOUT_DEFAULTS;
  const viewportVideoDefaults = heroTabletLandscapeViewport
    ? HERO_IPAD_HORIZONTAL_VIDEO_GLOBAL_LAYOUT_DEFAULTS
    : HERO_VIDEO_GLOBAL_LAYOUT_DEFAULTS;
  const viewportMainDefaults = heroTabletLandscapeViewport
    ? HERO_IPAD_HORIZONTAL_MAIN_GLOBAL_LAYOUT_DEFAULTS
    : HERO_MAIN_GLOBAL_LAYOUT_DEFAULTS;
  const viewportPortfolioDefaults = heroTabletLandscapeViewport
    ? HERO_IPAD_HORIZONTAL_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS
    : HERO_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS;

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${HERO_DESKTOP_DEBUG_MIN_PX}px)`);
    const onChange = () => setHeroDesktopViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px)`,
    );
    const onChange = () => setHeroTabletViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px) and (orientation: landscape)`,
    );
    const onChange = () => setHeroTabletLandscapeViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setVideoGlobalDebugControls({ ...controlledVideoDefaults });
    setMainGlobalDebugControls({ ...controlledMainDefaults });
    setPortfolioButtonGlobalDebugControls({ ...controlledPortfolioDefaults });
  }, [controlledVideoDefaults, controlledMainDefaults, controlledPortfolioDefaults]);

  /** Controlled viewport targeting for hero debug transforms. */
  const heroDesktopOnlyViewport = heroDesktopViewport && !heroTabletViewport;
  const heroDesktopLikeViewport = heroDesktopOnlyViewport || heroTabletLandscapeViewport;
  const heroControlledViewportActive =
    heroControlledViewport === "desktop+ipad"
      ? heroDesktopOnlyViewport || heroTabletLandscapeViewport
      : heroControlledViewport === "ipad"
        ? heroTabletLandscapeViewport
        : heroDesktopOnlyViewport;

  const activeVideoLayout = heroDebugEnabled ? videoGlobalDebugControls : viewportVideoDefaults;
  const activeMainLayout = heroDebugEnabled ? mainGlobalDebugControls : viewportMainDefaults;
  const activePortfolioButtonLayout = heroDebugEnabled
    ? portfolioButtonGlobalDebugControls
    : viewportPortfolioDefaults;
  const heroVideoGlobalDebugStyle = heroDesktopLikeViewport
    ? buildHeroGlobalLayoutStyle(activeVideoLayout, "center center")
    : undefined;
  const heroMainGlobalDebugStyle = heroDesktopLikeViewport
    ? buildHeroGlobalLayoutStyle(activeMainLayout)
    : undefined;
  const heroPortfolioButtonGlobalDebugStyle = heroDesktopLikeViewport
    ? buildHeroGlobalLayoutStyle(activePortfolioButtonLayout)
    : undefined;

  const handleVideoGlobalDebugChange = useCallback((patch: Partial<HeroGlobalLayoutControl>) => {
    setVideoGlobalDebugControls((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleMainGlobalDebugChange = useCallback((patch: Partial<HeroGlobalLayoutControl>) => {
    setMainGlobalDebugControls((prev) => ({ ...prev, ...patch }));
  }, []);

  const handlePortfolioButtonGlobalDebugChange = useCallback((patch: Partial<HeroGlobalLayoutControl>) => {
    setPortfolioButtonGlobalDebugControls((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleGlobalDebugReset = useCallback(() => {
    setVideoGlobalDebugControls({ ...controlledVideoDefaults });
    setMainGlobalDebugControls({ ...controlledMainDefaults });
    setPortfolioButtonGlobalDebugControls({ ...controlledPortfolioDefaults });
  }, [controlledMainDefaults, controlledPortfolioDefaults, controlledVideoDefaults]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileHeroLayout(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    };
  }, []);

  // Card shell only — no hero media to preload.
  useEffect(() => {
    setHeroMediaReady(true);
  }, []);

  useEffect(() => {
    // Startup beat runs in parallel with live-name preload (gate uses both).
    const assetsReady = fontsReady && heroMediaReady;
    if (!assetsReady) {
      setHeroRevealDelayDone(false);
      return;
    }
    const t = window.setTimeout(() => setHeroRevealDelayDone(true), 550);
    return () => window.clearTimeout(t);
  }, [fontsReady, heroMediaReady]);

  // Reset all animation phases when assets aren't ready.
  useEffect(() => {
    if (!(fontsReady && heroMediaReady && heroLiveTextPreloaded && heroRevealDelayDone)) {
      sliderPhaseActiveRef.current = false;
      setSliderPhaseActive(false);
      setVideoRevealActive(false);
      setSliderAnimDone(false);
      setLockupFadeReady(false);
      setPortfolioFadeReady(false);
      return;
    }
    if (reduceMotion) {
      sliderPhaseActiveRef.current = true;
      setSliderPhaseActive(true);
      setVideoRevealActive(true);
      setSliderAnimDone(true);
      return;
    }
    /* Video opens immediately; SVG follows after HERO_LOCKUP_FADE_AFTER_VIDEO_MS (overlaps scale). */
    sliderPhaseActiveRef.current = true;
    setSliderPhaseActive(true);
    setVideoRevealActive(true);
  }, [fontsReady, heroMediaReady, heroLiveTextPreloaded, heroRevealDelayDone, reduceMotion]);

  /** Very gentle idle float — only after SVG + PORTFOLIO entrance complete. */
  useEffect(() => {
    if (!portfolioFadeReady || reduceMotion) {
      setHeroIdleFloat(false);
      return;
    }
    const t = window.setTimeout(() => setHeroIdleFloat(true), HERO_IDLE_FLOAT_START_MS);
    return () => {
      window.clearTimeout(t);
      setHeroIdleFloat(false);
    };
  }, [portfolioFadeReady, reduceMotion]);

  /**
   * Mobile — apply final viewport-centered Y once (no settle tween).
   * Wait for mobileLockupWidthPx so viewBox/aspect sizing is already applied.
   * Gap is predicted into the same .set() so nothing retargets during letter cascade.
   * visualViewport / resize listeners wait until PORTFOLIO entrance — iOS chrome
   * show/hide was retargeting Y mid-cascade and stalling SVG letter CSS.
   */
  useEffect(() => {
    if (!isMobileHeroLayout || !heroPhase1LayoutReady) return;
    if (mobileLockupWidthPx == null) return;

    const applyMobileHeroY = () => {
      if (!sliderPhaseActive) {
        sliderPhaseActiveRef.current = false;
        mobileHeroBaseNameYRef.current = 0;
        mobileNameY.set(0);
        mobileVideoY.set(0);
        return;
      }

      sliderPhaseActiveRef.current = true;

      if (!videoRevealActive && !reduceMotion) {
        const settle = heroMobileSettleOffsetPx();
        mobileHeroBaseNameYRef.current = settle;
        mobileNameY.set(settle);
        mobileVideoY.set(0);
        return;
      }

      const settle = heroMobileSettleOffsetPx();
      /*
       * Two-pass: gap-clamp pushes name only. Fold predicted gap into assumedNameY
       * so the viewport-center nudge still matches the final stack.
       */
      const videoFace =
        document.querySelector<HTMLElement>("#hero [data-hero-mobile-video-face='true']") ??
        document.querySelector<HTMLElement>("#hero [data-hero-mobile-video-slot='true']");
      const nameStackEl = document.querySelector<HTMLElement>('[data-hero-mobile-name-stack="true"]');
      const videoStackEl = document.querySelector<HTMLElement>('[data-hero-mobile-video-stack="true"]');
      const inkTop = measureHeroNameInkTopSettledPx();
      const curNameY = readTranslateYPx(nameStackEl);
      const curVideoY = readTranslateYPx(videoStackEl);

      const predictGapPush = (rotNudge: number, assumedNameFinalY: number) => {
        if (!videoFace || inkTop == null) return 0;
        const predictedInk = inkTop + (assumedNameFinalY - curNameY);
        const predictedVideoBottom =
          videoFace.getBoundingClientRect().bottom + (rotNudge - curVideoY);
        const predictedGap = predictedInk - predictedVideoBottom;
        return Math.max(0, HERO_MOBILE_STACK_GAP_PX - predictedGap);
      };

      let gapPush = 0;
      let rotNudge = 0;
      for (let pass = 0; pass < 3; pass++) {
        rotNudge = measureMobileHeroRotCenterNudgePx(settle + gapPush);
        const nextGap = predictGapPush(rotNudge, settle + rotNudge + gapPush);
        if (Math.abs(nextGap - gapPush) < 0.5) {
          gapPush = nextGap;
          break;
        }
        gapPush = nextGap;
      }

      const base = settle + rotNudge;
      mobileHeroBaseNameYRef.current = base;
      mobileVideoY.set(rotNudge);
      mobileNameY.set(base + gapPush);
    };

    applyMobileHeroY();
    if (!portfolioFadeReady) return;

    window.addEventListener("resize", applyMobileHeroY);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", applyMobileHeroY);
    return () => {
      window.removeEventListener("resize", applyMobileHeroY);
      vv?.removeEventListener("resize", applyMobileHeroY);
    };
  }, [
    heroPhase1LayoutReady,
    isMobileHeroLayout,
    mobileLockupWidthPx,
    mobileNameY,
    mobileVideoY,
    portfolioFadeReady,
    reduceMotion,
    sliderPhaseActive,
    videoRevealActive,
  ]);

  /** Desktop/tablet — stay at final settle Y (no phase-1 lift / settle tween). */
  useEffect(() => {
    if (isMobileHeroLayout || !heroPhase1LayoutReady) return;
    desktopNameY.set(heroDesktopSettleOffsetPx());
  }, [desktopNameY, heroPhase1LayoutReady, isMobileHeroLayout, heroDesktopViewport]);

  /** Mobile + tablet (portrait/landscape): finish hover morph before MENU scroll. */
  const shouldDeferPortfolioNavForHover =
    (isMobileHeroLayout || heroTabletViewport) && !reduceMotion;

  const clearPortfolioNavTimer = useCallback(() => {
    if (portfolioNavTimerRef.current !== null) {
      window.clearTimeout(portfolioNavTimerRef.current);
      portfolioNavTimerRef.current = null;
    }
  }, []);

  const resetPortfolioButtonHoverState = useCallback(() => {
    clearPortfolioNavTimer();
    portfolioNavPendingRef.current = false;
    portfolioPressStartedAtRef.current = null;
    document
      .querySelectorAll<HTMLElement>("#hero button.hero-portfolio-animated--pressed")
      .forEach((el) => el.classList.remove("hero-portfolio-animated--pressed"));
  }, [clearPortfolioNavTimer]);

  /** Leave hero → clear pressed morph so PORTFOLIO is at rest on return. */
  useEffect(() => {
    if (active) return;
    resetPortfolioButtonHoverState();
  }, [active, resetPortfolioButtonHoverState]);

  useEffect(() => {
    return () => {
      resetPortfolioButtonHoverState();
    };
  }, [resetPortfolioButtonHoverState]);

  const handlePortfolioPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!shouldDeferPortfolioNavForHover) return;
      if (portfolioNavPendingRef.current) return;
      portfolioPressStartedAtRef.current = performance.now();
      event.currentTarget.classList.add("hero-portfolio-animated--pressed");
    },
    [shouldDeferPortfolioNavForHover],
  );

  const handlePortfolioPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (portfolioNavPendingRef.current) return;
      event.currentTarget.classList.remove("hero-portfolio-animated--pressed");
      portfolioPressStartedAtRef.current = null;
    },
    [],
  );

  const onStartClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (portfolioNavPendingRef.current) return;

      const tapFeedbackMs = reduceMotion ? 0 : HERO_PORTFOLIO_TAP_FEEDBACK_MS;
      let delayMs = tapFeedbackMs;

      if (shouldDeferPortfolioNavForHover) {
        const btn = event.currentTarget;
        btn.classList.add("hero-portfolio-animated--pressed");

        const startedAt = portfolioPressStartedAtRef.current ?? performance.now();
        const elapsed = performance.now() - startedAt;
        /** Wipe scaleX ≈ 1 — morph already finished (e.g. settled trackpad hover). */
        const wipeMatrix = getComputedStyle(btn, "::before").transform;
        const wipeScaleX =
          wipeMatrix.startsWith("matrix(")
            ? Number.parseFloat(wipeMatrix.slice(7))
            : wipeMatrix === "none"
              ? 0
              : 0;
        const alreadyComplete = Number.isFinite(wipeScaleX) && wipeScaleX >= 0.99;
        const morphRemaining = alreadyComplete
          ? 0
          : Math.max(0, HERO_PORTFOLIO_HOVER_COMPLETE_MS - elapsed);
        delayMs = Math.max(tapFeedbackMs, morphRemaining);
      }

      portfolioNavPendingRef.current = true;
      clearPortfolioNavTimer();
      portfolioNavTimerRef.current = window.setTimeout(() => {
        portfolioNavTimerRef.current = null;
        portfolioNavPendingRef.current = false;
        portfolioPressStartedAtRef.current = null;
        onStart();
      }, delayMs);
    },
    [clearPortfolioNavTimer, onStart, reduceMotion, shouldDeferPortfolioNavForHover],
  );

  /** Mount lockup early so live-name can calibrate before entrance. */
  const heroDomReady = fontsReady && heroMediaReady;
  /** Entrance animations wait until live-name preload succeeds. */
  const heroReady = heroDomReady && heroLiveTextPreloaded && heroRevealDelayDone;

  const handleLiveTextReadyChange = useCallback((ready: boolean) => {
    setHeroLiveTextPreloaded(ready);
  }, []);

  useLayoutEffect(() => {
    if (!heroReady) {
      setHeroPhase1LayoutReady(false);
      return;
    }

    const applyFinalLockupY = () => {
      const motionEl = heroNameMotionRef.current;
      const lockupEl = heroInViewRef.current;
      if (!motionEl || !lockupEl) return;

      if (isMobileHeroLayout) {
        /* Mobile final Y (incl. ROT) applied once video is mounted — see effect above. */
        if (!sliderPhaseActiveRef.current || !videoRevealActive) {
          mobileNameY.set(heroMobileSettleOffsetPx());
          mobileVideoY.set(0);
        }
      } else {
        desktopNameY.set(heroDesktopSettleOffsetPx());
      }

      setHeroPhase1LayoutReady(true);
    };

    applyFinalLockupY();
    window.addEventListener("resize", applyFinalLockupY);
    return () => window.removeEventListener("resize", applyFinalLockupY);
  }, [
    desktopNameY,
    heroReady,
    isMobileHeroLayout,
    mobileNameY,
    mobileVideoY,
    heroDesktopViewport,
    videoRevealActive,
  ]);

  const heroLayoutReady = heroReady && heroPhase1LayoutReady;

  /** SVG fade — brief beat after video starts opening (overlap the scale; don't wait for it to finish). */
  useEffect(() => {
    if (!videoRevealActive) {
      setLockupFadeReady(false);
      return;
    }
    if (reduceMotion) {
      setLockupFadeReady(true);
      return;
    }
    const t = window.setTimeout(() => setLockupFadeReady(true), HERO_LOCKUP_FADE_AFTER_VIDEO_MS);
    return () => window.clearTimeout(t);
  }, [videoRevealActive, reduceMotion]);

  /** PORTFOLIO slide+fade — only after ROBBIE/MCLAUGHLIN + tagline cascades end. */
  useEffect(() => {
    if (!lockupFadeReady) {
      setPortfolioFadeReady(false);
      return;
    }
    if (reduceMotion) {
      setPortfolioFadeReady(true);
      return;
    }
    const t = window.setTimeout(() => setPortfolioFadeReady(true), HERO_PORTFOLIO_ENTRANCE_AFTER_SVG_MS);
    return () => window.clearTimeout(t);
  }, [lockupFadeReady, reduceMotion]);

  // reveal gated via lockupFadeReady → HeroNameReveal.revealActive

  /**
   * Mobile — video + SVG fill PROFILE content width (`px-5` gutters).
   * Runs on phase-1 ready (before Y settle) so crop/aspect exist before gap clamp.
   * Does not retarget Y here — mobile Y effect owns settle+gap after width is set.
   */
  useLayoutEffect(() => {
    if (!isMobileHeroLayout || !heroPhase1LayoutReady) {
      setMobileLockupWidthPx(null);
      setMobileSvgNudgeXPx(0);
      return;
    }

    const measure = () => {
      const svgLockup = document.querySelector<SVGSVGElement>('#hero [data-hero-svg-root="true"] svg');
      const lockup = document.querySelector<HTMLElement>('[data-hero-name-lockup="true"]');
      /* Crop side-padding + keep aspect so wide PROFILE width does not squash letters. */
      if (svgLockup) {
        if (svgLockup.getAttribute("viewBox") !== HERO_MOBILE_SVG_VIEWBOX) {
          svgLockup.setAttribute("viewBox", HERO_MOBILE_SVG_VIEWBOX);
        }
        if (svgLockup.getAttribute("preserveAspectRatio") !== "xMidYMid meet") {
          svgLockup.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
      }
      const targetW = measureHeroMobileProfileContentWidthPx();
      if (targetW > 0) {
        setMobileLockupWidthPx((prev) => (prev === targetW ? prev : targetW));
      }
      const aspectH = Math.round(
        (targetW * HERO_MOBILE_SVG_VIEWBOX_H) / HERO_MOBILE_SVG_VIEWBOX_W,
      );
      if (svgLockup && targetW > 0) {
        const wPx = `${targetW}px`;
        const hPx = `${aspectH}px`;
        /* Important beats leftover Tailwind h-full / !h-* that squash on Safari. */
        svgLockup.style.setProperty("width", wPx, "important");
        svgLockup.style.setProperty("height", hPx, "important");
        svgLockup.style.setProperty("max-width", "100%", "important");
      }
      const framePath =
        svgLockup?.querySelector<SVGPathElement>('path[stroke="#FFFFFF"], path[stroke="white"]');
      const svgRect = svgLockup?.getBoundingClientRect();
      const frameRect = framePath?.getBoundingClientRect();
      if (svgRect && frameRect && frameRect.width > 0) {
        const leftInset = frameRect.left - svgRect.left;
        const nextX = Math.round((((svgRect.width - frameRect.width) / 2) - leftInset) * 10) / 10;
        /* Freeze after first real nudge — late frame paints during cascade were shifting X. */
        setMobileSvgNudgeXPx((prev) => (prev !== 0 || prev === nextX ? prev : nextX));
      }
      /* Width + aspect min-height so the absolute SVG host matches unsquished art. */
      if (lockup && targetW > 0) {
        if (lockup.style.width !== `${targetW}px`) lockup.style.width = `${targetW}px`;
        if (lockup.style.maxWidth !== "100%") lockup.style.maxWidth = "100%";
        if (lockup.style.minHeight !== `${aspectH}px`) lockup.style.minHeight = `${aspectH}px`;
        const shell = lockup.parentElement;
        if (shell) {
          if (shell.style.width !== "100%") shell.style.width = "100%";
          if (shell.style.maxWidth !== "100%") shell.style.maxWidth = "100%";
        }
      }
    };

    measure();
    const raf = window.requestAnimationFrame(measure);
    const svgLockup = document.querySelector<SVGSVGElement>('#hero [data-hero-svg-root="true"] svg');
    const lockup = document.querySelector<HTMLElement>('[data-hero-name-lockup="true"]');
    const ro = svgLockup || lockup ? new ResizeObserver(measure) : null;
    if (svgLockup && ro) ro.observe(svgLockup);
    if (lockup && ro) ro.observe(lockup);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      if (lockup) {
        lockup.style.minHeight = "";
        lockup.style.width = "";
        lockup.style.maxWidth = "";
        const shell = lockup.parentElement;
        if (shell) {
          shell.style.width = "";
          shell.style.maxWidth = "";
        }
      }
      if (svgLockup) {
        if (svgLockup.getAttribute("viewBox") === HERO_MOBILE_SVG_VIEWBOX) {
          svgLockup.setAttribute("viewBox", "0 0 283 94");
        }
        /* Leave tablet meet / desktop none to the tablet aspect effect below. */
        svgLockup.style.removeProperty("width");
        svgLockup.style.removeProperty("height");
        svgLockup.style.removeProperty("max-width");
      }
    };
  }, [heroPhase1LayoutReady, isMobileHeroLayout]);

  /**
   * Tablet (iPad portrait + landscape) — SVG host is taller than 283×94, and
   * preserveAspectRatio="none" was stretching glyphs ~5–6% vertically.
   * Use meet so art stays unstretched; layout box / video-edge align unchanged.
   * Desktop keeps none (pre-existing). Mobile sets its own meet + cropped viewBox.
   */
  useLayoutEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${HERO_TABLET_MIN_PX}px) and (max-width: ${HERO_TABLET_MAX_PX}px)`,
    );
    const apply = () => {
      if (isMobileHeroLayout) return;
      const svgLockup = document.querySelector<SVGSVGElement>('#hero [data-hero-svg-root="true"] svg');
      if (!svgLockup) return;
      if (mq.matches) {
        if (svgLockup.getAttribute("preserveAspectRatio") !== "xMidYMin meet") {
          svgLockup.setAttribute("preserveAspectRatio", "xMidYMin meet");
        }
      } else {
        /* Desktop — restore authored stretch-to-host (pre-existing). */
        const ratio = svgLockup.getAttribute("preserveAspectRatio");
        if (ratio === "xMidYMin meet" || ratio === "xMidYMid meet") {
          svgLockup.setAttribute("preserveAspectRatio", "none");
        }
      }
    };
    apply();
    /* SVG mounts async inside HeroNameReveal — short retry after phase-1. */
    const retry = window.setTimeout(apply, 80);
    mq.addEventListener("change", apply);
    return () => {
      window.clearTimeout(retry);
      mq.removeEventListener("change", apply);
    };
  }, [heroPhase1LayoutReady, isMobileHeroLayout]);

  const heroVideoScaleDelayS = 0;

  /* Mobile SVG/text: rest + float phase start at most-down (+amp). Desktop unchanged. */
  const heroIdleFloatSine = isMobileHeroLayout
    ? HERO_IDLE_FLOAT_SINE_FROM_BOTTOM
    : HERO_IDLE_FLOAT_SINE;
  const heroIdleFloatRestY = isMobileHeroLayout ? HERO_IDLE_FLOAT_Y_PX : 0;
  const heroIdleFloatAnimate = heroIdleFloat
    ? { y: heroIdleFloatSine.map((sample) => sample * HERO_IDLE_FLOAT_Y_PX) }
    : { y: heroIdleFloatRestY };
  const heroIdleFloatTransition = heroIdleFloat
    ? {
        duration: HERO_IDLE_FLOAT_DUR_S,
        repeat: Infinity,
        ease: "linear" as const,
        times: [...HERO_IDLE_FLOAT_TIMES],
      }
    : { duration: isMobileHeroLayout ? 0 : 0.5, ease: EASE.out };

  const wrapHeroIdleFloat = (node: React.ReactNode) => (
    <motion.div
      className="flex w-full max-w-full justify-center transform-gpu will-change-transform"
      initial={false}
      animate={heroIdleFloatAnimate}
      transition={heroIdleFloatTransition}
    >
      {node}
    </motion.div>
  );

  const heroVideoFaceShadow = isMobileHeroLayout
    ? "0 30px 72px rgba(0,0,0,0.58), 0 0 22px 3px rgba(255,255,255,0.035)"
    : "0 36px 88px rgba(0,0,0,0.6), inset 0 -40px 70px rgba(0,0,0,0.52), 0 0 28px 4px rgba(255,255,255,0.04)";
  const heroVideoFaceVignette = isMobileHeroLayout ? "none" : HERO_VIDEO_CARD_VIGNETTE;

  const heroVideoCard = (
    <motion.div
      data-hero-video-card="true"
      data-hero-mobile-video-slot={isMobileHeroLayout ? "true" : undefined}
      className={`relative mx-auto overflow-visible rounded-xl ${HERO_VIDEO_CARD_WIDTH_CLASS} max-md:w-full max-md:max-w-full`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration: HERO_NAME_SETTLE_DUR_S,
              ease: HERO_VIDEO_SCALE_EASE,
              delay: heroVideoScaleDelayS,
            }
      }
      onAnimationComplete={() => setSliderAnimDone(true)}
      style={{
        transformOrigin: "center center",
        ...(isMobileHeroLayout && mobileLockupWidthPx
          ? { width: "100%", maxWidth: mobileLockupWidthPx }
          : null),
      }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-4 max-sm:-inset-3 sm:-inset-7 -z-[1] rounded-[16px] sm:rounded-[20px] blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: HERO_VIDEO_GLOW_PEAK }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { delay: HERO_VIDEO_GLOW_DELAY_S, duration: HERO_VIDEO_GLOW_DUR_S, ease: HERO_VIDEO_SCALE_EASE }
        }
        style={{
          background:
            "radial-gradient(ellipse 90% 74% at 50% 44%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 46%, transparent 72%)",
        }}
      />
      <div
        data-hero-mobile-video-face={isMobileHeroLayout ? "true" : undefined}
        className="relative z-[1] mx-auto w-full h-[clamp(150px,min(40vh,calc(100svh-11rem-max(1rem,env(safe-area-inset-top,0px)))),430px)] max-md:h-[clamp(150px,min(34vh,calc(100svh-11rem-max(1rem,env(safe-area-inset-top,0px)))),400px)] md:max-lg:h-[clamp(200px,min(44vh,calc(100svh-14rem-max(1rem,env(safe-area-inset-top,0px)))),500px)] lg:h-[clamp(240px,min(54vh,calc(100svh-11.5rem-max(1.5rem,env(safe-area-inset-top,0px)))),680px)] xl:h-[clamp(260px,min(56vh,calc(100svh-12rem-max(2rem,env(safe-area-inset-top,0px)))),760px)] overflow-hidden rounded-xl border border-white bg-black"
        style={{
          boxShadow: heroVideoFaceShadow,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{ background: heroVideoFaceVignette }}
        />
      </div>
    </motion.div>
  );

  return (
    <section
      id="hero"
      className={`relative h-[100svh] w-full overflow-hidden bg-black text-white ${SLIDE_NO_Y_SCROLL}`}
    >
      <SlideGridOverlay />
      {heroDomReady && (
      <motion.div
        initial={false}
        animate={{ opacity: heroReady ? 1 : 0 }}
        transition={{ duration: heroReady ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
        data-hero-stage="true"
        className={`relative z-[5] mx-auto grid h-full w-full max-w-[1680px] grid-rows-[minmax(0,1.55fr)_minmax(0,1fr)] px-4 max-md:px-5 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-4 max-md:pt-[max(1rem,env(safe-area-inset-top,0px))] max-md:pb-[max(1rem,env(safe-area-inset-bottom,0px))] max-lg:grid-rows-[minmax(0,1.5fr)_minmax(0,1fr)] md:max-lg:grid-rows-[minmax(0,1.38fr)_minmax(0,1fr)] md:px-6 md:pt-[max(1.5rem,env(safe-area-inset-top,0px))] md:pb-5 md:max-lg:px-5 md:max-lg:pt-3 md:max-lg:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] lg:grid-rows-[minmax(0,2fr)_minmax(0,1fr)] lg:px-8 lg:pt-[max(2rem,env(safe-area-inset-top,0px))] lg:pb-6 [@media(min-width:744px)_and_(max-width:1366px)_and_(orientation:landscape)_and_(any-pointer:coarse)]:pt-[max(1.25rem,env(safe-area-inset-top,0px))] [@media(min-width:744px)_and_(max-width:1366px)_and_(orientation:landscape)_and_(any-pointer:coarse)]:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]${
          isMobileHeroLayout && !sliderPhaseActive ? " max-md:grid-rows-1" : ""
        }`}
      >
        <div
          data-hero-mobile-video-row={isMobileHeroLayout ? "true" : undefined}
          className="relative flex min-h-0 items-center justify-center max-lg:items-end max-lg:pb-2 md:max-lg:pb-3"
        >
          <div className={`absolute inset-0 flex w-full items-center justify-center max-lg:items-end max-lg:pb-2 md:max-lg:translate-y-3 md:max-lg:pb-1 ${HERO_TABLET_LANDSCAPE_VIDEO_NUDGE} max-md:px-0 max-[400px]:px-0 sm:px-0`}>
          {/* Stable width probe — same card width as video; never scaled so SVG align can freeze early. */}
          <div
            aria-hidden
            data-hero-video-align-probe="true"
            className={`pointer-events-none invisible absolute left-1/2 top-0 h-0 -translate-x-1/2 overflow-hidden max-md:hidden ${HERO_VIDEO_CARD_WIDTH_CLASS}`}
          />
          {videoRevealActive &&
            (heroDesktopLikeViewport ? (
              <div className="mx-auto w-fit min-w-0 max-w-full" style={heroVideoGlobalDebugStyle}>
                {heroVideoCard}
              </div>
            ) : isMobileHeroLayout ? (
              <motion.div
                data-hero-mobile-video-stack="true"
                className="mx-auto w-full max-w-full"
                style={{ y: mobileVideoY }}
                initial={false}
              >
                {heroVideoCard}
              </motion.div>
            ) : (
              heroVideoCard
            ))}
          </div>
        </div>
        <div
          className={`relative z-40 flex min-h-0 flex-col items-center overflow-visible pt-0 max-lg:justify-start max-lg:pt-2 md:max-lg:justify-start md:max-lg:pt-2 ${HERO_TABLET_LANDSCAPE_NAME_CENTER}${
            isMobileHeroLayout
              ? " max-md:col-span-full max-md:col-start-1 max-md:row-span-full max-md:row-start-1 max-md:absolute max-md:inset-0 max-md:z-[45] max-md:justify-center max-md:pt-0"
              : ""
          }`}
        >
          {/* Y-transform wrapper: mobile centers in viewport then tweens down; desktop uses phase-1 lift → settle. */}
          <motion.div
            ref={heroNameMotionRef}
            data-hero-mobile-name-stack={isMobileHeroLayout ? "true" : undefined}
            className={`mx-auto flex h-full w-full max-w-[1220px] flex-col items-center justify-center gap-0 px-1 py-2 max-lg:justify-start max-lg:py-1 max-md:justify-center max-md:px-0 max-md:py-0 sm:px-2 sm:py-2 md:max-lg:justify-start md:max-lg:py-1 ${HERO_TABLET_LANDSCAPE_NAME_CENTER} lg:py-3`}
            style={{ y: isMobileHeroLayout ? mobileNameY : desktopNameY }}
            initial={false}
          >
            <div
              ref={heroInViewRef}
              className="mx-auto flex w-full min-w-0 max-w-[min(100%,58rem)] flex-col px-1 max-[639px]:px-0 max-md:px-0 max-[400px]:px-0 max-md:max-[400px]:px-0 max-md:pt-2 sm:px-2"
            >
              <div className="w-full min-w-0 text-left max-md:flex max-md:justify-center">
                <HeroNameReveal
                  heroReady={heroLayoutReady}
                  revealActive={lockupFadeReady}
                  reduceMotion={reduceMotion}
                  isMobileHeroLayout={isMobileHeroLayout}
                  mobileSvgNudgeXPx={mobileSvgNudgeXPx}
                  wrapNameLockup={wrapHeroIdleFloat}
                  heroMainGlobalDebugStyle={heroMainGlobalDebugStyle}
                  heroPortfolioButtonGlobalDebugStyle={heroPortfolioButtonGlobalDebugStyle}
                  svgLockupDefaultsForViewport={viewportSvgLockupDefaults}
                  heroDesktopViewport={heroDesktopLikeViewport}
                  heroControlledViewportActive={heroControlledViewportActive}
                  heroControlledViewport={heroControlledViewport}
                  onHeroControlledViewportChange={setHeroControlledViewport}
                  videoGlobalDebugControls={videoGlobalDebugControls}
                  mainGlobalDebugControls={mainGlobalDebugControls}
                  portfolioButtonGlobalDebugControls={portfolioButtonGlobalDebugControls}
                  onVideoGlobalDebugChange={handleVideoGlobalDebugChange}
                  onMainGlobalDebugChange={handleMainGlobalDebugChange}
                  onPortfolioButtonGlobalDebugChange={handlePortfolioButtonGlobalDebugChange}
                  onGlobalDebugReset={handleGlobalDebugReset}
                  onLiveTextReadyChange={handleLiveTextReadyChange}
                  button={
                    <motion.div
                      initial={{ opacity: 0, x: HERO_PORTFOLIO_ENTRANCE_X_PX }}
                      animate={
                        portfolioFadeReady
                          ? /* Mobile: no idle float on PORTFOLIO CTA — SVG/text keeps float. */
                            !isMobileHeroLayout && heroIdleFloat
                            ? {
                                opacity: 1,
                                x: 0,
                                y: HERO_IDLE_FLOAT_SINE.map((sample) => -sample * HERO_IDLE_FLOAT_Y_PX),
                              }
                            : { opacity: 1, x: 0, y: 0 }
                          : { opacity: 0, x: HERO_PORTFOLIO_ENTRANCE_X_PX, y: 0 }
                      }
                      transition={
                        portfolioFadeReady && !isMobileHeroLayout && heroIdleFloat
                          ? {
                              opacity: { duration: HERO_PORTFOLIO_ENTRANCE_DUR_S, ease: EASE.out },
                              x: { duration: HERO_PORTFOLIO_ENTRANCE_DUR_S, ease: EASE.out },
                              y: {
                                duration: HERO_IDLE_FLOAT_DUR_S,
                                repeat: Infinity,
                                ease: "linear" as const,
                                times: [...HERO_IDLE_FLOAT_TIMES],
                              },
                            }
                          : {
                              opacity: { duration: HERO_PORTFOLIO_ENTRANCE_DUR_S, ease: EASE.out },
                              x: { duration: HERO_PORTFOLIO_ENTRANCE_DUR_S, ease: EASE.out },
                              y: { duration: HERO_PORTFOLIO_ENTRANCE_DUR_S, ease: EASE.out },
                            }
                      }
                      className={`shrink-0 self-end transform-gpu will-change-transform${portfolioFadeReady ? "" : " pointer-events-none"}`}
                      aria-hidden={!portfolioFadeReady}
                    >
                      <motion.button
                        type="button"
                        onPointerDown={handlePortfolioPointerDown}
                        onPointerCancel={handlePortfolioPointerCancel}
                        onClick={onStartClick}
                        className={`playstore-button playstore-button--primary hero-portfolio-animated box-border !border-[1.8px] !min-h-0 h-[calc(clamp(2.28rem,8.85vw,5.95rem)*0.78)] max-h-[4.85rem] items-center px-3 !py-0 max-[639px]:max-w-none max-[639px]:px-2.5 sm:px-5 md:px-8 [&_.texts]:text-[clamp(0.82rem,1.58vw,0.97rem)] [&_.texts]:tracking-[0.085em] max-[639px]:[&_.texts]:gap-1 sm:[&_.texts]:text-[clamp(0.9rem,1.82vw,1.05rem)] md:[&_.texts]:text-[clamp(0.96rem,1.68vw,1.12rem)] ${HERO_NAME_MOBILE_PORTFOLIO_BUTTON_CLASS}`}
                        whileTap={reduceMotion ? undefined : HERO_PORTFOLIO_TAP}
                        transition={HERO_PORTFOLIO_TAP_SPRING}
                      >
                        <svg viewBox="0 0 24 24" className="hero-portfolio-arrow hero-portfolio-arrow--2" aria-hidden>
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                        </svg>
                        <span className="texts hero-portfolio-text select-none">PORTFOLIO</span>
                        <span className="hero-portfolio-circle" aria-hidden />
                        <svg viewBox="0 0 24 24" className="hero-portfolio-arrow hero-portfolio-arrow--1" aria-hidden>
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  }
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      )}
    </section>
  );
};

const RainbowMenuSlide = ({
  active,
  introReady,
  sectionPanelClosed,
  onNavigate,
  lockedFillId,
}: {
  active: boolean;
  introReady: boolean;
  sectionPanelClosed: boolean;
  onNavigate: (id: string) => void;
  lockedFillId: string | null;
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pendingNavId, setPendingNavId] = useState<string | null>(null);
  const [pressedNavId, setPressedNavId] = useState<string | null>(null);
  const pressedNavClearTimerRef = useRef<number | null>(null);
  const lineHoverSinceRef = useRef<Partial<Record<string, number>>>({});
  const navTimerRef = useRef<number | null>(null);
  const mainMenuDebugEnabled = useMainMenuDebugEnabled();
  const [mainMenuGlobalDebugControls, setMainMenuGlobalDebugControls] =
    useState<MainMenuGlobalLayoutControl>(() => ({ ...MAIN_MENU_GLOBAL_LAYOUT_DEFAULTS }));
  const [mainMenuDesktopViewport, setMainMenuDesktopViewport] = useState(matchesHeroDesktopDebugViewport);
  const mainMenuDividerDelayS = PROFILE_TITLE_DELAY_S;
  const mainMenuDividerDurS = SKILLS_SECTION_HEADER_SLIDE_DUR_S * 1.15;
  const mainMenuDividerHoldS = SKILLS_STAGGER * 2;
  const mainMenuIconFadeDurS = 0.8;
  const mainMenuIconFadeDelayS = Math.max(0, mainMenuDividerDelayS - mainMenuIconFadeDurS - 0.02);
  const mainMenuItemsStartDelayS = mainMenuDividerDelayS + mainMenuDividerDurS + mainMenuDividerHoldS;
  const mainMenuNavDelayS = mainMenuItemsStartDelayS;
  const mainMenuTitleDelayS = mainMenuItemsStartDelayS + SKILLS_STAGGER;
  const mainMenuIndexDelayBaseS = mainMenuItemsStartDelayS + SKILLS_STAGGER * 2;
  const mainMenuLabelDelayBaseS = mainMenuIndexDelayBaseS + NAV_ITEMS.length * SKILLS_STAGGER;
  const menuTimelineActive = active && introReady;

  const clearNavTimer = useCallback(() => {
    if (navTimerRef.current !== null) {
      window.clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
  }, []);

  const markHoverStart = useCallback((id: string) => {
    lineHoverSinceRef.current[id] = performance.now();
    setHoveredId(id);
  }, []);

  const handleNavClick = useCallback(
    (id: string) => {
      if (pendingNavId !== null) return;

      const lineFullyOut = isCmdNavLineFullyOut(id, hoveredId, lineHoverSinceRef);
      const remaining = cmdNavLineRemainingMs(id, hoveredId, lineHoverSinceRef);

      const finishNav = () => {
        navTimerRef.current = null;
        setPendingNavId(null);
        setPressedNavId(id);
        onNavigate(id);
      };

      if (lineFullyOut) {
        clearNavTimer();
        setPressedNavId(id);
        onNavigate(id);
        return;
      }

      setHoveredId(id);
      setPendingNavId(id);
      clearNavTimer();
      if (remaining === 0) {
        finishNav();
        return;
      }
      navTimerRef.current = window.setTimeout(finishNav, remaining);
    },
    [clearNavTimer, hoveredId, onNavigate, pendingNavId],
  );

  const handleMainMenuGlobalDebugChange = useCallback((patch: Partial<MainMenuGlobalLayoutControl>) => {
    setMainMenuGlobalDebugControls((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleMainMenuGlobalDebugReset = useCallback(() => {
    setMainMenuGlobalDebugControls({ ...MAIN_MENU_GLOBAL_LAYOUT_DEFAULTS });
  }, []);

  const activeMainMenuLayout = mainMenuDebugEnabled
    ? mainMenuGlobalDebugControls
    : MAIN_MENU_GLOBAL_LAYOUT_DEFAULTS;
  const mainMenuGlobalLayoutStyle = mainMenuDesktopViewport
    ? buildMainMenuGlobalLayoutStyle(activeMainMenuLayout)
    : undefined;
  const mainMenuLayoutApplies =
    mainMenuDesktopViewport &&
    (activeMainMenuLayout.offsetX !== 0 ||
      activeMainMenuLayout.offsetY !== 0 ||
      activeMainMenuLayout.scale !== 1);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${HERO_DESKTOP_DEBUG_MIN_PX}px)`);
    const onChange = () => setMainMenuDesktopViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!active || sectionPanelClosed) {
      // Leaving a section (or leaving the menu slide) must reset fill/hover so
      // icons are outline again when the main menu is revealed.
      clearNavTimer();
      setPendingNavId(null);
      setPressedNavId(null);
      setHoveredId(null);
      lineHoverSinceRef.current = {};
      return;
    }
    if (pressedNavClearTimerRef.current !== null) {
      window.clearTimeout(pressedNavClearTimerRef.current);
    }
    pressedNavClearTimerRef.current = window.setTimeout(() => {
      setPressedNavId(null);
      pressedNavClearTimerRef.current = null;
    }, Math.round(PANEL_TRANSITION.duration * 1000) + 48);
    return () => {
      if (pressedNavClearTimerRef.current !== null) {
        window.clearTimeout(pressedNavClearTimerRef.current);
        pressedNavClearTimerRef.current = null;
      }
    };
  }, [active, clearNavTimer, sectionPanelClosed]);

  // lockedFillId clears at the start of leave-to-menu; drop hover fill immediately so
  // icons are outline while the section panel is still sliding away.
  useEffect(() => {
    if (lockedFillId !== null) return;
    clearNavTimer();
    setPendingNavId(null);
    setPressedNavId(null);
    setHoveredId(null);
    lineHoverSinceRef.current = {};
  }, [lockedFillId, clearNavTimer]);

  useEffect(
    () => () => {
      if (pressedNavClearTimerRef.current !== null) {
        window.clearTimeout(pressedNavClearTimerRef.current);
      }
      if (navTimerRef.current !== null) {
        window.clearTimeout(navTimerRef.current);
      }
    },
    [],
  );

  return (
    <section
      id="menu"
      className={`relative h-screen bg-black text-white flex items-center justify-center p-6 md:p-10 overflow-hidden ${SLIDE}`}
      aria-label="Menu"
    >
      <SlideGridOverlay />
      {mainMenuDebugEnabled &&
        typeof document !== "undefined" &&
        createPortal(
          <MainMenuLayoutDebugPanel
            controls={mainMenuGlobalDebugControls}
            defaults={MAIN_MENU_GLOBAL_LAYOUT_DEFAULTS}
            onChange={handleMainMenuGlobalDebugChange}
            onReset={handleMainMenuGlobalDebugReset}
          />,
          document.body,
        )}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="w-full" style={mainMenuLayoutApplies ? mainMenuGlobalLayoutStyle : undefined}>
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <motion.p
              className="font-heading text-sm tracking-eyebrow-tight leading-snug uppercase mb-1.5 -ml-[0.12em]"
              style={{ color: NAV_SUBHEAD_GRAY }}
              initial={false}
              animate={{ opacity: menuTimelineActive ? 1 : 0, x: menuTimelineActive ? 0 : -28 }}
              transition={{
                duration: SKILLS_SECTION_HEADER_SLIDE_DUR_S,
                delay: mainMenuNavDelayS,
                ease: SKILLS_SECTION_HEADER_SLIDE_EASE,
              }}
            >
              NAVIGATION
            </motion.p>
            <motion.h2
              className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em] uppercase -ml-[0.07em] md:-ml-[0.08em]"
              initial={false}
              animate={{ opacity: menuTimelineActive ? 1 : 0, x: menuTimelineActive ? 0 : -28 }}
              transition={{
                duration: SKILLS_SECTION_HEADER_SLIDE_DUR_S,
                delay: mainMenuTitleDelayS,
                ease: SKILLS_SECTION_HEADER_SLIDE_EASE,
              }}
            >
              MENU
            </motion.h2>
          </div>
        </div>

        <div className="flex flex-col">
          {NAV_ITEMS.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              onHoverStart={() => markHoverStart(item.id)}
              onHoverEnd={() => {
                if (pendingNavId === item.id) return;
                setHoveredId(null);
              }}
              onFocus={() => markHoverStart(item.id)}
              onBlur={() => {
                if (pendingNavId === item.id) return;
                setHoveredId(null);
              }}
              className="group relative w-full text-left py-4 md:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-inset"
              whileTap={{ opacity: 0.92 }}
              transition={SPRING.ui}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center min-w-0 flex-1">
                  <motion.span
                    className="font-mono text-xs text-mono-2/70 tabular-nums w-8 md:w-10 shrink-0"
                    initial={false}
                    animate={{
                      opacity: menuTimelineActive ? 1 : 0,
                      x: menuTimelineActive ? 0 : -28,
                    }}
                    transition={{
                      duration: SKILLS_SECTION_HEADER_SLIDE_DUR_S,
                      delay: mainMenuIndexDelayBaseS + idx * SKILLS_STAGGER,
                      ease: SKILLS_SECTION_HEADER_SLIDE_EASE,
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </motion.span>
                  <motion.span
                    className="ml-3 shrink-0 md:ml-4 inline-flex items-center"
                    initial={false}
                    animate={{
                      opacity: menuTimelineActive ? 1 : 0,
                    }}
                    transition={{
                      duration: mainMenuIconFadeDurS,
                      delay: mainMenuIconFadeDelayS,
                      ease: EASE.out,
                    }}
                  >
                    <FillIcon
                      icon={item.icon}
                      filledIcon={item.id === "profile" ? UserFilledIcon : undefined}
                      forceFilled={
                        lockedFillId === item.id ||
                        hoveredId === item.id ||
                        pendingNavId === item.id
                      }
                      className="w-5 h-5 md:w-6 md:h-6 text-white"
                      strokeWidth={1.5}
                    />
                  </motion.span>
                  <motion.span
                    className="font-display text-lg md:text-xl tracking-[0em] leading-snug uppercase text-white pl-3 md:pl-4 block"
                    initial={false}
                    animate={{
                      opacity: menuTimelineActive ? 1 : 0,
                      x: menuTimelineActive ? 0 : -28,
                    }}
                    transition={{
                      duration: SKILLS_SECTION_HEADER_SLIDE_DUR_S,
                      delay: mainMenuLabelDelayBaseS + idx * SKILLS_STAGGER,
                      ease: SKILLS_SECTION_HEADER_SLIDE_EASE,
                    }}
                  >
                    <motion.span
                      className="block"
                      animate={{
                        x:
                          hoveredId === item.id ||
                          pendingNavId === item.id ||
                          pressedNavId === item.id
                            ? 6
                            : 0,
                      }}
                      transition={CMD_HOVER}
                    >
                      {item.label}
                    </motion.span>
                  </motion.span>
                </div>
              </div>
              <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-px origin-left bg-white/10"
                initial={false}
                animate={{ scaleX: menuTimelineActive ? 1 : 0 }}
                transition={{
                  duration: mainMenuDividerDurS,
                  delay: mainMenuDividerDelayS,
                  ease: SKILLS_SECTION_HEADER_SLIDE_EASE,
                }}
              />
              <motion.span
                aria-hidden
                className={`absolute bottom-0 left-0 right-0 origin-left ${item.id === "profile" ? "h-[2.5px]" : "h-[2px]"} ${item.color}`}
                initial={false}
                animate={{
                  scaleX: hoveredId === item.id || pendingNavId === item.id ? 1 : 0,
                }}
                transition={CMD_HOVER}
              />
            </motion.button>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

/** Map overlay section id → main/side nav item id (SHOWCASE sub-routes → projects). */
function navItemIdForSection(section: string | null): string | null {
  if (!section) return null;
  if (section === "projects-supporting" || section.startsWith("project-")) return "projects";
  return section;
}

const SideNavOverlay = ({
  open,
  onClose,
  onNavigate,
  currentSection,
  exitButtonDebug,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  /** Keeps FillIcon filled for the section the user is still in (not reset on leave-to-menu). */
  currentSection: string | null;
  exitButtonDebug: NavIconButtonDebugValues;
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pendingNavId, setPendingNavId] = useState<string | null>(null);
  const activeNavId = navItemIdForSection(currentSection);
  const [exitMenuAlignY, setExitMenuAlignY] = useState(0);
  const menuTitleRef = useRef<HTMLParagraphElement | null>(null);
  const exitShellRef = useRef<HTMLDivElement | null>(null);
  const lineHoverSinceRef = useRef<Partial<Record<string, number>>>({});
  const navTimerRef = useRef<number | null>(null);

  const clearNavTimer = useCallback(() => {
    if (navTimerRef.current !== null) {
      window.clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
  }, []);

  const markHoverStart = useCallback((id: string) => {
    lineHoverSinceRef.current[id] = performance.now();
    setHoveredId(id);
  }, []);

  const handleNavClick = useCallback(
    (id: string) => {
      if (pendingNavId !== null) return;

      const lineFullyOut = isCmdNavLineFullyOut(id, hoveredId, lineHoverSinceRef);
      const remaining = cmdNavLineRemainingMs(id, hoveredId, lineHoverSinceRef);

      const finishNav = () => {
        navTimerRef.current = null;
        setPendingNavId(null);
        onNavigate(id);
        onClose();
      };

      if (lineFullyOut) {
        clearNavTimer();
        onNavigate(id);
        onClose();
        return;
      }

      setHoveredId(id);
      setPendingNavId(id);
      clearNavTimer();
      if (remaining === 0) {
        finishNav();
        return;
      }
      navTimerRef.current = window.setTimeout(finishNav, remaining);
    },
    [clearNavTimer, hoveredId, onClose, onNavigate, pendingNavId],
  );

  useEffect(() => {
    if (!open) {
      clearNavTimer();
      setPendingNavId(null);
      setHoveredId(null);
      lineHoverSinceRef.current = {};
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }
  }, [clearNavTimer, open]);

  useEffect(() => () => clearNavTimer(), [clearNavTimer]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) {
      setExitMenuAlignY(0);
      return;
    }

    const measureMenuInkTop = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize) || 16;
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 0.95;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return rect.top;

      ctx.font = style.font;
      const text = (el.textContent || "MENU").trim();
      const metrics = ctx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
      const fontAscent = metrics.fontBoundingBoxAscent ?? ascent;
      const fontDescent =
        metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
      const halfLeading = (lineHeight - (fontAscent + fontDescent)) / 2;
      // Content-box top → alphabetic baseline → actual glyph ink top.
      return rect.top + halfLeading + fontAscent - ascent;
    };

    const measureSvgPathTop = (svg: SVGSVGElement) => {
      const paths = svg.querySelectorAll("path");
      if (paths.length) {
        let top = Number.POSITIVE_INFINITY;
        paths.forEach((path) => {
          top = Math.min(top, path.getBoundingClientRect().top);
        });
        if (Number.isFinite(top)) return top;
      }
      const rect = svg.getBoundingClientRect();
      return rect.top + (6 / 24) * rect.height;
    };

    const syncExitXTopToMenuTop = () => {
      const menu = menuTitleRef.current;
      const shell = exitShellRef.current;
      const svg = shell?.querySelector("svg");
      if (!menu || !shell || !svg) return;

      const menuInkTop = measureMenuInkTop(menu);
      const pathTop = measureSvgPathTop(svg);
      // Path bbox sits ~1 viewBox unit above the stroked tip’s solid pixels.
      const pathBboxToSolidPx = svg.getBoundingClientRect().height / 24;
      const delta = menuInkTop - pathTop - pathBboxToSolidPx;
      if (Math.abs(delta) < 0.25) return;
      setExitMenuAlignY((prev) => prev + delta);
    };

    syncExitXTopToMenuTop();
    const raf = window.requestAnimationFrame(syncExitXTopToMenuTop);
    return () => window.cancelAnimationFrame(raf);
  }, [open, exitButtonDebug.offsetX, exitButtonDebug.offsetY, exitButtonDebug.size]);

  return (
    <AnimatePresence>
      {open && (
        <motion.button
          key="sidenav-overlay"
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-[50] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: SIDE_NAV_OVERLAY_FADE_S }}
          onClick={onClose}
        >
          <SideNavGridBackdrop />
        </motion.button>
      )}
      {open && (
        <motion.nav
          key="sidenav-nav"
            aria-label="Navigation"
            role="dialog"
            aria-modal="true"
            className="side-nav-panel profile-card-surface fixed inset-y-0 right-0 z-[60] w-2/3 sm:w-full sm:max-w-[400px] p-5 sm:p-6 flex flex-col"
            style={{ transformOrigin: "right center" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SPRING.panel}
          >
            <div className="mb-6 flex flex-col gap-y-1.5">
              <p className="font-heading text-[9px] sm:text-[10px] tracking-eyebrow-tight leading-snug uppercase -ml-[0.12em]" style={{ color: NAV_SUBHEAD_GRAY }}>
                NAVIGATION
              </p>
              <div className="relative pr-16 sm:pr-[4.5rem]">
                <p
                  ref={menuTitleRef}
                  className="font-display text-3xl sm:text-4xl leading-[0.95] tracking-[-0.02em] uppercase -ml-[0.06em]"
                >
                  MENU
                </p>
                {/* Offset on outer shell; scale on inner — keeps press shrink centered (no orbit). */}
                <div
                  ref={exitShellRef}
                  className="absolute right-0 top-0"
                  style={{
                    transform: `translate(${exitButtonDebug.offsetX}px, ${exitButtonDebug.offsetY + exitMenuAlignY}px)`,
                  }}
                >
                  <motion.div
                    whileTap={TAP}
                    transition={SPRING.tap}
                    className="inline-flex origin-center"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      aria-label="Close menu"
                      className={`${TOP_NAV_ICON_BUTTON_CLASS} relative before:absolute before:-inset-1 before:content-[''] [&_svg]:!size-[18px] sm:[&_svg]:!size-5`}
                      style={{
                        width: `${exitButtonDebug.size}px`,
                        height: `${exitButtonDebug.size}px`,
                        minWidth: `${exitButtonDebug.size}px`,
                        minHeight: `${exitButtonDebug.size}px`,
                      }}
                    >
                      <X size={22} strokeWidth={1} aria-hidden />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              {NAV_ITEMS.map((item, idx) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  onHoverStart={() => markHoverStart(item.id)}
                  onHoverEnd={() => {
                    if (pendingNavId === item.id) return;
                    setHoveredId(null);
                  }}
                  onFocus={() => markHoverStart(item.id)}
                  onBlur={() => {
                    if (pendingNavId === item.id) return;
                    setHoveredId(null);
                  }}
                  className="group relative w-full text-left py-3 sm:py-3.5 border-b border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-inset"
                  whileTap={{ scale: 0.985 }}
                  transition={SPRING.ui}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="font-mono text-[0.6875rem] sm:text-xs text-mono-2/70 tabular-nums w-7 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <FillIcon
                        icon={item.icon}
                        filledIcon={item.id === "profile" ? UserFilledIcon : undefined}
                        forceFilled={
                          activeNavId === item.id ||
                          hoveredId === item.id ||
                          pendingNavId === item.id
                        }
                        className="w-4 h-4 md:w-[1.125rem] md:h-[1.125rem] text-white shrink-0 ml-2 md:ml-3"
                        strokeWidth={1.5}
                      />
                      <motion.span
                        className="font-display text-sm sm:text-base tracking-[0em] leading-snug uppercase text-white pl-2 sm:pl-3 block"
                        animate={{ x: hoveredId === item.id || pendingNavId === item.id ? 6 : 0 }}
                        transition={CMD_HOVER}
                      >
                        {item.label}
                      </motion.span>
                    </div>
                  </div>
                  <motion.span
                    aria-hidden
                    className={`absolute bottom-0 left-0 right-0 origin-left ${item.id === "profile" ? "h-[2.5px]" : "h-[2px]"} ${item.color}`}
                    initial={false}
                    animate={{ scaleX: hoveredId === item.id || pendingNavId === item.id ? 1 : 0 }}
                    transition={CMD_HOVER}
                  />
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="mb-3">
                <span className="text-mono-2/90 font-mono text-[0.6875rem] sm:text-xs uppercase tracking-widest">
                  CONTACT
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <motion.a
                  href="#"
                  aria-label="YouTube"
                  whileHover={{ y: -3 }}
                  whileTap={TAP}
                  transition={SPRING.tap}
                  className="bg-black p-2 sm:p-2.5 rounded-full text-red-500 transition-colors border border-red-500/20 hover:border-red-500/50 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SiYoutube size={16} aria-hidden className="fill-current" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/robbie-mclaughlin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  whileHover={{ y: -3 }}
                  whileTap={TAP}
                  transition={SPRING.tap}
                  className="bg-black p-2 sm:p-2.5 rounded-full text-blue-500 transition-colors border border-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Linkedin size={16} aria-hidden />
                </motion.a>
                <motion.a
                  href="#"
                  aria-label="TikTok"
                  whileHover={{ y: -3 }}
                  whileTap={TAP}
                  transition={SPRING.tap}
                  className="bg-black p-2 sm:p-2.5 rounded-full text-cyan-500 transition-colors border border-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SiTiktok size={16} aria-hidden className="fill-current" />
                </motion.a>
                <motion.a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  whileHover={{ y: -3 }}
                  whileTap={TAP}
                  transition={SPRING.tap}
                  className="bg-black p-2 sm:p-2.5 rounded-full text-pink-500 transition-colors border border-pink-500/20 hover:border-pink-500/50 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SiInstagram size={16} aria-hidden className="fill-current" />
                </motion.a>
                <motion.a
                  href="mailto:robbie@example.com"
                  aria-label="Email"
                  whileHover={{ y: -3 }}
                  whileTap={TAP}
                  transition={SPRING.tap}
                  className="bg-black p-2 sm:p-2.5 rounded-full text-mono-2 transition-colors border border-white/10 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Mail size={16} aria-hidden />
                </motion.a>
              </div>
            </div>
          </motion.nav>
      )}
    </AnimatePresence>
  );
};

type NavIconButtonDebugValues = {
  offsetX: number;
  offsetY: number;
  size: number;
  iconSize?: number;
};

const SIDE_NAV_EXIT_BUTTON_DEBUG_DEFAULTS: NavIconButtonDebugValues = {
  offsetX: 4,
  offsetY: -2,
  size: 20,
};

const TOP_NAV_BACK_BUTTON_DEBUG_DEFAULTS: NavIconButtonDebugValues = {
  offsetX: 0,
  offsetY: 0,
  size: 44,
  iconSize: 22,
};

function NavIconButtonDebugPanel({
  title,
  values,
  onChange,
  onReset,
  initialPanelPosition,
  unlimitedOffsetX = false,
  showIconSize = false,
}: {
  title: string;
  values: NavIconButtonDebugValues;
  onChange: (patch: Partial<NavIconButtonDebugValues>) => void;
  onReset: () => void;
  initialPanelPosition?: { x: number; y: number };
  unlimitedOffsetX?: boolean;
  showIconSize?: boolean;
}) {
  const [panelPosition, setPanelPosition] = useState(() => {
    if (initialPanelPosition) return initialPanelPosition;
    if (typeof window === "undefined") return { x: 12, y: 80 };
    return {
      x: Math.max(12, window.innerWidth - 320 - 12),
      y: 80,
    };
  });
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const panelWidthPx = 320;
    const panelHeightPx = showIconSize ? 420 : 360;
    const maxX = Math.max(0, window.innerWidth - panelWidthPx);
    const maxY = Math.max(0, window.innerHeight - panelHeightPx);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  }, [showIconSize]);

  const handleDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const next = clampPosition(panelPosition.x, panelPosition.y);
      setPanelPosition(next);
      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: next.x,
        originY: next.y,
      };
      event.preventDefault();
    },
    [clampPosition, panelPosition.x, panelPosition.y],
  );

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      setPanelPosition(clampPosition(drag.originX + deltaX, drag.originY + deltaY));
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [clampPosition]);

  return (
    <div
      className="fixed z-[130] w-[min(92vw,20rem)] rounded-md border border-white/20 bg-black/85 p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-sm"
      style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
    >
      <div
        role="button"
        tabIndex={-1}
        onPointerDown={handleDragStart}
        className="mb-2 cursor-move rounded-sm border border-white/20 bg-black/65 px-2 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-white/90"
      >
        {title}
      </div>

      <label className="mb-2 block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
          X ({values.offsetX}px)
        </span>
        {unlimitedOffsetX ? (
          <input
            type="number"
            step={1}
            value={values.offsetX}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) onChange({ offsetX: next });
            }}
            className="w-full rounded-sm border border-white/20 bg-black/65 px-2 py-1 font-mono text-[11px] text-white"
          />
        ) : (
          <input
            type="range"
            min={-320}
            max={320}
            step={1}
            value={values.offsetX}
            onChange={(event) => onChange({ offsetX: Number(event.target.value) })}
            className="h-1.5 w-full accent-zinc-200"
          />
        )}
      </label>

      <label className="mb-2 block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
          Y ({values.offsetY}px)
        </span>
        <input
          type="range"
          min={-320}
          max={320}
          step={1}
          value={values.offsetY}
          onChange={(event) => onChange({ offsetY: Number(event.target.value) })}
          className="h-1.5 w-full accent-zinc-200"
        />
      </label>

      <label className="mb-2 block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
          Size ({values.size}px)
        </span>
        <input
          type="range"
          min={20}
          max={140}
          step={1}
          value={values.size}
          onChange={(event) => onChange({ size: Number(event.target.value) })}
          className="h-1.5 w-full accent-zinc-200"
        />
      </label>

      {showIconSize ? (
        <label className="mb-2 block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
            Icon ({values.iconSize ?? 22}px)
          </span>
          <input
            type="range"
            min={12}
            max={48}
            step={1}
            value={values.iconSize ?? 22}
            onChange={(event) => onChange({ iconSize: Number(event.target.value) })}
            className="h-1.5 w-full accent-zinc-200"
          />
        </label>
      ) : null}

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
      >
        Reset
      </button>
    </div>
  );
}

// --- PROFILE (About) ---
const SectionGridOverlay = () => {
  const style = useSyncedGridOverlayStyle();
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 grid-drift-bg portfolio-grid-overlay"
      style={style}
      aria-hidden
    />
  );
};

const RED_LINE_DELAY_MS = 229; // -10%
const RED_LINE_DURATION_MS = 190; // -10%
const RED_LINE_COMPLETE_MS = RED_LINE_DELAY_MS + RED_LINE_DURATION_MS;
/** Fade-in for profile metadata line (ms). */
const BUTTON_FADE_DURATION_MS = 486; // -10%
/** Summary delay + duration. Buttons start after summary finishes. */
const SUMMARY_DELAY_S = 0.0455; // -10%
const SUMMARY_DURATION_S = 0.306; // 0.34 * 0.9
const BUTTONS_DELAY_AFTER_SUMMARY_MS = 85;
/** Profile-parity entrance (Experience mirrors PhantomProfile cadence). */
const PROFILE_SECTION_ENTER_S = 0.342;
const PROFILE_TITLE_DELAY_S = 0.152;
const PROFILE_HERO_ENTER_S = 0.52;
const PROFILE_LINE_DURATION_S = RED_LINE_DURATION_MS / 1000;
/** Vertical air around metadata pill (red rule → pill → summary card). */
const PROFILE_METADATA_PILL_GAP = "mt-3";
/** Shared width + left nudge for PROFILE red rule and card stack (pill + summary). */
const PROFILE_CARD_COLUMN =
  "min-w-0 w-full max-w-xl xl:max-w-2xl 2xl:max-w-2xl -ml-[3px]";
/** Metadata pill + in-card section labels (SUMMARY, etc.) — paired with `#profile` CSS. */
const PROFILE_CARD_INLINE_LABEL_CLASS =
  "profile-card-inline-label font-heading w-full min-w-0 max-w-full text-balance leading-snug uppercase";
/** Slightly stronger hierarchy for red in-card labels (SUMMARY/CURRENT WORK/AVAILABILITY). */
const PROFILE_CARD_SECTION_LABEL_CLASS = `${PROFILE_CARD_INLINE_LABEL_CLASS} profile-card-section-label`;
/** Tablet band (768–1366px) — mascot must be in-layout before panel open; no whileInView entrance. */
const PROFILE_TABLET_MIN_PX = 768;
const PROFILE_TABLET_MAX_PX = 1366;
const PROFILE_DESKTOP_DEBUG_MIN_PX = 1024;
const matchesProfileTabletViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia(`(min-width: ${PROFILE_TABLET_MIN_PX}px) and (max-width: ${PROFILE_TABLET_MAX_PX}px)`).matches;
const matchesProfileDesktopDebugViewport = () =>
  typeof window !== "undefined" && window.matchMedia(`(min-width: ${PROFILE_DESKTOP_DEBUG_MIN_PX}px)`).matches;

const PhantomProfile = ({
  panelSettled = true,
  mascotFadeOnPanelSettle = false,
}: {
  /** Mirror SKILLS/EXPERIENCE: hold header/content entrance until panel settle (side-nav swaps included). */
  panelSettled?: boolean;
  /**
   * Side-nav section→PROFILE only: fade RAWBLEM in with panel settle.
   * Does not change tablet-instant or desktop whileInView mascot paths.
   */
  mascotFadeOnPanelSettle?: boolean;
} = {}) => {
  const reduceMotion = useReducedMotion();
  const portfolioDebugEnabled = usePortfolioDebugEnabled();
  const profileLeftRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const rawblemRef = useRef<HTMLDivElement>(null);
  const profileLeftInView = useInView(profileLeftRef, { once: false, amount: 0.2 });
  const dividerInView = useInView(dividerRef, { once: false, amount: 0.5 });
  const rawblemInView = useInView(rawblemRef, { once: false, amount: 0.2 });
  const [profileTabletViewport, setProfileTabletViewport] = useState(matchesProfileTabletViewport);
  const [profileDesktopViewport, setProfileDesktopViewport] = useState(
    matchesProfileDesktopDebugViewport,
  );
  const [profileDesktopLayoutDebugValues, setProfileDesktopLayoutDebugValues] =
    useState<ProfileDesktopLayoutDebugValues>(() => readSectionDesktopLayoutDebugValues("profile"));
  const [profileRedLineDebugValues, setProfileRedLineDebugValues] =
    useState<ProfileRedLineDebugValues>(PROFILE_RED_LINE_DEBUG_DEFAULTS);
  const [overlayRevealed, setOverlayRevealed] = useState(false);
  const [rawblemFloatReady, setRawblemFloatReady] = useState(false);
  const [profileHeaderSlide, setProfileHeaderSlide] = useState(false);
  /** Latch: keep header/red line settled after first play — scroll-off must not replay. */
  const [profileHeaderLocked, setProfileHeaderLocked] = useState(false);
  const [profileRedLineLocked, setProfileRedLineLocked] = useState(false);
  const prevProfileInView = useRef(false);
  const profileMascotInstant = profileTabletViewport || !!reduceMotion;
  /** Entrance gate: panel must be settled (same cadence as SkillArsenal / ConfidantExperience). */
  const profileEntranceArmed = !!reduceMotion || panelSettled;

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${PROFILE_TABLET_MIN_PX}px) and (max-width: ${PROFILE_TABLET_MAX_PX}px)`,
    );
    const onChange = () => setProfileTabletViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${PROFILE_DESKTOP_DEBUG_MIN_PX}px)`);
    const onChange = () => setProfileDesktopViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const profileDesktopLayoutActive = profileDesktopViewport && !profileTabletViewport;
  const profileDesktopDebugActive = portfolioDebugEnabled && profileDesktopLayoutActive;

  const handleProfileDesktopLayoutDebugChange = useCallback(
    (patch: Partial<ProfileDesktopLayoutDebugValues>) => {
      setProfileDesktopLayoutDebugValues((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const handleProfileDesktopLayoutDebugReset = useCallback(() => {
    setProfileDesktopLayoutDebugValues(PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS);
  }, []);

  const handleProfileDesktopLayoutDebugSave = useCallback(() => {
    saveSectionDesktopLayoutDebugValues("profile", profileDesktopLayoutDebugValues);
    const lockInSnippet = [
      "PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS = {",
      `  leftOffsetX: ${profileDesktopLayoutDebugValues.leftOffsetX},`,
      `  leftOffsetY: ${profileDesktopLayoutDebugValues.leftOffsetY},`,
      `  rightOffsetX: ${profileDesktopLayoutDebugValues.rightOffsetX},`,
      `  rightOffsetY: ${profileDesktopLayoutDebugValues.rightOffsetY},`,
      `  leftScale: ${profileDesktopLayoutDebugValues.leftScale.toFixed(2)},`,
      `  leftWidthScale: ${profileDesktopLayoutDebugValues.leftWidthScale.toFixed(2)},`,
      `  leftHeightScale: ${profileDesktopLayoutDebugValues.leftHeightScale.toFixed(2)},`,
      `  rightScale: ${profileDesktopLayoutDebugValues.rightScale.toFixed(2)},`,
      `  rightWidthScale: ${profileDesktopLayoutDebugValues.rightWidthScale.toFixed(2)},`,
      "};",
    ].join("\n");
    console.info("[Profile Desktop Layout Lock In]\n" + lockInSnippet);
    navigator.clipboard?.writeText(lockInSnippet).catch(() => {
      // Clipboard writes can fail in some browser contexts; localStorage save still succeeds.
    });
  }, [profileDesktopLayoutDebugValues]);

  const activeProfileDesktopLayout = profileDesktopDebugActive
    ? profileDesktopLayoutDebugValues
    : PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS;

  const profileLeftDebugStyle = profileDesktopLayoutActive
    ? buildDesktopLayoutSideStyle(activeProfileDesktopLayout, "left", "crisp-contained")
    : undefined;

  const profileRightDebugStyle = profileDesktopLayoutActive
    ? buildDesktopLayoutSideStyle(activeProfileDesktopLayout, "right", "transform")
    : undefined;

  const profileRedLineSpanDebugStyle = portfolioDebugEnabled
    ? buildProfileRedLineSpanDebugStyle(profileRedLineDebugValues)
    : undefined;

  const profileRedLinePillDebugStyle = portfolioDebugEnabled
    ? buildProfileRedLinePillDebugStyle(profileRedLineDebugValues)
    : undefined;

  const handleProfileRedLineDebugChange = useCallback((patch: Partial<ProfileRedLineDebugValues>) => {
    setProfileRedLineDebugValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleProfileRedLineDebugReset = useCallback(() => {
    setProfileRedLineDebugValues(PROFILE_RED_LINE_DEBUG_DEFAULTS);
  }, []);

  useLayoutEffect(() => {
    if (profileMascotInstant) setRawblemFloatReady(true);
  }, [profileMascotInstant]);

  useLayoutEffect(() => {
    if (!profileEntranceArmed) {
      // Section leave / panel unsettled — allow a fresh entrance next open.
      setProfileHeaderSlide(false);
      setProfileHeaderLocked(false);
      setProfileRedLineLocked(false);
      return;
    }
    if (profileHeaderLocked) {
      setProfileHeaderSlide(true);
      return;
    }
    const armId = requestAnimationFrame(() => {
      setProfileHeaderSlide(true);
      setProfileHeaderLocked(true);
    });
    return () => {
      cancelAnimationFrame(armId);
    };
  }, [profileEntranceArmed, profileHeaderLocked]);

  // Red line: latch on first in-view while armed; stay drawn when scrolled off-screen.
  useEffect(() => {
    if (!profileEntranceArmed || profileRedLineLocked) return;
    if (dividerInView) setProfileRedLineLocked(true);
  }, [profileEntranceArmed, profileRedLineLocked, dividerInView]);

  useEffect(() => {
    if (profileMascotInstant) return;
    if (!rawblemInView) setRawblemFloatReady(false);
  }, [rawblemInView, profileMascotInstant]);

  // Overlay + buttons: once per section open after red line; scroll-off must not replay.
  useEffect(() => {
    if (!profileEntranceArmed) {
      prevProfileInView.current = false;
      setOverlayRevealed(false);
      return;
    }
    if (overlayRevealed) return;
    if (!profileLeftInView) return;
    prevProfileInView.current = true;
    const revealId = window.setTimeout(() => setOverlayRevealed(true), Math.max(0, RED_LINE_COMPLETE_MS - 90));
    return () => window.clearTimeout(revealId);
  }, [profileEntranceArmed, profileLeftInView, overlayRevealed]);

  return (
    <section id="profile" className="relative w-full min-w-0 overflow-x-hidden overflow-y-visible bg-black text-white scroll-mt-6 max-lg:min-h-min lg:min-h-screen">
      <SectionGridOverlay />
      {profileDesktopDebugActive &&
        typeof document !== "undefined" &&
        createPortal(
          <ProfileDesktopLayoutDebugPanel
            sectionLabel="Profile"
            leftLabel="Left"
            rightLabel="Right"
            values={profileDesktopLayoutDebugValues}
            defaults={PROFILE_DESKTOP_LAYOUT_DEBUG_DEFAULTS}
            showLeftHeightScale
            onChange={handleProfileDesktopLayoutDebugChange}
            onSave={handleProfileDesktopLayoutDebugSave}
            onReset={handleProfileDesktopLayoutDebugReset}
          />,
          document.body,
        )}
      {portfolioDebugEnabled &&
        typeof document !== "undefined" &&
        createPortal(
          <ProfileRedLineDebugPanel
            values={profileRedLineDebugValues}
            onChange={handleProfileRedLineDebugChange}
            onReset={handleProfileRedLineDebugReset}
          />,
          document.body,
        )}
      <motion.div className={`${PROFILE_SECTION_CONTAINER} ${PROFILE_SECTION_TOP_INSET} profile-section-tablet-shell max-lg:pb-0 lg:pb-12 lg:min-h-screen lg:flex lg:items-center`}>
        <div className={EXPERIENCE_GUTTER_SHELL_OUTER}>
          <div className={EXPERIENCE_GUTTER_SHELL_INNER}>
        <motion.div className={`${PROFILE_LAYOUT_ROW} profile-tablet-layout-row`}>

          {profileMascotInstant ? (
            // Side-nav handoff: CSS-hide while unsettled (no Framer 1→0 frame), then mount-fade in.
            mascotFadeOnPanelSettle && !panelSettled ? (
              <div
                ref={rawblemRef}
                className={`${PROFILE_MASCOT_COLUMN} profile-tablet-mascot-column max-sm:hidden opacity-0 pointer-events-none`}
                aria-hidden
              >
                <div className={PROFILE_MASCOT_FRAME} style={profileRightDebugStyle}>
                  <img
                    src="/rawblem3.svg"
                    alt=""
                    width={300}
                    height={300}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ) : (
            <motion.div
              ref={rawblemRef}
              key={mascotFadeOnPanelSettle ? "profile-mascot-settle-fade" : "profile-mascot-instant"}
              className={`${PROFILE_MASCOT_COLUMN} profile-tablet-mascot-column max-sm:hidden`}
              initial={mascotFadeOnPanelSettle ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={
                mascotFadeOnPanelSettle
                  ? { duration: 0.52, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0 }
              }
            >
              <div className={PROFILE_MASCOT_FRAME} style={profileRightDebugStyle}>
                <motion.img
                  src="/rawblem3.svg"
                  alt="RAWBLEM"
                  width={300}
                  height={300}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  className="h-full w-full object-contain"
                  animate={{ y: rawblemFloatReady ? [0, -8, 0] : 0 }}
                  transition={
                    rawblemFloatReady
                      ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0 }
                  }
                />
              </div>
            </motion.div>
            )
          ) : (
          <motion.div
            ref={rawblemRef}
            initial={{ opacity: 0, y: 32, x: 0 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              if (rawblemInView) setRawblemFloatReady(true);
            }}
            className={`${PROFILE_MASCOT_COLUMN} profile-tablet-mascot-column max-sm:hidden`}
          >
            <div className={PROFILE_MASCOT_FRAME} style={profileRightDebugStyle}>
              <motion.img
                src="/rawblem3.svg"
                alt="RAWBLEM"
                width={300}
                height={300}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="h-full w-full object-contain"
                animate={{ y: rawblemFloatReady ? [0, -8, 0] : 0 }}
                transition={
                  rawblemFloatReady
                    ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0 }
                }
              />
            </div>
          </motion.div>
          )}

          <div
            ref={profileLeftRef}
            className={`${PROFILE_LEFT_COLUMN} profile-tablet-text-column`}
          >
            <div className="w-fit min-w-0 max-w-full" style={profileLeftDebugStyle}>
             <SectionHeader
               title="PROFILE"
               color="text-white"
               showBar={false}
               compact
               className="!mb-3 max-lg:mt-0 lg:mt-0 -ml-[3px] max-sm:translate-y-[2px]"
               slideFade
               slideFadeDuration={0.5}
               slideFadeDelay={0.3}
               slideFadeActive={profileHeaderSlide}
               titleStatic
             />
            <div className={PROFILE_CARD_COLUMN}>
             <div
               ref={dividerRef}
               className="relative mt-1 min-h-[2px] w-full overflow-hidden"
             >
               <motion.span
                 aria-hidden
                className="absolute bottom-0 left-0.5 right-0 h-[2px] origin-left"
                style={
                  portfolioDebugEnabled
                    ? profileRedLineSpanDebugStyle
                    : { backgroundColor: PROFILE_ACCENT_SOFT }
                }
                 initial={false}
                 animate={{ scaleX: profileRedLineLocked ? 1 : 0 }}
                 transition={{ duration: RED_LINE_DURATION_MS / 1000, delay: RED_LINE_DELAY_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
               />
            </div>
            <div className="max-sm:translate-y-px">
              <motion.div
                className={`profile-card-surface relative ${PROFILE_METADATA_PILL_GAP} w-full rounded-[4px] px-4 py-4 sm:px-5 sm:py-5`}
                style={profileRedLinePillDebugStyle}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: overlayRevealed ? 0 : -24, opacity: overlayRevealed ? 1 : 0 }}
                transition={{ duration: BUTTON_FADE_DURATION_MS / 1000, delay: overlayRevealed ? BUTTONS_DELAY_AFTER_SUMMARY_MS / 1000 : 0, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex w-full min-w-0 items-center gap-3 sm:gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/[0.16] bg-black/70 sm:h-16 sm:w-16">
                    <img src="/rawblem3.svg" alt="Profile picture" className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="h-12 w-px shrink-0 bg-white/[0.1] sm:h-14" aria-hidden />
                  <div className="min-w-0 flex-1 space-y-1 text-left">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <p className="min-w-0 flex-1 font-display text-base leading-tight tracking-[-0.01em] text-white sm:text-lg">
                        ROBBIE MCLAUGHLIN
                      </p>
                      <p
                        className="profile-card-inline-label shrink-0 pt-0.5 text-right text-[0.68rem] leading-snug tracking-[0.06em] whitespace-nowrap uppercase sm:text-xs"
                        style={{ color: NAV_SUBHEAD_GRAY }}
                      >
                        VICTORIA, BC
                      </p>
                    </div>
                    <p className={`${PROFILE_CARD_INLINE_LABEL_CLASS} text-[0.68rem] sm:text-xs tracking-[0.06em]`} style={{ color: NAV_SUBHEAD_GRAY }}>
                      WRITING, CONTENT PRODUCTION, &amp; SOCIAL MEDIA
                    </p>
                    <p className={`${PROFILE_CARD_INLINE_LABEL_CLASS} text-[0.68rem] sm:text-xs tracking-[0.06em]`} style={{ color: NAV_SUBHEAD_GRAY }}>
                      B.A. WRITING
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className={`profile-card-surface relative ${PROFILE_METADATA_PILL_GAP} w-full rounded-[4px] px-4 py-4 sm:px-5 sm:py-5`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: overlayRevealed ? 1 : 0, y: overlayRevealed ? 0 : 14 }}
                transition={{ duration: SUMMARY_DURATION_S, delay: overlayRevealed ? SUMMARY_DELAY_S : 0, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className={`${PROFILE_CARD_SECTION_LABEL_CLASS} mb-1.5`} style={{ color: PROFILE_ACCENT_SOFT }}>SUMMARY</p>
                <p className="font-body text-mono-2 leading-relaxed mb-4">
                Communications-focused writer, editor and digital media coordinator with proven experience producing narrative-driven web content and managing social
                media workflows across multiple platforms. Bachelor of Arts in Writing (Distinction), University of Victoria.
                </p>
                <p className={`${PROFILE_CARD_SECTION_LABEL_CLASS} mb-1.5`} style={{ color: PROFILE_ACCENT_SOFT }}>CURRENT WORK</p>
                <ul className="font-body text-mono-2 leading-relaxed mb-4 ml-3 list-disc list-outside space-y-2 pl-6 sm:pl-7 marker:text-mono-2/50">
                  <li>RAWBLEM - Independent creative brand producing story-driven written, video, and interactive content across TikTok, Instagram Reels, YouTube Shorts, and more.</li>
                  <li>
                  SLAYWIRE - Self-produced original narrative IP.
                  </li>
                </ul>
                <p className={`${PROFILE_CARD_SECTION_LABEL_CLASS} mb-1.5`} style={{ color: PROFILE_ACCENT_SOFT }}>AVAILABILITY</p>
                <ul className="font-body text-mono-2 leading-relaxed ml-3 list-disc list-outside space-y-2 pl-6 sm:pl-7 marker:text-mono-2/50">
                  <li>Full-Time Content, Communications, or Social Media roles.</li>
                </ul>
              </motion.div>
            </div>
            </div>
            </div>
          </div>
        </motion.div>
          </div>
        </div>
      </motion.div>
      <div className={SECTION_OVERLAY_BOTTOM_SPACER_MAX_LG} aria-hidden />
    </section>
  );
};

const Badge = ({ icon: Icon, label, sub, highlight = false }: { icon: LucideIcon; label: string; sub: string; highlight?: boolean }) => (
  <div
    className={`flex items-center gap-3 p-3 border-2 shadow-md ${
      highlight
        ? 'bg-gradient-to-br from-portfolio-yellow via-portfolio-orange to-portfolio-red border-portfolio-orange text-black shadow-lg'
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
    <span className="text-mono-2/90 uppercase group-hover:text-white transition-colors">{label}</span>
    <span className="text-portfolio-blue-bright uppercase">{value}</span>
  </div>
);

// --- PROJECTS (responsive carousel: 1 slide < lg, 2 slides lg+; cards larger & taller than original) ---
type ShowcaseProjectCard = {
  readonly id: string;
  readonly title: string;
  /** Optional line above `title`; absolutely stacked so tagline/divider layout stays fixed. */
  readonly titlePrefix?: string;
  readonly tagline: string;
  /** Replaces `tagline` below `md` (phone showcase + project detail). */
  readonly mobileTagline?: string;
  /** Appended to tagline on iPad portrait only (e.g. SLAYWIRE development note). */
  readonly tabletPortraitTaglineSuffix?: string;
  readonly thumbnail?: string;
  readonly thumbnailVideo?: string;
  readonly poster?: string;
  /** Optional crop focus for `object-cover` (e.g. "50% 36%"). */
  readonly focalPoint?: string;
  /** Optional per-project hero zoom baseline (1 = default cover scale). */
  readonly zoom?: number;
  /** Detail overlay ? fixed section order: Overview, Role, Tools, Impact. */
  readonly detailOverview?: string;
  readonly detailRole?: string;
  readonly detailTools?: readonly string[];
  readonly detailImpact?: string;
  readonly detailVideos?: readonly ShowcaseDetailVideo[];
  /** In-flow gallery in project details (ILLUSTRATIONS). Add `src` per slide when assets are ready. */
  readonly detailGallery?: readonly {
    readonly id: string;
    readonly src?: string;
    readonly alt?: string;
    readonly focalPoint?: string;
    readonly caption?: string;
    readonly artistStatement?: string;
  }[];
};

const PROJECT_CARDS: readonly ShowcaseProjectCard[] = [
  {
    id: "project-visual-design",
    title: "VISUAL DESIGN",
    tagline: "Graphic design, illustration and branding.",
    thumbnail: "/illustrations/illustrations-charger.png",
    focalPoint: "50% 42%",
    detailGallery: [
      {
        id: "illustrations-01",
        src: "/illustrations/illustrations-charger.png",
        alt: "CHARGER - SLAYWIRE Concept Art (2023)",
        caption: "CHARGER - SLAYWIRE Concept Art (2023)",
        artistStatement: "Digital-ink style illustration for the lead protagonist of SLAYWIRE.\n\nTools: Procreate and Photoshop.",
        focalPoint: "50% 42%",
      },
      {
        id: "illustrations-02",
        src: "/illustrations/illustrations-fragment.png",
        alt: "FRAGMENT - SLAYWIRE Concept Art (2023)",
        caption: "FRAGMENT - SLAYWIRE Concept Art (2023)",
        artistStatement: "Digital-ink style illustration for the main antagonist of SLAYWIRE.\n\nTools: Procreate and Photoshop.",
        focalPoint: "50% 45%",
      },
      {
        id: "illustrations-03",
        src: "/illustrations/illustrations-wisely.png",
        alt: "WISELY - SLAYWIRE Concept Art (2023)",
        caption: "WISELY - SLAYWIRE Concept Art (2023)",
        artistStatement: "Digital-ink style illustration for a key character in SLAYWIRE.\n\nTools: Procreate and Photoshop.",
        focalPoint: "50% 42%",
      },
      {
        id: "illustrations-04",
        src: "/illustrations/illustrations-star-fox.png",
        alt: "SPACE ANIMAL - Illustration (2023)",
        caption: "SPACE ANIMAL - Illustration (2023)",
        artistStatement: "Digital Ink style homage to Star Fox (1993).\n\nThis is a noncommerical and transformative project. All trademarks and copyrights belong to their respective owners.\n\nTools: Clip Studio Paint.",
        focalPoint: "50% 50%",
      },
      {
        id: "illustrations-05",
        src: "/illustrations/illustrations-strong-as-duck.png",
        alt: "STRONG AS DUCK! - Mascot Design (2025)",
        caption: "STRONG AS DUCK! - Mascot Design (2025)",
        artistStatement: "Designed for print, featured in a RAWBLEM merch release.\n\nUses digital ink and flat color marker.\n\nTools: Clip Studio Paint",
        focalPoint: "50% 38%",
      },
      {
        id: "illustrations-06",
        src: "/illustrations/illustrations-slaywire.png",
        alt: "SLAYWIRE - Promotional Illustration (2022)",
        caption: "SLAYWIRE - Promotional Illustration (2022)",
        artistStatement: "Digital-ink and texture brush artwork featuring DE, a key character in SLAYWIRE.\n\nTools: Procreate and Photoshop",
        focalPoint: "50% 45%",
      },
      {
        id: "illustrations-07",
        src: "/illustrations/illustrations-dish-cat.png",
        alt: "DISHCAT - Illustration (2024)",
        caption: "DISHCAT - Illustration (2024)",
        artistStatement: "Commissioned work for an individual client.\n\nTools: Clip Studio Paint",
        focalPoint: "50% 50%",
      },
      {
        id: "illustrations-08",
        src: "/illustrations/illustrations-melee-poster.png",
        alt: "Vancouver Island Melee - Poster Design (2020)",
        caption: "Vancouver Island Melee - Poster Design (2020)",
        artistStatement:
          "Designed for the Vancouver Island UVIC E-Sports Community.\n\nManually captured in-game snapshots to capture dynamic poses for each character featured in this work, using Dolphin Emulator + an in-game greenscreen hack and an owned copy of Super Smash Bros. Melee for the Nintendo Gamecube (Nintendo, 2001).\n\nThis is a noncommerical and transformative project. All trademarks and copyrights belong to their respective owners.\n\nTools: Photoshop, GIMP\n\nSubtools: Dolphin Emulator, Screenshot Tools, Debug Background Colors Mod (UnclePunch, 2020)",
        focalPoint: "50% 42%",
      },
      {
        id: "illustrations-09",
        src: "/illustrations/illustrations-melee-banner.png",
        alt: "Vancouver Island Melee - Poster Design (2020)",
        caption: "Vancouver Island Melee - Poster Design (2020)",
        artistStatement:
          "Designed for the Vancouver Island UVIC E-Sports Community.\n\nA visual homage to Pokémon Emerald (2005) and its famous gym leader ranking system. Implemented as both a creative and functional solution to a four-person tie for the seasons's final rankings.\n\nUses in-game character models and background references, but each featured character in this design was recreated and modified by hand, using a 1px brush in Photoshop, dot by dot.\n\nAll re-models and re-designs visually resemble each ranked competitors likeness (with permission).\n\nThis is a noncommerical and transformative project. All trademarks and copyrights belong to their respective owners.\n\nTools: Photoshop, GIMP",
        focalPoint: "50% 38%",
      },
      {
        id: "illustrations-10",
        src: "/illustrations/illustrations-rawblem-logo.png",
        alt: "RAWBLEM Logo - Brand Design (2025)",
        caption: "RAWBLEM Logo - Brand Design (2025)",
        artistStatement:
          "Hand-drawn, digital ink style logo with matching custom typography.\n\nTools: Clip Studio Paint, Photoshop, Inkscape (for SVG formats).",
        focalPoint: "50% 45%",
      },
      {
        id: "illustrations-11",
        src: "/illustrations/illustrations-mr-meowrange.png",
        alt: "MR.MEOWRANGE - Mascot Design (2025)",
        caption: "MR.MEOWRANGE - Mascot Design (2025)",
        artistStatement:
          "Designed for print, featured in a RAWBLEM merch release.\n\nCombines digital ink lineart with blended watercolor marker.\n\nTools: Clip Studio Paint, Photoshop",
        focalPoint: "50% 50%",
      },
      {
        id: "illustrations-12",
        src: "/illustrations/illustrations-manamelon.png",
        alt: "MANAMELON - Mascot Design (2025)",
        caption: "MANAMELON - Mascot Design (2025)",
        artistStatement:
          "Designed for print, featured in a RAWBLEM merch release.\n\nUses digital ink and flat color marker.\n\nTools: Clip Studio Paint, Photoshop",
        focalPoint: "50% 50%",
      },
    ],
  },
  {
    id: "project-video-editing",
    title: "VIDEO EDITING",
    tagline: "Assembly, color, motion, and audio.",
    thumbnail: "/edits-meme1-online-poster.jpg",
    poster: "/edits-meme1-online-poster.jpg",
    focalPoint: "50% 36%",
    detailOverview:
      "Short-form edits built around timing, meme literacy, and platform-native pacing?hooks, captions, and sound-led moments.",
    detailRole: "Editor and creative director for individual cuts.",
    detailTools: ["CapCut", "DaVinci Resolve"],
    detailImpact: "Sharper retention in the first seconds; clearer punchlines and readable on-screen text.",
    detailVideos: [
      {
        id: "video-edit-1",
        url: "/edits-meme1-online-poster.jpg",
        label: "1",
        thumbnailSrc: "/edits-meme1-online-poster.jpg",
        selectorTitle: "RAWBLEM",
        selectorSubtitle: "Social Media Ad",
        selectorDuration: "0:20",
        detailOverview:
          "Comedic open with an immediate visual hook and subtitle-first framing to land context in under one second.",
        detailRole: "Cut direction, beat timing, and caption hierarchy.",
        detailTools: ["CapCut", "DaVinci Resolve"],
        detailImpact: "Higher watch-through in the first 3 seconds with cleaner joke setup.",
      },
      {
        id: "video-edit-2",
        url: "/rawblem-thumbnail-poster.jpg",
        label: "2",
        thumbnailSrc: "/rawblem-thumbnail-poster.jpg",
        selectorTitle: "RAWBLEM",
        selectorSubtitle: "Meme-Style Brand Ad",
        selectorDuration: "0:30",
        detailOverview:
          "Reaction-led pacing pass focused on hit-point trims, dead-air removal, and stronger frame-to-frame rhythm.",
        detailRole: "Pacing pass, pacing QA, and social-safe export prep.",
        detailTools: ["DaVinci Resolve", "CapCut"],
        detailImpact: "Tighter mid-section flow and fewer drop-offs across transition moments.",
      },
      {
        id: "video-edit-3",
        url: "/portfolio-website-thumbnail-v2-poster.jpg",
        label: "3",
        thumbnailSrc: "/portfolio-website-thumbnail-v2-poster.jpg",
        selectorTitle: "GUILT TRIP",
        selectorSubtitle: "Comedy/Horror Short Film",
        selectorDuration: "0:45",
        detailOverview:
          "Text-forward variation tuned for mute autoplay with larger type, safer contrast, and clearer callouts.",
        detailRole: "Caption design system and legibility balancing.",
        detailTools: ["CapCut", "Typography overlays"],
        detailImpact: "Improved message clarity for silent viewers and thumbnail-to-content continuity.",
      },
      {
        id: "video-edit-4",
        url: "/8bit-festival-thumbnail.jpg",
        label: "4",
        thumbnailSrc: "/8bit-festival-thumbnail.jpg",
        selectorTitle: "M.P.M.R",
        selectorSubtitle: "Comedy/Psychological Short Film",
        selectorDuration: "0:38",
        detailOverview:
          "Ending re-cut with payoff-first sequencing and cleaner audio punch for stronger loop potential.",
        detailRole: "Final polish, sound sync, and export optimization.",
        detailTools: ["DaVinci Resolve", "CapCut"],
        detailImpact: "Stronger final beat and better replay intent at the outro.",
      },
      {
        id: "video-edit-5",
        url: "/undertale-fhe-thumbnail.png",
        label: "5",
        thumbnailSrc: "/undertale-fhe-thumbnail.png",
        selectorTitle: "EDIT 05",
        selectorSubtitle: "Pacing Variant",
        selectorDuration: "0:32",
        detailOverview:
          "Alternate pacing pass emphasizing setup-to-punchline contrast and stronger cadence in transition points.",
        detailRole: "Timing pass, arrangement tweaks, and social delivery prep.",
        detailTools: ["DaVinci Resolve", "CapCut"],
        detailImpact: "Cleaner narrative rhythm across the middle beats with improved continuity.",
      },
      {
        id: "video-edit-6",
        url: "/slaywire-thumbnail.png",
        label: "6",
        thumbnailSrc: "/slaywire-thumbnail.png",
        selectorTitle: "EDIT 06",
        selectorSubtitle: "Branding Variant",
        selectorDuration: "0:27",
        detailOverview:
          "Title-card-forward variation tuned for branding clarity while preserving fast short-form momentum.",
        detailRole: "Brand integration, typography pass, and final polish.",
        detailTools: ["CapCut", "DaVinci Resolve"],
        detailImpact: "Stronger brand recall while maintaining retention-friendly pacing.",
      },
    ],
  },
  {
    id: "project-interactive-media",
    title: "INTERACTIVE MEDIA",
    tagline: "Web design, game dev, and animation.",
    thumbnail: "/portfolio-website-thumbnail-v2-poster.jpg",
    poster: "/portfolio-website-thumbnail-v2-poster.jpg",
    focalPoint: "50% 38%",
    detailOverview:
      "Playable and interactive work?from GameMaker prototypes to motion-forward web UI?where feel, pacing, and user flow are the design problem.",
    detailRole: "Design, implementation, and iteration across game and front-end builds.",
    detailTools: ["GameMaker Studio 2", "React", "Vite", "TypeScript", "Framer Motion"],
    detailImpact: "Shippable slices with tight feedback loops and interfaces that reward exploration.",
    detailVideos: [
      {
        id: "interactive-media-1",
        url: "/portfolio-website-thumbnail-v2-poster.jpg",
        label: "UNDERTALE FHE",
        thumbnailSrc: "/portfolio-website-thumbnail-v2-poster.jpg",
        selectorTitle: "UNDERTALE FHE",
        selectorSubtitle: "Games projects and web experiences",
        detailOverview:
          "Playable and interactive work?from GameMaker prototypes to motion-forward web UI?where feel, pacing, and user flow are the design problem.",
        detailRole: "Design, implementation, and iteration across game and front-end builds.",
        detailTools: ["GameMaker Studio 2", "React", "Vite", "TypeScript", "Framer Motion"],
        detailImpact: "Shippable slices with tight feedback loops and interfaces that reward exploration.",
      },
      {
        id: "interactive-media-2",
        url: "/portfolio-website-thumbnail-v2-poster.jpg",
        label: "INTERACTIVE MEDIA",
        thumbnailSrc: "/portfolio-website-thumbnail-v2-poster.jpg",
        selectorTitle: "INTERACTIVE MEDIA",
        selectorSubtitle: "Games projects and web experiences",
        detailOverview:
          "Playable and interactive work?from GameMaker prototypes to motion-forward web UI?where feel, pacing, and user flow are the design problem.",
        detailRole: "Design, implementation, and iteration across game and front-end builds.",
        detailTools: ["GameMaker Studio 2", "React", "Vite", "TypeScript", "Framer Motion"],
        detailImpact: "Shippable slices with tight feedback loops and interfaces that reward exploration.",
      },
      {
        id: "interactive-media-3",
        url: "/portfolio-website-thumbnail-v2-poster.jpg",
        label: "INTERACTIVE MEDIA",
        thumbnailSrc: "/portfolio-website-thumbnail-v2-poster.jpg",
        selectorTitle: "INTERACTIVE MEDIA",
        selectorSubtitle: "Games projects and web experiences",
        detailOverview:
          "Playable and interactive work?from GameMaker prototypes to motion-forward web UI?where feel, pacing, and user flow are the design problem.",
        detailRole: "Design, implementation, and iteration across game and front-end builds.",
        detailTools: ["GameMaker Studio 2", "React", "Vite", "TypeScript", "Framer Motion"],
        detailImpact: "Shippable slices with tight feedback loops and interfaces that reward exploration.",
      },
      {
        id: "interactive-media-4",
        url: "/portfolio-website-thumbnail-v2-poster.jpg",
        label: "INTERACTIVE MEDIA",
        thumbnailSrc: "/portfolio-website-thumbnail-v2-poster.jpg",
        selectorTitle: "INTERACTIVE MEDIA",
        selectorSubtitle: "Games projects and web experiences",
        detailOverview:
          "Playable and interactive work?from GameMaker prototypes to motion-forward web UI?where feel, pacing, and user flow are the design problem.",
        detailRole: "Design, implementation, and iteration across game and front-end builds.",
        detailTools: ["GameMaker Studio 2", "React", "Vite", "TypeScript", "Framer Motion"],
        detailImpact: "Shippable slices with tight feedback loops and interfaces that reward exploration.",
      },
    ],
  },
  {
    id: "project-slaywire",
    title: "SLAYWIRE",
    tagline: "Self-produced original narrative IP.",
    thumbnail: "/slaywire-thumbnail.png",
    focalPoint: "50% 40%",
    detailOverview:
      "Original long-form illustrated narrative?worldbuilding, cast, and visual development for a standalone graphic novel.",
    detailRole: "Writer, illustrator, and world/visual development.",
    detailTools: ["Digital illustration", "Layout & print-minded pacing"],
    detailImpact: "A durable IP bible and finished spreads that support pitching and incremental publishing.",
    detailVideos: [
      {
        id: "slaywire-cover",
        url: "/slaywire-thumbnail.png",
        label: "1",
        thumbnailSrc: "/slaywire-thumbnail.png",
        selectorTitle: "SLAYWIRE",
        selectorSubtitle: "Cover art",
        detailOverview:
          "Original long-form illustrated narrative—worldbuilding, cast, and visual development for a standalone graphic novel.",
        detailRole: "Writer, illustrator, and world/visual development.",
        detailTools: ["Digital illustration", "Layout & print-minded pacing"],
        detailImpact: "A durable IP bible and finished spreads that support pitching and incremental publishing.",
      },
      {
        id: "slaywire-de",
        url: "/illustrations/illustrations-slaywire.png",
        label: "2",
        thumbnailSrc: "/illustrations/illustrations-slaywire.png",
        selectorTitle: "DE",
        selectorSubtitle: "Character illustration",
        detailOverview:
          "Digital-ink and texture brush artwork featuring DE, a key character in SLAYWIRE—cast design tied to the larger narrative bible.",
        detailRole: "Character design, rendering, and promotional illustration.",
        detailTools: ["Procreate", "Photoshop"],
        detailImpact: "Anchor visual for pitching character-led moments in the IP.",
      },
      {
        id: "slaywire-world",
        url: "/slaywire-thumbnail.png",
        label: "3",
        thumbnailSrc: "/slaywire-thumbnail.png",
        selectorTitle: "WORLD",
        selectorSubtitle: "Visual development",
        detailOverview:
          "Mood, palette, and layout exploration for print-minded pacing—spreads built to read on the page, not just on screen.",
        detailRole: "Worldbuilding visuals and spread composition.",
        detailTools: ["Digital illustration", "Layout & print-minded pacing"],
        detailImpact: "Cohesive art direction that scales from pitch deck to finished chapter work.",
      },
      {
        id: "slaywire-promo",
        url: "/illustrations/illustrations-slaywire.png",
        label: "4",
        thumbnailSrc: "/illustrations/illustrations-slaywire.png",
        selectorTitle: "PROMO",
        selectorSubtitle: "Promotional illustration",
        detailOverview:
          "Digital-ink and texture brush artwork featuring DE—a pitch-ready promo piece tied to the SLAYWIRE cast and world bible.",
        detailRole: "Promotional illustration and IP-facing visual assets.",
        detailTools: ["Procreate", "Photoshop"],
        detailImpact: "Reusable promo art for decks, social, and incremental publishing beats.",
      },
    ],
  },
];

const PROJECT_DETAIL_LAYOUT_STORAGE_KEY = "portfolio.debug.projectDetailLayout.v1";

function sanitizeProjectDetailLayoutValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeProjectDetailLayoutDebugValues(
  values: Partial<ProjectDetailLayoutDebugValues> | undefined,
): ProjectDetailLayoutDebugValues {
  return {
    offsetX: sanitizeProjectDetailLayoutValue(
      values?.offsetX,
      PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS.offsetX,
    ),
    offsetY: sanitizeProjectDetailLayoutValue(
      values?.offsetY,
      PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS.offsetY,
    ),
    scale: sanitizeProjectDetailLayoutValue(
      values?.scale,
      PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS.scale,
    ),
    widthScale: sanitizeProjectDetailLayoutValue(
      values?.widthScale,
      PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS.widthScale,
    ),
    heightScale: sanitizeProjectDetailLayoutValue(
      values?.heightScale,
      PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS.heightScale,
    ),
  };
}

function readProjectDetailLayoutDebugValuesByProject(): Record<string, ProjectDetailLayoutDebugValues> {
  let stored: Record<string, ProjectDetailLayoutDebugValues> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(PROJECT_DETAIL_LAYOUT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, Partial<ProjectDetailLayoutDebugValues>>;
        stored = Object.fromEntries(
          Object.entries(parsed).map(([projectId, values]) => [
            projectId,
            normalizeProjectDetailLayoutDebugValues(values),
          ]),
        );
      }
    } catch {
      stored = {};
    }
  }
  // Locked projects: code constants are source of truth (ignore stale localStorage).
  for (const card of PROJECT_CARDS) {
    if (projectDetailLayoutHasLockedDefaults(card.id)) {
      stored[card.id] = projectDetailLayoutDefaultsForProject(card.id);
    }
  }
  return stored;
}

function saveProjectDetailLayoutDebugValuesByProject(
  valuesByProject: Record<string, ProjectDetailLayoutDebugValues>,
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECT_DETAIL_LAYOUT_STORAGE_KEY, JSON.stringify(valuesByProject));
  console.info("[Project Detail Layout Saved]", valuesByProject);
}


type SupportingArchivePdfItem = {
  id: string;
  title: string;
  subtitle: string;
  /** Omit or leave blank to open the in-app PDF reader with no document. */
  href?: string;
  /** Short blurb for FEATURED WRITING showcase (optional). */
  description?: string;
  /** Optional display ordering label (e.g. screenplay numbering). */
  index?: string;
};

const supportingPdfHref = (item: SupportingArchivePdfItem) => item.href?.trim() ?? "";

/** Creative nonfiction PDFs ? `client/public/cnf/`. */
const SUPPORTING_ARCHIVE_PDF_ITEMS: SupportingArchivePdfItem[] = [
  {
    id: "cnf-article",
    title: "Do You Want to See the Truth?",
    subtitle: "Robbie McLaughlin",
    href: "/cnf/example-1-article.pdf",
    description:
      "An interactive article, exploring the integration of the visual novel format with the gene creative nonfiction. Uses the limitations of written format to highlight the strengths of interactivity to tell real stories.",
  },
  {
    id: "cnf-media-literary",
    title: "Addressing Ethical Issues in Gaming - Omori",
    subtitle: "Robbie McLaughlin",
    href: "/cnf/example-2-media-literary-analysis.pdf",
    description:
      "A written analysis on Omori: An indie psychological-horror game developed by OMOCAT (2020). Explores the title's utilization of horror through its medium, and the use of game mechanics to destigmatize mental health.",
  },
  {
    id: "cnf-critical-essay",
    title: "Reflections of Mammy - A Séamas O'Reilly Literary Analysis",
    subtitle: "Robbie McLaughlin",
    href: "/cnf/example-3-critical-literary-essay.pdf",
    description:
      "A structural breakdown of Séamas O'Reilly's award-winning memoir: Did Ye Hear Mammy Died? A closer look into the author's craft and technique in creative nonfiction."
  },
  {
    id: "cnf-memoir",
    title: " Way of the Frog: Amphibious Meditations",
    subtitle: "Robbie McLaughlin (2023)",
    href: "/cnf/example-4-memoir.pdf",
    description: "A reflection of a small frog's enlightenment, discussing anthropomorphism, mortality, and reincarnation."
  },
];

/** Screenplays ? `client/public/screenplays/`. */
const SCREENPLAY_PDF_ITEMS: SupportingArchivePdfItem[] = [
  {
    id: "screenplay-audience-of-one",
    title: "Audience of One",
    subtitle: "Robbie McLaughlin",
    href: "/screenplays/audience-of-one-robbie-mclaughlin.pdf",
    description:
      "Atop Peach Hill Cemetery, an aging detective must stop a disturbed sock puppeteer's fatal final act.",
  },
  {
    id: "screenplay-rock-paper-promise",
    index: "02",
    title: "Rock Paper Promise",
    subtitle: "Robbie McLaughlin",
    href: "/screenplays/rock-paper-promise-robbie-mclaughlin.pdf",
  },
  {
    id: "screenplay-fetch",
    title: "Fetch",
    subtitle: "Robbie McLaughlin",
    href: "/screenplays/fetch.pdf",
  },
];

/** Short graphic novel PDFs ? `client/public/short-graphic-novels/`. */
const SHORT_GRAPHIC_NOVEL_PDF_ITEMS: SupportingArchivePdfItem[] = [
  {
    id: "sgn-blossom-ink-bw",
    title: "Blossom",
    subtitle: "Robbie McLaughlin",
    href: "/short-graphic-novels/blossom-ink-bw.pdf",
    description:
      "A walking, talking tree comes to terms with his addiction to lighting himself on fire.",
  },
  {
    id: "sgn-writ405-final",
    title: "WRIT405",
    subtitle: "Final revision ? Robbie McLaughlin",
    href: "/short-graphic-novels/writ405-final-revision-robbie-mclaughlin.pdf",
  },
  {
    id: "sgn-blossom-thumbnails",
    title: "Blossom",
    subtitle: "Thumbnails ? Robbie McLaughlin",
    href: "/short-graphic-novels/blossom-thumbnails-robbie-mclaughlin.pdf",
  },
  {
    id: "sgn-blossom-pencils",
    title: "Blossom",
    subtitle: "Pencils",
    href: "/short-graphic-novels/blossom-pencils.pdf",
  },
];

const SUPPORTING_ARCHIVE_PDF_SECTIONS: { heading: string; items: SupportingArchivePdfItem[] }[] = [
  { heading: "Creative nonfiction ? PDF", items: SUPPORTING_ARCHIVE_PDF_ITEMS },
  { heading: "Screenplays ? PDF", items: SCREENPLAY_PDF_ITEMS },
  { heading: "Short graphic novels ? PDF", items: SHORT_GRAPHIC_NOVEL_PDF_ITEMS },
];

/**
 * FEATURED WRITING ? VIEW loader PDFs (tab order: Content Writing ? Narrative Essay).
 * Files live in `public/cnf/`, `public/screenplays/`, `public/short-graphic-novels/`.
 */
const SHOWCASE_WRITING_TAB_FEATURED_ORDER = [
  SUPPORTING_ARCHIVE_PDF_ITEMS.find((x) => x.id === "cnf-article")!,
  SCREENPLAY_PDF_ITEMS.find((x) => x.id === "screenplay-audience-of-one")!,
  SHORT_GRAPHIC_NOVEL_PDF_ITEMS.find((x) => x.id === "sgn-blossom-ink-bw")!,
  SUPPORTING_ARCHIVE_PDF_ITEMS.find((x) => x.id === "cnf-critical-essay")!,
  SUPPORTING_ARCHIVE_PDF_ITEMS.find((x) => x.id === "cnf-media-literary")!,
  {
    ...SUPPORTING_ARCHIVE_PDF_ITEMS.find((x) => x.id === "cnf-memoir")!,
    title: "Way of the Frog: Amphibious Meditations",
  },
] as const satisfies readonly SupportingArchivePdfItem[];

const SHOWCASE_WRITING_TAB_FEATURED: Record<ShowcaseTabId, SupportingArchivePdfItem> = {
  "tab-1": SHOWCASE_WRITING_TAB_FEATURED_ORDER[0],
  "tab-2": SHOWCASE_WRITING_TAB_FEATURED_ORDER[1],
  "tab-3": SHOWCASE_WRITING_TAB_FEATURED_ORDER[2],
  "tab-4": SHOWCASE_WRITING_TAB_FEATURED_ORDER[3],
  "tab-5": SHOWCASE_WRITING_TAB_FEATURED_ORDER[4],
  "tab-6": SHOWCASE_WRITING_TAB_FEATURED_ORDER[5],
};

const archiveRowIndexLabel = (rowIndex: number) => String(rowIndex + 1).padStart(2, "0");

/** Still-image warmup only — keep short. Video files must not buffer on load (see Home media warmup). */
const PROJECT_MEDIA_WARMUP_DELAY_MS = 400;

/** Showcase carousel parallax tween (same idea as Embla ?Predefined ? Parallax?). */
const PROJECT_CAROUSEL_TWEEN_FACTOR_BASE = 0.52;

/** Divide showcase + card?detail durations by this for a uniform speed-up (1.2 ? 20% faster). */
const SHOWCASE_TIME_DIV = 1.2;
/** PROJECTS main cards — PORTFOLIO SPEED (see `PORTFOLIO_SPEED` in `src/lib/motion.ts`). */
const PROJECT_CARD_HOVER = PORTFOLIO_SPEED.hover;
const PROJECT_CARD_TAP = PORTFOLIO_SPEED.tap;
const PROJECT_CARD_TAP_SPRING = PORTFOLIO_SPEED.tapSpring;
/** Wait so press-in + spring settle are mostly visible before opening. */
const PROJECT_CARD_TAP_FEEDBACK_MS = PORTFOLIO_SPEED.tapFeedbackMs;
/** Open detail this many ms before click anim ends (overlap the last of the settle). */
const PROJECT_CARD_DETAIL_OPEN_LEAD_MS = 130;
const PROJECT_CARD_AUTOPLAY_DELAY_MS = Math.round(360 / SHOWCASE_TIME_DIV);
/** Showcase carousel: advance one snap after entrance; interval between advances. */
const PROJECT_CAROUSEL_AUTO_ADVANCE_MS = 2500;
const PROJECTS_CAROUSEL_ENTRANCE_FADE_S = 0.34;
const ENABLE_PROJECT_CARD_VIDEO_AUTOPLAY = false;
/** Project row — single-line card titles (no wrap); optional `titlePrefix` stacks above without shifting tagline. */
const PROJECT_CARD_TITLE_CLASS =
  "project-card-title font-display tracking-tight text-white opacity-100 motion-safe:transition-[opacity,color] motion-safe:duration-300 motion-safe:ease-out group-hover:text-[color:var(--palette-yellow-projects)]";

const showcaseProjectDisplayTitle = (card: Pick<ShowcaseProjectCard, "title" | "titlePrefix">) =>
  card.titlePrefix ? `${card.titlePrefix} ${card.title}` : card.title;

function ShowcaseStackedTitle({
  title,
  titlePrefix,
  className = "",
}: {
  title: string;
  titlePrefix?: string;
  className?: string;
}) {
  if (!titlePrefix) {
    return <span className={className}>{title}</span>;
  }
  return (
    <span className={`relative ${className}`.trim()}>
      <span className="showcase-stacked-title-prefix">{titlePrefix}</span>
      <span className="showcase-stacked-title-main">{title}</span>
    </span>
  );
}
const SHOWCASE_EASE = [0.16, 1, 0.3, 1] as const;
/** Fade when swapping SHOWCASE carousel ? Supporting & archive in place */
const SHOWCASE_SUBROUTE_FADE_S = DUR.fast;
/** FEATURED WRITING PDF dismiss on PROJECTS — matches side-nav overlay. */
const SHOWCASE_PDF_OVERLAY_CLOSE_S = SIDE_NAV_OVERLAY_FADE_S;
const SHOWCASE_PDF_OVERLAY_OPEN_S = 0.175;
/** FLIP morph: carousel card ? detail hero (ease matches SHOWCASE_EASE for one continuous feel). */
const SHOWCASE_CARD_MORPH_DUR_S = 0.36 / SHOWCASE_TIME_DIV;
/** Carousel chrome fades while the flying card moves ? slightly shorter than morph so the handoff reads clean. */
const SHOWCASE_CARD_OPEN_FADE_S = 0.34 / SHOWCASE_TIME_DIV;
/** Extra speed for project-detail title + grid fades (? on top of SHOWCASE_TIME_DIV). */
const DETAIL_TEXT_FADE_EXTRA_DIV = 1.12;
/** Copy below hero: CSS transitions + rAF defer ? short opacity, dominant slide. */
const DETAIL_HDR_OPACITY_MS = Math.round(95 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_HDR_SLIDE_MS = Math.round(280 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_HDR_SLIDE_PX = Math.round(22 / SHOWCASE_TIME_DIV);
const DETAIL_GRID_OPACITY_MS = Math.round(110 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_GRID_SLIDE_MS = Math.round(300 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_GRID_SLIDE_PX = Math.round(28 / SHOWCASE_TIME_DIV);
const DETAIL_ROW1_AFTER_HDR_MS = Math.round(34 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_ROW2_STAGGER_MS = Math.round(96 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_HDR_REVEAL_DELAY_MS = Math.round(52 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_FADE_CUBIC = "cubic-bezier(0.4, 0, 0.95, 1)";
const DETAIL_SLIDE_CUBIC = "cubic-bezier(0.16, 1, 0.32, 1)";
/** Start grey rule this many ms before FLIP morph completes (timed from morph start). */
const DETAIL_RULE_LINE_LEAD_MS = Math.round(150 / SHOWCASE_TIME_DIV);
/** Horizontal rule under project title block: center-out scaleX. */
const DETAIL_RULE_EXPAND_MS = Math.round(280 / SHOWCASE_TIME_DIV);
/** Settled hero video/image: opacity ramp after morph (CSS; eases video compositor flash vs. motion.div). */
const DETAIL_HERO_MEDIA_FADE_MS = Math.round(340 / SHOWCASE_TIME_DIV);
const DETAIL_HERO_MEDIA_FADE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Align copy schedule with hero fade: ~double-rAF after morph before opacity transition (ms from morph end). */
const DETAIL_HERO_FADE_START_RAF_PAD_MS = 40;

/** Match detail hero / FLIP anchor height. Carousel four-up cards use SHOWCASE_CAROUSEL_CARD_H (+bump, gap-compensated). */
const DETAIL_CARD_H =
  "h-[min(220px,36svh)] sm:h-[min(244px,40svh)] md:h-[min(260px,42svh)] lg:h-[min(276px,44svh)] xl:h-[min(290px,46svh)] 2xl:h-[min(304px,48svh)]";
/** Four-up carousel — +1.25rem vs DETAIL_CARD_H + --showcase-subhead-reclaim (subhead removed; cards grow upward). */
const SHOWCASE_CAROUSEL_CARD_H =
  "h-[min(264px,36svh)] sm:h-[min(288px,40svh)] md:h-[min(304px,42svh)] lg:h-[min(380px,49svh)] xl:h-[min(400px,51svh)] 2xl:h-[min(420px,53svh)]";
/** DESCRIPTION SECTION — black panel + title/tagline (bottom third of each showcase card). */
const PROJECT_CARD_DESCRIPTION_SECTION =
  "project-card-description-section absolute inset-x-0 bottom-0 z-[1] flex h-1/3 min-h-0 flex-col overflow-hidden bg-black";
/** Thumbnail media — top two-thirds only; DESCRIPTION SECTION owns the bottom third. */
const PROJECT_CARD_THUMBNAIL_SECTION =
  "project-card-thumbnail-section absolute inset-x-0 top-0 z-0 h-2/3 min-h-0 overflow-hidden";
const PROJECT_CARD_THUMBNAIL_IMAGE_BLEED =
  "project-card-thumbnail-section absolute top-0 z-0 h-2/3 min-h-0 -left-4 -right-4 overflow-hidden sm:-left-5 sm:-right-5";
/** Same shape as hero media vignette; edge opacity reduced 25% (0.4 → 0.3). */
const PROJECT_CARD_THUMBNAIL_VIGNETTE =
  "radial-gradient(ellipse 74% 70% at 50% 48%, transparent 26%, rgba(0,0,0,0.3) 100%)";
/** Tagline row — description below inset grey divider (same inset as title; no side bleed). */
const PROJECT_CARD_TAGLINE_DIVIDER =
  "shrink-0 border-t border-white/15";
const PROJECT_CARD_TAGLINE_PANEL =
  "project-card-tagline-panel flex min-h-0 flex-1 flex-col justify-start gap-1.5 px-2.5 pb-3 pt-0 sm:gap-2 sm:px-3 sm:pb-3.5";
const PROJECT_CARD_TITLE_INSET =
  "project-card-title-inset shrink-0 px-2.5 pb-1.5 pt-2.5 sm:px-3 sm:pb-2 sm:pt-3";
const PROJECT_CARD_TAGLINE_CLASS =
  "project-card-tagline font-body block w-full text-left text-xs leading-snug sm:text-[0.8125rem] md:text-sm lg:text-[0.9375rem] text-mono-2/70 transition-colors group-hover:text-white/90";

const showcaseTaglineCopy = (card: Pick<ShowcaseProjectCard, "tagline" | "mobileTagline">) =>
  card.mobileTagline ? (
    <>
      <span className="max-md:hidden">{card.tagline}</span>
      <span className="hidden max-md:inline">{card.mobileTagline}</span>
    </>
  ) : (
    card.tagline
  );
/** SHOWCASE carousel inner column cap (detail overlay / career rail — not PROFILE viewport gutters). */
const SHOWCASE_COLUMN_MAX = "max-w-[min(100%,58rem)]";
/** Mobile/tablet section top inset — PROFILE, Experience, Projects, Skills (`lg+` uses section-specific desktop pt). */
const SECTION_OVERLAY_TOP_INSET_MAX_LG =
  "max-lg:pt-[calc(24vh+0.625rem)] max-lg:max-sm:pt-[max(calc(5.5rem+0.625rem),calc(env(safe-area-inset-top,0px)+0.625rem))]";
/** Mobile scroll end air — PROFILE panel scroller. */
const SECTION_OVERLAY_BOTTOM_SPACER_MAX_LG =
  "hidden max-lg:block shrink-0 w-full pointer-events-none min-h-[max(3rem,calc(2rem+env(safe-area-inset-bottom,0px)))] max-lg:sm:min-h-[max(3.5rem,calc(2.25rem+env(safe-area-inset-bottom,0px)))]";
/** Tablet only (768px–1366px): PROJECTS + SKILLS scroll-end air — visibility in index.css `.section-tablet-bottom-spacer`. */
const SECTION_TABLET_BOTTOM_SPACER = "section-tablet-bottom-spacer";
/** Tablet PROJECTS showcase list — pairs with index.css `.projects-showcase-tablet-pad` bottom pad. */
const PROJECTS_SHOWCASE_TABLET_PAD = "projects-showcase-tablet-pad";
/** iPad horizontal — landscape + coarse pointer within PROFILE tablet band. */
const PROJECTS_TABLET_LANDSCAPE_MQ = `(min-width: ${PROFILE_TABLET_MIN_PX}px) and (max-width: ${PROFILE_TABLET_MAX_PX}px) and (orientation: landscape) and (any-pointer: coarse)`;
const matchesProjectsTabletLandscapeViewport = () =>
  typeof window !== "undefined" && window.matchMedia(PROJECTS_TABLET_LANDSCAPE_MQ).matches;
const PROJECTS_TABLET_PORTRAIT_MQ =
  "(min-width: 768px) and (max-width: 1023.98px) and (orientation: portrait)";
const matchesProjectsTabletPortraitViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia(PROJECTS_TABLET_PORTRAIT_MQ).matches;
const PROJECTS_TABLET_LANDSCAPE_WIDTH_SCALE = 1.05;
/** Desktop main showcase lift vs pre-lift offsets; restored on iPad horizontal. */
const PROJECTS_DESKTOP_MAIN_LIFT_Y = -2;
/** Same inset as PROFILE; `!` overrides `.career-overview-shell` base padding in CSS. */
const EXPERIENCE_SHELL_TOP_INSET_MAX_LG =
  "max-lg:!pt-[calc(24vh+0.625rem)] max-lg:max-sm:!pt-[max(calc(5.5rem+0.625rem),calc(env(safe-area-inset-top,0px)+0.625rem))]";
/** Main section title top inset — `#projects` + `#skills` (`pt-16 sm:pt-20 md:pt-22` on desktop). */
const SECTION_MAIN_HEADER_INSET =
  `pt-16 sm:pt-20 md:pt-22 ${SECTION_OVERLAY_TOP_INSET_MAX_LG}`;
const PROFILE_SECTION_TOP_INSET =
  `pt-[24vh] max-sm:pt-[max(5.5rem,env(safe-area-inset-top,0px))] ${SECTION_OVERLAY_TOP_INSET_MAX_LG} lg:pt-0`;
/** Centered SHOWCASE rail header chrome — tight bottom margin; yellow line below. */
const SECTION_MAIN_HEADER_TITLE_CLASS =
  "mt-1 sm:mt-1.5 max-lg:mt-0 max-lg:sm:mt-0 !mb-2 sm:!mb-2.5 md:!mb-3 w-full shrink-0";
/** SKILLS main title — line gap via `.skills-main-header-chrome` in `index.css`. */
const SECTION_SKILLS_MAIN_HEADER_TITLE_CLASS =
  "skills-main-header-chrome mt-1 sm:mt-1.5 max-lg:mt-0 max-lg:sm:mt-0 shrink-0";
/** `#profile` shell — container + centered row (left column + gap + mascot). */
const PROFILE_SECTION_CONTAINER = "container mx-auto px-5 sm:px-6 relative z-20";
const PROFILE_LAYOUT_ROW =
  "flex w-full flex-col max-sm:gap-8 lg:flex-row lg:justify-center gap-20 lg:gap-20 xl:gap-36 2xl:gap-[min(14rem,12vw)] items-center";
const PROFILE_LEFT_COLUMN =
  "min-w-0 max-sm:order-1 max-sm:w-full lg:order-1 w-full lg:w-auto lg:max-w-[38rem] xl:max-w-[40rem] 2xl:max-w-[44rem] lg:shrink-0 lg:mt-0";
const PROFILE_MASCOT_COLUMN =
  "lg:order-2 w-full lg:w-auto lg:min-w-0 lg:shrink-0 flex justify-center translate-x-2 max-sm:order-2 max-sm:mt-2 max-sm:translate-x-0 sm:max-lg:-mt-16 sm:max-lg:-translate-y-2 lg:translate-y-0 lg:mt-0";
const PROFILE_MASCOT_FRAME =
  "shrink-0 flex items-center justify-center w-[220px] h-[220px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px] xl:w-[312px] xl:h-[312px] 2xl:w-[348px] 2xl:h-[348px]";
/** Total row width (left + gap + mascot) — centers SKILLS with the same L/R viewport gutters as PROFILE. */
const PROFILE_VIEWPORT_CONTENT_MAX =
  "w-full min-w-0 mx-auto lg:max-w-[min(100%,calc(38rem+5rem+300px))] xl:max-w-[min(100%,calc(40rem+9rem+312px))] 2xl:max-w-[min(100%,calc(44rem+min(14rem,12vw)+348px))]";
/** `#projects` — same L/R viewport gutters as #profile (portfoliov2-profile-viewport-gutters). */
const PROJECTS_VIEWPORT_SHELL = `${PROFILE_VIEWPORT_CONTENT_MAX} relative z-[1] flex min-h-0 w-full min-w-0 flex-1 flex-col self-center`;
const SECTION_CONTAINER_GUTTER =
  "container relative z-10 mx-auto w-full min-w-0 max-w-full px-5 sm:px-6";

const ProjectsStack = ({
  onSelect,
  focusProjectId = null,
  contentReady = true,
  onContentReadyChange,
  carouselAutoAdvanceEnabled: _carouselAutoAdvanceEnabled = false,
  tabletThumbnailValues,
}: {
  onSelect: (id: string, el: HTMLElement) => void;
  focusProjectId?: string | null;
  contentReady?: boolean;
  onContentReadyChange?: (ready: boolean) => void;
  /** When true, advance one slide every PROJECT_CAROUSEL_AUTO_ADVANCE_MS (after entrance). */
  carouselAutoAdvanceEnabled?: boolean;
  tabletThumbnailValues?: ProjectsTabletThumbnailDebugValues;
}) => {
  const reduceMotion = useReducedMotion();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const readyMediaRef = useRef<Set<number>>(new Set());
  const selectPendingRef = useRef(false);
  const selectTimerRef = useRef<number | null>(null);
  const pressLockTimerRef = useRef<number | null>(null);
  const [loadedMediaCount, setLoadedMediaCount] = useState(0);
  /** Press / settle window (yellow accent + release target = hover size). */
  const [pressLockId, setPressLockId] = useState<string | null>(null);
  /** Pointer hover — independent of press so click can settle at hover size first. */
  const [hoverCardId, setHoverCardId] = useState<string | null>(null);

  const requiredMediaCount = useMemo(
    () => PROJECT_CARDS.reduce((count, card) => count + (card.thumbnail || card.thumbnailVideo ? 1 : 0), 0),
    [],
  );

  const markCardMediaReady = useCallback((index: number) => {
    if (readyMediaRef.current.has(index)) return;
    readyMediaRef.current.add(index);
    setLoadedMediaCount((prev) => prev + 1);
  }, []);

  const clearSelectTimer = useCallback(() => {
    if (selectTimerRef.current == null) return;
    window.clearTimeout(selectTimerRef.current);
    selectTimerRef.current = null;
  }, []);

  const clearPressLockTimer = useCallback(() => {
    if (pressLockTimerRef.current == null) return;
    window.clearTimeout(pressLockTimerRef.current);
    pressLockTimerRef.current = null;
  }, []);

  const handleCardPointerDown = useCallback((cardId: string) => {
    setPressLockId(cardId);
  }, []);

  const handleCardPointerUpOrCancel = useCallback((cardId: string) => {
    // Click fires after pointerup — keep lock if activate is about to run / pending.
    queueMicrotask(() => {
      if (selectPendingRef.current) return;
      setPressLockId((id) => (id === cardId ? null : id));
    });
  }, []);

  /** Snappy press, then open detail slightly before settle ends; keep press lock through full settle. */
  const handleCardActivate = useCallback(
    (cardId: string, el: HTMLElement) => {
      if (selectPendingRef.current) return;
      setPressLockId(cardId);
      const feedbackMs = reduceMotion ? 0 : PROJECT_CARD_TAP_FEEDBACK_MS;
      const openDelayMs = reduceMotion
        ? 0
        : Math.max(0, PROJECT_CARD_TAP_FEEDBACK_MS - PROJECT_CARD_DETAIL_OPEN_LEAD_MS);

      if (feedbackMs <= 0) {
        setPressLockId(null);
        onSelect(cardId, el);
        return;
      }

      selectPendingRef.current = true;
      clearSelectTimer();
      clearPressLockTimer();

      selectTimerRef.current = window.setTimeout(() => {
        selectTimerRef.current = null;
        onSelect(cardId, el);
      }, openDelayMs);

      pressLockTimerRef.current = window.setTimeout(() => {
        pressLockTimerRef.current = null;
        selectPendingRef.current = false;
        setPressLockId(null);
      }, feedbackMs);
    },
    [clearPressLockTimer, clearSelectTimer, onSelect, reduceMotion],
  );

  useEffect(() => {
    onContentReadyChange?.(loadedMediaCount >= requiredMediaCount);
  }, [loadedMediaCount, onContentReadyChange, requiredMediaCount]);

  useEffect(
    () => () => {
      clearSelectTimer();
      clearPressLockTimer();
    },
    [clearPressLockTimer, clearSelectTimer],
  );

  useEffect(() => {
    if (!ENABLE_PROJECT_CARD_VIDEO_AUTOPLAY) {
      videoRefs.current.forEach((video) => {
        if (!video) return;
        video.pause();
      });
      return;
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (PROJECT_CARDS[index]?.thumbnailVideo) {
        const playPromise = video.play();
        if (playPromise) {
          playPromise.catch(() => {
            // Ignore autoplay rejections from the browser.
          });
        }
        return;
      }

      video.pause();
      video.currentTime = 0;
    });
  }, [loadedMediaCount]);

  return (
    <div className="projects-carousel-stack -mt-1 sm:-mt-1.5 flex w-full min-w-0 flex-col justify-center overflow-x-visible overflow-y-visible pt-2 pb-0 sm:pt-3">
      <div className="w-full min-w-0">
        <div className="min-w-0 max-w-full w-full overflow-visible [--slide-gap:0.875rem] sm:[--slide-gap:1.25rem] lg:[--slide-gap:1rem] xl:[--slide-gap:1.125rem] max-sm:[--slide-gap:0.625rem]">
          <div className="projects-carousel-grid grid w-full min-w-0 grid-cols-2 sm:grid-cols-4 gap-[var(--slide-gap)] overflow-visible">
            {PROJECT_CARDS.map((card, index) => {
              const isPressing = pressLockId === card.id;
              const isHovered = hoverCardId === card.id;
              /** Click release settles at hover size; drop to 1 only after press if pointer left. */
              const restScale =
                reduceMotion || !(isPressing || isHovered) ? 1 : PROJECT_CARD_HOVER.scale;
              return (
              <div key={card.id} className="min-w-0 overflow-visible">
                {/* PORTFOLIO SPEED: tap → hover size; hover off only after settle if pointer left. */}
                <motion.div
                  className="project-card-tap-shell w-full origin-center"
                  initial={false}
                  animate={reduceMotion ? undefined : { scale: restScale }}
                  whileTap={reduceMotion ? undefined : PROJECT_CARD_TAP}
                  transition={
                    isPressing ? PROJECT_CARD_TAP_SPRING : PROJECT_CARD_HOVER.transition
                  }
                  onHoverStart={() => setHoverCardId(card.id)}
                  onHoverEnd={() =>
                    setHoverCardId((id) => (id === card.id ? null : id))
                  }
                >
                  <button
                    type="button"
                    data-carousel-card
                    onPointerDown={() => handleCardPointerDown(card.id)}
                    onPointerUp={() => handleCardPointerUpOrCancel(card.id)}
                    onPointerCancel={() => handleCardPointerUpOrCancel(card.id)}
                    onClick={(e) => handleCardActivate(card.id, e.currentTarget)}
                    className={`group project-card-surface relative w-full [container-type:inline-size] ${SHOWCASE_CAROUSEL_CARD_H} rounded-[11px] sm:rounded-xl border border-[var(--portfolio-glass-stroke)] shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9)] text-center overflow-hidden transition-[opacity,background-color,border-color] duration-300 ease-out ${
                      contentReady
                        ? "hover:border-[color:var(--palette-yellow-projects)] hover:bg-black [background:#000]"
                        : "[background:transparent!important] hover:[background:transparent!important]"
                    } ${
                      isPressing
                        ? "is-press-accent border-[color:var(--palette-yellow-projects)] bg-black"
                        : ""
                    } hover:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--palette-yellow-projects)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      focusProjectId && focusProjectId !== card.id ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                    style={contentReady ? undefined : { background: "transparent", backgroundImage: "none" }}
                  >
                  <div
                    className={`h-full transition-opacity duration-300 ease-out ${
                      contentReady ? "opacity-100" : "opacity-0"
                    } relative z-0`}
                  >
                      {card.thumbnail || card.thumbnailVideo ? (
                        <>
                          <div
                            className={
                              card.thumbnailVideo
                                ? PROJECT_CARD_THUMBNAIL_SECTION
                                : PROJECT_CARD_THUMBNAIL_IMAGE_BLEED
                            }
                          >
                            {card.thumbnailVideo ? (
                              <video
                                ref={(node) => {
                                  videoRefs.current[index] = node;
                                }}
                                src={card.thumbnailVideo}
                                poster={card.poster}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-label={`${showcaseProjectDisplayTitle(card)} preview`}
                                className={`block h-full w-full ${
                                  (tabletThumbnailValues?.[
                                    card.id as ProjectsTabletThumbnailId
                                  ]?.zoom ??
                                    card.zoom ??
                                    1) < 1
                                    ? "object-contain"
                                    : "object-cover"
                                }`}
                                style={
                                  tabletThumbnailValues?.[
                                    card.id as ProjectsTabletThumbnailId
                                  ]
                                    ? buildProjectsTabletThumbnailStyle(
                                        tabletThumbnailValues[
                                          card.id as ProjectsTabletThumbnailId
                                        ],
                                      )
                                    : {
                                        objectPosition: card.focalPoint ?? "50% 50%",
                                        ...(card.zoom != null && card.zoom !== 1
                                          ? {
                                              transform: `scale(${card.zoom})`,
                                              transformOrigin:
                                                card.focalPoint ?? "50% 50%",
                                            }
                                          : {}),
                                      }
                                }
                                onLoadedMetadata={() => markCardMediaReady(index)}
                                onLoadedData={() => markCardMediaReady(index)}
                                onCanPlay={() => markCardMediaReady(index)}
                                onError={() => markCardMediaReady(index)}
                              />
                            ) : (
                              <div className="h-full w-full">
                                <img
                                  src={card.thumbnail}
                                  alt={`${showcaseProjectDisplayTitle(card)} thumbnail`}
                                  loading="eager"
                                  decoding="async"
                                  fetchPriority="high"
                                  className={`h-full w-full ${
                                    (tabletThumbnailValues?.[
                                      card.id as ProjectsTabletThumbnailId
                                    ]?.zoom ??
                                      card.zoom ??
                                      1) < 1
                                      ? "object-contain"
                                      : "object-cover"
                                  }`}
                                  style={
                                    tabletThumbnailValues?.[
                                      card.id as ProjectsTabletThumbnailId
                                    ]
                                      ? buildProjectsTabletThumbnailStyle(
                                          tabletThumbnailValues[
                                            card.id as ProjectsTabletThumbnailId
                                          ],
                                        )
                                      : {
                                          objectPosition:
                                            card.focalPoint ?? "50% 50%",
                                          ...(card.zoom != null && card.zoom !== 1
                                            ? {
                                                transform: `scale(${card.zoom})`,
                                                transformOrigin:
                                                  card.focalPoint ?? "50% 50%",
                                              }
                                            : {}),
                                        }
                                  }
                                  onLoad={() => markCardMediaReady(index)}
                                  onError={() => markCardMediaReady(index)}
                                />
                              </div>
                            )}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-[1]"
                              style={{ background: PROJECT_CARD_THUMBNAIL_VIGNETTE }}
                            />
                          </div>
                          <div className={PROJECT_CARD_DESCRIPTION_SECTION}>
                            <div className={PROJECT_CARD_TITLE_INSET}>
                              <ShowcaseStackedTitle
                                title={card.title}
                                titlePrefix={card.titlePrefix}
                                className={PROJECT_CARD_TITLE_CLASS}
                              />
                            </div>
                            <div className={PROJECT_CARD_TAGLINE_PANEL}>
                              <div className={PROJECT_CARD_TAGLINE_DIVIDER} aria-hidden />
                              <span
                                className={`${PROJECT_CARD_TAGLINE_CLASS}${
                                  card.tabletPortraitTaglineSuffix
                                    ? " project-card-tagline--has-tablet-portrait-suffix"
                                    : ""
                                }`}
                              >
                                {showcaseTaglineCopy(card)}
                                {card.tabletPortraitTaglineSuffix ? (
                                  <span className="project-card-tagline-tablet-portrait-suffix">
                                    {" "}
                                    {card.tabletPortraitTaglineSuffix}
                                  </span>
                                ) : null}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {!card.thumbnail && !card.thumbnailVideo ? (
                        <div className={PROJECT_CARD_DESCRIPTION_SECTION}>
                          <div className={PROJECT_CARD_TITLE_INSET}>
                            <ShowcaseStackedTitle
                              title={card.title}
                              titlePrefix={card.titlePrefix}
                              className={PROJECT_CARD_TITLE_CLASS}
                            />
                          </div>
                          <div className={PROJECT_CARD_TAGLINE_PANEL}>
                            <div className={PROJECT_CARD_TAGLINE_DIVIDER} aria-hidden />
                            <span
                              className={`${PROJECT_CARD_TAGLINE_CLASS}${
                                card.tabletPortraitTaglineSuffix
                                  ? " project-card-tagline--has-tablet-portrait-suffix"
                                  : ""
                              }`}
                            >
                              {showcaseTaglineCopy(card)}
                              {card.tabletPortraitTaglineSuffix ? (
                                <span className="project-card-tagline-tablet-portrait-suffix">
                                  {" "}
                                  {card.tabletPortraitTaglineSuffix}
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </button>
                </motion.div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/** WRITING SAMPLES + CAREER OVERVIEW ? optical scrollbar rail (desktop lg+). */
const PORTFOLIO_SECTION_SCROLLBAR_VISIBLE_MS = 450;
const PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX = 1024;
/** SKILLS / PROJECTS (tablet) grid overlay height sync — matches index.css. */
const SECTION_PANEL_GRID_SELECTOR = '[aria-label^="Section:"]';
/** Phone-only — panel scroller keeps PROJECTS scrollTop when detail opens; reset on in-flow detail. */
const PROJECTS_MOBILE_PANEL_MQ = "(max-width: 767px)";

function sectionGridOverlayHeightPx(
  section: HTMLElement,
  cssVar: "--projects-grid-overlay-height" | "--skills-grid-overlay-height",
): number {
  // Drop prior synced min-height so orientation changes can shrink (avoids scrollHeight ratchet).
  section.style.setProperty(cssVar, "0px");
  void section.offsetHeight;

  // PROJECTS showcase: measure to the bottom of the content stack, not flex-stretched shells.
  if (
    cssVar === "--projects-grid-overlay-height" &&
    section.id === "projects" &&
    section.classList.contains("projects-showcase-tablet-pad")
  ) {
    const stackBottom =
      section.querySelector<HTMLElement>(".projects-showcase-flow") ??
      section.querySelector<HTMLElement>(".projects-showcase-featured-block") ??
      section.querySelector<HTMLElement>(".projects-showcase-cards-cluster");
    if (stackBottom) {
      const sectionBox = section.getBoundingClientRect();
      const bottomBox = stackBottom.getBoundingClientRect();
      const padBottom = parseFloat(getComputedStyle(section).paddingBottom) || 0;
      return Math.max(0, Math.ceil(bottomBox.bottom - sectionBox.top + padBottom));
    }
  }

  const contentShell = section.querySelector<HTMLElement>(
    ":scope > div:not(.portfolio-grid-overlay)",
  );
  const contentH = contentShell
    ? Math.max(contentShell.offsetHeight, contentShell.scrollHeight)
    : Math.max(section.offsetHeight, section.scrollHeight);

  return contentH;
}

function bindSectionGridOverlayHeightSync(
  section: HTMLElement,
  cssVar: "--projects-grid-overlay-height" | "--skills-grid-overlay-height",
) {
  const panel = section.closest<HTMLElement>(SECTION_PANEL_GRID_SELECTOR);

  const sync = () => {
    section.style.setProperty(cssVar, `${sectionGridOverlayHeightPx(section, cssVar)}px`);
  };

  const syncAfterOrientation = () => {
    if (panel) panel.scrollTop = 0;
    sync();
    window.requestAnimationFrame(() => {
      sync();
      window.requestAnimationFrame(sync);
    });
    window.setTimeout(sync, 120);
    window.setTimeout(sync, 320);
  };

  sync();
  const ro = new ResizeObserver(sync);
  ro.observe(section);
  if (panel) ro.observe(panel);
  const contentShell = section.querySelector<HTMLElement>(":scope > div:not(.portfolio-grid-overlay)");
  if (contentShell) ro.observe(contentShell);

  window.addEventListener("resize", sync);
  window.addEventListener("orientationchange", syncAfterOrientation);
  window.visualViewport?.addEventListener("resize", sync);
  window.visualViewport?.addEventListener("scroll", sync);
  const orientationMq =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(orientation: portrait)")
      : null;
  const onOrientationMq = () => syncAfterOrientation();
  if (orientationMq) {
    if (typeof orientationMq.addEventListener === "function") {
      orientationMq.addEventListener("change", onOrientationMq);
    } else {
      orientationMq.addListener(onOrientationMq);
    }
  }

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", sync);
    window.removeEventListener("orientationchange", syncAfterOrientation);
    window.visualViewport?.removeEventListener("resize", sync);
    window.visualViewport?.removeEventListener("scroll", sync);
    if (orientationMq) {
      if (typeof orientationMq.removeEventListener === "function") {
        orientationMq.removeEventListener("change", onOrientationMq);
      } else {
        orientationMq.removeListener(onOrientationMq);
      }
    }
    section.style.removeProperty(cssVar);
  };
}
const PORTFOLIO_OPTICAL_RAIL_BOTTOM_NUDGE_PX = 4;
const PORTFOLIO_OPTICAL_RAIL_TOP_OUTSET_PX = 5;
const PORTFOLIO_OPTICAL_RAIL_BOTTOM_OUTSET_PX = 5;

/** True when pointer is in left/right margin of scroll area (empty BG beside centered column). */
function portfolioOpticalPointerInSideGutter(clientX: number, areaRect: DOMRect): boolean {
  const w = areaRect.width;
  if (w <= 0) return false;
  const x = clientX - areaRect.left;
  const band = Math.min(w * 0.22, 168);
  return x < band || x > w - band;
}

export type SupportingPdfPreviewControl = {
  close: () => void;
  isOpen: boolean;
};

const SupportingProjectsSection = ({
  onNavTransitionChange,
  previewControlRef,
}: {
  onNavTransitionChange?: (active: boolean) => void;
  /** Parent back button: close an open PDF instead of swapping sub-routes mid-transition. */
  previewControlRef?: MutableRefObject<SupportingPdfPreviewControl | null>;
} = {}) => {
  const [previewPdf, setPreviewPdf] = useState<SupportingArchivePdfItem | null>(null);
  /** Modal frame + PDF visibility state for preview card. */
  const [showPdfFrame, setShowPdfFrame] = useState(false);
  const [previewPdfReady, setPreviewPdfReady] = useState(false);
  const [isPreviewClosing, setIsPreviewClosing] = useState(false);
  const reduceMotion = useReducedMotion();
  const closePreviewTimerRef = useRef<number | null>(null);
  const returnGateTimerRef = useRef<number | null>(null);
  const archiveScrollHostRef = useRef<HTMLDivElement | null>(null);
  const archiveScrollAreaRef = useRef<HTMLDivElement | null>(null);
  const archiveScrollContentRef = useRef<HTMLDivElement | null>(null);
  const archiveOpticalRailWrapRef = useRef<HTMLDivElement | null>(null);
  const archiveOpticalTrackRef = useRef<HTMLDivElement | null>(null);
  const archiveOpticalThumbRef = useRef<HTMLDivElement | null>(null);
  const archiveFirstYellowRuleRef = useRef<HTMLHeadingElement | null>(null);
  const archiveScrollHideTimerRef = useRef<number | null>(null);
  const closeFinishHandledRef = useRef(false);

  const PREVIEW_CLOSE_FADE_S = 0.34;
  const PREVIEW_RETURN_GATE_MS = 70;
  /** Shell fade for preview card container. */
  const PREVIEW_PDF_DIALOG_FADE_S = 0.175;

  const finishClosePreview = useCallback(() => {
    if (closeFinishHandledRef.current) return;
    closeFinishHandledRef.current = true;
    if (closePreviewTimerRef.current !== null) {
      window.clearTimeout(closePreviewTimerRef.current);
      closePreviewTimerRef.current = null;
    }
    setPreviewPdf(null);
    setShowPdfFrame(false);
    setPreviewPdfReady(false);
    returnGateTimerRef.current = window.setTimeout(() => {
      setIsPreviewClosing(false);
      returnGateTimerRef.current = null;
    }, PREVIEW_RETURN_GATE_MS);
  }, []);

  const closePreview = useCallback(() => {
    // Prevent exiting while loader is still active; allow only after preview is ready.
    if (previewPdf && !showPdfFrame && !isPreviewClosing) return;
    if (isPreviewClosing) return;

    if (closePreviewTimerRef.current !== null) {
      window.clearTimeout(closePreviewTimerRef.current);
      closePreviewTimerRef.current = null;
    }
    if (returnGateTimerRef.current !== null) {
      window.clearTimeout(returnGateTimerRef.current);
      returnGateTimerRef.current = null;
    }

    closeFinishHandledRef.current = false;

    if (previewPdf && !reduceMotion) {
      setIsPreviewClosing(true);
      closePreviewTimerRef.current = window.setTimeout(() => {
        finishClosePreview();
        closePreviewTimerRef.current = null;
      }, Math.round(PREVIEW_CLOSE_FADE_S * 1000) + 80);
      return;
    }

    finishClosePreview();
  }, [
    finishClosePreview,
    isPreviewClosing,
    showPdfFrame,
    previewPdf,
    reduceMotion,
  ]);

  const handlePreviewShellAnimationComplete = useCallback(() => {
    if (!isPreviewClosing) return;
    finishClosePreview();
  }, [finishClosePreview, isPreviewClosing]);

  const openPreview = useCallback(
    (item: SupportingArchivePdfItem) => {
      if (previewPdf || isPreviewClosing) return;
      closeFinishHandledRef.current = false;
      setPreviewPdfReady(!supportingPdfHref(item));
      setShowPdfFrame(false);
      setPreviewPdf(item);
    },
    [isPreviewClosing, previewPdf],
  );

  useEffect(() => {
    if (!previewPdf) {
      setShowPdfFrame(false);
      setPreviewPdfReady(false);
    }
  }, [previewPdf]);

  useEffect(() => {
    if (!previewPdf) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePreview, previewPdf]);

  useEffect(
    () => () => {
      if (closePreviewTimerRef.current !== null) {
        window.clearTimeout(closePreviewTimerRef.current);
        closePreviewTimerRef.current = null;
      }
      if (returnGateTimerRef.current !== null) {
        window.clearTimeout(returnGateTimerRef.current);
        returnGateTimerRef.current = null;
      }
      if (archiveScrollHideTimerRef.current !== null) {
        window.clearTimeout(archiveScrollHideTimerRef.current);
        archiveScrollHideTimerRef.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    if (!previewPdf) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [previewPdf]);

  useEffect(() => {
    onNavTransitionChange?.(!!previewPdf || isPreviewClosing);
    return () => onNavTransitionChange?.(false);
  }, [isPreviewClosing, onNavTransitionChange, previewPdf]);

  useEffect(() => {
    if (!previewControlRef) return;
    const isOpen = Boolean(previewPdf || isPreviewClosing);
    previewControlRef.current = { close: closePreview, isOpen };
    return () => {
      previewControlRef.current = null;
    };
  }, [closePreview, isPreviewClosing, previewControlRef, previewPdf]);

  const rowBtnClass =
    "group flex w-full items-start gap-3 sm:gap-4 py-4 sm:py-4 pr-1 -mx-1 px-1 text-left transition-[transform,color,background-color] duration-200 ease-out motion-safe:group-hover:translate-x-1.5 bg-black/40 hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-blue-bright/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm border-0 cursor-pointer text-inherit";

  const updateArchiveOpticalScrollMetrics = useCallback(() => {
    const scrollEl = archiveScrollAreaRef.current;
    const trackEl = archiveOpticalTrackRef.current;
    const thumbEl = archiveOpticalThumbRef.current;
    const railWrap = archiveOpticalRailWrapRef.current;
    const hostEl = archiveScrollHostRef.current;
    if (!scrollEl || !trackEl || !thumbEl) return;

    const opticalActive =
      typeof window !== "undefined" &&
      window.matchMedia?.(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`).matches === true;
    if (!opticalActive) {
      if (railWrap) {
        railWrap.style.top = "";
        railWrap.style.bottom = "";
        railWrap.style.right = "";
        railWrap.style.visibility = "";
      }
      thumbEl.style.height = "0px";
      thumbEl.style.top = "0px";
      return;
    }

    if (railWrap) {
      const firstRuleEl = archiveFirstYellowRuleRef.current;
      if (hostEl && firstRuleEl) {
        const hostTop = hostEl.getBoundingClientRect().top;
        const ruleBottom = firstRuleEl.getBoundingClientRect().bottom;
        railWrap.style.top = `${Math.max(0, ruleBottom - hostTop - PORTFOLIO_OPTICAL_RAIL_TOP_OUTSET_PX)}px`;
      } else if (hostEl) {
        railWrap.style.top = `${Math.max(0, Math.min(56, Math.round(hostEl.clientHeight * 0.06)) - PORTFOLIO_OPTICAL_RAIL_TOP_OUTSET_PX)}px`;
      } else {
        railWrap.style.top = "";
      }

      const cs = getComputedStyle(scrollEl);
      const paddingBottomPx = parseFloat(cs.paddingBottom) || 0;
      let bottomPx = Math.max(
        0,
        paddingBottomPx - PORTFOLIO_OPTICAL_RAIL_BOTTOM_NUDGE_PX - PORTFOLIO_OPTICAL_RAIL_BOTTOM_OUTSET_PX,
      );
      if (hostEl) {
        const hostH = hostEl.clientHeight;
        const railTopPx = parseFloat(getComputedStyle(railWrap).top) || 0;
        const minTrackPx = 48;
        const maxBottom = Math.max(0, hostH - railTopPx - minTrackPx);
        bottomPx = Math.min(bottomPx, maxBottom);
      }
      railWrap.style.bottom = `${bottomPx}px`;

      const paddingRightPx = parseFloat(cs.paddingRight) || 0;
      let railW = railWrap.getBoundingClientRect().width;
      if (railW <= 0) {
        railW = 8;
      }
      railWrap.style.right = `${Math.max(0, (paddingRightPx - railW) / 2)}px`;
    }

    const { scrollHeight, clientHeight, scrollTop } = scrollEl;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    const trackH = trackEl.clientHeight;
    if (maxScroll <= 0 || trackH <= 0) {
      thumbEl.style.height = "0px";
      thumbEl.style.top = "0px";
      if (railWrap) railWrap.style.visibility = "hidden";
      return;
    }
    if (railWrap) railWrap.style.visibility = "";
    const coarsePointer =
      typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches === true;
    const minThumbPx = coarsePointer ? 36 : 28;
    const thumbH = Math.min(
      trackH,
      Math.max(minThumbPx, (clientHeight / scrollHeight) * trackH),
    );
    const thumbTravel = Math.max(0, trackH - thumbH);
    const thumbTop = thumbTravel <= 0 ? 0 : (scrollTop / maxScroll) * thumbTravel;
    thumbEl.style.height = `${thumbH}px`;
    thumbEl.style.top = `${thumbTop}px`;
  }, []);

  useLayoutEffect(() => {
    const scrollEl = archiveScrollAreaRef.current;
    const contentEl = archiveScrollContentRef.current;
    if (!scrollEl) return;
    const ro = new ResizeObserver(() => {
      updateArchiveOpticalScrollMetrics();
    });
    ro.observe(scrollEl);
    if (contentEl) ro.observe(contentEl);
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    const onViewportChange = () => {
      updateArchiveOpticalScrollMetrics();
    };
    if (vv) {
      vv.addEventListener("resize", onViewportChange);
      vv.addEventListener("scroll", onViewportChange);
    }
    window.addEventListener("orientationchange", onViewportChange);
    const opticalMql =
      typeof window !== "undefined"
        ? window.matchMedia(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`)
        : null;
    const onOpticalBreakpoint = () => {
      updateArchiveOpticalScrollMetrics();
    };
    opticalMql?.addEventListener("change", onOpticalBreakpoint);
    updateArchiveOpticalScrollMetrics();
    return () => {
      ro.disconnect();
      opticalMql?.removeEventListener("change", onOpticalBreakpoint);
      if (vv) {
        vv.removeEventListener("resize", onViewportChange);
        vv.removeEventListener("scroll", onViewportChange);
      }
      window.removeEventListener("orientationchange", onViewportChange);
    };
  }, [previewPdf, updateArchiveOpticalScrollMetrics]);

  const onArchiveOpticalThumbPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (
        typeof window === "undefined" ||
        !window.matchMedia?.(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`).matches
      ) {
        return;
      }
      const scrollEl = archiveScrollAreaRef.current;
      const trackEl = archiveOpticalTrackRef.current;
      const thumbEl = archiveOpticalThumbRef.current;
      if (!scrollEl || !trackEl || !thumbEl) return;
      const maxScroll = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
      if (maxScroll <= 0) return;
      const trackH = trackEl.clientHeight;
      const thumbH = thumbEl.offsetHeight;
      const thumbTravel = Math.max(0, trackH - thumbH);
      const startScrollTop = scrollEl.scrollTop;
      const startY = e.clientY;
      thumbEl.setPointerCapture(e.pointerId);
      const onMove = (ev: PointerEvent) => {
        const dy = ev.clientY - startY;
        const dScroll = thumbTravel > 0 ? (dy / thumbTravel) * maxScroll : 0;
        scrollEl.scrollTop = Math.min(maxScroll, Math.max(0, startScrollTop + dScroll));
        updateArchiveOpticalScrollMetrics();
      };
      const onUp = (ev: PointerEvent) => {
        try {
          thumbEl.releasePointerCapture(ev.pointerId);
        } catch {
          /* released */
        }
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [updateArchiveOpticalScrollMetrics],
  );

  const revealArchiveOpticalScrollbar = useCallback(() => {
    const opticalActive =
      typeof window !== "undefined" &&
      window.matchMedia?.(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`).matches === true;
    const host = archiveScrollHostRef.current;
    if (!host || !opticalActive) return;
    host.classList.add("archive-optical-scrollbar-host--visible");
    if (archiveScrollHideTimerRef.current !== null) {
      window.clearTimeout(archiveScrollHideTimerRef.current);
    }
    archiveScrollHideTimerRef.current = window.setTimeout(() => {
      host.classList.remove("archive-optical-scrollbar-host--visible");
      archiveScrollHideTimerRef.current = null;
    }, PORTFOLIO_SECTION_SCROLLBAR_VISIBLE_MS);
    updateArchiveOpticalScrollMetrics();
  }, [updateArchiveOpticalScrollMetrics]);

  const onArchiveListScroll = useCallback(() => {
    revealArchiveOpticalScrollbar();
  }, [revealArchiveOpticalScrollbar]);

  const onArchiveScrollAreaPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = archiveScrollAreaRef.current;
      if (!el) return;
      if (
        typeof window === "undefined" ||
        !window.matchMedia?.(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`).matches
      ) {
        return;
      }
      if (!portfolioOpticalPointerInSideGutter(e.clientX, el.getBoundingClientRect())) return;
      revealArchiveOpticalScrollbar();
    },
    [revealArchiveOpticalScrollbar],
  );

  return (
    <section
      id="projects-supporting"
      className={`relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-x-hidden overflow-hidden bg-black text-white scroll-mt-6 ${SLIDE}`}
    >
      <SectionGridOverlay />
      <motion.div
        className="container relative z-10 mx-auto flex min-h-0 w-full max-w-full min-w-0 flex-1 flex-col px-5 sm:px-6 pt-[6.5rem] md:pt-[8rem] max-lg:pt-[calc(6.5rem+0.625rem)] max-lg:md:pt-[calc(8rem+0.625rem)]"
        initial={false}
        animate={{
          opacity: previewPdf || isPreviewClosing ? 0 : 1,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE.out }}
        style={{
          pointerEvents: previewPdf || isPreviewClosing ? "none" : "auto",
        }}
      >
        <div className="shrink-0">
          <SectionHeader
            title="WRITING SAMPLES"
            subtitle="Projects"
            align="center"
            showBar={false}
            compact
            titleFade
          />
        </div>

        <div className={`archive-optical-scrollbar-host relative min-h-0 flex-1 min-w-0 ${EXPERIENCE_GUTTER_SHELL_OUTER}`}>
          <div className={`${EXPERIENCE_GUTTER_SHELL_INNER} flex min-h-0 flex-1 flex-col`}>
        <div ref={archiveScrollHostRef} className="relative min-h-0 flex-1 min-w-0">
          <div
            ref={archiveScrollAreaRef}
            onScroll={onArchiveListScroll}
            onPointerMove={onArchiveScrollAreaPointerMove}
            className="no-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pr-0 lg:pr-[max(2rem,calc(1.75rem+env(safe-area-inset-right,0px)))]"
          >
            <div
              ref={archiveScrollContentRef}
              className="mx-auto w-full max-w-[min(100%,56rem)] space-y-10 sm:space-y-12 pt-4"
            >
            {SUPPORTING_ARCHIVE_PDF_SECTIONS.map((section, sectionIndex) => (
              <div key={section.heading}>
                <h3
                  ref={sectionIndex === 0 ? archiveFirstYellowRuleRef : undefined}
                  className="font-heading text-[0.6875rem] sm:text-xs tracking-eyebrow leading-snug uppercase text-[color:var(--palette-yellow-projects)] mb-3 pb-2 border-b border-[color:var(--palette-yellow-projects)]"
                >
                  {section.heading}
                </h3>
                <ul className="supporting-archive-pdf-list">
                  {section.items.map((item, rowIndex) => (
                    <li key={item.id} className="supporting-archive-pdf-row">
                      <button
                        type="button"
                        className={rowBtnClass}
                        aria-haspopup="dialog"
                        aria-expanded={previewPdf?.id === item.id}
                        onClick={() => openPreview(item)}
                      >
                        <span className="font-mono text-[0.7rem] sm:text-xs text-mono-2/70 tabular-nums w-7 shrink-0 pt-0.5">
                          {archiveRowIndexLabel(rowIndex)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-body text-sm sm:text-base text-mono-2 group-hover:text-white leading-snug inline-block transition-colors duration-200">
                            {item.title}
                          </span>
                          <span className="block font-body text-xs text-mono-2/70 mt-1 leading-snug group-hover:text-mono-2/90 transition-colors duration-200">
                            {item.subtitle}
                          </span>
                        </div>
                        <span className="font-mono text-[0.6875rem] sm:text-xs tracking-[0.14em] uppercase text-mono-2/70 group-hover:text-[color:var(--palette-yellow-projects)] shrink-0 pt-1 transition-colors duration-200">
                          VIEW
                        </span>
                        <FileText
                          className="w-4 h-4 shrink-0 text-mono-2/70 group-hover:text-[color:var(--palette-yellow-projects)] mt-0.5 transition-colors duration-200"
                          aria-hidden
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </div>
          <div
            ref={archiveOpticalRailWrapRef}
            className="pointer-events-none absolute top-0 z-[2] hidden w-2 lg:block"
            aria-hidden
          >
            <div
              ref={archiveOpticalTrackRef}
              className="archive-optical-scrollbar-track relative h-full w-full rounded-full bg-white/[0.06]"
            >
              <div
                ref={archiveOpticalThumbRef}
                role="presentation"
                className="archive-optical-scrollbar-thumb pointer-events-auto absolute left-0 right-0 rounded-full bg-white/[0.14] hover:bg-white/[0.22] motion-safe:transition-colors motion-safe:duration-200"
                style={{ top: 0, height: 0 }}
                onPointerDown={onArchiveOpticalThumbPointerDown}
              />
            </div>
          </div>
        </div>
          </div>
        </div>
      </motion.div>

      {previewPdf && (
        <SupportingPdfPreviewDialog
          item={previewPdf}
          pdfSrc={supportingPdfHref(previewPdf)}
          onClose={closePreview}
          isClosing={isPreviewClosing}
          reduceMotion={reduceMotion}
          showFrame={showPdfFrame && previewPdfReady}
          onFrameReady={() => {
            setPreviewPdfReady(true);
            setShowPdfFrame(true);
          }}
          closeFadeS={PREVIEW_CLOSE_FADE_S}
          openFadeS={PREVIEW_PDF_DIALOG_FADE_S}
          onCloseAnimationComplete={handlePreviewShellAnimationComplete}
        />
      )}
    </section>
  );
};

type CardRect = { top: number; left: number; width: number; height: number };

/** Same box-shadow + vignette stack as the hero SHOWCASE media slider (final ?open? state). */
const SHOWCASE_SLIDER_MEDIA_BOX_SHADOW =
  "0 36px 88px rgba(0,0,0,0.6), inset 0 -40px 70px rgba(0,0,0,0.52), 0 0 0 1px rgba(255,255,255,0.07), 0 0 28px 4px rgba(255,255,255,0.04)";

/**
 * iPadOS / iPhone WebKit — used for compositor + media preload mitigations.
 * Must stay above DetailCardMedia / section panel that read it.
 */
const IS_IOS_TOUCH =
  typeof window !== "undefined" &&
  typeof CSS !== "undefined" &&
  CSS.supports("-webkit-touch-callout", "none");

/** Settled project detail hero — full-bleed media with per-project focal crop. */
const DetailCardMedia = ({ card }: { card: ShowcaseProjectCard }) => (
  <>
    {card.thumbnailVideo ? (
      <video
        src={card.thumbnailVideo}
        poster={card.poster}
        muted
        loop
        autoPlay
        playsInline
        /* iOS: avoid preload=auto — large MP4s (e.g. ~21MB edits) crash WebKit tabs. */
        preload={IS_IOS_TOUCH ? "metadata" : "auto"}
        className="block h-full w-full object-cover"
        style={{
          objectPosition: card.focalPoint ?? "50% 50%",
          transform: card.id === "project-interactive-media" ? "scale(1.06)" : undefined,
          transformOrigin: card.id === "project-interactive-media" ? "50% 50%" : undefined,
        }}
      />
    ) : card.thumbnail ? (
      <img
        src={card.thumbnail}
        alt={showcaseProjectDisplayTitle(card)}
        className="h-full w-full object-cover"
        style={{ objectPosition: card.focalPoint ?? "50% 50%" }}
      />
    ) : null}
  </>
);

/**
 * Project detail grid cells (OVERVIEW / ROLE / IMPACT / TOOLS) — same surface class + radius pattern as PROFILE
 * (`profile-card-surface` + explicit `rounded-*` overrides). Same `--portfolio-glass-*` frost as PROFILE / FEATURED WRITING.
 */
const showcaseDetailCard =
  "profile-card-surface relative rounded-[11px] sm:rounded-xl px-3 py-3 sm:px-4 sm:py-3.5";

/** Same frame as project detail insets; darker wash + soft stacked shadow (single box-shadow, two layers). Corners: sharp TL/BR, rounded TR/BL (StealthWorm reference). */
const SKILLS_SUBCATEGORY_CARD_FACE =
  "skills-card-surface transition-[background-color] duration-300 ease-out";

/** Row zone behind the 3 subskill cards — solid fill, no border/shadow; radii match `SKILLS_SUBCATEGORY_CARD_FACE`. */
const SKILLS_ROW_STRIP_BG =
  "skills-row-strip-bg pointer-events-none absolute inset-0 z-0 rounded-[4px] border border-white/[0.09]";

/** Inset for cards inside the row zone (strip fills padded box via `absolute inset-0`). */
const SKILLS_ROW_ZONE_PADDING = "p-2.5 sm:p-3.5 md:p-4 lg:p-5";
const SKILLS_ROW_ZONE_PADDING_DUAL = "px-2.5 py-2.5 sm:px-3 sm:py-3 md:px-3.5 md:py-3";

type ShowcaseDetailGallerySlide = NonNullable<ShowcaseProjectCard["detailGallery"]>[number];

const ShowcaseVisualDesignDetail = ({
  card,
  reduceMotion,
  detailHdrReveal,
  detailRuleReveal,
  detailGalleryReveal,
}: {
  card: ShowcaseProjectCard;
  reduceMotion: boolean | null;
  detailHdrReveal: boolean;
  detailRuleReveal: boolean;
  detailGalleryReveal: boolean;
}) => {
  const slides = card.detailGallery ?? [];
  if (!slides.length) return null;

  return (
    <>
      <motion.div
        className="visual-design-detail-header order-1 mt-0 flex w-full flex-col items-stretch gap-y-1.5 text-left"
        style={
          reduceMotion
            ? { opacity: detailHdrReveal ? 1 : 0 }
            : {
                /* Opacity only — no upward slide (layout must already park header at final Y). */
                opacity: detailHdrReveal ? 1 : 0,
                transition: `opacity ${DETAIL_HDR_OPACITY_MS}ms ${DETAIL_FADE_CUBIC}`,
              }
        }
      >
        <p className="project-detail-main-eyebrow m-0 w-full font-heading text-sm sm:text-base leading-snug tracking-eyebrow-tight uppercase text-[color:var(--palette-yellow-projects)]">
          Project details
        </p>
        <h3 className="project-detail-main-title m-0 w-full font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em] text-white">
          <ShowcaseStackedTitle title={card.title} titlePrefix={card.titlePrefix} />
        </h3>
        <p className="project-detail-main-subtitle m-0 w-full font-body text-sm sm:text-base leading-snug text-mono-2">
          {showcaseTaglineCopy(card)}
        </p>
      </motion.div>
      <motion.div
        className="order-3 mt-4 w-full sm:mt-5"
        style={
          reduceMotion
            ? { opacity: detailGalleryReveal ? 1 : 0 }
            : {
                opacity: detailGalleryReveal ? 1 : 0,
                transition: `opacity ${DETAIL_GRID_OPACITY_MS}ms ${DETAIL_FADE_CUBIC}`,
              }
        }
      >
        <ShowcaseDetailIllustrationsGrid slides={slides} />
      </motion.div>
    </>
  );
};

/** ILLUSTRATIONS grid lightbox fade (matches PDF preview open feel). */
const ILLUSTRATION_LIGHTBOX_FADE_S = 0.18;

/** Full-screen illustration viewer — Embla swipe/drag + arrow buttons + keyboard. */
const ShowcaseIllustrationLightbox = ({
  slides,
  openableIndices,
  activeIndex,
  reduceMotion,
  onClose,
  onActiveIndexChange,
}: {
  slides: readonly ShowcaseDetailGallerySlide[];
  openableIndices: readonly number[];
  activeIndex: number;
  reduceMotion: boolean | null;
  onClose: () => void;
  onActiveIndexChange: (index: number) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    skipSnaps: false,
    dragFree: false,
  });

  const activeOpenablePos = openableIndices.indexOf(activeIndex);
  const activeSlide = slides[activeIndex];
  const hasPrev = activeOpenablePos > 0;
  const hasNext =
    activeOpenablePos >= 0 && activeOpenablePos < openableIndices.length - 1;

  const lightboxLabel =
    activeSlide?.alt?.trim() ||
    (activeIndex != null ? `Illustration ${activeIndex + 1}` : "Illustration preview");
  const caption = activeSlide?.caption?.trim() || activeSlide?.alt?.trim() || null;
  const artistStatement =
    activeSlide?.artistStatement?.trim() ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  // Collapsed height in px (~2 lines of text-xs leading-relaxed).
  const COLLAPSED_DESC_H = 60;
  const descContentRef = useRef<HTMLDivElement>(null);
  const descViewportRef = useRef<HTMLDivElement>(null);
  const [descOverflows, setDescOverflows] = useState(false);
  const [descContentH, setDescContentH] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

  // Reset expand state and re-measure whenever the slide changes.
  useEffect(() => {
    setDescExpanded(false);
  }, [activeIndex]);

  useEffect(() => {
    if (!descExpanded && descViewportRef.current) {
      descViewportRef.current.scrollTop = 0;
    }
    if (!emblaApi) return;
    const reinitDelayMs = reduceMotion ? 0 : 320;
    const timerId = window.setTimeout(() => {
      emblaApi.reInit();
    }, reinitDelayMs);
    return () => window.clearTimeout(timerId);
  }, [descExpanded, emblaApi, reduceMotion]);

  useLayoutEffect(() => {
    const el = descContentRef.current;
    if (!el) {
      setDescOverflows(false);
      setDescContentH(0);
      return;
    }
    const h = el.scrollHeight;
    setDescContentH(Math.min(h, 240));
    setDescOverflows(h > COLLAPSED_DESC_H + 6);
  }, [artistStatement]);

  const handleShowPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleShowNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const renderToolsUnderlinedText = useCallback((text: string) => {
    const parts = text.split(/(Tools)/gi);
    return parts.map((part, index) =>
      /^tools$/i.test(part) ? <span key={`${part}-${index}`} className="underline">{part}</span> : part,
    );
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!emblaApi || activeOpenablePos < 0) return;
    if (emblaApi.selectedScrollSnap() !== activeOpenablePos) {
      emblaApi.scrollTo(activeOpenablePos, true);
    }
  }, [activeOpenablePos, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const syncActiveIndex = () => {
      const snap = emblaApi.selectedScrollSnap();
      const nextIndex = openableIndices[snap];
      if (nextIndex != null && nextIndex !== activeIndex) {
        onActiveIndexChange(nextIndex);
      }
    };
    syncActiveIndex();
    emblaApi.on("select", syncActiveIndex);
    emblaApi.on("reInit", syncActiveIndex);
    return () => {
      emblaApi.off("select", syncActiveIndex);
      emblaApi.off("reInit", syncActiveIndex);
    };
  }, [activeIndex, emblaApi, onActiveIndexChange, openableIndices]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleShowPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleShowNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleShowNext, handleShowPrev, onClose]);

  if (!activeSlide?.src?.trim()) return null;

  return (
    <motion.div
      key="illustrations-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={lightboxLabel}
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reduceMotion ? 0 : ILLUSTRATION_LIGHTBOX_FADE_S,
        ease: EASE.out,
      }}
    >
      <button
        type="button"
        className="absolute inset-0 z-[1] cursor-default border-0 bg-transparent p-0"
        aria-label="Close illustration preview"
        onClick={onClose}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div
          className="relative flex min-h-0 flex-1 flex-col py-6 sm:py-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute right-[0.375rem] top-3 z-30 sm:right-[0.875rem] sm:top-4">
            <motion.div whileTap={TAP} transition={SPRING.tap} className="inline-flex origin-center">
              <button
                type="button"
                aria-label="Close illustration preview"
                onClick={onClose}
                className="pdf-viewer-chrome-btn illustration-lightbox-chrome-btn illustration-lightbox-close-btn"
              >
                <X aria-hidden />
              </button>
            </motion.div>
          </div>

          <div
            ref={emblaRef}
            className="illustration-lightbox-media-viewport h-full min-h-0 flex-1 overflow-hidden touch-pan-y [-webkit-touch-callout:none]"
            aria-roledescription="carousel"
          >
            <div className="flex h-full min-h-0 touch-pan-y [-webkit-touch-callout:none] lg:min-h-[min(78dvh,920px)]">
              {openableIndices.map((slideIndex) => {
                const slide = slides[slideIndex]!;
                const label = slide.alt?.trim() || `Illustration ${slideIndex + 1}`;
                const shrinkForCloseButton = new Set([
                  "illustrations-01", // CHARGER
                  "illustrations-02", // FRAGMENT
                  "illustrations-03", // WISELY
                  "illustrations-11", // MR. MEOWRANGE
                ]).has(slide.id);

                return (
                  <div
                    key={slide.id}
                    className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center px-4 py-0 sm:px-6 sm:py-0 md:px-14 lg:px-18 lg:py-6"
                    aria-label={label}
                  >
                    <img
                      src={slide.src}
                      alt={label}
                      className={`h-full w-auto max-w-[min(calc(100vw-3rem),72rem)] md:max-w-[min(calc(100vw-9rem),72rem)] lg:max-w-[min(calc(100vw-11rem),72rem)] object-contain object-center select-none ${
                        shrinkForCloseButton
                          ? "max-h-[calc(100%-2.8rem)] sm:max-h-[calc(100%-3.3rem)] lg:max-h-[min(66dvh,800px)]"
                          : "max-h-full lg:max-h-[min(78dvh,920px)]"
                      }`}
                      draggable={false}
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <section
          className={`group relative shrink-0 border-t border-white/[0.1] bg-black/90 px-4 py-3 pr-16 pb-8 sm:px-6 sm:py-4 sm:pr-28 sm:pb-9${descOverflows ? " cursor-pointer" : ""}`}
          onClick={descOverflows ? () => setDescExpanded((v) => !v) : undefined}
        >
          {descOverflows ? (
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              aria-label={descExpanded ? "Show less" : "Show more"}
              tabIndex={-1}
              className="pointer-events-none absolute right-4 top-3 z-10 flex select-none items-center border-0 bg-transparent p-0 font-heading text-[0.7rem] uppercase tracking-eyebrow-tight text-mono-2/80 sm:right-6 sm:top-4 sm:text-[0.76rem]"
            >
              <motion.span
                animate={{ rotate: descExpanded ? 0 : 180 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE.out }}
                className="flex"
              >
                <ChevronUp aria-hidden className="h-3.5 w-3.5" />
              </motion.span>
            </button>
          ) : null}
          {caption ? (
            <p className="min-h-[1.15rem] line-clamp-1 font-display text-[calc(0.8rem+2pt)] leading-snug tracking-tight text-white sm:min-h-0 sm:line-clamp-none sm:text-[calc(0.86rem+2pt)]">
              {caption}
            </p>
          ) : (
            <div className="h-[1.15rem] sm:hidden" aria-hidden />
          )}
          {artistStatement ? (
            <div className="mt-1 pr-2 sm:mt-1.5 sm:pr-4">
              <motion.div
                animate={{ height: descExpanded ? descContentH || "auto" : COLLAPSED_DESC_H }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE.out }}
                className={`relative ${
                  descExpanded
                    ? "no-scrollbar overflow-x-hidden overflow-y-auto overscroll-y-contain touch-pan-y"
                    : "overflow-hidden"
                }`}
                ref={descViewportRef}
              >
                <div ref={descContentRef} className="max-sm:-mr-1 space-y-2 font-body text-xs leading-relaxed text-mono-2/70 sm:text-sm">
                  {artistStatement.split(/\n\n+/).map((paragraph, paragraphIndex) => {
                    const text = paragraph.trim();
                    const toolsMatch = text.match(/^(Tools|Subtools):(.*)/is);
                    const isDisclaimer = /^This is a non\w*commercial/i.test(text);
                    return (
                      <p key={paragraphIndex}>
                        {toolsMatch ? (
                          <><span className="font-semibold underline">{renderToolsUnderlinedText(toolsMatch[1])}:</span>{renderToolsUnderlinedText(toolsMatch[2])}</>
                        ) : isDisclaimer ? (
                          <em>{renderToolsUnderlinedText(text)}</em>
                        ) : renderToolsUnderlinedText(text)}
                      </p>
                    );
                  })}
                </div>
                {descOverflows ? (
                  <motion.div
                    aria-hidden
                    animate={{ opacity: descExpanded ? 0 : 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE.out }}
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent"
                  />
                ) : null}
              </motion.div>
            </div>
          ) : null}
          {openableIndices.length > 1 ? (
            <p className="pointer-events-none absolute bottom-3 right-4 font-heading text-[0.6875rem] uppercase tracking-eyebrow-tight text-mono-2/80 sm:bottom-4 sm:right-6 sm:text-[0.7rem]">
              {activeOpenablePos + 1} / {openableIndices.length}
            </p>
          ) : null}
        </section>
      </div>
    </motion.div>
  );
};

/** ILLUSTRATIONS gallery — responsive masonry with click-through lightbox. */
const ShowcaseDetailIllustrationsGrid = ({
  slides,
}: {
  slides: readonly ShowcaseDetailGallerySlide[];
}) => {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openableIndices = useMemo(
    () =>
      slides.reduce<number[]>((indices, slide, index) => {
        if (slide.src?.trim()) indices.push(index);
        return indices;
      }, []),
    [slides],
  );

  const handleCloseLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (!slides.length) return null;

  const tileClassName = "relative min-w-0 overflow-hidden bg-transparent";

  return (
    <>
      <div
        role="list"
        aria-label="Illustrations"
        className="showcase-illustrations-grid w-full min-w-0 columns-2 gap-[var(--slide-gap,0.875rem)] lg:columns-3"
      >
        {slides.map((slide, index) => {
          const label =
            slide.src?.trim()
              ? slide.alt?.trim() || `Illustration ${index + 1}`
              : `Illustration slot ${index + 1}`;

          if (!slide.src?.trim()) {
            return (
              <div
                key={slide.id}
                role="listitem"
                className={`${tileClassName} mb-[var(--slide-gap,0.875rem)] break-inside-avoid`}
                aria-label={label}
              />
            );
          }

          return (
            <motion.button
              key={slide.id}
              type="button"
              role="listitem"
              whileHover={reduceMotion ? undefined : { scale: 1.015 }}
              whileTap={reduceMotion ? undefined : { scale: 1.02 }}
              transition={reduceMotion ? undefined : { duration: 0.2, ease: EASE.out }}
              className={`${tileClassName} group mb-[var(--slide-gap,0.875rem)] inline-block w-full break-inside-avoid cursor-pointer border-0 p-0 text-left align-top transition-opacity duration-200 ease-out hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--palette-yellow-projects)] focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
              aria-label={`View ${label}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={slide.src}
                alt={slide.alt?.trim() || `Illustration ${index + 1}`}
                className="block h-auto w-full origin-center transition-transform duration-200 ease-out group-hover:scale-[1.02] group-active:scale-[1.02]"
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index < 3 ? "high" : "auto"}
              />
            </motion.button>
          );
        })}
      </div>

      {typeof document !== "undefined" && activeIndex != null
        ? createPortal(
            <AnimatePresence>
              {openableIndices.includes(activeIndex) ? (
                <ShowcaseIllustrationLightbox
                  slides={slides}
                  openableIndices={openableIndices}
                  activeIndex={activeIndex}
                  reduceMotion={reduceMotion}
                  onClose={handleCloseLightbox}
                  onActiveIndexChange={handleActiveIndexChange}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
};

const ShowcaseDetailOverviewRole = ({ card }: { card: ShowcaseProjectCard }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
    <section className={`${showcaseDetailCard} min-w-0 md:col-span-2`}>
      <p className="font-heading text-xs tracking-eyebrow-tight leading-snug uppercase text-[color:var(--palette-yellow-projects)] mb-1.5">OVERVIEW</p>
      <p className="font-body text-sm sm:text-base text-mono-2 leading-snug whitespace-pre-line">
        {card.detailOverview?.trim() || "?"}
      </p>
    </section>
    <section className={`${showcaseDetailCard} min-w-0`}>
      <p className="font-heading text-xs tracking-eyebrow-tight leading-snug uppercase text-[color:var(--palette-yellow-projects)] mb-1.5">ROLE</p>
      <p className="font-body text-sm sm:text-base text-mono-2 leading-snug whitespace-pre-line">
        {card.detailRole?.trim() || "?"}
      </p>
    </section>
  </div>
);

const ShowcaseDetailImpactTools = ({ card }: { card: ShowcaseProjectCard }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
    <section className={`${showcaseDetailCard} min-w-0 md:col-span-2`}>
      <p className="font-heading text-xs tracking-eyebrow-tight leading-snug uppercase text-[color:var(--palette-yellow-projects)] mb-1.5">IMPACT</p>
      <p className="font-body text-sm sm:text-base text-mono-2 leading-snug whitespace-pre-line">
        {card.detailImpact?.trim() || "?"}
      </p>
    </section>
    <section className={`${showcaseDetailCard} min-w-0`}>
      <p className="font-heading text-xs tracking-eyebrow-tight leading-snug uppercase text-[color:var(--palette-yellow-projects)] mb-1.5">TOOLS</p>
      {card.detailTools?.length ? (
        <ul className="ml-1 list-disc list-outside space-y-1 pl-6 sm:pl-7 marker:text-mono-2/70">
          {card.detailTools.map((tool, i) => (
            <li key={`${tool}-${i}`} className="font-body text-sm sm:text-base text-mono-2 leading-snug">
              {tool}
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-body text-sm sm:text-base text-mono-2/55">?</p>
      )}
    </section>
  </div>
);

function ShowcaseWritingFeaturedPanel({
  item,
  previewWidthPx,
  onOpenPdfInSupporting,
  measureOnly = false,
}: {
  item: SupportingArchivePdfItem;
  previewWidthPx: number;
  onOpenPdfInSupporting: (item: SupportingArchivePdfItem) => void;
  measureOnly?: boolean;
}) {
  return (
    <div className="featured-writing-panel-body flex w-full min-w-0 max-w-full flex-col gap-3 text-left sm:flex-row sm:items-start sm:gap-4">
      {measureOnly ? (
        <div
          aria-hidden
          className="featured-writing-raised relative shrink-0 self-start overflow-hidden rounded-[10px] border-0 bg-white/[0.04]"
          style={{ width: previewWidthPx, height: 216, maxWidth: "100%" }}
        />
      ) : (
        <FeaturedWritingPdfThumbnail
          pdfSrc={supportingPdfHref(item)}
          widthPx={previewWidthPx}
          className="shrink-0 self-start"
          onActivate={() => onOpenPdfInSupporting(item)}
        />
      )}
      <div className="featured-writing-content-col flex min-h-0 min-w-0 w-full flex-1 flex-col gap-2.5 sm:min-w-0 sm:gap-3">
        <div className="featured-writing-title-row grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-start gap-x-2.5 gap-y-1 sm:gap-x-3">
          <p className="featured-writing-item-title col-start-1 row-start-1 min-w-0 font-display text-lg leading-[1.15] tracking-tight text-white sm:text-xl md:text-2xl md:leading-tight">
            {item.title}
          </p>
          <p className="featured-writing-item-subtitle col-start-1 row-start-2 min-w-0 font-body text-xs leading-snug text-mono-2/75 sm:text-sm">
            {item.subtitle}
          </p>
          <button
            type="button"
            className="featured-writing-view-cta col-start-2 row-start-1 inline-flex w-fit shrink-0 items-center gap-2 self-start justify-self-end rounded-[11px] sm:rounded-xl px-2.5 py-1.5 font-heading text-[10px] sm:text-xs font-semibold tracking-eyebrow-tight uppercase text-[color:var(--palette-yellow-projects)] transition-[background-color,color,border-color,box-shadow] duration-300 ease-out hover:text-[color:var(--palette-yellow-projects)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--palette-yellow-projects)] focus-visible:ring-offset-2 focus-visible:ring-offset-black mr-[6px] sm:px-3 sm:py-2"
            onClick={() => onOpenPdfInSupporting(item)}
          >
            <span className="featured-writing-view-cta-label">VIEW</span>
            <ExternalLink className="h-3 w-3 shrink-0 opacity-80 max-md:-translate-y-px md:h-3.5 md:w-3.5" aria-hidden />
          </button>
        </div>
        {item.description ? (
          <p
            className="line-clamp-4 min-w-0 font-body text-sm leading-relaxed text-mono-2/70 sm:line-clamp-3 sm:text-[0.9375rem] sm:leading-relaxed md:text-base"
            title={item.description}
          >
            {item.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const PalaceProjects = ({
  onSelectProject,
  onOpenSupporting,
  onOpenFeaturedPdfInSupporting,
  activeProjectId,
  entranceArmed = false,
  forceContentHidden = false,
  featuredPdfViewerActive = false,
}: {
  onSelectProject: (id: string) => void;
  onOpenSupporting: () => void;
  onOpenFeaturedPdfInSupporting: (item: SupportingArchivePdfItem) => void;
  activeProjectId: string | null;
  entranceArmed?: boolean;
  /** Side-nav leave only: hide showcase content (grid overlay stays). */
  forceContentHidden?: boolean;
  /** FEATURED WRITING VIEW ? fade carousel/tabs/header while grid PDF loader is up. */
  featuredPdfViewerActive?: boolean;
}) => {
  const reduceMotion = useReducedMotion();
  const portfolioDebugEnabled = usePortfolioDebugEnabled();
  const projectsSectionRef = useRef<HTMLElement>(null);
  const projectsDividerRef = useRef<HTMLDivElement | null>(null);
  const [projectsDesktopViewport, setProjectsDesktopViewport] = useState(
    matchesProfileDesktopDebugViewport,
  );
  const [projectsTabletLandscapeViewport, setProjectsTabletLandscapeViewport] = useState(
    matchesProjectsTabletLandscapeViewport,
  );
  const [projectsTabletPortraitViewport, setProjectsTabletPortraitViewport] = useState(
    matchesProjectsTabletPortraitViewport,
  );
  const [projectsTabletThumbnailDebugEnabled, setProjectsTabletThumbnailDebugEnabled] =
    useState(false);
  const projectsTabletThumbnailSeed = useMemo(
    () => seedProjectsTabletThumbnailDefaultsFromCards(PROJECT_CARDS),
    [],
  );
  const [lockedProjectsTabletThumbnailValues, setLockedProjectsTabletThumbnailValues] =
    useState<ProjectsTabletThumbnailDebugValues>(() =>
      readProjectsTabletThumbnailDebugValues(projectsTabletThumbnailSeed),
    );
  const [projectsTabletThumbnailDraft, setProjectsTabletThumbnailDraft] =
    useState<ProjectsTabletThumbnailDebugValues>(() =>
      readProjectsTabletThumbnailDebugValues(projectsTabletThumbnailSeed),
    );
  const [selectedProjectsTabletThumbnailId, setSelectedProjectsTabletThumbnailId] =
    useState<ProjectsTabletThumbnailId>("project-visual-design");
  const projectsTabletGridTapRef = useRef({ time: 0, x: 0, y: 0 });
  const [projectsDesktopLayoutDebugValues, setProjectsDesktopLayoutDebugValues] =
    useState<ProfileDesktopLayoutDebugValues>(() => readSectionDesktopLayoutDebugValues("projects"));
  const [projectDetailLayoutDebugValuesByProject, setProjectDetailLayoutDebugValuesByProject] =
    useState<Record<string, ProjectDetailLayoutDebugValues>>(readProjectDetailLayoutDebugValuesByProject);
  const [projectsEntered, setProjectsEntered] = useState(reduceMotion || entranceArmed);
  /** Keep header y at 0 after first enter — disarming entrance on panel exit must not replay y slide. */
  const [projectsHeaderYLocked, setProjectsHeaderYLocked] = useState(reduceMotion || entranceArmed);
  const [projectsOverlayRevealed, setProjectsOverlayRevealed] = useState(false);
  const [carouselAutoAdvanceReady, setCarouselAutoAdvanceReady] = useState(!!reduceMotion);
  const activeCard = activeProjectId ? PROJECT_CARDS.find((c) => c.id === activeProjectId) ?? null : null;
  const illustrationsDetailNoHero = Boolean(activeCard?.detailGallery?.length);
  const videoEditingDetailNoMainCard =
    activeCard?.id === "project-video-editing" ||
    activeCard?.id === "project-interactive-media" ||
    activeCard?.id === "project-slaywire";
  const noMorphProjectIds = new Set([
    "project-interactive-media",
    "project-slaywire",
  ]);
  const activeCardNoMorph = Boolean(activeCard && noMorphProjectIds.has(activeCard.id));
  const showcaseObscured = Boolean(activeCard || featuredPdfViewerActive);
  const showcaseFadeDuration = reduceMotion
    ? 0
    : showcaseObscured
      ? featuredPdfViewerActive && !activeCard
        ? SHOWCASE_PDF_PROJECTS_FADE_OUT_S
        : 0.14
      : SIDE_NAV_OVERLAY_FADE_S;

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${PROFILE_DESKTOP_DEBUG_MIN_PX}px)`);
    const onChange = () => setProjectsDesktopViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(PROJECTS_TABLET_LANDSCAPE_MQ);
    const onChange = () => setProjectsTabletLandscapeViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(PROJECTS_TABLET_PORTRAIT_MQ);
    const onChange = () => {
      setProjectsTabletPortraitViewport(mq.matches);
      if (!mq.matches) setProjectsTabletThumbnailDebugEnabled(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);

  const projectsShowcaseClusterStyleActive =
    projectsDesktopViewport || projectsTabletLandscapeViewport;
  const projectsShowcaseDesktopCrispCluster =
    projectsDesktopViewport && !projectsTabletLandscapeViewport;

  const projectsDesktopDebugActive = portfolioDebugEnabled && projectsDesktopViewport;

  const handleProjectsDesktopLayoutDebugChange = useCallback(
    (patch: Partial<ProfileDesktopLayoutDebugValues>) => {
      setProjectsDesktopLayoutDebugValues((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const handleProjectsDesktopLayoutDebugReset = useCallback(() => {
    setProjectsDesktopLayoutDebugValues(PROJECTS_DESKTOP_LAYOUT_DEBUG_DEFAULTS);
  }, []);

  const handleProjectsDesktopLayoutDebugSave = useCallback(() => {
    saveSectionDesktopLayoutDebugValues("projects", projectsDesktopLayoutDebugValues);
    const lockInSnippet = [
      "PROJECTS_DESKTOP_LAYOUT = {",
      `  leftOffsetX: ${projectsDesktopLayoutDebugValues.leftOffsetX},`,
      `  leftOffsetY: ${projectsDesktopLayoutDebugValues.leftOffsetY},`,
      `  rightOffsetX: ${projectsDesktopLayoutDebugValues.rightOffsetX},`,
      `  rightOffsetY: ${projectsDesktopLayoutDebugValues.rightOffsetY},`,
      `  leftScale: ${projectsDesktopLayoutDebugValues.leftScale.toFixed(2)},`,
      `  leftWidthScale: ${projectsDesktopLayoutDebugValues.leftWidthScale.toFixed(2)},`,
      `  rightScale: ${projectsDesktopLayoutDebugValues.rightScale.toFixed(2)},`,
      `  rightWidthScale: ${projectsDesktopLayoutDebugValues.rightWidthScale.toFixed(2)},`,
      "};",
    ].join("\n");
    console.info("[Projects Desktop Layout Lock In]\n" + lockInSnippet);
    navigator.clipboard?.writeText(lockInSnippet).catch(() => {
      // Clipboard writes can fail in some browser contexts; localStorage save still succeeds.
    });
  }, [projectsDesktopLayoutDebugValues]);

  const activeProjectsDesktopLayout = projectsDesktopDebugActive
    ? projectsDesktopLayoutDebugValues
    : PROJECTS_DESKTOP_LAYOUT_DEBUG_DEFAULTS;

  const projectsShowcaseLayoutValues = useMemo(() => {
    const base = activeProjectsDesktopLayout;
    if (!projectsTabletLandscapeViewport) return base;
    const widthScale =
      (projectsDesktopViewport ? base.leftWidthScale : 1) * PROJECTS_TABLET_LANDSCAPE_WIDTH_SCALE;
    return {
      ...base,
      leftWidthScale: widthScale,
      rightWidthScale: widthScale,
      leftOffsetY: base.leftOffsetY + 5 + PROJECTS_DESKTOP_MAIN_LIFT_Y,
      rightOffsetY: base.rightOffsetY + PROJECTS_DESKTOP_MAIN_LIFT_Y,
      leftHeightScale: 1,
      rightHeightScale: 1,
    };
  }, [activeProjectsDesktopLayout, projectsTabletLandscapeViewport, projectsDesktopViewport]);

  const projectsLeftDebugStyle = projectsShowcaseClusterStyleActive
    ? buildProjectsShowcaseDesktopClusterStyle(
        projectsShowcaseLayoutValues,
        "left",
        projectsShowcaseDesktopCrispCluster ? "crisp" : "transform",
      )
    : undefined;

  const projectsRightDebugStyle = projectsShowcaseClusterStyleActive
    ? buildProjectsShowcaseDesktopClusterStyle(
        projectsShowcaseLayoutValues,
        "right",
        projectsShowcaseDesktopCrispCluster ? "crisp" : "transform",
      )
    : undefined;

  const activeProjectDetailLayoutDefaults = activeCard
    ? projectDetailLayoutDefaultsForProject(activeCard.id)
    : PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS;

  const activeProjectDetailLayout = activeCard
    ? projectsDesktopDebugActive
      ? (projectDetailLayoutDebugValuesByProject[activeCard.id] ?? activeProjectDetailLayoutDefaults)
      : activeProjectDetailLayoutDefaults
    : PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS;

  const handleProjectDetailLayoutDebugChange = useCallback(
    (patch: Partial<ProjectDetailLayoutDebugValues>) => {
      if (!activeCard) return;
      const defaults = projectDetailLayoutDefaultsForProject(activeCard.id);
      setProjectDetailLayoutDebugValuesByProject((prev) => ({
        ...prev,
        [activeCard.id]: {
          ...(prev[activeCard.id] ?? defaults),
          ...patch,
        },
      }));
    },
    [activeCard],
  );

  const handleProjectDetailLayoutDebugReset = useCallback(() => {
    if (!activeCard) return;
    setProjectDetailLayoutDebugValuesByProject((prev) => ({
      ...prev,
      [activeCard.id]: projectDetailLayoutDefaultsForProject(activeCard.id),
    }));
  }, [activeCard]);

  const handleProjectDetailLayoutDebugSave = useCallback(() => {
    if (!activeCard) return;
    const nextValuesByProject = {
      ...projectDetailLayoutDebugValuesByProject,
      [activeCard.id]: activeProjectDetailLayout,
    };
    saveProjectDetailLayoutDebugValuesByProject(nextValuesByProject);
    const lockInSnippet = [
      `${activeCard.id}: {`,
      `  offsetX: ${activeProjectDetailLayout.offsetX},`,
      `  offsetY: ${activeProjectDetailLayout.offsetY},`,
      `  scale: ${activeProjectDetailLayout.scale.toFixed(2)},`,
      `  widthScale: ${activeProjectDetailLayout.widthScale.toFixed(2)},`,
      `  heightScale: ${activeProjectDetailLayout.heightScale.toFixed(2)},`,
      "},",
    ].join("\n");
    console.info("[Project Detail Layout Lock In]\n" + lockInSnippet);
    navigator.clipboard?.writeText(lockInSnippet).catch(() => {
      // Clipboard writes can fail in some browser contexts; localStorage save still succeeds.
    });
  }, [activeCard, activeProjectDetailLayout, projectDetailLayoutDebugValuesByProject]);

  useEffect(() => {
    if (reduceMotion) {
      setProjectsEntered(true);
      setProjectsHeaderYLocked(true);
      return;
    }
    // Arm only — never collapse entered/overlay visuals when entrance disarms on leave.
    // Disarm used to zero carousel/FEATURED WRITING while the side-nav overlay was still
    // fading (mobile/iPad), which read as a PROJECTS flicker before the panel wipe.
    if (entranceArmed) {
      setProjectsEntered(true);
      setProjectsHeaderYLocked(true);
    }
  }, [entranceArmed, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setProjectsOverlayRevealed(true);
      return;
    }
    if (!projectsEntered) {
      setProjectsOverlayRevealed(false);
      return;
    }
    setProjectsOverlayRevealed(false);
    const headerEndMs =
      (PROFILE_TITLE_DELAY_S + PROJECTS_HEADER_ENTER_DUR_S) * 1000;
    const revealId = window.setTimeout(
      () => setProjectsOverlayRevealed(true),
      Math.max(0, headerEndMs - PROJECTS_BELOW_HEADER_LEAD_MS),
    );
    return () => window.clearTimeout(revealId);
  }, [projectsEntered, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setCarouselAutoAdvanceReady(true);
      return;
    }
    if (!projectsOverlayRevealed) {
      setCarouselAutoAdvanceReady(false);
      return;
    }
    const readyId = window.setTimeout(
      () => setCarouselAutoAdvanceReady(true),
      PROJECTS_CAROUSEL_ENTRANCE_FADE_S * 1000,
    );
    return () => window.clearTimeout(readyId);
  }, [projectsOverlayRevealed, reduceMotion]);

  const [morphRect, setMorphRect] = useState<CardRect | null>(null);
  const [targetRect, setTargetRect] = useState<CardRect | null>(null);
  const [morphDone, setMorphDone] = useState(false);
  /** In-flow detail expands #projects so section grid covers desc cards; absolute overlay is FLIP-only. */
  const projectDetailInFlow = Boolean(
    activeCard &&
      (videoEditingDetailNoMainCard || illustrationsDetailNoHero || activeCardNoMorph || morphDone),
  );
  const slaywireDetailInFlow =
    projectDetailInFlow && activeCard?.id === "project-slaywire";
  const interactiveMediaDetailInFlow =
    projectDetailInFlow && activeCard?.id === "project-interactive-media";
  const videoEditingProjectDetailInFlow =
    projectDetailInFlow && activeCard?.id === "project-video-editing";
  const visualDesignDetailInFlow =
    projectDetailInFlow && activeCard?.id === "project-visual-design";
  const projectDetailAllowsOverflowX =
    videoEditingDetailNoMainCard || slaywireDetailInFlow;

  const activeProjectsTabletThumbnailValues =
    projectsTabletPortraitViewport
      ? projectsTabletThumbnailDebugEnabled
        ? projectsTabletThumbnailDraft
        : lockedProjectsTabletThumbnailValues
      : undefined;

  const handleProjectsTabletThumbnailDebugChange = useCallback(
    (patch: Partial<ProjectsTabletThumbnailControl>) => {
      setProjectsTabletThumbnailDraft((prev) => ({
        ...prev,
        [selectedProjectsTabletThumbnailId]: {
          ...prev[selectedProjectsTabletThumbnailId],
          ...patch,
        },
      }));
    },
    [selectedProjectsTabletThumbnailId],
  );

  const handleProjectsTabletThumbnailDebugReset = useCallback(() => {
    setProjectsTabletThumbnailDraft(
      Object.fromEntries(
        Object.entries(projectsTabletThumbnailSeed).map(([id, value]) => [
          id,
          { ...value },
        ]),
      ) as ProjectsTabletThumbnailDebugValues,
    );
  }, [projectsTabletThumbnailSeed]);

  const handleProjectsTabletThumbnailLockIn = useCallback(() => {
    const locked = Object.fromEntries(
      Object.entries(projectsTabletThumbnailDraft).map(([id, value]) => [
        id,
        { ...value },
      ]),
    ) as ProjectsTabletThumbnailDebugValues;
    saveProjectsTabletThumbnailDebugValues(locked);
    setLockedProjectsTabletThumbnailValues(locked);
    const snippet = buildProjectsTabletThumbnailLockInSnippet(locked);
    console.info("[Projects Tablet Thumbnail Lock In]\n" + snippet);
    navigator.clipboard?.writeText(snippet).catch(() => {
      // Local persistence succeeds even when clipboard access is unavailable.
    });
  }, [projectsTabletThumbnailDraft]);

  const handleProjectsTabletGridPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (
        !import.meta.env.DEV ||
        !projectsTabletPortraitViewport ||
        projectDetailInFlow
      ) {
        return;
      }
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (
        target.closest(
          "button, a, input, select, textarea, [role='button'], [data-carousel-card], .showcase-header, .featured-writing-folder",
        )
      ) {
        return;
      }

      const previous = projectsTabletGridTapRef.current;
      const now = event.timeStamp;
      const distance = Math.hypot(
        event.clientX - previous.x,
        event.clientY - previous.y,
      );
      const isDoubleTap =
        previous.time > 0 && now - previous.time <= 380 && distance <= 40;

      if (!isDoubleTap) {
        projectsTabletGridTapRef.current = {
          time: now,
          x: event.clientX,
          y: event.clientY,
        };
        return;
      }

      event.preventDefault();
      projectsTabletGridTapRef.current = { time: 0, x: 0, y: 0 };
      setProjectsTabletThumbnailDebugEnabled((enabled) => {
        if (!enabled) {
          setProjectsTabletThumbnailDraft(
            Object.fromEntries(
              Object.entries(lockedProjectsTabletThumbnailValues).map(
                ([id, value]) => [id, { ...value }],
              ),
            ) as ProjectsTabletThumbnailDebugValues,
          );
        }
        return !enabled;
      });
    },
    [
      lockedProjectsTabletThumbnailValues,
      projectDetailInFlow,
      projectsTabletPortraitViewport,
    ],
  );

  const projectsProjectDetailLayoutActive =
    projectsDesktopViewport && !projectsTabletLandscapeViewport;

  /** Desktop only: match main PROJECTS column L/R edges; keep detail zoom/Y/centering. */
  const projectDetailLayoutStyle = (() => {
    if (
      !projectsProjectDetailLayoutActive ||
      !projectDetailInFlow ||
      !activeCard ||
      !(projectsDesktopDebugActive || projectDetailLayoutHasLockedDefaults(activeCard.id))
    ) {
      return undefined;
    }
    const detail = activeProjectDetailLayout;
    const showcase = activeProjectsDesktopLayout;
    const detailZoom = detail.scale * detail.heightScale;
    // Same width% as showcase cluster. Chromium zoom already keeps % widths visually stable —
    // do not divide by detailZoom (that over-widens). Keep detail zoom for type/media size.
    const widthPercent =
      (showcase.leftWidthScale / Math.max(showcase.leftHeightScale, 1e-6)) * 100;
    return {
      transform: `translate(${detail.offsetX}px, ${detail.offsetY}px)`,
      transformOrigin: "top center" as const,
      zoom: detailZoom,
      width: `${widthPercent}%`,
      maxWidth: `${widthPercent}%`,
      alignSelf: "center",
      marginLeft: "auto",
      marginRight: "auto",
    };
  })();

  /** Tablet: grid overlay tracks section + panel scroller (iPad landscape >1024px included). */
  useLayoutEffect(() => {
    const section = projectsSectionRef.current;
    if (!section) return;
    return bindSectionGridOverlayHeightSync(section, "--projects-grid-overlay-height");
  }, [projectDetailInFlow, activeProjectId, projectsOverlayRevealed, entranceArmed]);

  /** Mobile / iPad landscape VISUAL DESIGN: panel scroller retains scroll across detail open/close — reset to top. */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia(PROJECTS_MOBILE_PANEL_MQ).matches;
    const isVisualDesignTabletLandscape =
      activeProjectId === "project-visual-design" &&
      window.matchMedia(PROJECTS_TABLET_LANDSCAPE_MQ).matches;
    const enteringDetail = Boolean(activeProjectId && projectDetailInFlow);
    if (enteringDetail) {
      if (!isMobile && !isVisualDesignTabletLandscape) return;
    } else if (!isMobile) {
      // Back to PROJECTS list — mobile only (detail scroll was applied to the list).
      return;
    }
    const section = projectsSectionRef.current;
    if (!section) return;
    const panel = section.closest<HTMLElement>(SECTION_PANEL_GRID_SELECTOR);
    if (!panel) return;
    panel.scrollTop = 0;
  }, [activeProjectId, projectDetailInFlow]);

  const [detailHdrReveal, setDetailHdrReveal] = useState(false);
  const [detailRuleReveal, setDetailRuleReveal] = useState(false);
  const [detailGalleryReveal, setDetailGalleryReveal] = useState(false);
  const [detailRow1Reveal, setDetailRow1Reveal] = useState(false);
  const [detailRow2Reveal, setDetailRow2Reveal] = useState(false);
  const [detailHeroMediaFadeIn, setDetailHeroMediaFadeIn] = useState(false);
  const [detailCardRadiusPx, setDetailCardRadiusPx] = useState<number>(() => {
    if (typeof window === "undefined") return 11;
    return window.matchMedia("(min-width: 640px)").matches ? 12 : 11;
  });
  const detailRevealTimersRef = useRef<number[]>([]);
  const detailAnchorRef = useRef<HTMLDivElement>(null);
  const [showcaseTabId, setShowcaseTabId] = useState<ShowcaseTabId>("tab-1");
  const projectDetailSafariLite = IS_IOS_TOUCH;
  const projectDetailMotionReduced = reduceMotion || projectDetailSafariLite;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = (matches: boolean) => setDetailCardRadiusPx(matches ? 12 : 11);
    apply(mq.matches);
    const onChange = (event: MediaQueryListEvent) => apply(event.matches);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const morphDur = projectDetailMotionReduced ? 0.12 / SHOWCASE_TIME_DIV : SHOWCASE_CARD_MORPH_DUR_S;
  const morphEase = SHOWCASE_EASE;

  // FLIP animation approach ? avoids animating CSS layout properties (width/height)
  // which Framer Motion wires up via useEffect (after paint), causing a size-flash.
  // Instead, the flying card is always the DESTINATION size (plain React state ?
  // applied synchronously by React's commit), and scaleX/scaleY (pure transforms)
  // start at src/dst ratio and animate to 1. All transforms apply before first paint.
  const mX      = useMotionValue(0);
  const mY      = useMotionValue(0);
  const mScaleX = useMotionValue(1);
  const mScaleY = useMotionValue(1);

  const handleCardClick = useCallback((id: string, el: HTMLElement) => {
    if (projectDetailSafariLite) {
      setMorphRect(null);
      setTargetRect(null);
      setMorphDone(true);
      onSelectProject(id);
      return;
    }

    // Drop Framer tap scale for one frame so FLIP samples rest bounds.
    const shell = el.closest(".project-card-tap-shell");
    shell?.classList.add("is-flip-measure");
    const src = el.getBoundingClientRect();
    requestAnimationFrame(() => {
      shell?.classList.remove("is-flip-measure");
    });

    if (id === "project-video-editing" || noMorphProjectIds.has(id)) {
      // These projects open without FLIP hero morph; detail card fades in.
      setMorphRect(null);
      setTargetRect(null);
      setMorphDone(true);
      onSelectProject(id);
      return;
    }

    setMorphRect({ top: src.top, left: src.left, width: src.width, height: src.height });

    if (PROJECT_CARDS.find((card) => card.id === id)?.detailGallery?.length) {
      setTargetRect(null);
      setMorphDone(true);
      onSelectProject(id);
      return;
    }

    if (!detailAnchorRef.current) return;
    const dst = detailAnchorRef.current.getBoundingClientRect();

    // Set all transforms synchronously ? before React schedules its render ?
    // so Framer Motion's useLayoutEffect applies them before the first paint.
    mX.set(src.left);
    mY.set(src.top);
    mScaleX.set(src.width / dst.width);
    mScaleY.set(src.height / dst.height);

    setTargetRect({ top: dst.top, left: dst.left, width: dst.width, height: dst.height });
    setMorphDone(false);
    onSelectProject(id);
  }, [onSelectProject, projectDetailSafariLite, mX, mY, mScaleX, mScaleY]);

  // Parent can clear the open project (e.g. global back) ? reset FLIP state so the next open is clean.
  useEffect(() => {
    if (activeProjectId) return;
    setMorphRect(null);
    setTargetRect(null);
    setMorphDone(false);
  }, [activeProjectId]);

  // Hero media: fade in once FLIP morph is complete (double rAF so opacity 0 paints before transition).
  useEffect(() => {
    if (!morphDone) {
      setDetailHeroMediaFadeIn(false);
      return;
    }
    if (projectDetailMotionReduced) {
      setDetailHeroMediaFadeIn(true);
      return;
    }
    setDetailHeroMediaFadeIn(false);
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) setDetailHeroMediaFadeIn(true);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [morphDone, activeCard?.id, projectDetailMotionReduced]);

  // FLIP morph + detail copy schedule (timers must survive morphDone ? do not key this effect on morphDone).
  useEffect(() => {
    if (!targetRect || !morphRect) return;
    let cancelled = false;
    const morphMs = Math.round(morphDur * 1000);
    const chainTimers: number[] = [];

    if (!projectDetailMotionReduced) {
      const ruleAt = Math.max(0, morphMs - DETAIL_RULE_LINE_LEAD_MS);
      const afterRuleMs = ruleAt + DETAIL_RULE_EXPAND_MS;
      const atHalfHeroFadeMs =
        morphMs +
        DETAIL_HERO_FADE_START_RAF_PAD_MS +
        Math.round(DETAIL_HERO_MEDIA_FADE_MS / 2);
      const headerKickAt = Math.max(afterRuleMs, atHalfHeroFadeMs) + DETAIL_HDR_REVEAL_DELAY_MS;

      chainTimers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!cancelled) setDetailRuleReveal(true);
            });
          });
        }, ruleAt),
      );

      chainTimers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          requestAnimationFrame(() => {
            if (cancelled) return;
            setDetailHdrReveal(true);
            const t1 = window.setTimeout(() => {
              if (!cancelled) setDetailRow1Reveal(true);
            }, DETAIL_ROW1_AFTER_HDR_MS);
            const t2 = window.setTimeout(() => {
              if (!cancelled) setDetailRow2Reveal(true);
            }, DETAIL_ROW1_AFTER_HDR_MS + DETAIL_ROW2_STAGGER_MS);
            detailRevealTimersRef.current = [t1, t2];
          });
        }, headerKickAt),
      );
    }

    const xControl = animate(mX, targetRect.left, { duration: morphDur, ease: morphEase });
    const yControl = animate(mY, targetRect.top, { duration: morphDur, ease: morphEase });
    const scaleXControl = animate(mScaleX, 1, { duration: morphDur, ease: morphEase });
    const scaleYControl = animate(mScaleY, 1, {
      duration: morphDur,
      ease: morphEase,
      onComplete: () => {
        if (cancelled) return;
        setMorphDone(true);
      },
    });

    return () => {
      cancelled = true;
      xControl.stop();
      yControl.stop();
      scaleXControl.stop();
      scaleYControl.stop();
      chainTimers.forEach((id) => window.clearTimeout(id));
      detailRevealTimersRef.current.forEach((id) => window.clearTimeout(id));
      detailRevealTimersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRect, morphRect, morphDur, projectDetailMotionReduced]);

  // Reset / instant reveal for no-morph details (before paint so header is not slid up after first frame).
  useLayoutEffect(() => {
    if (!morphDone) {
      setDetailHdrReveal(false);
      setDetailRuleReveal(false);
      setDetailGalleryReveal(false);
      setDetailRow1Reveal(false);
      setDetailRow2Reveal(false);
      detailRevealTimersRef.current.forEach((id) => window.clearTimeout(id));
      detailRevealTimersRef.current = [];
      return;
    }
    if (
      projectDetailMotionReduced ||
      activeCard?.detailGallery?.length ||
      videoEditingDetailNoMainCard ||
      activeCardNoMorph
    ) {
      setDetailHdrReveal(true);
      setDetailRuleReveal(true);
      setDetailGalleryReveal(true);
      setDetailRow1Reveal(true);
      setDetailRow2Reveal(true);
    }
  }, [
    morphDone,
    activeCard?.id,
    projectDetailMotionReduced,
    activeCardNoMorph,
    videoEditingDetailNoMainCard,
  ]);

  return (
    <section
      id="projects"
      ref={projectsSectionRef}
      onPointerUp={handleProjectsTabletGridPointerUp}
      style={
        projectsTabletPortraitViewport
          ? { touchAction: "manipulation" }
          : undefined
      }
      className={`relative flex w-full min-w-0 max-w-full flex-col justify-start lg:pb-[max(1.25rem,calc(var(--slide-gap)*1.5),env(safe-area-inset-bottom,0px))] text-white scroll-mt-6 [--slide-gap:0.875rem] sm:[--slide-gap:1.25rem] lg:[--slide-gap:1rem] xl:[--slide-gap:1.125rem] ${
        projectDetailInFlow
          ? `min-h-screen shrink-0 ${SECTION_MAIN_HEADER_INSET} ${
              slaywireDetailInFlow ? "projects-slaywire-detail-open" : ""
            } ${
              interactiveMediaDetailInFlow ? "projects-interactive-media-detail-open" : ""
            } ${
              videoEditingProjectDetailInFlow ? "projects-video-editing-detail-open" : ""
            } ${
              visualDesignDetailInFlow ? "projects-visual-design-detail-open" : ""
            } ${
              projectDetailAllowsOverflowX ? "overflow-x-visible" : "overflow-x-hidden"
            }`
          : `max-2xl:min-h-min 2xl:min-h-full overflow-x-hidden ${PROJECTS_SHOWCASE_TABLET_PAD} ${SECTION_MAIN_HEADER_INSET}`
      }`}
    >
      <SectionGridOverlay />
      {projectsTabletThumbnailDebugEnabled &&
        projectsTabletPortraitViewport &&
        !projectDetailInFlow &&
        typeof document !== "undefined" &&
        createPortal(
          <ProjectsTabletThumbnailDebugPanel
            values={projectsTabletThumbnailDraft}
            selectedId={selectedProjectsTabletThumbnailId}
            onSelectedIdChange={setSelectedProjectsTabletThumbnailId}
            onChange={handleProjectsTabletThumbnailDebugChange}
            onReset={handleProjectsTabletThumbnailDebugReset}
            onLockIn={handleProjectsTabletThumbnailLockIn}
          />,
          document.body,
        )}
      {projectsDesktopDebugActive &&
        typeof document !== "undefined" &&
        createPortal(
          <ProfileDesktopLayoutDebugPanel
            sectionLabel="Projects"
            leftLabel="Left"
            rightLabel="Right"
            values={projectsDesktopLayoutDebugValues}
            defaults={PROJECTS_DESKTOP_LAYOUT_DEBUG_DEFAULTS}
            onChange={handleProjectsDesktopLayoutDebugChange}
            onSave={handleProjectsDesktopLayoutDebugSave}
            onReset={handleProjectsDesktopLayoutDebugReset}
          />,
          document.body,
        )}
      {projectsDesktopDebugActive &&
        projectDetailInFlow &&
        activeCard &&
        typeof document !== "undefined" &&
        createPortal(
          <ProjectDetailLayoutDebugPanel
            projectLabel={showcaseProjectDisplayTitle(activeCard)}
            values={activeProjectDetailLayout}
            defaults={activeProjectDetailLayoutDefaults}
            onChange={handleProjectDetailLayoutDebugChange}
            onSave={handleProjectDetailLayoutDebugSave}
            onReset={handleProjectDetailLayoutDebugReset}
          />,
          document.body,
        )}
      <div
        className={`${PROFILE_SECTION_CONTAINER} relative z-10 flex min-w-0 w-full flex-col ${
          projectDetailInFlow ? "min-h-min shrink-0" : "max-2xl:min-h-min max-2xl:flex-none 2xl:min-h-0 2xl:flex-1"
        }${forceContentHidden ? " opacity-0 pointer-events-none select-none" : ""}`}
        aria-hidden={forceContentHidden || undefined}
      >
        <div className={EXPERIENCE_GUTTER_SHELL_OUTER}>
          <div className={EXPERIENCE_GUTTER_SHELL_INNER}>
        <div
          className={`projects-showcase-viewport ${PROJECTS_VIEWPORT_SHELL} overflow-y-visible ${
            projectDetailInFlow
              ? `min-h-min shrink-0 justify-start${
                  slaywireDetailInFlow ? " projects-slaywire-detail-stage" : ""
                }`
              : "max-lg:min-h-min max-lg:flex-none max-lg:justify-start max-2xl:min-h-min max-2xl:flex-none max-2xl:justify-start 2xl:min-h-0 2xl:flex-1 2xl:justify-center"
          }`}
        >
        {/*
         * Column inherits --slide-gap from #projects. Spacer + section pb = bottom air; overlay scrolls if needed (no clipping).
         */}
        <div
          className={`projects-showcase-stage flex flex-col overflow-y-visible ${
            projectDetailInFlow
              ? `min-h-min shrink-0 justify-start${
                  slaywireDetailInFlow ? " projects-slaywire-detail-stage" : ""
                } ${
                  projectDetailAllowsOverflowX ? "overflow-x-visible" : "overflow-x-hidden"
                }`
              : `max-lg:min-h-min max-lg:flex-none max-lg:justify-start max-2xl:min-h-min max-2xl:flex-none max-2xl:justify-start 2xl:min-h-0 2xl:flex-1 2xl:justify-center overflow-x-visible${
                  projectsShowcaseClusterStyleActive ? " items-center" : ""
                }`
          }`}
        >
          {!projectDetailInFlow ? (
        <div
          className={`projects-showcase-cards-cluster flex flex-col shrink-0${
            projectsShowcaseClusterStyleActive ? " min-w-0 self-center" : " w-full"
          }${showcaseObscured ? " pointer-events-none select-none" : ""}`}
          style={projectsLeftDebugStyle}
          aria-hidden={showcaseObscured || undefined}
        >
          {!activeCard ? (
          <motion.div
            className="projects-showcase-header-block w-full shrink-0"
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{
              opacity: projectsEntered || projectsHeaderYLocked ? 1 : 0,
              y: reduceMotion ? 0 : projectsHeaderYLocked ? 0 : 30,
            }}
            transition={{
              duration: reduceMotion ? 0 : PROJECTS_HEADER_ENTER_DUR_S,
              delay: reduceMotion ? 0 : PROFILE_TITLE_DELAY_S,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              className={`showcase-header flex w-full min-w-0 shrink-0 flex-col items-start mb-6 sm:mb-8 md:mb-10 ${SECTION_MAIN_HEADER_TITLE_CLASS}`}
            >
              <div className="showcase-header-title-stack relative z-10 w-full min-w-0">
                <div className="showcase-header-title-rule w-fit max-w-full">
                  <p className="career-nav-section-subtitle section-main-header-title font-display text-left">PROJECTS</p>
                  <div
                    ref={projectsDividerRef}
                    className="showcase-main-accent-line relative min-h-[2px] w-full"
                    aria-hidden
                  >
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
                      style={{ backgroundColor: PROJECTS_ACCENT_SOFT }}
                      initial={false}
                      animate={{ scaleX: projectsEntered ? 1 : 0 }}
                      transition={{
                        duration: PROFILE_LINE_DURATION_S,
                        delay: RED_LINE_DELAY_MS / 1000,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          ) : null}
          <motion.div
            className="projects-showcase-carousel-block flex w-full shrink-0 flex-col"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{
              opacity: reduceMotion ? 1 : projectsOverlayRevealed ? 1 : 0,
            }}
            transition={{
              duration: PROJECTS_CAROUSEL_ENTRANCE_FADE_S,
              delay: 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "opacity" }}
          >
            <motion.div
              className="projects-showcase-carousel-inner shrink-0"
              initial={false}
              animate={{ opacity: reduceMotion ? 1 : showcaseObscured ? 0 : 1 }}
              transition={{ duration: showcaseFadeDuration, ease: SHOWCASE_EASE }}
            >
              <ProjectsStack
                onSelect={(id, el) => handleCardClick(id, el)}
                focusProjectId={activeCard?.id ?? null}
                carouselAutoAdvanceEnabled={!!carouselAutoAdvanceReady && !showcaseObscured}
                tabletThumbnailValues={activeProjectsTabletThumbnailValues}
              />
            </motion.div>
          </motion.div>
        </div>
        ) : null}
        {/*
         * FEATURED WRITING — separate from header/carousel cluster so portrait nudges do not shift it.
         */}
        {!projectDetailInFlow ? (
        <div
          aria-hidden={showcaseObscured || undefined}
          className={`projects-showcase-flow flex min-h-0 flex-none flex-col 2xl:flex-1${
            projectsShowcaseClusterStyleActive ? " min-w-0 self-center" : " w-full"
          } ${showcaseObscured ? "pointer-events-none select-none" : ""}`}
          style={projectsRightDebugStyle}
        >
          <motion.div
            className={`projects-showcase-featured-block flex w-full shrink-0 min-w-0 flex-col${
              !projectsOverlayRevealed && !reduceMotion ? " invisible" : ""
            }`}
            initial={false}
            animate={{ opacity: reduceMotion ? 1 : showcaseObscured ? 0 : 1 }}
            transition={{ duration: showcaseFadeDuration, ease: SHOWCASE_EASE }}
          >
            <ShowcaseAttachedTabStrip
              activeId={showcaseTabId}
              onTabChange={setShowcaseTabId}
              className="w-full min-w-0"
              panel={({ tabId, previewColumnWidthPx, measureOnly }) => (
                <ShowcaseWritingFeaturedPanel
                  item={SHOWCASE_WRITING_TAB_FEATURED[tabId]}
                  previewWidthPx={previewColumnWidthPx}
                  onOpenPdfInSupporting={onOpenFeaturedPdfInSupporting}
                  measureOnly={measureOnly}
                />
              )}
            />
          </motion.div>
          <div className={SECTION_TABLET_BOTTOM_SPACER} aria-hidden />
        </div>
        ) : null}

        {projectDetailInFlow && activeCard ? (
          <div
            className={`relative flex min-w-0 max-w-full flex-col items-stretch${
              projectDetailLayoutStyle ? "" : " w-full"
            }${
              videoEditingDetailNoMainCard
                ? " projects-interactive-media-detail-stage"
                : ""
            }${
              visualDesignDetailInFlow
                ? " projects-visual-design-detail-stage"
                : ""
            }${
              illustrationsDetailNoHero &&
              !projectsTabletLandscapeViewport
                ? " overflow-y-auto overscroll-y-contain no-scrollbar"
                : ""
            }`}
            style={projectDetailLayoutStyle}
          >
              {!illustrationsDetailNoHero && !videoEditingDetailNoMainCard ? (
                <div
                  className={`project-card-surface relative z-[1] mx-auto w-full max-w-full ${
                    projectDetailLayoutStyle ? "" : PROFILE_VIEWPORT_CONTENT_MAX
                  } ${DETAIL_CARD_H} overflow-hidden rounded-[11px] sm:rounded-xl border border-white/[0.09]`}
                  style={{
                    boxShadow: `${SHOWCASE_SLIDER_MEDIA_BOX_SHADOW}, 0 18px 48px -28px rgba(0,0,0,0.9)`,
                    borderRadius: `${detailCardRadiusPx}px`,
                    background: detailHeroMediaFadeIn ? undefined : "transparent",
                    backgroundImage: "none",
                  }}
                >
                  <div
                    key={activeCard.id}
                    className="h-full w-full"
                    style={{
                      opacity: reduceMotion ? 1 : detailHeroMediaFadeIn ? 1 : 0,
                      ...(reduceMotion
                        ? {}
                        : detailHeroMediaFadeIn
                          ? {
                              transitionProperty: "opacity",
                              transitionDuration: `${DETAIL_HERO_MEDIA_FADE_MS}ms`,
                              transitionTimingFunction: DETAIL_HERO_MEDIA_FADE_EASE,
                            }
                          : {}),
                    }}
                  >
                    <DetailCardMedia card={activeCard} />
                  </div>
                </div>
              ) : null}
              <div
                className={`relative z-[1] mx-auto w-full max-w-full min-w-0 pb-8 ${
                  projectDetailLayoutStyle ? "" : PROFILE_VIEWPORT_CONTENT_MAX
                } ${
                  illustrationsDetailNoHero || videoEditingDetailNoMainCard ? "mt-0 flex flex-col" : "mt-5"
                }${
                  videoEditingDetailNoMainCard
                    ? " projects-interactive-media-detail-inner"
                    : ""
                }${
                  visualDesignDetailInFlow
                    ? " projects-visual-design-detail-inner"
                    : ""
                }`}
              >
                {illustrationsDetailNoHero && activeCard.detailGallery?.length ? (
                  <ShowcaseVisualDesignDetail
                    card={activeCard}
                    reduceMotion={reduceMotion}
                    detailHdrReveal={detailHdrReveal}
                    detailRuleReveal={detailRuleReveal}
                    detailGalleryReveal={detailGalleryReveal}
                  />
                ) : null}
                {videoEditingDetailNoMainCard ? (
                  <ShowcaseVideoEditingDetail
                    card={activeCard}
                    reduceMotion={reduceMotion}
                    detailHdrReveal={detailHdrReveal}
                    detailRuleReveal={detailRuleReveal}
                    detailPlayerReveal={detailRow1Reveal}
                    detailHdrOpacityMs={DETAIL_HDR_OPACITY_MS}
                    detailHdrSlideMs={DETAIL_HDR_SLIDE_MS}
                    detailHdrSlidePx={DETAIL_HDR_SLIDE_PX}
                    detailRuleExpandMs={DETAIL_RULE_EXPAND_MS}
                    detailPlayerOpacityMs={DETAIL_GRID_OPACITY_MS}
                    detailFadeCubic={DETAIL_FADE_CUBIC}
                    detailSlideCubic={DETAIL_SLIDE_CUBIC}
                  />
                ) : null}
                {!illustrationsDetailNoHero && !videoEditingDetailNoMainCard ? (
                <>
                <div
                  className={`flex w-full max-w-full flex-col items-stretch gap-y-1.5 text-left${
                    illustrationsDetailNoHero ? " order-1 mt-0" : ""
                  }`}
                  style={
                    reduceMotion
                      ? { opacity: detailHdrReveal ? 1 : 0 }
                      : {
                          opacity: detailHdrReveal ? 1 : 0,
                          transform: detailHdrReveal
                            ? "translate3d(0,0,0)"
                            : `translate3d(0,${DETAIL_HDR_SLIDE_PX}px,0)`,
                          transition: `opacity ${DETAIL_HDR_OPACITY_MS}ms ${DETAIL_FADE_CUBIC}, transform ${DETAIL_HDR_SLIDE_MS}ms ${DETAIL_SLIDE_CUBIC}`,
                        }
                  }
                >
                  <p className="project-detail-main-eyebrow m-0 w-full font-heading text-sm sm:text-base leading-snug tracking-eyebrow-tight uppercase text-[color:var(--palette-yellow-projects)]">
                    Project details
                  </p>
                  <h3 className="project-detail-main-title m-0 w-full font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em] text-white">
                    <ShowcaseStackedTitle title={activeCard.title} titlePrefix={activeCard.titlePrefix} />
                  </h3>
                  <p className="project-detail-main-subtitle m-0 w-full font-body text-sm sm:text-base leading-snug text-mono-2">
                    {showcaseTaglineCopy(activeCard)}
                  </p>
                </div>
                <div className="mt-5 w-full" aria-hidden>
                  <div
                    className="mx-auto block h-px w-full max-w-full shrink-0 bg-white/[0.09]"
                    style={{
                      clipPath: detailRuleReveal ? "inset(0 0 0 0)" : "inset(0 50% 0 50%)",
                      ...(reduceMotion
                        ? {}
                        : detailRuleReveal
                          ? {
                              transitionProperty: "clip-path",
                              transitionDuration: `${DETAIL_RULE_EXPAND_MS}ms`,
                              transitionTimingFunction: DETAIL_SLIDE_CUBIC,
                            }
                          : {}),
                    }}
                  />
                </div>
                </>
                ) : null}
                {!illustrationsDetailNoHero && !videoEditingDetailNoMainCard ? (
                <div className="pt-3.5 flex flex-col gap-2 sm:gap-3">
                  <div
                    style={
                      reduceMotion
                        ? { opacity: detailRow1Reveal ? 1 : 0 }
                        : {
                            opacity: detailRow1Reveal ? 1 : 0,
                            transform: detailRow1Reveal
                              ? "translate3d(0,0,0)"
                              : `translate3d(0,${DETAIL_GRID_SLIDE_PX}px,0)`,
                            transition: `opacity ${DETAIL_GRID_OPACITY_MS}ms ${DETAIL_FADE_CUBIC}, transform ${DETAIL_GRID_SLIDE_MS}ms ${DETAIL_SLIDE_CUBIC}`,
                          }
                    }
                  >
                    <ShowcaseDetailOverviewRole card={activeCard} />
                  </div>
                  <div
                    style={
                      reduceMotion
                        ? { opacity: detailRow2Reveal ? 1 : 0 }
                        : {
                            opacity: detailRow2Reveal ? 1 : 0,
                            transform: detailRow2Reveal
                              ? "translate3d(0,0,0)"
                              : `translate3d(0,${DETAIL_GRID_SLIDE_PX}px,0)`,
                            transition: `opacity ${DETAIL_GRID_OPACITY_MS}ms ${DETAIL_FADE_CUBIC}, transform ${DETAIL_GRID_SLIDE_MS}ms ${DETAIL_SLIDE_CUBIC}`,
                          }
                    }
                  >
                    <ShowcaseDetailImpactTools card={activeCard} />
                  </div>
                </div>
                ) : null}
              </div>
          </div>
        ) : null}
        </div>

        {/*
         * Permanent measurement anchor ? always in the DOM so we can read its
         * getBoundingClientRect() synchronously at click time (zero RAF delay).
         * Absolutely positioned so it never affects carousel layout.
         */}
        <div
          ref={detailAnchorRef}
          className={`absolute top-0 left-0 right-0 mx-auto w-full ${PROFILE_VIEWPORT_CONTENT_MAX} ${DETAIL_CARD_H} pointer-events-none`}
          aria-hidden
          style={{ visibility: "hidden" }}
        />

        {/*
         * FLIP morph only ? absolute spacer while carousel stays mounted; detail body is in-flow above.
         */}
        {activeCard && !projectDetailInFlow ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center" aria-hidden>
            <div className={`w-full ${PROFILE_VIEWPORT_CONTENT_MAX} shrink-0 ${DETAIL_CARD_H}`} />
          </div>
        ) : null}
        </div>
          </div>
        </div>
      </div>

      {/*
       * FLYING CARD ? portalled into document.body so it is completely outside
       * the panel's CSS transform context. Framer Motion keeps transform:translateX(0)
       * on the panel after slide-in, which (per CSS spec) makes position:fixed
       * children relative to the panel, not the viewport ? causing compositing
       * layer mismatches and full-screen flicker. The portal removes this entirely.
       * FLIP technique: destination size set as plain values (React commit, pre-paint);
       * scaleX/scaleY set synchronously before render via MotionValues.
       */}
      {!videoEditingDetailNoMainCard && !activeCardNoMorph && createPortal(
        <motion.div
          style={{
            position: "fixed",
            overflow: "hidden",
            // Match the carousel card surface so the FLIP reads continuous.
            border: "1px solid rgba(255, 255, 255, 0.09)",
            borderRadius: `${detailCardRadiusPx}px`,
            boxShadow: "0 18px 48px -28px rgba(0, 0, 0, 0.9)",
            background: "transparent",
            backgroundImage: "none",
            zIndex: 9999,
            top: 0,
            left: 0,
            width:  targetRect?.width  ?? 0,
            height: targetRect?.height ?? 0,
            x: mX,
            y: mY,
            scaleX: mScaleX,
            scaleY: mScaleY,
            transformOrigin: "top left",
            visibility: (activeCard && morphRect && !morphDone) ? "visible" : "hidden",
            pointerEvents: "none",
          }}
        >
          {/* No media during morph ? just the dark card shape moving cleanly */}
        </motion.div>,
        document.body,
      )}
    </section>
  );
};

const ProjectPoint = ({ text }: { text: string }) => (
  <div className="flex items-start">
    <Star className="w-5 h-5 text-[color:var(--palette-yellow-projects)] mr-3 mt-1 flex-shrink-0 fill-current" />
    <span className="font-body text-base md:text-lg text-mono-2 leading-relaxed">{text}</span>
  </div>
);

// --- EXPERIENCE ---
const EXPERIENCE_DATA = [
  {
    role: "Digital Content Production",
    company: "RAWBLEM",
    location: "Victoria, BC",
    period: "2024 - Present",
    bullets: [
      "Created, produced, and distributed digital art and interactive narrative content across short-form video platforms.",
      "Planned and executed a story-driven interactive project that reached 30,000+ views on TikTok through platform-driven engagement.",
      "Edited and assembled short-form video using CapCut and DaVinci Resolve, applying timing, transitions, text overlays, animation, and audio synchronization to ensure clarity and pacing.",
      "Adapted content for TikTok, Instagram Reels, and YouTube Shorts to align with platform-specific formatting standards.",
      "Scheduled and coordinated content distribution using Hootsuite while monitoring and responding to audience engagement across multiple platforms.",
      "Managed end-to-end creative workflows independently, from concept and scripting to visual design and audience-driven revision.",
    ],
  },
  {
    role: "Social Media Coordinator",
    company: "UVIC E-Sports Community",
    location: "Victoria, BC",
    period: "2019 - 2020",
    bullets: [
      "Coordinated and managed content across Facebook, Discord, and Twitch in support of a university-affiliated online community.",
      "Planned, produced, and published promotional content for tournaments, announcements, and community events, contributing to increased engagement.",
      "Designed visual assets including logos, posters, and branded graphics to support community identity and event promotion.",
      "Collaborated with organizers and volunteers to ensure consistent messaging and timely updates across platforms.",
      "Built foundational livestream production experience, and later expanded into independently managing full end-to-end stream configurations using OBS and Streamlabs (scene design, overlays, transitions, and audio routing).",
      "Assisted with in-person tournament setup, including CRT configuration and station preparation.",
    ],
  },
  {
    role: "Barista",
    company: "Starbucks",
    location: "Victoria, BC",
    period: "2018 - Present",
    bullets: [
      "Delivered consistent customer service in a high-volume environment, supporting 200+ customer transactions per shift while maintaining quality and efficiency standards.",
      "Supported daily operations through clear communication, multitasking, and real-time coordination with team members during peak periods.",
      "Trained and mentored 5+ new team members, contributing to onboarding, skill development, and team readiness.",
      "Maintained a strong attendance and reliability record over 6+ years in a fast-paced, team-based setting.",
      "Resolved customer concerns and service disruptions by applying company policy, leading with empathy and situational awareness.",
      "Adapted to evolving store procedures, product launches, and operational changes within a continuously shifting retail environment.",
    ],
  },
] as const;

const CAREER_OVERVIEW_PANEL_BULLETS = {
  rawblem: [
    "Created, produced, and distributed digital art and interactive narrative content across short-form video platforms.",
    "Planned and executed a story-driven interactive project that reached 30,000+ views on TikTok through platform-driven engagement.",
    "Edited and assembled short-form video using CapCut and DaVinci Resolve, applying timing, transitions, text overlays, animation, and audio synchronization to ensure clarity and pacing.",
    "Adapted content for TikTok, Instagram Reels, and YouTube Shorts to align with platform-specific formatting standards.",
    "Scheduled and coordinated content distribution using Hootsuite while monitoring and responding to audience engagement across multiple platforms.",
    "Managed end-to-end creative workflows independently, from concept and scripting to visual design and audience-driven revision.",
  ],
  uvic: [
    "Coordinated and managed content across Facebook, Discord, and Twitch in support of a university-affiliated online community.",
    "Planned, produced, and published promotional content for tournaments, announcements, and community events, contributing to increased engagement.",
    "Designed visual assets including logos, posters, and branded graphics to support community identity and event promotion.",
    "Collaborated with organizers and volunteers to ensure consistent messaging and timely updates across platforms.",
    "Built foundational livestream production experience, and later expanded into independently managing full end-to-end stream configurations using OBS and Streamlabs, including scene design, overlays, transitions, and audio routing.",
    "Assisted with in-person tournament setup, including CRT configuration and station preparation.",
  ],
  starbucks: [
    "Delivered consistent customer service in a high-volume environment, supporting 200+ customer transactions per shift while maintaining quality and efficiency standards.",
    "Supported daily operations through clear communication, multitasking, and real-time coordination with team members during peak periods.",
    "Trained and mentored 5+ new team members, contributing to onboarding, skill development, and team readiness.",
    "Maintained a strong attendance and reliability record over 6+ years in a fast-paced, team-based setting.",
    "Resolved customer concerns and service disruptions by applying company policy, leading with empathy and situational awareness.",
    "Adapted to evolving store procedures, product launches, and operational changes within a continuously shifting retail environment.",
  ],
  education: [
    "Awarded Distinction.",
  ],
} as const;

type CareerOverviewSkillTagRow = {
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

/** Explicit label + icon per tab so every section gets the blue SVGs (no string-key lookup). */
const CAREER_OVERVIEW_SKILL_TAG_ROWS: {
  rawblem: CareerOverviewSkillTagRow[];
  uvic: CareerOverviewSkillTagRow[];
  starbucks: CareerOverviewSkillTagRow[];
  education: CareerOverviewSkillTagRow[];
} = {
  rawblem: [
    { label: "Content Production", Icon: IconVideo },
    { label: "DaVinci Resolve", Icon: DavinciResolveIcon },
    { label: "Hootsuite", Icon: SiHootsuite },
  ],
  uvic: [
    { label: "Social Media Operations", Icon: IconShare },
    { label: "Visual Communication", Icon: IconPalette },
    { label: "CapCut", Icon: CapCutIcon },
  ],
  starbucks: [
    { label: "CapCut", Icon: CapCutIcon },
    { label: "Time Management", Icon: IconClock },
    { label: "Independent Work", Icon: IconUser },
  ],
  education: [
    { label: "Content Writing", Icon: IconPencil },
    { label: "Proofreading", Icon: IconChecklist },
    { label: "Research", Icon: IconSearch },
  ],
};

const ExperienceSkillTag = ({ label, Icon }: CareerOverviewSkillTagRow) => (
  <span className="experience-skill-tag">
    <Icon size={13} className="experience-skill-tag-icon" />
    <span>{label}</span>
  </span>
);

const EXPERIENCE_TAB_IDS = ["rawblem", "uvic-esports", "education", "starbucks"] as const;
type ExperienceTabId = (typeof EXPERIENCE_TAB_IDS)[number];

/** Mobile-only horizontal tab stack; tablet+ matches desktop grid + motion. */
const EXPERIENCE_MOBILE_MAX_PX = 767;
const EXPERIENCE_TABLET_LANDSCAPE_MQ = `(min-width: ${PROFILE_TABLET_MIN_PX}px) and (max-width: ${PROFILE_TABLET_MAX_PX}px) and (orientation: landscape) and (any-pointer: coarse)`;
const matchesExperienceTabletLandscapeViewport = () =>
  typeof window !== "undefined" && window.matchMedia(EXPERIENCE_TABLET_LANDSCAPE_MQ).matches;
const EXPERIENCE_TABLET_LANDSCAPE_LOCKED_LAYOUT: ProfileDesktopLayoutDebugValues = {
  leftOffsetX: 68,
  leftOffsetY: -29,
  rightOffsetX: 67,
  rightOffsetY: -7,
  leftScale: 0.95,
  leftWidthScale: 0.97,
  leftHeightScale: 1,
  rightScale: 0.95,
  rightWidthScale: 0.75,
  rightHeightScale: 0.89,
};

const experienceTabBtnClass = (activeId: ExperienceTabId, id: ExperienceTabId) =>
  activeId === id ? "tab-btn active" : "tab-btn";

const experienceTabPanelClass = (activeId: ExperienceTabId, id: ExperienceTabId) =>
  `tab-panel no-scrollbar${activeId === id ? " active" : ""}`;

const ExperienceTabPanelBody = ({ tabId }: { tabId: ExperienceTabId }) => {
  switch (tabId) {
    case "rawblem":
      return (
        <>
          <div className="panel-header">
            <span className="panel-badge">Experience</span>
            <div className="panel-title-row">
              <h1 className="panel-title">{EXPERIENCE_DATA[0].role}</h1>
              <p className="panel-period">{EXPERIENCE_DATA[0].period}</p>
            </div>
            <p className="panel-description">
              {EXPERIENCE_DATA[0].company}
              <span className="panel-meta-sep" aria-hidden="true">
                •
              </span>
              {EXPERIENCE_DATA[0].location}
            </p>
            <div className="experience-skill-tags" aria-label="Relevant skills">
              {CAREER_OVERVIEW_SKILL_TAG_ROWS.rawblem.map((row) => (
                <ExperienceSkillTag {...row} key={row.label} />
              ))}
            </div>
          </div>
          <div className="career-tabs-content-inner">
            <div className="panel-content">
              <div className="content-card">
                <ul className="feature-list">
                  {CAREER_OVERVIEW_PANEL_BULLETS.rawblem.map((bullet) => (
                    <li key={bullet}>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    case "uvic-esports":
      return (
        <>
          <div className="panel-header">
            <span className="panel-badge">Experience</span>
            <div className="panel-title-row">
              <h1 className="panel-title">{EXPERIENCE_DATA[1].role}</h1>
              <p className="panel-period">{EXPERIENCE_DATA[1].period}</p>
            </div>
            <p className="panel-description">
              {EXPERIENCE_DATA[1].company}
              <span className="panel-meta-sep" aria-hidden="true">
                •
              </span>
              {EXPERIENCE_DATA[1].location}
            </p>
            <div className="experience-skill-tags" aria-label="Relevant skills">
              {CAREER_OVERVIEW_SKILL_TAG_ROWS.uvic.map((row) => (
                <ExperienceSkillTag {...row} key={row.label} />
              ))}
            </div>
          </div>
          <div className="career-tabs-content-inner">
            <div className="panel-content">
              <div className="content-card">
                <ul className="feature-list">
                  {CAREER_OVERVIEW_PANEL_BULLETS.uvic.map((bullet) => (
                    <li key={bullet}>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    case "starbucks":
      return (
        <>
          <div className="panel-header">
            <span className="panel-badge">Experience</span>
            <div className="panel-title-row">
              <h1 className="panel-title">{EXPERIENCE_DATA[2].role}</h1>
              <p className="panel-period">{EXPERIENCE_DATA[2].period}</p>
            </div>
            <p className="panel-description">
              {EXPERIENCE_DATA[2].company}
              <span className="panel-meta-sep" aria-hidden="true">
                •
              </span>
              {EXPERIENCE_DATA[2].location}
            </p>
            <div className="experience-skill-tags" aria-label="Relevant skills">
              {CAREER_OVERVIEW_SKILL_TAG_ROWS.starbucks.map((row) => (
                <ExperienceSkillTag {...row} key={row.label} />
              ))}
            </div>
          </div>
          <div className="career-tabs-content-inner">
            <div className="panel-content">
              <div className="content-card">
                <ul className="feature-list">
                  {CAREER_OVERVIEW_PANEL_BULLETS.starbucks.map((bullet) => (
                    <li key={bullet}>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    case "education":
      return (
        <>
          <div className="panel-header">
            <span className="panel-badge">Education</span>
            <div className="panel-title-row">
              <h1 className="panel-title">University of Victoria</h1>
              <p className="panel-period">2024</p>
            </div>
            <p className="panel-description">
              Bachelor&apos;s Degree, Writing
              <span className="panel-meta-sep max-md:hidden" aria-hidden="true">
                •
              </span>
              <span className="max-md:block max-md:mt-0.5">
                <span className="max-md:hidden">
                  University of Victoria
                  <span className="panel-meta-sep" aria-hidden="true">
                    •
                  </span>
                </span>
                Victoria, BC
              </span>
            </p>
            <div className="experience-skill-tags" aria-label="Relevant skills">
              {CAREER_OVERVIEW_SKILL_TAG_ROWS.education.map((row) => (
                <ExperienceSkillTag {...row} key={row.label} />
              ))}
            </div>
          </div>
          <div className="career-tabs-content-inner">
            <div className="panel-content">
              <div className="content-card">
                <p className="card-text">University of Victoria / Victoria, BC / 2024</p>
                <ul className="feature-list">
                  {CAREER_OVERVIEW_PANEL_BULLETS.education.map((bullet) => (
                    <li key={bullet}>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="stats-grid">
                <div className="stat-item stat-item--fade-only">
                  <div className="stat-value">B.A.</div>
                  <div className="stat-label">Writing</div>
                </div>
                <div className="stat-item stat-item--fade-only">
                  <div className="stat-value">UVic</div>
                  <div className="stat-label">Victoria BC</div>
                </div>
                <div className="stat-item stat-item--fade-only">
                  <div className="stat-value">Dist.</div>
                  <div className="stat-label">Distinction</div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
  }
};

const ConfidantExperience = ({
  panelSettled = false,
  reduceMotion = false,
}: {
  /** False until section panel wipe + settle finishes (see `navigateTo` + `CONTENT_SETTLE_DELAY`). */
  panelSettled?: boolean;
  reduceMotion?: boolean | null;
}) => {
  const tabsRootRef = useRef<HTMLDivElement>(null);
  const experienceLandscapePanelMinWidthRef = useRef<number | null>(null);
  const portfolioDebugEnabled = usePortfolioDebugEnabled();
  const [activeExperienceTabId, setActiveExperienceTabId] = useState<ExperienceTabId>("rawblem");
  const [experienceDesktopViewport, setExperienceDesktopViewport] = useState(
    matchesProfileDesktopDebugViewport,
  );
  const [experienceTabletLandscapeViewport, setExperienceTabletLandscapeViewport] = useState(
    matchesExperienceTabletLandscapeViewport,
  );
  const [experienceDesktopLayoutDebugValues, setExperienceDesktopLayoutDebugValues] =
    useState<ProfileDesktopLayoutDebugValues>(() =>
      matchesExperienceTabletLandscapeViewport()
        ? EXPERIENCE_TABLET_LANDSCAPE_LOCKED_LAYOUT
        : readSectionDesktopLayoutDebugValues("experience"),
    );
  const COMPACT_EXPERIENCE_MQ = `(max-width: ${EXPERIENCE_MOBILE_MAX_PX}px), (max-width: 1023px) and (orientation: portrait)`;
  const EXPERIENCE_MOBILE_MQ = `(max-width: ${EXPERIENCE_MOBILE_MAX_PX}px)`;
  const [isCompactExperienceLayout, setIsCompactExperienceLayout] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(COMPACT_EXPERIENCE_MQ).matches
      : false,
  );
  const [isMobileExperienceLayout, setIsMobileExperienceLayout] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(EXPERIENCE_MOBILE_MQ).matches : false,
  );
  const rm = !!reduceMotion;

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${PROFILE_DESKTOP_DEBUG_MIN_PX}px)`);
    const onChange = () => setExperienceDesktopViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(EXPERIENCE_MOBILE_MQ);
    const onChange = () => setIsMobileExperienceLayout(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(EXPERIENCE_TABLET_LANDSCAPE_MQ);
    const onChange = () => setExperienceTabletLandscapeViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const experienceDesktopDebugActive =
    portfolioDebugEnabled && experienceTabletLandscapeViewport;

  useEffect(() => {
    if (!experienceDesktopDebugActive) return;
    setExperienceDesktopLayoutDebugValues(EXPERIENCE_TABLET_LANDSCAPE_LOCKED_LAYOUT);
  }, [experienceDesktopDebugActive]);

  const handleExperienceDesktopLayoutDebugChange = useCallback(
    (patch: Partial<ProfileDesktopLayoutDebugValues>) => {
      setExperienceDesktopLayoutDebugValues((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const handleExperienceDesktopLayoutDebugReset = useCallback(() => {
    setExperienceDesktopLayoutDebugValues(
      experienceTabletLandscapeViewport
        ? EXPERIENCE_TABLET_LANDSCAPE_LOCKED_LAYOUT
        : EXPERIENCE_DESKTOP_LAYOUT_DEBUG_DEFAULTS,
    );
  }, [experienceTabletLandscapeViewport]);

  const handleExperienceDesktopLayoutDebugSave = useCallback(() => {
    saveSectionDesktopLayoutDebugValues("experience", experienceDesktopLayoutDebugValues);
    const lockInTarget = experienceTabletLandscapeViewport
      ? "EXPERIENCE_TABLET_LANDSCAPE_LOCKED_LAYOUT"
      : "EXPERIENCE_DESKTOP_LAYOUT";
    const lockInSnippet = [
      `${lockInTarget} = {`,
      `  leftOffsetX: ${experienceDesktopLayoutDebugValues.leftOffsetX},`,
      `  leftOffsetY: ${experienceDesktopLayoutDebugValues.leftOffsetY},`,
      `  rightOffsetX: ${experienceDesktopLayoutDebugValues.rightOffsetX},`,
      `  rightOffsetY: ${experienceDesktopLayoutDebugValues.rightOffsetY},`,
      `  leftScale: ${experienceDesktopLayoutDebugValues.leftScale.toFixed(2)},`,
      `  leftWidthScale: ${experienceDesktopLayoutDebugValues.leftWidthScale.toFixed(2)},`,
      `  rightScale: ${experienceDesktopLayoutDebugValues.rightScale.toFixed(2)},`,
      `  rightWidthScale: ${experienceDesktopLayoutDebugValues.rightWidthScale.toFixed(2)},`,
      `  rightHeightScale: ${experienceDesktopLayoutDebugValues.rightHeightScale.toFixed(2)},`,
      "};",
    ].join("\n");
    console.info("[Experience Desktop Layout Lock In]\n" + lockInSnippet);
    navigator.clipboard?.writeText(lockInSnippet).catch(() => {
      // Clipboard writes can fail in some browser contexts; localStorage save still succeeds.
    });
  }, [experienceDesktopLayoutDebugValues, experienceTabletLandscapeViewport]);

  const activeExperienceDesktopLayout = experienceTabletLandscapeViewport
    ? experienceDesktopDebugActive
      ? experienceDesktopLayoutDebugValues
      : EXPERIENCE_TABLET_LANDSCAPE_LOCKED_LAYOUT
    : experienceDesktopDebugActive
      ? experienceDesktopLayoutDebugValues
      : EXPERIENCE_DESKTOP_LAYOUT_DEBUG_DEFAULTS;

  const experienceLayoutStyleActive =
    experienceDesktopViewport || experienceTabletLandscapeViewport;

  const experienceLeftDebugStyle = experienceLayoutStyleActive
    ? buildDesktopLayoutSideStyle(activeExperienceDesktopLayout, "left", "crisp")
    : undefined;

  const experienceRightDebugStyle = experienceLayoutStyleActive
    ? buildDesktopLayoutSideStyle(activeExperienceDesktopLayout, "right", "crisp-contained")
    : undefined;
  const experienceLandscapeLockedWidth =
    experienceTabletLandscapeViewport && experienceLandscapePanelMinWidthRef.current
      ? experienceLandscapePanelMinWidthRef.current
      : null;
  const experienceRightWrapperStyle = experienceLandscapeLockedWidth
    ? {
        ...(experienceRightDebugStyle ?? {}),
        width: `${experienceLandscapeLockedWidth}px`,
        minWidth: `${experienceLandscapeLockedWidth}px`,
        maxWidth: `${experienceLandscapeLockedWidth}px`,
      }
    : experienceRightDebugStyle;
  const experienceLandscapeEducationWidthLockStyle = experienceLandscapeLockedWidth
    ? { width: "100%" as const }
    : undefined;

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_EXPERIENCE_MQ);
    const onChange = () => setIsCompactExperienceLayout(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!experienceTabletLandscapeViewport) return;
    if (activeExperienceTabId === "education") return;
    const root = tabsRootRef.current;
    const tabsContent = root?.querySelector<HTMLElement>(".tabs-content");
    if (!tabsContent) return;
    const width = tabsContent.getBoundingClientRect().width;
    if (width > 0) {
      experienceLandscapePanelMinWidthRef.current = width;
    }
  }, [activeExperienceTabId, experienceTabletLandscapeViewport]);

  const handleExperienceTabKeyDown = useCallback(
    (tabId: ExperienceTabId, e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveExperienceTabId(tabId);
      }
    },
    [],
  );

  const renderExperienceTabButton = (
    tabId: ExperienceTabId,
    title: string,
    subtitle: string,
    motionVariants?: Variants,
  ) => {
    const className = experienceTabBtnClass(activeExperienceTabId, tabId);
    const onClick = () => setActiveExperienceTabId(tabId);
    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) =>
      handleExperienceTabKeyDown(tabId, e);
    const label = (
      <div className="tab-text">
        <div className="tab-title">{title}</div>
        <div className="tab-subtitle">{subtitle}</div>
      </div>
    );
    return (
      <motion.button
        key={tabId}
        className={className}
        data-tab={tabId}
        type="button"
        variants={motionVariants}
        onClick={onClick}
        onTouchStart={onClick}
        onKeyDown={onKeyDown}
      >
        {label}
      </motion.button>
    );
  };

  const renderExperienceTabPanels = (): ReactNode =>
    EXPERIENCE_TAB_IDS.map((tabId) => (
      <div
        key={tabId}
        id={tabId}
        className={experienceTabPanelClass(activeExperienceTabId, tabId)}
      >
        <ExperienceTabPanelBody tabId={tabId} />
      </div>
    ));

  const experienceEntranceEase = EASE.out;
  /** Right-hand card — same motion as PROFILE summary / metadata cards. */
  const experienceCardMotionEase = EASE.out;
  const experienceCardEntranceDuration = SUMMARY_DURATION_S * 1.5;
  const experienceCardEntranceY = 21;
  const experienceRailLabelsDelay = rm ? 0 : PROFILE_TITLE_DELAY_S * 1.25 * 1.1 * 1.15 * 1.15 * 0.95;
  const experienceRailBaseDelay = experienceRailLabelsDelay;
  const experienceRailLabelDuration = PROFILE_SECTION_ENTER_S * 1.25;
  const experienceRailLabelSlideX = 24;
  const experienceRailDividerDuration = PROFILE_LINE_DURATION_S;
  const experienceTabsTailDelay = (PROFILE_LINE_DURATION_S + SUMMARY_DELAY_S) * 0.28;
  const experienceTabsBaseDelay = rm
    ? 0
    : (experienceRailLabelsDelay + experienceRailLabelDuration + experienceTabsTailDelay) * 0.9;
  const experienceTabStagger = (BUTTONS_DELAY_AFTER_SUMMARY_MS / 1000) * 0.5;
  const experienceTabItemDuration = SUMMARY_DURATION_S / 1.25;

  const experienceEntranceRoot: Variants = {
    hidden: {},
    visible: {},
  };
  const experienceCardEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, y: rm ? 0 : experienceCardEntranceY, scale: rm ? 1 : 0.965 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0,
        type: "tween",
        duration: rm ? 0 : experienceCardEntranceDuration,
        ease: experienceCardMotionEase,
      },
    },
  };
  const experienceRailHeaderEntrance: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: experienceRailBaseDelay,
      },
    },
  };
  const experienceRailLabelsEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, x: rm ? 0 : experienceRailLabelSlideX },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: rm ? 0 : experienceRailLabelDuration,
        ease: experienceEntranceEase,
      },
    },
  };
  const experienceRailDividerEntrance: Variants = {
    hidden: { scaleX: rm ? 1 : 0 },
    visible: {
      scaleX: 1,
      transition: {
        delay: rm ? 0 : experienceRailLabelDuration,
        duration: rm ? 0 : experienceRailDividerDuration,
        ease: experienceEntranceEase,
      },
    },
  };
  const experienceTabsEntrance: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: experienceTabsBaseDelay,
        staggerChildren: rm ? 0 : experienceTabStagger,
      },
    },
  };
  const experienceTabItemEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: rm ? 0 : experienceTabItemDuration,
        ease: experienceEntranceEase,
      },
    },
  };
  useEffect(() => {
    if (isCompactExperienceLayout) return;
    const root = tabsRootRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>(".career-tabs-content-inner").forEach((el) => {
      el.classList.remove("career-tabs-dim");
      el.style.removeProperty("height");
    });
    root.querySelectorAll<HTMLElement>(".tab-panel .panel-header").forEach((el) => {
      el.classList.remove("career-tabs-dim");
    });
    root.querySelector<HTMLElement>(".tabs-content")?.style.removeProperty("height");

    root.querySelectorAll<HTMLElement>(".tab-panel").forEach((panel) => {
      panel.querySelectorAll<HTMLElement>(
        ".stat-value, .stat-item, .progress-fill, .career-tabs-content-inner, .panel-header, .panel-content, .content-card",
      ).forEach((el) => {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
        el.style.removeProperty("transition");
      });
    });

    const panel = root.querySelector<HTMLElement>(`#${activeExperienceTabId}`);
    if (!panel) return;

    void panel.offsetHeight;

    if (isCompactExperienceLayout) return;

    panel.querySelectorAll<HTMLElement>(".progress-fill").forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });

    const careerStatEase = "cubic-bezier(0.16, 1, 0.3, 1)";
    const isEducation = panel.id === "education";
    const statTargets = isEducation
      ? panel.querySelectorAll<HTMLElement>(".stats-grid .stat-item")
      : panel.querySelectorAll<HTMLElement>(".stat-value");
    statTargets.forEach((stat, index) => {
      stat.style.opacity = "0";
      stat.style.transform = isEducation ? "none" : "translateY(20px)";
      setTimeout(
        () => {
          stat.style.transition = isEducation
            ? `opacity 0.32s ${careerStatEase}`
            : `opacity 0.5s ${careerStatEase}, transform 0.5s ${careerStatEase}`;
          stat.style.opacity = "1";
          stat.style.transform = isEducation ? "none" : "translateY(0)";
        },
        isEducation ? 0 : index * 100,
      );
    });
  }, [activeExperienceTabId, isCompactExperienceLayout]);

  useEffect(() => {
    const root = tabsRootRef.current;
    if (!root) return;

    const tabsNavEl = root.querySelector<HTMLElement>(".tabs-nav");
    const tabHoverShiftPx = tabsNavEl
      ? parseFloat(getComputedStyle(tabsNavEl).getPropertyValue("--career-tab-hover-shift")) || 6
      : 6;

    const tabletCoarseMq = window.matchMedia(
      `(min-width: ${PROFILE_TABLET_MIN_PX}px) and (max-width: ${PROFILE_TABLET_MAX_PX}px) and (any-pointer: coarse)`,
    );
    const tabletLandscapeMq = window.matchMedia(EXPERIENCE_TABLET_LANDSCAPE_MQ);
    /** iPad + Magic Keyboard / trackpad: primary pointer stays touch, so use any-*. */
    const canFineHoverMq = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");

    const buttonCleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>(".tab-btn").forEach((button) => {
      /**
       * Hover slide via mouseenter (iPad trackpad hover does not use pointerType "mouse").
       * Tablet landscape: only when a fine hover device is present; suppress touch-synthesized mouseenter.
       * Leave uses the same CSS transform transition as desktop (smooth return).
       */
      let ignoreTouchMouseHoverUntil = 0;

      const onTouchStart = function (this: HTMLElement) {
        ignoreTouchMouseHoverUntil = performance.now() + 700;
        if (tabletLandscapeMq.matches) this.style.transform = "translateX(0)";
      };

      const onMouseEnter = function (this: HTMLElement) {
        if (tabletLandscapeMq.matches) {
          if (!canFineHoverMq.matches) return;
          if (performance.now() < ignoreTouchMouseHoverUntil) return;
        }
        this.style.transform = `translateX(${tabHoverShiftPx}px)`;
      };

      const onMouseLeave = function (this: HTMLElement) {
        this.style.transform = "translateX(0)";
      };

      /** Tablet portrait sticky hover: mouseleave may not fire after tap. */
      const onClick = function (this: HTMLElement) {
        if (!tabletCoarseMq.matches || tabletLandscapeMq.matches) return;
        this.style.transform = "translateX(0)";
      };

      button.addEventListener("touchstart", onTouchStart, { passive: true });
      button.addEventListener("mouseenter", onMouseEnter);
      button.addEventListener("mouseleave", onMouseLeave);
      button.addEventListener("click", onClick);
      buttonCleanups.push(() => {
        button.removeEventListener("touchstart", onTouchStart);
        button.removeEventListener("mouseenter", onMouseEnter);
        button.removeEventListener("mouseleave", onMouseLeave);
        button.removeEventListener("click", onClick);
      });
    });

    const toggleCleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>(".toggle-switch").forEach((toggle) => {
      const onClick = function (this: HTMLElement) {
        this.classList.toggle("active");
      };
      toggle.setAttribute("tabindex", "0");
      toggle.setAttribute("role", "switch");
      toggle.setAttribute("aria-checked", String(toggle.classList.contains("active")));
      const onKeyDown = function (this: HTMLElement, e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.click();
          this.setAttribute("aria-checked", String(this.classList.contains("active")));
        }
      };

      toggle.addEventListener("click", onClick);
      toggle.addEventListener("keydown", onKeyDown);
      toggleCleanups.push(() => {
        toggle.removeEventListener("click", onClick);
        toggle.removeEventListener("keydown", onKeyDown);
      });
    });

    return () => {
      buttonCleanups.forEach((cleanup) => cleanup());
      toggleCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section
      id="experience"
      className="career-viewport bg-black font-body text-white max-lg:relative max-lg:h-auto max-lg:min-h-0 max-lg:w-full max-lg:overflow-visible"
    >
      <SectionGridOverlay />
      {experienceDesktopDebugActive &&
        typeof document !== "undefined" &&
        createPortal(
          <ProfileDesktopLayoutDebugPanel
            sectionLabel="Experience"
            leftLabel="Left rail"
            rightLabel="Right panel"
            values={experienceDesktopLayoutDebugValues}
            defaults={
              experienceTabletLandscapeViewport
                ? EXPERIENCE_TABLET_LANDSCAPE_LOCKED_LAYOUT
                : EXPERIENCE_DESKTOP_LAYOUT_DEBUG_DEFAULTS
            }
            showRightHeightScale
            onChange={handleExperienceDesktopLayoutDebugChange}
            onSave={handleExperienceDesktopLayoutDebugSave}
            onReset={handleExperienceDesktopLayoutDebugReset}
          />,
          document.body,
        )}
      <div ref={tabsRootRef} className={`career-overview-shell no-scrollbar ${EXPERIENCE_SHELL_TOP_INSET_MAX_LG}`}>
        <div className="container mx-auto px-5 sm:px-6">
        <div className={`mx-auto w-full ${SHOWCASE_COLUMN_MAX} ${EXPERIENCE_GUTTER_OUTER_MAX_LG} lg:px-1 lg:sm:px-2`}>
          <div className={`min-w-0 w-full ${EXPERIENCE_GUTTER_INNER_MAX_LG} lg:px-2 lg:sm:px-4 xl:px-3`}>
          <motion.div
            className="main-container"
            variants={experienceEntranceRoot}
            initial="hidden"
            animate={panelSettled ? "visible" : "hidden"}
          >
          <motion.div className="career-overview-rail" style={experienceLeftDebugStyle}>
          <motion.div
            className="nav-header"
            variants={experienceRailHeaderEntrance}
            initial="hidden"
            animate={panelSettled ? "visible" : "hidden"}
          >
            <motion.div className="career-nav-section-labels" variants={experienceRailLabelsEntrance}>
              <p className="career-nav-section-subtitle section-main-header-title">Experience</p>
              <p className="career-nav-section-title" style={{ color: NAV_SUBHEAD_GRAY }}>
                Career Overview
              </p>
            </motion.div>
            <motion.div
              className="career-nav-section-divider"
              variants={experienceRailDividerEntrance}
              style={{ transformOrigin: "center" }}
              aria-hidden
            />
          </motion.div>
          {/* Vertical Tabs Navigation */}
          <motion.nav
            className="tabs-nav"
            variants={experienceTabsEntrance}
            initial="hidden"
            animate={panelSettled ? "visible" : "hidden"}
          >
            {renderExperienceTabButton(
              "rawblem",
              "Digital Content",
              "RAWBLEM",
              experienceTabItemEntrance,
            )}
            {renderExperienceTabButton(
              "uvic-esports",
              "Social Media",
              "UVic E-Sports",
              experienceTabItemEntrance,
            )}
            {renderExperienceTabButton(
              "education",
              "Education",
              "B.A. Writing",
              experienceTabItemEntrance,
            )}
            {renderExperienceTabButton(
              "starbucks",
              "Barista",
              "Starbucks",
              experienceTabItemEntrance,
            )}
          </motion.nav>
          </motion.div>
          {/* Mobile: single tabs-content (unchanged). Tablet/desktop: sibling shell + content entrance. */}
          <div className="experience-desktop-right-shell">
            <div className="w-fit min-w-0 max-w-full" style={experienceRightWrapperStyle}>
            {isMobileExperienceLayout ? (
              <motion.div
                className="tabs-content"
                style={experienceLandscapeEducationWidthLockStyle}
                variants={experienceCardEntrance}
                initial="hidden"
                animate={panelSettled ? "visible" : "hidden"}
              >
                {renderExperienceTabPanels()}
              </motion.div>
            ) : (
              <div
                className="tabs-content experience-card-entrance-host"
                style={experienceLandscapeEducationWidthLockStyle}
              >
                <motion.div
                  className="experience-card-entrance-shell"
                  style={{ transformOrigin: "0% 0%" }}
                  variants={experienceCardEntrance}
                  initial="hidden"
                  animate={panelSettled ? "visible" : "hidden"}
                  aria-hidden
                />
                <motion.div
                  className="experience-card-entrance-motion w-full min-w-0"
                  style={{ transformOrigin: "0% 0%" }}
                  variants={experienceCardEntrance}
                  initial="hidden"
                  animate={panelSettled ? "visible" : "hidden"}
                >
                  {renderExperienceTabPanels()}
                </motion.div>
              </div>
            )}
            </div>
          </div>
          </motion.div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
const CONTACT_BUTTON_BASE =
  "bg-black rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const SocialLink = () => {
  return (
    <section id="social" className={`relative flex flex-col justify-center min-h-screen w-full overflow-x-hidden py-16 md:py-20 bg-black text-white scroll-mt-6 ${SLIDE}`}>
      <SectionGridOverlay />
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 72 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.416, ease: [0.027, 0, 0.06, 1], delay: 0.4 }}
          className="section-main-header-title font-display text-white relative z-10 mb-12 leading-[0.95]"
        >
          LET'S CONNECT!
        </motion.h2>

        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 1.12 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18, margin: "0px 0px -12% 0px" }}
          className="flex flex-wrap justify-center items-center gap-6"
        >
          <motion.a
            href="#"
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: SPRING.ui }}
            whileTap={TAP}
            className={`${CONTACT_BUTTON_BASE} p-5 border border-red-500/20 text-red-500 hover:border-red-500/50 hover:text-red-400`}
            aria-label="YouTube"
          >
            <div>
              <svg className="w-7 h-7 fill-current transition-colors duration-300" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </svg>
            </div>
          </motion.a>

          <motion.a
            href="#"
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: SPRING.ui }}
            whileTap={TAP}
            className={`${CONTACT_BUTTON_BASE} p-5 border border-blue-500/20 text-blue-500 hover:border-blue-500/50 hover:text-blue-400`}
            aria-label="LinkedIn"
          >
            <div>
              <svg className="w-7 h-7 fill-current transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
          </motion.a>

          <motion.a
            href="#"
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: SPRING.ui }}
            whileTap={TAP}
            className={`${CONTACT_BUTTON_BASE} p-5 border border-cyan-500/20 text-cyan-500 hover:border-cyan-500/50 hover:text-cyan-400`}
            aria-label="TikTok"
          >
            <div>
              <svg className="w-7 h-7 fill-current transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
          </motion.a>

          <motion.a
            href="#"
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: SPRING.ui }}
            whileTap={TAP}
            className={`${CONTACT_BUTTON_BASE} p-5 border border-pink-500/20 text-pink-500 hover:border-pink-500/50 hover:text-pink-400`}
            aria-label="Instagram"
          >
            <div className="flex items-center justify-center">
              <Instagram size={28} className="transition-colors duration-300" strokeWidth={1.5} aria-hidden />
            </div>
          </motion.a>

          <motion.a
            href="#"
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: SPRING.ui }}
            whileTap={TAP}
            className={`${CONTACT_BUTTON_BASE} p-5 border border-white/10 text-mono-2 hover:border-white/30 hover:text-white`}
            aria-label="Email"
          >
            <div className="flex items-center justify-center">
              <Mail size={28} className="transition-colors duration-300" strokeWidth={1.5} aria-hidden />
            </div>
          </motion.a>
        </motion.div>
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
      { title: "WRITING & NARRATIVE", titleCase: "Writing & Narrative", subtitle: "Core Competency", items: ["Content Writing", "Content Editing", "Proofreading", "Storytelling", "Narrative Development"] },
      { title: "SOCIAL & MEDIA", titleCase: "Social & Media", subtitle: "Core Competency", items: ["Digital Media Coordination", "Social Media Operations", "Audience Engagement", "Content Production", "Visual Communication"] },
      { title: "RESEARCH & COLLABORATION", titleCase: "Research & Collaboration", subtitle: "Professional Discipline", items: ["Research", "Fact-Checking", "Time Management", "Team Collaboration", "Independent Work"] },
    ],
  },
  {
    id: "tools",
    label: "TOOLS & SOFTWARE",
    panels: [
      { title: "DESIGN & PRODUCTIVITY", titleCase: "Design & Productivity", subtitle: "Toolkit", items: ["Microsoft Office 365", "Adobe Creative Suite", "Canva", "Procreate", "Cursor"] },
      { title: "VIDEO & WRITING", titleCase: "Video & Writing", subtitle: "Production Tools", items: ["DaVinci Resolve", "CapCut", "Audacity", "Arc Studio", "OBS Studio"] },
      { title: "SOCIAL PLATFORMS", titleCase: "Social Platforms", subtitle: "Distribution Platforms", items: ["Hootsuite", "TikTok Creator Tools", "Instagram Reels", "YouTube Shorts", "Twitch"] },
    ],
  },
];

// ??? SKILLS SYSTEM CONSTANTS ????????????????????????????????????????????????
/** ~56% faster than baseline SKILLS tweens — divide durations/delays by this (1.25 × 1.25). */
const SKILLS_ANIM_SPEED = 1.5625;
const skillsAnimS = (seconds: number) => seconds / SKILLS_ANIM_SPEED;
const BRANCH_DRAW_MS = skillsAnimS(0.32);
const BRANCH_EASE: [number, number, number, number] = [0.4, 0, 0.6, 1];
const SKILLS_DEFAULT_OPACITY = 0.28;
const BACK_MS = 300;
const SLIDE_OFFSET_PX = 280;
const NODE_R = 2.5;
const STROKE_CLR = "rgba(255,255,255,0.5)";
// GRID_CELL_SIZE is already defined globally (line 60)

// ??? CHIP ICON ??????????????????????????????????????????????????????????????
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
      {/* Internal grid ? subtle, aligned */}
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
      {/* Chip body ? increased contrast */}
      <rect
        x={BODY_INSET}
        y={BODY_INSET}
        width={bodySize}
        height={bodySize}
        fill="none"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1"
      />
      {/* Pins ? all four sides, evenly spaced, consistent 1px, precise */}
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

// ??? BRANCH DIAGRAM ?????????????????????????????????????????????????????????
// Calculates paths from actual DOM positions using refs, but enforces
// a calm, symmetrical tree (chip ? junction ? 3 cards).
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

    // Trunk: chip ? title top, title bottom ? junction
    const newTrunk: Segment[] = [
      { x1: cx, y1: chipBottomY, x2: cx, y2: titleTopY },
      { x1: cx, y1: titleBottomY, x2: junctionX, y2: junctionY },
    ];

    // Branches: junction ? each card center
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
        duration: skillsAnimS(2),
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
      {/* Trunk segments: chip ? title, title ? junction */}
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

      {/* Branches: junction ? cards (de?emphasize non?focused when focusedIndex is set) */}
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
          transition={{ duration: skillsAnimS(0.2), ease: BRANCH_EASE, delay: BRANCH_DRAW_MS }}
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
              duration: skillsAnimS(0.18),
              ease: BRANCH_EASE,
              delay: BRANCH_DRAW_MS * 0.7 + idx * skillsAnimS(0.04),
            }}
          />
        );
      })}
    </svg>
  );
};

// ??? SKILLS MOTION CONSTANTS (P3R / neo-Tokyo: UI 160?260ms, stagger 30?60ms) ??
const SKILLS_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1]; // ease-out
const SKILLS_HOVER_DUR = skillsAnimS(0.2);   // ~200ms selection feel (smoother)
const SKILLS_EXPAND_DUR = skillsAnimS(0.3);  // panel settle (slightly longer for polish)
const SKILLS_STAGGER = skillsAnimS(0.05);    // 50ms per item (more pronounced stagger)
const SKILLS_UNDERLINE_DUR = skillsAnimS(0.24);
const SKILLS_HOVER_SHIFT_PX = 8; // Ball travel: increased for more dynamic feel
const SKILLS_CARD_HOVER_SCALE = 1.04; // More pronounced hover scale
const SKILLS_CARD_HOVER_Y = -12; // More lift on hover // Ball travel: slower so it?s readable (was 0.5)

// ??? SKILL CARD DATA ??????????????????????????????????????????????????????????
const SKILLS_DATA = {
  core: {
    title: "CORE COMPETENCIES",
    /** Paired subhead under rail title (EXPERIENCE panel-description color). */
    subtitle: "",
    categories: [
      {
        title: "Writing & Narrative",
        items: [
          "Content Writing",
          "Content Editing",
          "Proofreading",
          "Storytelling",
          "Narrative Development",
        ],
      },
      {
        title: "Social & Media",
        items: [
          "Digital Media Coordination",
          "Social Media Operations",
          "Audience Engagement",
          "Content Production",
          "Visual Communication",
        ],
      },
      {
        title: "Research & Collaboration",
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
    title: "TOOLS & SOFTWARE",
    subtitle: "",
    categories: [
      {
        title: "Design & Productivity",
        items: [
          "Microsoft Office 365",
          "Adobe Creative Suite",
          "Canva",
          "Procreate",
          "Cursor",
        ],
      },
      {
        title: "Video & Writing",
        items: ["DaVinci Resolve", "CapCut", "Audacity", "Arc Studio", "OBS Studio"],
      },
      {
        title: "Social Platforms",
        items: [
          "Hootsuite",
          "TikTok Creator Tools",
          "Instagram Reels",
          "YouTube Shorts",
          "Twitch",
        ],
      },
    ],
  },
};

// Subskill text content (container removed; kept handy ? use SKILLS_DATA.core / SKILLS_DATA.tools above)
// Core: Writing & Narrative, Social & Media, Research & Collaboration + items each.
// Tools: Design & Productivity, Video & Writing, Social Platforms + items each.

// ??? DIAGONAL CONNECTOR GEOMETRY ?????????????????????????????????????????????
// Single sharp line: origin = midpoint of top card?s right edge, end = midpoint of bottom card?s left edge.
// Cards placed with ~35% diagonal separation; line and node use same 0?100 coordinate system.
const WEBHOOKS_CORE_ACCENT = "var(--palette-green)";
const WEBHOOKS_TOOLS_ACCENT = "var(--palette-blue)";
const WEBHOOKS_IDLE_BORDER = "rgba(255,255,255,0.25)";
const DIAGONAL_START = { x: 38, y: 20 };
const DIAGONAL_END   = { x: 62, y: 80 };
const DIAGONAL_MID   = { x: 50, y: 50 };
const SKILLS_CARD_EASE = [0.22, 1, 0.36, 1] as const;
/** Profile metadata pill slide — `PhantomProfile` `x: -24`. */
const PROFILE_PILL_SLIDE_X = 24;
/** #experience `.tab-btn` entrance — same as `experienceTabItemDuration` / `experienceTabStagger`. */
const EXPERIENCE_TAB_ENTRANCE_DUR_S = SUMMARY_DURATION_S / 1.25;
const EXPERIENCE_TAB_STAGGER_S = (BUTTONS_DELAY_AFTER_SUMMARY_MS / 1000) * 0.5;
/** #experience `.nav-header` labels + divider (ConfidantExperience rail). */
const EXPERIENCE_RAIL_LABEL_DUR_S = PROFILE_SECTION_ENTER_S * 1.25;
const EXPERIENCE_RAIL_LABEL_SLIDE_X = 24;
const EXPERIENCE_RAIL_LINE_DUR_S = PROFILE_LINE_DURATION_S;
const EXPERIENCE_TABS_TAIL_DELAY_S = (PROFILE_LINE_DURATION_S + SUMMARY_DELAY_S) * 0.28;
/** Accent line starts this far through the rail label slide (overlap = sooner line). */
const SKILLS_RAIL_LINE_LABEL_OVERLAP = 0.5;
/** Bullets start this far through in-card header (title + line) — before header fully lands. */
const SKILLS_CARD_BULLETS_HEADER_OVERLAP = 0.84;
/** Row 2 shells start this far through row 1 — slightly before row 1 finishes. */
const SKILLS_ROW2_START_OVERLAP = 0.84;
/** Global multiplier for SKILLS section entrance delays + durations (lower = faster). */
const SKILLS_ENTRANCE_SPEED = (0.95 / 1.2705) * 0.95;
const skillsEntranceS = (seconds: number) => (seconds * SKILLS_ENTRANCE_SPEED) / SKILLS_ANIM_SPEED;
/** Green accent scaleX — full line duration, ease-out tail for a softer landing. */
const SKILLS_GREEN_LINE_DUR_S = skillsEntranceS(PROFILE_LINE_DURATION_S);
const SKILLS_GREEN_LINE_EASE = [0.22, 1, 0.36, 1] as const;
/** Header label/title slide — PROFILE `SectionHeader` slideFade duration parity. */
const SKILLS_HEADER_ENTER_DUR_S = skillsEntranceS(0.5);
/** Main + CORE/TOOLKIT rail title slide — slightly longer, softer decel; delays unchanged. */
const SKILLS_SECTION_HEADER_SLIDE_DUR_S = skillsEntranceS(0.5 * 1.12);
const SKILLS_SECTION_HEADER_SLIDE_EASE = [0.12, 0.88, 0.26, 1] as const;
/** Start PROJECTS entrance this many seconds before the section panel wipe finishes. */
const PROJECTS_PANEL_ENTRANCE_LEAD_S = 0.06;
/** PROJECTS header entrance duration (seconds). */
const PROJECTS_HEADER_ENTER_DUR_S = 0.3;
/** Start below-header content exactly when header ends. */
const PROJECTS_BELOW_HEADER_LEAD_MS = 0;
const SKILLS_CARD_DUR = skillsAnimS(0.22);

const SKILLS_CARD_LAYOUT = {
  core: {
    icon: { offsetX: 0, offsetY: -10, size: 84 },
    title: { offsetY: 28, fontSize: 16 },
  },
  tools: {
    icon: { offsetX: 0, offsetY: -10, size: 90 },
    title: { offsetY: 28, fontSize: 16 },
  },
} as const;

/** AiIdea / gear in subskills panel header ? same artwork as intro cards, scaled to the SectionHeader-compact title row. */
const SKILLS_SUBSKILL_HEADER_ICON_PX = 52;

type CoreSubskillIcon = React.ComponentType<{ size?: number; className?: string }>;

/** Core competencies: 3 columns (same structure as Operational Stack). Icons: https://tabler.io/icons */
const CORE_SUBSKILLS_CATEGORIES: {
  categoryTitle: string;
  /** iPad portrait (768–1366px): shorter in-card title without changing other breakpoints. */
  tabletPortraitTitle?: string;
  items: { label: string; Icon: CoreSubskillIcon }[];
}[] = [
  {
    categoryTitle: "Writing & Editorial",
    items: [
      { label: "Content Writing", Icon: IconPencil },
      { label: "Content Editing", Icon: IconEdit },
      { label: "Proofreading", Icon: IconChecklist },
      { label: "Storytelling", Icon: IconBook },
      { label: "Narrative Development", Icon: IconFileText },
    ],
  },
  {
    categoryTitle: "Social & Media",
    items: [
      { label: "Digital Media Coordination", Icon: IconDeviceDesktop },
      { label: "Social Media Operations", Icon: IconShare },
      { label: "Audience Engagement", Icon: IconUsers },
      { label: "Content Production", Icon: IconVideo },
      { label: "Visual Communication", Icon: IconPalette },
    ],
  },
  {
    categoryTitle: "Research & Collaboration",
    tabletPortraitTitle: "Research",
    items: [
      { label: "Research", Icon: IconSearch },
      { label: "Fact-Checking", Icon: IconCertificate },
      { label: "Time Management", Icon: IconClock },
      { label: "Team Collaboration", Icon: IconUsers },
      { label: "Independent Work", Icon: IconUser },
    ],
  },
];

// Controls vertical positioning of the SKILLS block (header + cards) in rem.
const SKILLS_LAYOUT = {
  /** Vertical nudge for the skills block (rem); `0` keeps top/bottom balance and viewport-fixed chrome aligned */
  sectionOffsetRem: 0,
} as const;

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
              ? "0 12px 24px -8px rgba(34,211,238,0.3)" 
              : "none",
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none opacity-0"
            animate={{ opacity: hoverTarget === "left" ? 0.12 : 0 }}
            transition={{ duration: cardDur, ease: SKILLS_CARD_EASE }}
            style={{
              background: "linear-gradient(168deg, rgba(34,211,238,0.2) 0%, transparent 60%)",
              willChange: "opacity",
            }}
          />
          <motion.span 
            className="relative z-10 font-display text-sm md:text-base font-semibold uppercase tracking-[0.11em] leading-snug text-white"
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
              ? "0 12px 24px -8px rgba(8,145,178,0.3)" 
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
            className="relative z-10 font-display text-sm md:text-base font-semibold uppercase tracking-[0.11em] leading-snug text-white"
            animate={{
              scale: hoverTarget === "right" ? 1.05 : 1,
            }}
            transition={{ duration: cardDur * 0.8, ease: SKILLS_CARD_EASE }}
          >
            {rightLabel}
          </motion.span>
        </button>
      </motion.div>

      {/* Single connector: origin = top card right-mid, end = bottom card left-mid; 1.5?2px, sharp */}
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
              ? { duration: skillsAnimS(0.5), ease: [0.22, 1, 0.36, 1] }
              : { duration: cardDur, ease: SKILLS_CARD_EASE },
            boxShadow: { duration: cardDur, ease: SKILLS_CARD_EASE },
          }}
        />
      </div>
    </div>
  );
};

// ??? SKILLS EXPANDED VIEW (morphed title + panel; no cards, no line/ball) ??????
const SKILLS_VIEW_TRANSITION = { duration: skillsAnimS(0.35), ease: [0.2, 0.8, 0.2, 1] as const };

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
          delay: reducedMotion ? 0 : skillsAnimS(0.05),
        }}
        className="w-full flex items-center justify-between gap-4 mb-6"
      >
        <motion.h2
          className="font-display text-2xl md:text-3xl font-semibold uppercase tracking-[0.1em] leading-tight text-white border-l-4 pl-4"
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
          className="flex items-center gap-2 font-heading text-xs uppercase tracking-btn-caps bg-portfolio-blue text-white border border-portfolio-blue hover:bg-white hover:text-black hover:border-white rounded-lg px-3 py-2 transition-colors duration-200"
          aria-label="Back to skills"
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: skillsAnimS(0.2) }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </motion.button>
      </motion.div>

      {/* Subskills panel */}
      <div className="w-full">
        <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {data.categories.map((category) => (
              <div key={category.title} className="border-l border-white/10 pl-4">
                <h4 className="skills-subcategory-column-title font-display text-xs md:text-sm uppercase tracking-[0.08em] leading-snug !text-zinc-100 mb-1.5 md:mb-2.5 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] md:text-xs text-zinc-200 tracking-tight leading-tight"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ??? SKILLS EXPANDED PANEL (category list only; used when we need just the panel) ?
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
      exit={{ opacity: 0, y: 8, transition: { duration: skillsAnimS(0.2), ease: SKILLS_EASE } }}
      transition={{ duration: expandDur, ease: SKILLS_EASE }}
      className="mt-10 w-full max-w-4xl mx-auto"
    >
        <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {data.categories.map((category) => (
              <div key={category.title} className="border-l border-white/10 pl-4">
                <h4 className="skills-subcategory-column-title font-display text-xs md:text-sm uppercase tracking-[0.08em] leading-snug !text-zinc-100 mb-1.5 md:mb-2.5 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] md:text-xs text-zinc-200 tracking-tight leading-tight"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
  );
};

// ??? SKILL ARSENAL (dual-layer: undercard expands, P3R-style reveal) ?????????????
// P3R motion: UI 160?260ms, ease-out, panel slide + row stagger (30?60ms), y+opacity
const MORPH_DUR = skillsAnimS(0.22);
const MORPH_EASE = [0.2, 0.8, 0.2, 1] as const; // P3R ease-out
const MORPH_EXPAND_DUR = skillsAnimS(0.28);
const MORPH_EXPAND_EASE = [0.22, 1, 0.36, 1] as const;
const P3R_STAGGER_MS = 45 / SKILLS_ANIM_SPEED; // 30?60ms per row

/**
 * When `true`: Core + Tools intro pair shows first; opening a card reveals sub-skills in the overlay (with Close).
 * When `false`: Both sub-skills panels show inline together, stacked vertically.
 */
const SKILLS_SHOW_INTRO_PAIR_CARDS = false;

/**
 * Lightbulb (`AiIdeaSvg`) + gear (`GearSvg`) on intro pair cards and subskills panel headers.
 * Set `true` to show them again.
 */
const SKILLS_SHOW_IDEA_GEAR_DECOR = false;

/* From Uiverse.io by Adrwaan ? outer shell; StealthWorm corner grammar (sharp TL/BR, rounded TR/BL). */
const UiverseCard = styled.div`
  position: relative;
  width: 360px;
  height: 270px;
  border-radius: 0 2rem;
  transition: transform 0.3s ease;

  @media (max-width: 639px) {
    width: min(90vw, 360px);
    height: auto;
    min-height: 200px;
    aspect-ratio: 4 / 3;
    border-radius: 0 1.35rem;
  }

  &:hover {
    transform: translateY(-6px);
  }

  /* ICON_HOVER_DISABLED: UiverseCard SVG (idea/gear + star) ? restore rules below
  &:hover .paperplane {
    transform: scale(1.07) translateY(-10%) rotate(18deg);
  }

  &:hover [data-ai-star] {
    fill: #f5f5f5;
  }
  */

  &:hover [data-card-title-wrap] {
    transform: scale(1.08);
  }

  /* Main skill cards: 10% larger than base */
  &.skills-main-card {
    width: 396px;
    height: 297px;
    @media (max-width: 639px) {
      width: min(90vw, 396px);
      height: auto;
      min-height: 220px;
      aspect-ratio: 4 / 3;
    }
  }

  /* Expanded subskills: grow with content up to cap */
  &.skills-subcard {
    width: min(100%, 1180px);
    height: auto;
    max-height: min(440px, 58vh);
    overflow: hidden;
    @media (max-width: 639px) {
      width: 100%;
      max-height: min(680px, 90vh);
      aspect-ratio: unset;
      min-height: 0;
    }
    &:hover {
      transform: none;
    }
  }

  /* Two stacked inline panels: share viewport height (overrides single-card cap above). */
  &.skills-subcard.skills-subcard-dual {
    width: 100%;
    max-height: none;
    overflow: visible;
    @media (max-width: 639px) {
      width: 100%;
      max-height: none;
    }
  }
`;

const CardBlackFace = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 364px;
  height: 274px;
  background: transparent;
  border: none;
  border-radius: 0 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  overflow: hidden;

  @media (max-width: 639px) {
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    border-radius: 0 0.65rem;
  }

  /* Main skill cards: 10% larger inner face */
  .skills-main-card:not(.skills-subcard) & {
    width: 400px;
    height: 301px;
    @media (max-width: 639px) {
      width: calc(100% - 8px);
      height: calc(100% - 8px);
    }
  }

  /* Subskills: in-flow height so card + rules hug content */
  .skills-subcard & {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    width: 100%;
    height: auto;
    transform: none;
    align-items: stretch;
    padding: 0;
  }
  .skills-subcard & > div:last-child {
    width: 100%;
    min-height: 0;
    height: auto;
    display: flex;
    flex-direction: column;
    border-radius: inherit;
  }
`;

const PaperplaneSvg = styled.svg`
  fill: #f5f5f5;
  width: 70px;
  transition: 0.4s all;
`;

const BulbSvg = styled.svg`
  fill: #f5f5f5;
  width: 70px;
  transition: 0.4s all;
`;

const AiIdeaSvg = styled.svg`
  fill: none;
  stroke: #f5f5f5;
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  width: 70px;
  transition: 0.4s all;

  [data-ai-star] {
    transition: fill 0.25s ease;
  }
`;

const GearSvg = styled.svg`
  width: 70px;
  transition: 0.4s all;
  color: #f5f5f5;
`;

const CardTitleSlot = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 0.5rem 0.75rem;
  text-align: center;
  pointer-events: none;

  [data-card-title-wrap] {
    display: block;
    transform-origin: center bottom;
    transition: transform 0.25s ease;
  }
`;

const PAPERPLANE_PATH =
  "M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z";

const BULB_PATH =
  "M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1a.5.5 0 0 1 0-1a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1";

const AI_IDEA_PATH_1 =
  "M19 9.62c0 2.58-1.27 4.565-3.202 5.872c-.45.304-.675.456-.786.63c-.11.172-.149.4-.224.854l-.06.353c-.132.798-.199 1.197-.479 1.434s-.684.237-1.493.237h-2.612c-.809 0-1.213 0-1.493-.237s-.346-.636-.48-1.434l-.058-.353c-.076-.453-.113-.68-.223-.852s-.336-.326-.787-.634C5.192 14.183 4 12.199 4 9.62C4 5.413 7.358 2 11.5 2a7.4 7.4 0 0 1 1.5.152";
const AI_IDEA_STAR =
  "m16.5 2l.258.697c.338.914.507 1.371.84 1.704c.334.334.791.503 1.705.841L20 5.5l-.697.258c-.914.338-1.371.507-1.704.84c-.334.334-.503.791-.841 1.705L16.5 9l-.258-.697c-.338-.914-.507-1.371-.84-1.704c-.334-.334-.791-.503-1.705-.841L13 5.5l.697-.258c.914-.338 1.371-.507 1.704-.84c.334-.334.503-.791.841-1.705";
const AI_IDEA_LINE =
  "M13.5 19v1c0 .943 0 1.414-.293 1.707S12.443 22 11.5 22s-1.414 0-1.707-.293S9.5 20.943 9.5 20v-1";



const SKILLS_EXPAND_EASE = [0.22, 1, 0.36, 1] as const;
const SKILLS_EXPAND_EXIT_DUR = skillsAnimS(0.28);
const SKILLS_EXPAND_ENTER_DUR = SKILLS_EXPAND_EXIT_DUR * 1.5; // 50% longer fade-in

/** Rule-of-thirds overlay for positioning — toggle with Q in dev. */
const RuleOfThirdsOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
  background-image:
    /* Vertical lines at 1/3 and 2/3 */
    linear-gradient(
      to right,
      transparent calc(33.333% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(33.333% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(33.333% + 0.5px),
      transparent calc(33.333% + 0.5px)
    ),
    linear-gradient(
      to right,
      transparent calc(66.666% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(66.666% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(66.666% + 0.5px),
      transparent calc(66.666% + 0.5px)
    ),
    /* Horizontal lines at 1/3 and 2/3 */
    linear-gradient(
      to bottom,
      transparent calc(33.333% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(33.333% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(33.333% + 0.5px),
      transparent calc(33.333% + 0.5px)
    ),
    linear-gradient(
      to bottom,
      transparent calc(66.666% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(66.666% - 0.5px),
      rgba(34, 197, 94, 0.4) calc(66.666% + 0.5px),
      transparent calc(66.666% + 0.5px)
    );
  background-size: 100% 100%;
  background-position: 0 0, 0 0, 0 0, 0 0;
  background-repeat: no-repeat;
`;

/** Fixed viewport rule-of-thirds overlay (above content panels, below top controls z-50). */
const ViewportRuleOfThirdsOverlay = styled(RuleOfThirdsOverlay)`
  position: fixed;
  top: max(
    calc(0.875rem + 0.625rem + 2.75rem),
    calc(env(safe-area-inset-top, 0px) + 1.125rem + 2.75rem)
  );
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 45;
  border-radius: 0;

  @media (min-width: 640px) {
    top: max(
      calc(0.875rem + 0.625rem + 3.5rem),
      calc(env(safe-area-inset-top, 0px) + 1.125rem + 3.5rem)
    );
  }

  @media (min-width: 1024px) {
    top: calc(1.5rem + 3.5rem);
  }
`;

/** Background marquee (not inside cards): same outline style; runs on its own layer behind panels. */
type SkillsAmbientBand = "core" | "tools";

const SKILLS_AMBIENT_MARQUEE_COPY: Record<SkillsAmbientBand, string> = {
  core: "Core ? Competencies ? Systems ? Execution ?",
  tools: "Toolkit ? Stack ? Workflow ? Production ?",
};

/** Stacked marquee ?wall? behind each skills card band only (not full page). */
const SKILLS_AMBIENT_WALL_ROW_COUNT = 13;
/** Horizontal loop copies per row (must match CSS keyframe divisor `skills-panel-marquee-shift-wall`). */
const SKILLS_AMBIENT_WALL_LOOP_COPIES = 6;
/** Keep marquee background idea in code but disabled. */
const SKILLS_SHOW_AMBIENT_MARQUEE_BG = false;

const SkillsAmbientWall = ({ band }: { band: SkillsAmbientBand }) => (
  <div
    className="skills-ambient-wall flex h-full min-h-0 w-full min-w-0 flex-col gap-y-1"
    data-skills-ambient-band={band}
  >
    {Array.from({ length: SKILLS_AMBIENT_WALL_ROW_COUNT }, (_, i) => (
      <div
        key={`${band}-${i}`}
        className="skills-ambient-wall-row relative min-h-0 min-w-0 flex-1 basis-0 overflow-hidden"
      >
        <div
          className={`skills-panel-marquee-shell skills-ambient-marquee skills-ambient-wall-cell${
            band === "tools" ? " skills-panel-marquee-shell--tools" : ""
          }`}
        >
          <div className="skills-panel-marquee-track">
            {Array.from({ length: SKILLS_AMBIENT_WALL_LOOP_COPIES }, (_, k) => (
              <span key={k} className="skills-panel-marquee-segment">
                {SKILLS_AMBIENT_MARQUEE_COPY[band]}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Expanded subskills content. Header row: optional AiIdeaSvg / GearSvg when `SKILLS_SHOW_IDEA_GEAR_DECOR`.
 * Removed: `SkillsSourceToggle` toolbar - restore via git; related hover CSS commented in `index.css`.
 */
const SkillsSubskillsPanel = ({
  slide,
  variant,
  onClose,
  dualInline = false,
}: {
  slide: "core" | "tools";
  variant: "overlay" | "inline";
  onClose?: () => void;
  /** Both skills panels visible: tighter type/spacing so each card reads without inner scrolling. */
  dualInline?: boolean;
}) => {
  const ruleOfThirdsEnabled = useRuleOfThirdsEnabled();
  const panelHeader = SKILLS_DATA[slide];
  const headerCompact = dualInline && variant === "inline";

  const rowZoneBackdrop = dualInline ? null : <div aria-hidden className={SKILLS_ROW_STRIP_BG} />;

  const rowZonePad = dualInline ? "relative w-full min-w-0" : SKILLS_ROW_ZONE_PADDING;

  const gridGapClass = dualInline
    ? "gap-y-2 gap-x-2 sm:gap-y-3 sm:gap-x-3 md:gap-x-3"
    : "gap-y-5 sm:gap-y-7 gap-x-4 md:gap-x-5 lg:gap-x-6";
  const columnPadClass = dualInline
    ? "px-2 py-2.5 sm:px-3 sm:py-3 md:px-3.5 md:py-3.5"
    : "px-3 py-3 sm:px-4 sm:py-3.5";
  const treeConnector = dualInline ? (
    <motion.div
      className="relative z-[1] mx-auto mb-2.5 h-7 w-[68%] sm:mb-3 sm:h-8"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: skillsAnimS(0.32), ease: SKILLS_EASE, delay: skillsAnimS(0.12) }}
    >
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/[0.14]" />
      <div className="absolute left-0 right-0 bottom-0 h-px bg-white/[0.12]" />
      <div className="absolute left-0 bottom-0 h-2.5 w-px bg-white/[0.12]" />
      <div className="absolute left-1/2 bottom-0 h-2.5 w-px -translate-x-1/2 bg-white/[0.12]" />
      <div className="absolute right-0 bottom-0 h-2.5 w-px bg-white/[0.12]" />
    </motion.div>
  ) : null;

  /** Same rail header as #experience .nav-header (title + gray subhead + divider). */
  const sectionHeader = dualInline ? (
    <motion.div
      className="skills-subpanel-header skills-subpanel-header--compact nav-header relative z-[1] mx-auto w-fit max-w-full flex-shrink-0 min-w-0 text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: skillsAnimS(0.3), ease: SKILLS_EASE, delay: slide === "core" ? skillsAnimS(0.1) : skillsAnimS(0.16) }}
    >
      <div className="career-nav-section-labels min-w-0 items-center pr-0 text-center">
        <p className="career-nav-section-subtitle">{panelHeader.title}</p>
        {panelHeader.subtitle ? (
          <p className="career-nav-section-title" style={{ color: NAV_SUBHEAD_GRAY }}>{panelHeader.subtitle}</p>
        ) : null}
      </div>
      <div className="career-nav-section-divider" aria-hidden />
    </motion.div>
  ) : (
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
        {panelHeader.subtitle ? (
          <p className="career-nav-section-title" style={{ color: NAV_SUBHEAD_GRAY }}>{panelHeader.subtitle}</p>
        ) : null}
      </div>
      <div className="career-nav-section-divider" aria-hidden />
      {SKILLS_SHOW_IDEA_GEAR_DECOR ? (
        <div
          className={
            headerCompact
              ? "skills-subskills-header-icon absolute top-0 right-0 shrink-0 translate-y-0.5 sm:translate-y-1 [&_svg]:!w-[26px] [&_svg]:!h-[26px] sm:[&_svg]:!w-[44px] sm:[&_svg]:!h-[44px]"
                : "skills-subskills-header-icon absolute top-0 right-0 shrink-0 translate-y-1 sm:translate-y-1.5 [&_svg]:!w-[29px] [&_svg]:!h-[29px] sm:[&_svg]:!w-[52px] sm:[&_svg]:!h-[52px]"
          }
          aria-hidden
        >
            {slide === "core" ? (
              <span
                className="inline-flex sm:[transform:var(--icon-offset)]"
                style={
                  {
                    "--icon-offset": `translate(${Math.round(SKILLS_CARD_LAYOUT.core.icon.offsetX * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.core.icon.size))}px, ${Math.round(SKILLS_CARD_LAYOUT.core.icon.offsetY * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.core.icon.size))}px)`,
                  } as React.CSSProperties
                }
              >
                <AiIdeaSvg
                  viewBox="0 0 24 24"
                  className="paperplane"
                  style={{
                    width: SKILLS_SUBSKILL_HEADER_ICON_PX,
                    height: SKILLS_SUBSKILL_HEADER_ICON_PX,
                  }}
                >
                  <path strokeLinecap="round" d={AI_IDEA_PATH_1} />
                  <path data-ai-star d={AI_IDEA_STAR} />
                  <path d={AI_IDEA_LINE} />
                </AiIdeaSvg>
              </span>
            ) : (
              <span
                className="inline-flex text-mono-1 max-sm:translate-y-[5%] sm:[transform:var(--icon-offset)]"
                style={
                  {
                    "--icon-offset": `translate(${Math.round(SKILLS_CARD_LAYOUT.tools.icon.offsetX * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.tools.icon.size))}px, ${Math.round(SKILLS_CARD_LAYOUT.tools.icon.offsetY * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.tools.icon.size)) + Math.round(SKILLS_SUBSKILL_HEADER_ICON_PX * 0.05)}px)`,
                  } as React.CSSProperties
                }
              >
                <GearSvg
                  viewBox="0 0 256 256"
                  className="paperplane"
                  style={{
                    width: SKILLS_SUBSKILL_HEADER_ICON_PX,
                    height: SKILLS_SUBSKILL_HEADER_ICON_PX,
                  }}
                >
                  <rect width="256" height="256" fill="none" stroke="none" />
                  <path
                    d="M130.05,206.11c-1.34,0-2.69,0-4,0L94,224a104.61,104.61,0,0,1-34.11-19.2l-.12-36c-.71-1.12-1.38-2.25-2-3.41L25.9,147.24a99.15,99.15,0,0,1,0-38.46l31.84-18.1c.65-1.15,1.32-2.29,2-3.41l.16-36A104.58,104.58,0,0,1,94,32l32,17.89c1.34,0,2.69,0,4,0L162,32a104.61,104.61,0,0,1,34.11,19.2l.12,36c.71,1.12,1.38,2.25,2,3.41l31.85,18.14a99.15,99.15,0,0,1,0,38.46l-31.84,18.1c-.65,1.15-1.32,2.29-2,3.41l-.16,36A104.58,104.58,0,0,1,162,224Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="11"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="11"
                  />
                </GearSvg>
              </span>
            )}
          </div>
        ) : null}
    </div>
  );

  return (
  <UiverseCard
    className={`skills-main-card skills-subcard${dualInline ? " skills-subcard-dual" : ""}`}
    onClick={variant === "overlay" ? (e) => e.stopPropagation() : undefined}
  >
    <CardBlackFace>
      {ruleOfThirdsEnabled && <RuleOfThirdsOverlay />}
      {variant === "overlay" && onClose ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 px-3 py-2 text-xs font-heading font-medium uppercase tracking-btn-caps text-white border border-white/30 bg-white/5 hover:bg-portfolio-blue hover:border-portfolio-blue-bright hover:text-white rounded-md transition-colors duration-200 shadow-sm"
          aria-label="Close subskills"
        >
          Close
        </button>
      ) : null}
      <motion.div
        key={slide}
        className={
          variant === "overlay"
            ? "relative z-10 flex min-h-0 max-h-[min(680px,90vh)] sm:max-h-[min(440px,58vh)] flex-col overflow-hidden px-4 sm:px-10 md:px-16 lg:px-20 py-4 pt-12 sm:pt-14 pb-5 sm:pb-6 text-left shadow-[0_0_22px_rgba(0,0,0,0.5),0_0_18px_rgba(34,211,238,0.12)]"
            : dualInline
              ? "relative z-10 flex min-h-0 flex-col overflow-visible px-0 pt-0 pb-0 text-left"
              : "relative z-10 flex min-h-0 max-h-[min(680px,90vh)] sm:max-h-[min(440px,58vh)] flex-col overflow-hidden px-4 sm:px-8 md:px-14 lg:px-16 xl:px-20 py-2.5 sm:py-6 md:py-7 text-left shadow-[0_0_22px_rgba(0,0,0,0.5),0_0_18px_rgba(34,211,238,0.12)]"
        }

      >
        <motion.div
          className={
            "relative z-[1] flex-1 min-h-0"
          }
        >
        <div
          className={
            variant === "inline"
              ? dualInline
                ? "h-full min-h-0 overflow-visible pr-0 pb-0"
                : "h-full min-h-0 overflow-y-hidden overflow-x-hidden pr-2 pb-3 sm:pb-2"
              : "h-full min-h-0 overflow-y-hidden overflow-x-hidden pr-2 pb-8 sm:pb-2"
          }
        >
          {slide === "core" ? (
            <div className="text-[14px] sm:text-[15px] leading-[1.55] text-white">
              <div className={`relative w-full min-w-0 ${rowZonePad}`}>
                {rowZoneBackdrop}
                {sectionHeader}
                {treeConnector}
                <div className={`relative z-[1] grid w-full min-w-0 ${dualInline ? "grid-cols-3" : "grid-cols-1 md:grid-cols-3"} md:items-start ${gridGapClass}`}>
                {CORE_SUBSKILLS_CATEGORIES.map(({ categoryTitle, items }, index) => {
                  const columnClass = [
                    "flex min-w-0 min-h-0 flex-col",
                    SKILLS_SUBCATEGORY_CARD_FACE,
                    columnPadClass,
                  ].join(" ");
                  const cardInner = (
                    <>
                      <p
                        className={`${dualInline ? "mb-2 pb-1.5 text-[0.625rem] leading-tight tracking-[0.06em] sm:mb-2.5 sm:pb-2 sm:text-[0.6875rem] md:text-xs" : "mb-3.5 pb-2.5 text-[12px] sm:text-[13px] tracking-eyebrow-tight"} skills-subcategory-column-title w-full min-w-0 border-b border-white/[0.06] text-center font-heading font-semibold uppercase !text-zinc-100 text-balance whitespace-normal`}
                        title={categoryTitle}
                      >
                        {categoryTitle}
                      </p>
                      <ul className={dualInline ? "space-y-1 sm:space-y-1.5" : "space-y-2 sm:space-y-3"}>
                        {items.map(({ label, Icon }) => (
                          <li
                            key={label}
                            className={`${dualInline ? "gap-1.5 text-[0.6875rem] leading-tight sm:gap-2 sm:text-[0.6875rem] md:text-xs" : "gap-3"} group flex min-w-0 items-center transition-transform duration-200 ease-out hover:translate-x-[2px]`}
                          >
                            <span className={`${dualInline ? "h-4 w-4 sm:h-[18px] sm:w-[18px]" : "h-5 w-5"} inline-flex shrink-0 items-center justify-center`}>
                              <Icon size={dualInline ? 16 : 18} className="text-portfolio-green" />
                            </span>
                            <span
                              className="min-w-0 text-zinc-200 transition-colors duration-200 ease-out"
                              title={label}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                  return (
                    <motion.div
                      key={categoryTitle}
                      className={columnClass}
                      initial={dualInline ? { opacity: 0, y: 8 } : undefined}
                      animate={dualInline ? { opacity: 1, y: 0 } : undefined}
                      transition={dualInline ? { duration: skillsAnimS(0.28), ease: SKILLS_EASE, delay: skillsAnimS(0.18 + index * 0.045) } : undefined}
                    >
                      {cardInner}
                    </motion.div>
                  );
                })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[14px] sm:text-[15px] leading-[1.55] text-white">
              <div className={`relative w-full min-w-0 ${rowZonePad}`}>
                {rowZoneBackdrop}
                {sectionHeader}
                {treeConnector}
                <div className={`relative z-[1] grid w-full min-w-0 ${dualInline ? "grid-cols-3" : "grid-cols-1 md:grid-cols-3"} md:items-start ${gridGapClass} [&>*]:min-w-0`}>
                {[
                  {
                    title: "Design & Productivity",
                    label: "Design & Productivity",
                    items: [
                      "Microsoft Office 365",
                      "Adobe Creative Suite",
                      "Canva",
                      "Procreate",
                      "Cursor",
                    ],
                  },
                  {
                    title: "Video & Writing",
                    label: "Video & Writing",
                    items: ["DaVinci Resolve", "CapCut", "Audacity", "Arc Studio", "OBS Studio"],
                  },
                  {
                    title: "Social Platforms",
                    label: "Social Platforms",
                    items: [
                      "Hootsuite",
                      "TikTok Creator Tools",
                      "Instagram Reels",
                      "YouTube Shorts",
                      "Twitch",
                    ],
                  },
                ].map(({ title, label, items }, index) => {
                  const columnClass = [
                    "min-w-0 flex min-h-0 flex-col",
                    SKILLS_SUBCATEGORY_CARD_FACE,
                    columnPadClass,
                  ].join(" ");
                  const cardInner = (
                    <>
                      <p
                        className={`${dualInline ? "mb-2 pb-1.5 text-[0.625rem] leading-tight tracking-[0.06em] sm:mb-2.5 sm:pb-2 sm:text-[0.6875rem] md:text-xs" : "mb-3.5 pb-2.5 text-[12px] sm:text-[13px] tracking-eyebrow-tight"} skills-subcategory-column-title w-full min-w-0 border-b border-white/[0.06] text-center font-heading font-semibold uppercase !text-zinc-100 text-balance whitespace-normal`}
                        title={title}
                      >
                        {label}
                      </p>
                      <ul className={dualInline ? "space-y-1 sm:space-y-1.5" : "space-y-2 sm:space-y-3"}>
                        {items.map((tool) => (
                          <li
                            key={tool}
                            className={`${dualInline ? "gap-1.5 text-[0.6875rem] leading-tight sm:gap-2 sm:text-[0.6875rem] md:text-xs" : "gap-3"} group flex min-w-0 items-center transition-transform duration-200 ease-out hover:translate-x-[2px]`}
                          >
                            <span className={`${dualInline ? "h-4 w-4 sm:h-[18px] sm:w-[18px]" : "h-5 w-5"} inline-flex shrink-0 items-center justify-center`}>
                              <ToolIcon name={tool} size={dualInline ? 16 : 18} />
                            </span>
                            <span
                              className="min-w-0 text-zinc-200 transition-colors duration-200 ease-out"
                              title={tool}
                            >
                              {tool}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                  return (
                    <motion.div
                      key={title}
                      className={columnClass}
                      initial={dualInline ? { opacity: 0, y: 8 } : undefined}
                      animate={dualInline ? { opacity: 1, y: 0 } : undefined}
                      transition={dualInline ? { duration: skillsAnimS(0.28), ease: SKILLS_EASE, delay: skillsAnimS(0.24 + index * 0.045) } : undefined}
                    >
                      {cardInner}
                    </motion.div>
                  );
                })}
                </div>
              </div>
            </div>
          )}
        </div>
        </motion.div>
        <div className="shrink-0" aria-hidden />
        <div className="shrink-0" aria-hidden />
      </motion.div>
    </CardBlackFace>
  </UiverseCard>
  );
};

const SKILLS_TOOLS_CATEGORIES = [
  {
    title: "Design & Productivity",
    items: ["Microsoft Office 365", "Adobe Creative Suite", "Canva", "Procreate", "Cursor"],
  },
  {
    title: "Video & Writing",
    items: ["DaVinci Resolve", "CapCut", "Audacity", "Arc Studio", "OBS Studio"],
  },
  {
    title: "Social Platforms",
    items: ["Hootsuite", "TikTok Creator Tools", "Instagram Reels", "YouTube Shorts", "Twitch"],
  },
];

/** Same rail header pattern as #experience .nav-header (labels + scaleX divider). */
const SkillsBranchRailHeader = ({
  sectionSubtitle,
  sectionTitle,
  align = "left",
  revealDelay,
  panelSettled = false,
  reduceMotion = false,
}: {
  sectionSubtitle: string;
  sectionTitle: string;
  align?: "left" | "right";
  revealDelay: number;
  panelSettled?: boolean;
  reduceMotion?: boolean;
}) => {
  const rm = reduceMotion;
  const labelDuration = SKILLS_SECTION_HEADER_SLIDE_DUR_S;
  // CORE (left) slides right: starts left of target (negative x)
  // TOOLKIT (right) slides left: starts right of target (positive x)
  const labelSlideX = align === "right" ? 28 : -28;

  const labelsEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, x: rm ? 0 : labelSlideX },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: rm ? 0 : revealDelay,
        duration: rm ? 0 : labelDuration,
        ease: SKILLS_SECTION_HEADER_SLIDE_EASE,
        type: "tween",
      },
    },
  };

  const headerEntrance: Variants = {
    hidden: {},
    visible: {},
  };

  const alignClass =
    align === "right" ? "skills-branch-header--right" : "skills-branch-header--left";

  return (
    <motion.div
      className={`skills-branch-header skills-branch-header--page ${alignClass} nav-header w-full min-w-0`}
      variants={headerEntrance}
      initial="hidden"
      animate={panelSettled ? "visible" : "hidden"}
    >
      {/* Title stack is w-fit so the green accent line matches each rail’s own text width. */}
      <div
        className={`skills-branch-header-title-stack w-fit max-w-full ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        <motion.div
          className={`career-nav-section-labels ${
            align === "right" ? "items-end text-right" : "items-start text-left"
          }`}
          variants={labelsEntrance}
        >
          <p className="career-nav-section-subtitle whitespace-nowrap">{sectionSubtitle}</p>
          {sectionTitle ? (
            <p className="career-nav-section-title whitespace-nowrap">{sectionTitle}</p>
          ) : null}
        </motion.div>
        <div className="skills-branch-accent-line relative min-h-[2px] w-full" aria-hidden>
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-portfolio-green"
            style={{
              transformOrigin: align === "right" ? "right center" : "left center",
            }}
            initial={{ scaleX: rm ? 1 : 0 }}
            animate={{ scaleX: rm || panelSettled ? 1 : 0 }}
            transition={{
              duration: rm ? 0 : SKILLS_GREEN_LINE_DUR_S,
              delay: rm ? 0 : revealDelay,
              ease: SKILLS_GREEN_LINE_EASE,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/** Centered SKILLS title + green line — same cadence as CORE / TOOLKIT rail headers. */
const SkillsMainSectionHeader = ({
  revealDelay,
  panelSettled = false,
  reduceMotion = false,
}: {
  revealDelay: number;
  panelSettled?: boolean;
  reduceMotion?: boolean;
}) => {
  const rm = reduceMotion;
  const railLabelDuration = SKILLS_SECTION_HEADER_SLIDE_DUR_S;
  const titleUpY = 10;

  const titleEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, y: rm ? 0 : titleUpY },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: rm ? 0 : revealDelay,
        duration: rm ? 0 : railLabelDuration,
        ease: SKILLS_SECTION_HEADER_SLIDE_EASE,
        type: "tween",
      },
    },
  };

  const headerEntrance: Variants = {
    hidden: {},
    visible: {},
  };

  return (
    <motion.div
      className="skills-header flex w-full shrink-0 flex-col items-center"
      variants={headerEntrance}
      initial="hidden"
      animate={panelSettled ? "visible" : "hidden"}
    >
      <motion.div
        className="mx-auto inline-flex w-fit max-w-full flex-col items-stretch"
        variants={titleEntrance}
      >
        <div
          className={`flex flex-col items-center text-center relative z-10 ${SECTION_SKILLS_MAIN_HEADER_TITLE_CLASS}`}
        >
          <h2 className="section-main-header-title font-display text-white leading-[0.95] -translate-y-0.5">
            <span>SKILLS</span>
          </h2>
        </div>
        <div
          className="skills-main-accent-line relative mb-6 min-h-[2px] w-full sm:mb-8 md:mb-10"
          aria-hidden
        >
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-portfolio-green"
            style={{ transformOrigin: "center center" }}
            initial={{ scaleX: rm ? 1 : 0 }}
            animate={{ scaleX: rm || panelSettled ? 1 : 0 }}
            transition={{
              duration: rm ? 0 : SKILLS_GREEN_LINE_DUR_S,
              delay: rm ? 0 : revealDelay,
              ease: SKILLS_GREEN_LINE_EASE,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

/** Card column title + underline + list — after empty shell slide; mirrors experience rail + tab cadence. */
const SkillsCardInnerContent = ({
  categoryTitle,
  tabletPortraitTitle,
  align,
  panelSettled,
  reduceMotion,
  contentBaseDelay,
  bulletsRevealDelay,
  bullets,
}: {
  categoryTitle: string;
  tabletPortraitTitle?: string;
  align: "left" | "right";
  panelSettled: boolean;
  reduceMotion: boolean;
  contentBaseDelay: number;
  bulletsRevealDelay: number;
  bullets: { key: string; label: string; icon: React.ReactNode }[];
}) => {
  const rm = reduceMotion;
  const cardHeaderUpY = 10;
  const cardHeaderDur = SKILLS_SECTION_HEADER_SLIDE_DUR_S;
  const cardBulletStagger = skillsEntranceS(0.034);
  const cardBulletUpY = 8;
  const cardBulletsDelayChildren = Math.max(0, bulletsRevealDelay - contentBaseDelay);

  const innerRoot: Variants = {
    hidden: { opacity: rm ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: rm ? 0 : contentBaseDelay },
    },
  };
  const cardHeaderEntrance: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0 } },
  };
  const cardTitleEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, y: rm ? 0 : cardHeaderUpY },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: rm ? 0 : cardHeaderDur, ease: SKILLS_SECTION_HEADER_SLIDE_EASE, type: "tween" },
    },
  };
  const cardBulletsEntrance: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: rm ? 0 : cardBulletsDelayChildren,
        staggerChildren: rm ? 0 : cardBulletStagger,
      },
    },
  };
  const cardBulletItemEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, y: rm ? 0 : cardBulletUpY },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: rm ? 0 : skillsAnimS(0.22),
        ease: [0.22, 1, 0.36, 1],
        type: "tween",
      },
    },
  };

  return (
    <motion.div
      className="flex min-h-0 w-full flex-1 flex-col"
      variants={innerRoot}
      initial="hidden"
      animate={panelSettled ? "visible" : "hidden"}
    >
      <motion.div className="skills-card-column-header w-full shrink-0" variants={cardHeaderEntrance}>
        <motion.p
          variants={cardTitleEntrance}
          className={`skills-subcategory-column-title w-full text-center font-heading font-semibold uppercase !text-zinc-100${
            tabletPortraitTitle ? " skills-card-title--has-tablet-portrait" : ""
          }`}
          title={categoryTitle}
        >
          <span className="skills-card-title-default">{categoryTitle}</span>
          {tabletPortraitTitle ? (
            <span className="skills-card-title-tablet-portrait" aria-hidden="true">
              {tabletPortraitTitle}
            </span>
          ) : null}
        </motion.p>
        <motion.span
          className="skills-card-column-header__line block h-px w-full bg-white/[0.06]"
          style={{
            transformOrigin: align === "right" ? "right center" : "left center",
          }}
          initial={{ scaleX: rm ? 1 : 0 }}
          animate={{ scaleX: rm || panelSettled ? 1 : 0 }}
          transition={{
            duration: rm ? 0 : SKILLS_GREEN_LINE_DUR_S,
            delay: rm ? 0 : bulletsRevealDelay,
            ease: SKILLS_GREEN_LINE_EASE,
          }}
          aria-hidden
        />
      </motion.div>
      <motion.ul className="skills-page-card-list" variants={cardBulletsEntrance}>
        {bullets.map(({ key, label, icon }) => (
          <motion.li
            key={key}
            variants={cardBulletItemEntrance}
            className="skills-page-card-row flex min-w-0 transform-gpu items-start text-zinc-200"
          >
            <span className="skills-page-card-icon inline-flex shrink-0 items-center justify-center">
              {icon}
            </span>
            <span className="min-w-0">{label}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

const SkillArsenal = ({
  panelSettled = false,
  reduceMotion = false,
}: {
  panelSettled?: boolean;
  reduceMotion?: boolean | null;
}) => {
  const rm = !!reduceMotion;
  const skillsCardSlideDur = skillsEntranceS(EXPERIENCE_TAB_ENTRANCE_DUR_S);
  const skillsCardStagger = skillsEntranceS(EXPERIENCE_TAB_STAGGER_S);
  const skillsCardSlideX = PROFILE_PILL_SLIDE_X;
  const skillsRowCardsEnd = (rowStart: number, count: number) =>
    rowStart + skillsCardSlideDur + (count - 1) * skillsCardStagger;

  // Shells → main SKILLS title + rail + in-card headers together → bullets after column headers
  const CARD_ROW_BASE = skillsEntranceS(0.034);
  const skillsCardCount = CORE_SUBSKILLS_CATEGORIES.length;
  const toolsCardCount = SKILLS_TOOLS_CATEGORIES.length;
  const coreCardsRowEnd = skillsRowCardsEnd(CARD_ROW_BASE, skillsCardCount);
  const coreRowSpan = coreCardsRowEnd - CARD_ROW_BASE;
  const TOOLS_CARD_ROW_BASE = CARD_ROW_BASE + coreRowSpan * SKILLS_ROW2_START_OVERLAP;
  const cardsRowEnd = skillsRowCardsEnd(TOOLS_CARD_ROW_BASE, toolsCardCount);
  /** In-card column headers run with CORE / TOOLKIT rail headers; bullets keep their inner tail. */
  const CARD_INNER_BASE_DELAY = cardsRowEnd;
  const cardHeaderDur = skillsEntranceS(EXPERIENCE_RAIL_LABEL_DUR_S);
  const cardLineDur = skillsEntranceS(EXPERIENCE_RAIL_LINE_DUR_S);
  const cardHeaderEnd = Math.max(cardHeaderDur, cardLineDur);
  /** Main + CORE / TOOLKIT rail labels/lines — same t0 as in-card bullet reveal. */
  const skillsBulletsRevealDelay =
    cardsRowEnd + cardHeaderEnd * SKILLS_CARD_BULLETS_HEADER_OVERLAP;

  const skillsSectionRef = useRef<HTMLElement>(null);

  /** WebKit mobile/tablet: grid overlay must track section + panel scroller (iPad landscape >1024px included). */
  useLayoutEffect(() => {
    const section = skillsSectionRef.current;
    if (!section) return;
    return bindSectionGridOverlayHeightSync(section, "--skills-grid-overlay-height");
  }, [panelSettled]);

  const skillsCardRowEntrance = (rowDelay: number, reverse = false): Variants => ({
    hidden: {},
    visible: {
      transition: {
        delayChildren: rm ? 0 : rowDelay,
        staggerChildren: rm ? 0 : skillsCardStagger,
        ...(reverse && !rm ? { staggerDirection: -1 } : {}),
      },
    },
  });

  const skillsCoreCardItemEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, y: rm ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: rm ? 0 : skillsCardSlideDur,
        ease: EASE.out,
      },
    },
  };
  const skillsToolsCardItemEntrance: Variants = {
    hidden: { opacity: rm ? 1 : 0, y: rm ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: rm ? 0 : skillsCardSlideDur,
        ease: EASE.out,
      },
    },
  };

  return (
    <section
      ref={skillsSectionRef}
      id="skills"
      className={`no-scrollbar relative flex min-h-full max-lg:min-h-full w-full min-w-0 flex-col justify-start overflow-x-hidden overflow-y-visible bg-black text-white scroll-mt-6 max-md:min-h-max ${SECTION_MAIN_HEADER_INSET} pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-8 md:pb-10`}
    >
      <SectionGridOverlay />
      <motion.div
        className="container relative z-10 mx-auto flex min-h-0 min-w-0 w-full max-w-full flex-1 max-md:flex-none flex-col justify-start px-5 sm:px-6"
        style={
          SKILLS_LAYOUT.sectionOffsetRem !== 0
            ? { transform: `translateY(${SKILLS_LAYOUT.sectionOffsetRem}rem)` }
            : undefined
        }
      >
        <div className={EXPERIENCE_GUTTER_SHELL_OUTER}>
          <div className={`${EXPERIENCE_GUTTER_SHELL_INNER} ${PROFILE_VIEWPORT_CONTENT_MAX} skills-profile-shell relative z-[2] mx-auto flex min-h-0 w-full flex-1 max-md:flex-none flex-col justify-start`}>
          <SkillsMainSectionHeader
            revealDelay={skillsBulletsRevealDelay}
            panelSettled={panelSettled}
            reduceMotion={rm}
          />

          <motion.div className="skills-page-layout flex min-h-0 w-full min-w-0 flex-1 max-md:flex-none flex-col justify-start">
            <motion.div className="skills-page-grid flex min-h-0 w-full flex-1 max-md:flex-none flex-col justify-start">

              {/* Cards first, then CORE rail header */}
              <div className="skills-page-band skills-page-band--core w-full min-w-0">
                <SkillsBranchRailHeader
                  align="left"
                  sectionSubtitle={SKILLS_DATA.core.title}
                  sectionTitle={SKILLS_DATA.core.subtitle}
                  revealDelay={skillsBulletsRevealDelay}
                  panelSettled={panelSettled}
                  reduceMotion={rm}
                />

                <motion.div
                  className="skills-row-cards skills-row-cards--page grid w-full grid-cols-1 md:grid-cols-3"
                  variants={skillsCardRowEntrance(CARD_ROW_BASE)}
                  initial="hidden"
                  animate={panelSettled || rm ? "visible" : "hidden"}
                >
                  {CORE_SUBSKILLS_CATEGORIES.map(({ categoryTitle, tabletPortraitTitle, items }) => (
                    <motion.div
                      key={categoryTitle}
                      className="skills-row-card-slot transform-gpu"
                      variants={skillsCoreCardItemEntrance}
                    >
                      <div className="skills-card-surface skills-card-surface--page h-full border border-white/[0.09]">
                        <SkillsCardInnerContent
                          categoryTitle={categoryTitle}
                          tabletPortraitTitle={tabletPortraitTitle}
                          align="left"
                          panelSettled={panelSettled}
                          reduceMotion={rm}
                          contentBaseDelay={CARD_INNER_BASE_DELAY}
                          bulletsRevealDelay={skillsBulletsRevealDelay}
                          bullets={items.map(({ label, Icon }) => ({
                            key: label,
                            label,
                            icon: <Icon size={15} className="text-portfolio-green" />,
                          }))}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* TOOLKIT band — row 2 cards after row 1; rail header with CORE */}
              <div className="skills-page-band skills-page-band--tools w-full min-w-0">
                <SkillsBranchRailHeader
                  align="right"
                  sectionSubtitle={SKILLS_DATA.tools.title}
                  sectionTitle={SKILLS_DATA.tools.subtitle}
                  revealDelay={skillsBulletsRevealDelay}
                  panelSettled={panelSettled}
                  reduceMotion={rm}
                />

                <motion.div
                  className="skills-row-cards skills-row-cards--page grid w-full grid-cols-1 md:grid-cols-3"
                  variants={skillsCardRowEntrance(TOOLS_CARD_ROW_BASE, true)}
                  initial="hidden"
                  animate={panelSettled || rm ? "visible" : "hidden"}
                >
                  {SKILLS_TOOLS_CATEGORIES.map(({ title, items }) => (
                    <motion.div
                      key={title}
                      className="skills-row-card-slot transform-gpu"
                      variants={skillsToolsCardItemEntrance}
                    >
                      <div className="skills-card-surface skills-card-surface--page h-full border border-white/[0.09]">
                        <SkillsCardInnerContent
                          categoryTitle={title}
                          align="right"
                          panelSettled={panelSettled}
                          reduceMotion={rm}
                          contentBaseDelay={CARD_INNER_BASE_DELAY}
                          bulletsRevealDelay={skillsBulletsRevealDelay}
                          bullets={items.map((tool) => ({
                            key: tool,
                            label: tool,
                            icon: <ToolIcon name={tool} size={15} />,
                          }))}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

            </motion.div>
          </motion.div>
          </div>
        </div>
      </motion.div>
      <div className={SECTION_TABLET_BOTTOM_SPACER} aria-hidden />
    </section>
  );
};

// --- RESUME COMPONENT ---
const ResumeView = () => {
  return (
    <div className="bg-white min-h-screen text-black font-sans p-8 md:p-16 max-w-5xl mx-auto selection:bg-gray-200 selection:text-black">
      {/* Header */}
      <header className="border-b-2 border-black pb-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">Robbie McLaughlin</h1>
        <p className="text-xl text-gray-700 mb-4">Writer ? Digital Media Coordinator ? Content Creator</p>
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
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Profile</h2>
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
            <span className="text-gray-600 font-medium">2018 ? Present</span>
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

      {/* Community */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Community</h2>
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
  const ruleOfThirdsEnabled = useRuleOfThirdsEnabled();
  // Content mask: keeps main content invisible until after first paint so the
  // background (black) is the only thing visible during JS hydration. No artificial
  // delay ? the state flips on the first effect run (immediately after mount).
  const [appReady, setAppReady] = useState(false);
  useEffect(() => { setAppReady(true); }, []);

  const [isResumeMode, setIsResumeMode] = useState(false);
  const [showSideNavExitDebugPanel, setShowSideNavExitDebugPanel] = useState(false);
  const [showTopNavBackDebugPanel, setShowTopNavBackDebugPanel] = useState(false);
  const [sideNavExitButtonDebug, setSideNavExitButtonDebug] = useState<NavIconButtonDebugValues>(
    SIDE_NAV_EXIT_BUTTON_DEBUG_DEFAULTS,
  );
  const [topNavBackButtonDebug, setTopNavBackButtonDebug] = useState<NavIconButtonDebugValues>(
    TOP_NAV_BACK_BUTTON_DEBUG_DEFAULTS,
  );
  const [archivePdfNavActive, setArchivePdfNavActive] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<string | "menu" | null>(null);
  const [menuPanelAtRight, setMenuPanelAtRight] = useState(false);
  const [panelSettled, setPanelSettled] = useState(false);
  /** Side-nav SKILLS re-click: snap hidden, then fade in only (no animated fade-out). */
  const [skillsContentFade, setSkillsContentFade] = useState<
    "visible" | "hide-instant" | "fade-in"
  >("visible");
  const skillsFadeReplayRafRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const heroInViewRef = useRef<HTMLDivElement | null>(null);
  const isHeroInView = useInView(heroInViewRef, { margin: "-100px 0px 0px 0px" });
  const slidesRef = useRef<HTMLDivElement | null>(null);

  /** Section overlay scroller — shared across pages; must reset on section change. */
  const sectionPanelRef = useRef<HTMLDivElement | null>(null);
  const slideOrder = ["hero", "menu"];
  const [currentSlideId, setCurrentSlideId] = useState<string>("hero");
  const [menuIntroReady, setMenuIntroReady] = useState(false);
  const [profileSectionMounted, setProfileSectionMounted] = useState(false);
  const [menuLockedFillId, setMenuLockedFillId] = useState<string | null>(null);
  const [activeShowcaseProjectId, setActiveShowcaseProjectId] = useState<string | null>(null);
  const slaywireShowcaseDetailOpen =
    currentSection === "projects" && activeShowcaseProjectId === "project-slaywire";
  /** Showcase 4-up hover scale needs X room; keep X clipped for most project details. */
  const projectsPanelOverflowX =
    currentSection === "projects" &&
    (!activeShowcaseProjectId || slaywireShowcaseDetailOpen)
      ? "overflow-x-visible"
      : "overflow-x-hidden";
  const [projectsEntranceArmed, setProjectsEntranceArmed] = useState(false);
  /**
   * AnimatePresence opacity exit is only for projects ↔ projects-supporting.
   * Leaving SHOWCASE for another section must not fade (that fade under a closing
   * side-nav is the PROJECTS-only flicker).
   */
  const [showcaseSubrouteExitFade, setShowcaseSubrouteExitFade] = useState(true);
  /** Side-nav leave from PROJECTS only: CSS-hide showcase content before nav fade. */
  const [projectsSideNavLeaveHidden, setProjectsSideNavLeaveHidden] = useState(false);
  /** Section→PROFILE (side-nav / in-panel swap): fade RAWBLEM with settle; not menu→PROFILE. */
  const [profileMascotSettleFade, setProfileMascotSettleFade] = useState(false);
  /** FEATURED WRITING ? PDF overlay on PROJECTS (same dismiss feel as closing side nav). */
  const [showcasePdfOverlay, setShowcasePdfOverlay] = useState<SupportingArchivePdfItem | null>(null);
  const [showcasePdfObscuring, setShowcasePdfObscuring] = useState(false);
  const [showcasePdfClosing, setShowcasePdfClosing] = useState(false);
  const [showcasePdfFrame, setShowcasePdfFrame] = useState(false);
  const showcasePdfCloseFinishRef = useRef(false);
  const showcasePdfCloseTimerRef = useRef<number | null>(null);
  const showcasePdfObscureTimerRef = useRef<number | null>(null);
  const supportingPdfPreviewControlRef = useRef<SupportingPdfPreviewControl | null>(null);
  const showcasePdfPreviewControlRef = useRef<SupportingPdfPreviewControl | null>(null);
  const navButtonsFaded =
    archivePdfNavActive || Boolean(showcasePdfOverlay) || showcasePdfClosing || showcasePdfObscuring;
  const showcasePdfViewerActive =
    showcasePdfObscuring || Boolean(showcasePdfOverlay) || showcasePdfClosing;
  const prevSlideIdRef = useRef<string>("hero");
  const transitionTimeoutsRef = useRef<number[]>([]);
  const hasWarmedProjectMediaRef = useRef(false);
  const projectMediaWarmupRef = useRef<HTMLImageElement[]>([]);
  const isProjectsPage =
    currentSection === "projects" ||
    currentSection === "projects-supporting" ||
    !!currentSection?.startsWith("project-");

  /**
   * Warm SHOWCASE stills only (thumbnails + posters + mascot).
   * Never create hidden `<video preload="auto">` elements on load on Mobile Safari.
   */
  useEffect(() => {
    if (hasWarmedProjectMediaRef.current) return;
    hasWarmedProjectMediaRef.current = true;

    const timer = window.setTimeout(() => {
      const handles: HTMLImageElement[] = [];

      const profileMascotImg = new Image();
      profileMascotImg.decoding = "async";
      profileMascotImg.src = "/rawblem3.svg";
      handles.push(profileMascotImg);

      PROJECT_CARDS.forEach((card) => {
        if (card.thumbnail) {
          const img = new Image();
          img.decoding = "async";
          img.src = card.thumbnail;
          handles.push(img);
        }

        // Poster for flying-card morph — still only, no video buffer.
        if (card.poster) {
          const img = new Image();
          img.decoding = "async";
          img.src = card.poster;
          handles.push(img);
        }
      });

      projectMediaWarmupRef.current = handles;
    }, PROJECT_MEDIA_WARMUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentSection !== "projects") {
      setActiveShowcaseProjectId(null);
    }
  }, [currentSection]);

  /** Clear panel scroll when switching pages so the next section opens at the top (mobile retains scrollTop otherwise). */
  useLayoutEffect(() => {
    if (!currentSection) return;
    const panel = sectionPanelRef.current;
    if (panel) panel.scrollTop = 0;
  }, [currentSection]);

  useEffect(() => {
    if (currentSection !== "skills") setSkillsContentFade("visible");
  }, [currentSection]);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      const tag = target.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === "l") {
        event.preventDefault();
        setShowSideNavExitDebugPanel((value) => !value);
        return;
      }
      if (key === "b") {
        event.preventDefault();
        setShowTopNavBackDebugPanel((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (skillsFadeReplayRafRef.current != null) {
        cancelAnimationFrame(skillsFadeReplayRafRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    const root = slidesRef.current;
    const menuEl = document.getElementById("menu");
    if (root && menuEl) {
      root.scrollTo({ left: menuEl.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    scrollToId("menu", reduceMotion ? "auto" : "smooth");
  };

  const navigateTo = (id: string) => {
    const fromShowcase =
      currentSection === "projects" || currentSection === "projects-supporting";
    const toShowcase = id === "projects" || id === "projects-supporting";
    // Exit fade must commit while PROJECTS is still mounted; otherwise AnimatePresence
    // keeps the previous exit={{ opacity: 0 }} and flickers under the closing side-nav.
    if (fromShowcase && !toShowcase) {
      flushSync(() => setShowcaseSubrouteExitFade(false));
    } else if (toShowcase) {
      setShowcaseSubrouteExitFade(true);
    }
    // Side-nav leave PROJECTS: hide content before the nav overlay starts fading.
    if (
      isSideNavOpen &&
      currentSection === "projects" &&
      id !== "projects" &&
      id !== "projects-supporting"
    ) {
      flushSync(() => setProjectsSideNavLeaveHidden(true));
    } else if (id === "projects") {
      setProjectsSideNavLeaveHidden(false);
    }
    // Only section→PROFILE handoffs fade the mascot; menu→PROFILE keeps existing path.
    setProfileMascotSettleFade(
      id === "profile" && currentSection !== null && currentSection !== "profile",
    );
    setIsSideNavOpen(false);
    if (id !== "projects" && (showcasePdfOverlay || showcasePdfClosing || showcasePdfObscuring)) {
      if (showcasePdfObscureTimerRef.current !== null) {
        window.clearTimeout(showcasePdfObscureTimerRef.current);
        showcasePdfObscureTimerRef.current = null;
      }
      showcasePdfCloseFinishRef.current = false;
      if (showcasePdfCloseTimerRef.current !== null) {
        window.clearTimeout(showcasePdfCloseTimerRef.current);
        showcasePdfCloseTimerRef.current = null;
      }
      setShowcasePdfObscuring(false);
      setShowcasePdfOverlay(null);
      setShowcasePdfClosing(false);
      setShowcasePdfFrame(false);
    }
    if (isTransitioning) return;

    // SHOWCASE sub-route: swap carousel ? Supporting & archive in place (no panel slide / settle reset).
    if (
      (id === "projects" && currentSection === "projects-supporting") ||
      (id === "projects-supporting" && currentSection === "projects")
    ) {
      transitionTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
      transitionTimeoutsRef.current = [];
      if (id === "projects") setProjectsEntranceArmed(true);
      setCurrentSection(id);
      return;
    }

    // Already on SHOWCASE: close project detail or no-op ? do not replay panel slide (avoids layout flash).
    if (id === "projects" && currentSection === "projects") {
      if (activeShowcaseProjectId) {
        setActiveShowcaseProjectId(null);
      }
      return;
    }

    // Already on SKILLS: fade in only — snap hidden, then opacity up (SkillArsenal stays mounted).
    if (id === "skills" && currentSection === "skills") {
      transitionTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
      transitionTimeoutsRef.current = [];
      if (!reduceMotion) {
        if (skillsFadeReplayRafRef.current != null) {
          cancelAnimationFrame(skillsFadeReplayRafRef.current);
        }
        setSkillsContentFade("hide-instant");
        skillsFadeReplayRafRef.current = requestAnimationFrame(() => {
          skillsFadeReplayRafRef.current = null;
          setSkillsContentFade("fade-in");
        });
      }
      return;
    }

    // Already on EXPERIENCE: no-op (keep desktop behavior consistent across browsers).
    if (id === "experience" && currentSection === "experience") {
      transitionTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
      transitionTimeoutsRef.current = [];
      return;
    }

    if (reduceMotion) {
      setProjectsEntranceArmed(id === "projects");
      setCurrentSection(id === "menu" ? null : id);
      if (id === "menu") setMenuLockedFillId(null);
      startTransition(() => setPanelSettled(true));
      return;
    }

    transitionTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
    transitionTimeoutsRef.current = [];
    setProjectsEntranceArmed(false);

    if (id === "menu") {
      // Clear before the panel exits so main-menu icons are outline as the menu is revealed.
      setMenuLockedFillId(null);
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
      // SHOWCASE (projects): settle immediately so carousel + tabs reserve height and fade with the panel — delayed settle caused a second layout/opacity beat after the slide.
      setPanelSettled(id === "projects");
      setCurrentSection(id);
      setTransitionTarget(id);
      setIsTransitioning(true);
      if (id === "projects") {
        transitionTimeoutsRef.current.push(
          window.setTimeout(
            () => setProjectsEntranceArmed(true),
            Math.max(0, (PANEL_TRANSITION.duration - PROJECTS_PANEL_ENTRANCE_LEAD_S) * 1000),
          ),
        );
      }
      transitionTimeoutsRef.current.push(
        window.setTimeout(() => {
          setIsTransitioning(false);
          setTransitionTarget(null);
          startTransition(() => {
            if (id !== "projects") setPanelSettled(true);
          });
        }, PANEL_TRANSITION.duration * 1000 + CONTENT_SETTLE_DELAY * 1000)
      );
    }
  };

  const finishShowcasePdfClose = useCallback(() => {
    if (showcasePdfCloseFinishRef.current) return;
    showcasePdfCloseFinishRef.current = true;
    if (showcasePdfCloseTimerRef.current !== null) {
      window.clearTimeout(showcasePdfCloseTimerRef.current);
      showcasePdfCloseTimerRef.current = null;
    }
    if (showcasePdfObscureTimerRef.current !== null) {
      window.clearTimeout(showcasePdfObscureTimerRef.current);
      showcasePdfObscureTimerRef.current = null;
    }
    setShowcasePdfObscuring(false);
    setShowcasePdfOverlay(null);
    setShowcasePdfClosing(false);
    setShowcasePdfFrame(false);
  }, []);

  const cancelShowcasePdfReveal = useCallback(() => {
    if (showcasePdfObscureTimerRef.current !== null) {
      window.clearTimeout(showcasePdfObscureTimerRef.current);
      showcasePdfObscureTimerRef.current = null;
    }
    setShowcasePdfObscuring(false);
  }, []);

  const closeShowcasePdfOverlay = useCallback(() => {
    if (!showcasePdfOverlay || showcasePdfClosing) return;
    showcasePdfCloseFinishRef.current = false;
    if (reduceMotion) {
      finishShowcasePdfClose();
      return;
    }
    setShowcasePdfClosing(true);
    showcasePdfCloseTimerRef.current = window.setTimeout(() => {
      finishShowcasePdfClose();
      showcasePdfCloseTimerRef.current = null;
    }, Math.round(SHOWCASE_PDF_OVERLAY_CLOSE_S * 1000) + 48);
  }, [finishShowcasePdfClose, reduceMotion, showcasePdfClosing, showcasePdfOverlay]);

  const openFeaturedPdfInSupporting = (item: SupportingArchivePdfItem) => {
    if (currentSection !== "projects") {
      navigateTo("projects");
    }
    showcasePdfCloseFinishRef.current = false;
    setShowcasePdfClosing(false);
    setShowcasePdfFrame(false);
    setShowcasePdfOverlay(null);
    if (showcasePdfObscureTimerRef.current !== null) {
      window.clearTimeout(showcasePdfObscureTimerRef.current);
      showcasePdfObscureTimerRef.current = null;
    }
    setShowcasePdfObscuring(true);
    const revealDelayMs = reduceMotion ? 0 : Math.round(SHOWCASE_PDF_PROJECTS_FADE_OUT_S * 1000);
    showcasePdfObscureTimerRef.current = window.setTimeout(() => {
      setShowcasePdfOverlay(item);
      setShowcasePdfObscuring(false);
      showcasePdfObscureTimerRef.current = null;
    }, revealDelayMs);
  };

  useEffect(() => {
    if (!showcasePdfOverlay) {
      setShowcasePdfFrame(false);
    }
  }, [showcasePdfOverlay]);

  useEffect(() => {
    if (!showcasePdfOverlay) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeShowcasePdfOverlay();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeShowcasePdfOverlay, showcasePdfOverlay]);

  useEffect(() => {
    if (!showcasePdfOverlay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showcasePdfOverlay]);

  useEffect(() => {
    showcasePdfPreviewControlRef.current =
      showcasePdfOverlay || showcasePdfClosing || showcasePdfObscuring
        ? {
            close: showcasePdfObscuring ? cancelShowcasePdfReveal : closeShowcasePdfOverlay,
            isOpen: true,
          }
        : null;
    return () => {
      showcasePdfPreviewControlRef.current = null;
    };
  }, [
    cancelShowcasePdfReveal,
    closeShowcasePdfOverlay,
    showcasePdfClosing,
    showcasePdfObscuring,
    showcasePdfOverlay,
  ]);

  useEffect(
    () => () => {
      if (showcasePdfCloseTimerRef.current !== null) {
        window.clearTimeout(showcasePdfCloseTimerRef.current);
        showcasePdfCloseTimerRef.current = null;
      }
      if (showcasePdfObscureTimerRef.current !== null) {
        window.clearTimeout(showcasePdfObscureTimerRef.current);
        showcasePdfObscureTimerRef.current = null;
      }
    },
    [],
  );
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

  useEffect(() => {
    if (currentSection === null) setMenuLockedFillId(null);
  }, [currentSection]);

  useEffect(() => {
    if (currentSlideId !== "menu") {
      setMenuIntroReady(false);
      return;
    }
    if (reduceMotion) {
      setMenuIntroReady(true);
      return;
    }
    const id = window.setTimeout(
      () => setMenuIntroReady(true),
      Math.max(0, Math.round(PANEL_TRANSITION.duration * 1000) - 350),
    );
    return () => window.clearTimeout(id);
  }, [currentSlideId, reduceMotion]);

  useEffect(() => {
    if (!menuIntroReady || !matchesProfileTabletViewport()) return;
    setProfileSectionMounted(true);
  }, [menuIntroReady]);

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
    <div
      className={`selection:bg-portfolio-blue selection:text-white transition-colors duration-500 ${
        isResumeMode ? "min-h-screen overflow-x-hidden bg-white" : "h-screen w-screen overflow-hidden"
      }`}
      style={{
        ...(!isResumeMode ? { backgroundColor: "#0a0a0a", backgroundImage: "none" } : {}),
        // Instant reveal ? avoids a live transition on the root element that can
        // be retriggered by React Strict Mode's double-mount in development.
        opacity: appReady ? 1 : 0,
      }}
    >
      {/* Top-right controls (Resume + Hamburger) */}
      <motion.div
        className={`fixed ${TOP_NAV_FIXED_TOP} right-2.5 sm:right-4 z-50 flex items-center gap-1.5 sm:gap-2.5`}
        initial={false}
        animate={{
          opacity: navButtonsFaded ? 0 : 1,
          y: 0,
          scale: 1,
        }}
        transition={SPRING.ui}
      >
        {!(currentSlideId === "hero" && currentSection === null && !isResumeMode) && (
          <motion.div
            layoutId="resume-button"
            whileTap={TAP}
            transition={SPRING.tap}
          >
            <Button
              variant="ghost"
              onClick={() => setIsResumeMode(!isResumeMode)}
              size="icon"
              aria-label={isResumeMode ? "Exit resume mode" : "Enter resume mode"}
              className={`${TOP_NAV_ICON_BUTTON_CLASS} font-display flex items-center justify-center [&_svg]:!size-[17px] sm:[&_svg]:!size-5`}
            >
              {isResumeMode ? <Zap size={20} /> : <FileText size={20} />}
            </Button>
          </motion.div>
        )}

        {!isResumeMode && !(currentSlideId === "hero" && currentSection === null) && (currentSlideId !== "menu" || currentSection !== null) && (
          <motion.div whileTap={TAP} transition={SPRING.tap}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSideNavOpen(true)}
              size="icon"
              aria-label="Open navigation menu"
              className={`${TOP_NAV_ICON_BUTTON_CLASS} font-display flex items-center justify-center [&_svg]:!size-[17px] sm:[&_svg]:!size-5`}
            >
              <Menu size={20} aria-hidden />
            </Button>
          </motion.div>
        )}
      </motion.div>

      {!isResumeMode && (
        <SideNavOverlay
          open={isSideNavOpen}
          onClose={() => setIsSideNavOpen(false)}
          onNavigate={navigateTo}
          currentSection={currentSection}
          exitButtonDebug={sideNavExitButtonDebug}
        />
      )}

      {showSideNavExitDebugPanel ? (
        <NavIconButtonDebugPanel
          title="Side Nav Exit Debug (L)"
          values={sideNavExitButtonDebug}
          onChange={(patch) => setSideNavExitButtonDebug((current) => ({ ...current, ...patch }))}
          onReset={() => setSideNavExitButtonDebug(SIDE_NAV_EXIT_BUTTON_DEBUG_DEFAULTS)}
        />
      ) : null}

      {showTopNavBackDebugPanel ? (
        <NavIconButtonDebugPanel
          title="Top Nav Back Debug (B)"
          values={topNavBackButtonDebug}
          onChange={(patch) => setTopNavBackButtonDebug((current) => ({ ...current, ...patch }))}
          onReset={() => setTopNavBackButtonDebug(TOP_NAV_BACK_BUTTON_DEBUG_DEFAULTS)}
          initialPanelPosition={{ x: 12, y: 200 }}
          unlimitedOffsetX
          showIconSize
        />
      ) : null}

      {/* Back to menu ? above panels so it stays clickable when viewing a section */}
      {!isResumeMode && (
        <BackToMenuButton
          show={currentSection !== null && !isSideNavOpen}
          fadeOut={navButtonsFaded}
          buttonDebug={topNavBackButtonDebug}
          debugActive={showTopNavBackDebugPanel}
          ariaLabel={
            currentSection === "projects" && activeShowcaseProjectId
              ? "Back to showcase"
              : currentSection === "projects-supporting"
                ? "Back to showcase"
                : "Back to menu"
          }
          onBack={() => {
            if (currentSection === "projects") {
              const showcasePdf = showcasePdfPreviewControlRef.current;
              if (showcasePdf?.isOpen) {
                showcasePdf.close();
                return;
              }
              if (activeShowcaseProjectId) {
                setActiveShowcaseProjectId(null);
                return;
              }
            }
            if (currentSection === "projects-supporting") {
              const pdfControl = supportingPdfPreviewControlRef.current;
              if (pdfControl?.isOpen) {
                pdfControl.close();
                return;
              }
              navigateTo("projects");
              return;
            }
            navigateTo("menu");
          }}
        />
      )}

      {/* Interaction lock during panel transition */}
      {!isResumeMode && isTransitioning && (
        <div className="fixed inset-0 z-[70] pointer-events-auto" aria-hidden />
      )}

      {/* Rule-of-thirds overlay on viewport (positioning aid) */}
      {ruleOfThirdsEnabled && <ViewportRuleOfThirdsOverlay aria-hidden />}

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
                !reduceMotion && !isProjectsPage && (currentSection || transitionTarget) && transitionTarget !== "menu"
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
            {/* Grid backdrop: fills any gaps between slides (e.g. 100svh hero vs 100vh container on iOS) */}
            <SectionGridOverlay />
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
              onQuickProjects={() => navigateTo("projects")}
              isResumeMode={isResumeMode}
              toggleResumeMode={() => setIsResumeMode(!isResumeMode)}
              heroInViewRef={heroInViewRef}
              active={currentSlideId === "hero"}
            />
            <RainbowMenuSlide
              active={currentSlideId === "menu"}
              introReady={menuIntroReady}
              sectionPanelClosed={currentSection === null}
              onNavigate={navigateFromMenu}
              lockedFillId={menuLockedFillId}
            />
          </div>
          </motion.div>

          {/* Section panel: layered black, accent edge when incoming, content settle */}
          {currentSection && (
            <motion.div
              ref={sectionPanelRef}
              className={`fixed inset-0 flex min-h-0 flex-col no-scrollbar ${
                currentSection === "projects"
                  ? `${projectsPanelOverflowX} overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0`
                  : currentSection === "projects-supporting"
                    ? "overflow-x-hidden overflow-y-hidden"
                    : currentSection === "experience"
                      ? "overflow-x-hidden overflow-y-auto overscroll-y-contain no-scrollbar [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
                    : "overflow-x-hidden overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
              }`}
              style={{
                backgroundColor: "#000",
                zIndex: currentSection ? 40 : 30,
                pointerEvents: transitionTarget === "menu" ? "none" : "auto",
                // Dropping will-change after settle avoids Chromium keeping section text on a blurry GPU layer.
                // iOS: keep transform layer while panel is open — dropping at panelSettled blanks content/grid on iPad.
                willChange:
                  isTransitioning ||
                  !panelSettled ||
                  (IS_IOS_TOUCH &&
                    (currentSection === "experience" ||
                      currentSection === "projects" ||
                      currentSection === "skills"))
                    ? "transform"
                    : "auto",
                ...(currentSection === "projects-supporting"
                  ? {}
                  : { scrollbarWidth: "none", msOverflowStyle: "none" }),
              }}
              aria-label={`Section: ${currentSection}`}
              initial={
                !reduceMotion && transitionTarget && transitionTarget !== "menu"
                  ? { x: "100%" }
                  : false
              }
              animate={{
                x: reduceMotion
                  ? "0%"
                  : transitionTarget === "menu"
                    ? "100%"
                    : "0%",
              }}
              transition={{
                duration: reduceMotion ? 0.2 : PANEL_TRANSITION.duration,
                ease: PANEL_TRANSITION.ease,
              }}
            >
              {/* Grid backdrop: ensures the panel background always has grid texture regardless of section coverage */}
              <SectionGridOverlay />
              {!reduceMotion && transitionTarget !== "menu" && transitionTarget === currentSection && (
                <div
                  className="absolute left-0 top-0 bottom-0 z-20 w-[2px] pointer-events-none"
                  style={{
                    backgroundColor: sectionPanelEdgeAccent(currentSection),
                    boxShadow: accentGlowShadow(sectionPanelEdgeAccent(currentSection), true),
                  }}
                  aria-hidden
                />
              )}
              {!reduceMotion && transitionTarget === "menu" && (
                <motion.div
                  className="absolute top-0 bottom-0 z-20 w-[2px] pointer-events-none"
                  style={{
                    backgroundColor: sectionPanelEdgeAccent(currentSection),
                    transform: "translateX(-2px)",
                    boxShadow: accentGlowShadow(sectionPanelEdgeAccent(currentSection), true),
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
              {/* Plain wrapper: nested Framer x/opacity here put every section (incl. experience) under an extra
                  transform layer ? Chromium rasterizes body text soft. Outer panel motion keeps the slide.
                  flex-1 min-h-0 binds height to the viewport so SHOWCASE flex spacers can resolve (min-h-screen grew unbounded).
                  Projects: no vertical overflow clip ? tall showcase + folder card scroll on the panel (no-scrollbar). */}
              <div
                className={
                  currentSection === "projects"
                    ? `relative z-10 flex w-full min-w-0 flex-col ${projectsPanelOverflowX} overflow-y-visible max-lg:min-h-min max-lg:flex-none ${
                        activeShowcaseProjectId ? "min-h-min shrink-0" : "max-2xl:min-h-min max-2xl:flex-none 2xl:min-h-0 2xl:flex-1"
                      }`
                    : currentSection === "profile"
                      ? "flex min-h-min w-full min-w-0 max-lg:flex-none flex-col overflow-x-hidden overflow-y-visible lg:h-full lg:min-h-0 lg:flex-1"
                    : currentSection === "skills"
                      ? "flex min-h-min w-full min-w-0 max-md:flex-none flex-col overflow-x-hidden overflow-y-visible md:min-h-full md:flex-1"
                    : currentSection === "experience"
                      ? "flex min-h-min w-full min-w-0 max-lg:flex-none flex-col overflow-x-hidden overflow-y-visible lg:h-full lg:min-h-0 lg:flex-1"
                      : "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
                }
              >
                {profileSectionMounted && (
                  <div className={currentSection !== "profile" ? "hidden" : undefined} aria-hidden={currentSection !== "profile"}>
                    <PhantomProfile
                      panelSettled={panelSettled && currentSection === "profile"}
                      mascotFadeOnPanelSettle={profileMascotSettleFade}
                    />
                  </div>
                )}
                {!profileSectionMounted && currentSection === "profile" && (
                  <PhantomProfile
                    panelSettled={panelSettled}
                    mascotFadeOnPanelSettle={profileMascotSettleFade}
                  />
                )}
                {reduceMotion ? (
                  <>
                    {currentSection === "projects" && (
                      <div
                        className={`flex w-full min-w-0 shrink-0 flex-col ${projectsPanelOverflowX} overflow-y-visible max-lg:min-h-min max-lg:flex-none ${
                          activeShowcaseProjectId ? "min-h-min" : "max-2xl:min-h-min max-2xl:flex-none 2xl:min-h-0 2xl:flex-1"
                        }`}
                      >
                        <PalaceProjects
                          onSelectProject={setActiveShowcaseProjectId}
                          onOpenSupporting={() => navigateTo("projects-supporting")}
                          onOpenFeaturedPdfInSupporting={openFeaturedPdfInSupporting}
                          activeProjectId={activeShowcaseProjectId}
                          entranceArmed={projectsEntranceArmed}
                          forceContentHidden={projectsSideNavLeaveHidden}
                          featuredPdfViewerActive={showcasePdfViewerActive}
                        />
                      </div>
                    )}
                    {currentSection === "projects-supporting" && (
                      <SupportingProjectsSection
                        onNavTransitionChange={setArchivePdfNavActive}
                        previewControlRef={supportingPdfPreviewControlRef}
                      />
                    )}
                  </>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    {currentSection === "projects" && (
                      <motion.div
                        key="projects"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={showcaseSubrouteExitFade ? { opacity: 0 } : undefined}
                        transition={{
                          duration: showcaseSubrouteExitFade ? SHOWCASE_SUBROUTE_FADE_S : 0,
                          ease: EASE.out,
                        }}
                        className={`flex w-full min-w-0 shrink-0 flex-col ${projectsPanelOverflowX} overflow-y-visible max-lg:min-h-min max-lg:flex-none ${
                          activeShowcaseProjectId ? "min-h-min" : "max-2xl:min-h-min max-2xl:flex-none 2xl:min-h-0 2xl:flex-1"
                        }`}
                      >
                        <PalaceProjects
                          onSelectProject={setActiveShowcaseProjectId}
                          onOpenSupporting={() => navigateTo("projects-supporting")}
                          onOpenFeaturedPdfInSupporting={openFeaturedPdfInSupporting}
                          activeProjectId={activeShowcaseProjectId}
                          entranceArmed={projectsEntranceArmed}
                          forceContentHidden={projectsSideNavLeaveHidden}
                          featuredPdfViewerActive={showcasePdfViewerActive}
                        />
                      </motion.div>
                    )}
                    {currentSection === "projects-supporting" && (
                      <motion.div
                        key="projects-supporting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={showcaseSubrouteExitFade ? { opacity: 0 } : undefined}
                        transition={{
                          duration: showcaseSubrouteExitFade ? SHOWCASE_SUBROUTE_FADE_S : 0,
                          ease: EASE.out,
                        }}
                        className="w-full"
                      >
                        <SupportingProjectsSection
                          onNavTransitionChange={setArchivePdfNavActive}
                          previewControlRef={supportingPdfPreviewControlRef}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
                {currentSection === "experience" &&
                  (reduceMotion ? (
                    <ConfidantExperience panelSettled={panelSettled} reduceMotion={reduceMotion} />
                  ) : (
                    <div className="flex min-h-full w-full min-w-0 flex-1 flex-col">
                      <ConfidantExperience panelSettled={panelSettled} reduceMotion={reduceMotion} />
                    </div>
                  ))}
                {currentSection === "social" && <SocialLink />}
                {currentSection === "skills" &&
                  (reduceMotion ? (
                    <SkillArsenal panelSettled={panelSettled} reduceMotion={reduceMotion} />
                  ) : (
                    <motion.div
                      className="flex min-h-min w-full min-w-0 max-md:flex-none flex-col md:min-h-full md:flex-1"
                      animate={{
                        opacity: skillsContentFade === "hide-instant" ? 0 : 1,
                      }}
                      transition={{
                        duration:
                          skillsContentFade === "fade-in"
                            ? skillsAnimS(SHOWCASE_SUBROUTE_FADE_S)
                            : 0,
                        ease: EASE.out,
                      }}
                      onAnimationComplete={() => {
                        if (skillsContentFade === "fade-in") {
                          setSkillsContentFade("visible");
                        }
                      }}
                    >
                      <SkillArsenal panelSettled={panelSettled} reduceMotion={reduceMotion} />
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {showcasePdfOverlay && (
            <SupportingPdfPreviewDialog
              item={showcasePdfOverlay}
              pdfSrc={supportingPdfHref(showcasePdfOverlay)}
              onClose={closeShowcasePdfOverlay}
              isClosing={showcasePdfClosing}
              reduceMotion={reduceMotion}
              showFrame={showcasePdfFrame}
              onFrameReady={() => setShowcasePdfFrame(true)}
              closeFadeS={SHOWCASE_PDF_OVERLAY_CLOSE_S}
              openFadeS={SHOWCASE_PDF_OVERLAY_OPEN_S}
              onCloseAnimationComplete={finishShowcasePdfClose}
            />
          )}
        </>
      )}
    </div>
  );
}
