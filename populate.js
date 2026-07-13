require("dotenv").config()
const mockDataProducts = require("./mockData/products.json")
const Product = require("./models/Product")
const connectDB = require("./db/connect")

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.create(
            mockDataProducts.map((product) => {
                return { user: "6a50cde08e8c7bcdeda9d5e4", ...product }
            }),
        )
        console.log("Success !!!")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
