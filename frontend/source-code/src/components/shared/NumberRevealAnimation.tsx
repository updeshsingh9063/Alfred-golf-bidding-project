import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NumberRevealAnimationProps {
  numbers: number[];
  onComplete?: () => void;
  delay?: number;
}

export function NumberRevealAnimation({
  numbers,
  onComplete,
  delay = 300,
}: NumberRevealAnimationProps) {
  const [revealed, setRevealed] = useState<boolean[]>(
    () => new Array(numbers.length).fill(false),
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    numbers.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          if (i === numbers.length - 1) {
            setTimeout(() => onComplete?.(), 400);
          }
        }, delay * (i + 1)),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [numbers, delay, onComplete]);

  return (
    <div className="flex flex-wrap gap-3">
      {numbers.map((n, i) => (
        <div
          key={i}
          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-accent-deep"
        >
          <motion.span
            className="font-mono text-lg font-bold text-white"
            initial={{ y: 40, opacity: 0 }}
            animate={
              revealed[i]
                ? { y: 0, opacity: 1 }
                : { y: 40, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {n}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
