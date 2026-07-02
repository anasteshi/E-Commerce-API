require("dotenv").config()
require("express-async-errors") // to prevent adding try/catch blocks in each controller

// express
const express = require("express")
const app = express()
const port = process.env.PORT || 5001

// other packages
const morgan = require("morgan")

// database
const connectDB = require("./db/connect")

// middleware
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

app.use(morgan("tiny")) // in order to see the request and route info
app.use(express.json()) // in order to access data in req.body

// routes
app.get("/", async (req, res) => {
    res.send("E-commerce API")
})

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
