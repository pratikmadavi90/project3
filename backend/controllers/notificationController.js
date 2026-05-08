const User = require("../models/User");
const { sendEmail, sendSMS } = require("../services/notificationService");

exports.sendNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    const users = await User.find();

    for (let user of users) {
      // EMAIL
      if (user.email) {
        await sendEmail(user.email, title, message);
      }

      // SMS
      if (user.phone) {
        await sendSMS(user.phone, message);
      }
    }

    res.json({ success: true, msg: "Notification Sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed" });
  }
};