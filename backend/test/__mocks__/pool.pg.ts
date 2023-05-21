import { newDb } from 'pg-mem';
const db = newDb().adapters.createPg();

class PGPool {
  _pool = null;

  connect() {
    console.log('Connecting to Postgres...');
    this._pool = new db.Pool({
      connectionTimeoutMillis: 0,
      idleTimeoutMillis: 0,
    });
    this._pool.connect();
    return this._pool.query('SELECT 1 + 1');
  }

  close() {
    return this._pool.end();
  }

  query(query: string, params?: any[]) {
    return this._pool.query(query, params);
  }
}

const pool = new PGPool();
export { pool };
