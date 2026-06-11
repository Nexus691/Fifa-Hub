import React from "react";
import type { TeamDetail } from "@workspace/api-client-react";

const CONFED_MAP: Record<string, string> = {
  "CONMEBOL": "South American Football Confederation",
  "UEFA": "Union of European Football Associations",
  "CONCACAF": "Confederation of North, Central America and Caribbean Association Football",
  "CAF": "Confederation of African Football",
  "AFC": "Asian Football Confederation",
  "OFC": "Oceania Football Confederation",
  "FIFA": "International Association Football Federation"
};

export function TeamHero({ team }: { team: TeamDetail }) {
  const getTeamImg = (t: TeamDetail) =>
    t.logo || `https://flagcdn.com/w320/${(t.code ?? "un").toLowerCase()}.png`;

  return (
    <div className="relative rounded-2xl bg-card border border-border mt-8 p-8 md:p-12 shadow-2xl">
      {/* Subtle Background (clipped to rounded corners) */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-colors duration-500" />
          <img
            src={getTeamImg(team)}
            alt={team.name}
            className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-2xl"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <div className="relative group flex items-center">
                <span className="cursor-help bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {team.confederation || "FIFA"}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] px-3 py-2 bg-popover text-popover-foreground font-semibold text-xs rounded-lg shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none">
                  {CONFED_MAP[team.confederation || "FIFA"] || team.confederation}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
                </div>
              </div>
              <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border">
                {team.group ? team.group : "World Cup 2026"}
              </span>
              <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border flex items-center gap-1">
                ⭐ FIFA Rank #{team.fifaRank || "N/A"}
              </span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl tracking-tight uppercase">
              {team.name}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 border-t border-border/50 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Manager</p>
              <p className="font-semibold text-foreground">{team.manager || "To be announced"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Captain</p>
              <p className="font-semibold text-foreground">{team.captain || "To be announced"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Qualified Via</p>
              <p className="font-semibold text-foreground">{team.qualifiedVia || "Qualification"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider">WC Appearances</p>
              <p className="font-semibold text-foreground">{team.appearances || "1"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
