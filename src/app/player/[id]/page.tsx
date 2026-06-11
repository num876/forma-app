"use client";

import { useEffect, useState } from "react";
import { getPlayerById, getClubById, getClubLogoUrl } from "@/lib/data/players";
import { StatTile } from "@/components/forma/StatTile";
import { FormSummary } from "@/components/forma/FormSummary";
import { NewsCard } from "@/components/forma/NewsCard";
import { cn } from "@/lib/utils";

export default function PlayerPage({ params }: { params: { id: string } }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);

  const player = getPlayerById(Number(params.id));
  const club = player ? getClubById(player.clubId) : null;

  const mockSeasonStats = {
    goals: 14,
    assists: 8,
    xG: 12.4,
    minutesPlayed: 2450,
    avgRating: 7.4
  };

  const mockFormTable = [
    { date: "12 May", opposition: "Man Utd", result: "W 1-0", rating: 7.6, goals: 0, assists: 1 },
    { date: "04 May", opposition: "Bournemouth", result: "W 3-0", rating: 8.1, goals: 1, assists: 1 },
    { date: "28 Apr", opposition: "Spurs", result: "W 3-2", rating: 7.2, goals: 1, assists: 0 },
    { date: "23 Apr", opposition: "Chelsea", result: "W 5-0", rating: 8.5, goals: 2, assists: 0 },
    { date: "20 Apr", opposition: "Wolves", result: "W 2-0", rating: 7.0, goals: 0, assists: 0 },
  ];

  useEffect(() => {
    if (!player) return;

    // Fetch Global News for MVP
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setNews(data.slice(0, 3)))
      .catch(console.error);

    // Call AI API
    fetch("/api/forma-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: player.name,
        club: club?.name,
        position: player.position,
        recentMatches: mockFormTable,
        seasonStats: mockSeasonStats,
        recentNews: ["Great performance recently."]
      })
    })
    .then(res => res.json())
    .then(data => {
      setSummary(data.summary);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setSummary("Could not generate AI summary at this time.");
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, club]);

  if (!player) return <div className="p-8 text-center">Player not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8 flex items-start gap-5">
        {club && (
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-2xl flex items-center justify-center p-4 shrink-0 shadow-lg border border-border">
            <img src={getClubLogoUrl(club.id)} alt={club.name} className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        )}
        <div className="flex flex-col justify-center pt-1">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-foreground">{player.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase tracking-wider text-[0.75rem]">
            <span className="bg-muted px-2 py-1 rounded text-foreground">{player.position}</span>
            <span>·</span>
            <span className="text-foreground">{club?.name}</span>
            <span>·</span>
            <span>{player.nationality}</span>
          </div>
        </div>
      </div>

      {/* Season Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        <StatTile label="Goals" value={mockSeasonStats.goals} />
        <StatTile label="Assists" value={mockSeasonStats.assists} />
        <StatTile label="xG" value={mockSeasonStats.xG.toFixed(1)} />
        <StatTile label="Mins" value={mockSeasonStats.minutesPlayed} />
        <StatTile label="Avg Rtg" value={mockSeasonStats.avgRating.toFixed(1)} />
      </div>

      {/* Form Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 tracking-tight">Recent Form</h2>
        
        <FormSummary summary={summary || ""} loading={loading} className="mb-6" />

        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Opp</th>
                <th className="px-4 py-3 font-semibold">Result</th>
                <th className="px-4 py-3 font-semibold text-center">G</th>
                <th className="px-4 py-3 font-semibold text-center">A</th>
                <th className="px-4 py-3 font-semibold text-right">Rtg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockFormTable.map((match, i) => {
                const isGreen = match.rating >= 7.5;
                const isAmber = match.rating >= 6.5 && match.rating < 7.5;
                const isRed = match.rating > 0 && match.rating < 6.5;

                return (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-medium text-[0.8rem]">{match.date}</td>
                    <td className="px-4 py-3 font-semibold text-[0.9rem] text-foreground">{match.opposition}</td>
                    <td className="px-4 py-3 text-muted-foreground text-[0.85rem]">{match.result}</td>
                    <td className="px-4 py-3 text-center text-foreground font-semibold">{match.goals || "—"}</td>
                    <td className="px-4 py-3 text-center text-foreground font-semibold">{match.assists || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        "inline-block px-2 py-1 rounded font-bold text-xs",
                        isGreen && "bg-primary/10 text-primary",
                        isAmber && "bg-amber-500/10 text-amber-500",
                        isRed && "bg-destructive/10 text-destructive"
                      )}>
                        {match.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* News Section */}
      <section>
        <h2 className="text-xl font-bold mb-4 tracking-tight">Recent News</h2>
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
  );
}
