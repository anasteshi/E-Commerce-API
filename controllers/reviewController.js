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

    const alreadySubmitted = await Review.findOne({
        user: userID,
        product: productID,
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
    const { id: reviewID } = req.params
    const review = await Review.findById(reviewID)
        .populate({
            path: "product",
            select: "name company price",
        })
        .populate({
            path: "user",
            select: "name",
        })
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewID}`)
    }
    res.status(StatusCodes.OK).json({ review })
}

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
        .populate({
            path: "product",
            select: "name company price",
        })
        .populate({
            path: "user",
            select: "name",
        })
    // might also add pagination later
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const updateReview = async (req, res) => {
    const { id: reviewID } = req.params
    const { title, rating, comment } = req.body

    // if (!title || !rating || !comment) {
    //     throw new CustomError.BadRequestError("Please provide all values")
    // }

    const review = await Review.findById(reviewID)
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewID}`)
    }
    utils.checkPermissions(req.user, review.user)

    review.title = title
    review.rating = rating
    review.comment = comment
    await review.save()
    res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
    const { id: reviewID } = req.params
    const review = await Review.findById(reviewID)

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewID}`)
    }

    utils.checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({ msg: "Review was successfully deleted" })
}

const getSingleProductReviews = async (req, res) => {
    const { id: productID } = req.params
    const reviews = await Review.find({ product: productID })
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
    createReview,
    getSingleReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getSingleProductReviews,
}
