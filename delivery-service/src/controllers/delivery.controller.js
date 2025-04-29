const deliveryService = require("../services/delivery.service");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utils/logger");

class DeliveryController {
  async assignDelivery(req, res, next) {
    try {
      const { orderId, deliveryPersonId, deliveryAddress, userId } = req.body;

      if (!orderId || !deliveryPersonId || !deliveryAddress || !userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "orderId, deliveryPersonId and deliveryAddress are required",
        });
      }

      const delivery = await deliveryService.assignDelivery(
        orderId,
        deliveryPersonId,
        deliveryAddress,
        userId
      );
      res.status(StatusCodes.CREATED).json(delivery);
    } catch (error) {
      logger.error(`Controller error in assignDelivery: ${error.message}`);
      next(error);
    }
  }

  async updateDeliveryStatus(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!status) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "status is required",
        });
      }

      const delivery = await deliveryService.updateDeliveryStatus(id, status);
      res.status(StatusCodes.OK).json(delivery);
    } catch (error) {
      logger.error(`Controller error in updateStatus: ${error.message}`);
      next(error);
    }
  }

  async updateLocation(req, res, next) {
    try {
      const { longitude, latitude } = req.body;
      const { id } = req.params;

      if (!longitude || !latitude) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "longitude and latitude are required",
        });
      }

      const delivery = await deliveryService.updateLocation(id, [
        longitude,
        latitude,
      ]);
      res.status(StatusCodes.OK).json(delivery);
    } catch (error) {
      logger.error(`Controller error in updateLocation: ${error.message}`);
      next(error);
    }
  }

  async getAvailableDeliveries(req, res, next) {
    try {
      const deliveries = await deliveryService.getAvailableDeliveries();
      res.status(StatusCodes.OK).json(deliveries);
    } catch (error) {
      logger.error(
        `Controller error in getAvailableDeliveries: ${error.message}`
      );
      next(error);
    }
  }

  async getDeliveryPersonDeliveries(req, res, next) {
    try {
      const { deliveryPersonId } = req.params;
      const deliveries = await deliveryService.getDeliveryPersonDeliveries(
        deliveryPersonId
      );
      res.status(StatusCodes.OK).json(deliveries);
    } catch (error) {
      logger.error(
        `Controller error in getDeliveryPersonDeliveries: ${error.message}`
      );
      next(error);
    }
  }
}



module.exports = new DeliveryController();
