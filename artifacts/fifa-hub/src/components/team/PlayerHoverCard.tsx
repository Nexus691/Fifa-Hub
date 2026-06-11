import React from "react";
import type { TeamLineupPlayer } from "@workspace/api-client-react";
import { Shirt } from "lucide-react";

// Map position codes to readable labels
const POS_LABELS: Record<string, string> = {
  GK: 'Goalkeeper',
  LB: 'Left Back',
  CB: 'Centre Back',
  RB: 'Right Back',
  DEF: 'Defender',
  CDM: 'Defensive Mid',
  CM: 'Central Mid',
  CAM: 'Attacking Mid',
  MID: 'Midfielder',
  LW: 'Left Wing',
  RW: 'Right Wing',
  ST: 'Striker',
  FWD: 'Forward',
};

// Position badge colors
const POS_COLORS: Record<string, string> = {
  GK: 'bg-amber-500/20 text-amber-400',
  LB: 'bg-blue-500/20 text-blue-400',
  CB: 'bg-blue-500/20 text-blue-400',
  RB: 'bg-blue-500/20 text-blue-400',
  DEF: 'bg-blue-500/20 text-blue-400',
  CDM: 'bg-green-500/20 text-green-400',
  CM: 'bg-green-500/20 text-green-400',
  CAM: 'bg-green-500/20 text-green-400',
  MID: 'bg-green-500/20 text-green-400',
  LW: 'bg-red-500/20 text-red-400',
  RW: 'bg-red-500/20 text-red-400',
  ST: 'bg-red-500/20 text-red-400',
  FWD: 'bg-red-500/20 text-red-400',
};

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function PlayerHoverCard({
  player,
}: {
  player: TeamLineupPlayer;
}) {
  const [isHovered, setIsHovered] = useState(false);
  // Determine placement based on x, y to avoid clipping.
  // Pitch goes x: 0 (left) to 100 (right), y: 0 (top/away) to 100 (bottom/home).
  // If player is on the left side (x < 30), show card on the right.
  // If player is on the right side (x > 70), show card on the left.
  // If player is near the top (y < 30), show card below.
  // Else show above.
  let placementClass = "bottom-full mb-2 left-1/2 -translate-x-1/2 origin-bottom"; // default top center

  if (player.x! > 60) {
    placementClass = "left-full ml-2 top-1/2 -translate-y-1/2 origin-left"; // right
  } else if (player.x! < 40) {
    placementClass = "right-full mr-2 top-1/2 -translate-y-1/2 origin-right"; // left
  } else if (player.y! < 30) {
    placementClass = "top-full mt-2 left-1/2 -translate-x-1/2 origin-top"; // bottom
  }

  return (
    <div 
      className="group relative z-10 flex flex-col items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Player Marker */}
      <div className="relative flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-[1.15] hover:z-50">
        <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          <Shirt className="w-full h-full text-black fill-black transition-colors duration-300 group-hover:fill-[#D4AF37] group-hover:text-[#D4AF37]" strokeWidth={1} />
          <span className="absolute text-[#D4AF37] font-bold text-[10px] md:text-xs transition-colors duration-300 group-hover:text-black">
            {player.number}
          </span>
        </div>
        <div className="mt-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] md:text-[10px] text-white font-semibold tracking-wider whitespace-nowrap transition-colors group-hover:text-[#D4AF37]">
          {player.name}
        </div>
      </div>

      {/* Hover Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 8,
              filter: 'blur(4px)'
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                duration: 0.25,
                ease: [0.34, 1.56, 0.64, 1]  // spring overshoot
              }
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 4,
              transition: { duration: 0.15, ease: 'easeIn' }
            }}
            className={`absolute ${placementClass} w-64 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-4 pointer-events-none z-50`}
          >
            {/* Top Section */}
            <div className="flex gap-3 border-b border-border/50 pb-3 mb-3">
          {player.photoUrl ? (
            <img
              src={player.photoUrl}
              alt={player.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 bg-muted"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted border-2 border-primary/20" />
          )}
          <div>
            <h4 className="font-bold text-sm text-foreground leading-tight">
              {player.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${POS_COLORS[player.position] || 'bg-muted text-muted-foreground'}`}>
                {player.position}
              </span>
              {' '}#{player.number} • Age {player.age || "??"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {POS_LABELS[player.position] || player.position}
            </p>
            {player.club && player.club !== 'Real Data' && (
              <p className="text-xs font-medium text-foreground mt-0.5">
                {player.club}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {player.statusBadge && (
          <div className="mb-3">
            <span className="inline-block px-2 py-0.5 rounded bg-muted text-[10px] font-semibold">
              {player.statusBadge}
            </span>
          </div>
        )}

        {/* Middle Section - National Team */}
        <div className="mb-3">
          <h5 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-bold">
            National Team
          </h5>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Caps</span>
              <span className="font-medium">{player.nationalStats?.caps || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Goals</span>
              <span className="font-medium">{player.nationalStats?.goals || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assists</span>
              <span className="font-medium">{player.nationalStats?.assists || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Debut</span>
              <span className="font-medium">{player.nationalStats?.debut || "—"}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section - World Cup Stats */}
        <div className="bg-muted/50 -mx-4 -mb-4 p-4 rounded-b-xl border-t border-border/50">
          <h5 className="text-[10px] uppercase tracking-widest text-primary mb-1.5 font-bold">
            World Cup 2026
          </h5>
          {(player.tournamentStats?.appearances || player.tournamentStats?.goals) ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Appearances</span>
                <span className="font-medium">{player.tournamentStats?.appearances || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Goals</span>
                <span className="font-medium">{player.tournamentStats?.goals || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assists</span>
                <span className="font-medium">{player.tournamentStats?.assists || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium text-primary">{player.tournamentStats?.rating ? player.tournamentStats.rating.toFixed(1) : "—"}</span>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground italic">Stats update live once tournament matches begin ⚡</p>
          )}
        </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
