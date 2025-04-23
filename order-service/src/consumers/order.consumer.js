const { consumeFromQueue } = require("../config/rabbitmq.config");
const orderService = require("../services/order.service");
const logger = require("../utils/logger");

// Start consuming payment processed events
function startOrderConsumers() {
  consumeFromQueue("payment_processed", async (message) => {
    try {
      if (message.status === "succeeded") {
        await orderService.updateOrder(message.orderId, {
          paymentStatus: "completed",
          status: "confirmed",
          totalAmount: message.totalAmount,
          deliveryFee: message.deliveryFee,
        });
        logger.info(`Order ${message.orderId} confirmed after payment`);
      } else if (message.status === "failed") {
        await orderService.updateOrder(message.orderId, {
          paymentStatus: "failed",
          status: "cancelled",
        });
        logger.info(
          `Order ${message.orderId} cancelled due to payment failure`
        );
      }
    } catch (error) {
      logger.error(
        `Error processing payment_processed event: ${error.message}`
      );
    }
  });

  consumeFromQueue("restaurant_order_update", async (message) => {
    try {
      await orderService.updateOrder(message.orderId, {
        status: message.status,
      });
      logger.info(
        `Order ${message.orderId} status updated to ${message.status} by restaurant`
      );
    } catch (error) {
      logger.error(
        `Error processing restaurant_order_update event: ${error.message}`
      );
    }
  });

  consumeFromQueue("delivery_status_update", async (message) => {
    try {
      await orderService.updateOrder(message.orderId, {
        status: message.status,
        deliveryPersonId: message.deliveryPersonId,
        ...(message.status === "delivered" && {
          actualDeliveryTime: new Date(),
        }),
      });
      logger.info(
        `Order ${message.orderId} delivery status updated to ${message.status}`
      );
    } catch (error) {
      logger.error(
        `Error processing delivery_status_update event: ${error.message}`
      );
    }
  });
}

module.exports = { startOrderConsumers };
