import * as React from "react";
import styled from "styled-components";

/* From Uiverse.io by vinodjangid07 — adapted for project use */

const StyledBtn = styled.button<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: ${(p) => (p.$expanded ? "180px" : "44px")};
  height: 44px;
  border: none;
  border-radius: ${(p) => (p.$expanded ? "50px" : "50%")};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.55);

  @media (min-width: 640px) {
    width: ${(p) => (p.$expanded ? "220px" : "52px")};
    height: 52px;
  }
  @media (min-width: 768px) {
    width: ${(p) => (p.$expanded ? "265px" : "60px")};
    height: 60px;
  }
  @media (min-width: 1280px) {
    width: ${(p) => (p.$expanded ? "280px" : "64px")};
    height: 64px;
  }
  @media (min-width: 1536px) {
    width: ${(p) => (p.$expanded ? "308px" : "70px")};
    height: 70px;
  }

  .sign {
    width: 44px;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: white;

    @media (min-width: 640px) { width: 52px; }
    @media (min-width: 768px) { width: 60px; }
    @media (min-width: 1280px) { width: 64px; }
    @media (min-width: 1536px) { width: 70px; }
  }

  .sign svg {
    width: 20px;
    height: 20px;
    @media (min-width: 768px) { width: 24px; height: 24px; }
    @media (min-width: 1280px) { width: 25px; height: 25px; }
    @media (min-width: 1536px) { width: 26px; height: 26px; }
  }

  .sign svg path {
    fill: currentColor;
  }
  .sign svg {
    stroke: currentColor;
  }

  .text {
    position: absolute;
    left: ${(p) => (p.$expanded ? "38px" : "50%")};
    right: ${(p) => (p.$expanded ? "10px" : "50%")};
    width: ${(p) => (p.$expanded ? "auto" : "0")};
    opacity: ${(p) => (p.$expanded ? 1 : 0)};
    color: white;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
    white-space: nowrap;
    padding-left: 0;
    padding-right: 0;
    overflow: visible;
    text-align: left;

    @media (min-width: 640px) {
      left: ${(p) => (p.$expanded ? "46px" : "50%")};
      right: ${(p) => (p.$expanded ? "12px" : "50%")};
      font-size: 0.75rem;
    }
    @media (min-width: 768px) {
      left: ${(p) => (p.$expanded ? "52px" : "50%")};
      right: ${(p) => (p.$expanded ? "14px" : "50%")};
      font-size: 0.8125rem;
    }
    @media (min-width: 1280px) {
      left: ${(p) => (p.$expanded ? "54px" : "50%")};
      right: ${(p) => (p.$expanded ? "14px" : "50%")};
      font-size: 0.8125rem;
    }
    @media (min-width: 1536px) {
      left: ${(p) => (p.$expanded ? "60px" : "50%")};
      right: ${(p) => (p.$expanded ? "16px" : "50%")};
      font-size: 0.875rem;
    }
  }

  &:hover {
    width: 180px;
    border-radius: 50px;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
    @media (min-width: 640px) { width: 220px; }
    @media (min-width: 768px) { width: 265px; }
    @media (min-width: 1280px) { width: 280px; }
    @media (min-width: 1536px) { width: 308px; }
  }

  &:hover .sign {
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
  }

  &:hover .text {
    opacity: 1;
    left: 38px;
    right: 10px;
    width: auto;
    font-size: 0.6875rem;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
    padding-left: 0;
    padding-right: 0;
    @media (min-width: 640px) { left: 46px; right: 12px; font-size: 0.75rem; }
    @media (min-width: 768px) { left: 52px; right: 14px; font-size: 0.8125rem; }
    @media (min-width: 1280px) { left: 54px; right: 14px; font-size: 0.8125rem; }
    @media (min-width: 1536px) { left: 60px; right: 16px; font-size: 0.875rem; }
  }

  &:active {
    transform: translate(2px, 2px);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

const DefaultIcon = () => (
  <svg viewBox="0 0 512 512" aria-hidden>
    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
  </svg>
);

export interface ExpandCircleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** When true, shows expanded state (same as hover) for enter animation. */
  expanded?: boolean;
}

export const ExpandCircleButton = React.forwardRef<HTMLButtonElement, ExpandCircleButtonProps>(
  ({ children, icon, expanded, ...props }, ref) => {
    return (
      <StyledBtn ref={ref} type="button" $expanded={expanded} {...props}>
        <div className="sign">{icon ?? <DefaultIcon />}</div>
        <div className="text">{children}</div>
      </StyledBtn>
    );
  }
);
ExpandCircleButton.displayName = "ExpandCircleButton";
