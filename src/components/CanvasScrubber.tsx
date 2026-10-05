"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TOTAL_FRAMES, INITIAL_PRELOAD_COUNT, getFrameUrl } from "@/data/rooms";
import { Preloader } from "./Preloader";

interface CanvasScrubberProps {
  onProgressChange: (progress: number, frame: number) => void;
  onPreloadComplete?: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function CanvasScrubber({
  onProgressChange,
  onPreloadComplete,
  containerRef,
}: CanvasScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesCache = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES + 1).fill(null)
  );
  const currentFrameRef = useRef<number>(1);
  const isPreloadedRef = useRef<boolean>(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [preloadProgress, setPreloadProgress] = useState<number>(0);
  const [isPreloaded, setIsPreloaded] = useState<boolean>(false);

  // Draw image to canvas with retina support and aspect-ratio cover
  const drawImageCover = useCallback(
    (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      // High-Definition Super-Sampling (Full DPR up to 2.5x for 10K clarity)
      const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5);
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      const targetW = Math.round(displayWidth * dpr);
      const targetH = Math.round(displayHeight * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const imgW = img.naturalWidth || 1280;
      const imgH = img.naturalHeight || 720;
      const imgAspect = imgW / imgH;
      const canvasAspect = canvas.width / canvas.height;

      let drawW = canvas.width;
      let drawH = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > imgAspect) {
        drawH = canvas.width / imgAspect;
        offsetY = (canvas.height - drawH) / 2;
      } else {
        drawW = canvas.height * imgAspect;
        offsetX = (canvas.width - drawW) / 2;
      }

      // Maximum fidelity rendering settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    },
    []
  );

  // Render a specific frame number
  const renderFrame = useCallback(
    (frameNumber: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const img = imagesCache.current[frameNumber];
      if (img && img.complete && img.naturalWidth > 0) {
        drawImageCover(canvas, img);
        return;
      }

      // If exact frame is not ready yet, fallback to closest loaded frame to avoid flickering
      let closestImg: HTMLImageElement | null = null;
      let minDiff = Infinity;
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const candidate = imagesCache.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          const diff = Math.abs(i - frameNumber);
          if (diff < minDiff) {
            minDiff = diff;
            closestImg = candidate;
          }
        }
      }

      if (closestImg) {
        drawImageCover(canvas, closestImg);
      }
    },
    [drawImageCover]
  );

  // Step 8: Preload initial 150 frames with progress counter
  useEffect(() => {
    let active = true;
    let loadedCount = 0;
    const initialTarget = INITIAL_PRELOAD_COUNT;

    const loadSingleFrame = (frameNum: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesCache.current[frameNum]) {
          resolve(imagesCache.current[frameNum]!);
          return;
        }
        const img = new Image();
        img.src = getFrameUrl(frameNum);
        img.onload = () => {
          if (active) imagesCache.current[frameNum] = img;
          resolve(img);
        };
        img.onerror = () => {
          resolve(img);
        };
      });
    };

    // Load initial 150 in controlled parallel chunks
    const loadInitialBatch = async () => {
      const concurrency = 10;
      let currentIndex = 1;

      const runWorker = async () => {
        while (currentIndex <= initialTarget && active) {
          const frameToLoad = currentIndex++;
          await loadSingleFrame(frameToLoad);
          if (!active) return;
          loadedCount++;
          const pct = Math.round((loadedCount / initialTarget) * 100);
          setPreloadProgress(pct);
        }
      };

      const workers = Array.from({ length: concurrency }, () => runWorker());
      await Promise.all(workers);

      if (active) {
        setIsPreloaded(true);
        isPreloadedRef.current = true;
        // Immediately render frame 1 on initial load complete
        renderFrame(1);
        onProgressChange(0, 1);
        onPreloadComplete?.();

        // Step 8 & 15: Background fetch and cache remaining frames (151 to 341) without blocking UI
        loadRemainingFramesInBackground();
      }
    };

    const loadRemainingFramesInBackground = () => {
      let bgIndex = INITIAL_PRELOAD_COUNT + 1;
      const bgConcurrency = 4;

      const bgWorker = async () => {
        while (bgIndex <= TOTAL_FRAMES && active) {
          const frameNum = bgIndex++;
          await loadSingleFrame(frameNum);
          // Yield to main thread for smoothness
          await new Promise((r) => setTimeout(r, 16));
        }
      };

      for (let i = 0; i < bgConcurrency; i++) {
        bgWorker();
      }
    };

    loadInitialBatch();

    return () => {
      active = false;
    };
  }, [renderFrame, onProgressChange, onPreloadComplete]);

  // Step 9 & 15: Apple-style Scroll Scrubbing with single pinned ScrollTrigger section
  useEffect(() => {
    if (!isPreloaded || !containerRef.current || !canvasRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=550%",
      pin: true,
      scrub: 0.1, // micro-smoothing while keeping direct scroll lock
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        // Map ScrollTrigger progress (0 to 1) directly to image sequence
        const calculatedFrame = Math.min(
          TOTAL_FRAMES,
          Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
        );

        onProgressChange(progress, calculatedFrame);

        // Strict Requirement: Redraw the canvas ONLY when the calculated frame changes
        if (calculatedFrame !== currentFrameRef.current) {
          currentFrameRef.current = calculatedFrame;
          // Use requestAnimationFrame ONLY to schedule the single render after scroll update
          requestAnimationFrame(() => {
            renderFrame(calculatedFrame);
          });
        }
      },
    });

    scrollTriggerRef.current = trigger;

    // Handle window resize with proper aspect ratio recalculation
    const handleResize = () => {
      if (canvasRef.current && isPreloadedRef.current) {
        renderFrame(currentFrameRef.current);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial render
    renderFrame(currentFrameRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (trigger) trigger.kill();
      scrollTriggerRef.current = null;
    };
  }, [isPreloaded, containerRef, onProgressChange, renderFrame]);

  return (
    <>
      <Preloader progress={preloadProgress} isLoaded={isPreloaded} />
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block select-none pointer-events-none transform-gpu will-change-transform"
          style={{
            filter: "contrast(1.04) saturate(1.03) brightness(1.01)",
            imageRendering: "auto",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </>
  );
}
