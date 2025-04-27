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