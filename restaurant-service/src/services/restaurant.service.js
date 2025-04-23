// const Restaurant = require("../models/restaurant.model");
// const { publishToQueue } = require("../config/rabbitmq.config");
// const logger = require("../utils/logger");

// class RestaurantService {
//   async confirmOrderFromRestaurant(orderId, restaurantId) {
//     logger.info(`Confirming order ${orderId} by restaurant ${restaurantId}`);

//     await publishToQueue("restaurant_order_update", {
//       orderId,
//       status: "confirmed",
//       restaurantId,
//     });
//   }

//   async cancelOrderFromRestaurant(orderId, restaurantId) {
//     logger.info(`Cancelling order ${orderId} by restaurant ${restaurantId}`);

//     await publishToQueue("restaurant_order_update", {
//       orderId,
//       status: "cancelled",
//       restaurantId,
//     });
//   }

//   // Add CRUD methods if needed
//   //update order from restaurant
// //   async updateOrderFromRestaurant(orderId, restaurantId) {
// //     logger.info(`Updating order ${orderId} by restaurant ${restaurantId}`);

// //     await publishToQueue("restaurant_order_update", {
// //       orderId,
// //       status: "updated",
// //       restaurantId,
// //     });
// //   }
// }

// module.exports = new RestaurantService();
