import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // USERS
  await knex.schema.createTable("users", (t) => {
    t.bigint("id").primary().comment("Telegram user id"); // BIGINT (signed) — ок
    t.bigint("chat_id")
      .nullable()
      .unique()
      .comment("Telegram chat id (для private == user_id)");
    (t as any)
      .enu("chat_type", ["private", "group", "supergroup", "channel"], {
        useNative: true,
        enumName: "chat_type_enum",
      })
      .nullable();
    t.string("username", 64).nullable();
    t.string("first_name", 128).nullable();
    t.string("last_name", 128).nullable();
    t.string("phone", 32).nullable().unique().comment("E.164: +79991234567");
    t.boolean("phone_verified").notNullable().defaultTo(false);
    t.string("tg_language", 8).nullable();
    t.timestamp("last_seen_at").nullable().index();
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // STAFF (INT UNSIGNED)
  await knex.schema.createTable("staff", (t) => {
    t.increments("id").primary(); // UNSIGNED
    t.string("name", 128).notNullable();
    t.bigint("telegram_user_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .index();
    t.string("calendar_id", 191).nullable().index();
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // SERVICES (INT UNSIGNED)
  await knex.schema.createTable("services", (t) => {
    t.increments("id").primary(); // UNSIGNED
    t.string("code", 64).notNullable().unique();
    t.string("name", 191).notNullable();
    t.text("description").nullable();
    t.integer("duration_min").notNullable();
    t.integer("price_minor").notNullable();
    t.string("currency", 3).notNullable().defaultTo("RUB");
    t.boolean("active").notNullable().defaultTo(true);
    t.integer("display_order").notNullable().defaultTo(0);
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
    t.index(["active"], "idx_services_active");
    t.index(["name"], "idx_services_name");
  });

  // BOOKINGS (id = BIGINT UNSIGNED)
  await knex.schema.createTable("bookings", (t) => {
    t.bigIncrements("id").primary(); // BIGINT UNSIGNED

    t.bigint("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT");

    t.integer("staff_id")
      .unsigned() // FK → staff.id (UNSIGNED!)
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

  // BOOKING_SERVICES
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
    t.integer("quantity")
      .notNullable()
      .defaultTo(1)
      .comment("кол-во одинаковых услуг");
    t.integer("unit_price_minor")
      .notNullable()
      .comment("снимок цены за 1 услугу (копейки)");
    t.integer("duration_min")
      .notNullable()
      .comment("снимок длительности за 1 услугу (мин)");

    t.primary(["booking_id", "service_id"]);
    t.unique(["booking_id", "position"], {
      indexName: "uniq_booking_position",
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("booking_services");
  await knex.schema.dropTableIfExists("bookings");
  await knex.schema.dropTableIfExists("services");
  await knex.schema.dropTableIfExists("staff");
  await knex.schema.dropTableIfExists("users");
}
