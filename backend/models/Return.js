const mongoose=require("mongoose");

const returnSchema=new mongoose.Schema({

returnId:{
type:String,
required:true,
unique:true
},

orderId:{
type:String,
required:true
},

userId:{
type:String,
required:true
},

userName:{
type:String,
default:""
},

mobile:{
type:String,
default:""
},

address:{
type:String,
default:""
},

productId:{
type:String,
required:true
},

productName:{
type:String,
required:true
},

quantity:{
type:Number,
default:1
},

reason:{
type:String,
required:true
},

comment:{
type:String,
default:""
},

image:{
type:String,
default:""
},

status:{
type:String,
enum:[
"Pending",
"Approved",
"Rejected",
"Picked",
"Refunded"
],
default:"Pending"
},

adminNote:{
type:String,
default:""
},

createdAt:{
type:Date,
default:Date.now
}

});

module.exports=mongoose.model(
"Return",
returnSchema
);