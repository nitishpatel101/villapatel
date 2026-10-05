"use client";

import React, { useEffect, useState, useRef } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const followerPosRef = useRef({ x: -100, y: -100 });
  const mousePosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable custom cursor for fine pointer (desktop mouse)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("button, a, [role='button'], input, select, textarea, .group")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Smooth spring follower animation loop
    let animId: number;
    const animateFollower = () => {
      const lerp = 0.15;
      followerPosRef.current.x +=
        (mousePosRef.current.x - followerPosRef.current.x) * lerp;
      followerPosRef.current.y +=
        (mousePosRef.current.y - followerPosRef.current.y) * lerp;

      setFollowerPos({
        x: followerPosRef.current.x,
        y: followerPosRef.current.y,
      });

      animId = requestAnimationFrame(animateFollower);
    };

    animId = requestAnimationFrame(animateFollower);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Central Sharp Dot */}
      <div
        className="fixed w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Trailing Luxury Ring */}
      <div
        className={`fixed rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none border ${
          isHovering
            ? "w-12 h-12 border-white/80 bg-white/10 backdrop-blur-[1px] scale-110"
            : "w-8 h-8 border-white/30 bg-transparent scale-100"
        }`}
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
          opacity: isVisible ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
