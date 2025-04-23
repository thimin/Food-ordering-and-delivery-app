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
    consumeFromQueue("order_created", async (message) => {
        try {
        // Extract needed data from the message
        const { orderId, restaurantId, customerId, deliveryAddress, quantity, totalAmount } = message;

        // Validate required fields
        if (!orderId || !restaurantId || !customerId || !deliveryAddress || !quantity || !totalAmount) {
            throw new Error("Missing required fields in order_created message");
        }

        // Sync the restaurant order with queue data
        await restaurantOrderService.syncRestaurantOrder({
            orderId,
            restaurantId,
            customerId,
            deliveryAddress,
            quantity,
            totalAmount,
            status: "received"
        });

        logger.info(`Order ${orderId} received by restaurant ${restaurantId} for customer ${customerId} with quantity ${quantity}`);
        } catch (error) {
        logger.error(`Error processing order_created event for order ${message.orderId || "unknown"}: ${error.message}`);
        }
    });

    // Consume order_confirmed events
    consumeFromQueue("order_confirmed", async (message) => {
        try {
        // Extract needed data from the message
        const { orderId, restaurantId, customerId, totalAmount } = message;

        // Validate required fields
        if (!orderId || !restaurantId || !customerId || !totalAmount) {
            throw new Error("Missing required fields in order_confirmed message");
        }

        // Update the restaurant order status
        await restaurantOrderService.updateRestaurantOrder(orderId, {
            status: "preparing"
        });

        logger.info(`Order ${orderId} confirmed and being prepared by restaurant ${restaurantId} for customer ${customerId}`);
        } catch (error) {
        logger.error(`Error processing order_confirmed event for order ${message.orderId || "unknown"}: ${error.message}`);
        }
    });
}

module.exports = { startRestaurantOrderConsumers };