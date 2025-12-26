import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8
                     print:max-w-none print:px-0 print:py-0">
      {/* Title */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight print:text-2xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-white/70 print:text-black">
          {t("updated")}
        </p>
      </header>

      {/* Content */}
      <section className="space-y-5 text-white/80 leading-relaxed print:text-black">
        <p>{t("intro")}</p>

        <h2 className="text-lg font-semibold">{t("section1Title")}</h2>
        <p>{t("section1Body")}</p>

        <h2 className="text-lg font-semibold">{t("section2Title")}</h2>
        <p>{t("section2Body")}</p>

        <h2 className="text-lg font-semibold">{t("section3Title")}</h2>
        <p>{t("section3Body")}</p>

        <h2 className="text-lg font-semibold">{t("section4Title")}</h2>
        <p>{t("section4Body")}</p>

        <h2 className="text-lg font-semibold">{t("section5Title")}</h2>
        <p>{t("section5Body")}</p>

        <h2 className="text-lg font-semibold">{t("section6Title")}</h2>
        <p>{t("section6Body")}</p>

        <h2 className="text-lg font-semibold">{t("section7Title")}</h2>
        <p>{t("section7Body")}</p>

        <p className="pt-4 text-sm text-white/60 print:text-black">
          {t("contact")}
        </p>
      </section>
    </main>
  );
}
