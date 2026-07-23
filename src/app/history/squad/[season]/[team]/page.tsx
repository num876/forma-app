"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import teamLogosData from "@/lib/data/team_logos.json";

type HistoricalPlayer = {
  id: number;
  name: string;
  photo?: string;
  position: "GK" | "DEF" | "MID" | "ATT";
  nationality: string;
  age: number;
  stats?: {
    apps: number;
    minutes: number;
    goals: number;
    assists: number;
    yellow: number;
    red: number;
    rating: string;
  };
};

const teamLogos = teamLogosData as Record<string, string>;

export default function SquadPage({ params }: { params: { season: string, team: string } }) {
  const decodedTeam = decodeURIComponent(params.team);
  const decodedSeason = decodeURIComponent(params.season);

  const [squad, setSquad] = useState<HistoricalPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/squads?team=${encodeURIComponent(decodedTeam)}&season=${encodeURIComponent(decodedSeason)}`)
      .then(res => res.json())
      .then(data => {
        // Sort by apps descending if stats exist
        if (data && data.length > 0 && data[0].stats) {
          data.sort((a: HistoricalPlayer, b: HistoricalPlayer) => (b.stats?.apps || 0) - (a.stats?.apps || 0));
        }
        setSquad(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [decodedTeam, decodedSeason]);

  const logoUrl = teamLogos[decodedTeam];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="px-6 py-4 border-b-[3px] border-border bg-card flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-2xl tracking-tighter text-primary">FORMA</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/history" className="text-foreground transition-colors border-b-2 border-primary pb-1">History Explorer</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/history" className="inline-flex items-center gap-2 font-bold mb-8 hover:text-primary transition-colors border-2 border-border bg-card px-4 py-2 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          &larr; Back to History Explorer
        </Link>

        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 pb-8 border-b-[4px] border-border text-center md:text-left">
          {logoUrl ? (
            <div className="w-32 h-32 shrink-0 border-[3px] border-border p-4 bg-background shadow-neo">
              <img src={logoUrl} alt={decodedTeam} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-32 h-32 shrink-0 border-[3px] border-border p-4 bg-background shadow-neo flex items-center justify-center font-black text-6xl font-serif">
              {decodedTeam.charAt(0)}
            </div>
          )}
          
          <div>
            <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter mb-2 text-primary">{decodedTeam}</h1>
            <p className="text-2xl font-bold">{decodedSeason} Squad Roster & Stats</p>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="p-16 text-center text-muted-foreground animate-pulse font-bold tracking-widest uppercase text-lg border-2 border-dashed border-border shadow-neo">
              Retrieving archival records & player stats...
            </div>
          ) : squad.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {squad.map((player) => (
                <div key={player.id} className="flex flex-col border-[3px] border-border bg-card shadow-neo hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                  
                  {/* Player Header */}
                  <div className="flex items-start gap-4 p-4 border-b-[3px] border-border bg-secondary/20">
                    <div className="w-16 h-16 rounded-full border-[3px] border-border bg-background overflow-hidden shrink-0">
                      {player.photo ? (
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-xl">
                          {player.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
                      <h3 className="font-black text-lg text-foreground truncate" title={player.name}>{player.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] font-black tracking-widest bg-primary text-primary-foreground border-none shadow-neo rounded-none px-2 py-0.5 shrink-0">
                          {player.position}
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">{player.nationality}</span>
                      </div>
                    </div>
                  </div>

                  {/* Player Stats */}
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground mb-1">Apps (Mins)</span>
                      <span className="font-mono font-bold text-sm">
                        {player.stats?.apps || 0} <span className="text-muted-foreground text-xs">({player.stats?.minutes || 0}')</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground mb-1">Goals / Assists</span>
                      <span className="font-mono font-bold text-sm">
                        {player.stats?.goals || 0} <span className="text-muted-foreground text-xs">/</span> {player.stats?.assists || 0}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground mb-1">Cards</span>
                      <div className="flex items-center gap-2 font-mono font-bold text-sm">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-3 bg-yellow-400 border border-black skew-x-[-10deg]" /> {player.stats?.yellow || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-3 bg-red-500 border border-black skew-x-[-10deg]" /> {player.stats?.red || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground mb-1">Avg Rating</span>
                      <span className="font-mono font-bold text-sm text-primary">
                        {player.stats?.rating !== "N/A" ? player.stats?.rating : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-muted-foreground border-[3px] border-dashed border-border shadow-neo bg-card">
              <span className="text-5xl block mb-6">🗄️</span>
              <h3 className="text-2xl font-black mb-2">No Records Found</h3>
              <p className="font-medium">We couldn't locate the historical squad roster for this team in {decodedSeason}.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
