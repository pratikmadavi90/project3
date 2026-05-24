const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({

name:{
type:String
},

phone:{
type:String
},

address:{
type:String
},

subject:{
type:String
},

message:{
type:String
},

reply:{
type:String,
default:""
},

status:{
type:String,
default:"open"
}

},
{
timestamps:true
});

module.exports =
mongoose.model(
"Support",
supportSchema
);