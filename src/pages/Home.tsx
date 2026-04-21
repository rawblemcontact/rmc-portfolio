// Force rebuild: 2024-05-21
import { motion, AnimatePresence, Variants, useInView, useReducedMotion, useMotionValue, useTransform, animate } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import React, { createContext, useContext, useEffect, useLayoutEffect, useState, useRef, useCallback, startTransition } from "react";
import { createPortal } from "react-dom";
import { Button } from "../components/ui/button";
import { FillIcon } from "../components/FillIcon";
import { UserFilledIcon } from "../components/icons/UserFilledIcon";
import { DUR, EASE, HOVER, SPRING, TAP } from "../lib/motion";
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
  Download,
  Menu,
  X,
  LucideIcon,
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
} from "lucide-react";
import styled from "styled-components";
import { TiltCard } from "../components/TiltCard";
import { WordsPullUp } from "../components/WordsPullUp";
import { FloatingPhone } from "../components/FloatingPhone";
import { ShowcaseAttachedTabStrip, type ShowcaseTabId } from "../components/ShowcaseAttachedTabStrip";
import { FeaturedWritingPdfThumbnail } from "../components/FeaturedWritingPdfThumbnail";
import { PdfFoldLoader } from "../components/PdfFoldLoader";
import { PdfJsDocumentView } from "../components/PdfJsDocumentView";
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
  fade = false,
}: TextShutterProps & { fade?: boolean }) => {
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
          initial={fade ? { opacity: 0 } : { clipPath: closedClip }}
          {...(trigger === "viewport"
            ? {
                whileInView: fade ? { opacity: 1 } : { clipPath: openClip },
                viewport: { once: viewportOnce, margin: "-40px 0px -40px 0px" },
                transition: transition(i),
              }
            : {
                animate: fade ? { opacity: 1 } : { clipPath: openClip },
                transition: transition(i),
              })}
          style={{
            display: "inline-block",
            overflow: fade ? "visible" : "hidden",
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

const scrollToId = (id: string, behavior: ScrollBehavior = "smooth") => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior, block: "nearest", inline: "start" });
};

const PROFILE_ACCENT_SOFT = "color-mix(in srgb, var(--palette-red) 56%, rgb(170 170 170))";
const PROJECTS_ACCENT_SOFT = "color-mix(in srgb, var(--palette-yellow) 44%, rgb(186 186 186))";

const NAV_ITEMS: { id: string; label: string; icon: LucideIcon; color: string; sub: string; microLabel: string }[] = [
  { id: "profile", label: "PROFILE", sub: "Summary", icon: User, color: "[background-color:color-mix(in_srgb,var(--palette-red)_56%,rgb(170_170_170))]", microLabel: "OPEN" },
  { id: "projects", label: "PROJECTS", sub: "Projects", icon: Zap, color: "[background-color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))]", microLabel: "VIEW" },
  { id: "experience", label: "EXPERIENCE", sub: "Career History", icon: Star, color: "bg-portfolio-blue", microLabel: "ENTER" },
  { id: "skills", label: "SKILLS", sub: "Skills", icon: Briefcase, color: "bg-portfolio-green", microLabel: "OPEN" },
  { id: "social", label: "CONTACT", sub: "Contact", icon: Heart, color: "bg-portfolio-orange", microLabel: "VIEW" },
];

// Section id → panel edge accent (CSS vars from src/styles/portfolio-palette.css)
const SECTION_ACCENT_COLOR: Record<string, string> = {
  profile: PROFILE_ACCENT_SOFT,
  projects: PROJECTS_ACCENT_SOFT,
  "project-rawblem": PROJECTS_ACCENT_SOFT,
  "project-slaywire": PROJECTS_ACCENT_SOFT,
  "project-undertale-fhe": PROJECTS_ACCENT_SOFT,
  "project-portfolio": PROJECTS_ACCENT_SOFT,
  "project-undertale-proposal": PROJECTS_ACCENT_SOFT,
  "project-8bit-bumpers": PROJECTS_ACCENT_SOFT,
  "projects-supporting": PROJECTS_ACCENT_SOFT,
  experience: "var(--palette-blue)",
  social: "var(--palette-orange)",
  skills: "var(--palette-green)",
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

const BackToMenuButton = ({
  show,
  onBack,
  ariaLabel = "Back to menu",
  fadeOut = false,
}: {
  show: boolean;
  onBack: () => void;
  ariaLabel?: string;
  fadeOut?: boolean;
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: fadeOut ? 0 : 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: DUR.fast, ease: EASE.out }}
        className="fixed top-5 left-3 z-50 sm:top-6 sm:left-4"
      >
        <motion.div whileTap={TAP} transition={SPRING.ui}>
          <Button
            type="button"
            onClick={onBack}
            size="icon"
            aria-label={ariaLabel}
            className="h-14 w-14 min-h-0 min-w-0 rounded-full border-[3px] border-black bg-black p-0 text-white shadow-xl transition-colors duration-200 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black [&_svg]:!size-[22px]"
          >
            <ArrowLeft size={22} strokeWidth={2} aria-hidden />
          </Button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

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
  titleFade = false,
  subtitleTightTracking = false,
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
  /** When true, title animates with a simple fade instead of the clip-path wipe. */
  titleFade?: boolean;
  /** When true, subtitle uses `tracking-eyebrow-tight` instead of `tracking-eyebrow`. */
  subtitleTightTracking?: boolean;
}) => {
  const sizeClasses = compact ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl";

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
        className={`${sizeClasses} ${titleClassName ?? ""} font-display ${color} leading-[0.95] tracking-[-0.02em] uppercase -translate-y-0.5`}
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
          fade={titleFade}
        />
      </h2>
      {betweenTitleAndSubtitle && (
        <div className="mt-4">{betweenTitleAndSubtitle}</div>
      )}
      {subtitle && (
        <p
          className={`font-heading text-sm leading-snug uppercase text-mono-2/90 mt-1.5 ${
            subtitleTightTracking ? "tracking-eyebrow-tight" : "tracking-eyebrow"
          }`}
        >
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
  onQuickProjects,
  isResumeMode,
  toggleResumeMode,
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
  type FocalPoint = { x: number; y: number };
  const HERO_TUNER_STORAGE_KEY = "hero-slider-tuner-v1";
  const SHOW_HERO_TUNER = false;
  const parseFocalPoint = (value?: string): FocalPoint => {
    if (!value) return { x: 50, y: 50 };
    const [xRaw, yRaw] = value.split(" ");
    const x = Number.parseFloat((xRaw ?? "50").replace("%", ""));
    const y = Number.parseFloat((yRaw ?? "50").replace("%", ""));
    return {
      x: Number.isFinite(x) ? x : 50,
      y: Number.isFinite(y) ? y : 50,
    };
  };

  const reduceMotion = useReducedMotion();
  const heroSlides = PROJECT_CARDS.slice(0, 5);
  const initialHeroSlideIndex = Math.max(
    0,
    heroSlides.findIndex((slide) => slide.id === "project-undertale-fhe"),
  );
  const [fontsReady, setFontsReady] = useState(false);
  const [heroMediaReady, setHeroMediaReady] = useState(false);
  const [heroRevealDelayDone, setHeroRevealDelayDone] = useState(false);
  const [sliderPhaseActive, setSliderPhaseActive] = useState(false);
  const [sliderAnimDone, setSliderAnimDone] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(initialHeroSlideIndex);
  const [heroSlideDirection, setHeroSlideDirection] = useState<1 | -1>(1);
  const [heroSlidePaused, setHeroSlidePaused] = useState(false);
  const [heroFocalLocked, setHeroFocalLocked] = useState<Record<string, FocalPoint>>(() =>
    Object.fromEntries(heroSlides.map((slide) => [slide.id, parseFocalPoint(slide.focalPoint)])),
  );
  const [heroZoomLocked, setHeroZoomLocked] = useState<Record<string, number>>(() =>
    Object.fromEntries(heroSlides.map((slide) => [slide.id, slide.zoom ?? 1])),
  );
  const [heroFocalOverrides, setHeroFocalOverrides] = useState<Record<string, FocalPoint>>({});
  const [heroZoomOverrides, setHeroZoomOverrides] = useState<Record<string, number>>({});
  const [bakeCopied, setBakeCopied] = useState(false);
  const [defaultsApplied, setDefaultsApplied] = useState(false);
  const heroTouchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HERO_TUNER_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        lockedFocal?: Record<string, FocalPoint>;
        lockedZoom?: Record<string, number>;
        focal?: Record<string, FocalPoint>;
        zoom?: Record<string, number>;
      };
      if (parsed.lockedFocal) setHeroFocalLocked(parsed.lockedFocal);
      if (parsed.lockedZoom) setHeroZoomLocked(parsed.lockedZoom);
      if (parsed.focal) setHeroFocalOverrides(parsed.focal);
      if (parsed.zoom) setHeroZoomOverrides(parsed.zoom);
    } catch {
      // Ignore malformed localStorage and keep defaults.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        HERO_TUNER_STORAGE_KEY,
        JSON.stringify({
          lockedFocal: heroFocalLocked,
          lockedZoom: heroZoomLocked,
          focal: heroFocalOverrides,
          zoom: heroZoomOverrides,
        }),
      );
    } catch {
      // Ignore write errors (private mode/quota).
    }
  }, [heroFocalLocked, heroZoomLocked, heroFocalOverrides, heroZoomOverrides]);

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

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const waitForImage = (src?: string) =>
      new Promise<void>((resolve) => {
        if (!src) {
          resolve();
          return;
        }
        const img = new Image();
        const done = () => resolve();
        img.onload = done;
        img.onerror = done;
        img.src = src;
      });

    const waitForVideo = (
      src?: string,
      opts?: { preload?: "none" | "metadata" | "auto"; timeoutMs?: number; useLoadedData?: boolean },
    ) =>
      new Promise<void>((resolve) => {
        if (!src) {
          resolve();
          return;
        }
        const video = document.createElement("video");
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          video.onloadedmetadata = null;
          video.onloadeddata = null;
          video.onerror = null;
          resolve();
        };
        video.preload = opts?.preload ?? "metadata";
        video.muted = true;
        video.playsInline = true;
        video.onloadedmetadata = finish;
        if (opts?.useLoadedData) video.onloadeddata = finish;
        video.onerror = finish;
        video.src = src;
        video.load();
        timers.push(window.setTimeout(finish, opts?.timeoutMs ?? 2500));
      });

    const preloadCriticalHeroMedia = async () => {
      // Gate only on the first visible slide to avoid heavy startup frame drops.
      const firstSlide = heroSlides[0];
      await Promise.allSettled([
        waitForImage(firstSlide?.poster),
        waitForImage(firstSlide?.thumbnail),
        waitForVideo(firstSlide?.thumbnailVideo, {
          preload: "auto",
          timeoutMs: 3200,
          useLoadedData: true,
        }),
      ]);
      if (!cancelled) setHeroMediaReady(true);
    };

    const warmRemainingHeroMedia = () => {
      const rest = heroSlides.slice(1);
      rest.forEach((slide, idx) => {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            void waitForImage(slide.poster);
            void waitForImage(slide.thumbnail);
            void waitForVideo(slide.thumbnailVideo, { preload: "metadata", timeoutMs: 2200 });
          }, 600 + idx * 220),
        );
      });
    };

    preloadCriticalHeroMedia();
    timers.push(window.setTimeout(warmRemainingHeroMedia, 900));
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setHeroMediaReady(true);
      }, 4200),
    );

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const goToHeroSlide = useCallback(
    (nextIndex: number, direction: 1 | -1) => {
      if (heroSlides.length < 2) return;
      const wrapped = (nextIndex + heroSlides.length) % heroSlides.length;
      setHeroSlideDirection(direction);
      setHeroSlideIndex(wrapped);
    },
    [heroSlides.length],
  );

  const goToNextHeroSlide = useCallback(
    () => goToHeroSlide(heroSlideIndex + 1, 1),
    [goToHeroSlide, heroSlideIndex],
  );

  const goToPrevHeroSlide = useCallback(
    () => goToHeroSlide(heroSlideIndex - 1, -1),
    [goToHeroSlide, heroSlideIndex],
  );

  useEffect(() => {
    if (!active) return;
    if (reduceMotion || heroSlidePaused || heroSlides.length < 2) return;
    const t = window.setInterval(() => {
      setHeroSlideDirection(1);
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, [active, reduceMotion, heroSlidePaused, heroSlides.length]);

  useEffect(() => {
    if (!active) {
      setHeroSlidePaused(false);
    }
  }, [active]);

  useEffect(() => {
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
    if (!(fontsReady && heroMediaReady && heroRevealDelayDone)) {
      setSliderPhaseActive(false);
      setSliderAnimDone(false);
      return;
    }
    if (reduceMotion) {
      setSliderPhaseActive(true);
      setSliderAnimDone(true);
      return;
    }
    // Phase 1 text: last element completes at ~0.6s. Hold 0.5s → slider phase at 1.1s.
    const t = window.setTimeout(() => setSliderPhaseActive(true), 1100);
    return () => window.clearTimeout(t);
  }, [fontsReady, heroMediaReady, heroRevealDelayDone, reduceMotion]);

  const onStartClick = () => {
    onStart();
  };

  const gridPhase = useGridPhase();
  const heroReady = fontsReady && heroMediaReady && heroRevealDelayDone;
  const currentHeroSlide = heroSlides[heroSlideIndex];
  const currentFocal = heroFocalOverrides[currentHeroSlide.id] ?? heroFocalLocked[currentHeroSlide.id] ?? parseFocalPoint(currentHeroSlide.focalPoint);
  const currentZoom = heroZoomOverrides[currentHeroSlide.id] ?? heroZoomLocked[currentHeroSlide.id] ?? currentHeroSlide.zoom ?? 1;
  const currentFocalString = `${currentFocal.x}% ${currentFocal.y}%`;
  const currentFitClass = currentZoom < 1 ? "object-contain" : "object-cover";
  const bakedHeroCode = heroSlides
    .map((slide) => {
      const focal = heroFocalOverrides[slide.id] ?? heroFocalLocked[slide.id] ?? parseFocalPoint(slide.focalPoint);
      const zoom = heroZoomOverrides[slide.id] ?? heroZoomLocked[slide.id] ?? slide.zoom ?? 1;
      return `  "${slide.id}": { focalPoint: "${Math.round(focal.x)}% ${Math.round(focal.y)}%", zoom: ${zoom.toFixed(2)} },`;
    })
    .join("\n");

  const copyBakeValues = async () => {
    const payload = [
      "// Paste these into matching PROJECT_CARDS entries:",
      "const HERO_BAKED_VALUES = {",
      bakedHeroCode,
      "};",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(payload);
      setBakeCopied(true);
      window.setTimeout(() => setBakeCopied(false), 1400);
    } catch {
      setBakeCopied(false);
    }
  };

  const applyCurrentAsDefaults = () => {
    const nextLockedFocal: Record<string, FocalPoint> = {};
    const nextLockedZoom: Record<string, number> = {};

    heroSlides.forEach((slide) => {
      const focal = heroFocalOverrides[slide.id] ?? heroFocalLocked[slide.id] ?? parseFocalPoint(slide.focalPoint);
      const zoom = heroZoomOverrides[slide.id] ?? heroZoomLocked[slide.id] ?? slide.zoom ?? 1;
      nextLockedFocal[slide.id] = focal;
      nextLockedZoom[slide.id] = zoom;
    });

    setHeroFocalLocked(nextLockedFocal);
    setHeroZoomLocked(nextLockedZoom);
    setHeroFocalOverrides({});
    setHeroZoomOverrides({});
    setDefaultsApplied(true);
    window.setTimeout(() => setDefaultsApplied(false), 1400);
  };
  return (
    <section
      id="hero"
      className={`relative h-[100svh] w-full overflow-hidden bg-black text-white ${SLIDE_NO_Y_SCROLL}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] grid-drift-bg"
        style={gridOverlayStyle}
      />
      {heroReady && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[5] mx-auto grid h-full w-full max-w-[1680px] grid-rows-[minmax(0,2fr)_minmax(0,1fr)] px-4 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-4 md:px-6 md:pt-[max(1.5rem,env(safe-area-inset-top,0px))] md:pb-5 lg:px-8 lg:pt-[max(2rem,env(safe-area-inset-top,0px))] lg:pb-6"
      >
        <div className="relative flex min-h-0 items-start justify-center">
          <div className="absolute inset-x-0 top-0 w-full max-w-full">
          {sliderPhaseActive && (
          <motion.div
            className="overflow-hidden rounded-[11px] sm:rounded-xl"
            initial={{ scaleY: 0.022 }}
            animate={{ scaleY: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            onAnimationComplete={() => setSliderAnimDone(true)}
            style={{ transformOrigin: "center center", willChange: "transform" }}
          >
          <motion.div
            className="relative mx-auto w-full max-w-full h-[clamp(200px,min(52vh,calc(100svh-11rem-max(1rem,env(safe-area-inset-top,0px)))),620px)] md:h-[clamp(240px,min(54vh,calc(100svh-11rem-max(1.5rem,env(safe-area-inset-top,0px)))),680px)] lg:h-[clamp(260px,min(56vh,calc(100svh-12rem-max(2rem,env(safe-area-inset-top,0px)))),760px)] overflow-hidden rounded-[11px] sm:rounded-xl border border-white/[0.09] bg-black"
            animate={{
              boxShadow: sliderAnimDone
                ? "0 36px 88px rgba(0,0,0,0.6), inset 0 -40px 70px rgba(0,0,0,0.52), 0 0 28px 4px rgba(255,255,255,0.04)"
                : "0 36px 88px rgba(0,0,0,0.6), inset 0 -40px 70px rgba(0,0,0,0.52), 0 0 28px 4px rgba(255,255,255,0.02)",
            }}
            initial={{ boxShadow: "0 36px 88px rgba(0,0,0,0.6), inset 0 -40px 70px rgba(0,0,0,0.52), 0 0 28px 4px rgba(255,255,255,0.02)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHeroSlidePaused(true)}
            onMouseLeave={() => setHeroSlidePaused(false)}
            onTouchStart={(e) => {
              heroTouchStartYRef.current = e.touches[0]?.clientY ?? null;
            }}
            onTouchEnd={(e) => {
              const startY = heroTouchStartYRef.current;
              const endY = e.changedTouches[0]?.clientY;
              heroTouchStartYRef.current = null;
              if (startY == null || endY == null) return;
              const delta = startY - endY;
              if (Math.abs(delta) < 34) return;
              if (delta > 0) goToNextHeroSlide();
              else goToPrevHeroSlide();
            }}
          >

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: sliderAnimDone ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
            <AnimatePresence initial={false} custom={heroSlideDirection}>
              <motion.article
                key={currentHeroSlide.id}
                custom={heroSlideDirection}
                initial={{ y: heroSlideDirection > 0 ? "100%" : "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: heroSlideDirection > 0 ? "-100%" : "100%" }}
                transition={{ duration: reduceMotion ? 0.12 : 0.64, ease: [0.2, 0.9, 0.25, 1] }}
                className="absolute inset-0 transform-gpu"
                style={{ willChange: "transform" }}
              >
                <motion.div
                  initial={{ y: heroSlideDirection > 0 ? "6%" : "-6%" }}
                  animate={{ y: 0 }}
                  exit={{ y: heroSlideDirection > 0 ? "-6%" : "6%" }}
                  transition={{ duration: reduceMotion ? 0.12 : 0.64, ease: [0.2, 0.9, 0.25, 1] }}
                  className="absolute inset-0 transform-gpu"
                  style={{ willChange: "transform" }}
                >
                  {currentHeroSlide.thumbnailVideo ? (
                    <video
                      src={currentHeroSlide.thumbnailVideo}
                      poster={currentHeroSlide.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className={`h-full w-full ${currentFitClass}`}
                      style={{
                        objectPosition: currentFocalString,
                        transform: `scale(${currentZoom})`,
                        transformOrigin: currentFocalString,
                      }}
                    />
                  ) : (
                    <img
                      src={currentHeroSlide.thumbnail}
                      alt={currentHeroSlide.title}
                      className={`h-full w-full ${currentFitClass}`}
                      style={{
                        objectPosition: currentFocalString,
                        transform: `scale(${currentZoom})`,
                        transformOrigin: currentFocalString,
                      }}
                      loading="eager"
                    />
                  )}
                </motion.div>

              </motion.article>
            </AnimatePresence>
            </motion.div>

          </motion.div>
          </motion.div>
          )}
          </div>
        </div>
        <div className="relative z-40 flex min-h-0 flex-col items-center justify-center overflow-visible pt-0">
          {/* Y-transform wrapper: starts above final position during Phase 1,
              settles when sliderPhaseActive fires with slider open */}
          <motion.div
            className="mx-auto flex h-full w-full max-w-[1220px] flex-col items-center justify-center gap-3 md:gap-4 px-1 py-2 sm:py-3"
            initial={{ y: "-33vh" }}
            animate={{ y: sliderPhaseActive ? 0 : "-33vh" }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            <div className="mx-auto min-w-0 w-full max-w-[min(100%,60rem)] text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.52, delay: 0.1, ease: EASE.out }}
                className="relative mb-2.5 flex flex-wrap justify-center gap-x-2 gap-y-1 font-display text-[clamp(2.35rem,7vw,6rem)] leading-[0.93] tracking-[-0.02em] uppercase sm:gap-x-3 md:whitespace-nowrap"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.075)" }}
              >
                <span className="inline-block text-white" style={{ letterSpacing: "0.02em", fontKerning: "none" }}>
                  ROBBIE
                </span>
                <span className="inline-block text-white" style={{ letterSpacing: "0.02em", fontKerning: "none" }}>
                  MCLAUGHLIN
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: EASE.out }}
                className="font-hero-subheading text-base sm:text-lg leading-snug text-mono-2/90 uppercase"
              >
                WRITER / DIGITAL MEDIA / NARRATIVE SYSTEMS
              </motion.p>
            </div>

            <motion.div
              ref={heroInViewRef}
              initial={{ opacity: 0, y: 8 }}
              animate={sliderAnimDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.42, delay: sliderAnimDone ? 0.15 : 0, ease: EASE.out }}
              className="mt-0.5 w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <motion.button
                type="button"
                onClick={onStartClick}
                className="playstore-button playstore-button--primary font-display"
                whileHover={{ y: -1 }}
                whileTap={TAP}
                transition={SPRING.ui}
              >
                <span className="texts inline-flex items-center gap-1.5">
                  PORTFOLIO
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        {SHOW_HERO_TUNER && (
          <div
            className="absolute right-3 top-3 z-50 w-[min(90vw,18rem)] rounded border border-white/15 bg-black/85 px-3 py-2.5 backdrop-blur-sm"
            onMouseEnter={() => setHeroSlidePaused(true)}
            onMouseLeave={() => setHeroSlidePaused(false)}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mono-2/90">Hero crop/zoom tuner</p>
            <p className="mt-1 truncate font-display text-xs uppercase text-white/95">{currentHeroSlide.title}</p>
            <div className="mt-2 space-y-2">
              <label className="block">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-mono-2/70">
                  X ({Math.round(currentFocal.x)}%)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentFocal.x}
                  onChange={(e) => {
                    const nextX = Number(e.target.value);
                    setHeroFocalOverrides((prev) => ({
                      ...prev,
                      [currentHeroSlide.id]: { x: nextX, y: currentFocal.y },
                    }));
                  }}
                  className="h-1.5 w-full accent-zinc-200"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-mono-2/70">
                  Y ({Math.round(currentFocal.y)}%)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentFocal.y}
                  onChange={(e) => {
                    const nextY = Number(e.target.value);
                    setHeroFocalOverrides((prev) => ({
                      ...prev,
                      [currentHeroSlide.id]: { x: currentFocal.x, y: nextY },
                    }));
                  }}
                  className="h-1.5 w-full accent-zinc-200"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-mono-2/70">
                  Zoom ({currentZoom.toFixed(2)}x)
                </span>
                <input
                  type="range"
                  min={0.7}
                  max={1.8}
                  step={0.01}
                  value={currentZoom}
                  onChange={(e) => {
                    const nextZoom = Number(e.target.value);
                    setHeroZoomOverrides((prev) => ({
                      ...prev,
                      [currentHeroSlide.id]: nextZoom,
                    }));
                  }}
                  className="h-1.5 w-full accent-zinc-200"
                />
              </label>
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
              object-position: {currentFocalString} | zoom: {currentZoom.toFixed(2)}x
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={copyBakeValues}
                className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
              >
                {bakeCopied ? "Copied" : "Copy baked values"}
              </button>
              <button
                type="button"
                onClick={applyCurrentAsDefaults}
                className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
              >
                {defaultsApplied ? "Applied" : "Auto-apply"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
      )}
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
    const t = window.setTimeout(() => setPlayLabels(true), 140);
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
            <p className="font-heading text-sm tracking-eyebrow leading-snug uppercase text-mono-2/90 mb-1.5">NAVIGATION</p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em] uppercase">MENU</h2>
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
                  <span className="font-mono text-xs text-mono-2/70 tabular-nums w-8 md:w-10 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <FillIcon
                    icon={item.icon}
                    filledIcon={item.id === "profile" ? UserFilledIcon : undefined}
                    forceFilled={lockedFillId === item.id || hoveredId === item.id}
                    className="w-5 h-5 md:w-6 md:h-6 text-white shrink-0 ml-3 md:ml-4"
                    strokeWidth={1.5}
                  />
                  <motion.span
                    className="font-display text-lg md:text-xl tracking-nav-caps leading-snug uppercase text-white pl-3 md:pl-4 block"
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
        <motion.nav
          key="sidenav-nav"
            aria-label="Navigation"
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-[60] w-full max-w-[380px] sm:max-w-[400px] bg-black border-l-[3px] border-white/20 p-5 sm:p-6 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SPRING.panel}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-y-1.5">
                <p className="font-mono text-[0.65rem] sm:text-xs text-mono-2/90 tracking-widest uppercase">MENU</p>
                <p className="font-display text-2xl sm:text-3xl tracking-nav-caps uppercase leading-[0.95]">Navigate</p>
              </div>
              <motion.div whileTap={TAP} transition={SPRING.ui}>
                <Button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="h-14 w-14 min-h-0 min-w-0 rounded-full bg-black text-white hover:bg-white hover:text-black border-[3px] border-black p-0 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black [&_svg]:!size-5"
                >
                  <X size={22} strokeWidth={1} aria-hidden />
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
                  className="group relative w-full text-left py-3 sm:py-3.5 border-b border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-inset"
                  whileTap={TAP}
                  transition={SPRING.ui}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="font-mono text-[0.65rem] sm:text-xs text-mono-2/70 tabular-nums w-7 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <FillIcon
                        icon={item.icon}
                        filledIcon={item.id === "profile" ? UserFilledIcon : undefined}
                        forceFilled={hoveredId === item.id}
                        className="w-4 h-4 md:w-[1.125rem] md:h-[1.125rem] text-white shrink-0 ml-2 md:ml-3"
                        strokeWidth={1.5}
                      />
                      <motion.span
                        className="font-display text-sm sm:text-base tracking-nav-caps leading-snug uppercase text-white pl-2 sm:pl-3 block"
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

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="mb-3">
                <span className="text-mono-2/90 font-mono text-[0.65rem] sm:text-xs uppercase tracking-widest">
                  CONTACT
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <motion.a
                  href="#"
                  aria-label="YouTube"
                  whileHover={{ y: -3 }}
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
                  className="bg-black p-2 sm:p-2.5 rounded-full text-blue-500 transition-colors border border-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Linkedin size={16} aria-hidden />
                </motion.a>
                <motion.a
                  href="#"
                  aria-label="TikTok"
                  whileHover={{ y: -3 }}
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
                  className="bg-black p-2 sm:p-2.5 rounded-full text-pink-500 transition-colors border border-pink-500/20 hover:border-pink-500/50 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <SiInstagram size={16} aria-hidden className="fill-current" />
                </motion.a>
                <motion.a
                  href="mailto:robbie@example.com"
                  aria-label="Email"
                  whileHover={{ y: -3 }}
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

// --- PROFILE (About) ---
const SectionGridOverlay = ({
  projectDetailActive = false,
}: {
  /** SHOWCASE: slightly recess grid when project detail overlay is open. */
  projectDetailActive?: boolean;
} = {}) => {
  const phase = useGridPhase();
  return (
    <>
      <div
        className={[
          "pointer-events-none absolute inset-0 z-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out",
          projectDetailActive ? "opacity-[0.018]" : "opacity-[0.04]",
        ].join(" ")}
        style={{ ...gridOverlayStyle, backgroundPosition: `${phase}px ${phase}px` }}
        aria-hidden
      />
      {projectDetailActive ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out bg-black/[0.14]"
          aria-hidden
        />
      ) : null}
    </>
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

const PhantomProfile = () => {
  const profileLeftRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const rawblemRef = useRef<HTMLDivElement>(null);
  const profileLeftInView = useInView(profileLeftRef, { once: false, amount: 0.2 });
  const dividerInView = useInView(dividerRef, { once: false, amount: 0.5 });
  const rawblemInView = useInView(rawblemRef, { once: false, amount: 0.2 });
  const [overlayRevealed, setOverlayRevealed] = useState(false);
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
            className="min-w-0 lg:order-1 w-full lg:w-auto lg:max-w-[38rem] xl:max-w-[40rem] 2xl:max-w-[44rem] lg:shrink-0 lg:mt-0"
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
               className="relative w-full max-w-xl xl:max-w-2xl 2xl:max-w-2xl mt-1 min-h-[2px] -ml-[3px]"
             >
               <motion.span
                 aria-hidden
                className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
                style={{ backgroundColor: PROFILE_ACCENT_SOFT }}
                 initial={false}
                 animate={{ scaleX: dividerInView ? 1 : 0 }}
                 transition={{ duration: RED_LINE_DURATION_MS / 1000, delay: RED_LINE_DELAY_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
               />
            </div>
            <motion.div
              className="relative mt-4 sm:mt-5 w-full min-w-0 max-w-xl xl:max-w-2xl 2xl:max-w-2xl -ml-[3px] pe-[max(0.75rem,env(safe-area-inset-right,0px))] sm:pe-4 rounded-[0_0.85rem] border border-white/[0.06] [background:linear-gradient(rgb(0_0_0/0.62),rgb(0_0_0/0.62)),linear-gradient(rgb(9_9_11/0.88),rgb(9_9_11/0.88))] px-3 py-2 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-4 sm:py-2.5"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: overlayRevealed ? 0 : -24, opacity: overlayRevealed ? 1 : 0 }}
              transition={{ duration: BUTTON_FADE_DURATION_MS / 1000, delay: overlayRevealed ? BUTTONS_DELAY_AFTER_SUMMARY_MS / 1000 : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-heading w-full min-w-0 max-w-full text-balance text-sm tracking-eyebrow leading-snug uppercase text-mono-2/90 max-sm:whitespace-normal sm:whitespace-nowrap sm:overflow-x-auto sm:overflow-y-visible sm:no-scrollbar">
                Victoria, BC <span className="text-mono-2/35 mx-0.5 sm:mx-1" aria-hidden>•</span> BA WRITING{" "}
                <span className="text-mono-2/35 mx-0.5 sm:mx-1" aria-hidden>•</span> DIGITAL MEDIA
              </p>
            </motion.div>
             <motion.div
               className="mt-8 max-w-xl sm:mt-9 xl:max-w-2xl 2xl:max-w-2xl -ml-[3px] rounded-[0_1rem] border border-white/[0.06] [background:linear-gradient(rgb(0_0_0/0.62),rgb(0_0_0/0.62)),linear-gradient(rgb(9_9_11/0.88),rgb(9_9_11/0.88))] px-4 py-4 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-5 sm:py-5"
               initial={{ opacity: 0, y: 14 }}
               animate={{ opacity: overlayRevealed ? 1 : 0, y: overlayRevealed ? 0 : 14 }}
               transition={{ duration: SUMMARY_DURATION_S, delay: overlayRevealed ? SUMMARY_DELAY_S : 0, ease: [0.16, 1, 0.3, 1] }}
             >
               <p className="font-heading text-sm tracking-eyebrow leading-snug uppercase mb-1.5" style={{ color: PROFILE_ACCENT_SOFT }}>SUMMARY</p>
               <p className="font-body text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl text-mono-2 leading-relaxed mb-4">
                 Communications-focused writer and digital media coordinator with experience producing narrative-driven web content and managing social media workflows across multiple platforms. Combines narrative storytelling with platform-native content production and distribution. Bachelor of Arts in Writing (Distinction), University of Victoria.
               </p>
               <p className="font-heading text-sm tracking-eyebrow leading-snug uppercase mb-1.5" style={{ color: PROFILE_ACCENT_SOFT }}>CURRENT WORK</p>
               <ul className="font-body text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl text-mono-2/90 leading-relaxed mb-4 ml-3 list-disc list-outside space-y-2 pl-6 sm:pl-7 marker:text-mono-2/50">
                 <li>Currently developing SLAYWIRE, a narrative-first RPG.</li>
                 <li>
                   RAWBLEM - Creative brand producing narrative-driven short-form content across TikTok, Instagram Reels, and YouTube Shorts.
                 </li>
               </ul>
               <p className="font-heading text-sm tracking-eyebrow leading-snug uppercase mb-1.5" style={{ color: PROFILE_ACCENT_SOFT }}>AVAILABILITY</p>
               <ul className="font-body text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl text-mono-2 leading-relaxed ml-3 list-disc list-outside space-y-2 pl-6 sm:pl-7 marker:text-mono-2/50">
                 <li>Full-Time Content, Communications, or Digital Media roles.</li>
               </ul>
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
  readonly tagline: string;
  readonly thumbnail?: string;
  readonly thumbnailVideo?: string;
  readonly poster?: string;
  /** Optional crop focus for `object-cover` (e.g. "50% 36%"). */
  readonly focalPoint?: string;
  /** Optional per-project hero zoom baseline (1 = default cover scale). */
  readonly zoom?: number;
  /** Detail overlay — fixed section order: Overview, Role, Tools, Impact. */
  readonly detailOverview?: string;
  readonly detailRole?: string;
  readonly detailTools?: readonly string[];
  readonly detailImpact?: string;
};

const PROJECT_CARDS: readonly ShowcaseProjectCard[] = [
  {
    id: "project-rawblem",
    title: "RAWBLEM",
    tagline: "Creative brand & short-form content system",
    thumbnailVideo: "/rawblem-thumbnail.mp4",
    poster: "/rawblem-thumbnail-poster.jpg",
    focalPoint: "50% 34%",
    detailOverview:
      "A focused creative brand built around short-form video and repeatable content beats—treatment, capture, and platform-native packaging.",
    detailRole: "Sole creator: concept, production, edit, and distribution.",
    detailTools: ["CapCut", "DaVinci Resolve", "Hootsuite", "TikTok / Reels / Shorts"],
    detailImpact: "Story-first formats tuned for retention; multi-platform publishing with consistent voice and visual DNA.",
  },
  {
    id: "project-8bit-bumpers",
    title: "8-bit Film Festival bumpers",
    tagline: "Pixel animation project",
    thumbnail: "/8bit-festival-thumbnail.jpg",
    focalPoint: "50% 42%",
    detailOverview:
      "Pixel-style bumpers and interstitials for a film festival program—simple loops, readable typography, and arcade-era restraint.",
    detailRole: "Animation, art direction, and asset delivery for playback.",
    detailTools: ["Pixel workflow / raster", "Timeline-based editing"],
    detailImpact: "Clear on-screen branding between screenings without overpowering the main features.",
  },
  {
    id: "project-undertale-fhe",
    title: "UNDERTALE — Forever Home Edition",
    tagline: "Game project · GameMaker Studio 2",
    thumbnail: "/undertale-fhe-thumbnail.png",
    focalPoint: "50% 40%",
    detailOverview:
      "A GameMaker Studio 2 project exploring Undertale-inspired tone and structure—rooms, encounters, and narrative pacing as design problems.",
    detailRole: "Design, implementation, and iteration in GMS2.",
    detailTools: ["GameMaker Studio 2"],
    detailImpact: "Hands-on practice shipping playable slices and tightening feel through playtesting.",
  },
  {
    id: "project-portfolio",
    title: "Portfolio Website",
    tagline: "React, Vite, Framer Motion",
    thumbnailVideo: "/portfolio-website-thumbnail-v2.mp4",
    poster: "/portfolio-website-thumbnail-v2-poster.jpg",
    focalPoint: "50% 38%",
    detailOverview:
      "A client-side portfolio with motion-forward UI, editorial grids, and careful performance budgets for media-heavy sections.",
    detailRole: "Design and front-end implementation.",
    detailTools: ["React", "Vite", "TypeScript", "Tailwind CSS", "Framer Motion"],
    detailImpact:
      "Single deployable artifact, fast iteration, and a cohesive Neo‑Tokyo / command UI visual language.",
  },
  {
    id: "project-slaywire",
    title: "SLAYWIRE",
    tagline: "Original graphic novel & narrative IP",
    thumbnail: "/slaywire-thumbnail.png",
    focalPoint: "50% 40%",
    detailOverview:
      "Original long-form illustrated narrative—worldbuilding, cast, and visual development for a standalone graphic novel.",
    detailRole: "Writer, illustrator, and world/visual development.",
    detailTools: ["Digital illustration", "Layout & print-minded pacing"],
    detailImpact: "A durable IP bible and finished spreads that support pitching and incremental publishing.",
  },
  {
    id: "project-undertale-proposal",
    title: "EDITS",
    tagline: "Video project",
    thumbnailVideo: "/edits-meme1-online.mp4",
    poster: "/edits-meme1-online-poster.jpg",
    focalPoint: "50% 36%",
    detailOverview:
      "Short-form edits built around timing, meme literacy, and platform-native pacing—hooks, captions, and sound-led moments.",
    detailRole: "Editor and creative director for individual cuts.",
    detailTools: ["CapCut", "DaVinci Resolve"],
    detailImpact: "Sharper retention in the first seconds; clearer punchlines and readable on-screen text.",
  },
];

const cardEase = [0.25, 0.46, 0.45, 0.94] as const;

type SupportingArchivePdfItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** Short blurb for FEATURED WRITING showcase (optional). */
  description?: string;
  /** Optional display ordering label (e.g. screenplay numbering). */
  index?: string;
};

/** Creative nonfiction PDFs — `client/public/cnf/`. */
const SUPPORTING_ARCHIVE_PDF_ITEMS: SupportingArchivePdfItem[] = [
  {
    id: "cnf-article",
    title: "Article",
    subtitle: "Example 1 — article",
    href: "/cnf/example-1-article.pdf",
    description:
      "Magazine-style creative nonfiction: structure, voice, and scene craft in a publication-ready article. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  {
    id: "cnf-media-literary",
    title: "Media literary analysis",
    subtitle: "Example 2 — media & text",
    href: "/cnf/example-2-media-literary-analysis.pdf",
    description:
      "Pairs media with written work—examining how form, context, and craft shape meaning across text and screen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  {
    id: "cnf-critical-essay",
    title: "Critical literary essay",
    subtitle: "Example 3 — critical analysis",
    href: "/cnf/example-3-critical-literary-essay.pdf",
    description:
      "Close reading and argument: a thesis-driven essay that interprets literary texts with evidence and scholarly framing.",
  },
  {
    id: "cnf-memoir",
    title: "Memoir",
    subtitle: "Example 4 — memoir",
    href: "/cnf/example-4-memoir.pdf",
  },
];

/** Screenplays — `client/public/screenplays/`. */
const SCREENPLAY_PDF_ITEMS: SupportingArchivePdfItem[] = [
  {
    id: "screenplay-audience-of-one",
    title: "Audience of One",
    subtitle: "Robbie McLaughlin",
    href: "/screenplays/audience-of-one-robbie-mclaughlin.pdf",
    description:
      "A short screenplay tuned for pacing, dialogue, and character—formatted and structured like a production-ready spec. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
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

/** Short graphic novel PDFs — `client/public/short-graphic-novels/`. */
const SHORT_GRAPHIC_NOVEL_PDF_ITEMS: SupportingArchivePdfItem[] = [
  {
    id: "sgn-blossom-ink-bw",
    title: "Blossom",
    subtitle: "Ink — black & white",
    href: "/short-graphic-novels/blossom-ink-bw.pdf",
    description:
      "Inked sequential pages in black and white: line weight, contrast, and panel flow for the graphic-novel short. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  {
    id: "sgn-writ405-final",
    title: "WRIT405",
    subtitle: "Final revision — Robbie McLaughlin",
    href: "/short-graphic-novels/writ405-final-revision-robbie-mclaughlin.pdf",
  },
  {
    id: "sgn-blossom-thumbnails",
    title: "Blossom",
    subtitle: "Thumbnails — Robbie McLaughlin",
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
  { heading: "Creative nonfiction — PDF", items: SUPPORTING_ARCHIVE_PDF_ITEMS },
  { heading: "Screenplays — PDF", items: SCREENPLAY_PDF_ITEMS },
  { heading: "Short graphic novels — PDF", items: SHORT_GRAPHIC_NOVEL_PDF_ITEMS },
];

/** Featured PDF per FEATURED WRITING tab (order matches tab strip). */
const SHOWCASE_WRITING_TAB_FEATURED: Record<ShowcaseTabId, SupportingArchivePdfItem> = {
  "tab-1": SUPPORTING_ARCHIVE_PDF_ITEMS.find((x) => x.id === "cnf-article")!,
  "tab-2": SCREENPLAY_PDF_ITEMS.find((x) => x.id === "screenplay-audience-of-one")!,
  "tab-3": SHORT_GRAPHIC_NOVEL_PDF_ITEMS.find((x) => x.id === "sgn-blossom-ink-bw")!,
  "tab-4": SUPPORTING_ARCHIVE_PDF_ITEMS.find((x) => x.id === "cnf-critical-essay")!,
  "tab-5": SUPPORTING_ARCHIVE_PDF_ITEMS.find((x) => x.id === "cnf-media-literary")!,
};

const archiveRowIndexLabel = (rowIndex: number) => String(rowIndex + 1).padStart(2, "0");

/** Showcase carousel parallax tween (same idea as Embla “Predefined → Parallax”). */
const PROJECT_CAROUSEL_TWEEN_FACTOR_BASE = 0.52;
const PROJECT_MEDIA_WARMUP_DELAY_MS = 20;

/** Divide showcase + card→detail durations by this for a uniform speed-up (1.2 → 20% faster). */
const SHOWCASE_TIME_DIV = 1.2;
const PROJECT_CARD_AUTOPLAY_DELAY_MS = Math.round(360 / SHOWCASE_TIME_DIV);
const SHOWCASE_GATE_S = 0.02 / SHOWCASE_TIME_DIV;
const SHOWCASE_STAGGER_S = 0.09 / SHOWCASE_TIME_DIV;
const SHOWCASE_CHILD_DUR_S = 0.34 / SHOWCASE_TIME_DIV;
const SHOWCASE_EASE = [0.16, 1, 0.3, 1] as const;
const SHOWCASE_FADE_TOTAL_MS = Math.round((SHOWCASE_GATE_S + SHOWCASE_STAGGER_S + SHOWCASE_CHILD_DUR_S) * 1000);
/** Fade when swapping SHOWCASE carousel ↔ Supporting & archive in place */
const SHOWCASE_SUBROUTE_FADE_S = DUR.fast;
/** FLIP morph: carousel card → detail hero (ease matches SHOWCASE_EASE for one continuous feel). */
const SHOWCASE_CARD_MORPH_DUR_S = 0.36 / SHOWCASE_TIME_DIV;
/** Carousel chrome fades while the flying card moves — slightly shorter than morph so the handoff reads clean. */
const SHOWCASE_CARD_OPEN_FADE_S = 0.34 / SHOWCASE_TIME_DIV;
/** Extra speed for project-detail title + grid fades (÷ on top of SHOWCASE_TIME_DIV). */
const DETAIL_TEXT_FADE_EXTRA_DIV = 1.12;
/** Copy below hero: CSS transitions + rAF defer — short opacity, dominant slide. */
const DETAIL_HDR_OPACITY_MS = Math.round(95 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_HDR_SLIDE_MS = Math.round(280 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_HDR_SLIDE_PX = Math.round(22 / SHOWCASE_TIME_DIV);
const DETAIL_GRID_OPACITY_MS = Math.round(110 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_GRID_SLIDE_MS = Math.round(300 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_GRID_SLIDE_PX = Math.round(28 / SHOWCASE_TIME_DIV);
const DETAIL_ROW1_AFTER_HDR_MS = Math.round(18 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
const DETAIL_ROW2_STAGGER_MS = Math.round(62 / SHOWCASE_TIME_DIV / DETAIL_TEXT_FADE_EXTRA_DIV);
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

/** Match showcase carousel card height (same as `motion.button` project cards). Capped with svh so SHOWCASE + FEATURED fit one screen with bottom gutter — no scroll. */
const DETAIL_CARD_H =
  "h-[min(280px,45svh)] sm:h-[min(308px,48svh)] md:h-[min(328px,50svh)] lg:h-[min(352px,52svh)] xl:h-[min(368px,54svh)] 2xl:h-[min(384px,56svh)]";

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
    /** `start` keeps a flush left snap so 2-up shows exactly two full cards; `center` offsets scroll and peeks neighbors. */
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: false,
    containScroll: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplayIndices, setAutoplayIndices] = useState<number[]>([]);
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
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenFactor(emblaApi);

    let cancelled = false;
    const deferInitialSync = () => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          tweenParallax(emblaApi);
          syncCarouselUi();
        });
      });
    };
    deferInitialSync();

    emblaApi.on("scroll", scheduleTween);
    emblaApi.on("reInit", setTweenFactor);
    emblaApi.on("reInit", tweenParallax);
    emblaApi.on("reInit", syncCarouselUi);
    emblaApi.on("select", syncCarouselUi);

    return () => {
      cancelled = true;
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
    setAutoplayIndices([]);

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
    const syncVisibleAutoplay = () => {
      if (!emblaApi) {
        setAutoplayIndices(PROJECT_CARDS[selectedIndex]?.thumbnailVideo ? [selectedIndex] : []);
        return;
      }
      const visible = emblaApi.slidesInView();
      const playable = visible.filter((idx) => !!PROJECT_CARDS[idx]?.thumbnailVideo);
      setAutoplayIndices(playable);
    };

    syncVisibleAutoplay();
    emblaApi?.on("select", syncVisibleAutoplay);
    emblaApi?.on("reInit", syncVisibleAutoplay);
    return () => {
      emblaApi?.off("select", syncVisibleAutoplay);
      emblaApi?.off("reInit", syncVisibleAutoplay);
    };
  }, [autoplayGateOpen, selectedIndex, emblaApi]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (autoplayIndices.includes(index)) {
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
  }, [autoplayIndices]);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[min(100%,56rem)] flex-col justify-center items-center pt-2 px-1 pb-0 sm:pt-3 sm:px-2 overflow-x-visible overflow-y-visible lg:max-w-[min(100%,72rem)] xl:max-w-[min(100%,84rem)] 2xl:max-w-[min(100%,96rem)]">
      {/*
       * Single horizontal inset for dots + viewport so the pager lines up with card side borders (same as FEATURED WRITING below).
       */}
      <div className="w-full min-w-0 px-2 sm:px-4 lg:px-2 xl:px-3">
        <div className="mb-1.5 flex w-full items-center justify-end">
          <div className="flex -translate-x-1 items-center gap-2.5 sm:-translate-x-1.5 lg:-translate-x-1 xl:-translate-x-1.5">
            {(emblaApi?.scrollSnapList() ?? []).map((_, snapIdx) => (
              <button
                key={`showcase-dot-${snapIdx}`}
                type="button"
                onClick={() => emblaApi?.scrollTo(snapIdx)}
                aria-label={`Go to slide ${snapIdx + 1}`}
                aria-current={selectedIndex === snapIdx ? "true" : undefined}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  selectedIndex === snapIdx
                    ? "bg-white scale-110"
                    : "bg-white/35 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="min-w-0 max-w-full w-full overflow-hidden [--slide-gap:0.875rem] sm:[--slide-gap:1.25rem] lg:[--slide-gap:1rem] xl:[--slide-gap:1.125rem]">
        {/*
         * Slides: 1× full width < lg; lg+ 2 columns. Embla `align: start` + clip + slightly under-filled halves = no neighbor slivers.
         */}
        <div ref={emblaRef} className="overflow-x-clip overflow-y-hidden">
          <div className="flex items-stretch touch-pan-y [-webkit-touch-callout:none] -ml-[var(--slide-gap)]">
            {PROJECT_CARDS.map((card, index) => (
              <div
                key={card.id}
                className="flex min-w-0 shrink-0 grow-0 justify-center pl-[var(--slide-gap)] flex-[0_0_100%] lg:flex-[0_0_calc((100%-4px)/2)]"
              >
                <motion.button
                  type="button"
                  data-carousel-card
                  onClick={(e) => onSelect(card.id, e.currentTarget)}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.28 / SHOWCASE_TIME_DIV, ease: cardEase }}
                  className={`group relative w-full ${DETAIL_CARD_H} rounded-[11px] sm:rounded-xl border border-white/[0.09] bg-zinc-950/40 shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9)] text-center overflow-hidden transition-[opacity,background-color,border-color] duration-300 ease-out hover:border-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] hover:bg-zinc-950/65 hover:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    focusProjectId && focusProjectId !== card.id ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
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
                              preload={index === selectedIndex ? "metadata" : "none"}
                              aria-label={`${card.title} preview`}
                              className="block h-full w-full object-cover"
                              style={{ objectPosition: card.focalPoint ?? "50% 50%" }}
                            />
                          ) : (
                            <img
                              src={card.thumbnail}
                              alt={`${card.title} thumbnail`}
                              loading="lazy"
                              decoding="async"
                              fetchPriority={index === selectedIndex ? "high" : "low"}
                              className="h-full w-full object-cover"
                              style={{ objectPosition: card.focalPoint ?? "50% 50%" }}
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
                                ? "opacity-100 group-hover:text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))]"
                                : "opacity-70 group-hover:text-mono-1"
                            }`}
                          >
                            {card.title}
                          </span>
                          <span className="font-body mt-3 block w-full max-w-full text-left text-xs sm:text-[0.8125rem] md:text-sm lg:text-[0.9375rem] text-mono-2 leading-relaxed line-clamp-2 border-t border-white/15 pt-3 sm:pt-3.5 transition-colors group-hover:text-white/90">
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
                              ? "opacity-100 group-hover:text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))]"
                              : "opacity-0 pointer-events-none"
                          }`}
                          aria-hidden={index !== selectedIndex}
                        >
                          {card.title}
                        </span>
                        <span className="font-body w-full max-w-full text-xs sm:text-[0.8125rem] md:text-sm lg:text-[0.9375rem] text-mono-2/70 leading-relaxed line-clamp-4 border-t border-white/10 pt-3 sm:pt-3.5 transition-colors group-hover:text-mono-2/90">
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
      </div>
    </div>
  );
};

/** WRITING SAMPLES + CAREER OVERVIEW — optical scrollbar rail (desktop lg+). */
const PORTFOLIO_SECTION_SCROLLBAR_VISIBLE_MS = 450;
const PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX = 1024;
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

const SupportingProjectsSection = ({
  onNavTransitionChange,
  pendingPdfFromShowcase = null,
  onPendingPdfFromShowcaseConsumed,
  onReturnToShowcaseAfterFeaturedPreview,
}: {
  onNavTransitionChange?: (active: boolean) => void;
  /** When set (e.g. from FEATURED WRITING VIEW / preview), opens the PDF loader for this item once. */
  pendingPdfFromShowcase?: SupportingArchivePdfItem | null;
  onPendingPdfFromShowcaseConsumed?: () => void;
  /** After closing a PDF that was opened from FEATURED WRITING — go back to SHOWCASE without lingering on this page. */
  onReturnToShowcaseAfterFeaturedPreview?: () => void;
} = {}) => {
  const [previewPdf, setPreviewPdf] = useState<SupportingArchivePdfItem | null>(null);
  /** Full loader overlay (fold + label); fades out first once the PDF is ready. */
  const [showPdfLoaderOverlay, setShowPdfLoaderOverlay] = useState(true);
  /** Modal frame + PDF visible only after loader exit completes. */
  const [showPdfFrame, setShowPdfFrame] = useState(false);
  const [previewPdfReady, setPreviewPdfReady] = useState(false);
  const [queuedPreviewPdf, setQueuedPreviewPdf] = useState<SupportingArchivePdfItem | null>(null);
  const [isPrePreviewFading, setIsPrePreviewFading] = useState(false);
  const [isPreviewClosing, setIsPreviewClosing] = useState(false);
  const reduceMotion = useReducedMotion();
  const preFadeTimerRef = useRef<number | null>(null);
  const closePreviewTimerRef = useRef<number | null>(null);
  const readyHoldTimerRef = useRef<number | null>(null);
  const returnGateTimerRef = useRef<number | null>(null);
  const archiveScrollHostRef = useRef<HTMLDivElement | null>(null);
  const archiveScrollAreaRef = useRef<HTMLDivElement | null>(null);
  const archiveScrollContentRef = useRef<HTMLDivElement | null>(null);
  const archiveOpticalRailWrapRef = useRef<HTMLDivElement | null>(null);
  const archiveOpticalTrackRef = useRef<HTMLDivElement | null>(null);
  const archiveOpticalThumbRef = useRef<HTMLDivElement | null>(null);
  const archiveFirstYellowRuleRef = useRef<HTMLHeadingElement | null>(null);
  const archiveScrollHideTimerRef = useRef<number | null>(null);
  const openedFeaturedPreviewRef = useRef(false);

  /** Archive section + dim scrim fade (dialog can mount mid-fade — see mount delay). */
  const PREVIEW_PRE_FADE_S = 0.16;
  /** Show PDF modal this soon after click so loader appears before archive fade finishes. */
  const PREVIEW_PDF_MOUNT_MS = 96;
  const PREVIEW_HANDOFF_MS = 8;
  const PREVIEW_CLOSE_FADE_S = 0.34;
  const PREVIEW_RETURN_GATE_MS = 70;
  const PREVIEW_READY_HOLD_MS = 32;
  /** Shell fade; loader fades in after so nested opacity doesn’t hide it. */
  const PREVIEW_PDF_DIALOG_FADE_S = 0.175;
  /** Was ~0.41s after mount; halved to tighten gap after archive fades. */
  const PREVIEW_LOADER_FADE_IN_DELAY_S = PREVIEW_PDF_DIALOG_FADE_S + 0.03;
  const PREVIEW_LOADER_FADE_IN_S = 0.55;
  const PREVIEW_LOADER_FADE_OUT_S = 0.6;

  const closePreview = useCallback(() => {
    // Prevent exiting while loader is still active; allow only after preview is ready.
    if (previewPdf && !showPdfFrame && !isPreviewClosing) return;

    if (preFadeTimerRef.current !== null) {
      window.clearTimeout(preFadeTimerRef.current);
      preFadeTimerRef.current = null;
    }
    if (readyHoldTimerRef.current !== null) {
      window.clearTimeout(readyHoldTimerRef.current);
      readyHoldTimerRef.current = null;
    }
    if (closePreviewTimerRef.current !== null) {
      window.clearTimeout(closePreviewTimerRef.current);
      closePreviewTimerRef.current = null;
    }
    if (returnGateTimerRef.current !== null) {
      window.clearTimeout(returnGateTimerRef.current);
      returnGateTimerRef.current = null;
    }
    if (previewPdf && !reduceMotion) {
      setIsPreviewClosing(true);
      closePreviewTimerRef.current = window.setTimeout(() => {
        const returnToShowcase = openedFeaturedPreviewRef.current;
        if (returnToShowcase) {
          openedFeaturedPreviewRef.current = false;
          /** Swap route before clearing PDF so archive never paints; skip return gate (it would reveal WRITING SAMPLES). */
          onReturnToShowcaseAfterFeaturedPreview?.();
        }
        setPreviewPdf(null);
        setShowPdfLoaderOverlay(true);
        setShowPdfFrame(false);
        setPreviewPdfReady(false);
        if (!returnToShowcase) {
          returnGateTimerRef.current = window.setTimeout(() => {
            setIsPreviewClosing(false);
            returnGateTimerRef.current = null;
          }, PREVIEW_RETURN_GATE_MS);
        }
        closePreviewTimerRef.current = null;
      }, Math.round(PREVIEW_CLOSE_FADE_S * 1000));
    } else {
      const returnToShowcase = openedFeaturedPreviewRef.current;
      if (returnToShowcase) {
        openedFeaturedPreviewRef.current = false;
        onReturnToShowcaseAfterFeaturedPreview?.();
      }
      setPreviewPdf(null);
      setIsPreviewClosing(false);
      setShowPdfLoaderOverlay(true);
      setShowPdfFrame(false);
      setPreviewPdfReady(false);
    }
    setQueuedPreviewPdf(null);
    setIsPrePreviewFading(false);
  }, [
    isPreviewClosing,
    showPdfFrame,
    previewPdf,
    reduceMotion,
    onReturnToShowcaseAfterFeaturedPreview,
  ]);

  const openPreview = useCallback(
    (item: SupportingArchivePdfItem, opts?: { fromFeatured?: boolean }) => {
      if (previewPdf || isPrePreviewFading) return;
      openedFeaturedPreviewRef.current = Boolean(opts?.fromFeatured);
      if (reduceMotion) {
        setPreviewPdf(item);
        return;
      }
      setQueuedPreviewPdf(item);
      setIsPrePreviewFading(true);
    },
    [isPrePreviewFading, previewPdf, reduceMotion],
  );

  useEffect(() => {
    if (!pendingPdfFromShowcase || !onPendingPdfFromShowcaseConsumed) return;
    openPreview(pendingPdfFromShowcase, { fromFeatured: true });
    onPendingPdfFromShowcaseConsumed();
  }, [pendingPdfFromShowcase, openPreview, onPendingPdfFromShowcaseConsumed]);

  useEffect(() => {
    if (previewPdf) {
      setShowPdfLoaderOverlay(true);
      setShowPdfFrame(false);
      setPreviewPdfReady(false);
    }
  }, [previewPdf]);

  useEffect(() => {
    if (!previewPdfReady || showPdfFrame) return;
    if (!showPdfLoaderOverlay) return;
    if (reduceMotion) {
      setShowPdfLoaderOverlay(false);
      setShowPdfFrame(true);
      return;
    }
    readyHoldTimerRef.current = window.setTimeout(() => {
      setShowPdfLoaderOverlay(false);
      readyHoldTimerRef.current = null;
    }, PREVIEW_READY_HOLD_MS);
    return () => {
      if (readyHoldTimerRef.current !== null) {
        window.clearTimeout(readyHoldTimerRef.current);
        readyHoldTimerRef.current = null;
      }
    };
  }, [previewPdfReady, reduceMotion, showPdfFrame, showPdfLoaderOverlay]);

  useEffect(() => {
    if (!isPrePreviewFading || !queuedPreviewPdf) return;
    preFadeTimerRef.current = window.setTimeout(() => {
      setPreviewPdfReady(false);
      setPreviewPdf(queuedPreviewPdf);
      setQueuedPreviewPdf(null);
      preFadeTimerRef.current = window.setTimeout(() => {
        setIsPrePreviewFading(false);
        preFadeTimerRef.current = null;
      }, PREVIEW_HANDOFF_MS);
    }, PREVIEW_PDF_MOUNT_MS);
    return () => {
      if (preFadeTimerRef.current !== null) {
        window.clearTimeout(preFadeTimerRef.current);
        preFadeTimerRef.current = null;
      }
    };
  }, [isPrePreviewFading, queuedPreviewPdf]);

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
      if (readyHoldTimerRef.current !== null) {
        window.clearTimeout(readyHoldTimerRef.current);
        readyHoldTimerRef.current = null;
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
    onNavTransitionChange?.(isPrePreviewFading || !!previewPdf || isPreviewClosing);
    return () => onNavTransitionChange?.(false);
  }, [isPrePreviewFading, isPreviewClosing, onNavTransitionChange, previewPdf]);

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
        className="container relative z-10 mx-auto flex min-h-0 w-full max-w-full min-w-0 flex-1 flex-col px-4 sm:px-6 pt-[6.5rem] md:pt-[8rem]"
        initial={false}
        animate={{
          opacity:
            pendingPdfFromShowcase || previewPdf || isPrePreviewFading || isPreviewClosing ? 0 : 1,
        }}
        transition={{ duration: reduceMotion ? 0 : PREVIEW_PRE_FADE_S, ease: EASE.out }}
        style={{
          pointerEvents:
            pendingPdfFromShowcase || previewPdf || isPrePreviewFading || isPreviewClosing
              ? "none"
              : "auto",
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
            subtitleTightTracking
          />
        </div>

        <div
          ref={archiveScrollHostRef}
          className="archive-optical-scrollbar-host relative min-h-0 flex-1 min-w-0"
        >
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
                  className="font-heading text-[0.65rem] sm:text-xs tracking-eyebrow leading-snug uppercase text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] mb-3 pb-2 border-b border-[color:color-mix(in_srgb,var(--palette-yellow)_20%,rgb(186_186_186))]"
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
                        <span className="font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.14em] uppercase text-mono-2/70 group-hover:text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] shrink-0 pt-1 transition-colors duration-200">
                          VIEW
                        </span>
                        <FileText
                          className="w-4 h-4 shrink-0 text-mono-2/70 group-hover:text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] mt-0.5 transition-colors duration-200"
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
      </motion.div>

      {isPrePreviewFading && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[75] bg-black/45"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : PREVIEW_PRE_FADE_S, ease: EASE.out }}
        />
      )}

      {previewPdf &&
        typeof document !== "undefined" &&
        createPortal(
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="supporting-pdf-preview-title"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black p-4 sm:p-6 md:p-8"
            onClick={closePreview}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : PREVIEW_PDF_DIALOG_FADE_S, ease: EASE.out }}
          >
            <SectionGridOverlay />
            {/*
              PdfJsDocumentView stays mounted in the frame below (opacity 0 until ready) so fetch/render
              runs in parallel with this overlay — loader fade-in is visual only.
            */}
            <AnimatePresence
              mode="wait"
              initial={true}
              onExitComplete={() => {
                setShowPdfFrame((prev) => (prev ? prev : true));
              }}
            >
              {showPdfLoaderOverlay && (
                <motion.div
                  key={`pdf-loader-${previewPdf.id}`}
                  className="pointer-events-none absolute inset-0 z-[9] flex flex-col items-center justify-center gap-11"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                          transition: { duration: PREVIEW_LOADER_FADE_OUT_S, ease: EASE.out },
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          delay: PREVIEW_LOADER_FADE_IN_DELAY_S,
                          duration: PREVIEW_LOADER_FADE_IN_S,
                          ease: EASE.out,
                        }
                  }
                  aria-busy
                  aria-live="polite"
                >
                  <span className="sr-only">Loading PDF…</span>
                  <PdfFoldLoader className="scale-[1.6] sm:scale-[1.85]" />
                  <p
                    className="mt-4 font-body text-[0.58rem] uppercase tracking-[0.14em] text-mono-2/70"
                    aria-hidden
                  >
                    Loading PDF…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              className="relative z-10 flex max-h-[min(90dvh,920px)] w-full max-w-[min(96vw,72rem)] flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.06]"
              onClick={(e) => e.stopPropagation()}
              initial={reduceMotion ? false : { opacity: 0, scaleY: 0.74, y: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 1, scaleY: 1, y: 0 }
                  : isPreviewClosing
                    ? { opacity: 0, scaleY: 1, y: 0 }
                  : showPdfFrame
                    ? { opacity: 1, scaleY: 1, y: 0 }
                    : { opacity: 0, scaleY: 0.74, y: 0 }
              }
              transition={{ duration: reduceMotion ? 0 : isPreviewClosing ? PREVIEW_CLOSE_FADE_S : 0.32, ease: EASE.out }}
              style={{ transformOrigin: "center center" }}
            >
              <header className="relative flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.1] bg-black px-4 py-3.5 sm:px-5">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Close PDF preview"
                  onClick={closePreview}
                  className="h-10 w-10 shrink-0 rounded-full border border-white/18 bg-black text-mono-1 hover:border-portfolio-blue-bright/45 hover:bg-zinc-900 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden />
                </Button>
                <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(62%,26rem)] -translate-x-1/2 -translate-y-1/2 px-2 text-center">
                  <h2
                    id="supporting-pdf-preview-title"
                    className="font-display text-[0.95rem] sm:text-base text-white tracking-tight text-balance leading-snug"
                  >
                    {previewPdf.title}
                  </h2>
                  <p className="font-body text-[0.7rem] sm:text-xs text-mono-2/90 mt-1 leading-snug line-clamp-2">
                    {previewPdf.subtitle}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={previewPdf.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open PDF in new tab"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/18 bg-black text-mono-1 hover:border-portfolio-blue-bright/45 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-blue-bright/45"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href={previewPdf.href}
                    download
                    aria-label="Download PDF"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/18 bg-black text-mono-1 hover:border-portfolio-blue-bright/45 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-blue-bright/45"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </header>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                <PdfJsDocumentView
                  src={previewPdf.href}
                  className="rounded-lg border border-white/[0.08] bg-black/20"
                  onReady={() => setPreviewPdfReady(true)}
                  onError={() => setPreviewPdfReady(true)}
                />
              </div>
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </section>
  );
};

type CardRect = { top: number; left: number; width: number; height: number };

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
        preload="auto"
        className="block h-full w-full object-cover"
        style={{ objectPosition: card.focalPoint ?? "50% 50%" }}
      />
    ) : (
      <img
        src={card.thumbnail}
        alt={card.title}
        className="h-full w-full object-cover"
        style={{ objectPosition: card.focalPoint ?? "50% 50%" }}
      />
    )}
  </>
);

/** Same shell as FEATURED WRITING / showcase slider cards (rounded grey frame). */
const PROJECT_DETAIL_SURFACE =
  "rounded-[11px] sm:rounded-xl border border-white/[0.09] shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9)]";

/** Same box-shadow + vignette stack as the hero SHOWCASE media slider (final “open” state). */
const SHOWCASE_SLIDER_MEDIA_BOX_SHADOW =
  "0 36px 88px rgba(0,0,0,0.6), inset 0 -40px 70px rgba(0,0,0,0.52), 0 0 0 1px rgba(255,255,255,0.07), 0 0 28px 4px rgba(255,255,255,0.04)";

/**
 * Darker than the tab rail — same two-layer idea (black wash over zinc-950) with higher opacity.
 */
const showcaseDetailCard = `${PROJECT_DETAIL_SURFACE} px-3 py-3 sm:px-4 sm:py-3.5 [background:linear-gradient(rgb(0_0_0/0.42),rgb(0_0_0/0.42)),linear-gradient(rgb(9_9_11/0.58),rgb(9_9_11/0.58))]`;

/** Same frame as project detail insets; darker wash + soft stacked shadow (single box-shadow, two layers). Corners: sharp TL/BR, rounded TR/BL (StealthWorm reference). */
const SKILLS_SUBCATEGORY_CARD_FACE =
  "rounded-none border border-portfolio-green/25 shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9),0_6px_22px_-10px_rgba(0,0,0,0.52)] [background:linear-gradient(rgb(0_0_0/0.62),rgb(0_0_0/0.62)),linear-gradient(rgb(9_9_11/0.88),rgb(9_9_11/0.88))] [border-radius:0_0.95rem_0_0.95rem] sm:[border-radius:0_1.05rem_0_1.05rem] transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-portfolio-green/50 hover:shadow-[0_22px_52px_-28px_rgba(0,0,0,0.92),0_8px_26px_-10px_rgba(0,0,0,0.55)]";

const ShowcaseDetailOverviewRole = ({ card }: { card: ShowcaseProjectCard }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
    <section className={`${showcaseDetailCard} min-w-0 md:col-span-2`}>
      <p className="font-heading text-xs tracking-eyebrow leading-snug uppercase text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] mb-1.5">OVERVIEW</p>
      <p className="font-body text-sm sm:text-base text-mono-2 leading-snug whitespace-pre-line">
        {card.detailOverview?.trim() || "—"}
      </p>
    </section>
    <section className={`${showcaseDetailCard} min-w-0`}>
      <p className="font-heading text-xs tracking-eyebrow leading-snug uppercase text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] mb-1.5">ROLE</p>
      <p className="font-body text-sm sm:text-base text-mono-2 leading-snug whitespace-pre-line">
        {card.detailRole?.trim() || "—"}
      </p>
    </section>
  </div>
);

const ShowcaseDetailImpactTools = ({ card }: { card: ShowcaseProjectCard }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
    <section className={`${showcaseDetailCard} min-w-0 md:col-span-2`}>
      <p className="font-heading text-xs tracking-eyebrow leading-snug uppercase text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] mb-1.5">IMPACT</p>
      <p className="font-body text-sm sm:text-base text-mono-2 leading-snug whitespace-pre-line">
        {card.detailImpact?.trim() || "—"}
      </p>
    </section>
    <section className={`${showcaseDetailCard} min-w-0`}>
      <p className="font-heading text-xs tracking-eyebrow leading-snug uppercase text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] mb-1.5">TOOLS</p>
      {card.detailTools?.length ? (
        <ul className="ml-1 list-disc list-outside space-y-1 pl-6 sm:pl-7 marker:text-mono-2/70">
          {card.detailTools.map((tool, i) => (
            <li key={`${tool}-${i}`} className="font-body text-sm sm:text-base text-mono-2 leading-snug">
              {tool}
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-body text-sm sm:text-base text-mono-2/55">—</p>
      )}
    </section>
  </div>
);

function ShowcaseWritingFeaturedPanel({
  item,
  previewWidthPx,
  onOpenPdfInSupporting,
}: {
  item: SupportingArchivePdfItem;
  previewWidthPx: number;
  onOpenPdfInSupporting: (item: SupportingArchivePdfItem) => void;
}) {
  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-3 text-left sm:flex-row sm:items-start sm:gap-4">
      <FeaturedWritingPdfThumbnail
        pdfSrc={item.href}
        widthPx={previewWidthPx}
        className="shrink-0 self-start"
        onActivate={() => onOpenPdfInSupporting(item)}
      />
      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-2.5 sm:min-w-0 sm:gap-3">
        <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="min-w-0 space-y-1">
            <p className="font-display text-lg leading-[1.15] tracking-tight text-white sm:text-xl md:text-2xl md:leading-tight">
              {item.title}
            </p>
            <p className="font-body text-xs leading-snug text-mono-2/75 sm:text-sm">{item.subtitle}</p>
          </div>
          <a
            href={item.href}
            className="inline-flex w-fit shrink-0 items-center gap-2 self-start rounded-[11px] sm:rounded-xl border border-white/[0.09] bg-zinc-950/40 px-2.5 py-1.5 font-heading text-[10px] sm:text-xs tracking-btn-caps uppercase text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9)] transition-[border-color,background-color,color] duration-300 ease-out hover:border-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] hover:bg-zinc-950/65 hover:text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:self-center sm:px-3 sm:py-2"
            onClick={(e) => {
              e.preventDefault();
              onOpenPdfInSupporting(item);
            }}
          >
            VIEW
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          </a>
        </div>
        {item.description ? (
          <p
            className="line-clamp-3 min-w-0 font-body text-sm leading-relaxed text-mono-2/70 sm:text-[0.9375rem] sm:leading-relaxed md:text-base"
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
}: {
  onSelectProject: (id: string) => void;
  onOpenSupporting: () => void;
  onOpenFeaturedPdfInSupporting: (item: SupportingArchivePdfItem) => void;
  activeProjectId: string | null;
}) => {
  const reduceMotion = useReducedMotion();
  const activeCard = activeProjectId ? PROJECT_CARDS.find((c) => c.id === activeProjectId) ?? null : null;

  const [morphRect, setMorphRect] = useState<CardRect | null>(null);
  const [targetRect, setTargetRect] = useState<CardRect | null>(null);
  const [morphDone, setMorphDone] = useState(false);
  const [detailHdrReveal, setDetailHdrReveal] = useState(false);
  const [detailRuleReveal, setDetailRuleReveal] = useState(false);
  const [detailRow1Reveal, setDetailRow1Reveal] = useState(false);
  const [detailRow2Reveal, setDetailRow2Reveal] = useState(false);
  const [detailHeroMediaFadeIn, setDetailHeroMediaFadeIn] = useState(false);
  const detailRevealTimersRef = useRef<number[]>([]);
  const detailAnchorRef = useRef<HTMLDivElement>(null);
  const [showcaseTabId, setShowcaseTabId] = useState<ShowcaseTabId>("tab-1");

  const morphDur = reduceMotion ? 0.12 / SHOWCASE_TIME_DIV : SHOWCASE_CARD_MORPH_DUR_S;
  const morphEase = SHOWCASE_EASE;

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

  // Parent can clear the open project (e.g. global back) — reset FLIP state so the next open is clean.
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
    if (reduceMotion) {
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
  }, [morphDone, activeCard?.id, reduceMotion]);

  // FLIP morph + detail copy schedule (timers must survive morphDone — do not key this effect on morphDone).
  useEffect(() => {
    if (!targetRect || !morphRect) return;
    let cancelled = false;
    const morphMs = Math.round(morphDur * 1000);
    const chainTimers: number[] = [];

    if (!reduceMotion) {
      const ruleAt = Math.max(0, morphMs - DETAIL_RULE_LINE_LEAD_MS);
      const afterRuleMs = ruleAt + DETAIL_RULE_EXPAND_MS;
      const atHalfHeroFadeMs =
        morphMs +
        DETAIL_HERO_FADE_START_RAF_PAD_MS +
        Math.round(DETAIL_HERO_MEDIA_FADE_MS / 2);
      const headerKickAt = Math.max(afterRuleMs, atHalfHeroFadeMs);

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

    animate(mX, targetRect.left, { duration: morphDur, ease: morphEase });
    animate(mY, targetRect.top, { duration: morphDur, ease: morphEase });
    animate(mScaleX, 1, { duration: morphDur, ease: morphEase });
    animate(mScaleY, 1, {
      duration: morphDur,
      ease: morphEase,
      onComplete: () => {
        if (cancelled) return;
        setMorphDone(true);
      },
    });

    return () => {
      cancelled = true;
      chainTimers.forEach((id) => window.clearTimeout(id));
      detailRevealTimersRef.current.forEach((id) => window.clearTimeout(id));
      detailRevealTimersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRect, morphRect, morphDur, reduceMotion]);

  // Reset / reduced-motion reveal when not morphing or when user prefers reduced motion.
  useEffect(() => {
    if (!morphDone) {
      setDetailHdrReveal(false);
      setDetailRuleReveal(false);
      setDetailRow1Reveal(false);
      setDetailRow2Reveal(false);
      detailRevealTimersRef.current.forEach((id) => window.clearTimeout(id));
      detailRevealTimersRef.current = [];
      return;
    }
    if (reduceMotion) {
      setDetailHdrReveal(true);
      setDetailRuleReveal(true);
      setDetailRow1Reveal(true);
      setDetailRow2Reveal(true);
    }
  }, [morphDone, activeCard?.id, reduceMotion]);

  return (
    <section
      id="projects"
      className="relative flex min-h-full w-full min-w-0 max-w-full flex-col justify-start overflow-x-hidden bg-black pt-16 pb-[max(1.25rem,calc(var(--slide-gap)*1.5),env(safe-area-inset-bottom,0px))] text-white sm:pt-20 md:pt-22 scroll-mt-6 [--slide-gap:0.875rem] sm:[--slide-gap:1.25rem] lg:[--slide-gap:1rem] xl:[--slide-gap:1.125rem]"
    >
      <SectionGridOverlay projectDetailActive={!!activeCard} />
      <div className="container relative z-10 mx-auto flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col px-4 sm:px-6">
        {/*
         * Column inherits --slide-gap from #projects. Spacer + section pb = bottom air; overlay scrolls if needed (no clipping).
         */}
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-x-hidden overflow-y-visible">
        {/*
         * CAROUSEL — always in normal flow so the section keeps its height.
         * When a card is active we fade it out but DO NOT unmount it so the
         * container height stays stable for the absolute detail overlay.
         */}
        <div
          aria-hidden={!!activeCard || undefined}
          className={`flex min-h-0 w-full flex-1 flex-col ${activeCard ? "pointer-events-none select-none" : ""}`}
        >
          <div
            className={`shrink-0 ${activeCard ? "opacity-0" : "opacity-100"}`}
          >
            <ProjectsStack
              onSelect={(id, el) => handleCardClick(id, el)}
              focusProjectId={activeCard?.id ?? null}
            />
          </div>

          {/*
           * Vertical gap above tabs = --slide-gap only (same token as space between slider cards).
           * ProjectsStack uses pb-0 so gallery bottom padding does not stack with this margin.
           */}
          <div
            className={`mx-auto mt-[var(--slide-gap,0.875rem)] flex w-full min-w-0 max-w-[min(100%,56rem)] flex-col px-1 sm:px-2 lg:max-w-[min(100%,72rem)] xl:max-w-[min(100%,84rem)] 2xl:max-w-[min(100%,96rem)] ${activeCard ? "opacity-0" : "opacity-100"}`}
          >
            {/*
             * Same horizontal inset as ProjectsStack outer + embla viewport so folder
             * card width matches the showcase cards above.
             */}
            <div className="flex w-full min-w-0 flex-col px-2 sm:px-4 lg:px-2 xl:px-3">
              <ShowcaseAttachedTabStrip
                activeId={showcaseTabId}
                onTabChange={setShowcaseTabId}
                onArchives={onOpenSupporting}
                className="w-full min-w-0"
                panel={({ tabWidthPx }) => (
                  <ShowcaseWritingFeaturedPanel
                    item={SHOWCASE_WRITING_TAB_FEATURED[showcaseTabId]}
                    previewWidthPx={tabWidthPx}
                    onOpenPdfInSupporting={onOpenFeaturedPdfInSupporting}
                  />
                )}
              />
            </div>
          </div>

        </div>
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
            <div className={`w-full max-w-[min(100%,56rem)] shrink-0 ${DETAIL_CARD_H}`} aria-hidden />

            {morphDone && (
              <div
                className={`absolute top-0 left-0 right-0 mx-auto w-full max-w-[min(100%,56rem)] ${DETAIL_CARD_H} rounded-[11px] sm:rounded-xl border border-white/[0.09] overflow-hidden`}
                style={{
                  background: "#000",
                  boxShadow: `${SHOWCASE_SLIDER_MEDIA_BOX_SHADOW}, 0 18px 48px -28px rgba(0,0,0,0.9)`,
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
            )}

            {activeCard && morphRect && (
              <div className="w-full max-w-[min(100%,56rem)] mt-5 pb-8">
                <div
                  className="-ml-[3px] flex w-full max-w-full flex-col items-stretch gap-y-1.5 text-left"
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
                  <p className="m-0 w-full font-heading text-sm sm:text-base leading-snug tracking-eyebrow-sm uppercase text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))]">
                    Project details
                  </p>
                  <h3 className="m-0 w-full font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em] text-white">
                    {activeCard.title}
                  </h3>
                  <p className="m-0 w-full pl-[2px] font-body text-sm sm:text-base leading-snug text-mono-2">
                    {activeCard.tagline}
                  </p>
                </div>
                <div className="mt-5 w-full" aria-hidden>
                  <div
                    className="mx-auto block h-px w-full max-w-full shrink-0 bg-white/[0.09]"
                    style={{
                      transform: detailRuleReveal ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "center center",
                      ...(reduceMotion
                        ? {}
                        : detailRuleReveal
                          ? {
                              transitionProperty: "transform",
                              transitionDuration: `${DETAIL_RULE_EXPAND_MS}ms`,
                              transitionTimingFunction: DETAIL_SLIDE_CUBIC,
                            }
                          : {}),
                    }}
                  />
                </div>
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
              </div>
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
            border: "1px solid rgba(255, 255, 255, 0.09)",
            borderRadius: "12px",
            boxShadow: "0 18px 48px -28px rgba(0, 0, 0, 0.9)",
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
    <Star className="w-5 h-5 text-[color:color-mix(in_srgb,var(--palette-yellow)_44%,rgb(186_186_186))] mr-3 mt-1 flex-shrink-0 fill-current" />
    <span className="font-body text-base md:text-lg text-mono-2 leading-relaxed">{text}</span>
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

const ConfidantExperience = () => {
  const experienceScrollHostRef = useRef<HTMLDivElement>(null);
  const experienceScrollAreaRef = useRef<HTMLDivElement>(null);
  const experienceScrollContentRef = useRef<HTMLDivElement>(null);
  const experienceOpticalRailWrapRef = useRef<HTMLDivElement>(null);
  const experienceOpticalTrackRef = useRef<HTMLDivElement>(null);
  const experienceOpticalThumbRef = useRef<HTMLDivElement>(null);
  /** Top / bottom experience cards — optical rail aligns to first card top & last card bottom. */
  const experienceFirstCardRef = useRef<HTMLDivElement | null>(null);
  const experienceLastCardRef = useRef<HTMLDivElement | null>(null);
  const experienceScrollHideTimerRef = useRef<number | null>(null);

  const updateExperienceOpticalScrollMetrics = useCallback(() => {
    const scrollEl = experienceScrollAreaRef.current;
    const trackEl = experienceOpticalTrackRef.current;
    const thumbEl = experienceOpticalThumbRef.current;
    const railWrap = experienceOpticalRailWrapRef.current;
    const hostEl = experienceScrollHostRef.current;
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
      const firstCardEl = experienceFirstCardRef.current;
      if (hostEl && firstCardEl) {
        const hostTop = hostEl.getBoundingClientRect().top;
        const cardTop = firstCardEl.getBoundingClientRect().top;
        railWrap.style.top = `${Math.max(0, cardTop - hostTop)}px`;
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
      const lastCardEl = experienceLastCardRef.current;
      if (hostEl && lastCardEl) {
        const hostRect = hostEl.getBoundingClientRect();
        const lastRect = lastCardEl.getBoundingClientRect();
        bottomPx = Math.max(0, hostRect.bottom - lastRect.bottom);
      }
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
    const scrollEl = experienceScrollAreaRef.current;
    const contentEl = experienceScrollContentRef.current;
    if (!scrollEl) return;
    const ro = new ResizeObserver(() => {
      updateExperienceOpticalScrollMetrics();
    });
    ro.observe(scrollEl);
    if (contentEl) ro.observe(contentEl);
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    const onViewportChange = () => {
      updateExperienceOpticalScrollMetrics();
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
      updateExperienceOpticalScrollMetrics();
    };
    opticalMql?.addEventListener("change", onOpticalBreakpoint);
    updateExperienceOpticalScrollMetrics();
    return () => {
      ro.disconnect();
      opticalMql?.removeEventListener("change", onOpticalBreakpoint);
      if (vv) {
        vv.removeEventListener("resize", onViewportChange);
        vv.removeEventListener("scroll", onViewportChange);
      }
      window.removeEventListener("orientationchange", onViewportChange);
    };
  }, [updateExperienceOpticalScrollMetrics]);

  const onExperienceOpticalThumbPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (
        typeof window === "undefined" ||
        !window.matchMedia?.(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`).matches
      ) {
        return;
      }
      const scrollEl = experienceScrollAreaRef.current;
      const trackEl = experienceOpticalTrackRef.current;
      const thumbEl = experienceOpticalThumbRef.current;
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
        updateExperienceOpticalScrollMetrics();
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
    [updateExperienceOpticalScrollMetrics],
  );

  const revealExperienceOpticalScrollbar = useCallback(() => {
    const opticalActive =
      typeof window !== "undefined" &&
      window.matchMedia?.(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`).matches === true;
    const host = experienceScrollHostRef.current;
    if (!host || !opticalActive) return;
    host.classList.add("archive-optical-scrollbar-host--visible");
    if (experienceScrollHideTimerRef.current !== null) {
      window.clearTimeout(experienceScrollHideTimerRef.current);
    }
    experienceScrollHideTimerRef.current = window.setTimeout(() => {
      host.classList.remove("archive-optical-scrollbar-host--visible");
      experienceScrollHideTimerRef.current = null;
    }, PORTFOLIO_SECTION_SCROLLBAR_VISIBLE_MS);
    updateExperienceOpticalScrollMetrics();
  }, [updateExperienceOpticalScrollMetrics]);

  const onExperienceListScroll = useCallback(() => {
    revealExperienceOpticalScrollbar();
  }, [revealExperienceOpticalScrollbar]);

  const onExperienceScrollAreaPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = experienceScrollAreaRef.current;
      if (!el) return;
      if (
        typeof window === "undefined" ||
        !window.matchMedia?.(`(min-width: ${PORTFOLIO_OPTICAL_MIN_VIEWPORT_PX}px)`).matches
      ) {
        return;
      }
      if (!portfolioOpticalPointerInSideGutter(e.clientX, el.getBoundingClientRect())) return;
      revealExperienceOpticalScrollbar();
    },
    [revealExperienceOpticalScrollbar],
  );

  useEffect(() => {
    return () => {
      if (experienceScrollHideTimerRef.current !== null) {
        window.clearTimeout(experienceScrollHideTimerRef.current);
      }
    };
  }, []);

  return (
    <section
      id="experience"
      className={`relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-x-hidden overflow-hidden bg-black font-body text-white scroll-mt-6 ${SLIDE}`}
    >
      <SectionGridOverlay />
      <div className="container relative z-10 mx-auto flex min-h-0 w-full max-w-full min-w-0 flex-1 flex-col px-4 sm:px-6 pt-[calc(6rem+2px)] md:pt-[calc(7.5rem+2px)]">
        <div className="shrink-0">
          <SectionHeader
            title="CAREER OVERVIEW"
            subtitle="Experience"
            align="center"
            showBar={false}
            compact
            titleFade
            className="!mb-6 sm:!mb-8"
          />
        </div>

        <div
          ref={experienceScrollHostRef}
          className="archive-optical-scrollbar-host relative mt-2 min-h-0 flex-1 min-w-0 sm:mt-3"
        >
          <div
            ref={experienceScrollAreaRef}
            onScroll={onExperienceListScroll}
            onPointerMove={onExperienceScrollAreaPointerMove}
            className="no-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pr-0 lg:pr-[max(2rem,calc(1.75rem+env(safe-area-inset-right,0px)))]"
          >
            <div
              ref={experienceScrollContentRef}
              className="mx-auto w-full max-w-[min(100%,48rem)] space-y-8 pt-2 sm:space-y-10 sm:pt-3 pb-8 sm:pb-10"
            >
              {EXPERIENCE_DATA.map((job, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    if (idx === 0) experienceFirstCardRef.current = el;
                    if (idx === EXPERIENCE_DATA.length - 1) experienceLastCardRef.current = el;
                  }}
                  className="rounded-[0_1rem] border border-portfolio-blue/28 [background:linear-gradient(rgb(0_0_0/0.62),rgb(0_0_0/0.62)),linear-gradient(rgb(9_9_11/0.88),rgb(9_9_11/0.88))] px-4 py-5 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.03)] transition-[background-color,border-color,box-shadow] duration-200 ease-out sm:px-5 sm:py-6 hover:border-portfolio-blue/46 hover:[background:linear-gradient(rgb(0_0_0/0.62),rgb(0_0_0/0.62)),linear-gradient(rgb(9_9_11/0.88),rgb(9_9_11/0.88))] hover:shadow-[0_14px_30px_-18px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.035)]"
                >
                  <h3
                    className="font-display text-base font-semibold tracking-[-0.02em] text-white text-balance leading-snug sm:text-lg md:text-xl sm:leading-[1.25] md:leading-snug"
                  >
                    {job.role}
                  </h3>
                  <div className="mt-3 flex flex-col gap-2 sm:mt-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-snug sm:gap-x-2.5">
                      <span className="font-heading text-[11px] tracking-eyebrow-sm uppercase text-mono-2/88 sm:text-xs sm:tracking-eyebrow-sm">
                        {job.company}
                      </span>
                      <span className="text-mono-2/35 shrink-0 translate-y-px" aria-hidden>
                        ·
                      </span>
                      <span className="font-heading text-[11px] tracking-eyebrow-sm uppercase text-mono-2/60 sm:text-xs sm:tracking-eyebrow-sm">
                        {job.location}
                      </span>
                    </div>
                    <time className="font-body text-[10px] tracking-eyebrow-sm uppercase text-mono-2/45 tabular-nums leading-snug sm:text-[11px] sm:shrink-0 sm:text-right">
                      {job.period}
                    </time>
                  </div>
                  <div className="mt-4 h-px w-full bg-white/[0.08] sm:mt-5" aria-hidden />
                  <ul className="m-0 mt-4 list-none space-y-2.5 p-0 sm:mt-5 sm:space-y-3">
                    {job.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[0.5rem_minmax(0,1fr)] items-start gap-x-3 sm:grid-cols-[0.5rem_minmax(0,1fr)] sm:gap-x-3.5"
                      >
                        <span
                          className="mt-[0.4rem] size-2 shrink-0 rounded-full sm:mt-[0.45rem]"
                          style={{ backgroundColor: "color-mix(in srgb, var(--palette-blue) 95%, transparent)" }}
                          aria-hidden
                        />
                        <p className="min-w-0 font-body text-sm leading-relaxed text-mono-2/88 sm:text-[0.9375rem] sm:leading-[1.55]">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div
            ref={experienceOpticalRailWrapRef}
            className="pointer-events-none absolute top-0 z-[2] hidden w-2 lg:block"
            aria-hidden
          >
            <div
              ref={experienceOpticalTrackRef}
              className="archive-optical-scrollbar-track relative h-full w-full rounded-full bg-white/[0.06]"
            >
              <div
                ref={experienceOpticalThumbRef}
                role="presentation"
                className="archive-optical-scrollbar-thumb pointer-events-auto absolute left-0 right-0 rounded-full bg-white/[0.14] hover:bg-white/[0.22] motion-safe:transition-colors motion-safe:duration-200"
                style={{ top: 0, height: 0 }}
                onPointerDown={onExperienceOpticalThumbPointerDown}
              />
            </div>
          </div>
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
          LET'S CONNECT!
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
            className={`${UIVERSE_BUTTON_BASE} border-white/10 hover:rotate-2 hover:border-white/30`}
            aria-label="YouTube"
          >
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
            className={`${UIVERSE_BUTTON_BASE} border-white/10 hover:rotate-2 hover:border-white/30`}
            aria-label="LinkedIn"
          >
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
            className={`${UIVERSE_BUTTON_BASE} border-white/10 hover:-rotate-2 hover:border-white/30`}
            aria-label="TikTok"
          >
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
            className={`${UIVERSE_BUTTON_BASE} border-white/10 hover:rotate-2 hover:border-white/30`}
            aria-label="Instagram"
          >
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
            className={`${UIVERSE_BUTTON_BASE} border-white/10 hover:rotate-3 hover:border-white/30`}
            aria-label="Email"
          >
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
      { title: "DESIGN & PRODUCTIVITY", titleCase: "Design & Productivity", subtitle: "Toolkit", items: ["Microsoft Office 365", "Adobe Creative Suite", "Canva", "Procreate"] },
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
const WEBHOOKS_CORE_ACCENT = "var(--palette-green)";
const WEBHOOKS_TOOLS_ACCENT = "var(--palette-blue)";
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
                <h4 className="font-display text-xs md:text-sm uppercase tracking-[0.08em] leading-snug text-emerald-200/55 mb-1.5 md:mb-2.5 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] md:text-xs text-white tracking-tight leading-tight"
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
                <h4 className="font-display text-xs md:text-sm uppercase tracking-[0.08em] leading-snug text-emerald-200/55 mb-1.5 md:mb-2.5 font-semibold">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] md:text-xs text-white tracking-tight leading-tight"
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
 * When `false`: Both sub-skills panels show inline together, stacked vertically.
 */
const SKILLS_SHOW_INTRO_PAIR_CARDS = false;

/**
 * Lightbulb (`AiIdeaSvg`) + gear (`GearSvg`) on intro pair cards and subskills panel headers.
 * Set `true` to show them again.
 */
const SKILLS_SHOW_IDEA_GEAR_DECOR = false;

/* From Uiverse.io by Adrwaan — outer shell; StealthWorm corner grammar (sharp TL/BR, rounded TR/BL). */
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

  /* Two stacked inline panels: share viewport height (overrides single-card cap above). */
  &.skills-subcard.skills-subcard-dual {
    max-height: min(calc(50dvh - 3.75rem), 22rem);
    @media (max-width: 639px) {
      max-height: min(calc(50dvh - 3.25rem), 19rem);
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

/** Skills orchestrated reveal (after panel wipe): ms timings + pauses, PROJECT-DETAILS-style; GPU: transform/opacity only. */
const SKILLS_REVEAL_PAUSE_MS = 51;
const SKILLS_REVEAL_TITLE_FADE_MS = 191;
const SKILLS_REVEAL_HEADER_SLIDE_MS = 225;
const SKILLS_REVEAL_CARD_SLIDE_MS = 200;
const SKILLS_REVEAL_CARD_STAGGER_MS = 24;
const SKILLS_REVEAL_HEADER_DELAY_MS = SKILLS_REVEAL_TITLE_FADE_MS + SKILLS_REVEAL_PAUSE_MS;
const SKILLS_REVEAL_CORE_GRID_DELAY_MS =
  SKILLS_REVEAL_HEADER_DELAY_MS + SKILLS_REVEAL_HEADER_SLIDE_MS + SKILLS_REVEAL_PAUSE_MS;
/** Time after core column cards begin before toolkit column cards begin (overlap is intentional; was full core slide+stagger+pause). */
const SKILLS_REVEAL_TOOLKIT_AFTER_CORE_START_MS = 68;
const SKILLS_REVEAL_TOOLKIT_GRID_DELAY_MS =
  SKILLS_REVEAL_CORE_GRID_DELAY_MS + SKILLS_REVEAL_TOOLKIT_AFTER_CORE_START_MS;
const SKILLS_ORCHESTRATED_END_S =
  (SKILLS_REVEAL_TOOLKIT_GRID_DELAY_MS +
    SKILLS_REVEAL_CARD_SLIDE_MS +
    2 * SKILLS_REVEAL_CARD_STAGGER_MS) /
  1000;

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
/** Inline dual panels: orchestrated reveal end (icon flourish sync). */
const SKILLS_CHROME_INLINE_STAGGER_END_S = SKILLS_ORCHESTRATED_END_S;
const SKILLS_INLINE_MOTION_END_S = Math.max(SKILLS_PANEL_STAGGER_END_S, SKILLS_CHROME_INLINE_STAGGER_END_S);

/** Intro: 2nd chrome card; also second card title motion (delay 0.25 + 0.4s) in SkillArsenal */
const SKILLS_INTRO_CHROME_STAGGER_END_S = 0.06 + 1 * 0.1 + 0.38;
const SKILLS_INTRO_SECOND_TITLE_END_S = 0.25 + 0.4;
const SKILLS_INTRO_MOTION_END_S = Math.max(SKILLS_INTRO_CHROME_STAGGER_END_S, SKILLS_INTRO_SECOND_TITLE_END_S);

/** Overlay shell expand vs panel stagger (parallel, same t0) */
const SKILLS_OVERLAY_MOTION_END_S = Math.max(MORPH_EXPAND_DUR, SKILLS_PANEL_STAGGER_END_S);

/** Background marquee (not inside cards): same outline style; runs on its own layer behind panels. */
type SkillsAmbientBand = "core" | "tools";

const SKILLS_AMBIENT_MARQUEE_COPY: Record<SkillsAmbientBand, string> = {
  core: "Core · Competencies · Systems · Execution ·",
  tools: "Toolkit · Stack · Workflow · Production ·",
};

/** Stacked marquee “wall” behind each skills card band only (not full page). */
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
  orchestratedReveal = false,
  revealActive = false,
  revealReduceMotion = false,
  headerRevealDelayMs = 0,
  gridRevealDelayMs = 0,
}: {
  slide: "core" | "tools";
  variant: "overlay" | "inline";
  onClose?: () => void;
  /** Both skills panels visible: tighter max-height + in-card scroll. */
  dualInline?: boolean;
  orchestratedReveal?: boolean;
  revealActive?: boolean;
  revealReduceMotion?: boolean;
  headerRevealDelayMs?: number;
  gridRevealDelayMs?: number;
}) => {
  const isOrchestrated = orchestratedReveal && variant === "inline" && dualInline;

  return (
  <UiverseCard
    className={`skills-main-card skills-subcard${dualInline ? " skills-subcard-dual" : ""}`}
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
              ? "relative z-10 flex min-h-0 max-h-[min(calc(50dvh-3.75rem),22rem)] max-sm:max-h-[min(calc(50dvh-3.25rem),19rem)] flex-col overflow-hidden px-3 sm:px-6 md:px-10 lg:px-12 py-1.5 sm:py-3 md:py-4 text-left shadow-[0_0_18px_rgba(0,0,0,0.45),0_0_14px_rgba(34,211,238,0.1)]"
              : "relative z-10 flex min-h-0 max-h-[min(680px,90vh)] sm:max-h-[min(440px,58vh)] flex-col overflow-hidden px-4 sm:px-8 md:px-14 lg:px-16 xl:px-20 py-2.5 sm:py-6 md:py-7 text-left shadow-[0_0_22px_rgba(0,0,0,0.5),0_0_18px_rgba(34,211,238,0.12)]"
        }
        {...(isOrchestrated
          ? {}
          : {
              variants: skillsPanelStaggerParent,
              initial: "hidden" as const,
              whileInView: "show" as const,
              viewport: { once: false, amount: 0.08 },
            })}
      >
        <motion.div
          className={
            dualInline && variant === "inline"
              ? "flex flex-shrink-0 min-w-0 pb-1.5 sm:pb-2.5 mb-1.5 sm:mb-2.5"
              : "flex flex-shrink-0 min-w-0 pb-2 sm:pb-4 mb-2 sm:mb-4"
          }
          {...(isOrchestrated
            ? {
                initial: { opacity: 0, x: -40 },
                animate:
                  !revealActive
                    ? { opacity: 0, x: -40 }
                    : { opacity: 1, x: 0 },
                transition: {
                  duration: revealReduceMotion ? 0.01 : SKILLS_REVEAL_HEADER_SLIDE_MS / 1000,
                  delay: revealReduceMotion ? 0 : headerRevealDelayMs / 1000,
                  ease: SKILLS_CONTENT_EASE,
                },
                style: { willChange: "transform, opacity" },
              }
            : { variants: skillsPanelStaggerChild })}
        >
          <div className="flex min-w-0 w-full flex-row items-end justify-between gap-2 sm:gap-5">
            <p
              className={
                dualInline && variant === "inline"
                  ? "min-w-0 flex-1 text-left font-display font-semibold text-base sm:text-lg md:text-xl uppercase tracking-tight text-white leading-none whitespace-nowrap truncate [text-shadow:0_0_10px_rgba(0,0,0,0.95),0_0_18px_rgba(0,0,0,0.65)] [-webkit-text-stroke:0.2px_rgba(255,255,255,0.2)]"
                  : "min-w-0 flex-1 text-left font-display font-semibold text-lg sm:text-xl md:text-2xl uppercase tracking-tight text-white leading-none whitespace-nowrap truncate [text-shadow:0_0_12px_rgba(0,0,0,0.98),0_0_20px_rgba(0,0,0,0.68)] [-webkit-text-stroke:0.25px_rgba(255,255,255,0.22)]"
              }
            >
              {slide === "core" ? "Core Competencies" : "Toolkit"}
            </p>
            {SKILLS_SHOW_IDEA_GEAR_DECOR ? (
              <div
                className={
                  dualInline && variant === "inline"
                    ? "skills-subskills-header-icon shrink-0 translate-y-1 sm:translate-y-2 [&_svg]:!w-[26px] [&_svg]:!h-[26px] sm:[&_svg]:!w-[44px] sm:[&_svg]:!h-[44px]"
                    : "skills-subskills-header-icon shrink-0 translate-y-1.5 sm:translate-y-4 [&_svg]:!w-[29px] [&_svg]:!h-[29px] sm:[&_svg]:!w-[52px] sm:[&_svg]:!h-[52px]"
                }
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
                    className="inline-flex text-mono-1 max-sm:translate-y-[5%] sm:[transform:var(--icon-offset)]"
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
        </motion.div>
        <motion.div
          className="relative flex-1 min-h-0"
          {...(!isOrchestrated ? { variants: skillsPanelStaggerChild } : {})}
        >
        <div
          className={
            variant === "inline"
              ? dualInline
                ? "h-full min-h-0 overflow-y-auto overflow-x-hidden pr-2 pb-2 no-scrollbar"
                : "h-full min-h-0 overflow-y-hidden overflow-x-hidden pr-2 pb-3 sm:pb-2"
              : "h-full min-h-0 overflow-y-hidden overflow-x-hidden pr-2 pb-8 sm:pb-2"
          }
        >
          {slide === "core" ? (
            <div className="text-[14px] sm:text-[15px] leading-[1.55] text-white">
              <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-3 md:items-start gap-y-5 sm:gap-y-8 gap-x-6 md:gap-x-8 lg:gap-x-10">
                {CORE_SUBSKILLS_CATEGORIES.map(({ categoryTitle, items }, index) => {
                  const columnClass = [
                    "flex min-w-0 min-h-0 flex-col",
                    SKILLS_SUBCATEGORY_CARD_FACE,
                    dualInline
                      ? "px-2.5 py-2.5 sm:px-3 sm:py-3"
                      : "px-3 py-3 sm:px-4 sm:py-3.5",
                  ].join(" ");
                  const cardInner = (
                    <>
                      <p
                        className="mb-3 w-full min-w-0 pb-2 border-b border-white/[0.06] text-center text-[11px] sm:text-[12px] font-heading font-semibold uppercase leading-snug tracking-eyebrow text-zinc-300/70 text-balance"
                        title={categoryTitle}
                      >
                        {categoryTitle}
                      </p>
                      <ul className="space-y-2 sm:space-y-3">
                        {items.map(({ label, Icon }) => (
                          <li
                            key={label}
                            className="group flex min-w-0 items-center gap-3 transition-transform duration-200 ease-out hover:translate-x-[2px]"
                          >
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                              <Icon size={18} className="text-portfolio-green" />
                            </span>
                            <span
                              className="min-w-0 truncate text-white transition-colors duration-200 ease-out"
                              title={label}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                  if (isOrchestrated) {
                    return (
                      <motion.div
                        key={categoryTitle}
                        className={columnClass}
                        initial={{ opacity: 0, y: 36 }}
                        animate={
                          !revealActive
                            ? { opacity: 0, y: 36 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={{
                          duration: revealReduceMotion ? 0.01 : SKILLS_REVEAL_CARD_SLIDE_MS / 1000,
                          delay:
                            revealReduceMotion
                              ? 0
                              : (gridRevealDelayMs + index * SKILLS_REVEAL_CARD_STAGGER_MS) / 1000,
                          ease: SKILLS_CONTENT_EASE,
                        }}
                        style={{ willChange: "transform, opacity" }}
                      >
                        {cardInner}
                      </motion.div>
                    );
                  }
                  return (
                    <div key={categoryTitle} className={columnClass}>
                      {cardInner}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-[14px] sm:text-[15px] leading-[1.55] text-white">
              <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-3 md:items-start gap-y-5 sm:gap-y-8 gap-x-6 md:gap-x-8 lg:gap-x-10 [&>*]:min-w-0">
                {[
                  {
                    title: "Design & Productivity",
                    label: "Design & Productivity",
                    items: [
                      "Microsoft Office 365",
                      "Adobe Creative Suite",
                      "Canva",
                      "Procreate",
                    ],
                  },
                  {
                    title: "Video & Writing",
                    label: "Video & Writing",
                    items: ["DaVinci Resolve", "CapCut", "Final Draft", "Arc Studio"],
                  },
                  {
                    title: "Social Platforms",
                    label: "Social Platforms",
                    items: [
                      "Hootsuite",
                      "TikTok Creator Tools",
                      "Instagram Reels",
                      "YouTube Shorts",
                    ],
                  },
                ].map(({ title, label, items }, index) => {
                  const columnClass = [
                    "min-w-0 flex min-h-0 flex-col",
                    SKILLS_SUBCATEGORY_CARD_FACE,
                    dualInline
                      ? "px-2.5 py-2.5 sm:px-3 sm:py-3"
                      : "px-3 py-3 sm:px-4 sm:py-3.5",
                  ].join(" ");
                  const cardInner = (
                    <>
                      <p
                        className="mb-3 w-full min-w-0 pb-2 border-b border-white/[0.06] text-center text-[11px] sm:text-[12px] font-heading font-semibold uppercase tracking-eyebrow leading-snug text-zinc-300/70 text-balance"
                        title={title}
                      >
                        {label}
                      </p>
                      <ul className="space-y-2 sm:space-y-3">
                        {items.map((tool) => (
                          <li
                            key={tool}
                            className="group flex min-w-0 items-center gap-3 transition-transform duration-200 ease-out hover:translate-x-[2px]"
                          >
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                              <ToolIcon name={tool} size={18} />
                            </span>
                            <span
                              className="min-w-0 truncate text-white transition-colors duration-200 ease-out"
                              title={tool}
                            >
                              {tool}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                  if (isOrchestrated) {
                    return (
                      <motion.div
                        key={title}
                        className={columnClass}
                        initial={{ opacity: 0, y: 36 }}
                        animate={
                          !revealActive
                            ? { opacity: 0, y: 36 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={{
                          duration: revealReduceMotion ? 0.01 : SKILLS_REVEAL_CARD_SLIDE_MS / 1000,
                          delay:
                            revealReduceMotion
                              ? 0
                              : (gridRevealDelayMs + index * SKILLS_REVEAL_CARD_STAGGER_MS) / 1000,
                          ease: SKILLS_CONTENT_EASE,
                        }}
                        style={{ willChange: "transform, opacity" }}
                      >
                        {cardInner}
                      </motion.div>
                    );
                  }
                  return (
                    <div key={title} className={columnClass}>
                      {cardInner}
                    </div>
                  );
                })}
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

const SkillArsenal = ({
  panelSettled = true,
  reduceMotion = false,
}: {
  /** False until section panel wipe + settle finishes (see `navigateTo` + `CONTENT_SETTLE_DELAY`). */
  panelSettled?: boolean;
  reduceMotion?: boolean | null;
}) => {
  const [activeSubskills, setActiveSubskills] = useState<"core" | "tools" | null>(null);
  const [skillsIconFlourish, setSkillsIconFlourish] = useState(false);
  const skillsFlourishCommittedRef = useRef(false);
  const skillsFlourishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealActive = panelSettled;
  const revealRm = !!reduceMotion;

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

  useEffect(() => {
    if (!revealActive || revealRm || SKILLS_SHOW_INTRO_PAIR_CARDS) return;
    scheduleSkillsIconFlourish(SKILLS_INLINE_MOTION_END_S);
  }, [revealActive, revealRm, scheduleSkillsIconFlourish]);

  return (
    <section
      id="skills"
      data-skills-icon-flourish={skillsIconFlourish ? "true" : undefined}
      className="no-scrollbar relative flex h-full min-h-0 w-full flex-col overflow-x-hidden overflow-y-visible bg-black text-white scroll-mt-6"
    >
      <SectionGridOverlay />
      <div
        className="container relative z-10 mx-auto flex h-full min-h-0 w-full max-w-full min-w-0 flex-1 flex-col overflow-visible px-4 sm:px-6 pt-[calc(5.25rem+2px)] md:pt-[calc(6.25rem+2px)] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-8 md:pb-9"
        style={
          SKILLS_LAYOUT.sectionOffsetRem !== 0
            ? { transform: `translateY(${SKILLS_LAYOUT.sectionOffsetRem}rem)` }
            : undefined
        }
      >
        {!SKILLS_SHOW_INTRO_PAIR_CARDS && SKILLS_SHOW_AMBIENT_MARQUEE_BG ? (
          <>
            <div
              className="skills-ambient-bleed skills-ambient-bleed--above pointer-events-none absolute inset-x-0 top-0 bottom-1/2 z-0 flex justify-center px-1 sm:px-2 md:px-3"
              aria-hidden
            >
              <div
                className="skills-ambient-bleed-slot relative h-full w-full min-h-0 max-w-[min(100%,1180px)] overflow-hidden [border-radius:0_2rem_0_2rem] max-sm:[border-radius:0_1.35rem_0_1.35rem]"
                data-skills-ambient-row="core"
              >
                <SkillsAmbientWall band="core" />
              </div>
            </div>
            <div
              className="skills-ambient-bleed skills-ambient-bleed--below pointer-events-none absolute inset-x-0 top-1/2 bottom-0 z-0 flex justify-center px-1 sm:px-2 md:px-3"
              aria-hidden
            >
              <div
                className="skills-ambient-bleed-slot relative h-full w-full min-h-0 max-w-[min(100%,1180px)] overflow-hidden [border-radius:0_2rem_0_2rem] max-sm:[border-radius:0_1.35rem_0_1.35rem]"
                data-skills-ambient-row="tools"
              >
                <SkillsAmbientWall band="tools" />
              </div>
            </div>
          </>
        ) : null}
        <div className="relative z-[2] flex w-full min-h-0 flex-1 flex-col items-center justify-start pt-0 sm:pt-1 md:pt-2">
          <div className="flex w-full min-w-0 max-w-[min(100%,88.75rem)] min-h-0 max-h-full flex-col items-center">
            <div className="skills-inline-chrome relative flex w-full flex-col items-center">
            <div className="relative z-[4] flex w-full shrink-0 justify-center px-1 sm:px-2 md:px-3">
              <motion.div
                className="w-full max-w-[min(100%,1180px)]"
                initial={{ opacity: 0, y: -28 }}
                animate={
                  revealActive
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -28 }
                }
                transition={{
                  duration: revealRm ? 0.01 : SKILLS_REVEAL_TITLE_FADE_MS / 1000,
                  ease: SKILLS_CONTENT_EASE,
                }}
                style={{ willChange: "transform, opacity" }}
              >
                <SectionHeader
                  title="SKILLS"
                  align="center"
                  showBar={false}
                  compact
                  titleFade
                  titleClassName="font-semibold"
                  className="!mb-4 sm:!mb-5 md:!mb-6"
                />
              </motion.div>
            </div>
            {/* Cards area: intro pair (gated) + sub-skills overlay or inline dual panels */}
            <div className="skills-content-shell relative z-[2] w-full min-h-0 flex flex-col items-center justify-center overflow-visible">
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
                      {SKILLS_SHOW_IDEA_GEAR_DECOR ? (
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
                      ) : null}
                      <CardTitleSlot
                        style={{
                          bottom: SKILLS_CARD_LAYOUT.core.title.offsetY,
                          position: "absolute",
                          zIndex: 1,
                        }}
                      >
                        <span data-card-title-wrap>
                          <motion.span
                            className="block font-display font-semibold uppercase tracking-nav-caps leading-snug text-white h-[52px]"
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
                      {SKILLS_SHOW_IDEA_GEAR_DECOR ? (
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
                            <rect width="256" height="256" fill="none" stroke="none" />
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
                      ) : null}
                      <CardTitleSlot
                        style={{
                          bottom: SKILLS_CARD_LAYOUT.tools.title.offsetY,
                          position: "absolute",
                          zIndex: 1,
                        }}
                      >
                        <span data-card-title-wrap>
                          <motion.span
                            className="block font-display font-semibold uppercase tracking-nav-caps leading-snug text-white h-[52px]"
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

          {!SKILLS_SHOW_INTRO_PAIR_CARDS ? (
            <div className="skills-carousel-wrap flex w-full min-w-0 max-w-full flex-col items-stretch justify-center overflow-visible py-1 sm:py-2">
              <div className="flex w-full min-w-0 max-w-full justify-center px-1 sm:px-2 md:px-3">
                <div
                  className="skills-source-stack relative isolate mx-auto flex w-full min-w-0 max-w-[min(100%,1180px)] flex-col gap-4 sm:gap-5 md:gap-6"
                  role="group"
                  aria-label="Skills detail"
                >
                  <div className="relative z-[3] flex min-h-0 w-full -translate-y-1 flex-col gap-4 sm:-translate-y-1.5 sm:gap-5 md:-translate-y-2 md:gap-6">
                    <div className="min-w-0">
                      <SkillsSubskillsPanel
                        slide="core"
                        variant="inline"
                        dualInline
                        orchestratedReveal
                        revealActive={revealActive}
                        revealReduceMotion={revealRm}
                        headerRevealDelayMs={SKILLS_REVEAL_HEADER_DELAY_MS}
                        gridRevealDelayMs={SKILLS_REVEAL_CORE_GRID_DELAY_MS}
                      />
                    </div>
                    <div className="min-w-0">
                      <SkillsSubskillsPanel
                        slide="tools"
                        variant="inline"
                        dualInline
                        orchestratedReveal
                        revealActive={revealActive}
                        revealReduceMotion={revealRm}
                        headerRevealDelayMs={SKILLS_REVEAL_HEADER_DELAY_MS}
                        gridRevealDelayMs={SKILLS_REVEAL_TOOLKIT_GRID_DELAY_MS}
                      />
                    </div>
                  </div>
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
          </div>
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
  const [navButtonsFaded, setNavButtonsFaded] = useState(false);
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
  /** FEATURED WRITING → open this PDF in SupportingProjectsSection loader after navigation. */
  const [supportingPdfIntent, setSupportingPdfIntent] = useState<SupportingArchivePdfItem | null>(null);
  const clearSupportingPdfIntent = useCallback(() => setSupportingPdfIntent(null), []);
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

  // Preload SHOWCASE carousel assets + full detail-hero video buffer (DetailCardMedia uses preload="auto").
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

        // Video file — auto so detail overlay hero can autoplay smoothly after morph (same URLs as carousel previews).
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
    const root = slidesRef.current;
    const menuEl = document.getElementById("menu");
    if (root && menuEl) {
      root.scrollTo({ left: menuEl.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    scrollToId("menu", reduceMotion ? "auto" : "smooth");
  };

  const navigateTo = (id: string) => {
    setIsSideNavOpen(false);
    if (isTransitioning) return;

    // SHOWCASE sub-route: swap carousel ↔ Supporting & archive in place (no panel slide / settle reset).
    if (
      (id === "projects" && currentSection === "projects-supporting") ||
      (id === "projects-supporting" && currentSection === "projects")
    ) {
      transitionTimeoutsRef.current.forEach((t) => window.clearTimeout(t));
      transitionTimeoutsRef.current = [];
      setCurrentSection(id);
      return;
    }

    // Already on SHOWCASE: close project detail or no-op — do not replay panel slide (avoids layout flash).
    if (id === "projects" && currentSection === "projects") {
      if (activeShowcaseProjectId) {
        setActiveShowcaseProjectId(null);
      }
      return;
    }

    if (reduceMotion) {
      setCurrentSection(id === "menu" ? null : id);
      startTransition(() => setPanelSettled(true));
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
      // SHOWCASE (projects): settle immediately so carousel + tabs reserve height and fade with the panel — delayed settle caused a second layout/opacity beat after the slide.
      setPanelSettled(id === "projects");
      setCurrentSection(id);
      setTransitionTarget(id);
      setIsTransitioning(true);
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

  const openFeaturedPdfInSupporting = (item: SupportingArchivePdfItem) => {
    setSupportingPdfIntent(item);
    navigateTo("projects-supporting");
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
      className={`selection:bg-portfolio-blue selection:text-white transition-colors duration-500 ${
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
        className="fixed top-5 right-3 sm:top-6 sm:right-4 z-50 flex items-center gap-2 sm:gap-2.5"
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
            transition={SPRING.ui}
          >
            <Button
              onClick={() => setIsResumeMode(!isResumeMode)}
              size="icon"
              aria-label={isResumeMode ? "Exit resume mode" : "Enter resume mode"}
              className={`shadow-xl border-[3px] transition-colors duration-200 font-display rounded-full h-14 w-14 min-h-0 min-w-0 p-0 flex items-center justify-center [&_svg]:!size-5 ${
                isResumeMode
                  ? "bg-black text-white border-black hover:bg-zinc-800"
                  : "bg-black text-white border-black hover:bg-white hover:text-black"
              }`}
            >
              {isResumeMode ? <Zap size={20} /> : <FileText size={20} />}
            </Button>
          </motion.div>
        )}

        {!isResumeMode && !(currentSlideId === "hero" && currentSection === null) && (currentSlideId !== "menu" || currentSection !== null) && (
          <motion.div whileTap={TAP} transition={SPRING.ui}>
            <Button
              type="button"
              onClick={() => setIsSideNavOpen(true)}
              size="icon"
              aria-label="Open navigation menu"
              className="shadow-xl border-[3px] transition-colors duration-200 font-display rounded-full h-14 w-14 min-h-0 min-w-0 p-0 flex items-center justify-center bg-black text-white border-black hover:bg-white hover:text-black [&_svg]:!size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
          onNavigate={navigateFromMenu}
        />
      )}

      {/* Back to menu — above panels so it stays clickable when viewing a section */}
      {!isResumeMode && (
        <BackToMenuButton
          show={currentSection !== null}
          fadeOut={navButtonsFaded}
          ariaLabel={
            currentSection === "projects" && activeShowcaseProjectId
              ? "Back to showcase"
              : currentSection === "projects-supporting"
                ? "Back to showcase"
                : "Back to menu"
          }
          onBack={() => {
            if (currentSection === "projects" && activeShowcaseProjectId) {
              setActiveShowcaseProjectId(null);
              return;
            }
            if (currentSection === "projects-supporting") {
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
              onQuickProjects={() => navigateTo("projects")}
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
              className={`fixed inset-0 flex min-h-0 flex-col overflow-x-hidden no-scrollbar ${
                currentSection === "projects-supporting" || currentSection === "experience"
                  ? "overflow-y-hidden"
                  : "overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
              }`}
              style={{
                backgroundColor: "#000",
                zIndex: currentSection ? 40 : 30,
                pointerEvents: transitionTarget === "menu" ? "none" : "auto",
                // Dropping will-change after settle avoids Chromium keeping section text on a blurry GPU layer.
                willChange: !panelSettled || isTransitioning ? "transform" : "auto",
                ...(currentSection === "projects-supporting" || currentSection === "experience"
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
              {!reduceMotion && transitionTarget !== "menu" && transitionTarget === currentSection && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] z-10 pointer-events-none"
                  style={{
                    backgroundColor: SECTION_ACCENT_COLOR[currentSection] ?? "var(--palette-blue)",
                    boxShadow: isProjectsPage ? "none" : accentGlowShadow(SECTION_ACCENT_COLOR[currentSection] ?? "var(--palette-blue)", true),
                  }}
                  aria-hidden
                />
              )}
              {!reduceMotion && transitionTarget === "menu" && (
                <motion.div
                  className="absolute top-0 bottom-0 w-[2px] z-10 pointer-events-none"
                  style={{
                    backgroundColor: SECTION_ACCENT_COLOR[currentSection] ?? "var(--palette-blue)",
                    transform: "translateX(-2px)",
                    boxShadow: isProjectsPage ? "none" : accentGlowShadow(SECTION_ACCENT_COLOR[currentSection] ?? "var(--palette-blue)", true),
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
                  transform layer — Chromium rasterizes body text soft. Outer panel motion keeps the slide.
                  flex-1 min-h-0 binds height to the viewport so SHOWCASE flex spacers can resolve (min-h-screen grew unbounded).
                  Projects: no vertical overflow clip — tall showcase + folder card scroll on the panel (no-scrollbar). */}
              <div
                className={
                  currentSection === "projects"
                    ? "flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-visible"
                    : currentSection === "skills"
                      ? "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-visible"
                      : "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
                }
              >
                {currentSection === "profile" && <PhantomProfile />}
                {reduceMotion ? (
                  <>
                    {currentSection === "projects" && (
                      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden">
                        <PalaceProjects
                          onSelectProject={setActiveShowcaseProjectId}
                          onOpenSupporting={() => navigateTo("projects-supporting")}
                          onOpenFeaturedPdfInSupporting={openFeaturedPdfInSupporting}
                          activeProjectId={activeShowcaseProjectId}
                        />
                      </div>
                    )}
                    {currentSection === "projects-supporting" && (
                      <SupportingProjectsSection
                        onNavTransitionChange={setNavButtonsFaded}
                        pendingPdfFromShowcase={supportingPdfIntent}
                        onPendingPdfFromShowcaseConsumed={clearSupportingPdfIntent}
                        onReturnToShowcaseAfterFeaturedPreview={() => navigateTo("projects")}
                      />
                    )}
                  </>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    {currentSection === "projects" && (
                      <div
                        key="projects"
                        className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden"
                      >
                        <PalaceProjects
                          onSelectProject={setActiveShowcaseProjectId}
                          onOpenSupporting={() => navigateTo("projects-supporting")}
                          onOpenFeaturedPdfInSupporting={openFeaturedPdfInSupporting}
                          activeProjectId={activeShowcaseProjectId}
                        />
                      </div>
                    )}
                    {currentSection === "projects-supporting" && (
                      <motion.div
                        key="projects-supporting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: SHOWCASE_SUBROUTE_FADE_S, ease: EASE.out }}
                        className="w-full"
                      >
                        <SupportingProjectsSection
                          onNavTransitionChange={setNavButtonsFaded}
                          pendingPdfFromShowcase={supportingPdfIntent}
                          onPendingPdfFromShowcaseConsumed={clearSupportingPdfIntent}
                          onReturnToShowcaseAfterFeaturedPreview={() => navigateTo("projects")}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
                {currentSection === "experience" && <ConfidantExperience />}
                {currentSection === "social" && <SocialLink />}
                {currentSection === "skills" && (
                  <SkillArsenal panelSettled={panelSettled} reduceMotion={reduceMotion} />
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
    </GridPhaseContext.Provider>
  );
}
