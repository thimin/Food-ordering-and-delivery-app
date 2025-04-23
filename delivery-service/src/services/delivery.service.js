const Delivery = require("../models/delivery.model");
const { publishToQueue } = require("../config/rabbitmq.config");
const logger = require("../utils/logger");

class DeliveryService {
  async assignDelivery(orderId, deliveryPersonId) {
    try {
      const delivery = new Delivery({
        orderId,
        deliveryPersonId,
        status: "assigned", 
      });

      await delivery.save();

      // Notify order service
      await publishToQueue("delivery_assigned", {
        orderId,
        deliveryPersonId,
        deliveryId: delivery._id,
      });

      return delivery;
    } catch (error) {
      logger.error(`Error assigning delivery: ${error.message}`);
      throw error;
    }
  }

  async updateDeliveryStatus(deliveryId, status) {
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

      const delivery = await Delivery.findByIdAndUpdate(
        deliveryId,
        {
          status,
          ...(status === "picked_up" && { pickupTime: new Date() }),
          ...(status === "delivered" && { deliveryTime: new Date() }),
        },
        { new: true }
      );

      // Notify other services
      await publishToQueue("delivery_status_updated", {
        deliveryId,
        orderId: delivery.orderId,
        status,
      });

      return delivery;
    } catch (error) {
      logger.error(`Error updating delivery status: ${error.message}`);
      throw error;
    }
  }

  async updateLocation(deliveryId, coordinates) {
    try {
      const [longitude, latitude] = coordinates;

      if (!longitude || !latitude) {
        throw new Error("Invalid coordinates");
      }

      const delivery = await Delivery.findByIdAndUpdate(
        deliveryId,
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
        deliveryId,
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
