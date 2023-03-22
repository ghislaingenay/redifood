import { Pool, PoolConfig } from 'pg';

class PGPool {
  _pool = null;

  connect(options: PoolConfig) {
    console.log('Connecting to Postgres...');
    this._pool = new Pool(options);
    this._pool.connect();
    return this._pool.query('SELECT 1 + 1');
  }
}

const pool = new PGPool();
export { pool };
