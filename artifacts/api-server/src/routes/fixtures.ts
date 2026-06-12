import { Router, type IRouter } from "express";
import {
  fetchAllGames,
  getTeamMap,
  getStadiumMap,
  parseWC26Date,
  mapStatus,
  mapGroupLabel,
  mapRound,
  type WC26Game,
  type WC26Team,
  type WC26Stadium,
} from "../services/worldCup26Api";
import fs from "fs";
import path from "path";

const rankingsPath = path.resolve(process.cwd(), "src/data/fifa_rankings.json");
const fifaRankings: Record<string, number> = JSON.parse(fs.readFileSync(rankingsPath, "utf-8"));

const router: IRouter = Router();

function mapTeamFromWC26(team: WC26Team | undefined, fallbackName?: string) {
  if (!team) {
    return {
      id: 0,
      name: fallbackName ?? "TBD",
      logo: "",
      code: null,
      country: null,
      group: null,
      fifaRank: null,
      coach: null,
    };
  }
  return {
    id: parseInt(team.id, 10),
    name: team.name_en,
    logo: team.flag,
    code: team.fifa_code ?? null,
    country: team.name_en,
    group: team.groups ? `Group ${team.groups}` : null,
    fifaRank: fifaRankings[team.name_en] ?? null,
    coach: null,
  };
}

function mapFixture(
  game: WC26Game,
  teamMap: Map<string, WC26Team>,
  stadiumMap: Map<string, WC26Stadium>,
) {
  const homeTeam = teamMap.get(game.home_team_id);
  const awayTeam = teamMap.get(game.away_team_id);
  const stadium = stadiumMap.get(game.stadium_id);
  const status = mapStatus(game);

  // For knockout games without teams assigned yet, use labels
  const homeName = homeTeam?.name_en ?? game.home_team_name_en ?? game.home_team_label ?? "TBD";
  const awayName = awayTeam?.name_en ?? game.away_team_name_en ?? game.away_team_label ?? "TBD";

  return {
    id: parseInt(game.id, 10),
    homeTeam: mapTeamFromWC26(homeTeam, homeName),
    awayTeam: mapTeamFromWC26(awayTeam, awayName),
    date: parseWC26Date(game.local_date),
    status: status.long,
    statusShort: status.short,
    homeScore: status.short !== "NS" ? (isNaN(parseInt(game.home_score, 10)) ? 0 : parseInt(game.home_score, 10)) : null,
    awayScore: status.short !== "NS" ? (isNaN(parseInt(game.away_score, 10)) ? 0 : parseInt(game.away_score, 10)) : null,
    venue: stadium?.name_en ?? null,
    city: stadium?.city_en ?? null,
    capacity: stadium?.capacity ?? null,
    group: mapGroupLabel(game.group),
    round: mapRound(game.type),
    elapsed: status.elapsedMinutes ?? null,
  };
}

router.get("/fixtures", async (req, res) => {
  try {
    const { group, team, date, status } = req.query as Record<string, string | undefined>;
    const [games, teamMap, stadiumMap] = await Promise.all([
      fetchAllGames(),
      getTeamMap(),
      getStadiumMap(),
    ]);

    let filtered = games;

    // Filter by group
    if (group) {
      const groupLetter = group.replace(/^Group\s*/i, "").toUpperCase();
      filtered = filtered.filter((g) => g.group.toUpperCase() === groupLetter);
    }

    // Filter by team name
    if (team) {
      const q = team.toLowerCase();
      filtered = filtered.filter((g) => {
        const homeTeam = teamMap.get(g.home_team_id);
        const awayTeam = teamMap.get(g.away_team_id);
        return (
          homeTeam?.name_en.toLowerCase().includes(q) ||
          awayTeam?.name_en.toLowerCase().includes(q) ||
          g.home_team_name_en?.toLowerCase().includes(q) ||
          g.away_team_name_en?.toLowerCase().includes(q)
        );
      });
    }

    // Filter by date (YYYY-MM-DD)
    if (date) {
      filtered = filtered.filter((g) => {
        const isoDate = parseWC26Date(g.local_date).split("T")[0];
        return isoDate === date;
      });
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter((g) => mapStatus(g).short === status);
    }

    // Sort by date
    filtered.sort(
      (a, b) =>
        new Date(parseWC26Date(a.local_date)).getTime() -
        new Date(parseWC26Date(b.local_date)).getTime(),
    );

    res.json(filtered.map((g) => mapFixture(g, teamMap, stadiumMap)));
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
});

router.get("/fixtures/live", async (_req, res) => {
  try {
    const [games, teamMap, stadiumMap] = await Promise.all([
      fetchAllGames(),
      getTeamMap(),
      getStadiumMap(),
    ]);

    const live = games.filter((g) => {
      const s = mapStatus(g).short;
      return s === "1H" || s === "2H" || s === "HT";
    });

    res.json(live.map((g) => mapFixture(g, teamMap, stadiumMap)));
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch live fixtures" });
  }
});

router.get("/fixtures/upcoming", async (req, res) => {
  try {
    const limit = parseInt((req.query["limit"] as string) ?? "10", 10);
    const [games, teamMap, stadiumMap] = await Promise.all([
      fetchAllGames(),
      getTeamMap(),
      getStadiumMap(),
    ]);

    const upcoming = games
      .filter((g) => mapStatus(g).short === "NS")
      .sort(
        (a, b) =>
          new Date(parseWC26Date(a.local_date)).getTime() -
          new Date(parseWC26Date(b.local_date)).getTime(),
      )
      .slice(0, limit);

    res.json(upcoming.map((g) => mapFixture(g, teamMap, stadiumMap)));
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch upcoming fixtures" });
  }
});

router.get("/fixtures/recent", async (req, res) => {
  try {
    const limit = parseInt((req.query["limit"] as string) ?? "10", 10);
    const [games, teamMap, stadiumMap] = await Promise.all([
      fetchAllGames(),
      getTeamMap(),
      getStadiumMap(),
    ]);

    const recent = games
      .filter((g) => mapStatus(g).short === "FT")
      .sort(
        (a, b) =>
          new Date(parseWC26Date(b.local_date)).getTime() -
          new Date(parseWC26Date(a.local_date)).getTime(),
      )
      .slice(0, limit);

    res.json(recent.map((g) => mapFixture(g, teamMap, stadiumMap)));
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch recent fixtures" });
  }
});

router.get("/fixtures/:id", async (req, res) => {
  try {
    const fixtureId = req.params["id"]!;
    const [games, teamMap, stadiumMap] = await Promise.all([
      fetchAllGames(),
      getTeamMap(),
      getStadiumMap(),
    ]);

    const game = games.find((g) => g.id === fixtureId);
    if (!game) {
      res.status(404).json({ error: "Fixture not found" });
      return;
    }

    const base = mapFixture(game, teamMap, stadiumMap);

    // WC26 API doesn't provide events/lineups/statistics, so return empty arrays
    const detail = {
      ...base,
      events: [],
      lineups: [],
      statistics: [],
    };

    res.json(detail);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch fixture" });
  }
});

export default router;
