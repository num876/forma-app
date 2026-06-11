"use client";

import { cn } from "@/lib/utils";

export type LeagueRow = {
  position: number;
  team_name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
};

import teamLogosData from "@/lib/data/team_logos.json";
const teamLogos = teamLogosData as Record<string, string>;

export function LeagueTable({ data, onTeamClick }: { data: LeagueRow[], onTeamClick: (team: string) => void }) {
  if (!data || data.length === 0) return <div className="p-8 text-center border-2 border-dashed border-border shadow-neo text-muted-foreground font-medium">No league data available.</div>;

  return (
    <div className="overflow-x-auto border-2 border-border shadow-neo bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-background border-b-2 border-border font-black tracking-widest text-foreground">
          <tr>
            <th scope="col" className="px-6 py-4 border-r-2 border-border w-16 text-center">Pos</th>
            <th scope="col" className="px-6 py-4 font-serif text-sm">Club</th>
            <th scope="col" className="px-4 py-4 text-center border-l-2 border-border hidden sm:table-cell">MP</th>
            <th scope="col" className="px-4 py-4 text-center">W</th>
            <th scope="col" className="px-4 py-4 text-center">D</th>
            <th scope="col" className="px-4 py-4 text-center">L</th>
            <th scope="col" className="px-4 py-4 text-center hidden md:table-cell">GF</th>
            <th scope="col" className="px-4 py-4 text-center hidden md:table-cell">GA</th>
            <th scope="col" className="px-4 py-4 text-center hidden sm:table-cell border-r-2 border-border">GD</th>
            <th scope="col" className="px-6 py-4 text-center text-primary font-black">Pts</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row.team_name} 
              className="border-b border-border/50 hover:bg-primary/10 transition-colors cursor-pointer group"
              onClick={() => onTeamClick(row.team_name)}
            >
              <td className="px-6 py-4 font-mono font-bold text-center border-r-2 border-border">{row.position}</td>
              <td className="px-6 py-4 font-bold text-foreground group-hover:text-primary transition-colors">
                <div className="flex items-center gap-3">
                  {teamLogos[row.team_name] && (
                    <img src={teamLogos[row.team_name]} alt="" className="w-6 h-6 object-contain shrink-0" />
                  )}
                  <span className="truncate">{row.team_name}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-l-2 border-border font-medium hidden sm:table-cell">{row.played}</td>
              <td className="px-4 py-4 text-center text-muted-foreground">{row.wins}</td>
              <td className="px-4 py-4 text-center text-muted-foreground">{row.draws}</td>
              <td className="px-4 py-4 text-center text-muted-foreground">{row.losses}</td>
              <td className="px-4 py-4 text-center hidden md:table-cell text-muted-foreground">{row.goals_for}</td>
              <td className="px-4 py-4 text-center hidden md:table-cell text-muted-foreground">{row.goals_against}</td>
              <td className="px-4 py-4 text-center hidden sm:table-cell font-mono border-r-2 border-border">{row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}</td>
              <td className="px-6 py-4 font-black text-center text-primary text-base">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
