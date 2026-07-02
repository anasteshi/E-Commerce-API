require("dotenv").config()

// express
const express = require("express")
const app = express()

const port = process.env.PORT || 5001
const connectDB = require("./db/connect")

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
