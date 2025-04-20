const amqp = require("amqplib");
const logger = require("../utils/logger");

let connection;
let channel;

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(
      "amqp://localhost"
    );
    channel = await connection.createChannel();

    // Assert the exchanges we'll be using
    await channel.assertExchange("order_events", "topic", { durable: true });

    logger.info("Connected to RabbitMQ");
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
    throw error;
  }
}

async function publishToQueue(queueName, message) {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    logger.debug(
      `Message published to ${queueName}: ${JSON.stringify(message)}`
    );
  } catch (error) {
    logger.error(`Error publishing to ${queueName}: ${error.message}`);
    throw error;
  }
}

async function consumeFromQueue(queueName, callback) {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        logger.debug(
          `Message received from ${queueName}: ${JSON.stringify(message)}`
        );
        callback(message);
        channel.ack(msg);
      }
    });

    logger.info(`Started consuming from ${queueName}`);
  } catch (error) {
    logger.error(`Error consuming from ${queueName}: ${error.message}`);
    throw error;
  }
}

process.on("exit", () => {
  if (connection) connection.close();
});

module.exports = {
  connectToRabbitMQ,
  publishToQueue,
  consumeFromQueue,
};
