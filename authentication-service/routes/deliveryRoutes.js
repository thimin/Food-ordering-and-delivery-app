import express from "express";
import { registerDelivery, loginDelivery, logoutDelivery } from "../controllers/deliveryController.js";
import { authMiddleware } from '../middleware/auth.js';
// import { deliveryValidator } from '../validators/roleValidator.js'; 

const deliveryRouter = express.Router();

deliveryRouter.post("/register", registerDelivery);
deliveryRouter.post("/login", loginDelivery);
deliveryRouter.post("/logout", authMiddleware, /* deliveryValidator, */ logoutDelivery);

export default deliveryRouter;
