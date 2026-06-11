import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function NewsCard({ news, className }: { news: { id?: string, source: string, sourceIconUrl?: string, timeAgo: string, headline: string, imageUrl?: string, url?: string, tags: string[] }, className?: string }) {
  const CardContent = () => (
    <motion.div 
      whileHover={{ scale: 1.01, x: 4, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("p-4 border-[3px] border-border bg-card shadow-neo flex gap-4 group hover:bg-[#FFFF00] transition-colors duration-0", className)}
    >
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-1">
            {news.sourceIconUrl && <img src={news.sourceIconUrl} alt="" className="w-4 h-4 object-contain" />}
            <span>{news.source} <span className="text-muted-foreground mx-1">/</span> {news.timeAgo}</span>
          </div>
          <h3 className="text-xl font-black font-serif leading-snug text-foreground group-hover:text-primary transition-colors">
            {news.headline}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {news.tags.map((tag, i) => (
            <span key={i} className="text-[0.65rem] px-2 py-0.5 border-2 border-border bg-background text-foreground font-black uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {news.imageUrl && (
        <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-border shrink-0 bg-muted">
          <img src={news.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </motion.div>
  );

  if (news.url) {
    return (
      <a href={news.url} target="_blank" rel="noopener noreferrer" className="block">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}
