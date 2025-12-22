
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
                <Link className="hover:text-white/90 text-white/70" href={`/${locale}`}>
                  Home
                </Link>
                <Link className="hover:text-white/90 text-white/70" href={`/${locale}/about`}>
                  About Us
                </Link>
                <LanguageSwitcher />
              </nav>
              
            </div>


          </header>

          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

          <footer className="border-t border-white/10 py-8">
            <div className="mx-auto max-w-6xl px-4 text-sm text-white/60">
              © {new Date().getFullYear()} Nexir. Powered by AI.
            </div>

           
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
