/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hr", "de", "it", "fr", "es", "pt", "nl"],
    localeDetection: false, // Set to false for Next.js compatibility
  },
  localePath: "./public/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
