const express = require('express');
const connectDB = require('./config/db.config');
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/images', express.static('uploads'));

app.get('/', (req, res) => res.send('Restaurant Service Running'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
