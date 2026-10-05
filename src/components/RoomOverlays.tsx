"use client";

import React, { useEffect, useState, useRef } from "react";
import { ROOMS } from "@/data/rooms";

interface RoomOverlaysProps {
  currentFrame: number;
  scrollProgress: number;
}

export function RoomOverlays({ currentFrame }: RoomOverlaysProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Subtle mouse parallax (Step 14)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const factorX = (e.clientX - centerX) / centerX;
      const factorY = (e.clientY - centerY) / centerY;
      setMouseOffset({
        x: factorX * 8, // subtle 8px parallax
        y: factorY * 8,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Determine which room is currently in focus
  const activeRoom = ROOMS.find(
    (room) => currentFrame >= room.startFrame && currentFrame <= room.endFrame
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
      aria-live="polite"
    >
      {ROOMS.map((room) => {
        const isActive = activeRoom?.id === room.id;

        // Calculate smooth entrance/exit progress within room frame range
        const totalRoomFrames = room.endFrame - room.startFrame;
        const frameOffset = currentFrame - room.startFrame;
        const progressInRoom = frameOffset / totalRoomFrames; // 0 to 1

        // Fade in during first 18%, stay fully visible, fade out during last 18%
        let cardOpacity = 0;
        let cardY = 24;
        let cardBlur = 12;

        if (isActive) {
          if (progressInRoom < 0.18) {
            const factor = progressInRoom / 0.18;
            cardOpacity = factor;
            cardY = (1 - factor) * 24;
            cardBlur = (1 - factor) * 12;
          } else if (progressInRoom > 0.82) {
            const factor = (1 - progressInRoom) / 0.18;
            cardOpacity = factor;
            cardY = (1 - factor) * -20;
            cardBlur = (1 - factor) * 12;
          } else {
            cardOpacity = 1;
            cardY = 0;
            cardBlur = 0;
          }
        }

        // Only render or show if it has visible opacity
        if (!isActive && cardOpacity <= 0) return null;

        const isLeft = room.alignment === "bottom-left";

        return (
          <div
            key={room.id}
            className={`absolute bottom-6 sm:bottom-10 ${
              isLeft
                ? "left-4 sm:left-10 lg:left-14"
                : "right-4 sm:right-16 lg:right-24"
            } max-w-[320px] sm:max-w-sm w-[calc(100vw-2rem)] sm:w-auto transition-all duration-300 pointer-events-auto`}
            style={{
              opacity: cardOpacity,
              transform: `translate3d(${mouseOffset.x}px, ${
                cardY + mouseOffset.y
              }px, 0)`,
              filter: `blur(${cardBlur}px)`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Glassmorphic Card Container - Refined & Compact */}
            <div className="relative rounded-xl bg-neutral-950/70 backdrop-blur-2xl border border-white/15 p-4.5 sm:p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] text-neutral-100 overflow-hidden group">
              {/* Subtle top reflective border highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              {/* Room Header Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                    {room.number}
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                    {room.subtitle}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-neutral-400 tracking-wider">
                  {currentFrame} / {room.endFrame} F
                </div>
              </div>

              {/* Title & Tagline - Elegant & Scaled Down */}
              <h2 className="text-base sm:text-lg font-serif font-normal text-white tracking-wide mb-0.5">
                {room.name}
              </h2>
              <p className="text-[11px] text-neutral-300 font-sans tracking-wide mb-2 italic">
                {room.tagline}
              </p>

              {/* Description */}
              <p className="text-[11px] leading-relaxed text-neutral-300/80 mb-3.5 font-light">
                {room.description}
              </p>

              {/* Architectural Specs Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                {room.specs.map((spec, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400">
                      {spec.label}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-200 mt-0.5 truncate">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
