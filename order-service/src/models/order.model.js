const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  specialInstructions: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema({
  userId: { type: String },
  restaurantId: { type: String, required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  status: {
    type: String,
    enum: [
      "created",
      "confirmed",
      "placed",
      "pending",
      "preparing",
      "ready",
      "out-for-delivery",
      "picked_up",
      "in_transit",
      "delivered",
      "cancelled",
    ],
    default: "created",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "succeeded", "failed", "refunded"],
    default: "pending",
  },
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  deliveryPersonId: { type: String },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  token: { type: String },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Order", orderSchema);
