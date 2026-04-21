

document.addEventListener("DOMContentLoaded", () => {
  getProducts();
});

// 🔒 Check login
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("/admin/pages/login.html");
}

// Logout
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.replace("/admin/pages/login.html");
}

// 📊 Chart
const ctx = document.getElementById("chart").getContext("2d");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Orders",
      data: [5, 10, 7, 14, 9, 18, 12],
      backgroundColor: "#00ff88",
      borderRadius: 8
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: { color: "#fff" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#aaa" },
        grid: { display: false }
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.05)" }
      }
    }
  }
});

fetch("http://localhost:5000/api/dashboard")
  .then(res => res.json())
  .then(data => {
    console.log("Dashboard Data:", data);
  });



async function loadDashboard() {
  try {
    const res = await fetch("http://localhost:5000/api/dashboard");
    const data = await res.json();

    console.log("DASHBOARD:", data);

    document.getElementById("totalProducts").innerText = data.totalProducts;

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

loadDashboard();