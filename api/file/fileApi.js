const express = require("express")
const controller = require("../../controller/file/fileController")
const use = require("../../helper/utils/utility").use
const auth = require("../../middleware/auth")
const multer = require("../../multer")("test-folder")
const api = express.Router()

api.post(
  "/api/file/upload",
  auth.verify(),
  multer.any(),
  use(controller.upload)
)

api.delete("/api/file/delete/:id", auth.verify(), use(controller.delete))

api.get("/api/file/list", auth.verify(), use(controller.getAll))

api.get("/api/file/:id", auth.verify(), use(controller.get))

api.get("/api/file/download/:id", auth.verify(), use(controller.download))

api.put(
  "/api/file/update/:id",
  auth.verify(),
  multer.any(),
  use(controller.update)
)

module.exports = api
