const API = "http://localhost:5000/api/settings";

// 🔹 Load settings
async function loadSettings() {
  const res = await fetch(API);
  const data = await res.json();

  document.getElementById("storeName").value = data.storeName || "";
  document.getElementById("storeEmail").value = data.storeEmail || "";
  document.getElementById("storePhone").value = data.storePhone || "";
  document.getElementById("currency").value = data.currency || "₹";
  document.getElementById("gstNumber").value = data.gstNumber || "";
  document.getElementById("address").value = data.address || "";
}

// 🔹 Save settings
async function saveSettings() {
  const data = {
    storeName: document.getElementById("storeName").value,
    storeEmail: document.getElementById("storeEmail").value,
    storePhone: document.getElementById("storePhone").value,
    currency: document.getElementById("currency").value,
    gstNumber: document.getElementById("gstNumber").value,
    address: document.getElementById("address").value
  };

  await fetch(`${API}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("Saved ✅");
}

loadSettings();