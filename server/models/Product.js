const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide product name"],
            trim: true,
            maxlength: [100, "Product name cannot be more than 100 characters"],
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
                "Product description cannot be more than 1000 characters",
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
            required: [true, "Please provide product company"],
            enum: {
                values: ["ikea", "liddy", "marcos"],
                message: "{VALUE} is not supported",
            },
        },
        colors: {
            type: [String],
            default: ["#fff"],
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
        numOfReviews: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

ProductSchema.pre("remove", async function () {
    await this.model("Review").deleteMany({ product: this._id })
})

ProductSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false, // for not only one review showing
    // match: {rating: 5} // to get only the reviews with rating of 5
})

module.exports = mongoose.model("Product", ProductSchema)
