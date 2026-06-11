import axios from "axios";
import { logger } from "../lib/logger";

const BASE_URL = "https://newsapi.org/v2";
const cache = new Map<string, { data: unknown; ts: number }>();
const TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < TTL_MS) {
    return entry.data as T;
  }
  return null;
}

function setCached(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string | null;
  urlToImage: string | null;
  publishedAt: string;
  source: string;
  author: string | null;
}

export async function fetchNews(team?: string, page = 1): Promise<{ articles: NewsArticle[]; totalResults: number }> {
  const query = team
    ? `FIFA World Cup 2026 ${team}`
    : "FIFA World Cup 2026";
  const cacheKey = `news-${query}-${page}`;
  const cached = getCached<{ articles: NewsArticle[]; totalResults: number }>(cacheKey);
  if (cached) return cached;

  try {
    const res = await api.get<{
      totalResults: number;
      articles: Array<{
        title: string;
        description: string | null;
        url: string | null;
        urlToImage: string | null;
        publishedAt: string;
        source: { name: string };
        author: string | null;
      }>;
    }>("/everything", {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 20,
        page,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = (res.data.articles ?? [])
      .filter((a) => a.title && a.title !== "[Removed]")
      .map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        urlToImage: a.urlToImage,
        publishedAt: a.publishedAt,
        source: a.source.name,
        author: a.author,
      }));

    const result = { articles, totalResults: res.data.totalResults };
    setCached(cacheKey, result);
    return result;
  } catch (err) {
    logger.error({ err }, "NewsAPI request failed");
    return { articles: [], totalResults: 0 };
  }
}
