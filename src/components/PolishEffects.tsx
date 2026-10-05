"use client";

import React from "react";

export function PolishEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* Soft Vignette around screen edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* Subtle Cinematic Film Grain Overlay (SVG noise filter) */}
      <svg className="fixed inset-0 w-full h-full opacity-[0.038] mix-blend-screen pointer-events-none">
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </div>
  );
}
