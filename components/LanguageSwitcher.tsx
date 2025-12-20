"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const LOCALES = [
  { code: "en", label: "English" },
  {code: "es", label: "Spanish"},
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "kri", label: "Krio" }
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale() as LocaleCode;
  const t = useTranslations("lang");

  function getHref(targetLocale: string) {
    const segments = (pathname || "/").split("/").filter(Boolean);

    // Replace first segment if it is a locale; otherwise insert.
    if (segments.length > 0 && LOCALES.some((l) => l.code === segments[0])) {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }

    return "/" + segments.join("/");
  }

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value;
    router.push(getHref(nextLocale));
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs text-white/60">
        {t("label")}
      </span>

      <div className="relative">
        <select
          value={currentLocale}
          onChange={onChange}
          className="cursor-pointer appearance-none rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-9 text-xs text-white outline-none hover:bg-white/10 focus:border-white/20"
          aria-label={t("label")}
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/60">
          ▼
        </div>
      </div>
    </div>
  );
}
