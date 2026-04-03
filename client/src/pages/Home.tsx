// Force rebuild: 2024-05-21
import { motion, AnimatePresence, Variants, useInView, useReducedMotion, useMotionValue, useTransform, animate } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import React, { createContext, useContext, useEffect, useLayoutEffect, useState, useRef, useCallback } from "react";
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
  ChevronUp,
  ChevronDown,
  User,
  Briefcase,
  Monitor,
  ListOrdered
} from "lucide-react";
import styled from "styled-components";
import { TiltCard } from "@/components/TiltCard";
import { ExpandCircleButton } from "@/components/ExpandCircleButton";
import { WordsPullUp } from "@/components/WordsPullUp";
import { FloatingPhone } from "@/components/FloatingPhone";
import {
  SiArc,
  SiBytedance,
  SiDavinciresolve,
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
import { EXPERIENCE_BLOCK_POSITION, EXPERIENCE_BLOCK_POSITION_X, EXP_SNAP_POINTS } from "@/config/experience-position";

function AdobeSuiteIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 -2.5 20 20"
      width={size + 2}
      height={size + 2}
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

function ClipStudioIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size + 2}
      height={size + 2}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m 194.03561,49.300281 c 16.13822,11.735258 28.72089,28.046215 32.17727,48.156361 2.29369,16.849028 -0.5905,33.056818 -10.24845,47.350308 -2.03009,2.66139 -4.14854,5.18433 -6.36743,7.6889 -0.94245,1.1109 -0.94245,1.1109 -1.90245,2.24401 -11.33261,12.52861 -28.32654,19.2346 -43.16571,26.75557 -5.89479,2.99026 -11.73245,6.07092 -17.53562,9.23347 0.72471,1.1485 0.72471,1.1485 1.46391,2.31908 1.15253,1.82563 2.30506,3.65126 3.45758,5.4769 1.73733,2.76894 1.73733,2.76894 3.63098,5.22083 2.47363,3.91066 2.47911,7.79584 2.15086,12.32956 -1.84933,5.03564 -4.59019,7.51273 -9.22138,9.942 -5.32822,2.11978 -10.75817,1.86309 -16.12851,-0.0612 -7.46054,-3.6536 -12.21642,-11.91357 -16.63443,-18.61751 -1.24942,-1.8663 -2.5008,-3.73147 -3.75409,-5.5955 -0.92308,-1.37385 -0.92308,-1.37385 -1.86404,-2.77556 -3.09408,-4.53092 -6.34586,-8.9461 -9.64558,-13.32906 -3.187861,-4.31321 -3.187861,-4.31321 -3.407958,-7.62692 2.015667,-1.38463 2.015667,-1.38463 4.943788,-2.83787 1.10836,-0.55968 2.21775,-1.11844 3.36003,-1.69542 0.60653,-0.29885 1.21305,-0.5977 1.83808,-0.9048 2.59782,-1.28098 5.18188,-2.58811 7.76704,-3.89331 1.41184,-0.71314 2.82482,-1.42435 4.23793,-2.13357 8.49579,-4.26842 16.93074,-8.65307 25.36324,-13.0446 2.59132,-1.34869 5.18495,-2.69253 7.77959,-4.03645 23.53745,-11.71366 23.53745,-11.71366 36.78791,-33.69315 2.20985,-8.46506 0.4676,-18.565811 -3.42865,-26.271528 -6.78777,-11.25389 -16.19919,-18.945068 -28.88757,-22.694402 -19.55908,-4.241068 -34.28073,1.413027 -51.42176,10.430852 -1.45668,0.762216 -2.91244,1.523368 -4.36819,2.28452 -8.179236,4.281482 -16.34464,8.590108 -24.491822,12.931599 -0.713445,0.379115 -1.426887,0.758232 -2.161619,1.148784 -8.597469,3.869296 -8.597469,3.869296 -14.284458,10.697215 -0.401724,3.85009 -0.366803,7.37853 1.665851,10.76124 2.760245,3.09589 5.369748,4.87285 9.438819,5.53864 6.806805,0.073 11.218522,-1.72229 17.143031,-4.94401 0.849225,-0.44727 1.699448,-0.8946 2.574817,-1.35562 2.699493,-1.42504 5.387615,-2.87038 8.076739,-4.31576 1.802562,-0.95657 3.606262,-1.91122 5.410022,-2.86485 3.33236,-1.76472 6.66129,-3.53625 9.98556,-5.31747 1.50306,-0.80339 3.00611,-1.60676 4.50917,-2.410141 0.7984,-0.427854 1.59687,-0.85471 2.41949,-1.295196 0.7753,-0.413291 1.55069,-0.825586 2.35028,-1.250512 1.0415,-0.555245 1.0415,-0.555245 2.10427,-1.121925 5.66579,-2.83172 11.1147,-3.074373 17.15667,-1.374059 4.6807,1.756652 7.21558,3.813178 10.22592,7.777383 1.90986,4.67269 2.4347,9.02848 0.66179,13.73634 -3.84751,5.68751 -7.83656,8.24849 -13.86387,11.3107 -0.8409,0.43666 -1.68289,0.87243 -2.54993,1.32288 -2.69263,1.39252 -5.39112,2.7724 -8.0906,4.15232 -1.77316,0.91654 -3.54717,1.83512 -5.3192,2.75358 -42.605782,22.01306 -42.605782,22.01306 -64.986055,15.31255 -0.962112,-0.347 -1.924225,-0.694 -2.91507,-1.05111 -0.950743,-0.32672 -1.901552,-0.65442 -2.881027,-0.99125 C 41.695626,144.07281 31.216773,135.05245 26.277694,123.58157 22.312321,113.73371 21.476389,103.12479 24.99554,93.021348 30.120324,81.274883 39.057823,73.396239 50.312583,67.677771 c 0.987868,-0.517608 1.975735,-1.035216 2.994605,-1.568914 3.292184,-1.72097 6.598063,-3.416792 9.903942,-5.112613 1.85625,-0.963138 3.710305,-1.929138 5.565359,-2.895204 C 110.43256,36.410642 151.09729,20.210015 194.03561,49.300281 Z"
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
      viewBox="0 0 147.02681 109.47481"
      width={size}
      height={size}
      className={`block shrink-0 ${className ?? ""}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 16.397972,109.02936 C 9.6553448,107.52313 4.1553948,103.36396 1.2959418,97.608906 l -0.85502602,-1.72086 -0.09451,-9.74227 -0.09451,-9.74227 7.76015302,-4.06768 c 4.2680852,-2.23723 13.5028302,-6.98438 20.5216562,-10.54924 11.217349,-5.69727 12.712788,-6.54096 12.358895,-6.97253 -1.097188,-1.33804 -6.568991,-4.30779 -22.304446,-12.10542 -9.4647242,-4.6902 -17.4661382,-8.81712 -17.78092122,-9.17092 -0.507014,-0.56987 -0.592061,-1.45862 -0.745213,-7.787582 -0.210823,-8.712173 0.05343,-10.848678 1.77371302,-14.340614 C 3.4376348,8.1578797 5.3279258,6.0524497 8.6002358,3.8751297 11.83796,1.7208227 14.625541,0.71410668 18.476115,0.30852468 20.240367,0.12269568 37.383897,1.2268069e-4 61.60963,1.2968069e-4 c 43.40031,1.1e-5 42.07681,-0.0473500007 46.2957,1.65673401931 2.9774,1.202627 5.24678,2.695028 7.43291,4.888074 2.51989,2.52786 3.36338,3.9602703 4.15523,7.0563743 0.34474,1.347915 0.6803,2.504249 0.74568,2.569631 0.0654,0.06538 5.49222,-2.563163 12.05965,-5.841211 7.40966,-3.6984443 12.2915,-5.9600893 12.86506,-5.9600893 h 0.9243 v 8.3841543 8.384154 l -28.08129,13.971795 c -15.44471,7.68448 -30.45051,15.06982 -33.34622,16.41186 -2.89572,1.34203 -5.28354,2.58086 -5.30628,2.75294 -0.0983,0.74424 5.86013,4.16851 13.70004,7.87329 10.93954,5.16951 52.71149,25.98419 53.42485,26.62123 0.49238,0.4397 0.54755,1.23765 0.54755,7.91907 v 7.430114 l -0.98534,0.34349 c -0.54194,0.18892 -1.39792,0.34349 -1.90218,0.34349 -0.57132,0 -5.21253,-2.1876 -12.31546,-5.804804 -6.26925,-3.19264 -11.51947,-5.73011 -11.66716,-5.63883 -0.14769,0.0913 -0.35885,0.73081 -0.46925,1.42119 -0.29075,1.81829 -1.31626,4.40044 -2.39363,6.026974 -0.92963,1.40348 -4.46036,4.51871 -6.56146,5.7893 -1.99184,1.20452 -5.70662,2.23841 -9.24987,2.57441 -2.17321,0.20608 -17.97923,0.31551 -43.31455,0.29987 -32.135388,-0.0198 -40.257687,-0.10615 -41.76994,-0.44398 z M 99.46852,94.470196 c 1.41773,-0.18333 3.02782,-0.64395 4.06749,-1.16365 1.63624,-0.81792 1.73817,-0.93979 2.0729,-2.4785 0.19363,-0.89005 0.45063,-2.53884 0.57112,-3.66397 l 0.21908,-2.0457 -15.72317,-7.91271 c -19.07138,-9.59771 -24.63738,-12.27967 -26.83362,-12.92968 -2.52829,-0.74829 -6.1604,-0.63952 -8.71668,0.26104 -1.16617,0.41084 -10.638558,5.19536 -21.049754,10.63227 l -18.929448,9.88529 -0.08754,3.54724 -0.08754,3.54724 1.100835,1.06697 c 0.981224,0.95104 1.347693,1.08969 3.372817,1.27606 3.687154,0.33933 77.38596,0.31916 80.02351,-0.0219 z M 73.05834,40.783326 c 5.41075,-2.85989 15.0801,-7.71109 21.48745,-10.78044 13.19588,-6.321308 12.31428,-5.616721 11.9458,-9.547199 -0.2088,-2.22724 -0.97451,-3.652061 -2.34296,-4.359711 -2.66497,-1.378111 -3.04297,-1.390022 -44.29538,-1.395747 -25.31644,-0.0035 -39.740281,0.107281 -40.828285,0.313617 -1.019446,0.193334 -2.115028,0.668931 -2.780436,1.206999 l -1.098091,0.887948 -0.0881,3.637115 -0.0881,3.637115 15.106507,7.548813 c 8.308579,4.15185 17.040695,8.60505 19.404705,9.896 5.43971,2.97055 8.72406,4.14547 11.60392,4.15112 l 2.13525,0.004 z"
        fill="currentColor"
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

function FinalDraftIcon({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 264.99594 420.2551"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m 217.24593,12.567105 c 11.93,11.313 18.233,25.452 20.75,41.688 0.016,2.333 0.017,4.666 0,7 -16.189,3.22 -32.449,5.953 -48.744,8.574 -3.534,0.568 -7.067,1.144 -10.6,1.721 -2.756,0.45 -5.512,0.895 -8.269,1.338 -1.932,0.312 -3.862,0.628 -5.793,0.944 -1.173,0.188 -2.346,0.375 -3.555,0.568 -1.024,0.166 -2.049,0.331 -3.105,0.502 -3.007,0.361 -5.908,0.414 -8.934,0.353 0.165,-0.99 0.33,-1.981 0.5,-3 1.145,-9.431 2.25,-20.483 -2.5,-29 -4.087,-4.087 -7.815,-4.915 -13.312,-5.75 -1.111,-0.188 -1.111,-0.188 -2.245,-0.379 -1.812,-0.304 -2.98825,-0.09319 -4.59133,0.477474 -1.46762,1.145028 -1.87164,1.51036 -2.36064,2.76436 -0.266,0.684 -0.46203,0.943166 -0.73703,1.648166 -1.636,4.857 -1.942,9.436 -2.004,14.551 -0.026,1.254 -0.052,2.509 -0.078,3.801 0.502,13.043 4.48,25.625 8.64,37.887 0.26,0.772 0.519,1.545 0.787,2.341005 5.128,15.211 11.307,29.825 17.971,44.415 3.258,7.143 6.422,14.329 9.603,21.506 1.056,2.377 2.114,4.752 3.174,7.126 0.329,0.739 0.658,1.477 0.998,2.238 0.615,1.379 1.23,2.757 1.846,4.135 1.51,3.387 2.942,6.792 4.309,10.239 8.904,0.997 17.781,1.21 26.73,1.316 1.487,0.021 2.973,0.042 4.46,0.063 3.874,0.055 7.749,0.104 11.624,0.153 3.969,0.05 7.938,0.106 11.907,0.161 7.759,0.107 15.519,0.208 23.279,0.307 0.31934,7.05515 0.20456,4.48169 1,20 -0.832,0.015 -0.832,0.015 -1.681,0.031 -5.891,0.11 -11.782,0.224 -17.673,0.341 -2.185,0.043 -4.369,0.084 -6.554,0.125 -14.38,0.268 -28.73,0.731 -43.092,1.503 0.558,1.378 0.558,1.378 1.126,2.784 44.616,110.4 44.616,110.4 31.624,143.34 -4.543,10.156 -10.51,18.463 -17.75,26.876 -0.7,0.835 -1.4,1.67 -2.121,2.531 -13.151,15.25 -30.703,28.368 -51.356,30.469 -4.68,-10e-4 -8.858,-1.555 -13.25,-3.051 -1.014,-0.33 -2.029,-0.66 -3.074,-1 -3.28,-1.071 -6.552,-2.166 -9.824,-3.262 -2.251,-0.741 -4.502,-1.48 -6.754,-2.217 -4.467,-1.465 -8.932,-2.939 -13.395,-4.419 -5.446,-1.802 -10.906,-3.554 -16.378,-5.274 -1.461,-0.461 -2.922,-0.922 -4.383,-1.384 -1.997,-0.63 -3.995,-1.258 -5.995,-1.881 -1.785,-0.557 -3.567,-1.124 -5.349,-1.692 -0.975,-0.307 -1.95,-0.613 -2.955,-0.929 -2.166,-0.891 -2.166,-0.891 -3.166,-2.891 1.16,-0.292 2.32,-0.583 3.516,-0.883 27.341,-7.076 49.124,-24.459 63.73,-48.735 5.484,-9.876 5.962,-17.46 3.102,-28.359 -0.745,-2.557 -1.504,-5.104 -2.286,-7.649 l -1.239,-4.134 c -8.969,-29.671 -21.189,-57.982 -33.823,-86.24 -7.452,-0.267 -14.905,-0.528 -22.358,-0.783 -3.464,-0.118 -6.928,-0.238 -10.392,-0.363 -19.094,-0.685 -37.07493,-1.14844 -56.18293032,-1.00644 -0.33,-1.651 0.74388,-21.92378 0.74388,-21.92378 1.40439002,-1.1219 2.28202002,-1.05378 5.57602002,-1.03778 h 2.306 c 2.5220003,0 5.0430003,0.008 7.5650003,0.016 1.746,0.002 3.492,0.003 5.238,0.004 4.599,0.004 9.199,0.014 13.799,0.025 4.692,0.01 9.384,0.015 14.076,0.02 9.21,0.01 18.419,0.027 27.629,0.049 -0.447,-0.944 -0.894,-1.887 -1.355,-2.859 -1.698,-3.585 -3.392,-7.171 -5.086,-10.758 -0.726,-1.536 -1.453,-3.072 -2.181,-4.608 -21.456,-45.268 -21.456,-45.268 -25.378,-63.775 -0.156,-0.725 -0.313,-1.45 -0.474,-2.197 -2.169,-10.570005 -2.836,-21.089005 -2.964,-31.866005 -0.022,-1.117 -0.044,-2.235 -0.067,-3.386 0.032,-11.573 3.292,-21.234 11.505,-29.551 26.614,-23.368 64.307,-30.283 97.812,-37.9379997 1.287,-0.295 2.574,-0.589 3.899,-0.893 22.03203,-4.915 46.39003,-6.548 64.53903,9.1429997 z"
        fill="currentColor"
      />
    </svg>
  );
}

// Tool label -> icon: React component (@icons-pack) or "favicon:domain" for Google favicon (styled to match)
const TOOL_ICONS: Record<
  string,
  | React.ComponentType<{ size?: number; className?: string }>
  | string
> = {
  "Microsoft Office 365": "favicon:microsoft.com",
  "Adobe Creative Suite": AdobeSuiteIcon,
  "Canva": CanvaIcon,
  "Procreate": ProcreateIcon,
  "Clip Studio Paint": ClipStudioIcon,
  "DaVinci Resolve": SiDavinciresolve,
  "CapCut": CapCutIcon,
  "Final Draft": FinalDraftIcon,
  "Arc Studio": ArcStudioIcon,
  "Hootsuite": SiHootsuite,
  "TikTok Creator Tools": SiTiktok,
  "Instagram Reels": SiInstagram,
  "YouTube Shorts": SiYoutubeshorts,
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
          className="skills-tool-icon-menu-green block max-h-full max-w-full shrink-0 opacity-90"
        />
      );
    }
    return (
      <img
        src={`https://cdn.simpleicons.org/${icon}/ffffff`}
        alt=""
        width={size}
        height={size}
        className="skills-tool-icon-menu-green block max-h-full max-w-full shrink-0 opacity-90"
      />
    );
  }
  const Icon = icon;
  return <Icon size={size} className="block shrink-0 text-green-600 opacity-90" />;
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
  /** When trigger is viewport: if false, animation resets when leaving view so it plays again on re-entry */
  viewportOnce?: boolean;
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
                viewport: { once: viewportOnce, margin: "-40px 0px -40px 0px" },
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

const SLIDE_NO_Y_SCROLL =
  "no-scrollbar w-screen h-screen flex-shrink-0 snap-start overflow-y-hidden overflow-x-hidden";

const MOBILE_FLOAT_BOTTOM = "calc(0.75rem + env(safe-area-inset-bottom))";
const MOBILE_SKILLS_NAV_BOTTOM = "calc(0.75rem + env(safe-area-inset-bottom) + 1px)";
const MOBILE_FLOAT_LEFT = "calc(1rem + env(safe-area-inset-left))";
const MOBILE_ROUND_BTN_BASE =
  "items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white/90 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

const scrollToId = (id: string, behavior: ScrollBehavior = "smooth") => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior, block: "nearest", inline: "start" });
};

const NAV_ITEMS: { id: string; label: string; icon: LucideIcon; color: string; sub: string; microLabel: string }[] = [
  { id: "profile", label: "PROFILE", sub: "Summary", icon: User, color: "bg-red-600", microLabel: "OPEN" },
  { id: "projects", label: "PROJECTS", sub: "Projects", icon: Zap, color: "bg-yellow-400", microLabel: "VIEW" },
  { id: "experience", label: "EXPERIENCE", sub: "Career History", icon: Star, color: "bg-blue-600", microLabel: "ENTER" },
  { id: "skills", label: "SKILLS", sub: "Skills", icon: Briefcase, color: "bg-green-600", microLabel: "OPEN" },
  { id: "social", label: "CONTACT", sub: "Contact", icon: Heart, color: "bg-pink-500", microLabel: "VIEW" },
];

// Section id → accent color (hex) for transition panel edge (matches MENU item colors)
const SECTION_ACCENT_COLOR: Record<string, string> = {
  profile: "#dc2626",
  projects: "#facc15",
  "project-rawblem": "#facc15",
  "project-slaywire": "#facc15",
  "project-undertale-fhe": "#facc15",
  "project-portfolio": "#facc15",
  "project-undertale-proposal": "#facc15",
  "project-8bit-bumpers": "#facc15",
  "projects-supporting": "#facc15",
  experience: "#2563eb",
  social: "#ec4899",
  skills: "#16a34a",
};

const CMD_HOVER = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

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

const BackArrowSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" aria-hidden>
    {/* Left-pointing arrow for "back" */}
    <path d="M7.8284 11.0001L13.1924 16.3641L11.7782 17.7783L4 10.0001L11.7782 2.22205L13.1924 3.63626L7.8284 9.00011H20V11.0001H7.8284Z" />
  </svg>
);

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
          className="fixed z-50 max-sm:flex max-sm:h-9 max-sm:w-9 max-sm:items-center max-sm:justify-center"
          style={{
            left: MOBILE_FLOAT_LEFT,
            bottom: MOBILE_FLOAT_BOTTOM,
          }}
        >
          <div className="hidden sm:block">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to menu"
              className="animated-button bg-black/55 backdrop-blur-md font-heading text-[9px] md:text-[10px] tracking-[0.12em] uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <BackArrowSvg className="arr-2" />
              <span className="text">Back to menu</span>
              <span className="circle" aria-hidden />
              <BackArrowSvg className="arr-1" />
            </button>
          </div>
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to menu"
            className={`flex sm:hidden ${MOBILE_ROUND_BTN_BASE}`}
          >
            <BackArrowSvg className="w-4 h-4 fill-white" />
          </button>
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
  titleTrigger = "viewport",
  titleClassName,
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
  /** "mount" = animate once on mount only (no viewport); "viewport" = animate when in view. Use mount to prevent layout shift. */
  titleTrigger?: "mount" | "viewport";
  /** Extra classes for the title heading (e.g. xl/2xl scale). */
  titleClassName?: string;
}) => {
  const sizeClasses =
    title === "SKILLS"
      ? "text-5xl md:text-7xl"
      : compact
        ? "text-3xl md:text-5xl"
        : "text-4xl md:text-6xl";

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
          className="bg-cyan-500 h-2 w-24 mb-4"
        />
      )}
      <h2
        className={`${sizeClasses} ${titleClassName ?? ""} font-display ${color} leading-none tracking-tight uppercase -translate-y-0.5`}
      >
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
        />
      </h2>
      {betweenTitleAndSubtitle && (
        <div className="mt-4">{betweenTitleAndSubtitle}</div>
      )}
      {subtitle && (
        <p className="font-heading text-sm tracking-[0.22em] uppercase text-zinc-400 mt-2">
          {subtitle}
        </p>
      )}
    </>
  );

  if (slideFade) {
    return (
      <motion.div
        className={baseClass}
        initial={{ y: 14, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: viewportOnce, amount: 0.2 }}
        transition={{ duration: slideFadeDuration ?? 0.4, delay: slideFadeDelay, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={baseClass}>{content}</div>;
};

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
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
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
            WRITER / DIGITAL MEDIA / NARRATIVE SYSTEMS
          </motion.p>

          <motion.div ref={heroInViewRef} variants={fadeInUp} className="flex items-center">
            <motion.div
              whileHover={HOVER}
              whileTap={TAP}
              transition={SPRING.ui}
            >
              <Button
                size="lg"
                className={`font-display text-xl uppercase tracking-[0.12em] h-16 w-48 rounded-full transition-all border-4 group relative ${
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
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{ ...gridOverlayStyle, backgroundPosition: `${gridPhase}px ${gridPhase}px` }}
      />
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-heading text-sm tracking-[0.22em] uppercase text-zinc-400 mb-2">NAVIGATION</p>
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
  const gridPhase = useGridPhase();

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
        <motion.button
          key="sidenav-overlay"
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-[50] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
            style={{ ...gridOverlayStyle, backgroundPosition: `${gridPhase}px ${gridPhase}px` }}
            aria-hidden
          />
        </motion.button>
      )}
      {open && (
        <motion.div
          key="sidenav-where-to-next"
          className="fixed inset-0 md:right-[420px] z-[55] flex items-center justify-center pointer-events-none"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.04 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 72 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.416, ease: [0.027, 0, 0.06, 1], delay: 0.45 }}
            className="text-4xl md:text-6xl font-display text-white"
          >
            WHERE TO NEXT?
          </motion.h2>
        </motion.div>
      )}
      {open && (
        <motion.nav
          key="sidenav-nav"
            aria-label="Navigation"
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-[60] w-full max-w-[420px] bg-black border-l-4 border-white/20 p-6 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SPRING.panel}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">MENU</p>
                <p className="font-display text-3xl tracking-[0.14em] uppercase leading-none">Navigate</p>
              </div>
              <motion.div whileTap={TAP} transition={SPRING.ui}>
                <Button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="h-16 w-16 rounded-full bg-black text-white hover:bg-white hover:text-black border-4 border-black p-0 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <X size={26} aria-hidden />
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
              <div className="mb-4">
                <span className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
                  CONTACT
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <motion.a
                  href="#"
                  aria-label="YouTube"
                  whileHover={{ y: -3 }}
                  className="bg-black p-3 rounded-full text-red-500 transition-colors border border-red-500/20 hover:border-red-500/50 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SiYoutube size={18} aria-hidden className="fill-current" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/robbie-mclaughlin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  whileHover={{ y: -3 }}
                  className="bg-black p-3 rounded-full text-blue-500 transition-colors border border-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Linkedin size={18} aria-hidden />
                </motion.a>
                <motion.a
                  href="#"
                  aria-label="TikTok"
                  whileHover={{ y: -3 }}
                  className="bg-black p-3 rounded-full text-cyan-500 transition-colors border border-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SiTiktok size={18} aria-hidden className="fill-current" />
                </motion.a>
                <motion.a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  whileHover={{ y: -3 }}
                  className="bg-black p-3 rounded-full text-pink-500 transition-colors border border-pink-500/20 hover:border-pink-500/50 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SiInstagram size={18} aria-hidden className="fill-current" />
                </motion.a>
                <motion.a
                  href="mailto:robbie@example.com"
                  aria-label="Email"
                  whileHover={{ y: -3 }}
                  className="bg-black p-3 rounded-full text-zinc-300 transition-colors border border-white/10 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Mail size={18} aria-hidden />
                </motion.a>
              </div>
            </div>
          </motion.nav>
      )}
    </AnimatePresence>
  );
};

// --- PROFILE (About) ---
const SectionGridOverlay = () => {
  const phase = useGridPhase();
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
      style={{ ...gridOverlayStyle, backgroundPosition: `${phase}px ${phase}px` }}
      aria-hidden
    />
  );
};

const RED_LINE_DELAY_MS = 229; // -10%
const RED_LINE_DURATION_MS = 190; // -10%
const RED_LINE_COMPLETE_MS = RED_LINE_DELAY_MS + RED_LINE_DURATION_MS;
/** Fade-in / slide duration for the three buttons (ms). */
const BUTTON_FADE_DURATION_MS = 486; // -10%
/** Shutter overlay duration (ms). */
const SHUTTER_DURATION_MS = 176; // -10%
/** Summary delay + duration. Buttons start after summary finishes. */
const SUMMARY_DELAY_S = 0.0455; // -10%
const SUMMARY_DURATION_S = 0.306; // 0.34 * 0.9
const BUTTONS_DELAY_AFTER_SUMMARY_MS = 85;

const PhantomProfile = () => {
  const profileLeftRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const rawblemRef = useRef<HTMLDivElement>(null);
  const profileLeftInView = useInView(profileLeftRef, { once: false, amount: 0.2 });
  const dividerInView = useInView(dividerRef, { once: false, amount: 0.5 });
  const rawblemInView = useInView(rawblemRef, { once: false, amount: 0.2 });
  const [overlayRevealed, setOverlayRevealed] = useState(false);
  const [overlayEnterCount, setOverlayEnterCount] = useState(0);
  const [rawblemFloatReady, setRawblemFloatReady] = useState(false);
  const prevProfileInView = useRef(false);

  useEffect(() => {
    if (!rawblemInView) setRawblemFloatReady(false);
  }, [rawblemInView]);

  // Overlay + buttons: reset when section leaves; start only after red line anim completes
  useEffect(() => {
    if (profileLeftInView) {
      if (!prevProfileInView.current) {
        setOverlayRevealed(false);
        setOverlayEnterCount((c) => c + 1); // force fresh overlay on each enter
        prevProfileInView.current = true;
      }
      const revealId = window.setTimeout(() => setOverlayRevealed(true), Math.max(0, RED_LINE_COMPLETE_MS - 90));
      return () => window.clearTimeout(revealId);
    } else {
      prevProfileInView.current = false;
      setOverlayRevealed(false);
    }
  }, [profileLeftInView]);

  return (
    <section id="profile" className={`relative min-h-screen w-full overflow-x-hidden bg-black text-white scroll-mt-6 ${SLIDE}`}>
      <SectionGridOverlay />
      <div className="container mx-auto px-4 sm:px-6 relative z-20 pt-[24vh] lg:pt-0 pb-16 lg:pb-12 lg:min-h-screen lg:flex lg:items-center">
        <div className="flex w-full flex-col lg:flex-row lg:justify-center gap-20 lg:gap-20 xl:gap-36 2xl:gap-[min(14rem,12vw)] items-center">

          <motion.div
            ref={rawblemRef}
            initial={{ opacity: 0, y: 32, x: 0 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => rawblemInView && setRawblemFloatReady(true)}
            className="lg:order-2 w-full lg:w-auto lg:min-w-0 lg:shrink-0 flex justify-center translate-x-2 max-lg:-mt-14 sm:max-lg:-mt-16 max-lg:-translate-y-2 lg:translate-y-0 lg:mt-0"
          >
            <div className="w-full max-w-[160px] sm:max-w-[220px] md:max-w-[300px] xl:max-w-[312px] 2xl:max-w-[348px] aspect-square flex items-center justify-center">
              <motion.img
                src="/rawblem3.svg"
                alt="RAWBLEM"
                className="w-full h-full object-contain"
                animate={{ y: rawblemFloatReady ? [0, -8, 0] : 0 }}
                transition={
                  rawblemFloatReady
                    ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0 }
                }
              />
            </div>
          </motion.div>

          <motion.div
            ref={profileLeftRef}
            initial={{ opacity: 0, y: 30, x: 0 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.342, ease: [0.16, 1, 0.3, 1] }}
            className="lg:order-1 w-full lg:w-auto lg:max-w-[38rem] xl:max-w-[40rem] 2xl:max-w-[44rem] lg:shrink-0 lg:mt-0"
          >
             <SectionHeader
               key={profileLeftInView ? "profile-in" : "profile-out"}
               title="PROFILE"
               color="text-white"
               showBar={false}
               compact
               titleClassName="xl:text-5xl 2xl:text-6xl"
               className="!mb-5 max-lg:mt-0 lg:mt-0 -ml-[3px]"
               titleDelay={0.152}
               titleDuration={0.342}
               titleStagger={0.0216}
               viewportOnce={false}
               slideFade
               slideFadeDuration={0.5}
               slideFadeDelay={0.3}
             />
             <div
               ref={dividerRef}
               className="relative w-full max-w-xl xl:max-w-2xl 2xl:max-w-2xl mt-1 min-h-[2px]"
             >
               <motion.span
                 aria-hidden
                 className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-red-600"
                 initial={false}
                 animate={{ scaleX: dividerInView ? 1 : 0 }}
                 transition={{ duration: RED_LINE_DURATION_MS / 1000, delay: RED_LINE_DELAY_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
               />
            </div>
            <div
              className="relative w-full max-w-xl xl:max-w-2xl 2xl:max-w-2xl mt-1 overflow-visible min-w-0 min-h-[48px] sm:min-h-[60px] xl:min-h-[64px] 2xl:min-h-[68px] isolate"
            >
              <motion.div
                className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-1 xl:gap-1.5 2xl:gap-2"
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: overlayRevealed ? 0 : -24, opacity: overlayRevealed ? 1 : 0 }}
                transition={{ duration: BUTTON_FADE_DURATION_MS / 1000, delay: overlayRevealed ? BUTTONS_DELAY_AFTER_SUMMARY_MS / 1000 : 0, ease: [0.16, 1, 0.3, 1] }}
              >
               <ExpandCircleButton icon={<FileText size={20} />} expanded>Writer</ExpandCircleButton>
               <ExpandCircleButton icon={<Monitor size={20} />} expanded>Digital Media</ExpandCircleButton>
               <ExpandCircleButton icon={<ListOrdered size={20} />} expanded>Content Strategy</ExpandCircleButton>
              </motion.div>
              <motion.div
                key={overlayEnterCount}
                className="absolute inset-0 z-[20] bg-black pointer-events-none origin-right"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: overlayRevealed ? 0 : 1 }}
                transition={{ duration: SHUTTER_DURATION_MS / 1000, delay: overlayRevealed ? BUTTONS_DELAY_AFTER_SUMMARY_MS / 1000 : 0, ease: "linear" }}
                aria-hidden
              />
             </div>
             <motion.div
               className="mt-3 max-w-xl xl:max-w-2xl 2xl:max-w-2xl"
               initial={{ opacity: 0, y: 14 }}
               animate={{ opacity: overlayRevealed ? 1 : 0, y: overlayRevealed ? 0 : 14 }}
               transition={{ duration: SUMMARY_DURATION_S, delay: overlayRevealed ? SUMMARY_DELAY_S : 0, ease: [0.16, 1, 0.3, 1] }}
             >
               <p className="font-heading text-sm tracking-[0.22em] uppercase text-zinc-400 mb-2">SUMMARY</p>
               <p className="font-body text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl text-zinc-300 leading-relaxed">
                 Communications-focused writer and digital media coordinator with experience producing narrative-driven web content and managing social media workflows across multiple platforms. Bachelor of Arts in Writing (Distinction), University of Victoria.
               </p>
             </motion.div>
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
    <span className="text-zinc-400 uppercase group-hover:text-white transition-colors">{label}</span>
    <span className="text-cyan-400 uppercase">{value}</span>
  </div>
);

// --- PROJECTS (responsive carousel: 1 / 2 / 3 visible; cards larger & taller than original) ---
type ShowcaseProjectCard = {
  readonly id: string;
  readonly title: string;
  readonly tagline: string;
  readonly thumbnail?: string;
  readonly thumbnailVideo?: string;
  readonly poster?: string;
};

const PROJECT_CARDS: readonly ShowcaseProjectCard[] = [
  {
    id: "project-rawblem",
    title: "RAWBLEM",
    tagline: "Creative brand & short-form content system",
    thumbnailVideo: "/rawblem-thumbnail.mp4",
    poster: "/rawblem-thumbnail-poster.jpg",
  },
  {
    id: "project-8bit-bumpers",
    title: "8-bit Film Festival bumpers",
    tagline: "Pixel animation project",
    thumbnail: "/8bit-festival-thumbnail.jpg",
  },
  {
    id: "project-undertale-fhe",
    title: "UNDERTALE — Forever Home Edition",
    tagline: "Game project · GameMaker Studio 2",
    thumbnail: "/undertale-fhe-thumbnail.png",
  },
  {
    id: "project-portfolio",
    title: "Portfolio Website",
    tagline: "React, Vite, Framer Motion",
    thumbnailVideo: "/portfolio-website-thumbnail-v2.mp4",
    poster: "/portfolio-website-thumbnail-v2-poster.jpg",
  },
  {
    id: "project-slaywire",
    title: "SLAYWIRE",
    tagline: "Original graphic novel & narrative IP",
    thumbnail: "/slaywire-thumbnail.png",
  },
  {
    id: "project-undertale-proposal",
    title: "EDITS",
    tagline: "Video project",
    thumbnailVideo: "/edits-meme1-online.mp4",
    poster: "/edits-meme1-online-poster.jpg",
  },
];

const cardEase = [0.25, 0.46, 0.45, 0.94] as const;

const SUPPORTING_SECONDARY_ITEMS = [
  'Creative writing portfolio (articles, essays, screenplay — “Audience of One”)',
  "SLAYWIRE concept art & visual development",
  "Graphic design projects (posters, infographics — UVic eSports, coursework)",
  "Livestream production & broadcast setup (OBS / Streamlabs)",
] as const;

const ARCHIVE_DEPTH_ITEMS = [
  "Additional writing samples (creative nonfiction, academic work)",
  "Additional illustration work (concept art, commissions)",
  "Additional graphic design work",
] as const;

/** Showcase carousel parallax tween (same idea as Embla “Predefined → Parallax”). */
const PROJECT_CAROUSEL_TWEEN_FACTOR_BASE = 0.52;
const PROJECT_CARD_AUTOPLAY_DELAY_MS = 360;
const PROJECT_MEDIA_WARMUP_DELAY_MS = 20;

const SHOWCASE_GATE_S = 0.02;
const SHOWCASE_STAGGER_S = 0.09;
const SHOWCASE_CHILD_DUR_S = 0.34;
const SHOWCASE_EASE = [0.16, 1, 0.3, 1] as const;
const SHOWCASE_FADE_TOTAL_MS = Math.round((SHOWCASE_GATE_S + SHOWCASE_STAGGER_S + SHOWCASE_CHILD_DUR_S) * 1000);

const ProjectsStack = ({
  onSelect,
  focusProjectId = null,
}: {
  onSelect: (id: string, el: HTMLElement) => void;
  focusProjectId?: string | null;
}) => {
  const reduceMotion = useReducedMotion();
  const tweenFactor = useRef(0);
  const tweenRaf = useRef<number>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const autoplayDelayRef = useRef<number | null>(null);
  const hasPlayedOnce = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
    dragFree: false,
    containScroll: false,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplayIndex, setAutoplayIndex] = useState(-1);
  const [autoplayGateOpen, setAutoplayGateOpen] = useState(false);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = PROJECT_CAROUSEL_TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback(
    (api: EmblaCarouselType) => {
      const slideNodes = api.slideNodes();
      if (reduceMotion) {
        slideNodes.forEach((node) => {
          const inner = node.querySelector("[data-parallax-layer]") as HTMLElement | null;
          if (inner) inner.style.transform = "translateX(0)";
        });
        return;
      }
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
      const scrollSnaps = api.scrollSnapList();

      slideNodes.forEach((slideNode, i) => {
        const inner = slideNode.querySelector("[data-parallax-layer]") as HTMLElement | null;
        if (!inner) return;
        // Video previews are more prone to shimmer/bleed with subpixel parallax transforms.
        // Keep video cards fixed and only parallax static-image cards.
        if (slideNode.querySelector("video")) {
          inner.style.transform = "translateX(0)";
          return;
        }
        const diffToTarget = scrollSnaps[i] - scrollProgress;
        const direction = engine.options.direction === "rtl" ? -1 : 1;
        const tweenValue = diffToTarget * (-1 * direction * tweenFactor.current);
        inner.style.transform = `translateX(${tweenValue}%)`;
      });
    },
    [reduceMotion],
  );

  const scheduleTween = useCallback(() => {
    if (!emblaApi) return;
    cancelAnimationFrame(tweenRaf.current);
    tweenRaf.current = requestAnimationFrame(() => tweenParallax(emblaApi));
  }, [emblaApi, tweenParallax]);

  const syncCarouselUi = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);
    syncCarouselUi();

    emblaApi.on("scroll", scheduleTween);
    emblaApi.on("reInit", setTweenFactor);
    emblaApi.on("reInit", tweenParallax);
    emblaApi.on("reInit", syncCarouselUi);
    emblaApi.on("select", syncCarouselUi);

    return () => {
      cancelAnimationFrame(tweenRaf.current);
      emblaApi.off("scroll", scheduleTween);
      emblaApi.off("reInit", setTweenFactor);
      emblaApi.off("reInit", tweenParallax);
      emblaApi.off("reInit", syncCarouselUi);
      emblaApi.off("select", syncCarouselUi);
    };
  }, [emblaApi, scheduleTween, setTweenFactor, tweenParallax, syncCarouselUi]);

  useEffect(() => {
    if (autoplayDelayRef.current !== null) {
      window.clearTimeout(autoplayDelayRef.current);
    }

    setAutoplayGateOpen(false);
    setAutoplayIndex(-1);

    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    });

    const isFirstPlay = !hasPlayedOnce.current;
    const delay = reduceMotion
      ? 0
      : isFirstPlay
        ? SHOWCASE_FADE_TOTAL_MS + PROJECT_CARD_AUTOPLAY_DELAY_MS
        : PROJECT_CARD_AUTOPLAY_DELAY_MS;

    autoplayDelayRef.current = window.setTimeout(() => {
      hasPlayedOnce.current = true;
      setAutoplayGateOpen(true);
    }, delay);

    return () => {
      if (autoplayDelayRef.current !== null) {
        window.clearTimeout(autoplayDelayRef.current);
        autoplayDelayRef.current = null;
      }
    };
  }, [reduceMotion, selectedIndex]);

  useEffect(() => {
    if (!autoplayGateOpen) return;

    const selectedCard = PROJECT_CARDS[selectedIndex];
    if (!selectedCard?.thumbnailVideo) return;

    const selectedVideo = videoRefs.current[selectedIndex];
    if (!selectedVideo) return;

    const unlockAutoplay = () => setAutoplayIndex(selectedIndex);

    // Start as soon as selected preview has enough data to begin playback.
    if (selectedVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      unlockAutoplay();
      return;
    }

    // Ensure browser starts fetching media for the selected preview.
    selectedVideo.load();
    selectedVideo.addEventListener("canplay", unlockAutoplay, { once: true });
    return () => selectedVideo.removeEventListener("canplay", unlockAutoplay);
  }, [autoplayGateOpen, selectedIndex]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === autoplayIndex) {
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
  }, [autoplayIndex]);

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-5 lg:gap-6 py-8 px-1 sm:px-2 w-full min-w-0 overflow-x-visible overflow-y-visible">
      <motion.button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        aria-label="Previous projects"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative z-[1] flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20 flex items-center justify-center text-white hover:border-yellow-400/50 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-35 disabled:pointer-events-none"
      >
        <ChevronLeft size={28} strokeWidth={2} aria-hidden />
      </motion.button>

      <div className="min-w-0 max-w-full flex-[1_1_auto] overflow-hidden [--slide-gap:0.875rem] sm:[--slide-gap:1.25rem] md:[--slide-gap:1.5rem]">
        {/* Padding insets the track so center slide reads as “hero” with neighbors peeking (Embla align: center + %-width slides). */}
        <div ref={emblaRef} className="overflow-hidden px-2 sm:px-4 md:px-6">
          <div className="flex items-stretch touch-pan-y [-webkit-touch-callout:none] -ml-[var(--slide-gap)]">
            {PROJECT_CARDS.map((card, index) => (
              <div
                key={card.id}
                className="min-w-0 shrink-0 grow-0 pl-[var(--slide-gap)] flex-[0_0_80%] sm:flex-[0_0_74%] md:flex-[0_0_70%] lg:flex-[0_0_66%] xl:flex-[0_0_62%] flex justify-center"
              >
                <motion.button
                  type="button"
                  data-carousel-card
                  onClick={(e) => onSelect(card.id, e.currentTarget)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: cardEase }}
                  className={`group relative w-full h-[276px] sm:h-[304px] md:h-[324px] lg:h-[348px] xl:h-[364px] 2xl:h-[380px] rounded-none bg-zinc-950/35 text-center overflow-hidden hover:bg-zinc-950/65 hover:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-opacity duration-150 ${
                    focusProjectId && focusProjectId !== card.id ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-30 border border-zinc-500 transition-colors duration-200 group-hover:border-yellow-400"
                    aria-hidden
                  />
                  <div
                    data-parallax-layer
                    className={`h-full will-change-transform ${card.thumbnail || card.thumbnailVideo ? "relative z-0" : "flex min-h-0 flex-col items-center p-4 sm:p-5"}`}
                  >
                    {card.thumbnail || card.thumbnailVideo ? (
                      <>
                        <div
                          className={
                            card.thumbnailVideo
                              ? "absolute inset-0 overflow-hidden"
                              : "absolute inset-y-0 -left-4 -right-4 sm:-left-5 sm:-right-5"
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
                              preload={index === selectedIndex ? "auto" : "none"}
                              aria-label={`${card.title} preview`}
                              className="block h-full w-full object-cover object-center"
                            />
                          ) : (
                            <img
                              src={card.thumbnail}
                              alt={`${card.title} thumbnail`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover object-center"
                            />
                          )}
                        </div>
                        <div
                          className={
                            card.thumbnailVideo
                              ? "absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/85 to-transparent"
                              : "absolute inset-x-[-1rem] bottom-0 h-32 bg-gradient-to-t from-black via-black/85 to-transparent sm:inset-x-[-1.25rem]"
                          }
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                          <span
                            className={`font-display block w-full max-w-full text-left text-[1rem] sm:text-[1.05rem] md:text-lg lg:text-xl xl:text-[1.35rem] leading-snug text-white tracking-tight line-clamp-3 [text-wrap:balance] motion-safe:transition-[opacity,color] motion-safe:duration-300 motion-safe:ease-out ${
                              index === selectedIndex
                                ? "opacity-100 group-hover:text-yellow-50"
                                : "opacity-70 group-hover:text-zinc-100"
                            }`}
                          >
                            {card.title}
                          </span>
                          <span className="font-body mt-3 block w-full max-w-full text-left text-xs sm:text-[0.8125rem] md:text-sm lg:text-[0.9375rem] text-zinc-300 leading-relaxed line-clamp-2 border-t border-white/15 pt-3 sm:pt-3.5 transition-colors group-hover:text-white/90">
                            {card.tagline}
                          </span>
                        </div>
                      </>
                    ) : null}
                    {!card.thumbnail && !card.thumbnailVideo ? (
                      <div className="flex min-h-0 w-full max-w-full flex-1 flex-col justify-between overflow-hidden">
                        <span
                          className={`font-display w-full max-w-full text-[1rem] sm:text-[1.05rem] md:text-lg lg:text-xl xl:text-[1.35rem] leading-snug text-white tracking-tight line-clamp-4 [text-wrap:balance] motion-safe:transition-[opacity,color] motion-safe:duration-300 motion-safe:ease-out ${
                            index === selectedIndex
                              ? "opacity-100 group-hover:text-yellow-50"
                              : "opacity-0 pointer-events-none"
                          }`}
                          aria-hidden={index !== selectedIndex}
                        >
                          {card.title}
                        </span>
                        <span className="font-body w-full max-w-full text-xs sm:text-[0.8125rem] md:text-sm lg:text-[0.9375rem] text-zinc-500 leading-relaxed line-clamp-4 border-t border-white/10 pt-3 sm:pt-3.5 transition-colors group-hover:text-zinc-400">
                          {card.tagline}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        aria-label="Next projects"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative z-[1] flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20 flex items-center justify-center text-white hover:border-yellow-400/50 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-35 disabled:pointer-events-none"
      >
        <ChevronRight size={28} strokeWidth={2} aria-hidden />
      </motion.button>
    </div>
  );
};

const SupportingProjectsSection = ({ onBack }: { onBack: () => void }) => (
  <section
    id="projects-supporting"
    className={`relative min-h-screen w-full overflow-x-hidden overflow-y-auto py-16 md:py-20 bg-black text-white scroll-mt-6 ${SLIDE}`}
  >
    <SectionGridOverlay />
    <div className="container mx-auto px-6 relative z-10 max-w-3xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2 -ml-2"
      >
        <ChevronLeft size={20} aria-hidden /> Back to showcase
      </Button>
      <p className="font-heading text-xs tracking-[0.22em] uppercase text-zinc-500 mb-2">Projects</p>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight text-white mb-10 text-balance">
        Supporting, archive & depth
      </h2>

      <div className="space-y-12">
        <div>
          <h3 className="font-heading text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-yellow-400/90 mb-4 pb-2 border-b border-yellow-400/25">
            Projects (supporting / secondary)
          </h3>
          <ul className="space-y-3">
            {SUPPORTING_SECONDARY_ITEMS.map((line) => (
              <li
                key={line}
                className="rounded-lg border border-white/12 bg-zinc-950/50 px-4 py-3.5 font-body text-sm sm:text-base text-zinc-300 leading-snug hover:border-yellow-400/35 hover:bg-zinc-950/80 transition-colors"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-zinc-500 mb-4 pb-2 border-b border-white/15">
            Projects (archive / depth)
          </h3>
          <ul className="space-y-3">
            {ARCHIVE_DEPTH_ITEMS.map((line) => (
              <li
                key={line}
                className="rounded-lg border border-white/10 bg-zinc-950/40 px-4 py-3.5 font-body text-sm sm:text-base text-zinc-400 leading-snug hover:border-white/20 hover:bg-zinc-950/70 transition-colors"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

type CardRect = { top: number; left: number; width: number; height: number };

/** Renders media content for the detail card (morph overlay and settled view share the same markup). */
const DetailCardMedia = ({ card }: { card: ShowcaseProjectCard }) => (
  <div className="h-full w-full">
    {card.thumbnailVideo ? (
      <video
        src={card.thumbnailVideo}
        poster={card.poster}
        muted loop autoPlay playsInline preload="auto"
        className="block h-full w-full object-cover object-center"
      />
    ) : (
      <img src={card.thumbnail} alt={card.title} className="h-full w-full object-cover object-center" />
    )}
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/85 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
      <span className="font-display block text-left text-[1rem] sm:text-[1.05rem] md:text-lg xl:text-[1.35rem] leading-snug text-white tracking-tight">{card.title}</span>
      <span className="font-body mt-3 block text-left text-xs sm:text-[0.8125rem] md:text-sm text-zinc-300 leading-relaxed border-t border-white/15 pt-3">{card.tagline}</span>
    </div>
  </div>
);

const DETAIL_CARD_H = "h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]";

const PalaceProjects = ({
  onSelectProject,
  onOpenSupporting,
  activeProjectId,
  onBackToCarousel,
  settled = true,
}: {
  onSelectProject: (id: string) => void;
  onOpenSupporting: () => void;
  activeProjectId: string | null;
  onBackToCarousel: () => void;
  settled?: boolean;
}) => {
  const reduceMotion = useReducedMotion();
  const gate = reduceMotion ? 0 : SHOWCASE_GATE_S;
  const activeCard = activeProjectId ? PROJECT_CARDS.find((c) => c.id === activeProjectId) ?? null : null;

  const [morphRect, setMorphRect] = useState<CardRect | null>(null);
  const [targetRect, setTargetRect] = useState<CardRect | null>(null);
  const [morphDone, setMorphDone] = useState(false);
  const detailAnchorRef = useRef<HTMLDivElement>(null);

  const morphDur = reduceMotion ? 0.1 : 0.24;
  const morphEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  // FLIP animation approach — avoids animating CSS layout properties (width/height)
  // which Framer Motion wires up via useEffect (after paint), causing a size-flash.
  // Instead, the flying card is always the DESTINATION size (plain React state →
  // applied synchronously by React's commit), and scaleX/scaleY (pure transforms)
  // start at src/dst ratio and animate to 1. All transforms apply before first paint.
  const mX      = useMotionValue(0);
  const mY      = useMotionValue(0);
  const mScaleX = useMotionValue(1);
  const mScaleY = useMotionValue(1);

  const handleCardClick = useCallback((id: string, el: HTMLElement) => {
    if (!detailAnchorRef.current) return;
    const src = el.getBoundingClientRect();
    const dst = detailAnchorRef.current.getBoundingClientRect();

    // Set all transforms synchronously — before React schedules its render —
    // so Framer Motion's useLayoutEffect applies them before the first paint.
    mX.set(src.left);
    mY.set(src.top);
    mScaleX.set(src.width  / dst.width);
    mScaleY.set(src.height / dst.height);

    setMorphRect({ top: src.top,  left: src.left,  width: src.width,  height: src.height });
    setTargetRect({ top: dst.top, left: dst.left, width: dst.width, height: dst.height });
    setMorphDone(false);
    onSelectProject(id);
  }, [onSelectProject, mX, mY, mScaleX, mScaleY]);

  // Drive transforms to destination once React has committed the state.
  useEffect(() => {
    if (!targetRect || !morphRect || morphDone) return;
    let cancelled = false;

    animate(mX,      targetRect.left,   { duration: morphDur, ease: morphEase });
    animate(mY,      targetRect.top,    { duration: morphDur, ease: morphEase });
    animate(mScaleX, 1,                 { duration: morphDur, ease: morphEase });
    animate(mScaleY, 1, {
      duration: morphDur,
      ease: morphEase,
      onComplete: () => { if (!cancelled) setMorphDone(true); },
    });

    return () => { cancelled = true; };
  // Object identity changes each click — that is the correct trigger.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRect, morphRect]);

  const handleBackToCarousel = useCallback(() => {
    setMorphRect(null);
    setTargetRect(null);
    setMorphDone(false);
    onBackToCarousel();
  }, [onBackToCarousel]);

  return (
    <section
      id="projects"
      className={`relative flex flex-col justify-center min-h-screen w-full py-16 md:py-20 bg-black text-white scroll-mt-6 ${SLIDE} !overflow-x-visible`}
    >
      <SectionGridOverlay />
      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-full min-w-0">

        {/*
         * CAROUSEL — always in normal flow so the section keeps its height.
         * When a card is active we fade it out but DO NOT unmount it so the
         * container height stays stable for the absolute detail overlay.
         */}
        <div
          aria-hidden={!!activeCard || undefined}
          className={activeCard ? "pointer-events-none select-none" : ""}
        >
          <motion.div
            animate={{ opacity: activeCard ? 0 : 1 }}
            transition={{ duration: activeCard ? 0.08 : 0.14 }}
          >
            {settled && (
              <SectionHeader
                title="SHOWCASE"
                subtitle="Projects"
                align="center"
                showBar={false}
                compact
                titleDelay={gate}
                titleDuration={0.38}
                titleStagger={0.035}
                slideFade
                slideFadeDuration={SHOWCASE_CHILD_DUR_S}
                slideFadeDelay={gate}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={
              activeCard ? { opacity: 0, y: 0 }
              : settled  ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
            }
            transition={{
              duration: activeCard ? 0.08 : SHOWCASE_CHILD_DUR_S,
              delay: !activeCard && settled ? gate + SHOWCASE_STAGGER_S : 0,
              ease: SHOWCASE_EASE,
            }}
          >
            {settled && (
              <ProjectsStack
                onSelect={(id, el) => handleCardClick(id, el)}
                focusProjectId={activeCard?.id ?? null}
              />
            )}
          </motion.div>

          <motion.div
            className="mt-10 md:mt-14 flex justify-center px-2"
            initial={{ opacity: 0, y: 14 }}
            animate={
              activeCard ? { opacity: 0, y: 0 }
              : settled  ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 14 }
            }
            transition={{
              duration: activeCard ? 0.08 : SHOWCASE_CHILD_DUR_S,
              delay: !activeCard && settled ? gate + SHOWCASE_STAGGER_S * 2 : 0,
              ease: SHOWCASE_EASE,
            }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenSupporting}
                className="border-2 border-white/20 bg-black/40 text-white hover:bg-white/5 hover:border-yellow-400/50 hover:text-yellow-100 rounded-full px-6 py-5 h-auto font-heading text-xs sm:text-sm tracking-[0.18em] uppercase gap-2"
              >
                Supporting &amp; archive
                <ArrowRight className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/*
         * Permanent measurement anchor — always in the DOM so we can read its
         * getBoundingClientRect() synchronously at click time (zero RAF delay).
         * Absolutely positioned so it never affects carousel layout.
         */}
        <div
          ref={detailAnchorRef}
          className={`absolute top-0 left-0 right-0 mx-auto w-full max-w-[min(100%,56rem)] ${DETAIL_CARD_H} pointer-events-none`}
          aria-hidden
          style={{ visibility: "hidden" }}
        />

        {/*
         * DETAIL OVERLAY — absolute, sits on top of the (now invisible) carousel.
         * Uses flex-col so the card + text stack naturally from the container top.
         */}
        {activeCard && (
          <div className="absolute inset-0 flex flex-col items-center">
            {/* Spacer — same dimensions as the card so detail text flows below it. */}
            <div className={`w-full max-w-[min(100%,56rem)] shrink-0 ${DETAIL_CARD_H}`} aria-hidden />

            {/* Settled card — card border is instant; media fades in after morph. */}
            {morphDone && (
              <div
                className={`absolute top-0 left-0 right-0 mx-auto w-full max-w-[min(100%,56rem)] ${DETAIL_CARD_H} border border-zinc-500 overflow-hidden`}
                style={{ background: "#000" }}
              >
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <DetailCardMedia card={activeCard} />
                </motion.div>
              </div>
            )}

            {/* Detail text */}
            {morphDone && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.08, ease: SHOWCASE_EASE }}
                className="w-full max-w-[min(100%,56rem)] mt-7 pb-16"
              >
                <p className="font-heading text-xs tracking-[0.22em] uppercase text-zinc-500 mb-2">Project details</p>
                <h3 className="font-display text-2xl md:text-3xl tracking-tight text-white">{activeCard.title}</h3>
                <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">{activeCard.tagline}</p>
                <div className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToCarousel}
                    className="border-2 border-white/20 bg-black/40 text-white hover:bg-white/5 hover:border-yellow-400/50 hover:text-yellow-100 rounded-none px-5 py-3 h-auto font-heading text-xs sm:text-sm tracking-[0.18em] uppercase"
                  >
                    Back to carousel
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/*
       * FLYING CARD — portalled into document.body so it is completely outside
       * the panel's CSS transform context. Framer Motion keeps transform:translateX(0)
       * on the panel after slide-in, which (per CSS spec) makes position:fixed
       * children relative to the panel, not the viewport — causing compositing
       * layer mismatches and full-screen flicker. The portal removes this entirely.
       * FLIP technique: destination size set as plain values (React commit, pre-paint);
       * scaleX/scaleY set synchronously before render via MotionValues.
       */}
      {createPortal(
        <motion.div
          style={{
            position: "fixed",
            overflow: "hidden",
            border: "1px solid rgb(113 113 122)",
            background: "#000",
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
          {/* No media during morph — just the dark card shape moving cleanly */}
        </motion.div>,
        document.body,
      )}
    </section>
  );
};

const ProjectPoint = ({ text }: { text: string }) => (
  <div className="flex items-start">
    <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0 fill-current" />
    <span className="font-body text-base md:text-lg text-zinc-300 leading-relaxed">{text}</span>
  </div>
);

// --- EXPERIENCE ---
const EXPERIENCE_DATA = [
  {
    role: "Digital Content & Interactive Media Projects",
    company: "RAWBLEM",
    location: "Victoria, BC",
    period: "October 2024 — Present",
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
    period: "January 2019 — January 2020",
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
    period: "August 2018 — Present",
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

const EXP_FADE_DUR = 0.24; // P3R UI 160–260ms
const EXP_FADE_EASE = [0.2, 0.8, 0.2, 1] as const;

const EXP_LINE_DURATION_MS = 190;
const EXP_LINE_DELAY_MS = 229;

const EXPERIENCE_POSITION_KEY = "experience-block-position";
const EXPERIENCE_POSITION_X_KEY = "experience-block-position-x";

function getStoredExperiencePosition(): number {
  if (typeof window === "undefined") return EXPERIENCE_BLOCK_POSITION;
  const stored = window.localStorage.getItem(EXPERIENCE_POSITION_KEY);
  if (stored === null) return EXPERIENCE_BLOCK_POSITION;
  const n = Number(stored);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : EXPERIENCE_BLOCK_POSITION;
}

function getStoredExperiencePositionX(): number {
  if (typeof window === "undefined") return EXPERIENCE_BLOCK_POSITION_X;
  const stored = window.localStorage.getItem(EXPERIENCE_POSITION_X_KEY);
  if (stored === null) return EXPERIENCE_BLOCK_POSITION_X;
  const n = Number(stored);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : EXPERIENCE_BLOCK_POSITION_X;
}

const SNAP_PAGE_VH = 51;
const SNAP_PAGE_VH_MOBILE = 46;

function getSnapVh() {
  return typeof window !== "undefined" && window.innerWidth < 640 ? SNAP_PAGE_VH_MOBILE : SNAP_PAGE_VH;
}

const ConfidantExperience = () => {
  const [position, setPosition] = useState(() =>
    typeof window !== "undefined" ? getStoredExperiencePosition() : EXPERIENCE_BLOCK_POSITION
  );
  const [positionX, setPositionX] = useState(() =>
    typeof window !== "undefined" ? getStoredExperiencePositionX() : EXPERIENCE_BLOCK_POSITION_X
  );
  const headerRef = useRef<HTMLDivElement>(null);
  const jobListRef = useRef<HTMLDivElement>(null);
  const [snapIndex, setSnapIndex] = useState(0);

  const scrollToPrev = useCallback(() => {
    const el = jobListRef.current;
    if (!el) return;
    const pagePx = (getSnapVh() / 100) * window.innerHeight;
    el.scrollBy({ top: -pagePx, behavior: "smooth" });
  }, []);
  const scrollToNext = useCallback(() => {
    const el = jobListRef.current;
    if (!el) return;
    const pagePx = (getSnapVh() / 100) * window.innerHeight;
    el.scrollBy({ top: pagePx, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = jobListRef.current;
    if (!el) return;
    const onScroll = () => {
      const pagePx = (getSnapVh() / 100) * window.innerHeight;
      const idx = Math.round(el.scrollTop / pagePx);
      setSnapIndex(Math.max(0, Math.min(idx, EXPERIENCE_DATA.length - 1)));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handlePositionChange = (raw: number) => {
    const value = Math.max(0, Math.min(100, raw));
    setPosition(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(EXPERIENCE_POSITION_KEY, String(value));
    }
  };

  const handlePositionXChange = (raw: number) => {
    const value = Math.max(0, Math.min(100, raw));
    setPositionX(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(EXPERIENCE_POSITION_X_KEY, String(value));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPosition(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(EXPERIENCE_POSITION_KEY, String(value));
    }
  };

  const handleSliderXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPositionX(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(EXPERIENCE_POSITION_X_KEY, String(value));
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const offsetYVh = ((position - 50) / 50) * 25;
  const offsetXVw = ((positionX - 50) / 50) * 6;
  const blockStyle = isMobile ? {} : { transform: `translate(${offsetXVw + 0.75}vw, ${offsetYVh}vh)` };

  return (
    <section id="experience" className={`relative flex flex-col h-screen w-full overflow-hidden sm:py-10 md:py-14 bg-black text-white scroll-mt-6 ${SLIDE}`}>
       <SectionGridOverlay />
       <div className="w-full h-full px-5 sm:px-6 md:px-10 relative z-10 flex flex-col items-center justify-center min-h-0">
         <div
           className="flex flex-col w-full max-w-4xl sm:max-h-[78vh] sm:min-h-[360px] transition-transform duration-150"
           style={blockStyle}
         >
         <div ref={headerRef} className="flex-none flex flex-col w-full items-start text-left">
           <SectionHeader
             title="CAREER OVERVIEW"
             color="text-white"
             align="left"
             showBar={false}
             compact
             className="!mb-2 sm:!mb-5 ml-0 w-full"
             titleTrigger="mount"
           />
           <div className="relative w-full mt-1 sm:mt-1.5 min-h-[2px]">
             <span
               aria-hidden
               className="absolute bottom-0 left-0 right-0 h-[2px] sm:h-[2.5px] origin-left block w-full rounded-full opacity-90"
               style={{ backgroundColor: SECTION_ACCENT_COLOR.experience, transform: 'scaleX(1)' }}
             />
           </div>
         </div>

        {/* Job list: each job is exactly 51vh so only two snap points (RAWBLEM, Barista). job’s */}
        <div
          ref={jobListRef}
          className="w-full h-[46vh] sm:h-[51vh] min-h-[46vh] sm:min-h-[51vh] mt-2 sm:mt-4 overflow-y-auto overflow-x-hidden no-scrollbar snap-y snap-mandatory"
        >
           {EXPERIENCE_DATA.map((job, idx) => (
             <article
               key={idx}
               className="flex flex-col h-[46vh] sm:h-[51vh] min-h-[46vh] sm:min-h-[51vh] shrink-0 pb-2 sm:pb-4 snap-start snap-always"
             >
               <header className="mb-1.5 sm:mb-3 shrink-0">
                 <div className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1">
                   <span className="font-mono text-[10px] sm:text-xs text-zinc-500 tabular-nums w-5 sm:w-8 shrink-0" aria-hidden>{String(idx + 1).padStart(2, "0")}</span>
                   <h3 className="font-display text-[13px] sm:text-lg md:text-xl font-semibold tracking-tight text-white">{job.role}</h3>
                 </div>
                 <div className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-0.5 mt-0.5">
                   <span className="w-5 sm:w-8 shrink-0" aria-hidden />
                   <span className="font-heading text-[10px] sm:text-sm tracking-[0.06em] uppercase text-zinc-400">{job.company}</span>
                   <span className="text-zinc-600" aria-hidden>·</span>
                   <span className="font-heading text-[10px] sm:text-sm tracking-[0.06em] uppercase text-zinc-500">{job.location}</span>
                 </div>
                 <div className="flex items-baseline gap-x-2 sm:gap-x-3 mt-0.5 sm:mt-1">
                   <span className="w-5 sm:w-8 shrink-0" aria-hidden />
                   <time className="font-heading text-[9px] sm:text-xs tracking-[0.08em] uppercase text-zinc-500">{job.period}</time>
                 </div>
               </header>
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar border-t border-white/15 pt-1.5 sm:pt-3">
                <ul className="pl-5 sm:pl-12 list-disc list-outside marker:text-zinc-500 text-zinc-300 border-b border-white/15 pb-1.5 sm:pb-2">
                  {job.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="py-[3px] sm:py-1.5 border-b border-white/5 last:border-b-0 font-body text-[11px] sm:text-sm md:text-base leading-snug sm:leading-relaxed"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
             </article>
           ))}
         </div>
         {/* Mobile: horizontal arrows below content */}
         <div
           className="flex sm:hidden items-center justify-center gap-6 mt-3 z-20 flex-none"
           aria-label="Experience navigation"
         >
           <button
             type="button"
             onClick={scrollToPrev}
             disabled={snapIndex <= 0}
             aria-label="Previous experience"
             className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-black/60 text-white/90 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
           >
             <ChevronUp size={16} strokeWidth={2.5} />
           </button>
           <span className="font-mono text-[10px] text-zinc-500 tabular-nums">{String(snapIndex + 1).padStart(2, "0")} / {String(EXPERIENCE_DATA.length).padStart(2, "0")}</span>
           <button
             type="button"
             onClick={scrollToNext}
             disabled={snapIndex >= EXPERIENCE_DATA.length - 1}
             aria-label="Next experience"
             className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-black/60 text-white/90 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
           >
             <ChevronDown size={16} strokeWidth={2.5} />
           </button>
         </div>
         </div>
       </div>

       {/* Desktop: vertical arrows on the right side */}
       <div
         className="absolute hidden sm:flex right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3"
         aria-label="Experience navigation"
       >
         <button
           type="button"
           onClick={scrollToPrev}
           disabled={snapIndex <= 0}
           aria-label="Previous experience"
           className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/20 bg-black/60 text-white/90 hover:border-blue-600 hover:text-blue-400 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
         >
           <ChevronUp size={22} strokeWidth={2.5} />
         </button>
         <button
           type="button"
           onClick={scrollToNext}
           disabled={snapIndex >= EXPERIENCE_DATA.length - 1}
           aria-label="Next experience"
           className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/20 bg-black/60 text-white/90 hover:border-blue-600 hover:text-blue-400 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
         >
           <ChevronDown size={22} strokeWidth={2.5} />
         </button>
       </div>

       {/* Position sliders: hidden; position data still applied from state/localStorage. Remove "hidden" to show again. */}
       <div className="hidden absolute bottom-6 left-0 right-0 z-20 px-6 flex flex-col items-center gap-3 pointer-events-none" aria-hidden>
         <div className="flex flex-col gap-2 w-full max-w-sm">
           <div className="flex items-center gap-3 w-full">
             <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider shrink-0 w-16">VERTICAL</span>
             <input
               type="range"
               min={0}
               max={100}
               step={1}
               value={position}
               onChange={handleSliderChange}
               aria-label="Vertical position (0–100)"
               className="flex-1 h-2 rounded-full appearance-none bg-white/10 accent-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0"
             />
             <span className="font-mono text-xs text-zinc-400 tabular-nums w-8 shrink-0">{position}</span>
           </div>
           <div className="flex items-center gap-3 w-full">
             <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider shrink-0 w-16">HORIZONTAL</span>
             <input
               type="range"
               min={0}
               max={100}
               step={1}
               value={positionX}
               onChange={handleSliderXChange}
               aria-label="Horizontal position (0–100)"
               className="flex-1 h-2 rounded-full appearance-none bg-white/10 accent-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0"
             />
             <span className="font-mono text-xs text-zinc-400 tabular-nums w-8 shrink-0">{positionX}</span>
           </div>
         </div>
         <div className="flex items-center gap-1">
           {EXP_SNAP_POINTS.map((point) => (
             <button
               key={point}
               type="button"
               onClick={() => handlePositionChange(point)}
               className={`px-2 py-1 text-xs font-mono border rounded transition-colors ${
                 position === point
                   ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                   : "border-white/20 text-zinc-500 hover:border-white/40 hover:text-zinc-400"
               }`}
               aria-label={`Snap vertical to ${point}`}
             >
               {point}
             </button>
           ))}
         </div>
       </div>
    </section>
  );
};

// --- CONTACT (Uiverse.io button style by Itskrish01) ---
const UIVERSE_BUTTON_BASE =
  "p-5 rounded-full backdrop-blur-lg from-black/60 to-black/40 shadow-lg hover:scale-110 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer group relative overflow-hidden border bg-gradient-to-tr";

const SocialLink = () => {
  return (
    <section id="social" className={`relative flex flex-col justify-center min-h-screen w-full overflow-x-hidden py-16 md:py-20 bg-black text-white scroll-mt-6 ${SLIDE}`}>
      <SectionGridOverlay />
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 72 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.416, ease: [0.027, 0, 0.06, 1], delay: 0.4 }}
          className="text-4xl md:text-6xl font-display text-white relative z-10 mb-12"
        >
          LET'S TALK.
        </motion.h2>

        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.053, delayChildren: 1.16 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-6"
        >
          <motion.a
            href="#"
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.053, ease: [0.22, 1, 0.36, 1] }}
            className={`${UIVERSE_BUTTON_BASE} border-red-500/20 hover:rotate-2 hover:border-red-500/50 hover:from-red-500/10 hover:to-black/40`}
            aria-label="YouTube"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <div className="relative z-10">
              <svg className="w-7 h-7 fill-current text-red-500 group-hover:text-red-400 transition-colors duration-300" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
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
            transition={{ duration: 0.053, ease: [0.22, 1, 0.36, 1] }}
            className={`${UIVERSE_BUTTON_BASE} border-blue-500/20 hover:rotate-2 hover:border-blue-500/50 hover:from-blue-500/10 hover:to-black/40`}
            aria-label="LinkedIn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <div className="relative z-10">
              <svg className="w-7 h-7 fill-current text-blue-500 group-hover:text-blue-400 transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            transition={{ duration: 0.053, ease: [0.22, 1, 0.36, 1] }}
            className={`${UIVERSE_BUTTON_BASE} border-cyan-500/20 hover:-rotate-2 hover:border-cyan-500/50 hover:from-cyan-500/10 hover:to-black/40`}
            aria-label="TikTok"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <div className="relative z-10">
              <svg className="w-7 h-7 fill-current text-cyan-500 group-hover:text-cyan-400 transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            transition={{ duration: 0.053, ease: [0.22, 1, 0.36, 1] }}
            className={`${UIVERSE_BUTTON_BASE} border-pink-500/20 hover:rotate-2 hover:border-pink-500/50 hover:from-pink-500/10 hover:to-black/40`}
            aria-label="Instagram"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <div className="relative z-10 flex items-center justify-center">
              <Instagram size={28} className="text-pink-500 group-hover:text-pink-400 transition-colors duration-300" strokeWidth={1.5} aria-hidden />
            </div>
          </motion.a>

          <motion.a
            href="#"
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.053, ease: [0.22, 1, 0.36, 1] }}
            className={`${UIVERSE_BUTTON_BASE} border-white/10 hover:rotate-3 hover:border-white/30 hover:from-white/10 hover:to-black/40`}
            aria-label="Email"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <div className="relative z-10 flex items-center justify-center">
              <Mail size={28} className="text-white group-hover:text-white/90 transition-colors duration-300" strokeWidth={1.5} aria-hidden />
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
    label: "TOOLKIT",
    panels: [
      { title: "DESIGN & PRODUCTIVITY", titleCase: "Design & Productivity", subtitle: "Toolkit", items: ["Microsoft Office 365", "Adobe Creative Suite", "Canva", "Procreate", "Clip Studio Paint"] },
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
    title: "TOOLKIT",
    categories: [
      {
        title: "Design & Productivity",
        items: [
          "Microsoft Office 365",
          "Adobe Creative Suite",
          "Canva",
          "Procreate",
          "Clip Studio Paint",
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
// Core: Writing & Narrative, Social & Media, Research & Collaboration + items each.
// Tools: Design & Productivity, Video & Writing, Social Platforms + items each.

// ─── DIAGONAL CONNECTOR GEOMETRY ─────────────────────────────────────────────
// Single sharp line: origin = midpoint of top card’s right edge, end = midpoint of bottom card’s left edge.
// Cards placed with ~35% diagonal separation; line and node use same 0–100 coordinate system.
const WEBHOOKS_CORE_ACCENT = "#22d3ee";  // cyan accent to replace green
const WEBHOOKS_TOOLS_ACCENT = "#0891b2";
const WEBHOOKS_IDLE_BORDER = "rgba(255,255,255,0.25)";
const DIAGONAL_START = { x: 38, y: 20 };
const DIAGONAL_END   = { x: 62, y: 80 };
const DIAGONAL_MID   = { x: 50, y: 50 };
const SKILLS_CARD_EASE = [0.22, 1, 0.36, 1] as const;
const SKILLS_CARD_DUR = 0.22;

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

/** AiIdea / gear in subskills panel header — same artwork as intro cards, scaled to the SectionHeader-compact title row. */
const SKILLS_SUBSKILL_HEADER_ICON_PX = 52;

type CoreSubskillIcon = React.ComponentType<{ size?: number; className?: string }>;

/** Core competencies: 3 columns (same structure as Operational Stack). Icons: https://tabler.io/icons */
const CORE_SUBSKILLS_CATEGORIES: {
  categoryTitle: string;
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
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider bg-cyan-500 text-white border border-cyan-500 hover:bg-white hover:text-black hover:border-white rounded-lg px-3 py-2 transition-colors duration-200"
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
            {data.categories.map((category) => (
              <div key={category.title} className="border-l border-white/10 pl-4">
                <h4 className="font-display text-xs md:text-sm uppercase tracking-[0.06em] text-white/90 mb-2 md:mb-3 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] md:text-xs text-white/75 tracking-tight leading-tight"
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
            {data.categories.map((category) => (
              <div key={category.title} className="border-l border-white/10 pl-4">
                <h4 className="font-display text-xs md:text-sm uppercase tracking-[0.06em] text-white/90 mb-2 md:mb-3 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] md:text-xs text-white/75 tracking-tight leading-tight"
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

// ─── SKILL ARSENAL (dual-layer: undercard expands, P3R-style reveal) ─────────────
// P3R motion: UI 160–260ms, ease-out, panel slide + row stagger (30–60ms), y+opacity
const MORPH_DUR = 0.22;
const MORPH_EASE = [0.2, 0.8, 0.2, 1] as const; // P3R ease-out
const MORPH_EXPAND_DUR = 0.28;
const MORPH_EXPAND_EASE = [0.22, 1, 0.36, 1] as const;
const P3R_STAGGER_MS = 45; // 30–60ms per row

/**
 * When `true`: Core + Tools intro pair shows first; opening a card reveals sub-skills in the overlay (with Close).
 * When `false`: Sub-skills show immediately with prev/next carousel arrows (no intro cards).
 */
const SKILLS_SHOW_INTRO_PAIR_CARDS = false;

/* From Uiverse.io by Adrwaan - adapted to match MAIN MENU card style (no extra glow block) */
const UiverseCard = styled.div`
  position: relative;
  width: 360px;
  height: 270px;
  border-radius: 10px;
  transition: transform 0.3s ease;

  @media (max-width: 639px) {
    width: min(90vw, 360px);
    height: auto;
    min-height: 200px;
    aspect-ratio: 4 / 3;
  }

  &:hover {
    transform: translateY(-6px);
  }

  /* ICON_HOVER_DISABLED: UiverseCard SVG (idea/gear + star) — restore rules below
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
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  overflow: hidden;

  @media (max-width: 639px) {
    width: calc(100% - 8px);
    height: calc(100% - 8px);
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
const SKILLS_EXPAND_EXIT_DUR = 0.28;
const SKILLS_EXPAND_ENTER_DUR = SKILLS_EXPAND_EXIT_DUR * 1.5; // 50% longer fade-in

/** Rule-of-thirds overlay for positioning. Set showRuleOfThirds = true to show on viewport. Preserved for future use. */
const showRuleOfThirds = false;
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
  inset: 0;
  z-index: 45;
  border-radius: 0;
`;

const SKILLS_CONTENT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Stagger inside subskills card: header → scroll body → bottom rule */
const skillsPanelStaggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};
const skillsPanelStaggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: SKILLS_CONTENT_EASE },
  },
};

/** Stagger around card + flank nav (inline) or intro pair cards */
const skillsChromeStaggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};
const skillsChromeStaggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: SKILLS_CONTENT_EASE },
  },
};

/** Icon flourish starts this many seconds before the modeled end of the SKILLS slide/fade stack (keep in sync with variants below). */
const SKILLS_FLOURISH_LEAD_S = 0.5;

/** Footer = 3rd panel stagger child: delayChildren + 2×staggerChildren + duration */
const SKILLS_PANEL_STAGGER_END_S = 0.04 + 2 * 0.09 + 0.4;
/** Inline carousel: single chrome stagger child (panel); arrows are outside keyed remount */
const SKILLS_CHROME_INLINE_STAGGER_END_S = 0.06 + 0.38;
const SKILLS_INLINE_MOTION_END_S = Math.max(SKILLS_PANEL_STAGGER_END_S, SKILLS_CHROME_INLINE_STAGGER_END_S);

/** Intro: 2nd chrome card; also second card title motion (delay 0.25 + 0.4s) in SkillArsenal */
const SKILLS_INTRO_CHROME_STAGGER_END_S = 0.06 + 1 * 0.1 + 0.38;
const SKILLS_INTRO_SECOND_TITLE_END_S = 0.25 + 0.4;
const SKILLS_INTRO_MOTION_END_S = Math.max(SKILLS_INTRO_CHROME_STAGGER_END_S, SKILLS_INTRO_SECOND_TITLE_END_S);

/** Overlay shell expand vs panel stagger (parallel, same t0) */
const SKILLS_OVERLAY_MOTION_END_S = Math.max(MORPH_EXPAND_DUR, SKILLS_PANEL_STAGGER_END_S);

/**
 * Expanded subskills content. Header row: AiIdeaSvg (core) / GearSvg (tools) on the right, aligned
 * with "Core Competencies" / "Toolkit". Removed: `SkillsSourceToggle` toolbar - restore via
 * git; related hover CSS commented in `index.css`. Intro pair cards still use the same SVGs when
 * `SKILLS_SHOW_INTRO_PAIR_CARDS` is true.
 */
const SkillsSubskillsPanel = ({
  slide,
  variant,
  onClose,
}: {
  slide: "core" | "tools";
  variant: "overlay" | "inline";
  onClose?: () => void;
}) => (
  <UiverseCard
    className="skills-main-card skills-subcard"
    onClick={variant === "overlay" ? (e) => e.stopPropagation() : undefined}
  >
    <CardBlackFace>
      {showRuleOfThirds && <RuleOfThirdsOverlay />}
      {variant === "overlay" && onClose ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-white border border-white/30 bg-white/5 hover:bg-cyan-500 hover:border-cyan-400 hover:text-white rounded-md transition-colors duration-200 shadow-sm"
          aria-label="Close subskills"
        >
          Close
        </button>
      ) : null}
      <motion.div
        key={slide}
        className={
          variant === "overlay"
            ? "relative z-10 flex min-h-0 max-h-[min(680px,90vh)] sm:max-h-[min(440px,58vh)] flex-col overflow-hidden px-4 sm:px-10 md:px-16 lg:px-20 py-4 pt-12 sm:pt-14 pb-5 sm:pb-6 text-left"
            : "relative z-10 flex min-h-0 max-h-[min(680px,90vh)] sm:max-h-[min(440px,58vh)] flex-col overflow-hidden px-4 sm:px-8 md:px-14 lg:px-16 xl:px-20 py-2.5 sm:py-6 md:py-7 text-left"
        }
        variants={skillsPanelStaggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.08 }}
      >
        <motion.div
          className="flex flex-shrink-0 flex-col gap-0.5 min-w-0 border-b border-zinc-600/45 pb-2 sm:pb-4 mb-2 sm:mb-4 sm:gap-1.5"
          variants={skillsPanelStaggerChild}
        >
          <p className="min-w-0 text-[11px] sm:text-[13px] uppercase leading-none tracking-[0.2em] sm:tracking-[0.25em] text-zinc-400 whitespace-nowrap truncate">
            PORTFOLIO // SKILLS
          </p>
          <div className="flex min-w-0 flex-row items-end justify-between gap-2 sm:gap-5">
            <p className="min-w-0 flex-1 font-display text-xl sm:text-3xl md:text-5xl uppercase tracking-tight text-white leading-none whitespace-nowrap truncate">
              {slide === "core" ? "Core Competencies" : "Toolkit"}
            </p>
            <div
              className="skills-subskills-header-icon shrink-0 translate-y-1.5 sm:translate-y-4 [&_svg]:!w-[29px] [&_svg]:!h-[29px] sm:[&_svg]:!w-[52px] sm:[&_svg]:!h-[52px]"
              aria-hidden
            >
              {slide === "core" ? (
                <span
                  className="inline-flex sm:[transform:var(--icon-offset)]"
                  style={{
                    "--icon-offset": `translate(${Math.round(SKILLS_CARD_LAYOUT.core.icon.offsetX * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.core.icon.size))}px, ${Math.round(SKILLS_CARD_LAYOUT.core.icon.offsetY * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.core.icon.size))}px)`,
                  } as React.CSSProperties}
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
                  className="inline-flex text-zinc-100 max-sm:translate-y-[5%] sm:[transform:var(--icon-offset)]"
                  style={{
                    "--icon-offset": `translate(${Math.round(SKILLS_CARD_LAYOUT.tools.icon.offsetX * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.tools.icon.size))}px, ${Math.round(SKILLS_CARD_LAYOUT.tools.icon.offsetY * (SKILLS_SUBSKILL_HEADER_ICON_PX / SKILLS_CARD_LAYOUT.tools.icon.size)) + Math.round(SKILLS_SUBSKILL_HEADER_ICON_PX * 0.05)}px)`,
                  } as React.CSSProperties}
                >
                  <GearSvg
                    viewBox="0 0 256 256"
                    className="paperplane"
                    style={{
                      width: SKILLS_SUBSKILL_HEADER_ICON_PX,
                      height: SKILLS_SUBSKILL_HEADER_ICON_PX,
                    }}
                  >
                    <rect width="256" height="256" fill="none" />
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
          </div>
        </motion.div>
        <motion.div
          className="relative flex-1 min-h-0"
          variants={skillsPanelStaggerChild}
        >
        <div
          className={
            variant === "inline"
              ? "h-full min-h-0 overflow-y-hidden overflow-x-hidden pr-2 pb-3 sm:pb-2"
              : "h-full min-h-0 overflow-y-hidden overflow-x-hidden pr-2 pb-8 sm:pb-2"
          }
        >
          {slide === "core" ? (
            <div className="text-sm sm:text-base md:text-[1.0625rem] leading-relaxed text-zinc-100 pb-2 border-b border-zinc-600/45">
              <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-3 md:items-start gap-y-3.5 sm:gap-y-8 gap-x-4 md:gap-x-5 lg:gap-x-7 xl:gap-x-8">
                {CORE_SUBSKILLS_CATEGORIES.map(({ categoryTitle, items }) => (
                  <div
                    key={categoryTitle}
                    className={
                      categoryTitle === "Research & Collaboration"
                        ? "flex min-w-min flex-col"
                        : "flex min-w-0 flex-col"
                    }
                  >
                    <p
                      className={
                        categoryTitle === "Research & Collaboration"
                          ? "mb-1.5 sm:mb-3 text-[13px] uppercase tracking-[0.22em] text-zinc-400 whitespace-nowrap"
                          : "mb-1.5 sm:mb-3 min-w-0 text-[13px] uppercase leading-snug tracking-[0.22em] text-zinc-400 break-words"
                      }
                      title={categoryTitle}
                    >
                      {categoryTitle}
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2.5">
                      {items.map(({ label, Icon }) => (
                        <li key={label} className="flex min-w-0 items-start gap-3.5">
                          <span className="mt-0.5 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                            <Icon size={22} className="text-green-600 opacity-80" />
                          </span>
                          <span className="min-w-0 truncate" title={label}>
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm sm:text-base md:text-[1.0625rem] leading-relaxed text-zinc-100 pb-2 border-b border-zinc-600/45">
              <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-3 md:items-start gap-y-6 sm:gap-y-8 gap-x-6 md:gap-x-8 lg:gap-x-10 xl:gap-x-12 [&>*]:min-w-0">
                <div className="min-w-0 flex flex-col">
                  <p
                    className="mb-3 min-w-0 text-[13px] uppercase tracking-[0.22em] text-zinc-400 whitespace-nowrap truncate"
                    title="Design & Productivity"
                  >
                    Design &amp; Productivity
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Microsoft Office 365",
                      "Adobe Creative Suite",
                      "Canva",
                      "Procreate",
                      "Clip Studio Paint",
                    ].map((tool) => (
                      <li key={tool} className="flex min-w-0 items-center gap-3.5">
                        <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                          <ToolIcon name={tool} size={20} />
                        </span>
                        <span className="min-w-0 truncate" title={tool}>
                          {tool}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-w-0 flex flex-col">
                  <p
                    className="mb-3 min-w-0 text-[13px] uppercase tracking-[0.22em] text-zinc-400 whitespace-nowrap truncate"
                    title="Video & Writing"
                  >
                    Video &amp; Writing
                  </p>
                  <ul className="space-y-2.5">
                    {["DaVinci Resolve", "CapCut", "Final Draft", "Arc Studio"].map((tool) => (
                      <li key={tool} className="flex min-w-0 items-center gap-3.5">
                        <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                          <ToolIcon name={tool} size={20} />
                        </span>
                        <span className="min-w-0 truncate" title={tool}>
                          {tool}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-w-0 flex flex-col">
                  <p
                    className="mb-3 min-w-0 text-[13px] uppercase tracking-[0.22em] text-zinc-400 whitespace-nowrap truncate"
                    title="Social Platforms"
                  >
                    Social Platforms
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Hootsuite",
                      "TikTok Creator Tools",
                      "Instagram Reels",
                      "YouTube Shorts",
                    ].map((tool) => (
                      <li key={tool} className="flex min-w-0 items-center gap-3.5">
                        <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                          <ToolIcon name={tool} size={20} />
                        </span>
                        <span className="min-w-0 truncate" title={tool}>
                          {tool}
                        </span>
                      </li>
                    ))}
                  </ul>
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

const SkillArsenal = () => {
  const [activeSubskills, setActiveSubskills] = useState<"core" | "tools" | null>(
    SKILLS_SHOW_INTRO_PAIR_CARDS ? null : "core",
  );
  const [skillsIconFlourish, setSkillsIconFlourish] = useState(false);
  const skillsFlourishCommittedRef = useRef(false);
  const skillsFlourishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSkillsIconFlourish = useCallback((sequenceEndS: number) => {
    if (skillsFlourishCommittedRef.current) return;
    if (skillsFlourishTimerRef.current != null) {
      clearTimeout(skillsFlourishTimerRef.current);
      skillsFlourishTimerRef.current = null;
    }
    const delayMs = Math.max(0, (sequenceEndS - SKILLS_FLOURISH_LEAD_S) * 1000);
    skillsFlourishTimerRef.current = setTimeout(() => {
      skillsFlourishTimerRef.current = null;
      if (skillsFlourishCommittedRef.current) return;
      skillsFlourishCommittedRef.current = true;
      setSkillsIconFlourish(true);
    }, delayMs);
  }, []);

  useEffect(() => {
    if (skillsFlourishTimerRef.current != null) {
      clearTimeout(skillsFlourishTimerRef.current);
      skillsFlourishTimerRef.current = null;
    }
    skillsFlourishCommittedRef.current = false;
    setSkillsIconFlourish(false);
  }, [activeSubskills]);

  useEffect(
    () => () => {
      if (skillsFlourishTimerRef.current != null) {
        clearTimeout(skillsFlourishTimerRef.current);
      }
    },
    [],
  );

  const goSkillsPrev = () =>
    setActiveSubskills((s) => {
      if (s === "core") return "tools";
      if (s === "tools") return "core";
      return "tools";
    });

  const goSkillsNext = () =>
    setActiveSubskills((s) => {
      if (s === "core") return "tools";
      if (s === "tools") return "core";
      return "core";
    });

  return (
    <section
      id="skills"
      data-skills-icon-flourish={skillsIconFlourish ? "true" : undefined}
      className={`relative flex h-full min-h-0 w-full flex-col overflow-x-hidden bg-black text-white scroll-mt-6 ${SLIDE_NO_Y_SCROLL}`}
    >
      <SectionGridOverlay />
      <div
        className="container relative z-10 mx-auto flex h-full min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center overflow-visible px-4 py-[max(1.25rem,env(safe-area-inset-top),env(safe-area-inset-bottom))] sm:px-6 sm:py-8"
        style={
          SKILLS_LAYOUT.sectionOffsetRem !== 0
            ? { transform: `translateY(${SKILLS_LAYOUT.sectionOffsetRem}rem)` }
            : undefined
        }
      >
        {/* Cards area: intro pair (gated) + sub-skills overlay or inline carousel */}
        <div className="skills-content-shell relative z-0 mx-auto flex min-h-0 w-full min-w-0 max-w-[min(100%,88.75rem)] flex-1 flex-col items-center justify-center overflow-visible">
          {SKILLS_SHOW_INTRO_PAIR_CARDS ? (
            <div className="flex w-full flex-wrap items-center justify-center gap-8">
              <motion.div
                className="flex w-full flex-wrap items-center justify-center gap-8"
                initial={{ opacity: 1 }}
                animate={{
                  opacity: activeSubskills ? 0 : 1,
                }}
                transition={{ duration: MORPH_DUR, ease: MORPH_EASE }}
                style={{ pointerEvents: activeSubskills ? "none" : "auto" }}
              >
                <motion.div
                  className="flex w-full flex-wrap items-center justify-center gap-8"
                  variants={skillsChromeStaggerParent}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.2 }}
                  onAnimationStart={(def) => {
                    if (def !== "show") return;
                    scheduleSkillsIconFlourish(SKILLS_INTRO_MOTION_END_S);
                  }}
                >
                  <motion.div variants={skillsChromeStaggerChild}>
                  <UiverseCard
                    className="skills-main-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveSubskills("core")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSubskills("core");
                      }
                    }}
                  >
                    <CardBlackFace>
                      {showRuleOfThirds && <RuleOfThirdsOverlay />}
                      <span
                        style={{
                          transform: `translate(${SKILLS_CARD_LAYOUT.core.icon.offsetX}px, ${SKILLS_CARD_LAYOUT.core.icon.offsetY}px)`,
                          display: "inline-block",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <AiIdeaSvg
                          viewBox="0 0 24 24"
                          className="paperplane"
                          style={{
                            width: SKILLS_CARD_LAYOUT.core.icon.size,
                            height: SKILLS_CARD_LAYOUT.core.icon.size,
                          }}
                        >
                          <path strokeLinecap="round" d={AI_IDEA_PATH_1} />
                          <path data-ai-star d={AI_IDEA_STAR} />
                          <path d={AI_IDEA_LINE} />
                        </AiIdeaSvg>
                      </span>
                      <CardTitleSlot
                        style={{
                          bottom: SKILLS_CARD_LAYOUT.core.title.offsetY,
                          position: "absolute",
                          zIndex: 1,
                        }}
                      >
                        <span data-card-title-wrap>
                          <motion.span
                            className="block font-display font-semibold uppercase tracking-[0.12em] text-white h-[52px]"
                            style={{
                              fontSize: `${SKILLS_CARD_LAYOUT.core.title.fontSize}px`,
                              textShadow: "0 0 10px rgba(0,0,0,0.9)",
                            }}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                          >
                            CORE COMPETENCIES
                          </motion.span>
                        </span>
                      </CardTitleSlot>
                    </CardBlackFace>
                  </UiverseCard>
                  </motion.div>
                  <motion.div variants={skillsChromeStaggerChild}>
                  <UiverseCard
                    className="skills-main-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveSubskills("tools")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSubskills("tools");
                      }
                    }}
                  >
                    <CardBlackFace>
                      {showRuleOfThirds && <RuleOfThirdsOverlay />}
                      <span
                        style={{
                          transform: `translate(${SKILLS_CARD_LAYOUT.tools.icon.offsetX}px, ${SKILLS_CARD_LAYOUT.tools.icon.offsetY}px)`,
                          display: "inline-block",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <GearSvg
                          viewBox="0 0 256 256"
                          className="paperplane"
                          style={{
                            width: SKILLS_CARD_LAYOUT.tools.icon.size,
                            height: SKILLS_CARD_LAYOUT.tools.icon.size,
                          }}
                        >
                          <rect width="256" height="256" fill="none" />
                          {/* Gear outline + inner ring, stroke-only (no fill animation) */}
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
                      <CardTitleSlot
                        style={{
                          bottom: SKILLS_CARD_LAYOUT.tools.title.offsetY,
                          position: "absolute",
                          zIndex: 1,
                        }}
                      >
                        <span data-card-title-wrap>
                          <motion.span
                            className="block font-display font-semibold uppercase tracking-[0.12em] text-white h-[52px]"
                            style={{
                              fontSize: `${SKILLS_CARD_LAYOUT.tools.title.fontSize}px`,
                              textShadow: "0 0 10px rgba(0,0,0,0.9)",
                            }}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                          >
                            TOOLKIT
                          </motion.span>
                        </span>
                      </CardTitleSlot>
                    </CardBlackFace>
                  </UiverseCard>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          ) : null}

          {!SKILLS_SHOW_INTRO_PAIR_CARDS && activeSubskills ? (
            <div className="skills-carousel-wrap flex w-full min-w-0 max-w-full flex-col items-center justify-center overflow-visible py-2 sm:py-3 max-sm:translate-y-8">
              <div className="flex w-full min-w-0 max-w-full justify-center px-1 sm:px-2 md:px-4">
                <div
                  className="skills-source-stack relative flex w-full min-w-0 max-w-[min(100%,1180px)] flex-col max-sm:min-h-[calc(min(680px,90vh)+4.5rem)]"
                  role="group"
                  aria-label="Skills detail"
                >
                  <div className="w-full min-w-0 max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col max-sm:justify-center">
                    <motion.div
                      key={activeSubskills}
                      className="w-full min-w-0"
                      variants={skillsChromeStaggerParent}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.12 }}
                      onAnimationStart={(def) => {
                        if (def !== "show") return;
                        scheduleSkillsIconFlourish(SKILLS_INLINE_MOTION_END_S);
                      }}
                    >
                      <motion.div variants={skillsChromeStaggerChild} className="w-full min-w-0">
                        <SkillsSubskillsPanel slide={activeSubskills} variant="inline" />
                      </motion.div>
                    </motion.div>
                  </div>
                  <div className="max-sm:h-[4.5rem] max-sm:shrink-0 sm:hidden" aria-hidden />
                  {/* Desktop: absolute arrows flanking the card */}
                  <motion.button
                    type="button"
                    onClick={goSkillsPrev}
                    aria-label="Previous skills category"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:flex pointer-events-auto absolute top-1/2 z-50 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md md:h-10 md:w-10 right-full mr-3 md:mr-4 hover:border-green-500/55 hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <ChevronLeft size={18} strokeWidth={2} aria-hidden />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={goSkillsNext}
                    aria-label="Next skills category"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:flex pointer-events-auto absolute top-1/2 z-50 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md md:h-10 md:w-10 left-full ml-3 md:ml-4 hover:border-green-500/55 hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <ChevronRight size={18} strokeWidth={2} aria-hidden />
                  </motion.button>

                  {typeof document !== "undefined"
                    ? createPortal(
                        <div
                          className="sm:hidden pointer-events-none fixed left-0 right-0 z-40 flex h-9 items-center justify-center gap-4 overflow-visible"
                          style={{ bottom: MOBILE_SKILLS_NAV_BOTTOM }}
                          role="toolbar"
                          aria-label="Skills category navigation"
                        >
                          <motion.button
                            type="button"
                            onClick={goSkillsPrev}
                            aria-label="Previous skills category"
                            whileTap={{ scale: 0.95 }}
                            className={`pointer-events-auto flex ${MOBILE_ROUND_BTN_BASE}`}
                          >
                            <ChevronLeft size={18} strokeWidth={2} aria-hidden />
                          </motion.button>
                          <div
                            className="pointer-events-none flex h-9 shrink-0 items-center gap-1 leading-none"
                            aria-hidden
                          >
                            <ChevronDown size={12} className="shrink-0 text-zinc-500 animate-bounce" style={{ animationDuration: "1.8s" }} />
                            <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">Scroll</span>
                            <ChevronDown size={12} className="shrink-0 text-zinc-500 animate-bounce" style={{ animationDuration: "1.8s" }} />
                          </div>
                          <motion.button
                            type="button"
                            onClick={goSkillsNext}
                            aria-label="Next skills category"
                            whileTap={{ scale: 0.95 }}
                            className={`pointer-events-auto flex ${MOBILE_ROUND_BTN_BASE}`}
                          >
                            <ChevronRight size={18} strokeWidth={2} aria-hidden />
                          </motion.button>
                        </div>,
                        document.body,
                      )
                    : null}
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {SKILLS_SHOW_INTRO_PAIR_CARDS && activeSubskills ? (
                <motion.div
                  key="skills-subcard"
                  initial={{ opacity: 0, scale: 0.95, y: 32 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 16 }}
                  transition={{ duration: MORPH_EXPAND_DUR, ease: MORPH_EXPAND_EASE }}
                  onAnimationStart={() => {
                    scheduleSkillsIconFlourish(SKILLS_OVERLAY_MOTION_END_S);
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-auto px-4 sm:px-6"
                  onClick={() => setActiveSubskills(null)}
                >
                  <div
                    role="group"
                    aria-label="Skills detail"
                    className="skills-source-stack flex w-full max-w-[min(100%,1180px)] flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SkillsSubskillsPanel
                      slide={activeSubskills}
                      variant="overlay"
                      onClose={() => setActiveSubskills(null)}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          )}
        </div>
      </div>
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
  // Content mask: keeps main content invisible until after first paint so the
  // background (black) is the only thing visible during JS hydration. No artificial
  // delay — the state flips on the first effect run (immediately after mount).
  const [appReady, setAppReady] = useState(false);
  useEffect(() => { setAppReady(true); }, []);

  const [isResumeMode, setIsResumeMode] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<string | "menu" | null>(null);
  const [menuPanelAtRight, setMenuPanelAtRight] = useState(false);
  const [panelSettled, setPanelSettled] = useState(false);
  const reduceMotion = useReducedMotion();
  const heroInViewRef = useRef<HTMLDivElement | null>(null);
  const isHeroInView = useInView(heroInViewRef, { margin: "-100px 0px 0px 0px" });
  const slidesRef = useRef<HTMLDivElement | null>(null);
  const slideOrder = ["hero", "menu"];
  const [currentSlideId, setCurrentSlideId] = useState<string>("hero");
  const [menuLockedFillId, setMenuLockedFillId] = useState<string | null>(null);
  const [activeShowcaseProjectId, setActiveShowcaseProjectId] = useState<string | null>(null);
  const prevSlideIdRef = useRef<string>("hero");
  const transitionTimeoutsRef = useRef<number[]>([]);
  const hasWarmedProjectMediaRef = useRef(false);
  const projectMediaWarmupRef = useRef<(HTMLImageElement | HTMLVideoElement)[]>([]);
  const isProjectsPage =
    currentSection === "projects" ||
    currentSection === "projects-supporting" ||
    !!currentSection?.startsWith("project-");

  // Single global grid phase so all grid overlays stay in sync (no jolt on panel transition)
  const [gridPhase, setGridPhase] = useState(0);
  useEffect(() => {
    const tick = () => setGridPhase(((performance.now() / 1000) * (GRID_CELL_SIZE / GRID_DRIFT_DURATION)) % GRID_CELL_SIZE);
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, []);

  // Preload all SHOWCASE media once on initial mount so card clicks are instant.
  // Fires after a brief yield to avoid contending with the initial render/paint.
  useEffect(() => {
    if (hasWarmedProjectMediaRef.current) return;
    hasWarmedProjectMediaRef.current = true;

    const timer = window.setTimeout(() => {
      const handles: (HTMLImageElement | HTMLVideoElement)[] = [];

      PROJECT_CARDS.forEach((card) => {
        // Static thumbnail image
        if (card.thumbnail) {
          const img = new Image();
          img.decoding = "async";
          img.src = card.thumbnail;
          handles.push(img);
        }

        // Video poster — must be preloaded so the flying card shows it instantly on click
        if (card.poster) {
          const img = new Image();
          img.decoding = "async";
          img.src = card.poster;
          handles.push(img);
        }

        // Video file
        if (card.thumbnailVideo) {
          const video = document.createElement("video");
          video.preload = "auto";
          video.muted = true;
          video.playsInline = true;
          video.src = card.thumbnailVideo;
          video.load();
          handles.push(video);
        }
      });

      projectMediaWarmupRef.current = handles;
    }, PROJECT_MEDIA_WARMUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentSection !== "projects") {
      setActiveShowcaseProjectId(null);
    }
  }, [currentSection]);

  const handleStart = () => {
    scrollToId("menu", reduceMotion ? "auto" : "smooth");
  };

  const navigateTo = (id: string) => {
    setIsSideNavOpen(false);
    if (isTransitioning) return;

    if (reduceMotion) {
      setCurrentSection(id === "menu" ? null : id);
      setPanelSettled(true);
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
      setPanelSettled(false);
      setCurrentSection(id);
      setTransitionTarget(id);
      setIsTransitioning(true);
      transitionTimeoutsRef.current.push(
        window.setTimeout(() => {
          setIsTransitioning(false);
          setTransitionTarget(null);
          setPanelSettled(true);
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
      style={{
        ...(!isResumeMode ? { backgroundColor: "#0a0a0a", backgroundImage: "none" } : {}),
        // Instant reveal — avoids a live transition on the root element that can
        // be retriggered by React Strict Mode's double-mount in development.
        opacity: appReady ? 1 : 0,
      }}
    >
      {/* Top-right controls (Resume + Hamburger) */}
      <motion.div
        className="fixed top-6 right-4 z-50 flex items-center gap-3"
        initial={false}
        animate={{
          opacity: isResumeMode ? 1 : 1,
          y: 0,
          scale: 1,
        }}
        transition={SPRING.ui}
      >
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
                ? "bg-black text-white border-black hover:bg-zinc-800" 
                : "bg-black text-white border-black hover:bg-white hover:text-black"
            }`}
          >
            {isResumeMode ? <Zap size={24} /> : <FileText size={24} />}
          </Button>
        </motion.div>

        {!isResumeMode && (currentSlideId !== "menu" || currentSection !== null) && (
          <motion.div whileTap={TAP} transition={SPRING.ui}>
            <Button
              type="button"
              onClick={() => setIsSideNavOpen(true)}
              aria-label="Open navigation menu"
              className="h-16 w-16 rounded-full bg-black text-white hover:bg-white hover:text-black border-4 border-black p-0 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Menu size={26} aria-hidden />
            </Button>
          </motion.div>
        )}
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

      {/* Rule-of-thirds overlay on viewport (positioning aid) */}
      {showRuleOfThirds && <ViewportRuleOfThirdsOverlay aria-hidden />}

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
                willChange: "transform",
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
              {!reduceMotion && transitionTarget !== "menu" && transitionTarget === currentSection && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] z-10 pointer-events-none"
                  style={{
                    backgroundColor: SECTION_ACCENT_COLOR[currentSection] ?? "#06b6d4",
                    boxShadow: isProjectsPage ? "none" : accentGlowShadow(SECTION_ACCENT_COLOR[currentSection] ?? "#06b6d4", true),
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
                    boxShadow: isProjectsPage ? "none" : accentGlowShadow(SECTION_ACCENT_COLOR[currentSection] ?? "#06b6d4", true),
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
                className="min-h-screen w-full overflow-x-hidden"
              >
                {currentSection === "profile" && <PhantomProfile />}
                {currentSection === "projects" && (
                  <PalaceProjects
                    onSelectProject={setActiveShowcaseProjectId}
                    onOpenSupporting={() => navigateTo("projects-supporting")}
                    activeProjectId={activeShowcaseProjectId}
                    onBackToCarousel={() => setActiveShowcaseProjectId(null)}
                    settled={panelSettled}
                  />
                )}
                {currentSection === "projects-supporting" && (
                  <SupportingProjectsSection onBack={() => navigateTo("projects")} />
                )}
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
