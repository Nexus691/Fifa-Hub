import React, { useRef, useState, useEffect } from "react";
import type { TeamDetail } from "@workspace/api-client-react";
import { ChevronUp, ChevronDown } from "lucide-react";

export function TeamHistory({ team }: { team: TeamDetail }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const historyTimeline = team.historyTimeline || [];
  const hStats: any = team.historicalStats || {};

  // Check scroll position to disable/enable arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setCanScrollUp(scrollTop > 0);
      // Give a tiny 1px buffer for cross-browser floating point rounding
      setCanScrollDown(Math.ceil(scrollTop + clientHeight) < scrollHeight);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [historyTimeline]);

  if (historyTimeline.length === 0) return null;

  // Reverse timeline so newest (e.g., 2022) is at the top
  const reversedTimeline = [...historyTimeline].reverse();

  const scroll = (direction: 'up' | 'down') => {
    if (scrollContainerRef.current) {
      // Scroll by roughly 3 items height
      const scrollAmount = 72 * 3; 
      scrollContainerRef.current.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
      // We also check scroll after scrolling finishes
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <h2 className="font-display text-2xl uppercase tracking-widest text-primary">World Cup History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Timeline</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scroll('up')}
                disabled={!canScrollUp}
                className={`p-1 rounded-full border transition-colors ${canScrollUp ? 'border-primary text-primary hover:bg-primary/10' : 'border-border text-muted-foreground opacity-50 cursor-not-allowed'}`}
                title="Newer"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scroll('down')}
                disabled={!canScrollDown}
                className={`p-1 rounded-full border transition-colors ${canScrollDown ? 'border-primary text-primary hover:bg-primary/10' : 'border-border text-muted-foreground opacity-50 cursor-not-allowed'}`}
                title="Older"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smooth Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="relative border-l border-border ml-2 space-y-6 max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth pr-4"
          >
            {reversedTimeline.map((item: any, idx: number) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-muted-foreground" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{item.year}</span>
                  <span className="text-muted-foreground text-sm uppercase tracking-wider">{item.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Stats Grid */}
        <div className="space-y-4">
          <h3 className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-4">Historical Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Appearances" value={team.appearances || "-"} />
            <StatBox label="Best Finish" value={hStats.bestFinish || "-"} />
            <StatBox label="Win Rate" value={hStats.winRate || "-"} />
            <StatBox label="Goals Scored" value={hStats.goalsScored || "-"} />
            <div className="col-span-2 p-4 bg-card border border-border rounded-xl">
               <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest block mb-1">Top Scorer</span>
               <span className="text-lg font-bold text-primary">{hStats.topScorer || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-xl border bg-card border-border flex flex-col justify-center">
      <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">{label}</span>
      <span className="text-xl font-display font-bold">{value}</span>
    </div>
  );
}
