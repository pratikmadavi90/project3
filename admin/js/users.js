const API = "https://api.harzo.in/api/users";

let allUsers = [];

// 🔥 Load Users
async function loadUsers() {

  const token = localStorage.getItem("adminToken");

  const res = await fetch(API, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

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

<td title="${user.userId || '-'}">
${highlight(user.userId || "-", search)}
</td>

<td title="${user.name || '-'}">
${highlight(user.name || "-", search)}
</td>

<td title="${user.email || '-'}">
${highlight(user.email || "-", search)}
</td>

<td title="${user.phone || '-'}">
${highlight(user.phone || "-", search)}
</td>

<td title="${user.address || '-'}">
${highlight(user.address || "-", search)}
</td>

<td title="${user.city || '-'}">
${highlight(user.city || "-", search)}
</td>

<td title="${user.pincode || '-'}">
${highlight(user.pincode || "-", search)}
</td>

<td>
${user.isBlocked ? "Blocked" : "Active"}
</td>

<td>
<button onclick="toggleBlock('${user._id}')">
${user.isBlocked ? "Unblock" : "Block"}
</button>

<button onclick="deleteUser('${user._id}')">
Delete
</button>
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
  const token = localStorage.getItem("adminToken");

  await fetch(`${API}/block/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  loadUsers();
}

async function deleteUser(id) {
  const token = localStorage.getItem("adminToken");

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  loadUsers();
}

// 🚀 Start
loadUsers();