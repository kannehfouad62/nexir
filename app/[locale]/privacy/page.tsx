import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 print:max-w-none print:px-0 print:py-0 space-y-6">
      <h1 className="text-3xl font-semibold print:text-2xl">
        {t("title")}
      </h1>

      <p className="text-sm text-white/70 print:text-black">
        {t("updated")}
      </p>

      <section className="space-y-4 text-white/80 print:text-black">
        <p>{t("intro")}</p>
        <p>{t("noCollection")}</p>
        <p>{t("localStorage")}</p>
        <p>{t("cookies")}</p>
        <p>{t("thirdParty")}</p>
        <p>{t("contact")}</p>
      </section>
    </main>
  );
}
