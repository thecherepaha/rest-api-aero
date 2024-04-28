const db = require("../knex")()

exports.db = () => {
  return db("file")
}

exports.create = async (data) => {
  return await db("file").insert(data)
}

exports.get = async (id) => {
  return await db("file")
    .select("*")
    .modify((q) => {
      id && q.where("id", id)
    })
}

exports.delete = async (id) => {
  return await db("file").del().where("id", id)
}

exports.getPaginated = async (list_size, page) => {
  return await db("file").paginate({ perPage: list_size, currentPage: page })
}

exports.update = async (id, data) => {
  return await db("file").update(data).where("id", id)
}
