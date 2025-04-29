import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { RestaurantAdmin } from "../models/userModel.js";

// Create token for restaurant admin
const createToken = (id) => {
    return jwt.sign({ id, role: 'restaurant' }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register Restaurant Admin
const registerRestaurantAdmin = async (req, res) => {
    const { name, email, password, phone, restaurant_ID, restaurant_name } = req.body;

    try {
        const exists = await RestaurantAdmin.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Restaurant admin already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new RestaurantAdmin({
            name,
            email,
            password: hashedPassword,
            phone,
            restaurant_ID,
            restaurant_name
        });

        const savedAdmin = await newAdmin.save();
        const token = createToken(savedAdmin._id);

        res.json({ success: true, token, restaurant: savedAdmin });
    } catch (error) {
        console.error("Register error:", error);
        res.json({ success: false, message: "Error during registration" });
    }
};

// Login Restaurant Admin
const loginRestaurantAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const restaurant = await RestaurantAdmin.findOne({ email });
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant admin not found" });
        }

        const isMatch = await bcrypt.compare(password, restaurant.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(restaurant._id);
        res.json({ success: true, token, restaurant });
    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, message: "Error during login" });
    }
};

// Logout Restaurant Admin
const logoutRestaurantAdmin = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.json({ success: false, message: "Error during logout" });
    }
};

export {
    registerRestaurantAdmin,
    loginRestaurantAdmin,
    logoutRestaurantAdmin
};
