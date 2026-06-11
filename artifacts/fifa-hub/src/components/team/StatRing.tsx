import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatRingProps {
  possession: number; // 0-100
  passAccuracy: number; // 0-100
  shotAccuracy: number; // 0-100
}

export function StatRing({ possession, passAccuracy, shotAccuracy }: StatRingProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const getCircumference = (r: number) => 2 * Math.PI * r;

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <svg ref={ref} viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        {/* Outer Ring: Possession */}
        <motion.circle
          cx="100" cy="100" r="80"
          fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="6"
        />
        <motion.circle
          cx="100" cy="100" r="80"
          fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={getCircumference(80)}
          initial={{ strokeDashoffset: getCircumference(80) }}
          animate={isInView ? { strokeDashoffset: getCircumference(80) * (1 - possession / 100) } : {}}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Mid Ring: Pass Accuracy */}
        <motion.circle
          cx="100" cy="100" r="60"
          fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="6"
        />
        <motion.circle
          cx="100" cy="100" r="60"
          fill="none" stroke="rgba(212,175,55,0.6)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={getCircumference(60)}
          initial={{ strokeDashoffset: getCircumference(60) }}
          animate={isInView ? { strokeDashoffset: getCircumference(60) * (1 - passAccuracy / 100) } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Inner Ring: Shot Accuracy */}
        <motion.circle
          cx="100" cy="100" r="40"
          fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="6"
        />
        <motion.circle
          cx="100" cy="100" r="40"
          fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={getCircumference(40)}
          initial={{ strokeDashoffset: getCircumference(40) }}
          animate={isInView ? { strokeDashoffset: getCircumference(40) * (1 - shotAccuracy / 100) } : {}}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-display font-bold text-foreground">{possession}%</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Possession</span>
      </div>
    </div>
  );
}
