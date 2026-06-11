import { Router, type IRouter } from "express";
import {
  fetchAllGroups,
  getTeamMap,
} from "../services/worldCup26Api";

const router: IRouter = Router();

router.get("/standings", async (req, res) => {
  try {
    const { group } = req.query as Record<string, string | undefined>;
    const [groups, teamMap] = await Promise.all([
      fetchAllGroups(),
      getTeamMap(),
    ]);

    // Sort groups alphabetically
    const sorted = [...groups].sort((a, b) => a.name.localeCompare(b.name));

    const result = sorted.map((g) => {
      // Sort teams by points, then goal difference, then goals for
      const sortedTeams = [...g.teams].sort((a, b) => {
        const ptsDiff = parseInt(b.pts, 10) - parseInt(a.pts, 10);
        if (ptsDiff !== 0) return ptsDiff;
        const gdDiff = parseInt(b.gd, 10) - parseInt(a.gd, 10);
        if (gdDiff !== 0) return gdDiff;
        return parseInt(b.gf, 10) - parseInt(a.gf, 10);
      });

      return {
        group: `Group ${g.name}`,
        standings: sortedTeams.map((row, index) => {
          const team = teamMap.get(row.team_id);
          return {
            rank: index + 1,
            team: {
              id: team ? parseInt(team.id, 10) : parseInt(row.team_id, 10),
              name: team?.name_en ?? `Team ${row.team_id}`,
              logo: team?.flag ?? "",
              code: team?.fifa_code ?? null,
              country: team?.name_en ?? null,
              group: `Group ${g.name}`,
              fifaRank: null,
              coach: null,
            },
            played: parseInt(row.mp, 10),
            wins: parseInt(row.w, 10),
            draws: parseInt(row.d, 10),
            losses: parseInt(row.l, 10),
            goalsFor: parseInt(row.gf, 10),
            goalsAgainst: parseInt(row.ga, 10),
            goalDifference: parseInt(row.gd, 10),
            points: parseInt(row.pts, 10),
          };
        }),
      };
    });

    if (group) {
      const filtered = result.filter((g) =>
        g.group.toLowerCase().includes(group.toLowerCase()),
      );
      res.json(filtered);
      return;
    }

    res.json(result);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch standings" });
  }
});

export default router;
