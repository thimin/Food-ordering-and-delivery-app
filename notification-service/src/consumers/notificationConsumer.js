const { connectRabbitMQ } = require("../config/rabbitMQ");
const transporter = require("../config/mailConfig");
const Notification = require("../models/notificationModel");

const consumeNotifications = async () => {
  const channel = await connectRabbitMQ();

  if (!channel) {
    console.error("Cannot consume messages. Channel not available.");
    return;
  }

  const queueName = "notificationQueue";
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const payload = JSON.parse(msg.content.toString());
      console.log("📨 Received message:", payload);

      const { to, type, orderStatus, deliveryStatus, paymentStatus } = payload;

      let subject = "";
      let message = "";

      switch (type) {
        case "order":
          subject = `Order ${orderStatus}`;
          message = `Your order status has been updated to: ${orderStatus}`;
          break;
        case "delivery":
          subject = `Delivery ${deliveryStatus}`;
          message = `Your delivery status is now: ${deliveryStatus}`;
          break;
        case "payment":
          subject = `Payment ${paymentStatus}`;
          message = `Your payment status is: ${paymentStatus}`;
          break;
        default:
          subject = "Notification Update";
          message = "There's an update regarding your transaction.";
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to,
          subject,
          text: message,
        });

        await Notification.create({
          to,
          subject,
          message,
          type,
          orderStatus,
          deliveryStatus,
          paymentStatus,
        });

        channel.ack(msg);
        console.log("Email sent and notification saved");
      } catch (error) {
        console.error("Error sending email:", error.message);
        channel.nack(msg);
      }
    }
  });

  console.log(`Listening to RabbitMQ queue: ${queueName}`);
};

module.exports = consumeNotifications;
