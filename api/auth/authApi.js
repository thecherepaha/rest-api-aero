const express = require("express")
const controller = require("../../controller/auth/authController")
const use = require("../../helper/utils/utility").use
const auth = require("../../middleware/auth")
const api = express.Router()

api.post("/api/signup", use(controller.signup))

api.post("/api/signin", use(controller.signin))

api.post("/api/signin/new_token", use(controller.newtoken))

api.get("/api/info", auth.verify(), use(controller.info))

api.get("/api/logout", auth.verify(), use(controller.logout))

module.exports = api
