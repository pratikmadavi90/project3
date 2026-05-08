const express = require("express");
const router = express.Router();

const {
  createOffer,
  getOffers,
  deleteOffer,
} = require("../controllers/offerController");

router.post("/add", createOffer);
router.get("/", getOffers);
router.delete("/:id", deleteOffer);

module.exports = router;