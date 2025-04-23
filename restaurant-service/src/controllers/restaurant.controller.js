const Restaurant = require('../models/restaurant.model');
//const restaurantService = require("../services/restaurant.service");

//function to update order from restaurant
// exports.confirmOrder = async (req, res) => {
//   const { orderId, restaurantId } = req.body;
//   await restaurantService.confirmOrderFromRestaurant(orderId, restaurantId);
//   res.status(200).json({ message: "Order confirmed" });
// };

// exports.cancelOrder = async (req, res) => {
//   const { orderId, restaurantId } = req.body;
//   await restaurantService.cancelOrderFromRestaurant(orderId, restaurantId);
//   res.status(200).json({ message: "Order cancelled" });
// };

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        restaurant ? res.json(restaurant) : res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRestaurant = async (req, res) => {
    try {
        const newRestaurant = new Restaurant(req.body);
        await newRestaurant.save();
        res.status(201).json(newRestaurant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        updated ? res.json(updated) : res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const deleted = await Restaurant.findByIdAndDelete(req.params.id);
        deleted ? res.json({ message: 'Deleted successfully' }) : res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.setAvailability = async (req, res) => {
    try {
        const updated = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { isAvailable: req.body.isAvailable },
            { new: true }
        );
        updated ? res.json(updated) : res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
