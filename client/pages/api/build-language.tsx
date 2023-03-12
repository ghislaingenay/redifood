import Cookies from "js-cookie";
import { ELanguage } from "../../src/interfaces";

export const encodeCookie = (str: string | ELanguage) => {
  const buff = Buffer.from(str);
  return buff.toString("base64");
};

export const decodeCookie = (str: string | ELanguage) => {
  const buff = Buffer.from(str);
  return buff.toString() as ELanguage;
};

export const getCookieInformation = (lang: string) => {
  const buff = decodeCookie(lang);
  let value: ELanguage | undefined = undefined;
  if (Object.values(ELanguage).includes(buff as ELanguage)) {
    value = buff as ELanguage | undefined;
  }
  return value;
};

export const setCookieInformation = (lang: ELanguage) => {
  Cookies.remove("lang");
  console.log("lang choice", lang);
  Cookies.set("lang", encodeCookie(lang));
};
export const buildLanguage = (appContext: any) => {
  const locale = appContext.ctx.locale;
  const lang = appContext.ctx.req.cookies;
  console.log("val", locale, lang);
  const getLanguage = getCookieInformation(lang);

  if (!getLanguage) {
    return locale;
  }
  return lang;
};
