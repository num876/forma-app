"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LeagueRow, LeagueTable } from "@/components/forma/history/LeagueTable";
import { GroupStageTable, Group } from "@/components/forma/history/GroupStageTable";
import { KnockoutBracket, KnockoutRound } from "@/components/forma/history/KnockoutBracket";
import { useRouter } from "next/navigation";
import teamLogosData from "@/lib/data/team_logos.json";
import { motion } from "framer-motion";
import { NeoSkeleton } from "@/components/ui/skeleton";
import { MobileNav } from "@/components/forma/MobileNav";

const teamLogos = teamLogosData as Record<string, string>;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const COMPETITIONS = [
  { id: "premier-league", name: "Premier League", type: "domestic" },
  { id: "la-liga", name: "La Liga", type: "domestic" },
  { id: "bundesliga", name: "Bundesliga", type: "domestic" },
  { id: "serie-a", name: "Serie A", type: "domestic" },
  { id: "ligue-1", name: "Ligue 1", type: "domestic" },
  { id: "champions-league", name: "Champions League", type: "european" },
  { id: "europa-league", name: "Europa League", type: "european" },
  { id: "world-cup", name: "World Cup", type: "international" },
  { id: "euros", name: "Euros", type: "international" },
];

const SEASONS = Array.from({ length: 25 }, (_, i) => {
  const start = 2024 - i;
  return `${start}-${start + 1}`;
});

export default function HistoryPage() {
  const [selectedComp, setSelectedComp] = useState("premier-league");
  const [selectedSeason, setSelectedSeason] = useState("2024-2025");
  const [viewMode, setViewMode] = useState<"overview" | "squads">("overview");
  
  const [data, setData] = useState<any>(null);
  const [teamsData, setTeamsData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");

  // Fetch Overview Data (Tables & Brackets)
  useEffect(() => {
    if (viewMode !== "overview") return;
    setLoading(true);
    setError("");
    setData(null);

    fetch(`/api/history?league=${selectedComp}&season=${selectedSeason}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch data");
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedComp, selectedSeason, viewMode]);

  // Fetch Squads Directory Data
  useEffect(() => {
    if (viewMode !== "squads") return;
    setLoading(true);
    setError("");
    setTeamsData([]);

    fetch(`/api/teams?league=${selectedComp}&season=${selectedSeason}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch teams");
        setTeamsData(json.teams || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedComp, selectedSeason, viewMode]);

  const router = useRouter();

  const handleTeamClick = (team: string) => {
    router.push(`/history/squad/${encodeURIComponent(selectedSeason)}/${encodeURIComponent(team)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-2xl tracking-tighter text-primary">FORMA</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/history" className="text-foreground transition-colors border-b-2 border-primary pb-1">History Explorer</Link>
          </nav>
        </div>
        <div className="md:hidden">
          {/* Workaround for import: inline import or just rely on a unified header later. Actually let's assume we need to import it properly. Wait, I will add the import at the top of the file in the next tool call, just adding the component here. */}
          <MobileNav />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-end gap-6 mb-10 pb-8 border-b-[3px] border-border">
          <div>
            <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter mb-4 text-primary">History Explorer</h1>
            <p className="text-lg font-medium">Relive 24 years of football standings, tournaments, and legendary squads.</p>
          </div>
          
          <div className="flex-1" />

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* View Mode Toggle */}
            <div className="flex bg-card border-2 border-border shadow-neo p-1 w-full sm:w-auto shrink-0">
              <button 
                onClick={() => setViewMode("overview")}
                className={`flex-1 sm:px-6 py-2 text-sm font-bold border-2 border-transparent transition-colors ${viewMode === "overview" ? "bg-primary text-primary-foreground border-border" : "text-muted-foreground hover:text-foreground"}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setViewMode("squads")}
                className={`flex-1 sm:px-6 py-2 text-sm font-bold border-2 border-transparent transition-colors ${viewMode === "squads" ? "bg-primary text-primary-foreground border-border" : "text-muted-foreground hover:text-foreground"}`}
              >
                Squads
              </button>
            </div>

            <select 
              value={selectedComp} 
              onChange={e => setSelectedComp(e.target.value)}
              className="bg-card border-2 border-border shadow-neo text-foreground text-sm focus:ring-0 focus:border-border block w-full p-2.5 outline-none font-bold"
            >
              <optgroup label="Domestic Leagues">
                {COMPETITIONS.filter(c => c.type === "domestic").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
              <optgroup label="European Tournaments">
                {COMPETITIONS.filter(c => c.type === "european").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
              <optgroup label="International">
                {COMPETITIONS.filter(c => c.type === "international").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            </select>

            <select 
              value={selectedSeason} 
              onChange={e => setSelectedSeason(e.target.value)}
              className="bg-card border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none font-semibold shrink-0"
            >
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[50vh]">
          {loading ? (
            <div className="flex flex-col gap-8">
              {viewMode === "overview" ? (
                <>
                  <NeoSkeleton className="h-16 w-full" />
                  <NeoSkeleton className="h-[400px] w-full" />
                </>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <NeoSkeleton key={i} className="h-40 w-full" />
                  ))}
                </div>
              )}
            </div>
          ) : error ? (
            <div className="p-8 text-center border-[3px] border-dashed border-border shadow-neo text-muted-foreground font-black uppercase tracking-widest bg-card">
              {error}
            </div>
          ) : viewMode === "overview" && data ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {data.type === "league" && (
                <LeagueTable data={data.standings} onTeamClick={handleTeamClick} />
              )}
              
              {data.type === "tournament" && (
                <div className="flex flex-col gap-12">
                  {data._note && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm font-semibold">
                      {data._note}
                    </div>
                  )}

                  {data.groups && data.groups.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-black mb-6 tracking-tight">Group Stage</h2>
                      <GroupStageTable groups={data.groups} onTeamClick={handleTeamClick} />
                    </section>
                  )}

                  {data.knockout && data.knockout.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-black mb-6 tracking-tight">Knockout Stage</h2>
                      <KnockoutBracket rounds={data.knockout} onTeamClick={handleTeamClick} />
                    </section>
                  )}
                </div>
              )}
            </motion.div>
          ) : viewMode === "squads" ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, ease: "easeOut" }}
             >
                {teamsData.length === 0 ? (
                  <div className="p-16 text-center border-[3px] border-dashed border-border shadow-neo bg-card text-muted-foreground flex flex-col items-center gap-4">
                     <span className="text-4xl">🕰️</span>
                     <p className="font-black text-lg uppercase tracking-widest text-foreground">No squads found for this season.</p>
                     <p className="text-sm font-bold">The background scraper may still be indexing this data, or the season predates our archives.</p>
                  </div>
                ) : (
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                     {teamsData.map(team => (
                        <motion.button
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          key={team}
                          onClick={() => handleTeamClick(team)}
                          className="p-6 bg-card border-[3px] border-border shadow-neo flex flex-col items-center gap-4 group"
                        >
                          <div className="w-16 h-16 bg-background border-[3px] border-border flex items-center justify-center font-black font-serif text-3xl text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors overflow-hidden">
                            {teamLogos[team] ? (
                              <img src={teamLogos[team]} alt={team} className="w-10 h-10 object-contain" />
                            ) : (
                              team.charAt(0)
                            )}
                          </div>
                          <span className="font-black uppercase tracking-wider text-xs line-clamp-1 group-hover:text-primary transition-colors">{team}</span>
                        </motion.button>
                     ))}
                  </motion.div>
                )}
             </motion.div>
          ) : null}
        </div>
      </main>

    </div>
  );
}
