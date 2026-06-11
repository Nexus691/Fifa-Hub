import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger.js';

// Load cached mappings from disk to avoid burning the 100/day API quota
const CACHE_FILE = path.join(process.cwd(), 'src', 'data', 'team_ids.json');
let TEAM_ID_MAP: Record<string, number> = {
  "Brazil": 6, "Argentina": 26, "France": 2, "England": 10,
  "Spain": 9, "Germany": 25, "Portugal": 27, "Italy": 768,
  "Netherlands": 1118, "Belgium": 1, "USA": 24, "Mexico": 16
};

if (fs.existsSync(CACHE_FILE)) {
  const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  TEAM_ID_MAP = { ...TEAM_ID_MAP, ...cached };
}

export async function fetchLiveSquad(teamName: string) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    logger.error("Missing API_FOOTBALL_KEY in .env");
    return null;
  }

  const headers = { 'x-apisports-key': apiKey, 'x-apisports-host': 'v3.football.api-sports.io' };

  let teamId = TEAM_ID_MAP[teamName];
  
  if (!teamId) {
    // Dynamically search for the team ID and cache it!
    logger.info(`Resolving API-Football Team ID for ${teamName}...`);
    try {
      const searchRes = await axios.get('https://v3.football.api-sports.io/teams', {
        params: { search: teamName }, headers
      });
      const teams = searchRes.data.response;
      // Find the one marked as national team, or default to the first
      const nationalTeam = teams.find((t: any) => t.team.national) || teams[0];
      
      if (nationalTeam) {
        teamId = nationalTeam.team.id;
        TEAM_ID_MAP[teamName] = teamId;
        fs.writeFileSync(CACHE_FILE, JSON.stringify(TEAM_ID_MAP, null, 2));
        logger.info(`Cached ${teamName} -> ID ${teamId}`);
      } else {
        logger.warn(`Could not resolve API team ID for ${teamName}.`);
        return null;
      }
    } catch (e) {
      logger.error(`Failed to search team ID for ${teamName}`);
      return null;
    }
  }

  try {
    logger.info(`Fetching live squad for ${teamName} (ID: ${teamId})...`);
    const response = await axios.get('https://v3.football.api-sports.io/players/squads', {
      params: { team: teamId }, headers
    });

    const data = response.data;
    if (!data.response || data.response.length === 0) return null;
    return data.response[0].players;
    
  } catch (error) {
    logger.error(`Failed to fetch live squad for ${teamName}`);
    return null;
  }
}
