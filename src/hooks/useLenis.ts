"use client";

import { useEffect, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let lenisInstance: Lenis | null = null;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return lenisInstance;
}

function getServerSnapshot() {
  return null;
}

export function useLenis() {
  const lenis = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (lenisInstance) return;

    // Initialize Lenis with cinematic smooth settings
    const instance = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });

    lenisInstance = instance;
    listeners.forEach((listener) => listener());

    // Sync Lenis scroll with GSAP ScrollTrigger
    instance.on("scroll", ScrollTrigger.update);

    // Synchronize GSAP ticker with Lenis raf
    const tickerUpdate = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      instance.destroy();
      lenisInstance = null;
      listeners.forEach((listener) => listener());
    };
  }, []);

  return lenis;
}
