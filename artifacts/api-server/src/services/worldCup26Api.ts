import axios from "axios";
import { logger } from "../lib/logger";

const BASE_URL = "https://worldcup26.ir";

const cache = new Map<string, { data: unknown; ts: number }>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

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
  timeout: 15000,
});

// ---------- Raw API types ----------

export interface WC26Team {
  _id: string;
  id: string;
  name_en: string;
  name_fa: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

export interface WC26Game {
  _id: string;
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_scorers: string;
  away_scorers: string;
  group: string;
  matchday: string;
  local_date: string;        // "06/11/2026 13:00" (MM/DD/YYYY HH:mm, US Eastern)
  persian_date: string;
  stadium_id: string;
  finished: string;           // "TRUE" or "FALSE"
  time_elapsed: string;       // "notstarted", "finished", minute number, etc.
  type: string;               // "group", "r16", "qf", "sf", "third", "final"
  home_team_name_en?: string;
  home_team_name_fa?: string;
  away_team_name_en?: string;
  away_team_name_fa?: string;
  home_team_label?: string;   // For knockout: "Winner Match 85"
  away_team_label?: string;
}

export interface WC26GroupTeam {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

export interface WC26Group {
  _id: string;
  name: string;
  teams: WC26GroupTeam[];
}

export interface WC26Stadium {
  _id: string;
  id: string;
  name_en: string;
  name_fa: string;
  fifa_name: string;
  city_en: string;
  city_fa: string;
  country_en: string;
  country_fa: string;
  capacity: number;
  region: string;
}

// ---------- Fetch coalescing and queuing ----------

let activeRequest = Promise.resolve();
async function queuedGet<T>(url: string): Promise<T> {
  const current = activeRequest;
  let resolveNext!: () => void;
  const next = new Promise<void>((resolve) => { resolveNext = resolve; });
  activeRequest = current.then(() => next).catch(() => next);
  
  await current.catch(() => {});
  try {
    const res = await api.get<T>(url);
    return res.data;
  } finally {
    resolveNext();
  }
}

const pendingRequests = new Map<string, Promise<any>>();

function coalescedFetch<T>(key: string, url: string, fallback: T): Promise<T> {
  const cached = getCached<T>(key);
  if (cached) return Promise.resolve(cached);

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  const promise = (async () => {
    try {
      const data = await queuedGet<any>(url);
      const result = data[key.split("-")[1]] ?? fallback;
      setCached(key, result);
      return result;
    } catch (err) {
      logger.error({ err }, `${key} fetch failed`);
      return fallback;
    } finally {
      pendingRequests.delete(key);
    }
  })();
  
  pendingRequests.set(key, promise);
  return promise;
}

// ---------- Fetch functions ----------

export async function fetchAllTeams(): Promise<WC26Team[]> {
  return coalescedFetch<WC26Team[]>("wc26-teams", "/get/teams", []);
}

export async function fetchAllGames(): Promise<WC26Game[]> {
  return coalescedFetch<WC26Game[]>("wc26-games", "/get/games", []);
}

export async function fetchAllGroups(): Promise<WC26Group[]> {
  return coalescedFetch<WC26Group[]>("wc26-groups", "/get/groups", []);
}

export async function fetchAllStadiums(): Promise<WC26Stadium[]> {
  return coalescedFetch<WC26Stadium[]>("wc26-stadiums", "/get/stadiums", []);
}

// ---------- Helpers ----------

/** Build a team lookup map: team_id -> WC26Team */
export async function getTeamMap(): Promise<Map<string, WC26Team>> {
  const teams = await fetchAllTeams();
  const map = new Map<string, WC26Team>();
  for (const t of teams) {
    map.set(t.id, t);
  }
  return map;
}

/** Build a stadium lookup map: stadium_id -> WC26Stadium */
export async function getStadiumMap(): Promise<Map<string, WC26Stadium>> {
  const stadiums = await fetchAllStadiums();
  const map = new Map<string, WC26Stadium>();
  for (const s of stadiums) {
    map.set(s.id, s);
  }
  return map;
}

/**
 * Parse WC26 local_date "MM/DD/YYYY HH:mm" into ISO string.
 * The WC26 API dates are US Eastern local times.
 * We convert them to a rough UTC by adding 4 hours (EDT offset).
 */
export function parseWC26Date(localDate: string): string {
  // "06/11/2026 13:00" -> Date
  const [datePart, timePart] = localDate.split(" ");
  if (!datePart || !timePart) return new Date().toISOString();
  const [month, day, year] = datePart.split("/");
  const [hour, minute] = timePart.split(":");
  // Create as UTC, adding 4 hours for EDT -> UTC conversion
  const utcHour = parseInt(hour!, 10) + 4;
  const d = new Date(Date.UTC(
    parseInt(year!, 10),
    parseInt(month!, 10) - 1,
    parseInt(day!, 10),
    utcHour,
    parseInt(minute!, 10),
  ));
  return d.toISOString();
}

/** Map game status to a short code the frontend understands */
export function mapStatus(game: WC26Game): { long: string; short: string; elapsedMinutes?: number } {
  if (game.finished === "TRUE") {
    return { long: "Match Finished", short: "FT" };
  }

  // Simulate live match status based on real-time clock
  const kickoffTime = new Date(parseWC26Date(game.local_date)).getTime();
  const now = Date.now();
  const diffMs = now - kickoffTime;

  if (diffMs >= 0) {
    const elapsedMinutes = Math.floor(diffMs / (60 * 1000));
    
    // First Half: 0-45 mins
    if (elapsedMinutes <= 45) {
      return { long: "First Half", short: "1H", elapsedMinutes };
    }
    // Halftime: 45-60 mins
    if (elapsedMinutes > 45 && Math.floor(diffMs / (60 * 1000)) <= 60) {
      return { long: "Halftime", short: "HT", elapsedMinutes: 45 };
    }
    // Second Half: 60-105 mins (45 mins + 15 min HT)
    if (elapsedMinutes > 60 && elapsedMinutes <= 105) {
      return { long: "Second Half", short: "2H", elapsedMinutes: elapsedMinutes - 15 };
    }
    // Finished: >105 mins
    return { long: "Match Finished", short: "FT" };
  }

  return { long: "Not Started", short: "NS" };
}

/** Map group code for display */
export function mapGroupLabel(group: string): string | null {
  // Single letter groups -> "Group A", etc.
  if (/^[A-L]$/i.test(group)) return `Group ${group}`;
  // Knockout rounds
  const labels: Record<string, string> = {
    R32: "Round of 32",
    R16: "Round of 16",
    QF: "Quarter-final",
    SF: "Semi-final",
    "3RD": "Third Place",
    FINAL: "Final",
  };
  return labels[group] ?? group;
}

/** Map knockout round code for display */
export function mapRound(type: string): string | null {
  const labels: Record<string, string> = {
    group: "Group Stage",
    r32: "Round of 32",
    r16: "Round of 16",
    qf: "Quarter-final",
    sf: "Semi-final",
    third: "Third Place",
    final: "Final",
  };
  return labels[type] ?? null;
}
