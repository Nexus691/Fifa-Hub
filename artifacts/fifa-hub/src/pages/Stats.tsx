import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Info } from "lucide-react";
import { Link } from "wouter";

const TABS = ["Golden Boot", "Assists", "Clean Sheets", "Cards", "Passes"];

const MOCK_SCORERS = [
  { rank: 1, name: "Kylian Mbappé", team: "France", code: "FR", goals: 3, assists: 1, mins: 270 },
  { rank: 2, name: "Victor Osimhen", team: "Nigeria", code: "NG", goals: 2, assists: 0, mins: 245 },
  { rank: 3, name: "Robert Lewandowski", team: "Poland", code: "PL", goals: 2, assists: 1, mins: 180 },
  { rank: 4, name: "Harry Kane", team: "England", code: "GB-ENG", goals: 1, assists: 2, mins: 260 },
  { rank: 5, name: "Vinícius Júnior", team: "Brazil", code: "BR", goals: 1, assists: 1, mins: 210 },
];

export default function Stats() {
  const [activeTab, setActiveTab] = useState("Golden Boot");

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl tracking-widest mb-1 text-primary uppercase">Tournament Stats</h1>
        <p className="text-muted-foreground text-sm">Official statistics for the 2026 FIFA World Cup</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-border mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="statsTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Pre-Tournament Disclaimer */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-primary font-semibold mb-1">Tournament has not started yet.</p>
          <p className="text-xs text-muted-foreground">Pre-tournament predictions based on FIFA rankings and form. Stats will update live as matches are played.</p>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Golden Boot" && (
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
              <div className="p-6 border-b border-border flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-wider">Golden Boot Race</h2>
                  <p className="text-xs text-muted-foreground">Tournament Top Scorers</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold bg-muted/10">
                      <th className="py-4 px-6 text-left font-medium">Rank</th>
                      <th className="py-4 px-6 text-left font-medium">Player</th>
                      <th className="py-4 px-6 text-left font-medium">Team</th>
                      <th className="py-4 px-6 text-center font-bold text-foreground">Goals</th>
                      <th className="py-4 px-6 text-center font-medium">Assists</th>
                      <th className="py-4 px-6 text-center font-medium">Mins</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {MOCK_SCORERS.map((scorer, i) => {
                      let medal = "";
                      if (scorer.rank === 1) medal = "🥇";
                      else if (scorer.rank === 2) medal = "🥈";
                      else if (scorer.rank === 3) medal = "🥉";

                      return (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-6 font-semibold text-muted-foreground">
                            {medal ? <span className="text-xl">{medal}</span> : scorer.rank}
                          </td>
                          <td className="py-4 px-6 font-semibold text-foreground">
                            {scorer.name}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <img 
                                src={`https://flagcdn.com/w40/${scorer.code.toLowerCase()}.png`}
                                alt={scorer.team}
                                className="w-5 h-5 object-cover rounded-sm"
                              />
                              <span className="text-muted-foreground">{scorer.team}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-primary text-lg">
                            {scorer.goals}
                          </td>
                          <td className="py-4 px-6 text-center text-muted-foreground">
                            {scorer.assists}
                          </td>
                          <td className="py-4 px-6 text-center text-muted-foreground">
                            {scorer.mins}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== "Golden Boot" && (
            <div className="text-center py-24 text-muted-foreground bg-card border border-border rounded-xl">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold">{activeTab} Leaderboard</p>
              <p className="text-sm mt-1">Check back after the tournament begins.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
