const Product = require("../models/AllProduct");

// 🔹 Update stock
exports.updateStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;

const product = await Product.findByIdAndUpdate(
  id,
  {
    stock: Number(quantity)
  },
  { new: true }
);

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Low stock
exports.getLowStock = async (req, res) => {
const data = await Product.find({
  stock: { $lte: 10 }
}).sort({ stock: 1 });

  res.json(data);
};

// 🔹 Out of stock
exports.getOutOfStock = async (req, res) => {
  const data = await Product.find({
  stock: 0
});
  res.json(data);
};

// 🔹 All products (search/filter)
exports.getProducts = async (req, res) => {
  const { search, warehouse } = req.query;

  let filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (warehouse) {
    filter.warehouse = warehouse;
  }

  const data = await Product.find(filter);
  res.json(data);
};