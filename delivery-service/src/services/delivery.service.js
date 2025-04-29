const Delivery = require("../models/delivery.model");
const { publishToQueue } = require("../config/rabbitmq.config");
const logger = require("../utils/logger");

class DeliveryService {
  async assignDelivery(orderId, deliveryPersonId, deliveryAddress, userId) {
    try {
      const delivery = new Delivery({
        orderId,
        deliveryPersonId,
        deliveryAddress,
        userId,
        status: "assigned", 
      });

      await delivery.save();

      // Notify order service
      await publishToQueue("notificationQueue", {
        orderId,
        type: "delivery",
        deliveryPersonId,
        deliveryAddress,
        to: delivery.userId,
        deliveryStatus: delivery.status,
        deliveryId: delivery._id,
      });

      return delivery;
    } catch (error) {
      logger.error(`Error assigning delivery: ${error.message}`);
      throw error;
    }
  }

  async updateDeliveryStatus(orderId, status) {
    try {
      const validStatuses = [
        "assigned",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid delivery status");
      }

      const delivery = await Delivery.findOneAndUpdate(
        {orderId},
        {
          status,
          ...(status === "picked_up" && { pickupTime: new Date() }),
          ...(status === "delivered" && { deliveryTime: new Date() }),
        },
        { new: true }
      );

      if (!delivery) {
        throw new Error(`Delivery not found for orderId: ${orderId}`);
      }

      // Notify other services
      await publishToQueue("notificationQueue", {
        type: "delivery",
        orderId: delivery.orderId,
        deliveryStatus: status,
        to: delivery.userId,
      });

      return delivery;
    } catch (error) {
      logger.error(`Error updating delivery status: ${error.message}`);
      throw error;
    }
  }

  async updateLocation(orderId, coordinates) {
    try {
      const [longitude, latitude] = coordinates;

      if (!longitude || !latitude) {
        throw new Error("Invalid coordinates");
      }

      const delivery = await Delivery.findByIdAndUpdate(
        orderId,
        {
          currentLocation: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
        { new: true }
      );

      // Notify other services
      await publishToQueue("delivery_location_updated", {
        orderId: delivery.orderId,
        coordinates,
      });

      return delivery;
    } catch (error) {
      logger.error(`Error updating delivery location: ${error.message}`);
      throw error;
    }
  }

  async getAvailableDeliveries() {
    try {
      return await Delivery.find({ status: { $in: ["assigned", "picked_up"] } })
        .populate("orderId")
        .populate("deliveryPersonId");
    } catch (error) {
      logger.error(`Error fetching available deliveries: ${error.message}`);
      throw error;
    }
  }

  async getDeliveryPersonDeliveries(deliveryPersonId) {
    try {
      return await Delivery.find({ deliveryPersonId })
        .populate("orderId")
        .sort({ createdAt: -1 });
    } catch (error) {
      logger.error(
        `Error fetching delivery person deliveries: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = new DeliveryService();
