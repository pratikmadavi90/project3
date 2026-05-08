const Offer = require("../models/Offer");

// CREATE
exports.createOffer = async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate("productIds");
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};