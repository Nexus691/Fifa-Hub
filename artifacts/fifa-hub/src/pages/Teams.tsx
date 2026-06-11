import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { useGetTeams } from "@workspace/api-client-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { 
  hidden: { opacity: 0, y: 30, rotateY: 30 }, 
  show: { opacity: 1, y: 0, rotateY: 0, transition: { type: 'spring', damping: 18 } } 
};

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function Teams() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { data: teams, isLoading } = useGetTeams({
    group: selectedGroup ? `Group ${selectedGroup}` : undefined,
    search: search || undefined,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl tracking-widest mb-1">TEAMS</h1>
        <p className="text-muted-foreground text-sm">All 48 nations competing in the 2026 FIFA World Cup</p>
      </motion.div>

      {/* Search + Group Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <motion.div
          animate={isFocused ? {
            boxShadow: '0 0 0 1px rgba(212,175,55,0.5), 0 4px 20px rgba(212,175,55,0.1)'
          } : {
            boxShadow: '0 0 0 1px rgba(42,42,42,1)'
          }}
          transition={{ duration: 0.2 }}
          className="relative flex-1 rounded-md overflow-hidden bg-card"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <input
            data-testid="input-search-teams"
            type="search"
            placeholder="Search teams..."
            value={search}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none py-2.5 pl-9 pr-3 text-sm focus:outline-none placeholder:text-muted-foreground relative z-10"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '1px', background: '#D4AF37',
              transformOrigin: 'left', borderRadius: 1,
              zIndex: 20
            }}
          />
        </motion.div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => setSelectedGroup("")}
            layout
            className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${selectedGroup === "" ? "border-transparent text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {selectedGroup === "" && (
              <motion.div
                layoutId="filter-active-bg"
                className="absolute inset-0 bg-primary rounded-md"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">All</span>
          </motion.button>
          {GROUPS.map((g) => {
            const isSelected = selectedGroup === g;
            return (
              <motion.button
                key={g}
                onClick={() => setSelectedGroup(isSelected ? "" : g)}
                layout
                className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${isSelected ? "border-transparent text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="filter-active-bg"
                    className="absolute inset-0 bg-primary rounded-md"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{g}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : Array.isArray(teams) && teams.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {teams.map((team) => (
            <motion.div key={team.id} variants={item} className="h-full">
              <Link href={`/teams/${team.id}`} className="block h-full">
                <div
                  data-testid={`card-team-${team.id}`}
                  className="flex flex-col items-center justify-between gap-3 p-4 h-full bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer group relative"
                >
                  <div className="relative z-10">
                    <motion.img
                      src={team.logo}
                      alt={team.name}
                      whileHover={{
                        scale: 1.18,
                        rotate: [-2, 2, -1, 1, 0],
                        filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.4))',
                        transition: {
                          scale: { duration: 0.2 },
                          rotate: { duration: 0.4, ease: 'easeOut' },
                          filter: { duration: 0.3 }
                        }
                      }}
                      whileTap={{ scale: 1.1, rotate: 0 }}
                      className="w-14 h-14 object-contain origin-center"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = `https://flagcdn.com/w80/${(team.code ?? "un").toLowerCase()}.png`;
                        img.className = "w-14 h-10 object-cover rounded origin-center";
                      }}
                    />
                  </div>
                  <div className="text-center relative z-10">
                    <p className="text-xs font-bold group-hover:text-primary transition-colors leading-tight">{team.name}</p>
                    {team.group && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1 inline-block">{team.group}</span>
                    )}
                    {team.fifaRank && (
                      <p className="text-[10px] text-muted-foreground mt-1">FIFA #{team.fifaRank}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No teams found</p>
          <p className="text-sm mt-1">Try a different search</p>
        </div>
      )}
    </div>
  );
}
