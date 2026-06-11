import React from "react";
import type { TeamDetail } from "@workspace/api-client-react";

export function TeamSnapshot({ team }: { team: TeamDetail }) {
  // Since the World Cup hasn't started yet, we show the "Before WC" Historical Snapshot automatically.
  // We can determine if WC has started based on if they have real statistics from the WC 2026 group stage.
  const isWCStarted = !!team.statistics && (team.statistics.played ?? 0) > 0;

  if (isWCStarted) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-widest text-primary">World Cup Snapshot</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Played" value={team.statistics!.played} />
          <StatBox label="Wins" value={team.statistics!.wins} />
          <StatBox label="Draws" value={team.statistics!.draws} />
          <StatBox label="Losses" value={team.statistics!.losses} />
          <StatBox label="Goals For" value={team.statistics!.goalsFor} />
          <StatBox label="Goals Against" value={team.statistics!.goalsAgainst} />
          <StatBox label="Points" value={(team.statistics!.wins ?? 0) * 3 + (team.statistics!.draws ?? 0)} highlight />
        </div>
      </section>
    );
  }

  // Pre-World Cup View using Deep Profile Historical Stats
  const hStats = team.historicalStats as Record<string, any> || {};

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase tracking-widest text-primary">Team Snapshot (History)</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Matches" value={hStats.matches || "-"} />
        <StatBox label="Wins" value={hStats.wins || "-"} />
        <StatBox label="Draws" value={hStats.draws || "-"} />
        <StatBox label="Losses" value={hStats.losses || "-"} />
        
        <StatBox label="Goals For" value={hStats.goalsFor || "-"} />
        <StatBox label="Goals Against" value={hStats.goalsAgainst || "-"} />
        <StatBox 
          label="Highest FIFA Rank" 
          value={hStats.highestRank ? `#${hStats.highestRank} ${hStats.highestRankYear ? `(${hStats.highestRankYear})` : ''}` : "-"} 
        />
        <StatBox label="Current Rank" value={team.fifaRank ? `#${team.fifaRank}` : "-"} highlight />
      </div>
    </section>
  );
}

function StatBox({ label, value, highlight = false }: { label: string; value: string | number | null; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-colors ${highlight ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'}`}>
      <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">{label}</span>
      <span className={`text-2xl font-display font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
