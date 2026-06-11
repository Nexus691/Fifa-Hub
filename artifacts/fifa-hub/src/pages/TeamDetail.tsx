import React from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useGetTeam } from "@workspace/api-client-react";

import { TeamHero } from "@/components/team/TeamHero";
import { TeamSnapshot } from "@/components/team/TeamSnapshot";
import { TeamFixturesTimeline } from "@/components/team/TeamFixturesTimeline";
import { TeamLineup } from "@/components/team/TeamLineup";
import { TeamHistory } from "@/components/team/TeamHistory";
import { TeamInsights } from "@/components/team/TeamInsights";

export default function TeamDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const { data: team, isLoading, isError } = useGetTeam(id, {
    query: { enabled: !!id, queryKey: ["/teams", id] },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-pulse">
        <div className="h-64 bg-card/50 rounded-2xl" />
        <div className="h-32 bg-card/50 rounded-xl" />
        <div className="h-96 bg-card/50 rounded-xl" />
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg">Team not found</p>
        <Link href="/teams" className="text-primary text-sm mt-2 inline-block hover:underline">
          Back to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      <Link
        href="/teams"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </Link>

      <div className="space-y-16">
        {/* 1. Hero Section */}
        <TeamHero team={team} />

        {/* 2. Tournament Snapshot */}
        <TeamSnapshot team={team} />

        <div className="w-full h-px bg-border/50" />

        {/* 3. Upcoming Fixtures */}
        <TeamFixturesTimeline team={team} />

        <div className="w-full h-px bg-border/50" />

        {/* 4. Most Recent Lineup */}
        <TeamLineup team={team} />

        <div className="w-full h-px bg-border/50" />

        {/* 5. World Cup History */}
        <TeamHistory team={team} />

        <div className="w-full h-px bg-border/50" />

        {/* 6. Team Insights & Related News */}
        <TeamInsights team={team} />
      </div>
    </div>
  );
}
