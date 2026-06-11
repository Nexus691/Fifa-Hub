import React from "react";
import { Link } from "wouter";
import { format, parseISO } from "date-fns";
import type { Fixture } from "@workspace/api-client-react";
import { motion } from "framer-motion";

interface KnockoutData {
  r32: Fixture[];
  r16: Fixture[];
  qf: Fixture[];
  sf: Fixture[];
  third: Fixture[];
  final: Fixture[];
}

export function KnockoutTree({ data }: { data: KnockoutData }) {
  const getTeamLogo = (team: any) => {
    if (team?.logo) return team.logo;
    if (team?.code) return `https://flagcdn.com/w20/${team.code.toLowerCase()}.png`;
    return "";
  };

  const isPlaceholderName = (name: string) => {
    if (!name) return true;
    const lower = name.toLowerCase();
    return lower.includes("winner") || lower.includes("runner-up") || lower.includes("1st group") || lower.includes("2nd group") || lower.includes("3rd group") || lower.includes("loser");
  };

  const MatchNode = ({ match, isThird = false, roundIdx = 0, index = 0 }: { match: Fixture | undefined; isThird?: boolean; roundIdx?: number; index?: number }) => {
    const delay = 0.1 + (roundIdx * 0.15) + (index * 0.02);

    if (!match) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ delay, duration: 0.3 }} className="w-[100px] lg:w-[110px] h-[48px] bg-card/40 border border-border/50 rounded flex items-center justify-center shadow-sm relative z-10">
          <span className="text-muted-foreground text-[9px] uppercase tracking-widest font-bold">TBD</span>
        </motion.div>
      );
    }

    const isLive = match.statusShort === "1H" || match.statusShort === "2H" || match.statusShort === "HT";
    const isFinished = ["FT", "AET", "PEN", "Finished"].includes(match.statusShort);
    const matchLabel = isThird ? "3rd Place" : `M${match.id}`;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.3 }}>
        <Link href={`/fixtures/${match.id}`} className="block group relative z-10">
        <div className="w-[100px] lg:w-[110px] bg-card border border-border rounded overflow-hidden shadow hover:border-primary/50 transition-colors">
          <div className="bg-background px-1.5 py-0.5 flex justify-between items-center border-b border-border text-[7px] uppercase tracking-widest font-bold text-muted-foreground">
            <span>{matchLabel}</span>
            <span>{format(parseISO(match.date), "dd MMM")}</span>
          </div>

          <div className="px-1 py-0.5 space-y-0">
            {[match.homeTeam, match.awayTeam].map((team, idx) => {
              const score = idx === 0 ? match.homeScore : match.awayScore;
              const isPlaceholder = isPlaceholderName(team?.name || "");
              const teamAbbrev = isPlaceholder ? "TBD" : (team.code || (team.name ? team.name.substring(0, 3).toUpperCase() : "TBD"));
              const fullName = isPlaceholder ? "TBD" : (team.name || "TBD");
              
              return (
                <div key={idx} className="flex items-center justify-between px-1 py-[2px] rounded hover:bg-muted/30">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {(team.logo || team.code) && !isPlaceholder ? (
                      <img src={getTeamLogo(team)} alt="" className="w-3 h-3 object-contain rounded-sm" />
                    ) : (
                      <div className="w-3 h-3 rounded-sm bg-muted flex-shrink-0" />
                    )}
                    <span className="text-[9px] font-semibold truncate leading-none mt-[1px]">{teamAbbrev}</span>
                  </div>
                  {score !== null && (
                    <span className={`text-[9px] font-bold font-mono leading-none ${(isLive || isFinished) ? "text-foreground" : "text-muted-foreground"}`}>
                      {score}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {isLive && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse m-0.5" />}
        </div>
      </Link>
      </motion.div>
    );
  };

  const padMatches = (matches: Fixture[], count: number) => {
    const padded = [...matches];
    while (padded.length < count) {
      padded.push(undefined as any);
    }
    return padded.slice(0, count);
  };

  const FinalMatchNode = ({ match }: { match: Fixture | undefined }) => {
    const delay = 0.1 + (4 * 0.15); // Round 4 (Final)

    if (!match) return <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ delay, duration: 0.5 }} className="w-[200px] lg:w-[280px] h-[140px] bg-card border border-primary/20 rounded shadow-[0_0_15px_rgba(212,175,55,0.1)] flex items-center justify-center"><span className="text-primary font-bold tracking-widest text-sm">TBD</span></motion.div>;

    const hTeamIsPlaceholder = isPlaceholderName(match.homeTeam?.name || "");
    const aTeamIsPlaceholder = isPlaceholderName(match.awayTeam?.name || "");
    const homeName = hTeamIsPlaceholder ? "TBD" : match.homeTeam.name;
    const awayName = aTeamIsPlaceholder ? "TBD" : match.awayTeam.name;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.5 }}>
        <Link href={`/fixtures/${match.id}`} className="block group relative z-10">
        <div className="w-[200px] lg:w-[280px] bg-gradient-to-b from-card to-background border border-primary/40 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-300 transform group-hover:-translate-y-1 relative">
          
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 opacity-50 pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20">
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary">FINAL</span>
            <span className="text-xl animate-pulse">🏆</span>
          </div>

          {/* Body */}
          <div className="px-4 py-3">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold mb-3 space-y-0.5">
              <div className="text-primary/80">{format(parseISO(match.date), "dd MMMM yyyy")}</div>
              <div>{match.venue || "MetLife Stadium"}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider truncate ${hTeamIsPlaceholder ? "text-muted-foreground" : "text-foreground"}`}>
                  {homeName}
                </span>
                {match.homeScore !== null && <span className="font-mono text-base font-bold text-primary">{match.homeScore}</span>}
              </div>
              <div className="text-[9px] font-display text-muted-foreground/50 tracking-widest pl-1">VS</div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider truncate ${aTeamIsPlaceholder ? "text-muted-foreground" : "text-foreground"}`}>
                  {awayName}
                </span>
                {match.awayScore !== null && <span className="font-mono text-base font-bold text-primary">{match.awayScore}</span>}
              </div>
            </div>
          </div>
          
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
      </motion.div>
    );
  };

  const r32 = padMatches(data.r32, 16);
  const r16 = padMatches(data.r16, 8);
  const qf = padMatches(data.qf, 4);
  const sf = padMatches(data.sf, 2);
  const final = padMatches(data.final, 1);
  const third = padMatches(data.third, 1);

  // Constants for drawing connector lines
  const Y_SPACING_R32 = 56; // height 48 + gap 8

  return (
    <div className="w-full flex justify-center py-6 overflow-x-auto custom-scrollbar">
      {/* Container big enough to hold 9 columns */}
      <div className="relative flex items-center justify-center min-w-max px-4">
        
        {/* ================= LEFT BRACKET ================= */}
        <div className="flex items-center gap-3 lg:gap-5">
          
          {/* R32 Left */}
          <div className="flex flex-col gap-2 relative">
            <div className="text-center font-display tracking-widest text-primary mb-2 text-[8px] uppercase">R32</div>
            {r32.slice(0, 8).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={0} index={i} />
                {i % 2 === 0 && (
                  <div className="absolute top-1/2 -right-1.5 w-1.5 h-[1px] bg-border/50" />
                )}
                {i % 2 === 1 && (
                  <div className="absolute top-1/2 -right-1.5 w-1.5 h-[1px] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -right-1.5 top-1/2 w-[1px] h-[calc(100%+8px)] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -right-3 top-[calc(100%+4px)] w-1.5 h-[1px] bg-border/50" />
                )}
              </div>
            ))}
          </div>

          {/* R16 Left */}
          <div className="flex flex-col justify-around h-[calc(8*56px-8px)] relative">
            <div className="absolute -top-6 left-0 right-0 text-center font-display tracking-widest text-primary text-[8px] uppercase">R16</div>
            {r16.slice(0, 4).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={1} index={i} />
                {i % 2 === 0 && (
                  <div className="absolute -right-1.5 top-1/2 w-[1px] h-[calc(100%+112px)] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -right-3 top-[calc(100%+56px)] w-1.5 h-[1px] bg-border/50" />
                )}
              </div>
            ))}
          </div>

          {/* QF Left */}
          <div className="flex flex-col justify-around h-[calc(8*56px-8px)] relative">
            <div className="absolute -top-6 left-0 right-0 text-center font-display tracking-widest text-primary text-[8px] uppercase">QF</div>
            {qf.slice(0, 2).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={2} index={i} />
                {i % 2 === 0 && (
                  <div className="absolute -right-1.5 top-1/2 w-[1px] h-[calc(100%+224px)] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -right-3 top-[calc(100%+112px)] w-1.5 h-[1px] bg-border/50" />
                )}
              </div>
            ))}
          </div>

          {/* SF Left */}
          <div className="flex flex-col justify-around h-[calc(8*56px-8px)] relative">
            <div className="absolute -top-6 left-0 right-0 text-center font-display tracking-widest text-primary text-[8px] uppercase">SF</div>
            {sf.slice(0, 1).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={3} index={i} />
                <div className="absolute top-1/2 -right-3 w-3 h-[1px] bg-border/50" />
              </div>
            ))}
          </div>
        </div>

        {/* ================= CENTER: FINAL & THIRD ================= */}
        <div className="flex flex-col justify-center items-center h-[calc(8*56px-8px)] gap-10 px-4 lg:px-8 relative">
          
          <div className="relative">
            <FinalMatchNode match={final[0]} />
          </div>

          <div className="mt-4 relative">
            <div className="absolute -top-5 left-0 right-0 text-center font-display tracking-widest text-muted-foreground text-[8px] uppercase">
              3rd Place
            </div>
            <MatchNode match={third[0]} isThird roundIdx={4} index={0} />
          </div>
        </div>

        {/* ================= RIGHT BRACKET ================= */}
        <div className="flex items-center gap-3 lg:gap-5">
          
          {/* SF Right */}
          <div className="flex flex-col justify-around h-[calc(8*56px-8px)] relative">
            <div className="absolute -top-6 left-0 right-0 text-center font-display tracking-widest text-primary text-[8px] uppercase">SF</div>
            {sf.slice(1, 2).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={3} index={i} />
                <div className="absolute top-1/2 -left-3 w-3 h-[1px] bg-border/50" />
              </div>
            ))}
          </div>

          {/* QF Right */}
          <div className="flex flex-col justify-around h-[calc(8*56px-8px)] relative">
            <div className="absolute -top-6 left-0 right-0 text-center font-display tracking-widest text-primary text-[8px] uppercase">QF</div>
            {qf.slice(2, 4).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={2} index={i} />
                {i % 2 === 0 && (
                  <div className="absolute -left-1.5 top-1/2 w-[1px] h-[calc(100%+224px)] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -left-3 top-[calc(100%+112px)] w-1.5 h-[1px] bg-border/50" />
                )}
              </div>
            ))}
          </div>

          {/* R16 Right */}
          <div className="flex flex-col justify-around h-[calc(8*56px-8px)] relative">
            <div className="absolute -top-6 left-0 right-0 text-center font-display tracking-widest text-primary text-[8px] uppercase">R16</div>
            {r16.slice(4, 8).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={1} index={i} />
                {i % 2 === 0 && (
                  <div className="absolute -left-1.5 top-1/2 w-[1px] h-[calc(100%+112px)] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -left-3 top-[calc(100%+56px)] w-1.5 h-[1px] bg-border/50" />
                )}
              </div>
            ))}
          </div>

          {/* R32 Right */}
          <div className="flex flex-col gap-2 relative">
            <div className="text-center font-display tracking-widest text-primary mb-2 text-[8px] uppercase">R32</div>
            {r32.slice(8, 16).map((m, i) => (
              <div key={i} className="relative">
                <MatchNode match={m} roundIdx={0} index={i} />
                {i % 2 === 0 && (
                  <div className="absolute top-1/2 -left-1.5 w-1.5 h-[1px] bg-border/50" />
                )}
                {i % 2 === 1 && (
                  <div className="absolute top-1/2 -left-1.5 w-1.5 h-[1px] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -left-1.5 top-1/2 w-[1px] h-[calc(100%+8px)] bg-border/50" />
                )}
                {i % 2 === 0 && (
                  <div className="absolute -left-3 top-[calc(100%+4px)] w-1.5 h-[1px] bg-border/50" />
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
