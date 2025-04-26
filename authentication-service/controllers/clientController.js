import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { Client } from "../models/userModel.js";

// Create token with id, email, and role
const createToken = (id, email) => {
    return jwt.sign({ id, email, role: 'client' }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login client
const loginClient = async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await Client.findOne({ email });

        if (!client) {
            return res.json({ success: false, message: "Client does not exist" });
        }

        const isMatch = await bcrypt.compare(password, client.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(client._id, client.email);
        res.json({ success: true, token, client });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error during login" });
    }
};

// Logout client
const logoutClient = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error during logout" });
    }
};

// Register client
const registerClient = async (req, res) => {
    const { name, email, password, phone, deliveryAddress } = req.body;

    try {
        // Check if client already exists
        const exists = await Client.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Client already exists" });
        }

        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newClient = new Client({
            name,
            email,
            password: hashedPassword,
            phone,
            deliveryAddress,
            role: 'client'
          });
        
        const client = await newClient.save();

        const token = createToken(client._id, client.email);
        res.json({ success: true, token, client });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error during registration" });
    }
};

export { loginClient, registerClient, logoutClient };
