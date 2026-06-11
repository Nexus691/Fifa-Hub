import React from "react";
import { motion } from "framer-motion";
import type { FixtureDetail, MatchEvent } from "@workspace/api-client-react";

function EventIcon({ type, detail }: { type: string; detail?: string | null }) {
  if (type === "Goal") return <span className="text-xl">⚽</span>;
  if (type === "Card") {
    if (detail?.toLowerCase().includes("red")) return <span className="inline-block w-4 h-5 bg-red-500 rounded-sm shadow-md" />;
    return <span className="inline-block w-4 h-5 bg-yellow-400 rounded-sm shadow-md" />;
  }
  if (type === "subst") return <span className="text-xl">🔄</span>;
  return <span className="text-muted-foreground text-xs">{type}</span>;
}

export function TabTimeline({ fixture }: { fixture: FixtureDetail }) {
  if (!fixture.events || fixture.events.length === 0) {
    return (
      <div className="text-center py-12 border border-border rounded-xl bg-card">
        <p className="text-muted-foreground tracking-widest uppercase text-sm font-semibold">No events yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="relative ml-6 md:ml-12 py-4 space-y-8">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-border origin-top"
        />
        {fixture.events.map((event: MatchEvent, i: number) => {
          const isHome = event.teamId === fixture.homeTeam.id;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-8 md:pl-12 pr-4"
            >
              {/* Timeline dot/time */}
              <div className="absolute -left-[21px] top-1 bg-background border-2 border-primary rounded-full w-10 h-10 flex items-center justify-center font-bold text-xs text-primary z-10">
                {event.time}'
              </div>

              <div className={`bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4 ${isHome ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-muted-foreground'}`}>
                <div className="flex-shrink-0 flex items-center justify-center w-8">
                  <EventIcon type={event.type} detail={event.detail} />
                </div>
                <div>
                  <p className="text-base font-bold">{event.playerName}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{event.detail}</p>
                  {event.assistName && <p className="text-xs text-muted-foreground mt-1">Assist: {event.assistName}</p>}
                </div>
                <div className="ml-auto text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
                  {event.teamName}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
