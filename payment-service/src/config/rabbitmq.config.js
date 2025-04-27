const amqp = require('amqplib');

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');

    await channel.assertQueue("order_confirmed");
    await channel.assertQueue("payment_processed");
    await channel.assertQueue("notificationQueue");
  } catch (err) {
    console.error('Failed to connect to RabbitMQ', err);
  }
};

const getChannel = () => channel;

module.exports = {
  connectRabbitMQ,
  getChannel,
};
