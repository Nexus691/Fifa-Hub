import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar } from "lucide-react";
import { MatchCard } from "@/components/MatchCard";
import { useGetFixtures } from "@workspace/api-client-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const GROUPS = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H", "Group I", "Group J", "Group K", "Group L"];
const STATUSES = [
  { label: "All", value: "" },
  { label: "Scheduled", value: "NS" },
  { label: "Live", value: "1H" },
  { label: "Finished", value: "FT" },
];

export default function Fixtures() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: fixtures, isLoading } = useGetFixtures({
    group: selectedGroup || undefined,
    team: search || undefined,
    date: selectedDate || undefined,
    status: selectedStatus || undefined,
  });

  const sortedFixtures = Array.isArray(fixtures) ? [...fixtures].sort((a, b) => {
    const isAFinished = ["FT", "AET", "PEN", "Finished"].includes(a.statusShort);
    const isBFinished = ["FT", "AET", "PEN", "Finished"].includes(b.statusShort);
    
    if (isAFinished && !isBFinished) return 1;
    if (!isAFinished && isBFinished) return -1;
    return 0; // Maintain API order for the rest
  }) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl tracking-widest mb-1">FIXTURES</h1>
        <p className="text-muted-foreground text-sm">Complete World Cup 2026 match schedule</p>
      </motion.div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
          <Filter className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider">Filter Matches</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              data-testid="input-search-team"
              type="search"
              placeholder="Search team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>

          <select
            data-testid="select-group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-background border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="">All Groups</option>
            {GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            data-testid="select-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-background border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <input
            data-testid="input-filter-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-background border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground [color-scheme:dark]"
          />
        </div>

        {(selectedGroup || selectedStatus || selectedDate || search) && (
          <button
            data-testid="button-clear-filters"
            onClick={() => { setSearch(""); setSelectedGroup(""); setSelectedStatus(""); setSelectedDate(""); }}
            className="mt-3 text-xs text-primary hover:text-primary/80 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-44 rounded-lg bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : sortedFixtures.length > 0 ? (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={container} initial="hidden" animate="show">
          {sortedFixtures.map((f) => (
            <motion.div key={f.id} variants={item}>
              <MatchCard fixture={f} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No matches found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
