const transporter = require("../config/mailConfig");
const Notification = require("../models/notificationModel");

const sendEmail = async (req, res) => {
  const {
    to,
    subject,
    message,
    type,              
    orderStatus,       
    paymentStatus,     
    deliveryStatus     
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Save the notification to the database
    await Notification.create({
      to,
      subject,
      message,
      type,
      orderStatus,
      paymentStatus,
      deliveryStatus,
    });

    res.status(200).json({ message: "Email sent and notification saved." });
  } catch (error) {
    console.error("Email failed: ", error.message);

    // Save failed notification
    await Notification.create({
      to,
      subject,
      message,
      type,
      orderStatus,
      paymentStatus,
      deliveryStatus
    });

    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendEmail };
