import { cn } from "@/lib/utils";

export function FormSparkline({ ratings, className }: { ratings: number[]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {ratings.map((r, i) => {
        const isGreen = r >= 7.5;
        const isAmber = r >= 6.5 && r < 7.5;
        const isRed = r > 0 && r < 6.5;
        const isUnknown = r === 0;

        return (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              isGreen && "bg-primary",
              isAmber && "bg-amber-500",
              isRed && "bg-destructive",
              isUnknown && "bg-muted"
            )}
            title={`Rating: ${r > 0 ? r : "N/A"}`}
          />
        );
      })}
    </div>
  );
}
