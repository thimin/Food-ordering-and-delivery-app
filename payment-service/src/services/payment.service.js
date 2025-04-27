const { getChannel } = require('../config/rabbitmq.config');

const sendPaymentNotification = async (data) => {
  const channel = getChannel();
  if (!channel) {
    console.error('RabbitMQ channel not available for sending notifications');
    return;
  }

  channel.sendToQueue('notificationQueue', Buffer.from(JSON.stringify(data)));
  console.log('Sent payment status to notification service:', data);
};

const sendPaymentOrder = async (data) => {
  const channel = getChannel();
  if (!channel) {
    console.error("RabbitMQ channel not available for sending notifications");
    return;
  }

  channel.sendToQueue("payment_processed", Buffer.from(JSON.stringify(data)));
  console.log("Sent payment status to order service:", data);
};

module.exports = {
  sendPaymentNotification,
  sendPaymentOrder,
};
