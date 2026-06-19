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

// 🔥 Weekly Stats For Graph
exports.getWeeklyStats = async (req, res) => {
  try {

    const days = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ];

    const result = {};

    days.forEach(day => {
      result[day] = {
        total: 0,
        pending: 0,
        processing: 0,
        delivered: 0,
        cancelled: 0,
        revenue: 0
      };
    });

    const orders = await Order.find();

    orders.forEach(order => {

      const day =
      days[new Date(order.createdAt).getDay()];

      result[day].total++;

      result[day].revenue +=
      order.totalAmount || 0;

      if (order.status === "Pending") {
        result[day].pending++;
      }

      else if (
        [
          "Accepted",
          "Packed",
          "Out for Delivery"
        ].includes(order.status)
      ) {
        result[day].processing++;
      }

      else if (
        order.status === "Delivered"
      ) {
        result[day].delivered++;
      }

      else if (
        order.status === "Cancelled"
      ) {
        result[day].cancelled++;
      }

    });

    res.json(result);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};


// 🔥 Day Orders List
exports.getDayOrders = async (req, res) => {

  try {

    const { day, type } = req.query;

    const days = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ];

    const orders =
    await Order.find().sort({
      createdAt: -1
    });

    let filtered =
    orders.filter(order => {

      const orderDay =
      days[
        new Date(
          order.createdAt
        ).getDay()
      ];

      return orderDay === day;

    });

    if (
      type &&
      type !== "all"
    ) {

      if (type === "processing") {

        filtered =
        filtered.filter(order =>
          [
            "Accepted",
            "Packed",
            "Out for Delivery"
          ].includes(order.status)
        );

      } else {

        filtered =
        filtered.filter(order =>
          order.status === type
        );

      }

    }

    res.json(filtered);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};