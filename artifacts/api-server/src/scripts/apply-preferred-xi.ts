import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const CACHE_FILE = path.join(process.cwd(), 'src', 'data', 'team_ids.json');
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'team_profiles.json');

let TEAM_ID_MAP: Record<string, number> = {
  "Brazil": 6, "Argentina": 26, "France": 2, "England": 10,
  "Spain": 9, "Germany": 25, "Portugal": 27, "Italy": 768,
  "Netherlands": 1118, "Belgium": 1, "USA": 24, "Mexico": 16
};

if (fs.existsSync(CACHE_FILE)) {
  const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  TEAM_ID_MAP = { ...TEAM_ID_MAP, ...cached };
}

async function fetchLiveSquad(teamName: string) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const headers = { 'x-apisports-key': apiKey, 'x-apisports-host': 'v3.football.api-sports.io' };

  let teamId = TEAM_ID_MAP[teamName];
  
  if (!teamId) {
    console.log(`Resolving API-Football Team ID for ${teamName}...`);
    try {
      const searchRes = await axios.get('https://v3.football.api-sports.io/teams', {
        params: { search: teamName }, headers
      });
      const teams = searchRes.data.response;
      const nationalTeam = teams.find((t: any) => t.team.national) || teams[0];
      
      if (nationalTeam) {
        teamId = nationalTeam.team.id;
        TEAM_ID_MAP[teamName] = teamId;
        fs.writeFileSync(CACHE_FILE, JSON.stringify(TEAM_ID_MAP, null, 2));
        console.log(`Cached ${teamName} -> ID ${teamId}`);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

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

// ── Position categories from API-Football ──
type PosCategory = 'GK' | 'DEF' | 'MID' | 'FWD';

function apiPosToCategory(apiPos: string): PosCategory {
  if (!apiPos) return 'MID';
  const pos = apiPos.toUpperCase();
  if (pos === 'GOALKEEPER' || pos === 'GK') return 'GK';
  if (pos === 'DEFENDER' || pos === 'DEF' || pos === 'CB' || pos === 'LB' || pos === 'RB') return 'DEF';
  if (pos === 'ATTACKER' || pos === 'FWD' || pos === 'ST' || pos === 'LW' || pos === 'RW') return 'FWD';
  return 'MID'; 
}

const FORMATION_433_SLOTS: Array<{ subPos: string; x: number; y: number; category: PosCategory }> = [
  { subPos: 'GK',  x: 50, y: 90, category: 'GK' },
  { subPos: 'LB',  x: 15, y: 70, category: 'DEF' },
  { subPos: 'CB',  x: 38, y: 75, category: 'DEF' },
  { subPos: 'CB',  x: 62, y: 75, category: 'DEF' },
  { subPos: 'RB',  x: 85, y: 70, category: 'DEF' },
  { subPos: 'CM',  x: 25, y: 48, category: 'MID' },
  { subPos: 'CDM', x: 50, y: 55, category: 'MID' },
  { subPos: 'CM',  x: 75, y: 48, category: 'MID' },
  { subPos: 'LW',  x: 15, y: 22, category: 'FWD' },
  { subPos: 'ST',  x: 50, y: 15, category: 'FWD' },
  { subPos: 'RW',  x: 85, y: 22, category: 'FWD' },
];

function mapApiPlayer(apiPlayer: any) {
  const category = apiPosToCategory(apiPlayer.position);
  return {
    name: apiPlayer.name,
    position: category, 
    number: apiPlayer.number || 0,
    x: null, y: null,
    age: apiPlayer.age,
    club: null, 
    photoUrl: apiPlayer.photo,
    statusBadge: apiPlayer.number === 10 ? '👑 Captain' : '🟢 Squad Member',
    nationalStats: { caps: 0, goals: 0, assists: 0, debut: 0 },
    tournamentStats: { appearances: 0, goals: 0, assists: 0, minutes: 0, rating: 0 },
    _category: category, 
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

// Helper: match player names even if partially different (e.g. "C. Ronaldo" vs "Cristiano Ronaldo")
function isPreferred(playerName: string, teamName: string): boolean {
  const prefs = PREFERRED_STARTERS[teamName];
  if (!prefs) return false;
  
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const pNorm = norm(playerName);
  
  return prefs.some(pref => {
    const prefNorm = norm(pref);
    // If they have same last name or are contained within each other
    return pNorm.includes(prefNorm) || prefNorm.includes(pNorm);
  });
}

function buildFormationLLMConfigured(liveSquad: any[], teamName: string, existingLineup?: any) {
  let mapped = [];
  if (liveSquad && liveSquad.length > 0 && liveSquad[0].name) {
    mapped = liveSquad.map(mapApiPlayer);
  } else {
    // We are passing an already mapped existing array
    mapped = liveSquad;
  }

  // Sort players so preferred starters are placed at the front of their category pools
  mapped.sort((a: any, b: any) => {
    const aPref = isPreferred(a.name, teamName) ? 1 : 0;
    const bPref = isPreferred(b.name, teamName) ? 1 : 0;
    return bPref - aPref;
  });

  const pools: Record<PosCategory, any[]> = {
    GK: mapped.filter((p:any) => p._category === 'GK'),
    DEF: mapped.filter((p:any) => p._category === 'DEF'),
    MID: mapped.filter((p:any) => p._category === 'MID'),
    FWD: mapped.filter((p:any) => p._category === 'FWD'),
  };

  const starters: any[] = [];
  const used = new Set<string>();

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

  for (const slot of FORMATION_433_SLOTS) {
    let player = pickOne(pools[slot.category]);

    if (!player) {
      const fallbacks: PosCategory[] =
        slot.category === 'DEF' ? ['MID', 'FWD', 'GK'] :
        slot.category === 'MID' ? ['DEF', 'FWD', 'GK'] :
        slot.category === 'FWD' ? ['MID', 'DEF', 'GK'] :
        ['DEF', 'MID', 'FWD'];

      for (const fb of fallbacks) {
        player = pickOne(pools[fb]);
        if (player) break;
      }
    }

    if (player) {
      player.position = slot.subPos;
      player.x = slot.x;
      player.y = slot.y;
      starters.push(player);
    }
  }

  const starterNames = new Set(starters.map((p:any) => p.name));
  const bench = mapped.filter((p:any) => !starterNames.has(p.name));

  bench.forEach((p:any) => {
    if (p._category === 'GK') p.position = 'GK';
    else if (p._category === 'DEF') p.position = 'DEF';
    else if (p._category === 'MID') p.position = 'MID';
    else if (p._category === 'FWD') p.position = 'FWD';
  });

  // Preserve existing stats
  if (existingLineup) {
    const existingMap = new Map<string, any>();
    [...(existingLineup.startingXI || []), ...(existingLineup.bench || [])].forEach((p: any) => {
      existingMap.set(p.name, p);
    });

    [...starters, ...bench].forEach(p => {
      const existing = existingMap.get(p.name);
      if (existing?.nationalStats) {
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

  // Cleanup
  [...starters, ...bench].forEach((p:any) => delete p._category);

  return { formation: '4-3-3', startingXI: starters, bench };
}

async function run() {
  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  
  const needFetch = [
    "Portugal", "Argentina", "Brazil", "England"
  ];

  for (const teamName of needFetch) {
    if (!db[teamName]) continue;
    console.log(`Fetching API data for ${teamName}...`);
    const liveSquad = await fetchLiveSquad(teamName);
    if (liveSquad && liveSquad.length > 0) {
      db[teamName].lineup = buildFormationLLMConfigured(liveSquad, teamName, db[teamName].lineup);
      console.log(`✅ ${teamName} API sync complete`);
    } else {
      console.log(`❌ Failed to get API data for ${teamName}`);
    }
    // Sleep to respect API limits
    await new Promise(r => setTimeout(r, 6500));
  }

  // For the rest of the teams, just re-run the sorting logic locally to push preferred starters to the front
  for (const teamName of Object.keys(db)) {
    if (needFetch.includes(teamName)) continue; // Already done
    
    const lineup = db[teamName].lineup;
    if (!lineup || !lineup.startingXI || lineup.startingXI.length === 0) continue;
    
    // Combine existing back into one array and run it through the new builder
    const allPlayers = [
      ...lineup.startingXI.map((p:any) => ({...p, _category: apiPosToCategory(p.position)})),
      ...lineup.bench.map((p:any) => ({...p, _category: apiPosToCategory(p.position)}))
    ];
    
    db[teamName].lineup = buildFormationLLMConfigured(allPlayers, teamName, lineup);
    console.log(`✅ ${teamName} local LLM sorting complete`);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  console.log("All done! XI is now synced with LLM intelligence.");
}

run().catch(console.error);
