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
        orderItems,
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
    const { id: orderID } = req.params
    const order = await Order.findById(orderID)
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderID}`)
    }
    utils.checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({ order })
}

const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const updateOrder = async (req, res) => {
    const { id: orderID } = req.params
    const { paymentIntentID } = req.body
    const order = await Order.findById(orderID)

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderID}`)
    }

    utils.checkPermissions(req.user, order.user)

    order.paymentIntentID = paymentIntentID
    order.status = "paid"
    await order.save()
    res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userID })
    res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

module.exports = {
    createOrder,
    getSingleOrder,
    getAllOrders,
    updateOrder,
    getCurrentUserOrders,
}
