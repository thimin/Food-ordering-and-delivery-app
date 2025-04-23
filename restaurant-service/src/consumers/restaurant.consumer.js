// const { consumeFromQueue } = require("../config/rabbitmq.config");
// const logger = require("../utils/logger");

// function startRestaurantConsumers() {
//   consumeFromQueue("order_created", async (message) => {
//     logger.info(`New order created received by restaurant: ${JSON.stringify(message)}`);
//     // You can add logic to fetch menu, prepare meals, etc.
//     //orderid, restaurantid, quantity, customer id, delivery address
//   });
// }

// module.exports = { startRestaurantConsumers };
