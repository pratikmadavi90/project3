const Order = require("../models/Order");
const { applyOffer } = require("../utils/offerHelper");
const User = require("../models/User");

// 🧾 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { cartTotal, offerId, userId } = req.body;

    let finalAmount = cartTotal;

    // Offer apply
    if (offerId) {
      const Offer = require("../models/Offer");
      const offer = await Offer.findById(offerId);

      finalAmount = applyOffer(cartTotal, offer);
    }

// asli user ko email se pakdo
const user = await User.findOne({
  email: req.body.userEmail
});

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

const order = new Order({
  ...req.body,

  // database ki original userId hi save hogi
  userId: user.userId,

  finalAmount,
  orderId: "ORD" + Date.now()
});

    await order.save();

    res.status(201).json({
      message: "Order Created",
      order
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
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
{
deliveryBoy:{
name:deliveryBoy.name,
deliveryId:String(
deliveryBoy.deliveryId
)
},

deliveryBoyId:String(
deliveryBoy.deliveryId
)
},
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

// 🗑 DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      message: "Order Deleted"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// 📊 DELIVERY DASHBOARD

exports.deliveryDashboard =
async(req,res)=>{

const deliveryBoyId =
req.query.deliveryBoyId;

try{

const todayStart = new Date();

todayStart.setHours(0,0,0,0);

const todayEnd = new Date();

todayEnd.setHours(23,59,59,999);


// 📦 Total Orders
const totalOrders =
await Order.countDocuments({

deliveryBoyId:deliveryBoyId,

createdAt:{
$gte:todayStart,
$lte:todayEnd
}

});


// ✅ Delivered Orders
const deliveredOrders =
await Order.countDocuments({

deliveryBoyId:deliveryBoyId,

status:"Delivered",

createdAt:{
$gte:todayStart,
$lte:todayEnd
}

});


// ⏳ Pending Orders
const pendingOrders =
await Order.countDocuments({

deliveryBoyId:deliveryBoyId,

status:{
$in:[
"Pending",
"Accepted",
"Out for Delivery"
]
},

createdAt:{
$gte:todayStart,
$lte:todayEnd
}

});


// 🚚 Live Order
const liveOrder =
await Order.findOne({

deliveryBoyId:deliveryBoyId,

status:{
$in:[
"Pending",
"Accepted",
"Picked Up",
"Out for Delivery"
]
},

createdAt:{
$gte:todayStart,
$lte:todayEnd
}

}).sort({
createdAt:-1
});


res.json({

success:true,

totalOrders,
deliveredOrders,
pendingOrders,
liveOrder

});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

};

// 🚚 Delivery Boy Current Order

exports.getDeliveryOrder =
async (req, res) => {

  try {

    const order =
    await Order.findOne({

      deliveryBoyId:req.params.id,

      status:"Out for Delivery"

    }).sort({
      createdAt:-1
    });

    res.json({
      success:true,
      order
    });

  } catch (err) {

    res.status(500).json({
      success:false,
      error:err.message
    });

  }

};