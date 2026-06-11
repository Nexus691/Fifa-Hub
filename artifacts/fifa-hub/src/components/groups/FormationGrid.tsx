import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type FormationKey = '4-4-2' | '4-3-3' | '3-5-2' | '4-2-3-1';

const FORMATIONS: Record<FormationKey, { x: number; y: number }[]> = {
  '4-4-2': [
    { x: 50, y: 90 }, // GK
    { x: 20, y: 70 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 70 }, // Def
    { x: 20, y: 45 }, { x: 40, y: 45 }, { x: 60, y: 45 }, { x: 80, y: 45 }, // Mid
    { x: 35, y: 20 }, { x: 65, y: 20 }  // Fwd
  ],
  '4-3-3': [
    { x: 50, y: 90 }, // GK
    { x: 20, y: 70 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 70 }, // Def
    { x: 30, y: 45 }, { x: 50, y: 45 }, { x: 70, y: 45 }, // Mid
    { x: 20, y: 20 }, { x: 50, y: 20 }, { x: 80, y: 20 }  // Fwd
  ],
  '3-5-2': [
    { x: 50, y: 90 }, // GK
    { x: 30, y: 70 }, { x: 50, y: 70 }, { x: 70, y: 70 }, // Def
    { x: 15, y: 45 }, { x: 35, y: 45 }, { x: 50, y: 55 }, { x: 65, y: 45 }, { x: 85, y: 45 }, // Mid
    { x: 35, y: 20 }, { x: 65, y: 20 }  // Fwd
  ],
  '4-2-3-1': [
    { x: 50, y: 90 }, // GK
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 }, // Def
    { x: 35, y: 60 }, { x: 65, y: 60 }, // CDM
    { x: 20, y: 40 }, { x: 50, y: 40 }, { x: 80, y: 40 }, // CAM/Wingers
    { x: 50, y: 15 } // ST
  ]
};

const FORMATION_KEYS: FormationKey[] = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'];

export function FormationGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFormationIdx, setCurrentFormationIdx] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const dots = containerRef.current.querySelectorAll('.formation-dot');

    const animateFormationChange = (toIdx: number) => {
      const toFormation = FORMATIONS[FORMATION_KEYS[toIdx]];
      
      toFormation.forEach((pos, i) => {
        gsap.to(dots[i], {
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          duration: 0.8,
          ease: 'power2.inOut',
          delay: i * 0.04,
        });
      });
    };

    // Initial setup
    animateFormationChange(currentFormationIdx);

    const interval = setInterval(() => {
      setCurrentFormationIdx(prev => {
        const next = (prev + 1) % FORMATION_KEYS.length;
        animateFormationChange(next);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[3/4] bg-[#0A1A10] rounded-lg overflow-hidden border border-[#1A3A20]">
      <div className="absolute top-4 w-full text-center">
        <span 
          key={currentFormationIdx}
          className="font-display text-2xl font-bold text-primary animate-fade-in"
        >
          {FORMATION_KEYS[currentFormationIdx]}
        </span>
      </div>
      <div ref={containerRef} className="absolute inset-0 top-12 bottom-4 px-4">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="formation-dot absolute w-[6px] h-[6px] rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)] -translate-x-1/2 -translate-y-1/2"
            style={{ left: '50%', top: '90%' }} // Starting position for all (GK roughly)
          />
        ))}
      </div>
    </div>
  );
}
