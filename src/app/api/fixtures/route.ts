import { NextResponse } from 'next/server';

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_HOST = "https://v3.football.api-sports.io";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubsParam = searchParams.get('clubs');

  let clubIds = clubsParam ? clubsParam.split(',').slice(0, 3) : []; // Max 3 to prevent rate limits

  try {
    let allFixtures: any[] = [];

    if (clubIds.length > 0) {
      // Fetch upcoming fixtures for each followed club
      for (const clubId of clubIds) {
        const res = await fetch(`${API_HOST}/fixtures?team=${clubId}&next=3`, {
          headers: { 'x-apisports-key': API_KEY || '' },
          next: { revalidate: 3600 }
        });
        const data = await res.json();
        if (data.response) allFixtures = allFixtures.concat(data.response);
      }
    }

    // Top 5 European club leagues: PL, La Liga, Serie A, Bundesliga, Ligue 1
    const clubLeagues = [39, 140, 135, 78, 61];
    // Major international competitions: World Cup (1), Nations League (5), Copa America (9), Euros (4), Intl Friendlies (10), AFCON (6), Gold Cup (2)
    const intlLeagues = [1, 5, 9, 4, 10];

    const allLeagues = [...clubLeagues, ...intlLeagues];

    const leaguePromises = allLeagues.map(leagueId =>
      fetch(`${API_HOST}/fixtures?league=${leagueId}&next=2`, {
        headers: { 'x-apisports-key': API_KEY || '' },
        next: { revalidate: 3600 }
      }).then(res => res.json()).catch(() => ({ response: [] }))
    );

    const leagueResults = await Promise.all(leaguePromises);
    leagueResults.forEach(data => {
      if (data.response) allFixtures = allFixtures.concat(data.response);
    });

    // Deduplicate fixtures (in case multiple followed teams play each other)
    const uniqueFixtures = Array.from(new Map(allFixtures.map(item => [item.fixture.id, item])).values());

    // Sort by date ascending
    uniqueFixtures.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp);

    const mappedFixtures = uniqueFixtures.map(item => {
      // Format the date nicely
      const dateObj = new Date(item.fixture.date);
      const isToday = new Date().toDateString() === dateObj.toDateString();
      const isTomorrow = new Date(Date.now() + 86400000).toDateString() === dateObj.toDateString();
      
      let dateString = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (isToday) dateString = "Today";
      if (isTomorrow) dateString = "Tomorrow";
      
      const timeString = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      return {
        id: item.fixture.id,
        home: item.teams.home.name,
        homeLogo: item.teams.home.logo,
        away: item.teams.away.name,
        awayLogo: item.teams.away.logo,
        date: `${dateString}, ${timeString}`,
        competition: item.league.name,
        homeScore: item.goals.home !== null ? item.goals.home : undefined,
        awayScore: item.goals.away !== null ? item.goals.away : undefined,
        status: item.fixture.status.short
      };
    });

    return NextResponse.json(mappedFixtures);

  } catch (error) {
    console.error("Fixtures Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
