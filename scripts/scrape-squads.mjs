import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEAGUES = ["premier-league", "la-liga", "bundesliga", "serie-a", "ligue-1"];
const SEASONS = ["2000-2001"];

const DATA_DIR = path.join(__dirname, "../src/lib/data/squads");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeSquad(team, season) {
  try {
    const querySeason = season.length === 9 ? `${season.substring(0, 4)}-${season.substring(7)}` : season;
    const query = `${querySeason} ${team} season`;

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData || !searchData[3] || searchData[3].length === 0) {
      return []; 
    }

    const pageUrl = searchData[3][0];
    
    // Polite delay before second fetch
    await sleep(1000);

    const pageRes = await fetch(pageUrl);
    const html = await pageRes.text();
    const $ = cheerio.load(html);

    const squad = [];
    let idCounter = 1;

    $('tr.vcard').each((_, el) => {
      let position = $(el).find('td').filter((i, td) => {
        const text = $(td).text().trim().toUpperCase();
        return ['GK', 'DF', 'MF', 'FW', 'FWD', 'MID', 'DEF'].includes(text);
      }).first().text().trim().toUpperCase();

      if (position === 'DF') position = 'DEF';
      if (position === 'MF') position = 'MID';
      if (position === 'FW' || position === 'FWD') position = 'ATT';
      if (!position) position = 'UNK';

      const nameNode = $(el).find('.fn').first();
      let name = nameNode.text().trim();
      if (!name) {
         const link = $(el).find('th[scope="row"] a').first() || $(el).find('td a').first();
         name = link.text().trim();
      }

      let nationality = $(el).find('.flagicon a').attr('title') || $(el).find('.flagicon img').attr('alt') || "Unknown";
      if (nationality.includes("national")) nationality = nationality.split(" national")[0];

      if (name && position !== 'UNK') {
        squad.push({
          id: idCounter++,
          name,
          position,
          nationality,
          age: "N/A"
        });
      }
    });

    const uniqueSquad = squad.filter((player, index, self) =>
      index === self.findIndex((t) => t.name === player.name)
    );

    return uniqueSquad;
  } catch (err) {
    console.error(`Error scraping ${team} ${season}:`, err.message);
    return [];
  }
}

async function run() {
  console.log("Starting Mass Scraper...");
  
  for (const season of SEASONS) {
    const seasonDir = path.join(DATA_DIR, season);
    if (!fs.existsSync(seasonDir)) fs.mkdirSync(seasonDir, { recursive: true });

    for (const league of LEAGUES) {
      const outFile = path.join(seasonDir, `${league}.json`);
      let leagueData = {};
      
      // Load existing data to resume safely
      if (fs.existsSync(outFile)) {
        try {
          leagueData = JSON.parse(fs.readFileSync(outFile, "utf-8"));
        } catch(e) {}
      }

      console.log(`Processing ${league} ${season}...`);
      
      // 1. Fetch CSV for teams
      const csvUrl = `https://raw.githubusercontent.com/Kenzo911/european-football-standings/main/standings/${league}/${season}.csv`;
      let res;
      try {
        res = await fetch(csvUrl);
      } catch(e) {
        console.error(`Failed to fetch CSV for ${league} ${season}`);
        continue;
      }
      
      if (!res.ok) {
        console.log(`Skipping ${league} ${season} - no CSV found.`);
        continue;
      }

      const csvText = await res.text();
      const rows = csvText.trim().split('\n').slice(1);
      
      const teams = rows.map(row => row.split(',')[1]).filter(Boolean);

      for (const team of teams) {
        if (leagueData[team] && leagueData[team].length > 0) {
          // Already scraped
          continue;
        }

        console.log(`  Scraping squad: ${team} (${season})...`);
        const squad = await scrapeSquad(team, season);
        
        leagueData[team] = squad;
        fs.writeFileSync(outFile, JSON.stringify(leagueData, null, 2));

        // Strict rate limit delay to avoid Wikipedia bans
        await sleep(4000); 
      }
    }
  }

  console.log("Mass Scraping Complete!");
}

run().catch(console.error);
