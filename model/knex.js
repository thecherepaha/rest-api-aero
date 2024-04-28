const Knex = require("knex")
const KnexFile = require("../knexfile")

const { attachPaginate } = require("knex-paginate")
attachPaginate()

module.exports = (settings) => {
  if (!settings) settings = KnexFile
  return new Knex(settings)
}
