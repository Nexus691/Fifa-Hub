import React from "react";
import { Globe, MapPin, Trophy, Users, Calendar, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default function About() {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7eaad9372?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="w-full px-6 relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-widest text-primary mb-6 uppercase drop-shadow-lg">
              United 2026
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The biggest, most inclusive, and most ambitious FIFA World Cup™ in history. 
              Three nations. 16 cities. 48 teams. One unforgettable summer.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1440px] mx-auto px-6 -mt-16 relative z-20 space-y-24">
        
        {/* Key Facts Grid */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Teams", value: "48", icon: Users, desc: "Largest field ever" },
              { label: "Matches", value: "104", icon: Trophy, desc: "Action-packed" },
              { label: "Host Cities", value: "16", icon: MapPin, desc: "Across 3 nations" },
              { label: "Days", value: "39", icon: Calendar, desc: "Of football magic" },
            ].map((fact, i) => (
              <div
                key={i}
                className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-6 text-center shadow-xl hover:border-primary/50 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <fact.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-display text-4xl font-bold text-foreground mb-1">
                  <AnimatedCounter value={fact.value} />
                </div>
                <div className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">{fact.label}</div>
                <div className="text-xs text-muted-foreground">{fact.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Host Nations */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-widest uppercase mb-4">The Hosts</h2>
            <p className="text-muted-foreground">For the first time ever, three nations will share the ultimate football stage.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "United States", code: "us", cities: 11, desc: "Returning host (1994) bringing world-class NFL stadiums to the global game." },
              { name: "Mexico", code: "mx", cities: 3, desc: "Making history as the first nation to host the tournament three times (1970, 1986)." },
              { name: "Canada", code: "ca", cities: 2, desc: "First-time host, welcoming the world to its vibrant, multicultural metropolises." },
            ].map((host, i) => (
              <motion.div 
                key={host.name} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group"
              >
                <div className="h-32 bg-secondary/10 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
                  <img src={`https://flagcdn.com/w320/${host.code}.png`} alt={host.name} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative z-20 w-16 h-12 rounded overflow-hidden shadow-lg border border-border/50">
                    <img src={`https://flagcdn.com/w80/${host.code}.png`} alt={host.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold font-display tracking-wider mb-2 uppercase">{host.name}</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-4">
                    <MapPin className="w-3 h-3" />
                    {host.cities} Host Cities
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{host.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tournament Format */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold tracking-widest uppercase mb-6">A New Era</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  The 2026 World Cup introduces a groundbreaking new format to accommodate the expansion from 32 to 48 participating teams.
                </p>
                <ul className="space-y-4">
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    <span><strong>12 Groups of 4:</strong> The teams will be drawn into 12 groups. Each team plays 3 group stage matches.</span>
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                    className="flex gap-3"
                  >
                    <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    <span><strong>Advancement:</strong> The top 2 teams from each group, along with the 8 best 3rd-place teams, will advance to the knockouts.</span>
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                    className="flex gap-3"
                  >
                    <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    <span><strong>Round of 32:</strong> An entirely new knockout round is introduced, meaning the champions must survive 8 matches instead of 7 to lift the trophy.</span>
                  </motion.li>
                </ul>
              </div>
            </div>
            <div className="bg-secondary/5 border-l border-border relative p-10 flex items-center justify-center overflow-hidden min-h-[300px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 relative z-10 w-full max-w-md mx-auto opacity-70">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + (i * 0.05) }}
                    key={i} className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <span className="font-display text-xs font-bold text-muted-foreground">GRP {String.fromCharCode(65 + i)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
