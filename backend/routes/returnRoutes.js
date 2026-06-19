const express=require("express");

const router=express.Router();
const authMiddleware = require("../middleware/authMiddleware");

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
  authMiddleware,
  getAllReturns
);

router.put(
  "/status/:id",
  authMiddleware,
  updateReturnStatus
);

module.exports=router;