const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'artifacts/api-server/src/data/team_profiles.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const canada = data['Canada'] || data['Kanada'];

if (!canada) {
  console.error("Canada not found");
  process.exit(1);
}

const startingXI = [
  { name: "Maxime Crépeau", position: "GK", number: 16, x: 50, y: 90 },
  { name: "Alphonso Davies", position: "LB", number: 19, x: 15, y: 70 },
  { name: "Kamal Miller", position: "CB", number: 4, x: 35, y: 70 },
  { name: "Moïse Bombito", position: "CB", number: 15, x: 65, y: 70 },
  { name: "Alistair Johnston", position: "RB", number: 2, x: 85, y: 70 },
  { name: "Stephen Eustáquio", position: "CM", number: 7, x: 35, y: 45 },
  { name: "Ismaël Koné", position: "CM", number: 8, x: 65, y: 45 },
  { name: "Jonathan Osorio", position: "CAM", number: 21, x: 50, y: 35 },
  { name: "Tajon Buchanan", position: "RW", number: 11, x: 85, y: 20 },
  { name: "Jonathan David", position: "ST", number: 20, x: 50, y: 15 },
  { name: "Cyle Larin", position: "LW", number: 9, x: 15, y: 20 }
].map(p => ({
  ...p,
  age: 25,
  photoUrl: null,
  statusBadge: p.number === 19 ? "👑 Captain" : "🟢 Squad Member",
  nationalStats: { caps: 30, goals: 5, assists: 2, debut: 0 },
  tournamentStats: { appearances: 0, goals: 0, assists: 0, minutes: 0, rating: 0 }
}));

const bench = [
  { name: "Dayne St. Clair", position: "GK", number: 1 },
  { name: "Samuel Piette", position: "MID", number: 6 },
  { name: "Liam Millar", position: "FWD", number: 14 },
  { name: "Jacob Shaffelburg", position: "FWD", number: 17 }
].map(p => ({
  ...p,
  x: null, y: null, age: 25, photoUrl: null,
  statusBadge: "🟢 Squad Member",
  nationalStats: { caps: 10, goals: 1, assists: 0, debut: 0 },
  tournamentStats: { appearances: 0, goals: 0, assists: 0, minutes: 0, rating: 0 }
}));

canada.lineup = {
  formation: "4-3-3",
  startingXI,
  bench
};

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Updated Canada lineup successfully.");
