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

const pool = new Pool(config);

pool.on('error', (err, client) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

async function execute(statement: string, params?: any[]) {
  const client = await pool.connect();
  try {
    let res;
    if (params === undefined) { res = await client.query(statement); }
    res = await client.query(statement, params);
    return res;
  } catch (err) { throw err; }
  finally { client.release(); }
}

export default execute;
