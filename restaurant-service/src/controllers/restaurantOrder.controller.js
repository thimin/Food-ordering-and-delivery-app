//const RestaurantOrderService = require('../services/restaurantOrder.service');

// exports.updateStatus = async (req, res) => { 
//     const { orderId, status } = req.body; 
//     try { const updated = await RestaurantOrderService.updateRestaurantOrder(orderId, status); 
//         if (!updated) { 
//             return res.status(404).json({ message: 'Order not found' }); 
//         } 
//         res.status(200).json({ message: 'Status updated', order: updated }); 
//     } 
//     catch (err) { 
//         res.status(500).json({ message: 'Internal Server Error', error: err.message }); 
//     } 
// };

// exports.getOrdersByRestaurant = async (req, res) => { 
//     const { restaurantId } = req.params; 
//     try { const orders = await RestaurantOrderService.getRestaurantOrderById(restaurantId); 
//         res.status(200).json(orders); 
//     } 
//     catch (err) { 
//         res.status(500).json({ message: 'Failed to fetch orders', error: err.message }); 
//     } 
// };

// exports.updateOrderStatus = async (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     if (!status) {
//         return res.status(400).json({ message: "Status is required" });
//     }

//     try {
//         const updatedOrder = await RestaurantOrderService.updateRestaurantOrder(orderId, status);
//         res.status(200).json(updatedOrder);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


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

// const RestaurantOrderService = require("../services/restaurantOrder.service");
// const logger = require("../utils/logger");

// // Update the status of a restaurant order
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     if (!status) {
//       return res.status(400).json({ message: "Status is required" });
//     }

//     const updatedOrder = await RestaurantOrderService.updateRestaurantOrder(orderId, { status });

//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     logger.error(`Error updating restaurant order status for order ${req.params.orderId}: ${error.message}`);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a restaurant order by orderId
// exports.getOrderById = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await RestaurantOrderService.getRestaurantOrderById(orderId);
//     res.status(200).json(order);
//   } catch (error) {
//     logger.error(`Error fetching restaurant order ${req.params.orderId}: ${error.message}`);
//     res.status(500).json({ message: error.message });
//   }
// };
