/* ==========================================
   HARZO FOOTWEAR INVENTORY
   Admin Panel JavaScript
========================================== */

"use strict";

const API_BASE = "https://api.harzo.in/api";
const INVENTORY_API = `${API_BASE}/footwear-inventory`;

// Agar category route alag hai, to ise apne backend ke hisaab se badalna.
const CATEGORY_API = `${API_BASE}/footwear-categories`;

let currentPage = 1;
const pageSize = 20;
let totalPages = 1;
let inventoryItems = [];
let selectedProduct = null;
let toastTimer = null;
let searchTimer = null;

const $ = (id) => document.getElementById(id);

const elements = {
  totalProducts: $("totalProducts"),
  totalPairs: $("totalPairs"),
  lowStockProducts: $("lowStockProducts"),
  outOfStockProducts: $("outOfStockProducts"),
  totalStockValue: $("totalStockValue"),

  searchInput: $("searchInput"),
  categoryFilter: $("categoryFilter"),
  stockFilter: $("stockFilter"),

  tableBody: $("inventoryTableBody"),
  paginationInfo: $("paginationInfo"),
  currentPage: $("currentPage"),
  prevPage: $("prevPage"),
  nextPage: $("nextPage"),

  stockModal: $("stockModal"),
  stockUpdateForm: $("stockUpdateForm"),
  modalProductId: $("modalProductId"),
  modalProductImage: $("modalProductImage"),
  modalProductName: $("modalProductName"),
  modalProductBrand: $("modalProductBrand"),
  modalProductCategory: $("modalProductCategory"),
  modalSize: $("modalSize"),
  modalCurrentStock: $("modalCurrentStock"),

  stockAction: $("stockAction"),
  stockQuantity: $("stockQuantity"),
  stockReason: $("stockReason"),
  saveStockBtn: $("saveStockBtn"),

  historyModal: $("historyModal"),
  historyTableBody: $("historyTableBody"),

  toast: $("toast"),
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getCategoryName(category) {
  if (!category) return "Uncategorized";

  if (typeof category === "object") {
    return category.name || category.title || "Uncategorized";
  }

  return "Uncategorized";
}

function getCategoryId(category) {
  if (!category) return "";

  if (typeof category === "object") {
    return category._id || category.id || "";
  }

  return category;
}

function getAuthToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    ""
  );
}

function showToast(message, type = "success") {
  if (!elements.toast) return;

  clearTimeout(toastTimer);

  elements.toast.textContent = message;
  elements.toast.className = `toast show ${type}`;

  toastTimer = setTimeout(() => {
    elements.toast.className = "toast";
  }, 3500);
}

// ==========================================
// API REQUEST
// ==========================================

async function apiRequest(url, options = {}) {
  const token = getAuthToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server ne valid JSON response nahi diya.");
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

// ==========================================
// 1. DASHBOARD
// ==========================================

async function loadDashboard() {
  try {
    const response = await apiRequest(
      `${INVENTORY_API}/dashboard`
    );

    const data = response.data || response;

    elements.totalProducts.textContent =
      Number(data.totalProducts || 0).toLocaleString("en-IN");

    elements.totalPairs.textContent =
      Number(data.totalPairs || 0).toLocaleString("en-IN");

    elements.lowStockProducts.textContent =
      Number(data.lowStockProducts || 0).toLocaleString("en-IN");

    elements.outOfStockProducts.textContent =
      Number(data.outOfStockProducts || 0).toLocaleString("en-IN");

    elements.totalStockValue.textContent =
      formatCurrency(data.totalStockValue);
  } catch (error) {
    console.error("Dashboard error:", error);

    showToast(
      `Dashboard load nahi hua: ${error.message}`,
      "error"
    );
  }
}

// ==========================================
// 2. INVENTORY LIST
// ==========================================

async function loadInventory() {
  const search = elements.searchInput.value.trim();
  const stockStatus = elements.stockFilter.value;
  const category = elements.categoryFilter.value;

  elements.tableBody.innerHTML = `
    <tr>
      <td colspan="8" class="loading-cell">
        <i class="fa-solid fa-spinner fa-spin"></i>
        Loading inventory...
      </td>
    </tr>
  `;

  const params = new URLSearchParams({
    page: String(currentPage),
    limit: String(pageSize),
    stockStatus,
  });

  if (search) params.set("search", search);
  if (category) params.set("category", category);

  try {
    const response = await apiRequest(
      `${INVENTORY_API}?${params.toString()}`
    );

    inventoryItems = Array.isArray(response.data)
      ? response.data
      : [];

    const pagination = response.pagination || {};

    totalPages = Math.max(
      1,
      Number(pagination.totalPages) || 1
    );

    renderInventory(inventoryItems);

    const total = Number(pagination.total) || 0;
    const first =
      total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const last = Math.min(currentPage * pageSize, total);

    elements.paginationInfo.textContent =
      `Showing ${first}-${last} of ${total} sizes`;

    elements.currentPage.textContent = String(currentPage);

    elements.prevPage.disabled = currentPage <= 1;
    elements.nextPage.disabled = currentPage >= totalPages;
  } catch (error) {
    console.error("Inventory error:", error);

    elements.tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-cell">
          Inventory load nahi hui.
          ${escapeHTML(error.message)}
        </td>
      </tr>
    `;

    showToast(
      `Inventory load nahi hui: ${error.message}`,
      "error"
    );
  }
}

function getStatusInfo(status) {
  switch (status) {
    case "IN_STOCK":
      return {
        text: "In Stock",
        className: "in-stock",
      };

    case "LOW_STOCK":
      return {
        text: "Low Stock",
        className: "low-stock",
      };

    default:
      return {
        text: "Out of Stock",
        className: "out-of-stock",
      };
  }
}

function renderInventory(items) {
  if (!items.length) {
    elements.tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-cell">
          <i class="fa-solid fa-box-open"></i>
          <br><br>
          Koi footwear inventory nahi mili.
        </td>
      </tr>
    `;

    return;
  }

  elements.tableBody.innerHTML = items
    .map((item, index) => {
      const status = getStatusInfo(item.status);
      const stock = Number(item.stock) || 0;

      const stockClass =
        stock === 0 ? "zero" : stock <= 5 ? "low" : "";

      const categoryId = getCategoryId(item.category);
      const categoryName = getCategoryName(item.category);

      return `
        <tr>
          <td>
            <div class="product-info">
              <img
                src="${escapeHTML(item.image || "")}"
                alt="${escapeHTML(item.name)}"
                loading="lazy"
                onerror="this.style.visibility='hidden'"
              />

              <div>
                <h4>${escapeHTML(item.name)}</h4>
                <p>ID: ${escapeHTML(item.productId)}</p>
              </div>
            </div>
          </td>

          <td>
            <span class="brand-name">
              ${escapeHTML(item.brand || "—")}
            </span>
          </td>

          <td>
            <span
              class="category-name"
              data-category-id="${escapeHTML(categoryId)}"
            >
              ${escapeHTML(categoryName)}
            </span>
          </td>

          <td>
            <span class="size-badge">
              ${escapeHTML(item.size)}
            </span>
          </td>

          <td>
            <span class="stock-number ${stockClass}">
              ${stock} pairs
            </span>
          </td>

          <td>
            <span class="price-value">
              ${formatCurrency(item.sellingPrice)}
            </span>
          </td>

          <td>
            <span class="status-badge ${status.className}">
              ${status.text}
            </span>
          </td>

          <td>
            <button
              type="button"
              class="manage-btn"
              data-action="manage"
              data-index="${index}"
            >
              <i class="fa-solid fa-pen-to-square"></i>
              Manage
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

// ==========================================
// 3. CATEGORY FILTER
// ==========================================

async function loadCategories() {
  try {
    const response = await apiRequest(CATEGORY_API);

    const categories = Array.isArray(response)
      ? response
      : response.data || response.categories || [];

    elements.categoryFilter.innerHTML = `
      <option value="">All Categories</option>
    `;

    categories.forEach((category) => {
      const option = document.createElement("option");

      option.value = category._id || category.id || "";
      option.textContent =
        category.name || category.title || "Category";

      elements.categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.warn(
      "Category filter load nahi hua:",
      error.message
    );
  }
}

// ==========================================
// 4. STOCK UPDATE MODAL
// ==========================================

function openStockModal(item) {
  selectedProduct = item;

  elements.modalProductId.value = item.productId;
  elements.modalProductName.textContent =
    item.name || "Footwear Product";

  elements.modalProductBrand.textContent = item.brand || "—";

  elements.modalProductCategory.textContent =
    getCategoryName(item.category);

  elements.modalProductImage.src = item.image || "";
  elements.modalProductImage.alt = item.name || "Product";

  elements.modalSize.innerHTML = "";

  const productSizes = inventoryItems.filter(
    (product) =>
      String(product.productId) === String(item.productId)
  );

  const uniqueSizes = [
    ...new Set(
      productSizes.map((product) => String(product.size))
    ),
  ];

  if (!uniqueSizes.includes(String(item.size))) {
    uniqueSizes.push(String(item.size));
  }

  uniqueSizes.forEach((size) => {
    const option = document.createElement("option");

    option.value = size;
    option.textContent = `Size ${size}`;

    if (String(size) === String(item.size)) {
      option.selected = true;
    }

    elements.modalSize.appendChild(option);
  });

  elements.stockAction.value = "add";
  elements.stockQuantity.value = "";
  elements.stockReason.value = "";

  updateCurrentStockLabel();

  elements.stockModal.classList.add("show");
}

function closeStockModal() {
  elements.stockModal.classList.remove("show");
  selectedProduct = null;
}

function updateCurrentStockLabel() {
  if (!selectedProduct) return;

  const size = elements.modalSize.value;

  const matchingItem = inventoryItems.find(
    (item) =>
      String(item.productId) ===
        String(selectedProduct.productId) &&
      String(item.size) === String(size)
  );

  const stock = Number(matchingItem?.stock) || 0;

  elements.modalCurrentStock.textContent = `${stock} pairs`;
}

// ==========================================
// 5. SAVE STOCK UPDATE
// ==========================================

async function saveStockUpdate(event) {
  event.preventDefault();

  if (!selectedProduct) {
    showToast("Pehle product select karo.", "error");
    return;
  }

  const productId = elements.modalProductId.value;
  const size = elements.modalSize.value;
  const quantity = Number(elements.stockQuantity.value);
  const action = elements.stockAction.value;
  const reason = elements.stockReason.value.trim();

  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    showToast(
      "Quantity 1 ya usse zyada whole number honi chahiye.",
      "error"
    );
    return;
  }

  if (!size) {
    showToast("Footwear size select karo.", "error");
    return;
  }

  const currentItem = inventoryItems.find(
    (item) =>
      String(item.productId) === String(productId) &&
      String(item.size) === String(size)
  );

  const currentStock = Number(currentItem?.stock) || 0;

  if (action === "reduce" && quantity > currentStock) {
    showToast(
      `Sirf ${currentStock} pairs available hain.`,
      "error"
    );
    return;
  }

  elements.saveStockBtn.disabled = true;
  elements.saveStockBtn.textContent = "Saving...";

  try {
    const response = await apiRequest(
      `${INVENTORY_API}/update-stock`,
      {
        method: "PATCH",
        body: JSON.stringify({
          productId,
          size,
          quantity,
          action,
          reason,
        }),
      }
    );

    showToast(
      response.message || "Stock successfully update ho gaya.",
      "success"
    );

    closeStockModal();

    await Promise.all([
      loadDashboard(),
      loadInventory(),
    ]);
  } catch (error) {
    console.error("Stock update error:", error);

    showToast(
      `Stock update nahi hua: ${error.message}`,
      "error"
    );
  } finally {
    elements.saveStockBtn.disabled = false;
    elements.saveStockBtn.textContent = "Save Changes";
  }
}

// ==========================================
// 6. STOCK HISTORY
// ==========================================

async function loadStockHistory() {
  elements.historyTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="loading-cell">
        <i class="fa-solid fa-spinner fa-spin"></i>
        Loading stock history...
      </td>
    </tr>
  `;

  elements.historyModal.classList.add("show");

  try {
    const response = await apiRequest(
      `${INVENTORY_API}/history?limit=50&page=1`
    );

    const history = Array.isArray(response.data)
      ? response.data
      : [];

    if (!history.length) {
      elements.historyTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-cell">
            Abhi koi stock history available nahi hai.
          </td>
        </tr>
      `;

      return;
    }

    elements.historyTableBody.innerHTML = history
      .map((record) => {
        return `
          <tr>
            <td>${escapeHTML(formatDate(record.createdAt))}</td>
            <td>${escapeHTML(record.productName)}</td>
            <td>${escapeHTML(record.size)}</td>
            <td>${escapeHTML(record.transactionType)}</td>
            <td>${Number(record.quantity) || 0}</td>
            <td>${Number(record.previousStock) || 0}</td>
            <td>${Number(record.newStock) || 0}</td>
          </tr>
        `;
      })
      .join("");
  } catch (error) {
    console.error("History error:", error);

    elements.historyTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-cell">
          History load nahi hui:
          ${escapeHTML(error.message)}
        </td>
      </tr>
    `;
  }
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================

elements.searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    currentPage = 1;
    loadInventory();
  }, 350);
});

elements.stockFilter.addEventListener("change", () => {
  currentPage = 1;
  loadInventory();
});

elements.categoryFilter.addEventListener("change", () => {
  currentPage = 1;
  loadInventory();
});

elements.prevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadInventory();
  }
});

elements.nextPage.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadInventory();
  }
});

elements.tableBody.addEventListener("click", (event) => {
  const button = event.target.closest(
    '[data-action="manage"]'
  );

  if (!button) return;

  const index = Number(button.dataset.index);
  const item = inventoryItems[index];

  if (item) openStockModal(item);
});

elements.stockUpdateForm.addEventListener(
  "submit",
  saveStockUpdate
);

elements.modalSize.addEventListener(
  "change",
  updateCurrentStockLabel
);

$("closeModal").addEventListener("click", closeStockModal);
$("cancelModal").addEventListener("click", closeStockModal);

elements.stockModal.addEventListener("click", (event) => {
  if (event.target === elements.stockModal) {
    closeStockModal();
  }
});

$("historyBtn").addEventListener(
  "click",
  loadStockHistory
);

$("closeHistoryModal").addEventListener("click", () => {
  elements.historyModal.classList.remove("show");
});

elements.historyModal.addEventListener("click", (event) => {
  if (event.target === elements.historyModal) {
    elements.historyModal.classList.remove("show");
  }
});

$("refreshBtn").addEventListener("click", async () => {
  await Promise.all([
    loadDashboard(),
    loadInventory(),
  ]);

  showToast("Inventory refresh request complete.", "success");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeStockModal();
    elements.historyModal.classList.remove("show");
  }
});

// ==========================================
// 8. INITIALIZE
// ==========================================

async function initializeFootwearInventory() {
  await Promise.all([
    loadDashboard(),
    loadInventory(),
    loadCategories(),
  ]);
}

initializeFootwearInventory();