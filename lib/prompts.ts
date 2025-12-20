export type NameStyle = "brandable" | "real" | "compound" | "invented";
export type NameLength = "short" | "medium" | "long";
export type TonePreset = "luxury" | "playful" | "serious" | "minimal";

export function buildPrompt(opts: {
  keywords: string;
  style: NameStyle;
  length: NameLength;
  tone: TonePreset;
}) {
  const { keywords, style, length, tone } = opts;

  const lengthRule =
    length === "short" ? "4–8 characters" : length === "medium" ? "6–12 characters" : "10–18 characters";

  const styleRule =
    style === "brandable"
      ? "Brandable, modern, startup-like"
      : style === "real"
      ? "Real dictionary words (single words preferred)"
      : style === "compound"
      ? "Compound words (two-word blends or fused compounds)"
      : "Invented words that sound natural and pronounceable";

  const toneRule =
    tone === "luxury"
      ? "Luxury: premium, elegant, upscale, refined (avoid silly words)"
      : tone === "playful"
      ? "Playful: fun, friendly, energetic, light (still pronounceable)"
      : tone === "serious"
      ? "Serious: trustworthy, professional, strong, credible"
      : "Minimal: clean, simple, modern, minimalistic (avoid extra syllables)";

  return `
You are a naming expert. Generate 18 unique business/product names.

Constraints:
- Must be easy to pronounce in English
- Avoid offensive or sensitive terms
- Style: ${styleRule}
- Tone: ${toneRule}
- Length: about ${lengthRule}
- Based on these keywords: ${keywords}

For each name, include:
- name
- tagline (2-6 words)
- why (<= 12 words)
- rationale (1-2 sentences explaining the choice)

Return ONLY valid JSON with this exact shape:
{
  "names": [
    { "name": "Example", "tagline": "2-6 words", "why": "short reason", "rationale": "1-2 sentences" }
  ]
}
`;
}
