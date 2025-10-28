// knexfile.cjs — CommonJS, работает с knex CLI
require("dotenv").config();

/** @type {import('knex').Knex.Config} */
const config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN || 2),
    max: Number(process.env.DB_POOL_MAX || 10),
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
    extension: "ts", // <-- миграции пишем на TypeScript
  },
  seeds: {
    directory: "./seeds",
    // extension: 'ts' // если сиды тоже на TS
  },
};

module.exports = config;
