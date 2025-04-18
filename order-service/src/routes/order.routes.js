const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes (if any)
// router.get('/some-public-route', orderController.someMethod);

// Protected routes
router.post("/", authMiddleware, orderController.createOrder);
router.get("/:id", authMiddleware, orderController.getOrder);
router.put("/:id", authMiddleware, orderController.updateOrder);
router.delete("/:id", authMiddleware, orderController.cancelOrder);
router.get("/user/orders", authMiddleware, orderController.getUserOrders);
router.post("/:id/confirm", authMiddleware, orderController.confirmOrder);
router.get("/:id/status", authMiddleware, orderController.getOrderStatus);

module.exports = router;
