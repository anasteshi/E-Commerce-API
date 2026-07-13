const Product = require("../models/Product")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
} = require("../utils")

const createProduct = async (req, res) => {
    req.body.user = req.user.userID
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async (req, res) => {
    const { id: productID } = req.params
    const product = await Product.findById(productID)

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productID}`)
    }

    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
    const { id: productID } = req.params
    const product = await Product.findOneAndUpdate({ productID }, req.body, {
        new: true,
        runValidators: true,
    })

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productID}`)
    }

    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
    const { id: productID } = req.params
    const product = await Product.findById(productID)

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productID}`)
    }

    await product.remove()
    res.status(StatusCodes.OK).json({ msg: "Product was successfully removed" })
}

const uploadImage = async (req, res) => {
    res.send("Upload image")
}

module.exports = {
    createProduct,
    getSingleProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    uploadImage,
}
