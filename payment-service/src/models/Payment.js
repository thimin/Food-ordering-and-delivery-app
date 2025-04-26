const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed','refunded'],
    default: 'pending',
  },
  stripePaymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
