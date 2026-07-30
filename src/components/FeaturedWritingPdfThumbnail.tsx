import { FileText } from "lucide-react";

/** Default height is fixed; width can grow (e.g. to match active tab). */
const DEFAULT_W = 120;
const FIXED_H = 216;

type Props = {
  pdfSrc: string;
  /** Display / raster width in CSS px (e.g. active tab width). */
  widthPx?: number;
  className?: string;
  /** Opens PDF in the in-app loader (e.g. FEATURED WRITING). */
  onActivate?: () => void;
};

/** Lightweight static preview card for FEATURED WRITING PDFs. */
export function FeaturedWritingPdfThumbnail({
  pdfSrc,
  widthPx = DEFAULT_W,
  className = "",
  onActivate,
}: Props) {
  const layoutW = Math.max(48, Math.min(widthPx, 720));
  const isBlank = !pdfSrc.trim();
  const interactive = typeof onActivate === "function";

  return (
    <div
      className={[
        "featured-writing-raised relative shrink-0 overflow-hidden rounded-[10px] border-0",
        interactive
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-portfolio-yellow/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          : "",
        className,
      ].join(" ")}
      style={{ width: layoutW, height: FIXED_H, maxWidth: "100%" }}
      role={interactive && !isBlank ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive && !isBlank ? "Open PDF in viewer" : undefined}
      onClick={interactive && !isBlank ? () => onActivate() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate();
              }
            }
          : undefined
      }
    >
      {isBlank ? (
        <div className="absolute inset-0 z-0 bg-black/35" aria-hidden />
      ) : (
        <div
          className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:10px_10px] bg-black/70"
          aria-hidden
        />
      )}

      {!isBlank ? (
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-2 px-3 text-center">
          <div className="flex h-14 w-11 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
            <FileText className="h-6 w-6 text-white/45" strokeWidth={1.2} aria-hidden />
          </div>
          <div className="space-y-1">
            <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/45">
              Document Preview
            </span>
            <span className="block font-heading text-[10px] uppercase tracking-[0.12em] text-[color:var(--palette-yellow-projects)]">
              Tap To Open
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
