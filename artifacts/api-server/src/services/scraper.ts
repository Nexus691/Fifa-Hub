import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../lib/logger.js';
import { fetchLiveSquad } from './api-football.js';
import { getTeamsPlayingToday, fetchAndCacheSchedule } from './match-schedule.js';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const __filename = fileURLToPath(import.meta.url);
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'team_profiles.json');
const SYNC_FILE = path.join(process.cwd(), 'src', 'data', 'last_sync.json');

// ── Name mapping: OpenLigaDB uses German names, our DB uses English ──
const NAME_MAP: Record<string, string> = {
  'Mexiko': 'Mexico',
  'Südafrika': 'South Africa',
  'Südkorea': 'South Korea',
  'Bosnien und Herzegowina': 'Bosnia and Herzegovina',
  'Kanada': 'Canada',
  'Katar': 'Qatar',
  'Schweiz': 'Switzerland',
  'Brasilien': 'Brazil',
  'Marokko': 'Morocco',
  'Schottland': 'Scotland',
  'Australien': 'Australia',
  'Türkei': 'Turkey',
  'Vereinigte Staaten': 'United States',
  'Deutschland': 'Germany',
  'Elfenbeinküste': 'Ivory Coast',
  'Niederlande': 'Netherlands',
  'Schweden': 'Sweden',
  'Tunesien': 'Tunisia',
  'Belgien': 'Belgium',
  'Ägypten': 'Egypt',
  'Neuseeland': 'New Zealand',
  'Kap Verde': 'Cape Verde',
  'Saudi-Arabien': 'Saudi Arabia',
  'Spanien': 'Spain',
  'Frankreich': 'France',
  'Irak': 'Iraq',
  'Norwegen': 'Norway',
  'Algerien': 'Algeria',
  'Argentinien': 'Argentina',
  'Österreich': 'Austria',
  'Jordanien': 'Jordan',
  'Kolumbien': 'Colombia',
  'Dem. Rep. Kongo': 'Democratic Republic of the Congo',
  'Usbekistan': 'Uzbekistan',
  'Kroatien': 'Croatia',
  'Ghana': 'Ghana',
  'Paraguay': 'Paraguay',
  'Ecuador': 'Ecuador',
  'Curaçao': 'Curaçao',
  'Portugal': 'Portugal',
  'England': 'England',
  'Japan': 'Japan',
  'Uruguay': 'Uruguay',
  'Senegal': 'Senegal',
  'Iran': 'Iran',
  'Haiti': 'Haiti',
  'Panama': 'Panama',
};

function resolveTeamName(openLigaName: string): string {
  return NAME_MAP[openLigaName] || openLigaName;
}

// ── Position categories from API-Football ──
type PosCategory = 'GK' | 'DEF' | 'MID' | 'FWD';

function apiPosToCategory(apiPos: string): PosCategory {
  if (!apiPos) return 'MID';
  const pos = apiPos.toUpperCase();
  if (pos === 'GOALKEEPER' || pos === 'GK') return 'GK';
  if (pos === 'DEFENDER' || pos === 'DEF' || pos === 'CB' || pos === 'LB' || pos === 'RB') return 'DEF';
  if (pos === 'ATTACKER' || pos === 'FWD' || pos === 'ST' || pos === 'LW' || pos === 'RW') return 'FWD';
  return 'MID'; // Midfielder, CM, CDM, CAM
}

// ── Sub-positions assigned based on formation SLOT, not API data ──
// For a 4-3-3, the 11 slots are:
const FORMATION_433_SLOTS: Array<{ subPos: string; x: number; y: number; category: PosCategory }> = [
  // GK
  { subPos: 'GK',  x: 50, y: 90, category: 'GK' },
  // Defense line (L→R from viewer's perspective)
  { subPos: 'LB',  x: 15, y: 70, category: 'DEF' },
  { subPos: 'CB',  x: 38, y: 75, category: 'DEF' },
  { subPos: 'CB',  x: 62, y: 75, category: 'DEF' },
  { subPos: 'RB',  x: 85, y: 70, category: 'DEF' },
  // Midfield line
  { subPos: 'CM',  x: 25, y: 48, category: 'MID' },
  { subPos: 'CDM', x: 50, y: 55, category: 'MID' },
  { subPos: 'CM',  x: 75, y: 48, category: 'MID' },
  // Forward line
  { subPos: 'LW',  x: 15, y: 22, category: 'FWD' },
  { subPos: 'ST',  x: 50, y: 15, category: 'FWD' },
  { subPos: 'RW',  x: 85, y: 22, category: 'FWD' },
];

function mapApiPlayer(apiPlayer: any) {
  const category = apiPosToCategory(apiPlayer.position);

  return {
    name: apiPlayer.name,
    position: category, // Will be overwritten with sub-position when placed in formation
    number: apiPlayer.number || 0,
    x: null as number | null,
    y: null as number | null,
    age: apiPlayer.age,
    club: null as string | null, // API /players/squads doesn't include club
    photoUrl: apiPlayer.photo,
    statusBadge: apiPlayer.number === 10 ? '👑 Captain' : '🟢 Squad Member',
    nationalStats: { caps: 0, goals: 0, assists: 0, debut: 0 },
    tournamentStats: { appearances: 0, goals: 0, assists: 0, minutes: 0, rating: 0 },
    _category: category, // Internal: used for bench display
  };
}

// THE KNOWLEDGE PROVIDED BY THE LLM TO FORCE THE RIGHT PLAYERS INTO STARTING XI
const PREFERRED_STARTERS: Record<string, string[]> = {
  "Portugal": ["Diogo Costa", "Diogo Dalot", "Rúben Dias", "Gonçalo Inácio", "Pepe", "Nuno Mendes", "Vitinha", "Bruno Fernandes", "Bernardo Silva", "Cristiano Ronaldo", "Rafael Leão", "João Félix"],
  "Argentina": ["E. Martínez", "N. Molina", "C. Romero", "Lisandro Martínez", "N. Tagliafico", "R. De Paul", "A. Mac Allister", "E. Fernández", "L. Messi", "J. Álvarez", "Lautaro Martínez", "A. Di María"],
  "Brazil": ["Alisson Becker", "Ederson", "Danilo", "Marquinhos", "Gabriel Magalhães", "Alex Sandro", "Casemiro", "Bruno Guimarães", "Lucas Paquetá", "Vinícius Júnior", "Rodrygo", "Raphinha", "Neymar"],
  "England": ["J. Pickford", "K. Walker", "J. Stones", "H. Maguire", "M. Guéhi", "L. Shaw", "D. Rice", "J. Bellingham", "B. Saka", "P. Foden", "H. Kane", "T. Alexander-Arnold"],
  "France": ["M. Maignan", "J. Koundé", "D. Upamecano", "I. Konaté", "T. Hernández", "A. Tchouaméni", "A. Rabiot", "N. Kanté", "A. Griezmann", "K. Mbappé", "O. Dembélé", "M. Thuram"],
  "Spain": ["Unai Simón", "D. Carvajal", "R. Le Normand", "A. Laporte", "Marc Cucurella", "Rodri", "Fabián Ruiz", "Pedri", "Lamine Yamal", "Nico Williams", "Álvaro Morata", "Dani Olmo"],
  "Germany": ["M. Neuer", "J. Kimmich", "A. Rüdiger", "J. Tah", "D. Raum", "M. Mittelstädt", "T. Kroos", "R. Andrich", "İ. Gündoğan", "F. Wirtz", "J. Musiala", "K. Havertz"],
  "Netherlands": ["B. Verbruggen", "D. Dumfries", "S. de Vrij", "V. van Dijk", "N. Aké", "T. Reijnders", "J. Schouten", "X. Simons", "C. Gakpo", "M. Depay", "D. Malen", "W. Weghorst"],
  "Italy": ["G. Donnarumma", "G. Di Lorenzo", "A. Bastoni", "R. Calafiori", "F. Dimarco", "J. Jorginho", "N. Barella", "D. Frattesi", "F. Chiesa", "G. Scamacca", "M. Zaccagni"],
  "Belgium": ["K. Casteels", "T. Castagne", "W. Faes", "J. Vertonghen", "A. Theate", "A. Onana", "Y. Tielemans", "K. De Bruyne", "L. Trossard", "J. Doku", "R. Lukaku"],
  "Croatia": ["D. Livaković", "J. Stanišić", "J. Šutalo", "J. Gvardiol", "M. Kovačić", "M. Brozović", "L. Modrić", "A. Kramarić", "L. Majer", "B. Petković", "I. Perišić"],
  "Uruguay": ["S. Rochet", "N. Nández", "R. Araújo", "M. Olivera", "M. Viña", "F. Valverde", "M. Ugarte", "N. de la Cruz", "F. Pellistri", "M. Araújo", "D. Núñez"],
  "Colombia": ["C. Vargas", "D. Muñoz", "D. Sánchez", "C. Cuesta", "J. Mojica", "R. Ríos", "J. Lerma", "J. Arias", "J. Rodríguez", "L. Díaz", "J. Córdoba"],
  "USA": ["M. Turner", "J. Scally", "C. Richards", "T. Ream", "A. Robinson", "T. Adams", "W. McKennie", "G. Reyna", "T. Weah", "C. Pulisic", "F. Balogun"],
  "Mexico": ["G. Ochoa", "J. Sánchez", "C. Montes", "J. Vásquez", "J. Gallardo", "E. Álvarez", "L. Chávez", "O. Pineda", "H. Lozano", "U. Antuna", "S. Giménez", "H. Martín"],
  "Japan": ["Z. Suzuki", "Y. Sugawara", "K. Itakura", "T. Tomiyasu", "H. Ito", "W. Endo", "H. Morita", "T. Kubo", "D. Kamada", "K. Mitoma", "A. Ueda"]
};

function isPreferred(playerName: string, teamName: string): boolean {
  const prefs = PREFERRED_STARTERS[teamName];
  if (!prefs) return false;
  
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const pNorm = norm(playerName);
  
  return prefs.some(pref => {
    const prefNorm = norm(pref);
    return pNorm.includes(prefNorm) || prefNorm.includes(pNorm);
  });
}

export function buildFormation(liveSquad: any[], existingLineup?: any, teamName?: string) {
  const mapped = liveSquad.map(mapApiPlayer);

  if (teamName) {
    mapped.sort((a, b) => {
      const aPref = isPreferred(a.name, teamName) ? 1 : 0;
      const bPref = isPreferred(b.name, teamName) ? 1 : 0;
      return bPref - aPref;
    });
  }

  // Separate by category
  const pools: Record<PosCategory, any[]> = {
    GK: mapped.filter(p => p._category === 'GK'),
    DEF: mapped.filter(p => p._category === 'DEF'),
    MID: mapped.filter(p => p._category === 'MID'),
    FWD: mapped.filter(p => p._category === 'FWD'),
  };

  const starters: any[] = [];
  const used = new Set<string>(); // Track by name to avoid duplicates

  // Pick from a pool, returns the picked player or null
  const pickOne = (pool: any[]): any | null => {
    while (pool.length > 0) {
      const p = pool.shift()!;
      if (!used.has(p.name)) {
        used.add(p.name);
        return p;
      }
    }
    return null;
  };

  // Fill each formation slot in order
  for (const slot of FORMATION_433_SLOTS) {
    // Try primary pool first
    let player = pickOne(pools[slot.category]);

    // Fallback: try adjacent categories
    if (!player) {
      const fallbacks: PosCategory[] =
        slot.category === 'DEF' ? ['MID', 'FWD', 'GK'] :
        slot.category === 'MID' ? ['DEF', 'FWD', 'GK'] :
        slot.category === 'FWD' ? ['MID', 'DEF', 'GK'] :
        ['DEF', 'MID', 'FWD']; // GK fallback

      for (const fb of fallbacks) {
        player = pickOne(pools[fb]);
        if (player) break;
      }
    }

    if (player) {
      player.position = slot.subPos; // Assign sub-position from formation slot
      player.x = slot.x;
      player.y = slot.y;
      starters.push(player);
    }
  }

  // Everyone not in starters goes to bench
  const starterNames = new Set(starters.map(p => p.name));
  const bench = mapped.filter(p => !starterNames.has(p.name));

  // Assign readable sub-positions to bench based on their API category
  bench.forEach(p => {
    if (p._category === 'GK') p.position = 'GK';
    else if (p._category === 'DEF') p.position = 'DEF';
    else if (p._category === 'MID') p.position = 'MID';
    else if (p._category === 'FWD') p.position = 'FWD';
  });

  // Preserve existing nationalStats from DB if we have them
  if (existingLineup) {
    const existingMap = new Map<string, any>();
    [...(existingLineup.startingXI || []), ...(existingLineup.bench || [])].forEach((p: any) => {
      existingMap.set(p.name, p);
    });

    [...starters, ...bench].forEach(p => {
      const existing = existingMap.get(p.name);
      if (existing?.nationalStats) {
        // Carry over stats that we already have
        p.nationalStats = { ...p.nationalStats, ...existing.nationalStats };
      }
      if (existing?.tournamentStats) {
        p.tournamentStats = { ...p.tournamentStats, ...existing.tournamentStats };
      }
      if (existing?.club && existing.club !== 'Real Data') {
        p.club = existing.club;
      }
    });
  }

  // Clean up internal field
  [...starters, ...bench].forEach(p => delete p._category);

  return { formation: '4-3-3', startingXI: starters, bench };
}

// ═══════════════════════════════════════════════════════
//  MAIN SCRAPER: Smart match-day-only sync
// ═══════════════════════════════════════════════════════

/**
 * FULL SYNC — runs once on first boot or when last_sync.json is older than 24h.
 * Syncs all 48 teams with a 6.5s delay between each to respect rate limits.
 */
export async function runFullSync() {
  logger.info('=== FULL SYNC: Updating all 48 teams ===');

  if (!fs.existsSync(DATA_FILE)) {
    logger.warn('Team profiles data file not found, skipping.');
    return;
  }

  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  let updated = 0;

  for (const teamKey of Object.keys(db)) {
    const liveSquad = await fetchLiveSquad(teamKey);
    if (liveSquad && liveSquad.length > 0) {
      db[teamKey].lineup = buildFormation(liveSquad, db[teamKey].lineup, teamKey);
      updated++;
      logger.info(`[${updated}/${Object.keys(db).length}] ✅ ${teamKey}`);
    } else {
      logger.warn(`[SKIP] ${teamKey} — no data from API`);
    }
    await delay(6500); // Respect 10 req/min limit
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  fs.writeFileSync(SYNC_FILE, JSON.stringify({ lastSync: new Date().toISOString(), type: 'full' }));
  logger.info(`=== FULL SYNC COMPLETE: ${updated} teams updated ===`);
}

const PRIORITY_FILE = path.join(process.cwd(), 'src', 'data', 'priority_sync.json');

/**
 * PRIORITY SYNC — if priority_sync.json exists, sync ONLY those teams first.
 * This handles the 14 teams that still have fake mock data.
 * Once all priority teams are synced, the file is deleted.
 */
export async function runPrioritySync(): Promise<boolean> {
  if (!fs.existsSync(PRIORITY_FILE)) return false;

  const priorityData = JSON.parse(fs.readFileSync(PRIORITY_FILE, 'utf-8'));
  const teamsToSync: string[] = priorityData.teams || [];

  if (teamsToSync.length === 0) {
    fs.unlinkSync(PRIORITY_FILE);
    return false;
  }

  logger.info(`=== PRIORITY SYNC: ${teamsToSync.length} teams with fake data need real data ===`);

  if (!fs.existsSync(DATA_FILE)) return false;
  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const remaining: string[] = [];

  for (const teamName of teamsToSync) {
    const liveSquad = await fetchLiveSquad(teamName);
    if (liveSquad && liveSquad.length > 0) {
      db[teamName].lineup = buildFormation(liveSquad, db[teamName].lineup, teamName);
      logger.info(`✅ ${teamName} — real data injected!`);
    } else {
      logger.warn(`❌ ${teamName} — still failed. Will retry next time.`);
      remaining.push(teamName);
    }
    await delay(6500);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

  if (remaining.length > 0) {
    // Update the priority file with only the remaining teams
    fs.writeFileSync(PRIORITY_FILE, JSON.stringify({
      teams: remaining,
      created: priorityData.created,
      lastAttempt: new Date().toISOString(),
      reason: `${remaining.length} teams still need real data.`
    }, null, 2));
    logger.info(`=== PRIORITY SYNC PARTIAL: ${teamsToSync.length - remaining.length} synced, ${remaining.length} remaining ===`);
  } else {
    // All done! Delete the priority file
    fs.unlinkSync(PRIORITY_FILE);
    logger.info(`=== PRIORITY SYNC COMPLETE: All ${teamsToSync.length} teams now have real data! ===`);
  }

  return true;
}

/**
 * MATCH-DAY SYNC — runs every hour during the tournament.
 * Only fetches fresh data for teams that have a match within ±4 hours.
 * Uses OpenLigaDB (free, no quota) to check the schedule.
 */
export async function runMatchDaySync() {
  logger.info('=== MATCH-DAY SYNC: Checking for teams playing today ===');

  const { teams: matchDayTeams, matches } = await getTeamsPlayingToday(4);

  // Translate OpenLigaDB German names to our English DB keys
  const dbTeamNames = matchDayTeams.map(resolveTeamName);

  if (dbTeamNames.length === 0) {
    logger.info('No matches within the ±4 hour window. Nothing to sync.');
    return;
  }

  logger.info(`🏟️  ${matches.length} match(es) found! Teams to sync: ${dbTeamNames.join(', ')}`);

  if (!fs.existsSync(DATA_FILE)) return;
  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  for (const teamName of dbTeamNames) {
    if (!db[teamName]) {
      logger.warn(`Team "${teamName}" not found in DB, skipping.`);
      continue;
    }

    const liveSquad = await fetchLiveSquad(teamName);
    if (liveSquad && liveSquad.length > 0) {
      db[teamName].lineup = buildFormation(liveSquad, db[teamName].lineup, teamName);
      logger.info(`✅ ${teamName} lineup refreshed!`);
    }
    await delay(6500);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  logger.info('=== MATCH-DAY SYNC COMPLETE ===');
}

/**
 * MAIN ENTRY — decides which sync mode to run.
 * - If never synced or >24h since last full sync → full sync
 * - Otherwise → match-day sync (only teams playing today)
 */
export async function runScraper() {
  logger.info('Starting smart scraper...');

  // Always refresh the schedule from OpenLigaDB (free, costs nothing)
  await fetchAndCacheSchedule();

  // Check if we need a full sync
  const needsFullSync = (() => {
    if (!fs.existsSync(SYNC_FILE)) return true;
    const syncData = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf-8'));
    const elapsed = Date.now() - new Date(syncData.lastSync).getTime();
    const hoursElapsed = Math.round(elapsed / 3600000);
    if (elapsed >= 24 * 60 * 60 * 1000) {
      logger.info(`Last full sync was ${hoursElapsed}h ago. Time for a fresh one.`);
      return true;
    }
    logger.info(`Last full sync was ${hoursElapsed}h ago. Using match-day mode.`);
    return false;
  })();

  // FIRST: Check if there are priority teams that need real data
  const didPrioritySync = await runPrioritySync();
  if (didPrioritySync) {
    logger.info('Priority sync handled this cycle. Will do normal sync next hour.');
    return;
  }

  if (needsFullSync) {
    await runFullSync();
  } else {
    await runMatchDaySync();
  }
}
