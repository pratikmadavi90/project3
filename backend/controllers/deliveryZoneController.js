const DeliveryZone = require("../models/DeliveryZone");

// ➕ Add Area (with full details)
exports.addZone = async (req, res) => {
  try {
    const {
  name,
  pincode,
  charge,
  time,
  freeDeliveryAbove,
  minimumOrder,
  landmark,
  address
} = req.body;

    const existing = await DeliveryZone.findOne({ name });
    if (existing) {
      return res.json({ success: false, message: "Area already exists" });
    }

const zone = new DeliveryZone({
  name,
  pincode,
  charge,
  time,
  freeDeliveryAbove,
  minimumOrder,
  landmark,
  address,
  isActive: true
});

    await zone.save();

    res.json({ success: true, data: zone });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Get All Areas
exports.getZones = async (req, res) => {
  try {

    const zones = await DeliveryZone
      .find({
        isActive: true
      })
      .sort({ name: 1 });

    res.json({
      success: true,
      data: zones
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};

// ❌ Delete Area
exports.deleteZone = async (req, res) => {
  try {
    await DeliveryZone.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Check Delivery (smart match)
exports.checkDelivery = async (req, res) => {
  try {
    const { pincode, name } = req.body;

    // 👉 Pincode priority
    let zone = await DeliveryZone.findOne({
      pincode,
      isActive: true
    });

console.log("ZONE FROM DB:", zone);

    // 👉 Agar pincode nahi mila → name se check
    if (!zone && name) {
      zone = await DeliveryZone.findOne({
        name: { $regex: new RegExp(name, "i") },
        isActive: true
      });
    }

    if (!zone) {
      return res.json({
        available: false,
        message: "Delivery not available in your area"
      });
    }

 console.log("FREE DELIVERY DB:", zone.freeDeliveryAbove);
console.log("MIN ORDER DB:", zone.minimumOrder);   
console.log("REQUEST BODY:", req.body);
console.log("MATCHED ZONE ID:", zone._id);
console.log("MATCHED ZONE:", JSON.stringify(zone, null, 2));

    res.json({
  available: true,
  area: zone.name,
  deliveryCharge: zone.charge,
  deliveryTime: zone.time,
  freeDeliveryAbove: zone.freeDeliveryAbove,
  minimumOrder: zone.minimumOrder,
  landmark: zone.landmark,
  address: zone.address
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✏️ Update Area
exports.updateZone = async (req, res) => {
  try {
    const zone = await DeliveryZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: zone
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};