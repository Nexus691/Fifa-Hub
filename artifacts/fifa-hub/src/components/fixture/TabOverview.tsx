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
          <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm py-12">
            Players to watch will be announced closer to kickoff.
          </div>
        </section>

        {/* 6. Match Insights */}
        <section>
          <h3 className="font-display tracking-widest text-primary uppercase text-sm mb-4">Match Insights</h3>
          <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm py-12 h-full flex items-center justify-center">
            Insights will be generated closer to kickoff.
          </div>
        </section>
      </div>
    </div>
  );
}
