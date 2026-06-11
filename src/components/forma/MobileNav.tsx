"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="p-2 border-[3px] border-border bg-card shadow-neo"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[998] bg-black/70"
                  onClick={() => setIsOpen(false)}
                />

                {/* Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm z-[999] bg-background border-l-[4px] border-border flex flex-col"
                >
                  <div className="p-4 border-b-[4px] border-border flex justify-between items-center bg-card">
                    <span className="font-black text-2xl tracking-tighter text-primary">FORMA</span>
                    <button
                      onClick={() => setIsOpen(false)}
                      aria-label="Close menu"
                      className="p-2 border-[3px] border-border bg-background shadow-neo hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <nav className="flex flex-col p-6 gap-6 font-black text-3xl uppercase tracking-widest font-serif flex-1">
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="border-b-[3px] border-border pb-4 hover:text-primary transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setIsOpen(false)}
                      className="border-b-[3px] border-border pb-4 hover:text-primary transition-colors"
                    >
                      History Explorer
                    </Link>
                  </nav>

                  <div className="p-6 border-t-[4px] border-border bg-card flex justify-around items-center">
                    <button className="flex flex-col items-center gap-2 font-bold uppercase text-xs tracking-widest text-muted-foreground hover:text-foreground">
                      <Settings className="w-6 h-6" />
                      Settings
                    </button>
                    <button className="flex flex-col items-center gap-2 font-bold uppercase text-xs tracking-widest text-muted-foreground hover:text-foreground">
                      <User className="w-6 h-6" />
                      Profile
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
