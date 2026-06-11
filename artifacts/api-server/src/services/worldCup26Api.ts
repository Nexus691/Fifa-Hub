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

// ---------- Fetch functions ----------

export async function fetchAllTeams(): Promise<WC26Team[]> {
  const key = "wc26-teams";
  const cached = getCached<WC26Team[]>(key);
  if (cached) return cached;

  try {
    const res = await api.get<{ teams: WC26Team[] }>("/get/teams");
    const teams = res.data.teams ?? [];
    setCached(key, teams);
    return teams;
  } catch (err) {
    logger.error({ err }, "WC26 teams fetch failed");
    return [];
  }
}

export async function fetchAllGames(): Promise<WC26Game[]> {
  const key = "wc26-games";
  const cached = getCached<WC26Game[]>(key);
  if (cached) return cached;

  try {
    const res = await api.get<{ games: WC26Game[] }>("/get/games");
    const games = res.data.games ?? [];
    setCached(key, games);
    return games;
  } catch (err) {
    logger.error({ err }, "WC26 games fetch failed");
    return [];
  }
}

export async function fetchAllGroups(): Promise<WC26Group[]> {
  const key = "wc26-groups";
  const cached = getCached<WC26Group[]>(key);
  if (cached) return cached;

  try {
    const res = await api.get<{ groups: WC26Group[] }>("/get/groups");
    const groups = res.data.groups ?? [];
    setCached(key, groups);
    return groups;
  } catch (err) {
    logger.error({ err }, "WC26 groups fetch failed");
    return [];
  }
}

export async function fetchAllStadiums(): Promise<WC26Stadium[]> {
  const key = "wc26-stadiums";
  const cached = getCached<WC26Stadium[]>(key);
  if (cached) return cached;

  try {
    const res = await api.get<{ stadiums: WC26Stadium[] }>("/get/stadiums");
    const stadiums = res.data.stadiums ?? [];
    setCached(key, stadiums);
    return stadiums;
  } catch (err) {
    logger.error({ err }, "WC26 stadiums fetch failed");
    return [];
  }
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
export function mapStatus(game: WC26Game): { long: string; short: string } {
  if (game.finished === "TRUE") {
    return { long: "Match Finished", short: "FT" };
  }
  if (game.time_elapsed === "notstarted") {
    return { long: "Not Started", short: "NS" };
  }
  if (game.time_elapsed === "halftime") {
    return { long: "Halftime", short: "HT" };
  }
  // Could be a minute number if live
  const elapsed = parseInt(game.time_elapsed, 10);
  if (!isNaN(elapsed)) {
    if (elapsed <= 45) return { long: "First Half", short: "1H" };
    return { long: "Second Half", short: "2H" };
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
