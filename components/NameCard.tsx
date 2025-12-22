"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { pronounceabilityScore } from "@/lib/phonetics";
import { makeDomainCandidates } from "@/lib/domains";

type TonePreset = "luxury" | "playful" | "serious" | "minimal";

type Item = {
  name: string;
  tagline: string;
  why: string;
  rationale?: string;
  tone?: TonePreset;
};

type Props = {
  item: Item;
  isSaved: boolean;
  onToggle: (item: Item) => void;
};

export function NameCard({ item, isSaved, onToggle }: Props) {
  const t = useTranslations("card");

  const tone: TonePreset = item.tone ?? "minimal";
  const phon = useMemo(() => pronounceabilityScore(item.name), [item.name]);

  const [showRationale, setShowRationale] = useState(false);
  const [domainChoices, setDomainChoices] = useState<
    { domain: string; available: boolean; premium?: boolean }[]
  >([]);
  const [domainLoading, setDomainLoading] = useState(false);

  async function suggestDomains() {
    setDomainLoading(true);
    setDomainChoices([]);

    try {
      const candidates = makeDomainCandidates(item.name, tone).slice(0, 20);

      const res = await fetch("/api/domain-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: candidates })
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Domain check failed");

      const results = Array.isArray(data?.results) ? data.results : [];
      setDomainChoices(
        results.map((r: any) => ({
          domain: String(r.domain),
          available: !!r.available,
          premium: !!r.premium
        }))
      );
    } finally {
      setDomainLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  const pronounceLabel =
    phon.score >= 80
      ? t("pronounceEasy")
      : phon.score >= 60
      ? t("pronounceGood")
      : phon.score >= 40
      ? t("pronounceOkay")
      : t("pronounceHard");

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-xl font-semibold tracking-tight">
              {item.name}
            </h3>

            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/75">
              {t("pronounce")}:{" "}
              <span className="tabular-nums text-white/90">
                {phon.score}
              </span>
              /100{" "}
              <span className="text-white/55">({pronounceLabel})</span>
            </span>

            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/70">
              {t("tone")}:{" "}
              <span className="text-white/90">
                {t(`tone_${tone}`)}
              </span>
            </span>
          </div>

          <p className="mt-2 text-sm text-white/70">{item.tagline}</p>
          <p className="mt-1 text-xs text-white/55">{item.why}</p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            onClick={() => onToggle(item)}
            className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
              isSaved
                ? "border-white/15 bg-white/20 text-white"
                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            }`}
          >
            {isSaved ? t("saved") : t("save")}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => copy(item.name)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/75 hover:bg-white/10"
            >
              {t("copy")}
            </button>

            <button
              onClick={() => {
                const url =
                  typeof window !== "undefined" ? window.location.href : "";
                const text = `${item.name} — ${item.tagline}\n${url}`;
                if (navigator.share) {
                  navigator.share({ title: "Nexir", text });
                } else {
                  copy(text);
                }
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/75 hover:bg-white/10"
            >
              {t("share")}
            </button>
          </div>
        </div>
      </div>

      {/* Rationale */}
      {item.rationale && (
        <div className="mt-4">
          <button
            onClick={() => setShowRationale((v) => !v)}
            className="text-xs text-white/70 hover:text-white"
          >
            {showRationale ? t("hideRationale") : t("viewRationale")}
          </button>

          {showRationale && (
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
              {item.rationale}
            </div>
          )}
        </div>
      )}

      {/* Domains */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium text-white/80">
            {t("domainSuggestions")}
          </div>

          <button
            onClick={suggestDomains}
            disabled={domainLoading}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 disabled:opacity-60"
          >
            {domainLoading ? t("checking") : t("findDomains")}
          </button>
        </div>

        {domainChoices.length === 0 ? (
          <p className="mt-3 text-xs text-white/55">
            {t("domainHint")}
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {domainChoices.slice(0, 10).map((d) => {
              const label = d.premium
                ? t("premium")
                : d.available
                ? t("available")
                : t("taken");

              const color = d.premium
                ? "text-amber-300"
                : d.available
                ? "text-emerald-300"
                : "text-white/55";

              return (
                <span
                  key={d.domain}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80"
                >
                  {d.domain}{" "}
                  <span className={`tabular-nums ${color}`}>
                    • {label}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
