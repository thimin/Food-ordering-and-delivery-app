import AuthService from '../services/auth.service.js';
import logger from '../utils/logger.js';

export const createOrder = async (req, res) => {
  const { orderId, token } = req.body;

  if (!orderId || !token) {
    logger.error('Missing token or orderId in request');
    return res.status(400).json({
      success: false,
      message: 'Token and Order ID are required',
    });
  }

  console.log("typeof token:", typeof token);
  console.log("token:", token);

  const tokenString = token.toString();
  console.log("typeof tokenString:", typeof tokenString);
  console.log("tokenString:", tokenString);

  try {

    const newOrder = await AuthService.createOrder({ orderId, token });

    logger.info(`Order created successfully: ${newOrder.orderId}`);

    return res.status(201).json({
      success: true,
      message: 'Order saved successfully',
      order: newOrder,
    });
  } catch (error) {
    logger.error(`Create order failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  const { orderId, token } = req.body;

  if (!orderId || !token) {
    logger.error('Missing token or orderId in request');
    return res.status(400).json({
      success: false,
      message: 'Token and Order ID are required',
    });
  }

  try {
    const newOrder = await AuthService.updateOrder({ orderId, token });

    logger.info(`Order updated successfully: ${newOrder.orderId}`);

    return res.status(201).json({
      success: true,
      message: 'Order saved successfully',
      order: newOrder,
    });
  } catch (error) {
    logger.error(`Update order failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating order',
      error: error.message,
    });
  }
};
