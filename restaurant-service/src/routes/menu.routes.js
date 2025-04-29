const express = require('express');
const multer  = require('multer');
const router = express.Router();
const controller = require('../controllers/menu.controller');
const auth = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.get('/:restaurantId', controller.getMenuByRestaurant);
//router.post('/:restaurantId', auth, controller.addMenuItem);
router.post('/:restaurantId', auth, upload.single('image'), controller.addMenuItem);
router.put('/:menuId', auth, controller.updateMenuItem);
router.delete('/:menuId', auth, controller.deleteMenuItem);
router.get('/:restaurantId/category/:category', controller.getMenuByCategory); 
router.patch('/:menuId/availability', auth, controller.setMenuItemAvailability);

module.exports = router;
