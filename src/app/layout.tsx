import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Toaster } from "sonner";
import { LiveScoreNotifications } from "@/components/forma/LiveScoreNotifications";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Forma - Football News & History",
  description: "A neobrutalist platform for football news, scores, and historical data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable)}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        {children}
        <LiveScoreNotifications />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
