import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("bookings", (t) => {
    t.bigIncrements("id").primary(); // BIGINT UNSIGNED

    t.bigint("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT");

    t.integer("staff_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("staff")
      .onDelete("RESTRICT");

    t.dateTime("start_at").notNullable().index();
    t.dateTime("end_at").notNullable().index();

    (t as any)
      .enu(
        "status",
        ["pending", "confirmed", "cancelled", "completed", "no_show"],
        {
          useNative: true,
          enumName: "booking_status_enum",
        }
      )
      .notNullable()
      .defaultTo("pending");

    (t as any)
      .enu("source", ["telegram", "admin"], {
        useNative: true,
        enumName: "booking_source_enum",
      })
      .notNullable()
      .defaultTo("telegram");

    t.string("google_event_id", 191).nullable().index();
    t.text("note").nullable();
    t.string("snapshot_phone", 32).nullable();
    t.string("snapshot_user_name", 191).nullable();

    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());

    t.unique(["staff_id", "start_at"], { indexName: "uniq_staff_start" });
    t.index(["user_id", "start_at"], "idx_bookings_user_start");
    t.index(["status", "start_at"], "idx_bookings_status_start");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("bookings");
}
