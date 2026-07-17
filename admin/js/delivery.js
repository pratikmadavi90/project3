const API = "https://api.harzo.in/api/delivery";

let editingId = null;
window.allAreas = [];

// ➕ Add / ✏️ Update Area
async function addArea() {

  const name = document.getElementById("areaName").value;
  const pincode = document.getElementById("pincode").value;
  const charge = document.getElementById("charge").value;
  const time = document.getElementById("time").value;
  const freeDeliveryAbove = document.getElementById("freeDeliveryAbove").value;
  const minimumOrder = document.getElementById("minimumOrder").value;
  const storeTiming = document.getElementById("storeTiming").value;

  if (!name || !charge) {
    return alert("Area name aur charge required hai");
  }

  const data = {
    name,
    pincode,
    charge,
    time,
    freeDeliveryAbove,
    minimumOrder,
    storeTiming
  };

  // ✏️ UPDATE
  if (editingId) {

   const res = await fetch(`${API}/update/${editingId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("adminToken")
  },
  body: JSON.stringify(data)
});

if (!res.ok) {
  return alert("Update failed");
}

editingId = null;

document.getElementById("saveBtn").innerText = "➕ Add Area";

  } else {

    // ➕ ADD
    await fetch(`${API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("adminToken")
      },
      body: JSON.stringify(data)
    });

  }

  // Clear Form
  document.getElementById("areaName").value = "";
  document.getElementById("pincode").value = "";
  document.getElementById("charge").value = "";
  document.getElementById("time").value = "";
  document.getElementById("freeDeliveryAbove").value = "";
  document.getElementById("minimumOrder").value = "";
  document.getElementById("storeTiming").value = "";

  loadAreas();

}

// 📋 Load Areas
async function loadAreas() {

const res = await fetch(`${API}/all`, {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("adminToken")
  }
});

if (!res.ok) {
throw new Error("Failed to load delivery areas");
}

const result = await res.json();

const data = result.data || [];

window.allAreas = data;

const list = document.getElementById("areaList");

list.innerHTML="";

data.forEach(area=>{

list.innerHTML += `

<tr>

<td>${area.name}</td>

<td>${area.pincode || "-"}</td>

<td>₹${area.charge || 0}</td>

<td>${area.time || "-"}</td>

<td>₹${area.freeDeliveryAbove || 0}</td>

<td>₹${area.minimumOrder || 0}</td>

<td>${area.storeTiming || "24×7"}</td>

<td>

<button onclick="editArea('${area._id}')">
✏️ Edit
</button>

<button onclick="deleteArea('${area._id}')">
❌ Delete
</button>

</td>

</tr>

`;

});

}

// ❌ Delete Area
async function deleteArea(id) {
  if (!confirm("Delete this area?")) return;

 await fetch(`${API}/delete/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("adminToken")
  }
});

  loadAreas();
}

function editArea(id) {

  const area = window.allAreas.find(a => a._id === id);

  if (!area) return;

  editingId = id;

  document.getElementById("areaName").value = area.name || "";
  document.getElementById("pincode").value = area.pincode || "";
  document.getElementById("charge").value = area.charge || "";
  document.getElementById("time").value = area.time || "";
  document.getElementById("freeDeliveryAbove").value = area.freeDeliveryAbove || "";
  document.getElementById("minimumOrder").value = area.minimumOrder || "";
  document.getElementById("storeTiming").value = area.storeTiming || "";
  document.getElementById("saveBtn").innerText = "💾 Update Area";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}
// 🔄 Auto load
loadAreas();