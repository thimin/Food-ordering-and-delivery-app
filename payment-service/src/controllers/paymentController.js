const stripe = require('../config/stripe');
const Payment = require('../models/Payment');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId, userId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: 'usd',
      metadata: { orderId, userId },
    });

    const payment = new Payment({
      orderId,
      userId,
      amount,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
    });

    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment initiation failed', error });
  }
};
