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

const DeliveryBoy =
require("../models/DeliveryBoy");

const deliveryBoy =
await DeliveryBoy.findOne({
online:true
});



const order = new Order({

  ...req.body,

  userId:user.userId,

  finalAmount,

  orderId:"ORD"+Date.now(),

deliveryBoy: deliveryBoy
  ? {
      name: deliveryBoy.name,
      phone: deliveryBoy.mobile
    }
  : {},

deliveryBoyId: deliveryBoy
  ? deliveryBoy.deliveryId
  : ""

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
    if (status === "Delivered")update["deliveredAt"] = new Date();
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

      return res.status(400).json({
        message: "Delivery Boy info required"
      });

    }

    const order =
    await Order.findByIdAndUpdate(

      req.params.id,

      {

        deliveryBoy:{
          name:deliveryBoy.name,
          phone:deliveryBoy.phone,
          deliveryId:String(
            deliveryBoy.deliveryId
          )
        },

        deliveryBoyId:String(
          deliveryBoy.deliveryId
        ),

        status:"Pending"

      },

      { new:true }

    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    console.log(
      "ASSIGNED ORDER =",
      order
    );

    res.json({

      success:true,
      message:"Delivery Assigned",
      order

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

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

try{

const deliveryBoyId =
String(req.query.deliveryBoyId);

console.log(
"QUERY ID =",
deliveryBoyId
);

const startOfDay = new Date();
startOfDay.setHours(0,0,0,0);

const endOfDay = new Date();
endOfDay.setHours(23,59,59,999);

const orders =
await Order.find({
  deliveryBoyId:deliveryBoyId,
  createdAt:{
    $gte:startOfDay,
    $lte:endOfDay
  }
});

console.log(
"FOUND ORDERS =",
orders
);

const liveOrder =
await Order.findOne({

createdAt:{
  $gte:startOfDay,
  $lte:endOfDay
},

status:"Pending",

$or:[
  { deliveryBoyId: deliveryBoyId },
  { deliveryBoyId: "" },
  { deliveryBoyId: null }
]

}).sort({
createdAt:1
});

if(
  liveOrder &&
  (!liveOrder.deliveryBoyId ||
   liveOrder.deliveryBoyId === "")
){

  liveOrder.deliveryBoyId =
  deliveryBoyId;

  await liveOrder.save();

}

console.log(
"LIVE ORDER =",
JSON.stringify(
liveOrder,
null,
2
)
);

res.json({

success:true,

totalOrders:orders.length,

deliveredOrders:
orders.filter(
o=>o.status==="Delivered"
).length,

pendingOrders:
orders.filter(
o=>
[
"Pending",
"Accepted",
"Picked Up",
"Out for Delivery"
].includes(o.status)
).length,

liveOrder,

orders

});

}catch(err){

console.log(err);

res.status(500).json({
success:false
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


// 📜 DELIVERY HISTORY

exports.deliveryHistory = async (req, res) => {

  try {

    const deliveryBoyId =
    String(req.params.id);

    const orders =
    await Order.find({
      deliveryBoyId,
      status:"Delivered"
    }).sort({
      deliveredAt:-1
    });

    const groupedData = {};

    orders.forEach(order => {

      const date =
      new Date(
        order.deliveredAt || order.updatedAt
      ).toLocaleDateString("en-GB");

      if(!groupedData[date]){

        groupedData[date] = {
          date,
          totalOrders:0,
          earning:0,
          orders:[]
        };

      }

      groupedData[date].totalOrders += 1;

      groupedData[date].earning += 20;

      groupedData[date].orders.push({
        orderId:order.orderId,
        customer:order?.user?.name,
        city:order?.address?.city,
        amount:order?.totalAmount
      });

    });

    res.json({

      success:true,

      totalDelivered:
      orders.length,

      history:
      Object.values(
        groupedData
      )

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success:false,
      error:err.message
    });

  }

};