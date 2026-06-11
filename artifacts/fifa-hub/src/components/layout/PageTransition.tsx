import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import React from "react";

const overlayVariants = {
  initial: { opacity: 1, scale: 1 },
  enter: {
    opacity: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
  },
  exit: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] }
  }
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.1 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
  }
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location} 
        variants={pageVariants} 
        initial="initial"
        animate="enter" 
        exit="exit"
        className="w-full h-full"
      >
        {/* SVG Trace overlay */}
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background pointer-events-none"
        >
          <svg viewBox="0 0 300 200" className="w-64 max-w-full">
            <circle
              cx="150" cy="100" r="30"
              fill="none"
              stroke="rgba(212,175,55,0.4)"
              strokeWidth="1"
              strokeDasharray="188"
              strokeDashoffset="188"
              style={{ animation: 'drawCircle 0.4s 0.1s ease both' }}
            />
            <line
              x1="150" y1="10" x2="150" y2="190"
              stroke="rgba(212,175,55,0.3)"
              strokeWidth="1"
              strokeDasharray="180"
              strokeDashoffset="180"
              style={{ animation: 'drawLine 0.25s 0s ease both' }}
            />
          </svg>
        </motion.div>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
