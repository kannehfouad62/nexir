"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-6 print:max-w-none print:px-0 print:py-0">
      {/* Header */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 print:rounded-none print:border-0 print:bg-transparent print:p-0">
        <h1 className="text-3xl font-semibold tracking-tight print:text-2xl">
          {t("title")}
        </h1>

        <p className="mt-4 text-white/75 leading-relaxed print:text-black print:mt-3">
          {t("p1")}
        </p>

        {t("p2") ? (
          <p className="mt-3 text-white/75 leading-relaxed print:text-black">
            {t("p2")}
          </p>
        ) : null}
      </section>

      {/* Mission & Vision */}
      <section className="grid gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 print:rounded-none print:border print:border-black/15 print:bg-transparent">
          <h2 className="text-lg font-semibold tracking-tight print:text-base">
            {t("missionTitle")}
          </h2>
          <p className="mt-3 text-sm text-white/75 leading-relaxed print:text-black">
            {t("missionBody")}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 print:rounded-none print:border print:border-black/15 print:bg-transparent">
          <h2 className="text-lg font-semibold tracking-tight print:text-base">
            {t("visionTitle")}
          </h2>
          <p className="mt-3 text-sm text-white/75 leading-relaxed print:text-black">
            {t("visionBody")}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 print:rounded-none print:border print:border-black/15 print:bg-transparent">
        <h2 className="text-lg font-semibold tracking-tight print:text-base">
          {t("valuesTitle")}
        </h2>

        <ul className="mt-4 space-y-2 text-sm text-white/75 print:text-black">
          <li>• {t("v1")}</li>
          <li>• {t("v2")}</li>
          <li>• {t("v3")}</li>
        </ul>
      </section>

      {/* CEO Section */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 print:rounded-none print:border print:border-black/15 print:bg-transparent">
        <h2 className="text-lg font-semibold tracking-tight print:text-base">
          {t("ceoTitle")}
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr] items-start print:grid-cols-[200px_1fr] print:gap-4">
          {/* CEO Image + Name/Title */}
          <figure className="print:break-inside-avoid">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 print:rounded-none print:border-black/15 print:bg-transparent">
              <div className="relative">
                {/* Subtle hover animation */}
                <Image
                  src="/images/ceo1.jpeg"
                  alt={t("ceoAlt") || "CEO of Nexir"}
                  width={500}
                  height={500}
                  priority
                  className="h-auto w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03] hover:brightness-110 print:hover:scale-100 print:hover:brightness-100"
                />
                {/* Soft overlay glow on hover (screen only) */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100 print:hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
                </div>
              </div>
            </div>

            {/* CEO Name/Title (translated keys; fallback safe) */}
            <figcaption className="mt-3 text-center leading-tight print:text-left">
              <div className="text-sm font-semibold text-white/90 print:text-black">
                {t("ceoName") || "Fouad Kanneh"}
              </div>
              <div className="text-xs text-white/60 print:text-black/70">
                {t("ceoRole") || "Founder & CEO"}
              </div>
            </figcaption>
          </figure>

          {/* CEO Quote */}
          <blockquote className="rounded-3xl border border-white/10 bg-black/20 p-6 text-white/80 leading-relaxed print:rounded-none print:border-black/15 print:bg-transparent print:text-black print:p-4 print:break-inside-avoid">
            {t("ceoQuote")}
          </blockquote>
        </div>

        {/* Optional small print note (screen-hidden, print-visible) */}
        <div className="hidden print:block mt-4 text-xs text-black/60">
          {t("printNote") || "Generated from nexir.io — About Nexir"}
        </div>
      </section>
    </div>
  );
}
