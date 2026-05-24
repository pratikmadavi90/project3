const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  replyTicket
} = require("../controllers/supportController");


// Create ticket
router.post("/", createTicket);

// Get all tickets
router.get("/", getTickets);

// Reply ticket
router.put("/reply/:id", replyTicket);

module.exports = router;