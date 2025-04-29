const express = require('express');
const connectDB = require('./config/db.config');
require('dotenv').config();

const { connectRabbitMQ } = require('./config/rabbitmq.config');
// const { startRestaurantConsumers } = require('./consumers/restaurant.consumer');
const restaurantOrderRoutes = require('./routes/restaurantOrder.routes'); 
const { startRestaurantOrderConsumers } = require('./consumers/restaurantOrder.consumer');
const testRoutes = require("./routes/test.route");

const app = express();
app.use(express.json());

connectDB();

const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/restaurant-orders', restaurantOrderRoutes);
app.use("/test", testRoutes);
app.use('/images', express.static('uploads'));

app.get('/', (req, res) => res.send('Restaurant Service Running'));

const PORT = process.env.PORT || 6001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await connectRabbitMQ();
    //startRestaurantConsumers();
    startRestaurantOrderConsumers();
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
});
