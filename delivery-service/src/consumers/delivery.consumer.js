const { consumeFromQueue } = require("../config/rabbitmq.config");
const deliveryService = require("../services/delivery.service");
const logger = require("../utils/logger");

function startDeliveryConsumers() {
  // Listen for new orders that need delivery
  consumeFromQueue("order_placed", async (message) => {
    try {
      if (message.newStatus === "placed") {
        await deliveryService.assignDelivery(
          message.orderId,
          message.deliveryPersonId,
          message.deliveryAddress,
          message.userId,
        );
        logger.info(`Delivery assigned for order: ${message.orderId}`);
      }
    } catch (error) {
      logger.error(
        `Error processing order_ready_for_delivery event: ${error.message}`
      );
    }
  });

  consumeFromQueue("order_cancelled_delivery", async (message) => {
    try {
      // Extract needed data from the message
      // const { orderId, restaurantId, userId, newStatus } = message;

      // Validate required fields
      if (!message.orderId || !message.restaurantId || !message.userId || !message.newStatus) {
        throw new Error("Missing required fields in order_cancelled_delivery message");
      }

      // Update the restaurant order status
      await deliveryService.updateDeliveryStatus(message.orderId, message.newStatus);

      logger.info(
        `Order cancelled: ${message.orderId} and being informed to delivery person`
      );
    } catch (error) {
      logger.error(
        `Error processing order_cancelled_delivery event for order ${
          message.orderId || "unknown"
        }: ${error.message}`
      );
    }
  });

  consumeFromQueue("order_cancelled_delivery2", async (message) => {
    try {
      // Extract needed data from the message
      // const { orderId, restaurantId, userId, newStatus } = message;

      // Validate required fields
      if (!message.orderId || !message.restaurantId || !message.userId || !message.newStatus) {
        throw new Error("Missing required fields in order_cancelled_delivery2 message");
      }

      // Update the restaurant order status
      await deliveryService.updateDeliveryStatus(message.orderId, message.newStatus);

      logger.info(
        `Order cancelled: ${message.orderId} and being informed to delivery person`
      );
    } catch (error) {
      logger.error(
        `Error processing order_cancelled_delivery2 event for order ${
          message.orderId || "unknown"
        }: ${error.message}`
      );
    }
  });

  // Listen for delivery person availability updates
  // consumeFromQueue("delivery_person_available", async (message) => {
  //   try {
  //     logger.info(`Delivery person available: ${message.deliveryPersonId}`);
  //     // Could implement auto-assignment logic here
  //   } catch (error) {
  //     logger.error(
  //       `Error processing delivery_person_available event: ${error.message}`
  //     );
  //   }
  // });
}

module.exports = { startDeliveryConsumers };
