const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const paymentRoutes = require('./routes/paymentRoutes');
const webhookHandler = require('./controllers/webhookController');
const { connectRabbitMQ } = require('./config/rabbitmq.config');
const startPaymentConsumer = require('./consumers/payment.consumer');

dotenv.config();
const app = express();

// Stripe Webhook needs raw body
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhookHandler);

// JSON body for others
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);

// Mongo & Server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    // Start RabbitMQ and consumers after DB is ready
    connectRabbitMQ().then(() => {
      startPaymentConsumer();
    });
  })
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
