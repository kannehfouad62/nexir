export type TonePreset = "luxury" | "playful" | "serious" | "minimal";

export function baseLabel(name: string) {
  // Keep it simple: remove spaces/symbols
  return name
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

const COMMON_TLDS = [
  "com", "net", "org", "co", "io", "ai", "app", "dev", "me", "xyz", "site", "studio", "world", "online"
];

// Optional: prioritize different TLDs depending on tone
export function tldsForTone(tone: TonePreset) {
  switch (tone) {
    case "luxury":
      return ["com", "co", "io", "ai", "me", "studio", "app", "net", "org", "online"];
    case "playful":
      return ["com", "xyz", "me", "site", "world", "co", "app", "io", "online", "studio"];
    case "serious":
      return ["com", "net", "org", "co", "io", "ai", "dev", "app", "online", "site"];
    case "minimal":
    default:
      return ["com", "io", "ai", "co", "app", "dev", "me", "net", "org", "studio"];
  }
}

export function makeDomainCandidates(name: string, tone: TonePreset, extraTlds?: string[]) {
  const label = baseLabel(name);
  if (!label) return [];

  const tlds = Array.from(new Set([...(tldsForTone(tone)), ...(extraTlds ?? []), ...COMMON_TLDS]));
  return tlds.map((tld) => `${label}.${tld}`);
}
