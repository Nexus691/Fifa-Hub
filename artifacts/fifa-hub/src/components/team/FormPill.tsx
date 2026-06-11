import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FormPillProps {
  result: 'W' | 'D' | 'L';
  index: number;
}

export function FormPill({ result, index }: FormPillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const getVariants = () => {
    switch (result) {
      case 'W': return { hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
      case 'L': return { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
      case 'D': return { hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } };
    }
  };

  const getColors = () => {
    switch (result) {
      case 'W': return 'bg-green-600 text-white';
      case 'L': return 'bg-red-600 text-white';
      case 'D': return 'bg-gray-600 text-white';
    }
  };

  return (
    <div ref={ref} className="overflow-hidden p-0.5">
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: index * 0.1, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold ${getColors()}`}
      >
        {result}
      </motion.div>
    </div>
  );
}
