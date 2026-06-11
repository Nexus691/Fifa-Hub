import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionLoaderProps {
  isLoading: boolean;
}

export function PageTransitionLoader({ isLoading }: PageTransitionLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-none"
        >
          <svg viewBox="0 0 300 200" className="w-64 max-w-full">
            {/* Center circle */}
            <circle
              cx="150" cy="100" r="30"
              fill="none"
              stroke="rgba(212,175,55,0.4)"
              strokeWidth="1"
              strokeDasharray="188"
              strokeDashoffset="188"
              style={{ animation: 'drawCircle 0.4s 0.1s ease both' }}
            />
            {/* Halfway line */}
            <line
              x1="150" y1="10" x2="150" y2="190"
              stroke="rgba(212,175,55,0.3)"
              strokeWidth="1"
              strokeDasharray="180"
              strokeDashoffset="180"
              style={{ animation: 'drawLine 0.25s 0s ease both' }}
            />
            {/* Pitch border */}
            <rect
              x="10" y="10" width="280" height="180"
              fill="none"
              stroke="rgba(212,175,55,0.2)"
              strokeWidth="1"
              strokeDasharray="920"
              strokeDashoffset="920"
              style={{ animation: 'drawBox 0.5s 0.15s ease both' }}
            />
            {/* Penalty boxes */}
            <rect
              x="10" y="40" width="40" height="120"
              fill="none"
              stroke="rgba(212,175,55,0.3)"
              strokeWidth="1"
              strokeDasharray="320"
              strokeDashoffset="320"
              style={{ animation: 'drawBox 0.4s 0.2s ease both' }}
            />
            <rect
              x="250" y="40" width="40" height="120"
              fill="none"
              stroke="rgba(212,175,55,0.3)"
              strokeWidth="1"
              strokeDasharray="320"
              strokeDashoffset="320"
              style={{ animation: 'drawBox 0.4s 0.2s ease both' }}
            />
          </svg>
          <style>{`
            @keyframes drawCircle {
              to { stroke-dashoffset: 0; }
            }
            @keyframes drawLine {
              to { stroke-dashoffset: 0; }
            }
            @keyframes drawBox {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
