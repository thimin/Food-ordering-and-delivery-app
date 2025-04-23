const Order = require("../models/order.model");
const { publishToQueue } = require("../config/rabbitmq.config");
const logger = require("../utils/logger");

class OrderService {
  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      await order.save();

      // Publish order created event
      await publishToQueue("order_created", {
        orderId: order._id,
        userId: order.userId,
        restaurantId: order.restaurantId,
        menuItemId: order.items.menuItemId,
        name: order.items.name,
        quantity: order.items.quantity,
        price: order.items.price,
        specialInstructions: order.items.specialInstructions,
        deliveryPersonId: order.deliveryPersonId,
      });

      logger.info(`Order created: ${order._id}`);
      return order;
    } catch (error) {
      logger.error(`Error creating order: ${error.message}`);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      logger.error(`Error fetching order ${orderId}: ${error.message}`);
      throw error;
    }
  }

  async updateOrder(orderId, updateData) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true }
      );

      if (!order) {
        throw new Error("Order not found");
      }

      // Publish order updated event if status changed
      if (updateData.status) {
        if (updateData.satus === "confirmed") {
          await publishToQueue("order_status_updated", {
            orderId: order._id,
            newStatus: order.status,
            userId: order.userId,
            restaurantId: order.restaurantId,
            state: order.deliveryAddress.state,
            street: order.deliveryAddress.street,
            city: order.deliveryAddress.city,
            postalCode: order.deliveryAddress.postalCode,
            deliveryPersonId: order.deliveryPersonId,
            deliveryFee: order.deliveryFee,
          });
        }
      }

      logger.info(`Order updated: ${orderId}`);
      return order;
    } catch (error) {
      logger.error(`Error updating order ${orderId}: ${error.message}`);
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: { status: "cancelled", updatedAt: Date.now() } },
        { new: true }
      );

      if (!order) {
        throw new Error("Order not found");
      }

      // Publish order cancelled event
      await publishToQueue("order_cancelled", {
        orderId: order._id,
        userId: order.userId,
        restaurantId: order.restaurantId,
        totalAmount: order.totalAmount,
      });

      logger.info(`Order cancelled: ${orderId}`);
      return order;
    } catch (error) {
      logger.error(`Error cancelling order ${orderId}: ${error.message}`);
      throw error;
    }
  }

  async getUserOrders(userId) {
    try {
      const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);
      return orders;
    } catch (error) {
      logger.error(
        `Error fetching orders for user ${userId}: ${error.message}`
      );
      throw error;
    }
  }

  async confirmOrder(orderId) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: { status: "confirmed", updatedAt: Date.now() } },
        { new: true }
      );

      if (!order) {
        throw new Error("Order not found");
      }

      // Publish order confirmed event
      await publishToQueue("order_confirmed", {
        orderId: order._id,
        userId: order.userId,
        restaurantId: order.restaurantId,
        totalAmount: order.totalAmount,
      });

      logger.info(`Order confirmed: ${orderId}`);
      return order;
    } catch (error) {
      logger.error(`Error confirming order ${orderId}: ${error.message}`);
      throw error;
    }
  }

  async getOrderStatus(orderId) {
    try {
      const order = await Order.findById(orderId).select("status");
      if (!order) {
        throw new Error("Order not found");
      }
      return { status: order.status };
    } catch (error) {
      logger.error(
        `Error getting status for order ${orderId}: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = new OrderService();
