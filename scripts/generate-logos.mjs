import fs from 'fs';
import path from 'path';

const API_KEY = '7072e430e5bad9eceb45046b6750a7d2';
const SQUADS_DIR = path.join(process.cwd(), 'src/lib/data/squads');
const OUTPUT_FILE = path.join(process.cwd(), 'src/lib/data/team_logos.json');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchLogos() {
  const teams = new Set();
  
  // 1. Extract all unique team names from squads directory
  if (fs.existsSync(SQUADS_DIR)) {
    const seasons = fs.readdirSync(SQUADS_DIR);
    for (const season of seasons) {
      const leagues = fs.readdirSync(path.join(SQUADS_DIR, season));
      for (const league of leagues) {
        if (league.endsWith('.json')) {
          const data = JSON.parse(fs.readFileSync(path.join(SQUADS_DIR, season, league), 'utf8'));
          Object.keys(data).forEach(team => teams.add(team));
        }
      }
    }
  }

  const teamList = Array.from(teams);
  console.log(`Found ${teamList.length} unique teams. Fetching logos...`);

  const teamLogos = {};
  
  // Add some known fallbacks to reduce API calls
  teamLogos["Man City"] = "https://media.api-sports.io/football/teams/50.png";
  teamLogos["Man United"] = "https://media.api-sports.io/football/teams/33.png";
  teamLogos["Spurs"] = "https://media.api-sports.io/football/teams/47.png";

  let i = 0;
  for (const team of teamList) {
    if (teamLogos[team]) continue;
    
    try {
      const res = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(team)}`, {
        headers: { 'x-apisports-key': API_KEY }
      });
      const data = await res.json();
      
      if (data.response && data.response.length > 0) {
        teamLogos[team] = data.response[0].team.logo;
      } else {
        console.log(`Logo not found for ${team}`);
      }
    } catch (e) {
      console.error(`Error fetching ${team}:`, e);
    }
    
    i++;
    if (i % 10 === 0) console.log(`Processed ${i}/${teamList.length}`);
    await delay(150); // Avoid rate limit (max 10 req/sec)
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(teamLogos, null, 2));
  console.log(`Saved ${Object.keys(teamLogos).length} logos to team_logos.json`);
}

fetchLogos();
