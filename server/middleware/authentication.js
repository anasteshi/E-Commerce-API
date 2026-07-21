const CustomError = require("../errors")
const { verifyJWT } = require("../utils/index")

const authenticateUser = async (req, res, next) => {
    const { accessToken, refreshToken } = req.signedCookies
    try {
        if (accessToken) {
            const payload = verifyJWT(accessToken)
            req.user = payload
            return next()
        }
        // 
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
