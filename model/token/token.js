const db = require("../knex")()

exports.db = () => {
  return db("token")
}

exports.create = async (data) => {
  return await db("token").insert(data)
}

exports.get = async ({ id, user_id, access, refresh }) => {
  let data = await db("token")
    .select("*")
    .modify((q) => {
      id && q.where("id", id)
      user_id && q.where("user_id", user_id)
      access && q.where("access", access)
      refresh && q.where("refresh", refresh)
    })

  return JSON.parse(JSON.stringify(data))
}

exports.update = async (id, data) => {
  return await db("token").update(data).where("id", id)
}

exports.delete = async (id) => {
  return await db("token").del().where("id", id)
}
