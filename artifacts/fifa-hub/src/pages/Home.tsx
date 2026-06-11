import { Link } from "wouter";
import { motion, useScroll, useTransform, Variants, useSpring } from "framer-motion";
import { ArrowRight, Users, Calendar, Trophy, Flag } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { ParticleField } from "@/components/ParticleField";
import { MatchCard } from "@/components/MatchCard";
import { FlagParallaxStrip } from "@/components/home/FlagParallaxStrip";
import { SectionMarquee } from "@/components/home/SectionMarquee";
import {
  useGetUpcomingFixtures,
  useGetRecentFixtures,
  useGetStandings,
  useGetNews,
  useGetTeams,
} from "@workspace/api-client-react";
import { formatDateOnly } from "@/lib/formatDate";
import { MatchCardSkeleton } from "@/components/MatchCardSkeleton";
import { ArticleSkeleton } from "@/components/ArticleSkeleton";
import { TeamSkeleton } from "@/components/TeamSkeleton";
import { StandingsSkeleton } from "@/components/StandingsSkeleton";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Typewriter } from "@/components/ui/typewriter";
import { OriginButton } from "@/components/ui/origin-button";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item: Variants = { 
  hidden: { opacity: 0, y: 30, scale: 0.95 }, 
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20 } } 
};

const headerVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};
const bulletVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 12, delay: 0.2 }
  }
};

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: '-50px' }} 
        className="flex items-center gap-3"
      >
        <motion.div variants={bulletVariants} className="w-2 h-2 rounded-full bg-foreground" />
        <motion.h2 variants={headerVariants} className="font-display text-xl md:text-2xl font-bold tracking-widest text-primary uppercase">
          {title}
        </motion.h2>
      </motion.div>
      <Link href={href} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-semibold transition-colors">
        View All <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function Home() {
  const { data: upcoming, isLoading: upcomingLoading } = useGetUpcomingFixtures({ limit: 6 });
  const { data: recent, isLoading: recentLoading } = useGetRecentFixtures({ limit: 4 });
  const { data: standings, isLoading: standingsLoading } = useGetStandings();
  const { data: newsData, isLoading: newsLoading } = useGetNews();
  const { data: teams, isLoading: teamsLoading } = useGetTeams();

  const { scrollY } = useScroll();

  const upcomingArr = Array.isArray(upcoming) ? upcoming : [];
  const recentArr = Array.isArray(recent) ? recent : [];
  const firstSixGroups = Array.isArray(standings) ? standings.slice(0, 6) : [];
  const articles = Array.isArray(newsData?.articles) ? newsData.articles.slice(0, 5) : [];
  const topTeams = Array.isArray(teams) ? teams.slice(0, 9) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[500px] border-b border-border flex items-center">
        {/* Static Background */}
        <div 
          className="absolute inset-0 bg-[url('/trophy-bg.png')] bg-cover bg-center bg-no-repeat"
        />
        
        {/* Particle Field */}
        <ParticleField />
        
        {/* Dark gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 z-0" />
        
        <div className="mx-auto max-w-[1440px] w-full px-6 md:px-8 relative z-10 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-muted-foreground font-semibold tracking-[0.25em] text-base md:text-lg uppercase mb-3 text-white">The Road to</p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-primary leading-[1.1] mb-6">
                WORLD CUP
                <span className="text-foreground block">2026</span>
              </h1>
              <div className="text-muted-foreground mb-8 text-base md:text-lg max-w-md font-medium leading-relaxed h-[28px] md:h-[32px]">
                <Typewriter 
                  textArray={[
                    "Follow every match.",
                    "Track every team.",
                    "Experience the world's biggest tournament."
                  ]} 
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/fixtures">
                  <OriginButton circleClassName="bg-black/10" data-testid="button-explore-fixtures" className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-md font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-shadow">
                    Explore Fixtures
                  </OriginButton>
                </Link>
                <Link href="/teams">
                  <OriginButton circleClassName="bg-primary/20" data-testid="button-browse-teams" className="flex items-center gap-2 border border-primary text-primary bg-transparent px-8 py-3.5 rounded-md font-bold text-sm">
                    Browse Teams
                  </OriginButton>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-end pr-4 lg:pr-12">
              <Countdown />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionMarquee />
      <FlagParallaxStrip />

      <div className="container mx-auto px-4 py-10 space-y-12">
        {/* Upcoming Fixtures */}
        <section>
          <SectionHeader title="Live & Upcoming" href="/fixtures" />
          {upcomingLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-full h-full"><MatchCardSkeleton /></div>
              ))}
            </div>
          ) : upcomingArr.length > 0 ? (
            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '50px' }}>
              {upcomingArr.map((f) => (
                <motion.div key={f.id} variants={item} className="h-full flex flex-col">
                  <MatchCard fixture={f} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-border rounded-2xl bg-card">
              <Calendar className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No upcoming fixtures available</p>
            </div>
          )}
        </section>

        {/* Recent Results */}
        {recentArr.length > 0 && (
          <section>
            <SectionHeader title="Recent Results" href="/fixtures" />
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '50px' }}>
              {recentArr.map((f) => (
                <motion.div key={f.id} variants={item} className="h-full flex flex-col">
                  <MatchCard fixture={f} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Tournament Overview (3 Columns) */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Left: Stats Overview */}
          <div className="lg:col-span-1 flex flex-col">
            <SectionHeader title="Overview" href="/stats" />
            <div className="bg-card border border-border rounded-2xl p-6 flex-1 relative overflow-hidden flex flex-col justify-center">
              {/* Subtle background decoration */}
              <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                <Trophy className="w-64 h-64" />
              </div>
              <div className="space-y-6 relative z-10">
                {[
                  { icon: Users, label: "Teams", value: "48" },
                  { icon: Trophy, label: "Groups", value: "12" },
                  { icon: Calendar, label: "Matches", value: "104" },
                  { icon: Flag, label: "Host Cities", value: "16" },
                  { icon: Flag, label: "Host Nations", value: "3" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold text-foreground leading-none">
                        <AnimatedCounter value={value} />
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle: Group Standings */}
          <div className="lg:col-span-2">
            <SectionHeader title="Group Standings" href="/fixtures" />
            {standingsLoading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <StandingsSkeleton key={i} />
                ))}
              </div>
            ) : firstSixGroups.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {firstSixGroups.map((g) => (
                  <div key={g.group} className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="bg-background px-5 py-4 flex items-center justify-between">
                      <span className="font-display tracking-widest text-foreground text-sm uppercase">{g.group}</span>
                      <div className="flex gap-4 text-[10px] text-muted-foreground font-bold tracking-widest">
                        <span className="w-4 text-center">P</span>
                        <span className="w-5 text-center">PTS</span>
                      </div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {g.standings.map((row, index) => (
                        <Link href={`/teams/${row.team.id}`} key={row.rank} className="block">
                          <motion.div 
                            initial={{ opacity: 0, height: 0, scaleY: 0 }}
                            whileInView={{
                              opacity: 1, height: 'auto', scaleY: 1,
                              transition: { type: 'spring', damping: 25, delay: index * 0.05 }
                            }}
                            viewport={{ once: true, margin: '50px' }}
                            className="flex items-center px-5 py-3.5 gap-3 hover:bg-muted/30 transition-colors origin-top cursor-pointer"
                          >
                            <span className="text-[10px] text-muted-foreground w-4 text-center font-semibold">{row.rank}</span>
                            <img
                              src={row.team.logo}
                              alt={row.team.name}
                              className="w-5 h-5 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://flagcdn.com/w40/${(row.team.code ?? "un").toLowerCase()}.png`; }}
                            />
                            <span className="text-xs font-semibold flex-1 truncate">{row.team.name}</span>
                            <span className="text-[10px] text-muted-foreground w-4 text-center font-mono">{row.played}</span>
                            <span className="text-xs font-bold text-foreground w-5 text-center font-mono">{row.points}</span>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Standings not yet available</p>
              </div>
            )}
          </div>

          {/* Right: Latest News */}
          <div className="lg:col-span-1">
            <SectionHeader title="Latest News" href="/news" />
            {newsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article, i) => (
                  <motion.a
                    key={i}
                    href={article.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`article-home-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors group"
                  >
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt=""
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                      <div>
                        {i === 0 && (
                          <span className="inline-block bg-primary/20 text-primary text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase mb-1">
                            Top Story
                          </span>
                        )}
                        <p className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{article.title}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground font-semibold">{article.source}</span>
                        <span className="text-[10px] text-muted-foreground">{formatDateOnly(article.publishedAt)}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Explore Teams */}
        <section>
          <SectionHeader title="Explore Teams" href="/teams" />
          {teamsLoading ? (
            <div className="flex gap-6 overflow-hidden pt-2 pb-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="min-w-[120px]"><TeamSkeleton /></div>
              ))}
            </div>
          ) : (
            <motion.div className="flex gap-6 overflow-x-auto pt-2 pb-4 hide-scrollbar snap-x" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '50px' }}>
              {topTeams.map((team) => (
                <motion.div key={team.id} variants={item} className="w-[140px] flex-shrink-0 snap-start">
                  <Link href={`/teams/${team.id}`}>
                    <div data-testid={`card-team-${team.id}`} className="flex flex-col items-center gap-3 p-4 bg-card border border-border rounded-[20px] hover:-translate-y-1 hover:border-primary/50 transition-all cursor-pointer group shadow-sm h-full w-full">
                      <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden shadow-inner p-1 flex-shrink-0">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://flagcdn.com/w40/${(team.code ?? "un").toLowerCase()}.png`; }}
                        />
                      </div>
                      <div className="text-center w-full overflow-hidden">
                        <p className="text-sm font-bold group-hover:text-primary transition-colors truncate w-full" title={team.name}>{team.name}</p>
                        {team.group && <p className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold truncate w-full">{team.group}</p>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Stats Bar (Footer Style) */}
        <div className="mt-16 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { icon: Users, label: "TEAMS", value: "48" },
              { icon: Calendar, label: "MATCHES", value: "104" },
              { icon: Flag, label: "HOST CITIES", value: "16" },
              { icon: Flag, label: "HOST NATIONS", value: "3" },
              { icon: Trophy, label: "DREAM", value: "1" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-2 border-r border-border last:border-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-display text-3xl md:text-4xl text-foreground tracking-widest">{value}</span>
                </div>
                <span className="text-[10px] text-muted-foreground tracking-widest font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Full Width Banner */}
      <section className="border-t border-border bg-card relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_50%)]" />
        
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:py-24 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 uppercase">
            Don't Miss A Moment
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Stay updated with every match,<br />
            every goal,<br />
            every story.
          </p>
          <button className="bg-primary text-primary-foreground px-10 py-4 rounded-md font-bold text-base hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            Explore FIFA Hub
          </button>
        </div>
      </section>
    </div>
  );
}
