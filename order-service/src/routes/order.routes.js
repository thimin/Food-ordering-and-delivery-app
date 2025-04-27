const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes (if any)
// router.get('/some-public-route', orderController.someMethod);

// Protected routes
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.cancelOrder);
router.get("/user/orders", orderController.getUserOrders);
router.post("/:id/confirm", orderController.confirmOrder);
router.get("/:id/status", orderController.getOrderStatus);
router.post("/:id/getJWT", orderController.getJwtToken);

module.exports = router;
