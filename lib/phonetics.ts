export type PhoneticsScore = {
    score: number; // 0-100
    reasons: string[];
    syllablesEstimate: number;
  };
  
  const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);
  
  function isVowel(ch: string) {
    return VOWELS.has(ch);
  }
  
  function countVowelGroups(word: string) {
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!w) return 0;
  
    let groups = 0;
    let inGroup = false;
  
    for (const ch of w) {
      if (isVowel(ch)) {
        if (!inGroup) groups += 1;
        inGroup = true;
      } else {
        inGroup = false;
      }
    }
    return groups;
  }
  
  function hasAwkwardClusters(word: string) {
    // Simple cluster heuristics: too many consonants in a row, or rare combos
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!w) return false;
  
    // 4+ consonants in a row usually hurts pronounceability
    if (/[bcdfghjklmnpqrstvwxz]{4,}/.test(w)) return true;
  
    // Common “hard” clusters to penalize slightly
    const hard = ["xq", "qj", "jq", "ptk", "tzk", "gnl", "rtsc", "schz"];
    return hard.some((c) => w.includes(c));
  }
  
  function looksLikeWord(word: string) {
    // Light heuristic: starts with a letter, no weird symbols
    return /^[a-z][a-z-]*$/i.test(word);
  }
  
  export function pronounceabilityScore(name: string): PhoneticsScore {
    const base = name.trim();
    const word = base.toLowerCase().replace(/\s+/g, "");
  
    const reasons: string[] = [];
    let score = 70;
  
    if (!looksLikeWord(word)) {
      score -= 10;
      reasons.push("Contains unusual characters");
    }
  
    const len = word.length;
    if (len <= 3) {
      score -= 10;
      reasons.push("Very short (may be unclear)");
    } else if (len <= 8) {
      score += 10;
      reasons.push("Short and snappy");
    } else if (len <= 12) {
      score += 3;
      reasons.push("Moderate length");
    } else {
      score -= 8;
      reasons.push("Long (harder to say)");
    }
  
    const syllables = countVowelGroups(word);
    if (syllables === 0) {
      score -= 25;
      reasons.push("No clear vowel sounds");
    } else if (syllables >= 1 && syllables <= 3) {
      score += 8;
      reasons.push("Easy syllable rhythm");
    } else if (syllables <= 5) {
      score -= 3;
      reasons.push("Many syllables");
    } else {
      score -= 10;
      reasons.push("Too many syllables");
    }
  
    if (hasAwkwardClusters(word)) {
      score -= 12;
      reasons.push("Awkward consonant clusters");
    }
  
    // If it ends in a vowel, many names feel smoother
    if (isVowel(word[word.length - 1] || "")) {
      score += 3;
      reasons.push("Smooth ending sound");
    }
  
    // clamp
    score = Math.max(0, Math.min(100, score));
  
    return { score, reasons: reasons.slice(0, 4), syllablesEstimate: Math.max(1, syllables) };
  }
  