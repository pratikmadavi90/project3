const API = "https://api.harzo.in/api/delivery";

// ➕ Add Area
async function addArea() {
  const name = document.getElementById("areaName").value;
  const pincode = document.getElementById("pincode").value;
  const charge = document.getElementById("charge").value;
  const time = document.getElementById("time").value;

  if (!name || !charge) {
    return alert("Area name aur charge required hai");
  }

  await fetch(`${API}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      pincode,
      charge,
      time
    })
  });

  // Clear form
  document.getElementById("areaName").value = "";
  document.getElementById("pincode").value = "";
  document.getElementById("charge").value = "";
  document.getElementById("time").value = "";

  loadAreas();
}

// 📋 Load Areas
async function loadAreas() {
  const res = await fetch(`${API}/all`);

if (!res.ok) {
  throw new Error("Failed to load delivery areas");
}

const data = await res.json();

  const list = document.getElementById("areaList");
  list.innerHTML = "";

  data.forEach(area => {
    list.innerHTML += `
      <tr>
        <td>${area.name}</td>
        <td>${area.pincode || "-"}</td>
        <td>₹${area.charge || 0}</td>
        <td>${area.time || "-"}</td>
        <td>
          <button onclick="deleteArea('${area._id}')">❌ Delete</button>
        </td>
      </tr>
    `;
  });
}

// ❌ Delete Area
async function deleteArea(id) {
  if (!confirm("Delete this area?")) return;

  await fetch(`${API}/delete/${id}`, {
    method: "DELETE"
  });

  loadAreas();
}

// 🔄 Auto load
loadAreas();