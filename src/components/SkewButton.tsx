import * as React from "react";
import styled from "styled-components";

/* From Uiverse.io by mrhyddenn — adapted for project use */

const StyledButton = styled.button<{ $animated?: boolean }>`
  position: relative;
  background: #fff;
  border: none;
  padding: 10px 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  min-width: 120px;
  text-transform: uppercase;
  cursor: pointer;
  transform: skew(-21deg);
  overflow: hidden;
  color: ${(p) => (p.$animated ? "#fff" : "#0a0a0a")};
  transition: color 0.5s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: ${(p) => (p.$animated ? "0" : "100%")};
    left: 0;
    background: rgb(20, 20, 20);
    opacity: ${(p) => (p.$animated ? 1 : 0)};
    z-index: 0;
    transition: all 0.5s;
  }

  &:hover {
    color: #fff;
  }

  &:hover::before {
    left: 0;
    right: 0;
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SkewInner = styled.span`
  display: inline-block;
  transform: skew(21deg);
  position: relative;
  z-index: 1;
  white-space: nowrap;
`;

export interface SkewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** When true, shows the filled/hover state (e.g. after one-time enter animation). */
  animated?: boolean;
}

export const SkewButton = React.forwardRef<HTMLButtonElement, SkewButtonProps>(
  ({ children, animated, ...props }, ref) => {
    return (
      <StyledButton ref={ref} type="button" $animated={animated} {...props}>
        <SkewInner>{children}</SkewInner>
      </StyledButton>
    );
  }
);
SkewButton.displayName = "SkewButton";
