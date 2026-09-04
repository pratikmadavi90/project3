

const API = "https://api.harzo.in/api/stock";

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
};

// 🔹 Stock status class
function getStockClass(p) {
  const qty = p.stock || 0;
  const limit = 10;

  if (qty === 0) return "out-stock";
  if (qty <= limit) return "low-stock";

  return "";
}

// 🔹 Stock text (real system)
function getStockText(p) {
  const qty = p.stock || 0;
  const limit = 10;

  if (qty === 0) return "Out of Stock ❌";
  if (qty <= limit) return "Low Stock ⚠️";

  return "In Stock ✅";
}

function getExpiryStatus(expiryDate) {
  if (!expiryDate) return "N/A";

  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "🔴 Expired";
  if (diffDays <= 30) return "🟡 Near Expiry";

  return "🟢 Good";
}

// 🔹 Load products
async function loadProducts() {
  const search = document.getElementById("search").value;

  try {
    // ✅ FIXED FETCH (backticks correct)
    const res = await fetch(`${API}/all?search=${search}`, {
  headers
});

    const data = await res.json();

    const table = document.getElementById("stockTable");
    table.innerHTML = "";

    (data || []).forEach(p => {
      table.innerHTML += `
        <tr>
          <td>${p.name}</td>

        <td class="${getStockClass(p)}">
        ${p.stock}
        <br>
       <small>${getStockText(p)}</small>
        </td>

<td>
  ${p.expiryDate
    ? new Date(p.expiryDate).toLocaleDateString("en-IN")
    : "N/A"}
  <br>
  <small>${getExpiryStatus(p.expiryDate)}</small>
</td>

          <td>
            <input type="number" id="s-${p._id}" value="${p.stock}">
            <button onclick="updateStock('${p._id}')">Update</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// 🔹 Update stock (FIXED)
async function updateStock(id) {
  try {
    const quantity = document.getElementById(`s-${id}`).value;

await fetch(`${API}/update`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    id,
    quantity
  })
});

    // 🔄 Reload after update
    loadProducts();

  } catch (err) {
    console.error("Update error:", err);
  }
}

// 🔹 Auto load
loadProducts();