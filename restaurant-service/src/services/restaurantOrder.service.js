// const RestaurantOrder = require('../models/RestaurantOrder');

// exports.createRestaurantOrder = async (orderData) => { return await RestaurantOrder.create(orderData); };

// exports.updateRestaurantOrderStatus = async (orderId, status) => { const updated = await RestaurantOrder.findOneAndUpdate( { orderId }, { status }, { new: true } ); return updated; };

// exports.getRestaurantOrders = async (restaurantId) => { return await RestaurantOrder.find({ restaurantId }); };


// const RestaurantOrder = require("../models/restaurantOrder.model"); const logger = require("../utils/logger");

// class RestaurantOrderService { async createRestaurantOrder(orderData) { try { const newOrder = await RestaurantOrder.create(orderData); logger.info(`Created restaurant order ${orderData.orderId}`); return newOrder; } catch (err) { logger.error(`Failed to create restaurant order: ${err.message}`); throw err; } }

// async updateRestaurantOrderStatus(orderId, status) { try { const updated = await RestaurantOrder.findOneAndUpdate( { orderId }, { status }, { new: true } ); logger.info(`Updated order ${orderId} status to ${status}`); return updated; } catch (err) { logger.error(`Failed to update order status: ${err.message}`); throw err; } }

// async getRestaurantOrders(restaurantId) { return await RestaurantOrder.find({ restaurantId }); } }

// module.exports = new RestaurantOrderService();

// const RestaurantOrder = require("../models/restaurantOrder.model");

// async function createRestaurantOrder(orderData) {
//   const order = new RestaurantOrder(orderData);
//   await order.save();
//   return order;
// }

// module.exports = {
//   createRestaurantOrder,
// };


// const RestaurantOrder = require("../models/restaurantOrder.model");
// const { publishToQueue } = require("../config/rabbitmq.config");
// const logger = require("../utils/logger");

// class RestaurantOrderService {
//     async createRestaurantOrder(orderData) {
//         try {
//         const order = new RestaurantOrder(orderData);
//         await order.save();

//         logger.info(`Restaurant order created: ${order._id}`);
//         return order;
//         } catch (error) {
//         logger.error(`Error creating restaurant order: ${error.message}`);
//         throw error;
//         }
//     }

//     async updateOrderStatus(orderId, status) {
//         try {
//         const order = await RestaurantOrder.findOneAndUpdate(
//             { orderId },
//             { $set: { status, updatedAt: new Date() } },
//             { new: true }
//         );

//         if (!order) {
//             throw new Error(`Restaurant order ${orderId} not found`);
//         }

//         // Publish restaurant_order_update event
//         await publishToQueue("restaurant_order_update", {
//             orderId: order.orderId,
//             restaurantId: order.restaurantId,
//             newStatus: order.status,
//         });

//         logger.info(`Restaurant order ${orderId} status updated to ${status}`);
//         return order;
//         } catch (error) {
//         logger.error(`Error updating restaurant order ${orderId}: ${error.message}`);
//         throw error;
//         }
//     }

//     async getRestaurantOrderById(orderId) {
//         try {
//         const order = await RestaurantOrder.findOne({ orderId });
//         if (!order) {
//             throw new Error(`Restaurant order ${orderId} not found`);
//         }
//         return order;
//         } catch (error) {
//         logger.error(`Error fetching restaurant order ${orderId}: ${error.message}`);
//         throw error;
//         }
//     }
// }

// module.exports = new RestaurantOrderService();


// const RestaurantOrder = require("../models/restaurantOrder.model");
// const { publishToQueue } = require("../config/rabbitmq.config");
// const logger = require("../utils/logger");

// class RestaurantOrderService {
//   // Initialize or update a restaurant order based on queue data
//   async syncRestaurantOrder(orderData) {
//     try {
//       const { orderId, restaurantId, customerId, deliveryAddress, quantity, totalAmount, status } = orderData;

//       // Check if the restaurant order already exists
//       let order = await RestaurantOrder.findOne({ orderId });

//       if (order) {
//         // Update existing order with new data
//         order = await RestaurantOrder.findOneAndUpdate(
//           { orderId },
//           {
//             $set: {
//               restaurantId,
//               customerId,
//               deliveryAddress,
//               quantity,
//               totalAmount,
//               status: status || order.status, // Preserve existing status if not provided
//               updatedAt: new Date()
//             }
//           },
//           { new: true }
//         );
//         logger.info(`Restaurant order ${orderId} updated for restaurant ${restaurantId}`);
//       } else {
//         // Create a new restaurant order if it doesn't exist
//         order = new RestaurantOrder({
//           orderId,
//           restaurantId,
//           customerId,
//           deliveryAddress,
//           quantity,
//           totalAmount,
//           status: status || "received", // Default to "received" for new orders
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//         await order.save();
//         logger.info(`Restaurant order ${orderId} initialized for restaurant ${restaurantId}`);
//       }

//       return order;
//     } catch (error) {
//       logger.error(`Error syncing restaurant order ${orderData.orderId || "unknown"}: ${error.message}`);
//       throw error;
//     }
//   }

//   // Update restaurant order status and other fields
//   async updateRestaurantOrder(orderId, updateData) {
//     try {
//       const { status, restaurantId, customerId, deliveryAddress, quantity, totalAmount } = updateData;

//       const order = await RestaurantOrder.findOneAndUpdate(
//         { orderId },
//         {
//           $set: {
//             ...(status && { status }), // Update status if provided
//             ...(restaurantId && { restaurantId }),
//             ...(customerId && { customerId }),
//             ...(deliveryAddress && { deliveryAddress }),
//             ...(quantity && { quantity }),
//             ...(totalAmount && { totalAmount }),
//             updatedAt: new Date()
//           }
//         },
//         { new: true }
//       );

//       if (!order) {
//         throw new Error(`Restaurant order ${orderId} not found`);
//       }

//       // Publish restaurant_order_update event if status changed
//       if (status) {
//         await publishToQueue("restaurant_order_update", {
//           orderId,
//           restaurantId: order.restaurantId,
//           customerId: order.customerId,
//           newStatus: order.status,
//           totalAmount: order.totalAmount
//         });
//       }

//       logger.info(`Restaurant order ${orderId} updated with status ${order.status}`);
//       return order;
//     } catch (error) {
//       logger.error(`Error updating restaurant order ${orderId}: ${error.message}`);
//       throw error;
//     }
//   }

//   // Get restaurant order by orderId
//   async getRestaurantOrderById(orderId) {
//     try {
//       const order = await RestaurantOrder.findOne({ orderId });
//       if (!order) {
//         throw new Error(`Restaurant order ${orderId} not found`);
//       }
//       return order;
//     } catch (error) {
//       logger.error(`Error fetching restaurant order ${orderId}: ${error.message}`);
//       throw error;
//     }
//   }
// }

// module.exports = new RestaurantOrderService();



const RestaurantOrder = require("../models/restaurantOrder.model"); const { publishToQueue } = require("../config/rabbitmq.config"); const logger = require("../utils/logger");

class RestaurantOrderService { async syncRestaurantOrder(orderData) { try { const { orderId, restaurantId, customerId, deliveryAddress, quantity, totalAmount, status, } = orderData;
let order = await RestaurantOrder.findOne({ orderId });

if (order) {
    order = await RestaurantOrder.findOneAndUpdate(
        { orderId },
        {
        $set: {
            restaurantId,
            customerId,
            deliveryAddress,
            quantity,
            totalAmount,
            status: status || order.status,
            updatedAt: new Date(),
        },
        },
        { new: true }
    );
    logger.info(`Restaurant order ${orderId} updated for restaurant ${restaurantId}`);
    } else {
    order = new RestaurantOrder({
        orderId,
        restaurantId,
        customerId,
        deliveryAddress,
        quantity,
        totalAmount,
        status: status || "received",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await order.save();
    logger.info(`Restaurant order ${orderId} initialized for restaurant ${restaurantId}`);
}

return order;
} catch (error) {
logger.error(`Error syncing restaurant order ${orderData.orderId || "unknown"}: ${error.message}`);
throw error;
}
}

async updateRestaurantOrder(orderId, updateData) { try { const { status, restaurantId, customerId, deliveryAddress, quantity, totalAmount } = updateData;
const order = await RestaurantOrder.findOneAndUpdate(
    { orderId },
    {
        $set: {
            ...(status && { status }),
            ...(restaurantId && { restaurantId }),
            ...(customerId && { customerId }),
            ...(deliveryAddress && { deliveryAddress }),
            ...(quantity && { quantity }),
            ...(totalAmount && { totalAmount }),
            updatedAt: new Date(),
        },
        },
        { new: true }
    );

    if (!order) {
        throw new Error(`Restaurant order ${orderId} not found`);
    }

    if (status) {
        await publishToQueue("restaurant_order_update", {
        orderId,
        restaurantId: order.restaurantId,
        customerId: order.customerId,
        newStatus: order.status,
        totalAmount: order.totalAmount,
        });
    }

    logger.info(`Restaurant order ${orderId} updated with status ${order.status}`);
    return order;
    } catch (error) {
    logger.error(`Error updating restaurant order ${orderId}: ${error.message}`);
    throw error;
}
}

async getRestaurantOrderById(orderId) { 
    try { const order = await RestaurantOrder.findOne({ orderId }); 
    if (!order) 
        { throw new Error(`Restaurant order ${orderId} not found`); } 
    return order; 
} 
catch (error) { 
    logger.error(`Error fetching restaurant order ${orderId}: ${error.message}`); throw error; } 
}

async getOrdersByRestaurantId(restaurantId) { 
    try { const orders = await RestaurantOrder.find({ restaurantId }); 
    return orders; 
} catch (error) { 
    logger.error(`Error fetching orders for restaurant ${restaurantId}: ${error.message}`); 
    throw error; 
} } }

module.exports = new RestaurantOrderService();