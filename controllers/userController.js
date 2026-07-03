const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")

const getSingleUser = async (req, res) => {
    const userID = req.params.id
    const user = await User.findById(userID).select("-password")

    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${userID}`)
    }
    res.status(StatusCodes.OK).json({ user })
}

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: "user" }).select("-password")
    res.status(StatusCodes.OK).json({ users })
}

const showCurrentUser = async (req, res) => {
    res.send("Show current user")
}

const updateUser = async (req, res) => {
    res.send(req.body)
}

const updateUserPassword = async (req, res) => {
    res.send(req.body)
}

module.exports = {
    getSingleUser,
    getAllUsers,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}
