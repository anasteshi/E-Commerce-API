const mongoose = require("mongoose")
const validator = require("validator")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 2,
        maxlength: 40,
    },
    email: {
        type: String,
        unique: true, // not a validator but checks for indexes
        required: [true, "Please provide email"],
        validate: {
            message: "Please provide a valid email",
            validator: validator.isEmail,
        },
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
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
