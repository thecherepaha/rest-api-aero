const multer = require("multer")
const fs = require("fs")
const path = require("path")

module.exports = (folder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadsPath = path.join(__dirname, "uploads")
      let destination = uploadsPath + "/" + req.user.id + "/" + folder
      createDirectoryIfNotExists(uploadsPath)
      createDirectoryIfNotExists(destination)

      cb(null, destination)
    },

    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname)
      let name = Date.now() + "-" + Math.round(Math.random() * 1e9)
      name += extension
      cb(null, name)
    },
  })

  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
  })
}

// Utility function to create directory if it doesn't exist
function createDirectoryIfNotExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}
