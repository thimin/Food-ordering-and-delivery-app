const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  specialInstructions: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: {
    type: String,
    enum: [
      "created",
      "confirmed",
      "preparing",
      "ready",
      "picked_up",
      "delivered",
      "cancelled",
    ],
    default: "created",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  deliveryPersonId: { type: mongoose.Schema.Types.ObjectId },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Order", orderSchema);
