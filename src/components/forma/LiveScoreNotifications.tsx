"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import teamLogosData from "@/lib/data/team_logos.json";

const teamLogos = teamLogosData as Record<string, string>;

type LiveFixture = {
  fixture: { id: number; status: { elapsed: number; long: string } };
  league: { id: number; name: string; logo: string };
  teams: { home: { name: string; logo: string }; away: { name: string; logo: string } };
  goals: { home: number; away: number };
  events: any[];
};

export function LiveScoreNotifications() {
  const previousScores = useRef<Record<number, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchLiveScores = async () => {
      try {
        const res = await fetch("/api/live");
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.response && Array.isArray(data.response)) {
          data.response.forEach((match: LiveFixture) => {
            const matchId = match.fixture.id;
            const currentScoreStr = `${match.goals.home ?? 0}-${match.goals.away ?? 0}`;
            
            // Check if we have a previous score record for this match
            if (previousScores.current[matchId] !== undefined) {
              const previousScoreStr = previousScores.current[matchId];
              
              if (previousScoreStr !== currentScoreStr) {
                // Goal occurred! Trigger toast
                const homeLogo = teamLogos[match.teams.home.name] || match.teams.home.logo;
                const awayLogo = teamLogos[match.teams.away.name] || match.teams.away.logo;
                const elapsed = match.fixture.status.elapsed ? `${match.fixture.status.elapsed}'` : 'Live';
                
                toast.custom((t) => (
                  <div className="bg-card border-[3px] border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-3 w-full sm:w-[350px] animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between border-b-2 border-border pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {match.league.name}
                      </div>
                      <span className="text-xs font-bold bg-black text-white px-2 py-0.5">{elapsed}</span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={homeLogo} className="w-5 h-5 object-contain" alt="" />
                          <span className="font-bold">{match.teams.home.name}</span>
                        </div>
                        <span className="font-mono text-xl font-black">{match.goals.home ?? 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={awayLogo} className="w-5 h-5 object-contain" alt="" />
                          <span className="font-bold">{match.teams.away.name}</span>
                        </div>
                        <span className="font-mono text-xl font-black">{match.goals.away ?? 0}</span>
                      </div>
                    </div>
                  </div>
                ), { duration: 6000, id: `goal-${matchId}-${currentScoreStr}` });
              }
            }
            
            // Update the cache
            previousScores.current[matchId] = currentScoreStr;
          });
        }
      } catch (err) {
        console.error("Live Score Polling Error:", err);
      }
    };

    // Initial fetch
    fetchLiveScores();

    // Poll every 60 seconds
    const interval = setInterval(fetchLiveScores, 60000);

    return () => clearInterval(interval);
  }, [mounted]);

  return null; // This is a silent functional component
}
