import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Mock list of 48 flags
const FLAGS = [
  '🇦🇷', '🇧🇷', '🇫🇷', '🇪🇸', '🇬🇧', '🇩🇪', '🇮🇹', '🇳🇱', '🇵🇹', '🇧🇪', '🇭🇷', '🇺🇾',
  '🇨🇴', '🇲🇽', '🇺🇸', '🇸🇳', '🇯🇵', '🇲🇦', '🇨🇭', '🇩🇰', '🇷🇸', '🇵🇱', '🇦🇺', '🇰🇷',
  '🇹🇳', '🇨🇲', '🇨🇦', '🇪🇨', '🇶🇦', '🇸🇦', '🇮🇷', '🇨🇷', '🇼🇸', '🇬🇭', '🇨🇮', '🇳🇬',
  '🇩🇿', '🇪🇬', '🇿🇦', '🇨🇱', '🇵🇪', '🇻🇪', '🇵🇾', '🇧🇴', '🇸🇪', '🇳🇴', '🇫🇮', '🇮🇸'
];

export function FlagParallaxStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We track the scroll of the entire page
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 25, mass: 0.1 });
  
  // As user scrolls, move strip at 40% speed
  const x = useTransform(smoothScrollY, [0, 1500], [0, -600]);

  return (
    <div ref={containerRef} className="border-y border-[#1E1E1E] h-14 overflow-hidden flex items-center bg-background">
      <motion.div 
        className="flex gap-6 px-12 whitespace-nowrap will-change-transform"
        style={{ x }}
      >
        {FLAGS.map((flag, i) => (
          <span 
            key={i} 
            className="text-2xl opacity-50 hover:opacity-100 transition-all duration-300 cursor-default hover:scale-125 hover:-translate-y-1"
          >
            {flag}
          </span>
        ))}
        {/* Repeat flags for seamless scrolling if user scrolls very far */}
        {FLAGS.map((flag, i) => (
          <span 
            key={`dup-${i}`} 
            className="text-2xl opacity-50 hover:opacity-100 transition-all duration-300 cursor-default hover:scale-125 hover:-translate-y-1"
          >
            {flag}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
