import Cookies from "js-cookie";
import { ELanguage } from "../../src/interfaces";

export const encodeCookie = (str: string | ELanguage) => {
  const buff = Buffer.from(str);
  return buff.toString("base64");
};

export const decodeCookie = (str: string | ELanguage) => {
  const buff = Buffer.from(str, "base64");
  return buff.toString() as ELanguage;
};

export const recoverCookie = () => {
  const buff = decodeCookie(Cookies.get("lang") as ELanguage);
  let value: ELanguage | undefined = undefined;
  if (Object.values(ELanguage).includes(buff as ELanguage)) {
    value = buff as ELanguage | undefined;
  } else {
    value = ELanguage.ENGLISH;
  }
  return value;
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
export const buildLanguage = (locale: any, req: any) => {
  const cookies = req?.cookies;
  const lang = cookies?.lang;

  if (!lang) {
    return locale;
  }
  const getLanguage = decodeCookie(lang);
  if (!getLanguage) {
    return locale;
  }
  return getLanguage;
};
