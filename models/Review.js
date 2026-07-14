const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide review title"],
            trim: true,
            maxlength: 100,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, "Please provide review rating"],
        },
        comment: {
            type: String,
            required: [true, "Please provide review text"],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true },
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("Review", ReviewSchema)
