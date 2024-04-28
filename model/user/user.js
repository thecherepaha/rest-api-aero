const db = require("../knex")()

exports.db = () => {
  return db("user")
}

exports.get = async ({ id, email }) => {
  return await db("user")
    .select("*")
    .modify((q) => {
      id && q.where("id", id)
      email && q.where("email", email)
    })
}

exports.create = async (data) => {
  return await db("user").insert(data)
}
