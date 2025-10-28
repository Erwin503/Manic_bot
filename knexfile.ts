// knexfile.ts
import "dotenv/config";
import type { Knex } from "knex";

const config: Knex.Config = {
  client: "mysql2",
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
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
    extension: "ts", // миграции на TypeScript
  },
  seeds: {
    directory: "./seeds",
    // extension: 'ts', // раскомментируй, если сиды тоже на TS
  },
};

export default config;
