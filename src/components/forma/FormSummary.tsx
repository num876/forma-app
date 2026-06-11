import { FormBadge } from "./FormBadge";
import { cn } from "@/lib/utils";

export function FormSummary({ summary, loading, className }: { summary?: string; loading?: boolean, className?: string }) {
  return (
    <div className={cn("bg-[#0F2A1E] border-l-[3px] border-l-primary rounded-r-xl p-5 flex flex-col gap-3", className)}>
      <div className="self-start">
        <FormBadge />
      </div>
      {loading ? (
        <div className="flex flex-col gap-2 animate-pulse mt-1">
          <div className="h-4 bg-primary/20 rounded w-full"></div>
          <div className="h-4 bg-primary/20 rounded w-5/6"></div>
          <div className="h-4 bg-primary/20 rounded w-4/6"></div>
        </div>
      ) : (
        <p className="text-sm md:text-[0.95rem] text-foreground leading-relaxed">
          {summary || "Not enough data for AI summary."}
        </p>
      )}
      <div className="text-[0.65rem] text-primary/60 uppercase tracking-widest mt-1 font-semibold">
        Generated from stats + recent news
      </div>
    </div>
  );
}
