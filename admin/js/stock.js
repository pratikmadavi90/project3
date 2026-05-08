const API = "http://localhost:5000/api/stock";

// 🔹 Stock status class
function getStockClass(p) {
  if (p.stock.quantity === 0) return "out-stock";
  if (p.stock.quantity <= p.stock.lowStockLimit) return "low-stock";
  return "";
}

// 🔹 Stock text (real system)
function getStockText(p) {
  if (p.stock.quantity === 0) return "Out of Stock ❌";
  if (p.stock.quantity <= p.stock.lowStockLimit) return "Low Stock ⚠️";
  return "In Stock ✅";
}

// 🔹 Load products
async function loadProducts() {
  const search = document.getElementById("search").value;

  try {
    // ✅ FIXED FETCH (backticks correct)
    const res = await fetch(`${API}/all?search=${search}`);
    const data = await res.json();

    const table = document.getElementById("stockTable");
    table.innerHTML = "";

    data.forEach(p => {
      table.innerHTML += `
        <tr>
          <td>${p.name}</td>

          <td class="${getStockClass(p)}">
            ${p.stock.quantity}
            <br>
            <small>${getStockText(p)}</small>
          </td>

          <td>
            <input type="number" id="s-${p._id}" value="${p.stock.quantity}">
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
      headers: { "Content-Type": "application/json" },
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