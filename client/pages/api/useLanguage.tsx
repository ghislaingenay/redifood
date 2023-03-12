import Cookies from "js-cookie";
import { useEffect } from "react";
import { ELanguage } from "../../src/interfaces";
import { decodeCookie, encodeCookie } from "./build-language";

const useLanguage = (language: ELanguage) => {
  const setCookie = () => {
    Cookies.remove("lang");
    console.log("lang choice", language);
    Cookies.set("lang", encodeCookie(language));
  };

  const retrieveCookie = () => {
    const cookieInfo = Cookies.get("lang");
    if (cookieInfo) {
      return decodeCookie(Cookies.get("lang"));
    }
    setCookie();
    return ELanguage.ENGLISH;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return { setCookie, retrieveCookie };
};

export default useLanguage;
