type RecordAny = Record<string, any>;

export function buildInsertIntoKeyValuePair(
  data: Record<string, string | number | null>,
): {
  keys: string;
  values: string;
} {
  const keys = Object.keys(data).join(',');
  const values = Object.values(data)
    .map((val) => {
      if (typeof val === 'number') {
        return val;
      }
      if (val === null || val === undefined) {
        return 'NULL';
      }
      return `'${val}'`;
    })
    .join(',');
  return { keys, values };
}

export const createQuery = <T extends RecordAny>(
  data: T | T[],
  tableName: string,
) => {
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
    insertQuery = `INSERT INTO ${tableName} (${keyArray.join(',')})`;
    const cleanData = (data as T[]).map((item: T) => {
      return `(${Object.keys(item).join(',')})`;
    });
    valuesQuery = ` VALUES ${cleanData.join(',')}`;
  } else {
    const { keys, values } = buildInsertIntoKeyValuePair(data);
    insertQuery = `INSERT INTO ${tableName} (${keys})`;
    valuesQuery = `VALUES (${values})`;
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
        (key as string).replace(/([_][a-z])/g, ($1) => {
          if ($1) {
            return $1.toUpperCase().replace('_', '');
          } else {
            throw new Error(`${key} should be snake case and not be null`);
          }
        }),
        value,
      ];
    } else {
      return [
        (key as string).replace(/([a-z][A-Z]])/g, ($1) => {
          if ($1) {
            return $1.toLowerCase().split('').splice(1, 0, '_').join('');
          } else {
            throw new Error(`${key} should be camel case and not be null`);
          }
        }),
        value,
      ];
    }
  });
  return Object.fromEntries(keyValuePairs);
};
