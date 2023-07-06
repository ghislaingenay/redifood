const path = require("path");

module.exports = {
  i18n: { locales: ["en", "fr"], defaultLocale: "en", localeDetection: false },
  domains: [
    {
      domain: "redifood.com/en",
      defaultLocale: "en",
    },
    {
      domain: "redifood.com/fr",
      defaultLocale: "fr",
    },
  ],
  localePath: path.resolve("./public/locales"),
};
