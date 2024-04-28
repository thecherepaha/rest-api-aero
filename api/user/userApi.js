const express = require("express")
const use = require("../../helper/utils/utility").use
const controller = require("../../controller/user/userController")
const auth = require("../../middleware/auth")
const api = express.Router()

api.get("/api/user", auth.verify(), use(controller.get))

module.exports = api
