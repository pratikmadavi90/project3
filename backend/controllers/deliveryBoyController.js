const DeliveryBoy=
require("../models/DeliveryBoy");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

// Add

exports.addDeliveryBoy=
async(req,res)=>{

try{

const count=
await DeliveryBoy.countDocuments();

const deliveryId=
`DLV${String(
count+1
).padStart(3,"0")}`;

const boy=
await DeliveryBoy.create({

...req.body,
deliveryId

});

res.json({

success:true,

deliveryBoy:{
_id:boy._id,
name:boy.name,
mobile:boy.mobile,
deliveryId:boy.deliveryId,
vehicleType:boy.vehicleType,
online:boy.online
}

});

}catch(err){

res.status(500)
.json({
success:false,
message:err.message
});

}

};




// Login

exports.loginDeliveryBoy=
async(req,res)=>{

try{

const {
deliveryId,
password
}=req.body;

const boy=
await DeliveryBoy.findOne({

deliveryId,
password

});

if(!boy){

return res.json({

success:false,
message:"Wrong Delivery ID or Password"

});

}



// online status true
boy.online = true;

await boy.save();

const token = jwt.sign(
  {
    id: boy._id,
    deliveryId: boy.deliveryId
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({
  success: true,
  token,
  deliveryBoy: {
    _id: boy._id,
    name: boy.name,
    mobile: boy.mobile,
    deliveryId: boy.deliveryId,
    vehicle: boy.vehicle,
    online: boy.online
  }
});

}catch(err){

res.status(500)
.json({

success:false,
message:err.message

});

}

};

// Logout / Offline

exports.logoutDeliveryBoy=
async(req,res)=>{

try{

const boy=
await DeliveryBoy.findOne({

deliveryId:req.params.id

});

if(!boy){

return res.json({
success:false
});

}

boy.online=false;

await boy.save();

res.json({
success:true
});

}catch(err){

res.status(500)
.json({
success:false
});

}

};


// Get All

exports.getAllDeliveryBoys=
async(req,res)=>{

try{

const data=
await DeliveryBoy.find()
.sort({
createdAt:-1
});

res.json({
success:true,
data
});

}catch(err){

res.status(500)
.json({
success:false
});

}

};




// Delete

exports.deleteDeliveryBoy=
async(req,res)=>{

try{

await DeliveryBoy.findByIdAndDelete(
req.params.id
);

res.json({
success:true
});

}catch(err){

res.status(500)
.json({
success:false
});

}

};




// Update

exports.updateDeliveryBoy=
async(req,res)=>{

try{

const data=
await DeliveryBoy.findByIdAndUpdate(

req.params.id,
req.body,
{new:true}

);

res.json({
success:true,
data
});

}catch(err){

res.status(500)
.json({
success:false
});

}

};


// =========================
// ADMIN DASHBOARD
// =========================
exports.getAdminDashboard = async (req, res) => {
  try {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const totalDeliveryBoys =
      await DeliveryBoy.countDocuments();

    const onlineDeliveryBoys =
      await DeliveryBoy.countDocuments({
        online: true
      });

    const todayDelivered =
      await Order.countDocuments({
        status: "Delivered",
        deliveredAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });

   const todayPending =
await Order.countDocuments({
  status:{
    $in:[
      "Pending",
      "Accepted",
      "Packed",
      "Out for Delivery"
    ]
  },
  createdAt:{
    $gte:startOfDay,
    $lte:endOfDay
  }
});

    const todayCancelled =
      await Order.countDocuments({
        status: "Cancelled",
        updatedAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });

    const weekDelivered =
      await Order.countDocuments({
        status: "Delivered",
        deliveredAt: {
          $gte: startOfWeek
        }
      });

    const monthDelivered =
      await Order.countDocuments({
        status: "Delivered",
        deliveredAt: {
          $gte: startOfMonth
        }
      });

    res.json({
      success: true,
      totalDeliveryBoys,
      onlineDeliveryBoys,
      offlineDeliveryBoys:
        totalDeliveryBoys - onlineDeliveryBoys,

      todayDelivered,
      todayPending,
      todayCancelled,

      todayEarnings:
        todayDelivered * 20,

      weekDelivered,
      weekEarnings:
        weekDelivered * 20,

      monthDelivered,
      monthEarnings:
        monthDelivered * 20
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};


// =========================
// TOP PERFORMERS
// =========================

exports.getTopPerformers = async (req, res) => {

  try {

    const boys = await DeliveryBoy.find();

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const startOfWeek = new Date();
    startOfWeek.setDate(
      startOfWeek.getDate() - startOfWeek.getDay()
    );
    startOfWeek.setHours(0,0,0,0);

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const data = [];

    for(const boy of boys){

      const todayDelivered =
      await Order.countDocuments({
        deliveryBoyId:boy.deliveryId,
        status:"Delivered",
        deliveredAt:{
          $gte:startOfDay
        }
      });

      const weekDelivered =
      await Order.countDocuments({
        deliveryBoyId:boy.deliveryId,
        status:"Delivered",
        deliveredAt:{
          $gte:startOfWeek
        }
      });

      const monthDelivered =
      await Order.countDocuments({
        deliveryBoyId:boy.deliveryId,
        status:"Delivered",
        deliveredAt:{
          $gte:startOfMonth
        }
      });

      const totalDelivered =
      await Order.countDocuments({
        deliveryBoyId:boy.deliveryId,
        status:"Delivered"
      });

      data.push({

        name:boy.name,

        mobile:boy.mobile,

        deliveryId:boy.deliveryId,

        vehicle:boy.vehicle,

        online:boy.online,

        todayDelivered,

        weekDelivered,

        monthDelivered,

        totalDelivered,

        todayEarning:
        todayDelivered * 20,

        weekEarning:
        weekDelivered * 20,

        monthEarning:
        monthDelivered * 20,

        totalEarning:
        totalDelivered * 20

      });

    }

    data.sort(
      (a,b)=>
      b.totalDelivered-
      a.totalDelivered
    );

    res.json({
      success:true,
      data
    });

  } catch(err){

    console.log(err);

    res.status(500).json({
      success:false,
      error:err.message
    });

  }

};

// =========================
// DELIVERY BOY DETAILS
// =========================

exports.getDeliveryBoyDetails = async (req, res) => {

  try {

    const deliveryBoyId = req.params.deliveryBoyId;

    const boy = await DeliveryBoy.findOne({
      deliveryId: deliveryBoyId
    });

    if (!boy) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy not found"
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(
      startOfWeek.getDate() - startOfWeek.getDay()
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const todayDelivered = await Order.countDocuments({
      deliveryBoyId,
      status: "Delivered",
      deliveredAt: {
        $gte: startOfDay
      }
    });

    const weekDelivered = await Order.countDocuments({
      deliveryBoyId,
      status: "Delivered",
      deliveredAt: {
        $gte: startOfWeek
      }
    });

    const monthDelivered = await Order.countDocuments({
      deliveryBoyId,
      status: "Delivered",
      deliveredAt: {
        $gte: startOfMonth
      }
    });

    const totalDelivered = await Order.countDocuments({
      deliveryBoyId,
      status: "Delivered"
    });

   const pendingOrders =
await Order.countDocuments({
  deliveryBoyId,
  status:{
    $in:[
      "Pending",
      "Accepted",
      "Packed",
      "Out for Delivery"
    ]
  },
  createdAt:{
    $gte:startOfDay,
    $lte:endOfDay
  }
});

    const cancelledOrders = await Order.countDocuments({
      deliveryBoyId,
      status: "Cancelled"
    });

    const lastDelivered = await Order.findOne({
      deliveryBoyId,
      status: "Delivered"
    }).sort({
      deliveredAt: -1
    });

    res.json({

      success: true,

      deliveryBoy: {

        name: boy.name,

        mobile: boy.mobile,

        deliveryId: boy.deliveryId,

        vehicle: boy.vehicle,

        online: boy.online,

        status: boy.status,

        joinedAt: boy.createdAt

      },

      performance: {

        todayDelivered,

        weekDelivered,

        monthDelivered,

        totalDelivered,

        pendingOrders,

        cancelledOrders,

        todayEarning: todayDelivered * 20,

        weekEarning: weekDelivered * 20,

        monthEarning: monthDelivered * 20,

        totalEarning: totalDelivered * 20,

        lastDeliveredAt: lastDelivered
          ? lastDelivered.deliveredAt
          : null

      }

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

};


// =========================
// WEEKLY CHART
// =========================

exports.getWeeklyChart = async (req, res) => {

  try {

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const result = [];

    for (let i = 0; i < 7; i++) {

      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const delivered = await Order.countDocuments({
        status: "Delivered",
        deliveredAt: {
          $gte: start,
          $lte: end
        }
      });

      result.push({
        day: days[i],
        delivered,
        earning: delivered * 20
      });

    }

    res.json({
      success: true,
      chart: result
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

};


// =========================
// MONTHLY EARNINGS
// =========================

exports.getMonthlyEarnings = async (req, res) => {

  try {

    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const weeks = [];

    for (let i = 1; i <= 5; i++) {

      const start = new Date(year, month, (i - 1) * 7 + 1);
      const end = new Date(year, month, i * 7);

      end.setHours(23, 59, 59, 999);

      const delivered = await Order.countDocuments({
        status: "Delivered",
        deliveredAt: {
          $gte: start,
          $lte: end
        }
      });

      weeks.push({
        week: `Week ${i}`,
        delivered,
        earning: delivered * 20
      });

    }

    res.json({
      success: true,
      data: weeks
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

};