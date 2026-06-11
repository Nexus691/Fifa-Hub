import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Set to 2026 World Cup Opening Ceremony (17:30 GMT / 1:30 PM ET)
    const targetDate = new Date("2026-06-11T17:30:00Z").getTime(); 

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsLive(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLive) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
            <h2 className="relative font-display text-4xl md:text-6xl text-primary tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
              THE TOURNAMENT IS LIVE
            </h2>
          </div>
          <p className="mt-4 text-sm md:text-base text-gray-400 tracking-[0.3em] uppercase">
            Follow every moment
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-6 md:gap-10">
      {[
        { label: "DAYS", value: timeLeft.days },
        { label: "HOURS", value: timeLeft.hours },
        { label: "MINUTES", value: timeLeft.minutes },
        { label: "SECONDS", value: timeLeft.seconds }
      ].map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl md:text-5xl lg:text-7xl text-primary leading-none mb-1 md:mb-2 tabular-nums">{item.value.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-primary/80">{item.label}</span>
          </div>
          {index < 3 && <div className="h-10 md:h-16 w-px bg-primary/20" />}
        </React.Fragment>
      ))}
    </div>
  );
}
