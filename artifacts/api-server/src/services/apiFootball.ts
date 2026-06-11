import axios from "axios";
import { logger } from "../lib/logger";

const BASE_URL = "https://v3.football.api-sports.io";
const LEAGUE_ID = 1; // FIFA World Cup
const SEASON = 2026;

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
  headers: {
    "x-apisports-key": process.env.API_FOOTBALL_KEY ?? "",
  },
  timeout: 10000,
});

export interface ApiTeam {
  id: number;
  name: string;
  logo: string;
  code?: string | null;
  country?: string | null;
}

export interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { long: string; short: string; elapsed?: number | null };
    venue: { name?: string | null; city?: string | null };
  };
  league: {
    id: number;
    name: string;
    round: string;
    group?: string | null;
  };
  teams: {
    home: ApiTeam;
    away: ApiTeam;
  };
  goals: { home: number | null; away: number | null };
}

export interface ApiEvent {
  time: { elapsed: number | null };
  team: ApiTeam;
  player: { name: string | null };
  assist: { name: string | null };
  type: string;
  detail: string;
}

export interface ApiLineupPlayer {
  player: { id: number; name: string; number: number; pos: string; grid?: string | null };
}

export interface ApiLineup {
  team: ApiTeam;
  formation: string;
  startXI: ApiLineupPlayer[];
  substitutes: ApiLineupPlayer[];
}

export interface ApiStatValue {
  type: string;
  value: string | number | null;
}

export interface ApiStatistic {
  team: ApiTeam;
  statistics: ApiStatValue[];
}

export interface ApiStandingRow {
  rank: number;
  team: ApiTeam;
  points: number;
  goalsDiff: number;
  group: string;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

export interface ApiPlayer {
  player: {
    id: number;
    name: string;
    age: number | null;
    photo?: string | null;
  };
  statistics: Array<{
    games: { number?: number | null; position?: string | null };
  }>;
}

async function apiFetch<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const key = path + JSON.stringify(params ?? {});
  const cached = getCached<T>(key);
  if (cached) return cached;

  try {
    const res = await api.get<{ response: T }>(path, { params });
    const data = res.data.response;
    setCached(key, data);
    return data;
  } catch (err) {
    logger.error({ err, path }, "API-Football request failed");
    throw err;
  }
}

export async function fetchFixtures(filters: {
  group?: string;
  team?: string;
  date?: string;
  status?: string;
} = {}): Promise<ApiFixture[]> {
  const params: Record<string, unknown> = { league: LEAGUE_ID, season: SEASON };
  if (filters.date) params["date"] = filters.date;
  if (filters.status) params["status"] = filters.status;
  if (filters.team) {
    const teams = await fetchTeams();
    const match = teams.find((t) =>
      t.team.name.toLowerCase().includes(filters.team!.toLowerCase())
    );
    if (match) params["team"] = match.team.id;
  }

  const fixtures = await apiFetch<ApiFixture[]>("/fixtures", params);

  if (filters.group) {
    return fixtures.filter((f) =>
      f.league.group?.toLowerCase().includes(filters.group!.toLowerCase())
    );
  }
  return fixtures;
}

export async function fetchFixtureById(id: string): Promise<{
  fixture: ApiFixture;
  events: ApiEvent[];
  lineups: ApiLineup[];
  statistics: ApiStatistic[];
} | null> {
  const [fixtures, events, lineups, statistics] = await Promise.all([
    apiFetch<ApiFixture[]>("/fixtures", { id }),
    apiFetch<ApiEvent[]>("/fixtures/events", { fixture: id }),
    apiFetch<ApiLineup[]>("/fixtures/lineups", { fixture: id }),
    apiFetch<ApiStatistic[]>("/fixtures/statistics", { fixture: id }),
  ]);

  if (!fixtures || fixtures.length === 0) return null;
  return { fixture: fixtures[0]!, events, lineups, statistics };
}

export async function fetchTeams(): Promise<Array<{ team: ApiTeam; group?: string }>> {
  const key = `teams-${LEAGUE_ID}-${SEASON}`;
  const cached = getCached<Array<{ team: ApiTeam; group?: string }>>(key);
  if (cached) return cached;

  try {
    const standings = await apiFetch<ApiStandingRow[][]>("/standings", {
      league: LEAGUE_ID,
      season: SEASON,
    });

    const teams: Array<{ team: ApiTeam; group?: string }> = [];
    const seen = new Set<number>();
    for (const group of standings) {
      for (const row of group) {
        if (!seen.has(row.team.id)) {
          seen.add(row.team.id);
          teams.push({ team: row.team, group: row.group });
        }
      }
    }

    if (teams.length > 0) {
      setCached(key, teams);
      return teams;
    }
  } catch (_err) {
    logger.warn("Standings-based team fetch failed, falling back to fixtures");
  }

  const fixtures = await apiFetch<ApiFixture[]>("/fixtures", {
    league: LEAGUE_ID,
    season: SEASON,
  });
  const teamsMap = new Map<number, { team: ApiTeam; group?: string }>();
  for (const f of fixtures) {
    teamsMap.set(f.teams.home.id, { team: f.teams.home, group: f.league.group ?? undefined });
    teamsMap.set(f.teams.away.id, { team: f.teams.away, group: f.league.group ?? undefined });
  }
  const result = Array.from(teamsMap.values());
  setCached(key, result);
  return result;
}

export async function fetchTeamById(id: string): Promise<{
  team: ApiTeam;
  group?: string;
  coach?: string;
  founded?: number;
  venue?: string;
  players: ApiPlayer[];
  fixtures: ApiFixture[];
} | null> {
  const teamId = parseInt(id, 10);
  if (isNaN(teamId)) return null;

  const [teamInfoResp, squadResp, fixturesResp, standingsResp] = await Promise.all([
    apiFetch<Array<{ team: { id: number; name: string; logo: string; code?: string; country?: string; founded?: number }; venue: { name?: string } }>>("/teams", { id: teamId }),
    apiFetch<Array<{ player: ApiPlayer["player"]; statistics: ApiPlayer["statistics"] }>>("/players/squads", { team: teamId }),
    apiFetch<ApiFixture[]>("/fixtures", { team: teamId, league: LEAGUE_ID, season: SEASON }),
    apiFetch<ApiStandingRow[][]>("/standings", { league: LEAGUE_ID, season: SEASON }).catch(() => [] as ApiStandingRow[][]),
  ]);

  if (!teamInfoResp || teamInfoResp.length === 0) return null;
  const info = teamInfoResp[0]!;

  let group: string | undefined;
  let coach: string | undefined;
  for (const g of standingsResp) {
    for (const row of g) {
      if (row.team.id === teamId) {
        group = row.group;
      }
    }
  }

  try {
    const coachResp = await apiFetch<Array<{ name: string; career: Array<{ team: ApiTeam }> }>>("/coachs", { team: teamId });
    const current = coachResp.find((c) =>
      c.career.some((career) => career.team.id === teamId)
    );
    if (current) coach = current.name;
  } catch (_e) {
    // Coach data optional
  }

  const players: ApiPlayer[] = (squadResp ?? []).map((p) => ({
    player: p.player,
    statistics: p.statistics ?? [],
  }));

  return {
    team: info.team,
    group,
    coach,
    founded: info.team.founded,
    venue: info.venue?.name,
    players,
    fixtures: fixturesResp ?? [],
  };
}

export async function fetchStandings(): Promise<ApiStandingRow[][]> {
  return apiFetch<ApiStandingRow[][]>("/standings", {
    league: LEAGUE_ID,
    season: SEASON,
  });
}
