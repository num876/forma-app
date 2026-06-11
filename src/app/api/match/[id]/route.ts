import { NextResponse } from "next/server";

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = "https://v3.football.api-sports.io";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const matchId = params.id;

  if (!API_FOOTBALL_KEY) {
    return NextResponse.json({ error: "API_FOOTBALL_KEY is not set." }, { status: 500 });
  }

  try {
    const headers = { "x-apisports-key": API_FOOTBALL_KEY };

    // 1. Fetch Core Match Details & Lineups
    const matchRes = await fetch(`${API_URL}/fixtures?id=${matchId}`, { headers, cache: "no-store" });
    const matchData = await matchRes.json();

    if (!matchData.response || matchData.response.length === 0) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const fixtureInfo = matchData.response[0];
    const homeTeamId = fixtureInfo.teams.home.id;
    const awayTeamId = fixtureInfo.teams.away.id;

    // 2. Fetch Head-to-Head (Last 5)
    const h2hRes = await fetch(`${API_URL}/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}&last=5`, { headers, cache: "no-store" });
    const h2hData = await h2hRes.json();

    const h2h = h2hData.response || [];

    return NextResponse.json({
      match: fixtureInfo,
      h2h
    });
  } catch (error) {
    console.error("Match API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
