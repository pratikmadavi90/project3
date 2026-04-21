const Product = require("../models/Product");

const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    res.json({
      totalProducts
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard };