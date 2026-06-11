"use client";

import { useEffect, useState } from "react";
import { getClubById, getPlayersByClub, getClubLogoUrl } from "@/lib/data/players";
import { StatTile } from "@/components/forma/StatTile";
import { FixtureChip } from "@/components/forma/FixtureChip";
import { NewsCard } from "@/components/forma/NewsCard";
import Link from "next/link";

export default function ClubPage({ params }: { params: { id: string } }) {
  const club = getClubById(Number(params.id));
  const squad = club ? getPlayersByClub(club.id) : [];
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    if (!club) return;
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setNews(data.slice(0, 3)))
      .catch(console.error);
  }, [club]);

  if (!club) return <div className="p-8 text-center">Club not found</div>;

  const mockClubStats = {
    played: 38,
    wins: 28,
    draws: 5,
    losses: 5,
    gf: 89,
    ga: 29,
    gd: 60,
    points: 89
  };

  const mockFixtures = [
    { home: club.name, away: "Opposition", homeScore: 2, awayScore: 1, date: "Yesterday", competition: "League" },
    { home: "Away Team", away: club.name, date: "Tomorrow, 20:00", competition: "League" },
    { home: club.name, away: "Another Team", date: "Sat, 15:00", competition: "Cup" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8 flex items-center gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-3xl flex items-center justify-center p-5 shrink-0 shadow-lg border border-border">
          <img src={getClubLogoUrl(club.id)} alt={club.name} className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 text-foreground">{club.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase tracking-wider text-sm">
            <span>3rd · Premier League</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-10">
        <StatTile label="Pld" value={mockClubStats.played} />
        <StatTile label="W" value={mockClubStats.wins} />
        <StatTile label="D" value={mockClubStats.draws} />
        <StatTile label="L" value={mockClubStats.losses} />
        <StatTile label="GF" value={mockClubStats.gf} />
        <StatTile label="GA" value={mockClubStats.ga} />
        <StatTile label="GD" value={`+${mockClubStats.gd}`} />
        <StatTile label="Pts" value={mockClubStats.points} />
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 tracking-tight">Fixtures & Results</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mockFixtures.map((match, i) => (
            <div key={i} className="snap-start">
              <FixtureChip match={match} />
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-4 tracking-tight">First Team Squad</h2>
          <div className="flex flex-col gap-3">
            {squad.map(player => (
              <Link href={`/player/${player.id}`} key={player.id}>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[0.95rem] group-hover:text-primary transition-colors">{player.name}</span>
                    <span className="text-[0.65rem] text-muted-foreground uppercase tracking-widest">{player.position}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-foreground">7.2</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Club News</h2>
          <div className="flex flex-col gap-4">
            {news.length > 0 ? (
              news.map((item, i) => (
                <NewsCard key={i} news={item} />
              ))
            ) : (
              <div className="p-8 text-center border border-border rounded-xl text-muted-foreground">
                Loading news...
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
