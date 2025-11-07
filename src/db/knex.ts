import knex from "knex";
import { config } from "../config/index.js";

export const db = knex({
  client: "mysql2",
  connection: {
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
  },
  pool: { min: 2, max: 10 },
});
