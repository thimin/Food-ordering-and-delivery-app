import jwt from 'jsonwebtoken';
import { Order } from "../models/authOrderModel.js";
import { Client } from "../models/userModel.js";
import { publishToQueue } from '../config/rabbitmq.config.js';
import logger from "../utils/logger.js";

class AuthService {
  async createOrder({ orderId, token }) {
    if (!orderId || !token) {
      throw new Error('Token and Order ID are required');
    }

    try {
      // Decode JWT token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Lookup client by user ID
      const client = await Client.findById(userId);
      if (!client) {
        throw new Error('Client not found');
      }

      // Save order
      const newOrder = new Order({
        orderId,
        clientId: client.email
      });

      await newOrder.save();

      // Publish to RabbitMQ queue
      await publishToQueue('auth_order_created', {
        orderId: newOrder.orderId,
        clientId: newOrder.clientId,
        createdAt: newOrder.createdAt,
      });

      logger.info(`Auth order created and pushed to queue: ${newOrder.orderId}`);

      return newOrder;
    } catch (error) {
      logger.error(`AuthService error: ${error.message}`);
      throw error;
    }
  }
}

export default new AuthService();
