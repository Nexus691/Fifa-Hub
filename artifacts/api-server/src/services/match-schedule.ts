import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger.js';

// OpenLigaDB is 100% free with no API key and no rate limits.
// We use it purely for the match schedule so we know WHICH teams play on any given day.
const OPENLIGA_WC_URL = 'https://api.openligadb.de/getmatchdata/wm26/2026';
const SCHEDULE_CACHE = path.join(process.cwd(), 'src', 'data', 'wc_schedule.json');

export interface WCMatch {
  matchId: number;
  dateTime: string;       // ISO string
  team1: string;
  team2: string;
  group: string;
  isFinished: boolean;
  location: string | null;
}

/**
 * Fetches the full 72-match World Cup schedule from OpenLigaDB and caches it locally.
 * This is completely free and has no quota limits.
 */
export async function fetchAndCacheSchedule(): Promise<WCMatch[]> {
  try {
    logger.info('Fetching WC 2026 schedule from OpenLigaDB (free, no quota)...');
    const { data } = await axios.get(OPENLIGA_WC_URL, { timeout: 10000 });

    const matches: WCMatch[] = data.map((m: any) => ({
      matchId: m.matchID,
      dateTime: m.matchDateTimeUTC || m.matchDateTime,
      team1: m.team1?.teamName || 'TBD',
      team2: m.team2?.teamName || 'TBD',
      group: m.group?.groupName || '',
      isFinished: m.matchIsFinished,
      location: m.location?.locationCity || null,
    }));

    fs.writeFileSync(SCHEDULE_CACHE, JSON.stringify(matches, null, 2));
    logger.info(`Cached ${matches.length} WC matches to disk.`);
    return matches;
  } catch (err) {
    logger.error('Failed to fetch schedule from OpenLigaDB. Trying local cache...');

    if (fs.existsSync(SCHEDULE_CACHE)) {
      return JSON.parse(fs.readFileSync(SCHEDULE_CACHE, 'utf-8'));
    }
    return [];
  }
}

/**
 * Returns a list of team names that have a match within the given time window.
 * @param hoursBeforeAfter - How many hours before/after "now" to look for matches (default: 4)
 */
export async function getTeamsPlayingToday(hoursBeforeAfter = 4): Promise<{ teams: string[]; matches: WCMatch[] }> {
  let schedule: WCMatch[];

  // Use cached schedule if available and not older than 6 hours, else re-fetch
  if (fs.existsSync(SCHEDULE_CACHE)) {
    const stat = fs.statSync(SCHEDULE_CACHE);
    const ageMs = Date.now() - stat.mtimeMs;
    if (ageMs < 6 * 60 * 60 * 1000) {
      schedule = JSON.parse(fs.readFileSync(SCHEDULE_CACHE, 'utf-8'));
    } else {
      schedule = await fetchAndCacheSchedule();
    }
  } else {
    schedule = await fetchAndCacheSchedule();
  }

  const now = Date.now();
  const windowMs = hoursBeforeAfter * 60 * 60 * 1000;

  const relevantMatches = schedule.filter(m => {
    const matchTime = new Date(m.dateTime).getTime();
    return Math.abs(matchTime - now) <= windowMs;
  });

  const teams = new Set<string>();
  relevantMatches.forEach(m => {
    teams.add(m.team1);
    teams.add(m.team2);
  });

  return {
    teams: Array.from(teams),
    matches: relevantMatches,
  };
}

/**
 * Returns the next upcoming match (useful for countdown display).
 */
export async function getNextMatch(): Promise<WCMatch | null> {
  let schedule: WCMatch[];

  if (fs.existsSync(SCHEDULE_CACHE)) {
    schedule = JSON.parse(fs.readFileSync(SCHEDULE_CACHE, 'utf-8'));
  } else {
    schedule = await fetchAndCacheSchedule();
  }

  const now = Date.now();
  const upcoming = schedule
    .filter(m => new Date(m.dateTime).getTime() > now && !m.isFinished)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return upcoming[0] || null;
}
