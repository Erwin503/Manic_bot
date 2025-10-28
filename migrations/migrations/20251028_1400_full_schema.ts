import type { Knex } from 'knex';

/**
 * Полная схема для бота записи на маникюр.
 * MySQL 8+, InnoDB, utf8mb4.
 */
export async function up(knex: Knex): Promise<void> {
  // --- USERS: клиенты Telegram (с идентификацией по чату) -------------------
  await knex.schema.createTable('users', (t) => {
    t.bigint('id').primary().comment('Telegram user id');

    // Идентификация по чату (для private-чатов chat_id == user_id)
    t.bigint('chat_id').nullable().unique().comment('Telegram chat id для основного чата с пользователем');
    t.enu('chat_type', ['private', 'group', 'supergroup', 'channel'], {
      useNative: true,
      enumName: 'chat_type_enum',
    })
      .nullable()
      .comment('Тип основного чата');

    t.string('username', 64).nullable();
    t.string('first_name', 128).nullable();
    t.string('last_name', 128).nullable();

    t.string('phone', 32).nullable().unique().comment('E.164, например +79991234567');
    t.boolean('phone_verified').notNullable().defaultTo(false);
    t.string('tg_language', 8).nullable().comment('ru, en, ...');

    t.timestamp('last_seen_at').nullable().index();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // --- STAFF: мастера/ресурсы (без timezone) --------------------------------
  await knex.schema.createTable('staff', (t) => {
    t.increments('id').primary();
    t.string('name', 128).notNullable();

    t.bigint('telegram_user_id')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .index()
      .comment('если мастер — тоже tg-пользователь');

    t.string('calendar_id', 191).nullable().index().comment('Google Calendar ID (email/ID)');
    t.boolean('active').notNullable().defaultTo(true);

    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // --- SERVICES: каталог услуг ----------------------------------------------
  await knex.schema.createTable('services', (t) => {
    t.increments('id').primary();
    t.string('code', 64).notNullable().unique().comment('внутренний уникальный код услуги');
    t.string('name', 191).notNullable().comment('название услуги');
    t.text('description').nullable().comment('описание');
    t.integer('duration_min').notNullable().comment('длительность, минуты');
    t.integer('price_minor').notNullable().comment('цена в минимальных единицах (копейки)');
    t.string('currency', 3).notNullable().defaultTo('RUB');
    t.boolean('active').notNullable().defaultTo(true);
    t.integer('display_order').notNullable().defaultTo(0).comment('для сортировки в меню');

    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());

    t.index(['active'], 'idx_services_active');
    t.index(['name'], 'idx_services_name');
  });

  // --- BOOKINGS: бронирования ------------------------------------------------
  await knex.schema.createTable('bookings', (t) => {
    t.bigIncrements('id').primary();

    t.bigint('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    t.integer('staff_id')
      .notNullable()
      .references('id')
      .inTable('staff')
      .onDelete('RESTRICT');

    t.dateTime('start_at').notNullable().index();
    t.dateTime('end_at').notNullable().index();

    t.enu('status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'], {
      useNative: true,
      enumName: 'booking_status_enum',
    })
      .notNullable()
      .defaultTo('pending');

    t.enu('source', ['telegram', 'admin'], {
      useNative: true,
      enumName: 'booking_source_enum',
    })
      .notNullable()
      .defaultTo('telegram');

    t.string('google_event_id', 191).nullable().index().comment('ID события в Google Calendar');
    t.text('note').nullable();

    // Снимок контактных данных на момент брони (опционально)
    t.string('snapshot_phone', 32).nullable();
    t.string('snapshot_user_name', 191).nullable();

    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());

    // Защита от дублей: один мастер — один стартовый слот
    t.unique(['staff_id', 'start_at'], { indexName: 'uniq_staff_start' });

    t.index(['user_id', 'start_at'], 'idx_bookings_user_start');
    t.index(['status', 'start_at'], 'idx_bookings_status_start');
  });

  // --- BOOKING_SERVICES: услуги внутри брони ---------------------------------
  await knex.schema.createTable('booking_services', (t) => {
    t.bigint('booking_id')
      .notNullable()
      .references('id')
      .inTable('bookings')
      .onDelete('CASCADE');

    t.integer('service_id')
      .notNullable()
      .references('id')
      .inTable('services')
      .onDelete('RESTRICT');

    t.integer('position').notNullable().defaultTo(1).comment('порядок, если несколько услуг подряд');
    t.integer('quantity').notNullable().defaultTo(1).comment('кол-во одинаковых услуг');
    t.integer('unit_price_minor').notNullable().comment('снимок цены одной услуги (копейки)');
    t.integer('duration_min').notNullable().comment('снимок длительности одной услуги (мин)');

    t.primary(['booking_id', 'service_id']); // одна строка на сервис в рамках брони
    t.unique(['booking_id', 'position'], { indexName: 'uniq_booking_position' });
  });
}

export async function down(knex: Knex): Promise<void> {
  // Порядок удаления обратный зависимостям
  await knex.schema.dropTableIfExists('booking_services');
  await knex.schema.dropTableIfExists('bookings');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('staff');
  await knex.schema.dropTableIfExists('users');

  // Для MySQL enum-типы удалять отдельно не требуется (они внутри таблиц)
}
