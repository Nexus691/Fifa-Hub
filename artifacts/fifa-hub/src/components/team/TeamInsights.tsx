import React from "react";
import type { TeamDetail, TeamInsight, NewsArticle } from "@workspace/api-client-react";
import { Info, Newspaper, Trophy, Globe, Users, TrendingUp, Lightbulb, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  "Historical": <Trophy className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />,
  "Qualification": <Globe className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
  "Squad": <Users className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
  "FIFA Ranking": <TrendingUp className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />,
  "Did You Know?": <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
  "default": <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
};

export function TeamInsights({ team }: { team: TeamDetail }) {
  const insights: TeamInsight[] = team.insights || [];
  const news: NewsArticle[] = team.news || [];

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Insights Column */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl uppercase tracking-widest text-primary">Team Insights</h2>
          
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} className="flex gap-4 bg-primary/5 border border-primary/20 p-5 rounded-xl items-start transition-colors hover:bg-primary/10">
                  {INSIGHT_ICONS[insight.category] || INSIGHT_ICONS.default}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{insight.category}</h4>
                    <p className="text-sm leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground italic text-sm">No insights available for this team.</p>
            )}
          </div>
        </div>

        {/* News Column */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl uppercase tracking-widest text-primary flex items-center gap-2">
            Related News <Newspaper className="w-5 h-5" />
          </h2>
          
          <div className="space-y-3">
            {news.length > 0 ? (
              news.map((item, idx) => (
                <a 
                  key={idx}
                  href={item.url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-card hover:bg-muted/50 transition-all border border-border p-4 rounded-xl group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold mb-1.5 group-hover:text-primary transition-colors pr-6">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center gap-3 mt-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded text-foreground">{item.source || "FIFA News"}</span>
                        <span>{item.publishedAt ? format(parseISO(item.publishedAt), "MMM d, yyyy") : ""}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all absolute top-4 right-4" />
                  </div>
                </a>
              ))
            ) : (
              <p className="text-muted-foreground italic text-sm">No recent news available.</p>
            )}
          </div>

          {/* Confederation Info Card */}
          <div className="mt-8 p-6 bg-card border-l-4 border-l-primary border border-border rounded-r-xl">
            <h3 className="font-display uppercase tracking-widest text-lg mb-2">{team.confederation || "Confederation"}</h3>
            <p className="text-sm text-muted-foreground mb-4">Official governing body representing {team.name} in FIFA.</p>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
              <span className="bg-muted px-2 py-1 rounded">Founded: 1961</span>
              <span className="bg-muted px-2 py-1 rounded">Member Nations: 41</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
