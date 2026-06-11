/**
 * ONE-TIME FIX SCRIPT
 * 
 * Fixes the starting XI for all 48 teams:
 * 1. For teams with real squad data: re-runs buildFormation() locally (no API calls)
 * 2. For teams with fake data: those will need to be re-synced via the API
 * 
 * Run with: npx tsx src/scripts/fix-lineups.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'team_profiles.json');

// ── Position categories from API-Football ──
type PosCategory = 'GK' | 'DEF' | 'MID' | 'FWD';

function apiPosToCategory(apiPos: string): PosCategory {
  if (apiPos === 'Goalkeeper' || apiPos === 'GK') return 'GK';
  if (apiPos === 'Defender' || apiPos === 'DEF' || apiPos === 'CB') return 'DEF';
  if (apiPos === 'Attacker' || apiPos === 'FWD' || apiPos === 'ST') return 'FWD';
  return 'MID'; // Midfielder, CM, or unknown
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

function rebuildFormation(existingLineup: any) {
  if (!existingLineup) return null;

  // Gather ALL players from existing lineup
  const allPlayers = [
    ...(existingLineup.startingXI || []),
    ...(existingLineup.bench || []),
  ];

  if (allPlayers.length === 0) return null;

  // Categorize each player based on their existing position
  const categorized = allPlayers.map(p => ({
    ...p,
    _category: apiPosToCategory(p.position),
  }));

  // Separate into pools
  const pools: Record<PosCategory, any[]> = {
    GK: categorized.filter(p => p._category === 'GK'),
    DEF: categorized.filter(p => p._category === 'DEF'),
    MID: categorized.filter(p => p._category === 'MID'),
    FWD: categorized.filter(p => p._category === 'FWD'),
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

  const starterNames = new Set(starters.map(p => p.name));
  const bench = categorized.filter(p => !starterNames.has(p.name));

  bench.forEach(p => {
    if (p._category === 'GK') p.position = 'GK';
    else if (p._category === 'DEF') p.position = 'DEF';
    else if (p._category === 'MID') p.position = 'MID';
    else if (p._category === 'FWD') p.position = 'FWD';
  });

  // Clean up
  [...starters, ...bench].forEach(p => {
    delete p._category;
    // Fix legacy 'Real Data' club values
    if (p.club === 'Real Data') p.club = null;
  });

  return { formation: '4-3-3', startingXI: starters, bench };
}

// ── MAIN ──
console.log('═══════════════════════════════════════');
console.log('  FIX LINEUPS — One-time repair script');
console.log('═══════════════════════════════════════\n');

if (!fs.existsSync(DATA_FILE)) {
  console.error('❌ team_profiles.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
let fixed = 0;
let skipped = 0;
const problems: string[] = [];

for (const teamName of Object.keys(db)) {
  const team = db[teamName];
  const lineup = team?.lineup;

  if (!lineup || !lineup.startingXI || lineup.startingXI.length === 0) {
    skipped++;
    continue;
  }

  // Check if it's fake data (fake data has only 6 players with generic names)
  const isFake = lineup.startingXI.length <= 6 && 
    lineup.startingXI.some((p: any) => 
      /^[A-Z]\. (Santos|Garcia|Silva|Martinez|Pereira|Costa|Fernandez|Diaz)$/.test(p.name)
    );

  if (isFake) {
    console.log(`⏭️  ${teamName} — FAKE data, needs API re-sync`);
    skipped++;
    continue;
  }

  const newLineup = rebuildFormation(lineup);
  if (!newLineup) {
    skipped++;
    continue;
  }

  // Verify
  const gks = newLineup.startingXI.filter((p: any) => p.position === 'GK').length;
  if (gks !== 1) {
    problems.push(`${teamName}: ${gks} GKs in starting XI`);
  }

  db[teamName].lineup = newLineup;
  fixed++;

  // Log the result
  const positions = newLineup.startingXI.map((p: any) => p.position).join(', ');
  console.log(`✅ ${teamName} — XI: [${positions}] | Bench: ${newLineup.bench.length}`);
}

fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

console.log('\n═══════════════════════════════════════');
console.log(`  RESULTS: ${fixed} fixed, ${skipped} skipped`);
if (problems.length > 0) {
  console.log(`  ⚠️  PROBLEMS:`);
  problems.forEach(p => console.log(`    - ${p}`));
} else {
  console.log(`  ✅ All fixed teams have exactly 1 GK!`);
}
console.log('═══════════════════════════════════════');
