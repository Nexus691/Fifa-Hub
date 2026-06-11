import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import type { Fixture } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMatchDate } from "@/lib/formatDate";
import { use3DTilt } from "@/hooks/use3DTilt";
import gsap from "gsap";

interface MatchCardProps {
  fixture: Fixture;
}

const homeTeamVariants = {
  rest:    { x: 0,    transition: { duration: 0.3, ease: 'easeOut' } },
  hovered: { x: -8,  transition: { duration: 0.3, ease: 'easeOut' } },
};

const awayTeamVariants = {
  rest:    { x: 0,   transition: { duration: 0.3, ease: 'easeOut' } },
  hovered: { x: 8,  transition: { duration: 0.3, ease: 'easeOut' } },
};

const vsVariants = {
  rest:    { letterSpacing: '0px',  opacity: 0.4 },
  hovered: { letterSpacing: '4px', opacity: 0.7 },
};

export function MatchCard({ fixture }: MatchCardProps) {
  const tilt = use3DTilt(6);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isLive = fixture.statusShort === "1H" || fixture.statusShort === "2H" || fixture.statusShort === "HT" || fixture.statusShort === "ET" || fixture.statusShort === "P";
  const isFinished = fixture.statusShort === "FT" || fixture.statusShort === "AET" || fixture.statusShort === "PEN";

  // Track scores for goal flash
  const prevHomeScore = useRef(fixture.homeScore);
  const prevAwayScore = useRef(fixture.awayScore);

  useEffect(() => {
    if (!cardRef.current) return;
    const homeScored = fixture.homeScore !== null && prevHomeScore.current !== null && fixture.homeScore > prevHomeScore.current;
    const awayScored = fixture.awayScore !== null && prevAwayScore.current !== null && fixture.awayScore > prevAwayScore.current;
    
    if (homeScored || awayScored) {
      const card = cardRef.current;
      
      gsap.set(card, { borderColor: 'rgba(255,255,255,0.8)' });
      
      const burst = document.createElement('div');
      burst.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary z-0 pointer-events-none';
      card.appendChild(burst);
      
      gsap.fromTo(burst,
        { scale: 0, opacity: 1 },
        { scale: 4, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => burst.remove() }
      );
      
      const goalText = document.createElement('div');
      goalText.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl font-bold text-white z-10 pointer-events-none tracking-widest';
      goalText.textContent = 'GOAL!';
      card.appendChild(goalText);
      
      gsap.fromTo(goalText,
        { y: 0, opacity: 1 },
        { y: -40, opacity: 0, duration: 0.6, delay: 0.1, ease: 'power2.out', onComplete: () => goalText.remove() }
      );
      
      gsap.to(card, {
        borderColor: 'hsl(var(--border))',
        duration: 0.35,
        delay: 0.4,
        ease: 'easeOut'
      });
    }
    
    prevHomeScore.current = fixture.homeScore;
    prevAwayScore.current = fixture.awayScore;
  }, [fixture.homeScore, fixture.awayScore]);

  const getTeamLogo = (team: Fixture["homeTeam"]) => {
    if (team.logo) return team.logo;
    if (team.code) return `https://flagcdn.com/w80/${team.code.toLowerCase()}.png`;
    return "";
  };

  return (
    <Link href={`/fixtures/${fixture.id}`} className="block h-full">
      <motion.div 
        ref={tilt.ref}
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={(e) => {
          tilt.onMouseLeave(e);
          setIsHovered(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        animate={isHovered ? 'hovered' : 'rest'}
        className="h-full"
      >
        <Card
          ref={cardRef}
          data-testid={`card-fixture-${fixture.id}`}
          className={`match-card flex flex-col p-5 pt-8 gap-3 h-full justify-between transition-colors cursor-pointer bg-card border-border rounded-[20px] shadow-lg relative overflow-hidden ${isLive ? 'live border-primary/30' : 'hover:border-primary/50'}`}
        >
          {/* Top Status */}
          <div className="flex justify-between items-center absolute top-3 left-4 right-4 z-10">
            {isLive ? (
              <div className="flex items-center gap-2">
                <div className="live-dot-wrap mr-1" />
                <Badge variant="destructive" className="bg-transparent hover:bg-transparent text-red-500 text-[9px] px-0 py-0 font-bold uppercase tracking-wider rounded-sm shadow-none">
                  Live
                </Badge>
              </div>
            ) : fixture.statusShort === "NS" ? (
              <span className="text-[10px] text-muted-foreground tracking-widest font-semibold uppercase">
                {formatMatchDate(fixture.date)}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground tracking-widest font-semibold uppercase">
                {fixture.statusShort}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-2 flex-1 relative z-10">
            {/* Home Team */}
            <motion.div variants={homeTeamVariants} className="flex flex-col items-center gap-2 w-1/3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-background border border-border p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={getTeamLogo(fixture.homeTeam)}
                  alt={fixture.homeTeam.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (fixture.homeTeam.code) {
                      img.src = `https://flagcdn.com/w80/${fixture.homeTeam.code.toLowerCase()}.png`;
                    } else {
                      img.style.display = "none";
                    }
                  }}
                />
              </div>
              <span className="font-bold text-[10px] md:text-xs text-center uppercase tracking-widest leading-tight">
                {fixture.homeTeam.name}
              </span>
              {(fixture.homeScore !== null) && (
                <span className={`font-display text-2xl md:text-3xl font-bold text-foreground mt-1 ${isLive ? 'live-score' : ''}`}>
                  {fixture.homeScore}
                </span>
              )}
            </motion.div>

            {/* Center Info */}
            <div className="flex flex-col items-center justify-center w-1/3">
              <motion.span variants={vsVariants} className="text-sm md:text-base text-muted-foreground font-display tracking-widest">
                VS
              </motion.span>
              {isLive && fixture.elapsed && (
                <span className="text-red-500 font-bold text-xs mt-2 minute-flip">
                  <span className="minute-flip-inner block">{fixture.elapsed}'</span>
                </span>
              )}
              {isFinished && (
                <span className="text-muted-foreground font-bold text-[10px] uppercase mt-2">
                  ENDED
                </span>
              )}
            </div>

            {/* Away Team */}
            <motion.div variants={awayTeamVariants} className="flex flex-col items-center gap-2 w-1/3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-background border border-border p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={getTeamLogo(fixture.awayTeam)}
                  alt={fixture.awayTeam.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (fixture.awayTeam.code) {
                      img.src = `https://flagcdn.com/w80/${fixture.awayTeam.code.toLowerCase()}.png`;
                    } else {
                      img.style.display = "none";
                    }
                  }}
                />
              </div>
              <span className="font-bold text-[10px] md:text-xs text-center uppercase tracking-widest leading-tight">
                {fixture.awayTeam.name}
              </span>
              {(fixture.awayScore !== null) && (
                <span className={`font-display text-2xl md:text-3xl font-bold text-foreground mt-1 ${isLive ? 'live-score' : ''}`}>
                  {fixture.awayScore}
                </span>
              )}
            </motion.div>
          </div>

          {/* Footer: Group or Stadium */}
          <div className="text-center mt-2 z-10">
            <span className="text-[10px] text-muted-foreground tracking-wider">
              {fixture.venue ? fixture.venue : (fixture.group || fixture.round)}
            </span>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
