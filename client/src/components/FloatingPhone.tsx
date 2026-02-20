import { motion } from "framer-motion";

const POP_TRANSITION = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

type FloatingPhoneProps = {
  accentClass?: string;
};

/** Horizontal floating phone: colored shadow + white card, no screen graphics. Pops on hover. */
export function FloatingPhone({ accentClass = "bg-violet-500" }: FloatingPhoneProps) {
  return (
    <div
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-30deg) rotateX(15deg)",
      }}
      className={`rounded-[24px] ${accentClass}`}
    >
      <motion.div
        initial={{ transform: "translateZ(8px) translateY(-2px)" }}
        whileHover={{ transform: "translateZ(32px) translateY(-8px)" }}
        transition={POP_TRANSITION}
        className="relative w-96 h-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white border-l-neutral-200 border-t-neutral-200 bg-neutral-900 p-1 pl-[3px] pt-[3px]"
      >
        <div className="relative z-0 h-full w-full overflow-hidden rounded-[20px] bg-white" />
      </motion.div>
    </div>
  );
}
