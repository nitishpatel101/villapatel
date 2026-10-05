"use client";

import React from "react";

interface HeroSectionProps {
  scrollProgress: number;
  onNavigateToSpaces?: () => void;
  onOpenInquiry?: () => void;
}

export function HeroSection({
  scrollProgress,
  onNavigateToSpaces,
  onOpenInquiry,
}: HeroSectionProps) {
  // Gracefully reduce opacity of hero-specific hints as user scrolls into the tour
  const heroOpacity = Math.max(0, 1 - scrollProgress * 6);
  const isScrolled = scrollProgress > 0.03;

  return (
    <header className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* Top Navbar with dynamic blur transition (Step 14) */}
      <nav
        className={`w-full px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto transition-all duration-500 ${
          isScrolled
            ? "bg-neutral-950/60 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Top-Left: Elegant Architectural Logo */}
        <div className="flex items-center space-x-2.5 group cursor-pointer">
          <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center transition-colors group-hover:border-white/60 bg-white/[0.03]">
            <svg
              className="w-3.5 h-3.5 text-white/90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.28em] text-xs uppercase text-neutral-100 font-medium">
              Patel Villa
            </span>
            <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-neutral-400">
              Modern Luxury Residence
            </span>
          </div>
        </div>

        {/* Top-Right: Minimal Navigation Bar */}
        <div className="flex items-center space-x-5 sm:space-x-8 text-[10px] font-mono tracking-[0.22em] uppercase text-neutral-300">
          <button
            onClick={onNavigateToSpaces}
            className="hover:text-white transition-colors duration-200 cursor-pointer hidden md:inline-block relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all hover:after:w-full"
          >
            Spaces
          </button>
          <span className="text-neutral-600 hidden md:inline-block">/</span>
          <button
            onClick={onNavigateToSpaces}
            className="hover:text-white transition-colors duration-200 cursor-pointer hidden sm:inline-block relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all hover:after:w-full"
          >
            Architecture
          </button>
          <button
            onClick={onOpenInquiry}
            className="px-3.5 py-1.5 rounded-full border border-white/25 bg-white/5 hover:bg-white/15 text-white transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-lg active:scale-95 text-[10px]"
          >
            Private Viewing
          </button>
        </div>
      </nav>

      {/* Bottom Center: Animated Minimal Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer transition-opacity duration-500"
        style={{ opacity: heroOpacity }}
        onClick={onNavigateToSpaces}
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-300/80 mb-2.5 animate-pulse">
          Scroll to Explore
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/70 via-white/20 to-transparent relative overflow-hidden">
          <div className="w-full h-1/2 bg-white animate-bounce" />
        </div>
      </div>

      {/* Subtle bottom-left coordinates metadata */}
      <div
        className="absolute bottom-8 left-8 sm:left-12 hidden lg:flex flex-col text-[9px] font-mono tracking-[0.25em] uppercase text-neutral-400 transition-opacity duration-500 pointer-events-none"
        style={{ opacity: heroOpacity }}
      >
        <span className="text-neutral-500">Spatial Interactive Sequence</span>
        <span className="text-neutral-300">341 Master Frames · 6 Realms</span>
      </div>

      {/* Subtle bottom-right year & scale */}
      <div
        className="absolute bottom-8 right-8 sm:right-12 hidden lg:flex flex-col items-end text-[9px] font-mono tracking-[0.25em] uppercase text-neutral-400 transition-opacity duration-500 pointer-events-none"
        style={{ opacity: heroOpacity }}
      >
        <span className="text-neutral-500">Architecture</span>
        <span className="text-neutral-300">Patel Villa Estate</span>
      </div>
    </header>
  );
}
