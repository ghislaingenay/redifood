export const convertApiDataToDbData = (data: any, type: "sql" | "db", direction: "dbToApi" | "apiToDb") => {
  if (type === "db") {
    return data;
  }

  if (direction === "dbToApi") {
    let newObj = {};
    let newKey: string;
    for (let key in data) {
      console.log("key", key);
      newKey = key.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace("_", "");
      });
      newObj[newKey] = data[key];
    }
    return newObj;
  } else {
    let newObj = {};
    let newKey: string;
    for (let key in data) {
      newKey = key.replace(/([A-Z])/g, ($1) => {
        return `_${$1.toLowerCase()}`;
      });
      newObj[newKey] = data[key];
    }
    return newObj;
  }
};
