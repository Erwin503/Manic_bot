import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("messages", (t) => {
    t.bigIncrements("id").primary(); // BIGINT UNSIGNED

    t.bigint("chat_id")
      .notNullable()
      .references("id")
      .inTable("chats")
      .onDelete("CASCADE") // удалили чат → удалились сообщения
      .index("idx_messages_chat");

    t.bigint("user_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL"); // пользователь может отсутствовать

    // тип и полезная нагрузка (по желанию можно расширить)
    (t as any)
      .enu("message_type", ["text", "contact", "photo", "document", "other"], {
        useNative: true,
        enumName: "message_type_enum",
      })
      .notNullable()
      .defaultTo("text");

    t.text("text").nullable(); // текст сообщения (если text)
    t.json("payload").nullable().comment("сырая полезная нагрузка по желанию");

    t.bigint("tg_message_id").nullable().index(); // id сообщения в Telegram (если нужно)

    t.timestamp("created_at")
      .defaultTo(knex.fn.now())
      .index("idx_messages_created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("messages");
}
