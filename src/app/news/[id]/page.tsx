"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { motion } from "framer-motion";

type ArticleData = {
  headline: string;
  source: string;
  sourceIconUrl?: string;
  timeAgo: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  url: string;
  tags: string[];
};

export default function ArticleReadingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [article, setArticle] = useState<ArticleData | null>(null);

  useEffect(() => {
    if (!id) return;
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(id))))) as ArticleData;
      setArticle(decoded);
    } catch {
      router.replace('/');
    }
  }, [id, router]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background border-b-[3px] border-foreground px-4 md:px-8 h-16 flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-black uppercase tracking-widest text-sm px-4 py-2 border-[3px] border-foreground hover:bg-foreground hover:text-background transition-colors shadow-neo"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
          {article.sourceIconUrl && <img src={article.sourceIconUrl} alt="" className="w-4 h-4 object-contain" />}
          <span>{article.source}</span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-black uppercase tracking-widest text-xs px-4 py-2 border-[3px] border-foreground bg-primary text-primary-foreground hover:-translate-y-0.5 transition-transform shadow-neo"
        >
          Full Article <ExternalLink className="w-3 h-3" />
        </a>
      </header>

      {/* Hero Image */}
      {article.imageUrl && (
        <div className="w-full max-h-[40vh] overflow-hidden border-b-[3px] border-foreground">
          <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Article Body */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="max-w-3xl mx-auto px-4 md:px-8 py-10 pb-24"
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag, i) => (
            <span key={i} className="text-[0.65rem] px-3 py-1 border-[3px] border-foreground bg-primary text-primary-foreground font-black uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black font-serif leading-[1.05] mb-6 border-b-[6px] border-foreground pb-6">
          {article.headline}
        </h1>

        {/* Byline */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex items-center gap-2 bg-foreground text-background px-4 py-2">
            {article.sourceIconUrl && <img src={article.sourceIconUrl} alt="" className="w-5 h-5 object-contain invert" />}
            <span className="font-black uppercase tracking-widest text-sm">{article.source}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
            <Clock className="w-4 h-4" />
            {article.timeAgo}
          </div>
        </div>

        {/* Excerpt from RSS */}
        {article.excerpt ? (
          <div className="space-y-6">
            <p className="text-xl md:text-2xl leading-relaxed font-medium text-foreground/90 border-l-[6px] border-primary pl-6">
              {article.excerpt}
            </p>
            <div className="border-t-[3px] border-dashed border-border pt-8 mt-8">
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-6">
                This is a preview. Read the full article on {article.source}.
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-black uppercase tracking-widest text-lg border-[3px] border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all"
              >
                Read Full Article on {article.source} <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-12 text-center">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
              No preview available. Continue to {article.source} to read the full article.
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-black uppercase tracking-widest text-lg border-[3px] border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all"
            >
              Read on {article.source} <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}
      </motion.main>
    </div>
  );
}
