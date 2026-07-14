const Review = require("../models/Review")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const utils = require("../utils")

const createReview = async (req, res) => {
    res.send("Create review")
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
