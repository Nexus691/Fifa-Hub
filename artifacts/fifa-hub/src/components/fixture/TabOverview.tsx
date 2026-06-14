import React from "react";
import { type FixtureDetail } from "@workspace/api-client-react";
import { Link } from "wouter";

export function TabOverview({ fixture }: { fixture: FixtureDetail }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Match Preview ⭐ */}
      <section>
        <h3 className="font-display tracking-widest text-primary uppercase text-sm mb-4">Match Preview</h3>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
          {/* Home Team Preview */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <Link href={`/teams/${fixture.homeTeam.id}`} className="hover:opacity-80 transition-opacity">
              <span className="font-bold text-lg uppercase tracking-widest">{fixture.homeTeam.name}</span>
            </Link>
            <span className="text-xs text-muted-foreground">FIFA Rank: {fixture.homeTeam.fifaRank || "TBA"}</span>
          </div>

          <div className="px-8 font-display text-2xl text-muted-foreground tracking-widest py-4">VS</div>

          {/* Away Team Preview */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <Link href={`/teams/${fixture.awayTeam.id}`} className="hover:opacity-80 transition-opacity">
              <span className="font-bold text-lg uppercase tracking-widest">{fixture.awayTeam.name}</span>
            </Link>
            <span className="text-xs text-muted-foreground">FIFA Rank: {fixture.awayTeam.fifaRank || "TBA"}</span>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 5. Key Players */}
        <section>
          <h3 className="font-display tracking-widest text-primary uppercase text-sm mb-4">Key Players</h3>
          {(!fixture.keyPlayers || fixture.keyPlayers.length === 0) ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm py-12">
              {fixture.statusShort === "NS" ? "Players to watch will be announced closer to kickoff." : "Data unavailable for this match."}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              {fixture.keyPlayers.map((player: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 border-b border-border last:border-0 pb-4 last:pb-0">
                  {player.photo ? (
                    <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover bg-muted" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                      {player.number || "?"}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-sm">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.position}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. Match Insights */}
        <section>
          <h3 className="font-display tracking-widest text-primary uppercase text-sm mb-4">Match Insights</h3>
          {(!fixture.insights || fixture.insights.length === 0) ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm py-12 h-full flex items-center justify-center">
              {fixture.statusShort === "NS" ? "Insights will be generated closer to kickoff." : "Insights unavailable for this match."}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 h-full">
              {fixture.insights.map((insight: any, idx: number) => (
                <div key={idx} className="bg-background rounded p-3 text-sm">
                  <span className="font-bold text-primary mr-2 block mb-1">{insight.category}</span>
                  <span className="text-muted-foreground">{insight.text}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
