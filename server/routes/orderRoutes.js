const express = require("express")
const router = express.Router()

const {
    createOrder,
    getSingleOrder,
    getAllOrders,
    updateOrder,
    getCurrentUserOrders,
} = require("../controllers/orderController")
const { authorizePermissions } = require("../middleware/authentication")

router
    .route("/")
    .get(authorizePermissions("admin"), getAllOrders)
    .post(createOrder)
router.get("/showAllMyOrders", getCurrentUserOrders)
router.route("/:id").get(getSingleOrder).patch(updateOrder)

module.exports = router
