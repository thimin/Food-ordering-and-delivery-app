const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, enum: ['order', 'delivery', 'payment'], required: true },
  message: { type: String, required: true },
  paymentStatus: { type: String,  enum: [
    'pending', 
    'succeeded', 
    'failed',
    'refunded'
  ], default: "pending" },
  orderStatus: { type: String, enum: [
    "confirmed",
    "placed",
    "preparing",
    "ready",
    "cancelled",
  ], default: "created" },
  deliveryStatus: { type: String, enum: [
    "assigned",
    "picked_up",
    "in_transit", 
    "delivered", 
    "cancelled"
  ], default: "assigned" },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
