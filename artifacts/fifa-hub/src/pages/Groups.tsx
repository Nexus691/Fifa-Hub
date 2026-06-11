import React, { useEffect } from "react";
import gsap from "gsap";
import { useGetStandings } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Trophy, Info } from "lucide-react";
import { Link } from "wouter";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Groups() {
  const { data: standingsData, isLoading, error } = useGetStandings();

  // Determine if tournament has started based on any team having played a match
  const tournamentStarted = standingsData?.some((group: any) => 
    group.standings.some((row: any) => row.played > 0)
  );

  useEffect(() => {
    if (!isLoading && !error && standingsData) {
      gsap.fromTo('.qualification-bar',
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, duration: 0.6, delay: 0.8, ease: 'power2.out', stagger: 0.1 }
      );
    }
  }, [isLoading, error, standingsData]);

  return (
    <div className="groups-page pt-24 pb-12 px-6 md:px-8 max-w-[1440px] mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-widest text-primary uppercase mb-2">
          Groups
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
          Complete World Cup 2026 group stage standings. 
          The top two teams from each group, along with the eight best third-placed teams, will advance to the Round of 32.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-64 bg-card/50 border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-12">
          Failed to load group standings.
        </div>
      )}

      {!isLoading && !error && (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          {standingsData?.map((group: any) => (
            <motion.div 
              key={group.group} 
              variants={item}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-lg flex flex-col hover:border-primary/30 transition-colors"
            >
              {/* Group Header */}
              <div className="bg-muted/30 px-5 py-4 border-b border-border flex justify-between items-center">
                <h3 className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
                  {group.group}
                </h3>
              </div>

              {/* Group Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold bg-muted/10">
                      <th className="py-3 px-4 text-left font-medium w-8">#</th>
                      <th className="py-3 px-2 text-left font-medium">Team</th>
                      <th className="py-3 px-2 text-center font-medium w-8">P</th>
                      <th className="py-3 px-2 text-center font-medium w-8">W</th>
                      <th className="py-3 px-2 text-center font-medium w-8">D</th>
                      <th className="py-3 px-2 text-center font-medium w-8">L</th>
                      <th className="py-3 px-2 text-center font-medium w-10">GD</th>
                      <th className="py-3 px-4 text-center font-bold text-foreground w-10">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {group.standings.map((row: any, index: number) => {
                      const isTopTwo = index < 2;
                      const isThird = index === 2;

                      // The Master Spec dictates border colors for qualification status
                      let borderClass = "border-transparent";
                      if (isTopTwo) borderClass = "border-green-500";
                      else if (isThird) borderClass = "border-primary";

                      // The Master Spec dictates form circles: ●=W (gold), ●=D (gray), ●=L (dim)
                      // OpenLigaDB doesn't natively give a form array in the standings payload,
                      // so we'll omit form circles here unless we fetch them separately.

                      return (
                        <tr 
                          key={row.team.id} 
                          className="hover:bg-muted/20 transition-colors group/row"
                        >
                          <td className="py-3 px-4 relative">
                            <div className={`qualification-bar h-full w-1 absolute left-0 top-0 ${borderClass} border-l-[3px] rounded-r-md opacity-90`} />
                            <span className={`font-semibold ${isTopTwo ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <Link href={`/teams/${row.team.id}`} className="flex items-center gap-3 group-hover/row:text-primary transition-colors w-fit">
                              <img 
                                src={row.team.logo} 
                                alt={row.team.name} 
                                className="w-5 h-5 object-cover rounded-sm shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://flagcdn.com/w40/${row.team.code?.toLowerCase().slice(0, 2) || 'un'}.png`;
                                }}
                              />
                              <span className="font-semibold text-foreground truncate max-w-[100px] sm:max-w-[140px]">
                                {row.team.name}
                              </span>
                            </Link>
                          </td>
                          <td className="py-3 px-2 text-center text-muted-foreground">{row.played}</td>
                          <td className="py-3 px-2 text-center text-muted-foreground">{row.wins}</td>
                          <td className="py-3 px-2 text-center text-muted-foreground">{row.draws}</td>
                          <td className="py-3 px-2 text-center text-muted-foreground">{row.losses}</td>
                          <td className="py-3 px-2 text-center text-muted-foreground">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                          <td className="py-3 px-4 text-center font-bold text-foreground">{row.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pre-tournament disclaimer if matches haven't started */}
              {!tournamentStarted && (
                <div className="mt-auto bg-muted/20 p-3 text-center border-t border-border">
                  <p className="text-[11px] text-muted-foreground italic flex items-center justify-center gap-1.5">
                    <Info className="w-3 h-3" /> Group play begins Jun 11 — standings will update live.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
