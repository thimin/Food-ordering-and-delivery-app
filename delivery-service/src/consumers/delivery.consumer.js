const { consumeFromQueue } = require("../config/rabbitmq.config");
const deliveryService = require("../services/delivery.service");
const logger = require("../utils/logger");

function startDeliveryConsumers() {
  // Listen for new orders that need delivery
  consumeFromQueue("order_status_updated", async (message) => {
    try {
      if (message.newStatus === "confirmed") {
        await deliveryService.assignDelivery(message.orderId, {
          street: message.street,
          city: message.city,
          state: message.state,
          postalCode: message.postalCode,
        });
        logger.info(`Delivery assigned for order: ${message.orderId}`);
      }
    } catch (error) {
      logger.error(
        `Error processing order_ready_for_delivery event: ${error.message}`
      );
    }
  });

  // Listen for delivery person availability updates
  consumeFromQueue("delivery_person_available", async (message) => {
    try {
      logger.info(`Delivery person available: ${message.deliveryPersonId}`);
      // Could implement auto-assignment logic here
    } catch (error) {
      logger.error(
        `Error processing delivery_person_available event: ${error.message}`
      );
    }
  });
}

module.exports = { startDeliveryConsumers };
