import React from "react";
import type { FixtureDetail, Lineup, LineupPlayer } from "@workspace/api-client-react";

export function TabLineups({ fixture }: { fixture: FixtureDetail }) {
  const homeLineup = fixture.lineups?.find((l: Lineup) => l.teamId === fixture.homeTeam.id);
  const awayLineup = fixture.lineups?.find((l: Lineup) => l.teamId === fixture.awayTeam.id);

  if (!homeLineup && !awayLineup) {
    return (
      <div className="text-center py-12 border border-border rounded-xl bg-card">
        <p className="text-muted-foreground tracking-widest uppercase text-sm font-semibold">Lineups will be announced before kickoff</p>
      </div>
    );
  }

  // Helper to group players by row (e.g., "4-3-3" -> [1, 4, 3, 3])
  const parseFormation = (formation: string | undefined | null) => {
    if (!formation) return [1, 4, 4, 2];
    const rows = formation.split("-").map(Number);
    return [1, ...rows]; // Add GK
  };

  const renderTeamPitch = (lineup: Lineup, isHome: boolean) => {
    const rows = parseFormation(lineup.formation);
    const startXI = lineup.startXI || [];
    
    // Group players into rows
    let playerIndex = 0;
    const pitchedRows = rows.map(count => {
      const rowPlayers = startXI.slice(playerIndex, playerIndex + count);
      playerIndex += count;
      return rowPlayers;
    });

    if (!isHome) pitchedRows.reverse();

    return (
      <div className="flex-1 flex flex-col justify-around py-4">
        {pitchedRows.map((row, rIndex) => (
          <div key={rIndex} className="flex justify-evenly w-full">
            {row.map((player: LineupPlayer) => (
              <div key={player.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ${isHome ? 'bg-primary text-background' : 'bg-foreground text-background'}`}>
                  {player.number}
                </div>
                <span className="text-[9px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1 max-w-[60px] truncate text-center">
                  {player.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Pitch Visualization */}
      <section>
        <div className="bg-green-800/20 border-2 border-green-900/30 rounded-xl overflow-hidden relative" style={{ height: '600px' }}>
          {/* Pitch Markings */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full border-[3px] border-white p-4">
              <div className="w-full h-full border-[3px] border-white relative">
                {/* Center Line & Circle */}
                <div className="absolute top-1/2 left-0 w-full border-t-[3px] border-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[3px] border-white" />
                {/* Penalty Areas */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 border-x-[3px] border-b-[3px] border-white" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 border-x-[3px] border-t-[3px] border-white" />
                {/* Goal Areas */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-12 border-x-[3px] border-b-[3px] border-white" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-12 border-x-[3px] border-t-[3px] border-white" />
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="absolute inset-0 flex flex-col p-4 z-10">
            {homeLineup && renderTeamPitch(homeLineup, true)}
            {awayLineup && renderTeamPitch(awayLineup, false)}
          </div>
        </div>
      </section>

      {/* Coaches & Formations */}
      <div className="grid md:grid-cols-2 gap-8">
        {[homeLineup, awayLineup].map((lineup, i) => lineup && (
          <div key={i} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <img src={lineup.teamLogo ?? ""} alt={lineup.teamName} className="w-8 h-8 object-contain" />
                <span className="font-bold tracking-widest uppercase">{lineup.teamName}</span>
              </div>
              <span className="text-primary font-display font-bold tracking-widest">{lineup.formation}</span>
            </div>
            {lineup.coach && (
              <div className="mb-6">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Manager</p>
                <p className="font-semibold text-sm">{lineup.coach.name}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Substitutes</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {(lineup.substitutes || []).map(sub => (
                  <div key={sub.id} className="flex gap-2 text-xs">
                    <span className="w-4 text-muted-foreground font-mono">{sub.number}</span>
                    <span className="truncate">{sub.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
