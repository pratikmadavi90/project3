const mongoose = require("mongoose");
const FootwearProduct = require("../models/FootwearProduct");
const FootwearInventory = require("../models/FootwearInventory");


// 1. Inventory Dashboard
exports.getInventoryDashboard = async (req, res) => {
try {
const products = await FootwearProduct.find()
.select("name stock size sizeStock sellingPrice")
.lean();

let totalPairs = 0;
let lowStockProducts = 0;
let outOfStockProducts = 0;
let totalStockValue = 0;

products.forEach((product) => {
  const sizeStock = product.sizeStock || {};

  // Product ke sabhi sizes ko collect karo.
  const sizes = [
    ...new Set([
      ...(Array.isArray(product.size) ? product.size : []),
      ...Object.keys(sizeStock),
    ]),
  ];

  // Agar size-wise stock available nahi hai,
  // to legacy product.stock ko use karo.
  if (sizes.length === 0) {
    const stock = Math.max(
      0,
      Number(product.stock) || 0
    );

    totalPairs += stock;
    totalStockValue +=
      stock * (Number(product.sellingPrice) || 0);

    if (stock === 0) {
      outOfStockProducts++;
    } else if (stock <= 5) {
      lowStockProducts++;
    }

    return;
  }

  // Har footwear size ka stock alag calculate karo.
  sizes.forEach((size) => {
    const stock = Math.max(
      0,
      Number(sizeStock[size]) || 0
    );

    totalPairs += stock;

    totalStockValue +=
      stock * (Number(product.sellingPrice) || 0);

    if (stock === 0) {
      outOfStockProducts++;
    } else if (stock <= 5) {
      lowStockProducts++;
    }
  });
});

res.json({
  success: true,
  data: {
    totalProducts: products.length,
    totalPairs,
    lowStockProducts,
    outOfStockProducts,
    totalStockValue,
  },
});

} catch (error) {
console.error(
"Footwear inventory dashboard error:",
error
);

res.status(500).json({
  success: false,
  message: "Inventory dashboard load nahi hua.",
});

}
};

// 2. Size-wise Stock List
exports.getInventoryList = async (req, res) => {
  try {
    const {
      search = "",
      stockStatus = "all",
      category = "",
      page = 1,
      limit = 20,
    } = req.query;

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 20)
    );

    const filter = {};

    if (category && mongoose.isValidObjectId(category)) {
      filter.category = category;
    }

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { brand: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const allProducts = await FootwearProduct.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();

    const inventoryItems = [];

    allProducts.forEach((product) => {
      const sizeStock = product.sizeStock || {};
      const sizes = [
        ...new Set([
          ...(Array.isArray(product.size) ? product.size : []),
          ...Object.keys(sizeStock),
        ]),
      ];

      if (sizes.length === 0) {
        sizes.push("N/A");
      }

      sizes.forEach((size) => {
        const stock = Math.max(
          0,
          Number(sizeStock[size]) || 0
        );

        const status =
          stock === 0
            ? "OUT_OF_STOCK"
            : stock <= 5
            ? "LOW_STOCK"
            : "IN_STOCK";

        if (
          stockStatus !== "all" &&
          stockStatus !== status
        ) {
          return;
        }

        inventoryItems.push({
          productId: product._id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          image: product.images?.[0] || "",
          size,
          stock,
          sellingPrice: product.sellingPrice,
          status,
        });
      });
    });

    const total = inventoryItems.length;
    const startIndex = (safePage - 1) * safeLimit;

    res.json({
      success: true,
      data: inventoryItems.slice(
        startIndex,
        startIndex + safeLimit
      ),
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error("Footwear inventory list error:", error);
    res.status(500).json({
      success: false,
      message: "Inventory list load nahi hui.",
    });
  }
};

// 3. Add or Reduce Stock
exports.updateStock = async (req, res) => {
  try {
    const { productId, size, quantity, action, reason } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId dena zaroori hai.",
      });
    }

    const normalizedSize = String(size ?? "").trim();
    const qty = Number(quantity);

    if (
      !normalizedSize ||
      !Number.isSafeInteger(qty) ||
      qty <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid size aur positive whole-number quantity dein.",
      });
    }

    if (!["add", "reduce"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action add ya reduce hona chahiye.",
      });
    }

    const product = await FootwearProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Footwear product nahi mila.",
      });
    }

    const availableSizes = Array.isArray(product.size)
      ? product.size.map((item) => String(item).trim())
      : [];

    if (
      !availableSizes.includes(normalizedSize) &&
      !Object.prototype.hasOwnProperty.call(
        product.sizeStock || {},
        normalizedSize
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Ye size product mein available nahi hai.",
      });
    }

    const oldSizeStock = product.sizeStock || {};
    const previousStock = Math.max(
      0,
      Number(oldSizeStock[normalizedSize]) || 0
    );

    if (action === "reduce" && qty > previousStock) {
      return res.status(400).json({
        success: false,
        message: `Sirf ${previousStock} pairs available hain.`,
      });
    }

    const newStock =
      action === "add"
        ? previousStock + qty
        : previousStock - qty;

    const updatedSizeStock = {
      ...oldSizeStock,
      [normalizedSize]: newStock,
    };

    // Purane size stock ko preserve karte hue total calculate karein.
    const totalStock = Object.values(updatedSizeStock).reduce(
      (sum, value) => sum + Math.max(0, Number(value) || 0),
      0
    );

    product.sizeStock = updatedSizeStock;
    product.stock = totalStock;

    await product.save();

    await FootwearInventory.create({
      product: product._id,
      productName: product.name,
      brand: product.brand,
      size: normalizedSize,
      transactionType: action === "add" ? "STOCK_IN" : "STOCK_OUT",
      quantity: qty,
      previousStock,
      newStock,
      reason: String(reason || "").trim(),
      updatedBy: req.user?._id || null,
      updatedByName: req.user?.name || "Admin",
    });

    res.json({
      success: true,
      message: "Footwear stock successfully update ho gaya.",
      data: {
        productId: product._id,
        productName: product.name,
        size: normalizedSize,
        previousStock,
        newStock,
        totalStock: product.stock,
        sizeStock: product.sizeStock,
      },
    });
  } catch (error) {
    console.error("Footwear stock update error:", error);
    res.status(500).json({
      success: false,
      message: "Stock update karte waqt error aaya.",
    });
  }
};

// 4. Low Stock and Out of Stock
exports.getStockAlerts = async (req, res) => {
  try {
    const threshold = Math.max(
      0,
      Number(req.query.threshold) || 5
    );

    const products = await FootwearProduct.find()
      .populate("category", "name")
      .lean();

    const alerts = [];

    products.forEach((product) => {
      const sizeStock = product.sizeStock || {};
      const sizes = [
        ...new Set([
          ...(Array.isArray(product.size) ? product.size : []),
          ...Object.keys(sizeStock),
        ]),
      ];

      sizes.forEach((size) => {
        const stock = Math.max(
          0,
          Number(sizeStock[size]) || 0
        );

        if (stock <= threshold) {
          alerts.push({
            productId: product._id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            size,
            stock,
            status:
              stock === 0 ? "OUT_OF_STOCK" : "LOW_STOCK",
          });
        }
      });
    });

    res.json({
      success: true,
      totalAlerts: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Footwear stock alerts error:", error);
    res.status(500).json({
      success: false,
      message: "Stock alerts load nahi hue.",
    });
  }
};

// 5. Stock History
exports.getStockHistory = async (req, res) => {
  try {
    const {
      productId,
      size,
      transactionType,
      page = 1,
      limit = 20,
    } = req.query;

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 20)
    );

    const filter = {};

    if (productId) {
      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid productId.",
        });
      }

      filter.product = productId;
    }

    if (size) filter.size = String(size).trim();

    if (transactionType) {
      const allowedTypes = [
        "STOCK_IN",
        "STOCK_OUT",
        "SALE",
        "RETURN",
        "CANCELLATION",
        "ADJUSTMENT",
      ];

      if (!allowedTypes.includes(transactionType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid transactionType.",
        });
      }

      filter.transactionType = transactionType;
    }

    const [history, total] = await Promise.all([
      FootwearInventory.find(filter)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      FootwearInventory.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: history,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error("Footwear stock history error:", error);
    res.status(500).json({
      success: false,
      message: "Stock history load nahi hui.",
    });
  }
};