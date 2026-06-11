import { NextResponse } from "next/server";

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = "https://v3.football.api-sports.io";

const COMP_TO_ID: Record<string, number> = {
  "champions-league": 2,
  "europa-league": 3,
  "world-cup": 1,
  "euros": 4
};

const ROUND_ORDER: Record<string, number> = {
  "Round of 16": 1, "8th Finals": 1,
  "Quarter-finals": 2,
  "Semi-finals": 3,
  "3rd Place Final": 4,
  "Final": 5
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league"); 
  const season = searchParams.get("season"); 

  if (!league || !season) {
    return NextResponse.json({ error: "Missing league or season" }, { status: 400 });
  }

  // Handle Domestic Leagues via Open Source CSV proxy
  if (!COMP_TO_ID[league]) {
    try {
      const csvUrl = `https://raw.githubusercontent.com/Kenzo911/european-football-standings/main/standings/${league}/${season}.csv`;
      const res = await fetch(csvUrl);
      
      if (!res.ok) {
        if (res.status === 404) return NextResponse.json({ error: "Season data not available." }, { status: 404 });
        throw new Error("Failed to fetch CSV");
      }

      const csvText = await res.text();
      const rows = csvText.trim().split('\n').slice(1); 
      
      const standings = rows.map(row => {
        const cols = row.split(',');
        return {
          position: parseInt(cols[0], 10),
          team_name: cols[1],
          played: parseInt(cols[2], 10),
          wins: parseInt(cols[3], 10),
          draws: parseInt(cols[4], 10),
          losses: parseInt(cols[5], 10),
          goals_for: parseInt(cols[6], 10),
          goals_against: parseInt(cols[7], 10),
          goal_difference: parseInt(cols[8], 10),
          points: parseInt(cols[9], 10)
        };
      });

      return NextResponse.json({ type: "league", standings });

    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  // Handle Tournaments via API-Football Integration
  if (!API_FOOTBALL_KEY) {
    return NextResponse.json({
      type: "tournament",
      groups: [],
      knockout: [],
      _note: "Requires Premium API-Football Key in .env.local to fetch real tournament trees."
    });
  }

  const leagueId = COMP_TO_ID[league];
  const queryYear = season.substring(0, 4); // API uses start year

  try {
    const headers = { "x-apisports-key": API_FOOTBALL_KEY };

    // 1. Fetch Group Stage Standings
    const stdRes = await fetch(`${API_URL}/standings?league=${leagueId}&season=${queryYear}`, { headers });
    const stdData = await stdRes.json();
    
    let groups = [];
    if (stdData.response && stdData.response.length > 0) {
      const leagueStandings = stdData.response[0].league.standings;
      // If it's an array of arrays, each inner array is a group
      if (Array.isArray(leagueStandings[0])) {
        groups = leagueStandings.map((groupStandings: any[]) => {
          return {
            name: groupStandings[0].group.replace("Group ", ""),
            standings: groupStandings.map((team: any) => ({
              position: team.rank,
              team_name: team.team.name,
              played: team.all.played,
              wins: team.all.win,
              draws: team.all.draw,
              losses: team.all.lose,
              goals_for: team.all.goals.for,
              goals_against: team.all.goals.against,
              goal_difference: team.goalsDiff,
              points: team.points
            }))
          };
        });
      }
    }

    // 2. Fetch Knockout Fixtures
    const fixRes = await fetch(`${API_URL}/fixtures?league=${leagueId}&season=${queryYear}`, { headers });
    const fixData = await fixRes.json();

    let knockoutRoundsMap: Record<string, Map<string, any>> = {};

    if (fixData.response) {
      fixData.response.forEach((fixture: any) => {
        const roundName = fixture.league.round;
        if (roundName.includes("Group") || roundName.includes("Regular") || roundName.includes("Qualifying") || roundName.includes("Preliminary") || roundName.includes("Play-off")) {
          return;
        }

        if (!knockoutRoundsMap[roundName]) knockoutRoundsMap[roundName] = new Map();
        
        let homeTeam = fixture.teams.home.name;
        let awayTeam = fixture.teams.away.name;
        
        const matchupKey = [homeTeam, awayTeam].sort().join("-");

        let homeScore = fixture.goals.home ?? 0;
        let awayScore = fixture.goals.away ?? 0;
        
        const existing = knockoutRoundsMap[roundName].get(matchupKey);

        if (existing) {
          // Second leg processing
          if (existing.homeTeam === homeTeam) {
            existing.homeScore += homeScore;
            existing.awayScore += awayScore;
            existing.awayAwayGoals += awayScore;
            existing.legs.push({ homeScore: homeScore, awayScore: awayScore });
          } else {
            existing.homeScore += awayScore;
            existing.awayScore += homeScore;
            existing.homeAwayGoals += awayScore;
            existing.legs.push({ homeScore: awayScore, awayScore: homeScore }); // oriented to existing.homeTeam
          }
          
          let penHome = fixture.score?.penalty?.home;
          let penAway = fixture.score?.penalty?.away;

          if (penHome !== null && penHome !== undefined) {
             if (existing.homeTeam === homeTeam) {
                existing.penaltyHome = penHome;
                existing.penaltyAway = penAway;
             } else {
                existing.penaltyHome = penAway;
                existing.penaltyAway = penHome;
             }
          }
          
          // Determine winner
          existing.winner = "draw";
          existing.winReason = "";

          if (existing.penaltyHome !== undefined) {
             if (existing.penaltyHome > existing.penaltyAway) existing.winner = "home";
             else existing.winner = "away";
             existing.winReason = "p";
          } else if (existing.homeScore > existing.awayScore) {
             existing.winner = "home";
          } else if (existing.awayScore > existing.homeScore) {
             existing.winner = "away";
          } else {
             // Aggregate tied, check away goals
             if (existing.homeAwayGoals > existing.awayAwayGoals) {
               existing.winner = "home";
               existing.winReason = "a";
             } else if (existing.awayAwayGoals > existing.homeAwayGoals) {
               existing.winner = "away";
               existing.winReason = "a";
             } else {
               // Fallback
               if (fixture.teams.home.winner === true) existing.winner = existing.homeTeam === homeTeam ? "home" : "away";
               else if (fixture.teams.away.winner === true) existing.winner = existing.homeTeam === homeTeam ? "away" : "home";
               else existing.winner = "home"; // final fallback
             }
          }

        } else {
          // First leg or single elimination match
          let winner: "home" | "away" | "draw" = "draw";
          let winReason = "";
          let penaltyHome = fixture.score?.penalty?.home ?? undefined;
          let penaltyAway = fixture.score?.penalty?.away ?? undefined;

          if (penaltyHome !== undefined && penaltyHome !== null) {
            if (penaltyHome > penaltyAway) winner = "home";
            else winner = "away";
            winReason = "p";
          } else if (homeScore > awayScore) winner = "home";
          else if (awayScore > homeScore) winner = "away";
          else if (fixture.teams.home.winner === true) winner = "home";
          else if (fixture.teams.away.winner === true) winner = "away";

          knockoutRoundsMap[roundName].set(matchupKey, {
            id: fixture.fixture.id.toString(),
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            homeAwayGoals: 0,
            awayAwayGoals: awayScore,
            penaltyHome,
            penaltyAway,
            winner: winner === "draw" ? "home" : winner,
            winReason,
            legs: [{ homeScore, awayScore }]
          });
        }
      });
    }

    const knockout = Object.keys(knockoutRoundsMap).map(roundName => ({
      name: roundName,
      matches: Array.from(knockoutRoundsMap[roundName].values()),
      order: ROUND_ORDER[roundName] || 99
    })).sort((a, b) => a.order - b.order).map(k => ({ name: k.name, matches: k.matches }));

    return NextResponse.json({
      type: "tournament",
      groups,
      knockout
    });

  } catch (err) {
    console.error("API-Football integration error:", err);
    return NextResponse.json({ error: "Failed to fetch tournament data from API-Football" }, { status: 500 });
  }
}


