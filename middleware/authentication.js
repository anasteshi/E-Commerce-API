const CustomError = require("../errors")
const { verifyJWT } = require("../utils/index")

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError("No token present")
    } else {
        console.log("Token present")
    }

    next()
}

module.exports = { authenticateUser }
