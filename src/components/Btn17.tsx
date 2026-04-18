import * as React from "react";
import styled, { keyframes } from "styled-components";

/* From Uiverse.io by doniaskima — adapted for project use */

const moveUpAlternate = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(80%);
  }
  51% {
    transform: translateY(-80%);
  }
  100% {
    transform: translateY(0);
  }
`;

const StyledBtn = styled.button`
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  appearance: button;
  background-color: #000;
  background-image: none;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 100%;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: 0.14em;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
  border: 0 solid;
  box-sizing: border-box;

  &:disabled {
    cursor: default;
  }

  &:-moz-focusring {
    outline: auto;
  }

  svg {
    display: block;
    vertical-align: middle;
  }

  [hidden] {
    display: none;
  }

  border-radius: 99rem;
  border-width: 2px;
  padding: 0.4rem 1rem;
  font-size: 0.75rem;
  z-index: 0;
  overflow: hidden;
  position: relative;

  .text-container {
    display: block;
    mix-blend-mode: difference;
    overflow: hidden;
    position: relative;
  }

  .text {
    display: block;
    position: relative;
    white-space: nowrap;
  }

  &:hover .text {
    animation: ${moveUpAlternate} 0.3s forwards;
  }

  &::before,
  &::after {
    --skew: 0.2;
    background: #fff;
    content: "";
    display: block;
    height: 102%;
    left: calc(-50% - 50% * var(--skew));
    pointer-events: none;
    position: absolute;
    top: -104%;
    transform: skew(calc(150deg * var(--skew))) translateY(var(--progress, 0));
    transition: transform 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    border: 0 solid;
  }

  &::after {
    --progress: 0%;
    left: calc(50% + 50% * var(--skew));
    top: 102%;
    z-index: -1;
  }

  &:hover::before {
    --progress: 100%;
  }

  &:hover::after {
    --progress: -102%;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export interface Btn17Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Btn17 = React.forwardRef<HTMLButtonElement, Btn17Props>(
  ({ children, className, ...props }, ref) => {
    return (
      <StyledBtn ref={ref} type="button" className={className} {...props}>
        <span className="text-container">
          <span className="text">{children}</span>
        </span>
      </StyledBtn>
    );
  }
);
Btn17.displayName = "Btn17";
