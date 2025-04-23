// const mongoose = require('mongoose');

// const restaurantOrderSchema = new mongoose.Schema({ orderId: { type: String, required: true, unique: true }, restaurantId: { type: String, required: true }, customerId: { type: String, required: true }, quantity: { type: Number, required: true }, deliveryAddress: { type: String, required: true }, totalAmount: { type: Number, required: true }, status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'preparing', 'ready'], default: 'pending', }, }, { timestamps: true });

// module.exports = mongoose.model('RestaurantOrder', restaurantOrderSchema);


const mongoose = require("mongoose");

const restaurantOrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    quantity: { type: Number, required: true },
    customerId: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    totalAmount: { type: Number, required: true }, 
    status: { type: String, default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("RestaurantOrder", restaurantOrderSchema);
