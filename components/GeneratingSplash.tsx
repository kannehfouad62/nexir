"use client";

import { useMemo } from "react";

type Props = {
  // elapsedMs is controlled by parent
  elapsedMs: number; // 0..24000
};

export function GeneratingSplash({ elapsedMs }: Props) {
  const TOTAL_MS = 24_000;
  const PHASE_MS = 8_000;

  const phrases = useMemo(
    () => ["Nexir is thinking", "Nexir is initializing", "Nexir is generating"],
    []
  );

  const phaseIndex =
    elapsedMs < PHASE_MS ? 0 : elapsedMs < PHASE_MS * 2 ? 1 : 2;

  const progress = Math.min(100, Math.floor((elapsedMs / TOTAL_MS) * 100));
  const secondsLeft = Math.max(0, Math.ceil((TOTAL_MS - elapsedMs) / 1000));

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/90 backdrop-blur"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-lg px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-center">
            <div className="text-2xl font-semibold tracking-tight">
              Nexir • AI Brand Name Studio
            </div>

            <div className="mt-3 text-sm text-white/70">
              {phrases[phaseIndex]}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Progress</span>
                <span className="tabular-nums">{progress}%</span>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-black/30">
                <div
                  className="h-full bg-white/60 transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 text-[11px] text-white/45">
                Time remaining: {secondsLeft}s
              </div>
            </div>

            <div className="mt-6 text-xs text-white/50">
              Tip: Try “fintech, Africa, trust, fast” for sharper results.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
