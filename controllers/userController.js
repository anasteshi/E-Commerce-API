const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const { createTokenUser, attachCookiesToResponse } = require("../utils")

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
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
    const { email, name } = req.body
    const { userID } = req.user

    if (!email || !name) {
        throw new CustomError.BadRequestError("Please provide name and email")
    }

    const user = await User.findOneAndUpdate(
        { _id: userID },
        { email, name },
        { new: true, runValidators: true },
    )
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const { userID } = req.user

    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError("Please provide both values")
    }

    const user = await User.findOne({ _id: userID })
    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }
    user.password = newPassword
    user.save()

    res.status(StatusCodes.OK).json({
        msg: "User password was successfully updated!",
    })
}

module.exports = {
    getSingleUser,
    getAllUsers,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}
