const Order = require("../models/Order")
const Product = require("../models/Product")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const utils = require("../utils")

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = "random-value"
    return { client_secret, amount }
}

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

        // add item to the order
        orderItems = [
            ...orderItems,
            { name, price, image, amount, product: productID },
        ]
        // calculate subtotal
        subtotal += price * amount
    }

    // calculate total
    const total = subtotal + shippingFee + tax
    // get client secret
    const paymentIntent = fakeStripeAPI({ amount: total, currency: "usd" })

    const order = await Order.create({
        ...orderItems,
        total,
        subtotal,
        shippingFee,
        tax,
        clientSecret: (await paymentIntent).client_secret,
        user: req.user.userID,
    })
    res.status(StatusCodes.CREATED).json({
        order,
        client_secret: order.clientSecret,
    })
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
