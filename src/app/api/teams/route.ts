import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  const season = searchParams.get("season");

  if (!league || !season) {
    return NextResponse.json({ error: "Missing league or season" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "src", "lib", "data", "squads", season, `${league}.json`);

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const leagueData = JSON.parse(fileContents);
      const teams = Object.keys(leagueData).sort();
      return NextResponse.json({ teams });
    }

    // If local JSON doesn't exist (e.g., Champions League, World Cup), extract teams from the history API
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001';
    const historyUrl = `${baseUrl}/api/history?league=${league}&season=${season}`;
    
    const historyRes = await fetch(historyUrl);
    if (!historyRes.ok) {
      return NextResponse.json({ teams: [] });
    }

    const historyData = await historyRes.json();
    const teamSet = new Set<string>();

    if (historyData.type === "tournament") {
      if (historyData.groups) {
        historyData.groups.forEach((group: any) => {
          group.standings.forEach((team: any) => teamSet.add(team.team_name));
        });
      }
      if (historyData.knockout) {
        historyData.knockout.forEach((round: any) => {
          round.matches.forEach((match: any) => {
            teamSet.add(match.homeTeam);
            teamSet.add(match.awayTeam);
          });
        });
      }
    } else if (historyData.type === "league") {
      historyData.standings.forEach((team: any) => teamSet.add(team.team_name));
    }

    const teams = Array.from(teamSet).sort();
    return NextResponse.json({ teams });

  } catch (error) {
    console.error("Error reading squads for teams list:", error);
    return NextResponse.json({ error: "Failed to read squad data" }, { status: 500 });
  }
}
