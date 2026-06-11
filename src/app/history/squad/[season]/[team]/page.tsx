"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import teamLogosData from "@/lib/data/team_logos.json";

type HistoricalPlayer = {
  id: number;
  name: string;
  position: "GK" | "DEF" | "MID" | "ATT";
  nationality: string;
  age: number;
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
            <p className="text-2xl font-bold">{decodedSeason} Squad Roster</p>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="p-16 text-center text-muted-foreground animate-pulse font-bold tracking-widest uppercase text-lg border-2 border-dashed border-border shadow-neo">
              Retrieving archival records...
            </div>
          ) : squad.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {squad.map((player) => (
                <div key={player.id} className="flex flex-col p-6 border-[3px] border-border bg-card shadow-neo hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className="flex items-center justify-between mb-4 border-b-2 border-border pb-3">
                    <span className="font-black text-lg text-foreground truncate pr-4">{player.name}</span>
                    <Badge variant="outline" className="text-xs font-black tracking-widest bg-primary text-primary-foreground border-none shadow-neo rounded-none px-3 py-1 shrink-0">
                      {player.position}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="truncate pr-4">{player.nationality}</span>
                    <span className="shrink-0">Age: {player.age}</span>
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
