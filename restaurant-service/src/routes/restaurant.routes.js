const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurant.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', controller.getAllRestaurants);
router.get('/:id', controller.getRestaurantById);
router.post('/', auth, controller.createRestaurant);
router.put('/:id', auth, controller.updateRestaurant);
router.delete('/:id', auth, controller.deleteRestaurant);
router.patch('/:id/availability', auth, controller.setAvailability);

// router.post("/confirm-order", controller.confirmOrder);
// router.post("/cancel-order", controller.cancelOrder);

module.exports = router;
