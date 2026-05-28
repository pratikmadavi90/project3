const DeliveryBoy=
require("../models/DeliveryBoy");



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

const data=
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
boy.online=true;

await boy.save();

res.json({

success:true,

deliveryBoy:{
_id:boy._id,
name:boy.name,
mobile:boy.mobile,
deliveryId:boy.deliveryId,
vehicle:boy.vehicle,
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