const mongoose=require("mongoose");

const deliveryBoySchema=
new mongoose.Schema({

name:{
type:String,
required:true
},

mobile:{
type:String,
required:true
},

deliveryId:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

vehicle:{
type:String,
default:"Bike"
},

status:{
type:String,
default:"Active"
},

online:{
type:Boolean,
default:false
},

lastAssignedAt:{
type:Date,
default:null
},

token:{
  type:String,
  default:""
},

fcmToken:{
  type:String,
  default:""
}

},
{
timestamps:true
}

);

module.exports=
mongoose.model(
"DeliveryBoy",
deliveryBoySchema
);