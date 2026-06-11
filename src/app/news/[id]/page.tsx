"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ArticleData = {
  title: string;
  byline?: string;
  siteName?: string;
  excerpt?: string;
  content: string;
  originalUrl: string;
  error?: string;
};

export default function ArticleReadingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/news/read?id=${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load article');
        }
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        try {
          setFallbackUrl(Buffer.from(id, 'base64url').toString('utf-8'));
        } catch (e) {}
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Extracting Article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full border-4 border-foreground bg-card p-8 shadow-neo flex flex-col items-center text-center gap-6">
          <AlertTriangle size={64} className="text-destructive" />
          <h1 className="text-3xl font-black uppercase">Extraction Blocked</h1>
          <p className="text-lg text-muted-foreground font-medium">
            The original news source has strong anti-bot protections or a hard paywall that prevented our Neobrutalist reading engine from extracting the full text.
          </p>
          <div className="flex gap-4 mt-4 w-full">
            <Button onClick={() => router.back()} variant="outline" className="flex-1 h-14 text-lg font-bold border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ArrowLeft className="mr-2" /> Go Back
            </Button>
            {fallbackUrl && (
              <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full h-14 text-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Read on Source <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-foreground">
      {/* Neobrutalist Header Bar */}
      <header className="sticky top-0 z-50 bg-[#FAF9F6] border-b-4 border-foreground px-4 md:px-8 py-4 flex items-center justify-between">
        <Button onClick={() => router.back()} variant="ghost" className="hover:bg-foreground hover:text-background transition-colors font-bold uppercase tracking-widest px-6 h-12 border-2 border-transparent hover:border-foreground">
          <ArrowLeft className="mr-2 w-5 h-5" /> Back to Dashboard
        </Button>
        <div className="hidden md:flex items-center gap-2 font-black uppercase tracking-widest text-sm text-muted-foreground">
          <span>{article.siteName || "News Source"}</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <article>
          {/* Headline */}
          <header className="mb-12 border-b-4 border-foreground pb-12">
            <h1 className="text-5xl md:text-7xl font-black font-serif leading-[1.1] mb-6">
              {article.title}
            </h1>
            
            {(article.byline || article.siteName) && (
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest bg-foreground text-background inline-flex px-4 py-2">
                {article.byline && <span>By {article.byline}</span>}
                {article.byline && article.siteName && <span>/</span>}
                {article.siteName && <span>{article.siteName}</span>}
              </div>
            )}
            
            {article.excerpt && (
              <p className="text-xl md:text-2xl font-medium text-muted-foreground mt-8 leading-relaxed border-l-4 border-primary pl-6">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Article Body - Uses standard prose but stylized via globals.css or inline classes */}
          <div 
            className="prose prose-xl md:prose-2xl max-w-none 
                       prose-headings:font-black prose-headings:font-serif 
                       prose-p:font-medium prose-p:leading-relaxed prose-p:text-foreground/90
                       prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                       prose-img:border-4 prose-img:border-foreground prose-img:shadow-neo prose-img:w-full
                       prose-blockquote:border-l-8 prose-blockquote:border-foreground prose-blockquote:bg-muted prose-blockquote:p-6 prose-blockquote:font-serif prose-blockquote:font-bold prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Footer Action */}
          <footer className="mt-20 pt-12 border-t-4 border-foreground flex justify-center">
            <a href={article.originalUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="h-16 px-12 text-xl font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                View Original Article <ExternalLink className="ml-3 w-6 h-6" />
              </Button>
            </a>
          </footer>
        </article>
      </main>
    </div>
  );
}
