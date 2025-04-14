const express = require('express');
const router = express.Router();
const controller = require('../controllers/menu.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/:restaurantId', controller.getMenuByRestaurant);
router.post('/:restaurantId', auth, controller.addMenuItem);
router.put('/:menuId', auth, controller.updateMenuItem);
router.delete('/:menuId', auth, controller.deleteMenuItem);
router.get('/:restaurantId/category/:category', controller.getMenuByCategory); 
router.patch('/:menuId/availability', auth, controller.setMenuItemAvailability);

module.exports = router;
