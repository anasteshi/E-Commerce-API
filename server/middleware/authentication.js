const CustomError = require("../errors")
const Token = require("../models/Token")
const { verifyJWT, attachCookiesToResponse } = require("../utils/index")

const authenticateUser = async (req, res, next) => {
    const { accessToken, refreshToken } = req.signedCookies
    try {
        if (accessToken) {
            const payload = verifyJWT(accessToken)
            req.user = payload.user
            return next()
        }

        const payload = verifyJWT(refreshToken)
        const existingToken = await Token.findOne({
            user: payload.user.userID,
            refreshToken: payload.refreshToken,
        })

        if (!existingToken || !existingToken?.isValid) {
            throw new CustomError.UnauthenticatedError(
                "Authentication invalid. No token present",
            )
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken,
        })
        req.user = payload.user
        next()
    } catch (err) {
        throw new CustomError.UnauthenticatedError("Authentication invalid")
    }
}

const authorizePermissions = (...roles) => {
    return async (req, res, next) => {
        const { role } = req.user
        if (!roles.includes(role)) {
            throw new CustomError.UnauthorizedError(
                "Unauthorized to access this route",
            )
        }
        next()
    }
}

module.exports = { authenticateUser, authorizePermissions }
