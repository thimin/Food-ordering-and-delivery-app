const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    isAvailable: { type: Boolean, default: true },
    cuisines: [{ type: String }],             
    features: { type: String },               
    rating: { type: Number, min: 0, max: 5 },  
    hours: { type: String },                  
    meals: [{ type: String }],               
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
