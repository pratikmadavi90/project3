const express = require("express");
const router = express.Router();

const {
  updateStock,
  getLowStock,
  getOutOfStock,
  getProducts
} = require("../controllers/stockController");

router.post("/update", updateStock);
router.get("/low", getLowStock);
router.get("/out", getOutOfStock);
router.get("/all", getProducts);

module.exports = router;