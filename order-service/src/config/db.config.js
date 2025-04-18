require("dotenv").config();

module.exports = {
  url: process.env.MONGODB_URI || "mongodb://localhost:27017/order_service",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  },
};
