const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/notificationController");

router.post("/send", sendEmail);

module.exports = router;
