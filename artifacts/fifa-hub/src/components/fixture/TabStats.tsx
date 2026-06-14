import React from "react";
import type { FixtureDetail, MatchStatistic, StatItem } from "@workspace/api-client-react";

import { motion } from "framer-motion";

function StatBar({ stat, homeVal, awayVal, delay = 0 }: { stat: string; homeVal: number; awayVal: number; delay?: number }) {
  const total = homeVal + awayVal;
  const homeW = total === 0 ? 50 : Math.round((homeVal / total) * 100);
  const awayW = 100 - homeW;
  return (
    <div className="space-y-1 mb-5">
      <div className="flex justify-between text-xs font-medium tracking-widest font-display">
        <span className="text-primary text-base">{homeVal}</span>
        <span className="text-muted-foreground uppercase">{stat}</span>
        <span className="text-primary text-base">{awayVal}</span>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1, transition: { duration: 0.5, delay: delay, ease: "easeOut" } }}
          viewport={{ once: true }}
          className="bg-primary rounded-l-full"
          style={{ width: `${homeW}%`, transformOrigin: 'left' }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1, transition: { duration: 0.5, delay: delay + 0.15, ease: "easeOut" } }}
          viewport={{ once: true }}
          className="bg-muted-foreground/40 rounded-r-full"
          style={{ width: `${awayW}%`, transformOrigin: 'right' }}
        />
      </div>
    </div>
  );
}

export function TabStats({ fixture }: { fixture: FixtureDetail }) {
  const homeStats = fixture.statistics?.find((s: MatchStatistic) => s.teamId === fixture.homeTeam.id);
  const awayStats = fixture.statistics?.find((s: MatchStatistic) => s.teamId === fixture.awayTeam.id);

  const getStat = (stats: MatchStatistic | undefined, type: string) => {
    const s = stats?.stats?.find((st: StatItem) => st.type === type);
    return parseInt(String(s?.value ?? "0"), 10) || 0;
  };

  const statTypes = ["Ball Possession", "Total Shots", "Shots on Goal", "Corner Kicks", "Yellow Cards", "Red Cards", "Fouls", "Offsides"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Momentum Chart */}
        <section>
          <h3 className="font-display tracking-widest text-primary uppercase text-sm mb-4">Attack Momentum</h3>
          <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm py-12 h-64 flex flex-col justify-center">
            <p>{fixture.statusShort === "NS" ? "Momentum chart will be available during live match." : "Momentum chart is unavailable for this match."}</p>
          </div>
        </section>

        {/* Live Stats */}
        <section>
          <h3 className="font-display tracking-widest text-primary uppercase text-sm mb-4">Match Statistics</h3>
          <div className="bg-card border border-border rounded-xl p-6 h-fit">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
              <span>{fixture.homeTeam.name}</span>
              <span>{fixture.awayTeam.name}</span>
            </div>
            {statTypes.map((type, index) => {
              const hv = getStat(homeStats, type);
              const av = getStat(awayStats, type);
              if (hv === 0 && av === 0 && fixture.statusShort === "NS") return null; // Don't hide if it's 0-0 but live
              const displayType = type
                .replace("Ball Possession", "Possession")
                .replace("Total Shots", "Shots")
                .replace("Shots on Goal", "On Target")
                .replace("Corner Kicks", "Corners");
              return <StatBar key={type} stat={displayType} homeVal={hv} awayVal={av} delay={index * 0.1} />;
            })}
            {(!homeStats && !awayStats) && (
              <p className="text-center text-sm text-muted-foreground py-8">Stats will be available once the match starts.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
