const Order = require("../models/order.model");
const { publishToQueue } = require("../config/rabbitmq.config");
const logger = require("../utils/logger");

class OrderService {
  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      await order.save();

      // this.getJwtToken(order)
      logger.info(`JWT token ${order.token}`);

      // Publish order created event
      await publishToQueue("order_created", {
        orderId: order._id,
        restaurantId: order.restaurantId,
        menuItemId: order.items[0]?.menuItemId,
        quantity: order.items[0]?.quantity,
        specialInstructions: order.items[0]?.specialInstructions,
        totalAmount: order.totalAmount,
        token: order.token,
      });

      // await publishToQueue("notificationQueue", {
      //   type: "order",
      //   orderStatus: order.status,
      //   to: order.userId,
      // });

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
        await publishToQueue("order_status_updated", {
          orderId: order._id,
          newStatus: order.status,
          userId: order.userId,
          restaurantId: order.restaurantId,
        });

        if(["confirmed", "placed", "pending", "preparing", "ready", "out-for-delivery", "cancelled"].includes(updateData.status)) { 
          await publishToQueue("notificationQueue", {
            type: "order",
            orderStatus: order.status,
            to: order.userId,
          });
        }

        if(updateData.status === "placed") {
          await publishToQueue("order_placed", {
            orderId: order._id,
            newStatus: order.status,
            restaurantId: order.restaurantId,
            userId: order.userId,
            menuItemId: order.items[0]?.menuItemId,
            quantity: order.items[0]?.quantity,
            specialInstructions: order.items[0]?.specialInstructions,
            deliveryAddress: order.deliveryAddress,
            deliveryPersonId: order.deliveryPersonId,
          });

          await publishToQueue("order_placed_restaurant", {
            orderId: order._id,
            newStatus: order.status,
            totalAmount: order.totalAmount,
            restaurantId: order.restaurantId,
            userId: order.userId,
            menuItemId: order.items[0]?.menuItemId,
            quantity: order.items[0]?.quantity,
            specialInstructions: order.items[0]?.specialInstructions,
            deliveryAddress: order.deliveryAddress,
            deliveryPersonId: order.deliveryPersonId,
          });
          logger.info(`Informed delivey and restaurant services about order: ${orderId}`);
        }

        if(updateData.status === "cancelled") {
          await publishToQueue("order_cancelled_restaurant", {
            orderId: order._id,
            newStatus: order.status,
            restaurantId: order.restaurantId,
            userId: order.userId,
            menuItemId: order.items[0]?.menuItemId,
            quantity: order.items[0]?.quantity,
            specialInstructions: order.items[0]?.specialInstructions,
            deliveryAddress: order.deliveryAddress,
            deliveryPersonId: order.deliveryPersonId,
          });

          await publishToQueue("order_cancelled_delivery", {
            orderId: order._id,
            newStatus: order.status,
            restaurantId: order.restaurantId,
            userId: order.userId,
            menuItemId: order.items[0]?.menuItemId,
            quantity: order.items[0]?.quantity,
            specialInstructions: order.items[0]?.specialInstructions,
            deliveryAddress: order.deliveryAddress,
            deliveryPersonId: order.deliveryPersonId,
          });
          logger.info(`Informed restaurant and delivery services about cancelled order: ${orderId}`);
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

      await publishToQueue("order_cancelled_delivery2", {
        orderId: order._id,
        userId: order.userId,
        newStatus: order.status,
        restaurantId: order.restaurantId,
        totalAmount: order.totalAmount,
      });

      await publishToQueue("notificationQueue", {
        type: "order",
        orderStatus: order.status,
        to: order.userId,
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
        menuItemId: order.items.menuItemId,
        quantity: order.items.quantity,
        specialInstructions: order.items.specialInstructions,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        deliveryPersonId: order.deliveryPersonId,
        deliveryFee: order.deliveryFee,
      });

      await publishToQueue("notificationQueue", {
        type: "order",
        orderStatus: order.status,
        to: order.userId,
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

  async getJwtToken(orderId, token) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: { token: token } },
        { new: true }
      );
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      logger.error(
        `Error getting JWT token for order ${orderId}: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = new OrderService();
