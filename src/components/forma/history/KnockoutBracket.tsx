"use client";

import { cn } from "@/lib/utils";
import teamLogosData from "@/lib/data/team_logos.json";
const teamLogos = teamLogosData as Record<string, string>;

export type KnockoutMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  penaltyHome?: number;
  penaltyAway?: number;
  winReason?: "p" | "a" | "";
  winner: "home" | "away";
  legs?: { homeScore: number, awayScore: number }[];
};

export type KnockoutRound = {
  name: string;
  matches: KnockoutMatch[];
};

export function KnockoutBracket({ rounds, onTeamClick }: { rounds: KnockoutRound[], onTeamClick: (team: string) => void }) {
  if (!rounds || rounds.length === 0) return <div className="p-8 text-center text-muted-foreground font-medium border-2 border-dashed border-border shadow-neo">No knockout data available.</div>;

  return (
    <div className="w-full pb-12">
      <div className="flex flex-col md:flex-row gap-12 md:gap-6 w-full md:items-center mt-6 md:mt-12">
        {rounds.map((round, rIdx) => (
          <div key={rIdx} className="flex flex-col gap-4 sm:gap-6 lg:gap-8 justify-center flex-1 min-w-0 relative">
            <h3 className="relative md:absolute md:-top-10 left-0 w-full text-center font-black font-serif text-lg md:text-xs text-primary uppercase tracking-widest bg-card md:border-2 md:border-border py-1 md:shadow-neo z-10 truncate px-0.5 border-b-2 border-border md:border-b-2">
              {round.name}
            </h3>
            <div className="flex flex-col gap-4">
              {round.matches.map((match, mIdx) => (
                <div key={match.id} className="relative flex flex-col border-[3px] border-border bg-card shadow-neo transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  
                  {/* Visual Connector Line to next round (Desktop Only) */}
                  {rIdx < rounds.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 md:-right-6 w-4 md:w-6 h-[3px] bg-border -z-10" />
                  )}

                <div 
                  className={cn(
                    "flex justify-between items-center p-1.5 md:p-2 cursor-pointer transition-colors border-b-2 border-border",
                    match.winner === "home" ? "bg-primary text-primary-foreground font-black" : "hover:bg-primary/10 text-foreground font-bold"
                  )}
                  onClick={() => onTeamClick(match.homeTeam)}
                >
                  <div className="flex items-center gap-1.5 truncate min-w-0 flex-1">
                    {teamLogos[match.homeTeam as keyof typeof teamLogos] && (
                      <img src={teamLogos[match.homeTeam as keyof typeof teamLogos]} alt="" className="hidden xl:block w-3 h-3 md:w-4 md:h-4 object-contain shrink-0" />
                    )}
                    <span className="truncate pr-1 text-[0.65rem] sm:text-xs md:text-sm">{match.homeTeam}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {match.winReason === "a" && match.winner === "home" && <span className="text-[0.5rem] font-black uppercase tracking-widest">(a)</span>}
                    {match.winReason === "p" && <span className="text-[0.5rem] md:text-xs font-bold">({match.penaltyHome})</span>}
                    <span className="font-mono text-xs sm:text-sm md:text-base">{match.homeScore}</span>
                  </div>
                </div>
                <div 
                  className={cn(
                    "flex justify-between items-center p-1.5 md:p-2 cursor-pointer transition-colors",
                    match.winner === "away" ? "bg-primary text-primary-foreground font-black" : "hover:bg-primary/10 text-foreground font-bold"
                  )}
                  onClick={() => onTeamClick(match.awayTeam)}
                >
                  <div className="flex items-center gap-1.5 truncate min-w-0 flex-1">
                    {teamLogos[match.awayTeam as keyof typeof teamLogos] && (
                      <img src={teamLogos[match.awayTeam as keyof typeof teamLogos]} alt="" className="hidden xl:block w-3 h-3 md:w-4 md:h-4 object-contain shrink-0" />
                    )}
                    <span className="truncate pr-1 text-[0.65rem] sm:text-xs md:text-sm">{match.awayTeam}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {match.winReason === "a" && match.winner === "away" && <span className="text-[0.5rem] font-black uppercase tracking-widest">(a)</span>}
                    {match.winReason === "p" && <span className="text-[0.5rem] md:text-xs font-bold">({match.penaltyAway})</span>}
                    <span className="font-mono text-xs sm:text-sm md:text-base">{match.awayScore}</span>
                  </div>
                </div>

                {/* Individual Leg Scores */}
                {match.legs && match.legs.length > 1 && (
                  <div className="flex justify-center gap-2 md:gap-4 bg-background py-1 border-t-2 border-border text-[0.5rem] md:text-[0.65rem] font-mono font-bold uppercase tracking-widest truncate px-1">
                    {match.legs.map((leg, i) => (
                      <span key={i}>L{i+1}: {leg.homeScore}-{leg.awayScore}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
