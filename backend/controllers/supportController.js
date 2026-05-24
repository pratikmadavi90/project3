const Support = require("../models/Support");

exports.createTicket = async (req, res) => {
  try {
    const { userId, subject, message } = req.body;

    const ticket = await Support.create({
      userId,
      subject,
      message
    });

    res.json(ticket);

  } catch(err) {
    console.log(err);
    res.status(500).json({
      msg: "Error"
    });
  }
};