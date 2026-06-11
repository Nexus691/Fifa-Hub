/**
 * wiki_stats_scraper.cjs
 * 
 * Background crawler that fetches National Team Caps and Goals for players
 * by querying Wikipedia. Bypasses API-Football rate limits.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DATA_FILE = path.join(__dirname, 'src', 'data', 'team_profiles.json');
const USER_AGENT = 'FifaHub/1.0 (contact@example.com)';

// Helper to delay between requests to respect Wikipedia limits
const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchWikiStats(playerName, teamName) {
  try {
    // 1. Search for the player's Wikipedia page
    const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: { action: 'query', list: 'search', srsearch: `${playerName} footballer`, utf8: '', format: 'json' },
      headers: { 'User-Agent': USER_AGENT }
    });

    const searchResults = searchRes.data?.query?.search;
    if (!searchResults || searchResults.length === 0) return null;

    const title = searchResults[0].title;

    // 2. Fetch the raw wikitext for that page
    const pageRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: { action: 'query', prop: 'revisions', rvprop: 'content', rvsection: '0', titles: title, format: 'json' },
      headers: { 'User-Agent': USER_AGENT }
    });

    const pages = pageRes.data?.query?.pages;
    if (!pages) return null;
    
    const page = Object.values(pages)[0];
    if (!page.revisions || page.revisions.length === 0) return null;

    const wikitext = page.revisions[0]['*'];

    // 3. Extract all nationalteam, nationalcaps, nationalgoals entries
    const teams = [...wikitext.matchAll(/nationalteam(\d*)\s*=\s*(.*?)(?:\n|\|)/g)];
    const caps = [...wikitext.matchAll(/nationalcaps(\d*)\s*=\s*(.*?)(?:\n|\|)/g)];
    const goals = [...wikitext.matchAll(/nationalgoals(\d*)\s*=\s*(.*?)(?:\n|\|)/g)];

    // 4. Find the entry that corresponds to the current team
    let bestMatchIdx = ''; // default to the last one if we can't match name
    let highestIndex = -1;

    for (const teamMatch of teams) {
      const idx = teamMatch[1];
      const teamString = teamMatch[2].toLowerCase();
      // Keep track of the highest index (usually the senior team)
      if (idx !== '' && parseInt(idx) > highestIndex) {
        highestIndex = parseInt(idx);
        bestMatchIdx = idx;
      } else if (idx === '' && highestIndex === -1) {
        bestMatchIdx = '';
      }

      // If the wikicode explicitly mentions the team name (e.g. "Argentina")
      if (teamString.includes(teamName.toLowerCase()) && !teamString.includes('u20') && !teamString.includes('u23') && !teamString.includes('under-')) {
        bestMatchIdx = idx;
      }
    }

    // 5. Get the caps and goals for that index
    const capMatch = caps.find(c => c[1] === bestMatchIdx);
    const goalMatch = goals.find(g => g[1] === bestMatchIdx);

    const parseNum = (str) => {
      if (!str) return null;
      // Extract first number found, ignoring references like <ref> or {{efn}}
      const match = str.replace(/<ref.*?>.*?<\/ref>/g, '').match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    };

    const finalCaps = parseNum(capMatch?.[2]);
    const finalGoals = parseNum(goalMatch?.[2]);

    if (finalCaps !== null) {
      return { caps: finalCaps, goals: finalGoals || 0 };
    }
    return null;

  } catch (error) {
    console.error(`Error fetching wiki for ${playerName}: ${error.message}`);
    return null;
  }
}

async function runScraper() {
  console.log('Starting background Wikipedia player stats crawler...');
  let db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  let updatedCount = 0;

  for (const [teamName, teamData] of Object.entries(db)) {
    if (!teamData.lineup) continue;

    const allPlayers = [...(teamData.lineup.startingXI || []), ...(teamData.lineup.bench || [])];

    for (const player of allPlayers) {
      // Skip if already scraped (caps > 0)
      if (player.nationalStats && player.nationalStats.caps > 0) continue;
      // Skip if fake mock data (we know it's fake if no photoUrl)
      if (!player.photoUrl) continue;

      console.log(`Fetching stats for ${player.name} (${teamName})...`);
      const stats = await fetchWikiStats(player.name, teamName);
      
      if (stats) {
        player.nationalStats = {
          ...player.nationalStats,
          caps: stats.caps,
          goals: stats.goals
        };
        console.log(`  -> Caps: ${stats.caps}, Goals: ${stats.goals}`);
        updatedCount++;

        // Save progress every 5 players
        if (updatedCount % 5 === 0) {
          fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
        }
      } else {
        console.log(`  -> Not found`);
      }

      await delay(1200); // 1.2s delay to be polite to Wikipedia
    }
  }

  // Final save
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  console.log(`\nFinished crawling! Updated ${updatedCount} players.`);
}

runScraper();
