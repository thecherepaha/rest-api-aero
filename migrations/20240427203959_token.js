/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("token", (table) => {
    table.specificType("id", "char(36) primary key").notNullable()
    table.specificType("user_id", "char(36)").notNullable()
    table
      .string("access")
      .notNullable()
      .comment("Токен доступа по тз действителен 10 мин")
    table.string("refresh").notNullable().comment("Токен обновления")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("token")
}
