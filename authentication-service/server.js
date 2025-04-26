import express  from "express";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import 'dotenv/config';
import clientRouter from "./routes/clientRoutes.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { startAuthConsumer } from "./consumers/auth.consumer.js";
import { connectToRabbitMQ } from "./config/rabbitmq.config.js";
import logger from "./utils/logger.js";


// app config
const app = express()
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json())
app.use(cors())

// db connection
connectDB()

// RabbitMQ connection
connectToRabbitMQ()
  .then(() => {
    startAuthConsumer();
  })
  .catch((err) => {
    logger.error("Failed to connect to RabbitMQ:", err);
  });

// api endpoints
app.use("/api/client", clientRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/restaurant", restaurantRouter);

app.use("/api/order", orderRouter);


app.get("/", (req, res) => {
    res.send("Authentication service is up and running")
  });

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))