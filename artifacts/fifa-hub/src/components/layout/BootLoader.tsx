import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthCheck } from "@workspace/api-client-react";

const INSIGHTS = [
  "The 2026 World Cup will be the first to feature 48 teams, expanding from the traditional 32.",
  "104 matches will be played across 16 cities in the US, Canada, and Mexico.",
  "Estadio Azteca will become the first stadium to host matches in three separate World Cups.",
  "The tournament will span an unprecedented 39 days.",
  "12 groups of 4 teams will compete in the initial stage, with the top 8 third-place teams advancing.",
  "A new Round of 32 knockout stage has been introduced for the first time.",
  "The final will be held at MetLife Stadium in New Jersey on July 19, 2026.",
  "Over 5 million tickets are expected to be sold, breaking all previous records.",
  "Dallas will host the most matches of any city, with a total of 9 games.",
  "The opening match will be played in Mexico City on June 11, 2026.",
];

export function BootLoader({ onReady }: { onReady: () => void }) {
  const [progress, setProgress] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);

  // Poll backend health every 3 seconds
  // The component will unmount when onReady is called, naturally stopping the interval
  const { data: health, isSuccess } = useHealthCheck({
    query: {
      refetchInterval: 3000, 
      retry: false, 
    },
  });

  // Handle Insight rotation (every 8s)
  useEffect(() => {
    const timer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleScreenClick = () => {
    setInsightIndex((prev) => (prev + 1) % INSIGHTS.length);
  };

  // Simulate progress bar based on Render's 50s cold start
  useEffect(() => {
    let startTime = Date.now();
    const duration = 50000; // 50 seconds
    let frame: number;

    const updateProgress = () => {
      if (isSuccess) {
        setProgress(100);
        setTimeout(onReady, 800); // Give bar time to visually reach 100%
        return;
      }

      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 95, 95); // Cap at 95% until actually ready
      setProgress(rawProgress);

      frame = requestAnimationFrame(updateProgress);
    };

    frame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frame);
  }, [isSuccess, onReady]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden cursor-pointer"
      onClick={handleScreenClick}
    >
      <div className="absolute inset-0 bg-[url('/trophy-bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      {/* Central Content */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold tracking-widest text-[#D4AF37] mb-2 font-display">
            FIFA HUB
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase">
            Initializing Services
          </p>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="w-full mb-4">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#f3db7a]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
        
        {/* Progress text */}
        <div className="w-full flex justify-between items-center text-xs text-gray-500 font-mono tracking-wider mb-16">
          <span>{Math.floor(progress)}%</span>
          <span>
            {isSuccess 
              ? "READY" 
              : `ETA: ${Math.max(0, Math.ceil(50 - (progress / 100) * 50))}s`}
          </span>
        </div>

        {/* Insights Rotator */}
        <div className="h-24 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={insightIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-3">
                Did You Know?
              </span>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-[90%] font-light">
                {INSIGHTS[insightIndex]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <p className="absolute bottom-12 text-[10px] text-gray-600 tracking-widest uppercase animate-pulse">
          Click anywhere for next insight
        </p>
      </div>
    </div>
  );
}
