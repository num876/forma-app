import { Player, getClubById, getClubLogoUrl } from "@/lib/data/players";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PlayerCard({ player, selected, onClick, className }: { player: Player, selected?: boolean, onClick?: () => void, className?: string }) {
  const club = getClubById(player.clubId);

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-colors shadow-none rounded-xl border group",
        selected ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30 bg-card',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{player.name}</span>
          <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground font-semibold uppercase tracking-wider">
            <span>{player.position}</span>
            <span>·</span>
            <span>{player.nationality}</span>
          </div>
        </div>
        
        {club && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-block text-[0.75rem] font-medium text-muted-foreground">
              {club.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-border/50 overflow-hidden">
              <img src={getClubLogoUrl(club.id)} alt={club.name} className="w-5 h-5 object-contain drop-shadow-sm" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
