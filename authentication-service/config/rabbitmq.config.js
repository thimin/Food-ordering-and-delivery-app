import amqp from "amqplib";
import logger from "../utils/logger.js";

let connection;
let channel;

export async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertExchange("auth_events", "topic", { durable: true });

    logger.info("Connected to RabbitMQ");
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
    throw error;
  }
}

export async function publishToQueue(queueName, message) {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    logger.debug(`Message published to ${queueName}: ${JSON.stringify(message)}`);
  } catch (error) {
    logger.error(`Error publishing to ${queueName}: ${error.message}`);
    throw error;
  }
}

export async function consumeFromQueue(queueName, callback) {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        logger.debug(`Message received from ${queueName}: ${JSON.stringify(message)}`);
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

// Graceful shutdown
process.on("exit", () => {
  if (connection) connection.close();
});
