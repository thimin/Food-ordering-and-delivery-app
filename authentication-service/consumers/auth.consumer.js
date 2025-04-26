import { consumeFromQueue } from "../config/rabbitmq.config.js";
import authService from "../services/auth.service.js";
import logger from "../utils/logger.js";

// Start consuming payment processed events
export async function startAuthConsumer() {
  consumeFromQueue("order_created", async (message) => {
    try {
      
        await authService.createOrder(message.orderId, {
          token: message.token,
          orderId: message.orderId
        });
        logger.info(`Token for ${message.orderId} passed`);
      
      }
      catch (error) {
      logger.error(
        `Error processing the token for the OrderID: ${error.message}`
      );
    }
  });
}