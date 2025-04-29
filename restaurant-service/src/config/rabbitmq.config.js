const amqp = require("amqplib");
let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  console.log("Connected to RabbitMQ");
}

async function publishToQueue(queueName, message) {
  if (!channel) throw new Error("Channel not initialized");
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
}

async function consumeFromQueue(queueName, handler) {
  if (!channel) throw new Error("Channel not initialized");
  await channel.assertQueue(queueName);
  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      await handler(data);
      channel.ack(msg);
    }
  });
}

module.exports = { connectRabbitMQ, publishToQueue, consumeFromQueue };
