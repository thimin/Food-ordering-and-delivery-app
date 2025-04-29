const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const notificationRoutes = require("./routes/notificationRoutes");
const consumeNotifications = require("./consumers/notificationConsumer");

consumeNotifications(); // Start consuming messages

dotenv.config();
const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI) 
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
