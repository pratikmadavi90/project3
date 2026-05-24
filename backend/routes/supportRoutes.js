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

// Delete ticket  👇 ye naya add karo
router.delete("/:id", async(req,res)=>{

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