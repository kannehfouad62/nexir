
import "./globals.css";
import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import Link from "next/link";
import {LanguageSwitcher} from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";




export const metadata: Metadata = {
  title: "Nexir — AI Name Generator",
  description: "Generate brandable names with AI."
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const isRTL = locale === "ar";
  const messages = await getMessages();

   // ✅ DEFINE t HERE (this was missing)
   const t = await getTranslations({
    locale,
    namespace: "layout"
  });



  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href={`/${locale}`} className="font-semibold tracking-wide">
                Nexir
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                
                <LanguageSwitcher />
              </nav>
              
            </div>
             {/* ✅ Impact.com Site Verification */}
        <meta
          name="impact-site-verification"
          content="34c85402-9073-4758-9260-c5a910055825"
        />

          </header>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />


          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

          {/* Footer */}
        <footer className="border-t border-white/10 bg-black/40">
          <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/60">
              © {new Date().getFullYear()} Nexir
            </div>

            <nav className="flex flex-wrap items-center gap-6 text-sm">
              <Link
                href={`/${locale}`}
                className="text-white/70 hover:text-white transition"
              >
                {t("home")}
              </Link>

              <Link
                href={`/${locale}/about`}
                className="text-white/70 hover:text-white transition"
              >
                {t("about")}
              </Link>

              <Link
                href={`/${locale}/privacy`}
                className="text-white/70 hover:text-white transition"
              >
                {t("privacy")}
              </Link>

              <Link
                href={`/${locale}/terms`}
                className="text-white/70 hover:text-white transition"
              >
                {t("terms")}
              </Link>
            </nav>
          </div>
        </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
