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
    try {
        const imageFilename = req.file?.filename || null;

        let categories = [];
        if (req.body.categories) {
            try {
                const parsed = JSON.parse(req.body.categories);
                if (Array.isArray(parsed)) {
                    categories = parsed.map(cat => cat.toLowerCase());
                } else {
                    categories = [req.body.categories.toLowerCase()];
                }
            } catch {
                categories = req.body.categories
                    .split(',')
                    .map(cat => cat.trim().toLowerCase());
            }
        }

        const newItem = new Menu({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            restaurantId: req.params.restaurantId,
            categories,
            imageUrl: imageFilename
        });

        await newItem.save();
        res.status(201).json({ success: true, message: "Menu item added", data: newItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding menu item', error: err.message });
    }
};

exports.updateMenuItem = async (req, res) => { 
    try {
        if (req.body.categories) {
            try {
                const parsed = JSON.parse(req.body.categories);
                if (Array.isArray(parsed)) {
                    req.body.categories = parsed.map(cat => cat.toLowerCase());
                } else {
                    req.body.categories = [req.body.categories.toLowerCase()];
                }
            } catch {
                req.body.categories = req.body.categories
                    .split(',')
                    .map(cat => cat.trim().toLowerCase());
            }
        }

        const updated = await Menu.findByIdAndUpdate(req.params.menuId, req.body, { new: true });

        updated ? res.json(updated) : res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const deleted = await Menu.findByIdAndDelete(req.params.menuId);

        if (deleted?.imageUrl) {
            fs.unlink(`uploads/${deleted.imageUrl}`, () => {});
        }

        deleted
            ? res.json({ message: 'Deleted successfully' })
            : res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
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
    