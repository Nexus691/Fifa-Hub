const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'artifacts/api-server/src/data/team_profiles.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const sa = data['South Africa'];

if (!sa) {
  console.error("South Africa not found");
  process.exit(1);
}

const allPlayers = [...sa.lineup.startingXI, ...sa.lineup.bench];

// Target 3-5-2 (5-3-2)
const startingNamesOrIds = {
  1: { x: 50, y: 90 }, // R. Williams (GK)
  20: { x: 85, y: 70 }, // K. Mudau (RWB)
  19: { x: 65, y: 70 }, // N. Sibisi (RCB)
  14: { x: 50, y: 70 }, // M. Mbokazi (CB)
  26: { x: 35, y: 70 }, // B. Cross (LCB)
  6: { x: 15, y: 70 }, // A. Modiba (LWB)
  4: { x: 50, y: 50 }, // T. Mokoena (CDM)
  5: { x: 30, y: 35 }, // T. Mbatha (CM)
  15: { x: 70, y: 35 }, // I. Rayners (CM)
  9: { x: 40, y: 15 }, // L. Foster (FWD)
  23: { x: 60, y: 15 }, // J. Adams (FWD)
};

const newStartingXI = [];
const newBench = [];

allPlayers.forEach(p => {
  if (startingNamesOrIds[p.number]) {
    p.x = startingNamesOrIds[p.number].x;
    p.y = startingNamesOrIds[p.number].y;
    newStartingXI.push(p);
  } else {
    p.x = null;
    p.y = null;
    newBench.push(p);
  }
});

sa.lineup.formation = "3-5-2";
sa.lineup.startingXI = newStartingXI;
sa.lineup.bench = newBench;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Updated South Africa lineup successfully.");
