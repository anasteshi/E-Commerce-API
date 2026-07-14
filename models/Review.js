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
            required: [true, "Please provide review comment"],
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

ReviewSchema.statics.calculateAverageRating = async function (productID) {
    const result = await this.aggregate([
        {
            $match: {
                product: productID,
            },
        },
        {
            $group: {
                _id: "$product",
                averageRating: { $avg: "$rating" },
                numOfReviews: { $sum: 1 },
            },
        },
    ])
    console.log(result)
    try {
        await this.model("Product").findOneAndUpdate(
            { _id: productID },
            {
                averageRating: Math.round(result[0]?.averageRating || 0), // optional chaining operator in case
                // if the aggregation steps return an empty array []
                numOfReviews: result[0]?.numOfReviews || 0,
            },
        )
    } catch (err) {
        console.log(err)
    }
}

ReviewSchema.post("save", async function () {
    await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post("remove", async function () {
    await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model("Review", ReviewSchema)
