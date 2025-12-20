"use client";

import {useEffect, useState} from "react";
import {readSaved, SavedName, writeSaved} from "@/lib/storage";
import {X} from "lucide-react";

export function SavedDrawer({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<SavedName[]>([]);

  useEffect(() => {
    if (open) setItems(readSaved());
  }, [open]);

  const remove = (name: string) => {
    const next = items.filter(x => x.name.toLowerCase() !== name.toLowerCase());
    setItems(next);
    writeSaved(next);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Saved</div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 overflow-auto pr-1" style={{maxHeight: "calc(100vh - 6rem)"}}>
          {items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Nothing saved yet.
            </div>
          ) : (
            items.map(x => (
              <div key={x.savedAt} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{x.name}</div>
                    <div className="text-sm text-white/70">{x.tagline}</div>
                  </div>
                  <button
                    onClick={() => remove(x.name)}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/80 hover:bg-black/30"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 text-xs text-white/60">
                  <span className="text-white/70">Why:</span> {x.why}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
