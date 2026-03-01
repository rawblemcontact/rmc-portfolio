import * as React from "react";

/**
 * Simple alignment slider for nudging content left/right (e.g. button rows).
 * Preserved for later use — was used in PROFILE section for three buttons.
 *
 * Usage:
 *   const [offset, setOffset] = useState(0);
 *   <AlignmentSlider value={offset} onChange={setOffset} />
 *   <div style={{ marginLeft: `${offset}px` }}>...</div>
 */
export interface AlignmentSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  id?: string;
  className?: string;
}

export function AlignmentSlider({
  value,
  onChange,
  min = -24,
  max = 24,
  label = "Align",
  id = "alignment-slider",
  className = "",
}: AlignmentSliderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label htmlFor={id} className="font-mono text-xs text-zinc-500 whitespace-nowrap">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 accent-zinc-500"
      />
      <span className="font-mono text-xs text-zinc-600 tabular-nums">{value}px</span>
    </div>
  );
}
