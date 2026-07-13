const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide product name"],
            trim: true,
            maxlength: [100, "Name cannot be more than 100 characters"],
        },
        price: {
            type: Number,
            required: [true, "Please provide product price"],
            default: 0,
        },
        description: {
            type: String,
            required: [true, "Please provide product description"],
            maxlength: [
                1000,
                "Description cannot be more than 1000 characters",
            ],
        },
        image: {
            type: String,
            default: "/uploads/example.jpeg",
        },
        category: {
            type: String,
            required: [true, "Please provide product category"],
            enum: {
                values: ["kitchen", "bedroom", "office"],
                message: "{VALUE} is not supported",
            },
        },
        company: {
            type: String,
            required: [true, "Please provide company"],
            enum: {
                values: ["ikea", "liddy", "marcos"],
                message: "{VALUE} is not supported",
            },
        },
        colors: {
            type: [String],
            required: true,
        },
        featured: {
            type: Boolean,
            required: true,
            default: false,
        },
        freeShipping: {
            type: Boolean,
            default: false,
        },
        inventory: {
            type: Number,
            require: true,
            default: 15,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model("Product", ProductSchema)
