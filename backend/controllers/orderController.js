const Order = require("../models/Order");
const { applyOffer } = require("../utils/offerHelper");
const User = require("../models/User");
const Product = require("../models/Product");
const FootwearProduct = require("../models/FootwearProduct");
const DeliveryBoy = require("../models/DeliveryBoy");
const admin = require("firebase-admin");
const Staff = require("../models/Staff");
const jwt = require("jsonwebtoken");

// 🧾 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { cartTotal, offerId, userId } = req.body;

// ✅ Stock Check
for (const item of req.body.items) {

let product = await Product.findById(item.productId);

if (!product) {
  product = await FootwearProduct.findById(item.productId);
}

if (!product) {
  return res.status(404).json({
    message: `${item.name} not found`
  });
}

  if (product.stock.quantity < item.qty) {
    return res.status(400).json({
      message: `Only ${product.stock.quantity} ${item.name} available`
    });
  }

}

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



const onlineDeliveryBoys =
await DeliveryBoy.find({
  online: true,
  status: "Active"
});

let assignedDeliveryBoy = null;

if (onlineDeliveryBoys.length > 0) {

  let minOrders = Number.MAX_SAFE_INTEGER;

  for (const boy of onlineDeliveryBoys) {

    const activeOrders =
    await Order.countDocuments({

      deliveryBoyId: boy.deliveryId,

status: {
  $in: [
    "Pending",
    "Accepted",
    "Delivery Accepted",
    "Staff Accepted",
    "Packing",
    "Packed",
    "Handed Over",
    "Out for Delivery"
  ]
}

    });

    if (activeOrders < minOrders) {
      minOrders = activeOrders;
      assignedDeliveryBoy = boy;
    }
  }
}

const onlineStaff = await Staff.find({
  isOnline: true,
  available: true,
  status: "Active"
});

let assignedStaff = null;

if (onlineStaff.length > 0) {

  let minOrders = Number.MAX_SAFE_INTEGER;

  for (const staff of onlineStaff) {

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const activeOrders = await Order.countDocuments({
  staffId: staff.staffId,
  createdAt: {
    $gte: startOfDay
  },
  status: {
    $in: [
      "Pending",
      "Delivery Accepted",
      "Staff Accepted",
      "Packing"
    ]
  }
});

console.log("ONLINE STAFF =", onlineStaff);

    if (activeOrders < minOrders) {
      minOrders = activeOrders;
      assignedStaff = staff;
    }
  }
}



const order = new Order({

  ...req.body,

  userId:user.userId,

  finalAmount,

  orderId:"ORD"+Date.now(),

deliveryBoy: assignedDeliveryBoy
  ? {
      name: assignedDeliveryBoy.name,
      phone: assignedDeliveryBoy.mobile
    }
  : {},

deliveryBoyId: assignedDeliveryBoy
  ? assignedDeliveryBoy.deliveryId
  : "",

deliveryAssignedAt: assignedDeliveryBoy
  ? new Date()
  : null,

deliveryAccepted: false,

staffId: assignedStaff
  ? assignedStaff.staffId
  : null,

});

    await order.save();

 if (assignedDeliveryBoy?.fcmToken) {
  try {
await admin.messaging().send({
  token: assignedDeliveryBoy.fcmToken,

  notification: {
    title: "📦 New Order",
    body: `Order ${order.orderId} received`,
  },

  android: {
    priority: "high",
    notification: {
      channelId: "default",
      sound: "default",
      priority: "high",
      defaultSound: true,
      defaultVibrateTimings: true,
    },
  },

  data: {
    orderId: order.orderId,
  },
});

    console.log("Notification sent");
  } catch (err) {
    console.log("FCM Error:", err.message);
  }
}   

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

// 👤 GET CUSTOMER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// 👤 GET SINGLE CUSTOMER ORDER
exports.getUserOrderDetails = async (req, res) => {
  try {

    const order = await Order.findOne({
      orderId: req.params.id,
      userEmail: req.params.email,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
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
    const { status, staffId } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status required" });
    }

    let update = { status };

if (status === "Delivery Accepted") {

 console.log("ADMIN DATA =", req.admin); 

  const deliveryBoy =
    await DeliveryBoy.findOne({
      deliveryId: req.admin.deliveryId
    });

  if (deliveryBoy) {

    update.deliveryBoyId =
      deliveryBoy.deliveryId;

    update.deliveryBoy = {
      name: deliveryBoy.name,
      phone: deliveryBoy.mobile
    };

    update.deliveryAccepted = true;

  }

}    

    if (staffId) {
  update.staffId = staffId;
}

    // timestamps auto update
    if (
  status === "Delivery Accepted" ||
  status === "Staff Accepted"
) {
  update["timestamps.acceptedAt"] = new Date();
}

if (status === "Packing") {
  update["packingStartedAt"] = new Date();
}

if (status === "Packed") {
  update["packedAt"] = new Date();
}

if (status === "Handed Over") {
  update["handoverAt"] = new Date();
}

if (status === "Out for Delivery")
  update["timestamps.outForDeliveryAt"] = new Date();

if (status === "Delivered")
  update["deliveredAt"] = new Date();

if (status === "Delivered")
  update["timestamps.deliveredAt"] = new Date();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

if (status === "Delivered") {

  for (const item of order.items) {

console.log(
  "CHECK PRODUCT ID =",
  item.productId
);

    const product = await Product.findById(item.productId);

console.log(
  "FOUND PRODUCT =",
  product
);

    if (!product) continue;

    product.stock.quantity -= item.qty;

    if (product.stock.quantity < 0) {
      product.stock.quantity = 0;
    }

    product.stock.inStock = product.stock.quantity > 0;

    await product.save();

  }

}
    
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

        deliveryAssignedAt: new Date(),
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

deliveryBoyId: deliveryBoyId

}).sort({
createdAt:1
});

console.log(
  "SEARCHING FOR =",
  deliveryBoyId
);

const testOrders =
await Order.find({
  status:"Pending"
});

console.log(
  "PENDING ORDERS =",
  JSON.stringify(testOrders,null,2)
);


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
"Delivery Accepted",
"Staff Accepted",
"Packed",
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


// 📊 STAFF DASHBOARD (Last 7 Days)
exports.staffDashboard = async (req, res) => {
  try {

    

    const staff = req.staff;

    const labels = [
      "Today",
      "Yesterday",
      "Day Before",
      "3 Days",
      "4 Days",
      "5 Days",
      "6 Days"
    ];

    const result = [];

    for (let i = 0; i < 7; i++) {

      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const count = await Order.countDocuments({
        staffId: staff.staffId,
        createdAt: {
          $gte: start,
          $lte: end
        }
      });

      result.push({
        title: labels[i],
        orders: count,
        date: start.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short"
        })
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};



exports.getStaffOrders = async (req, res) => {

  try {

    const staff = await Staff.findById(req.staff._id);

    if (!staff) {
      return res.json([]);
    }

    if (!staff.available) {

      const orders = await Order.find({
        staffId: staff.staffId
      }).sort({ createdAt: -1 });

      return res.json(orders);
    }

    const orders = await Order.find({
      staffId: staff.staffId
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

};



exports.rejectOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const currentBoy = order.deliveryBoyId;

    if (!order.deliveryRejectedBy) {
      order.deliveryRejectedBy = [];
    }

    if (currentBoy) {
      order.deliveryRejectedBy.push(currentBoy);
    }

    const onlineBoys = await DeliveryBoy.find({
      online: true,
      status: "Active",
      deliveryId: {
        $nin: order.deliveryRejectedBy
      }
    });

    // sabne reject kar diya
    if (onlineBoys.length === 0) {

      order.rejectionRound =
        (order.rejectionRound || 0) + 1;

      // 2 rounds complete
      if (order.rejectionRound >= 2) {

        order.deliveryBoyId = "";
        order.deliveryBoy = {};
        order.status = "Pending";

        await order.save();

        return res.json({
          success: true,
          message:
            "Order pending after 2 rounds"
        });
      }

      // next round restart
      order.deliveryRejectedBy = [];

      const restartBoys =
      await DeliveryBoy.find({
        online: true,
        status: "Active"
      });

      if (restartBoys.length > 0) {

        const nextBoy = restartBoys[0];

        order.deliveryBoyId =
          nextBoy.deliveryId;

        order.deliveryBoy = {
          name: nextBoy.name,
          phone: nextBoy.mobile
        };
      }

      await order.save();

      return res.json({
        success: true,
        message: "Round restarted"
      });
    }

    const nextBoy = onlineBoys[0];

    order.deliveryBoyId =
      nextBoy.deliveryId;

    order.deliveryBoy = {
      name: nextBoy.name,
      phone: nextBoy.mobile
    };

    order.status = "Pending";

    await order.save();

    res.json({
      success: true,
      message: "Order reassigned"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

};



exports.acceptOrder = async (req, res) => {
  try {

    const deliveryBoyId =
      req.user?.deliveryId;

    const boy =
      await DeliveryBoy.findOne({
        deliveryId: deliveryBoyId
      });

    if (!boy) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy not found"
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          deliveryBoyId: boy.deliveryId,

          deliveryBoy: {
            name: boy.name,
            phone: boy.mobile
          },

          deliveryAccepted: true,

          status: "Delivery Accepted"
        },
        { new: true }
      );

    res.json({
      success: true,
      order
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};