import { useReducedMotion } from "framer-motion";

type Props = {
  className?: string;
};

/**
 * Fold animation from Uiverse.io (vk-uiux / orange-horse-73). Styles: `index.css` `.pdf-fold-loader`.
 */
export function PdfFoldLoader({ className = "" }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      className={`pdf-fold-loader ${reduceMotion ? "pdf-fold-loader--static" : ""} ${className}`.trim()}
      aria-hidden
    >
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
