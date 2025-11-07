import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("chats", (t) => {
    t.bigint("id").primary().comment("Telegram chat id");
    (t as any)
      .enu("type", ["private", "group", "supergroup", "channel"], {
        useNative: true,
        enumName: "chat_type_enum",
      })
      .notNullable();
    t.string("title", 191).nullable();
    t.bigint("owner_user_id").nullable().index();
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("chats");
}
