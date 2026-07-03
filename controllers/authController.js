const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const User = require("../models/User")

const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new CustomError.BadRequestError("Invalid credentials")
    }

    const user = await User.create({ name, email, password })
    res.status(StatusCodes.CREATED).json(user)
}

const login = async (req, res) => {
    res.send("Login route")
}

const logout = async (req, res) => {
    res.send("Logout route")
}

module.exports = { register, login, logout }
