const User = require("../models/User")

const register = async (req, res) => {
    res.send("Register route")
}

const login = async (req, res) => {
    res.send("Login route")
}

const logout = async (req, res) => {
    res.send("Logout route")
}

module.exports = { register, login, logout }
