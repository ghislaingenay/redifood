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

  const setCookie = () => Cookies.set("lang", encodeCookie(languageChoice));

  const retrieveCookie = (): ELanguage => {
    const cookieInfo = Cookies.get("lang");
    if (cookieInfo) {
      return decodeCookie(Cookies.get("lang"));
    }
    return ELanguage.ENGLISH;
  };

  useEffect(() => {
    return setLanguageChoice(retrieveCookie());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return { setCookie, retrieveCookie, languageChoice };
};

export default useLanguage;
