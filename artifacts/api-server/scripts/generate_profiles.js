import fs from 'fs';

const teamsList = [
    "Czech Republic", "Mexico", "South Africa", "South Korea", "Bosnia and Herzegovina",
    "Canada", "Qatar", "Switzerland", "Brazil", "Haiti", "Morocco", "Scotland",
    "Australia", "Paraguay", "Turkey", "United States", "Curaçao", "Ecuador", "Germany",
    "Ivory Coast", "Japan", "Netherlands", "Sweden", "Tunisia", "Belgium", "Egypt",
    "Iran", "New Zealand", "Cape Verde", "Saudi Arabia", "Spain", "Uruguay", "France",
    "Iraq", "Norway", "Senegal", "Algeria", "Argentina", "Austria", "Jordan", "Colombia",
    "Democratic Republic of the Congo", "Portugal", "Uzbekistan", "Croatia", "England",
    "Ghana", "Panama"
];

const teamData = {};

// Specific deep data for Mexico
teamData["Mexico"] = {
  manager: "Javier Aguirre",
  captain: "Edson Álvarez",
  qualifiedVia: "Host Nation",
  appearances: 18,
  confederation: "CONCACAF",
  historicalStats: {
    matches: 96, wins: 52, draws: 23, losses: 21,
    goalsFor: 164, goalsAgainst: 87,
    highestRank: 4, bestFinish: "Quarter Finals",
    winRate: "46%", goalsScored: 62,
    mostCaps: "Andrés Guardado", topScorer: "Javier Hernández"
  },
  historyTimeline: [
    { year: "1930", result: "Group Stage" },
    { year: "1970", result: "Quarter Finals" },
    { year: "1986", result: "Quarter Finals" },
    { year: "1994", result: "Round of 16" },
    { year: "2018", result: "Round of 16" },
    { year: "2022", result: "Group Stage" }
  ],
  insights: [
    "Mexico have qualified for every World Cup since 1994.",
    "Mexico advanced from the group stage in seven consecutive tournaments (1994-2018).",
    "Mexico's average FIFA ranking over the last decade is #14."
  ],
  lineup: {
    formation: "4-2-3-1",
    startingXI: [
      { name: "Ochoa", position: "GK", number: 1, x: 50, y: 90 },
      { name: "Sánchez", position: "RB", number: 19, x: 85, y: 70 },
      { name: "Montes", position: "CB", number: 3, x: 65, y: 75 },
      { name: "Araujo", position: "CB", number: 2, x: 35, y: 75 },
      { name: "Gallardo", position: "LB", number: 23, x: 15, y: 70 },
      { name: "Álvarez", position: "CDM", number: 4, x: 65, y: 55 },
      { name: "Romo", position: "CDM", number: 7, x: 35, y: 55 },
      { name: "Antuna", position: "RW", number: 21, x: 85, y: 35 },
      { name: "Chávez", position: "CAM", number: 24, x: 50, y: 35 },
      { name: "Vega", position: "LW", number: 10, x: 15, y: 35 },
      { name: "Giménez", position: "ST", number: 11, x: 50, y: 15 }
    ],
    bench: ["Malagón", "Rangel", "Reyes", "Guzmán", "Arteaga", "Pineda", "Rodríguez", "Cortizo", "Huerta", "Quiñones"]
  }
};

// Specific deep data for South Africa
teamData["South Africa"] = {
  manager: "Hugo Broos",
  captain: "Ronwen Williams",
  qualifiedVia: "CAF Qualifiers Group C",
  appearances: 4,
  confederation: "CAF",
  historicalStats: {
    matches: 48, wins: 22, draws: 14, losses: 12,
    goalsFor: 72, goalsAgainst: 45,
    highestRank: 16, bestFinish: "Group Stage",
    winRate: "33%", goalsScored: 11,
    mostCaps: "Aaron Mokoena", topScorer: "Benni McCarthy"
  },
  historyTimeline: [
    { year: "1998", result: "Group Stage" },
    { year: "2002", result: "Group Stage" },
    { year: "2010", result: "Group Stage" }
  ],
  insights: [
    "South Africa hosted the first ever World Cup in Africa in 2010.",
    "Bafana Bafana's famous victory over France in 2010 remains their greatest WC memory.",
    "Percy Tau is their key attacking threat entering the 2026 tournament."
  ],
  lineup: {
    formation: "4-3-3",
    startingXI: [
      { name: "Williams", position: "GK", number: 1, x: 50, y: 90 },
      { name: "Mudau", position: "RB", number: 2, x: 85, y: 70 },
      { name: "Kekana", position: "CB", number: 5, x: 65, y: 75 },
      { name: "Mvala", position: "CB", number: 14, x: 35, y: 75 },
      { name: "Modiba", position: "LB", number: 6, x: 15, y: 70 },
      { name: "Sithole", position: "CM", number: 13, x: 65, y: 55 },
      { name: "Mokoena", position: "CM", number: 4, x: 35, y: 55 },
      { name: "Zwane", position: "CAM", number: 11, x: 50, y: 40 },
      { name: "Morena", position: "RW", number: 21, x: 85, y: 25 },
      { name: "Tau", position: "LW", number: 10, x: 15, y: 25 },
      { name: "Makgopa", position: "ST", number: 9, x: 50, y: 15 }
    ],
    bench: ["Mothwa", "Goss", "Mobbie", "Sibisi", "Xulu", "Adams", "Monare", "Maseko", "Mayambela", "Lepasa"]
  }
};

// Generic generator for other teams
const genericManagers = ["Roberto Martinez", "Luis de la Fuente", "Lionel Scaloni", "Didier Deschamps", "Gareth Southgate", "Julian Nagelsmann", "Gregg Berhalter"];
const confederations = {
  "Canada": "CONCACAF", "United States": "CONCACAF", "Brazil": "CONMEBOL", "Argentina": "CONMEBOL", "France": "UEFA", "England": "UEFA", "Spain": "UEFA", "Germany": "UEFA", "Japan": "AFC", "Morocco": "CAF"
};

teamsList.forEach(team => {
  if (teamData[team]) return; // Skip if already defined explicitly

  const confed = confederations[team] || "UEFA";
  teamData[team] = {
    manager: genericManagers[Math.floor(Math.random() * genericManagers.length)],
    captain: "Team Captain",
    qualifiedVia: `${confed} Qualification`,
    appearances: Math.floor(Math.random() * 10) + 1,
    confederation: confed,
    historicalStats: {
      matches: Math.floor(Math.random() * 50) + 20,
      wins: Math.floor(Math.random() * 20) + 10,
      draws: Math.floor(Math.random() * 15) + 5,
      losses: Math.floor(Math.random() * 15) + 5,
      goalsFor: Math.floor(Math.random() * 100) + 30,
      goalsAgainst: Math.floor(Math.random() * 80) + 20,
      highestRank: Math.floor(Math.random() * 30) + 1,
      bestFinish: "Round of 16",
      winRate: Math.floor(Math.random() * 30 + 30) + "%",
      goalsScored: Math.floor(Math.random() * 40) + 10,
      mostCaps: "Legendary Player",
      topScorer: "Legendary Striker"
    },
    historyTimeline: [
      { year: "2018", result: "Round of 16" },
      { year: "2022", result: "Group Stage" }
    ],
    insights: [
      `${team} is looking to make history at the 2026 World Cup.`,
      `They have a strong tactical setup under their current manager.`,
      `Fans are expecting a deep run into the knockout stages.`
    ],
    lineup: {
      formation: "4-3-3",
      startingXI: [
        { name: "GK", position: "GK", number: 1, x: 50, y: 90 },
        { name: "RB", position: "RB", number: 2, x: 85, y: 70 },
        { name: "CB1", position: "CB", number: 4, x: 65, y: 75 },
        { name: "CB2", position: "CB", number: 5, x: 35, y: 75 },
        { name: "LB", position: "LB", number: 3, x: 15, y: 70 },
        { name: "CM1", position: "CM", number: 8, x: 65, y: 55 },
        { name: "CM2", position: "CM", number: 6, x: 35, y: 55 },
        { name: "CAM", position: "CAM", number: 10, x: 50, y: 40 },
        { name: "RW", position: "RW", number: 7, x: 85, y: 25 },
        { name: "LW", position: "LW", number: 11, x: 15, y: 25 },
        { name: "ST", position: "ST", number: 9, x: 50, y: 15 }
      ],
      bench: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5", "Sub 6"]
    }
  };
});

fs.writeFileSync('src/data/team_profiles.json', JSON.stringify(teamData, null, 2));
console.log('Generated team_profiles.json successfully.');
