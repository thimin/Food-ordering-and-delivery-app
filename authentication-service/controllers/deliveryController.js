import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { Delivery } from "../models/userModel.js";

// Create token for delivery personnel
const createToken = (id) => {
  return jwt.sign({ id, role: 'delivery' }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register Delivery Personnel
const registerDelivery = async (req, res) => {
  const { name, email, password, phone, vehicle_type } = req.body;

  try {
    const exists = await Delivery.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Delivery personnel already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDelivery = new Delivery({ name, email, password: hashedPassword, phone, vehicle_type });
    const delivery = await newDelivery.save();

    const token = createToken(delivery._id);
    res.json({ success: true, token, delivery });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error during registration" });
  }
};

// Login Delivery Personnel
const loginDelivery = async (req, res) => {
  const { email, password } = req.body;

  try {
    const delivery = await Delivery.findOne({ email });

    if (!delivery) {
      return res.json({ success: false, message: "Delivery personnel not found" });
    }

    const isMatch = await bcrypt.compare(password, delivery.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = createToken(delivery._id);
    res.json({ success: true, token, delivery });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error during login" });
  }
};

// Logout Delivery Personnel
const logoutDelivery = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error during logout" });
  }
};

export {
  registerDelivery,
  loginDelivery,
  logoutDelivery
};
