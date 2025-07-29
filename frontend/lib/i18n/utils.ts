import { Locale } from "./i18n-provider";

/**
 * Generate an internationalized path
 * @param path The path to internationalize
 * @param locale The locale to use
 * @returns The internationalized path
 */
export function getI18nPath(path: string, locale: Locale): string {
  // If the path already starts with the locale, return it as is
  if (path.startsWith(`/${locale}`)) {
    return path;
  }

  // Otherwise, add the locale to the path
  return `/${locale}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Extract the path without the locale
 * @param path The path with locale
 * @param locales The available locales
 * @returns The path without locale
 */
export function removeLocaleFromPath(path: string, locales: string[]): string {
  // Check if the path starts with a locale
  for (const locale of locales) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return path.replace(`/${locale}`, "") || "/";
    }
  }

  // If no locale is found, return the path as is
  return path;
}
