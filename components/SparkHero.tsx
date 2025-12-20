"use client";

import {useEffect, useState} from "react";

const PHRASES = ["Fintech.", "Sport.", "Beauty.", "Retail.", "SaaS.", "Travel.", "Health."];

export function SparkHero({headline, sub}: {headline: string; sub: string}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % PHRASES.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
      </div>

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Nexir • AI Brand Name Studio
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          {headline}{" "}
          <span className="text-white/60">
            for <span className="underline underline-offset-4">{PHRASES[i]}</span>
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-white/70">{sub}</p>
      </div>
    </section>
  );
}
