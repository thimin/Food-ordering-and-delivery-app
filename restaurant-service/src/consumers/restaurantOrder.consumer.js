// // const { consumeMessage } = require("../config/rabbitmq.config");
// // const restaurantOrderService = require('../services/restaurantOrder.service');

// // const ORDER_CREATED_QUEUE = 'order_created';

// // const handleOrderCreated = async (msg) => { const order = JSON.parse(msg.content.toString()); const { orderId, restaurantId, quantity, customerId, deliveryAddress } = order;

// // try { await restaurantOrderService.createRestaurantOrder({ orderId, restaurantId, quantity, customerId, deliveryAddress, }); console.log(`Restaurant Order ${orderId} recorded.`); } catch (err) { console.error('Error storing restaurant order:', err.message); } };

// // exports.startRestaurantOrderConsumer = async () => { await consumeMessage(ORDER_CREATED_QUEUE, handleOrderCreated); };

// // const { consumeFromQueue } = require("../config/rabbitmq.config"); const logger = require("../utils/logger"); const restaurantOrderService = require("../services/restaurantOrder.service");

// // function startRestaurantOrderConsumer() { consumeFromQueue("order_created", async (message) => { logger.info(`New order_created message: ${JSON.stringify(message)}`); try { const { orderId, restaurantId, quantity, customerId, deliveryAddress } = message;
// // await restaurantOrderService.createRestaurantOrder({
// //     orderId,
// //     restaurantId,
// //     quantity,
// //     customerId,
// //     deliveryAddress
// //   });

// //   logger.info(`Stored restaurant order ${orderId}`);
// // } catch (err) {
// //   logger.error(`Failed to store restaurant order: ${err.message}`);
// // }
// // }); }

// // module.exports = { startRestaurantOrderConsumer };

// const { consumeFromQueue } = require("../config/rabbitmq.config");
// const logger = require("../utils/logger");
// const restaurantOrderService = require("../services/restaurantOrder.service");

// // Start consuming order_created events
// // function startRestaurantOrderConsumer() {
// //   consumeFromQueue("order_created", async (message) => {
// //     try {
// //       const {
// //         orderId,
// //         restaurantId,
// //         quantity,
// //         customerId,
// //         deliveryAddress,
// //         totalAmount, 
// //       } = message;

// //       if (!orderId || !restaurantId || !quantity || !customerId || !deliveryAddress || totalAmount === undefined) {
// //         logger.error("Invalid order_created message: Missing required fields");
// //         return;
// //       }

// //       await restaurantOrderService.createRestaurantOrder({
// //         orderId,
// //         restaurantId,
// //         quantity,
// //         customerId,
// //         deliveryAddress,
// //         totalAmount,
// //       });

// //       logger.info(`Stored restaurant order ${orderId}`);
// //     } catch (err) {
// //       logger.error(`Failed to store restaurant order: ${err.message}`);
// //     }
// //   });
// // }
// consumeFromQueue("order_created", async (message) => {
//     logger.info(`Received order_created message: ${JSON.stringify(message)}`);
  
//     try {
//       const {
//         orderId,
//         restaurantId,
//         quantity,
//         customerId,
//         deliveryAddress,
//         totalAmount,
//       } = message;
  
//       if (
//         !orderId ||
//         !restaurantId ||
//         !quantity ||
//         !customerId ||
//         !deliveryAddress ||
//         totalAmount === undefined
//       ) {
//         logger.error("Invalid order_created message: Missing required fields");
//         return;
//       }
  
//       await restaurantOrderService.createRestaurantOrder({
//         orderId,
//         restaurantId,
//         quantity,
//         customerId,
//         deliveryAddress,
//         totalAmount,
//       });
  
//       logger.info(`Stored restaurant order ${orderId}`);
//     } catch (err) {
//       logger.error(`Failed to store restaurant order: ${err.message}`);
//     }
//   });
  

// module.exports = { startRestaurantOrderConsumer };



// const { consumeFromQueue } = require("../config/rabbitmq.config");
// const logger = require("../utils/logger");
// const restaurantOrderService = require("../services/restaurantOrder.service");

// // Start consuming order_created events
// function startRestaurantOrderConsumer() {
//     consumeFromQueue("order_created", async (message) => {
//         logger.info(`Received order_created message: ${JSON.stringify(message)}`);

//         try {
//         const {
//             orderId,
//             restaurantId,
//             quantity,
//             customerId,
//             deliveryAddress,
//             totalAmount,
//         } = message;

//         if (
//             !orderId ||
//             !restaurantId ||
//             !quantity ||
//             !customerId ||
//             !deliveryAddress ||
//             totalAmount === undefined
//         ) {
//             logger.error("Invalid order_created message: Missing required fields");
//             return;
//         }

//         await restaurantOrderService.createRestaurantOrder({
//             orderId,
//             restaurantId,
//             quantity,
//             customerId,
//             deliveryAddress,
//             totalAmount,
//         });

//         logger.info(`Stored restaurant order ${orderId}`);
//         } catch (err) {
//         logger.error(`Failed to store restaurant order: ${err.message}`);
//         }
//     });
// }

// module.exports = { startRestaurantOrderConsumer };


const { consumeFromQueue } = require("../config/rabbitmq.config");
const restaurantOrderService = require("../services/restaurantOrder.service");
const logger = require("../utils/logger");

// Start consuming restaurant-related order events
function startRestaurantOrderConsumers() {
  // Consume order_created events
    consumeFromQueue("order_placed_restaurant", async (message) => {
        logger.info("message:", message);
        try {
        // Extract needed data from the message
        // const { orderId, userId, restaurantId, menuItemId, specialInstructions, deliveryAddress, quantity, totalAmount } = message;

        logger.info(`orderId: ${message.orderId}`);
        logger.info(`userId: ${message.userId}`);
        logger.info(`restaurantId: ${message.restaurantId}`);
        logger.info(`menuItemId: ${message.menuItemId}`);
        logger.info(`specialInstructions: ${message.specialInstructions}`);
        logger.info(`deliveryAddress: ${message.deliveryAddress}`);
        logger.info(`quantity: ${message.quantity}`);
        logger.info(`totalAmount: ${message.totalAmount}`);
        
        // Validate required fields
        if (!message.orderId || !message.userId || !message.restaurantId || !message.menuItemId || !message.specialInstructions || !message.deliveryAddress || !message.quantity || !message.totalAmount) {
            throw new Error("Missing required fields in order_placed_restaurant message");
        }

        // Sync the restaurant order with queue data
        await restaurantOrderService.syncRestaurantOrder({
            orderId: message.orderId,
            userId: message.userId,
            restaurantId: message.restaurantId,
            menuItemId: message.menuItemId,
            specialInstructions: message.specialInstructions,
            deliveryAddress: message.deliveryAddress,
            quantity: message.quantity,
            totalAmount: message.totalAmount,
            status: "received"
        });

        logger.info(`Order ${message.orderId} received by restaurant ${message.restaurantId} for customer ${message.userId} with quantity ${message.quantity} from menu: ${message.menuItemId}`);
        } catch (error) {
        logger.error(`Error processing order_placed_restaurant event for order ${message.orderId || "unknown"}: ${error.message}`);
        }
    });

    // Consume order_cancelled events
    consumeFromQueue("order_cancelled", async (message) => {
        try {
        // Extract needed data from the message
        // const { orderId, restaurantId, userId } = message;

        // Validate required fields
        if ( !message.orderId || !message.restaurantId || !message.userId) {
            throw new Error("Missing required fields in order_cancelled message");
        }

        // Update the restaurant order status
        await restaurantOrderService.updateRestaurantOrder(message.orderId, {
            status: "cancelled",
        });

        logger.info(`Order cancelled: ${message.orderId} and being informed by restaurant ${message.restaurantId} for customer ${message.userId}`);
        } catch (error) {
        logger.error(`Error processing order_cancelled event for order ${message.orderId || "unknown"}: ${error.message}`);
        }
    });


    consumeFromQueue("order_cancelled_restaurant", async (message) => {
        try {
        // Extract needed data from the message
        // const { orderId, restaurantId, userId } = message;

        // Validate required fields
        if ( !message.orderId || !message.restaurantId || !message.userId) {
            throw new Error("Missing required fields in order_cancelled_restaurant message");
        }

        // Update the restaurant order status
        await restaurantOrderService.updateRestaurantOrder(message.orderId, {
            status: "cancelled",
        });

        logger.info(`Order cancelled: ${message.orderId} and being informed by restaurant ${message.restaurantId} for customer ${message.userId}`);
        } catch (error) {
        logger.error(`Error processing order_cancelled_restaurant event for order ${message.orderId || "unknown"}: ${error.message}`);
        }
    });
}

module.exports = { startRestaurantOrderConsumers };