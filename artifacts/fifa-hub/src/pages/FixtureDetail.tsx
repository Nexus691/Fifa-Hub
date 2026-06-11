import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Users, Sun } from "lucide-react";
import { Link } from "wouter";
import { useGetFixture } from "@workspace/api-client-react";
import type { FixtureDetail as FixtureDetailType, MatchEvent, Lineup, MatchStatistic, StatItem, LineupPlayer } from "@workspace/api-client-react";
import { formatMatchDateFull } from "@/lib/formatDate";



import { TabOverview } from "@/components/fixture/TabOverview";
import { TabTimeline } from "@/components/fixture/TabTimeline";
import { TabLineups } from "@/components/fixture/TabLineups";
import { TabStats } from "@/components/fixture/TabStats";
import { TabH2H } from "@/components/fixture/TabH2H";
import { TabNews } from "@/components/fixture/TabNews";

function MatchCountdown({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(date).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const total = timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds;
  if (total <= 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-4 text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
      <div className="flex flex-col items-center">
        <span className="font-display text-xl leading-none tabular-nums">{timeLeft.days.toString().padStart(2, '0')}</span>
        <span className="text-[8px] uppercase tracking-widest font-bold">Days</span>
      </div>
      <span className="text-primary/50 text-xl leading-none -mt-3">:</span>
      <div className="flex flex-col items-center">
        <span className="font-display text-xl leading-none tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-[8px] uppercase tracking-widest font-bold">Hrs</span>
      </div>
      <span className="text-primary/50 text-xl leading-none -mt-3">:</span>
      <div className="flex flex-col items-center">
        <span className="font-display text-xl leading-none tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="text-[8px] uppercase tracking-widest font-bold">Mins</span>
      </div>
      <span className="text-primary/50 text-xl leading-none -mt-3">:</span>
      <div className="flex flex-col items-center">
        <span className="font-display text-xl leading-none tabular-nums">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="text-[8px] uppercase tracking-widest font-bold">Secs</span>
      </div>
    </div>
  );
}

export default function FixtureDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const [activeTab, setActiveTab] = useState("Overview");
  const [direction, setDirection] = useState(0);
  const tabs = ["Overview", "Timeline", "Lineups", "Stats", "H2H", "News"];
  
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500], [0, 150]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const { data: fixture, isLoading, isError } = useGetFixture(id, {
    query: { enabled: !!id, queryKey: ["/fixtures", id] },
  });

  const handleTabChange = (newTab: string) => {
    const newIndex = tabs.indexOf(newTab);
    const oldIndex = tabs.indexOf(activeTab);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="h-48 rounded-xl bg-card/50 animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !fixture) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg">Match not found</p>
        <Link href="/fixtures" className="text-primary text-sm mt-2 inline-block hover:underline">Back to Fixtures</Link>
      </div>
    );
  }

  const f = fixture as FixtureDetailType;
  const isLive = f.statusShort === "1H" || f.statusShort === "2H" || f.statusShort === "HT";

  const getTeamImg = (team: FixtureDetailType["homeTeam"]) =>
    team.logo || `https://flagcdn.com/w80/${(team.code ?? "un").toLowerCase()}.png`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/fixtures" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Fixtures
      </Link>

      {/* Score Header */}
      <motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 md:p-8 mb-6 relative overflow-hidden"
        >
          <div className="match-header-bg-pulse" />
          <div className="relative">
          <div className="flex justify-center mb-6 gap-3 flex-wrap text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            {isLive ? (
              <span className="bg-red-600 text-white px-3 py-1 rounded-sm animate-pulse">LIVE {f.elapsed}&apos;</span>
            ) : f.statusShort === "FT" ? (
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-sm">FULL TIME</span>
            ) : (
              <span className="bg-muted px-3 py-1 rounded-sm">NOT STARTED</span>
            )}
            {f.group && <span className="bg-muted px-3 py-1 rounded-sm">{f.group} • Matchday 1</span>}
            {!f.group && f.round && <span className="bg-muted px-3 py-1 rounded-sm">{f.round}</span>}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <Link href={`/teams/${f.homeTeam.id}`} className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                <img src={getTeamImg(f.homeTeam)} alt={f.homeTeam.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span className="font-bold text-center text-sm md:text-base uppercase tracking-widest">{f.homeTeam.name}</span>
              </Link>
            </div>

            <div className="text-center px-4">
              <div className="font-display text-5xl md:text-6xl text-primary tracking-widest mb-1">
                {f.homeScore !== null && f.awayScore !== null ? (
                  <>{f.homeScore} - {f.awayScore}</>
                ) : (
                  <span className="text-3xl text-muted-foreground">VS</span>
                )}
              </div>
              {!isLive && f.statusShort !== "FT" && (
                 <>
                   <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-2">
                     NOT STARTED
                   </div>
                   <MatchCountdown date={f.date} />
                 </>
              )}
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                {formatMatchDateFull(f.date)}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1">
              <Link href={`/teams/${f.awayTeam.id}`} className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                <img src={getTeamImg(f.awayTeam)} alt={f.awayTeam.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span className="font-bold text-center text-sm md:text-base uppercase tracking-widest">{f.awayTeam.name}</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground mt-8">
            <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary" /> {f.venue || "TBA"}{f.city ? ` · ${f.city}` : ""}</div>
            <div className="flex items-center gap-1"><Users className="w-4 h-4 text-primary" /> Capacity: {f.capacity ? f.capacity.toLocaleString() : "TBA"}</div>
          </div>
        </div>
        </motion.div>
      </motion.div>

      {/* Sticky Tabs */}
      <div className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-md border-b border-border mb-8 pb-0 pt-2">
        <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar font-display tracking-widest text-sm uppercase">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 relative overflow-hidden pb-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {activeTab === "Overview" && <TabOverview fixture={f} />}
            {activeTab === "Timeline" && <TabTimeline fixture={f} />}
            {activeTab === "Lineups" && <TabLineups fixture={f} />}
            {activeTab === "Stats" && <TabStats fixture={f} />}
            {activeTab === "H2H" && <TabH2H fixture={f} />}
            {activeTab === "News" && <TabNews />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
