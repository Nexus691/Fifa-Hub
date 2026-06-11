import React from 'react';

export function SectionMarquee() {
  return (
    <div className="w-full overflow-hidden border-y border-[#1E1E1E] bg-background py-2">
      <div className="flex whitespace-nowrap opacity-20 text-primary animate-[tickerMove_20s_linear_infinite]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 font-display text-sm tracking-widest uppercase px-4">
            Jun 11 • Mexico City • Estadio Azteca • Capacity 83,000 • Group A Matchday 1 • KO 22:30 IST • Jun 12 • Guadalajara • Estadio Akron •
          </div>
        ))}
      </div>
    </div>
  );
}
