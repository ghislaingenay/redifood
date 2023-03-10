import useLanguage from "./useLanguage";

export const buildLanguage = (locale: string, lang: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getCookieInformation } = useLanguage();
  const getLanguage = getCookieInformation(lang);
  if (!getLanguage) {
    return locale;
  }
  return lang;
};
