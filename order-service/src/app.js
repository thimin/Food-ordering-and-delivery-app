const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectToRabbitMQ } = require("./config/rabbitmq.config");
const dbConfig = require("./config/db.config");
const orderRoutes = require("./routes/order.routes");
const { startOrderConsumers } = require("./consumers/order.consumer");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(dbConfig.url, dbConfig.options)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// RabbitMQ connection
connectToRabbitMQ()
  .then(() => {
    startOrderConsumers();
  })
  .catch((err) => {
    logger.error("Failed to connect to RabbitMQ:", err);
  });

// Routes
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Order Service running on port ${PORT}`);
});

module.exports = app;
