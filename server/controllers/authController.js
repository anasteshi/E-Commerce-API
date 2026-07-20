const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")
const { attachCookiesToResponse, createTokenUser } = require("../utils")
const crypto = require("crypto")

const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new CustomError.BadRequestError(
            "Provide name, email, and password",
        )
    }

    const emailAlreadyInUse = await User.findOne({ email })

    if (emailAlreadyInUse) {
        throw new CustomError.BadRequestError("Duplicate email value")
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? "admin" : "user"

    const verificationToken = crypto.randomBytes(40).toString("hex")
    console.log(verificationToken)
    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken,
    })
    res.status(StatusCodes.CREATED).json({
        msg: "Success! Please verify your email to continue",
        verificationToken: user.verificationToken,
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError.BadRequestError(
            "Please provide email and password",
        )
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }

    if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError("Please verify your email")
    }

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.OK).json({ user })
}

const verifyEmail = async (req, res) => {
    const { email, verificationToken } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }
    if (verificationToken !== user.verificationToken) {
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }

    user.isVerified = true
    user.verifiedAt = Date.now()
    user.verificationToken = ""
    user.save()
    res.status(StatusCodes.OK).json({
        msg: "Your email was successfully verified",
    })
}

const logout = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 5),
    })
    res.status(StatusCodes.OK).json({ msg: "User logged out" })
}

module.exports = { register, login, verifyEmail, logout }
