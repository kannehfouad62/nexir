import {useTranslations} from "next-intl";
import Image from "next/image";


export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-4 max-w-3xl text-white/70">{t("p1")}</p>
        <p className="mt-3 max-w-3xl text-white/70">{t("p2")}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="text-lg font-semibold">{t("valuesTitle")}</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
              <li>{t("v1")}</li>
              <li>{t("v2")}</li>
              <li>{t("v3")}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="text-lg font-semibold">{t("ceoTitle")}</div>
            <div className="mt-4 flex items-start gap-4">
              {/* CEO photo placeholder */}
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                <div className="flex h-full w-full items-center justify-center text-xs text-white/60">
                  {/*CEO Photo */}
                </div>
              </div>
              <blockquote className="text-white/70">
                {t("ceoQuote")}
                <div className="mt-2 text-sm text-white/50">— Fouad Kanneh, CEO</div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Fancy “brand story” banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="relative">
          <div className="text-sm text-white/60">Our mission</div>
          <div className="mt-2 text-2xl font-semibold">
            Help you ship faster — starting with the perfect name.
          </div>
          <p className="mt-3 max-w-3xl text-white/70">
            Nexir blends creativity with structure: sound, length, style, and clarity — so your best ideas show up early.
          </p>
        </div>
      </section>
    </div>
  );
}
