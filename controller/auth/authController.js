require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const uuid = require("uuid")

const User = require("../../model/user/user")
const Token = require("../../model/token/token")

/**
 * Регистрация пользователя по id-email и паролю
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.signup = async function (req, res) {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).send({ error: "Put email and password" })

  const existingUser = await User.get({ email })

  if (existingUser.length)
    return res.status(400).send({ error: "User already exists" })

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const data = {
    id: uuid.v4(),
    email: email,
    password: hashedPassword,
  }

  await User.create(data)

  delete data.password

  res.status(200).send({ message: "Successfully signed up!", data })
}

/**
 * Авторизация пользователя по email и паролю
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.signin = async function (req, res) {
  const { email, password } = req.body

  const existingUser = await User.get({ email })

  if (!existingUser.length)
    return res.status(400).send({ error: "Incorrect email" })

  const user = existingUser[0]

  const isCorrect = await bcrypt.compare(password, user.password)

  if (!isCorrect) return res.status(400).send({ error: "Incorrect password" })

  const data = {
    id: user.id,
    email: user.email,
  }
  const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  })

  const refresh_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET)

  const token = {
    id: uuid.v4(),
    user_id: user.id,
    access: access_token,
    refresh: refresh_token,
  }

  await Token.create(token)

  delete token.id
  delete token.user_id

  res.status(200).send({ message: "Successfully signed in!", token })
}

/**
 * Обновление токена доступа
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.newtoken = async function (req, res) {
  const header = req.headers["authorization"]

  if (!header) return res.status(403).send("No authorization header provided!")
  const [type, token] = header.split(" ")
  if (type !== "Bearer") return res.status(500).send("Invalid auth type")

  let [existingToken] = await Token.get({ access: token })

  if (!existingToken) return res.status(500).send("Invalid Token")

  const accessTokenData = jwt.verify(
    existingToken.refresh,
    process.env.REFRESH_TOKEN_SECRET
  )

  const new_access = jwt.sign(
    {
      ...accessTokenData,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  )

  await Token.update(existingToken.id, {
    access: new_access,
  })

  res.setHeader("Authorization", `${type} ${new_access}`)

  res.status(200).send({ message: "access token updated", access: new_access })
}

exports.info = async function (req, res) {
  const { user: info } = req

  res.status(200).send({ message: "User information", info })
}

exports.logout = async function (req, res) {
  await Token.delete(req.user.token_id)

  res.status(200).send({ message: "successfully log out" })
}
