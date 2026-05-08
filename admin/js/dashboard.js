const API = "https://api.harzo.in/api/dashboard";

// 🔹 Load Stats (Top cards)
async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`);
    const data = await res.json();

    document.getElementById("totalProducts").innerText = data.totalProducts || 0;
    document.getElementById("totalOrders").innerText = data.totalOrders || 0;
    document.getElementById("totalRevenue").innerText = "₹" + (data.revenue || 0);

  } catch (err) {
    console.error("Stats error:", err);
  }
}

// 🔹 Low Stock
async function loadLowStock() {
  try {
    const res = await fetch(`${API}/low-stock`);
    const data = await res.json();

    const list = document.getElementById("lowStock");
    list.innerHTML = "";

    data.forEach(p => {
      list.innerHTML += `<li>${p.name} (${p.stock?.quantity || 0})</li>`;
    });

  } catch (err) {
    console.error("Low stock error:", err);
  }
}

// 🔹 Recent Users
async function loadUsers() {
  try {
    const res = await fetch(`${API}/users`);
    const data = await res.json();

    const list = document.getElementById("recentUsers");
    list.innerHTML = "";

    data.forEach(u => {
      list.innerHTML += `<li>${u.name || "User"} - ${u.phone || ""}</li>`;
    });

  } catch (err) {
    console.error("Users error:", err);
  }
}

// 🔹 Recent Orders
async function loadOrders() {
  try {
    const res = await fetch(`${API}/orders`);
    const data = await res.json();

    const list = document.getElementById("recentOrders");
    list.innerHTML = "";

    data.forEach(o => {
      list.innerHTML += `<li>Order ₹${o.totalAmount || 0}</li>`;
    });

  } catch (err) {
    console.error("Orders error:", err);
  }
}

// 🔹 Dummy Graph (abhi simple, baad me real karenge)
function loadChart() {
  const ctx = document.getElementById("chart");

  new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Orders",
      data: [5, 10, 7, 14, 9, 18, 12],
      backgroundColor: "#00ff88",
      borderColor: "#00ff88",
      borderWidth: 1,
      borderRadius: 6
    }]
  }
});
}

// 🔹 Logout
function logout() {
  localStorage.removeItem("isAdminLoggedIn");
  window.location.href = "/admin/pages/login.html";
}

// 🔹 Load All
loadStats();
loadLowStock();
loadUsers();
loadOrders();
loadChart();