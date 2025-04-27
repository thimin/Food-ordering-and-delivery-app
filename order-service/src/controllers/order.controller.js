const orderService = require("../services/order.service");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const logger = require("../utils/logger");

// Validation schemas
const createOrderSchema = Joi.object({
  userId: Joi.string(),
  restaurantId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        specialInstructions: Joi.string().allow(""),
      })
    )
    .min(1)
    .required(),
  deliveryAddress: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
    country: Joi.string(),
  }).required(),
  totalAmount: Joi.number().min(0).required(),
  deliveryFee: Joi.number().min(0).required(),
  taxAmount: Joi.number().min(0),
});

const updateOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        specialInstructions: Joi.string().allow(""),
      })
    )
    .min(1),
  deliveryAddress: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
    country: Joi.string(),
  }),
  status: Joi.string().valid(
    "created",
    "confirmed",
    "preparing",
    "ready",
    "picked_up",
    "delivered",
    "cancelled"
  ),
}).min(1);

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { error, value } = createOrderSchema.validate(req.body);
      const token  = req.headers.token;

      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Authentication token missing",
        });
      }

      value.token = token;
      
      if (error) {
        logger.warn(`Validation error: ${error.message}`);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: error.message,
        });
      }

      const order = await orderService.createOrder(value);
      res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
      logger.error(`Controller error in createOrder: ${error.message}`);
      next(error);
    }
  }

  async getOrder(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.status(StatusCodes.OK).json(order);
    } catch (error) {
      logger.error(`Controller error in getOrder: ${error.message}`);
      next(error);
    }
  }

  async updateOrder(req, res, next) {
    try {
      const { error, value } = updateOrderSchema.validate(req.body);
      if (error) {
        logger.warn(`Validation error: ${error.message}`);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: error.message,
        });
      }

      const order = await orderService.updateOrder(req.params.id, value);
      res.status(StatusCodes.OK).json(order);
    } catch (error) {
      logger.error(`Controller error in updateOrder: ${error.message}`);
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const order = await orderService.cancelOrder(req.params.id);
      res.status(StatusCodes.OK).json(order);
    } catch (error) {
      logger.error(`Controller error in cancelOrder: ${error.message}`);
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const orders = await orderService.getUserOrders(req.query.userId);
      res.status(StatusCodes.OK).json(orders);
    } catch (error) {
      logger.error(`Controller error in getUserOrders: ${error.message}`);
      next(error);
    }
  }

  async confirmOrder(req, res, next) {
    try {
      const order = await orderService.confirmOrder(req.params.id);
      res.status(StatusCodes.OK).json(order);
    } catch (error) {
      logger.error(`Controller error in confirmOrder: ${error.message}`);
      next(error);
    }
  }

  async getOrderStatus(req, res, next) {
    try {
      const status = await orderService.getOrderStatus(req.params.id);
      res.status(StatusCodes.OK).json(status);
    } catch (error) {
      logger.error(`Controller error in getOrderStatus: ${error.message}`);
      next(error);
    }
  }

  async getJwtToken(req, res, next) {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Authentication token missing",
        });
      }

      const order = await orderService.getJwtToken(req.params.id, token);
      res.status(StatusCodes.OK).json(order);
    } catch (error) {
      logger.error(`Controller error in getJwtToken: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new OrderController();
