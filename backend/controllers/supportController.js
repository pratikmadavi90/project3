const Support = require("../models/Support");

exports.createTicket = async (req, res) => {

try {

const {
userId,
name,
phone,
address,
subject,
message
} = req.body;

const ticket =
await Support.create({

userId,
name,
phone,
address,

subject,
message,

status:"open"

});

res.json(ticket);

}catch(err){

console.log(err);

res.status(500).json({
msg:"Error"
});

}

};


exports.getTickets = async(req,res)=>{

try{

const tickets =
await Support.find()
.sort({createdAt:-1});

res.json(tickets);

}catch(err){

console.log(err);

res.status(500).json({
msg:"Error"
});

}

};


exports.replyTicket = async(req,res)=>{

try{

const {id}=req.params;

const {reply}=req.body;

const ticket =
await Support.findByIdAndUpdate(

id,

{
reply,
status:"resolved"
},

{new:true}

);

res.json(ticket);

}catch(err){

console.log(err);

res.status(500).json({
msg:"Error"
});

}

};