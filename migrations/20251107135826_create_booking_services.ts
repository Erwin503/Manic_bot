import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("booking_services", (t) => {
    // FK → bookings.id (BIGINT UNSIGNED) ⇒ делаем UNSIGNED
    t.bigInteger("booking_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("bookings")
      .onDelete("CASCADE");

    // FK → services.id (INT UNSIGNED) ⇒ делаем UNSIGNED
    t.integer("service_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("services")
      .onDelete("RESTRICT");

    t.integer("position")
      .notNullable()
      .defaultTo(1)
      .comment("порядок услуг в броне");
    t.integer("quantity").notNullable().defaultTo(1);
    t.integer("unit_price_minor")
      .notNullable()
      .comment("снимок цены за 1 услугу, копейки");
    t.integer("duration_min")
      .notNullable()
      .comment("снимок длительности за 1 услугу, минуты");

    t.primary(["booking_id", "service_id"]);
    t.unique(["booking_id", "position"], {
      indexName: "uniq_booking_position",
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("booking_services");
}
