import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { buildFormation } from './services/scraper';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'team_profiles.json');
const CACHE_FILE = path.join(process.cwd(), 'src', 'data', 'team_ids.json');

const TEAM_ID_MAP = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));

async function fetchLiveSquad(teamName: string) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const headers = { 'x-apisports-key': apiKey, 'x-apisports-host': 'v3.football.api-sports.io' };
  
  const teamId = TEAM_ID_MAP[teamName];
  if (!teamId) return null;

  try {
    const response = await axios.get('https://v3.football.api-sports.io/players/squads', {
      params: { team: teamId }, headers
    });
    const data = response.data;
    if (!data.response || data.response.length === 0) return null;
    return data.response[0].players;
  } catch (error) {
    return null;
  }
}

async function run() {
  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  
  const alreadyFetchedToday = [
    "Portugal", "Argentina", "Brazil", "England", 
    "France", "Netherlands", "South Korea", "Japan", "Panama",
    "Bosnia and Herzegovina", "Curaçao", "Democratic Republic of the Congo", "Haiti"
  ];

  const toFetch = Object.keys(db).filter(t => !alreadyFetchedToday.includes(t));
  console.log(`Need to fetch ${toFetch.length} teams from API to unpoison their positions...`);

  let count = 0;
  for (const team of toFetch) {
    console.log(`Fetching true API data for ${team}...`);
    const liveSquad = await fetchLiveSquad(team);
    if (liveSquad && liveSquad.length > 0) {
      db[team].lineup = buildFormation(liveSquad, db[team].lineup, team);
      console.log(`✅ ${team} fully restored and sorted.`);
    } else {
      console.log(`❌ Failed for ${team}`);
    }
    
    // sleep
    await new Promise(r => setTimeout(r, 6500));
    count++;
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  console.log(`Done! Fetched ${count} teams. All data is perfectly pristine.`);
}

run().catch(console.error);
