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
    const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
    const API_URL = "https://v3.football.api-sports.io";

    if (!API_FOOTBALL_KEY) {
      return NextResponse.json({ error: "API-Football key missing" }, { status: 500 });
    }

    const queryYear = season.split('-')[0];

    // 1. Get the team ID
    const teamRes = await fetch(`${API_URL}/teams?name=${team}`, {
      headers: { "x-apisports-key": API_FOOTBALL_KEY },
      next: { revalidate: 86400 } // Cache for 24h
    });
    const teamData = await teamRes.json();
    
    if (!teamData.response || teamData.response.length === 0) {
      return NextResponse.json([]);
    }
    
    const teamId = teamData.response[0].team.id;
    
    // 2. Fetch Page 1 of players
    const fetchPage = async (page: number) => {
      const res = await fetch(`${API_URL}/players?team=${teamId}&season=${queryYear}&page=${page}`, {
        headers: { "x-apisports-key": API_FOOTBALL_KEY },
        next: { revalidate: 86400 }
      });
      return res.json();
    };

    const firstPageData = await fetchPage(1);
    
    if (!firstPageData.response || firstPageData.response.length === 0) {
      return NextResponse.json([]);
    }

    let allPlayers = [...firstPageData.response];
    const totalPages = firstPageData.paging?.total || 1;

    // 3. Concurrently fetch remaining pages
    if (totalPages > 1) {
      const promises = [];
      for (let i = 2; i <= totalPages; i++) {
        promises.push(fetchPage(i));
      }
      const restPages = await Promise.all(promises);
      restPages.forEach(pData => {
        if (pData.response) {
          allPlayers = allPlayers.concat(pData.response);
        }
      });
    }

    // 4. Transform and aggregate stats
    const players = allPlayers.map((p: any) => {
      let position = "UNK";
      // API-Football often returns primary position in the first stats array or p.statistics[0].games.position
      const primaryStat = p.statistics.find((s: any) => s.games.position);
      const rawPos = primaryStat ? primaryStat.games.position : "Unknown";
      
      if (rawPos === "Goalkeeper") position = "GK";
      else if (rawPos === "Defender") position = "DEF";
      else if (rawPos === "Midfielder") position = "MID";
      else if (rawPos === "Attacker") position = "ATT";

      let apps = 0;
      let minutes = 0;
      let goals = 0;
      let assists = 0;
      let yellow = 0;
      let red = 0;
      let ratingSum = 0;
      let ratingCount = 0;

      p.statistics.forEach((stat: any) => {
        const compName = stat.league?.name?.toLowerCase() || "";
        // Exclude Friendlies
        if (!compName.includes("friendlies")) {
          apps += stat.games?.appearences || 0;
          minutes += stat.games?.minutes || 0;
          goals += stat.goals?.total || 0;
          assists += stat.goals?.assists || 0;
          yellow += stat.cards?.yellow || 0;
          red += stat.cards?.red || 0;
          
          if (stat.games?.rating) {
            ratingSum += parseFloat(stat.games.rating);
            ratingCount++;
          }
        }
      });

      const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(2) : "N/A";

      return {
        id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        position: position,
        nationality: p.player.nationality || "Unknown",
        age: p.player.age || "N/A",
        stats: {
          apps,
          minutes,
          goals,
          assists,
          yellow,
          red,
          rating: avgRating
        }
      };
    });

    return NextResponse.json(players);

  } catch (error) {
    console.error("Database read error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
