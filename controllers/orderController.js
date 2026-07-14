const Order = require("../models/Order")
const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const utils = require("../utils")

const createOrder = async (req, res) => {
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
