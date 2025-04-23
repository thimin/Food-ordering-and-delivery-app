const amqp = require('amqplib');

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');

    await channel.assertQueue('ORDER_PAYMENTS');
    await channel.assertQueue('PAYMENT_NOTIFICATIONS');
  } catch (err) {
    console.error('Failed to connect to RabbitMQ', err);
  }
};

const getChannel = () => channel;

module.exports = {
  connectRabbitMQ,
  getChannel,
};
