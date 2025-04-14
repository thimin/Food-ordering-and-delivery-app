// const Menu = require('../models/menu.model');

// exports.getMenuByRestaurant = async (req, res) => {
//     const menu = await Menu.find({ restaurantId: req.params.restaurantId });
//     res.json(menu);
// };

// exports.addMenuItem = async (req, res) => {
//     const newItem = new Menu({ ...req.body, restaurantId: req.params.restaurantId });
//     await newItem.save();
//     res.status(201).json(newItem);
// };

// exports.updateMenuItem = async (req, res) => {
//     const updated = await Menu.findByIdAndUpdate(req.params.menuId, req.body, { new: true });
//     updated ? res.json(updated) : res.status(404).json({ message: 'Not found' });
// };

// exports.deleteMenuItem = async (req, res) => {
//     const deleted = await Menu.findByIdAndDelete(req.params.menuId);
//     deleted ? res.json({ message: 'Deleted successfully' }) : res.status(404).json({ message: 'Not found' });
// };


const Menu = require('../models/menu.model');

exports.getMenuByRestaurant = async (req, res) => {
    const menu = await Menu.find({ restaurantId: req.params.restaurantId });
    res.json(menu);
};

exports.getMenuByCategory = async (req, res) => {
    const { restaurantId, category } = req.params;

    const menu = await Menu.find({
        restaurantId,
        categories: { $in: [category.toLowerCase()] } 
    });

    res.json(menu);
};

exports.addMenuItem = async (req, res) => {
    const newItem = new Menu({
        ...req.body,
        restaurantId: req.params.restaurantId,
        categories: req.body.categories?.map(cat => cat.toLowerCase()) || []
    });

    await newItem.save();
    res.status(201).json(newItem);
};

exports.updateMenuItem = async (req, res) => {
    if (req.body.categories) {
        req.body.categories = req.body.categories.map(cat => cat.toLowerCase());
    }

    const updated = await Menu.findByIdAndUpdate(req.params.menuId, req.body, {
        new: true
    });

    updated ? res.json(updated) : res.status(404).json({ message: 'Not found' });
};

exports.deleteMenuItem = async (req, res) => {
    const deleted = await Menu.findByIdAndDelete(req.params.menuId);
    deleted ? res.json({ message: 'Deleted successfully' }) : res.status(404).json({ message: 'Not found' });
};

exports.setMenuItemAvailability = async (req, res) => {
    const { menuId } = req.params;
    const { available } = req.body;
    
    try {
    const updatedItem = await Menu.findByIdAndUpdate(menuId, { available }, { new: true });
    updatedItem
        ? res.json(updatedItem)
        : res.status(404).json({ message: 'Menu item not found' });
    } catch (err) {
    res.status(500).json({ message: 'Error updating availability', error: err.message });
    }
};
    