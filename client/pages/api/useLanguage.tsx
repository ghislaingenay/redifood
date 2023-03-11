import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../src/contexts/app.context";
import { ELanguage } from "../../src/interfaces";

const useLanguage = () => {
  const {
    state: { language },
  } = useContext(AppContext);

  const [languageChoice, setLanguageChoice] = useState<string>(ELanguage.ENGLISH);

  const encodeCookie = (str: string | ELanguage) => {
    const buff = Buffer.from(str);
    return buff.toString("base64");
  };

  const decodeCookie = (str: string | ELanguage) => {
    const buff = Buffer.from(str);
    return buff.toString() as ELanguage;
  };

  // const setCookie = () => {
  //   Cookies.remove("lang");
  //   console.log("lang choice", language);
  //   Cookies.set("lang", encodeCookie(language));
  // };

  const retrieveCookie = (): ELanguage => {
    const cookieInfo = Cookies.get("lang");
    if (cookieInfo) {
      return decodeCookie(Cookies.get("lang"));
    }
    return undefined;
  };

  const getCookieInformation = (lang: string) => {
    const buff = Buffer.from(lang).toString();
    let value: ELanguage | undefined = undefined;
    if (Object.values(ELanguage).includes(buff as ELanguage)) {
      value = buff as ELanguage | undefined;
    }
    return value;
  };

  const setCookieInformation = (lang: ELanguage) => {
    Cookies.remove("lang");
    console.log("lang choice", language);
    Cookies.set("lang", encodeCookie(lang));
  };

  useEffect(() => {
    return setLanguageChoice(retrieveCookie());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return { setCookieInformation, getCookieInformation };
};

export default useLanguage;
