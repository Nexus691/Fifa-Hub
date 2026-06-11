const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'src', 'data', 'team_profiles.json');
const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

for (const teamKey in db) {
  const teamData = db[teamKey];
  if (!teamData.lineup || !teamData.lineup.startingXI || !teamData.lineup.bench) continue;

  // Combine all players back together
  const allPlayers = [...teamData.lineup.startingXI, ...teamData.lineup.bench];

  // Group by position
  const gks = allPlayers.filter(p => p.position === 'GK');
  const defs = allPlayers.filter(p => p.position === 'CB');
  const mids = allPlayers.filter(p => p.position === 'CM');
  const atts = allPlayers.filter(p => p.position === 'ST');

  const starters = [];
  const subs = [];

  const addStarter = (pool, count) => {
    for (let i = 0; i < count; i++) {
      if (pool.length > 0) {
        starters.push(pool.shift());
      }
    }
  };

  addStarter(gks, 1);
  addStarter(defs, 4);
  addStarter(mids, 3);
  addStarter(atts, 3);

  subs.push(...gks, ...defs, ...mids, ...atts);

  const positions = [
    { x: 50, y: 90 }, // GK
    { x: 85, y: 70 }, { x: 65, y: 75 }, { x: 35, y: 75 }, { x: 15, y: 70 }, // DEF
    { x: 75, y: 45 }, { x: 50, y: 55 }, { x: 25, y: 45 }, // MID
    { x: 85, y: 20 }, { x: 50, y: 15 }, { x: 15, y: 20 }  // ATT
  ];
  starters.forEach((p, i) => {
    p.x = positions[i]?.x || 50;
    p.y = positions[i]?.y || 50;
  });

  teamData.lineup.formation = "4-3-3";
  teamData.lineup.startingXI = starters;
  teamData.lineup.bench = subs;
}

fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
console.log('Fixed all formations locally!');
