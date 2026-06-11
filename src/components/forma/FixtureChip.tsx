import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export type FixtureProps = {
  id?: number;
  home: string;
  homeLogo?: string;
  away: string;
  awayLogo?: string;
  date: string;
  competition: string;
  homeScore?: number;
  awayScore?: number;
  status?: string;
  events?: any[];
};

export function FixtureChip({ match, className }: { match: FixtureProps, className?: string }) {
  const played = match.homeScore !== undefined && match.awayScore !== undefined;
  
  const latestEvent = match.events?.slice().reverse().find(e => e.type === "Goal" || e.detail === "Red Card");
  
  const content = (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("flex-shrink-0 flex flex-col p-4 border-[3px] border-border bg-card shadow-neo min-w-[220px] hover:bg-[#FFFF00] transition-colors duration-0 group", className)}
    >
      <div className="text-[0.65rem] text-primary uppercase tracking-widest mb-3 flex items-center justify-between font-black border-b-[3px] border-border pb-2">
        <span className="truncate pr-2">{match.competition}</span>
        <div className="flex items-center gap-2">
          {match.date.startsWith('Live') && (
            <span className="text-red-500 font-bold animate-pulse">{match.date}</span>
          )}
          {played ? (
            <span className="font-black text-background bg-foreground px-1.5 py-0.5">{match.homeScore} - {match.awayScore}</span>
          ) : (
            <span className="text-foreground">{match.date}</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 text-sm font-black uppercase tracking-wider">
        <div className="flex items-center gap-3">
          {match.homeLogo && <img src={match.homeLogo} alt="" className="w-5 h-5 object-contain" />}
          <span className="truncate text-foreground">{match.home}</span>
        </div>
        <div className="flex items-center gap-3">
          {match.awayLogo && <img src={match.awayLogo} alt="" className="w-5 h-5 object-contain" />}
          <span className="truncate text-foreground">{match.away}</span>
        </div>
      </div>

      {latestEvent && (
        <div className="mt-3 pt-2 text-[0.65rem] font-bold border-t-[2px] border-border/50 flex items-center gap-2 overflow-hidden w-full whitespace-nowrap text-muted-foreground">
          <span className={latestEvent.type === "Goal" ? "text-primary shrink-0" : "text-red-500 shrink-0"}>
            {latestEvent.time.elapsed}' {latestEvent.type === "Goal" ? "⚽" : "🟥"}
          </span>
          <span className="truncate animate-marquee">
            {latestEvent.player.name}
          </span>
        </div>
      )}
    </motion.div>
  );

  if (match.id) {
    return <Link href={`/match/${match.id}`} className="block">{content}</Link>;
  }
  return content;
}
