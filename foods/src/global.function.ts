export const createQuery = <T extends Record<any, any>>(data: T | T[]) => {
  let insertQuery = '';
  let valuesQuery = '';
  // The data should have a type of DB and should be convert
  const foundUpperCase = Object.keys(data).find(
    (key: string) => /[A-Z]/.test(key) || /id/.test(key),
  );
  if (foundUpperCase) {
    throw new Error(
      'data should be converted for db or/and should not contained id',
    );
  }

  if (Array.isArray(data)) {
    const keyArray = Object.keys(data[0]);
    insertQuery = `INSERT INTO (${keyArray.join(',')})`;
    const cleanData = (data as T[]).map((item: T) => {
      return `(${Object.keys(item).join(', ')})`;
    });
    valuesQuery = `VALUES ${cleanData.join(',')}`;
  } else {
    valuesQuery = `VALUES ${(data as T).join(',')}`;
  }
  return `${insertQuery} ${valuesQuery}`;
};

interface Keys<T, K> {
  dbKeys: T;
  apiKeys: K;
}

type RecordAny = Record<string, any>

export const convertKeys = (data: any, keys: Keys<T extends  ) => {};
