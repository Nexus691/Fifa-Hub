import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Newspaper, ExternalLink } from "lucide-react";
import { useGetNews } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { 
  hidden: { opacity: 0, y: 40, rotateX: 12 }, 
  show: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', damping: 24 } } 
};

const TEAM_FILTERS = ["Argentina", "Brazil", "France", "England", "Spain", "Germany", "Portugal", "USA"];

// High-quality mock data per Master Spec (used if live API fails or returns 0 results)
const MOCK_NEWS = [
  {
    title: "USMNT to be 'tightened up' following recent defensive mistakes",
    description: "The U.S. men's national team delivered some positive moments in recent friendlies against Senegal and Germany, but also endured some rough ones that exposed tactical vulnerabilities.",
    source: "SBI Soccer",
    sourceColor: "#0066CC",
    imageColor: "#1a2a3a",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    urlToImage: null,
    isTopStory: true,
  },
  {
    title: "Mbappé declares France 'ready to defend the crown' in 2026",
    description: "Speaking at the Clairefontaine training base, the French captain warned rivals that the team is more united than ever despite recent injury setbacks in midfield.",
    source: "L'Equipe",
    sourceColor: "#D10000",
    imageColor: "#2a1a1a",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    urlToImage: null,
  },
  {
    title: "Somali referee dropped from World Cup after US visa denial",
    description: "Africa's top referee will not be allowed to officiate at the World Cup after he was refused entry to the USA, FIFA has confirmed this morning.",
    source: "Sky Sports",
    sourceColor: "#001166",
    imageColor: "#1a1a2a",
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    urlToImage: null,
  },
  {
    title: "Argentina's Scaloni hints at tactical shift for opening match",
    description: "The defending champions might deploy a surprising 3-5-2 formation against Poland in Group E, according to reports from their closed-door training session.",
    source: "Ole",
    sourceColor: "#0099FF",
    imageColor: "#1a2530",
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    urlToImage: null,
  },
  {
    title: "Brazil fans arrive in thousands ahead of Group C opener",
    description: "The streets of Los Angeles are turning yellow and green as the Seleção supporters establish their massive fan zones before the clash with Morocco.",
    source: "Globo Esporte",
    sourceColor: "#009B3A",
    imageColor: "#1a3020",
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    urlToImage: null,
  },
  {
    title: "Injury blow for England as key defender withdraws from squad",
    description: "Gareth Southgate will have to reshuffle his backline after a training ground collision ruled out a guaranteed starter for the group stages.",
    source: "BBC Sport",
    sourceColor: "#BB1919",
    imageColor: "#301a1a",
    publishedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    urlToImage: null,
  }
];

export default function News() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [teamFilter, setTeamFilter] = useState("");

  const query = teamFilter || search || undefined;
  const { data, isLoading } = useGetNews({ team: query, page });
  
  // Use live data if available, otherwise fall back to Master Spec mock data
  let articles = Array.isArray(data?.articles) && data.articles.length > 0 
    ? data.articles 
    : MOCK_NEWS;

  // Filter mock data locally if using mocks
  if (articles === MOCK_NEWS && query) {
    articles = articles.filter(a => 
      a.title.toLowerCase().includes(query.toLowerCase()) || 
      a.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get source color hash for live articles
  const getSourceColor = (source: string) => {
    const colors = ["#BB1919", "#0066CC", "#009B3A", "#D10000", "#FF6600", "#660099"];
    let hash = 0;
    for (let i = 0; i < source.length; i++) hash = source.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="news-page-bg container mx-auto px-4 py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl tracking-widest mb-1 text-primary">FIFA NEWS</h1>
        <p className="text-muted-foreground text-sm">Latest World Cup 2026 updates and headlines</p>
      </motion.div>

      {/* Search + Team Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-testid="input-search-news"
            type="search"
            placeholder="Search news..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setTeamFilter(""); setPage(1); }}
            className="w-full bg-card border border-border rounded-md py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            onClick={() => { setTeamFilter(""); setSearch(""); setPage(1); }}
            className={`filter-chip relative overflow-hidden px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors z-[1] ${!teamFilter && !search ? "active bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}
          >
            All
          </button>
          {TEAM_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => { setTeamFilter(teamFilter === t ? "" : t); setSearch(""); setPage(1); }}
              className={`filter-chip relative overflow-hidden px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors z-[1] ${teamFilter === t ? "active bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      {isLoading ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`rounded-xl bg-card/50 animate-pulse ${i % 2 === 0 ? 'h-72' : 'h-60'} break-inside-avoid`} />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <>
          <motion.div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '50px' }}>
            {articles.map((article: any, i: number) => {
              const sourceColor = article.sourceColor || getSourceColor(article.source);
              const imageBg = article.imageColor || "#1a1a1a";
              
              return (
                <motion.a
                  key={i}
                  href={article.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`article-card-${i}`}
                  variants={item}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all flex flex-col break-inside-avoid shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div 
                    className="relative bg-muted overflow-hidden border-b border-border"
                    style={{ backgroundColor: imageBg, height: i % 3 === 0 ? '220px' : '160px' }}
                  >
                    {/* Gradient Overlay for Image Color */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    
                    {article.urlToImage ? (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        onError={(e) => {
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center opacity-10"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <Newspaper className="w-16 h-16" />
                      </div>
                    )}
                    
                    {/* Top Story Badge */}
                    {article.isTopStory && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest shadow-md">
                          Top Story
                        </span>
                      </div>
                    )}
                    
                    {/* Source Badge */}
                    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
                      <span 
                        className="text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm"
                        style={{ backgroundColor: sourceColor }}
                      >
                        {article.source}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col gap-3 bg-[#121212]">
                    <h3 className="text-base font-bold leading-snug group-hover:text-primary transition-colors text-[#F5F5F5]">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-[13px] text-[#9CA3AF] line-clamp-3 leading-relaxed">
                        {article.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] mt-auto pt-3 border-t border-[#2A2A2A]">
                      <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              data-testid="button-prev-page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-card border border-border rounded-md text-sm font-semibold disabled:opacity-40 hover:border-primary/50 transition-colors"
            >
              Previous
            </button>
            <span className="flex items-center text-sm text-muted-foreground px-2">Page {page}</span>
            <button
              data-testid="button-next-page"
              onClick={() => setPage((p) => p + 1)}
              disabled={articles.length < 20}
              className="px-4 py-2 bg-card border border-border rounded-md text-sm font-semibold disabled:opacity-40 hover:border-primary/50 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No articles found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </div>
      )}
    </div>
  );
}
