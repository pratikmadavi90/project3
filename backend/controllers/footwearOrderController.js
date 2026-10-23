const FootwearOrder = require("../models/FootwearOrder");
const DeliveryBoy = require("../models/DeliveryBoy");
const User = require("../models/User");
const FootwearProduct = require("../models/FootwearProduct");

// ==========================
// CREATE ORDER
// ==========================
exports.createFootwearOrder = async (req, res) => {
  let stockDeducted = false;
  let productId;
  let selectedSize;

  try {
    productId = req.body.productId;
    selectedSize = String(req.body.size || "");

    if (!productId || !selectedSize) {
      return res.status(400).json({
        success: false,
        message: "Product ID and shoe size are required",
      });
    }

    // Check product and reduce selected size stock by 1
    const product = await FootwearProduct.findOneAndUpdate(
      {
        _id: productId,
        [`sizeStock.${selectedSize}`]: { $gt: 0 },
      },
      {
        $inc: {
          [`sizeStock.${selectedSize}`]: -1,
          stock: -1,
        },
      },
      { new: true }
    );

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Selected shoe size is out of stock",
      });
    }

    stockDeducted = true;

    // Find an available delivery boy
    const onlineDeliveryBoys = await DeliveryBoy.find({
      online: true,
      status: "Active",
    });

    let assignedDeliveryBoy = null;
    let minOrders = Number.MAX_SAFE_INTEGER;

    for (const boy of onlineDeliveryBoys) {
      const activeOrders = await FootwearOrder.countDocuments({
        deliveryBoyId: boy.deliveryId,
        status: {
          $in: [
            "Pending",
            "Delivery Accepted",
            "Staff Accepted",
            "Packing",
            "Packed",
            "Out for Delivery",
          ],
        },
      });

      if (activeOrders < minOrders) {
        minOrders = activeOrders;
        assignedDeliveryBoy = boy;
      }
    }

    // Create order
    const order = await FootwearOrder.create({
      ...req.body,
      deliveryBoyId: assignedDeliveryBoy
        ? assignedDeliveryBoy.deliveryId
        : "",
      deliveryBoy: assignedDeliveryBoy
        ? {
            name: assignedDeliveryBoy.name,
            phone: assignedDeliveryBoy.mobile,
          }
        : {},
    });

    res.status(201).json({
      success: true,
      message: "Footwear order created successfully",
      order,
    });
  } catch (error) {
    console.log("CREATE FOOTWEAR ORDER ERROR:", error);

    // Restore stock if order creation fails after deduction
    if (stockDeducted && productId && selectedSize) {
      try {
        await FootwearProduct.updateOne(
          { _id: productId },
          {
            $inc: {
              [`sizeStock.${selectedSize}`]: 1,
              stock: 1,
            },
          }
        );
      } catch (restoreError) {
        console.log("STOCK RESTORE ERROR:", restoreError);
      }
    }

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


console.log(
  "getUserFootwearOrderDetails =",
  typeof exports.getUserFootwearOrderDetails
);




// ==========================
// DELIVERY DASHBOARD
// ==========================
exports.deliveryDashboard = async (req, res) => {
  try {

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const deliveryBoyId =
String(req.query.deliveryBoyId);

const endOfDay = new Date();
endOfDay.setHours(23,59,59,999);

const orders = await FootwearOrder.find({

  deliveryBoyId: deliveryBoyId,

  createdAt: {
    $gte: startOfDay,
    $lte: endOfDay
  },

  status: {
    $in: [
      "Pending",
      "Accepted",
      "Delivery Accepted",
      "Staff Accepted",
      "Packing",
      "Packed",
      "Out for Delivery"
    ]
  }

}).sort({ createdAt: -1 });

const liveOrder = await FootwearOrder.findOne({

  deliveryBoyId: deliveryBoyId,

  createdAt: {
    $gte: startOfDay,
    $lte: endOfDay
  },

  status: "Pending"

}).sort({ createdAt: 1 });

const formattedLiveOrder = liveOrder
? {
    ...liveOrder.toObject(),

    user: {
      name: liveOrder.customerName,
      phone: liveOrder.phone
    },

    address: {
      city: liveOrder.city,
      fullAddress: liveOrder.address
    }
  }
: null;

 const formattedOrders = orders.map(order => ({
  ...order.toObject(),

  user: {
    name: order.customerName,
    phone: order.phone
  },

  address: {
    city: order.city,
    fullAddress: order.address
  }
}));   

res.json({
  success: true,
  orders: formattedOrders,
  liveOrder: formattedLiveOrder
});

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};