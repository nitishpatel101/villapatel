"use client";

import React, { useEffect, useState } from "react";

interface PreloaderProps {
  progress: number; // 0 to 100
  isLoaded: boolean;
  onAnimationComplete?: () => void;
}

export function Preloader({ progress, isLoaded, onAnimationComplete }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // Allow user to appreciate 100% state momentarily before elegant exit
      const timer = setTimeout(() => {
        setFadingOut(true);
        const exitTimer = setTimeout(() => {
          setShouldRender(false);
          onAnimationComplete?.();
        }, 800);
        return () => clearTimeout(exitTimer);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, onAnimationComplete]);

  if (!shouldRender) return null;

  const displayPercent = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] text-neutral-100 transition-all duration-700 ease-out select-none ${
        fadingOut ? "opacity-0 pointer-events-none scale-105 blur-sm" : "opacity-100"
      }`}
      aria-label="Experience Preloader"
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Center content container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Architectural Monogram */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-neutral-700/60 flex items-center justify-center relative overflow-hidden backdrop-blur-md bg-neutral-900/40">
            <svg
              className="w-8 h-8 text-neutral-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <div
              className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent transition-transform duration-300"
              style={{ transform: `translateY(${100 - displayPercent}%)` }}
            />
          </div>
        </div>

        {/* Villa Title */}
        <h1 className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-sans mb-1.5 font-medium">
          Patel Villa
        </h1>
        <p className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase font-mono mb-6">
          Spatial Architectural Sequence
        </p>

        {/* Clean Loading Percentage (Scaled to refined, elegant proportions) */}
        <div className="flex items-baseline space-x-1 mb-5">
          <span className="text-3xl sm:text-4xl font-light tracking-tight tabular-nums text-neutral-100 font-sans">
            {displayPercent.toString().padStart(3, "0")}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono font-normal">%</span>
        </div>

        {/* Minimal Precision Hairline Progress Bar */}
        <div className="w-48 sm:w-56 h-[2px] bg-neutral-800/80 rounded-full overflow-hidden relative mb-3">
          <div
            className="h-full bg-gradient-to-r from-neutral-400 via-neutral-200 to-white transition-all duration-200 ease-out"
            style={{ width: `${displayPercent}%` }}
          />
        </div>

        {/* Status text */}
        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-500 font-mono transition-opacity duration-300">
          {displayPercent < 100
            ? `Calibrating Master Sequence (150 Initial)`
            : "Sequence Ready"}
        </p>
      </div>

      {/* Bottom Coordinates Branding */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
        <span>43°44&apos;12&quot;N 7°25&apos;38&quot;E</span>
        <span>Curated Spatial Walkthrough</span>
      </div>
    </div>
  );
}
