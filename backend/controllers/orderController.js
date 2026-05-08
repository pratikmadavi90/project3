const Order = require("../models/Order");
const { applyOffer } = require("../utils/offerHelper");

// 🧾 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { cartTotal, offerId } = req.body;

let finalAmount = cartTotal;

// agar offer mila to apply karo
if (offerId) {
  const Offer = require("../models/Offer");
  const offer = await Offer.findById(offerId);

  finalAmount = applyOffer(cartTotal, offer);
}

const order = new Order({
  ...req.body,
  finalAmount,
  orderId: "ORD" + Date.now()
});


    await order.save();

    res.status(201).json({
      message: "Order Created",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📋 GET ALL ORDERS (Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔍 GET SINGLE ORDER
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔄 UPDATE ORDER STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status required" });
    }

    let update = { status };

    // timestamps auto update
    if (status === "Accepted") update["timestamps.acceptedAt"] = new Date();
    if (status === "Packed") update["timestamps.packedAt"] = new Date();
    if (status === "Out for Delivery") update["timestamps.outForDeliveryAt"] = new Date();
    if (status === "Delivered") update["timestamps.deliveredAt"] = new Date();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Status Updated",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🚚 ASSIGN DELIVERY BOY
exports.assignDelivery = async (req, res) => {
  try {
    const { deliveryBoy } = req.body;

    if (!deliveryBoy || !deliveryBoy.name) {
      return res.status(400).json({ message: "Delivery Boy info required" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryBoy },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Delivery Assigned",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ❌ CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order Cancelled",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};