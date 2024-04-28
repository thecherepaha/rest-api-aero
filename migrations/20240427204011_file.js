/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("file", (table) => {
    table.bigIncrements("id").primary()
    table.string("name").notNullable().comment("Название файла")
    table.string("extension").notNullable().comment("Расширение файла")
    table.string("mime").notNullable().comment("MIME type файла")
    table.bigInteger("size").notNullable().comment("Размер файла")
    table.string("path").notNullable().comment("Путь к файлу")

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("deleted_at").nullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("file")
}
