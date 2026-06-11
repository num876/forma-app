"use client";

import { cn } from "@/lib/utils";
import { LeagueRow } from "./LeagueTable";

export type Group = {
  name: string;
  standings: LeagueRow[];
};

import teamLogosData from "@/lib/data/team_logos.json";
const teamLogos = teamLogosData as Record<string, string>;

export function GroupStageTable({ groups, onTeamClick }: { groups: Group[], onTeamClick: (team: string) => void }) {
  if (!groups || groups.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {groups.map((group) => (
        <div key={group.name} className="overflow-x-auto border-2 border-border shadow-neo bg-card">
          <div className="px-6 py-4 bg-background border-b-2 border-border">
            <h3 className="font-black font-serif text-xl">Group {group.name}</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-card border-b-2 border-border font-bold tracking-widest text-muted-foreground">
              <tr>
                <th scope="col" className="px-2 md:px-4 py-3 w-8 md:w-12 text-center border-r-[3px] border-border">#</th>
                <th scope="col" className="px-4 py-3">Club</th>
                <th scope="col" className="px-3 py-3 text-center border-l-[3px] border-border hidden sm:table-cell">MP</th>
                <th scope="col" className="px-3 py-3 text-center border-r-[3px] border-border hidden sm:table-cell">GD</th>
                <th scope="col" className="px-4 py-3 text-center text-primary font-black">Pts</th>
              </tr>
            </thead>
            <tbody>
              {group.standings.map((team) => (
                <tr 
                  key={team.team_name} 
                  className="border-b-2 border-border/50 hover:bg-primary/10 transition-colors cursor-pointer group-row"
                  onClick={() => onTeamClick(team.team_name)}
                >
                  <td className="px-2 md:px-4 py-3 font-mono text-center border-r-[3px] border-border font-bold">{team.position}</td>
                  <td className="px-4 py-3 font-bold text-foreground hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      {teamLogos[team.team_name] && (
                        <img src={teamLogos[team.team_name]} alt="" className="w-5 h-5 md:w-6 md:h-6 object-contain shrink-0" />
                      )}
                      <span className="truncate max-w-[120px] sm:max-w-none">{team.team_name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center border-l-[3px] border-border font-medium hidden sm:table-cell">{team.played}</td>
                  <td className="px-3 py-3 text-center font-mono border-r-[3px] border-border text-muted-foreground hidden sm:table-cell">{team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}</td>
                  <td className="px-4 py-3 font-black text-center text-primary text-base md:text-lg">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
