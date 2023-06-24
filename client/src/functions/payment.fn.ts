export const havePoint = (str: string, selectAmount: string | number) => {
  if (typeof selectAmount === "string" && selectAmount?.includes(".")) {
    return str.indexOf(".") === str.lastIndexOf(".");
  }
  return true;
};

export const haveValueSeparated = (str: string, selectAmount: string | number) => {
  if (typeof selectAmount === "string" && selectAmount?.includes(".")) {
    return /(\d+).(\d+)/i.test(str);
  }
  return true;
};
