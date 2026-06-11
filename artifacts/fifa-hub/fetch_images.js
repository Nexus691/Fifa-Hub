const stadiums = [
  "MetLife Stadium",
  "AT&T Stadium",
  "Arrowhead Stadium",
  "Mercedes-Benz Stadium",
  "Gillette Stadium",
  "NRG Stadium",
  "SoFi Stadium",
  "Lincoln Financial Field",
  "Levi's Stadium",
  "Lumen Field",
  "Hard Rock Stadium",
  "Estadio Azteca",
  "Estadio BBVA",
  "Estadio Akron",
  "BC Place",
  "BMO Field"
];

async function fetchWikiImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== "-1" && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
  } catch (e) {
    console.error("Error fetching", title, e);
  }
  return null;
}

async function run() {
  const results = {};
  for (const s of stadiums) {
    const img = await fetchWikiImage(s);
    results[s] = img;
  }
  console.log(JSON.stringify(results, null, 2));
}

run();
