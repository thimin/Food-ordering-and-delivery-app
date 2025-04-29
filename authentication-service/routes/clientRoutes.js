import express from "express";
import { loginClient, registerClient, logoutClient } from "../controllers/clientController.js"; 
import { authMiddleware } from '../middleware/auth.js';
import { clientValidator } from "../middleware/roleValidator.js";

const clientRouter = express.Router();

clientRouter.post("/register", registerClient);
clientRouter.post("/login", loginClient);
clientRouter.post("/logout", authMiddleware, logoutClient);

export default clientRouter;
