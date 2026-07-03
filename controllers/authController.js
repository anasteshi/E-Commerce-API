const CustomError = require("../errors")
const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")
const { createJWT } = require("../utils")

const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new CustomError.BadRequestError("Invalid credentials")
    }

    const emailAlreadyInUse = await User.findOne({ email })

    if (emailAlreadyInUse) {
        throw new CustomError.BadRequestError("Duplicate email value")
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? "admin" : "user"

    const user = await User.create({ name, email, password, role })
    const tokenUser = {
        userID: user._id,
        name: user.name,
        role: user.role,
    }
    const token = createJWT({ payload: tokenUser })

    const day = 1000 * 60 * 60 * 24
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + day),
        secure: false, // temp, to see token in clg
    })
    res.status(StatusCodes.CREATED).json({ user, token })
}

const login = async (req, res) => {
    res.send("Login route")
}

const logout = async (req, res) => {
    res.send("Logout route")
}

module.exports = { register, login, logout }
