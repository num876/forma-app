import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LEAGUES = ["premier-league", "la-liga", "bundesliga", "serie-a", "ligue-1"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team");
  const season = searchParams.get("season");

  if (!team || !season) {
    return NextResponse.json({ error: "Missing team or season parameter" }, { status: 400 });
  }

  try {
    const seasonDir = path.join(process.cwd(), "src/lib/data/squads", season);

    if (!fs.existsSync(seasonDir)) {
      // The mass scraper hasn't reached this season yet
      return NextResponse.json([]);
    }

    // Search through the league files for this season to find the team
    for (const league of LEAGUES) {
      const filePath = path.join(seasonDir, `${league}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const fileData = fs.readFileSync(filePath, "utf-8");
          const leagueData = JSON.parse(fileData);
          
          if (leagueData[team] && Array.isArray(leagueData[team])) {
            // Found the team's squad!
            return NextResponse.json(leagueData[team]);
          }
        } catch (e) {
          console.error(`Error reading ${filePath}:`, e);
        }
      }
    }

    // If we loop through all leagues and don't find the team, try fetching from API-Football
    const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
    const API_URL = "https://v3.football.api-sports.io";

    if (API_FOOTBALL_KEY) {
      // 1. Get the team ID
      const teamRes = await fetch(`${API_URL}/teams?name=${team}`, {
        headers: { "x-apisports-key": API_FOOTBALL_KEY }
      });
      const teamData = await teamRes.json();
      if (teamData.response && teamData.response.length > 0) {
        const teamId = teamData.response[0].team.id;
        
        // 2. Get the squad
        const squadRes = await fetch(`${API_URL}/players/squads?team=${teamId}`, {
          headers: { "x-apisports-key": API_FOOTBALL_KEY }
        });
        const squadData = await squadRes.json();
        if (squadData.response && squadData.response.length > 0) {
          const players = squadData.response[0].players.map((p: any) => {
            let position = "UNK";
            if (p.position === "Goalkeeper") position = "GK";
            else if (p.position === "Defender") position = "DEF";
            else if (p.position === "Midfielder") position = "MID";
            else if (p.position === "Attacker") position = "ATT";

            return {
              id: p.id,
              name: p.name,
              position: position,
              nationality: "Unknown", // API-Football squads endpoint doesn't give nationality unfortunately, but it's better than empty
              age: p.age || "N/A"
            };
          });
          return NextResponse.json(players);
        }
      }
    }

    return NextResponse.json([]);

  } catch (error) {
    console.error("Database read error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
