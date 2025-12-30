import {Pool} from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // 10秒
});

export default pool;
