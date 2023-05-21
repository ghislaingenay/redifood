type RecordAny = Record<string, any>;

const blockSQLInjection = (data: any) => {
  return Object.values(data).map((val) => {
    if (typeof val === 'number') {
      return val;
    }
    if (val === null || val === undefined) {
      return 'NULL';
    }
    return `'${val}'`;
  });
};

export function buildInsertIntoKeyValuePair(data: RecordAny): {
  keys: string;
  values: string;
} {
  if (!data || Object.keys(data).length === 0 || data === null) {
    throw new Error('data should be defined');
  }
  const keys = Object.keys(data).join(',');
  const values = blockSQLInjection(data).join(',');
  return { keys, values };
}

type TTable =
  | 'food_section'
  | 'food_extra'
  | 'food'
  | 'order'
  | 'order_items'
  | 'payment'
  | 'discount';

export const createQuery = <T extends RecordAny>(
  data: T | T[],
  tableName: TTable,
) => {
  let insertQuery = '';
  let valuesQuery = '';
  // The data should have a type of DB and should be convert
  const foundUpperCase = Object.keys(data).find(
    (key: string) => /[A-Z]/.test(key) || /^id$/.test(key),
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
      const { values } = buildInsertIntoKeyValuePair(item);
      return `(${values})`;
    });
    valuesQuery = `VALUES ${cleanData.join(', ')}`;
  } else {
    const { keys, values } = buildInsertIntoKeyValuePair(data);
    insertQuery = `INSERT INTO ${tableName} (${keys})`;
    valuesQuery = `VALUES (${values})`;
  }
  const query = `${insertQuery} ${valuesQuery}`;
  // console.log('query', query);
  return query;
};

export const updateQuery = <T extends RecordAny>(
  data: T,
  tableName: TTable,
) => {
  delete data.id;
  const keysEntries = Object.keys(data);
  // Avoid SQL Injection
  const values = blockSQLInjection(data);
  const updateList = [];
  const setQuery = `UPDATE ${tableName} SET`;
  if (keysEntries.length !== values.length) {
    throw new Error('keys and values should have the same length');
  }

  for (let i = 0; i < keysEntries.length; i++) {
    updateList.push(`${keysEntries[i]} = ${values[i]}`);
  }
  const updateQuery = updateList.join(', ');
  return `${setQuery} ${updateQuery}`;
};

interface IKeys<T, K> {
  dbKeys: T;
  apiKeys: K;
}

type TDirection = 'apiToDb' | 'dbToApi';
type ResKeys<T, K> = TDirection extends 'apiToDb' ? T : K;

export const convertKeys = <T extends RecordAny, K extends RecordAny>(
  data: TDirection extends 'apiToDb' ? K : T,
  direction: TDirection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keys?: IKeys<T, K>,
): ResKeys<T, K> => {
  const keyValuePairs = Object.entries(data).map(([key, value]) => {
    if (direction === 'dbToApi') {
      if (key === 'id') {
        return [key, value];
      }
      if (!/([_][a-z])/g.test(key)) {
        console.log('not valid', key);
        throw new Error(`${key} should be snake case and not be null`);
      }

      return [
        (key as string).replace(/([_][a-z])/g, ($1) => {
          return $1.toUpperCase().replace('_', '');
        }),
        value,
      ];
    } else {
      if (key === 'id') {
        return [key, value];
      }
      if (!/([a-z][A-Z])/g.test(key)) {
        throw new Error(`${key} should be camel case and not be null`);
      }
      return [
        (key as string).replace(/([a-z][A-Z])/g, ($1) => {
          return `${$1[0]}_${$1[1].toLowerCase()}`;
        }),
        value,
      ];
    }
  });
  return Object.fromEntries(keyValuePairs);
};
