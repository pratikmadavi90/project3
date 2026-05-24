const express = require("express");
const router = express.Router();

const {
 createTicket
} = require("../controllers/supportController");

router.post("/", createTicket);

module.exports = router;