import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("services", (t) => {
    t.increments("id").primary(); // INT UNSIGNED
    t.string("code", 64)
      .notNullable()
      .unique()
      .comment("внутренний код услуги");
    t.string("name", 191).notNullable();
    t.text("description").nullable();
    t.integer("duration_min").notNullable().comment("минуты");
    t.integer("price_minor").notNullable().comment("копейки");
    t.string("currency", 3).notNullable().defaultTo("RUB");
    t.boolean("active").notNullable().defaultTo(true);
    t.integer("display_order").notNullable().defaultTo(0);

    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());

    t.index(["active"], "idx_services_active");
    t.index(["name"], "idx_services_name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("services");
}
