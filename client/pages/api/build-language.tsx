import useLanguage from "./useLanguage";

export const buildLanguage = (locale: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { retrieveCookie } = useLanguage();
  const lang = retrieveCookie();
  if (!lang) {
    return locale;
  }
  return lang;
};
