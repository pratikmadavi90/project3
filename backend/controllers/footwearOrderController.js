const FootwearOrder = require("../models/FootwearOrder");
const DeliveryBoy = require("../models/DeliveryBoy");

// ==========================
// CREATE ORDER
// ==========================
exports.createFootwearOrder = async (req, res) => {
  try {
    
 const onlineDeliveryBoys =
await DeliveryBoy.find({
  online: true,
  status: "Active"
});

let assignedDeliveryBoy = null;

if (onlineDeliveryBoys.length > 0) {
  assignedDeliveryBoy =
    onlineDeliveryBoys[0];
}   

const order = await FootwearOrder.create({

  ...req.body,

  deliveryBoyId:
    assignedDeliveryBoy
      ? assignedDeliveryBoy.deliveryId
      : ""

});

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


exports.getUserFootwearOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await FootwearOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserFootwearOrders = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await FootwearOrder.find({
      email: email,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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


console.log(
  "getUserFootwearOrderDetails =",
  typeof exports.getUserFootwearOrderDetails
);