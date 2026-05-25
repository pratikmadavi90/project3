const DeliveryBoy =
require("../models/DeliveryBoy");


// Login

exports.loginDeliveryBoy =
async(req,res)=>{

try{

const {
deliveryId,
password
} = req.body;


const boy =
await DeliveryBoy.findOne({
deliveryId
});


if(!boy){

return res.status(404)
.json({
success:false,
message:"Delivery Boy not found"
});

}


if(
boy.password !== password
){

return res.status(401)
.json({
success:false,
message:"Wrong Password"
});

}


const token =
Math.random()
.toString(36)
.substring(2)
+
Date.now();


boy.token = token;
boy.online = true;

await boy.save();

res.json({

success:true,

token,

deliveryBoy:{
id:boy._id,
name:boy.name,
deliveryId:boy.deliveryId,
mobile:boy.mobile,
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




// Logout

exports.logoutDeliveryBoy =
async(req,res)=>{

try{

const boy =
await DeliveryBoy.findOne({
token:req.headers.token
});

if(!boy){

return res.status(404)
.json({
success:false
});

}

boy.online=false;
boy.token="";

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