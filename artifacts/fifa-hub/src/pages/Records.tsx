import React, { useState } from "react";
import { Trophy, Star, Target, Crown, Flag, Clock, Users, Flame } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const RECORDS = {
  players: [
    { title: "Most Goals", value: "16", name: "Miroslav Klose", country: "Germany", countryCode: "de", icon: Target, detail: "Across 4 tournaments (2002-2014)" },
    { title: "Most Assists", value: "8", name: "Lionel Messi", country: "Argentina", countryCode: "ar", icon: Star, detail: "Across 5 tournaments (2006-2022)" },
    { title: "Most Appearances", value: "26", name: "Lionel Messi", country: "Argentina", countryCode: "ar", icon: Users, detail: "Matches played (2006-2022)" },
    { title: "Goals in Single Tournament", value: "13", name: "Just Fontaine", country: "France", countryCode: "fr", icon: Flame, detail: "Scored in a single edition (1958)" },
    { title: "Most Tournaments Played", value: "5", name: "Multiple Players", country: "Various", countryCode: "un", icon: Clock, detail: "Messi, Ronaldo, Márquez, Carbajal, Matthäus, Ochoa, Guardado" },
    { title: "Youngest Goalscorer", value: "17y 239d", name: "Pelé", country: "Brazil", countryCode: "br", icon: Crown, detail: "vs Wales (1958)" },
  ],
  teams: [
    { title: "Most Titles", value: "5", name: "Brazil", countryCode: "br", icon: Trophy, detail: "1958, 1962, 1970, 1994, 2002" },
    { title: "Most Final Appearances", value: "8", name: "Germany", countryCode: "de", icon: Flag, detail: "4 wins, 4 runner-ups" },
    { title: "Most Goals Scored (All-Time)", value: "237", name: "Brazil", countryCode: "br", icon: Target, detail: "In 114 matches played" },
    { title: "Goals in Single Tournament", value: "27", name: "Hungary", countryCode: "hu", icon: Flame, detail: "In only 5 matches (1954)" },
    { title: "Most Matches Played", value: "114", name: "Brazil & Germany", countryCode: "un", icon: Users, detail: "Tied for most matches played" },
    { title: "Most Consecutive Wins", value: "11", name: "Brazil", countryCode: "br", icon: Star, detail: "Across 2002 and 2006 tournaments" },
  ],
  matches: [
    { title: "Highest Scoring Match", value: "12", name: "Austria 7-5 Switzerland", countryCode: "un", icon: Flame, detail: "1954 Quarter-final" },
    { title: "Biggest Margin of Victory", value: "9", name: "Hungary 10-1 El Salvador", countryCode: "un", icon: Target, detail: "1982 Group Stage" },
    { title: "Fastest Goal", value: "10.8s", name: "Hakan Şükür", countryCode: "tr", icon: Clock, detail: "Turkey vs South Korea (2002)" },
    { title: "Highest Attendance", value: "173,850", name: "Uruguay vs Brazil", countryCode: "un", icon: Users, detail: "Maracanã Stadium (1950)" },
  ]
};

export default function Records() {
  const [activeTab, setActiveTab] = useState<"players" | "teams" | "matches">("players");

  return (
    <div className="pb-24 pt-8">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-widest text-primary mb-4 uppercase">
            All-Time Records
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The extraordinary feats, unmatched streaks, and historic milestones of the FIFA World Cup.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-12 animate-in fade-in duration-700">
          <Tabs defaultValue="players" onValueChange={(v) => setActiveTab(v as any)} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
              <TabsTrigger value="players" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Players</TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Teams</TabsTrigger>
              <TabsTrigger value="matches" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Matches</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {RECORDS[activeTab].map((record, index) => {
              const Icon = record.icon;
              return (
                <motion.div
                  key={record.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group overflow-hidden relative"
                >
                  {/* Decorative Background Icon */}
                  <div className="absolute -right-6 -top-6 text-secondary/5 transition-transform duration-500 group-hover:scale-110 pointer-events-none">
                    <Icon className="w-40 h-40" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="bg-primary/10 text-primary p-3 rounded-xl">
                        <Icon className="w-6 h-6" />
                      </div>
                      {record.countryCode !== "un" && (
                        <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-border/50">
                          <img src={`https://flagcdn.com/w40/${record.countryCode}.png`} alt="flag" className="w-6 h-4 object-cover rounded-sm" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="mb-6 flex-1">
                      <h3 className="text-muted-foreground font-medium uppercase tracking-wider text-xs mb-2">
                        {record.title}
                      </h3>
                      <div className="font-display font-black text-4xl md:text-5xl text-foreground tracking-wider mb-2">
                        <AnimatedCounter value={record.value} />
                      </div>
                      <div className="font-bold text-lg text-primary">
                        {record.name}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border/50 pt-4 mt-auto">
                      <p className="text-sm text-muted-foreground">
                        {record.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
