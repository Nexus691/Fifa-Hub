import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface OriginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  circleClassName?: string;
}

export function OriginButton({ 
  children, 
  className = "", 
  circleClassName = "bg-white/20", 
  onMouseEnter, 
  onMouseLeave,
  ...props 
}: OriginButtonProps) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLButtonElement>(null);
  
  const scale = useMotionValue(0);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20, restDelta: 0.001 });
  const easedScale = useTransform(smoothScale, [0, 1], [0, 1], { ease: t => t * t });

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    scale.set(1);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    scale.set(0);
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <button
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <motion.div
        style={{
          position: "absolute",
          left: cursorPos.x,
          top: cursorPos.y,
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          scale: easedScale,
          x: "-50%",
          y: "-50%",
          pointerEvents: "none",
        }}
        className={circleClassName}
      />
      <span className="relative z-10 w-full h-full flex items-center justify-center gap-2 text-inherit">
        {children}
      </span>
    </button>
  );
}
