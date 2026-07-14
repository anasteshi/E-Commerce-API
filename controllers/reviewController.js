const Review = require("../models/Review")
const Product = require("../models/Product")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const utils = require("../utils")

const createReview = async (req, res) => {
    const { product: productID } = req.body
    const { userID } = req.user
    const isValid = await Product.findById(productID)

    if (!isValid) {
        throw new CustomError.NotFoundError(`No product with id: ${productID}`)
    }

    const alreadySubmitted = await Product.findOne({
        user: userID,
        _id: productID,
    })

    if (alreadySubmitted) {
        throw new CustomError.BadRequestError(
            "Already submitted a review for this product",
        )
    }

    req.body.user = userID
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({ review })
}

const getSingleReview = async (req, res) => {
    res.send("Get single review")
}

const getAllReviews = async (req, res) => {
    res.send("Get all reviews")
}

const updateReview = async (req, res) => {
    res.send("Update review")
}

const deleteReview = async (req, res) => {
    res.send("Delete review")
}

module.exports = {
    createReview,
    getSingleReview,
    getAllReviews,
    updateReview,
    deleteReview,
}
