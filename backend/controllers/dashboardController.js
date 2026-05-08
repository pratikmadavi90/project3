const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// 🔹 Dashboard stats
exports.getStats = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const orders = await Order.find();
  let revenue = 0;

  orders.forEach(o => {
    revenue += o.totalAmount || 0;
  });

  res.json({
    totalProducts,
    totalOrders,
    revenue
  });
};

// 🔹 Low stock
exports.getLowStock = async (req, res) => {
  const data = await Product.find({
    $expr: {
      $lte: ["$stock.quantity", "$stock.lowStockLimit"]
    }
  }).limit(5);

  res.json(data);
};

// 🔹 Recent orders
exports.getRecentOrders = async (req, res) => {
  const data = await Order.find().sort({ createdAt: -1 }).limit(5);
  res.json(data);
};

// 🔹 Recent users
exports.getRecentUsers = async (req, res) => {
  const data = await User.find().sort({ createdAt: -1 }).limit(5);
  res.json(data);
};