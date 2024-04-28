const express = require("express")
const cors = require("cors")
const REST_API = require("./api/mainApi")
const app = express()

const PORT = process.env.PORT || 8080

//CORS settings
const opts = {
  origin: ["*"],
}
app.use(cors(opts))
app.options("*", cors(opts))
//--------------------------

// Express configurations
app.use(express.json())
app.set("trust proxy", 1) // rate limit proxy
app.use(express.urlencoded({ extended: true }))
//---------------------------------------------

//REST_API_ENDPOINTS
app.use(REST_API)

app.listen(PORT, () => {
  console.log(`AERO is running on port ${PORT}`)
})
