const API = "https://api.harzo.in/api/delivery";

// ➕ Add Area
async function addArea() {
  const name = document.getElementById("areaName").value;
  const pincode = document.getElementById("pincode").value;
  const charge = document.getElementById("charge").value;
  const time = document.getElementById("time").value;
  const freeDeliveryAbove = document.getElementById("freeDeliveryAbove").value;
  const minimumOrder = document.getElementById("minimumOrder").value;

  if (!name || !charge) {
    return alert("Area name aur charge required hai");
  }

  await fetch(`${API}/add`, {
    method: "POST",
   headers: {
  "Content-Type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("adminToken")
},

 body: JSON.stringify({
  name,
  pincode,
  charge,
  time,
  freeDeliveryAbove,
  minimumOrder
})
  });

  // Clear form
  document.getElementById("areaName").value = "";
  document.getElementById("pincode").value = "";
  document.getElementById("charge").value = "";
  document.getElementById("time").value = "";
  document.getElementById("freeDeliveryAbove").value = "";
  document.getElementById("minimumOrder").value = "";

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

let editingId = null;

function editArea(id) {
  editingId = id;
  alert("Edit button working. Ab update logic add karna hai.");
}

// 🔄 Auto load
loadAreas();