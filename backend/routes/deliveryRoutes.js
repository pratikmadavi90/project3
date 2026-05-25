const express=
require("express");

const router=
express.Router();

const controller=
require(
"../controllers/deliveryBoyController"
);

router.post(
"/add",
controller.addDeliveryBoy
);

router.get(
"/all",
controller.getAllDeliveryBoys
);

router.delete(
"/delete/:id",
controller.deleteDeliveryBoy
);

router.put(
"/update/:id",
controller.updateDeliveryBoy
);

module.exports=
router;