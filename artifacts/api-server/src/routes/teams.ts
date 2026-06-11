import { Router, type IRouter } from "express";
import {
  fetchAllTeams,
  fetchAllGames,
  fetchAllGroups,
  getTeamMap,
  getStadiumMap,
  parseWC26Date,
  mapStatus,
  mapGroupLabel,
  mapRound,
  type WC26Team,
  type WC26Game,
  type WC26Stadium,
} from "../services/worldCup26Api";
import fs from "fs";
import path from "path";

const rankingsPath = path.resolve(process.cwd(), "src/data/fifa_rankings.json");
const fifaRankings: Record<string, number> = JSON.parse(fs.readFileSync(rankingsPath, "utf-8"));

const profilesPath = path.resolve(process.cwd(), "src/data/team_profiles.json");
function getTeamProfiles(): Record<string, any> {
  try {
    return JSON.parse(fs.readFileSync(profilesPath, "utf-8"));
  } catch (e) {
    return {};
  }
}

const router: IRouter = Router();

function mapTeamForList(team: WC26Team) {
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

function mapFixtureForTeam(
  game: WC26Game,
  teamMap: Map<string, WC26Team>,
  stadiumMap: Map<string, WC26Stadium>,
) {
  const homeTeam = teamMap.get(game.home_team_id);
  const awayTeam = teamMap.get(game.away_team_id);
  const stadium = stadiumMap.get(game.stadium_id);
  const status = mapStatus(game);

  return {
    id: parseInt(game.id, 10),
    homeTeam: {
      id: homeTeam ? parseInt(homeTeam.id, 10) : 0,
      name: homeTeam?.name_en ?? game.home_team_name_en ?? "TBD",
      logo: homeTeam?.flag ?? "",
      code: homeTeam?.fifa_code ?? null,
      country: homeTeam?.name_en ?? null,
      group: null,
      fifaRank: null,
      coach: null,
    },
    awayTeam: {
      id: awayTeam ? parseInt(awayTeam.id, 10) : 0,
      name: awayTeam?.name_en ?? game.away_team_name_en ?? "TBD",
      logo: awayTeam?.flag ?? "",
      code: awayTeam?.fifa_code ?? null,
      country: awayTeam?.name_en ?? null,
      group: null,
      fifaRank: null,
      coach: null,
    },
    date: parseWC26Date(game.local_date),
    status: status.long,
    statusShort: status.short,
    homeScore: game.finished === "TRUE" ? parseInt(game.home_score, 10) : null,
    awayScore: game.finished === "TRUE" ? parseInt(game.away_score, 10) : null,
    venue: stadium?.name_en ?? null,
    city: stadium?.city_en ?? null,
    group: mapGroupLabel(game.group),
    round: mapRound(game.type),
    elapsed: null,
  };
}

router.get("/teams", async (req, res) => {
  try {
    const { group, search } = req.query as Record<string, string | undefined>;
    let teams = await fetchAllTeams();

    // Filter by group
    if (group) {
      const groupLetter = group.replace(/^Group\s*/i, "").toUpperCase();
      teams = teams.filter((t) => t.groups.toUpperCase() === groupLetter);
    }

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      teams = teams.filter(
        (t) =>
          t.name_en.toLowerCase().includes(q) ||
          t.fifa_code.toLowerCase().includes(q),
      );
    }

    // Sort by group then name
    teams.sort((a, b) => {
      const groupCompare = a.groups.localeCompare(b.groups);
      if (groupCompare !== 0) return groupCompare;
      return a.name_en.localeCompare(b.name_en);
    });

    res.json(teams.map(mapTeamForList));
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.get("/teams/:id", async (req, res) => {
  try {
    const teamId = req.params["id"]!;
    const [teams, games, groups, teamMap, stadiumMap] = await Promise.all([
      fetchAllTeams(),
      fetchAllGames(),
      fetchAllGroups(),
      getTeamMap(),
      getStadiumMap(),
    ]);

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    // Find team's group standings
    const teamGroup = groups.find((g) => g.name === team.groups);
    const groupTeamStats = teamGroup?.teams.find((t) => t.team_id === teamId);

    // Find team's fixtures
    const teamFixtures = games.filter(
      (g) => g.home_team_id === teamId || g.away_team_id === teamId,
    );

    const profile = getTeamProfiles()[team.name_en] || {};

    const detail = {
      id: parseInt(team.id, 10),
      name: team.name_en,
      logo: team.flag,
      code: team.fifa_code ?? null,
      country: team.name_en,
      group: team.groups ? `Group ${team.groups}` : null,
      fifaRank: fifaRankings[team.name_en] ?? null,
      coach: profile.manager ?? null,
      manager: profile.manager ?? null,
      captain: profile.captain ?? null,
      qualifiedVia: profile.qualifiedVia ?? null,
      appearances: profile.appearances ?? null,
      confederation: profile.confederation ?? null,
      historicalStats: profile.historicalStats ? {
        ...profile.historicalStats,
        highestRank: Math.min(profile.historicalStats.highestRank, fifaRankings[team.name_en] ?? 999)
      } : null,
      historyTimeline: profile.historyTimeline ?? [],
      insights: profile.insights ?? [],
      news: profile.news ?? [],
      lineup: profile.lineup ?? null,
      founded: null,
      venue: null,
      statistics: groupTeamStats
        ? {
            played: parseInt(groupTeamStats.mp, 10),
            wins: parseInt(groupTeamStats.w, 10),
            draws: parseInt(groupTeamStats.d, 10),
            losses: parseInt(groupTeamStats.l, 10),
            goalsFor: parseInt(groupTeamStats.gf, 10),
            goalsAgainst: parseInt(groupTeamStats.ga, 10),
          }
        : null,
      players: [],
      fixtures: teamFixtures.map((g) => mapFixtureForTeam(g, teamMap, stadiumMap)),
    };

    res.json(detail);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

export default router;
