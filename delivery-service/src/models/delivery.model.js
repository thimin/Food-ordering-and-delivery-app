const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    ref: "Order",
    required: true,
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  pickupTime: { type: Date },
  deliveryTime: { type: Date },
  deliveryFee: { type: Number, required: true },
  status: {
    type: String,
    enum: ["assigned", "picked_up", "in_transit", "delivered", "cancelled"],
    default: "assigned",
  },
  currentLocation: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number], // [longitude, latitude]
  },
  estimatedDuration: { type: Number }, // in minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for geospatial queries
deliverySchema.index({ currentLocation: "2dsphere" });

deliverySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Delivery", deliverySchema);
