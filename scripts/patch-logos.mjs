import fs from 'fs';
import path from 'path';

const API_KEY = '7072e430e5bad9eceb45046b6750a7d2';
const queries = {
  'Munich 1860': '1860 Munchen', 
  'Ein Frankfurt': 'Eintracht Frankfurt', 
  'Ath Bilbao': 'Athletic Club', 
  'Paris SG': 'Paris Saint Germain', 
  "M'gladbach": 'Borussia Monchengladbach', 
  'St Pauli': 'St. Pauli', 
  'Ath Madrid': 'Atletico Madrid', 
  'Sp Gijon': 'Sporting Gijon', 
  'Evian Thonon Gaillard': 'Evian', 
  'Ajaccio GFCO': 'Gazelec Ajaccio', 
  "Nott'm Forest": 'Nottingham Forest'
};

async function run() { 
  const logosPath = path.join(process.cwd(), 'src/lib/data/team_logos.json');
  const logos = JSON.parse(fs.readFileSync(logosPath, 'utf8')); 
  
  for (const [team, query] of Object.entries(queries)) { 
    const res = await fetch('https://v3.football.api-sports.io/teams?search='+encodeURIComponent(query), {headers:{'x-apisports-key': API_KEY}}); 
    const data = await res.json(); 
    if (data.response && data.response.length > 0) { 
      logos[team] = data.response[0].team.logo; 
      console.log('Found', team, '->', data.response[0].team.logo); 
    } else { 
      console.log('STILL NOT FOUND:', team); 
    } 
    await new Promise(r => setTimeout(r, 200)); 
  } 
  
  fs.writeFileSync(logosPath, JSON.stringify(logos, null, 2)); 
  console.log('Patched team_logos.json'); 
}

run();
