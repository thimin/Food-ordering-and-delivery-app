const express = require('express');
const router = express.Router();
const { publishToQueue } = require('../config/rabbitmq.config');

// POST /test/order-created
router.post('/order-created', async (req, res) => {
  const {
    orderId,
    restaurantId,
    quantity,
    customerId,
    deliveryAddress,
    totalAmount,
  } = req.body;

  const orderData = {
    orderId,
    restaurantId,
    quantity,
    customerId,
    deliveryAddress,
    totalAmount,
  };

  try {
    await publishToQueue('order_created', orderData);
    res.status(200).json({ message: 'order_created message published successfully', orderData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to publish message to queue' });
  }
});

router.post('/order-confirmed', async (req, res) => {
    try {
      await publishToQueue("order_confirmed", req.body);
      res.status(200).json({ message: "order_confirmed message sent" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
