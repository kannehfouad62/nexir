"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SparkHero } from "@/components/SparkHero";
import { NameCard } from "@/components/NameCard";
import { SavedDrawer } from "@/components/SavedDrawer";
import { GeneratingSplash } from "@/components/GeneratingSplash";
import { readSaved, toggleSaved } from "@/lib/storage";


type Item = {
  name: string;
  tagline: string;
  why: string;
  rationale?: string;
  tone?: "luxury" | "playful" | "serious" | "minimal";
};

export default function HomePage() {
  const t = useTranslations("home");

  // Form state
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState<"brandable" | "real" | "compound" | "invented">("brandable");
  const [length, setLength] = useState<"short" | "medium" | "long">("short");
  const [tone, setTone] = useState<"luxury" | "playful" | "serious" | "minimal">("minimal");

  // Results state
  const [items, setItems] = useState<Item[]>([]);

  // Loading
  const [loading, setLoading] = useState(false);

  // ===== SPLASH CONTROL (24s, parent-controlled) =====
  const [splashOpen, setSplashOpen] = useState(false);
  const [splashElapsed, setSplashElapsed] = useState(0);
  const splashIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const splashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Saved (SSR-safe)
  const [saved, setSaved] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Gate results until splash completes
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    setSaved(readSaved());
    setMounted(true);

    // cleanup timers on unmount
    return () => {
      if (splashIntervalRef.current) clearInterval(splashIntervalRef.current);
      if (splashTimeoutRef.current) clearTimeout(splashTimeoutRef.current);
      splashIntervalRef.current = null;
      splashTimeoutRef.current = null;
    };
  }, []);

  const savedSet = useMemo(
    () => new Set(saved.map((x: any) => String(x.name).toLowerCase())),
    [saved]
  );

  function startSplash24s() {
    // Clear any previous timers
    if (splashIntervalRef.current) clearInterval(splashIntervalRef.current);
    if (splashTimeoutRef.current) clearTimeout(splashTimeoutRef.current);
    splashIntervalRef.current = null;
    splashTimeoutRef.current = null;

    // Start
    setSplashElapsed(0);
    setSplashOpen(true);

    const start = Date.now();

    splashIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setSplashElapsed(Math.min(24_000, elapsed));
    }, 100);

    splashTimeoutRef.current = setTimeout(() => {
      if (splashIntervalRef.current) clearInterval(splashIntervalRef.current);
      splashIntervalRef.current = null;

      setSplashElapsed(24_000);
      setSplashOpen(false);
      setShowResults(true);
    }, 24_000);
  }

  async function generate() {
    // Prevent double trigger
    if (loading || splashOpen) return;

    if (!keywords.trim()) {
      alert("Please enter keywords.");
      return;
    }

    // Start splash + hide results
    setShowResults(false);
    startSplash24s();
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, style, length, tone })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      const names: Item[] = Array.isArray(data?.names) ? data.names : [];
      setItems(names.map((n) => ({ ...n, tone })));
    } catch (e: any) {
      alert(e?.message ?? "Error generating names.");
      setItems([]);
      // keep splash running until the 24s completes (by design)
    } finally {
      setLoading(false);
    }
  }

  function onToggle(item: Item) {
    const next = toggleSaved({
      name: item.name,
      tagline: item.tagline,
      why: item.why
    } as any);

    setSaved(next as any);
  }
  

  return (
    <div className="space-y-8">
      {/* Splash only mounted while open */}
      {splashOpen && <GeneratingSplash elapsedMs={splashElapsed} />}

      <SparkHero headline={t("headline")} sub={t("sub")} />

      <section className="rounded-3xl border border-white/20 bg-white/5 p-6 md:p-2">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">{t("keywordsLabel")}</label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={t("keywordsPlaceholder")}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-white/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">{t("styleLabel")}</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-white/20"
              >
                <option value="brandable">{t("styleBrandable")}</option>
                <option value="real">{t("styleRealWords")}</option>
                <option value="compound">{t("styleCompound")}</option>
                <option value="invented">{t("styleInvented")}</option>
              </select>
            </div>

           

            <div>
              <label className="text-sm text-white/70">{t("lengthLabel")}</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as any)}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-white/20"
              >
                <option value="short">{t("lengthShort")}</option>
                <option value="medium">{t("lengthMedium")}</option>
                <option value="long">{t("lengthLong")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
  <label className="text-sm text-white/70">{t("toneLabel")}</label>
  <select
    value={tone}
    onChange={(e) => setTone(e.target.value as any)}
    className="mt-2 w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-white/20"
  >
    <option value="serious">{t("toneSerious")}</option>
    <option value="luxury">{t("toneLuxury")}</option>
    <option value="minimal">{t("toneMinimal")}</option>
    <option value="playful">{t("tonePlayful")}</option>
  </select>
</div>


        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium hover:bg-white/15 disabled:opacity-60"
          >
            {loading ? "Generating..." : t("generate")}
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm font-medium text-white/85 hover:bg-black/30"
          >
            {t("saved")} ({saved.length})
          </button>

          <div className="text-sm text-white/60">
            Tip: try 3-5 keywords for best results.
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/20 bg-white/5 p-8 text-white/70">
            {t("empty")}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((x) => (
              <NameCard
                key={x.name}
                item={x}
                isSaved={savedSet.has(x.name.toLowerCase())}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </section>

      <SavedDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
