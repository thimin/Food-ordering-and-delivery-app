const mongoose = require("mongoose");

const restaurantOrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true }, 
    status: { 
        type: String, 
        enum: [
            "received",
            "pending",
            "preparing",
            "ready",
            "out-for-delivery",
            "picked-up",
        ], 
        default: "pending"
    },
    quantity: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("RestaurantOrder", restaurantOrderSchema);
