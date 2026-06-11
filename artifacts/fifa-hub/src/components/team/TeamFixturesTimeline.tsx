import React from "react";
import type { TeamDetail } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format, parseISO } from "date-fns";

export function TeamFixturesTimeline({ team }: { team: TeamDetail }) {
  if (!team.fixtures || team.fixtures.length === 0) return null;

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <h2 className="font-display text-2xl uppercase tracking-widest text-primary">Upcoming Fixtures</h2>
      
      <div className="relative border-l border-primary/20 ml-4 space-y-8 py-4">
        {team.fixtures.map((fixture, index) => {
          const isHome = fixture.homeTeam.id === team.id;
          const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
          const d = fixture.date ? parseISO(fixture.date) : new Date();

          return (
            <div key={fixture.id} className="relative pl-8 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-4 w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-background group-hover:scale-150 transition-transform duration-300" />
              
              <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Date & Opponent */}
                  <div>
                    <div className="text-primary font-bold text-sm tracking-widest mb-1">
                      {format(d, "dd MMM")} • {format(d, "HH:mm")}
                    </div>
                    <div className="font-display text-xl uppercase tracking-wider flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">vs</span> 
                      {opponent.name}
                    </div>
                  </div>

                  {/* Context Info */}
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span className="bg-muted w-fit px-2 py-0.5 rounded-sm uppercase tracking-wider text-xs">
                      {fixture.group ? fixture.group : fixture.round}
                    </span>
                    <span>{fixture.venue || "TBA"}</span>
                  </div>

                  {/* CTA */}
                  <div>
                    <Link href={`/fixtures/${fixture.id}`} className="inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors uppercase tracking-widest">
                      View Match →
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
