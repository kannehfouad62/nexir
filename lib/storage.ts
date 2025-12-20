export type SavedName = {
    name: string;
    tagline: string;
    why: string;
    savedAt: number;
  };
  
  const KEY = "nexir_saved_names_v1";
  
  export function readSaved(): SavedName[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      return JSON.parse(raw) as SavedName[];
    } catch {
      return [];
    }
  }
  
  export function writeSaved(items: SavedName[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }
  
  export function toggleSaved(item: Omit<SavedName, "savedAt">) {
    const current = readSaved();
    const exists = current.some(x => x.name.toLowerCase() === item.name.toLowerCase());
    const next = exists
      ? current.filter(x => x.name.toLowerCase() !== item.name.toLowerCase())
      : [{...item, savedAt: Date.now()}, ...current];
  
    writeSaved(next);
    return next;
  }
  