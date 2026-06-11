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
    if (!fs.existsSync(filePath)) {
      // Scraper hasn't reached here yet or data doesn't exist
      return NextResponse.json({ teams: [] });
    }

    const fileContents = fs.readFileSync(filePath, "utf-8");
    const leagueData = JSON.parse(fileContents);
    
    // Extract just the team names and sort them alphabetically
    const teams = Object.keys(leagueData).sort();

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Error reading squads for teams list:", error);
    return NextResponse.json({ error: "Failed to read squad data" }, { status: 500 });
  }
}
