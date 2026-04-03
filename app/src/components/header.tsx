"use client";

import Link from "next/link";
import { useStats } from "@/hooks/use-games";

export function Header() {
  const { stats } = useStats();

  const totalActive = stats
    ? Object.values(stats).reduce((sum, s) => sum + (s.active || 0), 0)
    : null;

  // Only active (unresolved) games have bonds locked
  const estimatedBonds = totalActive ? (totalActive * 0.08).toFixed(1) : null;

  return (
    <header className="relative overflow-hidden">
      {/* Geometric tessellation pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mosaic" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#f97316" strokeWidth="0.5" />
            <path d="M20 10L30 20L20 30L10 20Z" fill="none" stroke="#f97316" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="2" fill="none" stroke="#f97316" strokeWidth="0.3" />
            <path d="M0 0L20 0L0 20Z" fill="none" stroke="#f97316" strokeWidth="0.3" />
            <path d="M40 0L40 20L20 0Z" fill="none" stroke="#f97316" strokeWidth="0.3" />
            <path d="M40 40L20 40L40 20Z" fill="none" stroke="#f97316" strokeWidth="0.3" />
            <path d="M0 40L0 20L20 40Z" fill="none" stroke="#f97316" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mosaic)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-terminal-bg via-transparent to-terminal-bg" />

      {/* Fault line */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        preserveAspectRatio="none"
        viewBox="0 0 1200 2"
      >
        <path
          d="M0,1 L200,1 L210,0 L230,2 L240,0 L260,1 L400,1 L420,2 L425,0 L440,1 L600,1 L610,2 L615,0 L630,1 L800,1 L810,0 L830,2 L835,1 L1000,1 L1010,2 L1020,0 L1030,1 L1200,1"
          stroke="url(#fault-gradient)"
          strokeWidth="1.5"
          fill="none"
        />
        <defs>
          <linearGradient id="fault-gradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
            <stop offset="30%" stopColor="#f97316" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative px-5 py-5 flex items-center justify-between max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/" className="group">
            <span className="relative font-mono font-black text-xl tracking-tighter">
              <span className="text-terminal-accent">DISPUTE</span>
              <span className="text-zinc-600 mx-[2px] font-light">/</span>
              <span className="text-zinc-200">EXPLORER</span>
            </span>
          </Link>
          <a
            href="https://x.com/donnoh_eth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors"
          >
            by donnoh.eth
          </a>
        </div>

        <div className="hidden sm:flex items-center gap-5 text-xs">
          {estimatedBonds && (
            <span className="flex items-center gap-2 text-yellow-400 font-mono font-semibold">
              ~{estimatedBonds} ETH bonded
            </span>
          )}
          {totalActive !== null && totalActive > 0 && (
            <span className="flex items-center gap-2 text-zinc-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 pulse-dot" />
              {totalActive} active
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
