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

// 🔥 Weekly Stats For Current Week Graph
exports.getWeeklyStats = async (req, res) => {

  try {

    const today = new Date();

    const monday = new Date(today);
    monday.setDate(
      today.getDate() -
      ((today.getDay() + 6) % 7)
    );
    monday.setHours(0,0,0,0);

    const sunday = new Date(monday);
    sunday.setDate(
      monday.getDate() + 6
    );
    sunday.setHours(
      23,59,59,999
    );

    const orders =
    await Order.find({
      createdAt:{
        $gte:monday,
        $lte:sunday
      }
    });

    const result = {};

    for(let i=0;i<7;i++){

      const date =
      new Date(monday);

      date.setDate(
        monday.getDate()+i
      );

      const dayName =
      ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
      [date.getDay()];

      const dateLabel =
      `${dayName} (${date.getDate()} ${
        date.toLocaleString(
          "en-US",
          { month:"short" }
        )
      })`;

      result[dayName] = {

        label:dateLabel,

        date:
        date.toISOString(),

        total:0,

        pending:0,

        processing:0,

        delivered:0,

        cancelled:0,

        revenue:0

      };

    }

  orders.forEach(order => {

  const dayName =
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  [
    new Date(
      order.createdAt
    ).getDay()
  ];

  if(!result[dayName])
  return;

  result[dayName].total++;

  result[dayName].revenue +=
  order.totalAmount || 0;

  const status =
  (order.status || "")
  .trim()
  .toLowerCase();

  if(status === "pending"){

    result[dayName]
    .pending++;

  }

  else if(

    [
      "accepted",
      "packed",
      "out for delivery"
    ].includes(status)

  ){

    result[dayName]
    .processing++;

  }

  else if(
    status ===
    "delivered"
  ){

    result[dayName]
    .delivered++;

  }

  else if(
    status ===
    "cancelled"
  ){

    result[dayName]
    .cancelled++;

  }

});

res.json(result);

} catch(err){

  res.status(500).json({
    error:err.message
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

   const today = new Date();

const monday = new Date(today);

monday.setDate(
  today.getDate() -
  ((today.getDay() + 6) % 7)
);

monday.setHours(0,0,0,0);

const sunday = new Date(monday);

sunday.setDate(
  monday.getDate() + 6
);

sunday.setHours(
  23,59,59,999
);

const orders =
await Order.find({
  createdAt:{
    $gte:monday,
    $lte:sunday
  }
}).sort({
  createdAt:-1
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

// 🔥 Top Products
exports.getTopProducts = async (req, res) => {
  try {

    const orders = await Order.find();

    const products = {};

    orders.forEach(order => {

      (order.items || []).forEach(item => {

        const key = item.productId || item.name;

        if (!products[key]) {
          products[key] = {
            name: item.name,
            sold: 0,
            revenue: 0
          };
        }

    products[key].sold += item.qty || 0;
    products[key].revenue += (item.price || 0) * (item.qty || 0);
   });

    });

    const top = Object.values(products)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    res.json(top);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};