import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function use3DTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relX = (e.clientX - centerX) / (rect.width / 2);
    const relY = (e.clientY - centerY) / (rect.height / 2);

    rotateY.set(relX * maxTilt);
    rotateX.set(-relY * maxTilt);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    ref,
    style: {
      rotateX: springX,
      rotateY: springY,
      transformStyle: "preserve-3d" as const,
      perspective: 600,
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}
