require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectToRabbitMQ } = require("./config/rabbitmq.config");
const dbConfig = require("./config/db.config");
const deliveryRoutes = require("./routes/delivery.routes");
const { startDeliveryConsumers } = require("./consumers/delivery.consumer");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    logger.info("MongoDB connected successfully");

    // Create indexes after connection
    mongoose.connection.once("open", () => {
      mongoose.model("Delivery").createIndexes();
    });
  } catch (err) {
    logger.error("MongoDB connection error:", err.message);
    logger.info("Retrying MongoDB connection in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectWithRetry();
  }
};

connectWithRetry();

// RabbitMQ connection
connectToRabbitMQ()
  .then(() => {
    startDeliveryConsumers();
    logger.info("RabbitMQ consumers started");
  })
  .catch((err) => {
    logger.error("Failed to initialize RabbitMQ:", err.message);
  });

// Routes
app.use("/api/deliveries", deliveryRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  const status = {
    status: "UP",
    dbState:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    rabbitMQ: !!channel ? "connected" : "disconnected",
  };
  res.status(200).json(status);
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
    if (connection) await connection.close();
    logger.info("RabbitMQ connection closed");
    process.exit(0);
  } catch (err) {
    logger.error("Error during shutdown:", err);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Delivery Service running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;
