require("dotenv").config()
require("express-async-errors") // to prevent adding try/catch blocks in each controller

// express
const express = require("express")
const app = express()
const port = process.env.PORT || 5001

// other packages
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

// database
const connectDB = require("./db/connect")

// routers
const authRouter = require("./routes/authRoutes")

// middleware
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

app.use(morgan("tiny")) // in order to see the request and route info
app.use(express.json()) // in order to access data in req.body
// app.use(cookieParser()) // in order to access cookies in code
app.use(cookieParser(process.env.JWT_SECRET)) // to sign our cookies

// routes
app.get("/api/v1", async (req, res) => {
    // console.log(req.cookies)
    console.log(req.signedCookies) // after signing cookies are accessible from here
    res.send("E-commerce API")
})

app.use("/api/v1/auth", authRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()
