const Return=require("../models/Return");

const generateReturnId=()=>{

return "RT"+Date.now();

};


exports.createReturn=async(req,res)=>{

try{

const {

orderId,
userId,
userName,
mobile,
address,
productId,
productName,
quantity,
reason,
comment,
image

}=req.body;

const newReturn=new Return({

returnId:generateReturnId(),

orderId,
userId,
userName,
mobile,
address,
productId,
productName,
quantity,
reason,
comment,
image

});

await newReturn.save();

res.status(201).json({

success:true,
message:"Return request created",
data:newReturn

});

}catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

};


exports.getUserReturns=async(req,res)=>{

try{

const data=await Return.find({

userId:req.params.userId

}).sort({

createdAt:-1

});

res.json({

success:true,
data

});

}catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

};



exports.getAllReturns=async(req,res)=>{

try{

const data=await Return.find()

.sort({

createdAt:-1

});

res.json({

success:true,
data

});

}catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

};



exports.updateReturnStatus=async(req,res)=>{

try{

const {status,adminNote}=req.body;

const updated=

await Return.findByIdAndUpdate(

req.params.id,

{

status,
adminNote

},

{

new:true

}

);

res.json({

success:true,
message:"Status updated",
data:updated

});

}catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

};