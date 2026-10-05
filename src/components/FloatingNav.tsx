"use client";

import React, { useState } from "react";
import { ROOMS, RoomInfo } from "@/data/rooms";

interface FloatingNavProps {
  currentFrame: number;
  scrollProgress: number;
  onSelectRoom: (room: RoomInfo) => void;
}

export function FloatingNav({
  currentFrame,
  scrollProgress,
  onSelectRoom,
}: FloatingNavProps) {
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  // Identify active room based on frame range
  const activeRoom = ROOMS.find(
    (room) => currentFrame >= room.startFrame && currentFrame <= room.endFrame
  ) || ROOMS[0];

  return (
    <aside
      className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 select-none flex flex-col items-end pointer-events-auto"
      aria-label="Room Navigation"
    >
      {/* Background glass pill with integrated progress gauge */}
      <div className="relative flex flex-col items-end space-y-4 py-4 px-2 sm:px-3 rounded-full bg-neutral-950/40 backdrop-blur-md border border-white/10 shadow-2xl">
        {/* Subtle vertical progress line */}
        <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="w-full bg-white/40 transition-all duration-150"
            style={{ height: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
        {ROOMS.map((room) => {
          const isActive = activeRoom.id === room.id;
          const isHovered = hoveredRoomId === room.id;

          return (
            <div
              key={room.id}
              className="relative flex items-center justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredRoomId(room.id)}
              onMouseLeave={() => setHoveredRoomId(null)}
              onClick={() => onSelectRoom(room)}
              role="button"
              tabIndex={0}
              aria-label={`Jump to ${room.name}`}
            >
              {/* Flyout Label on hover or when active */}
              <div
                className={`absolute right-7 sm:right-8 pr-2 flex items-center transition-all duration-300 pointer-events-none whitespace-nowrap ${
                  isActive || isHovered
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2"
                }`}
              >
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 backdrop-blur-xl border border-white/15 shadow-xl text-neutral-100">
                  <span className="text-[10px] font-mono text-neutral-400">
                    {room.number}
                  </span>
                  <span className="text-xs font-serif tracking-wider">
                    {room.name}
                  </span>
                </div>
              </div>

              {/* Progress Line/Dot Indicator */}
              <div className="flex items-center justify-center p-1">
                <div
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-6 h-[3px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : isHovered
                      ? "w-4 h-[2px] bg-neutral-300"
                      : "w-2 h-[2px] bg-neutral-600"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Frame Counter Badge below nav */}
      <div className="mt-4 px-2.5 py-1 rounded-full bg-neutral-900/60 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-neutral-400">
        <span className="text-white font-medium">{currentFrame.toString().padStart(3, "0")}</span>
        <span className="text-neutral-600 mx-1">/</span>
        <span>341</span>
      </div>
    </aside>
  );
}
