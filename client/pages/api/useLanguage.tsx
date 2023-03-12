import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../src/contexts/app.context";
import { ELanguage } from "../../src/interfaces";
import { decodeCookie, encodeCookie } from "./build-language";

const useLanguage = () => {
  const {
    state: { language },
  } = useContext(AppContext);

  const [languageChoice, setLanguageChoice] = useState<string>(ELanguage.ENGLISH);

  const setCookie = () => {
    Cookies.remove("lang");
    console.log("lang choice", language);
    Cookies.set("lang", encodeCookie(language));
  };

  const retrieveCookie = (): ELanguage => {
    const cookieInfo = Cookies.get("lang");
    if (cookieInfo) {
      return decodeCookie(Cookies.get("lang"));
    }
    return undefined;
  };

  useEffect(() => {
    return setLanguageChoice(retrieveCookie());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return { languageChoice, setCookie, retrieveCookie };
};

export default useLanguage;
