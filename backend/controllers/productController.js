const Product = require("../models/Product");

// 👉 AUTO SKU GENERATE
const generateSKU = () => {
  return "SKU-" + Math.floor(100000 + Math.random() * 900000);
};

// 👉 ADD PRODUCT (S3 + MULTIPLE IMAGES)
const addProduct = async (req, res) => {
  try {

    console.log("BODY 👉", req.body);
    console.log("FILES:", req.files);

    // ✅ S3 image URLs (IMPORTANT FIX)
    const imageUrls = req.files && req.files.length > 0
      ? req.files.map(file => file.location)
      : [];

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      subCategory: req.body.subCategory,

      weight: req.body.weight,
      description: req.body.description,

      // 🔥 IMAGE FIX
      images: {
        thumbnail: imageUrls[0] || "",
        gallery: imageUrls
      },

      pricing: {
        mrp: Number(req.body.mrp) || 0,
        sellingPrice: Number(req.body.price) || 0,
      },

      stock: {
        quantity: Number(req.body.stock) || 0,
        inStock: Number(req.body.stock) > 0,
      },

      sku: generateSKU()
    });

    await product.save();

    res.json({ message: "Product added ✅", product });

  } catch (err) {
    console.log("ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};



// 👉 GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const category = req.query.category;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👉 UPDATE PRODUCT (with image fix)
const updateProduct = async (req, res) => {
  try {

    let updateData = {
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      weight: req.body.weight,
      description: req.body.description,

      pricing: {
        mrp: Number(req.body.mrp) || 0,
        sellingPrice: Number(req.body.price) || 0,
      },

      stock: {
        quantity: Number(req.body.stock) || 0,
        inStock: Number(req.body.stock) > 0,
      }
    };

    // 🔥 IMAGE UPDATE FIX
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.location);

      updateData.images = {
        thumbnail: imageUrls[0],
        gallery: imageUrls
      };
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👉 EXPORT
module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
};