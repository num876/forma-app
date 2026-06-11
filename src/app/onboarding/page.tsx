"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEAGUES, getClubsByLeague, getPlayersByClub, getLeagueLogoUrl, getClubLogoUrl } from "@/lib/data/players";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/components/forma/PlayerCard";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedLeagues, setSelectedLeagues] = useState<number[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<number[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const toggleLeague = (id: number) => {
    setSelectedLeagues(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleClub = (id: number) => {
    setSelectedClubs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const togglePlayer = (id: number) => {
    setSelectedPlayers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleNext = () => {
    if (step === 1 && selectedLeagues.length > 0) setStep(2);
    else if (step === 2 && selectedClubs.length > 0) setStep(3);
    else if (step === 3 && selectedPlayers.length > 0) {
      const preferences = {
        leagues: selectedLeagues,
        clubs: selectedClubs,
        players: selectedPlayers
      };
      localStorage.setItem("forma_preferences", JSON.stringify(preferences));
      router.push("/");
    }
  };

  const getAvailableClubs = () => {
    return selectedLeagues.flatMap(id => getClubsByLeague(id));
  };

  const getAvailablePlayers = () => {
    return selectedClubs.flatMap(id => getPlayersByClub(id));
  };

  const progress = (step / 3) * 100;

  return (
    <div className="max-w-xl mx-auto min-h-screen flex flex-col p-6 pt-12">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold tracking-widest">
          <span>STEP {step} OF 3</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-muted [&>div]:bg-primary" />
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Which leagues do you follow?</h1>
              <p className="text-muted-foreground text-sm">Select at least one to continue.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LEAGUES.map(league => {
                const isSelected = selectedLeagues.includes(league.id);
                return (
                  <Card 
                    key={league.id}
                    onClick={() => toggleLeague(league.id)}
                    className={cn(
                      "p-4 flex items-center gap-4 cursor-pointer transition-all border rounded-xl shadow-none",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30 bg-card"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2 shrink-0">
                      <img src={getLeagueLogoUrl(league.id)} alt={league.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-[1.1rem] leading-tight">{league.name}</div>
                      <div className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5">{league.country}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Pick your clubs</h1>
              <p className="text-muted-foreground text-sm">Select the teams you want to track.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getAvailableClubs().map(club => {
                const isSelected = selectedClubs.includes(club.id);
                return (
                  <Card 
                    key={club.id}
                    onClick={() => toggleClub(club.id)}
                    className={cn(
                      "p-4 flex items-center gap-4 cursor-pointer transition-all border rounded-xl shadow-none",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30 bg-card"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <img src={getClubLogoUrl(club.id)} alt={club.name} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <div className="font-bold text-foreground text-[1.05rem] leading-tight">{club.name}</div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Follow players</h1>
              <p className="text-muted-foreground text-sm">Get AI form summaries for these players.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getAvailablePlayers().map(player => (
                <PlayerCard 
                  key={player.id}
                  player={player}
                  selected={selectedPlayers.includes(player.id)}
                  onClick={() => togglePlayer(player.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex justify-end">
        <Button 
          size="lg" 
          onClick={handleNext}
          disabled={
            (step === 1 && selectedLeagues.length === 0) ||
            (step === 2 && selectedClubs.length === 0) ||
            (step === 3 && selectedPlayers.length === 0)
          }
          className="w-full sm:w-auto font-semibold tracking-wide rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {step === 3 ? "Go to Forma" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
