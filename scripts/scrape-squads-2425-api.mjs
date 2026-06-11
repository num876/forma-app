import fs from 'fs';
import path from 'path';

const API_KEY = '7072e430e5bad9eceb45046b6750a7d2';
const LEAGUES = ["premier-league", "la-liga", "bundesliga", "serie-a", "ligue-1"];
const SEASON = "2024-2025";
const SQUADS_DIR = path.join(process.cwd(), 'src/lib/data/squads', SEASON);
const LOGOS_FILE = path.join(process.cwd(), 'src/lib/data/team_logos.json');

const logos = JSON.parse(fs.readFileSync(LOGOS_FILE, 'utf8'));

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mapPos(pos) {
  if (pos === "Goalkeeper") return "GK";
  if (pos === "Defender") return "DEF";
  if (pos === "Midfielder") return "MID";
  if (pos === "Attacker") return "ATT";
  return "UNK";
}

async function run() {
  for (const league of LEAGUES) {
    const file = path.join(SQUADS_DIR, `${league}.json`);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    let updated = false;

    for (const team of Object.keys(data)) {
      if (data[team] && data[team].length > 0) continue; // Skip if already scraped correctly

      const logoUrl = logos[team];
      if (!logoUrl) continue;

      const teamId = logoUrl.split('/').pop().replace('.png', '');
      console.log(`Fetching squad for ${team} (ID: ${teamId})...`);

      try {
        const res = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, {
          headers: { 'x-apisports-key': API_KEY }
        });
        const resData = await res.json();

        if (resData.response && resData.response.length > 0) {
          const players = resData.response[0].players.map(p => ({
            id: p.id,
            name: p.name,
            position: mapPos(p.position),
            nationality: "Unknown", // API squads endpoint doesn't return nationality
            age: p.age || "N/A"
          }));
          data[team] = players;
          updated = true;
          console.log(`  -> Saved ${players.length} players.`);
        }
      } catch (e) {
        console.error(`Error for ${team}:`, e);
      }
      
      await delay(200); // Respect API limit
    }

    if (updated) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      console.log(`Updated ${league}.json`);
    }
  }
}

run();
