import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WinProbabilityBarProps {
  homeProb: number;
  drawProb: number;
  awayProb: number;
}

export function WinProbabilityBar({ homeProb, drawProb, awayProb }: WinProbabilityBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="w-full h-3 rounded-full overflow-hidden flex bg-background/50 border border-border">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: '33.3%' }}
        animate={isInView ? { width: `${homeProb}%` } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: 'right' }}
      />
      <motion.div
        className="h-full bg-[#3A3A3A]"
        initial={{ width: '33.3%' }}
        animate={isInView ? { width: `${drawProb}%` } : {}}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <motion.div
        className="h-full bg-primary"
        initial={{ width: '33.3%' }}
        animate={isInView ? { width: `${awayProb}%` } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ opacity: 0.5, transformOrigin: 'left' }}
      />
    </div>
  );
}
