const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a valid name"],
        minlength: 2,
        maxlength: 40,
    },
    email: {
        type: String,
        required: [true, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a valid password"],
        minlength: 6,
        maxlength: 20,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
})

module.exports = mongoose.model("User", UserSchema)
