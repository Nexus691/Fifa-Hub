import React, { useEffect, useRef } from 'react';

export function GoldenCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);

    const TRAIL_LENGTH = 8;
    const trail = Array(TRAIL_LENGTH).fill({ x: -100, y: -100 });
    let mouseX = -100, mouseY = -100;
    let frame: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Shift trail
      trail.unshift({ x: mouseX, y: mouseY });
      trail.pop();

      trail.forEach((point, i) => {
        const progress = 1 - (i / TRAIL_LENGTH);
        const radius = progress * 4;            // 4px -> 0px
        const opacity = progress * 0.35;        // 35% -> 0%

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none mix-blend-screen z-[9998]"
      aria-hidden="true"
    />
  );
}
