const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/delivery.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/",
  // authMiddleware(["admin", "dispatcher"]),
  deliveryController.assignDelivery
);
router.put(
  "/:id/status",
  // authMiddleware(["delivery_person"]),
  deliveryController.updateStatus
);
router.put(
  "/:id/location",
  // authMiddleware(["delivery_person"]),
  deliveryController.updateLocation
);
router.get(
  "/available",
  // authMiddleware(["delivery_person"]),
  deliveryController.getAvailableDeliveries
);
router.get(
  "/person/:deliveryPersonId",
  // authMiddleware(["admin", "delivery_person"]),
  deliveryController.getDeliveryPersonDeliveries
);

module.exports = router;
