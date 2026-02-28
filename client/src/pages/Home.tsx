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
  SiYoutubeshorts,
} from "@icons-pack/react-simple-icons";

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
        fill="#ffffff"
      />
      <path
        d="m 47.02324,46 c -1.963,1.875 -3.396,3.783 -5,6 0.785,0.193 1.57,0.387 2.379,0.586 3.209,0.795 6.415,1.604 9.621,2.414 1.237,0.309 2.475,0.619 3.75,0.938 8.228,2.689 15.969,6.844 20.5,14.5 1.712,3.484 3.473583,6.634626 5.456749,9.266294 L 85.02324,84 c 0.584,-8.761 -1.038,-17.536 -6.375,-24.75 -6.544,-6.811 -22.178,-16.819 -31.625,-13.25 z"
        fill="#ffffff"
      />
      <path
        d="m 12.02324,13 c -0.33,0 -0.66,0 -1,0 -0.538,8.571 0.533,15.137 4,23 0.99,-1.32 1.98,-2.64 3,-4 0.784,0.557 1.567,1.114 2.375,1.688 7.44,4.954 15.382,8.57 24.187,10.124 11.168,2.177 20.864,7.202 30.438,13.188 0,-3 0,-3 -1.766,-4.867 -8.823,-7.131 -17.879,-10.516 -28.672,-13.508 -11.909,-3.311 -24.128,-8.531 -30.562,-19.625 -1.243,-3.225 -1.243,-3.225 -2,-6 z"
        fill="#ffffff"
      />
      <path
        d="m 18.02324,31 -2,2 c 0.102,4.495 4.849784,5.049176 7.860784,8.384176 2.887,2.616 3.143216,7.615824 7.139216,7.615824 4,-4.471 4,-4.471 4,-7 l 3,-1 c -0.736,-0.242 -1.472,-0.485 -2.23,-0.734 -5.317,-1.826 -9.553,-3.433 -13.77,-7.266 -1.311,-0.709 -2.638,-1.395 -4,-2 z"
        fill="#ffffff"
      />
      <path
        d="m 39.02324,39 c 0,0.66 0,1.32 0,2 0.609,0.211 1.218,0.422 1.845,0.639 16.073,5.587 16.073,5.587 31.155,13.361 1.327,0.679 2.658,1.35 4,2 -2.548,-6.486 -9.679,-10.337 -15.668,-13.336 -6.902,-2.846 -13.79,-5.041 -21.332,-4.664 z"
        fill="#ffffff"
      />
      <path
        d="m 57.02324,56 c -1.664,0.348 -3.33,0.684 -5,1 0,0.66 0,1.32 0,2 -0.99,0.33 -1.98,0.66 -3,1 0.594,0.15 1.189,0.301 1.801,0.456 2.738,0.704 5.468,1.436 8.199,2.169 0.935,0.236 1.869,0.472 2.832,0.715 5.769,1.573 9.996,3.538 14.609,7.368 1.559,1.292 1.559,1.292 3.559,2.292 -3.594,-8.496 -10.46,-12.728 -18.09,-17.234 -1.91,-0.766 -1.91,-0.766 -4.91,0.234 z"
        fill="#ffffff"
      />
      <path
        d="m 47.02324,46 c -1.963,1.875 -3.396,3.783 -5,6 1.935,0.531 3.873,1.049 5.812,1.562 1.619,0.436 1.619,0.436 3.27,0.879 4.722,0.904 8.629,-1.58 12.918,-3.441 -4.355,-4.8 -10.735,-7.367 -17,-5 z"
        fill="#ffffff"
      />
      <path
        d="m 33.02324,52 c 4.159,4.728 10.47,6.826 16.625,7.25 0.784,-0.082 1.568,-0.165 2.375,-0.25 0,-0.66 0,-1.32 0,-2 2.31,0 4.62,0 7,0 -2.885,-2.885 -6.33,-3.284 -10.188,-4.188 -0.743,-0.19 -1.486,-0.38 -2.251,-0.576 -4.905,-1.165 -8.62,-1.263 -13.561,-0.236 z"
        fill="#ffffff"
      />
      <path
        d="m 22.02324,29 c 0,3.418 0.823,4.878 3.039,7.434 4.266,3.407 9.718,5.22 14.961,6.566 2.402,-0.371 2.402,-0.371 4,-1 -1.65,-0.33 -3.3,-0.66 -5,-1 0,-1.32 0,-2.64 0,-4 -5.61,-2.64 -11.22,-5.28 -17,-8 z m 20,9 c -3,1 -3,1 -3,1 z"
        fill="#ffffff"
      />
      <path
        d="m 54.77324,58.9375 c -1.078,0.009 -2.155,0.018 -3.266,0.027 -0.819,0.012 -1.639,0.024 -2.484,0.035 2.738,1.826 4.348,2.499 7.449,3.29 0.848,0.219 1.695,0.438 2.569,0.664 0.881,0.221 1.762,0.443 2.67,0.672 0.892,0.229 1.785,0.458 2.705,0.695 2.201,0.565 4.403,1.125 6.607,1.679 0,-0.989 0,-1.98 0,-3 -5.811,-3.037 -9.7,-4.133 -16.25,-4.062 z"
        fill="#ffffff"
      />
      <path
        d="m 12.02324,17 c -0.33,0 -0.66,0 -1,0 -0.537,7.115 1.303,12.45 4,19 2,-3 2,-3 3,-6 -0.961,-2.375 -0.961,-2.375 -2.375,-5 -1.432,-2.689 -2.66,-5.104 -3.625,-8 z"
        fill="#ffffff"
      />
      <path
        d="m 73.02324,63 c -0.66,0.33 -1.32,0.66 -2,1 1.517,4.55 5.169,6.501 9,9 -1.668,-3.941 -4.227,-6.789 -7,-10 z"
        fill="#ffffff"
      />
      <path
        d="m 26.955809,47 -2,1 c 6.074,5.059 15.026147,9.417282 18.890147,9.170282 0.68,-0.268 -7.591147,-4.894282 -6.890147,-5.170282 -3.235,-2.156 -6.372,-3.615 -10,-5 z"
        fill="#ffffff"
      />
      <path
        d="m 72.02324,51 c -0.66,0.99 -1.32,1.98 -2,3 1.98,0.99 3.96,1.98 6,3 -1.152,-2.468 -2.048,-4.048 -4,-6 z"
        fill="#ffffff"
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
      width={size + 2}
      height={size + 2}
      className={className}
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
        fill="white"
      />
      <path
        d="m 3.6072687,15.767501 c -1.87558,3.793 -2.92017395,8.0828 -2.93026695,12.5948 l 0.106032,-0.2174 0.133735,-0.2605 0.24443995,-0.4532 0.18848,-0.3343 0.22024,-0.3773 0.25234,-0.4171 0.1862301,-0.2987 0.20076,-0.314 0.21536,-0.3285 0.23009,-0.342 0.24491,-0.3546 0.25982,-0.3663 0.2748399,-0.3769 c 0.09413,-0.1274 0.1907701,-0.2564 0.2899601,-0.3868 l 0.3051699,-0.3956 0.3204901,-0.4036 c 2.9536499,-3.6648 7.7804202,-8.18 14.8078202,-10.4917 -1.4297,-0.3801 -2.935,-0.5908 -4.4857,-0.5819 -4.2255,-0.013 -8.0974303,1.5494 -11.0647503,4.1056 z"
        fill="white"
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
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" />
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
          className="tool-logo-favicon shrink-0 opacity-90"
        />
      );
    }
    return (
      <img
        src={`https://cdn.simpleicons.org/${icon}/ffffff`}
        alt=""
        width={size}
        height={size}
        className="shrink-0 opacity-90"
      />
    );
  }
  const Icon = icon;
  return <Icon size={size} className="opacity-90 shrink-0" />;
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

const scrollToId = (id: string, behavior: ScrollBehavior = "smooth") => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior, block: "nearest", inline: "start" });
};

const NAV_ITEMS: { id: string; label: string; icon: LucideIcon; color: string; sub: string; microLabel: string }[] = [
  { id: "profile", label: "PROFILE", sub: "Summary", icon: User, color: "bg-red-600", microLabel: "OPEN" },
  { id: "projects", label: "PROJECTS", sub: "Projects", icon: Zap, color: "bg-yellow-400", microLabel: "VIEW" },
  { id: "experience", label: "WORK EXPERIENCE", sub: "Career History", icon: Star, color: "bg-blue-600", microLabel: "ENTER" },
  { id: "social", label: "COMMUNITY", sub: "Community", icon: Heart, color: "bg-pink-500", microLabel: "VIEW" },
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
          className="fixed z-50"
          style={{
            left: "calc(1rem + env(safe-area-inset-left))",
            bottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          }}
        >
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
        className={`${sizeClasses} font-display ${color} leading-none tracking-tight uppercase -translate-y-0.5`}
      >
        <TextShutter
          text={title}
          as="span"
          direction="ltr"
          duration={titleDuration}
          stagger={titleStagger}
          split="words"
          trigger="viewport"
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
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
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
    <section id="profile" className={`relative py-16 md:py-20 pb-12 bg-black text-white scroll-mt-6 ${SLIDE}`}>
      <SectionGridOverlay />
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center lg:items-start">
          <motion.div 
            ref={profileLeftRef}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.342, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 lg:min-w-[36rem] lg:shrink-0 mt-[25%]"
          >
             <SectionHeader
               key={profileLeftInView ? "profile-in" : "profile-out"}
               title="PROFILE"
               color="text-white"
               showBar={false}
               compact
               className="!mb-5 -mt-[5%] -ml-[3px]"
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
               className="relative w-full max-w-xl mt-1 min-h-[2px]"
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
              className="relative w-full max-w-xl mt-1 overflow-visible min-w-0 min-h-[60px] isolate"
              style={{ marginLeft: "-20px" }}
            >
              <motion.div
                className="flex flex-nowrap items-center gap-1"
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: overlayRevealed ? 0 : -24, opacity: overlayRevealed ? 1 : 0 }}
                transition={{ duration: BUTTON_FADE_DURATION_MS / 1000, delay: overlayRevealed ? BUTTONS_DELAY_AFTER_SUMMARY_MS / 1000 : 0, ease: [0.16, 1, 0.3, 1] }}
              >
               <ExpandCircleButton icon={<FileText size={24} />} expanded>Writer</ExpandCircleButton>
               <ExpandCircleButton icon={<Monitor size={24} />} expanded>Digital Media</ExpandCircleButton>
               <ExpandCircleButton icon={<ListOrdered size={24} />} expanded>Content Strategy</ExpandCircleButton>
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
               className="mt-3 max-w-xl"
               initial={{ opacity: 0, y: 14 }}
               animate={{ opacity: overlayRevealed ? 1 : 0, y: overlayRevealed ? 0 : 14 }}
               transition={{ duration: SUMMARY_DURATION_S, delay: overlayRevealed ? SUMMARY_DELAY_S : 0, ease: [0.16, 1, 0.3, 1] }}
             >
               <p className="font-heading text-sm tracking-[0.22em] uppercase text-zinc-400 mb-2">SUMMARY</p>
               <p className="font-body text-base md:text-lg text-zinc-300 leading-relaxed">
                 Writer and digital media coordinator focused on interactive content creation and community management. Blends creative storytelling with analytical strategy to drive engagement.
               </p>
             </motion.div>
          </motion.div>
          
          <motion.div
            ref={rawblemRef}
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.52, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => rawblemInView && setRawblemFloatReady(true)}
            className="w-full lg:w-1/2 lg:min-w-0 flex justify-center mt-6 lg:mt-[16%]"
          >
            <div className="w-full max-w-[240px] md:max-w-[300px] aspect-square flex items-center justify-center">
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

// --- COMMUNITY ---
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
             COMMUNITY
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
            <p className="text-zinc-500 text-sm">Community details coming soon</p>
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
      { title: "DESIGN & PRODUCTIVITY", titleCase: "Design & Productivity", subtitle: "Tools & Technologies", items: ["Microsoft Office 365", "Adobe Creative Suite", "Canva", "Procreate", "Clip Studio Paint"] },
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
// Core: Writing & Narrative, Digital & Visual Media, Professional Practices + items each.
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

// Controls vertical positioning of the SKILLS block (header + cards) in rem.
const SKILLS_LAYOUT = {
  sectionOffsetRem: 5, // increase to move entire SKILLS block further down
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
              ? "0 12px 24px -8px rgba(34,211,238,0.3), 0 0 0 1px rgba(34,211,238,0.2)" 
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

/* From Uiverse.io by Adrwaan - adapted to match MAIN MENU card style (no extra glow block) */
const UiverseCard = styled.div`
  position: relative;
  width: 360px;
  height: 270px;
  border-radius: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-6px);
  }

  &:hover .paperplane {
    transform: scale(1.07) translateY(-10%) rotate(18deg);
  }

  &:hover [data-ai-star] {
    fill: #f5f5f5;
  }

  &:hover [data-card-title-wrap] {
    transform: scale(1.08);
  }

  /* Main skill cards: 10% larger than base */
  &.skills-main-card {
    width: 396px;
    height: 297px;
  }

  /* Expanded subskills overlay: span two cards wide, 1.5x height (+5% height, pull by bottom) */
  &.skills-subcard {
    width: min(100%, 752px);
    height: 319px;
  }
`;

const CardBlackFace = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 364px;
  height: 274px;
  /* Subtle glassy background over the global black field */
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  overflow: hidden; /* ensure sheen stays clipped to this card */

  /* Main skill cards: 10% larger inner face */
  .skills-main-card:not(.skills-subcard) & {
    width: 400px;
    height: 301px;
  }

  /* Match expanded subskills card footprint (+5% height) */
  .skills-subcard & {
    width: min(100%, 760px);
    height: 326px;
  }

  /* Border-only highlight overlay (keeps existing style, just animates emphasis) */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(255, 255, 255, 0.45);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover::before {
    opacity: 1;
  }

  /* Sheen wipe overlay on hover (Quiet Turkey–style), preserving existing style */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.03) 35%,
      rgba(255, 255, 255, 0.16) 47%,
      rgba(255, 255, 255, 0.16) 53%,
      rgba(255, 255, 255, 0.03) 65%,
      transparent 100%
    );
    transform: translateX(-140%) skewX(-12deg);
    opacity: 0;
    transition:
      transform 0.75s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.45s cubic-bezier(0.19, 1, 0.22, 1);
    mix-blend-mode: screen;
  }

  &:hover::after {
    transform: translateX(140%) skewX(-12deg);
    opacity: 1;
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

/** Rule-of-thirds overlay for positioning. Set showRuleOfThirds = true to show again. */
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
      rgba(255, 255, 255, 0.22) calc(33.333% - 0.5px),
      rgba(255, 255, 255, 0.22) calc(33.333% + 0.5px),
      transparent calc(33.333% + 0.5px)
    ),
    linear-gradient(
      to right,
      transparent calc(66.666% - 0.5px),
      rgba(255, 255, 255, 0.22) calc(66.666% - 0.5px),
      rgba(255, 255, 255, 0.22) calc(66.666% + 0.5px),
      transparent calc(66.666% + 0.5px)
    ),
    /* Horizontal lines at 1/3 and 2/3 */
    linear-gradient(
      to bottom,
      transparent calc(33.333% - 0.5px),
      rgba(255, 255, 255, 0.22) calc(33.333% - 0.5px),
      rgba(255, 255, 255, 0.22) calc(33.333% + 0.5px),
      transparent calc(33.333% + 0.5px)
    ),
    linear-gradient(
      to bottom,
      transparent calc(66.666% - 0.5px),
      rgba(255, 255, 255, 0.22) calc(66.666% - 0.5px),
      rgba(255, 255, 255, 0.22) calc(66.666% + 0.5px),
      transparent calc(66.666% + 0.5px)
    );
  background-size: 100% 100%;
  background-position: 0 0, 0 0, 0 0, 0 0;
  background-repeat: no-repeat;
`;

const SkillArsenal = () => {
  const [activeSubskills, setActiveSubskills] = useState<"core" | "tools" | null>(null);

  return (
    <section
      id="skills"
      className={`relative flex flex-col bg-black text-white scroll-mt-6 min-h-screen py-20 md:py-24 ${SLIDE}`}
    >
      <SectionGridOverlay />
      <div
        className="container mx-auto px-6 relative z-10 flex flex-col items-center flex-1 min-h-0 w-full overflow-visible"
        style={{ transform: `translateY(${SKILLS_LAYOUT.sectionOffsetRem}rem)` }}
      >
        {/* Header block */}
        <div className="relative z-20 flex-none w-full max-w-4xl mt-0 mb-8">
          <SectionHeader title="SKILLS" align="center" showBar={false} compact />
        </div>
        {/* Cards area below; centered under header and responsive */}
        <div className="relative z-0 w-full max-w-4xl flex flex-col items-center min-h-[420px] overflow-visible">
          <div className="flex flex-wrap justify-center items-center gap-8 w-full">
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 w-full"
              initial={{ opacity: 1 }}
              animate={{
                opacity: activeSubskills ? 0 : 1,
              }}
              transition={{ duration: MORPH_DUR, ease: MORPH_EASE }}
              style={{ pointerEvents: activeSubskills ? "none" : "auto", transform: "translateY(5%)" }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0 }}
              >
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
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
              >
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
                          TOOLS AND TECHNOLOGIES
                        </motion.span>
                      </span>
                    </CardTitleSlot>
                  </CardBlackFace>
                </UiverseCard>
              </motion.div>
            </motion.div>
          </div>
          <AnimatePresence>
            {activeSubskills && (
              <motion.div
                key="skills-subcard"
                initial={{ opacity: 0, scale: 0.95, y: 32 }}
                animate={{ opacity: 1, scale: 1.18, y: "-7.5%" }}
                exit={{ opacity: 0, scale: 1.02, y: 16 }}
                transition={{ duration: MORPH_EXPAND_DUR, ease: MORPH_EXPAND_EASE }}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
                onClick={() => setActiveSubskills(null)}
              >
                <UiverseCard className="skills-main-card skills-subcard">
                  <CardBlackFace>
                    {showRuleOfThirds && <RuleOfThirdsOverlay />}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSubskills(null);
                      }}
                      className="absolute top-4 right-4 z-20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-white border border-white/30 bg-white/5 hover:bg-cyan-500 hover:border-cyan-400 hover:text-white rounded-md transition-colors duration-200 shadow-sm"
                      aria-label="Close subskills"
                    >
                      Close
                    </button>
                    <div className="relative z-10 px-6 md:px-8 py-4 pt-12 text-left space-y-3 max-h-[70vh] overflow-y-auto">
                      <div className="flex items-center justify-between gap-4 md:gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                            SYSTEM // {activeSubskills === "core" ? "CORE SUB-SKILLS" : "TOOLS SUB-SKILLS"}
                          </p>
                          <p className="font-display text-lg md:text-xl tracking-[0.14em] uppercase text-white">
                            {activeSubskills === "core" ? "Execution Detail" : "Operational Stack"}
                          </p>
                        </div>
                      </div>
                      {activeSubskills === "core" ? (
                        <div className="space-y-2.5 text-[12px] md:text-[13px] leading-snug text-zinc-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <ul className="space-y-1">
                              {[
                                "Content Writing",
                                "Content Editing",
                                "Proofreading",
                                "Storytelling",
                                "Narrative Development",
                                "Digital Media Coordination",
                                "Social Media Operations",
                                "Audience Engagement",
                              ].map((label) => (
                                <li key={label} className="flex items-center gap-2">
                                  <SiArc size={12} className="shrink-0 text-cyan-400 opacity-80" />
                                  <span>{label}</span>
                                </li>
                              ))}
                            </ul>
                            <ul className="space-y-1">
                              {[
                                "Visual Communication",
                                "Content Production",
                                "Research",
                                "Fact-Checking",
                                "Time Management",
                                "Team Collaboration",
                                "Independent Work",
                              ].map((label) => (
                                <li key={label} className="flex items-center gap-2">
                                  <SiArc size={12} className="shrink-0 text-cyan-400 opacity-80" />
                                  <span>{label}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5 text-[12px] md:text-[13px] leading-snug text-zinc-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400 mb-1">
                                Design &amp; Productivity
                              </p>
                              <ul className="space-y-1">
                                {[
                                  "Microsoft Office 365",
                                  "Adobe Creative Suite",
                                  "Canva",
                                  "Procreate",
                                  "Clip Studio Paint",
                                ].map((tool) => (
                                  <li key={tool} className="flex items-center gap-2">
                                    <ToolIcon name={tool} size={14} />
                                    <span>{tool}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400 mb-1">
                                Video &amp; Writing
                              </p>
                              <ul className="space-y-1">
                                {["DaVinci Resolve", "CapCut", "Final Draft", "Arc Studio"].map((tool) => (
                                  <li key={tool} className="flex items-center gap-2">
                                    <ToolIcon name={tool} size={14} />
                                    <span>{tool}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400 mb-1">
                                Social Platforms
                              </p>
                              <ul className="space-y-1">
                                {[
                                  "Hootsuite",
                                  "TikTok Creator Tools",
                                  "Instagram Reels",
                                  "YouTube Shorts",
                                ].map((tool) => (
                                  <li key={tool} className="flex items-center gap-2">
                                    <ToolIcon name={tool} size={14} />
                                    <span>{tool}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBlackFace>
                </UiverseCard>
              </motion.div>
            )}
          </AnimatePresence>
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
