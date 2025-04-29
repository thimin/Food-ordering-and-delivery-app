import express from "express";
import {
    registerRestaurantAdmin,
    loginRestaurantAdmin,
    logoutRestaurantAdmin
} from "../controllers/restaurantController.js";
import { authMiddleware } from '../middleware/auth.js';

// import { restaurantValidator } from "../validators/roleValidator.js";

const restaurantRouter = express.Router();

restaurantRouter.post("/register", registerRestaurantAdmin);
restaurantRouter.post("/login", loginRestaurantAdmin);
restaurantRouter.post("/logout", authMiddleware, /*restaurantValidator,*/ logoutRestaurantAdmin);

export default restaurantRouter;
