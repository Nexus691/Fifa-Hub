const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'artifacts/api-server/src/data/team_profiles.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Assuming data is either an array or an object
let mexico;
if (Array.isArray(data)) {
  mexico = data.find(t => t.id === 1);
} else {
  mexico = data['1'] || data['Mexico'];
}

if (!mexico) {
  console.error("Mexico not found");
  process.exit(1);
}

const allPlayers = [...mexico.lineup.startingXI, ...mexico.lineup.bench];

// The required starting XI from the screenshot:
// GK: 1 R. Rangel (J. Rangel in data?)
// DEF: 23 J. Gallardo, 5 J. Vásquez, 3 C. Montes, 15 I. Reyes
// CDM: 6 E. Lira (É. Lira)
// MID: 26 B. Gutiérrez, 8 Fidalgo (Álvaro Fidalgo)
// FWD: 16 J. Quiñones, 9 Raúl (R. Jiménez), 25 R. Alvarado

const startingNamesOrIds = {
  1: { x: 50, y: 90 }, // Rangel
  23: { x: 15, y: 70 }, // Gallardo
  5: { x: 35, y: 70 }, // Vasquez
  3: { x: 65, y: 70 }, // Montes
  15: { x: 85, y: 70 }, // Reyes
  6: { x: 50, y: 55 }, // Lira
  26: { x: 35, y: 40 }, // Gutierrez
  8: { x: 65, y: 40 }, // Fidalgo
  16: { x: 20, y: 20 }, // Quinones
  9: { x: 50, y: 15 }, // Raul Jimenez
  25: { x: 80, y: 20 }, // Alvarado
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

mexico.lineup.formation = "4-1-2-3";
mexico.lineup.startingXI = newStartingXI;
mexico.lineup.bench = newBench;
mexico.manager = "Javier Aguirre";

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Updated Mexico lineup successfully.");
