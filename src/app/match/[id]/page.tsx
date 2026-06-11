"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FixtureChip, FixtureProps } from "@/components/forma/FixtureChip";
import { motion } from "framer-motion";
import { NeoSkeleton } from "@/components/ui/skeleton";

export default function MatchCenterPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/match/${params.id}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24">
        <header className="px-6 py-4 border-b-[3px] border-border bg-card flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <span className="font-black text-2xl tracking-tighter text-primary">FORMA</span>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-12">
          <NeoSkeleton className="w-full h-64 md:h-96" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <NeoSkeleton className="lg:col-span-2 h-[600px] w-full" />
            <NeoSkeleton className="h-[600px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-xl font-black uppercase tracking-widest border-[3px] border-border p-8 bg-card shadow-neo text-center flex flex-col gap-4">
          <p className="text-red-500">Error loading match details.</p>
          <Link href="/" className="text-sm underline hover:text-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  const { match, h2h } = data;
  const isPlayed = match.fixture.status.short === "FT" || match.fixture.status.short === "AET" || match.fixture.status.short === "PEN";
  const isLive = ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(match.fixture.status.short);
  
  const homeLogo = match.teams.home.logo;
  const awayLogo = match.teams.away.logo;

  const matchDate = new Date(match.fixture.date);
  const dateStr = matchDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = matchDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header Navigation */}
      <header className="px-6 py-4 border-b-[3px] border-border bg-card flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-2xl tracking-tighter text-primary">FORMA</Link>
          <span className="font-bold uppercase tracking-widest text-xs border-l-2 border-border pl-4">Match Center</span>
        </div>
        <Link href="/" className="text-sm font-bold border-2 border-border px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors shadow-neo">Close</Link>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-6xl mx-auto px-4 py-8 md:py-12"
      >
        {/* Match Header Hero */}
        <section className="border-[4px] border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
          
          {/* Top Badges (Stacked on mobile, Absolute on desktop) */}
          <div className="flex w-full justify-between md:hidden mb-4">
            <div className="bg-primary text-primary-foreground font-black text-[0.65rem] uppercase tracking-widest px-3 py-1 border-[3px] border-border shadow-neo">
              {match.league.name}
            </div>
            <div className="font-black text-[0.65rem] uppercase tracking-widest px-3 py-1 border-[3px] border-border shadow-neo flex items-center gap-2 bg-background">
              {isLive ? (
                <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <span className="text-red-500">{match.fixture.status.elapsed}'</span></>
              ) : isPlayed ? (
                <span>FT</span>
              ) : (
                <span>Upcoming</span>
              )}
            </div>
          </div>

          {/* Desktop Absolute Badges */}
          <div className="hidden md:block absolute top-0 left-0 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest px-4 py-1 border-r-[4px] border-b-[4px] border-border">
            {match.league.name} • {match.league.round}
          </div>
          <div className="hidden md:flex absolute top-0 right-0 font-black text-xs uppercase tracking-widest px-4 py-1 border-l-[4px] border-b-[4px] border-border items-center gap-2 bg-background">
            {isLive ? (
              <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <span className="text-red-500">{match.fixture.status.elapsed}'</span></>
            ) : isPlayed ? (
              <span>Full Time</span>
            ) : (
              <span>Upcoming</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 flex-1">
            <img src={homeLogo} alt={match.teams.home.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain drop-shadow-md" />
            <h2 className="text-2xl md:text-4xl font-black font-serif tracking-tighter leading-none">{match.teams.home.name}</h2>
          </div>

          <div className="flex flex-col items-center justify-center px-2 md:px-8 flex-shrink-0">
            {isPlayed || isLive ? (
              <div className="text-5xl sm:text-6xl md:text-8xl font-black font-mono tracking-tighter flex items-center gap-3 md:gap-4">
                <span>{match.goals.home ?? 0}</span>
                <span className="text-border">-</span>
                <span>{match.goals.away ?? 0}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center font-bold">
                <span className="text-xl md:text-3xl font-black mb-1 md:mb-2">{timeStr}</span>
                <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">{dateStr}</span>
              </div>
            )}
            
            {(match.score.penalty.home !== null || match.score.penalty.away !== null) && (
              <div className="mt-4 text-[0.65rem] md:text-sm font-bold uppercase tracking-widest bg-foreground text-background px-3 py-1">
                Pens: {match.score.penalty.home} - {match.score.penalty.away}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 flex-1">
            <img src={awayLogo} alt={match.teams.away.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain drop-shadow-md" />
            <h2 className="text-2xl md:text-4xl font-black font-serif tracking-tighter leading-none">{match.teams.away.name}</h2>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Lineups */}
          <section className="lg:col-span-2">
            <h3 className="text-3xl font-black font-serif border-b-[4px] border-border pb-2 mb-6">Starting XIs</h3>
            
            {match.lineups && match.lineups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {match.lineups.map((lineup: any, idx: number) => (
                  <div key={idx} className="border-[3px] border-border bg-card shadow-neo flex flex-col">
                    <div className="p-4 border-b-[3px] border-border bg-foreground text-background flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={lineup.team.logo} className="w-6 h-6 bg-white p-0.5 rounded-sm" alt="" />
                        <span className="font-black text-lg uppercase tracking-tight">{lineup.team.name}</span>
                      </div>
                      <span className="font-mono font-bold text-sm bg-background text-foreground px-2 py-0.5">{lineup.formation}</span>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-2 bg-background/50">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Coach</h4>
                      <p className="font-bold border-b-2 border-dashed border-border pb-4 mb-2">{lineup.coach.name}</p>
                      
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Starting 11</h4>
                      {lineup.startXI.map((p: any) => (
                        <div key={p.player.id} className="flex items-center justify-between py-1.5 border-b border-border/30 hover:bg-primary/5 transition-colors px-2 -mx-2">
                          <span className="font-bold text-sm">{p.player.name}</span>
                          <div className="flex items-center gap-3 font-mono text-xs font-bold">
                            <span className="text-muted-foreground w-6 text-right">{p.player.pos}</span>
                            <span className="bg-border text-foreground px-1.5 min-w-[24px] text-center">{p.player.number}</span>
                          </div>
                        </div>
                      ))}

                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 mt-4">Substitutes</h4>
                      {lineup.substitutes.map((p: any) => (
                        <div key={p.player.id} className="flex items-center justify-between py-1 border-b border-border/20 text-sm text-muted-foreground">
                          <span className="font-semibold">{p.player.name}</span>
                          <span className="font-mono text-xs">{p.player.number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-[3px] border-border border-dashed p-12 text-center flex flex-col items-center justify-center bg-card">
                <span className="text-4xl mb-4 opacity-50">📋</span>
                <p className="font-black text-xl mb-2">Lineups Not Yet Available</p>
                <p className="font-medium text-muted-foreground text-sm max-w-sm">Starting XIs and formations are typically announced exactly one hour before kickoff.</p>
              </div>
            )}
          </section>

          {/* Right Column: Info & H2H */}
          <div className="flex flex-col gap-12">
            
            <section>
              <h3 className="text-3xl font-black font-serif border-b-[4px] border-border pb-2 mb-6">Match Info</h3>
              <div className="border-[3px] border-border bg-card shadow-neo p-6 flex flex-col gap-4 text-sm font-bold">
                <div className="flex justify-between items-center border-b-2 border-border pb-2">
                  <span className="text-muted-foreground uppercase tracking-widest text-xs">Venue</span>
                  <span className="text-right">{match.fixture.venue.name || "TBA"}<br/><span className="text-xs font-medium text-muted-foreground">{match.fixture.venue.city}</span></span>
                </div>
                <div className="flex justify-between items-center border-b-2 border-border pb-2">
                  <span className="text-muted-foreground uppercase tracking-widest text-xs">Referee</span>
                  <span className="text-right">{match.fixture.referee || "TBA"}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-muted-foreground uppercase tracking-widest text-xs">Competition</span>
                  <span className="text-right">{match.league.name}<br/><span className="text-xs font-medium text-muted-foreground">{match.league.round}</span></span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-black font-serif border-b-[4px] border-border pb-2 mb-6">Head to Head</h3>
              {h2h && h2h.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {h2h.map((hMatch: any) => {
                    const matchDate = new Date(hMatch.fixture.date);
                    const formattedDate = matchDate.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
                    
                    const chipProps: FixtureProps = {
                      id: hMatch.fixture.id,
                      home: hMatch.teams.home.name,
                      away: hMatch.teams.away.name,
                      homeLogo: hMatch.teams.home.logo,
                      awayLogo: hMatch.teams.away.logo,
                      date: formattedDate,
                      competition: hMatch.league.name,
                      homeScore: hMatch.goals.home,
                      awayScore: hMatch.goals.away,
                      status: hMatch.fixture.status.short
                    };
                    return <FixtureChip key={hMatch.fixture.id} match={chipProps} />;
                  })}
                </div>
              ) : (
                <div className="p-6 border-[3px] border-dashed border-border text-center font-bold text-muted-foreground bg-card shadow-neo">
                  No recent head-to-head records found between these clubs.
                </div>
              )}
            </section>

          </div>
        </div>
      </motion.main>
    </div>
  );
}
