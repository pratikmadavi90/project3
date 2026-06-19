const token = localStorage.getItem("adminToken");

if (!token) {
    window.location.href = "/admin/pages/login.html";
}

const API = "https://api.harzo.in/api/dashboard";
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
};

// 🔹 Load Stats (Top cards)
async function loadStats() {
  try {


 const res = await fetch(`${API}/stats`, {
  headers: headers
});
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
async function loadChart() {

  try {

    const res = await fetch(
      `${API}/weekly-stats`,
      {
        headers
      }
    );

    const data = await res.json();

const dayKeys = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

const labels =
dayKeys.map(
  day => data[day]?.label || day
);

const chartData =
dayKeys.map(
  day => data[day]?.total || 0
);

    const chartData =
    labels.map(day =>
      data[day]?.total || 0
    );

    const ctx =
    document.getElementById("chart");

    const myChart =
    new Chart(ctx, {

      type: "bar",

      data: {

        labels,

        datasets: [{

          label: "Orders",

          data: chartData,

          backgroundColor:
          "#00ff88",

          borderColor:
          "#00ff88",

          borderWidth: 1,

          borderRadius: 6

        }]

      }

    });

    ctx.onclick =
    async function(evt){

      const points =
      myChart.getElementsAtEventForMode(
        evt,
        "nearest",
        { intersect:true },
        true
      );

      if(!points.length)
      return;

      const index =
      points[0].index;

      const day = dayKeys[index];

      const stats =
      data[day];

      alert(
        `${day}\n\n` +
        `Total: ${stats.total}\n` +
        `Pending: ${stats.pending}\n` +
        `Processing: ${stats.processing}\n` +
        `Delivered: ${stats.delivered}\n` +
        `Cancelled: ${stats.cancelled}\n` +
        `Revenue: ₹${stats.revenue}`
      );

    };

  } catch(err){

    console.log(
      "Chart Error",
      err
    );

  }

}

// 🔹 Logout
function logout() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("isAdminLoggedIn");
  localStorage.removeItem("isLoggedIn");

  window.location.href = "/admin/pages/login.html";
}

// 🔹 Load All
loadStats();
loadLowStock();
loadUsers();
loadOrders();
loadChart();