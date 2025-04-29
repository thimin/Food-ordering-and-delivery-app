import jwt from 'jsonwebtoken';
import { Order } from "../models/authOrderModel.js";
import { Client } from "../models/userModel.js";
import { publishToQueue } from '../config/rabbitmq.config.js';
import logger from "../utils/logger.js";
import { Logger } from 'winston';
import { Delivery } from '../models/userModel.js';

class AuthService {
  async createOrder(orderId, token) {
    if (!orderId || !token) {
      throw new Error('Token and Order ID are required');
    }

    console.log("typeof token:", typeof token);
    console.log("token:", token);

    
    try {
      // Decode JWT token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Lookup client by user ID
      const client = await Client.findById(userId);
      if (!client) {
        throw new Error('Client not found');
      }

      // Find an available delivery personnel
      const availableDelivery = await Delivery.findOne({ isAvailable: true });
      if (!availableDelivery) {
        throw new Error('No delivery personnel available');
      }

      // Save order
      const newOrder = new Order({
        orderId,
        clientId: client.email,
      });

      await newOrder.save();

      // Update delivery personnel availability to false (now assigned)
      availableDelivery.isAvailable = false;
      await availableDelivery.save();

      // Publish to RabbitMQ queue
      await publishToQueue('auth_user_found', {
        orderId: newOrder.orderId,
        clientId: newOrder.clientId,
        deliveryAddress: client.deliveryAddress,
        deliveryPersonId: availableDelivery.email,
        createdAt: newOrder.createdAt,
      });

      logger.info('Order created and published to queue', {
        orderId: newOrder.orderId,
        clientId: newOrder.clientId,
        deliveryAddress: client.deliveryAddress,
        deliveryPersonId: availableDelivery.email,
        createdAt: newOrder.createdAt,
      });
      

      logger.info(`Auth order created and assigned to delivery person ${availableDelivery.name}: ${newOrder.orderId}`);

      return newOrder;
    } catch (error) {
      logger.error(`AuthService error: ${error.message}`);
      throw error;
    }
  }
}

export default new AuthService();
