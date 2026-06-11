import { motion } from "framer-motion";
import { useGetFixtures } from "@workspace/api-client-react";
import { KnockoutTree } from "@/components/bracket/KnockoutTree";

export default function Bracket() {
  const { data: fixtures, isLoading } = useGetFixtures({});

  // Group the data
  const knockoutData = {
    r32: [] as any[],
    r16: [] as any[],
    qf: [] as any[],
    sf: [] as any[],
    third: [] as any[],
    final: [] as any[]
  };

  if (Array.isArray(fixtures)) {
    fixtures.forEach(f => {
      if (f.round === "Round of 32") knockoutData.r32.push(f);
      else if (f.round === "Round of 16") knockoutData.r16.push(f);
      else if (f.round === "Quarter-final") knockoutData.qf.push(f);
      else if (f.round === "Semi-final") knockoutData.sf.push(f);
      else if (f.round === "Third Place") knockoutData.third.push(f);
      else if (f.round === "Final") knockoutData.final.push(f);
    });

    // Ensure they are sorted by ID (match number) to preserve bracket order
    const sortById = (a: any, b: any) => parseInt(a.id) - parseInt(b.id);
    knockoutData.r32.sort(sortById);
    knockoutData.r16.sort(sortById);
    knockoutData.qf.sort(sortById);
    knockoutData.sf.sort(sortById);
    knockoutData.third.sort(sortById);
    knockoutData.final.sort(sortById);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1440px]">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl tracking-widest mb-1 uppercase">Knockouts</h1>
        <p className="text-muted-foreground text-sm">The path to the 2026 World Cup Final</p>
      </motion.div>

      {isLoading ? (
        <div className="w-full h-[600px] bg-card/20 animate-pulse rounded-xl border border-border flex items-center justify-center">
          <span className="text-muted-foreground font-display tracking-widest">LOADING BRACKET...</span>
        </div>
      ) : (
        <div className="bg-background rounded-xl border border-border/40 overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
          <KnockoutTree data={knockoutData} />
        </div>
      )}
    </div>
  );
}
