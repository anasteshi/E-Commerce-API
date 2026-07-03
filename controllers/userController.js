const getSingleUser = async (req, res) => {
    res.send(req.params)
}

const getAllUsers = async (req, res) => {
    res.send("Get all users")
}

const showCurrentUser = async (req, res) => {
    res.send("Show current user")
}

const updateUser = async (req, res) => {
    res.send(req.body)
}

const updateUserPassword = async (req, res) => {
    res.send(req.body)
}

module.exports = {
    getSingleUser,
    getAllUsers,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}
