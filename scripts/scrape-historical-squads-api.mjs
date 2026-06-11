import fs from 'fs';
import path from 'path';

const API_KEY = '7072e430e5bad9eceb45046b6750a7d2';
const LEAGUES = ["premier-league", "la-liga", "bundesliga", "serie-a", "ligue-1"];
const START_YEAR = 2000;
const END_YEAR = 2023;
const SQUADS_BASE_DIR = path.join(process.cwd(), 'src/lib/data/squads');
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
  console.log("Starting massive historical backfill from API-Football...");

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
        // If the squad already has a substantial number of players, skip it.
        // But since Wikipedia scraper failed for almost everything, we fetch if length < 15
        if (data[team] && data[team].length >= 15) continue; 

        const logoUrl = logos[team];
        if (!logoUrl) {
          console.log(`[${seasonStr}] Skipping ${team}: No API ID found.`);
          continue;
        }

        const teamId = logoUrl.split('/').pop().replace('.png', '');
        console.log(`[${seasonStr}] Fetching squad for ${team} (ID: ${teamId})...`);

        let playersMap = new Map();
        let page = 1;
        let totalPages = 1;
        let success = true;

        while (page <= totalPages) {
          try {
            const url = `https://v3.football.api-sports.io/players?team=${teamId}&season=${year}&page=${page}`;
            const res = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
            const resData = await res.json();

            if (resData.errors && Object.keys(resData.errors).length > 0) {
              console.error(`API Error for ${team}:`, resData.errors);
              success = false;
              break;
            }

            if (resData.paging) {
              totalPages = resData.paging.total;
            }

            if (resData.response && resData.response.length > 0) {
              for (const item of resData.response) {
                const p = item.player;
                const stats = item.statistics && item.statistics.length > 0 ? item.statistics[0] : null;
                const pos = stats && stats.games && stats.games.position ? stats.games.position : "Unknown";
                
                if (!playersMap.has(p.id)) {
                  playersMap.set(p.id, {
                    id: p.id,
                    name: p.name,
                    position: mapPos(pos),
                    nationality: p.nationality || "Unknown",
                    age: p.age || "N/A"
                  });
                }
              }
            }
          } catch (e) {
            console.error(`Exception fetching ${team} page ${page}:`, e);
            success = false;
            break;
          }
          
          page++;
          await delay(200); // Strict rate limit 5 req/sec (Limit is 10/s)
        }

        if (success && playersMap.size > 0) {
          data[team] = Array.from(playersMap.values());
          updated = true;
          console.log(`  -> Saved ${data[team].length} players for ${team}.`);
        } else if (success && playersMap.size === 0) {
          console.log(`  -> API returned 0 players for ${team}.`);
        }
      }

      if (updated) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
      }
    }
  }

  console.log("Historical backfill complete!");
}

run();
