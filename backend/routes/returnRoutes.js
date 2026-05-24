const express=require("express");

const router=express.Router();

const {

createReturn,
getUserReturns,
getAllReturns,
updateReturnStatus

}=require("../controllers/returnController");


router.post(
"/create",
createReturn
);

router.get(
"/user/:userId",
getUserReturns
);

router.get(
"/all",
getAllReturns
);

router.put(
"/status/:id",
updateReturnStatus
);

module.exports=router;