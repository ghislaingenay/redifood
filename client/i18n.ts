import i18n from "i18next";
import Cookies from "js-cookie";
import { initReactI18next } from "react-i18next";
import { decodeCookie } from "./pages/api/build-language";

i18n.use(initReactI18next).init({
  lng: Cookies.get("lang") ? decodeCookie(Cookies.get("lang")) : "en",
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
