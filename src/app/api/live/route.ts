import { NextResponse } from "next/server";

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = "https://v3.football.api-sports.io";

// Target leagues: Premier League (39), La Liga (140), Bundesliga (78), Serie A (135), Ligue 1 (61), Champions League (2), Europa League (3), World Cup (1)
const TARGET_LEAGUES = "39-140-78-135-61-2-3-1";

export async function GET() {
  if (!API_FOOTBALL_KEY) {
    return NextResponse.json({ error: "API_FOOTBALL_KEY is not set." }, { status: 500 });
  }

  try {
    const res = await fetch(`${API_URL}/fixtures?live=${TARGET_LEAGUES}`, {
      headers: { "x-apisports-key": API_FOOTBALL_KEY },
      cache: "no-store", // Ensure real-time response
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch live scores");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Live Scores API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
