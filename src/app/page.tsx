"use client";

import React, { useRef, useState, useCallback } from "react";
import { useLenis } from "@/hooks/useLenis";
import { CanvasScrubber } from "@/components/CanvasScrubber";
import { HeroSection } from "@/components/HeroSection";
import { RoomOverlays } from "@/components/RoomOverlays";
import { FloatingNav } from "@/components/FloatingNav";
import { CustomCursor } from "@/components/CustomCursor";
import { PolishEffects } from "@/components/PolishEffects";
import { InquiryModal } from "@/components/InquiryModal";
import { ROOMS, RoomInfo } from "@/data/rooms";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Step 10: Lenis smooth scroll hook integrated with GSAP ticker
  const lenis = useLenis();

  // Handle frame and scroll progress updates from CanvasScrubber
  const handleProgressChange = useCallback((progress: number, frame: number) => {
    setScrollProgress(progress);
    setCurrentFrame(frame);
  }, []);

  // Step 13: Smooth scroll to selected room frame range using Lenis
  const handleSelectRoom = useCallback(
    (room: RoomInfo) => {
      if (!lenis) {
        // Fallback for native scroll if lenis isn't ready
        const totalDistance = window.innerHeight * 5.5;
        window.scrollTo({
          top: room.centerProgress * totalDistance,
          behavior: "smooth",
        });
        return;
      }

      const totalDistance = window.innerHeight * 5.5;
      const targetScroll = room.centerProgress * totalDistance;

      lenis.scrollTo(targetScroll, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    },
    [lenis]
  );

  const handleScrollToNext = useCallback(() => {
    if (!lenis) return;
    const totalDistance = window.innerHeight * 5.5;
    const targetScroll = 0.18 * totalDistance;
    lenis.scrollTo(targetScroll, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, [lenis]);

  // Keyboard navigation support for effortless walkthrough
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input, textarea or select
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.tagName === "SELECT" ||
        isInquiryOpen
      ) {
        return;
      }

      const activeIdx = ROOMS.findIndex(
        (r) => currentFrame >= r.startFrame && currentFrame <= r.endFrame
      );

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const nextRoom = ROOMS[Math.min(ROOMS.length - 1, (activeIdx >= 0 ? activeIdx : 0) + 1)];
        handleSelectRoom(nextRoom);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prevRoom = ROOMS[Math.max(0, (activeIdx >= 0 ? activeIdx : 0) - 1)];
        handleSelectRoom(prevRoom);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentFrame, isInquiryOpen, handleSelectRoom]);

  return (
    <main className="relative w-full bg-[#0a0a0c] text-white selection:bg-white selection:text-black min-h-screen">
      {/* Luxury Custom Cursor (Step 14) */}
      <CustomCursor />

      {/* Film Grain & Soft Vignette (Step 14) */}
      <PolishEffects />

      {/* Minimal Premium Hero Section (Step 11) */}
      <HeroSection
        scrollProgress={scrollProgress}
        onNavigateToSpaces={handleScrollToNext}
        onOpenInquiry={() => setIsInquiryOpen(true)}
      />

      {/* Floating Progress Navigation on Right (Step 13) */}
      <FloatingNav
        currentFrame={currentFrame}
        scrollProgress={scrollProgress}
        onSelectRoom={handleSelectRoom}
      />

      {/* Room Timeline Glassmorphism Overlays (Step 12) */}
      <RoomOverlays
        currentFrame={currentFrame}
        scrollProgress={scrollProgress}
      />

      {/* Apple-Style Pinned Canvas Section (Steps 8, 9, 15) */}
      <section
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden"
      >
        <CanvasScrubber
          containerRef={containerRef}
          onProgressChange={handleProgressChange}
        />
      </section>

      {/* Post-Scroll Architectural Colophon & Specifications Section */}
      <section className="relative z-30 w-full bg-neutral-950 border-t border-white/10 px-6 sm:px-16 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10">
            <div>
              <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400">
                Architectural Monograph
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-white mt-1.5">
                Patel Villa
              </h3>
            </div>
            <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed mt-3 md:mt-0">
              A private coastal estate carved with monolithic architectural volumes,
              sculptural glazing, and an expansive 25-meter turquoise infinity pool.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-neutral-300">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase mb-0.5">
                Internal Area
              </span>
              <span className="text-lg sm:text-xl font-light text-white">1,450 m²</span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                Conditioned Living Space
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase mb-0.5">
                Estate Grounds
              </span>
              <span className="text-lg sm:text-xl font-light text-white">4,800 m²</span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                Private Terraced Grounds
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase mb-0.5">
                Suites & Baths
              </span>
              <span className="text-lg sm:text-xl font-light text-white">6 / 8</span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                Spa-Equipped Chambers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase mb-0.5">
                Pool Length
              </span>
              <span className="text-lg sm:text-xl font-light text-white">25.0 m</span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                Turquoise Infinity
              </span>
            </div>
          </div>

          {/* Quick Room Index Navigation */}
          <div className="mb-14">
            <h4 className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 mb-5">
              Spatial Chamber Index
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {ROOMS.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono text-neutral-400">
                      {room.number}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                      Jump to Realm →
                    </span>
                  </div>
                  <div className="font-serif text-sm text-white font-normal group-hover:translate-x-0.5 transition-transform">
                    {room.name}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                    {room.tagline}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 text-[11px] text-neutral-500 font-mono">
            <span>© 2026 Patel Villa Architecture Studio</span>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <button
                onClick={() => setIsInquiryOpen(true)}
                className="text-white hover:underline underline-offset-4 tracking-wider uppercase text-[11px]"
              >
                Request Dossier
              </button>
              <button
                onClick={() => {
                  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Back to Summit ↑
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Private Acquisition Concierge Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </main>
  );
}
