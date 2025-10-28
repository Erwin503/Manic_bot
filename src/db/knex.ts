import knex, { Knex } from 'knex';
import { config } from '../config.js';

export const db: Knex = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN ?? 2),
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    propagateCreateError: false,
  },
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
    directory: './migrations',
  },
  acquireConnectionTimeout: 10_000,
});

export async function closeDb() {
  await db.destroy();
}
