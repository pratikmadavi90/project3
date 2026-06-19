const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
createTicket,
getTickets,
replyTicket
} = require("../controllers/supportController");

// Create ticket
router.post("/", createTicket);

// Get all tickets
router.get(
  "/",
  authMiddleware,
  getTickets
);

// Reply ticket
router.put(
  "/reply/:id",
  authMiddleware,
  replyTicket
);

// Delete ticket
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

try{

const Support =
require("../models/Support");

await Support.findByIdAndDelete(
req.params.id
);

res.json({
success:true
});

}catch(err){

res.status(500).json({
success:false
});

}

});

module.exports = router;