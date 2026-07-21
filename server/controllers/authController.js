const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")
const Token = require("../models/Token")
const {
    attachCookiesToResponse,
    createTokenUser,
    sendVerificationEmail,
} = require("../utils")
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
    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken,
    })

    const origin = "http://localhost:3000"

    // const tempOrigin = req.get("origin")
    // const protocol = req.protocol
    // const host = req.get("host")
    // const forwardedHost = req.get("x-forwarded-host")
    // const forwardedProtocol = req.get("x-forwarded-proto")

    // console.log(`origin: ${tempOrigin}`)
    // console.log(`protocol: ${protocol}`)
    // console.log(`host: ${host}`)
    // console.log(`forwarded host: ${forwardedHost}`)
    // console.log(`forwarded protocol: ${forwardedProtocol}`)

    await sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin,
    })
    res.status(StatusCodes.CREATED).json({
        msg: "Success! Please verify your email to continue",
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

    // create refresh token
    let refreshToken = ""

    // check for existing token
    refreshToken = crypto.randomBytes(40).toString("hex")
    const userAgent = req.headers["user-agent"]
    const ip = req.ip
    const userToken = { refreshToken, ip, userAgent, user: user._id }

    await Token.create(userToken)

    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const verifyEmail = async (req, res) => {
    const { email, verificationToken } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError("Verification failed")
    }
    if (verificationToken !== user.verificationToken) {
        throw new CustomError.UnauthenticatedError("Verification failed")
    }

    user.isVerified = true
    user.verifiedAt = Date.now()
    user.verificationToken = ""
    user.save()
    res.status(StatusCodes.OK).json({
        msg: "Email verified",
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
