const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    categories: [{ type: String }],
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Menu', menuSchema);

