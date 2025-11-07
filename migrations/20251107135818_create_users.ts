import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (t) => {
    t.bigint("id").primary().comment("Telegram user id");
    t.bigint("chat_id")
      .nullable()
      .unique()
      .comment("Telegram chat id (для private == user_id)");
    (t as any)
      .enu("chat_type", ["private", "group", "supergroup", "channel"], {
        useNative: true,
        enumName: "user_chat_type_enum",
      })
      .nullable();

    t.string("username", 64).nullable();
    t.string("first_name", 128).nullable();
    t.string("last_name", 128).nullable();

    t.string("phone", 32).nullable().unique().comment("E.164: +79991234567");
    t.boolean("phone_verified").notNullable().defaultTo(false);
    t.string("tg_language", 8).nullable();

    t.timestamp("last_seen_at").nullable().index("idx_users_last_seen");
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());

    t.index(["phone"], "idx_users_phone");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
