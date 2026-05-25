const DeliveryBoy =
require("../models/DeliveryBoy");

module.exports =
async(req,res,next)=>{

try{

const token =
req.headers.token;

if(!token){

return res.status(401)
.json({
success:false,
message:"No token"
});

}

const boy =
await DeliveryBoy.findOne({
token
});

if(!boy){

return res.status(401)
.json({
success:false,
message:"Invalid token"
});

}

req.deliveryBoy = boy;

next();

}catch(err){

res.status(500)
.json({
success:false,
message:err.message
});

}

};