import { Client } from 'pg';

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

const client = new Client(config);

client.connect()
  .catch((err) => {
    console.log(err);
  });

export default client;
