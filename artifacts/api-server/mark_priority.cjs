/**
 * Teams that still have fake/mock data and need to be synced from API-Football.
 * Run this on next quota reset to fill in the remaining 14 teams.
 */
const fs = require('fs');
const path = require('path');

const FAKE_TEAMS = [
  "Bosnia and Herzegovina", "Haiti", "Morocco", "Curaçao", "Ecuador",
  "Germany", "Spain", "Uruguay", "France", "Austria",
  "Jordan", "Colombia", "Democratic Republic of the Congo", "Panama"
];

// Write a marker file so the scraper knows to prioritize these
const PRIORITY_FILE = path.join(__dirname, 'src', 'data', 'priority_sync.json');
fs.writeFileSync(PRIORITY_FILE, JSON.stringify({
  teams: FAKE_TEAMS,
  created: new Date().toISOString(),
  reason: "These teams still have mock data from the original generator. Sync them first on next API quota reset."
}, null, 2));

console.log(`Marked ${FAKE_TEAMS.length} teams for priority sync on next quota reset:`);
FAKE_TEAMS.forEach(t => console.log(`  - ${t}`));
console.log(`\nFile saved to: ${PRIORITY_FILE}`);
