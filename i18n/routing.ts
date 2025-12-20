// i18n/routing.ts
export const locales = ["en", "es", "fr", "ar", "kri"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
