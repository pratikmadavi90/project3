const FootwearOrder = require("../models/FootwearOrder");


// ==========================
// CREATE ORDER
// ==========================
exports.createFootwearOrder = async (req, res) => {
  try {

    const order = await FootwearOrder.create(req.body);

    res.status(201).json({
      success: true,
      message: "Footwear order created successfully",
      order,
    });

  } catch (error) {

    console.log("CREATE FOOTWEAR ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });

  }
};


// ==========================
// GET ALL ORDERS
// ==========================
exports.getAllFootwearOrders = async (req, res) => {
  try {

    const orders = await FootwearOrder
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {

    console.log("GET FOOTWEAR ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });

  }
};


// ==========================
// GET SINGLE ORDER
// ==========================
exports.getFootwearOrderById = async (req, res) => {
  try {

    const order = await FootwearOrder.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    console.log("GET SINGLE FOOTWEAR ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });

  }
};


// ==========================
// UPDATE STATUS
// ==========================
exports.updateFootwearOrderStatus = async (
  req,
  res
) => {
  try {

    const { status } = req.body;

    const order =
      await FootwearOrder.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated",
      order,
    });

  } catch (error) {

    console.log(
      "UPDATE FOOTWEAR STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });

  }
};