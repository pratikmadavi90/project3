const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// ✅ Product model (IMPORTANT - top me hi)
const Product = require("../models/Product");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});



const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "harzo-images-storage",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);

      const fileName = file.originalname
        .replace(ext, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      cb(
        null,
        `${Date.now()}-${fileName}${ext.toLowerCase()}`
      );
    }
  })
});

const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");


// ================= CRUD =================
router.post("/add", upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.put("/update/:id", upload.array("images", 5), updateProduct);


// ================= 🔍 SEARCH =================
router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const category = req.query.category || "";

  try {
    let filter = {
      name: { $regex: q, $options: "i" }
    };

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .limit(20)
      .sort({ createdAt: -1 }); // latest first

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= 🔥 TRENDING =================
router.get("/trending", async (req, res) => {
  try {
    const products = await Product.find()
      .limit(10)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;