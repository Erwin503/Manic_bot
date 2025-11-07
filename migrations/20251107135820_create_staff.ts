import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("staff", (t) => {
    t.increments("id").primary(); // INT UNSIGNED
    t.string("name", 128).notNullable();

    t.bigint("telegram_user_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .index();

    t.string("calendar_id", 191)
      .nullable()
      .index()
      .comment("Google Calendar ID");
    t.boolean("active").notNullable().defaultTo(true);

    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("staff");
}
