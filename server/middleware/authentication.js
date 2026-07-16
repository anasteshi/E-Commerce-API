const CustomError = require("../errors")
const { verifyJWT } = require("../utils/index")

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError(
            "Authentication failed. No token present",
        )
    }

    try {
        const { name, userID, role } = verifyJWT({ token })
        req.user = { name, userID, role }
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
