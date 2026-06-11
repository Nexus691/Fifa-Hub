import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MouseTrail() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Main cursor dot (instant)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Trailing ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const trailX = useSpring(cursorX, springConfig);
  const trailY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if we are on a desktop
    const checkDesktop = () => setIsDesktop(window.innerWidth > 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("resize", checkDesktop);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Primary Dot */}
      <motion.div
        className="fixed top-0 left-0 w-[6px] h-[6px] -ml-[3px] -mt-[3px] bg-primary rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_rgba(212,175,55,1)]"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 -ml-2 -mt-2 border-[1.5px] border-primary/50 bg-primary/10 rounded-full pointer-events-none z-[99998] backdrop-blur-[1px]"
        style={{
          x: trailX,
          y: trailY,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
