const jwt = require("jsonwebtoken")
// const { StatusCodes } = require("http-status-codes")

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET) // expiration is handled in cookies
    return token
}

const verifyJWT = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
    const accessTokenJWT = createJWT({ payload: { user } })
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })
    const oneDay = 1000 * 60 * 60 * 24

    res.cookie("accessToken", accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // cookie will be delivered only with https protocol
        signed: true, // to prevent changing cookies from client side – in devtools, for example
        maxAge: 1000 * 60 * 15,
    })

    res.cookie("refreshToken", refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + oneDay),
    })
}

// const attachSingleCookieToResponse = ({ res, user }) => {
//     const token = createJWT({ payload: user })
//     const day = 1000 * 60 * 60 * 24

//     res.cookie("token", token, {
//         httpOnly: true,
//         expires: new Date(Date.now() + day),
//         secure: process.env.NODE_ENV === "production", // cookie will be delivered only with https protocol
//         signed: true, // to prevent changing cookies from client side – in devtools, for example
//     })
// }

module.exports = { createJWT, verifyJWT, attachCookiesToResponse }
