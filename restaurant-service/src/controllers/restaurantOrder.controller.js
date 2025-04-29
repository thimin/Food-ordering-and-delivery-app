const RestaurantOrderService = require("../services/restaurantOrder.service");

exports.getOrdersByRestaurant = async (req, res) => { 
    const { restaurantId } = req.params; 
    try { const orders = await RestaurantOrderService.getOrdersByRestaurantId(restaurantId); 
        res.status(200).json(orders); 
    } 
    catch (err) { 
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    } 
};

exports.updateOrderStatus = async (req, res) => { 
    const { orderId } = req.params; const { status } = req.body;

    if (!status) { 
        return res.status(400).json({ message: "Status is required" }); 
    }

    try { const updatedOrder = await RestaurantOrderService.updateRestaurantOrder(orderId, { status }); 
    res.status(200).json(updatedOrder); 
    } 
    catch (error) { 
        res.status(500).json({ message: error.message }); 
    } 
};

