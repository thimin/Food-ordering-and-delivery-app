const express = require('express'); const router = express.Router(); 
const restaurantOrderController = require('../controllers/restaurantOrder.controller');

router.get('/:restaurantId', restaurantOrderController.getOrdersByRestaurant); 
//router.put('/update-status', restaurantOrderController.updateStatus);
router.put("/:orderId/status", restaurantOrderController.updateOrderStatus);
module.exports = router;