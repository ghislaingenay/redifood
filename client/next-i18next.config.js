const path = require("path");

module.exports = {
  i18n: { locales: ["en", "fr"], defaultLocale: "en", localeDetection: false },
  // domains: [
  //   {
  //     domain: "redifood.com",
  //     defaultLocale: "en",
  //   },
  //   {
  //     domain: "redifood.fr",
  //     defaultLocale: "fr",
  //   },
  // ],
  localePath: path.resolve("./public/locales"),
};
