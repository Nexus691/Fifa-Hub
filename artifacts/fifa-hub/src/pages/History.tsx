import React from "react";
import { Trophy, Medal, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const WORLD_CUPS = [
  { year: 2022, host: "Qatar", hostCode: "qa", winner: "Argentina", winnerCode: "ar", runnerUp: "France", runnerUpCode: "fr", score: "3 - 3 (4-2 p)" },
  { year: 2018, host: "Russia", hostCode: "ru", winner: "France", winnerCode: "fr", runnerUp: "Croatia", runnerUpCode: "hr", score: "4 - 2" },
  { year: 2014, host: "Brazil", hostCode: "br", winner: "Germany", winnerCode: "de", runnerUp: "Argentina", runnerUpCode: "ar", score: "1 - 0 (a.e.t)" },
  { year: 2010, host: "South Africa", hostCode: "za", winner: "Spain", winnerCode: "es", runnerUp: "Netherlands", runnerUpCode: "nl", score: "1 - 0 (a.e.t)" },
  { year: 2006, host: "Germany", hostCode: "de", winner: "Italy", winnerCode: "it", runnerUp: "France", runnerUpCode: "fr", score: "1 - 1 (5-3 p)" },
  { year: 2002, host: "South Korea & Japan", hostCode: "kr", winner: "Brazil", winnerCode: "br", runnerUp: "Germany", runnerUpCode: "de", score: "2 - 0" },
  { year: 1998, host: "France", hostCode: "fr", winner: "France", winnerCode: "fr", runnerUp: "Brazil", runnerUpCode: "br", score: "3 - 0" },
  { year: 1994, host: "United States", hostCode: "us", winner: "Brazil", winnerCode: "br", runnerUp: "Italy", runnerUpCode: "it", score: "0 - 0 (3-2 p)" },
  { year: 1990, host: "Italy", hostCode: "it", winner: "West Germany", winnerCode: "de", runnerUp: "Argentina", runnerUpCode: "ar", score: "1 - 0" },
  { year: 1986, host: "Mexico", hostCode: "mx", winner: "Argentina", winnerCode: "ar", runnerUp: "West Germany", runnerUpCode: "de", score: "3 - 2" },
  { year: 1982, host: "Spain", hostCode: "es", winner: "Italy", winnerCode: "it", runnerUp: "West Germany", runnerUpCode: "de", score: "3 - 1" },
  { year: 1978, host: "Argentina", hostCode: "ar", winner: "Argentina", winnerCode: "ar", runnerUp: "Netherlands", runnerUpCode: "nl", score: "3 - 1 (a.e.t)" },
  { year: 1974, host: "West Germany", hostCode: "de", winner: "West Germany", winnerCode: "de", runnerUp: "Netherlands", runnerUpCode: "nl", score: "2 - 1" },
  { year: 1970, host: "Mexico", hostCode: "mx", winner: "Brazil", winnerCode: "br", runnerUp: "Italy", runnerUpCode: "it", score: "4 - 1" },
  { year: 1966, host: "England", hostCode: "gb-eng", winner: "England", winnerCode: "gb-eng", runnerUp: "West Germany", runnerUpCode: "de", score: "4 - 2 (a.e.t)" },
  { year: 1962, host: "Chile", hostCode: "cl", winner: "Brazil", winnerCode: "br", runnerUp: "Czechoslovakia", runnerUpCode: "cz", score: "3 - 1" },
  { year: 1958, host: "Sweden", hostCode: "se", winner: "Brazil", winnerCode: "br", runnerUp: "Sweden", runnerUpCode: "se", score: "5 - 2" },
  { year: 1954, host: "Switzerland", hostCode: "ch", winner: "West Germany", winnerCode: "de", runnerUp: "Hungary", runnerUpCode: "hu", score: "3 - 2" },
  { year: 1950, host: "Brazil", hostCode: "br", winner: "Uruguay", winnerCode: "uy", runnerUp: "Brazil", runnerUpCode: "br", score: "2 - 1" },
  { year: 1938, host: "France", hostCode: "fr", winner: "Italy", winnerCode: "it", runnerUp: "Hungary", runnerUpCode: "hu", score: "4 - 2" },
  { year: 1934, host: "Italy", hostCode: "it", winner: "Italy", winnerCode: "it", runnerUp: "Czechoslovakia", runnerUpCode: "cz", score: "2 - 1 (a.e.t)" },
  { year: 1930, host: "Uruguay", hostCode: "uy", winner: "Uruguay", winnerCode: "uy", runnerUp: "Argentina", runnerUpCode: "ar", score: "4 - 2" },
];

export default function History() {
  return (
    <div className="pb-24 pt-8">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-widest text-primary mb-4 uppercase">
            World Cup History
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A chronological journey through nearly a century of football's greatest tournament.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-border md:border-l-0 md:mx-auto">
          {/* Vertical Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          {WORLD_CUPS.map((cup, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                key={cup.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative pl-8 md:pl-0 mb-12 md:mb-16 w-full flex md:justify-between items-center ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-primary rounded-full ring-4 ring-background shadow-sm" />

                {/* Empty space for alternating desktop layout */}
                <div className="hidden md:block w-5/12" />

                {/* Content Card */}
                <div className="w-full md:w-5/12">
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                    
                    {/* Year Watermark */}
                    <div className="absolute -right-4 -bottom-6 text-8xl font-display font-black text-secondary/5 z-0 transition-transform duration-500 group-hover:scale-110 pointer-events-none">
                      {cup.year}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="font-display text-2xl font-bold tracking-widest text-foreground">{cup.year}</h2>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{cup.host}</span>
                            <img src={`https://flagcdn.com/w20/${cup.hostCode}.png`} alt={cup.host} className="w-4 h-3 ml-1 rounded-sm shadow-sm opacity-80" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Final Result Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-3 flex-1">
                            {/* Winner */}
                            <div className="flex items-center gap-2">
                              <img src={`https://flagcdn.com/w40/${cup.winnerCode}.png`} alt={cup.winner} className="w-6 h-4 rounded shadow-sm border border-border/50" />
                              <span className="font-bold text-foreground">{cup.winner}</span>
                              <Trophy className="w-3.5 h-3.5 text-yellow-500 ml-1" />
                            </div>
                            
                            {/* Runner-up */}
                            <div className="flex items-center gap-2">
                              <img src={`https://flagcdn.com/w40/${cup.runnerUpCode}.png`} alt={cup.runnerUp} className="w-6 h-4 rounded shadow-sm border border-border/50 opacity-80" />
                              <span className="text-muted-foreground font-medium">{cup.runnerUp}</span>
                              <Medal className="w-3.5 h-3.5 text-slate-400 ml-1 opacity-80" />
                            </div>
                          </div>
                          
                          {/* Score */}
                          <div className="flex flex-col items-end justify-center pl-4 border-l border-border/50 h-full">
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Final Score</div>
                            <div className="font-display font-bold text-xl tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 whitespace-nowrap">
                              {cup.score}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
