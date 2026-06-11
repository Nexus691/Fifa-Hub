/**
 * fix_starting_xi.cjs
 * 
 * Cross-references predicted starting XIs from web research with our
 * real API-Football squad data, and reorders players so the correct
 * starters are in the starting XI with proper pitch positions.
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'src', 'data', 'team_profiles.json');
const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

// Predicted starting XI names from web research (June 2026)
// Key = team name in our DB, Value = array of 11 starter LAST NAMES or partial names
const PREDICTED_XI = {
  "Brazil": {
    formation: "4-2-3-1",
    starters: ["Alisson", "Danilo", "Marquinhos", "Gabriel", "Alex Sandro", "Casemiro", "Bruno Guimarães", "Paquetá", "Raphinha", "Vinícius", "Igor"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:20,y:25}, {x:50,y:15}
    ]
  },
  "Argentina": {
    formation: "4-3-3",
    starters: ["Martínez", "Molina", "Romero", "Lisandro", "Tagliafico", "De Paul", "Mac Allister", "Enzo", "Messi", "Álvarez", "Lautaro"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:75,y:45}, {x:50,y:55}, {x:25,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "France": {
    formation: "4-3-3",
    starters: ["Maignan", "Koundé", "Upamecano", "Saliba", "Hernández", "Tchouaméni", "Kanté", "Camavinga", "Dembélé", "Mbappé", "Olise"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "England": {
    formation: "4-2-3-1",
    starters: ["Pickford", "James", "Guéhi", "Konsa", "O'Reilly", "Rice", "Bellingham", "Anderson", "Saka", "Kane", "Rashford"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  },
  "Spain": {
    formation: "4-3-3",
    starters: ["Simón", "Llorente", "Cubarsí", "Laporte", "Cucurella", "Rodri", "Pedri", "Fabián", "Yamal", "Oyarzabal", "Williams"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Germany": {
    formation: "4-2-3-1",
    starters: ["Neuer", "Kimmich", "Rüdiger", "Tah", "Raum", "Pavlović", "Goretzka", "Wirtz", "Musiala", "Havertz", "Sané"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  },
  "Portugal": {
    formation: "4-3-3",
    starters: ["Diogo Costa", "Dalot", "Rúben Dias", "Inácio", "Nuno Mendes", "Vitinha", "Bruno Fernandes", "João Neves", "Bernardo", "Ronaldo", "Leão"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Netherlands": {
    formation: "4-3-3",
    starters: ["Verbruggen", "Dumfries", "van Dijk", "van de Ven", "Aké", "Gravenberch", "de Jong", "Reijnders", "Gakpo", "Depay", "Malen"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Belgium": {
    formation: "4-3-3",
    starters: ["Courtois", "Castagne", "Mechele", "Theate", "De Cuyper", "Tielemans", "Witsel", "De Bruyne", "Trossard", "Lukaku", "Doku"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Croatia": {
    formation: "4-2-3-1",
    starters: ["Livaković", "Stanišić", "Šutalo", "Ćaleta-Car", "Gvardiol", "Sučić", "Modrić", "Pašalić", "Kramarić", "Budimir", "Perišić"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  },
  "United States": {
    formation: "4-3-3",
    starters: ["Freese", "Freeman", "McKenzie", "Richards", "Robinson", "McKennie", "Adams", "Tillman", "Weah", "Balogun", "Pulisic"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:75,y:45}, {x:50,y:55}, {x:25,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Mexico": {
    formation: "4-3-3",
    starters: ["Acevedo", "Sánchez", "Montes", "Vásquez", "Gallardo", "Álvarez", "Romo", "Fidalgo", "Quiñones", "Jiménez", "Vega"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Japan": {
    formation: "4-2-3-1",
    starters: ["Suzuki", "Sugawara", "Watanabe", "Taniguchi", "Ito", "Endo", "Sano", "Doan", "Nakamura", "Ueda", "Ito"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  },
  "South Korea": {
    formation: "4-2-3-1",
    starters: ["Seung-gyu", "Young-woo", "Min-jae", "Han-beom", "Tae-seok", "Seung-ho", "In-beom", "Kang-in", "Jae-sung", "Hee-chan", "Heung-min"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  },
  "Morocco": {
    formation: "4-2-3-1",
    starters: ["Bono", "Hakimi", "Diop", "Aguerd", "Mazraoui", "Azzouzi", "Bouchouari", "Díaz", "El Khannouss", "Akhomach", "El Kaabi"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  },
  "Switzerland": {
    formation: "4-3-3",
    starters: ["Kobel", "Widmer", "Elvedi", "Akanji", "Rodriguez", "Freuler", "Xhaka", "Sow", "Ndoye", "Embolo", "Vargas"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Canada": {
    formation: "4-3-3",
    starters: ["Crépeau", "Johnston", "Cornelius", "Bombito", "Laryea", "Buchanan", "Eustáquio", "Koné", "Davies", "David", "Larin"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:75,y:45}, {x:50,y:55}, {x:25,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Uruguay": {
    formation: "4-3-3",
    starters: ["Rochet", "Varela", "Giménez", "Araújo", "Olivera", "Pellistri", "Ugarte", "Valverde", "Arrascaeta", "Núñez", "Araújo"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:75,y:45}, {x:50,y:55}, {x:25,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Egypt": {
    formation: "4-3-3",
    starters: ["Shenawy", "Hany", "Ibrahim", "Rabia", "Fattouh", "Attia", "Fathi", "Ashour", "Salah", "Mostafa", "Marmoush"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Senegal": {
    formation: "4-3-3",
    starters: ["Mendy", "Diatta", "Koulibaly", "Niakhate", "Diouf", "Sarr", "Gueye", "Camara", "Sarr", "Jackson", "Mané"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Colombia": {
    formation: "4-2-3-1",
    starters: ["Montero", "Arias", "Sánchez", "Lucumí", "Mojica", "Lerma", "Ríos", "Arias", "Rodríguez", "Díaz", "Durán"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  },
  "Saudi Arabia": {
    formation: "4-3-3",
    starters: ["Al-Aqidi", "Boushal", "Tambakti", "Al-Amri", "Al-Harbi", "Kanno", "Al-Khaibari", "Al-Dawsari", "Mandash", "Al-Buraikan", "Al-Dawsari"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:50,y:55}, {x:70,y:45}, {x:30,y:45}, {x:85,y:20}, {x:50,y:15}, {x:15,y:20}
    ]
  },
  "Australia": {
    formation: "5-4-1",
    starters: ["Ryan", "Atkinson", "Degenek", "Souttar", "Circati", "Bos", "Metcalfe", "Baccus", "Irvine", "Irankunda", "Yengi"],
    positions: [
      {x:50,y:90}, {x:90,y:70}, {x:70,y:75}, {x:50,y:78}, {x:30,y:75}, {x:10,y:70},
      {x:75,y:45}, {x:55,y:50}, {x:35,y:50}, {x:25,y:45}, {x:50,y:15}
    ]
  },
  "Algeria": {
    formation: "4-2-3-1",
    starters: ["Mandrea", "Belghali", "Belaïd", "Bensebaini", "Aït-Nouri", "Zerrouki", "Boudaoui", "Mahrez", "Aouar", "Chaïbi", "Gouiri"],
    positions: [
      {x:50,y:90}, {x:85,y:70}, {x:65,y:75}, {x:35,y:75}, {x:15,y:70},
      {x:60,y:55}, {x:40,y:55}, {x:50,y:40}, {x:80,y:25}, {x:50,y:15}, {x:20,y:25}
    ]
  }
};

// ── Fuzzy name matching ──
function nameMatch(squadName, searchName) {
  const a = squadName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const b = searchName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Exact match
  if (a === b) return true;
  // Contains
  if (a.includes(b) || b.includes(a)) return true;
  // Last name match
  const aLast = a.split(' ').pop();
  const bLast = b.split(' ').pop();
  if (aLast === bLast && bLast.length > 2) return true;
  // First significant word match
  const aWords = a.split(' ');
  const bWords = b.split(' ');
  for (const w of bWords) {
    if (w.length > 3 && aWords.some(aw => aw === w)) return true;
  }
  return false;
}

let totalFixed = 0;

for (const [teamName, predicted] of Object.entries(PREDICTED_XI)) {
  if (!db[teamName] || !db[teamName].lineup) {
    console.log(`⚠️  ${teamName} not in DB, skipping`);
    continue;
  }

  const allPlayers = [...db[teamName].lineup.startingXI, ...db[teamName].lineup.bench];
  const newStarters = [];
  const usedIndices = new Set();

  // For each predicted starter, find the matching player in our squad
  for (const starterName of predicted.starters) {
    let foundIdx = -1;
    for (let i = 0; i < allPlayers.length; i++) {
      if (!usedIndices.has(i) && nameMatch(allPlayers[i].name, starterName)) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx >= 0) {
      usedIndices.add(foundIdx);
      newStarters.push(allPlayers[foundIdx]);
    }
  }

  if (newStarters.length < 8) {
    console.log(`⚠️  ${teamName}: Only matched ${newStarters.length}/11 starters, skipping to avoid bad data`);
    continue;
  }

  // Fill remaining starter slots if we couldn't match all 11
  if (newStarters.length < 11) {
    for (let i = 0; i < allPlayers.length && newStarters.length < 11; i++) {
      if (!usedIndices.has(i)) {
        usedIndices.add(i);
        newStarters.push(allPlayers[i]);
      }
    }
  }

  // Everyone else goes to bench
  const newBench = allPlayers.filter((_, i) => !usedIndices.has(i));

  // Apply pitch positions
  newStarters.forEach((p, i) => {
    p.x = predicted.positions[i]?.x || 50;
    p.y = predicted.positions[i]?.y || 50;
  });

  db[teamName].lineup.formation = predicted.formation;
  db[teamName].lineup.startingXI = newStarters;
  db[teamName].lineup.bench = newBench;

  console.log(`✅ ${teamName}: ${newStarters.length}/11 starters matched — ${newStarters.map(p => p.name).join(', ')}`);
  totalFixed++;
}

fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
console.log(`\n🏆 Done! Fixed ${totalFixed} teams with predicted starting XIs.`);
