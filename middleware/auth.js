require("dotenv").config()
const jwt = require("jsonwebtoken")
const Token = require("../model/token/token")

/**
 * verify if user is authenticated
 */
exports.verify = () => {
  return async function (req, res, next) {
    try {
      const header = req.headers["authorization"]

      if (!header) {
        res.status(403).send("No authorization header provided!")
      }

      const [type, token] = header.split(" ")
      if (type !== "Bearer") return res.status(500).send("Invalid auth type")

      let [existingToken] = await Token.get({ access: token })

      if (!existingToken) return res.status(500).send("Invalid Token")

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            // const accessTokenData = jwt.verify(
            //   existingToken.refresh,
            //   process.env.REFRESH_TOKEN_SECRET
            // )
            // const new_access = jwt.sign(
            //   {
            //     ...accessTokenData,
            //     iat: Math.floor(Date.now() / 1000),
            //   },
            //   process.env.ACCESS_TOKEN_SECRET,
            //   {
            //     expiresIn: "10m",
            //   }
            // )
            // await Token.update(existingToken.id, {
            //   access: new_access,
            // })
            // res.setHeader("Authorization", `${type} ${new_access}`)
            // const { email, id } = accessTokenData
            // const data = {
            //   email,
            //   id,
            //   token_id: existingToken.id,
            // }
            // req.user = data
            // return next()

            return res.status(500).send("Your token has expired!")
          } else {
            return res
              .status(403)
              .json({ message: "Failed to authenticate token" })
          }
        }

        const data = {
          id: user.id,
          email: user.email,
          token_id: existingToken.id,
        }

        req.user = data

        return next()
      })
    } catch (err) {
      return res.status(500).send({ message: "Internal server error" })
    }
  }
}
