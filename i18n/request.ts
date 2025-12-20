// i18n/request.ts
import {getRequestConfig} from "next-intl/server";
import {defaultLocale, locales} from "./routing";

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  // requestLocale can be undefined, so we must fallback
  if (!locale || !(locales as readonly string[]).includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
