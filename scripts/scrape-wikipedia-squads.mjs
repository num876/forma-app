import fs from 'fs';
import path from 'path';

const LEAGUES = ["premier-league"];
const START_YEAR = 2000;
const END_YEAR = 2023;
const SQUADS_BASE_DIR = path.join(process.cwd(), 'src/lib/data/squads');

const nameMapping = {
  "Man City": "Manchester City",
  "Man United": "Manchester United",
  "Newcastle": "Newcastle United",
  "Charlton": "Charlton Athletic",
  "Bolton": "Bolton Wanderers",
  "Birmingham": "Birmingham City",
  "Tottenham": "Tottenham Hotspur",
  "Blackburn": "Blackburn Rovers",
  "Leicester": "Leicester City",
  "Leeds": "Leeds United",
  "Wolves": "Wolverhampton Wanderers",
  "West Ham": "West Ham United",
  "West Brom": "West Bromwich Albion",
  "Crystal Palace": "Crystal Palace",
  "Sunderland": "Sunderland",
  "Hull City": "Hull City",
  "Stoke": "Stoke City",
  "Swansea": "Swansea City",
  "Cardiff": "Cardiff City",
  "Norwich": "Norwich City",
  "QPR": "Queens Park Rangers",
  "Reading": "Reading",
  "Wigan": "Wigan Athletic",
  "Blackpool": "Blackpool",
  "Derby": "Derby County",
  "Sheffield Utd": "Sheffield United",
  "Nott'm Forest": "Nottingham Forest",
  "Bournemouth": "AFC Bournemouth"
};

async function fetchWikiTitle(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'FormaScraper/1.0 (contact@forma.test)' }});
    const data = await res.json();
    if (data && data.query && data.query.search && data.query.search.length > 0) {
      return data.query.search[0].title;
    }
  } catch (e) {
  }
  return null;
}

async function fetchWikiText(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'FormaScraper/1.0 (contact@forma.test)' }});
    const data = await res.json();
    if (data && data.parse && data.parse.wikitext) {
      return data.parse.wikitext['*'];
    }
  } catch (e) {
  }
  return null;
}

function parseWikiPos(pos) {
  pos = (pos || '').toUpperCase().trim();
  if (['GK', 'GOALKEEPER'].includes(pos)) return 'GK';
  if (['DF', 'DEF', 'DEFENDER'].includes(pos)) return 'DEF';
  if (['MF', 'MID', 'MIDFIELDER'].includes(pos)) return 'MID';
  if (['FW', 'ATT', 'ATTACKER', 'ST'].includes(pos)) return 'ATT';
  return 'UNK';
}

function extractPlayersFromWikitext(wikitext) {
  const players = [];
  const lines = wikitext.split('\n');
  for (const line of lines) {
    const lLower = line.toLowerCase();
    
    // Pattern 1: {{Fs player|...}}
    if (lLower.includes('{{fs player') || lLower.includes('{{football squad player')) {
      const argsStr = line.replace(/\{\{(?:Fs player|fs player|football squad player)\|/i, '').replace(/\}\}.*/, '');
      const args = {};
      const parts = argsStr.split('|');
      for (const part of parts) {
        const idx = part.indexOf('=');
        if (idx !== -1) {
          const key = part.substring(0, idx).trim().toLowerCase();
          const val = part.substring(idx + 1).trim();
          args[key] = val;
        }
      }

      if (args.name && args.pos) {
        let name = args.name;
        if (name.includes('[[')) {
          const inner = name.replace(/\[\[(.*?)\]\]/g, '$1');
          const split = inner.split('|');
          name = split[split.length - 1]; // get the display name
        }
        name = name.replace(/<ref[^>]*>.*?<\/ref>/gi, '').trim();

        const position = parseWikiPos(args.pos);
        const nationality = args.nat || "Unknown";

        if (!players.find(p => p.name === name)) {
          players.push({
            id: Math.floor(Math.random() * 1000000) + 1000000,
            name,
            position,
            nationality,
            age: "N/A"
          });
        }
      }
    } 
    // Pattern 2: Raw wikitable rows (e.g. |1||GK||{{flagicon|FRA|1974}} [[Fabien Barthez]])
    else if (/^\|\s*\d*\s*\|\|\s*(GK|DF|MF|FW|GK|DEF|MID|ATT)\s*\|\|/i.test(line)) {
      const match = line.match(/^\|\s*\d*\s*\|\|\s*(GK|DF|MF|FW|GK|DEF|MID|ATT)\s*\|\|([\s\S]*?)\[\[(.*?)\]\]/i);
      if (match) {
        const position = parseWikiPos(match[1]);
        let nameField = match[3];
        let name = nameField;
        if (name.includes('|')) {
          const split = name.split('|');
          name = split[split.length - 1];
        }
        name = name.replace(/<ref[^>]*>.*?<\/ref>/gi, '').trim();
        
        let nationality = "Unknown";
        const natMatch = match[2].match(/flagicon\|([A-Z]{3})/i);
        if (natMatch) {
          nationality = natMatch[1];
        }
        
        if (!players.find(p => p.name === name)) {
          players.push({
            id: Math.floor(Math.random() * 1000000) + 1000000,
            name,
            position,
            nationality,
            age: "N/A"
          });
        }
      }
    }
  }
  return players;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Starting Wikipedia backfill with Search API...");

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    const seasonStr = `${year}-${year + 1}`;
    const seasonDir = path.join(SQUADS_BASE_DIR, seasonStr);
    if (!fs.existsSync(seasonDir)) continue;

    for (const league of LEAGUES) {
      const file = path.join(seasonDir, `${league}.json`);
      if (!fs.existsSync(file)) continue;

      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      let updated = false;

      for (const team of Object.keys(data)) {
        if (data[team] && data[team].length >= 20) continue; 

        let fullName = nameMapping[team] || team;
        const shortYear2 = String(year + 1).slice(-2);
        
        const searchQuery = `${year}-${shortYear2} ${fullName} season`;
        
        const title = await fetchWikiTitle(searchQuery);

        if (title && title.includes(year.toString())) {
          const wikitext = await fetchWikiText(title);
          
          if (wikitext && (/\{\{fs player/i.test(wikitext) || /\{\{football squad player/i.test(wikitext) || /\|\|\s*(GK|DF|MF|FW)\s*\|\|/i.test(wikitext))) {
            const players = extractPlayersFromWikitext(wikitext);
            if (players.length > 10) {
              console.log(`[${seasonStr}] SUCCESS: Found ${players.length} players for ${team} via wiki search (${title})`);
              if (players.length > (data[team] ? data[team].length : 0)) {
                 data[team] = players;
                 updated = true;
              } else {
                 console.log(`  -> Kept API data as it had more players (${data[team].length})`);
              }
            } else {
              console.log(`[${seasonStr}] FAIL: Parsed 0 players from ${title}`);
            }
          } else {
            console.log(`[${seasonStr}] FAIL: Wikipedia page found (${title}) but no Fs player templates for ${team}`);
          }
        } else {
          console.log(`[${seasonStr}] FAIL: No valid Wikipedia page found for ${searchQuery} (got ${title})`);
        }
        await delay(1500); // 1.5s delay to prevent "Too many requests" from Wikipedia
      }

      if (updated) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
      }
    }
  }

  console.log("Wikipedia backfill complete!");
}

run();
