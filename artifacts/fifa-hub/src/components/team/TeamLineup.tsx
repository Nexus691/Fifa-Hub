import React, { useState } from "react";
import type { TeamDetail } from "@workspace/api-client-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PlayerHoverCard } from "./PlayerHoverCard";

const POS_LABELS: Record<string, string> = {
  GK: 'GK', LB: 'LB', CB: 'CB', RB: 'RB', DEF: 'DEF',
  CDM: 'CDM', CM: 'CM', CAM: 'CAM', MID: 'MID',
  LW: 'LW', RW: 'RW', ST: 'ST', FWD: 'FWD',
};

const POS_COLORS: Record<string, string> = {
  GK: 'bg-amber-500/20 text-amber-400',
  LB: 'bg-blue-500/20 text-blue-400', CB: 'bg-blue-500/20 text-blue-400',
  RB: 'bg-blue-500/20 text-blue-400', DEF: 'bg-blue-500/20 text-blue-400',
  CDM: 'bg-green-500/20 text-green-400', CM: 'bg-green-500/20 text-green-400',
  CAM: 'bg-green-500/20 text-green-400', MID: 'bg-green-500/20 text-green-400',
  LW: 'bg-red-500/20 text-red-400', RW: 'bg-red-500/20 text-red-400',
  ST: 'bg-red-500/20 text-red-400', FWD: 'bg-red-500/20 text-red-400',
};
export function TeamLineup({ team }: { team: TeamDetail }) {
  const [showBench, setShowBench] = useState(false);
  const lineup: any = team.lineup;

  if (!lineup) return null;

  const formation = lineup.formation || "4-3-3";
  const startingXI = lineup.startingXI || [];
  const bench = lineup.bench || [];

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-widest text-primary mb-1">Most Recent Lineup</h2>
          <p className="text-muted-foreground text-sm">Formation: <span className="font-bold text-foreground">{formation}</span></p>
        </div>
        <div className="text-left md:text-right text-sm">
          <p className="text-muted-foreground">Manager: <span className="text-foreground">{team.manager || "N/A"}</span></p>
        </div>
      </div>

      {/* Pitch Visualization */}
      <div className="relative w-full max-w-2xl mx-auto aspect-[2/3] md:aspect-[3/4] rounded-lg shadow-2xl z-10">
        <div className="absolute inset-0 bg-[#2E7D32] rounded-lg overflow-hidden border-4 border-white/20">
          {/* Pitch Markings */}
          <div className="absolute inset-4 border-2 border-white/40" />
          {/* Halfway line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/40" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/40 rounded-full" />
          {/* Penalty areas */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/2 h-[15%] border-2 border-white/40" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-[15%] border-2 border-white/40" />
          
          {/* Striped grass effect */}
          <div className="absolute inset-0 pointer-events-none flex flex-col opacity-10 mix-blend-overlay">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        </div>

        {/* Players */}
        {startingXI.map((player: any, idx: number) => (
          <div
            key={idx}
            className="absolute z-10 hover:z-50 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            <PlayerHoverCard player={player} />
          </div>
        ))}
      </div>

      {/* Collapsible Bench */}
      {bench.length > 0 && (
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl overflow-visible">
          <button 
            onClick={() => setShowBench(!showBench)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <span className="font-bold text-sm uppercase tracking-widest">Bench ({bench.length})</span>
            {showBench ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showBench && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-visible">
              {bench.map((sub: any, idx: number) => (
                <div key={idx} className="group relative bg-muted/50 border border-border rounded-lg p-3 flex items-center gap-3 hover:border-primary/50 hover:bg-muted transition-all cursor-pointer overflow-visible">
                  {/* Player Photo or Placeholder */}
                  {sub.photoUrl ? (
                    <img
                      src={sub.photoUrl}
                      alt={sub.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 bg-muted flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">{sub.number || "?"}</span>
                    </div>
                  )}
                  {/* Name & Position */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                      {typeof sub === "string" ? sub : sub.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className={`inline-block px-1 py-0.5 rounded text-[9px] font-bold ${POS_COLORS[sub.position] || 'bg-muted text-muted-foreground'}`}>
                        {POS_LABELS[sub.position] || sub.position}
                      </span>
                      {sub.number ? ` #${sub.number}` : ""} {sub.age ? `• ${sub.age}y` : ""}
                    </p>
                  </div>

                  {/* Hover tooltip — positioned BELOW the card */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-3 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 z-[100]">
                    <div className="flex gap-3 items-center border-b border-border/50 pb-2 mb-2">
                      {sub.photoUrl ? (
                        <img src={sub.photoUrl} alt={sub.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary/20" />
                      )}
                      <div>
                        <h4 className="font-bold text-sm">{sub.name}</h4>
                        <p className="text-[11px] text-muted-foreground">
                          <span className={`inline-block px-1 py-0.5 rounded text-[9px] font-bold ${POS_COLORS[sub.position] || 'bg-muted'}`}>
                            {POS_LABELS[sub.position] || sub.position}
                          </span>
                          {' '}#{sub.number} • Age {sub.age || "??"}
                        </p>
                        {sub.club && sub.club !== 'Real Data' && (
                          <p className="text-[11px] font-medium">{sub.club}</p>
                        )}
                      </div>
                    </div>
                    {sub.statusBadge && (
                      <span className="inline-block px-2 py-0.5 rounded bg-muted text-[10px] font-semibold mb-2">{sub.statusBadge}</span>
                    )}
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <div className="flex justify-between"><span className="text-muted-foreground">Caps</span><span className="font-medium">{sub.nationalStats?.caps || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Goals</span><span className="font-medium">{sub.nationalStats?.goals || "—"}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
