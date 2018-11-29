import { Pool } from 'pg';

require('dotenv').config();

let config;
if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
  config = {
    host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  };
} else {
  config = {
    host: (process.env.DOCKER) ? 'docker.for.mac.localhost' : 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'postgres',
  };
}

// config.max = 20;
// config.idleTimeoutMillis = 3000;
// config.connectionTimeoutMillis = 2000;

const pool = new Pool(config);

// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// async function query(statement: string, params: any[]) {
//   const client = await pool.connect();
//   try {
//     const res = await client.query(statement, params);
//     return res;
//   } catch (err) {
//     console.log(err);
//   } finally {
//     client.release();
//   }
// }

export default pool;
