import { consumeFromQueue } from "../config/rabbitmq.config.js";
import authService from "../services/auth.service.js";
import logger from "../utils/logger.js";

// Start consuming payment processed events
export async function startAuthConsumer() {
  consumeFromQueue("order_created", async (message) => {
    
    try {
        console.log("typeof token:", typeof message.token);
        await authService.createOrder(message.orderId, message.token);
        logger.info(`Token for ${message.orderId} passed`);
      
      }
      catch (error) {
      logger.error(
        `Error processing the token for the OrderID: ${error.message}`
      );
    }
  });
}