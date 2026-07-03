const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

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

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {
            userID: this._id,
            name: this.name,
            role: this.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME },
    )
}

module.exports = mongoose.model("User", UserSchema)
