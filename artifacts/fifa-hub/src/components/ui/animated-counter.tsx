import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function AnimatedCounter({ value }: { value: string | number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Default to showing 0 if it's a number we plan to animate, otherwise show the actual string immediately to avoid jarring pop-ins for text.
  const strVal = String(value);
  const isPureNumber = /^[\d,]+$/.test(strVal);
  const [count, setCount] = useState(isPureNumber ? "0" : strVal);

  useEffect(() => {
    if (!isInView) return;

    if (isPureNumber) {
      const target = parseInt(strVal.replace(/,/g, ""), 10);
      let startTime: number;
      const duration = 2000; // 2 seconds for a dramatic count up

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // easeOutExpo for a really fast start and slow satisfying finish
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(easeOut * target);
        
        setCount(current.toLocaleString());

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target.toLocaleString());
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setCount(strVal);
    }
  }, [isInView, isPureNumber, strVal]);

  return <span ref={ref}>{count}</span>;
}
