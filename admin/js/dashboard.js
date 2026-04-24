const BASE_URL = "https://api.harzo.in";

document.addEventListener("DOMContentLoaded", () => {

  // 🔒 LOGIN CHECK (sessionStorage use)
  if (localStorage.getItem("isAdminLoggedIn") !== "true") {
  window.location.replace("/login.html");
}
  // Existing functions
  getProducts();
  loadDashboard();

  // 📊 CHART FIX (safe load)
  const canvas = document.getElementById("chart");

  if (canvas) {
    const ctx = canvas.getContext("2d");

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
  }

  // 📡 FETCH DASHBOARD (extra safe)
  fetch(`${BASE_URL}/api/dashboard`)
    .then(res => res.json())
    .then(data => {
      console.log("Dashboard Data:", data);
    })
    .catch(err => console.error("Fetch error:", err));

});


// 🔓 LOGOUT FUNCTION
function logout() {
 localStorage.removeItem("isAdminLoggedIn");
  window.location.replace("/login.html"); // ✅ clean path
}

// 📊 DASHBOARD LOAD FUNCTION
async function loadDashboard() {
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard`);
    const data = await res.json();

    console.log("DASHBOARD:", data);

    // ✅ safe update (error avoid)
    const totalProducts = document.getElementById("totalProducts");

    if (totalProducts) {
      totalProducts.innerText = data.totalProducts || 0;
    }

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

