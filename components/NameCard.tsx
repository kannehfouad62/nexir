"use client";

import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Copy, Link2, Globe } from "lucide-react";
import { SavedName } from "@/lib/storage";
import { pronounceabilityScore } from "@/lib/phonetics";
import { useLocale } from "next-intl";
import { makeDomainCandidates } from "@/lib/domains";


type Item = { name: string; tagline: string; why: string; rationale?: string };

function slugifyName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function NameCard({
  item,
  isSaved,
  onToggle
}: {
  item: Item;
  isSaved: boolean;
  onToggle: (x: Omit<SavedName, "savedAt">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [domainResult, setDomainResult] = useState<null | { dnsExists: boolean }>(null);
  const [domainChoices, setDomainChoices] = useState<{domain: string; available: boolean}[]>([]);
  const [domainLoading, setDomainLoading] = useState(false);


  const domain = useMemo(() => `${item.name.toLowerCase().replace(/\s+/g, "")}.com`, [item.name]);
  const phon = useMemo(() => pronounceabilityScore(item.name), [item.name]);

  const shareUrl = useMemo(() => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const slug = slugifyName(item.name);
    // simple share link as query params (works with any route)
    const url = new URL(base + (typeof window !== "undefined" ? window.location.pathname : "/"));
    url.searchParams.set("name", item.name);
    url.searchParams.set("slug", slug);
    return url.toString();
  }, [item.name]);

  async function checkDomain() {
    setChecking(true);
    setDomainResult(null);
    try {
      const res = await fetch(`/api/domain?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Domain check failed");
      setDomainResult({ dnsExists: !!data?.dnsExists });
    } catch {
      setDomainResult(null);
    } finally {
      setChecking(false);
    }
  }

  async function suggestDomains() {
    setDomainLoading(true);
    setDomainChoices([]);
  
    try {
      // If you have tone in the card props, use it; otherwise default:
      const tone = (typeof (item as any).tone === "string" ? (item as any).tone : "minimal") as any;
  
      const candidates = makeDomainCandidates(item.name, tone).slice(0, 20);
  
      const res = await fetch("/api/domain-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: candidates })
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Domain check failed");
  
      const results = Array.isArray(data?.results) ? data.results : [];
      setDomainChoices(results.map((r: any) => ({ domain: r.domain, available: !!r.available })));
    } catch (e) {
      setDomainChoices([]);
    } finally {
      setDomainLoading(false);
    }
  }
  

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }

  async function share() {
    const payload = {
      title: `Nexir: ${item.name}`,
      text: `${item.name} — ${item.tagline}`,
      url: shareUrl
    };

    // Web Share API if available
    // @ts-ignore
    if (navigator.share) {
      try {
        // @ts-ignore
        await navigator.share(payload);
        return;
      } catch {
        // ignore and fall back to copy
      }
    }
    await copyText(shareUrl);
    alert("Share link copied!");
  }

  const dnsLabel =
    domainResult == null
      ? null
      : domainResult.dnsExists
      ? "DNS exists (likely taken)"
      : "No DNS found (might be available)";

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-lg font-semibold tracking-tight">{item.name}</div>

            <div className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/75">
              Pronounce: <span className="text-white/90">{phon.score}</span>/100
            </div>

            <div className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/60">
              ~{phon.syllablesEstimate} syllables
            </div>
          </div>

          <div className="mt-1 text-sm text-white/70 truncate">{item.tagline}</div>
        </div>

        <button
          onClick={() => onToggle({ name: item.name, tagline: item.tagline, why: item.why })}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/80 hover:bg-black/30"
          aria-label="Save"
        >
          {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-white/60">
        <div>
          <span className="text-white/70">Why:</span> {item.why}
        </div>
        <div>
          <span className="text-white/70">Domain idea:</span> {domain}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
  <div className="flex items-center justify-between gap-2">
    <div className="text-sm text-white/80 font-medium">Domain suggestions</div>
    <button
      onClick={suggestDomains}
      disabled={domainLoading}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 disabled:opacity-60"
      title="Best-effort check via RDAP (not a registrar integration yet)"
    >
      {domainLoading ? "Checking…" : "Suggest available domains"}
    </button>
  </div>

  {domainChoices.length === 0 ? (
    <div className="mt-3 text-xs text-white/60">
      Tip: Click “Suggest available domains” to check multiple TLDs (.ai, .io, .app, .co…).
    </div>
  ) : (
    <div className="mt-3 grid gap-2">
      {domainChoices.slice(0, 10).map((d) => (
        <div
          key={d.domain}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
        >
          <div className="truncate text-xs text-white/80">{d.domain}</div>
          <div className={`text-xs ${d.available ? "text-emerald-300" : "text-white/50"}`}>
            {d.available ? "Likely available" : "Taken / unknown"}
          </div>
        </div>
      ))}
      <div className="text-[11px] text-white/45 mt-1">
        Note: This is a best-effort check via RDAP, not a registrar availability guarantee.
      </div>
    </div>
  )}
</div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Rationale
        </button>

        <button
          onClick={() => copyText(item.name)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>

        <button
          onClick={share}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
        >
          <Link2 className="h-4 w-4" />
          Share
        </button>

        <button
          onClick={checkDomain}
          disabled={checking}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 disabled:opacity-60"
          title="Checks DNS records only (not true availability)"
        >
          <Globe className="h-4 w-4" />
          {checking ? "Checking…" : "Check domain"}
        </button>
      </div>

      {dnsLabel && (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/70">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-white/80">Result:</span> {dnsLabel}
              <div className="mt-1 text-white/50">
                Note: DNS check isn’t a registrar availability check.
              </div>
            </div>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
              href={`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Globe className="h-4 w-4" />
              Search
            </a>
          </div>
        </div>
      )}

      {/* Expanded rationale */}
      {open && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
          <div className="text-xs text-white/60">Name rationale</div>
          <div className="mt-2">{item.rationale || "No rationale provided."}</div>

          <div className="mt-4 text-xs text-white/60">Pronounceability notes</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {phon.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <div className="mt-4 text-xs text-white/60">Share link</div>
          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="truncate text-xs text-white/70">{shareUrl}</div>
            <button
              onClick={() => copyText(shareUrl)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/80 hover:bg-black/30"
            >
              <Copy className="h-4 w-4" />
              Copy link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
