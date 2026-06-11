"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, User } from "lucide-react";
import Link from "next/link";
import { FixtureChip } from "@/components/forma/FixtureChip";
import { NewsCard } from "@/components/forma/NewsCard";
import { getPlayerById, getClubById, getClubLogoUrl } from "@/lib/data/players";
import { motion } from "framer-motion";
import { NeoSkeleton } from "@/components/ui/skeleton";
import { MobileNav } from "@/components/forma/MobileNav";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<{ leagues: number[], clubs: number[], players: number[] } | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("forma_preferences");
    if (!stored) {
      router.push("/onboarding");
    } else {
      const parsedPrefs = JSON.parse(stored);
      setPreferences(parsedPrefs);
      setLoading(false);
      
      // Fetch Live News
      fetch("/api/news")
        .then(res => res.json())
        .then(data => setNews(data))
        .catch(console.error);
        
      // Fetch Live Fixtures
      const clubsQuery = parsedPrefs.clubs?.length > 0 ? `?clubs=${parsedPrefs.clubs.join(',')}` : '';
      fetch(`/api/fixtures${clubsQuery}`)
        .then(res => res.json())
        .then(data => setFixtures(data))
        .catch(console.error);
    }
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-primary text-[0.85rem]">◈</span>
            <span className="font-black text-2xl tracking-tight text-foreground">forma</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="text-foreground transition-colors">Home</Link>
            <Link href="/history" className="hover:text-foreground transition-colors">History Explorer</Link>
          </nav>
          <div className="hidden md:flex items-center gap-4 text-muted-foreground">
            <Settings className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden">
              <User className="w-4 h-4 text-foreground" />
            </div>
          </div>
          <MobileNav />
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-6xl mx-auto px-4 mt-8 flex flex-col gap-8"
      >
        <div className="flex-1 flex flex-col gap-8 w-full">
          
          <section>
            <h2 className="text-lg font-bold mb-4 tracking-tight font-serif italic">Your Fixtures</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {fixtures.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex gap-4">
                  {fixtures.map((match, i) => (
                    <motion.div variants={itemVariants} key={i} className="snap-start">
                      <FixtureChip match={match} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex gap-4">
                  {[1, 2, 3].map(i => (
                    <NeoSkeleton key={i} className="h-32 w-56 shrink-0" />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 tracking-tight font-serif italic">Global News Feed</h2>
            <div className="flex flex-col gap-4">
              {news.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-4">
                  {news.map((item, i) => (
                    <motion.div variants={itemVariants} key={i}>
                      <NewsCard news={item} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => (
                    <NeoSkeleton key={i} className="h-40 w-full" />
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </motion.main>
    </div>
  );
}
