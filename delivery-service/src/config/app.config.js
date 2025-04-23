require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  serviceName: "delivery-service",
};
