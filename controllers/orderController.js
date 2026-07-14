const Order = require("../models/Order")
const Product = require("../models/Product")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const utils = require("../utils")

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body
    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError("No cart items provided")
    }
    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError(
            "Please provide tax and shipping fee",
        )
    }

    let orderItems = []
    let subtotal = 0

    for (const item of cartItems) {
        const productID = item.product
        const amount = item.amount
        const product = await Product.findById(productID)

        if (!product) {
            throw new CustomError.NotFoundError(
                `No product with id: ${productID}`,
            )
        }

        const { name, price, image } = product
        orderItems = [
            ...orderItems,
            { name, price, image, amount, product: productID },
        ]

        subtotal += price * amount

        console.log(orderItems)
        console.log(subtotal)
    }
    res.send("Create order")
}

const getSingleOrder = async (req, res) => {
    res.send("Get single order")
}

const getAllOrders = async (req, res) => {
    res.send("Get all orders")
}

const updateOrder = async (req, res) => {
    res.send("Update order")
}

const getCurrentUserOrders = async (req, res) => {
    res.send("Get current user order")
}

module.exports = {
    createOrder,
    getSingleOrder,
    getAllOrders,
    updateOrder,
    getCurrentUserOrders,
}
