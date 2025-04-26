import mongoose from 'mongoose';

const options = { discriminatorKey: 'role', timestamps: true };

// Base User schema
const baseUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
}, options);

// Base model
const User = mongoose.model('User', baseUserSchema);

// Client (Customer)
const Client = User.discriminator('client', new mongoose.Schema({
  // cartData: { type: Object, default: {} }
}));

// Delivery Personnel
const Delivery = User.discriminator('delivery', new mongoose.Schema({
  vehicle_type: { type: String },
  isAvailable: { type: Boolean, default: true }
}));

// Restaurant Admin
const RestaurantAdmin = User.discriminator('restaurant', new mongoose.Schema({
  restaurant_ID: { type: String },
  restaurant_name: { type: String }
}));

// Super Admin
const SuperAdmin = User.discriminator('superadmin', new mongoose.Schema({
  accessLevel: { type: String, default: 'full' },
  permissions: {
    manageUsers: { type: Boolean, default: true },
    manageRestaurants: { type: Boolean, default: true },
    viewReports: { type: Boolean, default: true },
    manageDeliveries: { type: Boolean, default: true }
  },
  lastLogin: { type: Date },
  systemNotes: { type: String }
}));

export {
  User,
  Client,
  Delivery,
  RestaurantAdmin,
  SuperAdmin
};
