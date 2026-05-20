const API = "https://api.harzo.in/api/users";

let allUsers = [];

// 🔥 Load Users
async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  allUsers = users;
  renderUsers(users);
}

// 🔥 Highlight function
function highlight(text, search) {
  if (!text) return ""; // ✅ safe fix
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi");
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

// 🔥 Render Table
function renderUsers(users, search = "") {
  const tbody = document.getElementById("userTable");
  const count = document.getElementById("userCount");

  tbody.innerHTML = "";

  // 🔥 COUNT UPDATE
  count.innerText = "Total Users: " + users.length;

  users.forEach(user => {
    tbody.innerHTML += `
<tr>
<td>${highlight(user.userId || "-", search)}</td>
<td>${highlight(user.name, search)}</td>
<td>${highlight(user.email, search)}</td>
<td>${highlight(user.phone || "-", search)}</td>
<td>${highlight(user.address || "-", search)}</td>
<td>${highlight(user.city || "-", search)}</td>
<td>${highlight(user.pincode || "-", search)}</td>

<td>${user.isBlocked ? "Blocked" : "Active"}</td>
<td>
<button onclick="toggleBlock('${user._id}')">
${user.isBlocked ? "Unblock" : "Block"}
</button>
<button onclick="deleteUser('${user._id}')">Delete</button>
</td>
</tr>
    `;
  });
}

// 🔥 SEARCH (LIVE)
document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = allUsers.filter(user =>
  (user.userId || "").toLowerCase().includes(value) ||
  (user.name || "").toLowerCase().includes(value) ||
(user.email || "").toLowerCase().includes(value) ||
(user.phone || "").includes(value) ||
(user.address || "").toLowerCase().includes(value) ||  

    (user.city || "").toLowerCase().includes(value) ||     // ✅ ADD
    (user.pincode || "").includes(value)                   // ✅ ADD
  );

  renderUsers(filtered, value);
});

// 🔥 Block / Unblock
async function toggleBlock(id) {
  await fetch(`${API}/block/${id}`, { method: "PUT" });
  loadUsers();
}

// 🔥 Delete
async function deleteUser(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadUsers();
}

// 🚀 Start
loadUsers();