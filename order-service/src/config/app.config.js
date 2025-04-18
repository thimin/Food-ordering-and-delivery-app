require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost",
  serviceName: "order-service",
};
