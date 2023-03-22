type RecordAny = Record<string, any>;

export const createQuery = <T extends RecordAny>(data: T | T[]) => {
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

interface IKeys<T, K> {
  dbKeys: T;
  apiKeys: K;
}

type TDirection = 'apiToDb' | 'dbToApi';

export const convertKeys = <T extends RecordAny, K extends RecordAny>(
  data: TDirection extends 'apiToDb' ? K : T,
  direction: TDirection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keys?: IKeys<T, K>,
) => {
  const keyValuePairs = Object.entries(data).map(([key, value]) => {
    if (direction === 'dbToApi') {
      if (key === 'id') {
        return [key, value];
      }
      return [
        (key as string).replace(/([_][a-z])/g, ($1) =>
          $1.toUpperCase().replace('_', ''),
        ),
        value,
      ];
    } else {
      return [
        (key as string).replace(/([a-z][A-Z]])/g, ($1) =>
          $1.toLowerCase().split('').splice(1, 0, '_').join(''),
        ),
        value,
      ];
    }
  });
  return Object.fromEntries(keyValuePairs);
};
