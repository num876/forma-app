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

    // If we loop through all leagues and don't find the team
    return NextResponse.json([]);

  } catch (error) {
    console.error("Database read error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
