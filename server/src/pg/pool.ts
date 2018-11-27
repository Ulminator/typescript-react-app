import { Pool } from 'pg';

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

pool.connect((err) => {
  if (err) {
    return console.log('Error acquiring client', err.stack);
  }
});

export default pool;
