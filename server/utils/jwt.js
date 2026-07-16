const jwt = require("jsonwebtoken")
// const { StatusCodes } = require("http-status-codes")

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
    return token
}

const verifyJWT = ({ token }) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user })
    const day = 1000 * 60 * 60 * 24

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + day),
        secure: process.env.NODE_ENV === "production", // cookie will be delivered only with https protocol
        signed: true, // to prevent changing cookies from client side – in devtools, for example
    })
    // res.status(StatusCodes.CREATED).json({ user })
}

module.exports = { createJWT, verifyJWT, attachCookiesToResponse }
