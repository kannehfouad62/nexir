import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 print:max-w-none print:px-0 print:py-0 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight print:text-2xl">
          {t("title")}
        </h1>
        <p className="text-sm text-white/70 print:text-black">{t("updated")}</p>
      </header>

      <section className="space-y-6 text-white/80 leading-relaxed print:text-black">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s1Title")}</h2>
          <p>{t("s1Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s2Title")}</h2>
          <p>{t("s2Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s3Title")}</h2>
          <p>{t("s3Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s4Title")}</h2>
          <p>{t("s4Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s5Title")}</h2>
          <p>{t("s5Body")}</p>
        </div>

        {/* Google Analytics section (with sub-sections) */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("s6Title")}</h2>
          <p>{t("s6Body")}</p>

          <div className="mt-2 space-y-2 rounded-2xl border border-white/10 bg-black/20 p-4 print:border-black/20 print:bg-white">
            <h3 className="text-sm font-semibold">{t("s6IpTitle")}</h3>
            <p className="text-sm">{t("s6IpBody")}</p>

            <h3 className="mt-3 text-sm font-semibold">{t("s6UseTitle")}</h3>
            <p className="text-sm">{t("s6UseBody")}</p>

            <p className="mt-3 text-sm text-white/70 print:text-black">
              {t("s6GooglePolicy")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s7Title")}</h2>
          <p>{t("s7Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s8Title")}</h2>
          <p>{t("s8Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s9Title")}</h2>
          <p>{t("s9Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s10Title")}</h2>
          <p>{t("s10Body")}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("s11Title")}</h2>
          <p>{t("s11Body")}</p>
        </div>
      </section>
    </main>
  );
}
