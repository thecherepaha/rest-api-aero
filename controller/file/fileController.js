const File = require("../../model/file/file")
const path = require("path")
const fs = require("fs")

/**
 * upload files via form-data
 * @param {files, user} req
 * @param {*} res
 * @returns
 */
exports.upload = async function (req, res) {
  if (!req.files.length)
    return res.status(500).send({ message: "Сначала прикрепите файл!!!" })

  for (let file of req.files) {
    await File.create({
      name: file.filename,
      extension: path.extname(file.filename),
      mime: file.mimetype,
      size: +file.size,
      path: file.path,
    })
  }

  res.status(200).send({ message: "File successfully uploaded" })
}

/**
 * Удаление файла из базы и локального хранилища
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delete = async function (req, res) {
  const { id } = req.params

  const [file] = await File.get(id)

  if (!file) return res.status(404).send({ message: "File not found!" })

  try {
    fs.unlink(file.path, async (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to delete file from filesystem",
          error: err,
        })
      }

      await File.delete(id)

      return res.status(200).json({ message: "File deleted successfully" })
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * Получить пагинированный список файлов
 * @param {*} req
 * @param {*} res
 */
exports.getAll = async function (req, res) {
  const { list_size = 10, page = 1 } = req.query

  const files = await File.getPaginated(list_size, page)

  res.status(200).send({ message: "Success!", files })
}

/**
 * Получить один файл
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.get = async function (req, res) {
  const { id } = req.params

  const [file] = await File.get(id)

  if (!file) return res.status(500).send({ message: "File not found!" })

  res.status(200).send({ message: "Success", file })
}

/**
 * Скачивание файла
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.download = async function (req, res) {
  const { id } = req.params

  const [file] = await File.get(id)

  if (!file) return res.status(500).send({ message: "File not found!" })

  return res.download(file.path, (err) => {
    if (err) {
      throw new Error("Ошибка при скачивании файла")
    }
  })
}

/**
 * Обновление существующего файла в базе и локальном хранилище
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.update = async function (req, res) {
  const { id } = req.params

  if (!req.files.length)
    return res.status(500).send({ message: "Сначала прикрепите файл!!!" })

  const [file] = await File.get(id)
  if (!file) return res.status(500).send({ message: "File not found" })

  if (req.files.length > 1)
    return res.status(500).send({ message: "Put only one file" })

  const [newFile] = req.files

  const newFILE = {
    name: newFile.filename,
    extension: path.extname(newFile.filename),
    mime: newFile.mimetype,
    size: +newFile.size,
    path: newFile.path,
  }

  try {
    fs.unlink(file.path, async (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to delete file from filesystem",
          error: err,
        })
      }

      await File.update(id, newFILE)

      return res.status(200).json({ message: "File updated successfully" })
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal server error" })
  }
}
