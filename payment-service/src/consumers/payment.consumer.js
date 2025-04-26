const { getChannel } = require('../config/rabbitmq.config');
const Payment = require('../models/Payment');
const stripe = require('../config/stripe');
const { sendPaymentNotification } = require('../services/payment.service');

const startPaymentConsumer = async () => {
  const channel = getChannel();

  if (!channel) {
    console.error('Channel not available');
    return;
  }

  await channel.consume("order_created", async (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("Received order for payment:", data);

    const { orderId, userId, totalAmount } = data;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: "usd",
        metadata: { orderId, userId },
      });

      const payment = new Payment({
        orderId,
        userId,
        totalAmount,
        status: "succeeded",
        stripePaymentIntentId: paymentIntent.id,
      });

      await payment.save();

      console.log("Payment succeeded for order:", orderId);

      // Send to notification queue
      await sendPaymentNotification({
        orderId,
        userId,
        totalAmount,
        status: "succeeded",
      });

      channel.ack(msg);
    } catch (err) {
      console.error("Payment failed:", err);
      await sendPaymentNotification({
        orderId,
        userId,
        totalAmount,
        status: "failed",
      });
      channel.ack(msg);
    }
  });
};

module.exports = startPaymentConsumer;
